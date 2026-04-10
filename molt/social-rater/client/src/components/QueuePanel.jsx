import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const ago = ms => { if(!ms) return '--'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const statusColors = { pending: 'var(--warning)', approved: 'var(--success)', published: 'var(--accent)', rejected: 'var(--danger)' };

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
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 10 }}>
        <div className="stat-card"><div className="stat-val">{stats.total || 0}</div><div className="stat-lbl">total</div></div>
        <div className="stat-card"><div className="stat-val" style={{ color: 'var(--warning)' }}>{stats.pending || 0}</div><div className="stat-lbl">pending</div></div>
        <div className="stat-card"><div className="stat-val" style={{ color: 'var(--success)' }}>{stats.approved || 0}</div><div className="stat-lbl">approved</div></div>
        <div className="stat-card"><div className="stat-val" style={{ color: 'var(--accent)' }}>{stats.published || 0}</div><div className="stat-lbl">published</div></div>
        <div className="stat-card"><div className="stat-val" style={{ color: 'var(--danger)' }}>{stats.urgent || 0}</div><div className="stat-lbl">urgent</div></div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {['all', 'pending', 'approved', 'published', 'rejected'].map(s => (
          <button key={s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 20 }}><span className="spinner" /></div> : (
        <div>
          {filtered.map((it, i) => (
            <div key={it.id || i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpanded(expanded === i ? null : i)}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: it.trend_score >= 70 ? 'var(--danger)' : 'var(--accent)', minWidth: 24 }}>{Math.round(it.trend_score || 0)}</span>
                  <span className="truncate" style={{ fontSize: 11, fontWeight: 500 }}>{it.trend_title}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                  {it.priority === 'urgent' && <span className="badge badge-danger">urgent</span>}
                  <span style={{ fontSize: 10, color: statusColors[it.status] || 'var(--text-muted)', fontWeight: 600 }}>{it.status}</span>
                  {it.emotion && <span className="badge badge-warning">{it.emotion}</span>}
                  {it.format && <span className="badge badge-info">{it.format}</span>}
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{it.queued_at ? ago(new Date(it.queued_at).getTime()) : ''}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{expanded === i ? 'v' : '>'}</span>
                </div>
              </div>

              {expanded === i && (
                <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid var(--border)', fontSize: 10 }}>
                  {it.aggressive && (
                    <div style={{ padding: '4px 8px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 3, marginBottom: 6, fontWeight: 600 }}>aggressive content flagged</div>
                  )}
                  {it.platforms && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>platforms: </span>
                      {(Array.isArray(it.platforms) ? it.platforms : [it.platforms]).join(', ')}
                    </div>
                  )}
                  {it.hooks && it.hooks.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>hooks:</span>
                      {it.hooks.map((h, j) => <div key={j} style={{ paddingLeft: 8, color: 'var(--text-secondary)' }}>- {h}</div>)}
                    </div>
                  )}
                  {it.angles && it.angles.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>angles:</span>
                      {it.angles.map((a, j) => <div key={j} style={{ paddingLeft: 8, color: 'var(--text-secondary)' }}>- {a}</div>)}
                    </div>
                  )}
                  {it.scripts && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>scripts:</span>
                      {(Array.isArray(it.scripts) ? it.scripts : [it.scripts]).map((s, j) => (
                        <pre key={j} style={{ paddingLeft: 8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', margin: '2px 0', fontFamily: 'inherit', background: 'var(--bg-hover)', padding: 6, borderRadius: 3 }}>
                          {typeof s === 'string' ? s : JSON.stringify(s, null, 2)}
                        </pre>
                      ))}
                    </div>
                  )}
                  {it.captions && <div style={{ marginBottom: 4 }}><span style={{ color: 'var(--text-muted)' }}>captions: </span>{it.captions}</div>}

                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    {it.status === 'pending' && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={e => updateStatus(e, it.id, 'approved')}>approve</button>
                        <button className="btn btn-danger btn-sm" onClick={e => updateStatus(e, it.id, 'rejected')}>reject</button>
                      </>
                    )}
                    {it.status === 'approved' && (
                      <button className="btn btn-primary btn-sm" onClick={e => updateStatus(e, it.id, 'published')}>publish</button>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={e => remove(e, it.id)}>remove</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div style={{ color: 'var(--text-muted)', padding: 12, textAlign: 'center' }}>queue empty</div>}
        </div>
      )}
    </div>
  );
}
