import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ClustersPanel from '../components/ClustersPanel';
import QueuePanel from '../components/QueuePanel';
import PerformancePanel from '../components/PerformancePanel';
import SocialPanel from '../components/SocialPanel';
import LogsPanel from '../components/LogsPanel';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '\u2014'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };

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

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div>;
  if (!data) return <div style={{ color: '#3f3f46', padding: 20, fontSize: '0.75rem' }}>failed to load engine data</div>;

  const { trending = {}, social = {}, clusters = {}, queue = {}, performance = {}, latency = {} } = data;
  const weights = performance?.weights || {};
  const wKeys = Object.keys(weights);
  const wTotal = wKeys.reduce((s, k) => s + (weights[k] || 0), 0) || 1;
  const wColors = ['#6366f1', '#4ade80', '#fbbf24', '#f87171', '#38bdf8', '#a855f7'];

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {[
          { val: fmtN(trending.total), lbl: 'tracked', color: '#6366f1' },
          { val: fmtN(clusters.total), lbl: 'clusters', color: '#fbbf24' },
          { val: fmtN(queue.total), lbl: 'queued', color: '#4ade80' },
          { val: fmtN(performance.entries), lbl: 'perf entries', color: '#fafafa' },
          { val: worker?.runs || 0, lbl: 'cycles', color: '#fafafa' },
          { val: latency?.avg_total_human || '\u2014', lbl: 'latency', color: '#fafafa' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: '12px 14px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
            <div style={{ fontSize: '0.48rem', color: '#3f3f46', textTransform: 'uppercase', marginTop: 3 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Worker control */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 600, color: worker?.enabled ? '#4ade80' : '#f87171' }}>{worker?.enabled ? 'enabled' : 'disabled'}</span>
          <span style={{ fontSize: '0.58rem', color: '#3f3f46' }}>last run: {worker?.last_run ? ago(new Date(worker.last_run).getTime()) : '\u2014'}</span>
          <span style={{ fontSize: '0.58rem', color: '#3f3f46' }}>{worker?.runs || 0} runs</span>
        </div>
        <button onClick={runCycle} disabled={running} style={{
          padding: '5px 14px', fontSize: '0.6rem', borderRadius: 6, border: 'none',
          background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
        }}>{running ? '...' : 'run cycle'}</button>
      </div>

      {/* Scoring weights */}
      {wKeys.length > 0 && (
        <div style={{ padding: '12px 14px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f', marginBottom: 16 }}>
          <div style={{ fontSize: '0.55rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 500 }}>scoring weights</div>
          <div style={{ display: 'flex', height: 10, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            {wKeys.map((k, i) => {
              const pct = ((weights[k] || 0) / wTotal * 100);
              return <div key={k} style={{ width: pct + '%', background: wColors[i % wColors.length], minWidth: pct > 3 ? 'auto' : 0 }} title={`${k}: ${pct.toFixed(0)}%`} />;
            })}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {wKeys.map((k, i) => (
              <span key={k} style={{ fontSize: '0.55rem', color: wColors[i % wColors.length] }}>{k}: {((weights[k] || 0) / wTotal * 100).toFixed(0)}%</span>
            ))}
          </div>
        </div>
      )}

      {/* Two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: '12px 14px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
          <div style={{ fontSize: '0.55rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 500 }}>hot clusters</div>
          {(clusters?.top_clusters || []).slice(0, 5).map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #18181b', fontSize: '0.65rem' }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#a1a1aa' }}>{c.label}</span>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                {c.emotion && <span style={{ fontSize: '0.55rem', color: '#52525b' }}>{c.emotion}</span>}
                <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#fbbf24' }}>{Math.round(c.cluster_score || c.score || 0)}</span>
              </div>
            </div>
          ))}
          {!(clusters?.top_clusters || []).length && <div style={{ fontSize: '0.65rem', color: '#3f3f46' }}>no clusters</div>}
        </div>
        <div style={{ padding: '12px 14px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
          <div style={{ fontSize: '0.55rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 500 }}>top trends</div>
          {(data.top_trends || trending.top || []).slice(0, 5).map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #18181b', fontSize: '0.65rem' }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#a1a1aa' }}>{t.title}</span>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                {t.emotion && <span style={{ fontSize: '0.55rem', color: '#52525b' }}>{t.emotion}</span>}
                <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#6366f1' }}>{Math.round(t.trend_score || t.score || 0)}</span>
              </div>
            </div>
          ))}
          {!(data.top_trends || trending.top || []).length && <div style={{ fontSize: '0.65rem', color: '#3f3f46' }}>no trends</div>}
        </div>
      </div>
    </div>
  );
}

export default function Engine() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px', borderBottom: '1px solid #18181b', flexShrink: 0 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.01em' }}>Engine</span>
        <span style={{ fontSize: '0.6rem', color: '#52525b' }}>virality engine</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
          {subTabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '4px 12px', fontSize: '0.6rem', borderRadius: 4,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: tab === t ? '#27272a' : 'transparent',
              color: tab === t ? '#fafafa' : '#71717a',
              fontWeight: tab === t ? 500 : 400,
              transition: 'all 0.15s',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0', scrollbarWidth: 'thin' }}>
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'clusters' && <ClustersPanel />}
        {tab === 'queue' && <QueuePanel />}
        {tab === 'performance' && <PerformancePanel />}
        {tab === 'social' && <SocialPanel />}
        {tab === 'logs' && <LogsPanel />}
      </div>
    </div>
  );
}
