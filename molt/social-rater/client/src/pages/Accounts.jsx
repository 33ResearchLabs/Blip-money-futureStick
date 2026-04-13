import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

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
      }
    } catch {}
    setDashLoading(false);
  }, []);

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
    if (updated[brand]) {
      delete updated[brand][plat];
      if (!Object.keys(updated[brand]).length) delete updated[brand];
    }
    setBrandAccounts(updated);
    await api.kvSet('brandAccounts', updated);
    if (selected?.brand === brand && selected?.plat === plat) { setSelected(null); setProfile(null); }
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
      if (d && d.ok !== false) setProfile(d);
      else setProfile(null);
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
          {/* Key metrics row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
            {[
              { val: fmtN(dashData.totalFollowers), lbl: 'total followers', border: '#fff' },
              { val: fmtN(dashData.totalViews), lbl: 'total views (recent)', border: C.green },
              { val: fmtN(dashData.totalLikes), lbl: 'total likes' },
              { val: dashData.engRate + '%', lbl: 'avg eng rate' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, borderLeft: s.border ? `2px solid ${s.border}` : undefined }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 3 }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Secondary metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 14 }}>
            {[
              { val: dashData.count, lbl: 'accounts' },
              { val: fmtN(dashData.totalFollowing), lbl: 'total following' },
              { val: fmtN(dashData.totalComments), lbl: 'total comments' },
              { val: fmtN(dashData.totalPosts), lbl: 'recent posts' },
              { val: fmtN(dashData.avgViewsPerPost), lbl: 'avg views/post' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                <div style={{ fontSize: '.95rem', fontWeight: 600, color: C.dim, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                <div style={{ fontSize: '.55rem', color: C.muted, marginTop: 3 }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Time-windowed stats */}
          <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6, fontWeight: 600 }}>performance by time window</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
            {/* 24h */}
            <div style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderLeft: `2px solid ${C.green}`, borderRadius: 4 }}>
              <div style={{ fontSize: '.5rem', color: C.green, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 6 }}>last 24h</div>
              <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{fmtN(dashData.views_24h || 0)}</div>
              <div style={{ fontSize: '.5rem', color: C.muted }}>views</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: '.5rem', color: C.dim }}>
                <span>{fmtN(dashData.likes_24h || 0)} likes</span>
                <span>{fmtN(dashData.comments_24h || 0)} cmt</span>
                <span>{dashData.posts_24h || 0} posts</span>
              </div>
            </div>
            {/* 7d */}
            <div style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderLeft: '2px solid #5b8aff', borderRadius: 4 }}>
              <div style={{ fontSize: '.5rem', color: '#5b8aff', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 6 }}>last 7 days</div>
              <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{fmtN(dashData.views_7d || 0)}</div>
              <div style={{ fontSize: '.5rem', color: C.muted }}>views</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: '.5rem', color: C.dim }}>
                <span>{fmtN(dashData.likes_7d || 0)} likes</span>
                <span>{fmtN(dashData.comments_7d || 0)} cmt</span>
                <span>{dashData.posts_7d || 0} posts</span>
              </div>
            </div>
            {/* 30d */}
            <div style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderLeft: '2px solid #a855f7', borderRadius: 4 }}>
              <div style={{ fontSize: '.5rem', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 6 }}>last 30 days</div>
              <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{fmtN(dashData.views_30d || 0)}</div>
              <div style={{ fontSize: '.5rem', color: C.muted }}>views</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: '.5rem', color: C.dim }}>
                <span>{fmtN(dashData.likes_30d || 0)} likes</span>
                <span>{fmtN(dashData.comments_30d || 0)} cmt</span>
                <span>{dashData.posts_30d || 0} posts</span>
              </div>
            </div>
            {/* All time */}
            <div style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderLeft: '2px solid #f97316', borderRadius: 4 }}>
              <div style={{ fontSize: '.5rem', color: '#f97316', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 6 }}>all recent posts</div>
              <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{fmtN(dashData.totalViews || 0)}</div>
              <div style={{ fontSize: '.5rem', color: C.muted }}>views</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: '.5rem', color: C.dim }}>
                <span>{fmtN(dashData.totalLikes || 0)} likes</span>
                <span>{fmtN(dashData.totalComments || 0)} cmt</span>
                <span>{dashData.totalPosts || 0} posts</span>
              </div>
            </div>
          </div>

          {/* Best account */}
          {dashData.bestAccount && (
            <div style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderLeft: `2px solid ${C.green}`, borderRadius: 4, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
              onClick={() => loadProfile(dashData.bestAccount.brand, dashData.bestAccount.plat, dashData.bestAccount.handle)}
              onMouseOver={e => e.currentTarget.style.borderColor = C.borderHover}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.borderLeftColor = C.green; }}
            >
              <div>
                <div style={{ fontSize: '.5rem', color: C.green, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, marginBottom: 4 }}>top account</div>
                <div style={{ fontSize: '.82rem', fontWeight: 600, color: '#fff' }}>@{dashData.bestAccount.handle}</div>
                <div style={{ fontSize: '.55rem', color: C.muted, marginTop: 2 }}>{dashData.bestAccount.plat} {'\u00b7'} {dashData.bestAccount.brand}</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{fmtN(dashData.bestAccount.fol)}</div>
                <div style={{ fontSize: '.55rem', color: C.muted }}>followers</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '.75rem', fontWeight: 600, color: C.green }}>{fmtN(dashData.bestAccount.views)}</div>
                <div style={{ fontSize: '.55rem', color: C.muted }}>views</div>
              </div>
            </div>
          )}

          {/* By platform */}
          <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6, fontWeight: 600 }}>by platform</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 6, marginBottom: 14 }}>
            {Object.entries(dashData.byPlatform || {}).sort((a, b) => b[1].followers - a[1].followers).map(([plat, s]) => (
              <div key={plat} style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                <div style={{ fontSize: '.6rem', color: C.dim, fontWeight: 500, marginBottom: 4 }}>{PLAT_LABELS[plat] || plat} {'\u00b7'} {s.accounts}</div>
                <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{fmtN(s.followers)}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: '.5rem', color: C.muted }}>
                  <span>{fmtN(s.views)} views</span>
                  <span>{fmtN(s.likes)} likes</span>
                  <span>{s.posts} posts</span>
                </div>
              </div>
            ))}
          </div>

          {/* By brand */}
          <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6, fontWeight: 600 }}>by brand</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 6, marginBottom: 14 }}>
            {Object.entries(dashData.byBrand || {}).sort((a, b) => b[1].followers - a[1].followers).map(([brand, s]) => (
              <div key={brand} style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                <div style={{ fontSize: '.6rem', color: C.blue, fontWeight: 500, marginBottom: 4 }}>{BRANDS.find(b => b.id === brand)?.name || brand} {'\u00b7'} {s.accounts} acc</div>
                <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{fmtN(s.followers)}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: '.5rem', color: C.muted }}>
                  <span>{fmtN(s.views)} views</span>
                  <span>{fmtN(s.likes)} likes</span>
                </div>
              </div>
            ))}
          </div>

          {/* All accounts ranked */}
          <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6, fontWeight: 600 }}>all accounts {'\u00b7'} ranked by followers</div>
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
                <span style={{ color: C.muted, fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontSize: '.58rem' }}>{fmtN(r.comments)} cmt</span>
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
