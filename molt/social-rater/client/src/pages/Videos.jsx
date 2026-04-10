import { useState, useCallback } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '—'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const sources = ['all', 'youtube', 'tiktok'];
const ranges = ['all', '1h', '4h', '24h', '7d', '30d'];

export default function Videos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');
  const [range, setRange] = useState('all');
  const [stats, setStats] = useState(null);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.searchVideos(query, source, range);
      setItems(d.items || []);
      setStats({ total: d.total, totalViews: d.totalViews, totalLikes: d.totalLikes, sources: d.sources });
    } catch { setItems([]); }
    setLoading(false);
  }, [query, source, range]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar — like old VIRAL tab */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0', borderBottom: '1px solid var(--border)', marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#5b8aff', letterSpacing: '.15em', padding: '3px 8px', background: '#1a1f2e', border: '1px solid #2a3346', borderRadius: 3 }}>VIRAL</span>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="search youtube · tiktok · keywords or paste a url to download..."
            style={{ width: '100%', padding: '8px 12px', fontSize: '0.72rem' }}
          />
        </div>
        <button className="btn btn-primary" onClick={search}>▸ search</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.52rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>src</span>
        {sources.map(s => <button key={s} className={`tab ${source === s ? 'active' : ''}`} onClick={() => { setSource(s); }}>{s === 'all' ? 'all' : s === 'youtube' ? 'yt shorts' : 'tiktok'}</button>)}
        <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 6px' }} />
        <span style={{ fontSize: '0.52rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>range</span>
        {ranges.map(r => <button key={r} className={`tab ${range === r ? 'active' : ''}`} onClick={() => { setRange(r); }}>{r}</button>)}
        {stats && (
          <span style={{ marginLeft: 'auto', fontSize: '0.55rem', color: 'var(--text-muted)' }}>
            {stats.total} results · {fmtN(stats.totalViews)} views · {fmtN(stats.totalLikes)} likes
            {stats.sources && ' · ' + Object.entries(stats.sources).map(([k,v]) => k+':'+v).join(' · ')}
          </span>
        )}
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading && <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /><div style={{ marginTop: 10, fontSize: '0.7rem', color: 'var(--text-muted)' }}>querying {source === 'all' ? 'youtube · tiktok' : source}...</div></div>}
        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            {stats ? 'no videos found — try different keywords or time range' : 'type a keyword and hit search, or just click ▸ search for trending'}
          </div>
        )}
        {!loading && items.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
            {items.map((it, i) => (
              <div key={it.id || i} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.1s' }}
                onClick={() => window.open(it.url, '_blank')}
                onMouseOver={e => e.currentTarget.style.borderColor = '#2a3346'}
                onMouseOut={e => e.currentTarget.style.borderColor = ''}
              >
                <div style={{ position: 'relative' }}>
                  {it.thumb ? (
                    <img src={it.thumb} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} onError={e => e.target.style.display = 'none'} />
                  ) : (
                    <div style={{ width: '100%', height: 140, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 24 }}>{'▶'}</div>
                  )}
                  {/* Play overlay */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#fff', fontSize: 28, opacity: 0.6, textShadow: '0 2px 8px rgba(0,0,0,.7)', pointerEvents: 'none' }}>{'▶'}</div>
                  {/* Platform badge */}
                  <div style={{ position: 'absolute', top: 4, left: 4, fontSize: '0.5rem', padding: '2px 6px', borderRadius: 3, background: it.platform === 'youtube' ? 'rgba(255,0,0,.8)' : 'rgba(0,0,0,.7)', color: '#fff', fontWeight: 600 }}>
                    {it.platform === 'youtube' ? 'YT' : 'TT'}
                  </div>
                  {/* Duration */}
                  {it.duration > 0 && (
                    <div style={{ position: 'absolute', bottom: 4, right: 4, fontSize: '0.5rem', padding: '2px 5px', borderRadius: 2, background: 'rgba(0,0,0,.8)', color: '#fff' }}>
                      {Math.floor(it.duration / 60)}:{(it.duration % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
                <div style={{ padding: '6px 8px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 500, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.title}</div>
                  <div style={{ fontSize: '0.52rem', color: 'var(--text-muted)', marginTop: 3 }}>{it.author}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: '0.52rem', color: 'var(--text-muted)' }}>
                    {it.views > 0 && <span>👁 {fmtN(it.views)}</span>}
                    {it.likes > 0 && <span>♥ {fmtN(it.likes)}</span>}
                    {it.comments > 0 && <span>💬 {fmtN(it.comments)}</span>}
                    {it.pubAt && <span>{ago(it.pubAt)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
