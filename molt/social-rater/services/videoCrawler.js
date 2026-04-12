/**
 * Video Crawler — fetches top trending videos from YT, TikTok, IG, X
 * across all brand categories and stores in SQLite with viral scores
 */

const fetch = require('node-fetch');
const db = require('./database');

const CATEGORIES = ['crypto', 'finance', 'lifestyle', 'tech', 'ai', 'business', 'motivation', 'luxury'];

// Search queries per category
const QUERIES = {
  crypto: ['crypto', 'bitcoin', 'ethereum', 'solana', 'defi', 'web3', 'nft', 'crypto trading'],
  finance: ['finance', 'investing', 'stock market', 'money', 'financial freedom', 'passive income', 'real estate investing'],
  lifestyle: ['luxury lifestyle', 'millionaire lifestyle', 'entrepreneur lifestyle', 'day in my life rich', 'supercar', 'travel luxury'],
  tech: ['tech', 'gadgets', 'apple', 'ai tools', 'startup', 'silicon valley'],
  ai: ['artificial intelligence', 'chatgpt', 'ai news', 'ai tools 2026', 'machine learning'],
  business: ['business', 'startup', 'entrepreneur', 'side hustle', 'ecommerce', 'dropshipping'],
  motivation: ['motivation', 'success mindset', 'discipline', 'grind', 'hustle culture'],
  luxury: ['luxury', 'watches', 'dubai', 'rich lifestyle', 'supercars', 'private jet'],
};

// ── YouTube via Piped + Invidious ──
const PIPED = ['https://pipedapi.kavin.rocks', 'https://pipedapi.adminforge.de', 'https://api-piped.mha.fi'];
const INVIDIOUS = ['https://invidious.nerdvpn.de', 'https://inv.nadeko.net'];

async function pipedFetch(path) {
  for (const base of PIPED) {
    try { const r = await fetch(base + path, { timeout: 8000 }); if (r.ok) return await r.json(); } catch {}
  }
  return null;
}

async function invidiousSearch(q) {
  for (const base of INVIDIOUS) {
    try {
      const r = await fetch(`${base}/api/v1/search?q=${encodeURIComponent(q)}&type=video&sort=views&date=week`, { timeout: 8000 });
      if (r.ok) return await r.json();
    } catch {}
  }
  return null;
}

async function fetchYouTube(query, category) {
  let items = null;
  const piped = await pipedFetch('/search?q=' + encodeURIComponent(query) + '&filter=videos');
  if (piped) {
    items = (piped.items || []).filter(it => it.type === 'stream' || it.url);
  }
  if (!items || !items.length) {
    const inv = await invidiousSearch(query);
    if (inv) {
      items = inv.map(it => ({
        url: '/watch?v=' + it.videoId, title: it.title,
        uploaderName: it.author, views: it.viewCount,
        thumbnail: it.videoThumbnails?.[0]?.url || '',
        uploaded: it.published ? it.published * 1000 : null,
        duration: it.lengthSeconds,
        description: it.description || '',
      }));
    }
  }
  if (!items) return [];
  return items.slice(0, 15).map(it => {
    const m = (it.url || '').match(/[?&]v=([A-Za-z0-9_-]{11})|\/shorts\/([A-Za-z0-9_-]{11})/);
    const vid = m ? (m[1] || m[2]) : null;
    const isShort = /shorts/i.test(it.url || '') || (it.duration && it.duration < 120);
    return {
      id: 'yt_' + (vid || Date.now() + Math.random().toString(36).slice(2)),
      platform: 'youtube', title: it.title || '', author: it.uploaderName || it.uploader || '',
      author_id: '', url: 'https://youtube.com' + (it.url || ''),
      thumb: vid ? 'https://i.ytimg.com/vi/' + vid + '/hqdefault.jpg' : (it.thumbnail || ''),
      views: it.views || 0, likes: 0, comments: 0, shares: 0,
      duration: it.duration || 0, published_at: it.uploaded || null,
      category, query, description: it.description || '',
      hashtags: '', is_short: isShort, download_url: '',
    };
  });
}

// ── TikTok via tikwm.com ──
async function fetchTikTok(query, category) {
  const tk = 'https://www.tikwm.com/api/feed/search?keywords=' + encodeURIComponent(query) + '&count=30&cursor=0&web=1';
  try {
    const r = await fetch(tk, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) return [];
    const d = await r.json();
    const items = (d.data && (d.data.videos || d.data)) || [];
    const abs = u => !u ? '' : (u.startsWith('http') ? u : 'https://www.tikwm.com' + u);
    return items.slice(0, 15).map(it => ({
      id: 'tt_' + (it.video_id || it.id || Date.now()),
      platform: 'tiktok', title: it.title || '', author: it.author?.nickname || it.author?.unique_id || '',
      author_id: it.author?.unique_id || '',
      url: 'https://www.tiktok.com/@' + (it.author?.unique_id || 'user') + '/video/' + (it.video_id || it.id),
      thumb: abs(it.cover || it.origin_cover || ''),
      views: it.play_count || 0, likes: it.digg_count || 0,
      comments: it.comment_count || 0, shares: it.share_count || 0,
      duration: it.duration || 0, published_at: it.create_time ? it.create_time * 1000 : null,
      category, query, description: it.title || '',
      hashtags: (it.text_extra || []).map(t => '#' + t.hashtag_name).filter(Boolean).join(' '),
      is_short: true, download_url: abs(it.play || ''),
    }));
  } catch { return []; }
}

// ── Instagram via web scraping (limited — Reels search not available without auth) ──
// We'll use the existing /dl/insta endpoint for tracked accounts instead
// For trending, we search via tikwm's cross-platform or skip IG for now

// ── X/Twitter — limited without auth, use existing scraper for tracked accounts ──

/**
 * Calculate viral score for a video
 * Factors: views, likes, comments, shares, recency, engagement rate
 */
function calcViralScore(v) {
  const now = Date.now();
  const ageHours = v.published_at ? Math.max(1, (now - v.published_at) / 3600000) : 24;

  // Engagement per hour (velocity)
  const engPerHour = ((v.views || 0) / 100 + (v.likes || 0) + (v.comments || 0) * 2 + (v.shares || 0) * 3) / ageHours;

  // Engagement rate (if views > 0)
  const engRate = v.views > 0 ? ((v.likes || 0) + (v.comments || 0)) / v.views : 0;

  // View velocity (views per hour)
  const viewVelocity = (v.views || 0) / ageHours;

  // Composite score (0-100)
  const raw = (
    Math.log10(Math.max(1, viewVelocity)) * 15 +    // view velocity (log scale)
    Math.log10(Math.max(1, engPerHour)) * 20 +       // engagement velocity
    engRate * 200 +                                    // engagement rate boost
    (v.shares > 0 ? Math.log10(v.shares) * 10 : 0) + // shares bonus
    (v.is_short ? 5 : 0)                              // short-form bonus
  );

  return {
    viral_score: Math.min(100, Math.round(raw)),
    velocity: Math.round(engPerHour * 100) / 100,
  };
}

/**
 * Run a full crawl across all categories
 */
async function crawlAll() {
  console.log('[videoCrawler] starting full crawl...');
  const allVideos = [];
  let ytCount = 0, ttCount = 0;

  for (const cat of CATEGORIES) {
    const queries = QUERIES[cat] || [cat];
    // Pick 2-3 random queries per category to avoid rate limits
    const picked = queries.sort(() => Math.random() - 0.5).slice(0, 3);

    for (const q of picked) {
      // YouTube
      try {
        const yt = await fetchYouTube(q, cat);
        allVideos.push(...yt);
        ytCount += yt.length;
        console.log(`[videoCrawler] YT "${q}" → ${yt.length}`);
      } catch {}

      // TikTok
      try {
        const tt = await fetchTikTok(q, cat);
        allVideos.push(...tt);
        ttCount += tt.length;
        console.log(`[videoCrawler] TT "${q}" → ${tt.length}`);
      } catch {}

      // Small delay between queries
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Calculate viral scores
  const now = Date.now();
  allVideos.forEach(v => {
    v.fetched_at = now;
    const { viral_score, velocity } = calcViralScore(v);
    v.viral_score = viral_score;
    v.velocity = velocity;
  });

  // Dedupe by ID
  const seen = new Set();
  const deduped = allVideos.filter(v => {
    if (seen.has(v.id)) return false;
    seen.add(v.id);
    return true;
  });

  // Store in DB
  if (deduped.length > 0) {
    db.upsertVideoBatch(deduped);
  }

  const report = { total: deduped.length, youtube: ytCount, tiktok: ttCount, categories: CATEGORIES.length, fetched_at: now };
  console.log(`[videoCrawler] done: ${deduped.length} videos (YT:${ytCount} TT:${ttCount})`);
  return report;
}

/**
 * Get cached videos from DB with filters
 */
function getCachedVideos(opts = {}) {
  return db.getVideos(opts);
}

function getStats() {
  return db.getVideoStats();
}

module.exports = { crawlAll, getCachedVideos, getStats, calcViralScore, CATEGORIES };
