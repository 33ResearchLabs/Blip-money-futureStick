import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

function fmtTs(ts) {
  if (!ts) return '--';
  try {
    const d = new Date(ts);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch { return '--'; }
}

export default function LogsPanel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);
  const endRef = useRef(null);

  const load = () => {
    setLoading(true);
    api.getWorkerLogs(limit)
      .then(d => { if (d.ok !== false) setLogs(d.logs || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [limit]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{logs.length} entries</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <select value={limit} onChange={e => setLimit(+e.target.value)} style={{ width: 60 }}>
            {[20, 50, 100, 200].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={load}>refresh</button>
        </div>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 20 }}><span className="spinner" /></div> : (
        <div style={{ maxHeight: 500, overflowY: 'auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: 4 }}>
          {logs.map((log, i) => (
            <div key={i} style={{
              padding: '3px 8px',
              fontSize: 10,
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              gap: 10,
              background: log.error ? 'var(--danger-bg)' : 'transparent',
            }}>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, minWidth: 110 }}>{fmtTs(log.ts)}</span>
              <span style={{ color: log.error ? 'var(--danger)' : 'var(--text-secondary)', flex: 1 }}>
                {log.message}
                {log.error && <span style={{ color: 'var(--danger)', marginLeft: 6, fontWeight: 600 }}>[ERR]</span>}
              </span>
            </div>
          ))}
          {logs.length === 0 && <div style={{ color: 'var(--text-muted)', padding: 12, textAlign: 'center' }}>no logs</div>}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}
