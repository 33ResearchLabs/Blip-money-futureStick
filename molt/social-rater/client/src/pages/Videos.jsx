import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '\u2014'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const sources = ['all', 'youtube', 'tiktok'];
const ranges = ['all', '1h', '4h', '24h', '7d', '30d'];
const categories = ['', 'crypto', 'finance', 'lifestyle', 'tech', 'ai', 'business', 'motivation', 'luxury'];

export default function Videos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');
  const [range, setRange] = useState('all');
  const [category, setCategory] = useState('');
  const [stats, setStats] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [crawling, setCrawling] = useState(false);

  const loadDB = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.getVideosDB(source !== 'all' ? source : '', category, 200);
      let vids = d.items || [];
      if (range !== 'all') {
        const cutoff = Date.now() - ({ '1h': 36e5, '4h': 144e5, '24h': 864e5, '7d': 6048e5, '30d': 2592e6 }[range] || 0);
        if (cutoff) vids = vids.filter(v => v.published_at && v.published_at >= cutoff);
      }
      if (query) { const q = query.toLowerCase(); vids = vids.filter(v => (v.title || '').toLowerCase().includes(q) || (v.author || '').toLowerCase().includes(q) || (v.category || '').includes(q)); }
      setItems(vids);
      setStats(d.stats || null);
      setFetchedAt(d.stats?.last_fetched || null);
    } catch { setItems([]); }
    setLoading(false);
  }, [source, category, range, query]);

  const liveSearch = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.searchVideos(query, source, range);
      setItems(d.items || []);
      setStats({ total: d.total, total_views: d.totalViews, total_likes: d.totalLikes });
      setFetchedAt(Date.now());
    } catch { setItems([]); }
    setLoading(false);
  }, [query, source, range]);

  const crawl = async () => {
    setCrawling(true);
    try { await api.crawlVideos(); await loadDB(); } catch {}
    setCrawling(false);
  };

  useEffect(() => { loadDB(); }, []);
  useEffect(() => { loadDB(); }, [source, category, range]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px', borderBottom: '1px solid #18181b', flexShrink: 0 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.01em' }}>Videos</span>
        <div style={{ flex: 1 }}>
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && liveSearch()}
            placeholder="search youtube, tiktok, keywords..."
            style={{ width: '100%', padding: '5px 10px', fontSize: '0.65rem', background: '#18181b', border: '1px solid #27272a', borderRadius: 6, color: '#a1a1aa' }}
          />
        </div>
        <button onClick={liveSearch} style={{
          padding: '5px 14px', fontSize: '0.6rem', borderRadius: 6, border: 'none',
          background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
        }}>live search</button>
        <button onClick={loadDB} style={{
          padding: '5px 12px', fontSize: '0.6rem', borderRadius: 6, border: '1px solid #27272a',
          background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit',
        }}>{'\u21bb'} db</button>
        <button onClick={crawl} disabled={crawling} style={{
          padding: '5px 12px', fontSize: '0.6rem', borderRadius: 6, border: '1px solid #27272a',
          background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit',
        }}>{crawling ? '...' : 'crawl all'}</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', borderBottom: '1px solid #18181b', flexShrink: 0, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em' }}>src</span>
        <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
          {sources.map(s => (
            <button key={s} onClick={() => setSource(s)} style={{
              padding: '4px 10px', fontSize: '0.6rem', borderRadius: 4,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: source === s ? '#27272a' : 'transparent',
              color: source === s ? '#fafafa' : '#71717a',
              fontWeight: source === s ? 500 : 400, transition: 'all 0.15s',
            }}>{s === 'all' ? 'all' : s === 'youtube' ? 'yt shorts' : 'tiktok'}</button>
          ))}
        </div>

        <span style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em' }}>range</span>
        <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
          {ranges.map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding: '4px 10px', fontSize: '0.6rem', borderRadius: 4,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: range === r ? '#27272a' : 'transparent',
              color: range === r ? '#fafafa' : '#71717a',
              fontWeight: range === r ? 500 : 400, transition: 'all 0.15s',
            }}>{r}</button>
          ))}
        </div>

        <span style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em' }}>cat</span>
        <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
          {categories.map(c => (
            <button key={c||'all'} onClick={() => setCategory(c)} style={{
              padding: '4px 10px', fontSize: '0.6rem', borderRadius: 4,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: category === c ? '#27272a' : 'transparent',
              color: category === c ? '#fafafa' : '#71717a',
              fontWeight: category === c ? 500 : 400, transition: 'all 0.15s',
            }}>{c || 'all'}</button>
          ))}
        </div>

        {stats && (
          <span style={{ marginLeft: 'auto', fontSize: '0.52rem', color: '#3f3f46', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>{items.length} showing</span>
            {stats.total && <span>{'\u00b7'} {stats.total} in db</span>}
            <span>{'\u00b7'} {fmtN(stats.total_views)} views</span>
            <span>{'\u00b7'} {fmtN(stats.total_likes)} likes</span>
            {stats.youtube > 0 && <span>{'\u00b7'} yt:{stats.youtube}</span>}
            {stats.tiktok > 0 && <span>{'\u00b7'} tt:{stats.tiktok}</span>}
            {fetchedAt && <span>{'\u00b7'} fetched {ago(fetchedAt)}</span>}
          </span>
        )}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {loading && <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div>}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#3f3f46', fontSize: '0.75rem' }}>
            {stats ? 'no videos found' : 'type a keyword and search, or click crawl all'}
          </div>
        )}

        {!loading && items.map((it, i) => {
          const viralScore = it.viral_score || Math.min(100, Math.round(
            ((it.views || 0) / 10000 + (it.likes || 0) / 1000 + (it.comments || 0) / 500) *
            (it.pubAt || it.published_at ? Math.max(1, 24 / Math.max(1, (Date.now() - (it.pubAt || it.published_at)) / 3600000)) : 1)
          ));

          return (
            <div key={it.id || i} style={{
              display: 'flex', gap: 14, padding: '12px 8px',
              borderBottom: '1px solid #18181b',
              cursor: 'pointer', transition: 'background 0.12s',
              alignItems: 'center',
            }}
              onClick={() => window.open(it.url, '_blank')}
              onMouseOver={e => e.currentTarget.style.background = '#111113'}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >
              {/* Thumb */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {it.thumb ? (
                  <img src={it.thumb} alt="" style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 6, display: 'block' }} onError={e => e.target.style.display = 'none'} />
                ) : (
                  <div style={{ width: 72, height: 48, background: '#18181b', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#27272a', fontSize: 14 }}>{'\u25b6'}</div>
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.35 }}>{it.title}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, fontSize: '0.58rem', color: '#3f3f46', alignItems: 'center' }}>
                  <span style={{ color: '#52525b', fontWeight: 500 }}>{it.author}</span>
                  <span>{'\u00b7'} {it.platform}</span>
                  {it.duration > 0 && <span>{'\u00b7'} {Math.floor(it.duration / 60)}:{(it.duration % 60).toString().padStart(2, '0')}</span>}
                  {it.category && <span>{'\u00b7'} {it.category}</span>}
                  {(it.pubAt || it.published_at) && <span>{'\u00b7'} {ago(it.pubAt || it.published_at)}</span>}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 16, flexShrink: 0, fontSize: '0.62rem', color: '#52525b', fontVariantNumeric: 'tabular-nums', alignItems: 'center' }}>
                <div style={{ textAlign: 'right', minWidth: 48 }}>
                  <div style={{ color: '#a1a1aa' }}>{fmtN(it.views)}</div>
                  <div style={{ fontSize: '0.48rem', color: '#3f3f46' }}>views</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 40 }}>
                  <div style={{ color: '#a1a1aa' }}>{it.likes ? fmtN(it.likes) : '\u2014'}</div>
                  <div style={{ fontSize: '0.48rem', color: '#3f3f46' }}>likes</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 40 }}>
                  <div style={{ color: '#a1a1aa' }}>{it.comments ? fmtN(it.comments) : '\u2014'}</div>
                  <div style={{ fontSize: '0.48rem', color: '#3f3f46' }}>cmts</div>
                </div>
              </div>

              {/* Score */}
              <div style={{ width: 36, flexShrink: 0, textAlign: 'center' }}>
                <span style={{
                  fontSize: '0.9rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                  color: viralScore >= 70 ? '#4ade80' : viralScore >= 40 ? '#fbbf24' : viralScore >= 20 ? '#fb923c' : '#52525b',
                }}>{viralScore}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
