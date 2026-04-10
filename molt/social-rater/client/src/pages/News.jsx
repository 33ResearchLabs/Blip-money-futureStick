import { useState, useEffect } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '—'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const types = ['all', 'crypto', 'ai', 'tech', 'business', 'world'];
const scoreColor = s => s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : s >= 40 ? '#f97316' : '#5a606c';

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
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

  const filtered = items.filter(it => {
    if (filter !== 'all') {
      const t = (it.source_type || it.type || '').toLowerCase();
      const s = (it.source || '').toLowerCase();
      if (!t.includes(filter) && !s.includes(filter)) return false;
    }
    if (search && !(it.title || '').toLowerCase().includes(search.toLowerCase()) && !(it.source || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', borderBottom: '1px solid var(--border)', marginBottom: 0, flexWrap: 'wrap', flexShrink: 0 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#5b8aff', letterSpacing: '.15em', padding: '4px 10px', background: '#1a1f2e', border: '1px solid #2a3346', borderRadius: 3 }}>NEWS</span>
        {types.map(t => (
          <button key={t} className={`tab ${filter === t ? 'active' : ''}`} style={{ padding: '5px 12px', fontSize: '0.65rem' }} onClick={() => setFilter(t)}>{t}</button>
        ))}
        <div style={{ flex: 1 }} />
        <input placeholder="search..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200, padding: '6px 10px', fontSize: '0.7rem' }} />
        <button className="btn btn-primary" onClick={refresh} disabled={refreshing} style={{ padding: '6px 14px', fontSize: '0.65rem' }}>
          {refreshing ? '⏳' : '↻ refresh'}
        </button>
        <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>
          {filtered.length}/{items.length} · {lastFetched ? ago(lastFetched) + ' ago' : '—'}
        </span>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {loading && <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /></div>}

        {!loading && filtered.map((it, i) => (
          <div key={it.id || i} style={{
            display: 'flex', gap: 12, padding: '10px 12px',
            borderBottom: '1px solid #111317', alignItems: 'center',
            cursor: 'pointer', transition: 'background 0.1s',
          }}
            onClick={() => it.url && window.open(it.url, '_blank')}
            onMouseOver={e => e.currentTarget.style.background = '#0f1118'}
            onMouseOut={e => e.currentTarget.style.background = ''}
          >
            {/* Score */}
            <div style={{
              width: 44, height: 44, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.9rem',
              color: scoreColor(it.score || 0),
              background: scoreColor(it.score || 0) + '12',
              border: '1px solid ' + scoreColor(it.score || 0) + '30',
              borderRadius: 6,
            }}>
              {it.score || 0}
            </div>

            {/* Thumbnail */}
            {it.image ? (
              <img src={api.proxyImage(it.image)} alt="" style={{ width: 70, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0, border: '1px solid #1c1e24' }} onError={e => e.target.style.display = 'none'} />
            ) : (
              <div style={{ width: 70, height: 48, flexShrink: 0, background: '#15171d', borderRadius: 4, border: '1px solid #1c1e24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b3f4a', fontSize: '0.65rem' }}>📰</div>
            )}

            {/* Title + description */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 500, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</div>
              {it.description && (
                <div style={{ fontSize: '0.62rem', color: '#6a7180', marginTop: 3, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {it.description}
                </div>
              )}
            </div>

            {/* Source */}
            <div style={{ width: 90, flexShrink: 0, textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#5b8aff', fontWeight: 500 }}>{it.source}</div>
              {it.source_type && <div style={{ fontSize: '0.52rem', color: '#4b5060', marginTop: 2 }}>{it.source_type}</div>}
            </div>

            {/* Ups + Comments */}
            <div style={{ width: 60, flexShrink: 0, textAlign: 'right' }}>
              {it.ups ? <div style={{ fontSize: '0.65rem', fontVariantNumeric: 'tabular-nums' }}>⬆ {fmtN(it.ups)}</div> : null}
              {it.comments ? <div style={{ fontSize: '0.6rem', color: '#9ba3af', fontVariantNumeric: 'tabular-nums', marginTop: 1 }}>💬 {fmtN(it.comments)}</div> : null}
              {!it.ups && !it.comments && <div style={{ fontSize: '0.6rem', color: '#3b3f4a' }}>—</div>}
            </div>

            {/* Time */}
            <div style={{ width: 70, flexShrink: 0, textAlign: 'right' }}>
              <div style={{ fontSize: '0.62rem', color: '#9ba3af' }}>📅 {it.published_at ? ago(it.published_at) : '—'}</div>
              <div style={{ fontSize: '0.55rem', color: '#4b5060', marginTop: 2 }}>⚡ {it.fetched_at ? ago(it.fetched_at) : '—'}</div>
            </div>

            {/* Forge */}
            <div style={{ flexShrink: 0 }}>
              <button className="btn btn-primary btn-sm" style={{ fontSize: '0.58rem', padding: '5px 12px' }} onClick={e => { e.stopPropagation(); }}>⚡ forge</button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: '0.75rem' }}>no articles found</div>
        )}
      </div>
    </div>
  );
}
