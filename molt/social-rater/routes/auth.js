const router = require('express').Router();
const auth = require('../services/auth');
const { requireAuth, requireRole } = require('../services/authMiddleware');

router.post('/login', async (req, res) => {
  try { res.json(await auth.login(req.body.email, req.body.password)); }
  catch (e) { res.json({ ok: false, error: e.message }); }
});

router.post('/register', requireAuth, requireRole('admin'), async (req, res) => {
  try { const { email, password, name, role } = req.body; res.json(await auth.register(email, password, name, role)); }
  catch (e) { res.json({ ok: false, error: e.message }); }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

router.get('/users', requireAuth, requireRole('admin'), (req, res) => {
  try { res.json({ ok: true, users: auth.getUsers() }); }
  catch (e) { res.json({ ok: false, error: e.message }); }
});

router.post('/delete', requireAuth, requireRole('admin'), (req, res) => {
  try { res.json(auth.deleteUser(req.body.id)); }
  catch (e) { res.json({ ok: false, error: e.message }); }
});

router.post('/role', requireAuth, requireRole('admin'), (req, res) => {
  try { res.json(auth.updateRole(req.body.id, req.body.role)); }
  catch (e) { res.json({ ok: false, error: e.message }); }
});

module.exports = router;
