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
CREATE TABLE IF NOT EXISTS account_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  platform TEXT NOT NULL,
  handle TEXT NOT NULL,
  brand TEXT,
  followers INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  recorded_at INTEGER,
  UNIQUE(date, platform, handle)
);
CREATE INDEX IF NOT EXISTS idx_history_date ON account_history(date);
CREATE INDEX IF NOT EXISTS idx_history_handle ON account_history(platform, handle);

CREATE TABLE IF NOT EXISTS account_snapshots (
  id TEXT PRIMARY KEY,
  brand TEXT,
  platform TEXT NOT NULL,
  handle TEXT NOT NULL,
  name TEXT,
  bio TEXT,
  avatar TEXT,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  avg_views_per_post INTEGER DEFAULT 0,
  eng_rate REAL DEFAULT 0,
  verified INTEGER DEFAULT 0,
  recent_posts TEXT,
  fetched_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_snapshots_brand ON account_snapshots(brand);
CREATE INDEX IF NOT EXISTS idx_snapshots_platform ON account_snapshots(platform);

CREATE TABLE IF NOT EXISTS account_pulses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recorded_at INTEGER NOT NULL,
  platform TEXT NOT NULL,
  handle TEXT NOT NULL,
  followers INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_pulses_acc_time ON account_pulses(platform, handle, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulses_time ON account_pulses(recorded_at DESC);

CREATE TABLE IF NOT EXISTS account_posts (
  platform TEXT NOT NULL,
  handle TEXT NOT NULL,
  id TEXT NOT NULL,
  published_at INTEGER,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  caption TEXT,
  url TEXT,
  thumb TEXT,
  is_video INTEGER DEFAULT 0,
  first_seen_at INTEGER,
  fetched_at INTEGER,
  PRIMARY KEY (platform, handle, id)
);
CREATE INDEX IF NOT EXISTS idx_posts_acc ON account_posts(platform, handle, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_pub ON account_posts(published_at DESC);

-- Growth engine: scraped top-performing content in target niches
CREATE TABLE IF NOT EXISTS winners (
  id TEXT PRIMARY KEY,
  niche TEXT NOT NULL,             -- lifestyle | finance | crypto
  platform TEXT NOT NULL,          -- youtube | instagram | tiktok | x
  title TEXT,
  caption TEXT,
  url TEXT,
  author TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0,      -- seconds
  thumb TEXT,
  published_at INTEGER,
  scraped_at INTEGER,
  source_query TEXT,               -- what query found it
  raw TEXT                         -- JSON dump of original scrape item
);
CREATE INDEX IF NOT EXISTS idx_winners_niche_plat ON winners(niche, platform, views DESC);
CREATE INDEX IF NOT EXISTS idx_winners_scraped ON winners(scraped_at DESC);

-- Growth engine: structural DNA extracted from winners via LLM
CREATE TABLE IF NOT EXISTS winner_patterns (
  winner_id TEXT PRIMARY KEY,
  niche TEXT,
  platform TEXT,
  hook_type TEXT,                  -- question | stat_bomb | contrarian | pov | disruptor | story
  hook_text TEXT,
  topic_cluster TEXT,
  emotion TEXT,                    -- curiosity | fear | aspiration | outrage | fomo
  format TEXT,                     -- talking_head | text_overlay | b_roll | slideshow | meme
  length_bucket TEXT,              -- 0-15 | 15-30 | 30-60 | 60+
  structure TEXT,
  visual_cue TEXT,
  strengths TEXT,                  -- JSON array
  mined_at INTEGER,
  FOREIGN KEY (winner_id) REFERENCES winners(id)
);
CREATE INDEX IF NOT EXISTS idx_patterns_niche ON winner_patterns(niche, platform);
CREATE INDEX IF NOT EXISTS idx_patterns_hook ON winner_patterns(hook_type);
CREATE INDEX IF NOT EXISTS idx_patterns_topic ON winner_patterns(topic_cluster);
`);

// One-time backfill: seed account_pulses from account_history if empty
try {
  const hasPulses = db.prepare('SELECT COUNT(*) as n FROM account_pulses').get();
  if (!hasPulses.n) {
    const rows = db.prepare(`SELECT recorded_at, date, platform, handle, followers, total_views, total_likes, total_comments, posts_count FROM account_history`).all();
    const ins = db.prepare(`INSERT INTO account_pulses (recorded_at, platform, handle, followers, total_views, total_likes, total_comments, posts_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    const tx = db.transaction((rs) => {
      for (const r of rs) {
        const ts = r.recorded_at || new Date(r.date + 'T12:00:00Z').getTime();
        ins.run(ts, r.platform, r.handle, r.followers || 0, r.total_views || 0, r.total_likes || 0, r.total_comments || 0, r.posts_count || 0);
      }
    });
    tx(rows);
    if (rows.length) console.log(`[db] backfilled ${rows.length} pulses from account_history`);
  }
} catch (e) { console.log('[db] pulses backfill skipped:', e.message); }

db.exec(`
-- trailing noop to keep schema block symmetric
SELECT 1;

CREATE TABLE IF NOT EXISTS kv (
  key TEXT PRIMARY KEY, value TEXT, updated_at INTEGER
);
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  title TEXT,
  author TEXT,
  author_id TEXT,
  url TEXT,
  thumb TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0,
  published_at INTEGER,
  fetched_at INTEGER,
  category TEXT DEFAULT 'general',
  query TEXT,
  viral_score REAL DEFAULT 0,
  velocity REAL DEFAULT 0,
  download_url TEXT,
  description TEXT,
  hashtags TEXT,
  is_short INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_user TEXT NOT NULL,
  from_name TEXT,
  to_user TEXT,
  type TEXT DEFAULT 'link',
  title TEXT,
  url TEXT,
  thumb TEXT,
  note TEXT,
  source TEXT,
  platform TEXT,
  action TEXT DEFAULT 'review',
  status TEXT DEFAULT 'pending',
  created_at INTEGER,
  read_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_shares_to ON shares(to_user);
CREATE INDEX IF NOT EXISTS idx_shares_status ON shares(status);

CREATE INDEX IF NOT EXISTS idx_videos_platform ON videos(platform);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_score ON videos(viral_score);
CREATE INDEX IF NOT EXISTS idx_videos_fetched ON videos(fetched_at);

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

// --- Videos ---
function getVideos({ platform, category, minScore, limit = 200, offset = 0 } = {}) {
  let sql = 'SELECT * FROM videos WHERE 1=1';
  const params = [];
  if (platform) { sql += ' AND platform = ?'; params.push(platform); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (minScore != null) { sql += ' AND viral_score >= ?'; params.push(minScore); }
  sql += ' ORDER BY viral_score DESC, fetched_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  return db.prepare(sql).all(...params);
}

function getVideoStats() {
  return db.prepare(`SELECT
    COUNT(*) as total,
    SUM(platform='youtube') as youtube,
    SUM(platform='tiktok') as tiktok,
    SUM(platform='instagram') as instagram,
    SUM(platform='twitter') as twitter,
    SUM(views) as total_views,
    SUM(likes) as total_likes,
    MAX(fetched_at) as last_fetched
  FROM videos`).get();
}

const upsertVideo = db.prepare(`INSERT OR REPLACE INTO videos
  (id, platform, title, author, author_id, url, thumb, views, likes, comments, shares,
   duration, published_at, fetched_at, category, query, viral_score, velocity, download_url,
   description, hashtags, is_short)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

const upsertVideoBatch = db.transaction((videos) => {
  for (const v of videos) {
    upsertVideo.run(
      v.id, v.platform, v.title, v.author, v.author_id, v.url, v.thumb,
      v.views || 0, v.likes || 0, v.comments || 0, v.shares || 0,
      v.duration || 0, v.published_at, v.fetched_at || Date.now(),
      v.category || 'general', v.query || '', v.viral_score || 0, v.velocity || 0,
      v.download_url || '', v.description || '', v.hashtags || '', v.is_short ? 1 : 0
    );
  }
});

// --- Account Snapshots ---
function upsertSnapshot(snap) {
  const id = snap.platform + '_' + (snap.handle || '').toLowerCase();
  db.prepare(`INSERT OR REPLACE INTO account_snapshots
    (id, brand, platform, handle, name, bio, avatar, followers, following, posts_count,
     total_views, total_likes, total_comments, avg_views_per_post, eng_rate, verified, recent_posts, fetched_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, snap.brand || '', snap.platform, snap.handle, snap.name || '', snap.bio || '', snap.avatar || '',
    snap.followers || 0, snap.following || 0, snap.posts_count || 0,
    snap.total_views || 0, snap.total_likes || 0, snap.total_comments || 0,
    snap.avg_views_per_post || 0, snap.eng_rate || 0, snap.verified ? 1 : 0,
    JSON.stringify(snap.recent_posts || []), Date.now()
  );
  // Also record to history for daily tracking
  try { recordHistory(snap); } catch {}
}

function upsertAccountPosts(platform, handle, posts) {
  if (!Array.isArray(posts) || !posts.length) return 0;
  const now = Date.now();
  // For posts with no published_at (e.g. YT Shorts whose HTML doesn't expose it),
  // we fall back to first_seen_at as the published_at — best approximation.
  // On UPDATE: never overwrite an existing real published_at; only fill if previously null.
  const upsert = db.prepare(`
    INSERT INTO account_posts (platform, handle, id, published_at, views, likes, comments, caption, url, thumb, is_video, first_seen_at, fetched_at)
    VALUES (@platform, @handle, @id, @published_at, @views, @likes, @comments, @caption, @url, @thumb, @is_video, @first_seen_at, @fetched_at)
    ON CONFLICT(platform, handle, id) DO UPDATE SET
      -- Don't backfill published_at on conflict: leaves existing rows untouched.
      -- Only NEW inserts get the fallback timestamp.
      published_at = account_posts.published_at,
      views = MAX(views, excluded.views),
      likes = MAX(likes, excluded.likes),
      comments = MAX(comments, excluded.comments),
      caption = COALESCE(NULLIF(excluded.caption, ''), caption),
      url = COALESCE(NULLIF(excluded.url, ''), url),
      thumb = COALESCE(NULLIF(excluded.thumb, ''), thumb),
      is_video = excluded.is_video,
      fetched_at = excluded.fetched_at
  `);
  const tx = db.transaction((rows) => {
    for (const p of rows) {
      if (!p.id) continue;
      const realPubMs = p.taken_at ? (p.taken_at < 1e12 ? p.taken_at * 1000 : p.taken_at) : null;
      // Fall back to "now" so YT Shorts get a usable timestamp on first sight
      const pubMs = realPubMs || now;
      upsert.run({
        platform, handle, id: String(p.id),
        published_at: pubMs,
        views: p.views || 0, likes: p.likes || 0, comments: p.comments || 0,
        caption: p.caption || '', url: p.url || '', thumb: p.thumb || '',
        is_video: p.is_video ? 1 : 0,
        first_seen_at: now, fetched_at: now,
      });
    }
  });
  tx(posts);
  return posts.length;
}

function healSnapshotsFromPosts() {
  // Never let a snapshot's totals fall below the sum of its persisted posts.
  // Runs on startup + defensively after each sync. Idempotent.
  const result = db.prepare(`
    UPDATE account_snapshots SET
      total_views = MAX(total_views, COALESCE((SELECT SUM(views) FROM account_posts WHERE platform = account_snapshots.platform AND handle = account_snapshots.handle), 0)),
      total_likes = MAX(total_likes, COALESCE((SELECT SUM(likes) FROM account_posts WHERE platform = account_snapshots.platform AND handle = account_snapshots.handle), 0)),
      total_comments = MAX(total_comments, COALESCE((SELECT SUM(comments) FROM account_posts WHERE platform = account_snapshots.platform AND handle = account_snapshots.handle), 0)),
      posts_count = MAX(posts_count, COALESCE((SELECT COUNT(*) FROM account_posts WHERE platform = account_snapshots.platform AND handle = account_snapshots.handle), 0))
  `).run();
  return result.changes;
}

function getPostsAggregate(platform, handle) {
  const row = db.prepare(`
    SELECT COUNT(*) as count,
      COALESCE(SUM(views), 0) as views,
      COALESCE(SUM(likes), 0) as likes,
      COALESCE(SUM(comments), 0) as comments
    FROM account_posts WHERE platform = ? AND handle = ?
  `).get(platform, handle);
  return row || { count: 0, views: 0, likes: 0, comments: 0 };
}

function getRecentPosts(sinceMs, limit = 500) {
  return db.prepare(`
    SELECT p.*, s.brand, s.avatar
    FROM account_posts p
    LEFT JOIN account_snapshots s ON s.platform = p.platform AND s.handle = p.handle
    WHERE p.published_at IS NOT NULL AND p.published_at >= ?
    ORDER BY p.published_at DESC
    LIMIT ?
  `).all(sinceMs, limit);
}

function getAccountPosts(platform, handle, limit = 200) {
  return db.prepare(`
    SELECT * FROM account_posts
    WHERE platform = ? AND handle = ?
    ORDER BY published_at DESC NULLS LAST
    LIMIT ?
  `).all(platform, handle, limit);
}

function getSnapshotById(id) {
  const row = db.prepare('SELECT * FROM account_snapshots WHERE id = ?').get(id);
  if (!row) return null;
  return { ...row, recent_posts: row.recent_posts ? JSON.parse(row.recent_posts) : [] };
}

function getSnapshots({ brand, platform } = {}) {
  let sql = 'SELECT * FROM account_snapshots WHERE 1=1';
  const params = [];
  if (brand) { sql += ' AND brand = ?'; params.push(brand); }
  if (platform) { sql += ' AND platform = ?'; params.push(platform); }
  sql += ' ORDER BY followers DESC';
  const rows = db.prepare(sql).all(...params);
  return rows.map(r => ({ ...r, recent_posts: r.recent_posts ? JSON.parse(r.recent_posts) : [] }));
}

function getSnapshotsDashboard() {
  // Only show accounts that still exist in brandAccounts KV
  const brands = kvGet('brandAccounts') || {};
  const validIds = new Set();
  for (const [brand, plats] of Object.entries(brands)) {
    for (const [plat, handle] of Object.entries(plats)) {
      const clean = (handle || '').replace(/^@/, '').toLowerCase();
      if (clean) validIds.add(plat + '_' + clean);
    }
  }
  const allRows = db.prepare('SELECT * FROM account_snapshots ORDER BY followers DESC').all();
  const all = validIds.size > 0 ? allRows.filter(a => validIds.has(a.id)) : allRows;
  if (!all.length) return null;
  let totalFollowers = 0, totalFollowing = 0, totalViews = 0, totalLikes = 0, totalComments = 0, totalPosts = 0;
  const byBrand = {}, byPlatform = {};

  all.forEach(a => {
    totalFollowers += a.followers; totalFollowing += a.following;
    totalViews += a.total_views; totalLikes += a.total_likes;
    totalComments += a.total_comments; totalPosts += a.posts_count;
    const b = a.brand || 'other';
    if (!byBrand[b]) byBrand[b] = { followers: 0, views: 0, likes: 0, accounts: 0 };
    byBrand[b].followers += a.followers; byBrand[b].views += a.total_views; byBrand[b].likes += a.total_likes; byBrand[b].accounts++;
    const p = a.platform;
    if (!byPlatform[p]) byPlatform[p] = { followers: 0, views: 0, likes: 0, accounts: 0, posts: 0 };
    byPlatform[p].followers += a.followers; byPlatform[p].views += a.total_views; byPlatform[p].likes += a.total_likes; byPlatform[p].accounts++; byPlatform[p].posts += a.posts_count;
  });

  // Time windows from PULSES (timestamped, append-only).
  // For each account, find the pulse closest to (now - window) but not after it.
  // If none exists that old for an account, use that account's OLDEST pulse
  // so we still return a real delta (just measured over a shorter span).
  // Returns null only if NO pulses exist at all.
  function getDelta(daysAgo) {
    const targetMs = Date.now() - daysAgo * 86400000;
    const anyPulse = db.prepare('SELECT COUNT(*) as n FROM account_pulses').get();
    if (!anyPulse || anyPulse.n === 0) return null;
    // Per-account: pick baseline pulse (nearest to targetMs, fallback oldest) and current pulse (newest).
    // Compute delta per account, clamp negatives to 0 (bad-sync data), then sum.
    const perAcc = db.prepare(`
      WITH accs AS (SELECT DISTINCT platform, handle FROM account_pulses),
      baseline AS (
        SELECT a.platform, a.handle,
          COALESCE(
            (SELECT id FROM account_pulses p2
               WHERE p2.platform = a.platform AND p2.handle = a.handle
                 AND p2.recorded_at <= ?
               ORDER BY p2.recorded_at DESC LIMIT 1),
            (SELECT id FROM account_pulses p3
               WHERE p3.platform = a.platform AND p3.handle = a.handle
               ORDER BY p3.recorded_at ASC LIMIT 1)
          ) as bid,
          (SELECT id FROM account_pulses p4
             WHERE p4.platform = a.platform AND p4.handle = a.handle
             ORDER BY p4.recorded_at DESC LIMIT 1) as cid
        FROM accs a
      )
      SELECT
        MAX(0, COALESCE(cur.followers,0) - COALESCE(base.followers,0)) as f,
        MAX(0, COALESCE(cur.total_views,0) - COALESCE(base.total_views,0)) as v,
        MAX(0, COALESCE(cur.total_likes,0) - COALESCE(base.total_likes,0)) as l,
        MAX(0, COALESCE(cur.total_comments,0) - COALESCE(base.total_comments,0)) as c,
        MAX(0, COALESCE(cur.posts_count,0) - COALESCE(base.posts_count,0)) as p
      FROM baseline b
      LEFT JOIN account_pulses base ON base.id = b.bid
      LEFT JOIN account_pulses cur ON cur.id = b.cid
    `).all(targetMs);
    const row = perAcc.reduce((acc, r) => ({
      f: acc.f + (r.f || 0), v: acc.v + (r.v || 0), l: acc.l + (r.l || 0),
      c: acc.c + (r.c || 0), p: acc.p + (r.p || 0),
    }), { f: 0, v: 0, l: 0, c: 0, p: 0 });
    return row;
  }
  const h1 = getDelta(1);
  const h7 = getDelta(7);
  const h30 = getDelta(30);
  const delta = (current, h, key) => h === null ? null : Math.max(0, current - (h[key] || 0));
  const v24 = delta(totalViews, h1, 'v');
  const v7 = delta(totalViews, h7, 'v');
  const v30 = delta(totalViews, h30, 'v');
  const l24 = delta(totalLikes, h1, 'l');
  const l7 = delta(totalLikes, h7, 'l');
  const l30 = delta(totalLikes, h30, 'l');
  const c24 = delta(totalComments, h1, 'c');
  const c7 = delta(totalComments, h7, 'c');
  const c30 = delta(totalComments, h30, 'c');
  const posts24 = delta(totalPosts, h1, 'p');
  const posts7 = delta(totalPosts, h7, 'p');
  const posts30 = delta(totalPosts, h30, 'p');
  const fDelta = (current, h) => h === null ? null : current - (h.f || 0);
  const f24 = fDelta(totalFollowers, h1);
  const f7 = fDelta(totalFollowers, h7);
  const f30 = fDelta(totalFollowers, h30);
  const engRate = totalFollowers ? (((totalLikes + totalComments) / (totalPosts || 1)) / totalFollowers * 100).toFixed(2) : '0';
  const avgViewsPerPost = totalPosts ? Math.round(totalViews / totalPosts) : 0;
  return {
    totalFollowers, totalFollowing, totalViews, totalLikes, totalComments, totalPosts,
    engRate, avgViewsPerPost, byBrand, byPlatform,
    // Time windows
    views_24h: v24, views_7d: v7, views_30d: v30,
    likes_24h: l24, likes_7d: l7, likes_30d: l30,
    comments_24h: c24, comments_7d: c7, comments_30d: c30,
    posts_24h: posts24, posts_7d: posts7, posts_30d: posts30,
    followers_24h: f24, followers_7d: f7, followers_30d: f30,
    // Stats for POSTS PUBLISHED in the window (absolute engagement, not deltas).
    // today = since midnight UTC of current day (stable through the day, forgiving to imprecise YT Short timestamps)
    // h24/d7/d30 = rolling windows from now
    posted: (() => {
      const q = (sinceMs) => db.prepare(`
        SELECT
          COUNT(*) as posts,
          COALESCE(SUM(views),0) as views,
          COALESCE(SUM(likes),0) as likes,
          COALESCE(SUM(comments),0) as comments
        FROM account_posts WHERE published_at IS NOT NULL AND published_at >= ?
      `).get(sinceMs);
      const now = new Date();
      const todayMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
      return {
        today: q(todayMs),
        h24: q(Date.now() - 24 * 3600000),
        d7: q(Date.now() - 7 * 24 * 3600000),
        d30: q(Date.now() - 30 * 24 * 3600000),
      };
    })(),
    accounts: all.map(a => ({ ...a, recent_posts: undefined })),
    count: all.length, last_fetched: all.reduce((max, a) => Math.max(max, a.fetched_at || 0), 0),
  };
}

function recordHistory(snap) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const now = Date.now();
  db.prepare(`INSERT OR REPLACE INTO account_history
    (date, platform, handle, brand, followers, total_views, total_likes, total_comments, posts_count, recorded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    today, snap.platform, snap.handle, snap.brand || '',
    snap.followers || 0, snap.total_views || 0, snap.total_likes || 0,
    snap.total_comments || 0, snap.posts_count || 0, now
  );
  // Append a timestamped pulse (never overwritten) — enables accurate time-window deltas
  db.prepare(`INSERT INTO account_pulses
    (recorded_at, platform, handle, followers, total_views, total_likes, total_comments, posts_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    now, snap.platform, snap.handle,
    snap.followers || 0, snap.total_views || 0, snap.total_likes || 0,
    snap.total_comments || 0, snap.posts_count || 0
  );
}

function getHistory(days = 30) {
  // Bucket posts by publish date: real daily engagement from actual post timestamps.
  // Much richer than pulse-based deltas (which only started recording recently).
  const sinceMs = Date.now() - days * 86400000;
  const postsRows = db.prepare(`
    SELECT
      date(published_at/1000, 'unixepoch') as date,
      COUNT(*) as posts,
      COALESCE(SUM(views), 0) as views,
      COALESCE(SUM(likes), 0) as likes,
      COALESCE(SUM(comments), 0) as comments
    FROM account_posts
    WHERE published_at IS NOT NULL AND published_at >= ?
    GROUP BY date(published_at/1000, 'unixepoch')
    ORDER BY date ASC
  `).all(sinceMs);

  // Also get followers per day from pulses (for the followers line)
  const folRows = db.prepare(`
    WITH day_acc_latest AS (
      SELECT date(recorded_at/1000, 'unixepoch') as date, platform, handle, MAX(recorded_at) as max_ts
      FROM account_pulses WHERE recorded_at >= ?
      GROUP BY date(recorded_at/1000, 'unixepoch'), platform, handle
    )
    SELECT d.date, SUM(p.followers) as followers
    FROM day_acc_latest d
    INNER JOIN account_pulses p ON p.platform = d.platform AND p.handle = d.handle AND p.recorded_at = d.max_ts
    GROUP BY d.date
  `).all(sinceMs);
  const folByDate = Object.fromEntries(folRows.map(r => [r.date, r.followers]));

  // Merge: a day appears if it has posts OR a pulse
  const allDates = new Set([...postsRows.map(r => r.date), ...folRows.map(r => r.date)]);
  const byDate = Object.fromEntries(postsRows.map(r => [r.date, r]));
  return [...allDates].sort().map(date => ({
    date,
    posts: byDate[date]?.posts || 0,
    views: byDate[date]?.views || 0,
    likes: byDate[date]?.likes || 0,
    comments: byDate[date]?.comments || 0,
    followers: folByDate[date] || 0,
  }));
}

function deleteSnapshot(platform, handle) {
  const id = platform + '_' + (handle || '').toLowerCase();
  db.prepare('DELETE FROM account_snapshots WHERE id = ?').run(id);
}

// --- Shares ---
function addShare(share) {
  const stmt = db.prepare(`INSERT INTO shares (from_user, from_name, to_user, type, title, url, thumb, note, source, platform, action, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(share.from_user, share.from_name || '', share.to_user || 'all', share.type || 'link', share.title || '', share.url || '', share.thumb || '', share.note || '', share.source || '', share.platform || '', share.action || 'review', 'pending', Date.now());
  return info.lastInsertRowid;
}
function getShares({ to_user, status, limit = 50 } = {}) {
  let sql = 'SELECT * FROM shares WHERE 1=1';
  const params = [];
  if (to_user) { sql += ' AND (to_user = ? OR to_user = "all")'; params.push(to_user); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  sql += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);
  return db.prepare(sql).all(...params);
}
function updateShare(id, updates) {
  const sets = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  db.prepare(`UPDATE shares SET ${sets} WHERE id = ?`).run(...Object.values(updates), id);
}
function getUnreadCount(to_user) {
  return db.prepare('SELECT COUNT(*) as count FROM shares WHERE (to_user = ? OR to_user = "all") AND status = "pending"').get(to_user)?.count || 0;
}

// ── Growth engine ──
function upsertWinners(rows) {
  const ins = db.prepare(`
    INSERT INTO winners (id, niche, platform, title, caption, url, author, views, likes, comments, duration, thumb, published_at, scraped_at, source_query, raw)
    VALUES (@id, @niche, @platform, @title, @caption, @url, @author, @views, @likes, @comments, @duration, @thumb, @published_at, @scraped_at, @source_query, @raw)
    ON CONFLICT(id) DO UPDATE SET
      views=MAX(winners.views, excluded.views),
      likes=MAX(winners.likes, excluded.likes),
      comments=MAX(winners.comments, excluded.comments),
      scraped_at=excluded.scraped_at,
      thumb=COALESCE(excluded.thumb, winners.thumb)
  `);
  const tx = db.transaction(rs => { for (const r of rs) ins.run(r); });
  tx(rows);
}
function getWinners({ niche, platform, limit = 200, mined } = {}) {
  const where = []; const args = [];
  if (niche) { where.push('w.niche = ?'); args.push(niche); }
  if (platform) { where.push('w.platform = ?'); args.push(platform); }
  if (mined === true) where.push('p.winner_id IS NOT NULL');
  if (mined === false) where.push('p.winner_id IS NULL');
  const sql = `
    SELECT w.*, p.hook_type, p.hook_text, p.topic_cluster, p.emotion, p.format, p.length_bucket
    FROM winners w LEFT JOIN winner_patterns p ON p.winner_id = w.id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY w.views DESC LIMIT ?`;
  return db.prepare(sql).all(...args, limit);
}
function getUnminedWinners({ niche, platform, limit = 50 } = {}) {
  return getWinners({ niche, platform, limit, mined: false });
}
function upsertPattern(p) {
  db.prepare(`
    INSERT INTO winner_patterns (winner_id, niche, platform, hook_type, hook_text, topic_cluster, emotion, format, length_bucket, structure, visual_cue, strengths, mined_at)
    VALUES (@winner_id, @niche, @platform, @hook_type, @hook_text, @topic_cluster, @emotion, @format, @length_bucket, @structure, @visual_cue, @strengths, @mined_at)
    ON CONFLICT(winner_id) DO UPDATE SET
      hook_type=excluded.hook_type, hook_text=excluded.hook_text, topic_cluster=excluded.topic_cluster,
      emotion=excluded.emotion, format=excluded.format, length_bucket=excluded.length_bucket,
      structure=excluded.structure, visual_cue=excluded.visual_cue, strengths=excluded.strengths,
      mined_at=excluded.mined_at
  `).run(p);
}
function getLibrary({ niche, platform } = {}) {
  const where = []; const args = [];
  if (niche) { where.push('niche = ?'); args.push(niche); }
  if (platform) { where.push('platform = ?'); args.push(platform); }
  const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const agg = (col) => db.prepare(`SELECT ${col} as key, COUNT(*) as n FROM winner_patterns ${whereSql} GROUP BY ${col} ORDER BY n DESC`).all(...args);
  return {
    total: db.prepare(`SELECT COUNT(*) as n FROM winner_patterns ${whereSql}`).get(...args)?.n || 0,
    hooks: agg('hook_type'),
    emotions: agg('emotion'),
    formats: agg('format'),
    lengths: agg('length_bucket'),
    topics: agg('topic_cluster'),
  };
}
function getWinnersStats() {
  return db.prepare(`
    SELECT niche, platform,
      COUNT(*) as winners,
      SUM(CASE WHEN p.winner_id IS NOT NULL THEN 1 ELSE 0 END) as mined,
      MAX(scraped_at) as last_scrape
    FROM winners w LEFT JOIN winner_patterns p ON p.winner_id = w.id
    GROUP BY niche, platform
    ORDER BY niche, platform
  `).all();
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
  getVideos, getVideoStats, upsertVideoBatch,
  upsertSnapshot, getSnapshots, getSnapshotById, getSnapshotsDashboard, deleteSnapshot,
  upsertAccountPosts, getAccountPosts, getRecentPosts, getPostsAggregate, healSnapshotsFromPosts,
  recordHistory, getHistory,
  addShare, getShares, updateShare, getUnreadCount,
  upsertWinners, getWinners, getUnminedWinners, upsertPattern, getLibrary, getWinnersStats,
  migrateFromJSON,
};
