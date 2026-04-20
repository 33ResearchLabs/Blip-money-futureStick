const router = require('express').Router();
const fetch = require('node-fetch');
const db = require('../services/database');

const PLAT_ENDPOINTS = {
  instagram: '/dl/insta',
  x: '/dl/twitter',
  twitter: '/dl/twitter',
  youtube: '/dl/youtube',
  tiktok: '/dl/tiktok',
};

function toInt(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') { const m = v.replace(/,/g, '').match(/([\d.]+)\s*([KkMm]?)/); if (!m) return 0; let x = parseFloat(m[1]); if (/[Kk]/.test(m[2])) x *= 1000; if (/[Mm]/.test(m[2])) x *= 1e6; return Math.round(x); }
  return 0;
}

async function syncAccount(baseUrl, brand, plat, handle, force = false) {
  const ep = PLAT_ENDPOINTS[plat];
  if (!ep) return null;
  const clean = handle.replace(/^@/, '');
  // Use nginx (port 80) which routes /dl/ to the working Python dl-service on 18790
  baseUrl = 'http://127.0.0.1';
  try {
    const forceParam = force ? '&force=1' : '';
    const r = await fetch(`${baseUrl}${ep}?u=${encodeURIComponent(clean)}${forceParam}`, { timeout: 60000 });
    const d = await r.json();
    if (!d.ok && d.ok !== undefined) return null;
    const posts = Array.isArray(d.posts) ? d.posts : Array.isArray(d.recent) ? d.recent : [];
    const postsViews = posts.reduce((s, p) => s + toInt(p.video_view_count || p.play_count || p.view_count || 0), 0);
    // Prefer channel-level lifetime views when available (YouTube scraper returns this), fall back to posts sum
    const channelViews = toInt(d.channel_views);
    let totalViews = channelViews > postsViews ? channelViews : postsViews;
    let totalLikes = posts.reduce((s, p) => s + toInt(p.likes || p.like_count || 0), 0);
    let totalComments = posts.reduce((s, p) => s + toInt(p.comments || p.comment_count || 0), 0);
    let totalPostsCount = posts.length;
    const followers = toInt(d.followers);

    // Never let a metric fall below what account_posts + prev snapshot already know.
    // account_posts is append-only per-post truth; prev snapshot is last-known-good.
    try {
      const prev = db.getSnapshotById(plat + '_' + clean.toLowerCase());
      const postsAgg = db.getPostsAggregate(plat, clean.toLowerCase());
      const floorViews = Math.max(prev?.total_views || 0, postsAgg.views || 0);
      const floorLikes = Math.max(prev?.total_likes || 0, postsAgg.likes || 0);
      const floorComments = Math.max(prev?.total_comments || 0, postsAgg.comments || 0);
      const floorPostsCount = Math.max(prev?.posts_count || 0, postsAgg.count || 0);
      if (totalViews < floorViews) totalViews = floorViews;
      if (totalLikes < floorLikes) totalLikes = floorLikes;
      if (totalComments < floorComments) totalComments = floorComments;
      if (totalPostsCount < floorPostsCount) totalPostsCount = floorPostsCount;
    } catch {}
    const engRate = followers ? (((totalLikes + totalComments) / (posts.length || 1)) / followers * 100) : 0;

    const snap = {
      brand, platform: plat, handle: clean,
      name: d.name || d.full_name || clean,
      bio: (d.bio || '').slice(0, 500),
      avatar: d.avatar || '',
      followers, following: toInt(d.following),
      posts_count: totalPostsCount,
      total_views: totalViews, total_likes: totalLikes, total_comments: totalComments,
      avg_views_per_post: totalPostsCount ? Math.round(totalViews / totalPostsCount) : 0,
      eng_rate: Math.round(engRate * 100) / 100,
      verified: d.verified || d.is_verified || false,
      recent_posts: posts.map(p => ({
        id: p.id || p.shortcode,
        thumb: p.thumb || p.thumbnail || p.thumbnail_src || '',
        views: toInt(p.video_view_count || p.play_count || p.view_count || 0),
        likes: toInt(p.likes || p.like_count || 0),
        comments: toInt(p.comments || p.comment_count || 0),
        taken_at: p.taken_at || p.timestamp || p.taken_at_timestamp || (p.upload_date ? Math.floor(new Date(p.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).getTime() / 1000) : 0) || 0,
        caption: (p.caption || p.title || p.description || '').slice(0, 200),
        url: p.url || '',
        is_video: p.is_video || false,
      })),
    };
    db.upsertSnapshot(snap);
    // Persist every post as its own DB row (accumulates over time, never overwritten)
    try { db.upsertAccountPosts(plat, clean, snap.recent_posts); } catch (e) { console.log('[account-sync] posts upsert failed:', e.message); }
    return snap;
  } catch (e) {
    console.log(`[account-sync] failed ${plat}/@${clean}: ${e.message}`);
    return null;
  }
}

// Sync all brand accounts. force=true bypasses the dl-service's IG/YT/X cache.
async function syncAll(baseUrl, force = false) {
  const brands = db.kvGet('brandAccounts') || {};
  let synced = 0, failed = 0;
  for (const [brand, plats] of Object.entries(brands)) {
    for (const [plat, handle] of Object.entries(plats)) {
      const result = await syncAccount(baseUrl, brand, plat, handle, force);
      if (result) synced++; else failed++;
      // Small delay between requests
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  // Clean up orphaned snapshots (accounts removed from sidebar but still in DB)
  const validIds = new Set();
  for (const [brand, plats] of Object.entries(brands)) {
    for (const [plat, handle] of Object.entries(plats)) {
      const clean = (handle || '').replace(/^@/, '').toLowerCase();
      if (clean) validIds.add(plat + '_' + clean);
    }
  }
  const allSnaps = db.getSnapshots();
  let cleaned = 0;
  for (const snap of allSnaps) {
    if (!validIds.has(snap.id)) {
      db.deleteSnapshot(snap.platform, snap.handle);
      cleaned++;
    }
  }
  try { db.healSnapshotsFromPosts(); } catch {}
  console.log(`[account-sync] done: ${synced} synced, ${failed} failed, ${cleaned} orphans cleaned`);
  return { synced, failed, cleaned };
}

// GET /api/account-sync/dashboard — read from DB (instant)
router.get('/dashboard', (req, res) => {
  const dash = db.getSnapshotsDashboard();
  if (!dash) return res.json({ ok: true, empty: true });
  res.json({ ok: true, ...dash });
});

// GET /api/account-sync/snapshots — all snapshots
router.get('/snapshots', (req, res) => {
  const snaps = db.getSnapshots({ brand: req.query.brand, platform: req.query.platform });
  res.json({ ok: true, items: snaps });
});

// GET /api/account-sync/profile/:id — single snapshot with posts
router.get('/profile/:id', (req, res) => {
  const idLower = (req.params.id || '').toLowerCase();
  const snap = db.getSnapshots().find(s => (s.id || '').toLowerCase() === idLower);
  if (!snap) return res.json({ ok: false, error: 'not found' });
  // If snapshot's embedded recent_posts is empty, pull live from account_posts table
  let recent_posts = snap.recent_posts || [];
  if (!recent_posts.length) {
    const rows = db.getAccountPosts(snap.platform, snap.handle, 50);
    recent_posts = rows.map(r => ({
      id: r.id,
      thumb: r.thumb || '',
      views: r.views || 0,
      likes: r.likes || 0,
      comments: r.comments || 0,
      taken_at: r.published_at ? Math.floor(r.published_at / 1000) : 0,
      caption: r.caption || '',
      url: r.url || '',
      is_video: !!r.is_video,
    }));
  }
  res.json({ ok: true, ...snap, recent_posts });
});

// POST /api/account-sync/sync?force=1 — trigger full sync. force bypasses dl-service cache.
router.post('/sync', async (req, res) => {
  const PORT = process.env.PORT || 3033;
  const force = req.query.force === '1' || req.body?.force === true;
  const result = await syncAll(`http://127.0.0.1:${PORT}`, force);
  res.json({ ok: true, force, ...result });
});

// GET /api/account-sync/recent?hours=24&limit=500 — all stored posts from last N hours across all accounts
router.get('/recent', (req, res) => {
  const hours = parseInt(req.query.hours) || 24;
  const limit = Math.min(parseInt(req.query.limit) || 500, 10000);
  const sinceMs = Date.now() - hours * 3600000;
  const posts = db.getRecentPosts(sinceMs, limit);
  res.json({ ok: true, count: posts.length, hours, posts });
});

// GET /api/account-sync/posts?platform=&handle=&limit=200 — all stored posts for an account
router.get('/posts', (req, res) => {
  const { platform, handle } = req.query;
  if (!platform || !handle) return res.json({ ok: false, error: 'platform and handle required' });
  const limit = parseInt(req.query.limit) || 200;
  const posts = db.getAccountPosts(platform, (handle || '').replace(/^@/, '').toLowerCase(), limit);
  res.json({ ok: true, count: posts.length, posts });
});

// GET /api/account-sync/history?days=30
router.get('/history', (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const history = db.getHistory(days);
  res.json({ ok: true, history });
});

// POST /api/account-sync/save-snapshot — save a single snapshot from frontend
router.post('/save-snapshot', (req, res) => {
  const s = req.body;
  if (!s || !s.platform || !s.handle) return res.json({ ok: false });
  const posts = Array.isArray(s.recent_posts) ? s.recent_posts : [];
  const avgViews = posts.length ? Math.round((s.total_views || 0) / posts.length) : 0;
  const engRate = s.followers > 0 ? (((s.total_likes || 0) + (s.total_comments || 0)) / (posts.length || 1)) / s.followers * 100 : 0;
  db.upsertSnapshot({
    ...s,
    avg_views_per_post: avgViews,
    eng_rate: Math.round(engRate * 100) / 100,
    recent_posts: posts,
  });
  res.json({ ok: true });
});

// POST /api/account-sync/delete — remove snapshot from DB
router.post('/delete', (req, res) => {
  const { platform, handle } = req.body;
  if (!platform || !handle) return res.json({ ok: false, error: 'need platform + handle' });
  db.deleteSnapshot(platform, handle);
  res.json({ ok: true });
});

module.exports = router;
module.exports.syncAll = syncAll;
