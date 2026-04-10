const router = require('express').Router();
const feedbackLoop = require('../services/feedback');

router.post('/record', (req, res) => {
  const entry = feedbackLoop.recordPerformance(req.body);
  res.json({ ok: true, entry });
});

router.get('/', (req, res) => {
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

router.get('/summary', (req, res) => {
  res.json({ ok: true, ...feedbackLoop.getSummary() });
});

router.post('/adjust', (req, res) => {
  const result = feedbackLoop.adjustWeights();
  res.json({ ok: true, ...result });
});

module.exports = router;
