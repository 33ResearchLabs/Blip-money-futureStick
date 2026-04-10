const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  const niche = req.query.niche || 'tech';
  try {
    const r = await fetch(`https://www.reddit.com/r/${niche}/hot.json?limit=10`, {
      headers: { 'User-Agent': 'SocialRater/1.0' }, timeout: 8000
    });
    const d = await r.json();
    const items = (d.data?.children || []).filter(c => !c.data?.stickied).map(c => ({
      title: c.data?.title,
      url: c.data?.url,
      ups: c.data?.ups,
      comments: c.data?.num_comments,
      sub: c.data?.subreddit,
    }));
    res.json({ ok: true, items });
  } catch (e) {
    res.json({ ok: true, items: [] });
  }
});

module.exports = router;
