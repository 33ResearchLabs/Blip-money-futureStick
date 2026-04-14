const router = require('express').Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const RSSParser = require('rss-parser');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const VPS_HOST = '35.202.198.103';
const VPS_SSH = `ssh -i ~/.ssh/gcp_vm blipmoney9@${VPS_HOST}`;

function readJSON(f, def) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return def; } }
function writeJSON(f, d) { fs.writeFileSync(f, JSON.stringify(d, null, 2)); }
function uid() { return crypto.randomBytes(8).toString('hex'); }
function nowSec() { return Math.floor(Date.now() / 1000); }

const rssParser = new RSSParser({ timeout: 10000 });

// ── Caches ──
const TWITTER_CACHE = {};
const TWITTER_CACHE_TTL = 15 * 60 * 1000;
const YT_CACHE = {};
const YT_CACHE_TTL = 15 * 60 * 1000;
const TT_CACHE = {};
const TT_CACHE_TTL = 15 * 60 * 1000;

const TRENDING_FILE = path.join(DATA_DIR, 'trending.json');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const VAULT_FILE = path.join(DATA_DIR, 'vault.json');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');

let TRENDING_LAST = 0;
const REMIX_JOBS = {};

// ── Helper: yt-dlp with VPS fallback ──
const YTDLP = process.env.YTDLP_PATH || '/home/blipmoney9/.local/bin/yt-dlp';
function ytdlpExec(cmd) {
  const { execSync } = require('child_process');
  const fullCmd = cmd.replace(/^yt-dlp\b/, YTDLP);
  try {
    return execSync(fullCmd, { timeout: 45000, encoding: 'utf8', env: { ...process.env, PATH: process.env.PATH + ':/home/blipmoney9/.local/bin' } });
  } catch {
    return execSync(
      `ssh -i ~/.ssh/gcp_vm -o ConnectTimeout=10 blipmoney9@${VPS_HOST} "${cmd.replace(/"/g, '\\"')}"`,
      { timeout: 45000, encoding: 'utf8' }
    );
  }
}

// ── Helper: scrape Twitter profile ──
async function scrapeTwitterProfile(handle) {
  const url = `https://x.com/${handle}`;
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    timeout: 15000,
    redirect: 'follow',
  });
  if (!r.ok) throw new Error(`X returned ${r.status}`);
  const html = await r.text();

  const ogDesc = (/<meta\s+(?:property|name)=["'](?:og:)?description["']\s+content=["']([^"']*?)["']/i.exec(html) || [])[1] || '';
  const ogImage = (/<meta\s+(?:property|name)=["'](?:og:)?image["']\s+content=["']([^"']*?)["']/i.exec(html) || [])[1] || '';
  const ogTitle = (/<meta\s+(?:property|name)=["'](?:og:)?title["']\s+content=["']([^"']*?)["']/i.exec(html) || [])[1] || '';

  const followersMatch = ogDesc.match(/([\d,]+(?:\.\d+)?[KkMm]?)\s*Followers/i);
  const followingMatch = ogDesc.match(/([\d,]+(?:\.\d+)?[KkMm]?)\s*Following/i);

  function parseCount(s) {
    if (!s) return 0;
    s = s.replace(/,/g, '');
    const m = s.match(/([\d.]+)\s*([KkMm]?)/);
    if (!m) return 0;
    let n = parseFloat(m[1]);
    if (/[Kk]/.test(m[2])) n *= 1000;
    if (/[Mm]/.test(m[2])) n *= 1000000;
    return Math.round(n);
  }

  const followers = parseCount(followersMatch ? followersMatch[1] : null);
  const following = parseCount(followingMatch ? followingMatch[1] : null);

  let bio = ogDesc.replace(/[\d,]+(?:\.\d+)?[KkMm]?\s*Followers?,?\s*[\d,]+(?:\.\d+)?[KkMm]?\s*Following[.,]?\s*/i, '').trim();

  const nameMatch = ogTitle.match(/^(.+?)\s*\(@/);
  const name = nameMatch ? nameMatch[1].trim() : handle;
  const verified = /verified/i.test(html) || ogTitle.includes('\u2713');

  return { handle, name, bio, avatar: ogImage, followers, following, verified };
}

// ── Helper: get Twitter posts via yt-dlp ──
async function getTwitterPosts(handle) {
  const { execSync } = require('child_process');
  const posts = [];
  try {
    const result = execSync(
      `${YTDLP} --flat-playlist -j --playlist-items 1-12 "https://x.com/${handle}"`,
      { timeout: 30000, encoding: 'utf8', env: { ...process.env, PATH: process.env.PATH + ':/home/blipmoney9/.local/bin' } }
    );
    const lines = result.trim().split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const d = JSON.parse(line);
        posts.push({
          id: d.id || d.display_id,
          caption: (d.title || d.description || '').slice(0, 280),
          thumb: d.thumbnail || d.thumbnails?.[0]?.url || '',
          likes: d.like_count || 0,
          comments: d.comment_count || d.repost_count || 0,
          video_view_count: d.view_count || 0,
          taken_at: d.timestamp || (d.upload_date ? Math.floor(new Date(
            d.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
          ).getTime() / 1000) : 0),
          is_video: true,
          retweets: d.repost_count || 0,
          url: d.webpage_url || d.url || '',
        });
      } catch {}
    }
  } catch (e) {
    try {
      const result = execSync(
        `ssh -i ~/.ssh/gcp_vm -o ConnectTimeout=10 blipmoney9@${VPS_HOST} "yt-dlp --flat-playlist -j --playlist-items 1-12 'https://x.com/${handle.replace(/'/g, "'\\''")}'"`
        , { timeout: 30000, encoding: 'utf8' }
      );
      const lines = result.trim().split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const d = JSON.parse(line);
          posts.push({
            id: d.id || d.display_id,
            caption: (d.title || d.description || '').slice(0, 280),
            thumb: d.thumbnail || d.thumbnails?.[0]?.url || '',
            likes: d.like_count || 0,
            comments: d.comment_count || d.repost_count || 0,
            video_view_count: d.view_count || 0,
            taken_at: d.timestamp || 0,
            is_video: true,
            retweets: d.repost_count || 0,
            url: d.webpage_url || d.url || '',
          });
        } catch {}
      }
    } catch {}
  }
  return posts;
}

// ── Helper: fetchTrending ──
async function fetchTrending() {
  const items = [];

  // 1. Reddit trending across multiple subs
  const trendSubs = [
    { sub: 'popular', cat: 'general' },
    { sub: 'videos', cat: 'video' },
    { sub: 'technology', cat: 'tech' },
    { sub: 'worldnews', cat: 'world' },
    { sub: 'cryptocurrency', cat: 'crypto' },
    { sub: 'artificial', cat: 'ai' },
    { sub: 'music', cat: 'entertainment' },
    { sub: 'sports', cat: 'sports' },
    { sub: 'gaming', cat: 'gaming' },
  ];
  const redditResults = await Promise.allSettled(
    trendSubs.map(async ({ sub, cat }) => {
      const r = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=25`, {
        headers: { 'User-Agent': 'SocialRater/2.0' }, timeout: 10000
      });
      const d = await r.json();
      return (d.data?.children || []).filter(c => !c.data?.stickied).map(c => ({
        id: uid(),
        title: c.data?.title || '',
        url: c.data?.url || `https://reddit.com${c.data?.permalink}`,
        source: `r/${sub}`,
        category: cat,
        published_at: (c.data?.created_utc || 0) * 1000,
        fetched_at: Date.now(),
        ups: c.data?.ups || 0,
        comments: c.data?.num_comments || 0,
        thumb: c.data?.thumbnail && c.data.thumbnail.startsWith('http') ? c.data.thumbnail : '',
        has_video: !!c.data?.is_video || /youtu|vimeo|tiktok|twitter.*video/i.test(c.data?.url || ''),
        video_url: c.data?.is_video ? (c.data?.media?.reddit_video?.fallback_url || '') : (/youtu|vimeo|tiktok/i.test(c.data?.url || '') ? c.data?.url : ''),
        permalink: `https://reddit.com${c.data?.permalink}`,
        domain: c.data?.domain || '',
        nsfw: c.data?.over_18 || false,
      }));
    })
  );
  redditResults.forEach(r => { if (r.status === 'fulfilled') items.push(...r.value); });

  // 2. HN front page
  try {
    const r = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=40', { timeout: 10000 });
    const d = await r.json();
    (d.hits || []).forEach(h => {
      items.push({
        id: uid(),
        title: h.title || '',
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        source: 'Hacker News',
        category: 'tech',
        published_at: h.created_at ? new Date(h.created_at).getTime() : Date.now(),
        fetched_at: Date.now(),
        ups: h.points || 0,
        comments: h.num_comments || 0,
        thumb: '',
        has_video: false,
        video_url: '',
        permalink: `https://news.ycombinator.com/item?id=${h.objectID}`,
        domain: h.url ? new URL(h.url).hostname : 'news.ycombinator.com',
        nsfw: false,
      });
    });
  } catch {}

  // 3. YouTube trending via yt-dlp
  try {
    const { execSync } = require('child_process');
    let raw;
    try {
      raw = execSync(YTDLP + ' --flat-playlist -j --playlist-items 1-20 "https://www.youtube.com/feed/trending?bp=6gQJRkVleHBsb3Jl"', { timeout: 30000, encoding: 'utf8', env: { ...process.env, PATH: process.env.PATH + ':/home/blipmoney9/.local/bin' } });
    } catch {
      raw = execSync(`ssh -i ~/.ssh/gcp_vm -o ConnectTimeout=10 blipmoney9@${VPS_HOST} "yt-dlp --flat-playlist -j --playlist-items 1-20 'https://www.youtube.com/feed/trending'"`, { timeout: 30000, encoding: 'utf8' });
    }
    const lines = raw.trim().split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const d = JSON.parse(line);
        items.push({
          id: uid(),
          title: d.title || d.fulltitle || '',
          url: d.webpage_url || d.url || `https://www.youtube.com/watch?v=${d.id}`,
          source: 'YouTube Trending',
          category: 'video',
          published_at: d.timestamp ? d.timestamp * 1000 : (d.upload_date ? new Date(d.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).getTime() : Date.now()),
          fetched_at: Date.now(),
          ups: d.like_count || 0,
          comments: d.comment_count || 0,
          views: d.view_count || 0,
          thumb: d.thumbnail || (d.thumbnails ? (d.thumbnails[d.thumbnails.length - 1] || {}).url : '') || '',
          has_video: true,
          video_url: d.webpage_url || d.url || '',
          duration: d.duration || 0,
          channel: d.channel || d.uploader || '',
          domain: 'youtube.com',
          nsfw: false,
        });
      } catch {}
    }
  } catch {}

  // Score & rank
  const now = Date.now();
  items.forEach(it => {
    const ageH = Math.max(1, (now - (it.published_at || now)) / 3600000);
    const velocity = ((it.ups || 0) + (it.comments || 0) * 2 + (it.views || 0) / 1000) / ageH;
    it.trend_score = Math.min(100, Math.round(Math.log2(velocity + 1) * 10));
    it.velocity = Math.round(velocity);
  });

  // Filter NSFW, sort by trend_score
  const clean = items.filter(i => !i.nsfw);
  clean.sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0));

  // Dedupe
  const seen = new Set();
  const deduped = clean.filter(it => {
    const key = (it.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  writeJSON(TRENDING_FILE, { items: deduped, updated_at: Date.now() });
  TRENDING_LAST = Date.now();
  return deduped;
}

// ── News feeds config — viral + fresh sources ──
const NEWS_FEEDS = [
  // Tech / Viral
  { url: 'https://feeds.feedburner.com/TechCrunch/', type: 'tech', source: 'TechCrunch' },
  { url: 'https://www.theverge.com/rss/index.xml', type: 'tech', source: 'The Verge' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', type: 'tech', source: 'Ars Technica' },
  { url: 'https://mashable.com/feed/', type: 'tech', source: 'Mashable' },
  { url: 'https://www.engadget.com/rss.xml', type: 'tech', source: 'Engadget' },
  { url: 'https://www.wired.com/feed/rss', type: 'tech', source: 'Wired' },
  // Crypto
  { url: 'https://cointelegraph.com/rss', type: 'crypto', source: 'CoinTelegraph' },
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', type: 'crypto', source: 'CoinDesk' },
  { url: 'https://decrypt.co/feed', type: 'crypto', source: 'Decrypt' },
  { url: 'https://cryptoslate.com/feed/', type: 'crypto', source: 'CryptoSlate' },
  // AI
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', type: 'ai', source: 'TC AI' },
  { url: 'https://venturebeat.com/category/ai/feed/', type: 'ai', source: 'VentureBeat AI' },
  // Business / Finance
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', type: 'business', source: 'BBC Business' },
  { url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html', type: 'business', source: 'CNBC' },
  // Culture / Viral
  { url: 'https://www.buzzfeed.com/tech.xml', type: 'culture', source: 'BuzzFeed Tech' },
  { url: 'https://feeds.npr.org/1001/rss.xml', type: 'world', source: 'NPR' },
];
const REDDIT_NEWS_SUBS = [
  // Hot subs with high viral potential
  { sub: 'technology', type: 'tech', sort: 'top', t: 'day' },
  { sub: 'Futurology', type: 'tech', sort: 'top', t: 'day' },
  { sub: 'cryptocurrency', type: 'crypto', sort: 'top', t: 'day' },
  { sub: 'Bitcoin', type: 'crypto', sort: 'top', t: 'day' },
  { sub: 'artificial', type: 'ai', sort: 'top', t: 'day' },
  { sub: 'singularity', type: 'ai', sort: 'top', t: 'day' },
  { sub: 'OpenAI', type: 'ai', sort: 'hot' },
  { sub: 'business', type: 'business', sort: 'top', t: 'day' },
  { sub: 'worldnews', type: 'world', sort: 'top', t: 'day' },
  { sub: 'UpliftingNews', type: 'world', sort: 'top', t: 'day' },
  { sub: 'nottheonion', type: 'culture', sort: 'top', t: 'day' },
  { sub: 'interestingasfuck', type: 'culture', sort: 'top', t: 'day' },
];

// ── Helper: fetchAllNews ──
async function fetchAllNews() {
  const items = [];

  // RSS feeds — only last 48h, extract image from content if no enclosure
  const cutoff48h = Date.now() - 48 * 3600000;
  const extractImage = (it) => {
    if (it.enclosure?.url) return it.enclosure.url;
    if (it['media:thumbnail']?.['$']?.url) return it['media:thumbnail']['$'].url;
    if (it['media:content']?.['$']?.url) return it['media:content']['$'].url;
    const html = it['content:encoded'] || it.content || '';
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : '';
  };
  const rssResults = await Promise.allSettled(
    NEWS_FEEDS.map(async feed => {
      try {
        const parsed = await rssParser.parseURL(feed.url);
        return (parsed.items || [])
          .map(it => {
            const pubMs = it.pubDate ? new Date(it.pubDate).getTime() : Date.now();
            const ageHours = Math.max(0.5, (Date.now() - pubMs) / 3600000);
            // Fresher = higher base score
            const freshScore = ageHours < 2 ? 90 : ageHours < 6 ? 75 : ageHours < 12 ? 60 : ageHours < 24 ? 45 : 30;
            return {
              id: uid(),
              title: it.title || '',
              url: it.link || '',
              source: feed.source,
              source_type: feed.type,
              published_at: pubMs,
              fetched_at: Date.now(),
              description: (it.contentSnippet || it.content || '').slice(0, 300),
              image: extractImage(it),
              score: freshScore,
            };
          })
          .filter(i => i.published_at >= cutoff48h) // only last 48h
          .slice(0, 20);
      } catch { return []; }
    })
  );
  rssResults.forEach(r => { if (r.status === 'fulfilled') items.push(...r.value); });

  // Reddit — top posts of the day from viral subs
  const redditResults = await Promise.allSettled(
    REDDIT_NEWS_SUBS.map(async ({ sub, type, sort = 'top', t = 'day' }) => {
      try {
        const url = `https://www.reddit.com/r/${sub}/${sort}.json?limit=15${t ? '&t=' + t : ''}`;
        const r = await fetch(url, {
          headers: { 'User-Agent': 'SocialRater/2.0' }, timeout: 10000
        });
        const d = await r.json();
        return (d.data?.children || [])
          .filter(c => !c.data?.stickied && c.data?.ups > 100)
          .slice(0, 12)
          .map(c => {
            const pubMs = (c.data?.created_utc || 0) * 1000;
            const ageHours = Math.max(0.5, (Date.now() - pubMs) / 3600000);
            const ups = c.data?.ups || 0;
            const comments = c.data?.num_comments || 0;
            // Velocity: engagement per hour since post
            const velocity = (ups + comments * 2) / ageHours;
            // Viral score 0-100 based on velocity (log scale)
            const score = Math.min(100, Math.round(Math.log10(velocity + 1) * 25));
            // Get best preview image available
            let image = '';
            const preview = c.data?.preview?.images?.[0];
            if (preview?.source?.url) image = preview.source.url.replace(/&amp;/g, '&');
            else if (c.data?.thumbnail && c.data.thumbnail.startsWith('http')) image = c.data.thumbnail;
            else if (c.data?.url_overridden_by_dest && /\.(jpg|png|jpeg|webp)/i.test(c.data.url_overridden_by_dest)) image = c.data.url_overridden_by_dest;
            return {
              id: uid(),
              title: c.data?.title || '',
              url: c.data?.url || `https://reddit.com${c.data?.permalink}`,
              source: `r/${sub}`,
              source_type: type,
              published_at: pubMs,
              fetched_at: Date.now(),
              ups, comments,
              velocity: Math.round(velocity),
              score,
              image,
            };
          });
      } catch { return []; }
    })
  );
  redditResults.forEach(r => { if (r.status === 'fulfilled') items.push(...r.value); });

  // HN
  try {
    const r = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=30', { timeout: 10000 });
    const d = await r.json();
    (d.hits || []).forEach(h => {
      items.push({
        id: uid(),
        title: h.title || '',
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        source: 'Hacker News',
        source_type: 'tech',
        published_at: h.created_at ? new Date(h.created_at).getTime() : Date.now(),
        fetched_at: Date.now(),
        ups: h.points || 0,
        comments: h.num_comments || 0,
        score: Math.min(100, Math.floor((h.points || 0) / 10 + 30)),
      });
    });
  } catch {}

  // Drop items older than 48h (keep feed fresh)
  const cutoff = Date.now() - 48 * 3600000;
  const fresh = items.filter(i => (i.published_at || 0) >= cutoff);
  // Sort by score desc (higher = more viral/fresher)
  fresh.sort((a, b) => (b.score || 0) - (a.score || 0));
  // Dedupe
  const seen = new Set();
  const deduped = fresh.filter(it => {
    const key = (it.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  writeJSON(NEWS_FILE, { items: deduped, updated_at: Date.now() });
  return deduped;
}

// ============ ROUTES ============

// GET /dl/proxy
router.get('/proxy', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.status(400).send('no url');
  try {
    const r = await fetch(u, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Referer': new URL(u).origin },
      timeout: 15000
    });
    const ct = r.headers.get('content-type') || 'image/jpeg';
    res.set('Content-Type', ct);
    res.set('Cache-Control', 'public, max-age=86400');
    r.body.pipe(res);
  } catch (e) {
    res.status(502).send('proxy error');
  }
});

// GET /dl/og
router.get('/og', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.json({ ok: false });
  try {
    const r = await fetch(u, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      timeout: 10000
    });
    const html = await r.text();
    const og = {};
    const metaRe = /<meta\s+(?:property|name)=["']og:(\w+)["']\s+content=["']([^"']+)["']/gi;
    let m;
    while ((m = metaRe.exec(html)) !== null) {
      og[m[1]] = m[2];
    }
    const tw = /<meta\s+(?:property|name)=["']twitter:image["']\s+content=["']([^"']+)["']/i.exec(html);
    if (!og.image && tw) og.image = tw[1];
    res.json({ ok: true, ...og });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// GET /dl/insta
router.get('/insta', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.json({ ok: false });
  try {
    const r = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${u}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        'x-ig-app-id': '936619743392459'
      },
      timeout: 10000
    });
    if (!r.ok) {
      const r2 = await fetch(`https://www.instagram.com/${u}/`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
      });
      const html = await r2.text();
      const desc = (/<meta\s+(?:property|name)=["'](?:og:)?description["']\s+content=["']([^"']+)["']/i.exec(html) || [])[1] || '';
      const followers = (desc.match(/([\d,.]+[KkMm]?)\s*Followers/i) || [])[1] || '?';
      return res.json({
        ok: true, handle: u, followers, following: '?', posts: '?',
        bio: desc.slice(0, 200), avatar: '', recent: []
      });
    }
    const d = await r.json();
    const user = d.data?.user || {};
    res.json({
      ok: true,
      handle: u,
      followers: user.edge_followed_by?.count || 0,
      following: user.edge_follow?.count || 0,
      posts: user.edge_owner_to_timeline_media?.count || 0,
      bio: user.biography || '',
      avatar: user.profile_pic_url_hd || user.profile_pic_url || '',
      full_name: user.full_name || '',
      is_verified: user.is_verified || false,
      recent: (user.edge_owner_to_timeline_media?.edges || []).slice(0, 12).map(e => ({
        id: e.node?.shortcode,
        thumb: e.node?.thumbnail_src || e.node?.display_url,
        likes: e.node?.edge_liked_by?.count || 0,
        comments: e.node?.edge_media_to_comment?.count || 0,
        caption: (e.node?.edge_media_to_caption?.edges?.[0]?.node?.text || '').slice(0, 120),
        ts: e.node?.taken_at_timestamp || 0,
        is_video: e.node?.is_video || false,
        views: e.node?.video_view_count || 0,
      }))
    });
  } catch (e) {
    res.json({ ok: false, error: e.message, handle: u });
  }
});

// GET /dl/twitter
router.get('/twitter', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.json({ ok: false, error: 'no handle' });
  const handle = u.replace(/^@/, '').trim();
  const force = req.query.force === '1';

  const cached = TWITTER_CACHE[handle];
  if (!force && cached && (Date.now() - cached.at) < TWITTER_CACHE_TTL) {
    return res.json({ ...cached.data, stale: true, stale_age: Math.floor((Date.now() - cached.at) / 1000) });
  }

  try {
    const [profile, posts] = await Promise.all([
      scrapeTwitterProfile(handle),
      getTwitterPosts(handle),
    ]);

    const result = {
      ok: true,
      handle,
      name: profile.name,
      bio: profile.bio,
      avatar: profile.avatar,
      followers: profile.followers,
      following: profile.following,
      verified: profile.verified,
      posts_count: posts.length,
      posts,
      platform: 'twitter',
      note: posts.length === 0
        ? 'X profile scraped (no OAuth). Post data requires media tweets or X API access.'
        : 'X profile scraped (no OAuth). Only media tweets visible via yt-dlp.',
    };

    TWITTER_CACHE[handle] = { data: result, at: Date.now() };
    res.json(result);
  } catch (e) {
    res.json({ ok: false, error: e.message, handle });
  }
});

// GET /dl/youtube
router.get('/youtube', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.json({ ok: false, error: 'no handle' });
  const handle = u.replace(/^@/, '').trim();
  const force = req.query.force === '1';

  const cached = YT_CACHE[handle];
  if (!force && cached && (Date.now() - cached.at) < YT_CACHE_TTL) {
    return res.json({ ...cached.data, stale: true, stale_age: Math.floor((Date.now() - cached.at) / 1000) });
  }

  try {
    const channelUrl = handle.startsWith('UC') ? `https://www.youtube.com/channel/${handle}` : `https://www.youtube.com/@${handle}`;

    const raw = ytdlpExec(`yt-dlp --flat-playlist -j --playlist-items 1-12 "${channelUrl}/videos"`);
    const lines = raw.trim().split('\n').filter(Boolean);

    let channelName = handle, avatar = '', subscribers = 0, channelDesc = '';
    const posts = [];

    for (const line of lines) {
      try {
        const d = JSON.parse(line);
        if (!posts.length) {
          channelName = d.channel || d.uploader || handle;
          avatar = d.channel_url ? '' : '';
          subscribers = d.channel_follower_count || 0;
        }
        posts.push({
          id: d.id || d.display_id,
          caption: (d.title || d.fulltitle || '').slice(0, 200),
          thumb: d.thumbnails ? (d.thumbnails.find(t => t.width >= 300) || d.thumbnails[d.thumbnails.length - 1] || {}).url || '' : (d.thumbnail || ''),
          likes: d.like_count || 0,
          comments: d.comment_count || 0,
          video_view_count: d.view_count || 0,
          play_count: d.view_count || 0,
          taken_at: d.timestamp || (d.upload_date ? Math.floor(new Date(
            d.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
          ).getTime() / 1000) : 0),
          is_video: true,
          duration: d.duration || 0,
          url: d.webpage_url || d.url || `https://www.youtube.com/watch?v=${d.id}`,
        });
      } catch {}
    }

    try {
      const { execSync } = require('child_process');
      const meta = execSync(`${YTDLP} --dump-json --playlist-items 1 "${channelUrl}/videos"`, { timeout: 30000, encoding: 'utf8', env: { ...process.env, PATH: process.env.PATH + ':/home/blipmoney9/.local/bin' } });
      const md = JSON.parse(meta);
      if (md.channel_follower_count) subscribers = md.channel_follower_count;
      if (md.channel) channelName = md.channel;
      if (md.description) channelDesc = md.description.slice(0, 300);
      if (md.uploader_url) avatar = '';
    } catch {}

    const result = {
      ok: true,
      handle,
      name: channelName,
      bio: channelDesc,
      avatar,
      followers: subscribers,
      following: 0,
      verified: false,
      posts_count: posts.length,
      posts,
      platform: 'youtube',
      note: 'YouTube data via yt-dlp (no OAuth). Subscriber count may be approximate.',
    };

    YT_CACHE[handle] = { data: result, at: Date.now() };
    res.json(result);
  } catch (e) {
    res.json({ ok: false, error: e.message, handle });
  }
});

// GET /dl/tiktok
router.get('/tiktok', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.json({ ok: false, error: 'no handle' });
  const handle = u.replace(/^@/, '').trim();
  const force = req.query.force === '1';

  const cached = TT_CACHE[handle];
  if (!force && cached && (Date.now() - cached.at) < TT_CACHE_TTL) {
    return res.json({ ...cached.data, stale: true, stale_age: Math.floor((Date.now() - cached.at) / 1000) });
  }

  try {
    const raw = ytdlpExec(`yt-dlp --flat-playlist -j --playlist-items 1-12 "https://www.tiktok.com/@${handle}"`);
    const lines = raw.trim().split('\n').filter(Boolean);

    let name = handle, avatar = '', followers = 0, bio = '';
    const posts = [];

    for (const line of lines) {
      try {
        const d = JSON.parse(line);
        if (!posts.length) {
          name = d.uploader || d.creator || handle;
          followers = d.channel_follower_count || 0;
        }
        posts.push({
          id: d.id || d.display_id,
          caption: (d.title || d.description || d.fulltitle || '').slice(0, 200),
          thumb: d.thumbnail || (d.thumbnails ? d.thumbnails[0]?.url : '') || '',
          likes: d.like_count || 0,
          comments: d.comment_count || 0,
          video_view_count: d.view_count || 0,
          play_count: d.view_count || 0,
          taken_at: d.timestamp || (d.upload_date ? Math.floor(new Date(
            d.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
          ).getTime() / 1000) : 0),
          is_video: true,
          duration: d.duration || 0,
          repost_count: d.repost_count || 0,
          url: d.webpage_url || d.url || '',
        });
      } catch {}
    }

    const result = {
      ok: true,
      handle,
      name,
      bio,
      avatar,
      followers,
      following: 0,
      verified: false,
      posts_count: posts.length,
      posts,
      platform: 'tiktok',
      note: 'TikTok data via yt-dlp (no OAuth).',
    };

    TT_CACHE[handle] = { data: result, at: Date.now() };
    res.json(result);
  } catch (e) {
    res.json({ ok: false, error: e.message, handle });
  }
});

// GET /dl/resolve
router.get('/resolve', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ ok: false, error: 'no url' });
  try {
    const { execSync } = require('child_process');
    let result;
    try {
      result = execSync(`${YTDLP} -j --no-download "${url}"`, { timeout: 30000, encoding: 'utf8', env: { ...process.env, PATH: process.env.PATH + ':/home/blipmoney9/.local/bin' } });
    } catch {
      result = execSync(`ssh -i ~/.ssh/gcp_vm -o ConnectTimeout=10 blipmoney9@${VPS_HOST} "yt-dlp -j --no-download '${url.replace(/'/g, "'\\''")}'"`
        , { timeout: 30000, encoding: 'utf8' });
    }
    const d = JSON.parse(result);
    res.json({
      ok: true,
      title: d.title,
      duration: d.duration,
      thumbnail: d.thumbnail,
      uploader: d.uploader,
      view_count: d.view_count,
      like_count: d.like_count,
      formats: (d.formats || []).filter(f => f.ext === 'mp4' && f.vcodec !== 'none').slice(-3).map(f => ({
        url: f.url,
        quality: f.format_note || f.height + 'p',
        filesize: f.filesize,
      })),
      best_url: d.url || (d.formats || []).pop()?.url,
    });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// GET /dl/trending
router.get('/trending', (req, res) => {
  const data = readJSON(TRENDING_FILE, { items: [] });
  let items = data.items || [];
  const cat = req.query.cat;
  if (cat && cat !== 'all') items = items.filter(i => i.category === cat);
  const range = req.query.range || 'all';
  const now = Date.now();
  if (range === '24h') items = items.filter(i => (i.published_at || 0) > now - 86400000);
  else if (range === '7d') items = items.filter(i => (i.published_at || 0) > now - 7 * 86400000);
  else if (range === '30d') items = items.filter(i => (i.published_at || 0) > now - 30 * 86400000);
  const videoOnly = req.query.video === '1';
  if (videoOnly) items = items.filter(i => i.has_video || /youtu|tiktok|vimeo|v\.redd\.it|twitch/i.test(i.url || '') || /youtu|tiktok|vimeo|v\.redd\.it/i.test(i.video_url || ''));
  const limit = parseInt(req.query.limit) || 200;
  res.json({ ok: true, items: items.slice(0, limit), total: items.length, updated_at: data.updated_at || 0 });
});

// POST /dl/trending/refresh
router.post('/trending/refresh', async (req, res) => {
  try {
    const items = await fetchTrending();
    res.json({ ok: true, count: items.length });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// GET /dl/news/list
router.get('/news/list', (req, res) => {
  const data = readJSON(NEWS_FILE, { items: [] });
  let items = data.items || [];
  const type = req.query.type;
  if (type && type !== 'all') items = items.filter(i => i.source_type === type);
  const since = req.query.since ? parseInt(req.query.since) : 0;
  if (since) items = items.filter(i => (i.published_at || 0) >= since);
  // Sort by published_at DESC (newest first)
  items = items.slice().sort((a, b) => (b.published_at || 0) - (a.published_at || 0));
  const limit = parseInt(req.query.limit) || 100;
  res.json({ ok: true, items: items.slice(0, limit), total: items.length });
});

// POST /dl/news/refresh
router.post('/news/refresh', async (req, res) => {
  try {
    const items = await fetchAllNews();
    res.json({ ok: true, count: items.length });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// POST /dl/news/explode
router.post('/news/explode', async (req, res) => {
  const { title, url, description } = req.body;
  res.json({
    ok: true,
    title: title || '',
    variations: [
      { platform: 'twitter', text: `\ud83d\udd25 ${title}\n\nRead more: ${url}\n\n#trending #news`, char_count: 0 },
      { platform: 'instagram', text: `${title}\n\n${(description || '').slice(0, 200)}\n\n.\n.\n.\n#news #trending #viral`, char_count: 0 },
      { platform: 'tiktok', text: `${title} \ud83d\udd25 #fyp #trending #news`, char_count: 0 },
      { platform: 'linkedin', text: `Interesting development:\n\n${title}\n\n${(description || '').slice(0, 300)}\n\nWhat do you think? \ud83d\udc47`, char_count: 0 },
    ]
  });
});

// POST /dl/vault/save
router.post('/vault/save', (req, res) => {
  const vault = readJSON(VAULT_FILE, { items: [] });
  const item = { ...req.body, id: uid(), saved_at: Date.now() };
  vault.items.unshift(item);
  writeJSON(VAULT_FILE, vault);
  res.json({ ok: true, id: item.id });
});

// GET /dl/vault/list
router.get('/vault/list', (req, res) => {
  const vault = readJSON(VAULT_FILE, { items: [] });
  res.json({ ok: true, items: vault.items });
});

// GET /dl/remix/start
router.get('/remix/start', async (req, res) => {
  const { url, title, subs } = req.query;
  const jobId = uid();
  REMIX_JOBS[jobId] = { status: 'processing', url, title, started: Date.now() };

  (async () => {
    try {
      const { execSync } = require('child_process');
      const outFile = `/tmp/remix_${jobId}.mp4`;
      execSync(`ssh -i ~/.ssh/gcp_vm -o ConnectTimeout=10 blipmoney9@${VPS_HOST} "yt-dlp -f 'best[height<=720]' -o '/tmp/remix_${jobId}.mp4' '${url.replace(/'/g, "'\\''")}'"`
        , { timeout: 120000 });
      execSync(`scp -i ~/.ssh/gcp_vm blipmoney9@${VPS_HOST}:/tmp/remix_${jobId}.mp4 ${path.join(DATA_DIR, `remix_${jobId}.mp4`)}`, { timeout: 120000 });
      REMIX_JOBS[jobId] = { status: 'done', url, title, file: `remix_${jobId}.mp4`, params: { source: url, title } };
    } catch (e) {
      REMIX_JOBS[jobId] = { status: 'error', error: e.message };
    }
  })();

  res.json({ ok: true, job: jobId });
});

// GET /dl/remix/status
router.get('/remix/status', (req, res) => {
  const job = REMIX_JOBS[req.query.job];
  if (!job) return res.json({ ok: false, error: 'unknown job' });
  res.json({ ok: true, ...job });
});

// GET /dl/remix/file
router.get('/remix/file', (req, res) => {
  const job = REMIX_JOBS[req.query.job];
  if (!job || !job.file) return res.status(404).send('not found');
  res.sendFile(path.join(DATA_DIR, job.file));
});

// GET /dl/accounts/list
router.get('/accounts/list', (req, res) => {
  const data = readJSON(ACCOUNTS_FILE, { accounts: [] });
  res.json({ ok: true, accounts: data.accounts });
});

// POST /dl/accounts/add
router.post('/accounts/add', (req, res) => {
  const data = readJSON(ACCOUNTS_FILE, { accounts: [] });
  const { handle, platform, added_by } = req.body;
  if (!handle || !platform) return res.json({ ok: false, error: 'missing fields' });
  const id = platform + '_' + handle.toLowerCase();
  if (data.accounts.find(a => a.id === id)) return res.json({ ok: true, id, exists: true });
  data.accounts.push({ id, handle, platform, added_by: added_by || 'web', added_at: nowSec() });
  writeJSON(ACCOUNTS_FILE, data);
  res.json({ ok: true, id });
});

// GET /dl/accounts/delete
router.get('/accounts/delete', (req, res) => {
  const data = readJSON(ACCOUNTS_FILE, { accounts: [] });
  data.accounts = data.accounts.filter(a => a.id !== req.query.id);
  writeJSON(ACCOUNTS_FILE, data);
  res.json({ ok: true });
});

// GET /dl/dashboard/today
router.get('/dashboard/today', (req, res) => {
  const news = readJSON(NEWS_FILE, { items: [] });
  const vault = readJSON(VAULT_FILE, { items: [] });
  const accounts = readJSON(ACCOUNTS_FILE, { accounts: [] });

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const news24h = (news.items || []).filter(i => (i.fetched_at || 0) > now - day).length;
  const vault24h = (vault.items || []).filter(i => (i.saved_at || 0) > now - day).length;

  const topNews = (news.items || []).slice(0, 5);
  const recentVault = (vault.items || []).slice(0, 5);

  res.json({
    ok: true,
    stats: {
      news_24h: news24h,
      videos_24h: 0,
      vault_total: (vault.items || []).length,
      vault_24h: vault24h,
      accounts_tracked: accounts.accounts.length,
    },
    top_news: topNews,
    recent_vault: recentVault,
    accounts: accounts.accounts.slice(0, 10),
  });
});

// GET /dl/checkhandle (mounted at /dl but original was /api/checkhandle — we handle both)
router.get('/checkhandle', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.json({ ok: false });
  try {
    const r = await fetch(`https://www.instagram.com/${u}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      redirect: 'manual'
    });
    res.json({ ok: true, exists: r.status === 200, platform: 'instagram', handle: u });
  } catch {
    res.json({ ok: true, exists: false, handle: u });
  }
});

// ── Auto-fetch on startup ──
setTimeout(() => {
  console.log('[news] initial fetch...');
  fetchAllNews().then(items => console.log(`[news] fetched ${items.length} items`)).catch(() => {});
}, 3000);

setInterval(() => {
  fetchAllNews().then(items => console.log(`[news] refreshed ${items.length} items`)).catch(() => {});
}, 30 * 60 * 1000);

setTimeout(() => {
  console.log('[trending] initial fetch...');
  fetchTrending().then(items => console.log(`[trending] fetched ${items.length} items`)).catch(() => {});
}, 8000);

setInterval(() => {
  fetchTrending().then(items => console.log(`[trending] refreshed ${items.length} items`)).catch(() => {});
}, 20 * 60 * 1000);

// Export fetchTrending so server.js can pass it to the worker
module.exports = router;
module.exports.fetchTrending = fetchTrending;
