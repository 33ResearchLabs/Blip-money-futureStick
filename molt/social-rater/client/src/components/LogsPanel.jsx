import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

function fmtTs(ts) {
  if (!ts) return '\u2014';
  try {
    const d = new Date(ts);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch { return '\u2014'; }
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

  const inputStyle = {
    padding: '5px 10px', fontSize: '0.65rem', background: '#18181b',
    border: '1px solid #27272a', borderRadius: 6, color: '#a1a1aa', fontFamily: 'inherit',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: '0.6rem', color: '#52525b' }}>{logs.length} entries</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <select value={limit} onChange={e => setLimit(+e.target.value)} style={{ ...inputStyle, width: 60 }}>
            {[20, 50, 100, 200].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={load} style={{
            padding: '5px 12px', fontSize: '0.6rem', borderRadius: 6, border: '1px solid #27272a',
            background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit',
          }}>{'\u21bb'}</button>
        </div>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div> : (
        <div style={{ maxHeight: 500, overflowY: 'auto', background: '#111113', border: '1px solid #1c1c1f', borderRadius: 8, padding: 4, scrollbarWidth: 'thin' }}>
          {logs.map((log, i) => (
            <div key={i} style={{
              padding: '5px 10px', fontSize: '0.6rem',
              borderBottom: '1px solid #18181b',
              display: 'flex', gap: 12,
              background: log.error ? '#1c1017' : 'transparent',
              borderRadius: log.error ? 4 : 0,
            }}>
              <span style={{ color: '#3f3f46', flexShrink: 0, minWidth: 120, fontVariantNumeric: 'tabular-nums' }}>{fmtTs(log.ts)}</span>
              <span style={{ color: log.error ? '#f87171' : '#a1a1aa', flex: 1 }}>
                {log.message}
                {log.error && <span style={{ color: '#f87171', marginLeft: 6, fontWeight: 600 }}>[ERR]</span>}
              </span>
            </div>
          ))}
          {logs.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: '#3f3f46', fontSize: '0.65rem' }}>no logs</div>}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}
