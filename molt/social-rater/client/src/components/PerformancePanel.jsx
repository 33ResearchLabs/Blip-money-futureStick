import { useState, useEffect } from 'react';
import { api } from '../services/api';

const EMOTIONS = ['funny','shocking','inspiring','relatable','nostalgic','controversial','heartwarming','educational'];
const FORMATS = ['skit','storytime','reaction','tutorial','vlog','duet','trend','challenge','listicle'];
const PLATFORMS = ['tiktok','youtube','instagram','twitter'];

export default function PerformancePanel() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ platform:'tiktok', views:'', likes:'', comments:'', shares:'', emotion:'funny', format:'skit' });
  const [busy, setBusy] = useState(false);

  const load = () => api.getPerformanceSummary().then(setData);
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setBusy(true);
    await api.recordPerformance({ ...form, views:+form.views, likes:+form.likes, comments:+form.comments, shares:+form.shares });
    setForm(f => ({ ...f, views:'', likes:'', comments:'', shares:'' }));
    await load();
    setBusy(false);
  };

  const adjust = async () => { setBusy(true); await api.adjustWeights(); await load(); setBusy(false); };

  if (!data) return <div className="fade-in" style={{ padding: 24, color: 'var(--text-muted)' }}>Loading...</div>;

  const bar = (val, max) => ({ width: `${Math.min((val / max) * 100, 100)}%`, height: 8, borderRadius: 4, background: 'var(--accent)', transition: 'width .3s' });

  return (
    <div className="fade-in" style={{ padding: 24, maxWidth: 860 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Tracked entries', val: data.entries, color: 'var(--info)' },
          { label: 'Avg engagement', val: `${(data.avg_engagement ?? 0).toFixed(1)}%`, color: 'var(--success)' },
          { label: 'Weight adjustments', val: data.adjustment_count ?? 0, color: '#a78bfa' },
        ].map(c => (
          <div key={c.label} style={{ flex: 1, minWidth: 180, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: c.color, marginTop: 4 }}>{c.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {[{ title: 'Best Emotions', items: data.top_emotions }, { title: 'Best Formats', items: data.top_formats }].map(sec => (
          <div key={sec.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, color: 'var(--text-primary)' }}>{sec.title}</h3>
            {(sec.items || []).map(r => (
              <div key={r.name || r.emotion || r.format} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ minWidth: 90, fontSize: 13, color: 'var(--text-secondary)', background: 'var(--border)', borderRadius: 12, padding: '2px 10px', textAlign: 'center' }}>
                  {r.name || r.emotion || r.format}
                </span>
                <div style={{ flex: 1, background: 'var(--border)', borderRadius: 4, height: 8 }}>
                  <div style={bar(r.avg, 10)} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{(r.avg ?? 0).toFixed(1)}% · {r.count}</span>
              </div>
            ))}
            {!(sec.items || []).length && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No data yet</div>}
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 18, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 15, color: 'var(--text-primary)' }}>Record Performance</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[
            { key: 'platform', type: 'select', opts: PLATFORMS },
            { key: 'views', type: 'number', ph: 'Views' },
            { key: 'likes', type: 'number', ph: 'Likes' },
            { key: 'comments', type: 'number', ph: 'Comments' },
            { key: 'shares', type: 'number', ph: 'Shares' },
            { key: 'emotion', type: 'select', opts: EMOTIONS },
            { key: 'format', type: 'select', opts: FORMATS },
          ].map(f => f.type === 'select' ? (
            <select key={f.key} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13 }}>
              {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input key={f.key} type="number" placeholder={f.ph} value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ width: 80, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13 }} />
          ))}
          <button onClick={submit} disabled={busy} className="btn-primary" style={{ padding: '6px 16px', borderRadius: 6, fontSize: 13 }}>Submit</button>
        </div>
      </div>

      <button onClick={adjust} disabled={busy} className="btn-secondary"
        style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--accent)', cursor: 'pointer' }}>
        Adjust weights from data
      </button>
    </div>
  );
}
