/**
 * Content Queue / Distribution Prep System
 * Manages content_queue.json — staging area before posting
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const QUEUE_FILE = path.join(DATA_DIR, 'content_queue.json');

function uid() { return crypto.randomBytes(6).toString('hex'); }
function readQueue() {
  try { return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8')); }
  catch { return { items: [], updated_at: 0 }; }
}
function writeQueue(data) {
  data.updated_at = Date.now();
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2));
}

/**
 * Add generated content to the queue
 * @param {object} content - output from contentEngine.generateContent()
 * @param {object} opts - { scheduledAt, priority, notes }
 * @returns {object} queue item with id
 */
function enqueue(content, opts = {}) {
  const queue = readQueue();

  const item = {
    id: 'q_' + uid(),
    status: 'pending',       // pending | approved | rejected | published | failed
    trend_id: content.trend_id,
    trend_title: content.trend_title,
    trend_score: content.trend_score,
    emotion: content.emotion,
    format: content.format,
    platforms: content.platforms || [],
    hooks: content.hooks || [],
    aggressive: content.aggressive || null,
    angles: content.angles || [],
    scripts: content.scripts || {},
    captions: content.captions || {},
    keywords: content.keywords || [],
    sources: content.sources || [],
    // Timing
    queued_at: Date.now(),
    detection_time: content.generated_at ? content.generated_at - (content.detected_at || content.generated_at) : 0,
    generation_time: content.generated_at || Date.now(),
    scheduled_at: opts.scheduledAt || null,
    published_at: null,
    // Meta
    priority: opts.priority || (content.trend_score >= 70 ? 'urgent' : content.trend_score >= 40 ? 'normal' : 'low'),
    notes: opts.notes || '',
    auto_generated: true,
    reviewed: false,
  };

  queue.items.unshift(item);

  // Keep queue manageable — max 500 items
  if (queue.items.length > 500) {
    queue.items = queue.items.slice(0, 500);
  }

  writeQueue(queue);
  return item;
}

/**
 * Batch enqueue from contentEngine.batchGenerate output
 */
function batchEnqueue(contentArray) {
  const results = [];
  for (const c of contentArray) {
    results.push(enqueue(c));
  }
  return results;
}

/**
 * Get queue items with optional filters
 */
function getQueue(filters = {}) {
  const queue = readQueue();
  let items = queue.items;

  if (filters.status) items = items.filter(i => i.status === filters.status);
  if (filters.platform) items = items.filter(i => i.platforms.includes(filters.platform));
  if (filters.priority) items = items.filter(i => i.priority === filters.priority);
  if (filters.emotion) items = items.filter(i => i.emotion === filters.emotion);

  const limit = filters.limit || 100;
  return { items: items.slice(0, limit), total: items.length, updated_at: queue.updated_at };
}

/**
 * Update a queue item's status
 */
function updateStatus(id, status, extra = {}) {
  const queue = readQueue();
  const item = queue.items.find(i => i.id === id);
  if (!item) return null;

  item.status = status;
  if (status === 'published') item.published_at = Date.now();
  if (status === 'approved') item.reviewed = true;
  Object.assign(item, extra);

  writeQueue(queue);
  return item;
}

/**
 * Remove a queue item
 */
function remove(id) {
  const queue = readQueue();
  queue.items = queue.items.filter(i => i.id !== id);
  writeQueue(queue);
}

/**
 * Get queue stats
 */
function getStats() {
  const queue = readQueue();
  const items = queue.items;
  return {
    total: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    approved: items.filter(i => i.status === 'approved').length,
    published: items.filter(i => i.status === 'published').length,
    rejected: items.filter(i => i.status === 'rejected').length,
    urgent: items.filter(i => i.priority === 'urgent').length,
    by_platform: {
      tiktok: items.filter(i => i.platforms.includes('tiktok')).length,
      youtube: items.filter(i => i.platforms.includes('youtube')).length,
      instagram: items.filter(i => i.platforms.includes('instagram')).length,
      twitter: items.filter(i => i.platforms.includes('twitter')).length,
    },
    by_emotion: ['anger','fear','money','status','curiosity','neutral'].reduce((acc, e) => {
      acc[e] = items.filter(i => i.emotion === e).length;
      return acc;
    }, {}),
    updated_at: queue.updated_at,
  };
}

/**
 * Compute latency stats for published items
 */
function getLatencyStats() {
  const queue = readQueue();
  const published = queue.items.filter(i => i.status === 'published' && i.published_at);

  if (!published.length) return { avg: 0, min: 0, max: 0, count: 0 };

  const latencies = published.map(i => {
    const detect2gen = i.generation_time - (i.queued_at - (i.detection_time || 0));
    const gen2pub = i.published_at - i.generation_time;
    const total = i.published_at - (i.queued_at - (i.detection_time || 0));
    return { total, detect2gen, gen2pub };
  });

  const totals = latencies.map(l => l.total);
  return {
    avg_total_ms: Math.round(totals.reduce((a, b) => a + b, 0) / totals.length),
    min_total_ms: Math.min(...totals),
    max_total_ms: Math.max(...totals),
    count: published.length,
    avg_total_human: msToHuman(totals.reduce((a, b) => a + b, 0) / totals.length),
  };
}

function msToHuman(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return s + 's';
  if (s < 3600) return Math.floor(s / 60) + 'm ' + (s % 60) + 's';
  return Math.floor(s / 3600) + 'h ' + Math.floor((s % 3600) / 60) + 'm';
}

module.exports = {
  enqueue,
  batchEnqueue,
  getQueue,
  updateStatus,
  remove,
  getStats,
  getLatencyStats,
  readQueue,
};
