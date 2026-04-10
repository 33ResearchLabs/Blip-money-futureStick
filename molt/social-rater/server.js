const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const RSSParser = require('rss-parser');

// ── Virality Engine Services ──
const scoringEngine = require('./services/scoring');
const clusteringEngine = require('./services/clustering');
const contentEngine = require('./services/contentEngine');
const contentQueue = require('./services/queue');
const feedbackLoop = require('./services/feedback');
const workerEngine = require('./services/worker');
const socialIngest = require('./services/socialIngest');

const app = express();
const PORT = process.env.PORT || 3033;
const DATA_DIR = path.join(__dirname, 'data');
const VPS_HOST = '35.202.198.103';
const VPS_SSH = `ssh -i ~/.ssh/gcp_vm blipmoney9@${VPS_HOST}`;

// Ensure data dir
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// ============ HELPERS ============
function kvPath(k) { return path.join(DATA_DIR, 'kv_' + k.replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function readJSON(f, def) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return def; } }
function writeJSON(f, d) { fs.writeFileSync(f, JSON.stringify(d, null, 2)); }
function uid() { return crypto.randomBytes(8).toString('hex'); }
function nowSec() { return Math.floor(Date.now() / 1000); }

const rssParser = new RSSParser({ timeout: 10000 });

// ============ KV STORE ============
app.get('/api/kv', (req, res) => {
  const k = req.query.k;
  if (!k) return res.json({ ok: false, error: 'no key' });
  const d = readJSON(kvPath(k), null);
  res.json({ ok: true, value: d });
});
app.post('/api/kv', (req, res) => {
  const { k, v } = req.body;
  if (!k) return res.json({ ok: false, error: 'no key' });
  writeJSON(kvPath(k), v);
  res.json({ ok: true });
});

// ============ CHECK HANDLE ============
app.get('/api/checkhandle', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.json({ ok: false });
  try {
    // Try Instagram
    const r = await fetch(`https://www.instagram.com/${u}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      redirect: 'manual'
    });
    res.json({ ok: true, exists: r.status === 200, platform: 'instagram', handle: u });
  } catch {
    res.json({ ok: true, exists: false, handle: u });
  }
});

// ============ IMAGE PROXY ============
app.get('/dl/proxy', async (req, res) => {
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

// ============ OG SCRAPER ============
app.get('/dl/og', async (req, res) => {
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
    // Also try twitter:image
    const tw = /<meta\s+(?:property|name)=["']twitter:image["']\s+content=["']([^"']+)["']/i.exec(html);
    if (!og.image && tw) og.image = tw[1];
    res.json({ ok: true, ...og });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ============ INSTAGRAM PROFILE PROXY ============
app.get('/dl/insta', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.json({ ok: false });
  try {
    // Use a public API approach
    const r = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${u}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        'x-ig-app-id': '936619743392459'
      },
      timeout: 10000
    });
    if (!r.ok) {
      // Fallback: scrape HTML
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

// ============ TWITTER/X PROFILE (no-auth scraper) ============
const TWITTER_CACHE = {};
const TWITTER_CACHE_TTL = 15 * 60 * 1000; // 15 min

async function scrapeTwitterProfile(handle) {
  // Approach 1: Scrape x.com profile page for meta tags
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

  // Extract og/meta tags
  const ogDesc = (/<meta\s+(?:property|name)=["'](?:og:)?description["']\s+content=["']([^"']*?)["']/i.exec(html) || [])[1] || '';
  const ogImage = (/<meta\s+(?:property|name)=["'](?:og:)?image["']\s+content=["']([^"']*?)["']/i.exec(html) || [])[1] || '';
  const ogTitle = (/<meta\s+(?:property|name)=["'](?:og:)?title["']\s+content=["']([^"']*?)["']/i.exec(html) || [])[1] || '';

  // Parse follower/following from description like "123 Followers, 45 Following"
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

  // Bio: strip the followers/following prefix from og:description
  let bio = ogDesc.replace(/[\d,]+(?:\.\d+)?[KkMm]?\s*Followers?,?\s*[\d,]+(?:\.\d+)?[KkMm]?\s*Following[.,]?\s*/i, '').trim();

  // Name from og:title: usually "Name (@handle) / X"
  const nameMatch = ogTitle.match(/^(.+?)\s*\(@/);
  const name = nameMatch ? nameMatch[1].trim() : handle;
  const verified = /verified/i.test(html) || ogTitle.includes('✓');

  return { handle, name, bio, avatar: ogImage, followers, following, verified };
}

async function getTwitterPosts(handle) {
  // Try yt-dlp to get recent tweets (works for tweets with media)
  const { execSync } = require('child_process');
  const posts = [];
  try {
    // yt-dlp can extract from twitter user pages
    const result = execSync(
      `yt-dlp --flat-playlist -j --playlist-items 1-12 "https://x.com/${handle}"`,
      { timeout: 30000, encoding: 'utf8' }
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
    // yt-dlp may fail for text-only accounts — that's OK
    // Try VPS fallback
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

app.get('/dl/twitter', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.json({ ok: false, error: 'no handle' });
  const handle = u.replace(/^@/, '').trim();
  const force = req.query.force === '1';

  // Check cache
  const cached = TWITTER_CACHE[handle];
  if (!force && cached && (Date.now() - cached.at) < TWITTER_CACHE_TTL) {
    return res.json({ ...cached.data, stale: true, stale_age: Math.floor((Date.now() - cached.at) / 1000) });
  }

  try {
    // Run profile scrape and yt-dlp posts in parallel
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

// ============ YOUTUBE PROFILE (no-auth via yt-dlp) ============
const YT_CACHE = {};
const YT_CACHE_TTL = 15 * 60 * 1000;

function ytdlpExec(cmd) {
  const { execSync } = require('child_process');
  try {
    return execSync(cmd, { timeout: 45000, encoding: 'utf8' });
  } catch {
    // VPS fallback
    return execSync(
      `ssh -i ~/.ssh/gcp_vm -o ConnectTimeout=10 blipmoney9@${VPS_HOST} "${cmd.replace(/"/g, '\\"')}"`,
      { timeout: 45000, encoding: 'utf8' }
    );
  }
}

app.get('/dl/youtube', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.json({ ok: false, error: 'no handle' });
  const handle = u.replace(/^@/, '').trim();
  const force = req.query.force === '1';

  const cached = YT_CACHE[handle];
  if (!force && cached && (Date.now() - cached.at) < YT_CACHE_TTL) {
    return res.json({ ...cached.data, stale: true, stale_age: Math.floor((Date.now() - cached.at) / 1000) });
  }

  try {
    // yt-dlp can extract channel metadata + recent videos
    const channelUrl = handle.startsWith('UC') ? `https://www.youtube.com/channel/${handle}` : `https://www.youtube.com/@${handle}`;

    // Get channel info + last 12 videos
    const raw = ytdlpExec(`yt-dlp --flat-playlist -j --playlist-items 1-12 "${channelUrl}/videos"`);
    const lines = raw.trim().split('\n').filter(Boolean);

    let channelName = handle, avatar = '', subscribers = 0, channelDesc = '';
    const posts = [];

    for (const line of lines) {
      try {
        const d = JSON.parse(line);
        // Extract channel-level info from first entry
        if (!posts.length) {
          channelName = d.channel || d.uploader || handle;
          avatar = d.channel_url ? '' : ''; // yt-dlp doesn't give avatar in flat mode
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

    // Try to get subscriber count + channel description from channel page
    try {
      const { execSync } = require('child_process');
      const meta = execSync(`yt-dlp --dump-json --playlist-items 1 "${channelUrl}/videos"`, { timeout: 30000, encoding: 'utf8' });
      const md = JSON.parse(meta);
      if (md.channel_follower_count) subscribers = md.channel_follower_count;
      if (md.channel) channelName = md.channel;
      if (md.description) channelDesc = md.description.slice(0, 300);
      if (md.uploader_url) avatar = ''; // no direct avatar from yt-dlp
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

// ============ TIKTOK PROFILE (no-auth via yt-dlp) ============
const TT_CACHE = {};
const TT_CACHE_TTL = 15 * 60 * 1000;

app.get('/dl/tiktok', async (req, res) => {
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

// ============ TRENDING TOPICS (multi-source aggregation) ============
const TRENDING_FILE = path.join(DATA_DIR, 'trending.json');
const TRENDING_CACHE_TTL = 10 * 60 * 1000;
let TRENDING_LAST = 0;

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
      raw = execSync('yt-dlp --flat-playlist -j --playlist-items 1-20 "https://www.youtube.com/feed/trending"', { timeout: 30000, encoding: 'utf8' });
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

app.get('/dl/trending', (req, res) => {
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
  if (videoOnly) items = items.filter(i => i.has_video);
  const limit = parseInt(req.query.limit) || 200;
  res.json({ ok: true, items: items.slice(0, limit), total: items.length, updated_at: data.updated_at || 0 });
});

app.post('/dl/trending/refresh', async (req, res) => {
  try {
    const items = await fetchTrending();
    res.json({ ok: true, count: items.length });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// Auto-fetch trending on startup (after news)
setTimeout(() => {
  console.log('[trending] initial fetch...');
  fetchTrending().then(items => console.log(`[trending] fetched ${items.length} items`)).catch(() => {});
}, 8000);

// Re-fetch trending every 20 min
setInterval(() => {
  fetchTrending().then(items => console.log(`[trending] refreshed ${items.length} items`)).catch(() => {});
}, 20 * 60 * 1000);

// ============ NEWS ENGINE ============
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const NEWS_FEEDS = [
  // Tech
  { url: 'https://feeds.feedburner.com/TechCrunch/', type: 'tech', source: 'TechCrunch' },
  { url: 'https://www.theverge.com/rss/index.xml', type: 'tech', source: 'The Verge' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', type: 'tech', source: 'Ars Technica' },
  // Crypto
  { url: 'https://cointelegraph.com/rss', type: 'crypto', source: 'CoinTelegraph' },
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', type: 'crypto', source: 'CoinDesk' },
  // Business
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', type: 'business', source: 'BBC Business' },
  // AI
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', type: 'ai', source: 'TC AI' },
];
const REDDIT_SUBS = [
  { sub: 'technology', type: 'tech' },
  { sub: 'cryptocurrency', type: 'crypto' },
  { sub: 'artificial', type: 'ai' },
  { sub: 'business', type: 'business' },
  { sub: 'worldnews', type: 'world' },
];

async function fetchAllNews() {
  const items = [];

  // RSS feeds
  const rssResults = await Promise.allSettled(
    NEWS_FEEDS.map(async feed => {
      try {
        const parsed = await rssParser.parseURL(feed.url);
        return (parsed.items || []).slice(0, 15).map(it => ({
          id: uid(),
          title: it.title || '',
          url: it.link || '',
          source: feed.source,
          source_type: feed.type,
          published_at: it.pubDate ? new Date(it.pubDate).getTime() : Date.now(),
          fetched_at: Date.now(),
          description: (it.contentSnippet || it.content || '').slice(0, 300),
          image: it.enclosure?.url || '',
          score: Math.floor(Math.random() * 40 + 50), // base score
        }));
      } catch { return []; }
    })
  );
  rssResults.forEach(r => { if (r.status === 'fulfilled') items.push(...r.value); });

  // Reddit
  const redditResults = await Promise.allSettled(
    REDDIT_SUBS.map(async ({ sub, type }) => {
      try {
        const r = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=20`, {
          headers: { 'User-Agent': 'SocialRater/1.0' }, timeout: 10000
        });
        const d = await r.json();
        return (d.data?.children || []).filter(c => !c.data?.stickied).slice(0, 15).map(c => ({
          id: uid(),
          title: c.data?.title || '',
          url: c.data?.url || `https://reddit.com${c.data?.permalink}`,
          source: `r/${sub}`,
          source_type: type,
          published_at: (c.data?.created_utc || 0) * 1000,
          fetched_at: Date.now(),
          ups: c.data?.ups || 0,
          comments: c.data?.num_comments || 0,
          score: Math.min(100, Math.floor((c.data?.ups || 0) / 50 + 40)),
          image: c.data?.thumbnail && c.data.thumbnail.startsWith('http') ? c.data.thumbnail : '',
        }));
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

  // Sort by score desc
  items.sort((a, b) => (b.score || 0) - (a.score || 0));
  // Dedupe by title similarity
  const seen = new Set();
  const deduped = items.filter(it => {
    const key = (it.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  writeJSON(NEWS_FILE, { items: deduped, updated_at: Date.now() });
  return deduped;
}

app.post('/dl/news/refresh', async (req, res) => {
  try {
    const items = await fetchAllNews();
    res.json({ ok: true, count: items.length });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

app.get('/dl/news/list', (req, res) => {
  const data = readJSON(NEWS_FILE, { items: [] });
  let items = data.items || [];
  const type = req.query.type;
  if (type && type !== 'all') items = items.filter(i => i.source_type === type);
  const limit = parseInt(req.query.limit) || 100;
  const since = req.query.since ? parseInt(req.query.since) : 0;
  if (since) items = items.filter(i => (i.published_at || 0) >= since);
  res.json({ ok: true, items: items.slice(0, limit), total: items.length });
});

app.post('/dl/news/explode', async (req, res) => {
  // Returns AI-generated content variations for a news item
  const { title, url, description } = req.body;
  res.json({
    ok: true,
    title: title || '',
    variations: [
      { platform: 'twitter', text: `🔥 ${title}\n\nRead more: ${url}\n\n#trending #news`, char_count: 0 },
      { platform: 'instagram', text: `${title}\n\n${(description || '').slice(0, 200)}\n\n.\n.\n.\n#news #trending #viral`, char_count: 0 },
      { platform: 'tiktok', text: `${title} 🔥 #fyp #trending #news`, char_count: 0 },
      { platform: 'linkedin', text: `Interesting development:\n\n${title}\n\n${(description || '').slice(0, 300)}\n\nWhat do you think? 👇`, char_count: 0 },
    ]
  });
});

// ============ VIDEO RESOLVER ============
app.get('/dl/resolve', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ ok: false, error: 'no url' });
  try {
    // Try to run yt-dlp locally first, if not available, use VPS
    const { execSync } = require('child_process');
    let result;
    try {
      result = execSync(`yt-dlp -j --no-download "${url}"`, { timeout: 30000, encoding: 'utf8' });
    } catch {
      // Fallback to VPS
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

// ============ VAULT ============
const VAULT_FILE = path.join(DATA_DIR, 'vault.json');

app.post('/dl/vault/save', (req, res) => {
  const vault = readJSON(VAULT_FILE, { items: [] });
  const item = { ...req.body, id: uid(), saved_at: Date.now() };
  vault.items.unshift(item);
  writeJSON(VAULT_FILE, vault);
  res.json({ ok: true, id: item.id });
});

app.get('/dl/vault/list', (req, res) => {
  const vault = readJSON(VAULT_FILE, { items: [] });
  res.json({ ok: true, items: vault.items });
});

// ============ REMIX (proxy to VPS) ============
const REMIX_JOBS = {};

app.get('/dl/remix/start', async (req, res) => {
  const { url, title, subs } = req.query;
  const jobId = uid();
  REMIX_JOBS[jobId] = { status: 'processing', url, title, started: Date.now() };

  // Start async download on VPS
  (async () => {
    try {
      const { execSync } = require('child_process');
      const outFile = `/tmp/remix_${jobId}.mp4`;
      execSync(`ssh -i ~/.ssh/gcp_vm -o ConnectTimeout=10 blipmoney9@${VPS_HOST} "yt-dlp -f 'best[height<=720]' -o '/tmp/remix_${jobId}.mp4' '${url.replace(/'/g, "'\\''")}'"`
        , { timeout: 120000 });
      // Copy back
      execSync(`scp -i ~/.ssh/gcp_vm blipmoney9@${VPS_HOST}:/tmp/remix_${jobId}.mp4 ${path.join(DATA_DIR, `remix_${jobId}.mp4`)}`, { timeout: 120000 });
      REMIX_JOBS[jobId] = { status: 'done', url, title, file: `remix_${jobId}.mp4`, params: { source: url, title } };
    } catch (e) {
      REMIX_JOBS[jobId] = { status: 'error', error: e.message };
    }
  })();

  res.json({ ok: true, job: jobId });
});

app.get('/dl/remix/status', (req, res) => {
  const job = REMIX_JOBS[req.query.job];
  if (!job) return res.json({ ok: false, error: 'unknown job' });
  res.json({ ok: true, ...job });
});

app.get('/dl/remix/file', (req, res) => {
  const job = REMIX_JOBS[req.query.job];
  if (!job || !job.file) return res.status(404).send('not found');
  res.sendFile(path.join(DATA_DIR, job.file));
});

// ============ ACCOUNTS ============
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');

app.get('/dl/accounts/list', (req, res) => {
  const data = readJSON(ACCOUNTS_FILE, { accounts: [] });
  res.json({ ok: true, accounts: data.accounts });
});

app.post('/dl/accounts/add', (req, res) => {
  const data = readJSON(ACCOUNTS_FILE, { accounts: [] });
  const { handle, platform, added_by } = req.body;
  if (!handle || !platform) return res.json({ ok: false, error: 'missing fields' });
  const id = platform + '_' + handle.toLowerCase();
  if (data.accounts.find(a => a.id === id)) return res.json({ ok: true, id, exists: true });
  data.accounts.push({ id, handle, platform, added_by: added_by || 'web', added_at: nowSec() });
  writeJSON(ACCOUNTS_FILE, data);
  res.json({ ok: true, id });
});

app.get('/dl/accounts/delete', (req, res) => {
  const data = readJSON(ACCOUNTS_FILE, { accounts: [] });
  data.accounts = data.accounts.filter(a => a.id !== req.query.id);
  writeJSON(ACCOUNTS_FILE, data);
  res.json({ ok: true });
});

// ============ DASHBOARD / TODAY ============
app.get('/dl/dashboard/today', (req, res) => {
  const news = readJSON(NEWS_FILE, { items: [] });
  const vault = readJSON(VAULT_FILE, { items: [] });
  const accounts = readJSON(ACCOUNTS_FILE, { accounts: [] });

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const news24h = (news.items || []).filter(i => (i.fetched_at || 0) > now - day).length;
  const vault24h = (vault.items || []).filter(i => (i.saved_at || 0) > now - day).length;

  // Top stories
  const topNews = (news.items || []).slice(0, 5);
  // Recent vault
  const recentVault = (vault.items || []).slice(0, 5);

  res.json({
    ok: true,
    stats: {
      news_24h: news24h,
      videos_24h: 0, // TODO: track separately
      vault_total: (vault.items || []).length,
      vault_24h: vault24h,
      accounts_tracked: accounts.accounts.length,
    },
    top_news: topNews,
    recent_vault: recentVault,
    accounts: accounts.accounts.slice(0, 10),
  });
});

// ============ RADAR (trending content discovery) ============
app.get('/api/radar', async (req, res) => {
  const niche = req.query.niche || 'tech';
  try {
    const r = await fetch(`https://www.reddit.com/r/${niche}/hot.json?limit=10`, {
      headers: { 'User-Agent': 'SocialRater/1.0' }, timeout: 8000
    });
    const d = await r.json();
    const items = (d.data?.children || []).filter(c => !c.data?.stickied).map(c => ({
      title: c.data?.title,
      url: c.data?.url,
      ups: c.data?.ups,
      comments: c.data?.num_comments,
      sub: c.data?.subreddit,
    }));
    res.json({ ok: true, items });
  } catch (e) {
    res.json({ ok: true, items: [] });
  }
});

// ============ BOOT: auto-fetch news on startup ============
setTimeout(() => {
  console.log('[news] initial fetch...');
  fetchAllNews().then(items => console.log(`[news] fetched ${items.length} items`)).catch(() => {});
}, 3000);

// Re-fetch news every 30 min
setInterval(() => {
  fetchAllNews().then(items => console.log(`[news] refreshed ${items.length} items`)).catch(() => {});
}, 30 * 60 * 1000);

// ============ VIRALITY ENGINE API ============

// ── Scoring ──
app.post('/api/engine/score', (req, res) => {
  const data = readJSON(path.join(DATA_DIR, 'trending.json'), { items: [] });
  const weights = feedbackLoop.getWeights();
  const { top, low, threshold } = scoringEngine.scoreAndFilter(data.items, data.items, weights);
  writeJSON(path.join(DATA_DIR, 'trending.json'), { items: [...top, ...low], updated_at: Date.now() });
  res.json({ ok: true, top: top.length, low: low.length, threshold, weights });
});

app.get('/api/engine/weights', (req, res) => {
  res.json({ ok: true, weights: feedbackLoop.getWeights() });
});

// ── Clustering ──
app.get('/api/engine/clusters', (req, res) => {
  const data = readJSON(path.join(DATA_DIR, 'clusters.json'), { clusters: [], hot: [] });
  const minScore = parseInt(req.query.min) || 0;
  let clusters = data.clusters || [];
  if (minScore) clusters = clusters.filter(c => c.cluster_score >= minScore);
  res.json({ ok: true, clusters: clusters.slice(0, parseInt(req.query.limit) || 100), total: clusters.length, hot: (data.hot || []).length, updated_at: data.updated_at });
});

app.post('/api/engine/cluster', (req, res) => {
  const data = readJSON(path.join(DATA_DIR, 'trending.json'), { items: [] });
  const top = (data.items || []).filter(i => i.priority === 'high' || !i.auto_filtered);
  const clusters = clusteringEngine.clusterTrends(top);
  const hot = clusteringEngine.getHotClusters(clusters);
  writeJSON(path.join(DATA_DIR, 'clusters.json'), { clusters, hot, updated_at: Date.now() });
  res.json({ ok: true, total: clusters.length, hot: hot.length });
});

// ── Content Generation ──
app.post('/api/engine/generate', (req, res) => {
  const { trend_id, threshold } = req.body || {};
  const clusterData = readJSON(path.join(DATA_DIR, 'clusters.json'), { clusters: [], hot: [] });

  let targets;
  if (trend_id) {
    targets = clusterData.clusters.filter(c => c.cluster_id === trend_id);
  } else {
    targets = clusterData.hot || [];
  }

  const generated = contentEngine.batchGenerate(targets, threshold || 50);
  res.json({ ok: true, count: generated.length, content: generated });
});

app.post('/api/engine/generate-single', (req, res) => {
  const trend = req.body;
  if (!trend || !trend.title) return res.json({ ok: false, error: 'need trend object with title' });
  const content = contentEngine.generateContent(trend);
  res.json({ ok: true, content });
});

// ── Content Queue ──
app.get('/api/queue', (req, res) => {
  const filters = {
    status: req.query.status,
    platform: req.query.platform,
    priority: req.query.priority,
    emotion: req.query.emotion,
    limit: parseInt(req.query.limit) || 100,
  };
  res.json({ ok: true, ...contentQueue.getQueue(filters) });
});

app.get('/api/queue/stats', (req, res) => {
  res.json({ ok: true, ...contentQueue.getStats() });
});

app.post('/api/queue/add', (req, res) => {
  const content = req.body;
  if (!content) return res.json({ ok: false, error: 'no content' });
  const item = contentQueue.enqueue(content, { priority: req.body.priority, notes: req.body.notes });
  res.json({ ok: true, item });
});

app.post('/api/queue/status', (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) return res.json({ ok: false, error: 'need id + status' });
  const item = contentQueue.updateStatus(id, status);
  if (!item) return res.json({ ok: false, error: 'not found' });
  res.json({ ok: true, item });
});

app.post('/api/queue/remove', (req, res) => {
  contentQueue.remove(req.body.id);
  res.json({ ok: true });
});

app.get('/api/queue/latency', (req, res) => {
  res.json({ ok: true, ...contentQueue.getLatencyStats() });
});

// ── Performance / Feedback ──
app.post('/api/performance/record', (req, res) => {
  const entry = feedbackLoop.recordPerformance(req.body);
  res.json({ ok: true, entry });
});

app.get('/api/performance', (req, res) => {
  const filters = {
    platform: req.query.platform,
    emotion: req.query.emotion,
    format: req.query.format,
    minViews: parseInt(req.query.minViews) || 0,
    since: parseInt(req.query.since) || 0,
    limit: parseInt(req.query.limit) || 100,
  };
  res.json({ ok: true, ...feedbackLoop.getPerformance(filters) });
});

app.get('/api/performance/summary', (req, res) => {
  res.json({ ok: true, ...feedbackLoop.getSummary() });
});

app.post('/api/performance/adjust', (req, res) => {
  const result = feedbackLoop.adjustWeights();
  res.json({ ok: true, ...result });
});

// ── Worker ──
app.get('/api/worker/state', (req, res) => {
  res.json({ ok: true, ...workerEngine.getState() });
});

app.get('/api/worker/logs', (req, res) => {
  res.json({ ok: true, logs: workerEngine.getLogs(parseInt(req.query.limit) || 50) });
});

app.post('/api/worker/run', async (req, res) => {
  const report = await WORKER_HANDLE.runNow();
  res.json({ ok: true, report });
});

app.post('/api/worker/config', (req, res) => {
  const state = workerEngine.getState();
  if (req.body.enabled !== undefined) state.enabled = !!req.body.enabled;
  if (req.body.auto_generate !== undefined) state.auto_generate = !!req.body.auto_generate;
  if (req.body.score_threshold) state.score_threshold = parseInt(req.body.score_threshold);
  if (req.body.interval_ms) state.interval_ms = Math.max(60000, parseInt(req.body.interval_ms));
  workerEngine.saveState(state);
  res.json({ ok: true, state });
});

// ── Social Ingestion ──
app.get('/api/social/accounts', (req, res) => {
  res.json({ ok: true, accounts: socialIngest.getTrackedAccounts() });
});

app.get('/api/social/feed', (req, res) => {
  const feed = socialIngest.getCachedFeed();
  let items = feed.items || [];
  const plat = req.query.platform;
  if (plat) items = items.filter(i => i.source_platform === plat);
  const brand = req.query.brand;
  if (brand) items = items.filter(i => i.source_brand === brand);
  const videoOnly = req.query.video === '1';
  if (videoOnly) items = items.filter(i => i.has_video);
  res.json({ ok: true, items: items.slice(0, parseInt(req.query.limit) || 100), total: items.length, updated_at: feed.updated_at });
});

app.post('/api/social/refresh', async (req, res) => {
  try {
    const baseUrl = `http://127.0.0.1:${PORT}`;
    const result = await socialIngest.fetchAllAccounts(baseUrl);
    res.json({ ok: true, posts: result.items.length, accounts_fetched: result.accounts_fetched, accounts_failed: result.accounts_failed, by_platform: result.by_platform });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ── Full Engine Dashboard ──
app.get('/api/engine/dashboard', (req, res) => {
  const trending = readJSON(path.join(DATA_DIR, 'trending.json'), { items: [] });
  const clusters = readJSON(path.join(DATA_DIR, 'clusters.json'), { clusters: [], hot: [] });
  const queueStats = contentQueue.getStats();
  const perfSummary = feedbackLoop.getSummary();
  const workerState = workerEngine.getState();
  const latency = contentQueue.getLatencyStats();

  const topItems = (trending.items || []).filter(i => i.priority === 'high').slice(0, 10);
  const socialFeed = socialIngest.getCachedFeed();
  const socialItems = socialFeed.items || [];
  const socialWithVideo = socialItems.filter(i => i.has_video);

  res.json({
    ok: true,
    trending: { total: (trending.items || []).length, top: topItems.length, updated_at: trending.updated_at },
    social: { total: socialItems.length, with_video: socialWithVideo.length, updated_at: socialFeed.updated_at, top_posts: socialItems.slice(0, 10) },
    clusters: { total: (clusters.clusters || []).length, hot: (clusters.hot || []).length, top_clusters: (clusters.hot || []).slice(0, 5) },
    queue: queueStats,
    performance: perfSummary,
    worker: { enabled: workerState.enabled, last_run: workerState.last_run, runs: workerState.runs, auto_generate: workerState.auto_generate, interval_ms: workerState.interval_ms },
    latency,
    top_trends: topItems,
  });
});

// ============ AI PROXY (server-side Anthropic key) ============
const AI_KEY = process.env.ANTHROPIC_API_KEY || '';

app.post('/api/ai', async (req, res) => {
  const key = AI_KEY || readJSON(path.join(DATA_DIR, 'ai_key.json'), {}).key || '';
  if (!key) return res.json({ ok: false, error: 'no AI key configured on server' });
  const { messages, system, max_tokens, model } = req.body;
  if (!messages) return res.json({ ok: false, error: 'no messages' });
  try {
    const body = {
      model: model || 'claude-haiku-4-5-20251001',
      max_tokens: Math.min(max_tokens || 1000, 4000),
      messages,
    };
    if (system) body.system = system;
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
      timeout: 30000,
    });
    const j = await r.json();
    if (j.error) return res.json({ ok: false, error: j.error.message || JSON.stringify(j.error), content: [{ text: '' }] });
    // Return both our format AND Anthropic-compatible format for legacy code
    const text = (j.content && j.content[0] && j.content[0].text) || '';
    res.json({ ok: true, text, content: j.content, usage: j.usage });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// Set AI key via API (one-time setup)
app.post('/api/ai/key', (req, res) => {
  const { key } = req.body;
  if (!key) return res.json({ ok: false });
  writeJSON(path.join(DATA_DIR, 'ai_key.json'), { key, set_at: Date.now() });
  res.json({ ok: true });
});

// ============ START ============
let WORKER_HANDLE;
app.listen(PORT, () => {
  console.log(`\n  ⚡ Social Rater server running on http://localhost:${PORT}\n`);
  console.log(`  📰 News engine: auto-fetching from ${NEWS_FEEDS.length} RSS + ${REDDIT_SUBS.length} Reddit + HN`);
  console.log(`  📊 Accounts: synced across all users`);
  console.log(`  🔥 Virality engine: scoring → clustering → content → queue → feedback`);
  console.log(`  💾 Data dir: ${DATA_DIR}\n`);

  // Boot virality worker
  WORKER_HANDLE = workerEngine.startWorker(fetchTrending);
  console.log('  🤖 Background worker started (15 min cycle)\n');
});
