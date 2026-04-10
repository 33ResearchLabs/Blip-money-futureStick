const router = require('express').Router();
const fetch = require('node-fetch');

// ── YouTube via Piped + Invidious (free, no key) ──
const PIPED = ['https://pipedapi.kavin.rocks','https://pipedapi.adminforge.de','https://api-piped.mha.fi','https://pipedapi.r4fo.com'];
const INVIDIOUS = ['https://invidious.nerdvpn.de','https://inv.nadeko.net','https://invidious.privacyredirect.com'];

async function pipedFetch(path) {
  for (const base of PIPED) {
    try { const r = await fetch(base + path, { timeout: 8000 }); if (r.ok) return await r.json(); } catch {}
  }
  return null;
}

async function invidiousSearch(q, time) {
  const date = { day:'day', week:'week', month:'month', year:'year' }[time] || 'all';
  for (const base of INVIDIOUS) {
    try {
      const url = q
        ? `${base}/api/v1/search?q=${encodeURIComponent(q)}&type=video&date=${date}&sort=views`
        : `${base}/api/v1/trending?region=US`;
      const r = await fetch(url, { timeout: 8000 });
      if (r.ok) return await r.json();
    } catch {}
  }
  return null;
}

async function searchYouTube(q, time) {
  let items = null;
  const piped = q
    ? await pipedFetch('/search?q=' + encodeURIComponent(q) + '&filter=videos')
    : await pipedFetch('/trending?region=US');
  if (piped) {
    items = q ? (piped.items || []) : (piped || []);
    items = items.filter(it => it.type === 'stream' || it.url);
  }
  if (!items || !items.length) {
    const inv = await invidiousSearch(q, time);
    if (inv) {
      items = (inv || []).map(it => ({
        type: 'stream', url: '/watch?v=' + it.videoId,
        title: it.title, uploaderName: it.author,
        views: it.viewCount,
        thumbnail: (it.videoThumbnails?.[0]?.url) || '',
        uploaded: it.published ? it.published * 1000 : null,
        duration: it.lengthSeconds,
      }));
    }
  }
  if (!items) return [];
  if (time && time !== 'all') {
    const cutoff = Date.now() - ({ day: 864e5, '24h': 864e5, '4h': 144e5, '1h': 36e5, week: 6048e5, '7d': 6048e5, month: 2592e6, '30d': 2592e6, year: 31536e6 }[time] || 6048e5);
    items = items.filter(it => !it.uploaded || it.uploaded >= cutoff);
  }
  return items.slice(0, 40).map(it => {
    const m = (it.url || '').match(/[?&]v=([A-Za-z0-9_-]{11})|\/shorts\/([A-Za-z0-9_-]{11})/);
    const vid = m ? (m[1] || m[2]) : null;
    return {
      id: 'yt_' + (vid || it.url || it.title),
      platform: 'youtube',
      title: it.title || '',
      author: it.uploaderName || it.uploader || '',
      views: it.views || 0,
      likes: null,
      comments: null,
      pubAt: it.uploaded || null,
      thumb: vid ? 'https://i.ytimg.com/vi/' + vid + '/hqdefault.jpg' : (it.thumbnail || ''),
      url: 'https://youtube.com' + (it.url || ''),
      duration: it.duration || 0,
    };
  });
}

// ── TikTok via tikwm.com (free) ──
async function searchTikTok(q, time) {
  const tk = q
    ? 'https://www.tikwm.com/api/feed/search?keywords=' + encodeURIComponent(q) + '&count=30&cursor=0&web=1'
    : 'https://www.tikwm.com/api/feed/list?region=US&count=30';
  try {
    const r = await fetch(tk, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) return [];
    const d = await r.json();
    let items = (d.data && (d.data.videos || d.data)) || [];
    if (time && time !== 'all') {
      const cutoff = Math.floor((Date.now() - ({ day: 864e5, '24h': 864e5, '4h': 144e5, '1h': 36e5, week: 6048e5, '7d': 6048e5, month: 2592e6, '30d': 2592e6 }[time] || 6048e5)) / 1000);
      items = items.filter(it => !it.create_time || it.create_time >= cutoff);
    }
    const abs = u => !u ? '' : (u.startsWith('http') ? u : 'https://www.tikwm.com' + u);
    return items.slice(0, 30).map(it => ({
      id: 'tt_' + (it.video_id || it.id),
      platform: 'tiktok',
      title: it.title || '',
      author: it.author?.nickname || it.author?.unique_id || '',
      views: it.play_count || 0,
      likes: it.digg_count || 0,
      comments: it.comment_count || 0,
      pubAt: it.create_time ? it.create_time * 1000 : null,
      thumb: abs(it.cover || it.origin_cover || ''),
      url: 'https://www.tiktok.com/@' + (it.author?.unique_id || 'user') + '/video/' + (it.video_id || it.id),
      duration: it.duration || 0,
      download: abs(it.play || ''),
    }));
  } catch { return []; }
}

// GET /api/videos/search?q=keyword&source=all|youtube|tiktok&time=all|24h|7d|30d|1h|4h
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const source = req.query.source || 'all';
  const time = req.query.time || 'all';

  const tasks = [];
  const sources = [];
  if (source === 'all' || source === 'youtube') { tasks.push(searchYouTube(q, time)); sources.push('youtube'); }
  if (source === 'all' || source === 'tiktok') { tasks.push(searchTikTok(q, time)); sources.push('tiktok'); }

  const results = await Promise.allSettled(tasks);
  let all = [];
  const status = {};
  results.forEach((r, i) => {
    if (r.status === 'fulfilled' && r.value?.length) {
      all.push(...r.value);
      status[sources[i]] = r.value.length;
    } else {
      status[sources[i]] = 0;
    }
  });

  // Sort by views desc
  all.sort((a, b) => (b.views || 0) - (a.views || 0));

  const totalViews = all.reduce((s, x) => s + (x.views || 0), 0);
  const totalLikes = all.reduce((s, x) => s + (x.likes || 0), 0);

  res.json({ ok: true, items: all, total: all.length, totalViews, totalLikes, sources: status });
});

module.exports = router;
