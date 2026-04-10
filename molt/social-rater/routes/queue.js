const router = require('express').Router();
const contentQueue = require('../services/queue');

router.get('/', (req, res) => {
  const filters = {
    status: req.query.status,
    platform: req.query.platform,
    priority: req.query.priority,
    emotion: req.query.emotion,
    limit: parseInt(req.query.limit) || 100,
  };
  res.json({ ok: true, ...contentQueue.getQueue(filters) });
});

router.get('/stats', (req, res) => {
  res.json({ ok: true, ...contentQueue.getStats() });
});

router.post('/add', (req, res) => {
  const content = req.body;
  if (!content) return res.json({ ok: false, error: 'no content' });
  const item = contentQueue.enqueue(content, { priority: req.body.priority, notes: req.body.notes });
  res.json({ ok: true, item });
});

router.post('/status', (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) return res.json({ ok: false, error: 'need id + status' });
  const item = contentQueue.updateStatus(id, status);
  if (!item) return res.json({ ok: false, error: 'not found' });
  res.json({ ok: true, item });
});

router.post('/remove', (req, res) => {
  contentQueue.remove(req.body.id);
  res.json({ ok: true });
});

router.get('/latency', (req, res) => {
  res.json({ ok: true, ...contentQueue.getLatencyStats() });
});

module.exports = router;
