import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ClustersPanel from '../components/ClustersPanel';
import QueuePanel from '../components/QueuePanel';
import PerformancePanel from '../components/PerformancePanel';
import SocialPanel from '../components/SocialPanel';
import LogsPanel from '../components/LogsPanel';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '--'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };

const subTabs = ['dashboard', 'clusters', 'queue', 'performance', 'social', 'logs'];

function Dashboard() {
  const [data, setData] = useState(null);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    Promise.all([api.getDashboard(), api.getWorkerState()])
      .then(([d, w]) => {
        if (d.ok !== false) setData(d);
        if (w.ok !== false) setWorker(w);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const runCycle = async () => {
    setRunning(true);
    await api.runWorker();
    const w = await api.getWorkerState();
    if (w.ok !== false) setWorker(w);
    setRunning(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 30 }}><span className="spinner" /></div>;
  if (!data) return <div style={{ color: 'var(--text-muted)' }}>failed to load engine data</div>;

  const { trending = {}, social = {}, clusters = {}, queue = {}, performance = {}, latency = {} } = data;
  const weights = performance?.weights || {};
  const wKeys = Object.keys(weights);
  const wTotal = wKeys.reduce((s, k) => s + (weights[k] || 0), 0) || 1;
  const wColors = ['var(--accent)', 'var(--success)', 'var(--warning)', 'var(--danger)', 'var(--info)', '#a855f7'];

  return (
    <div>
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(6, 1fr)', marginBottom: 12 }}>
        <div className="stat-card"><div className="stat-val" style={{ color: 'var(--accent)' }}>{fmtN(trending.total)}</div><div className="stat-lbl">tracked</div></div>
        <div className="stat-card"><div className="stat-val" style={{ color: 'var(--warning)' }}>{fmtN(clusters.total)}</div><div className="stat-lbl">clusters</div></div>
        <div className="stat-card"><div className="stat-val" style={{ color: 'var(--success)' }}>{fmtN(queue.total)}</div><div className="stat-lbl">queued</div></div>
        <div className="stat-card"><div className="stat-val">{fmtN(performance.entries)}</div><div className="stat-lbl">perf entries</div></div>
        <div className="stat-card"><div className="stat-val">{worker?.runs || 0}</div><div className="stat-lbl">cycles</div></div>
        <div className="stat-card"><div className="stat-val">{latency?.avg_total_human || '--'}</div><div className="stat-lbl">latency</div></div>
      </div>

      {/* Worker control */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className={`badge ${worker?.enabled ? 'badge-success' : 'badge-danger'}`}>{worker?.enabled ? 'enabled' : 'disabled'}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>last run: {worker?.last_run ? ago(new Date(worker.last_run).getTime()) : '--'}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{worker?.runs || 0} runs</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={runCycle} disabled={running}>
          {running ? <span className="spinner" /> : 'run cycle'}
        </button>
      </div>

      {/* Scoring weights */}
      {wKeys.length > 0 && (
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="label" style={{ marginBottom: 6 }}>scoring weights</div>
          <div style={{ display: 'flex', height: 14, borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
            {wKeys.map((k, i) => {
              const pct = ((weights[k] || 0) / wTotal * 100);
              return <div key={k} style={{ width: pct + '%', background: wColors[i % wColors.length], minWidth: pct > 3 ? 'auto' : 0 }} title={`${k}: ${pct.toFixed(0)}%`} />;
            })}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {wKeys.map((k, i) => (
              <span key={k} style={{ fontSize: 9, color: wColors[i % wColors.length] }}>{k}: {((weights[k] || 0) / wTotal * 100).toFixed(0)}%</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card">
          <div className="label" style={{ marginBottom: 6 }}>hot clusters</div>
          {(clusters?.top_clusters || []).slice(0, 5).map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '3px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="truncate" style={{ flex: 1 }}>{c.label}</span>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {c.emotion && <span className="badge badge-warning">{c.emotion}</span>}
                <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{Math.round(c.cluster_score || c.score || 0)}</span>
              </div>
            </div>
          ))}
          {!(clusters?.top_clusters || []).length && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>no clusters</div>}
        </div>
        <div className="card">
          <div className="label" style={{ marginBottom: 6 }}>top trends</div>
          {(data.top_trends || trending.top || []).slice(0, 5).map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '3px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="truncate" style={{ flex: 1 }}>{t.title}</span>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {t.emotion && <span className="badge badge-warning">{t.emotion}</span>}
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{Math.round(t.trend_score || t.score || 0)}</span>
              </div>
            </div>
          ))}
          {!(data.top_trends || trending.top || []).length && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>no trends</div>}
        </div>
      </div>
    </div>
  );
}

export default function Engine() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-label">automation</div>
        <div className="page-title">Engine</div>
        <div className="page-subtitle">virality engine -- score, cluster, generate, publish</div>
      </div>

      <div className="tabs" style={{ marginBottom: 10 }}>
        {subTabs.map(t => <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {tab === 'dashboard' && <Dashboard />}
      {tab === 'clusters' && <ClustersPanel />}
      {tab === 'queue' && <QueuePanel />}
      {tab === 'performance' && <PerformancePanel />}
      {tab === 'social' && <SocialPanel />}
      {tab === 'logs' && <LogsPanel />}
    </div>
  );
}
