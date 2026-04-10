import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '—'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const toInt = v => { if(typeof v==='number') return v; if(typeof v==='string'){const m=v.replace(/,/g,'').match(/([\d.]+)\s*([KkMm]?)/); if(!m) return 0; let x=parseFloat(m[1]); if(/[Kk]/.test(m[2]))x*=1000; if(/[Mm]/.test(m[2]))x*=1e6; return Math.round(x);} return 0; };

const BRANDS = [
  { id: 'blip', name: '⚡ Blip Money' },
  { id: 'lifestyle', name: '🌴 Lifestyle' },
  { id: 'finance', name: '$ Finance' },
  { id: 'crypto', name: '₿ Crypto' },
];
const PLAT_ICONS = { instagram: '📸', x: '𝕏', youtube: '▶', tiktok: '🎵', linkedin: '💼', facebook: '👥', threads: '🧵', telegram: '✈', discord: '💬', reddit: '🔴' };
const PLAT_FETCHER = {
  instagram: h => api.getInstagram(h),
  x: h => api.getTwitter(h),
  twitter: h => api.getTwitter(h),
  youtube: h => api.getYoutube(h),
  tiktok: h => api.getTiktok(h),
};

export default function Accounts() {
  const [subTab, setSubTab] = useState('brands');
  const [brandAccounts, setBrandAccounts] = useState({});
  const [selected, setSelected] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);

  // Add form
  const [addBrand, setAddBrand] = useState('blip');
  const [addPlat, setAddPlat] = useState('instagram');
  const [addHandle, setAddHandle] = useState('');

  // Support network
  const [snData, setSnData] = useState([]);
  const [snSelected, setSnSelected] = useState(null);
  const [snProfile, setSnProfile] = useState(null);
  const [snLoading, setSnLoading] = useState(false);
  const [snFilter, setSnFilter] = useState('all');
  const [snAddPlat, setSnAddPlat] = useState('instagram');
  const [snAddHandle, setSnAddHandle] = useState('');
  const [snAddBrand, setSnAddBrand] = useState('all');

  // Load brand accounts
  const loadBrands = useCallback(async () => {
    const d = await api.kvGet('brandAccounts');
    setBrandAccounts(d.value || d.v || {});
  }, []);

  const loadSN = useCallback(async () => {
    const d = await api.kvGet('supportNetwork');
    setSnData(Array.isArray(d.value) ? d.value : []);
  }, []);

  useEffect(() => { loadBrands(); }, []);
  useEffect(() => { if (subTab === 'network') loadSN(); }, [subTab]);

  // Add brand account
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

  // Delete brand account
  const deleteBrandAccount = async (brand, plat) => {
    const updated = { ...brandAccounts };
    if (updated[brand]) {
      delete updated[brand][plat];
      if (!Object.keys(updated[brand]).length) delete updated[brand];
    }
    setBrandAccounts(updated);
    await api.kvSet('brandAccounts', updated);
    if (selected?.brand === brand && selected?.plat === plat) { setSelected(null); setProfile(null); setShowDashboard(true); }
  };

  // Load profile
  const loadProfile = async (brand, plat, handle, force) => {
    const clean = handle.replace(/^@/, '');
    setSelected({ brand, plat, handle: clean });
    setShowDashboard(false);
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

  // Support network add
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

  // Render profile view (shared between brand and support)
  const renderProfileView = (d, handle, plat, brand) => {
    if (!d) return null;
    const posts = d.posts || d.recent || [];
    const totalViews = posts.reduce((s, p) => s + toInt(p.video_view_count || p.play_count || p.view_count || 0), 0);
    const totalLikes = posts.reduce((s, p) => s + toInt(p.likes || p.like_count || 0), 0);
    const totalComments = posts.reduce((s, p) => s + toInt(p.comments || p.comment_count || 0), 0);
    const followers = toInt(d.followers);
    const engRate = followers ? (((totalLikes + totalComments) / (posts.length || 1)) / followers * 100).toFixed(2) : '—';

    return (
      <div className="fade-in">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: '0.6rem', color: '#5b8aff', textTransform: 'uppercase', letterSpacing: '.1em' }}>
            {brand && (BRANDS.find(b => b.id === brand)?.name || brand)} · {plat}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setShowDashboard(true); setSelected(null); setProfile(null); }}>← dashboard</button>
            <button className="btn btn-ghost btn-sm" onClick={() => loadProfile(brand || '', plat, handle, true)}>↻ refresh</button>
          </div>
        </div>

        {/* Avatar + Name + Bio */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12, padding: 12, background: '#0f1014', border: '1px solid #1c1e24', borderRadius: 6 }}>
          {d.avatar && <img src={api.proxyImage(d.avatar)} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1e2030' }} onError={e => e.target.style.display = 'none'} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{d.name || d.full_name || handle}{(d.verified || d.is_verified) && <span style={{ color: '#5b8aff' }}> ✓</span>}</div>
            <div style={{ fontSize: '0.58rem', color: '#f97316' }}>@{handle} · {plat}</div>
            {d.bio && <div style={{ fontSize: '0.6rem', color: '#9ba3af', lineHeight: 1.4, marginTop: 4 }}>{d.bio}</div>}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
          {[
            { val: fmtN(followers), lbl: 'followers' },
            { val: fmtN(toInt(d.following)), lbl: 'following' },
            { val: fmtN(totalViews), lbl: 'total views' },
            { val: fmtN(totalLikes), lbl: 'total likes' },
            { val: engRate + '%', lbl: 'eng rate' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#0c0e14', border: '1px solid #14161e', borderRadius: 4, padding: 10 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{s.val}</div>
              <div style={{ fontSize: '0.45rem', color: '#5a606c', textTransform: 'uppercase', marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Posts grid */}
        <div style={{ fontSize: '0.55rem', color: '#5a606c', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>last {posts.length} posts</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 6 }}>
          {posts.map((p, i) => (
            <div key={i} style={{ background: '#0c0e14', border: '1px solid #14161e', borderRadius: 4, overflow: 'hidden', cursor: 'pointer' }} onClick={() => p.url && window.open(p.url, '_blank')}>
              {(p.thumb || p.thumbnail || p.thumbnail_src) && (
                <img src={api.proxyImage(p.thumb || p.thumbnail || p.thumbnail_src)} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              )}
              <div style={{ padding: '4px 6px' }}>
                <div style={{ display: 'flex', gap: 6, fontSize: '0.5rem', color: '#5a606c' }}>
                  <span>👁 {fmtN(toInt(p.video_view_count || p.play_count || p.view_count || 0))}</span>
                  <span>♥ {fmtN(toInt(p.likes || p.like_count || 0))}</span>
                  <span>💬 {fmtN(toInt(p.comments || p.comment_count || 0))}</span>
                </div>
                <div style={{ fontSize: '0.52rem', color: '#9ba3af', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {(p.caption || p.title || p.description || '').slice(0, 60)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 1, padding: '0 0 0', borderBottom: '1px solid #14161e', marginBottom: 0, flexShrink: 0 }}>
        <button className={`tab ${subTab === 'brands' ? 'active' : ''}`} onClick={() => setSubTab('brands')}>📊 brand accounts</button>
        <button className={`tab ${subTab === 'network' ? 'active' : ''}`} onClick={() => setSubTab('network')}>🌐 support network</button>
      </div>

      {/* ===== BRAND ACCOUNTS ===== */}
      {subTab === 'brands' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#0f1014', borderBottom: '1px solid #1c1e24', flexWrap: 'wrap', flexShrink: 0 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#5b8aff', letterSpacing: '.15em', padding: '3px 8px', background: '#1a1f2e', border: '1px solid #2a3346', borderRadius: 3 }}>ACCOUNTS</span>
            <span style={{ fontSize: '0.55rem', color: '#6a7180', marginLeft: 4 }}>click any to view analytics</span>
            <select value={addBrand} onChange={e => setAddBrand(e.target.value)} style={{ marginLeft: 'auto', width: 110 }}>
              {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select value={addPlat} onChange={e => setAddPlat(e.target.value)} style={{ width: 90 }}>
              {Object.entries(PLAT_ICONS).map(([k, v]) => <option key={k} value={k}>{v} {k}</option>)}
            </select>
            <input value={addHandle} onChange={e => setAddHandle(e.target.value)} placeholder="@handle" style={{ width: 140 }} onKeyDown={e => e.key === 'Enter' && addBrandAccount()} />
            <button className="btn btn-primary btn-sm" onClick={addBrandAccount}>+ add</button>
          </div>

          {/* Body: sidebar + main */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 1, background: '#1c1e24', overflow: 'hidden', minHeight: 0 }}>
            {/* Sidebar */}
            <aside style={{ background: '#0a0a0c', overflowY: 'auto', padding: '8px 10px', scrollbarWidth: 'thin' }}>
              {BRANDS.map(b => {
                const accs = brandAccounts[b.id] || {};
                const ents = Object.entries(accs);
                if (!ents.length) return null;
                return (
                  <div key={b.id}>
                    <div style={{ fontSize: '0.55rem', color: '#5b8aff', textTransform: 'uppercase', letterSpacing: '.12em', margin: '10px 0 4px', fontWeight: 600 }}>{b.name}</div>
                    {ents.map(([plat, handle]) => {
                      const clean = (handle || '').replace(/^@/, '');
                      const isActive = selected?.brand === b.id && selected?.plat === plat;
                      return (
                        <div key={plat} onClick={() => loadProfile(b.id, plat, clean)} style={{
                          display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 8,
                          padding: '8px 10px', background: isActive ? '#1a1f2e' : '#0f1014',
                          border: `1px solid ${isActive ? '#5b8aff' : '#1c1e24'}`, borderRadius: 3,
                          marginBottom: 3, cursor: 'pointer', alignItems: 'center',
                        }}>
                          <span style={{ fontSize: '0.95rem', textAlign: 'center' }}>{PLAT_ICONS[plat] || '?'}</span>
                          <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>@{clean}</div>
                            <div style={{ fontSize: '0.55rem', color: '#5a606c', textTransform: 'uppercase', letterSpacing: '.08em' }}>{plat}</div>
                          </div>
                          <button onClick={e => { e.stopPropagation(); deleteBrandAccount(b.id, plat); }} style={{ background: 'transparent', border: 'none', color: '#3b3f4a', fontSize: '0.6rem', cursor: 'pointer', opacity: 0 }} className="del-btn">×</button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              {/* Also show custom brands */}
              {Object.entries(brandAccounts).filter(([k]) => !BRANDS.find(b => b.id === k)).map(([brand, accs]) => {
                const ents = Object.entries(accs);
                if (!ents.length) return null;
                return (
                  <div key={brand}>
                    <div style={{ fontSize: '0.55rem', color: '#f97316', textTransform: 'uppercase', letterSpacing: '.12em', margin: '10px 0 4px', fontWeight: 600 }}>{brand}</div>
                    {ents.map(([plat, handle]) => {
                      const clean = (handle || '').replace(/^@/, '');
                      const isActive = selected?.brand === brand && selected?.plat === plat;
                      return (
                        <div key={plat} onClick={() => loadProfile(brand, plat, clean)} style={{
                          display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 8,
                          padding: '8px 10px', background: isActive ? '#1a1f2e' : '#0f1014',
                          border: `1px solid ${isActive ? '#5b8aff' : '#1c1e24'}`, borderRadius: 3,
                          marginBottom: 3, cursor: 'pointer', alignItems: 'center',
                        }}>
                          <span style={{ fontSize: '0.95rem', textAlign: 'center' }}>{PLAT_ICONS[plat] || '?'}</span>
                          <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>@{clean}</div>
                            <div style={{ fontSize: '0.55rem', color: '#5a606c' }}>{plat}</div>
                          </div>
                          <button onClick={e => { e.stopPropagation(); deleteBrandAccount(brand, plat); }} style={{ background: 'transparent', border: 'none', color: '#3b3f4a', fontSize: '0.6rem', cursor: 'pointer' }}>×</button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </aside>

            {/* Main */}
            <main style={{ background: '#0a0a0c', overflowY: 'auto', padding: 14 }}>
              {profileLoading && <div style={{ textAlign: 'center', padding: 60, color: '#9ba3af', fontSize: '0.7rem' }}>⏳ loading @{selected?.handle}...</div>}
              {!profileLoading && profile && selected && renderProfileView(profile, selected.handle, selected.plat, selected.brand)}
              {!profileLoading && !profile && !selected && (
                <div style={{ textAlign: 'center', color: '#5a606c', padding: 60, fontSize: '0.7rem' }}>▸ click any account on the left to view live analytics</div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* ===== SUPPORT NETWORK ===== */}
      {subTab === 'network' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#0f1014', borderBottom: '1px solid #1c1e24', flexWrap: 'wrap', flexShrink: 0 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#f97316', letterSpacing: '.15em', padding: '3px 8px', background: '#1c1108', border: '1px solid #3d2508', borderRadius: 3 }}>NETWORK</span>
            <span style={{ fontSize: '0.52rem', color: '#6a7180', marginLeft: 4 }}>click any to view analytics</span>
            <select value={snAddPlat} onChange={e => setSnAddPlat(e.target.value)} style={{ marginLeft: 'auto', width: 90 }}>
              {Object.entries(PLAT_ICONS).map(([k, v]) => <option key={k} value={k}>{v} {k}</option>)}
            </select>
            <input value={snAddHandle} onChange={e => setSnAddHandle(e.target.value)} placeholder="@handle" style={{ width: 140 }} onKeyDown={e => e.key === 'Enter' && snAdd()} />
            <select value={snAddBrand} onChange={e => setSnAddBrand(e.target.value)} style={{ width: 90 }}>
              <option value="all">all brands</option>
              {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={snAdd}>+ add</button>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 1, background: '#1c1e24', overflow: 'hidden', minHeight: 0 }}>
            <aside style={{ background: '#0a0a0c', overflowY: 'auto', padding: '8px 10px', scrollbarWidth: 'thin' }}>
              {/* Filter */}
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 6 }}>
                {['all', 'instagram', 'x', 'youtube', 'tiktok', 'other'].map(f => (
                  <button key={f} className={`tab ${snFilter === f ? 'active' : ''}`} style={{ padding: '3px 7px', fontSize: '0.52rem' }} onClick={() => setSnFilter(f)}>
                    {f === 'all' ? 'all' : f === 'other' ? 'other' : (PLAT_ICONS[f] || f)}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.55rem', color: '#5a606c', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 4, fontWeight: 600 }}>
                support accounts · {snData.length}
              </div>
              {snData.filter(a => {
                if (snFilter === 'all') return true;
                if (snFilter === 'other') return !['instagram', 'x', 'youtube', 'tiktok'].includes(a.platform);
                return a.platform === snFilter;
              }).map((a, i) => (
                <div key={a.id || i} onClick={() => snLoadProfile(a)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px',
                  background: snSelected?.id === a.id ? '#1a1f2e' : '#0f1014',
                  border: `1px solid ${snSelected?.id === a.id ? '#5b8aff' : '#1c1e24'}`,
                  borderRadius: 3, marginBottom: 3, cursor: 'pointer',
                }}>
                  <span style={{ fontSize: '0.55rem', color: '#f97316', width: 20 }}>{PLAT_ICONS[a.platform] || '•'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.62rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{a.handle}</div>
                    <div style={{ fontSize: '0.48rem', color: '#4b5060' }}>{a.platform} · {a.brand || 'all'}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); snDelete(snData.indexOf(a)); }} style={{ background: 'transparent', border: 'none', color: '#3b3f4a', fontSize: '0.55rem', cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </aside>
            <main style={{ background: '#0a0a0c', overflowY: 'auto', padding: 14 }}>
              {snLoading && <div style={{ textAlign: 'center', padding: 60, color: '#9ba3af', fontSize: '0.7rem' }}>⏳ loading @{snSelected?.handle}...</div>}
              {!snLoading && snProfile && snSelected && renderProfileView(snProfile, snSelected.handle, snSelected.platform, snSelected.brand)}
              {!snLoading && !snProfile && <div style={{ textAlign: 'center', color: '#5a606c', padding: 60, fontSize: '0.7rem' }}>▸ click any account to view live analytics</div>}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
