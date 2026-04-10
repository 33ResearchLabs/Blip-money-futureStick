const BASE = '/api';
const DL = '/dl';

function authHeaders() {
  const token = localStorage.getItem('sr_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get(url) {
  const r = await fetch(url, { headers: { ...authHeaders() } });
  return r.json();
}

async function post(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  return r.json();
}

export const api = {
  // KV store
  kvGet: (k) => get(`${BASE}/kv?k=${k}`),
  kvSet: (k, v) => post(`${BASE}/kv`, { k, v }),

  // Trending
  getTrending: (params = '') => get(`${DL}/trending${params ? '?' + params : ''}`),
  refreshTrending: () => post(`${DL}/trending/refresh`),

  // News
  getNews: () => get(`${DL}/news/list`),
  refreshNews: () => post(`${DL}/news/refresh`),
  explodeNews: (item) => post(`${DL}/news/explode`, item),

  // Engine
  score: () => post(`${BASE}/engine/score`),
  getWeights: () => get(`${BASE}/engine/weights`),
  cluster: () => post(`${BASE}/engine/cluster`),
  getClusters: (min = 0, limit = 100) => get(`${BASE}/engine/clusters?min=${min}&limit=${limit}`),
  generate: () => post(`${BASE}/engine/generate`),
  generateSingle: (trend) => post(`${BASE}/engine/generate-single`, trend),
  getDashboard: () => get(`${BASE}/engine/dashboard`),

  // Queue
  getQueue: (params = '') => get(`${BASE}/queue${params ? '?' + params : ''}`),
  getQueueStats: () => get(`${BASE}/queue/stats`),
  addToQueue: (item) => post(`${BASE}/queue/add`, item),
  updateQueueStatus: (id, status) => post(`${BASE}/queue/status?id=${id}&status=${status}`),
  removeFromQueue: (id) => post(`${BASE}/queue/remove?id=${id}`),

  // Performance
  recordPerformance: (data) => post(`${BASE}/performance/record`, data),
  getPerformance: (params = '') => get(`${BASE}/performance${params ? '?' + params : ''}`),
  getPerformanceSummary: () => get(`${BASE}/performance/summary`),
  adjustWeights: () => post(`${BASE}/performance/adjust`),

  // Worker
  getWorkerState: () => get(`${BASE}/worker/state`),
  getWorkerLogs: (limit = 50) => get(`${BASE}/worker/logs?limit=${limit}`),
  runWorker: () => post(`${BASE}/worker/run`),
  configWorker: (config) => post(`${BASE}/worker/config`, config),

  // Social / Accounts
  getAccounts: () => get(`${DL}/accounts/list`),
  addAccount: (handle, platform) => post(`${DL}/accounts/add`, { handle, platform }),
  deleteAccount: (id) => get(`${DL}/accounts/delete?id=${id}`),
  getSocialFeed: (params = '') => get(`${BASE}/social/feed${params ? '?' + params : ''}`),
  refreshSocial: () => post(`${BASE}/social/refresh`),

  // Social profile fetchers
  getInstagram: (u) => get(`${DL}/insta?u=${u}`),
  getTwitter: (u) => get(`${DL}/twitter?u=${u}`),
  getYoutube: (u) => get(`${DL}/youtube?u=${u}`),
  getTiktok: (u) => get(`${DL}/tiktok?u=${u}`),

  // Dashboard
  getDashboardToday: () => get(`${DL}/dashboard/today`),

  // Vault
  saveToVault: (data) => post(`${DL}/vault/save`, data),
  getVault: () => get(`${DL}/vault/list`),

  // Tools
  rateImage: (url) => post(`${BASE}/ai`, { prompt: `Rate this image for social media: ${url}` }),
  checkHandle: (u) => get(`${BASE}/checkhandle?u=${u}`),
  getRadar: (niche) => get(`${BASE}/radar?niche=${niche}`),
  searchVideos: (q, source, time) => get(`${BASE}/videos/search?q=${encodeURIComponent(q||'')}&source=${source||'all'}&time=${time||'all'}`),
  getVideosDB: (platform, category, limit) => get(`${BASE}/videos/db?${platform?'platform='+platform+'&':''}${category?'category='+category+'&':''}limit=${limit||200}`),
  getVideoStats: () => get(`${BASE}/videos/stats`),
  crawlVideos: () => post(`${BASE}/videos/crawl`),
  generateImage: (prompt) => post(`${BASE}/imagegen`, { prompt }),
  callAI: (prompt, system) => post(`${BASE}/ai`, { prompt, system }),
  getOG: (u) => get(`${DL}/og?u=${encodeURIComponent(u)}`),
  proxyImage: (u) => `${DL}/proxy?u=${encodeURIComponent(u)}`,

  // Auth
  login: (email, password) => post('/api/auth/login', { email, password }),
  getMe: () => get('/api/auth/me'),
  getUsers: () => get('/api/auth/users'),
  register: (email, password, name, role) => post('/api/auth/register', { email, password, name, role }),
  deleteUser: (id) => post('/api/auth/delete', { id }),
  updateRole: (id, role) => post('/api/auth/role', { id, role }),
};
