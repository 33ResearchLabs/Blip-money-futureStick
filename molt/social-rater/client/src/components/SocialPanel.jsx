import { useState, useEffect } from 'react';
import { api } from '../services/api';

const badge = (platform) => {
  const colors = { tiktok: '#ff0050', youtube: '#ff0000', instagram: '#e1306c', twitter: '#1da1f2', reddit: '#ff4500' };
  return { display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, color: '#fff', background: colors[platform?.toLowerCase()] || 'var(--text-muted)' };
};

const fmt = (n) => { if (!n) return '0'; if (n >= 1e6) return (n/1e6).toFixed(1)+'M'; if (n >= 1e3) return (n/1e3).toFixed(1)+'K'; return String(n); };

export default function SocialPanel() {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => api.getSocialFeed('limit=100').then(setData);
  useEffect(() => { load(); }, []);

  const refresh = async () => { setBusy(true); await api.refreshSocial(); await load(); setBusy(false); };

  if (!data) return <div className="fade-in" style={{ padding: 24, color: 'var(--text-muted)' }}>Loading...</div>;

  const grouped = {};
  (data.items || []).forEach(item => {
    const key = item.source_brand || item.source_handle || 'Other';
    (grouped[key] = grouped[key] || []).push(item);
  });

  return (
    <div className="fade-in" style={{ padding: 24, maxWidth: 960 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{data.total ?? 0} posts</div>
        <button onClick={refresh} disabled={busy} className="btn-primary"
          style={{ padding: '6px 16px', borderRadius: 6, fontSize: 13 }}>
          {busy ? 'Refreshing...' : 'Refresh all accounts'}
        </button>
      </div>

      {Object.entries(grouped).map(([brand, items]) => (
        <div key={brand} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 10px', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>{brand}</h3>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              {item.thumb && (
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={item.thumb} alt="" style={{ width: 66, height: 44, objectFit: 'cover', borderRadius: 6, background: 'var(--border)' }} />
                  {item.has_video && (
                    <a href={item.video_url || item.url} target="_blank" rel="noreferrer"
                      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.4)', borderRadius: 6, color: '#fff', fontSize: 18 }}>
                      ▶
                    </a>
                  )}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <a href={item.url} target="_blank" rel="noreferrer"
                  style={{ fontSize: 13, color: 'var(--text-primary)', textDecoration: 'none', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.title || '(no title)'}
                </a>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span>{item.source_handle}</span>
                  <span style={badge(item.source_platform)}>{item.source_platform}</span>
                  {item.account_followers > 0 && <span>{fmt(item.account_followers)} followers</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>
                {item.views > 0 && <span title="Views">👁 {fmt(item.views)}</span>}
                <span title="Likes">♥ {fmt(item.ups)}</span>
                <span title="Comments">💬 {fmt(item.comments)}</span>
              </div>
            </div>
          ))}
        </div>
      ))}

      {!(data.items || []).length && <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No posts yet. Add accounts and refresh.</div>}
    </div>
  );
}
