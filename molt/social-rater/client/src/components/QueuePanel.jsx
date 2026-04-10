import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '\u2014'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const statusColors = { pending: '#fbbf24', approved: '#4ade80', published: '#6366f1', rejected: '#f87171' };

export default function QueuePanel() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([api.getQueue('limit=50'), api.getQueueStats()])
      .then(([q, s]) => {
        if (q.ok !== false) setItems(q.items || []);
        if (s.ok !== false) setStats(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (e, id, status) => {
    e.stopPropagation();
    await api.updateQueueStatus(id, status);
    load();
  };

  const remove = async (e, id) => {
    e.stopPropagation();
    await api.removeFromQueue(id);
    load();
  };

  const filtered = items.filter(it => filter === 'all' || it.status === filter);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        {[
          { val: stats.total || 0, lbl: 'total', color: '#fafafa' },
          { val: stats.pending || 0, lbl: 'pending', color: '#fbbf24' },
          { val: stats.approved || 0, lbl: 'approved', color: '#4ade80' },
          { val: stats.published || 0, lbl: 'published', color: '#6366f1' },
          { val: stats.urgent || 0, lbl: 'urgent', color: '#f87171' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: '12px 14px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
            <div style={{ fontSize: '0.48rem', color: '#3f3f46', textTransform: 'uppercase', marginTop: 3 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2, marginBottom: 12, width: 'fit-content' }}>
        {['all', 'pending', 'approved', 'published', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '4px 12px', fontSize: '0.6rem', borderRadius: 4,
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            background: filter === s ? '#27272a' : 'transparent',
            color: filter === s ? '#fafafa' : '#71717a',
            fontWeight: filter === s ? 500 : 400,
            transition: 'all 0.15s',
          }}>{s}</button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div> : (
        <div>
          {filtered.map((it, i) => (
            <div key={it.id || i} style={{
              padding: '12px 8px', borderBottom: '1px solid #18181b',
              cursor: 'pointer', transition: 'background 0.12s',
            }}
              onClick={() => setExpanded(expanded === i ? null : i)}
              onMouseOver={e => e.currentTarget.style.background = '#111113'}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontWeight: 700, fontSize: '0.82rem', fontVariantNumeric: 'tabular-nums', minWidth: 28,
                  color: (it.trend_score || 0) >= 70 ? '#4ade80' : '#6366f1',
                }}>{Math.round(it.trend_score || 0)}</span>
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem', fontWeight: 500, color: '#fafafa' }}>{it.trend_title}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  {it.priority === 'urgent' && <span style={{ fontSize: '0.55rem', color: '#f87171', fontWeight: 600 }}>urgent</span>}
                  <span style={{ fontSize: '0.58rem', color: statusColors[it.status] || '#52525b', fontWeight: 600 }}>{it.status}</span>
                  {it.emotion && <span style={{ fontSize: '0.55rem', color: '#52525b' }}>{it.emotion}</span>}
                  {it.format && <span style={{ fontSize: '0.55rem', color: '#3f3f46' }}>{it.format}</span>}
                  <span style={{ fontSize: '0.55rem', color: '#3f3f46' }}>{it.queued_at ? ago(new Date(it.queued_at).getTime()) : ''}</span>
                  <span style={{ fontSize: '0.58rem', color: '#3f3f46' }}>{expanded === i ? '\u25be' : '\u203a'}</span>
                </div>
              </div>

              {expanded === i && (
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #18181b', fontSize: '0.62rem', marginLeft: 40 }}>
                  {it.aggressive && (
                    <div style={{ padding: '6px 10px', background: '#1c1017', color: '#f87171', borderRadius: 6, marginBottom: 8, fontWeight: 600, fontSize: '0.58rem' }}>aggressive content flagged</div>
                  )}
                  {it.platforms && (
                    <div style={{ marginBottom: 4, color: '#a1a1aa' }}>
                      <span style={{ color: '#3f3f46' }}>platforms: </span>
                      {(Array.isArray(it.platforms) ? it.platforms : [it.platforms]).join(', ')}
                    </div>
                  )}
                  {it.hooks && it.hooks.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: '#3f3f46' }}>hooks:</span>
                      {it.hooks.map((h, j) => <div key={j} style={{ paddingLeft: 10, color: '#a1a1aa' }}>- {h}</div>)}
                    </div>
                  )}
                  {it.angles && it.angles.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: '#3f3f46' }}>angles:</span>
                      {it.angles.map((a, j) => <div key={j} style={{ paddingLeft: 10, color: '#a1a1aa' }}>- {a}</div>)}
                    </div>
                  )}
                  {it.scripts && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: '#3f3f46' }}>scripts:</span>
                      {(Array.isArray(it.scripts) ? it.scripts : [it.scripts]).map((s, j) => (
                        <pre key={j} style={{ paddingLeft: 10, color: '#a1a1aa', whiteSpace: 'pre-wrap', margin: '4px 0', fontFamily: 'inherit', background: '#18181b', padding: 8, borderRadius: 6 }}>
                          {typeof s === 'string' ? s : JSON.stringify(s, null, 2)}
                        </pre>
                      ))}
                    </div>
                  )}
                  {it.captions && <div style={{ marginBottom: 4, color: '#a1a1aa' }}><span style={{ color: '#3f3f46' }}>captions: </span>{it.captions}</div>}

                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    {it.status === 'pending' && (
                      <>
                        <button onClick={e => updateStatus(e, it.id, 'approved')} style={{
                          padding: '5px 12px', fontSize: '0.58rem', borderRadius: 6, border: 'none',
                          background: '#4ade80', color: '#09090b', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                        }}>approve</button>
                        <button onClick={e => updateStatus(e, it.id, 'rejected')} style={{
                          padding: '5px 12px', fontSize: '0.58rem', borderRadius: 6, border: '1px solid #27272a',
                          background: 'transparent', color: '#f87171', cursor: 'pointer', fontFamily: 'inherit',
                        }}>reject</button>
                      </>
                    )}
                    {it.status === 'approved' && (
                      <button onClick={e => updateStatus(e, it.id, 'published')} style={{
                        padding: '5px 12px', fontSize: '0.58rem', borderRadius: 6, border: 'none',
                        background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                      }}>publish</button>
                    )}
                    <button onClick={e => remove(e, it.id)} style={{
                      padding: '5px 12px', fontSize: '0.58rem', borderRadius: 6, border: '1px solid #27272a',
                      background: 'transparent', color: '#71717a', cursor: 'pointer', fontFamily: 'inherit',
                    }}>remove</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#3f3f46', fontSize: '0.7rem' }}>queue empty</div>}
        </div>
      )}
    </div>
  );
}
