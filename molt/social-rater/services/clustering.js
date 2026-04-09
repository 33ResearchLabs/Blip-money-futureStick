/**
 * Trend Clustering Engine
 * Groups similar items by keyword overlap into clusters
 */

const STOPWORDS = new Set([
  'the','and','for','are','but','not','you','all','can','had','was','one','our','out','has',
  'his','how','its','may','new','now','old','see','way','who','did','get','him','let','say',
  'she','too','use','with','that','this','will','from','they','been','have','many','some',
  'them','than','each','make','like','just','about','also','back','could','every','into',
  'more','most','much','must','over','such','take','then','what','when','where','which',
  'while','your','would','there','their','other','after','before','should','through',
  'between','during','without','another','because','different','possible','important',
  'being','going','really','still','first','last','only','very','even','these','those',
  'here','than','well','just','been','does','dont','wont','said','says','people','think',
]);

/**
 * Extract meaningful keywords from text
 */
function extractKeywords(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length >= 4 && !STOPWORDS.has(w));
}

/**
 * Compute Jaccard similarity between two keyword sets
 */
function similarity(a, b) {
  if (!a.length || !b.length) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  for (const w of setA) { if (setB.has(w)) intersection++; }
  const union = setA.size + setB.size - intersection;
  return union ? intersection / union : 0;
}

/**
 * Cluster trending items by keyword similarity
 * Uses single-pass greedy clustering (fast, no ML)
 *
 * @param {array} items - scored trending items
 * @param {number} threshold - similarity threshold (0-1, default 0.25)
 * @returns {array} clusters sorted by cluster_score desc
 *
 * Each cluster:
 * {
 *   cluster_id, label, keywords, items: [...],
 *   cluster_score, avg_score, max_score,
 *   sources: [...], emotion, format,
 *   item_count, created_at
 * }
 */
function clusterTrends(items, threshold = 0.25) {
  if (!items.length) return [];

  // Pre-compute keywords
  const keywordsMap = new Map();
  items.forEach(it => {
    keywordsMap.set(it.id || it.title, extractKeywords(it.title + ' ' + (it.description || '')));
  });

  const clusters = [];
  const assigned = new Set();

  // Sort by trend_score desc so best items seed clusters
  const sorted = [...items].sort((a, b) => (b.trend_score || 0) - (a.trend_score || 0));

  for (const item of sorted) {
    const itemId = item.id || item.title;
    if (assigned.has(itemId)) continue;

    const itemKw = keywordsMap.get(itemId) || [];
    if (!itemKw.length) continue;

    // Start new cluster with this item as seed
    const cluster = {
      cluster_id: 'cl_' + Date.now().toString(36) + '_' + clusters.length,
      items: [item],
      keywords: new Set(itemKw),
      sources: new Set([item.source]),
      created_at: Date.now(),
    };
    assigned.add(itemId);

    // Find all unassigned items similar to this cluster
    for (const candidate of sorted) {
      const cId = candidate.id || candidate.title;
      if (assigned.has(cId)) continue;
      const cKw = keywordsMap.get(cId) || [];
      if (!cKw.length) continue;

      const sim = similarity([...cluster.keywords], cKw);
      if (sim >= threshold) {
        cluster.items.push(candidate);
        cKw.forEach(w => cluster.keywords.add(w));
        cluster.sources.add(candidate.source);
        assigned.add(cId);
      }
    }

    clusters.push(cluster);
  }

  // Finalize cluster metadata
  return clusters
    .filter(c => c.items.length >= 1)
    .map(c => {
      const scores = c.items.map(i => i.trend_score || 0);
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const maxScore = Math.max(...scores);

      // Cluster score: boost multi-item clusters
      const sizeBoost = Math.min(1.5, 1 + (c.items.length - 1) * 0.1);
      const sourceBoost = Math.min(1.3, 1 + (c.sources.size - 1) * 0.15);
      const clusterScore = Math.min(100, Math.round(maxScore * sizeBoost * sourceBoost));

      // Dominant emotion + format from items
      const emotions = {};
      const formats = {};
      c.items.forEach(it => {
        if (it.emotion) emotions[it.emotion] = (emotions[it.emotion] || 0) + 1;
        if (it.format) formats[it.format] = (formats[it.format] || 0) + 1;
      });
      const topEmotion = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0];
      const topFormat = Object.entries(formats).sort((a, b) => b[1] - a[1])[0];

      // Label: top 3 keywords by frequency
      const kwFreq = {};
      c.items.forEach(it => {
        const kws = keywordsMap.get(it.id || it.title) || [];
        kws.forEach(w => { kwFreq[w] = (kwFreq[w] || 0) + 1; });
      });
      const topKw = Object.entries(kwFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);

      return {
        cluster_id: c.cluster_id,
        label: topKw.slice(0, 3).join(' + '),
        keywords: topKw,
        item_count: c.items.length,
        items: c.items.map(i => ({ id: i.id, title: i.title, source: i.source, trend_score: i.trend_score, url: i.url })),
        cluster_score: clusterScore,
        avg_score: avgScore,
        max_score: maxScore,
        sources: [...c.sources],
        source_count: c.sources.size,
        emotion: topEmotion ? topEmotion[0] : 'neutral',
        format: topFormat ? topFormat[0] : 'unknown',
        created_at: c.created_at,
      };
    })
    .sort((a, b) => b.cluster_score - a.cluster_score);
}

/**
 * Get hot clusters only (score above threshold)
 */
function getHotClusters(clusters, minScore = 50) {
  return clusters.filter(c => c.cluster_score >= minScore);
}

module.exports = {
  clusterTrends,
  getHotClusters,
  extractKeywords,
  similarity,
};
