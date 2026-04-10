import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ClustersPanel from '../components/ClustersPanel';
import QueuePanel from '../components/QueuePanel';
import PerformancePanel from '../components/PerformancePanel';
import SocialPanel from '../components/SocialPanel';
import LogsPanel from '../components/LogsPanel';

const get = (url) => fetch(url).then(r => r.json());
const post = (url, body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }).then(r => r.json());

const TABS = ['dashboard', 'clusters', 'queue', 'performance', 'social', 'logs'];

const SCORE_CLASS = (s) => s >= 70 ? { label: 'hot', color: '#a855f7' } : s >= 40 ? { label: 'warm', color: '#f97316' } : { label: 'cool', color: '#6b7280' };
const EMOTION_COLORS = { anger: '#ef4444', fear: '#f97316', money: '#22c55e', status: '#a855f7', curiosity: '#3b82f6' };

function ScorePill({ score }) {
  const { label, color } = SCORE_CLASS(score);
  return <span className="badge" style={{ background: color, color: '#fff', fontSize: 11 }}>{score} {label}</span>;
}

function EmotionPill({ emotion }) {
  if (!emotion) return null;
  const c = EMOTION_COLORS[emotion] || 'var(--text-muted)';
  return <span className="badge" style={{ background: c + '22', color: c, fontSize: 11 }}>{emotion}</span>;
}

function Dashboard({ data, onGenerate }) {
  if (!data) return null;
  const { trending, clusters, queue, performance, social, worker, latency, top_trends } = data;
  const stats = [
    { label: 'Items Tracked', value: trending?.total ?? '-' },
    { label: 'Clusters', value: clusters?.total ?? '-' },
    { label: 'Queued', value: queue?.total ?? '-' },
    { label: 'Perf Entries', value: performance?.entries ?? '-' },
    { label: 'Social Posts', value: social?.total ?? '-' },
    { label: 'Cycles Run', value: worker?.runs ?? '-' },
    { label: 'Avg Latency', value: latency?.avg_total_human ?? '-' },
  ];
  const weights = performance?.weights || {};
  const wKeys = ['velocity', 'cross_platform', 'emotion', 'format'];
  const wTotal = wKeys.reduce((s, k) => s + (weights[k] || 0), 0) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stat cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
        {stats.map(s => (
          <div className="card" key={s.label} style={{ padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
            <div className="text-sm text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scoring weights */}
      <div className="card" style={{ padding: 16 }}>
        <div className="text-sm" style={{ fontWeight: 600, marginBottom: 8 }}>Scoring Weights</div>
        <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden' }}>
          {wKeys.map((k, i) => {
            const pct = ((weights[k] || 0) / wTotal * 100).toFixed(0);
            const colors = ['#a855f7', '#3b82f6', '#ef4444', '#22c55e'];
            return (
              <div key={k} style={{ width: pct + '%', background: colors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600, minWidth: pct > 5 ? 'auto' : 0 }}>
                {pct > 10 ? `${k} ${pct}%` : ''}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4" style={{ marginTop: 6 }}>
          {wKeys.map((k, i) => {
            const colors = ['#a855f7', '#3b82f6', '#ef4444', '#22c55e'];
            return <span key={k} className="text-sm" style={{ color: colors[i] }}>{k}: {weights[k] ?? 0}</span>;
          })}
        </div>
      </div>

      {/* Hot clusters + Top trends side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="text-sm" style={{ fontWeight: 600, marginBottom: 10 }}>Hot Clusters</div>
          {(clusters?.top_clusters || []).length === 0 && <p className="text-muted text-sm">No clusters yet</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(clusters?.top_clusters || []).map((c, i) => (
              <div key={i} className="flex items-center justify-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                  <ScorePill score={c.score} />
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.label}</span>
                  <span className="text-sm text-muted">{c.item_count} items</span>
                  {c.sources && <span className="text-sm text-muted font-mono">{c.sources}</span>}
                  <EmotionPill emotion={c.emotion} />
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onGenerate?.(c)}>generate</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="text-sm" style={{ fontWeight: 600, marginBottom: 10 }}>Top Trends</div>
          {(top_trends || []).length === 0 && <p className="text-muted text-sm">No trends yet</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(top_trends || []).map((t, i) => (
              <div key={i} className="flex items-center gap-2" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <ScorePill score={t.score} />
                <span style={{ fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>{t.title}</span>
                <span className="text-sm text-muted">{t.source}</span>
                <EmotionPill emotion={t.emotion} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder panels
// Panels imported from components/

export default function Engine() {
  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [running, setRunning] = useState(false);

  const fetch_ = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await get('/api/engine/dashboard');
      setData(res);
    } catch (e) {
      setError(e.message || 'Failed to load engine data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch_(); }, []);

  const runCycle = async () => {
    setRunning(true);
    try { await post('/api/engine/run'); await fetch_(); } catch {} finally { setRunning(false); }
  };

  const toggleWorker = async () => {
    try {
      await post('/api/engine/toggle');
      await fetch_();
    } catch {}
  };

  const workerEnabled = data?.worker?.enabled;
  const workerRuns = data?.worker?.runs ?? 0;
  const lastRun = data?.worker?.last_run ? new Date(data.worker.last_run).toLocaleTimeString() : '-';

  const tabContent = {
    dashboard: <Dashboard data={data} onGenerate={(c) => console.log('generate', c)} />,
    clusters: <ClustersPanel />,
    queue: <QueuePanel />,
    performance: <PerformancePanel />,
    social: <SocialPanel />,
    logs: <LogsPanel />,
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Virality Engine</h2>
          <p className="text-sm text-muted">Scoring, clustering, content queue & worker</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: workerEnabled ? 'var(--success)' : 'var(--warning)', display: 'inline-block' }} />
            <span className="text-sm">{workerEnabled ? 'Active' : 'Paused'}</span>
            <span className="text-sm text-muted">|</span>
            <span className="text-sm text-muted">{workerRuns} runs</span>
            <span className="text-sm text-muted">|</span>
            <span className="text-sm text-muted font-mono">{lastRun}</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={runCycle} disabled={running}>{running ? 'Running...' : 'Run Cycle Now'}</button>
          <button className="btn btn-ghost btn-sm" onClick={toggleWorker}>{workerEnabled ? 'Pause' : 'Resume'}</button>
          <button className="btn btn-ghost btn-sm" onClick={fetch_}>Refresh</button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button key={t} className={`btn btn-sm ${t === tab ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {error && <div className="card" style={{ padding: 16, borderColor: 'var(--danger)', color: 'var(--danger)' }}>{error}</div>}
      {loading && !data ? <div className="card" style={{ padding: 24 }}><p className="text-muted">Loading engine...</p></div> : tabContent[tab]}
    </div>
  );
}
