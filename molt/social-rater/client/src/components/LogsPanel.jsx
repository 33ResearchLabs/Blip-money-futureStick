import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

function fmtTime(ts) {
  try { const d = new Date(ts); return d.toTimeString().slice(0, 8); }
  catch { return '??:??:??'; }
}

export default function LogsPanel() {
  const [logs, setLogs] = useState([]);
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  const load = async () => {
    const res = await api.getWorkerLogs(80);
    setLogs(res.logs || []);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  const refresh = async () => { setBusy(true); await load(); setBusy(false); };

  return (
    <div className="fade-in" style={{ padding: 24, maxWidth: 860 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 15, color: 'var(--text-primary)' }}>Worker Logs</h3>
        <button onClick={refresh} disabled={busy} className="btn-primary"
          style={{ padding: '6px 16px', borderRadius: 6, fontSize: 13 }}>
          {busy ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10,
        padding: 16, maxHeight: 520, overflowY: 'auto', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7,
      }}>
        {logs.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No logs yet.</div>}
        {logs.map((entry, i) => (
          <div key={i} style={{ color: entry.error ? 'var(--danger)' : 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--text-muted)' }}>[{fmtTime(entry.ts)}]</span> {entry.message}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
