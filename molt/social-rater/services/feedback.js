/**
 * Performance Feedback Loop
 * Tracks published content performance and adjusts scoring weights
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PERF_FILE = path.join(DATA_DIR, 'performance.json');
const WEIGHTS_FILE = path.join(DATA_DIR, 'scoring_weights.json');

function readJSON(f, def) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return def; } }
function writeJSON(f, d) { fs.writeFileSync(f, JSON.stringify(d, null, 2)); }

// Default weights
const DEFAULT_WEIGHTS = {
  velocity: 0.4,
  cross_platform: 0.2,
  emotion: 0.2,
  format: 0.2,
};

/**
 * Get current scoring weights (may be adjusted by feedback)
 */
function getWeights() {
  return readJSON(WEIGHTS_FILE, { ...DEFAULT_WEIGHTS, adjusted_at: null, adjustments: 0 });
}

/**
 * Record performance data for a published piece of content
 * @param {object} data - { queue_id, trend_id, platform, views, likes, comments, shares, watch_time_avg, retention_pct, published_at }
 */
function recordPerformance(data) {
  const perf = readJSON(PERF_FILE, { entries: [] });

  const entry = {
    id: 'pf_' + Date.now().toString(36),
    queue_id: data.queue_id || null,
    trend_id: data.trend_id || null,
    platform: data.platform || 'unknown',
    // Metrics
    views: data.views || 0,
    likes: data.likes || 0,
    comments: data.comments || 0,
    shares: data.shares || 0,
    watch_time_avg: data.watch_time_avg || 0,  // seconds
    retention_pct: data.retention_pct || 0,     // 0-100
    // Derived
    engagement_rate: data.views > 0 ? ((data.likes + data.comments + data.shares) / data.views * 100) : 0,
    // Source metadata (from the original trend)
    emotion: data.emotion || null,
    format: data.format || null,
    trend_score_at_detection: data.trend_score || 0,
    keywords: data.keywords || [],
    // Timing
    published_at: data.published_at || Date.now(),
    recorded_at: Date.now(),
  };

  entry.engagement_rate = Math.round(entry.engagement_rate * 100) / 100;

  perf.entries.unshift(entry);
  if (perf.entries.length > 1000) perf.entries = perf.entries.slice(0, 1000);
  perf.updated_at = Date.now();
  writeJSON(PERF_FILE, perf);

  return entry;
}

/**
 * Get all performance entries with optional filters
 */
function getPerformance(filters = {}) {
  const perf = readJSON(PERF_FILE, { entries: [] });
  let entries = perf.entries;

  if (filters.platform) entries = entries.filter(e => e.platform === filters.platform);
  if (filters.emotion) entries = entries.filter(e => e.emotion === filters.emotion);
  if (filters.format) entries = entries.filter(e => e.format === filters.format);
  if (filters.minViews) entries = entries.filter(e => e.views >= filters.minViews);
  if (filters.since) entries = entries.filter(e => e.recorded_at >= filters.since);

  return { entries: entries.slice(0, filters.limit || 100), total: entries.length };
}

/**
 * Analyze performance patterns and adjust scoring weights
 * This is the core feedback loop logic.
 *
 * Strategy:
 * - Look at top 20% performing content vs bottom 20%
 * - Check which factors (velocity, cross_platform, emotion, format) correlate with high performance
 * - Nudge weights toward factors that predict success
 */
function adjustWeights() {
  const perf = readJSON(PERF_FILE, { entries: [] });
  const entries = perf.entries.filter(e => e.views > 0);

  if (entries.length < 10) {
    return { adjusted: false, reason: 'need at least 10 entries with views', weights: getWeights() };
  }

  // Sort by engagement_rate
  entries.sort((a, b) => b.engagement_rate - a.engagement_rate);

  const topN = Math.max(2, Math.floor(entries.length * 0.2));
  const top = entries.slice(0, topN);
  const bottom = entries.slice(-topN);

  // Analyze which factors the top performers had higher values for
  const factors = ['velocity', 'cross_platform', 'emotion', 'format'];

  // We can't directly see these sub-scores in perf data, but we can use proxies:
  // - velocity proxy: trend_score_at_detection (higher = more velocity-driven)
  // - emotion proxy: which emotions perform best
  // - format proxy: which formats perform best

  // Emotion analysis
  const emotionPerf = {};
  entries.forEach(e => {
    if (!e.emotion) return;
    if (!emotionPerf[e.emotion]) emotionPerf[e.emotion] = { total_eng: 0, count: 0 };
    emotionPerf[e.emotion].total_eng += e.engagement_rate;
    emotionPerf[e.emotion].count++;
  });
  const emotionAvgs = {};
  for (const [em, data] of Object.entries(emotionPerf)) {
    emotionAvgs[em] = data.count ? data.total_eng / data.count : 0;
  }

  // Format analysis
  const formatPerf = {};
  entries.forEach(e => {
    if (!e.format) return;
    if (!formatPerf[e.format]) formatPerf[e.format] = { total_eng: 0, count: 0 };
    formatPerf[e.format].total_eng += e.engagement_rate;
    formatPerf[e.format].count++;
  });
  const formatAvgs = {};
  for (const [fmt, data] of Object.entries(formatPerf)) {
    formatAvgs[fmt] = data.count ? data.total_eng / data.count : 0;
  }

  // Score correlation: do higher trend scores predict better performance?
  const topAvgScore = top.reduce((s, e) => s + (e.trend_score_at_detection || 0), 0) / top.length;
  const bottomAvgScore = bottom.reduce((s, e) => s + (e.trend_score_at_detection || 0), 0) / bottom.length;
  const scoreCorrelation = topAvgScore > bottomAvgScore ? 1 : -0.5;

  // Adjust weights
  const current = getWeights();
  const lr = 0.05; // learning rate — small nudges

  // If score correlation is positive, our weighting is working — make small adjustments
  // If negative, we need to shift weights more
  if (scoreCorrelation > 0) {
    // System is working. Look for which emotions/formats outperform.
    // Nudge emotion weight up if emotion patterns are strong
    const emotionVariance = Object.values(emotionAvgs).length > 1 ?
      Math.max(...Object.values(emotionAvgs)) - Math.min(...Object.values(emotionAvgs)) : 0;
    if (emotionVariance > 2) {
      current.emotion = Math.min(0.4, current.emotion + lr);
      current.velocity = Math.max(0.2, current.velocity - lr / 3);
    }

    const formatVariance = Object.values(formatAvgs).length > 1 ?
      Math.max(...Object.values(formatAvgs)) - Math.min(...Object.values(formatAvgs)) : 0;
    if (formatVariance > 2) {
      current.format = Math.min(0.4, current.format + lr);
      current.velocity = Math.max(0.2, current.velocity - lr / 3);
    }
  } else {
    // Score doesn't predict performance — increase velocity weight (raw signal)
    current.velocity = Math.min(0.6, current.velocity + lr * 2);
    current.emotion = Math.max(0.1, current.emotion - lr / 2);
    current.format = Math.max(0.1, current.format - lr / 2);
  }

  // Normalize to sum to 1.0
  const sum = current.velocity + current.cross_platform + current.emotion + current.format;
  current.velocity = Math.round(current.velocity / sum * 100) / 100;
  current.cross_platform = Math.round(current.cross_platform / sum * 100) / 100;
  current.emotion = Math.round(current.emotion / sum * 100) / 100;
  current.format = Math.round((1 - current.velocity - current.cross_platform - current.emotion) * 100) / 100;

  current.adjusted_at = Date.now();
  current.adjustments = (current.adjustments || 0) + 1;
  current.last_analysis = {
    entries_analyzed: entries.length,
    top_emotions: emotionAvgs,
    top_formats: formatAvgs,
    score_correlation: scoreCorrelation,
  };

  writeJSON(WEIGHTS_FILE, current);

  return {
    adjusted: true,
    weights: current,
    analysis: current.last_analysis,
  };
}

/**
 * Get performance summary dashboard data
 */
function getSummary() {
  const perf = readJSON(PERF_FILE, { entries: [] });
  const entries = perf.entries;
  const weights = getWeights();

  if (!entries.length) {
    return { entries: 0, weights, avg_engagement: 0, top_emotion: null, top_format: null, platforms: {} };
  }

  const totalEng = entries.reduce((s, e) => s + e.engagement_rate, 0);

  // Best emotion
  const byEmotion = {};
  entries.forEach(e => {
    if (!e.emotion) return;
    if (!byEmotion[e.emotion]) byEmotion[e.emotion] = [];
    byEmotion[e.emotion].push(e.engagement_rate);
  });
  const emotionRanked = Object.entries(byEmotion)
    .map(([em, rates]) => ({ emotion: em, avg: rates.reduce((a, b) => a + b, 0) / rates.length, count: rates.length }))
    .sort((a, b) => b.avg - a.avg);

  // Best format
  const byFormat = {};
  entries.forEach(e => {
    if (!e.format) return;
    if (!byFormat[e.format]) byFormat[e.format] = [];
    byFormat[e.format].push(e.engagement_rate);
  });
  const formatRanked = Object.entries(byFormat)
    .map(([fmt, rates]) => ({ format: fmt, avg: rates.reduce((a, b) => a + b, 0) / rates.length, count: rates.length }))
    .sort((a, b) => b.avg - a.avg);

  // By platform
  const byPlatform = {};
  entries.forEach(e => {
    if (!byPlatform[e.platform]) byPlatform[e.platform] = { views: 0, likes: 0, comments: 0, shares: 0, count: 0 };
    const p = byPlatform[e.platform];
    p.views += e.views; p.likes += e.likes; p.comments += e.comments; p.shares += e.shares; p.count++;
  });

  return {
    entries: entries.length,
    weights,
    avg_engagement: Math.round(totalEng / entries.length * 100) / 100,
    top_emotions: emotionRanked.slice(0, 5),
    top_formats: formatRanked.slice(0, 5),
    platforms: byPlatform,
    last_adjusted: weights.adjusted_at,
    adjustment_count: weights.adjustments || 0,
  };
}

module.exports = {
  getWeights,
  recordPerformance,
  getPerformance,
  adjustWeights,
  getSummary,
  DEFAULT_WEIGHTS,
};
