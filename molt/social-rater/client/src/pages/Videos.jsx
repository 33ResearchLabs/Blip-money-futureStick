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
  const [fetchedAt, setFetchedAt] = useState(null);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.searchVideos(query, source, range);
      setItems(d.items || []);
      setStats({ total: d.total, totalViews: d.totalViews, totalLikes: d.totalLikes, sources: d.sources });
      setFetchedAt(Date.now());
    } catch { setItems([]); }
    setLoading(false);
  }, [query, source, range]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0', borderBottom: '1px solid var(--border)', marginBottom: 0, flexWrap: 'wrap', flexShrink: 0 }}>
        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#5b8aff', letterSpacing: '.15em', padding: '3px 8px', background: '#1a1f2e', border: '1px solid #2a3346', borderRadius: 3 }}>VIRAL</span>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="search youtube · tiktok · keywords or paste a url..."
            style={{ width: '100%', padding: '8px 12px', fontSize: '0.72rem' }}
          />
        </div>
        <button className="btn btn-primary" onClick={search}>▸ search</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 4, padding: '6px 0', alignItems: 'center', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>src</span>
        {sources.map(s => <button key={s} className={`tab ${source === s ? 'active' : ''}`} onClick={() => setSource(s)}>{s === 'all' ? 'all' : s === 'youtube' ? 'yt shorts' : 'tiktok'}</button>)}
        <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 6px' }} />
        <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>range</span>
        {ranges.map(r => <button key={r} className={`tab ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>{r}</button>)}
        {stats && (
          <span style={{ marginLeft: 'auto', fontSize: '0.52rem', color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>{stats.total} results</span>
            <span>👁 {fmtN(stats.totalViews)}</span>
            <span>♥ {fmtN(stats.totalLikes)}</span>
            {stats.sources && Object.entries(stats.sources).map(([k, v]) => <span key={k}>{k}: {v}</span>)}
            {fetchedAt && <span>fetched {ago(fetchedAt)}</span>}
          </span>
        )}
      </div>

      {/* Column header */}
      <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 90px 65px 65px 65px 60px 55px', gap: 8, padding: '5px 10px', fontSize: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div>thumb</div>
        <div>title</div>
        <div>source</div>
        <div style={{ textAlign: 'right' }}>views</div>
        <div style={{ textAlign: 'right' }}>likes</div>
        <div style={{ textAlign: 'right' }}>cmts</div>
        <div style={{ textAlign: 'right' }}>score</div>
        <div style={{ textAlign: 'right' }}>age</div>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {loading && <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /><div style={{ marginTop: 10, fontSize: '0.7rem', color: 'var(--text-muted)' }}>querying {source === 'all' ? 'youtube · tiktok' : source}...</div></div>}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            {stats ? 'no videos found — try different keywords or time range' : 'type a keyword and hit search, or just click ▸ search for trending'}
          </div>
        )}

        {!loading && items.map((it, i) => {
          const viralScore = Math.min(100, Math.round(
            ((it.views || 0) / 10000 + (it.likes || 0) / 1000 + (it.comments || 0) / 500) *
            (it.pubAt ? Math.max(1, 24 / Math.max(1, (Date.now() - it.pubAt) / 3600000)) : 1)
          ));
          const scoreColor = viralScore >= 70 ? '#22c55e' : viralScore >= 40 ? '#f59e0b' : viralScore >= 20 ? '#f97316' : '#5a606c';

          return (
            <div key={it.id || i} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 90px 65px 65px 65px 60px 55px', gap: 8,
              padding: '6px 10px', borderBottom: '1px solid #111317', alignItems: 'center',
              cursor: 'pointer', transition: 'background 0.1s', fontSize: '0.62rem',
            }}
              onClick={() => window.open(it.url, '_blank')}
              onMouseOver={e => e.currentTarget.style.background = '#0f1118'}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >
              {/* Thumb */}
              <div style={{ position: 'relative' }}>
                {it.thumb ? (
                  <img src={it.thumb} alt="" style={{ width: 56, height: 36, objectFit: 'cover', borderRadius: 3, border: '1px solid #1c1e24', display: 'block' }} onError={e => e.target.style.display = 'none'} />
                ) : (
                  <div style={{ width: 56, height: 36, background: '#15171d', borderRadius: 3, border: '1px solid #1c1e24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a606c', fontSize: 12 }}>{'▶'}</div>
                )}
                {/* Platform badge */}
                <div style={{ position: 'absolute', top: 1, left: 1, fontSize: '0.4rem', padding: '1px 4px', borderRadius: 2, background: it.platform === 'youtube' ? 'rgba(255,0,0,.8)' : 'rgba(0,0,0,.8)', color: '#fff', fontWeight: 700 }}>
                  {it.platform === 'youtube' ? 'YT' : 'TT'}
                </div>
              </div>

              {/* Title + author */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</div>
                <div style={{ fontSize: '0.5rem', color: '#5a606c', marginTop: 1 }}>{it.author}{it.duration > 0 && ` · ${Math.floor(it.duration / 60)}:${(it.duration % 60).toString().padStart(2, '0')}`}</div>
              </div>

              {/* Source */}
              <div style={{ fontSize: '0.55rem', color: '#5b8aff' }}>{it.platform}</div>

              {/* Views */}
              <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtN(it.views)}</div>

              {/* Likes */}
              <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{it.likes ? fmtN(it.likes) : '—'}</div>

              {/* Comments */}
              <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{it.comments ? fmtN(it.comments) : '—'}</div>

              {/* Viral score */}
              <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.7rem', color: scoreColor, background: scoreColor + '15', padding: '2px 0', borderRadius: 3 }}>
                {viralScore}
              </div>

              {/* Age */}
              <div style={{ textAlign: 'right', fontSize: '0.52rem', color: '#5a606c' }}>{it.pubAt ? ago(it.pubAt) : '—'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
