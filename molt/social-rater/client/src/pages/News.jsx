import { useState, useEffect } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '—'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const types = ['all', 'crypto', 'ai', 'tech', 'business', 'culture', 'world'];
const ranges = [
  { k: '4h', label: 'last 4h', ms: 4 * 3600000 },
  { k: '24h', label: 'last 24h', ms: 24 * 3600000 },
  { k: '48h', label: 'last 48h', ms: 48 * 3600000 },
  { k: 'all', label: 'all', ms: 0 },
];

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [range, setRange] = useState('24h');
  const [withImageOnly, setWithImageOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [lastFetched, setLastFetched] = useState(null);

  const load = () => {
    setLoading(true);
    api.getNews()
      .then(d => {
        if (d.ok) {
          setItems(d.items || []);
          const latest = (d.items || []).reduce((max, it) => Math.max(max, it.fetched_at || 0), 0);
          if (latest) setLastFetched(latest);
        }
      })
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

  const rangeMs = (ranges.find(r => r.k === range) || {}).ms || 0;
  const now = Date.now();
  const filtered = items.filter(it => {
    if (filter !== 'all') {
      const t = (it.source_type || it.type || '').toLowerCase();
      const s = (it.source || '').toLowerCase();
      if (!t.includes(filter) && !s.includes(filter)) return false;
    }
    if (rangeMs > 0 && (now - (it.published_at || 0)) > rangeMs) return false;
    if (withImageOnly && !it.image) return false;
    if (search && !(it.title || '').toLowerCase().includes(search.toLowerCase()) && !(it.source || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar — minimal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px', borderBottom: '1px solid #18181b', flexShrink: 0 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.01em' }}>News</span>
        <span style={{ fontSize: '0.6rem', color: '#52525b' }}>{filtered.length} articles</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '4px 10px', fontSize: '0.6rem', borderRadius: 4,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: filter === t ? '#27272a' : 'transparent',
              color: filter === t ? '#fafafa' : '#71717a',
              fontWeight: filter === t ? 500 : 400,
              transition: 'all 0.15s',
            }}>{t}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
          {ranges.map(r => (
            <button key={r.k} onClick={() => setRange(r.k)} style={{
              padding: '4px 10px', fontSize: '0.6rem', borderRadius: 4,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: range === r.k ? '#27272a' : 'transparent',
              color: range === r.k ? '#fafafa' : '#71717a',
              fontWeight: range === r.k ? 500 : 400,
            }}>{r.k}</button>
          ))}
        </div>
        <button onClick={() => setWithImageOnly(!withImageOnly)} style={{
          padding: '5px 10px', fontSize: '0.6rem', borderRadius: 6,
          border: `1px solid ${withImageOnly ? '#4ade80' : '#27272a'}`,
          background: withImageOnly ? '#0a2614' : '#18181b',
          color: withImageOnly ? '#4ade80' : '#71717a',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>🖼 with image</button>
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{
          width: 180, padding: '5px 10px', fontSize: '0.65rem',
          background: '#18181b', border: '1px solid #27272a', borderRadius: 6, color: '#a1a1aa',
        }} />
        <button onClick={refresh} disabled={refreshing} style={{
          padding: '5px 12px', fontSize: '0.6rem', borderRadius: 6, border: '1px solid #27272a',
          background: '#18181b', color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit',
        }}>{refreshing ? '...' : '↻'}</button>
        {lastFetched && <span style={{ fontSize: '0.52rem', color: '#3f3f46' }}>{ago(lastFetched)}</span>}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {loading && <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div>}

        {!loading && filtered.map((it, i) => {
          const score = it.score || 0;
          return (
            <div key={it.id || i} style={{
              display: 'flex', gap: 14, padding: '14px 8px',
              borderBottom: '1px solid #18181b',
              cursor: 'pointer', transition: 'background 0.12s',
            }}
              onClick={() => it.url && window.open(it.url, '_blank')}
              onMouseOver={e => e.currentTarget.style.background = '#111113'}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >
              {/* Thumbnail */}
              {it.image ? (
                <img src={api.proxyImage(it.image)} alt="" style={{
                  width: 80, height: 54, objectFit: 'cover', borderRadius: 6, flexShrink: 0,
                }} onError={e => e.target.style.display = 'none'} />
              ) : (
                <div style={{
                  width: 80, height: 54, flexShrink: 0, background: '#18181b',
                  borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#27272a', fontSize: 18,
                }}>◻</div>
              )}

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.82rem', fontWeight: 500, color: '#fafafa',
                  lineHeight: 1.35, marginBottom: 4,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{it.title}</div>
                {it.description && (
                  <div style={{
                    fontSize: '0.65rem', color: '#52525b', lineHeight: 1.4,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>{it.description}</div>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: '0.58rem', color: '#3f3f46', alignItems: 'center' }}>
                  <span style={{ color: '#71717a', fontWeight: 500 }}>{it.source}</span>
                  {it.source_type && <span>{it.source_type}</span>}
                  {it.ups > 0 && <span>↑{fmtN(it.ups)}</span>}
                  {it.comments > 0 && <span>{fmtN(it.comments)} comments</span>}
                  <span>published {it.published_at ? ago(it.published_at) : '—'}</span>
                  <span>fetched {it.fetched_at ? ago(it.fetched_at) : '—'}</span>
                </div>
              </div>

              {/* Score — right side */}
              <div style={{ width: 36, flexShrink: 0, textAlign: 'center', paddingTop: 2 }}>
                <span style={{
                  fontSize: '0.9rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                  color: score >= 80 ? '#4ade80' : score >= 60 ? '#fbbf24' : score >= 40 ? '#fb923c' : '#52525b',
                }}>{score}</span>
              </div>

              {/* Action */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start', paddingTop: 2, gap: 4 }}>
                <button onClick={e => { e.stopPropagation(); window.open(it.url, '_blank'); }} title="Open source" style={{
                  padding: '6px 10px', fontSize: '0.58rem', borderRadius: 5,
                  border: '1px solid #27272a', background: 'transparent',
                  color: '#71717a', cursor: 'pointer', fontFamily: 'inherit',
                }}
                  onMouseOver={e => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#fafafa'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717a'; }}
                >↗</button>
                <button onClick={e => { e.stopPropagation(); if (typeof window.nfOpenForge === 'function') window.nfOpenForge(it); else window.alert('Forge not loaded — refresh the page'); }} title="Repurpose this" style={{
                  padding: '6px 14px', fontSize: '0.62rem', borderRadius: 5,
                  border: '1px solid #4f46e5', background: '#6366f1',
                  color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                  fontWeight: 600,
                }}
                  onMouseOver={e => e.currentTarget.style.background = '#818cf8'}
                  onMouseOut={e => e.currentTarget.style.background = '#6366f1'}
                >⚡ repurpose</button>
              </div>
            </div>
          );
        })}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#3f3f46', fontSize: '0.75rem' }}>no articles</div>
        )}
      </div>
    </div>
  );
}
