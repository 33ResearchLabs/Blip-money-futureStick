const router = require('express').Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const IMG_CACHE_DIR = path.join(DATA_DIR, 'img_cache');
if (!fs.existsSync(IMG_CACHE_DIR)) fs.mkdirSync(IMG_CACHE_DIR, { recursive: true });

const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const writeJSON = (f, d) => { fs.writeFileSync(f, JSON.stringify(d, null, 2)); };

const AI_KEY = process.env.ANTHROPIC_API_KEY || '';
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || readJSON(path.join(DATA_DIR, 'gemini_key.json'), {}).key || '';

function imgCacheKey(prompt, w, h) {
  return crypto.createHash('md5').update(prompt + w + h).digest('hex');
}

async function generateImageGemini(prompt) {
  const models = ['gemini-2.5-flash-image', 'gemini-3.1-flash-image-preview'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Generate an image: ' + prompt.slice(0, 800) }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
        timeout: 30000,
      });
      if (!r.ok) {
        const err = await r.text().catch(() => '');
        if (err.includes('quota')) throw new Error('quota exceeded');
        console.log('[imagegen] Gemini', model, 'failed:', r.status);
        continue;
      }
      const d = await r.json();
      const parts = d.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find(p => p.inlineData);
      if (imgPart) {
        console.log('[imagegen] Gemini', model, 'OK');
        return Buffer.from(imgPart.inlineData.data, 'base64');
      }
    } catch (e) {
      if (e.message.includes('quota')) throw e;
      console.log('[imagegen] Gemini', model, 'error:', e.message);
    }
  }
  throw new Error('Gemini image gen failed');
}

async function generateImage(prompt, w, h, seed) {
  const cacheKey = imgCacheKey(prompt, w, h);
  const cachePath = path.join(IMG_CACHE_DIR, cacheKey + '.jpg');
  if (fs.existsSync(cachePath)) return { cached: true, path: cachePath };

  if (GEMINI_KEY) {
    try {
      const buf = await generateImageGemini(prompt);
      fs.writeFileSync(cachePath, buf);
      console.log('[imagegen] Gemini OK, cached:', cacheKey);
      return { cached: false, path: cachePath, provider: 'gemini' };
    } catch (e) {
      console.log('[imagegen] Gemini failed:', e.message);
    }
  }

  const shortPrompt = prompt.replace(/,\s*(absolutely )?no text[^,]*/gi, '').slice(0, 200);
  const imgW = Math.min(w, 512);
  const imgH = Math.min(h, 512);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const s2 = seed + attempt * 111;
      const model = attempt === 1 ? '&model=flux' : '';
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(shortPrompt)}?width=${imgW}&height=${imgH}&seed=${s2}&nologo=true${model}`;
      console.log('[imagegen] Pollinations attempt', attempt + 1, 'w='+imgW, 'prompt='+shortPrompt.slice(0,60)+'...');
      const r = await fetch(url, { timeout: 45000 });
      if (r.ok) {
        const buffer = await r.buffer();
        if (buffer.length > 1000) {
          fs.writeFileSync(cachePath, buffer);
          console.log('[imagegen] Pollinations OK, size:', buffer.length, 'cached:', cacheKey);
          return { cached: false, path: cachePath, provider: 'pollinations' };
        }
      }
      console.log('[imagegen] Pollinations attempt', attempt + 1, 'failed:', r.status);
    } catch (e) {
      console.log('[imagegen] Pollinations attempt', attempt + 1, 'error:', e.message);
    }
    if (attempt < 2) await new Promise(r => setTimeout(r, 3000));
  }
  return null;
}

// POST /api/ai
router.post('/ai', async (req, res) => {
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
    const text = (j.content && j.content[0] && j.content[0].text) || '';
    res.json({ ok: true, text, content: j.content, usage: j.usage });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// POST /api/ai/key
router.post('/ai/key', (req, res) => {
  const { key } = req.body;
  if (!key) return res.json({ ok: false });
  writeJSON(path.join(DATA_DIR, 'ai_key.json'), { key, set_at: Date.now() });
  res.json({ ok: true });
});

// POST /api/imagegen
router.post('/imagegen', async (req, res) => {
  const { prompt, width, height, seed } = req.body;
  if (!prompt) return res.status(400).json({ ok: false, error: 'no prompt' });
  const w = Math.min(width || 1024, 1536);
  const h = Math.min(height || 1024, 1536);
  const s = seed || Math.floor(Math.random() * 999999);
  try {
    const result = await generateImage(prompt, w, h, s);
    if (!result) throw new Error('image gen failed — click regenerate');
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    if (result.cached) res.set('X-Cache', 'HIT');
    if (result.provider) res.set('X-Provider', result.provider);
    res.sendFile(result.path);
  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
});

// Cleanup old cached images (>7 days)
setTimeout(() => {
  try {
    const now = Date.now();
    fs.readdirSync(IMG_CACHE_DIR).forEach(f => {
      const fp = path.join(IMG_CACHE_DIR, f);
      if (now - fs.statSync(fp).mtimeMs > 7 * 86400000) fs.unlinkSync(fp);
    });
  } catch {}
}, 10000);

module.exports = router;
