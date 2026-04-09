/**
 * Social Account Ingestion
 * Pulls recent posts from tracked IG/TT/YT/X accounts
 * and converts them into engine-compatible items with video URLs
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');

function uid() { return crypto.randomBytes(6).toString('hex'); }
function readJSON(f, def) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return def; } }
function writeJSON(f, d) { fs.writeFileSync(f, JSON.stringify(d, null, 2)); }

const SOCIAL_FILE = path.join(DATA_DIR, 'social_feed.json');

/**
 * Get all tracked accounts from KV store
 * Tries: 1) local kv file, 2) API call to KV endpoint
 */
function getTrackedAccounts() {
  // Try local file first
  const kvFile = path.join(DATA_DIR, 'kv_brandAccounts.json');
  let brands = readJSON(kvFile, null);

  // Also check cached copy from API
  if (!brands) {
    const cached = readJSON(path.join(DATA_DIR, '_brandAccounts_cache.json'), null);
    if (cached) brands = cached;
  }

  if (!brands) return [];

  const accounts = [];
  for (const [brand, platforms] of Object.entries(brands)) {
    for (const [platform, handle] of Object.entries(platforms)) {
      const clean = (handle || '').replace(/^@/, '').trim();
      if (!clean) continue;
      const plat = platform === 'x' ? 'twitter' : platform;
      accounts.push({ brand, platform: plat, handle: clean });
    }
  }
  return accounts;
}

/**
 * Sync brand accounts from the KV API (port 8090 or wherever /api/kv lives)
 */
async function syncAccountsFromAPI(kvBaseUrl) {
  const fetch = require('node-fetch');
  try {
    const r = await fetch(`${kvBaseUrl}/api/kv?k=brandAccounts`, { timeout: 10000 });
    const d = await r.json();
    if (d.ok && d.v) {
      writeJSON(path.join(DATA_DIR, '_brandAccounts_cache.json'), d.v);
      return d.v;
    }
  } catch (e) {
    console.log('[social-ingest] failed to sync accounts from KV API:', e.message);
  }
  return null;
}

/**
 * Fetch posts from a single account via the local API endpoints
 * @param {string} baseUrl - e.g. 'http://127.0.0.1:3033'
 * @param {object} account - { brand, platform, handle }
 * @returns {array} engine-compatible items
 */
async function fetchAccountPosts(baseUrl, account) {
  const fetch = require('node-fetch');
  const { brand, platform, handle } = account;

  const endpointMap = {
    instagram: '/dl/insta',
    twitter: '/dl/twitter',
    youtube: '/dl/youtube',
    tiktok: '/dl/tiktok',
  };

  const ep = endpointMap[platform];
  if (!ep) return [];

  try {
    const r = await fetch(`${baseUrl}${ep}?u=${encodeURIComponent(handle)}`, { timeout: 30000 });
    const d = await r.json();
    if (!d.ok) return [];

    // Handle different response shapes: posts can be array or count, recent can be array
    const rawPosts = Array.isArray(d.posts) ? d.posts : Array.isArray(d.recent) ? d.recent : [];
    if (!rawPosts.length) return [];
    return rawPosts.map(p => ({
      id: 'social_' + uid(),
      title: (p.caption || p.title || p.description || '').slice(0, 300),
      url: p.url || p.permalink || buildPostUrl(platform, handle, p.id),
      source: `${platform}/@${handle}`,
      source_brand: brand,
      source_platform: platform,
      source_handle: handle,
      category: 'social',
      published_at: p.taken_at ? p.taken_at * 1000 : (p.timestamp ? p.timestamp * 1000 : Date.now()),
      fetched_at: Date.now(),
      ups: p.likes || p.like_count || 0,
      comments: p.comments || p.comment_count || 0,
      views: p.video_view_count || p.play_count || p.view_count || 0,
      thumb: p.thumb || p.thumbnail || p.thumbnail_src || '',
      has_video: p.is_video || platform === 'tiktok' || platform === 'youtube' || false,
      video_url: p.url || p.video_url || buildPostUrl(platform, handle, p.id),
      duration: p.duration || 0,
      is_social: true,
      // Account-level context
      account_followers: d.followers || 0,
      account_name: d.name || d.full_name || handle,
      account_verified: d.verified || d.is_verified || false,
      engagement_rate: d.followers > 0 ? ((p.likes || 0) + (p.comments || 0)) / d.followers * 100 : 0,
    }));
  } catch (e) {
    console.log(`[social-ingest] failed ${platform}/@${handle}: ${e.message}`);
    return [];
  }
}

function buildPostUrl(platform, handle, postId) {
  if (!postId) return '';
  switch (platform) {
    case 'instagram': return `https://www.instagram.com/p/${postId}/`;
    case 'twitter': return `https://x.com/${handle}/status/${postId}`;
    case 'youtube': return `https://www.youtube.com/watch?v=${postId}`;
    case 'tiktok': return `https://www.tiktok.com/@${handle}/video/${postId}`;
    default: return '';
  }
}

/**
 * Fetch all tracked accounts in parallel (with concurrency limit)
 * @param {string} baseUrl
 * @param {number} concurrency - max simultaneous requests
 * @returns {object} { items, accounts_fetched, accounts_failed, by_platform }
 */
async function fetchAllAccounts(baseUrl, concurrency = 3) {
  // Sync accounts from KV API — go through nginx (port 80) which routes /api/kv to the KV service
  const nginxUrl = 'http://127.0.0.1';
  await syncAccountsFromAPI(nginxUrl);

  // Use nginx for /dl/ endpoints too (nginx routes to the proper dl-service)
  baseUrl = nginxUrl;

  const accounts = getTrackedAccounts();
  if (!accounts.length) return { items: [], accounts_fetched: 0, accounts_failed: 0, by_platform: {} };

  const allItems = [];
  let fetched = 0, failed = 0;
  const byPlatform = {};

  // Process in batches to avoid hammering APIs
  for (let i = 0; i < accounts.length; i += concurrency) {
    const batch = accounts.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map(acc => fetchAccountPosts(baseUrl, acc))
    );

    results.forEach((r, idx) => {
      const acc = batch[idx];
      const plat = acc.platform;
      if (!byPlatform[plat]) byPlatform[plat] = { fetched: 0, failed: 0, posts: 0 };

      if (r.status === 'fulfilled' && r.value.length > 0) {
        allItems.push(...r.value);
        fetched++;
        byPlatform[plat].fetched++;
        byPlatform[plat].posts += r.value.length;
      } else {
        failed++;
        byPlatform[plat].failed++;
      }
    });

    // Small delay between batches to be polite
    if (i + concurrency < accounts.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Dedupe by title similarity
  const seen = new Set();
  const deduped = allItems.filter(it => {
    const key = (it.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Save social feed
  writeJSON(SOCIAL_FILE, { items: deduped, updated_at: Date.now(), stats: { fetched, failed, by_platform: byPlatform } });

  return { items: deduped, accounts_fetched: fetched, accounts_failed: failed, by_platform: byPlatform };
}

/**
 * Get cached social feed
 */
function getCachedFeed() {
  return readJSON(SOCIAL_FILE, { items: [], updated_at: 0 });
}

/**
 * Merge social items with trending items for unified scoring
 */
function mergeWithTrending(socialItems, trendingItems) {
  // Avoid duplicates — check by URL
  const existingUrls = new Set(trendingItems.map(i => i.url).filter(Boolean));
  const newItems = socialItems.filter(i => !existingUrls.has(i.url));
  return [...trendingItems, ...newItems];
}

module.exports = {
  getTrackedAccounts,
  syncAccountsFromAPI,
  fetchAccountPosts,
  fetchAllAccounts,
  getCachedFeed,
  mergeWithTrending,
};
