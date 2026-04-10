import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '--'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const sources = ['all', 'youtube', 'tiktok'];
const ranges = ['all', '24h', '7d', '30d'];

export default function Videos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('all');
  const [range, setRange] = useState('all');

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams();
    p.set('video', '1');
    if (source !== 'all') p.set('source', source);
    if (range !== 'all') p.set('range', range);
    if (search) p.set('q', search);
    api.getTrending(p.toString())
      .then(d => { setItems((d.items || []).filter(i => i.has_video || i.video_url || i.format === 'video')); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [source, range, search]);

  useEffect(() => { load(); }, [source, range]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-label">media</div>
        <div className="page-title">Videos</div>
        <div className="page-subtitle">trending video content</div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {sources.map(s => <button key={s} className={`tab ${source === s ? 'active' : ''}`} onClick={() => setSource(s)}>{s}</button>)}
        <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />
        {ranges.map(r => <button key={r} className={`tab ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>{r}</button>)}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <input placeholder="search..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} style={{ width: 160 }} />
          <button className="btn btn-ghost btn-sm" onClick={load}>go</button>
        </div>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 30 }}><span className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {items.map((it, i) => (
            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => (it.video_url || it.url) && window.open(it.video_url || it.url, '_blank')}>
              <div style={{ position: 'relative' }}>
                {it.thumb ? (
                  <img src={api.proxyImage(it.thumb)} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} onError={e => e.target.style.display='none'} />
                ) : (
                  <div style={{ width: '100%', height: 130, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 20 }}>{'▶'}</div>
                )}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#fff', fontSize: 22, opacity: 0.7, textShadow: '0 2px 4px rgba(0,0,0,.5)', pointerEvents: 'none' }}>{'▶'}</div>
              </div>
              <div style={{ padding: '6px 8px' }}>
                <div className="truncate" style={{ fontSize: 11, fontWeight: 500 }}>{it.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
                  <span>{it.source}</span>
                  {it.trend_score > 0 && <span style={{ color: it.trend_score >= 70 ? 'var(--danger)' : 'var(--accent)', fontWeight: 600 }}>{Math.round(it.trend_score)}</span>}
                  {it.views > 0 && <span>{fmtN(it.views)} views</span>}
                  {it.ups > 0 && <span>{fmtN(it.ups)} ups</span>}
                  {it.published_at && <span>{ago(new Date(it.published_at).getTime())}</span>}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>no videos found</div>}
        </div>
      )}
    </div>
  );
}
