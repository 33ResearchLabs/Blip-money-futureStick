const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const scoringEngine = require('../services/scoring');
const clusteringEngine = require('../services/clustering');
const contentEngine = require('../services/contentEngine');
const contentQueue = require('../services/queue');
const feedbackLoop = require('../services/feedback');
const workerEngine = require('../services/worker');
const socialIngest = require('../services/socialIngest');

const DATA_DIR = path.join(__dirname, '..', 'data');
function readJSON(f, def) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return def; } }
function writeJSON(f, d) { fs.writeFileSync(f, JSON.stringify(d, null, 2)); }

// POST /api/engine/score
router.post('/score', (req, res) => {
  const data = readJSON(path.join(DATA_DIR, 'trending.json'), { items: [] });
  const weights = feedbackLoop.getWeights();
  const { top, low, threshold } = scoringEngine.scoreAndFilter(data.items, data.items, weights);
  writeJSON(path.join(DATA_DIR, 'trending.json'), { items: [...top, ...low], updated_at: Date.now() });
  res.json({ ok: true, top: top.length, low: low.length, threshold, weights });
});

router.get('/weights', (req, res) => {
  res.json({ ok: true, weights: feedbackLoop.getWeights() });
});

// GET /api/engine/clusters
router.get('/clusters', (req, res) => {
  const data = readJSON(path.join(DATA_DIR, 'clusters.json'), { clusters: [], hot: [] });
  const minScore = parseInt(req.query.min) || 0;
  let clusters = data.clusters || [];
  if (minScore) clusters = clusters.filter(c => c.cluster_score >= minScore);
  res.json({ ok: true, clusters: clusters.slice(0, parseInt(req.query.limit) || 100), total: clusters.length, hot: (data.hot || []).length, updated_at: data.updated_at });
});

// POST /api/engine/cluster
router.post('/cluster', (req, res) => {
  const data = readJSON(path.join(DATA_DIR, 'trending.json'), { items: [] });
  const top = (data.items || []).filter(i => i.priority === 'high' || !i.auto_filtered);
  const clusters = clusteringEngine.clusterTrends(top);
  const hot = clusteringEngine.getHotClusters(clusters);
  writeJSON(path.join(DATA_DIR, 'clusters.json'), { clusters, hot, updated_at: Date.now() });
  res.json({ ok: true, total: clusters.length, hot: hot.length });
});

// POST /api/engine/generate
router.post('/generate', (req, res) => {
  const { trend_id, threshold } = req.body || {};
  const clusterData = readJSON(path.join(DATA_DIR, 'clusters.json'), { clusters: [], hot: [] });

  let targets;
  if (trend_id) {
    targets = clusterData.clusters.filter(c => c.cluster_id === trend_id);
  } else {
    targets = clusterData.hot || [];
  }

  const generated = contentEngine.batchGenerate(targets, threshold || 50);
  res.json({ ok: true, count: generated.length, content: generated });
});

// POST /api/engine/generate-single
router.post('/generate-single', (req, res) => {
  const trend = req.body;
  if (!trend || !trend.title) return res.json({ ok: false, error: 'need trend object with title' });
  const content = contentEngine.generateContent(trend);
  res.json({ ok: true, content });
});

// GET /api/engine/dashboard
router.get('/dashboard', (req, res) => {
  const trending = readJSON(path.join(DATA_DIR, 'trending.json'), { items: [] });
  const clusters = readJSON(path.join(DATA_DIR, 'clusters.json'), { clusters: [], hot: [] });
  const queueStats = contentQueue.getStats();
  const perfSummary = feedbackLoop.getSummary();
  const workerState = workerEngine.getState();
  const latency = contentQueue.getLatencyStats();

  const topItems = (trending.items || []).filter(i => i.priority === 'high').slice(0, 10);
  const socialFeed = socialIngest.getCachedFeed();
  const socialItems = socialFeed.items || [];
  const socialWithVideo = socialItems.filter(i => i.has_video);

  res.json({
    ok: true,
    trending: { total: (trending.items || []).length, top: topItems.length, updated_at: trending.updated_at },
    social: { total: socialItems.length, with_video: socialWithVideo.length, updated_at: socialFeed.updated_at, top_posts: socialItems.slice(0, 10) },
    clusters: { total: (clusters.clusters || []).length, hot: (clusters.hot || []).length, top_clusters: (clusters.hot || []).slice(0, 5) },
    queue: queueStats,
    performance: perfSummary,
    worker: { enabled: workerState.enabled, last_run: workerState.last_run, runs: workerState.runs, auto_generate: workerState.auto_generate, interval_ms: workerState.interval_ms },
    latency,
    top_trends: topItems,
  });
});

module.exports = router;
