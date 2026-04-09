/**
 * Advanced Trend Scoring Engine
 * Replaces naive scoring with multi-factor velocity-based system
 */

// ── Emotion keywords (heuristic, no LLM needed) ──
const EMOTION_LEXICON = {
  anger:     ['outrage','scandal','fired','slammed','destroyed','exposed','backlash','furious','disgusting','corrupt','rigged','scam','fraud','betrayed','cancelled'],
  fear:      ['crash','collapse','warning','danger','panic','emergency','threat','risk','plunge','recession','layoff','bankrupt','shutdown','catastrophe','crisis'],
  money:     ['profit','revenue','billion','million','invest','wealth','income','dividend','roi','earnings','salary','funding','ipo','valuation','broke','rich'],
  status:    ['exclusive','elite','luxury','first','winner','champion','legend','genius','goat','iconic','viral','famous','celebrity','milestone','record'],
  curiosity: ['secret','hidden','revealed','shocking','unexpected','mystery','why','how','truth','nobody','actually','really','discovered','strange','weird','insane'],
};

// ── Format patterns ──
const FORMAT_PATTERNS = {
  story:         ['story','journey','experience','happened','went','told','life','day in','behind the scenes','transformation'],
  clip:          ['watch','video','clip','footage','moment','caught','live','stream','highlight','reaction'],
  debate:        ['vs','debate','opinion','agree','disagree','controversial','take','hot take','unpopular','should'],
  shock:         ['breaking','insane','unbelievable','wtf','omg','crazy','impossible','never seen','jaw','stunned','shocking'],
  informational: ['how to','guide','tutorial','explained','learn','tips','steps','everything you','what is','beginner','complete'],
};

/**
 * Compute emotion scores from text
 * Returns { dominant, scores: { anger, fear, money, status, curiosity } }
 */
function classifyEmotion(text) {
  if (!text) return { dominant: 'neutral', score: 0, scores: {} };
  const lower = text.toLowerCase();
  const scores = {};
  let max = 0, dominant = 'neutral';

  for (const [emotion, words] of Object.entries(EMOTION_LEXICON)) {
    const hits = words.filter(w => lower.includes(w)).length;
    const score = Math.min(1, hits / 3); // 3 hits = max
    scores[emotion] = score;
    if (score > max) { max = score; dominant = emotion; }
  }

  return { dominant, score: max, scores };
}

/**
 * Classify content format from text
 * Returns { format, score }
 */
function classifyFormat(text) {
  if (!text) return { format: 'unknown', score: 0 };
  const lower = text.toLowerCase();
  let best = 'unknown', max = 0;

  for (const [fmt, patterns] of Object.entries(FORMAT_PATTERNS)) {
    const hits = patterns.filter(p => lower.includes(p)).length;
    const score = Math.min(1, hits / 2); // 2 hits = max
    if (score > max) { max = score; best = fmt; }
  }

  return { format: best, score: max };
}

/**
 * Compute cross-platform presence score
 * @param {object} item - the item being scored
 * @param {array} allItems - all items in the dataset
 * Returns 0-1 score (higher = appears on more platforms)
 */
function crossPlatformScore(item, allItems) {
  if (!item.title || !allItems.length) return 0;

  // Extract keywords (3+ char words, skip common words)
  const stopwords = new Set(['the','and','for','are','but','not','you','all','can','had','her','was','one','our','out','has','his','how','its','may','new','now','old','see','way','who','did','get','has','him','let','say','she','too','use','with','that','this','will','from','they','been','have','many','some','them','than','each','make','like','long','look','come','made','find','here','thing','many','well','only','very','just','about','also','back','been','could','every','into','just','more','most','much','must','over','such','take','than','them','then','these','what','when','where','which','while','your','would','there','their','other','after','before','should','through','between','during','without','another','because','different','possible','important']);
  const words = (item.title || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length >= 4 && !stopwords.has(w));
  if (!words.length) return 0;

  // Find which distinct sources mention similar keywords
  const sourcesMatched = new Set();
  const mySource = (item.source || '').toLowerCase();

  for (const other of allItems) {
    if (other === item) continue;
    const otherSource = (other.source || '').toLowerCase();
    if (otherSource === mySource) continue;

    const otherTitle = (other.title || '').toLowerCase();
    const overlap = words.filter(w => otherTitle.includes(w)).length;
    if (overlap >= 2) { // at least 2 keyword overlap
      sourcesMatched.add(otherSource);
    }
  }

  // Normalize: 0 sources = 0, 1 = 0.3, 2 = 0.6, 3+ = 1.0
  const count = sourcesMatched.size;
  if (count === 0) return 0;
  if (count === 1) return 0.3;
  if (count === 2) return 0.6;
  return 1.0;
}

/**
 * Platform weight multipliers (some platforms signal stronger trends)
 */
const PLATFORM_WEIGHTS = {
  'YouTube Trending': 1.3,
  'Hacker News': 1.2,
  'r/popular': 1.15,
  'r/videos': 1.1,
  'default': 1.0,
};

/**
 * Main scoring function
 * @param {object} item - content item with title, ups, comments, views, published_at, source
 * @param {array} allItems - all items for cross-platform comparison
 * @param {object} weights - optional weight overrides from feedback loop
 * Returns enriched item with trend_score + metadata
 */
function computeTrendScore(item, allItems = [], weights = null) {
  const w = weights || { velocity: 0.4, cross_platform: 0.2, emotion: 0.2, format: 0.2 };
  const now = Date.now();

  // ── 1. Velocity Score ──
  const minutesSince = Math.max(1, (now - (item.published_at || now)) / 60000);
  const ups = item.ups || 0;
  const comments = item.comments || 0;
  const views = item.views || item.view_count || 0;
  const rawVelocity = (ups + comments * 2 + views / 100) / minutesSince;
  // Normalize: log scale, cap at 1.0
  const velocityScore = Math.min(1, Math.log10(rawVelocity + 1) / 3);

  // ── 2. Cross-Platform Presence ──
  const xPlatScore = crossPlatformScore(item, allItems);

  // ── 3. Emotion Classification ──
  const emotion = classifyEmotion(item.title + ' ' + (item.description || ''));

  // ── 4. Format Detection ──
  const format = classifyFormat(item.title + ' ' + (item.description || ''));

  // ── 5. Platform boost ──
  const platWeight = PLATFORM_WEIGHTS[item.source] || PLATFORM_WEIGHTS['default'];

  // ── Final Score ──
  const rawScore = (
    velocityScore * w.velocity +
    xPlatScore * w.cross_platform +
    emotion.score * w.emotion +
    format.score * w.format
  ) * platWeight;

  const trendScore = Math.min(100, Math.round(rawScore * 100));

  // Enrich item
  item.trend_score = trendScore;
  item.velocity = Math.round(rawVelocity * 100) / 100;
  item.velocity_score = Math.round(velocityScore * 100) / 100;
  item.cross_platform_score = xPlatScore;
  item.emotion = emotion.dominant;
  item.emotion_score = Math.round(emotion.score * 100) / 100;
  item.emotion_detail = emotion.scores;
  item.format = format.format;
  item.format_score = Math.round(format.score * 100) / 100;
  item.scored_at = now;

  return item;
}

/**
 * Score all items and auto-filter
 * Returns { top: [...], low: [...], threshold }
 */
function scoreAndFilter(items, allItems, weights, topPercent = 0.2) {
  // Score all
  items.forEach(it => computeTrendScore(it, allItems || items, weights));

  // Sort descending
  items.sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0));

  // Split into top tier and low priority
  const cutoff = Math.max(1, Math.floor(items.length * topPercent));
  const threshold = items[cutoff - 1]?.trend_score || 0;

  const top = items.slice(0, cutoff);
  const low = items.slice(cutoff);

  // Mark items
  top.forEach(it => { it.priority = 'high'; it.auto_filtered = false; });
  low.forEach(it => { it.priority = 'low'; it.auto_filtered = true; });

  return { top, low, threshold, total: items.length };
}

module.exports = {
  computeTrendScore,
  scoreAndFilter,
  classifyEmotion,
  classifyFormat,
  crossPlatformScore,
  EMOTION_LEXICON,
  FORMAT_PATTERNS,
};
