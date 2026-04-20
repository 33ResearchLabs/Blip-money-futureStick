const router = require('express').Router();
const fetch = require('node-fetch');
const { exec } = require('child_process');
const { promisify } = require('util');
const execP = promisify(exec);
const db = require('../services/database');

const YTDLP = process.env.YTDLP_PATH || '/home/blipmoney9/.local/bin/yt-dlp';
const YTDLP_ENV = { ...process.env, PATH: (process.env.PATH || '') + ':/home/blipmoney9/.local/bin' };

// Niche → discovery queries (tunable)
const NICHE_QUERIES = {
  lifestyle: ['luxury lifestyle', 'daily routine motivation', 'morning routine', 'aesthetic life', 'rich lifestyle'],
  finance:   ['passive income', 'investing tips', 'money mistakes', 'millionaire habits', 'wealth building'],
  crypto:    ['crypto trading', 'bitcoin prediction', 'altcoin gems', 'memecoin pump', 'crypto explained'],
};

// Platform view thresholds (7d)
const THRESHOLDS = {
  youtube:   100_000,
  instagram: 200_000,
  tiktok:    500_000,
  x:          10_000,
};

function sevenDaysAgo() { return Date.now() - 7 * 86400_000; }
function toInt(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') { const m = v.replace(/,/g, '').match(/([\d.]+)\s*([KkMm]?)/); if (!m) return 0; let x = parseFloat(m[1]); if (/[Kk]/.test(m[2])) x *= 1000; if (/[Mm]/.test(m[2])) x *= 1e6; return Math.round(x); }
  return 0;
}

// ── YouTube Shorts via yt-dlp ────────────────────────────────────────────────
async function scrapeYouTube(query, limit = 25) {
  const qEsc = query.replace(/"/g, '\\"');
  try {
    const { stdout } = await execP(
      `${YTDLP} --flat-playlist -j --playlist-items 1-${limit} "ytsearch${limit}:${qEsc} #shorts"`,
      { timeout: 60_000, env: YTDLP_ENV, maxBuffer: 20 * 1024 * 1024 },
    );
    const items = [];
    for (const line of stdout.trim().split('\n')) {
      try {
        const d = JSON.parse(line);
        const pub = d.timestamp ? d.timestamp * 1000 : (d.release_timestamp ? d.release_timestamp * 1000 : null);
        // Keep short-ish content OR anything in the last 7d
        if (d.duration && d.duration > 180 && (!pub || pub < sevenDaysAgo())) continue;
        items.push({
          id: 'yt_' + d.id,
          platform: 'youtube',
          title: d.title || '',
          caption: d.title || '',
          url: `https://www.youtube.com/watch?v=${d.id}`,
          author: d.channel || d.uploader || '',
          views: toInt(d.view_count),
          likes: toInt(d.like_count),
          comments: toInt(d.comment_count),
          duration: d.duration || 0,
          thumb: d.thumbnails?.[d.thumbnails.length - 1]?.url || '',
          published_at: pub,
          raw: d,
        });
      } catch {}
    }
    return items;
  } catch (e) {
    console.log('[growth] YT scrape failed:', e.message);
    return [];
  }
}

// ── TikTok via yt-dlp hashtag URLs ───────────────────────────────────────────
async function scrapeTikTok(query, limit = 25) {
  const tag = query.replace(/\s+/g, '').toLowerCase();
  try {
    const { stdout } = await execP(
      `${YTDLP} --flat-playlist -j --playlist-items 1-${limit} "https://www.tiktok.com/tag/${encodeURIComponent(tag)}"`,
      { timeout: 90_000, env: YTDLP_ENV, maxBuffer: 20 * 1024 * 1024 },
    );
    const items = [];
    for (const line of stdout.trim().split('\n')) {
      try {
        const d = JSON.parse(line);
        const pub = d.timestamp ? d.timestamp * 1000 : null;
        items.push({
          id: 'tt_' + d.id,
          platform: 'tiktok',
          title: (d.title || '').slice(0, 280),
          caption: d.title || d.description || '',
          url: d.webpage_url || d.url || `https://www.tiktok.com/@${d.uploader}/video/${d.id}`,
          author: d.uploader || d.channel || '',
          views: toInt(d.view_count),
          likes: toInt(d.like_count),
          comments: toInt(d.comment_count),
          duration: d.duration || 0,
          thumb: d.thumbnails?.[d.thumbnails.length - 1]?.url || '',
          published_at: pub,
          raw: d,
        });
      } catch {}
    }
    return items;
  } catch (e) {
    console.log('[growth] TT scrape failed:', e.message);
    return [];
  }
}

// ── Instagram Reels via hashtag/explore (via yt-dlp) ─────────────────────────
async function scrapeInstagram(query, limit = 20) {
  const tag = query.replace(/\s+/g, '').toLowerCase();
  try {
    const { stdout } = await execP(
      `${YTDLP} --flat-playlist -j --playlist-items 1-${limit} "https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/"`,
      { timeout: 90_000, env: YTDLP_ENV, maxBuffer: 20 * 1024 * 1024 },
    );
    const items = [];
    for (const line of stdout.trim().split('\n')) {
      try {
        const d = JSON.parse(line);
        const pub = d.timestamp ? d.timestamp * 1000 : null;
        items.push({
          id: 'ig_' + d.id,
          platform: 'instagram',
          title: (d.title || d.description || '').slice(0, 280),
          caption: d.description || d.title || '',
          url: d.webpage_url || d.url || `https://www.instagram.com/reel/${d.id}/`,
          author: d.uploader || d.channel || '',
          views: toInt(d.view_count || d.play_count),
          likes: toInt(d.like_count),
          comments: toInt(d.comment_count),
          duration: d.duration || 0,
          thumb: d.thumbnails?.[d.thumbnails.length - 1]?.url || '',
          published_at: pub,
          raw: d,
        });
      } catch {}
    }
    return items;
  } catch (e) {
    console.log('[growth] IG scrape failed:', e.message);
    return [];
  }
}

const SCRAPERS = {
  youtube: scrapeYouTube,
  tiktok: scrapeTikTok,
  instagram: scrapeInstagram,
};

// POST /api/growth/scrape
// body: { niche?: 'lifestyle'|'finance'|'crypto'|'all', platform?: 'youtube'|'tiktok'|'instagram'|'all' }
router.post('/scrape', async (req, res) => {
  const niches = req.body.niche && req.body.niche !== 'all' ? [req.body.niche] : Object.keys(NICHE_QUERIES);
  const platforms = req.body.platform && req.body.platform !== 'all' ? [req.body.platform] : ['youtube', 'tiktok', 'instagram'];
  const now = Date.now();
  const results = { scraped: 0, kept: 0, by_niche_platform: {} };

  for (const niche of niches) {
    const queries = NICHE_QUERIES[niche] || [];
    for (const platform of platforms) {
      const scraper = SCRAPERS[platform];
      if (!scraper) continue;
      const all = [];
      for (const q of queries) {
        const items = await scraper(q, 25);
        for (const it of items) {
          it.niche = niche;
          it.source_query = q;
          it.scraped_at = now;
        }
        all.push(...items);
      }
      results.scraped += all.length;
      // Dedupe by id (last wins — max views applied in upsert)
      const dedup = {};
      for (const it of all) dedup[it.id] = it;
      const threshold = THRESHOLDS[platform] || 10_000;
      const kept = Object.values(dedup).filter(it => it.views >= threshold);
      if (kept.length) {
        const rows = kept.map(it => ({
          ...it,
          raw: JSON.stringify(it.raw || {}),
        }));
        db.upsertWinners(rows);
        results.kept += kept.length;
      }
      results.by_niche_platform[`${niche}/${platform}`] = { scraped: all.length, kept: kept.length };
    }
  }
  res.json({ ok: true, ...results });
});

// ── Pattern Miner — LLM extracts DNA for each winner ─────────────────────────
async function callAI(prompt, max_tokens = 800) {
  const r = await fetch('http://127.0.0.1:' + (process.env.PORT || 3033) + '/api/ai', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ max_tokens, messages: [{ role: 'user', content: prompt }] }),
  });
  const j = await r.json();
  let txt = (j.content && j.content[0] && j.content[0].text) || j.text || '';
  txt = txt.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  const m = txt.match(/\{[\s\S]*\}/);
  if (m) txt = m[0];
  return txt;
}

function buildMinerPrompt(w) {
  return `You are a social media pattern analyst. Extract the STRUCTURAL DNA of this winning ${w.platform} ${w.duration && w.duration <= 60 ? 'short-form video' : 'video'}.

TITLE: "${(w.title || '').slice(0, 200)}"
AUTHOR: @${w.author || 'unknown'}
VIEWS: ${w.views?.toLocaleString() || 0}
LIKES: ${w.likes?.toLocaleString() || 0}
DURATION: ${w.duration || 0}s

Return STRICT JSON (no markdown, no prose):
{
  "hook_type": "question | stat_bomb | contrarian | pov | disruptor | story",
  "hook_text": "the likely first 1-2 second verbatim text of the hook (infer from title)",
  "topic_cluster": "a 2-3 word topic label (e.g. passive-income-myths, altcoin-gems, morning-routines)",
  "emotion": "curiosity | fear | aspiration | outrage | fomo | humor",
  "format": "talking_head | text_overlay | b_roll | slideshow | meme | other",
  "length_bucket": "0-15 | 15-30 | 30-60 | 60+",
  "structure": "a short phrase capturing the structural arc, e.g. 'hook > stat > 3-beat list > CTA'",
  "visual_cue": "jump_cut | zoom | pan | static | face_zoom | screen_record | other",
  "strengths": ["1-5 concrete reasons this post works"]
}`;
}

// POST /api/growth/mine-dna
// body: { niche?, platform?, limit? }  — mines unmined winners, up to limit
router.post('/mine-dna', async (req, res) => {
  const { niche, platform } = req.body || {};
  const limit = Math.min(parseInt(req.body?.limit) || 20, 100);
  const pending = db.getUnminedWinners({ niche, platform, limit });
  const out = { total: pending.length, mined: 0, failed: 0, samples: [] };
  for (const w of pending) {
    try {
      const txt = await callAI(buildMinerPrompt(w), 700);
      const dna = JSON.parse(txt);
      db.upsertPattern({
        winner_id: w.id,
        niche: w.niche,
        platform: w.platform,
        hook_type: dna.hook_type || null,
        hook_text: (dna.hook_text || '').slice(0, 280),
        topic_cluster: dna.topic_cluster || null,
        emotion: dna.emotion || null,
        format: dna.format || null,
        length_bucket: dna.length_bucket || null,
        structure: (dna.structure || '').slice(0, 280),
        visual_cue: dna.visual_cue || null,
        strengths: JSON.stringify(Array.isArray(dna.strengths) ? dna.strengths.slice(0, 5) : []),
        mined_at: Date.now(),
      });
      out.mined++;
      if (out.samples.length < 5) out.samples.push({ id: w.id, dna });
    } catch (e) {
      out.failed++;
      console.log('[growth] mine failed for', w.id, e.message);
    }
  }
  res.json({ ok: true, ...out });
});

// GET /api/growth/winners?niche=&platform=&limit=&mined=1
router.get('/winners', (req, res) => {
  const { niche, platform, limit } = req.query;
  const mined = req.query.mined === '1' ? true : req.query.mined === '0' ? false : undefined;
  const rows = db.getWinners({ niche, platform, limit: parseInt(limit) || 100, mined });
  res.json({ ok: true, count: rows.length, items: rows });
});

// GET /api/growth/library?niche=&platform=
router.get('/library', (req, res) => {
  const { niche, platform } = req.query;
  res.json({ ok: true, niche: niche || 'all', platform: platform || 'all', library: db.getLibrary({ niche, platform }) });
});

// GET /api/growth/stats
router.get('/stats', (_req, res) => {
  res.json({ ok: true, stats: db.getWinnersStats() });
});

// POST /api/growth/score-draft
// body: { niche, platform, draft }
router.post('/score-draft', async (req, res) => {
  const { niche, platform, draft } = req.body || {};
  if (!draft) return res.json({ ok: false, error: 'no draft' });
  const lib = db.getLibrary({ niche, platform });
  const topWinners = db.getWinners({ niche, platform, limit: 8, mined: true });
  const examples = topWinners.map((w, i) =>
    `#${i + 1} [${w.hook_type || '?'} · ${w.emotion || '?'} · ${w.format || '?'}] "${(w.title || '').slice(0, 100)}" — ${w.views?.toLocaleString()} views`
  ).join('\n');
  const dist = (arr) => (arr || []).slice(0, 5).map(x => `${x.key}(${x.n})`).join(', ');
  const prompt = `You are a growth coach. Score a ${platform || 'video'} draft for the ${niche || 'mixed'} niche.

CURRENT WINNING PATTERNS (this niche, distribution from ${lib.total} mined winners):
- Hooks: ${dist(lib.hooks)}
- Emotions: ${dist(lib.emotions)}
- Formats: ${dist(lib.formats)}
- Lengths: ${dist(lib.lengths)}
- Topics: ${dist(lib.topics)}

RECENT TOP WINNERS:
${examples || '(no winners mined yet)'}

USER DRAFT:
"""${draft.slice(0, 600)}"""

Return STRICT JSON:
{
  "score": 0-100,
  "verdict": "one-sentence blunt verdict",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "hook_alternatives": ["5 rewritten hooks tuned to the winning patterns above"],
  "fix_actions": ["3 concrete changes to make before posting"]
}`;
  try {
    const txt = await callAI(prompt, 1200);
    res.json({ ok: true, report: JSON.parse(txt) });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

module.exports = router;
