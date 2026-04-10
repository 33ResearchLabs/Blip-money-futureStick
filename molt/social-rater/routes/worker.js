const router = require('express').Router();
const workerEngine = require('../services/worker');

router.get('/state', (req, res) => {
  res.json({ ok: true, ...workerEngine.getState() });
});

router.get('/logs', (req, res) => {
  res.json({ ok: true, logs: workerEngine.getLogs(parseInt(req.query.limit) || 50) });
});

router.post('/run', async (req, res) => {
  const report = await req.app.locals.workerHandle.runNow();
  res.json({ ok: true, report });
});

router.post('/config', (req, res) => {
  const state = workerEngine.getState();
  if (req.body.enabled !== undefined) state.enabled = !!req.body.enabled;
  if (req.body.auto_generate !== undefined) state.auto_generate = !!req.body.auto_generate;
  if (req.body.score_threshold) state.score_threshold = parseInt(req.body.score_threshold);
  if (req.body.interval_ms) state.interval_ms = Math.max(60000, parseInt(req.body.interval_ms));
  workerEngine.saveState(state);
  res.json({ ok: true, state });
});

module.exports = router;
