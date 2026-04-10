const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'social-rater.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- Schema ---
db.exec(`
CREATE TABLE IF NOT EXISTS trending (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, url TEXT, source TEXT,
  category TEXT DEFAULT 'general', published_at INTEGER, fetched_at INTEGER,
  ups INTEGER DEFAULT 0, comments INTEGER DEFAULT 0, views INTEGER DEFAULT 0,
  trend_score REAL DEFAULT 0, velocity REAL DEFAULT 0, velocity_score REAL DEFAULT 0,
  cross_platform_score REAL DEFAULT 0, emotion TEXT DEFAULT 'neutral',
  emotion_score REAL DEFAULT 0, emotion_detail TEXT, format TEXT DEFAULT 'unknown',
  format_score REAL DEFAULT 0, scored_at INTEGER, priority TEXT DEFAULT 'low',
  auto_filtered INTEGER DEFAULT 0, thumb TEXT, has_video INTEGER DEFAULT 0,
  video_url TEXT, nsfw INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS clusters (
  cluster_id TEXT PRIMARY KEY, label TEXT, keywords TEXT, item_ids TEXT,
  item_count INTEGER DEFAULT 0, cluster_score REAL DEFAULT 0, avg_score REAL DEFAULT 0,
  max_score REAL DEFAULT 0, sources TEXT, source_count INTEGER DEFAULT 0,
  emotion TEXT, format TEXT, created_at INTEGER, is_hot INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS queue (
  id TEXT PRIMARY KEY, status TEXT DEFAULT 'pending', trend_id TEXT, trend_title TEXT,
  trend_score REAL DEFAULT 0, emotion TEXT, format TEXT, platforms TEXT, hooks TEXT,
  aggressive TEXT, angles TEXT, scripts TEXT, captions TEXT, keywords TEXT, sources TEXT,
  queued_at INTEGER, detection_time INTEGER, generation_time INTEGER,
  scheduled_at INTEGER, published_at INTEGER, priority TEXT DEFAULT 'normal',
  notes TEXT, auto_generated INTEGER DEFAULT 0, reviewed INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, url TEXT, description TEXT,
  source TEXT, type TEXT DEFAULT 'general', published_at INTEGER,
  fetched_at INTEGER, image TEXT
);
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY, handle TEXT NOT NULL, platform TEXT NOT NULL,
  added_by TEXT DEFAULT 'web', added_at INTEGER
);
CREATE TABLE IF NOT EXISTS vault (
  id TEXT PRIMARY KEY, title TEXT, url TEXT, source TEXT, type TEXT,
  content TEXT, caption TEXT, image TEXT, saved_at INTEGER
);
CREATE TABLE IF NOT EXISTS performance (
  id INTEGER PRIMARY KEY AUTOINCREMENT, platform TEXT, views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0, comments INTEGER DEFAULT 0, shares INTEGER DEFAULT 0,
  watch_time REAL, retention REAL, engagement_rate REAL, emotion TEXT, format TEXT,
  trend_score REAL, keywords TEXT, recorded_at INTEGER
);
CREATE TABLE IF NOT EXISTS kv (
  key TEXT PRIMARY KEY, value TEXT, updated_at INTEGER
);
CREATE TABLE IF NOT EXISTS worker_state (
  id INTEGER PRIMARY KEY DEFAULT 1, last_run INTEGER, runs INTEGER DEFAULT 0,
  last_clusters INTEGER DEFAULT 0, last_generated INTEGER DEFAULT 0,
  last_queued INTEGER DEFAULT 0, running INTEGER DEFAULT 0,
  interval_ms INTEGER DEFAULT 900000, auto_generate INTEGER DEFAULT 1,
  score_threshold INTEGER DEFAULT 50, enabled INTEGER DEFAULT 1, last_report TEXT
);
CREATE TABLE IF NOT EXISTS worker_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER, message TEXT, error TEXT
);

CREATE INDEX IF NOT EXISTS idx_trending_category ON trending(category);
CREATE INDEX IF NOT EXISTS idx_trending_score ON trending(trend_score);
CREATE INDEX IF NOT EXISTS idx_queue_status ON queue(status);
CREATE INDEX IF NOT EXISTS idx_news_type ON news(type);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_perf_platform ON performance(platform);
`);

// --- Helpers ---
const JSON_FIELDS = {
  clusters: ['keywords', 'item_ids', 'sources'],
  queue: ['platforms', 'hooks', 'angles', 'keywords', 'sources'],
  queue_obj: ['aggressive', 'scripts', 'captions'],
};

function parseJSON(val) { try { return JSON.parse(val); } catch { return val; } }
function toJSON(val) { return val == null ? null : JSON.stringify(val); }

function parseRow(row, table) {
  if (!row) return null;
  const fields = JSON_FIELDS[table] || [];
  const objFields = JSON_FIELDS[table + '_obj'] || [];
  const out = { ...row };
  for (const f of [...fields, ...objFields]) if (out[f]) out[f] = parseJSON(out[f]);
  return out;
}

function parseRows(rows, table) { return rows.map(r => parseRow(r, table)); }

function sanitize(v) {
  if (v === undefined || v === null) return null;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'object') return JSON.stringify(v);
  return v;
}

function buildCols(obj) {
  const keys = Object.keys(obj).filter(k => obj[k] !== undefined);
  const vals = keys.map(k => sanitize(obj[k]));
  const placeholders = keys.map(() => '?').join(', ');
  return { keys: keys.join(', '), placeholders, vals };
}

function jsonifyItem(item, table) {
  const fields = [...(JSON_FIELDS[table] || []), ...(JSON_FIELDS[table + '_obj'] || [])];
  const out = { ...item };
  for (const f of fields) if (out[f] !== undefined) out[f] = toJSON(out[f]);
  return out;
}

// --- KV ---
const kvGetStmt = db.prepare('SELECT value FROM kv WHERE key = ?');
const kvSetStmt = db.prepare('REPLACE INTO kv (key, value, updated_at) VALUES (?, ?, ?)');

function kvGet(key) {
  const row = kvGetStmt.get(key);
  return row ? parseJSON(row.value) : null;
}
function kvSet(key, value) {
  kvSetStmt.run(key, toJSON(value), Date.now());
}

// --- Trending ---
function getTrending({ category, minScore, hasVideo, limit = 200 } = {}) {
  let sql = 'SELECT * FROM trending WHERE 1=1';
  const params = [];
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (minScore != null) { sql += ' AND trend_score >= ?'; params.push(minScore); }
  if (hasVideo) { sql += ' AND has_video = 1'; }
  sql += ' ORDER BY trend_score DESC LIMIT ?';
  params.push(limit);
  return db.prepare(sql).all(...params);
}

function upsertTrending(item) {
  const j = jsonifyItem(item, 'trending');
  const { keys, placeholders, vals } = buildCols(j);
  db.prepare(`INSERT OR REPLACE INTO trending (${keys}) VALUES (${placeholders})`).run(...vals);
}

const upsertTrendingBatch = db.transaction((items) => {
  for (const item of items) upsertTrending(item);
});

// --- Clusters ---
function getClusters({ minScore, limit = 100 } = {}) {
  let sql = 'SELECT * FROM clusters WHERE 1=1';
  const params = [];
  if (minScore != null) { sql += ' AND cluster_score >= ?'; params.push(minScore); }
  sql += ' ORDER BY cluster_score DESC LIMIT ?';
  params.push(limit);
  return parseRows(db.prepare(sql).all(...params), 'clusters');
}

function upsertCluster(cluster) {
  const j = jsonifyItem(cluster, 'clusters');
  const { keys, placeholders, vals } = buildCols(j);
  db.prepare(`INSERT OR REPLACE INTO clusters (${keys}) VALUES (${placeholders})`).run(...vals);
}

const replaceClusters = db.transaction((clusters) => {
  db.prepare('DELETE FROM clusters').run();
  for (const c of clusters) upsertCluster(c);
});

// --- Queue ---
function getQueue({ status, platform, limit = 200 } = {}) {
  let sql = 'SELECT * FROM queue WHERE 1=1';
  const params = [];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (platform) { sql += ' AND platforms LIKE ?'; params.push(`%${platform}%`); }
  sql += ' ORDER BY queued_at DESC LIMIT ?';
  params.push(limit);
  return parseRows(db.prepare(sql).all(...params), 'queue');
}

function getQueueStats() {
  const row = db.prepare(`SELECT
    COUNT(*) as total,
    SUM(status='pending') as pending,
    SUM(status='approved') as approved,
    SUM(status='published') as published,
    SUM(status='rejected') as rejected,
    SUM(priority='urgent') as urgent
  FROM queue`).get();
  return row;
}

function addQueue(item) {
  const j = jsonifyItem(item, 'queue');
  const { keys, placeholders, vals } = buildCols(j);
  db.prepare(`INSERT OR REPLACE INTO queue (${keys}) VALUES (${placeholders})`).run(...vals);
}

function updateQueueStatus(id, status) {
  db.prepare('UPDATE queue SET status = ? WHERE id = ?').run(status, id);
}

function removeQueue(id) {
  db.prepare('DELETE FROM queue WHERE id = ?').run(id);
}

// --- News ---
function getNews({ type, limit = 100 } = {}) {
  let sql = 'SELECT * FROM news WHERE 1=1';
  const params = [];
  if (type) { sql += ' AND type = ?'; params.push(type); }
  sql += ' ORDER BY published_at DESC LIMIT ?';
  params.push(limit);
  return db.prepare(sql).all(...params);
}

const upsertNewsBatch = db.transaction((items) => {
  const stmt = db.prepare(`INSERT OR REPLACE INTO news (id, title, url, description, source, type, published_at, fetched_at, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const i of items) stmt.run(i.id, i.title, i.url, i.description || null, i.source, i.type || 'general', i.published_at, i.fetched_at, i.image || null);
});

// --- Accounts ---
function getAccounts() { return db.prepare('SELECT * FROM accounts ORDER BY added_at DESC').all(); }
function addAccount(a) {
  db.prepare('INSERT OR REPLACE INTO accounts (id, handle, platform, added_by, added_at) VALUES (?, ?, ?, ?, ?)').run(a.id, a.handle, a.platform, a.added_by || 'web', a.added_at || Date.now());
}
function deleteAccount(id) { db.prepare('DELETE FROM accounts WHERE id = ?').run(id); }

// --- Vault ---
function getVault() { return db.prepare('SELECT * FROM vault ORDER BY saved_at DESC').all(); }
function saveVault(item) {
  const { keys, placeholders, vals } = buildCols(item);
  db.prepare(`INSERT OR REPLACE INTO vault (${keys}) VALUES (${placeholders})`).run(...vals);
}

// --- Performance ---
function getPerformance({ platform, limit = 200 } = {}) {
  let sql = 'SELECT * FROM performance WHERE 1=1';
  const params = [];
  if (platform) { sql += ' AND platform = ?'; params.push(platform); }
  sql += ' ORDER BY recorded_at DESC LIMIT ?';
  params.push(limit);
  return parseRows(db.prepare(sql).all(...params), 'performance');
}

function recordPerformance(data) {
  const j = jsonifyItem(data, 'performance');
  const { keys, placeholders, vals } = buildCols(j);
  db.prepare(`INSERT INTO performance (${keys}) VALUES (${placeholders})`).run(...vals);
}

function getPerformanceSummary() {
  return db.prepare(`SELECT platform, COUNT(*) as count,
    AVG(views) as avg_views, AVG(likes) as avg_likes, AVG(comments) as avg_comments,
    AVG(engagement_rate) as avg_engagement, AVG(retention) as avg_retention
  FROM performance GROUP BY platform`).all();
}

// --- Worker ---
function getWorkerState() {
  let row = db.prepare('SELECT * FROM worker_state WHERE id = 1').get();
  if (!row) { db.prepare('INSERT INTO worker_state (id) VALUES (1)').run(); row = db.prepare('SELECT * FROM worker_state WHERE id = 1').get(); }
  if (row.last_report) row.last_report = parseJSON(row.last_report);
  return row;
}

function updateWorkerState(updates) {
  const clean = {};
  for (const [k, v] of Object.entries(updates)) clean[k] = sanitize(v);
  const sets = Object.keys(clean).map(k => `${k} = ?`).join(', ');
  db.prepare(`UPDATE worker_state SET ${sets} WHERE id = 1`).run(...Object.values(clean));
}

function addWorkerLog(message, error) {
  db.prepare('INSERT INTO worker_logs (ts, message, error) VALUES (?, ?, ?)').run(Date.now(), message, error || null);
}

function getWorkerLogs(limit = 50) {
  return db.prepare('SELECT * FROM worker_logs ORDER BY ts DESC LIMIT ?').all(limit);
}

// --- Migration ---
function migrateFromJSON() {
  const count = db.prepare('SELECT COUNT(*) as n FROM trending').get().n;
  if (count > 0) { console.log('[db] Already migrated, skipping.'); return; }

  function readJSON(name) {
    const p = path.join(dataDir, name);
    if (!fs.existsSync(p)) return null;
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
  }

  const trending = readJSON('trending.json');
  if (trending && Array.isArray(trending)) {
    console.log(`[db] Migrating ${trending.length} trending items...`);
    upsertTrendingBatch(trending);
  }

  const clusters = readJSON('clusters.json');
  if (clusters && Array.isArray(clusters)) {
    console.log(`[db] Migrating ${clusters.length} clusters...`);
    replaceClusters(clusters);
  }

  const queue = readJSON('content_queue.json');
  if (queue) {
    const items = Array.isArray(queue) ? queue : (queue.items || []);
    console.log(`[db] Migrating ${items.length} queue items...`);
    db.transaction(() => { for (const i of items) addQueue(i); })();
  }

  const news = readJSON('news.json');
  if (news && Array.isArray(news)) {
    console.log(`[db] Migrating ${news.length} news items...`);
    upsertNewsBatch(news);
  }

  const accounts = readJSON('accounts.json');
  if (accounts && Array.isArray(accounts)) {
    console.log(`[db] Migrating ${accounts.length} accounts...`);
    db.transaction(() => { for (const a of accounts) addAccount(a); })();
  }

  const ws = readJSON('worker_state.json');
  if (ws && typeof ws === 'object') {
    console.log('[db] Migrating worker state...');
    getWorkerState(); // ensure row exists
    updateWorkerState(ws);
  }

  const wl = readJSON('worker_log.json');
  if (wl && Array.isArray(wl)) {
    console.log(`[db] Migrating ${wl.length} worker logs...`);
    db.transaction(() => { for (const l of wl) addWorkerLog(l.message || l, l.error); })();
  }

  // kv_*.json files
  const kvFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('kv_') && f.endsWith('.json'));
  for (const f of kvFiles) {
    const key = f.replace('kv_', '').replace('.json', '');
    const val = readJSON(f);
    if (val != null) { kvSet(key, val); console.log(`[db] Migrated kv: ${key}`); }
  }

  console.log('[db] Migration complete.');
}

module.exports = {
  db, kvGet, kvSet,
  getTrending, upsertTrending, upsertTrendingBatch,
  getClusters, upsertCluster, replaceClusters,
  getQueue, getQueueStats, addQueue, updateQueueStatus, removeQueue,
  getNews, upsertNewsBatch,
  getAccounts, addAccount, deleteAccount,
  getVault, saveVault,
  getPerformance, recordPerformance, getPerformanceSummary,
  getWorkerState, updateWorkerState, addWorkerLog, getWorkerLogs,
  migrateFromJSON,
};
