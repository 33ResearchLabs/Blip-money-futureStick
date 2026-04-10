const router = require('express').Router();
const db = require('../services/database');

router.get('/', (req, res) => {
  const k = req.query.k;
  if (!k) return res.json({ ok: false, error: 'no key' });
  const value = db.kvGet(k);
  res.json({ ok: true, value });
});

router.post('/', (req, res) => {
  const { k, v } = req.body;
  if (!k) return res.json({ ok: false, error: 'no key' });
  db.kvSet(k, v);
  res.json({ ok: true });
});

module.exports = router;
