/**
 * Auto Content Generation Engine
 * Triggers when trend_score or cluster_score > threshold
 * Generates hooks, scripts, captions for each selected trend
 */

const HOOK_TEMPLATES = {
  anger:     [
    'Everyone is FURIOUS about {topic} — here\'s why',
    'They don\'t want you to know this about {topic}',
    '{topic} just exposed the entire industry',
  ],
  fear:      [
    'WARNING: {topic} could change everything',
    'If you\'re not paying attention to {topic}, you\'re already behind',
    '{topic} is about to blow up — and nobody\'s ready',
  ],
  money:     [
    'How {topic} is quietly making people rich',
    '{topic}: The money opportunity nobody\'s talking about',
    'I found the {topic} play before everyone else',
  ],
  status:    [
    '{topic} just hit a level nobody expected',
    'The {topic} moment that broke the internet',
    'Why {topic} changes the game forever',
  ],
  curiosity: [
    'The truth about {topic} that nobody\'s saying',
    'I spent 48 hours researching {topic} — here\'s what I found',
    '{topic}: What they\'re hiding in plain sight',
  ],
  neutral:   [
    'Breaking: {topic} — here\'s what you need to know',
    'The {topic} situation just got interesting',
    '{topic} is trending for a reason',
  ],
};

const ANGLE_TEMPLATES = {
  story:         ['Tell a personal story connecting to {topic}', 'Day-in-the-life angle on {topic} from insider perspective'],
  clip:          ['React to the viral {topic} clip with hot take', 'Stitch/duet the original {topic} video with your angle'],
  debate:        ['Take the unpopular side on {topic}', 'Present both sides of {topic} then drop your verdict'],
  shock:         ['Open with the most shocking stat about {topic}', 'Show the before/after of {topic} impact'],
  informational: ['Explain {topic} like I\'m 5 in 60 seconds', 'Top 3 things you need to know about {topic}'],
  unknown:       ['Give your raw take on {topic}', 'Quick breakdown of why {topic} matters right now'],
};

const PLATFORM_FORMATS = {
  tiktok:    { maxLen: 150, style: 'punchy, visual, fast cuts. Hook in first 1s. Text overlay heavy.', hashtags: 3 },
  youtube:   { maxLen: 100, style: 'strong title, pattern interrupt first 5s, story arc.', hashtags: 5 },
  instagram: { maxLen: 2200, style: 'carousel or reel. Lead with value. CTA in caption.', hashtags: 15 },
  twitter:   { maxLen: 280, style: 'one-liner hook → thread. Controversial take wins.', hashtags: 2 },
};

/**
 * Generate content package for a trend or cluster
 *
 * @param {object} trend - { title, emotion, format, keywords, trend_score, sources }
 * @param {object} opts - { platforms, aggressive }
 * @returns {object} content package
 */
function generateContent(trend, opts = {}) {
  const topic = trend.label || trend.title || 'this topic';
  const emotion = trend.emotion || 'neutral';
  const format = trend.format || 'unknown';
  const keywords = trend.keywords || [];
  const platforms = opts.platforms || ['tiktok', 'youtube', 'instagram', 'twitter'];

  // ── Hooks (3 emotion-matched) ──
  const hookTemplates = HOOK_TEMPLATES[emotion] || HOOK_TEMPLATES.neutral;
  const hooks = hookTemplates.map(h => h.replace(/\{topic\}/g, topic));

  // ── Aggressive/controversial version ──
  const aggressive = generateAggressive(topic, emotion, keywords);

  // ── Content angles (2 format-matched) ──
  const angleTemplates = ANGLE_TEMPLATES[format] || ANGLE_TEMPLATES.unknown;
  const angles = angleTemplates.map(a => a.replace(/\{topic\}/g, topic));

  // ── Platform-specific scripts ──
  const scripts = {};
  for (const plat of platforms) {
    const pf = PLATFORM_FORMATS[plat] || PLATFORM_FORMATS.tiktok;
    scripts[plat] = {
      hook: hooks[0],
      style: pf.style,
      script: buildScript(topic, emotion, format, plat),
      caption: buildCaption(topic, keywords, plat),
      hashtags: buildHashtags(keywords, plat),
    };
  }

  // ── Captions (one per platform) ──
  const captions = {};
  for (const plat of platforms) {
    captions[plat] = scripts[plat].caption;
  }

  return {
    trend_id: trend.cluster_id || trend.id || null,
    trend_title: topic,
    trend_score: trend.cluster_score || trend.trend_score || 0,
    emotion,
    format,
    generated_at: Date.now(),
    hooks,
    aggressive,
    angles,
    scripts,
    captions,
    platforms,
    keywords,
    sources: trend.sources || [trend.source],
  };
}

function buildScript(topic, emotion, format, platform) {
  const pf = PLATFORM_FORMATS[platform] || PLATFORM_FORMATS.tiktok;

  // Structure: hook → context → payoff → CTA
  const sections = [];

  // Hook
  const hookSet = HOOK_TEMPLATES[emotion] || HOOK_TEMPLATES.neutral;
  sections.push(`[HOOK - first 1-3s]\n"${hookSet[0].replace(/\{topic\}/g, topic)}"`);

  // Context
  sections.push(`[CONTEXT - 5-15s]\nBriefly explain what's happening with ${topic}. Use on-screen text. ${pf.style}`);

  // Payoff
  if (format === 'debate') {
    sections.push(`[PAYOFF - 15-30s]\nDrop your take. Be polarizing. Pick a side on ${topic}.`);
  } else if (format === 'story') {
    sections.push(`[PAYOFF - 15-45s]\nShare the personal angle. Make it relatable. Connect ${topic} to the viewer.`);
  } else if (format === 'shock') {
    sections.push(`[PAYOFF - 10-20s]\nReveal the shocking part. Pause for effect. Show proof if possible.`);
  } else {
    sections.push(`[PAYOFF - 15-30s]\nDeliver the insight. Make it actionable or memorable.`);
  }

  // CTA
  if (platform === 'tiktok' || platform === 'instagram') {
    sections.push(`[CTA]\n"Follow for more on ${topic}" + save/share prompt`);
  } else if (platform === 'youtube') {
    sections.push(`[CTA]\n"Subscribe + hit the bell — I'm covering this all week"`);
  } else {
    sections.push(`[CTA]\n"RT if you agree. Drop your take below."`);
  }

  return sections.join('\n\n');
}

function buildCaption(topic, keywords, platform) {
  const pf = PLATFORM_FORMATS[platform] || PLATFORM_FORMATS.tiktok;
  const tags = buildHashtags(keywords, platform);
  const base = `${topic} — this is bigger than people think.`;

  if (platform === 'twitter') {
    return base.slice(0, 250) + '\n\n' + tags;
  }
  if (platform === 'instagram') {
    return base + '\n\nSave this for later.\n\n.\n.\n.\n' + tags;
  }
  return base + ' ' + tags;
}

function buildHashtags(keywords, platform) {
  const pf = PLATFORM_FORMATS[platform] || PLATFORM_FORMATS.tiktok;
  const count = pf.hashtags || 3;
  const base = ['#trending', '#viral', '#fyp'];
  const kwTags = keywords.slice(0, count).map(k => '#' + k.replace(/\s+/g, ''));
  return [...kwTags, ...base].slice(0, count + 2).join(' ');
}

function generateAggressive(topic, emotion, keywords) {
  const templates = [
    `Nobody has the guts to say this about ${topic} — so I will.`,
    `${topic} is a SCAM and here's the proof nobody wants you to see.`,
    `Everyone celebrating ${topic} is WRONG. Here's the real story.`,
    `I'm going to get cancelled for this ${topic} take. I don't care.`,
    `The ${topic} truth that the media is actively hiding from you.`,
  ];

  // Pick based on emotion
  const idx = emotion === 'anger' ? 1 : emotion === 'fear' ? 4 : emotion === 'money' ? 2 : 0;
  return {
    hook: templates[idx],
    angle: `Take the most controversial position on ${topic}. Back it up with one undeniable fact. Make people debate in the comments.`,
    warning: 'This version is intentionally provocative. Review before posting.',
  };
}

/**
 * Batch generate content for multiple hot trends/clusters
 */
function batchGenerate(trendOrClusters, scoreThreshold = 50) {
  const hot = trendOrClusters.filter(t => (t.cluster_score || t.trend_score || 0) >= scoreThreshold);
  return hot.map(t => generateContent(t));
}

module.exports = {
  generateContent,
  batchGenerate,
  HOOK_TEMPLATES,
  PLATFORM_FORMATS,
};
