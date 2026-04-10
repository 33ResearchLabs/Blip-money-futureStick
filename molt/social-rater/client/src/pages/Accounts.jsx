import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const platforms = ['instagram', 'twitter', 'youtube', 'tiktok'];
const platformFetcher = { instagram: api.getInstagram, twitter: api.getTwitter, youtube: api.getYoutube, tiktok: api.getTiktok };
const brands = ['blip', 'lifestyle', 'finance', 'crypto'];
const supportTags = ['all', 'blip', 'lifestyle', 'finance', 'crypto'];

export default function Accounts() {
  const [subTab, setSubTab] = useState('brand');
  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [addHandle, setAddHandle] = useState('');
  const [addPlatform, setAddPlatform] = useState('instagram');
  const [addBrand, setAddBrand] = useState('blip');

  // Support network state
  const [supportAccounts, setSupportAccounts] = useState([]);
  const [supportFilter, setSupportFilter] = useState('all');
  const [bulkText, setBulkText] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const loadAccounts = useCallback(() => {
    api.getAccounts().then(d => { if (d.ok !== false) setAccounts(d.accounts || d.items || []); });
  }, []);

  const loadSupport = useCallback(() => {
    api.kvGet('supportNetwork').then(d => { if (d.ok && d.value) setSupportAccounts(d.value); });
  }, []);

  useEffect(() => { loadAccounts(); loadSupport(); }, []);

  const selectAccount = async (acc) => {
    setSelected(acc);
    setProfile(null);
    setProfileLoading(true);
    const fetcher = platformFetcher[acc.platform];
    if (fetcher) {
      try {
        const d = await fetcher(acc.handle);
        if (d.ok !== false) setProfile(d);
      } catch {}
    }
    setProfileLoading(false);
  };

  const addAccount = async () => {
    if (!addHandle.trim()) return;
    await api.addAccount(addHandle.trim(), addPlatform);
    setAddHandle('');
    loadAccounts();
  };

  const deleteAccount = async (id, e) => {
    e.stopPropagation();
    await api.deleteAccount(id);
    if (selected && selected.id === id) { setSelected(null); setProfile(null); }
    loadAccounts();
  };

  const addSupportAccount = (handle, platform, tag) => {
    const updated = [...supportAccounts, { handle, platform, tag, added: Date.now() }];
    setSupportAccounts(updated);
    api.kvSet('supportNetwork', updated);
  };

  const bulkAdd = () => {
    const lines = bulkText.split('\n').filter(l => l.trim());
    const updated = [...supportAccounts];
    lines.forEach(line => {
      const parts = line.trim().split(/[\s,]+/);
      if (parts.length >= 1) {
        updated.push({ handle: parts[0], platform: parts[1] || 'instagram', tag: addBrand, added: Date.now() });
      }
    });
    setSupportAccounts(updated);
    api.kvSet('supportNetwork', updated);
    setBulkText('');
  };

  const removeSupportAccount = (idx) => {
    const updated = supportAccounts.filter((_, i) => i !== idx);
    setSupportAccounts(updated);
    api.kvSet('supportNetwork', updated);
  };

  const fetchSummary = async () => {
    setSummaryLoading(true);
    setSummaryData(null);
    const results = [];
    for (const acc of supportAccounts.slice(0, 20)) {
      const fetcher = platformFetcher[acc.platform];
      if (fetcher) {
        try {
          const d = await fetcher(acc.handle);
          if (d.ok !== false) results.push({ ...acc, followers: d.followers || 0, following: d.following || 0 });
        } catch {}
      }
    }
    const totalFollowers = results.reduce((s, r) => s + (r.followers || 0), 0);
    const totalFollowing = results.reduce((s, r) => s + (r.following || 0), 0);
    setSummaryData({ count: results.length, totalFollowers, totalFollowing, accounts: results });
    setSummaryLoading(false);
  };

  const filteredSupport = supportAccounts.filter(a => supportFilter === 'all' || a.tag === supportFilter);

  // Group accounts by brand
  const grouped = {};
  accounts.forEach(a => { const b = a.brand || 'other'; if (!grouped[b]) grouped[b] = []; grouped[b].push(a); });

  const ProfileView = () => {
    if (!selected) return <div style={{ color: 'var(--text-muted)', padding: 20 }}>select an account to view analytics</div>;
    if (profileLoading) return <div style={{ padding: 20, textAlign: 'center' }}><span className="spinner" /></div>;
    if (!profile) return <div style={{ color: 'var(--text-muted)', padding: 20 }}>failed to load profile</div>;

    return (
      <div className="fade-in">
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
          {profile.avatar && <img src={api.proxyImage(profile.avatar)} alt="" style={{ width: 48, height: 48, borderRadius: '50%' }} onError={e => e.target.style.display='none'} />}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {profile.name || selected.handle}
              {profile.verified && <span className="badge badge-success" style={{ marginLeft: 6 }}>verified</span>}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>@{profile.handle || selected.handle} · {selected.platform}</div>
            {profile.bio && <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2, maxWidth: 400 }}>{profile.bio}</div>}
          </div>
        </div>
        <div className="stat-row" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <div className="stat-card"><div className="stat-val">{fmtN(profile.followers)}</div><div className="stat-lbl">followers</div></div>
          <div className="stat-card"><div className="stat-val">{fmtN(profile.following)}</div><div className="stat-lbl">following</div></div>
          <div className="stat-card"><div className="stat-val">{fmtN(profile.posts_count)}</div><div className="stat-lbl">posts</div></div>
          <div className="stat-card"><div className="stat-val">{fmtN(profile.views)}</div><div className="stat-lbl">views</div></div>
          <div className="stat-card">
            <div className="stat-val">{profile.followers > 0 ? ((profile.likes || 0) / profile.followers * 100).toFixed(1) + '%' : '--'}</div>
            <div className="stat-lbl">eng rate</div>
          </div>
        </div>
        {profile.posts && profile.posts.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div className="label" style={{ marginBottom: 6 }}>recent posts</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              {profile.posts.slice(0, 12).map((p, i) => (
                <div key={i} className="card" style={{ padding: 0, overflow: 'hidden', cursor: p.url ? 'pointer' : 'default' }} onClick={() => p.url && window.open(p.url, '_blank')}>
                  {(p.thumb || p.image) && <img src={api.proxyImage(p.thumb || p.image)} alt="" style={{ width: '100%', height: 80, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />}
                  <div style={{ padding: 4 }}>
                    <div className="truncate" style={{ fontSize: 10 }}>{p.title || p.caption || ''}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{fmtN(p.views || p.likes || 0)} views</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-label">network</div>
        <div className="page-title">Accounts</div>
        <div className="page-subtitle">{accounts.length} brand accounts tracked</div>
      </div>

      <div className="tabs" style={{ marginBottom: 10 }}>
        <button className={`tab ${subTab === 'brand' ? 'active' : ''}`} onClick={() => setSubTab('brand')}>brand accounts</button>
        <button className={`tab ${subTab === 'support' ? 'active' : ''}`} onClick={() => setSubTab('support')}>support network</button>
      </div>

      {subTab === 'brand' && (
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 220, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              <select value={addPlatform} onChange={e => setAddPlatform(e.target.value)} style={{ width: 80 }}>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input placeholder="handle" value={addHandle} onChange={e => setAddHandle(e.target.value)} style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && addAccount()} />
              <button className="btn btn-primary btn-sm" onClick={addAccount}>+</button>
            </div>
            {Object.entries(grouped).map(([brand, accs]) => (
              <div key={brand} style={{ marginBottom: 8 }}>
                <div className="label">{brand}</div>
                {accs.map(a => (
                  <div key={a.id} className="card" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selected?.id === a.id ? 'var(--accent-bg)' : undefined, borderColor: selected?.id === a.id ? 'var(--border2)' : undefined }} onClick={() => selectAccount(a)}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', minWidth: 0 }}>
                      <span className="badge badge-info">{a.platform?.slice(0, 2)}</span>
                      <span className="truncate" style={{ fontSize: 11 }}>@{a.handle}</span>
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--danger)', cursor: 'pointer', opacity: 0, transition: 'opacity 0.1s' }} className="delete-x" onClick={e => deleteAccount(a.id, e)} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0}>x</span>
                  </div>
                ))}
              </div>
            ))}
            {accounts.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>no accounts added</div>}
          </div>
          <div style={{ flex: 1 }}><ProfileView /></div>
        </div>
      )}

      {subTab === 'support' && (
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 260, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
              <input placeholder="handle" value={addHandle} onChange={e => setAddHandle(e.target.value)} style={{ flex: 1 }} />
              <select value={addPlatform} onChange={e => setAddPlatform(e.target.value)} style={{ width: 72 }}>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              <select value={addBrand} onChange={e => setAddBrand(e.target.value)} style={{ flex: 1 }}>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <button className="btn btn-primary btn-sm" onClick={() => { if (addHandle.trim()) { addSupportAccount(addHandle.trim(), addPlatform, addBrand); setAddHandle(''); } }}>+ add</button>
            </div>
            <div className="label">bulk add (handle platform per line)</div>
            <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={3} style={{ width: '100%', marginBottom: 4 }} placeholder={'handle1 instagram\nhandle2 twitter'} />
            <button className="btn btn-ghost btn-sm" onClick={bulkAdd} style={{ marginBottom: 10, width: '100%', justifyContent: 'center' }}>bulk add</button>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
              {supportTags.map(t => <button key={t} className={`tab ${supportFilter === t ? 'active' : ''}`} onClick={() => setSupportFilter(t)}>{t}</button>)}
            </div>
            <button className="btn btn-primary btn-sm" onClick={fetchSummary} disabled={summaryLoading} style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}>
              {summaryLoading ? <span className="spinner" /> : 'fetch summary'}
            </button>
            {filteredSupport.map((a, i) => (
              <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => selectAccount(a)}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', minWidth: 0 }}>
                  <span className="badge badge-info">{a.platform?.slice(0, 2)}</span>
                  <span className="truncate" style={{ fontSize: 11 }}>@{a.handle}</span>
                  <span className="badge badge-warning">{a.tag}</span>
                </div>
                <span style={{ fontSize: 14, color: 'var(--danger)', cursor: 'pointer', opacity: 0.4 }} onClick={e => { e.stopPropagation(); removeSupportAccount(i); }}>x</span>
              </div>
            ))}
            {filteredSupport.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 11, padding: 8 }}>no support accounts</div>}
          </div>
          <div style={{ flex: 1 }}>
            {summaryData && (
              <div className="card fade-in" style={{ marginBottom: 12 }}>
                <div className="label">network summary</div>
                <div className="stat-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 6 }}>
                  <div className="stat-card"><div className="stat-val">{summaryData.count}</div><div className="stat-lbl">accounts</div></div>
                  <div className="stat-card"><div className="stat-val" style={{ color: 'var(--accent)' }}>{fmtN(summaryData.totalFollowers)}</div><div className="stat-lbl">total followers</div></div>
                  <div className="stat-card"><div className="stat-val">{fmtN(summaryData.totalFollowing)}</div><div className="stat-lbl">total following</div></div>
                </div>
              </div>
            )}
            <ProfileView />
          </div>
        </div>
      )}
    </div>
  );
}
