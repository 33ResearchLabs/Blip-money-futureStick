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

  const grouped = {};
  items.forEach(it => {
    const b = it.source_brand || it.source_handle || 'other';
    if (!grouped[b]) grouped[b] = [];
    grouped[b].push(it);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: '0.6rem', color: '#52525b' }}>{total} posts total</span>
        <button onClick={refresh} disabled={refreshing} style={{
          padding: '5px 12px', fontSize: '0.6rem', borderRadius: 6, border: '1px solid #27272a',
          background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit',
        }}>{refreshing ? '...' : '\u21bb refresh'}</button>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div> : (
        Object.entries(grouped).map(([brand, posts]) => (
          <div key={brand} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.55rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, fontWeight: 500 }}>{brand}</div>
            {posts.map((p, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, padding: '12px 8px', borderBottom: '1px solid #18181b',
                cursor: p.url ? 'pointer' : 'default', transition: 'background 0.12s',
              }}
                onClick={() => p.url && window.open(p.url, '_blank')}
                onMouseOver={e => e.currentTarget.style.background = '#111113'}
                onMouseOut={e => e.currentTarget.style.background = ''}
              >
                {p.thumb && (
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={api.proxyImage(p.thumb)} alt="" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6 }} onError={e => e.target.style.display='none'} />
                    {p.has_video && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.4)', borderRadius: 6, color: '#fff', fontSize: 12 }}>{'\u25b6'}</div>}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title || '(no title)'}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, fontSize: '0.55rem', color: '#3f3f46', alignItems: 'center' }}>
                    {p.source_handle && <span style={{ color: '#52525b' }}>@{p.source_handle}</span>}
                    {p.source_platform && <span>{'\u00b7'} {p.source_platform}</span>}
                    {p.views > 0 && <span>{'\u00b7'} {fmtN(p.views)} views</span>}
                    {p.ups > 0 && <span>{'\u00b7'} {fmtN(p.ups)} likes</span>}
                    {p.comments > 0 && <span>{'\u00b7'} {fmtN(p.comments)} cmt</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      {!loading && items.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#3f3f46', fontSize: '0.7rem' }}>no social data. add accounts and refresh.</div>}
    </div>
  );
}
