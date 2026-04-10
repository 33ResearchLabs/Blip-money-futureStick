import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '--'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const cats = ['all', 'video', 'tech', 'crypto', 'ai', 'world', 'entertainment', 'sports', 'gaming'];
const ranges = ['all', '24h', '7d', '30d'];

function scoreColor(s) {
  if (s >= 80) return 'var(--danger)';
  if (s >= 60) return 'var(--warning)';
  if (s >= 40) return 'var(--accent)';
  return 'var(--text-secondary)';
}

export default function Trending() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cat, setCat] = useState('all');
  const [range, setRange] = useState('all');
  const [videoOnly, setVideoOnly] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (cat !== 'all') p.set('category', cat);
    if (range !== 'all') p.set('range', range);
    if (videoOnly) p.set('video', '1');
    if (search) p.set('q', search);
    api.getTrending(p.toString())
      .then(d => { if (d.ok !== false) { setItems(d.items || []); setTotal(d.total || 0); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cat, range, videoOnly, search]);

  useEffect(() => { load(); }, [cat, range, videoOnly]);

  const doSearch = () => load();
  const refresh = async () => { setRefreshing(true); await api.refreshTrending(); load(); setRefreshing(false); };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-label">signals</div>
          <div className="page-title">Trending</div>
          <div className="page-subtitle">{fmtN(total)} topics tracked</div>
        </div>
        <button className="btn btn-primary" onClick={refresh} disabled={refreshing}>
          {refreshing ? <span className="spinner" /> : 'refresh'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap' }}>
        {cats.map(c => <button key={c} className={`tab ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {ranges.map(r => <button key={r} className={`tab ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>{r}</button>)}
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: 8 }}>
          <input type="checkbox" checked={videoOnly} onChange={e => setVideoOnly(e.target.checked)} /> video only
        </label>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <input placeholder="search..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} style={{ width: 160 }} />
          <button className="btn btn-ghost btn-sm" onClick={doSearch}>go</button>
        </div>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 30 }}><span className="spinner" /></div> : (
        <div>
          {items.map((it, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: 10, cursor: 'pointer', alignItems: 'center' }} onClick={() => it.url && window.open(it.url, '_blank')}>
              <div style={{ width: 36, textAlign: 'center', fontWeight: 700, fontSize: 13, color: scoreColor(it.trend_score), flexShrink: 0 }}>
                {Math.round(it.trend_score || 0)}
              </div>
              {it.thumb && <img src={api.proxyImage(it.thumb)} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} onError={e => e.target.style.display='none'} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 500, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className="truncate">{it.title}</span>
                  {it.has_video && <span className="badge badge-danger">video</span>}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span>{it.source}</span>
                  {it.emotion && <span className="badge badge-warning">{it.emotion}</span>}
                  {it.format && <span style={{ opacity: 0.7 }}>{it.format}</span>}
                  {it.ups > 0 && <span>{fmtN(it.ups)} ups</span>}
                  {it.comments > 0 && <span>{fmtN(it.comments)} cmt</span>}
                  {it.views > 0 && <span>{fmtN(it.views)} views</span>}
                  {it.published_at && <span>{ago(new Date(it.published_at).getTime())}</span>}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>no trending items</div>}
        </div>
      )}
    </div>
  );
}
