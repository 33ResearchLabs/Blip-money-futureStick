import { useState, useEffect } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '—'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s ago'; if(s<3600) return Math.floor(s/60)+'m ago'; if(s<86400) return Math.floor(s/3600)+'h ago'; return Math.floor(s/86400)+'d ago'; };
const fmtDate = ms => { if(!ms) return '—'; const d = new Date(ms); return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); };
const types = ['all', 'crypto', 'ai', 'tech', 'business', 'world'];
const scoreClass = s => s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : s >= 40 ? '#f97316' : '#5a606c';

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0', borderBottom: '1px solid var(--border)', marginBottom: 0, flexWrap: 'wrap', flexShrink: 0 }}>
        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#5b8aff', letterSpacing: '.15em', padding: '3px 8px', background: '#1a1f2e', border: '1px solid #2a3346', borderRadius: 3 }}>NEWS</span>
        {types.map(t => (
          <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
        <div style={{ flex: 1 }} />
        <input placeholder="search..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 180 }} />
        <button className="btn btn-primary btn-sm" onClick={refresh} disabled={refreshing}>
          {refreshing ? '⏳' : '↻ refresh'}
        </button>
        <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>
          {filtered.length}/{items.length} · fetched {lastFetched ? ago(lastFetched) : '—'}
        </span>
      </div>

      {/* Column header */}
      <div style={{ display: 'grid', gridTemplateColumns: '45px 1fr 100px 55px 55px 75px 75px 60px', gap: 8, padding: '5px 10px', fontSize: '0.48rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div>score</div>
        <div>headline</div>
        <div>source</div>
        <div style={{ textAlign: 'right' }}>⬆</div>
        <div style={{ textAlign: 'right' }}>💬</div>
        <div>published</div>
        <div>fetched</div>
        <div></div>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {loading && <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /></div>}

        {!loading && filtered.map((it, i) => (
          <div key={it.id || i} style={{
            display: 'grid', gridTemplateColumns: '45px 1fr 100px 55px 55px 75px 75px 60px',
            gap: 8, padding: '6px 10px', borderBottom: '1px solid #111317',
            alignItems: 'center', cursor: 'pointer', fontSize: '0.62rem',
            transition: 'background 0.1s',
          }}
            onClick={() => it.url && window.open(it.url, '_blank')}
            onMouseOver={e => e.currentTarget.style.background = '#0f1118'}
            onMouseOut={e => e.currentTarget.style.background = ''}
          >
            {/* Score */}
            <div style={{
              fontWeight: 700, fontSize: '0.7rem', textAlign: 'center',
              color: scoreClass(it.score || 0), background: scoreClass(it.score || 0) + '15',
              padding: '3px 0', borderRadius: 3,
            }}>
              {it.score || 0}
            </div>

            {/* Title + description */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</div>
              {it.description && (
                <div style={{ fontSize: '0.5rem', color: '#5a606c', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {it.description}
                </div>
              )}
            </div>

            {/* Source */}
            <div>
              <div style={{ fontSize: '0.55rem', color: '#5b8aff' }}>{it.source}</div>
              {it.source_type && <div style={{ fontSize: '0.45rem', color: '#4b5060', marginTop: 1 }}>{it.source_type}</div>}
            </div>

            {/* Ups */}
            <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: it.ups ? 'var(--text-primary)' : '#3b3f4a' }}>
              {it.ups ? fmtN(it.ups) : '—'}
            </div>

            {/* Comments */}
            <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: it.comments ? 'var(--text-primary)' : '#3b3f4a' }}>
              {it.comments ? fmtN(it.comments) : '—'}
            </div>

            {/* Published */}
            <div style={{ fontSize: '0.5rem', color: '#9ba3af' }}>
              {it.published_at ? fmtDate(it.published_at) : '—'}
              {it.published_at && <div style={{ fontSize: '0.45rem', color: '#5a606c' }}>{ago(it.published_at)}</div>}
            </div>

            {/* Fetched */}
            <div style={{ fontSize: '0.5rem', color: '#5a606c' }}>
              {it.fetched_at ? ago(it.fetched_at) : '—'}
            </div>

            {/* Forge */}
            <div>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.48rem', padding: '3px 8px' }} onClick={e => { e.stopPropagation(); /* TODO: open forge */ }}>⚡ forge</button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: '0.7rem' }}>no articles found</div>
        )}
      </div>
    </div>
  );
}
