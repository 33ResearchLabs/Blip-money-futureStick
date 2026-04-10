import { useState, useEffect } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '--'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };

export default function Today() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardToday()
      .then(d => { if (d.ok) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" /></div>;
  if (!data) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>failed to load dashboard</div>;

  const { stats = {}, top_news = [], recent_vault = [], accounts = [] } = data;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-label">mission control</div>
        <div className="page-title">Today</div>
        <div className="page-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--accent)' }}>{fmtN(stats.news_24h)}</div>
          <div className="stat-lbl">news 24h</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--success)' }}>{fmtN(stats.vault_total)}</div>
          <div className="stat-lbl">vault items</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--warning)' }}>{fmtN(stats.accounts_tracked)}</div>
          <div className="stat-lbl">accounts tracked</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--text-primary)' }}>{top_news.length}</div>
          <div className="stat-lbl">top stories</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>top news</div>
          {top_news.slice(0, 5).map((item, i) => (
            <div key={i} className="card" style={{ cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'flex-start' }} onClick={() => item.url && window.open(item.url, '_blank')}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, minWidth: 14 }}>{i + 1}.</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="truncate" style={{ fontSize: 11, fontWeight: 500 }}>{item.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                  {item.source}{item.published_at && <span> · {ago(new Date(item.published_at).getTime())}</span>}
                </div>
              </div>
            </div>
          ))}
          {top_news.length === 0 && <div className="card" style={{ color: 'var(--text-muted)' }}>no news yet</div>}
        </div>

        <div>
          <div className="label" style={{ marginBottom: 6 }}>recent vault</div>
          {recent_vault.slice(0, 5).map((item, i) => (
            <div key={i} className="card">
              <div className="truncate" style={{ fontSize: 11 }}>{item.title || item.caption || 'untitled'}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.platform || item.source || '--'}</div>
            </div>
          ))}
          {recent_vault.length === 0 && <div className="card" style={{ color: 'var(--text-muted)' }}>vault empty</div>}

          <div className="label" style={{ marginBottom: 6, marginTop: 12 }}>tracked accounts</div>
          {accounts.slice(0, 5).map((a, i) => (
            <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11 }}>{a.handle || a.name}</span>
              <span className="badge badge-info">{a.platform}</span>
            </div>
          ))}
          {accounts.length === 0 && <div className="card" style={{ color: 'var(--text-muted)' }}>no accounts</div>}
        </div>
      </div>
    </div>
  );
}
