const router = require('express').Router();
const socialIngest = require('../services/socialIngest');

router.get('/accounts', (req, res) => {
  res.json({ ok: true, accounts: socialIngest.getTrackedAccounts() });
});

router.get('/feed', (req, res) => {
  const feed = socialIngest.getCachedFeed();
  let items = feed.items || [];
  const plat = req.query.platform;
  if (plat) items = items.filter(i => i.source_platform === plat);
  const brand = req.query.brand;
  if (brand) items = items.filter(i => i.source_brand === brand);
  const videoOnly = req.query.video === '1';
  if (videoOnly) items = items.filter(i => i.has_video);
  res.json({ ok: true, items: items.slice(0, parseInt(req.query.limit) || 100), total: items.length, updated_at: feed.updated_at });
});

router.post('/refresh', async (req, res) => {
  try {
    const PORT = req.app.get('port') || process.env.PORT || 3033;
    const baseUrl = `http://127.0.0.1:${PORT}`;
    const result = await socialIngest.fetchAllAccounts(baseUrl);
    res.json({ ok: true, posts: result.items.length, accounts_fetched: result.accounts_fetched, accounts_failed: result.accounts_failed, by_platform: result.by_platform });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

module.exports = router;
