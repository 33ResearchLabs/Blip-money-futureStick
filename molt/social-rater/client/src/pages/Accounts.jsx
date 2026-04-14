import { useState, useEffect, useCallback } from 'react';
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
  const [dashData, setDashData] = useState(null);
  const [history, setHistory] = useState([]);
  const [chartMetric, setChartMetric] = useState('views');
  const [chartDays, setChartDays] = useState(30);
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
    const d = await api.kvGet('brandAccounts');
    setBrandAccounts(d.value || d.v || {});
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
    setProfileLoading(true);
    setProfile(null);
    const fetcher = PLAT_FETCHER[plat];
    if (!fetcher) { setProfileLoading(false); return; }
    try {
      const d = await fetcher(clean);
      if (d && d.ok !== false) {
        setProfile(d);
        // Save snapshot to DB so dashboard stays in sync
        const posts = Array.isArray(d.posts) ? d.posts : Array.isArray(d.recent) ? d.recent : [];
        const totalViews = posts.reduce((s, p) => s + toInt(p.video_view_count || p.play_count || p.view_count || 0), 0);
        const totalLikes = posts.reduce((s, p) => s + toInt(p.likes || p.like_count || 0), 0);
        const totalComments = posts.reduce((s, p) => s + toInt(p.comments || p.comment_count || 0), 0);
        fetch('/api/account-sync/save-snapshot', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brand, platform: plat, handle: clean, name: d.name || d.full_name || clean, bio: d.bio || '', avatar: d.avatar || '', followers: toInt(d.followers), following: toInt(d.following), posts_count: posts.length, total_views: totalViews, total_likes: totalLikes, total_comments: totalComments, verified: d.verified || d.is_verified || false, recent_posts: posts.slice(0, 12).map(p => ({ id: p.id, thumb: p.thumb || p.thumbnail || '', views: toInt(p.video_view_count || p.play_count || p.view_count || 0), likes: toInt(p.likes || p.like_count || 0), comments: toInt(p.comments || p.comment_count || 0), taken_at: p.taken_at || p.timestamp || 0, caption: (p.caption || p.title || '').slice(0, 120), url: p.url || '', is_video: p.is_video || false })) }),
        }).catch(() => {});
      } else setProfile(null);
    } catch {}
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
  const renderProfileView = (d, handle, plat, brand) => {
    if (!d) return null;
    const rawPosts = d.posts || d.recent || [];
    const posts = Array.isArray(rawPosts) ? rawPosts : [];
    const totalViews = posts.reduce((s, p) => s + toInt(p.video_view_count || p.play_count || p.view_count || 0), 0);
    const totalLikes = posts.reduce((s, p) => s + toInt(p.likes || p.like_count || 0), 0);
    const totalComments = posts.reduce((s, p) => s + toInt(p.comments || p.comment_count || 0), 0);
    const followers = toInt(d.followers);
    const avgViews = posts.length ? Math.round(totalViews / posts.length) : 0;
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
            <div style={{ fontSize: '.65rem', color: C.blue, marginTop: 2 }}>@{handle}{d.stale ? ` \u00b7 (cached ${Math.round((d.stale_age||0)/3600)}h ago)` : ''}</div>
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

        {/* Posts heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: '.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: C.muted, fontWeight: 600 }}>last {posts.length} posts</div>
          <button onClick={() => loadProfile(brand || '', plat, handle)} style={btnStyle}>{'\u21bb'} refresh</button>
        </div>

        {/* Posts grid */}
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
              </div>
              <div style={{ display: 'flex', gap: 6, padding: '6px 8px', fontSize: '.55rem', color: C.dim, borderTop: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', gap: 3 }}>{'\ud83d\udc41'} <span style={{ color: '#fff', fontWeight: 600 }}>{fmtN(toInt(p.video_view_count || p.play_count || p.view_count || 0))}</span></div>
                <div style={{ display: 'flex', gap: 3 }}>{'\u2665'} <span style={{ color: '#fff', fontWeight: 600 }}>{fmtN(toInt(p.likes || p.like_count || 0))}</span></div>
                <div style={{ display: 'flex', gap: 3 }}>{'\ud83d\udcac'} <span style={{ color: '#fff', fontWeight: 600 }}>{fmtN(toInt(p.comments || p.comment_count || 0))}</span></div>
              </div>
              <div style={{ padding: '0 8px 6px', fontSize: '.55rem', color: C.muted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                {(p.caption || p.title || p.description || '').slice(0, 80)}
              </div>
            </div>
          ))}
        </div>
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
        <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600 }}>dashboard {'\u00b7'} all brands</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {dashData?.last_fetched && <span style={{ fontSize: '.55rem', color: C.muted }}>synced {ago(dashData.last_fetched)}</span>}
          <button onClick={async () => { setDashLoading(true); try { await api.syncAccounts(); } catch {} await loadDashFromDB(); }} disabled={dashLoading} style={btnPrimStyle}>
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

      {!dashLoading && dashData && (
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

          {/* Views / Likes / Comments — by time window in one table */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr', gap: 0 }}>
              {/* Header */}
              <div style={{ padding: '8px 12px', fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: `1px solid ${C.border}` }}></div>
              {['24h', '7 days', '30 days', 'all time'].map(h => (
                <div key={h} style={{ padding: '8px 12px', fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', textAlign: 'right', borderBottom: `1px solid ${C.border}` }}>{h}</div>
              ))}
              {/* Views row */}
              <div style={{ padding: '8px 12px', fontSize: '.6rem', color: C.green, fontWeight: 600 }}>views</div>
              {[dashData.views_24h, dashData.views_7d, dashData.views_30d, dashData.totalViews].map((v, i) => (
                <div key={i} style={{ padding: '8px 12px', fontSize: '.75rem', fontWeight: 700, color: '#fff', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtN(v || 0)}</div>
              ))}
              {/* Likes row */}
              <div style={{ padding: '8px 12px', fontSize: '.6rem', color: '#fb923c', fontWeight: 600 }}>likes</div>
              {[dashData.likes_24h, dashData.likes_7d, dashData.likes_30d, dashData.totalLikes].map((v, i) => (
                <div key={i} style={{ padding: '8px 12px', fontSize: '.75rem', fontWeight: 600, color: C.dim, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtN(v || 0)}</div>
              ))}
              {/* Comments row */}
              <div style={{ padding: '8px 12px', fontSize: '.6rem', color: '#a855f7', fontWeight: 600 }}>comments</div>
              {[dashData.comments_24h, dashData.comments_7d, dashData.comments_30d, dashData.totalComments].map((v, i) => (
                <div key={i} style={{ padding: '8px 12px', fontSize: '.75rem', fontWeight: 600, color: C.dim, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtN(v || 0)}</div>
              ))}
              {/* Posts row */}
              <div style={{ padding: '8px 12px', fontSize: '.6rem', color: '#5b8aff', fontWeight: 600 }}>posts</div>
              {[dashData.posts_24h, dashData.posts_7d, dashData.posts_30d, dashData.totalPosts].map((v, i) => (
                <div key={i} style={{ padding: '8px 12px', fontSize: '.75rem', fontWeight: 600, color: C.dim, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtN(v || 0)}</div>
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
              data={history.map(h => ({ date: h.date, value: h[chartMetric] || 0 }))}
              color={chartMetric === 'views' ? '#4ade80' : chartMetric === 'likes' ? '#fb923c' : chartMetric === 'comments' ? '#a855f7' : chartMetric === 'followers' ? '#fff' : '#5b8aff'}
              height={160}
              label={`total ${chartMetric}`}
            />
          </div>

          {/* Per account breakdown */}
          <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6, fontWeight: 600 }}>per account breakdown</div>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '24px 28px 1fr 70px 70px 60px 50px 60px', gap: 6, padding: '4px 10px', fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: `1px solid ${C.border}`, marginBottom: 2 }}>
            <div></div><div></div><div>account</div><div style={{ textAlign: 'right' }}>followers</div><div style={{ textAlign: 'right' }}>views</div><div style={{ textAlign: 'right' }}>likes</div><div style={{ textAlign: 'right' }}>eng%</div><div style={{ textAlign: 'right' }}>brand</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden' }}>
            {(dashData.accountRows || []).map((r, i) => (
              <div key={i} onClick={() => loadProfile(r.brand, r.plat, r.handle)} style={{
                display: 'grid', gridTemplateColumns: '24px 28px 1fr 70px 70px 60px 50px 60px',
                gap: 6, alignItems: 'center', padding: '8px 10px', borderBottom: `1px solid ${C.border}`,
                cursor: 'pointer', transition: 'all .1s', fontSize: '.65rem',
              }}
                onMouseOver={e => e.currentTarget.style.background = C.input}
                onMouseOut={e => e.currentTarget.style.background = ''}
              >
                <span style={{ color: C.muted, fontWeight: 500, textAlign: 'right' }}>{i + 1}</span>
                <span style={{ textAlign: 'center' }}>{PLAT_ICONS[r.plat] || '?'}</span>
                <span style={{ color: C.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{r.handle}</span>
                <span style={{ color: '#fff', fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{fmtN(r.fol)}</span>
                <span style={{ color: C.muted, fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontSize: '.58rem' }}>{fmtN(r.views)} views</span>
                <span style={{ color: C.muted, fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontSize: '.58rem' }}>{fmtN(r.likes)} likes</span>
                <span style={{ color: C.muted, fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontSize: '.58rem' }}>{r.fol > 0 ? (((r.likes + (r.comments||0)) / (r.posts || 1)) / r.fol * 100).toFixed(1) + '%' : '\u2014'}</span>
                <span style={{ color: C.muted, fontSize: '.55rem' }}>{r.brand}</span>
              </div>
            ))}
          </div>
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
      <button onClick={async () => { setDashLoading(true); try { await api.syncAccounts(); } catch {} await loadDashFromDB(); }} style={btnStyle}>{'\u21bb'}</button>
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
    </div>
  );
}
