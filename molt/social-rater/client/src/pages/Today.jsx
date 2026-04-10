import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RefreshCw, Newspaper, Archive, Users, Zap, ExternalLink } from 'lucide-react';

const fmt = n => n == null ? '—' : Number(n).toLocaleString();
const timeAgo = ts => {
  if (!ts) return '';
  const mins = Math.floor((Date.now() - new Date(ts)) / 60000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card" style={{ flex: 1, minWidth: 150, borderTop: `3px solid var(--${color}, ${color})` }}>
    <div className="flex items-center gap-2 mb-2">
      <Icon size={16} style={{ color: `var(--${color}, ${color})` }} />
      <span className="text-sm text-muted">{label}</span>
    </div>
    <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
  </div>
);

export default function Today() {
  const [data, setData] = useState(null);
  const [engine, setEngine] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [d, e] = await Promise.all([
        api.get('/dl/dashboard/today').then(r => r.data),
        api.get('/api/engine/dashboard').then(r => r.data).catch(() => null),
      ]);
      setData(d);
      setEngine(e);
    } catch (err) { console.error('Dashboard load failed', err); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const clusters = (engine?.hot_clusters || engine?.clusters || []).slice(0, 5);

  if (loading && !data) return <div className="text-muted" style={{ padding: 40, textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Today</h2>
          <p className="text-sm text-muted">{today}</p>
        </div>
        <button className="btn btn-sm" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} style={{ marginRight: 6 }} />
          Refresh
        </button>
      </div>

      <div className="flex gap-3 mb-4" style={{ flexWrap: 'wrap' }}>
        <StatCard icon={Newspaper} label="News 24h" value={fmt(data?.news_24h)} color="#3b82f6" />
        <StatCard icon={Archive} label="Vault Total" value={fmt(data?.vault_total)} color="#8b5cf6" />
        <StatCard icon={Archive} label="Vault Today" value={fmt(data?.vault_today)} color="#22c55e" />
        <StatCard icon={Users} label="Accounts" value={fmt(data?.accounts_count)} color="#f59e0b" />
        <StatCard icon={Zap} label="Engine" value={engine ? `${fmt(engine.worker_runs ?? engine.runs)} runs` : '—'} color="#ef4444" />
      </div>

      <div className="flex gap-3 mb-4" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 2, minWidth: 300 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Top Stories</h3>
          {(data?.top_stories || []).length === 0 && <p className="text-sm text-muted">No stories yet</p>}
          {(data?.top_stories || []).map((s, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border, #222)' }}>
              <div className="flex items-center justify-between">
                <span style={{ fontWeight: 500, fontSize: 14 }}>{s.title || s.headline || 'Untitled'}</span>
                {s.url && <a href={s.url} target="_blank" rel="noreferrer"><ExternalLink size={13} className="text-muted" /></a>}
              </div>
              <div className="text-sm text-muted" style={{ marginTop: 2 }}>
                {s.source && <span>{s.source}</span>}
                {s.published_at && <span> · {timeAgo(s.published_at)}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ flex: 1, minWidth: 260 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Hot Clusters</h3>
          {clusters.length === 0 && <p className="text-sm text-muted">No clusters</p>}
          {clusters.map((c, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border, #222)' }}>
              <div className="flex items-center justify-between">
                <span style={{ fontWeight: 500, fontSize: 14 }}>{c.label || c.name || `Cluster ${i + 1}`}</span>
                <span className="text-sm" style={{ color: '#f59e0b', fontWeight: 600 }}>{c.score ?? '—'}</span>
              </div>
              {c.emotion && <span className="text-sm text-muted">{c.emotion}</span>}
            </div>
          ))}
        </div>
      </div>

      {(data?.top_vault || []).length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Recent Vault</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {data.top_vault.map((v, i) => (
              <div key={i} className="card" style={{ padding: 12 }}>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{v.title || v.headline || 'Untitled'}</div>
                <div className="text-sm text-muted">{v.source}{v.saved_at && ` · ${timeAgo(v.saved_at)}`}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
