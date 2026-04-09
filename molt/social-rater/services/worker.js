/**
 * Background Worker
 * Runs the full pipeline on a configurable interval:
 *   fetch → score → cluster → generate → queue
 */

const path = require('path');
const fs = require('fs');

const scoring = require('./scoring');
const clustering = require('./clustering');
const contentEngine = require('./contentEngine');
const queue = require('./queue');
const feedback = require('./feedback');
const socialIngest = require('./socialIngest');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LOG_FILE = path.join(DATA_DIR, 'worker_log.json');
const STATE_FILE = path.join(DATA_DIR, 'worker_state.json');

function readJSON(f, def) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return def; } }
function writeJSON(f, d) { fs.writeFileSync(f, JSON.stringify(d, null, 2)); }

function log(msg, data = {}) {
  const logs = readJSON(LOG_FILE, { entries: [] });
  logs.entries.unshift({ ts: Date.now(), msg, ...data });
  if (logs.entries.length > 200) logs.entries = logs.entries.slice(0, 200);
  writeJSON(LOG_FILE, logs);
  console.log(`[worker] ${msg}`, data.error || '');
}

function getState() {
  return readJSON(STATE_FILE, {
    last_run: 0,
    runs: 0,
    last_clusters: 0,
    last_generated: 0,
    last_queued: 0,
    running: false,
    interval_ms: 15 * 60 * 1000, // default 15 min
    auto_generate: true,
    score_threshold: 50,
    enabled: true,
  });
}

function saveState(state) {
  writeJSON(STATE_FILE, state);
}

/**
 * Run one full pipeline cycle
 * @param {function} fetchTrending - the server's fetchTrending function (injected to avoid circular deps)
 * @returns {object} run report
 */
async function runCycle(fetchTrending) {
  const state = getState();
  if (state.running) {
    log('skipped — already running');
    return { skipped: true };
  }

  state.running = true;
  saveState(state);

  const report = { started_at: Date.now(), steps: {} };

  try {
    // ── Step 1: Fetch trending data ──
    log('step 1 — fetching trending data');
    let items = [];
    try {
      items = await fetchTrending();
      report.steps.fetch = { ok: true, count: items.length };
      log(`fetched ${items.length} trending items`);
    } catch (e) {
      report.steps.fetch = { ok: false, error: e.message };
      log('trending fetch failed', { error: e.message });
      const cached = readJSON(path.join(DATA_DIR, 'trending.json'), { items: [] });
      items = cached.items || [];
      log(`using ${items.length} cached items`);
    }

    // ── Step 1b: Fetch social account posts ──
    log('step 1b — fetching social accounts');
    try {
      const baseUrl = 'http://127.0.0.1:' + (process.env.PORT || 3033);
      const social = await socialIngest.fetchAllAccounts(baseUrl);
      report.steps.social = {
        ok: true,
        posts: social.items.length,
        accounts_fetched: social.accounts_fetched,
        accounts_failed: social.accounts_failed,
        by_platform: social.by_platform,
      };
      log(`social: ${social.items.length} posts from ${social.accounts_fetched} accounts (${social.accounts_failed} failed)`);

      // Merge social posts with trending items
      items = socialIngest.mergeWithTrending(social.items, items);
      log(`merged total: ${items.length} items`);
    } catch (e) {
      report.steps.social = { ok: false, error: e.message };
      log('social fetch failed', { error: e.message });
    }

    if (!items.length) {
      log('no items — aborting cycle');
      report.steps.abort = { reason: 'no items' };
      return report;
    }

    // ── Step 2: Advanced scoring ──
    log('step 2 — scoring');
    const weights = feedback.getWeights();
    const { top, low, threshold } = scoring.scoreAndFilter(items, items, weights);
    report.steps.scoring = { total: items.length, top: top.length, low: low.length, threshold, weights };
    log(`scored: ${top.length} top / ${low.length} low (threshold: ${threshold})`);

    // Save scored items back to trending.json
    const allScored = [...top, ...low];
    writeJSON(path.join(DATA_DIR, 'trending.json'), { items: allScored, updated_at: Date.now() });

    // ── Step 3: Cluster ──
    log('step 3 — clustering');
    const clusters = clustering.clusterTrends(top);
    // Use dynamic threshold: at least top 3 clusters, or anything above half the max score
    const maxClusterScore = clusters.length ? clusters[0].cluster_score : 0;
    const dynamicThreshold = Math.min(state.score_threshold, Math.floor(maxClusterScore * 0.5));
    const hotClusters = clustering.getHotClusters(clusters, dynamicThreshold || 1);
    report.steps.clustering = { total_clusters: clusters.length, hot_clusters: hotClusters.length, dynamic_threshold: dynamicThreshold };
    log(`clusters: ${clusters.length} total, ${hotClusters.length} hot (threshold: ${dynamicThreshold})`);

    // Save clusters
    writeJSON(path.join(DATA_DIR, 'clusters.json'), { clusters, hot: hotClusters, updated_at: Date.now() });

    // ── Step 4: Auto content generation (if enabled) ──
    if (state.auto_generate && hotClusters.length > 0) {
      log('step 4 — generating content');
      const generated = contentEngine.batchGenerate(hotClusters, dynamicThreshold || 1);
      report.steps.generation = { count: generated.length };
      log(`generated ${generated.length} content packages`);

      // ── Step 5: Queue ──
      log('step 5 — queuing content');
      const queued = queue.batchEnqueue(generated);
      report.steps.queue = { count: queued.length };
      log(`queued ${queued.length} items`);

      state.last_generated = generated.length;
      state.last_queued = queued.length;
    } else {
      report.steps.generation = { skipped: true, reason: state.auto_generate ? 'no hot clusters' : 'auto_generate disabled' };
      log('content generation skipped');
    }

    // ── Step 6: Adjust weights (feedback loop) ──
    log('step 6 — feedback loop');
    const adjustment = feedback.adjustWeights();
    report.steps.feedback = adjustment;
    if (adjustment.adjusted) {
      log('weights adjusted', { weights: adjustment.weights });
    } else {
      log('weights not adjusted: ' + (adjustment.reason || 'n/a'));
    }

    report.completed_at = Date.now();
    report.duration_ms = report.completed_at - report.started_at;
    report.success = true;
    log(`cycle complete in ${report.duration_ms}ms`);

  } catch (e) {
    report.error = e.message;
    report.success = false;
    log('cycle failed', { error: e.message });
  } finally {
    state.running = false;
    state.last_run = Date.now();
    state.runs++;
    state.last_clusters = report.steps.clustering?.total_clusters || 0;
    state.last_report = report;
    saveState(state);
  }

  return report;
}

/**
 * Start the background worker loop
 * @param {function} fetchTrending - injected from server.js
 * @returns {object} control handle { stop(), getState() }
 */
function startWorker(fetchTrending) {
  const state = getState();
  let intervalId = null;

  const tick = async () => {
    const currentState = getState();
    if (!currentState.enabled) return;
    await runCycle(fetchTrending);
  };

  // Run first cycle after 15s startup delay
  setTimeout(tick, 15000);

  // Then on interval
  intervalId = setInterval(tick, state.interval_ms || 15 * 60 * 1000);

  log('worker started', { interval_ms: state.interval_ms });

  return {
    stop() {
      if (intervalId) clearInterval(intervalId);
      log('worker stopped');
    },
    getState,
    async runNow() { return runCycle(fetchTrending); },
  };
}

/**
 * Get worker logs
 */
function getLogs(limit = 50) {
  const logs = readJSON(LOG_FILE, { entries: [] });
  return logs.entries.slice(0, limit);
}

module.exports = {
  startWorker,
  runCycle,
  getState,
  saveState,
  getLogs,
};
