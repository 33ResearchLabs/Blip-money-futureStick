import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '\u2014'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const cats = ['all', 'video', 'tech', 'crypto', 'ai', 'world', 'entertainment', 'sports', 'gaming'];
const ranges = ['all', '24h', '7d', '30d'];

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
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px', borderBottom: '1px solid #18181b', flexShrink: 0 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.01em' }}>Trending</span>
        <span style={{ fontSize: '0.6rem', color: '#52525b' }}>{fmtN(total)} topics</span>
        <div style={{ flex: 1 }} />

        {/* Category segmented control */}
        <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '4px 10px', fontSize: '0.6rem', borderRadius: 4,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: cat === c ? '#27272a' : 'transparent',
              color: cat === c ? '#fafafa' : '#71717a',
              fontWeight: cat === c ? 500 : 400,
              transition: 'all 0.15s',
            }}>{c}</button>
          ))}
        </div>

        <button onClick={refresh} disabled={refreshing} style={{
          padding: '5px 12px', fontSize: '0.6rem', borderRadius: 6, border: '1px solid #27272a',
          background: '#18181b', color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit',
        }}>{refreshing ? '...' : '\u21bb'}</button>
      </div>

      {/* Second row: range + video + search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 4px', borderBottom: '1px solid #18181b', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
          {ranges.map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding: '4px 10px', fontSize: '0.6rem', borderRadius: 4,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: range === r ? '#27272a' : 'transparent',
              color: range === r ? '#fafafa' : '#71717a',
              fontWeight: range === r ? 500 : 400,
              transition: 'all 0.15s',
            }}>{r}</button>
          ))}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6rem', color: '#52525b', cursor: 'pointer' }}>
          <input type="checkbox" checked={videoOnly} onChange={e => setVideoOnly(e.target.checked)} style={{ accentColor: '#6366f1' }} /> video only
        </label>
        <div style={{ flex: 1 }} />
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} style={{
          width: 180, padding: '5px 10px', fontSize: '0.65rem',
          background: '#18181b', border: '1px solid #27272a', borderRadius: 6, color: '#a1a1aa',
        }} />
        <button onClick={doSearch} style={{
          padding: '5px 12px', fontSize: '0.6rem', borderRadius: 6, border: '1px solid #27272a',
          background: '#18181b', color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit',
        }}>go</button>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {loading && <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div>}

        {!loading && items.map((it, i) => {
          const score = Math.round(it.trend_score || 0);
          return (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '14px 8px',
              borderBottom: '1px solid #18181b',
              cursor: 'pointer', transition: 'background 0.12s',
            }}
              onClick={() => it.url && window.open(it.url, '_blank')}
              onMouseOver={e => e.currentTarget.style.background = '#111113'}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >
              {/* Thumbnail */}
              {it.thumb ? (
                <img src={api.proxyImage(it.thumb)} alt="" style={{
                  width: 80, height: 54, objectFit: 'cover', borderRadius: 6, flexShrink: 0,
                }} onError={e => e.target.style.display = 'none'} />
              ) : (
                <div style={{
                  width: 80, height: 54, flexShrink: 0, background: '#18181b',
                  borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#27272a', fontSize: 18,
                }}>{'\u25fb'}</div>
              )}

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.82rem', fontWeight: 500, color: '#fafafa',
                  lineHeight: 1.35, marginBottom: 4,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{it.title}</div>
                <div style={{ display: 'flex', gap: 6, fontSize: '0.58rem', color: '#3f3f46', alignItems: 'center' }}>
                  <span style={{ color: '#71717a', fontWeight: 500 }}>{it.source}</span>
                  {it.emotion && <span>{'\u00b7'} {it.emotion}</span>}
                  {it.format && <span>{'\u00b7'} {it.format}</span>}
                  {it.has_video && <span>{'\u00b7'} video</span>}
                  {it.ups > 0 && <span>{'\u00b7'} {'\u2191'}{fmtN(it.ups)}</span>}
                  {it.comments > 0 && <span>{'\u00b7'} {fmtN(it.comments)} comments</span>}
                  {it.views > 0 && <span>{'\u00b7'} {fmtN(it.views)} views</span>}
                  {it.published_at && <span>{'\u00b7'} {ago(new Date(it.published_at).getTime())}</span>}
                </div>
              </div>

              {/* Score */}
              <div style={{ width: 36, flexShrink: 0, textAlign: 'center', paddingTop: 2 }}>
                <span style={{
                  fontSize: '0.9rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                  color: score >= 80 ? '#4ade80' : score >= 60 ? '#fbbf24' : score >= 40 ? '#fb923c' : '#52525b',
                }}>{score}</span>
              </div>
            </div>
          );
        })}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#3f3f46', fontSize: '0.75rem' }}>no trending items</div>
        )}
      </div>
    </div>
  );
}
