import { useState, useEffect } from 'react';
import { api } from '../services/api';

const ago = ms => { if(!ms) return '--'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const types = ['all', 'crypto', 'ai', 'tech', 'business', 'world'];

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [exploding, setExploding] = useState(null);
  const [explodeResult, setExplodeResult] = useState(null);

  const load = () => {
    setLoading(true);
    api.getNews()
      .then(d => { if (d.ok) setItems(d.items || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const refresh = async () => {
    setRefreshing(true);
    await api.refreshNews();
    load();
    setRefreshing(false);
  };

  const forge = async (item, e) => {
    e.stopPropagation();
    setExploding(item.id);
    setExplodeResult(null);
    try {
      const d = await api.explodeNews({ title: item.title, url: item.url, source: item.source, description: item.description });
      setExplodeResult({ id: item.id, data: d });
    } catch {}
    setExploding(null);
  };

  const filtered = items.filter(it => {
    if (filter !== 'all') {
      const haystack = ((it.source || '') + ' ' + (it.title || '') + ' ' + (it.type || '')).toLowerCase();
      if (!haystack.includes(filter)) return false;
    }
    if (search && !(it.title || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-label">aggregator</div>
          <div className="page-title">News</div>
          <div className="page-subtitle">{items.length} articles loaded</div>
        </div>
        <button className="btn btn-primary" onClick={refresh} disabled={refreshing}>
          {refreshing ? <span className="spinner" /> : 'refresh'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {types.map(t => (
          <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
        <input placeholder="search..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginLeft: 'auto', width: 180 }} />
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 30 }}><span className="spinner" /></div> : (
        <div>
          {filtered.map((it, i) => (
            <div key={it.id || i} className="card" style={{ display: 'flex', gap: 10, cursor: 'pointer', alignItems: 'flex-start' }} onClick={() => it.url && window.open(it.url, '_blank')}>
              {it.image && <img src={api.proxyImage(it.image)} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 500 }} className="truncate">{it.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                  <span className="badge badge-info" style={{ marginRight: 6 }}>{it.source}</span>
                  {it.published_at && ago(new Date(it.published_at).getTime())}
                </div>
                {it.description && <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 3 }} className="truncate">{it.description}</div>}
                {explodeResult?.id === it.id && (
                  <div style={{ marginTop: 6, padding: 6, background: 'var(--bg-hover)', borderRadius: 3, fontSize: 10 }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontFamily: 'inherit' }}>
                      {typeof explodeResult.data === 'object' ? JSON.stringify(explodeResult.data, null, 2) : explodeResult.data}
                    </pre>
                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 4 }} onClick={e => { e.stopPropagation(); setExplodeResult(null); }}>close</button>
                  </div>
                )}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={e => forge(it, e)} disabled={exploding === it.id}>
                {exploding === it.id ? <span className="spinner" /> : 'forge'}
              </button>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>no results</div>}
        </div>
      )}
    </div>
  );
}
