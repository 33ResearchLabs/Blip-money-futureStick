import { useState, useEffect } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };

const inputStyle = {
  width: '100%', padding: '6px 10px', fontSize: '0.65rem', background: '#18181b',
  border: '1px solid #27272a', borderRadius: 6, color: '#a1a1aa', fontFamily: 'inherit',
};

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: '0.6rem', color: '#52525b', width: 80, textAlign: 'right', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: '#18181b', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: Math.min(pct, 100) + '%', height: '100%', background: color || '#6366f1', borderRadius: 3, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: '0.6rem', color: '#a1a1aa', width: 44, textAlign: 'right', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{typeof value === 'number' ? value.toFixed(1) : value}</span>
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

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div>;
  if (!data) return <div style={{ color: '#3f3f46', padding: 20, fontSize: '0.7rem' }}>failed to load</div>;

  const emotions = data?.top_emotions || [];
  const formats = data?.top_formats || [];
  const maxE = Math.max(...emotions.map(e => e.avg_engagement || e.avg || e.score || 0), 1);
  const maxF = Math.max(...formats.map(f => f.avg_engagement || f.avg || f.score || 0), 1);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {[
          { val: data?.entries || 0, lbl: 'entries', color: '#fafafa' },
          { val: (data?.avg_engagement || 0).toFixed(1) + '%', lbl: 'avg engagement', color: '#6366f1' },
          { val: Object.keys(data?.platforms || {}).length, lbl: 'platforms', color: '#fafafa' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: '12px 14px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
            <div style={{ fontSize: '0.48rem', color: '#3f3f46', textTransform: 'uppercase', marginTop: 3 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ padding: '14px 16px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
          <div style={{ fontSize: '0.55rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 500 }}>top emotions</div>
          {emotions.map((e, i) => (
            <Bar key={i} label={e.emotion || e.name || e.label} value={e.avg_engagement || e.avg || e.score || 0} max={maxE} color="#fbbf24" />
          ))}
          {emotions.length === 0 && <div style={{ fontSize: '0.62rem', color: '#3f3f46' }}>no data</div>}
        </div>
        <div style={{ padding: '14px 16px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
          <div style={{ fontSize: '0.55rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 500 }}>top formats</div>
          {formats.map((f, i) => (
            <Bar key={i} label={f.format || f.name || f.label} value={f.avg_engagement || f.avg || f.score || 0} max={maxF} color="#4ade80" />
          ))}
          {formats.length === 0 && <div style={{ fontSize: '0.62rem', color: '#3f3f46' }}>no data</div>}
        </div>
      </div>

      <button onClick={adjust} disabled={adjusting} style={{
        padding: '6px 16px', fontSize: '0.62rem', borderRadius: 6, border: 'none',
        background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, marginBottom: 16,
      }}>{adjusting ? '...' : 'adjust weights from data'}</button>

      {/* Record form */}
      <div style={{ padding: '14px 16px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
        <div style={{ fontSize: '0.55rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 500 }}>record performance</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <input placeholder="trend title" value={form.trend_title} onChange={e => setForm({ ...form, trend_title: e.target.value })} style={inputStyle} />
          <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} style={inputStyle}>
            {['tiktok', 'youtube', 'instagram', 'twitter'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={form.emotion} onChange={e => setForm({ ...form, emotion: e.target.value })} style={inputStyle}>
            {['funny', 'shocking', 'inspiring', 'relatable', 'nostalgic', 'controversial', 'heartwarming', 'educational'].map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <input type="number" placeholder="views" value={form.views} onChange={e => setForm({ ...form, views: e.target.value })} style={inputStyle} />
          <input type="number" placeholder="likes" value={form.likes} onChange={e => setForm({ ...form, likes: e.target.value })} style={inputStyle} />
          <input type="number" placeholder="comments" value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} style={inputStyle} />
          <input type="number" placeholder="shares" value={form.shares} onChange={e => setForm({ ...form, shares: e.target.value })} style={inputStyle} />
          <select value={form.format} onChange={e => setForm({ ...form, format: e.target.value })} style={inputStyle}>
            {['skit', 'storytime', 'reaction', 'tutorial', 'vlog', 'duet', 'trend', 'challenge', 'listicle'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <button onClick={record} disabled={recording} style={{
            padding: '6px 14px', fontSize: '0.62rem', borderRadius: 6, border: 'none',
            background: '#4ade80', color: '#09090b', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{recording ? '...' : 'record'}</button>
        </div>
      </div>
    </div>
  );
}
