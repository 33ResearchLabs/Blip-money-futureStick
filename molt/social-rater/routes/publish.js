const router = require('express').Router();
const publisher = require('../services/publisher');
const db = require('../services/database');
const { requireAuth, requireRole } = require('../services/authMiddleware');

router.get('/status', requireAuth, (req, res) => {
  res.json({ ok: true, platforms: publisher.getStatus() });
});

router.post('/config', requireAuth, requireRole('admin'), (req, res) => {
  const { platform, credentials } = req.body;
  if (!platform || !credentials) return res.json({ ok: false, error: 'platform and credentials required' });
  try {
    db.kvSet(`publish_creds_${platform}`, credentials);
    res.json({ ok: true });
  } catch (e) { res.json({ ok: false, error: e.message }); }
});

router.post('/post', requireAuth, requireRole('admin', 'editor'), async (req, res) => {
  const { platform, content, queue_id } = req.body;
  if (!platform || !content) return res.json({ ok: false, error: 'platform and content required' });
  try {
    const result = await publisher.publish(platform, content);
    if (result.ok && queue_id) {
      db.updateQueueStatus(queue_id, 'published');
    }
    res.json(result);
  } catch (e) { res.json({ ok: false, error: e.message }); }
});

module.exports = router;
