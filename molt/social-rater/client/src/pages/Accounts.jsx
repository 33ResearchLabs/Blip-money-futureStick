import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Eye, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

const PLATFORMS = ['instagram', 'twitter', 'youtube', 'tiktok', 'linkedin', 'reddit'];
const COLORS = { instagram: '#E1306C', twitter: '#1DA1F2', youtube: '#FF0000', tiktok: '#000', linkedin: '#0077B5', reddit: '#FF4500' };
const PROFILE_EP = { instagram: 'insta', twitter: 'twitter', youtube: 'youtube', tiktok: 'tiktok' };

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState({});

  const load = () => fetch('/dl/accounts/list').then(r => r.json()).then(d => setAccounts(d.accounts || []));
  useEffect(() => { load(); }, []);

  const addAccount = async (e) => {
    e.preventDefault();
    if (!handle.trim()) return;
    await fetch('/dl/accounts/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ handle: handle.trim(), platform }) });
    setHandle(''); setShowForm(false); load();
  };

  const deleteAccount = async (id) => {
    if (!confirm('Delete this account?')) return;
    await fetch(`/dl/accounts/delete?id=${id}`);
    setProfiles(p => { const n = { ...p }; delete n[id]; return n; });
    load();
  };

  const viewProfile = async (acct) => {
    const ep = PROFILE_EP[acct.platform];
    if (!ep) return;
    setLoading(l => ({ ...l, [acct.id]: true }));
    try {
      const data = await fetch(`/dl/${ep}?u=${acct.handle}`).then(r => r.json());
      setProfiles(p => ({ ...p, [acct.id]: data }));
    } catch { setProfiles(p => ({ ...p, [acct.id]: { error: true } })); }
    setLoading(l => ({ ...l, [acct.id]: false }));
  };

  const badge = (p) => (
    <span style={{ background: COLORS[p] || '#666', color: '#fff', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{p}</span>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={22} /> Accounts <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--muted)' }}>({accounts.length})</span>
          </h2>
          <p className="text-sm text-muted">Track accounts & cross-platform analytics</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Add Account
        </button>
      </div>

      {showForm && (
        <form onSubmit={addAccount} className="card mb-4" style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 4 }}>Handle</label>
            <input className="input" value={handle} onChange={e => setHandle(e.target.value)} placeholder="@username or channel name" style={{ width: '100%' }} />
          </div>
          <div style={{ minWidth: 140 }}>
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 4 }}>Platform</label>
            <select className="input" value={platform} onChange={e => setPlatform(e.target.value)} style={{ width: '100%' }}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {accounts.map(acct => {
          const prof = profiles[acct.id];
          return (
            <div key={acct.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {badge(acct.platform)}
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{acct.handle}</span>
                </div>
                <span className="text-sm text-muted">{new Date(acct.added_at).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {PROFILE_EP[acct.platform] && (
                  <button className="btn btn-sm" onClick={() => viewProfile(acct)} disabled={loading[acct.id]} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <Eye size={14} /> {loading[acct.id] ? 'Loading...' : prof ? 'Refresh' : 'View Profile'}
                  </button>
                )}
                <button className="btn btn-sm" onClick={() => deleteAccount(acct.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#e55' }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
              {prof && !prof.error && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', gap: 12 }}>
                  {prof.profile_image && <img src={prof.profile_image} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {prof.followers != null && <div style={{ fontWeight: 600 }}>{Number(prof.followers).toLocaleString()} followers</div>}
                    {(prof.bio || prof.description) && <p className="text-sm text-muted" style={{ margin: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prof.bio || prof.description}</p>}
                    {prof.posts_count != null && <span className="text-sm text-muted">{prof.posts_count} posts</span>}
                  </div>
                </div>
              )}
              {prof?.error && <p className="text-sm" style={{ color: '#e55' }}>Failed to load profile</p>}
            </div>
          );
        })}
      </div>
      {!accounts.length && <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No accounts tracked yet. Add one to get started.</div>}
    </div>
  );
}
