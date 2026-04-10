import { useState, useEffect } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 80, textAlign: 'right' }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: 'var(--bg-hover)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: Math.min(pct, 100) + '%', height: '100%', background: color || 'var(--accent)', borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 10, color: 'var(--text-secondary)', width: 50, textAlign: 'right' }}>{typeof value === 'number' ? value.toFixed(1) : value}</span>
    </div>
  );
}

export default function PerformancePanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(false);
  const [form, setForm] = useState({ trend_title: '', platform: 'tiktok', views: '', likes: '', comments: '', shares: '', emotion: 'funny', format: 'skit' });
  const [recording, setRecording] = useState(false);

  const load = () => {
    api.getPerformanceSummary()
      .then(d => { if (d.ok !== false) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const adjust = async () => {
    setAdjusting(true);
    await api.adjustWeights();
    load();
    setAdjusting(false);
  };

  const record = async () => {
    setRecording(true);
    await api.recordPerformance({
      ...form,
      views: +form.views || 0,
      likes: +form.likes || 0,
      comments: +form.comments || 0,
      shares: +form.shares || 0,
    });
    setForm(f => ({ ...f, trend_title: '', views: '', likes: '', comments: '', shares: '' }));
    load();
    setRecording(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 20 }}><span className="spinner" /></div>;
  if (!data) return <div style={{ color: 'var(--text-muted)', padding: 12 }}>failed to load</div>;

  const emotions = data?.top_emotions || [];
  const formats = data?.top_formats || [];
  const maxE = Math.max(...emotions.map(e => e.avg_engagement || e.avg || e.score || 0), 1);
  const maxF = Math.max(...formats.map(f => f.avg_engagement || f.avg || f.score || 0), 1);

  return (
    <div>
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 12 }}>
        <div className="stat-card"><div className="stat-val">{data?.entries || 0}</div><div className="stat-lbl">entries</div></div>
        <div className="stat-card"><div className="stat-val" style={{ color: 'var(--accent)' }}>{(data?.avg_engagement || 0).toFixed(1)}%</div><div className="stat-lbl">avg engagement</div></div>
        <div className="stat-card"><div className="stat-val">{Object.keys(data?.platforms || {}).length}</div><div className="stat-lbl">platforms</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div className="card">
          <div className="label" style={{ marginBottom: 6 }}>top emotions</div>
          {emotions.map((e, i) => (
            <Bar key={i} label={e.emotion || e.name || e.label} value={e.avg_engagement || e.avg || e.score || 0} max={maxE} color="var(--warning)" />
          ))}
          {emotions.length === 0 && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>no data</div>}
        </div>
        <div className="card">
          <div className="label" style={{ marginBottom: 6 }}>top formats</div>
          {formats.map((f, i) => (
            <Bar key={i} label={f.format || f.name || f.label} value={f.avg_engagement || f.avg || f.score || 0} max={maxF} color="var(--success)" />
          ))}
          {formats.length === 0 && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>no data</div>}
        </div>
      </div>

      <button className="btn btn-primary" onClick={adjust} disabled={adjusting} style={{ marginBottom: 12 }}>
        {adjusting ? <span className="spinner" /> : 'adjust weights from data'}
      </button>

      <div className="card">
        <div className="label" style={{ marginBottom: 6 }}>record performance</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          <input placeholder="trend title" value={form.trend_title} onChange={e => setForm({ ...form, trend_title: e.target.value })} />
          <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
            {['tiktok', 'youtube', 'instagram', 'twitter'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={form.emotion} onChange={e => setForm({ ...form, emotion: e.target.value })}>
            {['funny', 'shocking', 'inspiring', 'relatable', 'nostalgic', 'controversial', 'heartwarming', 'educational'].map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <input type="number" placeholder="views" value={form.views} onChange={e => setForm({ ...form, views: e.target.value })} />
          <input type="number" placeholder="likes" value={form.likes} onChange={e => setForm({ ...form, likes: e.target.value })} />
          <input type="number" placeholder="comments" value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} />
          <input type="number" placeholder="shares" value={form.shares} onChange={e => setForm({ ...form, shares: e.target.value })} />
          <select value={form.format} onChange={e => setForm({ ...form, format: e.target.value })}>
            {['skit', 'storytime', 'reaction', 'tutorial', 'vlog', 'duet', 'trend', 'challenge', 'listicle'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <button className="btn btn-success btn-sm" onClick={record} disabled={recording} style={{ justifyContent: 'center' }}>
            {recording ? <span className="spinner" /> : 'record'}
          </button>
        </div>
      </div>
    </div>
  );
}
