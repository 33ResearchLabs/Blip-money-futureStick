import { useState, useEffect } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };

export default function SocialPanel() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = () => {
    setLoading(true);
    api.getSocialFeed('limit=100')
      .then(d => {
        if (d.ok !== false) { setItems(d.items || []); setTotal(d.total || 0); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const refresh = async () => {
    setRefreshing(true);
    await api.refreshSocial();
    load();
    setRefreshing(false);
  };

  // Group by brand
  const grouped = {};
  items.forEach(it => {
    const b = it.source_brand || it.source_handle || 'other';
    if (!grouped[b]) grouped[b] = [];
    grouped[b].push(it);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{total} posts total</span>
        <button className="btn btn-ghost btn-sm" onClick={refresh} disabled={refreshing}>
          {refreshing ? <span className="spinner" /> : 'refresh'}
        </button>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 20 }}><span className="spinner" /></div> : (
        Object.entries(grouped).map(([brand, posts]) => (
          <div key={brand} style={{ marginBottom: 12 }}>
            <div className="label" style={{ marginBottom: 4 }}>{brand}</div>
            {posts.map((p, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 8, cursor: p.url ? 'pointer' : 'default' }} onClick={() => p.url && window.open(p.url, '_blank')}>
                {p.thumb && (
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={api.proxyImage(p.thumb)} alt="" style={{ width: 50, height: 36, objectFit: 'cover', borderRadius: 3 }} onError={e => e.target.style.display='none'} />
                    {p.has_video && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.4)', borderRadius: 3, color: '#fff', fontSize: 12 }}>{'▶'}</div>}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="truncate" style={{ fontSize: 11, fontWeight: 500 }}>{p.title || '(no title)'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
                    {p.source_handle && <span>@{p.source_handle}</span>}
                    {p.source_platform && <span className="badge badge-info">{p.source_platform}</span>}
                    {p.views > 0 && <span>{fmtN(p.views)} views</span>}
                    {p.ups > 0 && <span>{fmtN(p.ups)} likes</span>}
                    {p.comments > 0 && <span>{fmtN(p.comments)} cmt</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      {!loading && items.length === 0 && <div style={{ color: 'var(--text-muted)', padding: 12, textAlign: 'center' }}>no social data. add accounts and refresh.</div>}
    </div>
  );
}
