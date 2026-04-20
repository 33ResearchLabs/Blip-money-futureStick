import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import LineChart from '../components/LineChart';

const FONT = "'JetBrains Mono', 'SF Mono', 'Menlo', monospace";
const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '\u2014'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const toInt = v => { if(typeof v==='number') return v; if(typeof v==='string'){const m=v.replace(/,/g,'').match(/([\d.]+)\s*([KkMm]?)/); if(!m) return 0; let x=parseFloat(m[1]); if(/[Kk]/.test(m[2]))x*=1000; if(/[Mm]/.test(m[2]))x*=1e6; return Math.round(x);} return 0; };

const BRANDS = [
  { id: 'blip', name: 'Blip Money' },
  { id: 'lifestyle', name: 'Lifestyle' },
  { id: 'finance', name: 'Finance' },
  { id: 'crypto', name: 'Crypto' },
];
const PLAT_LABELS = { instagram: 'IG', x: 'X', youtube: 'YT', tiktok: 'TT', linkedin: 'LI', facebook: 'FB', threads: 'TH', telegram: 'TG', discord: 'DC', reddit: 'RD' };
const PLAT_ICONS = { instagram: '\ud83d\udcf8', x: '\ud835\udd4f', youtube: '\u25b6', tiktok: '\ud83c\udfb5', linkedin: '\ud83d\udcbc', facebook: '\ud83d\udc65', threads: '\ud83e\uddf5' };
const PLAT_FETCHER = {
  instagram: h => api.getInstagram(h),
  x: h => api.getTwitter(h),
  twitter: h => api.getTwitter(h),
  youtube: h => api.getYoutube(h),
  tiktok: h => api.getTiktok(h),
};

// Colors from old monolith
const C = {
  bg: '#0a0a0c',
  card: '#0f1014',
  darker: '#0c0e14',
  border: '#1c1e24',
  borderHover: '#2a3346',
  blue: '#5b8aff',
  blueBg: '#1a1f2e',
  blueBorder: '#2a3346',
  orange: '#f97316',
  orangeBg: '#1c1108',
  orangeBorder: '#3d2508',
  green: '#22c55e',
  red: '#ef4444',
  redDel: '#ff5566',
  redDelBorder: '#2a1520',
  text: '#d6dde6',
  muted: '#5a606c',
  muted2: '#6a7180',
  dim: '#9ba3af',
  input: '#15171d',
  btnPrimBg: '#1e3056',
  btnPrimColor: '#a8c4ff',
  btnPrimBorder: '#2a4276',
  subtabBg: '#0a0c12',
  subtabBorder: '#14161e',
};

const inputStyle = {
  background: C.input, border: `1px solid ${C.border}`, color: C.text,
  padding: '6px 8px', borderRadius: 3, fontFamily: FONT, fontSize: '.68rem',
  outline: 'none', boxSizing: 'border-box',
};
const btnStyle = {
  background: C.input, border: `1px solid ${C.border}`, color: C.dim,
  padding: '5px 11px', borderRadius: 3, fontFamily: FONT, fontSize: '.65rem',
  cursor: 'pointer', textTransform: 'lowercase',
};
const btnPrimStyle = {
  ...btnStyle, background: C.btnPrimBg, color: C.btnPrimColor, border: `1px solid ${C.btnPrimBorder}`,
};

export default function Accounts() {
  const [subTab, setSubTab] = useState('brands');
  const [brandAccounts, setBrandAccounts] = useState({});
  const [selected, setSelected] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileTab, setProfileTab] = useState('posts'); // posts | analysis
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [dashData, setDashData] = useState(null);
  const [history, setHistory] = useState([]);
  const [chartMetric, setChartMetric] = useState('views');
  const [chartDays, setChartDays] = useState(30);
  const [dashView, setDashView] = useState('dashboard'); // 'dashboard' | 'analytics' | 'recent'
  const [recentHours, setRecentHours] = useState(24);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentSort, setRecentSort] = useState({ key: 'posted', dir: 'desc' });
  const [postModal, setPostModal] = useState(null); // { post, handle, plat, followers }
  const [postReport, setPostReport] = useState(null);
  const [postReportLoading, setPostReportLoading] = useState(false);
  const navigate = useNavigate();
  const [dashLoading, setDashLoading] = useState(false);

  const [addBrand, setAddBrand] = useState('blip');
  const [addPlat, setAddPlat] = useState('instagram');
  const [addHandle, setAddHandle] = useState('');

  const [snData, setSnData] = useState([]);
  const [snSelected, setSnSelected] = useState(null);
  const [snProfile, setSnProfile] = useState(null);
  const [snLoading, setSnLoading] = useState(false);
  const [snFilter, setSnFilter] = useState('all');
  const [snAddPlat, setSnAddPlat] = useState('instagram');
  const [snAddHandle, setSnAddHandle] = useState('');
  const [snAddBrand, setSnAddBrand] = useState('all');

  const loadBrands = useCallback(async () => {
    try {
      const d = await api.kvGet('brandAccounts');
      const v = d?.value ?? d?.v;
      // Only replace state if the API returned a real value. Never silently overwrite with {}.
      if (v && typeof v === 'object' && Object.keys(v).length) setBrandAccounts(v);
      else if (d && d.ok === false) console.warn('brandAccounts load failed, keeping existing state');
    } catch (e) { console.warn('brandAccounts load error:', e?.message); }
  }, []);

  const loadDashboard = useCallback(async (accs) => {
    const ba = accs || brandAccounts;
    if (!Object.keys(ba).length) return;
    setDashLoading(true);
    const results = [];
    for (const [brand, plats] of Object.entries(ba)) {
      for (const [plat, handle] of Object.entries(plats)) {
        const clean = (handle || '').replace(/^@/, '');
        const fetcher = PLAT_FETCHER[plat];
        if (!fetcher || !clean) continue;
        results.push({ brand, plat, handle: clean, promise: fetcher(clean).catch(() => null) });
      }
    }
    const fetched = await Promise.all(results.map(r => r.promise));
    let totalFollowers = 0, totalFollowing = 0, totalViews = 0, totalLikes = 0, totalComments = 0, totalPosts = 0;
    const byBrand = {};
    const accountRows = [];
    results.forEach((r, i) => {
      const d = fetched[i];
      if (!d || d.ok === false) return;
      const posts = d.posts || d.recent || [];
      const fol = toInt(d.followers);
      const views = posts.reduce((s, p) => s + toInt(p.video_view_count || p.play_count || p.view_count || 0), 0);
      const likes = posts.reduce((s, p) => s + toInt(p.likes || p.like_count || 0), 0);
      const comments = posts.reduce((s, p) => s + toInt(p.comments || p.comment_count || 0), 0);
      totalFollowers += fol; totalFollowing += toInt(d.following); totalViews += views; totalLikes += likes; totalComments += comments; totalPosts += posts.length;
      if (!byBrand[r.brand]) byBrand[r.brand] = { followers: 0, views: 0, likes: 0, accounts: 0 };
      byBrand[r.brand].followers += fol; byBrand[r.brand].views += views; byBrand[r.brand].likes += likes; byBrand[r.brand].accounts++;
      accountRows.push({ ...r, d, fol, views, likes, comments, posts: posts.length });
    });
    accountRows.sort((a, b) => b.fol - a.fol);
    const engRate = totalFollowers ? (((totalLikes + totalComments) / (totalPosts || 1)) / totalFollowers * 100).toFixed(2) : '\u2014';
    const avgViewsPerPost = totalPosts ? Math.round(totalViews / totalPosts) : 0;
    const bestAccount = accountRows[0] || null;
    const byPlatform = {};
    accountRows.forEach(r => {
      if (!byPlatform[r.plat]) byPlatform[r.plat] = { followers: 0, views: 0, likes: 0, accounts: 0, posts: 0 };
      byPlatform[r.plat].followers += r.fol; byPlatform[r.plat].views += r.views; byPlatform[r.plat].likes += r.likes; byPlatform[r.plat].accounts++; byPlatform[r.plat].posts += r.posts;
    });
    setDashData({ totalFollowers, totalFollowing, totalViews, totalLikes, totalComments, totalPosts, engRate, avgViewsPerPost, bestAccount, byBrand, byPlatform, accountRows, count: accountRows.length });
    setDashLoading(false);
  }, [brandAccounts]);

  const loadSN = useCallback(async () => {
    const d = await api.kvGet('supportNetwork');
    setSnData(Array.isArray(d.value) ? d.value : []);
  }, []);

  const loadDashFromDB = useCallback(async () => {
    setDashLoading(true);
    try {
      const d = await api.getAccountDashboard();
      if (d.ok && !d.empty) {
        setDashData({ ...d, accountRows: (d.accounts || []).map(a => ({ ...a, plat: a.platform, handle: a.handle, fol: a.followers, views: a.total_views, likes: a.total_likes, comments: a.total_comments, posts: a.posts_count })) });
      } else {
        setDashData(null);
      }
      // Also fetch history for chart
      try { const h = await api.getAccountHistory(chartDays); setHistory(h.history || []); } catch {}
    } catch {}
    setDashLoading(false);
  }, [chartDays]);

  useEffect(() => { loadBrands(); loadDashFromDB(); }, []);
  useEffect(() => { if (subTab === 'network') loadSN(); }, [subTab]);

  const loadRecent = useCallback(async (hours) => {
    setRecentLoading(true);
    try { const r = await api.getRecentPosts(hours, 10000); setRecentPosts(r.posts || []); } catch { setRecentPosts([]); }
    setRecentLoading(false);
  }, []);
  useEffect(() => { if (dashView === 'recent') loadRecent(recentHours); }, [dashView, recentHours, loadRecent]);

  const addBrandAccount = async () => {
    if (!addHandle.trim()) return;
    const h = addHandle.trim().replace(/^@/, '');
    const updated = { ...brandAccounts };
    if (!updated[addBrand]) updated[addBrand] = {};
    updated[addBrand][addPlat] = '@' + h;
    setBrandAccounts(updated);
    await api.kvSet('brandAccounts', updated);
    setAddHandle('');
  };

  const deleteBrandAccount = async (brand, plat) => {
    const updated = { ...brandAccounts };
    const handle = updated[brand]?.[plat]?.replace(/^@/, '') || '';
    if (updated[brand]) {
      delete updated[brand][plat];
      if (!Object.keys(updated[brand]).length) delete updated[brand];
    }
    setBrandAccounts(updated);
    await api.kvSet('brandAccounts', updated);
    // Also delete snapshot from DB
    if (handle) await api.deleteSnapshot(plat, handle);
    if (selected?.brand === brand && selected?.plat === plat) { setSelected(null); setProfile(null); }
    // Refresh dashboard
    loadDashFromDB();
  };

  const loadProfile = async (brand, plat, handle) => {
    const clean = handle.replace(/^@/, '');
    setSelected({ brand, plat, handle: clean });
    setProfile(null);
    setProfileLoading(true);
    try {
      const snapId = plat + '_' + clean.toLowerCase();
      const sr = await fetch(`/api/account-sync/profile/${encodeURIComponent(snapId)}`);
      const snap = await sr.json();
      if (snap && snap.ok) {
        setProfile({ ...snap, posts: snap.recent_posts || [], stale: false, stale_age: 0 });
      } else {
        setProfile(null);
      }
    } catch { setProfile(null); }
    setProfileLoading(false);
  };

  const snAdd = async () => {
    if (!snAddHandle.trim()) return;
    const h = snAddHandle.trim().replace(/^@/, '');
    const id = snAddPlat + '_' + h.toLowerCase();
    if (snData.find(a => a.id === id)) return;
    const updated = [...snData, { id, platform: snAddPlat, handle: h, brand: snAddBrand, added_at: Date.now() }];
    setSnData(updated);
    await api.kvSet('supportNetwork', updated);
    setSnAddHandle('');
  };

  const snDelete = async (idx) => {
    const updated = snData.filter((_, i) => i !== idx);
    setSnData(updated);
    await api.kvSet('supportNetwork', updated);
  };

  const snLoadProfile = async (acc) => {
    setSnSelected(acc);
    setSnLoading(true);
    setSnProfile(null);
    const plat = acc.platform === 'x' ? 'twitter' : acc.platform;
    const fetcher = PLAT_FETCHER[plat];
    if (!fetcher) { setSnLoading(false); return; }
    try {
      const d = await fetcher(acc.handle);
      if (d.ok !== false) setSnProfile(d);
    } catch {}
    setSnLoading(false);
  };

  // ── Profile view (matches old an-prof / an-summary / an-posts) ──
  const runAnalysis = async (posts, handle, plat, followers) => {
    if (!posts.length) return;
    setAnalysisLoading(true); setAnalysis(null);
    const sorted = [...posts].sort((a, b) => toInt(b.views || b.video_view_count || b.play_count || b.view_count || 0) - toInt(a.views || a.video_view_count || a.play_count || a.view_count || 0));
    const postData = sorted.map((p, i) => ({
      rank: i + 1,
      caption: (p.caption || p.title || '').slice(0, 120),
      views: toInt(p.views || p.video_view_count || p.play_count || p.view_count || 0),
      likes: toInt(p.likes || p.like_count || 0),
      comments: toInt(p.comments || p.comment_count || 0),
      is_video: !!(p.is_video || p.video_view_count || p.play_count),
    }));
    const prompt = `You are a social media analyst. Analyze these ${plat} posts from @${handle} (${fmtN(followers)} followers), sorted by views (highest first).

POSTS:
${postData.map(p => `#${p.rank}. "${p.caption}" — ${fmtN(p.views)} views, ${fmtN(p.likes)} likes, ${fmtN(p.comments)} comments${p.is_video ? ' (video)' : ''}`).join('\n')}

Return STRICT JSON (no markdown fences):
{
  "summary": "2-3 sentence overall takeaway about what works for this account",
  "top_performers": [{"rank": 1, "why": "1-2 sentence explanation of WHY this post performed well"}, ...for top 4],
  "underperformers": [{"rank": N, "why": "1-2 sentence explanation of why this underperformed"}, ...for bottom 3],
  "recommendations": ["actionable tip 1", "actionable tip 2", "actionable tip 3"],
  "best_format": "video or photo or carousel",
  "best_topics": ["topic1", "topic2", "topic3"],
  "posting_insight": "one sentence about timing, frequency, or format"
}`;
    try {
      const r = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ max_tokens: 2000, messages: [{ role: 'user', content: prompt }] }),
      });
      const j = await r.json();
      let txt = (j.content && j.content[0] && j.content[0].text) || j.text || '';
      txt = txt.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
      const m = txt.match(/\{[\s\S]*\}/);
      if (m) txt = m[0];
      setAnalysis(JSON.parse(txt));
    } catch (e) { setAnalysis({ error: e.message }); }
    setAnalysisLoading(false);
  };

  const renderAnalysis = (a, posts) => {
    if (a.error) return <div style={{ color: C.red, padding: 20, fontSize: '.7rem' }}>Analysis failed: {a.error}</div>;
    const sorted = [...posts].sort((a, b) => toInt(b.views || b.video_view_count || b.play_count || b.view_count || 0) - toInt(a.views || a.video_view_count || a.play_count || a.view_count || 0));
    const getPost = (rank) => sorted[rank - 1];
    return (
      <div>
        {/* Summary */}
        <div style={{ padding: '14px 16px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 5, marginBottom: 14, fontSize: '.75rem', color: C.text, lineHeight: 1.6 }}>
          {a.summary}
        </div>

        {/* Insights row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 14 }}>
          <div style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
            <div style={{ fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Best Format</div>
            <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#fff' }}>{a.best_format || '—'}</div>
          </div>
          <div style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
            <div style={{ fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Top Topics</div>
            <div style={{ fontSize: '.7rem', color: '#fff' }}>{(a.best_topics || []).join(', ')}</div>
          </div>
          <div style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
            <div style={{ fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Posting Insight</div>
            <div style={{ fontSize: '.65rem', color: '#fff', lineHeight: 1.4 }}>{a.posting_insight || '—'}</div>
          </div>
        </div>

        {/* Top performers */}
        <div style={{ fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: '.15em', color: '#4ade80', fontWeight: 700, marginBottom: 8 }}>Top Performers</div>
        {(a.top_performers || []).map((tp, i) => {
          const p = getPost(tp.rank);
          if (!p) return null;
          const views = toInt(p.views || p.video_view_count || p.play_count || p.view_count || 0);
          return (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 6, alignItems: 'center', cursor: 'pointer' }}
              onClick={() => p.url && window.open(p.url, '_blank')}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80', width: 28, textAlign: 'center', flexShrink: 0 }}>#{tp.rank}</div>
              {(p.thumb || p.thumbnail) && (
                <img src={api.proxyImage(p.thumb || p.thumbnail)} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '.72rem', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(p.caption || p.title || '').slice(0, 80)}</div>
                <div style={{ fontSize: '.58rem', color: C.dim, marginTop: 3, display: 'flex', gap: 8 }}>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>{fmtN(views)} views</span>
                  <span>{fmtN(toInt(p.likes || p.like_count || 0))} likes</span>
                  <span>{fmtN(toInt(p.comments || p.comment_count || 0))} comments</span>
                </div>
                <div style={{ fontSize: '.62rem', color: C.text, marginTop: 4, lineHeight: 1.5 }}>{tp.why}</div>
              </div>
            </div>
          );
        })}

        {/* Underperformers */}
        <div style={{ fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: '.15em', color: '#fb923c', fontWeight: 700, marginTop: 16, marginBottom: 8 }}>Underperformers</div>
        {(a.underperformers || []).map((tp, i) => {
          const p = getPost(tp.rank);
          if (!p) return null;
          const views = toInt(p.views || p.video_view_count || p.play_count || p.view_count || 0);
          return (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 6, alignItems: 'center', cursor: 'pointer' }}
              onClick={() => p.url && window.open(p.url, '_blank')}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fb923c', width: 28, textAlign: 'center', flexShrink: 0 }}>#{tp.rank}</div>
              {(p.thumb || p.thumbnail) && (
                <img src={api.proxyImage(p.thumb || p.thumbnail)} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '.72rem', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(p.caption || p.title || '').slice(0, 80)}</div>
                <div style={{ fontSize: '.58rem', color: C.dim, marginTop: 3, display: 'flex', gap: 8 }}>
                  <span style={{ color: '#fb923c', fontWeight: 700 }}>{fmtN(views)} views</span>
                  <span>{fmtN(toInt(p.likes || p.like_count || 0))} likes</span>
                </div>
                <div style={{ fontSize: '.62rem', color: C.text, marginTop: 4, lineHeight: 1.5 }}>{tp.why}</div>
              </div>
            </div>
          );
        })}

        {/* Recommendations */}
        <div style={{ fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: '.15em', color: C.blue, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>Recommendations</div>
        <div style={{ padding: '12px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
          {(a.recommendations || []).map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: i < (a.recommendations || []).length - 1 ? `1px solid ${C.border}` : 'none', fontSize: '.7rem', color: C.text, lineHeight: 1.5 }}>
              <span style={{ color: C.blue, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              <span>{r}</span>
            </div>
          ))}
        </div>

        <button onClick={() => runAnalysis(posts, selected?.handle, selected?.plat, toInt(profile?.followers))} style={{ ...btnStyle, marginTop: 14, width: '100%', textAlign: 'center' }}>
          {'\u21bb'} Re-analyze
        </button>
      </div>
    );
  };

  // ── Single-post "why it performed" report ──
  const openPostReport = async (post, handle, plat, followers) => {
    setPostModal({ post, handle, plat, followers });
    setPostReport(null);
    setPostReportLoading(true);
    const views = toInt(post.views || post.video_view_count || post.play_count || post.view_count || 0);
    const likes = toInt(post.likes || post.like_count || 0);
    const comments = toInt(post.comments || post.comment_count || 0);
    const isVideo = !!(post.is_video || post.video_view_count || post.play_count);
    const caption = (post.caption || post.title || post.description || '').slice(0, 400);
    const engPct = followers ? (((likes + comments) / followers) * 100).toFixed(2) : null;
    const prompt = `You are a social media performance analyst. Analyze ONE ${plat} ${isVideo ? 'video' : 'post'} from @${handle} (${fmtN(followers)} followers).

POST:
- Caption/Title: "${caption}"
- Views: ${fmtN(views)}
- Likes: ${fmtN(likes)}
- Comments: ${fmtN(comments)}
- Format: ${isVideo ? 'video' : 'image/carousel'}
${engPct ? `- Engagement rate: ${engPct}%` : ''}

Return STRICT JSON (no markdown fences):
{
  "why_it_performed": "3-4 sentences explaining the specific factors that likely drove views (hook, topic appeal, format, algorithm signals, emotion, timing)",
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "hook_breakdown": "1-2 sentences on what the opening/first frame likely did to stop the scroll",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "search_query": "a 3-7 word search query to find similar winning videos on YouTube/TikTok",
  "replicate_ideas": ["content idea 1 inspired by this post", "content idea 2", "content idea 3"]
}`;
    try {
      const r = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ max_tokens: 1500, messages: [{ role: 'user', content: prompt }] }),
      });
      const j = await r.json();
      let txt = (j.content && j.content[0] && j.content[0].text) || j.text || '';
      txt = txt.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
      const m = txt.match(/\{[\s\S]*\}/);
      if (m) txt = m[0];
      setPostReport(JSON.parse(txt));
    } catch (e) { setPostReport({ error: e.message }); }
    setPostReportLoading(false);
  };

  const closePostReport = () => { setPostModal(null); setPostReport(null); setPostReportLoading(false); };

  const findSimilar = (q) => {
    if (!q) return;
    closePostReport();
    navigate(`/videos?q=${encodeURIComponent(q)}`);
  };

  const renderPostReportModal = () => {
    if (!postModal) return null;
    const { post, handle, plat } = postModal;
    const views = toInt(post.views || post.video_view_count || post.play_count || post.view_count || 0);
    const likes = toInt(post.likes || post.like_count || 0);
    const comments = toInt(post.comments || post.comment_count || 0);
    const caption = (post.caption || post.title || post.description || '').slice(0, 240);
    const r = postReport;
    return (
      <div onClick={closePostReport} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6,
          maxWidth: 720, width: '100%', maxHeight: '90vh', overflowY: 'auto',
          fontFamily: FONT, color: C.text,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', gap: 12, padding: 16, borderBottom: `1px solid ${C.border}`, alignItems: 'flex-start' }}>
            {(post.thumb || post.thumbnail || post.thumbnail_src) && (
              <img src={api.proxyImage(post.thumb || post.thumbnail || post.thumbnail_src)} alt=""
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                onError={e => e.target.style.display = 'none'} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '.62rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 4 }}>
                {PLAT_ICONS[plat] || plat} @{handle}
              </div>
              <div style={{ fontSize: '.72rem', color: C.text, lineHeight: 1.4, marginBottom: 6 }}>{caption || '(no caption)'}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: '.6rem' }}>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>{fmtN(views)} views</span>
                <span style={{ color: '#fb923c' }}>{fmtN(likes)} likes</span>
                <span style={{ color: '#a855f7' }}>{fmtN(comments)} comments</span>
              </div>
            </div>
            <button onClick={closePostReport} style={{ ...btnStyle, flexShrink: 0 }}>{'\u2715'}</button>
          </div>

          {/* Body */}
          <div style={{ padding: 16 }}>
            {postReportLoading && (
              <div style={{ textAlign: 'center', padding: 40, color: C.muted, fontSize: '.7rem' }}>
                Analyzing what made this post perform...
              </div>
            )}
            {r && r.error && (
              <div style={{ color: C.red, fontSize: '.7rem', padding: 12 }}>Analysis failed: {r.error}</div>
            )}
            {r && !r.error && (
              <>
                <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6, fontWeight: 700 }}>Why it performed</div>
                <div style={{ padding: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: '.72rem', lineHeight: 1.6, marginBottom: 14 }}>
                  {r.why_it_performed}
                </div>

                {r.hook_breakdown && (
                  <>
                    <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6, fontWeight: 700 }}>Hook</div>
                    <div style={{ padding: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: '.7rem', lineHeight: 1.5, marginBottom: 14, color: C.dim }}>
                      {r.hook_breakdown}
                    </div>
                  </>
                )}

                {(r.strengths || []).length > 0 && (
                  <>
                    <div style={{ fontSize: '.55rem', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6, fontWeight: 700 }}>Strengths</div>
                    <div style={{ marginBottom: 14 }}>
                      {r.strengths.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 4, fontSize: '.68rem' }}>
                          <span style={{ color: '#4ade80', fontWeight: 700 }}>+</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {(r.keywords || []).length > 0 && (
                  <>
                    <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6, fontWeight: 700 }}>Keywords</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
                      {r.keywords.map((k, i) => (
                        <span key={i} onClick={() => findSimilar(k)}
                          style={{ padding: '4px 9px', background: C.input, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: '.6rem', color: C.dim, cursor: 'pointer' }}
                          onMouseOver={e => e.currentTarget.style.borderColor = C.blueBorder}
                          onMouseOut={e => e.currentTarget.style.borderColor = C.border}
                        >{k}</span>
                      ))}
                    </div>
                  </>
                )}

                {(r.replicate_ideas || []).length > 0 && (
                  <>
                    <div style={{ fontSize: '.55rem', color: '#5b8aff', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6, fontWeight: 700 }}>Replicate this — content ideas</div>
                    <div style={{ marginBottom: 14 }}>
                      {r.replicate_ideas.map((s, i) => (
                        <div key={i} style={{ padding: '8px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 4, fontSize: '.68rem', lineHeight: 1.45 }}>
                          <span style={{ color: '#5b8aff', fontWeight: 700, marginRight: 6 }}>#{i + 1}</span>{s}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Action row */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => findSimilar(r.search_query || (r.keywords || []).slice(0, 3).join(' '))}
                    style={{ ...btnPrimStyle, flex: 1, padding: '10px 16px', fontSize: '.72rem', textAlign: 'center', fontWeight: 600 }}>
                    {'\ud83d\udd0d'} Find similar winning videos {r.search_query ? `\u2014 "${r.search_query}"` : ''}
                  </button>
                  {post.url && (
                    <button onClick={() => window.open(post.url, '_blank')} style={{ ...btnStyle, padding: '10px 14px', fontSize: '.7rem' }}>
                      open post {'\u2197'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProfileView = (d, handle, plat, brand) => {
    if (!d) return null;
    const rawPosts = d.posts || d.recent || [];
    const posts = Array.isArray(rawPosts) ? rawPosts : [];
    // Prefer snapshot's persisted totals (already healed from account_posts); fall back to summing posts.
    const postsViews = posts.reduce((s, p) => s + toInt(p.views || p.video_view_count || p.play_count || p.view_count || 0), 0);
    const postsLikes = posts.reduce((s, p) => s + toInt(p.likes || p.like_count || 0), 0);
    const postsComments = posts.reduce((s, p) => s + toInt(p.comments || p.comment_count || 0), 0);
    const totalViews = Math.max(toInt(d.total_views), postsViews);
    const totalLikes = Math.max(toInt(d.total_likes), postsLikes);
    const totalComments = Math.max(toInt(d.total_comments), postsComments);
    const followers = toInt(d.followers);
    const avgViews = posts.length ? Math.round(totalViews / posts.length) : (d.avg_views_per_post || 0);
    const engRate = followers ? (((totalLikes + totalComments) / (posts.length || 1)) / followers * 100).toFixed(2) : '\u2014';

    return (
      <div>
        {/* Profile header: avatar + name + stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 14, padding: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 5, marginBottom: 14, alignItems: 'center' }}>
          {d.avatar ? (
            <img src={api.proxyImage(d.avatar)} alt="" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${C.border}` }} onError={e => e.target.style.display = 'none'} />
          ) : <div style={{ width: 90, height: 90, borderRadius: '50%', background: C.input, border: `1px solid ${C.border}` }} />}
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{d.name || d.full_name || handle}{(d.verified || d.is_verified) && <span style={{ color: C.blue }}> {'\u2713'}</span>}</div>
            <div style={{ fontSize: '.65rem', color: C.blue, marginTop: 2 }}>@{handle}{d.stale && d.stale_age > 0 && d.stale_age < 30 * 86400 ? ` \u00b7 (cached ${d.stale_age < 60 ? d.stale_age + 's' : d.stale_age < 3600 ? Math.round(d.stale_age/60) + 'm' : Math.round(d.stale_age/3600) + 'h'} ago)` : ''}</div>
            {d.bio && <div style={{ fontSize: '.65rem', color: C.dim, marginTop: 6, lineHeight: 1.4, maxWidth: 500 }}>{d.bio}</div>}
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            {[
              { val: fmtN(followers), lbl: 'followers' },
              { val: fmtN(toInt(d.following)), lbl: 'following' },
              { val: fmtN(posts.length), lbl: 'posts' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 2 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary cards: 5 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 14 }}>
          {[
            { val: fmtN(totalViews), lbl: 'total views' },
            { val: fmtN(totalLikes), lbl: 'total likes' },
            { val: fmtN(totalComments), lbl: 'total comments' },
            { val: fmtN(avgViews), lbl: 'avg views/post' },
            { val: engRate + '%', lbl: 'eng rate' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
              <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 3 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Tabs: Last Posts | AI Analysis */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 2, background: C.input, borderRadius: 5, padding: 2 }}>
            {[['posts', `Last ${posts.length} Posts`], ['analysis', 'AI Analysis']].map(([k, label]) => (
              <button key={k} onClick={() => { setProfileTab(k); if (k === 'analysis' && !analysis && !analysisLoading) runAnalysis(posts, handle, plat, followers); }} style={{
                padding: '6px 14px', fontSize: '.6rem', borderRadius: 3,
                border: 'none', cursor: 'pointer', fontFamily: FONT,
                background: profileTab === k ? C.borderHover : 'transparent',
                color: profileTab === k ? '#fff' : C.muted, fontWeight: profileTab === k ? 600 : 400,
              }}>{label}</button>
            ))}
          </div>
          <button onClick={() => loadProfile(brand || '', plat, handle)} style={btnStyle}>{'\u21bb'} refresh</button>
        </div>

        {profileTab === 'posts' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 6 }}>
            {posts.map((p, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 3, overflow: 'hidden', cursor: 'pointer', transition: 'all .12s' }}
                onClick={() => p.url && window.open(p.url, '_blank')}
                onMouseOver={e => e.currentTarget.style.borderColor = C.borderHover}
                onMouseOut={e => e.currentTarget.style.borderColor = C.border}
              >
                <div style={{ width: '100%', aspectRatio: '1', background: '#000', position: 'relative' }}>
                  {(p.thumb || p.thumbnail || p.thumbnail_src) && (
                    <img src={api.proxyImage(p.thumb || p.thumbnail || p.thumbnail_src)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  )}
                  {(p.is_video || p.video_view_count || p.play_count) && (
                    <div style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,.7)', color: '#fff', padding: '2px 6px', borderRadius: 2, fontSize: '.5rem', fontFamily: FONT, fontWeight: 700 }}>{'\u25b6'} video</div>
                  )}
                  <button onClick={e => { e.stopPropagation(); openPostReport(p, handle, plat, followers); }}
                    title="Why did this perform?"
                    style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,.8)', color: '#ffd54a', border: '1px solid rgba(255,213,74,.35)', padding: '2px 6px', borderRadius: 3, fontSize: '.55rem', fontFamily: FONT, fontWeight: 700, cursor: 'pointer' }}>
                    {'\u26a1'} why?
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 6, padding: '6px 8px', fontSize: '.55rem', color: C.dim, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', gap: 3 }}>{'\ud83d\udc41'} <span style={{ color: '#fff', fontWeight: 600 }}>{fmtN(toInt(p.views || p.video_view_count || p.play_count || p.view_count || 0))}</span></div>
                  <div style={{ display: 'flex', gap: 3 }}>{'\u2665'} <span style={{ color: '#fff', fontWeight: 600 }}>{fmtN(toInt(p.likes || p.like_count || 0))}</span></div>
                  <div style={{ display: 'flex', gap: 3 }}>{'\ud83d\udcac'} <span style={{ color: '#fff', fontWeight: 600 }}>{fmtN(toInt(p.comments || p.comment_count || 0))}</span></div>
                </div>
                <div style={{ padding: '0 8px 6px', fontSize: '.55rem', color: C.muted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                  {(p.caption || p.title || p.description || '').slice(0, 80)}
                </div>
              </div>
            ))}
          </div>
        )}

        {profileTab === 'analysis' && (
          <div>
            {analysisLoading && <div style={{ textAlign: 'center', padding: 40, color: C.muted, fontSize: '.7rem' }}>Analyzing {posts.length} posts with AI...</div>}
            {analysis && renderAnalysis(analysis, posts)}
            {!analysis && !analysisLoading && <div style={{ textAlign: 'center', padding: 40, color: C.muted, fontSize: '.7rem' }}>Click AI Analysis tab to generate</div>}
          </div>
        )}
      </div>
    );
  };

  // ── Sidebar list row (matches an2-list-row) ──
  const renderSidebarItem = (plat, handle, brand, isActive, onClick, onDelete) => {
    const clean = (handle || '').replace(/^@/, '');
    return (
      <div key={plat + clean} onClick={onClick} style={{
        display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 8,
        padding: '8px 10px', background: isActive ? C.blueBg : C.card,
        border: `1px solid ${isActive ? C.blue : C.border}`, borderRadius: 3,
        marginBottom: 3, fontSize: '.65rem', alignItems: 'center', cursor: 'pointer',
        transition: 'all .1s',
      }}
        onMouseOver={e => { if (!isActive) { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.background = C.input; }}}
        onMouseOut={e => { if (!isActive) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; }}}
      >
        <div style={{ fontSize: '.95rem', textAlign: 'center' }}>{PLAT_ICONS[plat] || '?'}</div>
        <div>
          <div style={{ color: C.text, fontWeight: 600, fontSize: '.7rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{clean}</div>
          <div style={{ color: C.muted, fontSize: '.55rem', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 1 }}>{plat}</div>
        </div>
        {onDelete && (
          <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{
            background: 'transparent', border: 'none', color: '#3b3f4a', fontSize: '.6rem',
            cursor: 'pointer', padding: '2px 4px', borderRadius: 2, opacity: 0, transition: 'opacity .1s',
            fontFamily: FONT,
          }}
            ref={el => {
              if (!el) return;
              const row = el.parentElement;
              row.onmouseenter = () => el.style.opacity = '1';
              row.onmouseleave = () => el.style.opacity = '0';
            }}
            onMouseOver={e => e.currentTarget.style.color = C.red}
            onMouseOut={e => e.currentTarget.style.color = '#3b3f4a'}
          >{'\u00d7'}</button>
        )}
      </div>
    );
  };

  // ── Dashboard view ──
  const renderDashboard = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        {/* Dashboard / Analytics toggle */}
        <div style={{ display: 'flex', gap: 2, background: C.input, padding: 2, borderRadius: 5 }}>
          {[['dashboard', '📊 Dashboard'], ['analytics', '📈 Analytics'], ['recent', '🕒 Last posts']].map(([k, label]) => (
            <button key={k} onClick={() => setDashView(k)} style={{
              padding: '4px 14px', fontSize: '.6rem', borderRadius: 3,
              border: 'none', cursor: 'pointer', fontFamily: FONT,
              background: dashView === k ? C.bg : 'transparent',
              color: dashView === k ? '#fff' : C.muted,
              fontWeight: dashView === k ? 500 : 400,
            }}>{label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {dashData?.last_fetched && <span style={{ fontSize: '.55rem', color: C.muted }}>synced {ago(dashData.last_fetched)}</span>}
          <button onClick={async () => { setDashLoading(true); try { await api.syncAccounts(true); } catch {} await loadDashFromDB(); }} disabled={dashLoading} style={btnPrimStyle}>
            {dashLoading ? 'syncing...' : '\u21bb sync all'}
          </button>
        </div>
      </div>

      {dashLoading && <div style={{ textAlign: 'center', padding: 60, color: C.muted, fontSize: '.7rem' }}>fetching all accounts...</div>}

      {!dashLoading && !dashData && (
        <div style={{ textAlign: 'center', color: C.muted, padding: 60, fontSize: '.7rem' }}>
          {'\u25b8'} click refresh all to load dashboard, or click any account on the left
        </div>
      )}

      {!dashLoading && dashData && dashView === 'dashboard' && (
        <>
          {/* Totals */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 14 }}>
            {[
              { val: dashData.count, lbl: 'accounts', color: '#5b8aff' },
              { val: fmtN(dashData.totalFollowers), lbl: 'followers', color: '#fff' },
              { val: fmtN(dashData.totalPosts), lbl: 'posts', color: '#a1a1aa' },
              { val: fmtN(dashData.avgViewsPerPost), lbl: 'avg views/post', color: '#a1a1aa' },
              { val: dashData.engRate + '%', lbl: 'eng rate', color: '#a1a1aa' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                <div style={{ fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 3 }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* LAST 24 HOURS — rolling window from now */}
          <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6, fontWeight: 600 }}>last 24 hours</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 14 }}>
            {[
              { lbl: 'posts', val: dashData.posted?.h24?.posts || 0, color: '#5b8aff' },
              { lbl: 'views', val: dashData.posted?.h24?.views || 0, color: '#4ade80' },
              { lbl: 'likes', val: dashData.posted?.h24?.likes || 0, color: '#fb923c' },
              { lbl: 'comments', val: dashData.posted?.h24?.comments || 0, color: '#a855f7' },
              { lbl: 'followers Δ', val: dashData.followers_24h, color: '#22d3ee', signed: true },
            ].map((s, i) => (
              <div key={i} style={{ padding: '14px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>
                  {s.val == null ? '—' : (s.signed && s.val > 0 ? '+' : '') + fmtN(s.val)}
                </div>
                <div style={{ fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 4 }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* 7d / 30d / all-time — compact reference table */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: 0 }}>
              <div style={{ padding: '8px 12px', fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: `1px solid ${C.border}` }}></div>
              {['7 days', '30 days', 'all time'].map(h => (
                <div key={h} style={{ padding: '8px 12px', fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', textAlign: 'right', borderBottom: `1px solid ${C.border}` }}>{h}</div>
              ))}
              {[
                { lbl: 'posts', color: '#5b8aff', vals: [dashData.posted?.d7?.posts, dashData.posted?.d30?.posts, dashData.totalPosts] },
                { lbl: 'views', color: '#4ade80', vals: [dashData.posted?.d7?.views, dashData.posted?.d30?.views, dashData.totalViews] },
                { lbl: 'likes', color: '#fb923c', vals: [dashData.posted?.d7?.likes, dashData.posted?.d30?.likes, dashData.totalLikes] },
                { lbl: 'comments', color: '#a855f7', vals: [dashData.posted?.d7?.comments, dashData.posted?.d30?.comments, dashData.totalComments] },
                { lbl: 'followers Δ', color: '#22d3ee', vals: [dashData.followers_7d, dashData.followers_30d, dashData.totalFollowers], signed: [true, true, false] },
              ].map(row => (
                <React.Fragment key={row.lbl}>
                  <div style={{ padding: '8px 12px', fontSize: '.6rem', color: row.color, fontWeight: 600 }}>{row.lbl}</div>
                  {row.vals.map((v, i) => (
                    <div key={i} style={{ padding: '8px 12px', fontSize: '.75rem', fontWeight: 600, color: '#fff', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {v == null ? '—' : ((row.signed?.[i] && v > 0) ? '+' : '') + fmtN(v)}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Growth chart */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>growth over time</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 2, background: C.input, padding: 2, borderRadius: 5 }}>
                {['followers', 'views', 'likes', 'comments', 'posts'].map(m => (
                  <button key={m} onClick={() => setChartMetric(m)} style={{
                    padding: '3px 10px', fontSize: '.55rem', borderRadius: 3,
                    border: 'none', cursor: 'pointer', fontFamily: FONT,
                    background: chartMetric === m ? C.bg : 'transparent',
                    color: chartMetric === m ? '#fff' : C.muted,
                    fontWeight: chartMetric === m ? 500 : 400,
                  }}>{m}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 2, background: C.input, padding: 2, borderRadius: 5 }}>
                {[7, 30, 90].map(d => (
                  <button key={d} onClick={() => setChartDays(d)} style={{
                    padding: '3px 10px', fontSize: '.55rem', borderRadius: 3,
                    border: 'none', cursor: 'pointer', fontFamily: FONT,
                    background: chartDays === d ? C.bg : 'transparent',
                    color: chartDays === d ? '#fff' : C.muted,
                  }}>{d}d</button>
                ))}
              </div>
            </div>
            <LineChart
              data={(() => {
                // Backend returns per-day engagement (bucketed by post publish date).
                // Followers: cumulative total per day from pulses.
                // Everything else: direct sum (already a daily value, no delta math needed).
                return history.map(h => ({ date: h.date, value: h[chartMetric] || 0 }));
              })()}
              color={chartMetric === 'views' ? '#4ade80' : chartMetric === 'likes' ? '#fb923c' : chartMetric === 'comments' ? '#a855f7' : chartMetric === 'followers' ? '#fff' : '#5b8aff'}
              height={280}
              label={chartMetric === 'followers' ? 'total followers' : `daily ${chartMetric} gained`}
            />
          </div>

        </>
      )}

      {/* ANALYTICS VIEW — per account engagement */}
      {!dashLoading && dashData && dashView === 'analytics' && (
        <>
          <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6, fontWeight: 600 }}>per account engagement</div>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '24px 28px 1.5fr 75px 75px 65px 65px 65px 55px', gap: 6, padding: '6px 10px', fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: `1px solid ${C.border}`, marginBottom: 2 }}>
            <div></div><div></div><div>account</div>
            <div style={{ textAlign: 'right' }}>followers</div>
            <div style={{ textAlign: 'right' }}>views</div>
            <div style={{ textAlign: 'right' }}>likes</div>
            <div style={{ textAlign: 'right' }}>comments</div>
            <div style={{ textAlign: 'right' }}>posts</div>
            <div style={{ textAlign: 'right' }}>eng%</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
            {(dashData.accountRows || []).map((r, i) => {
              const eng = r.fol > 0 ? (((r.likes + (r.comments || 0)) / (r.posts || 1)) / r.fol * 100) : 0;
              const engColor = eng >= 5 ? '#4ade80' : eng >= 2 ? '#fbbf24' : eng >= 0.5 ? '#fb923c' : '#52525b';
              return (
                <div key={i} onClick={() => loadProfile(r.brand, r.plat, r.handle)} style={{
                  display: 'grid', gridTemplateColumns: '24px 28px 1.5fr 75px 75px 65px 65px 65px 55px',
                  gap: 6, alignItems: 'center', padding: '10px 10px', borderBottom: `1px solid ${C.border}`,
                  cursor: 'pointer', transition: 'all .1s', fontSize: '.68rem',
                }}
                  onMouseOver={e => e.currentTarget.style.background = C.input}
                  onMouseOut={e => e.currentTarget.style.background = ''}
                >
                  <span style={{ color: C.muted, fontWeight: 500, textAlign: 'right' }}>{i + 1}</span>
                  <span style={{ textAlign: 'center' }}>{PLAT_ICONS[r.plat] || '?'}</span>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ color: C.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{r.handle}</div>
                    <div style={{ fontSize: '.5rem', color: C.muted, marginTop: 1 }}>{r.brand}</div>
                  </div>
                  <span style={{ color: '#fff', fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{fmtN(r.fol)}</span>
                  <span style={{ color: '#4ade80', fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontWeight: 500 }}>{fmtN(r.views)}</span>
                  <span style={{ color: '#fb923c', fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontWeight: 500 }}>{fmtN(r.likes)}</span>
                  <span style={{ color: '#a855f7', fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontWeight: 500 }}>{fmtN(r.comments)}</span>
                  <span style={{ color: '#5b8aff', fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontWeight: 500 }}>{fmtN(r.posts)}</span>
                  <span style={{ color: engColor, fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{eng > 0 ? eng.toFixed(1) + '%' : '\u2014'}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* RECENT POSTS VIEW — posts from last N hours, read from DB */}
      {dashView === 'recent' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600 }}>posts in last</span>
            <div style={{ display: 'flex', gap: 2, background: C.input, padding: 2, borderRadius: 5 }}>
              {[[1,'1h'],[6,'6h'],[24,'24h'],[24*2,'2d'],[24*7,'7d'],[24*30,'30d'],[24*365*20,'all']].map(([h, label]) => (
                <button key={h} onClick={() => setRecentHours(h)} style={{
                  padding: '3px 10px', fontSize: '.55rem', borderRadius: 3,
                  border: 'none', cursor: 'pointer', fontFamily: FONT,
                  background: recentHours === h ? C.bg : 'transparent',
                  color: recentHours === h ? '#fff' : C.muted,
                  fontWeight: recentHours === h ? 500 : 400,
                }}>{label}</button>
              ))}
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '.55rem', color: C.muted }}>
              {recentLoading ? 'loading…' : `${recentPosts.length} posts`}
            </span>
          </div>

          {!recentLoading && recentPosts.length === 0 && (
            <div style={{ padding: '30px', textAlign: 'center', color: C.muted, fontSize: '.7rem', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
              No posts published in this window
            </div>
          )}

          {recentPosts.length > 0 && (() => {
            const totV = recentPosts.reduce((s, p) => s + (p.views || 0), 0);
            const totL = recentPosts.reduce((s, p) => s + (p.likes || 0), 0);
            const totC = recentPosts.reduce((s, p) => s + (p.comments || 0), 0);
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 10 }}>
                {[
                  { lbl: 'posts', val: recentPosts.length, color: '#5b8aff' },
                  { lbl: 'views', val: totV, color: '#4ade80' },
                  { lbl: 'likes', val: totL, color: '#fb923c' },
                  { lbl: 'comments', val: totC, color: '#a855f7' },
                ].map(s => (
                  <div key={s.lbl} style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{fmtN(s.val)}</div>
                    <div style={{ fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 3 }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {recentPosts.length > 0 && (() => {
            const sortVal = (p, key) => {
              if (key === 'posted') return p.published_at || 0;
              if (key === 'account') return (p.handle || '').toLowerCase();
              return toInt(p[key] || 0);
            };
            const sorted = [...recentPosts].sort((a, b) => {
              const va = sortVal(a, recentSort.key);
              const vb = sortVal(b, recentSort.key);
              if (va < vb) return recentSort.dir === 'asc' ? -1 : 1;
              if (va > vb) return recentSort.dir === 'asc' ? 1 : -1;
              return 0;
            });
            const onSort = (key) => setRecentSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'account' ? 'asc' : 'desc' });
            const arrow = (key) => recentSort.key === key ? (recentSort.dir === 'asc' ? ' \u2191' : ' \u2193') : '';
            const headStyle = (align) => ({ textAlign: align, cursor: 'pointer', userSelect: 'none' });
            return (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 28px 1.3fr 2fr 80px 65px 65px 65px 56px', gap: 6, padding: '6px 10px', fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: `1px solid ${C.border}` }}>
                <div>thumb</div><div></div>
                <div style={headStyle('left')} onClick={() => onSort('account')}>account{arrow('account')}</div>
                <div>caption</div>
                <div style={headStyle('right')} onClick={() => onSort('posted')}>posted{arrow('posted')}</div>
                <div style={headStyle('right')} onClick={() => onSort('views')}>views{arrow('views')}</div>
                <div style={headStyle('right')} onClick={() => onSort('likes')}>likes{arrow('likes')}</div>
                <div style={headStyle('right')} onClick={() => onSort('comments')}>comments{arrow('comments')}</div>
                <div style={{ textAlign: 'center' }}>why?</div>
              </div>
              {sorted.map((p, i) => {
                const ageMs = Date.now() - (p.published_at || 0);
                const ageStr = ageMs < 3600000 ? Math.round(ageMs / 60000) + 'm' : ageMs < 86400000 ? Math.round(ageMs / 3600000) + 'h' : Math.round(ageMs / 86400000) + 'd';
                return (
                  <div key={p.platform + p.id + i} onClick={() => p.url && window.open(p.url, '_blank')} style={{
                    display: 'grid', gridTemplateColumns: '60px 28px 1.3fr 2fr 80px 65px 65px 65px 56px',
                    gap: 6, alignItems: 'center', padding: '8px 10px', borderBottom: `1px solid ${C.border}`,
                    cursor: p.url ? 'pointer' : 'default', fontSize: '.65rem',
                  }}
                    onMouseOver={e => e.currentTarget.style.background = C.input}
                    onMouseOut={e => e.currentTarget.style.background = ''}
                  >
                    {p.thumb ? (
                      <img src={p.thumb} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 3, background: C.input }} onError={e => { e.target.style.display = 'none'; }} />
                    ) : <div style={{ width: 52, height: 52, background: C.input, borderRadius: 3 }} />}
                    <span style={{ textAlign: 'center' }}>{PLAT_ICONS[p.platform] || '?'}</span>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ color: C.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{p.handle}</div>
                      <div style={{ fontSize: '.5rem', color: C.muted, marginTop: 1 }}>{p.brand || ''}</div>
                    </div>
                    <div style={{ color: C.dim, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis' }}>
                      {p.caption || ''}
                    </div>
                    <span style={{ color: C.muted, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{ageStr} ago</span>
                    <span style={{ color: '#4ade80', fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{fmtN(p.views || 0)}</span>
                    <span style={{ color: '#fb923c', fontWeight: 500, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{fmtN(p.likes || 0)}</span>
                    <span style={{ color: '#a855f7', fontWeight: 500, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{fmtN(p.comments || 0)}</span>
                    <button onClick={e => { e.stopPropagation(); openPostReport(p, p.handle, p.platform, 0); }}
                      title="Why did this perform?"
                      style={{ background: C.input, color: '#ffd54a', border: `1px solid ${C.border}`, padding: '4px 8px', borderRadius: 3, fontSize: '.58rem', fontFamily: FONT, fontWeight: 700, cursor: 'pointer' }}>
                      {'\u26a1'} why
                    </button>
                  </div>
                );
              })}
            </div>
            );
          })()}
        </>
      )}
    </div>
  );

  // ── Top toolbar for brands ──
  const renderBrandsToolbar = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: C.card, borderBottom: `1px solid ${C.border}`, flexShrink: 0, flexWrap: 'wrap' }}>
      <span style={{ fontSize: '.62rem', fontWeight: 700, color: C.blue, letterSpacing: '.15em', padding: '3px 8px', background: C.blueBg, border: `1px solid ${C.blueBorder}`, borderRadius: 3 }}>ACCOUNTS</span>
      <select value={addBrand} onChange={e => setAddBrand(e.target.value)} style={{ ...inputStyle, marginLeft: 'auto', width: 110 }}>
        {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
      <select value={addPlat} onChange={e => setAddPlat(e.target.value)} style={{ ...inputStyle, width: 110 }}>
        {Object.keys(PLAT_LABELS).map(k => <option key={k} value={k}>{k}</option>)}
      </select>
      <input value={addHandle} onChange={e => setAddHandle(e.target.value)} placeholder="@handle" style={{ ...inputStyle, width: 140 }} onKeyDown={e => e.key === 'Enter' && addBrandAccount()} />
      <button onClick={addBrandAccount} style={btnPrimStyle}>+ add</button>
      <button onClick={() => { setSelected(null); setProfile(null); }} style={{ ...btnStyle, background: selected ? C.blueBg : C.input, color: selected ? C.btnPrimColor : C.dim, border: `1px solid ${selected ? C.btnPrimBorder : C.border}` }}>{'\u2302'} dashboard</button>
      <button onClick={async () => { setDashLoading(true); try { await api.syncAccounts(true); } catch {} await loadDashFromDB(); }} style={btnStyle}>{'\u21bb'}</button>
    </div>
  );

  // ── Top toolbar for network ──
  const renderNetworkToolbar = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: C.card, borderBottom: `1px solid ${C.border}`, flexShrink: 0, flexWrap: 'wrap' }}>
      <span style={{ fontSize: '.62rem', fontWeight: 700, color: C.orange, letterSpacing: '.15em', padding: '3px 8px', background: C.orangeBg, border: `1px solid ${C.orangeBorder}`, borderRadius: 3 }}>NETWORK</span>
      <select value={snAddPlat} onChange={e => setSnAddPlat(e.target.value)} style={{ ...inputStyle, marginLeft: 'auto', width: 90 }}>
        {Object.keys(PLAT_LABELS).map(k => <option key={k} value={k}>{k}</option>)}
      </select>
      <input value={snAddHandle} onChange={e => setSnAddHandle(e.target.value)} placeholder="@handle" style={{ ...inputStyle, width: 140 }} onKeyDown={e => e.key === 'Enter' && snAdd()} />
      <select value={snAddBrand} onChange={e => setSnAddBrand(e.target.value)} style={{ ...inputStyle, width: 90 }}>
        <option value="all">all</option>
        {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
      <button onClick={snAdd} style={btnPrimStyle}>+ add</button>
    </div>
  );

  // ── Brand sidebar ──
  const renderBrandSidebar = () => (
    <aside style={{ width: 260, background: C.bg, padding: '8px 10px', overflowY: 'auto', scrollbarWidth: 'thin', flexShrink: 0 }}>
      {/* Dashboard button */}
      <div
        onClick={() => { setSelected(null); setProfile(null); loadDashFromDB(); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
          background: !selected ? C.input : 'transparent',
          border: `1px solid ${!selected ? C.blue : C.border}`,
          borderRadius: 4, cursor: 'pointer', marginBottom: 8,
          transition: 'all .1s',
        }}
        onMouseOver={e => { if (selected) e.currentTarget.style.background = C.card; }}
        onMouseOut={e => { if (selected) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ fontSize: '.85rem' }}>📊</span>
        <span style={{ fontSize: '.7rem', color: !selected ? C.blue : C.text, fontWeight: 600 }}>Dashboard</span>
        <span style={{ marginLeft: 'auto', fontSize: '.52rem', color: C.muted }}>{dashData?.count || 0}</span>
      </div>
      <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6, fontWeight: 600 }}>all accounts</div>
      {[...BRANDS, ...Object.keys(brandAccounts).filter(k => !BRANDS.find(b => b.id === k)).map(k => ({ id: k, name: k }))].map(b => {
        const accs = brandAccounts[b.id] || {};
        const ents = Object.entries(accs);
        if (!ents.length) return null;
        return (
          <div key={b.id}>
            <div style={{ fontSize: '.55rem', color: C.blue, textTransform: 'uppercase', letterSpacing: '.12em', margin: '10px 0 4px', paddingLeft: 2, fontWeight: 600 }}>{'\u26a1'} {b.name}</div>
            {ents.map(([plat, handle]) => {
              const clean = (handle || '').replace(/^@/, '');
              const isActive = selected?.brand === b.id && selected?.plat === plat;
              return renderSidebarItem(plat, handle, b.id, isActive, () => loadProfile(b.id, plat, clean), () => deleteBrandAccount(b.id, plat));
            })}
          </div>
        );
      })}
    </aside>
  );

  // ── Network sidebar ──
  const renderNetworkSidebar = () => {
    const filtered = snData.filter(a => {
      if (snFilter === 'all') return true;
      if (snFilter === 'other') return !['instagram', 'x', 'youtube', 'tiktok'].includes(a.platform);
      return a.platform === snFilter;
    });
    return (
      <aside style={{ width: 260, background: C.bg, padding: '8px 10px', overflowY: 'auto', scrollbarWidth: 'thin', flexShrink: 0 }}>
        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: 8 }}>
          {['all', 'instagram', 'x', 'youtube', 'tiktok', 'other'].map(f => (
            <button key={f} onClick={() => setSnFilter(f)} style={{
              padding: '3px 8px', fontSize: '.55rem', borderRadius: 3, fontFamily: FONT,
              border: `1px solid ${snFilter === f ? C.blue : C.border}`, cursor: 'pointer',
              background: snFilter === f ? C.blueBg : C.card,
              color: snFilter === f ? C.blue : C.muted,
              transition: 'all .1s',
            }}>{f}</button>
          ))}
        </div>
        <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6, fontWeight: 600 }}>
          support accounts {'\u00b7'} {snData.length}
        </div>
        {filtered.map((a, i) => renderSidebarItem(
          a.platform, a.handle, a.brand, snSelected?.id === a.id,
          () => snLoadProfile(a), () => snDelete(snData.indexOf(a))
        ))}
      </aside>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)', background: C.bg, overflow: 'hidden', fontFamily: FONT, color: C.text }}>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 1, padding: '0 10px', background: C.subtabBg, borderBottom: `1px solid ${C.subtabBorder}`, flexShrink: 0 }}>
        {[
          { key: 'brands', label: '\ud83d\udcca brand accounts' },
          { key: 'network', label: '\ud83c\udf10 support network' },
        ].map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key)} style={{
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${subTab === t.key ? C.blue : 'transparent'}`,
            color: subTab === t.key ? C.blue : C.muted,
            fontFamily: FONT, fontSize: '.6rem', padding: '8px 16px',
            cursor: 'pointer', transition: 'all .1s', textTransform: 'lowercase',
          }}>{t.label}</button>
        ))}
      </div>

      {/* BRAND ACCOUNTS */}
      {subTab === 'brands' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          {renderBrandsToolbar()}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 1, background: C.border, overflow: 'hidden', minHeight: 0 }}>
            {renderBrandSidebar()}
            <main style={{ background: C.bg, overflowY: 'auto', padding: '8px 10px', scrollbarWidth: 'thin' }}>
              {profileLoading && <div style={{ textAlign: 'center', padding: 60, color: C.muted, fontSize: '.7rem' }}>loading @{selected?.handle}...</div>}
              {!profileLoading && profile && selected && renderProfileView(profile, selected.handle, selected.plat, selected.brand)}
              {!profileLoading && !profile && !selected && renderDashboard()}
              {!profileLoading && !profile && selected && (
                <div style={{ textAlign: 'center', color: C.muted, padding: 60, fontSize: '.7rem' }}>{'\u25b8'} failed to load profile</div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* SUPPORT NETWORK */}
      {subTab === 'network' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          {renderNetworkToolbar()}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 1, background: C.border, overflow: 'hidden', minHeight: 0 }}>
            {renderNetworkSidebar()}
            <main style={{ background: C.bg, overflowY: 'auto', padding: '8px 10px', scrollbarWidth: 'thin' }}>
              {snLoading && <div style={{ textAlign: 'center', padding: 60, color: C.muted, fontSize: '.7rem' }}>loading @{snSelected?.handle}...</div>}
              {!snLoading && snProfile && snSelected && renderProfileView(snProfile, snSelected.handle, snSelected.platform, snSelected.brand)}
              {!snLoading && !snProfile && <div style={{ textAlign: 'center', color: C.muted, padding: 60, fontSize: '.7rem' }}>{'\u25b8'} click any account to view live analytics</div>}
            </main>
          </div>
        </div>
      )}

      {renderPostReportModal()}
    </div>
  );
}
