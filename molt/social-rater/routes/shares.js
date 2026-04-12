const router = require('express').Router();
const db = require('../services/database');
const { requireAuth } = require('../services/authMiddleware');
const auth = require('../services/auth');

// POST /api/shares — send a link/video/news to team or specific user
router.post('/', requireAuth, (req, res) => {
  const { to_user, type, title, url, thumb, note, source, platform, action } = req.body;
  if (!url && !title) return res.json({ ok: false, error: 'need url or title' });
  const id = db.addShare({
    from_user: req.user.email,
    from_name: req.user.name || req.user.email,
    to_user: to_user || 'all', // 'all' = everyone
    type: type || 'link', // link, video, news, publish
    title, url, thumb, note, source, platform,
    action: action || 'review', // review, publish, remix, discuss
  });
  res.json({ ok: true, id });
});

// GET /api/shares — get shares for current user (inbox)
router.get('/', requireAuth, (req, res) => {
  const status = req.query.status || undefined;
  const items = db.getShares({ to_user: req.user.email, status, limit: parseInt(req.query.limit) || 50 });
  res.json({ ok: true, items, total: items.length });
});

// GET /api/shares/unread — get unread count for badge
router.get('/unread', requireAuth, (req, res) => {
  const count = db.getUnreadCount(req.user.email);
  res.json({ ok: true, count });
});

// POST /api/shares/:id/read — mark as read
router.post('/:id/read', requireAuth, (req, res) => {
  db.updateShare(req.params.id, { status: 'read', read_at: Date.now() });
  res.json({ ok: true });
});

// POST /api/shares/:id/done — mark as done/published
router.post('/:id/done', requireAuth, (req, res) => {
  db.updateShare(req.params.id, { status: 'done' });
  res.json({ ok: true });
});

// GET /api/shares/users — list all users (for the "to" dropdown)
router.get('/users', requireAuth, (req, res) => {
  const users = auth.getUsers().map(u => ({ email: u.email, name: u.name, role: u.role }));
  res.json({ ok: true, users });
});

// GET /api/shares/sent — what I sent
router.get('/sent', requireAuth, (req, res) => {
  let sql = 'SELECT * FROM shares WHERE from_user = ? ORDER BY created_at DESC LIMIT ?';
  const items = db.db.prepare(sql).all(req.user.email, parseInt(req.query.limit) || 50);
  res.json({ ok: true, items });
});

module.exports = router;
