const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function kvPath(k) { return path.join(DATA_DIR, 'kv_' + k.replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function readJSON(f, def) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return def; } }
function writeJSON(f, d) { fs.writeFileSync(f, JSON.stringify(d, null, 2)); }

router.get('/', (req, res) => {
  const k = req.query.k;
  if (!k) return res.json({ ok: false, error: 'no key' });
  const d = readJSON(kvPath(k), null);
  res.json({ ok: true, value: d });
});

router.post('/', (req, res) => {
  const { k, v } = req.body;
  if (!k) return res.json({ ok: false, error: 'no key' });
  writeJSON(kvPath(k), v);
  res.json({ ok: true });
});

module.exports = router;
