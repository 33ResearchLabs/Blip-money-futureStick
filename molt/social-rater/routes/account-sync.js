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

async function syncAccount(baseUrl, brand, plat, handle) {
  const ep = PLAT_ENDPOINTS[plat];
  if (!ep) return null;
  const clean = handle.replace(/^@/, '');
  // Use nginx (port 80) which routes /dl/ to the working Python dl-service on 18790
  baseUrl = 'http://127.0.0.1';
  try {
    const r = await fetch(`${baseUrl}${ep}?u=${encodeURIComponent(clean)}`, { timeout: 30000 });
    const d = await r.json();
    if (!d.ok && d.ok !== undefined) return null;
    const posts = Array.isArray(d.posts) ? d.posts : Array.isArray(d.recent) ? d.recent : [];
    const totalViews = posts.reduce((s, p) => s + toInt(p.video_view_count || p.play_count || p.view_count || 0), 0);
    const totalLikes = posts.reduce((s, p) => s + toInt(p.likes || p.like_count || 0), 0);
    const totalComments = posts.reduce((s, p) => s + toInt(p.comments || p.comment_count || 0), 0);
    const followers = toInt(d.followers);
    const engRate = followers ? (((totalLikes + totalComments) / (posts.length || 1)) / followers * 100) : 0;

    const snap = {
      brand, platform: plat, handle: clean,
      name: d.name || d.full_name || clean,
      bio: (d.bio || '').slice(0, 500),
      avatar: d.avatar || '',
      followers, following: toInt(d.following),
      posts_count: posts.length,
      total_views: totalViews, total_likes: totalLikes, total_comments: totalComments,
      avg_views_per_post: posts.length ? Math.round(totalViews / posts.length) : 0,
      eng_rate: Math.round(engRate * 100) / 100,
      verified: d.verified || d.is_verified || false,
      recent_posts: posts.slice(0, 12).map(p => ({
        id: p.id || p.shortcode,
        thumb: p.thumb || p.thumbnail || p.thumbnail_src || '',
        views: toInt(p.video_view_count || p.play_count || p.view_count || 0),
        likes: toInt(p.likes || p.like_count || 0),
        comments: toInt(p.comments || p.comment_count || 0),
        taken_at: p.taken_at || p.timestamp || p.taken_at_timestamp || (p.upload_date ? Math.floor(new Date(p.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).getTime() / 1000) : 0) || 0,
        caption: (p.caption || p.title || p.description || '').slice(0, 120),
        url: p.url || '',
        is_video: p.is_video || false,
      })),
    };
    db.upsertSnapshot(snap);
    return snap;
  } catch (e) {
    console.log(`[account-sync] failed ${plat}/@${clean}: ${e.message}`);
    return null;
  }
}

// Sync all brand accounts
async function syncAll(baseUrl) {
  const brands = db.kvGet('brandAccounts') || {};
  let synced = 0, failed = 0;
  for (const [brand, plats] of Object.entries(brands)) {
    for (const [plat, handle] of Object.entries(plats)) {
      const result = await syncAccount(baseUrl, brand, plat, handle);
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
  const snap = db.getSnapshots().find(s => s.id === req.params.id);
  if (!snap) return res.json({ ok: false, error: 'not found' });
  res.json({ ok: true, ...snap });
});

// POST /api/account-sync/sync — trigger full sync
router.post('/sync', async (req, res) => {
  const PORT = process.env.PORT || 3033;
  const result = await syncAll(`http://127.0.0.1:${PORT}`);
  res.json({ ok: true, ...result });
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
