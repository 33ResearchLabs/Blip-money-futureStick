import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

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
const PLAT_FETCHER = {
  instagram: h => api.getInstagram(h),
  x: h => api.getTwitter(h),
  twitter: h => api.getTwitter(h),
  youtube: h => api.getYoutube(h),
  tiktok: h => api.getTiktok(h),
};

const inputStyle = {
  padding: '5px 10px', fontSize: '0.65rem', background: '#18181b',
  border: '1px solid #27272a', borderRadius: 6, color: '#a1a1aa', fontFamily: 'inherit',
};
const selectStyle = { ...inputStyle, appearance: 'none', paddingRight: 20 };

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
    // By platform
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

  // Load dashboard from DB (instant) then brands for sidebar
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
      if (d.ok !== false) setProfile(d);
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

  const renderProfileView = (d, handle, plat, brand) => {
    if (!d) return null;
    const posts = d.posts || d.recent || [];
    const totalViews = posts.reduce((s, p) => s + toInt(p.video_view_count || p.play_count || p.view_count || 0), 0);
    const totalLikes = posts.reduce((s, p) => s + toInt(p.likes || p.like_count || 0), 0);
    const totalComments = posts.reduce((s, p) => s + toInt(p.comments || p.comment_count || 0), 0);
    const followers = toInt(d.followers);
    const engRate = followers ? (((totalLikes + totalComments) / (posts.length || 1)) / followers * 100).toFixed(2) : '\u2014';

    return (
      <div className="fade-in">
        {/* Back + refresh */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: '0.58rem', color: '#52525b' }}>
            {brand && (BRANDS.find(b => b.id === brand)?.name || brand)} {'\u00b7'} {plat}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => { setSelected(null); setProfile(null); }} style={{
              padding: '5px 12px', fontSize: '0.6rem', borderRadius: 6, border: '1px solid #27272a',
              background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit',
            }}>{'\u2190'} back</button>
            <button onClick={() => loadProfile(brand || '', plat, handle)} style={{
              padding: '5px 12px', fontSize: '0.6rem', borderRadius: 6, border: '1px solid #27272a',
              background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit',
            }}>{'\u21bb'}</button>
          </div>
        </div>

        {/* Avatar + info */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16, padding: 16, background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
          {d.avatar && <img src={api.proxyImage(d.avatar)} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1c1c1f' }} onError={e => e.target.style.display = 'none'} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fafafa' }}>{d.name || d.full_name || handle}{(d.verified || d.is_verified) && <span style={{ color: '#6366f1' }}> {'\u2713'}</span>}</div>
            <div style={{ fontSize: '0.58rem', color: '#52525b', marginTop: 2 }}>@{handle} {'\u00b7'} {plat}</div>
            {d.bio && <div style={{ fontSize: '0.62rem', color: '#a1a1aa', lineHeight: 1.4, marginTop: 6 }}>{d.bio}</div>}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {[
            { val: fmtN(followers), lbl: 'followers' },
            { val: fmtN(toInt(d.following)), lbl: 'following' },
            { val: fmtN(totalViews), lbl: 'total views' },
            { val: fmtN(totalLikes), lbl: 'total likes' },
            { val: engRate + '%', lbl: 'eng rate' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '12px 14px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fafafa', fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
              <div style={{ fontSize: '0.48rem', color: '#3f3f46', textTransform: 'uppercase', marginTop: 3 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Posts */}
        <div style={{ fontSize: '0.55rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>last {posts.length} posts</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
          {posts.map((p, i) => (
            <div key={i} style={{ background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f', overflow: 'hidden', cursor: 'pointer' }} onClick={() => p.url && window.open(p.url, '_blank')}>
              {(p.thumb || p.thumbnail || p.thumbnail_src) && (
                <img src={api.proxyImage(p.thumb || p.thumbnail || p.thumbnail_src)} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              )}
              <div style={{ padding: '6px 8px' }}>
                <div style={{ display: 'flex', gap: 8, fontSize: '0.52rem', color: '#52525b' }}>
                  <span>{fmtN(toInt(p.video_view_count || p.play_count || p.view_count || 0))} views</span>
                  <span>{fmtN(toInt(p.likes || p.like_count || 0))} likes</span>
                  <span>{fmtN(toInt(p.comments || p.comment_count || 0))} cmt</span>
                </div>
                <div style={{ fontSize: '0.52rem', color: '#3f3f46', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {(p.caption || p.title || p.description || '').slice(0, 60)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSidebarItem = (plat, handle, brand, isActive, onClick, onDelete) => {
    const clean = (handle || '').replace(/^@/, '');
    return (
      <div key={plat + clean} onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
        background: isActive ? '#18181b' : 'transparent',
        borderRadius: 6, marginBottom: 2, cursor: 'pointer',
        transition: 'background 0.12s',
      }}
        onMouseOver={e => { if (!isActive) e.currentTarget.style.background = '#111113'; }}
        onMouseOut={e => { if (!isActive) e.currentTarget.style.background = ''; }}
      >
        <span style={{ fontSize: '0.55rem', color: '#52525b', fontWeight: 600, minWidth: 22 }}>{PLAT_LABELS[plat] || plat.slice(0,2).toUpperCase()}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 500, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{clean}</div>
          <div style={{ fontSize: '0.52rem', color: '#3f3f46' }}>{plat}</div>
        </div>
        {onDelete && (
          <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{
            background: 'transparent', border: 'none', color: '#27272a', fontSize: '0.65rem',
            cursor: 'pointer', padding: '2px 4px', borderRadius: 4, transition: 'color 0.12s',
          }}
            onMouseOver={e => e.currentTarget.style.color = '#71717a'}
            onMouseOut={e => e.currentTarget.style.color = '#27272a'}
          >{'\u00d7'}</button>
        )}
      </div>
    );
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px', borderBottom: '1px solid #18181b', flexShrink: 0 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.01em' }}>Accounts</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
          {[['brands', 'Brand Accounts'], ['network', 'Support Network']].map(([k, label]) => (
            <button key={k} onClick={() => setSubTab(k)} style={{
              padding: '4px 12px', fontSize: '0.6rem', borderRadius: 4,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: subTab === k ? '#27272a' : 'transparent',
              color: subTab === k ? '#fafafa' : '#71717a',
              fontWeight: subTab === k ? 500 : 400,
              transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* BRAND ACCOUNTS */}
      {subTab === 'brands' && (
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Sidebar */}
          <aside style={{ width: 260, borderRight: '1px solid #18181b', overflowY: 'auto', padding: '10px 8px', scrollbarWidth: 'thin', flexShrink: 0 }}>
            {/* Add form */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
              <select value={addBrand} onChange={e => setAddBrand(e.target.value)} style={{ ...selectStyle, flex: 1, minWidth: 80 }}>
                {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <select value={addPlat} onChange={e => setAddPlat(e.target.value)} style={{ ...selectStyle, width: 70 }}>
                {Object.keys(PLAT_LABELS).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
              <input value={addHandle} onChange={e => setAddHandle(e.target.value)} placeholder="@handle" style={{ ...inputStyle, flex: 1, minWidth: 80 }} onKeyDown={e => e.key === 'Enter' && addBrandAccount()} />
              <button onClick={addBrandAccount} style={{
                padding: '5px 10px', fontSize: '0.6rem', borderRadius: 6, border: 'none',
                background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
              }}>add</button>
            </div>

            {/* Brand groups */}
            {[...BRANDS, ...Object.keys(brandAccounts).filter(k => !BRANDS.find(b => b.id === k)).map(k => ({ id: k, name: k }))].map(b => {
              const accs = brandAccounts[b.id] || {};
              const ents = Object.entries(accs);
              if (!ents.length) return null;
              return (
                <div key={b.id}>
                  <div style={{ fontSize: '0.52rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '12px 0 4px 12px', fontWeight: 500 }}>{b.name}</div>
                  {ents.map(([plat, handle]) => {
                    const clean = (handle || '').replace(/^@/, '');
                    const isActive = selected?.brand === b.id && selected?.plat === plat;
                    return renderSidebarItem(plat, handle, b.id, isActive, () => loadProfile(b.id, plat, clean), () => deleteBrandAccount(b.id, plat));
                  })}
                </div>
              );
            })}
          </aside>

          {/* Main */}
          <main style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {profileLoading && <div style={{ textAlign: 'center', padding: 60, color: '#52525b', fontSize: '0.7rem' }}>loading @{selected?.handle}...</div>}
            {!profileLoading && profile && selected && renderProfileView(profile, selected.handle, selected.plat, selected.brand)}
            {!profileLoading && !profile && !selected && (
              <div className="fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: '0.6rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>dashboard {'\u00b7'} all brands</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {dashData?.last_fetched && <span style={{ fontSize: '0.52rem', color: '#3f3f46', alignSelf: 'center' }}>synced {ago(dashData.last_fetched)}</span>}
                    <button onClick={async () => { setDashLoading(true); try { await api.syncAccounts(); } catch {} await loadDashFromDB(); }} disabled={dashLoading} style={{
                      padding: '5px 14px', fontSize: '0.6rem', borderRadius: 6, border: 'none',
                      background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                    }}>{dashLoading ? 'syncing...' : '\u21bb sync all'}</button>
                  </div>
                </div>

                {dashLoading && <div style={{ textAlign: 'center', padding: 40, color: '#52525b', fontSize: '0.7rem' }}>fetching all accounts...</div>}

                {!dashLoading && !dashData && (
                  <div style={{ textAlign: 'center', color: '#3f3f46', padding: 40, fontSize: '0.7rem' }}>
                    click refresh all to load dashboard, or click any account on the left
                  </div>
                )}

                {!dashLoading && dashData && (
                  <>
                    {/* Row 1: Key metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
                      {[
                        { val: fmtN(dashData.totalFollowers), lbl: 'total followers', color: '#fafafa' },
                        { val: fmtN(dashData.totalViews), lbl: 'total views (recent)', color: '#4ade80' },
                        { val: fmtN(dashData.totalLikes), lbl: 'total likes', color: '#fb923c' },
                        { val: dashData.engRate + '%', lbl: 'engagement rate', color: '#6366f1' },
                      ].map((s, i) => (
                        <div key={i} style={{ padding: '14px 16px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
                          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{s.val}</div>
                          <div style={{ fontSize: '0.52rem', color: '#3f3f46', marginTop: 5 }}>{s.lbl}</div>
                        </div>
                      ))}
                    </div>

                    {/* Row 2: Secondary metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 18 }}>
                      {[
                        { val: dashData.count, lbl: 'accounts' },
                        { val: fmtN(dashData.totalFollowing), lbl: 'total following' },
                        { val: fmtN(dashData.totalComments), lbl: 'total comments' },
                        { val: fmtN(dashData.totalPosts), lbl: 'recent posts' },
                        { val: fmtN(dashData.avgViewsPerPost), lbl: 'avg views/post' },
                      ].map((s, i) => (
                        <div key={i} style={{ padding: '10px 12px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#a1a1aa', fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                          <div style={{ fontSize: '0.48rem', color: '#3f3f46', marginTop: 3 }}>{s.lbl}</div>
                        </div>
                      ))}
                    </div>

                    {/* Best account highlight */}
                    {dashData.bestAccount && (
                      <div style={{ padding: '12px 16px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f', borderLeft: '3px solid #4ade80', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                        onClick={() => loadProfile(dashData.bestAccount.brand, dashData.bestAccount.plat, dashData.bestAccount.handle)}
                        onMouseOver={e => e.currentTarget.style.background = '#18181b'}
                        onMouseOut={e => e.currentTarget.style.background = '#111113'}
                      >
                        <div>
                          <div style={{ fontSize: '0.5rem', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>top account</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fafafa' }}>@{dashData.bestAccount.handle}</div>
                          <div style={{ fontSize: '0.55rem', color: '#52525b', marginTop: 2 }}>{dashData.bestAccount.plat} · {dashData.bestAccount.brand}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fafafa' }}>{fmtN(dashData.bestAccount.fol)}</div>
                          <div style={{ fontSize: '0.52rem', color: '#3f3f46' }}>followers</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4ade80' }}>{fmtN(dashData.bestAccount.views)}</div>
                          <div style={{ fontSize: '0.52rem', color: '#3f3f46' }}>views</div>
                        </div>
                      </div>
                    )}

                    {/* By platform */}
                    <div style={{ fontSize: '0.55rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 500 }}>by platform</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: 18 }}>
                      {Object.entries(dashData.byPlatform).sort((a, b) => b[1].followers - a[1].followers).map(([plat, s]) => (
                        <div key={plat} style={{ padding: '10px 12px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
                          <div style={{ fontSize: '0.6rem', color: '#a1a1aa', fontWeight: 500, marginBottom: 4 }}>
                            {PLAT_LABELS[plat] || plat} · {s.accounts}
                          </div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fafafa', fontVariantNumeric: 'tabular-nums' }}>{fmtN(s.followers)}</div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: '0.5rem', color: '#52525b' }}>
                            <span>{fmtN(s.views)} views</span>
                            <span>{fmtN(s.likes)} likes</span>
                            <span>{s.posts} posts</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* By brand */}
                    <div style={{ fontSize: '0.55rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 500 }}>by brand</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 18 }}>
                      {Object.entries(dashData.byBrand).sort((a, b) => b[1].followers - a[1].followers).map(([brand, s]) => (
                        <div key={brand} style={{ padding: '10px 12px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
                          <div style={{ fontSize: '0.6rem', color: '#6366f1', fontWeight: 500, marginBottom: 4 }}>
                            {BRANDS.find(b => b.id === brand)?.name || brand} · {s.accounts} acc
                          </div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fafafa', fontVariantNumeric: 'tabular-nums' }}>{fmtN(s.followers)}</div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: '0.5rem', color: '#52525b' }}>
                            <span>{fmtN(s.views)} views</span>
                            <span>{fmtN(s.likes)} likes</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* All accounts ranked */}
                    <div style={{ fontSize: '0.55rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 500 }}>all accounts · ranked by followers</div>
                    {dashData.accountRows.map((r, i) => (
                      <div key={i} onClick={() => loadProfile(r.brand, r.plat, r.handle)} style={{
                        display: 'flex', gap: 14, alignItems: 'center', padding: '10px 8px',
                        borderBottom: '1px solid #18181b', cursor: 'pointer', transition: 'background 0.12s',
                      }}
                        onMouseOver={e => e.currentTarget.style.background = '#111113'}
                        onMouseOut={e => e.currentTarget.style.background = ''}
                      >
                        <span style={{ fontSize: '0.72rem', color: '#52525b', fontWeight: 500, minWidth: 18, textAlign: 'right' }}>{i + 1}</span>
                        <span style={{ fontSize: '0.55rem', color: '#52525b', fontWeight: 600, minWidth: 22 }}>{PLAT_LABELS[r.plat] || r.plat.slice(0,2).toUpperCase()}</span>
                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.72rem', fontWeight: 500, color: '#fafafa' }}>@{r.handle}</div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#fafafa', fontVariantNumeric: 'tabular-nums', minWidth: 65, textAlign: 'right' }}>{fmtN(r.fol)}</span>
                        <span style={{ fontSize: '0.58rem', color: '#52525b', fontVariantNumeric: 'tabular-nums', minWidth: 60, textAlign: 'right' }}>{fmtN(r.views)} views</span>
                        <span style={{ fontSize: '0.58rem', color: '#52525b', fontVariantNumeric: 'tabular-nums', minWidth: 55, textAlign: 'right' }}>{fmtN(r.likes)} likes</span>
                        <span style={{ fontSize: '0.58rem', color: '#52525b', fontVariantNumeric: 'tabular-nums', minWidth: 50, textAlign: 'right' }}>{fmtN(r.comments)} cmt</span>
                        <span style={{ fontSize: '0.52rem', color: '#3f3f46', minWidth: 50 }}>{r.brand}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {/* SUPPORT NETWORK */}
      {subTab === 'network' && (
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <aside style={{ width: 260, borderRight: '1px solid #18181b', overflowY: 'auto', padding: '10px 8px', scrollbarWidth: 'thin', flexShrink: 0 }}>
            {/* Add form */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
              <select value={snAddPlat} onChange={e => setSnAddPlat(e.target.value)} style={{ ...selectStyle, width: 70 }}>
                {Object.keys(PLAT_LABELS).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
              <input value={snAddHandle} onChange={e => setSnAddHandle(e.target.value)} placeholder="@handle" style={{ ...inputStyle, flex: 1, minWidth: 80 }} onKeyDown={e => e.key === 'Enter' && snAdd()} />
              <select value={snAddBrand} onChange={e => setSnAddBrand(e.target.value)} style={{ ...selectStyle, width: 70 }}>
                <option value="all">all</option>
                {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <button onClick={snAdd} style={{
                padding: '5px 10px', fontSize: '0.6rem', borderRadius: 6, border: 'none',
                background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
              }}>add</button>
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2, marginBottom: 10 }}>
              {['all', 'instagram', 'x', 'youtube', 'tiktok', 'other'].map(f => (
                <button key={f} onClick={() => setSnFilter(f)} style={{
                  padding: '3px 8px', fontSize: '0.55rem', borderRadius: 4,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: snFilter === f ? '#27272a' : 'transparent',
                  color: snFilter === f ? '#fafafa' : '#71717a',
                  fontWeight: snFilter === f ? 500 : 400, transition: 'all 0.15s',
                }}>{f}</button>
              ))}
            </div>

            <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, paddingLeft: 12 }}>
              support accounts {'\u00b7'} {snData.length}
            </div>
            {snData.filter(a => {
              if (snFilter === 'all') return true;
              if (snFilter === 'other') return !['instagram', 'x', 'youtube', 'tiktok'].includes(a.platform);
              return a.platform === snFilter;
            }).map((a, i) => renderSidebarItem(
              a.platform, a.handle, a.brand, snSelected?.id === a.id,
              () => snLoadProfile(a), () => snDelete(snData.indexOf(a))
            ))}
          </aside>

          <main style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {snLoading && <div style={{ textAlign: 'center', padding: 60, color: '#52525b', fontSize: '0.7rem' }}>loading @{snSelected?.handle}...</div>}
            {!snLoading && snProfile && snSelected && renderProfileView(snProfile, snSelected.handle, snSelected.platform, snSelected.brand)}
            {!snLoading && !snProfile && <div style={{ textAlign: 'center', color: '#3f3f46', padding: 60, fontSize: '0.7rem' }}>click any account to view live analytics</div>}
          </main>
        </div>
      )}
    </div>
  );
}
