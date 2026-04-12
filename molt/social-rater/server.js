const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const workerEngine = require('./services/worker');
const db = require('./services/database');

const app = express();
const PORT = process.env.PORT || 3033;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data dir
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Serve React frontend (production build)
const CLIENT_DIST = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use('/33/app', express.static(CLIENT_DIST));
}

// Run JSON→SQLite migration on first boot
db.migrateFromJSON();

// Store PORT for social refresh baseUrl
app.set('port', PORT);

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/kv', require('./routes/kv'));
app.use('/api', require('./routes/ai'));
app.use('/api/engine', require('./routes/engine'));
app.use('/api/queue', require('./routes/queue'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/worker', require('./routes/worker'));
app.use('/api/social', require('./routes/social'));
app.use('/api/radar', require('./routes/radar'));
app.use('/api/publish', require('./routes/publish'));
app.use('/api/shares', require('./routes/shares'));
app.use('/api/account-sync', require('./routes/account-sync'));
app.use('/api/videos', require('./routes/video-search'));
app.use('/dl', require('./routes/download'));

// /api/checkhandle lives outside /dl — reuse download router's handler
const fetch = require('node-fetch');
app.get('/api/checkhandle', async (req, res) => {
  const u = req.query.u;
  if (!u) return res.json({ ok: false });
  try {
    const r = await fetch(`https://www.instagram.com/${u}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      redirect: 'manual'
    });
    res.json({ ok: true, exists: r.status === 200, platform: 'instagram', handle: u });
  } catch {
    res.json({ ok: true, exists: false, handle: u });
  }
});

// SPA fallback — serve React app for /app/* routes
if (fs.existsSync(CLIENT_DIST)) {
  app.get('/33/app/{*splat}', (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

// ============ START ============
const wsManager = require('./services/websocket');

const server = app.listen(PORT, () => {
  console.log(`\n  ⚡ Social Rater server running on http://localhost:${PORT}\n`);
  console.log(`  🆕 React app: http://localhost:${PORT}/app/`);
  console.log(`  🔥 Virality engine: scoring → clustering → content → queue → feedback`);
  console.log(`  💾 Data dir: ${DATA_DIR}\n`);

  // Boot WebSocket
  wsManager.init(server);

  // Boot virality worker
  const dl = require('./routes/download');
  app.locals.workerHandle = workerEngine.startWorker(dl.fetchTrending);
  console.log('  🤖 Background worker started (15 min cycle)');

  // Boot account sync — first run after 30s, then every 30 min
  const accountSync = require('./routes/account-sync');
  setTimeout(() => {
    console.log('  📊 Account sync: first run...');
    accountSync.syncAll(`http://127.0.0.1:${PORT}`).then(r => console.log(`  📊 Synced ${r.synced} accounts`)).catch(() => {});
  }, 30000);
  setInterval(() => {
    accountSync.syncAll(`http://127.0.0.1:${PORT}`).then(r => console.log(`[account-sync] refreshed ${r.synced} accounts`)).catch(() => {});
  }, 30 * 60 * 1000);
  console.log('  📊 Account sync: auto-fetch every 30 min');

  // Boot video crawler — first run after 20s, then every 30 min
  const videoCrawler = require('./services/videoCrawler');
  setTimeout(() => {
    console.log('  🎬 Video crawler: first run...');
    videoCrawler.crawlAll().then(r => console.log(`  🎬 Crawled ${r.total} videos`)).catch(() => {});
  }, 20000);
  setInterval(() => {
    videoCrawler.crawlAll().then(r => console.log(`[videoCrawler] refreshed ${r.total} videos`)).catch(() => {});
  }, 30 * 60 * 1000);
  console.log('  🎬 Video crawler: auto-fetch every 30 min\n');
});
