import { useState, useEffect } from 'react';
import { api } from '../services/api';

const EMOTION_COLORS = {
  anger: '#ff4757', fear: '#ff9f43', money: '#00d68f',
  status: '#a855f7', curiosity: '#0abde3',
};

function scoreTier(s) {
  if (s >= 70) return { label: 'hot', bg: '#a855f7' };
  if (s >= 40) return { label: 'warm', bg: '#ff9f43' };
  return { label: 'cool', bg: '#666' };
}

const pill = (bg, text, extra = {}) => ({
  display: 'inline-block', padding: '2px 8px', borderRadius: 12,
  fontSize: 11, fontWeight: 600, background: bg, color: '#fff', ...extra,
});

export default function ClustersPanel() {
  const [data, setData] = useState({ total: 0, hot: 0, clusters: [] });
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getClusters(0, 50).then(r => {
      if (r.ok) setData(r);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleGenerate = async (e, cluster_id) => {
    e.stopPropagation();
    try {
      const r = await api.generateSingle({ cluster_id });
      setToast(r.ok ? 'Generated successfully' : 'Generation failed');
    } catch { setToast('Generation failed'); }
    setTimeout(() => setToast(null), 2500);
  };

  if (loading) return <div style={{ padding: 24, color: 'var(--text-muted)' }}>Loading clusters...</div>;

  return (
    <div style={{ padding: 0 }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          background: '#00d68f', color: '#fff', padding: '10px 20px',
          borderRadius: 8, fontSize: 13, fontWeight: 600,
        }}>{toast}</div>
      )}

      <div style={{
        display: 'flex', gap: 16, alignItems: 'center',
        marginBottom: 20, padding: '0 4px',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Clusters
        </h2>
        <span style={pill('var(--bg-tertiary)', '', { color: 'var(--text-secondary)' })}>
          {data.total} total
        </span>
        <span style={pill('#a855f7', '')}>
          {data.hot} hot
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.clusters.map(c => {
          const tier = scoreTier(c.cluster_score);
          const isOpen = expanded === c.cluster_id;
          return (
            <div key={c.cluster_id}
              onClick={() => setExpanded(isOpen ? null : c.cluster_id)}
              style={{
                background: 'var(--bg-secondary)', borderRadius: 10,
                border: '1px solid var(--border)', cursor: 'pointer',
                transition: 'border-color .15s',
                borderColor: isOpen ? 'var(--accent)' : 'var(--border)',
              }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', flexWrap: 'wrap',
              }}>
                <span style={pill(tier.bg, '')}>{Math.round(c.cluster_score)}</span>
                <span style={{
                  flex: 1, fontSize: 14, fontWeight: 600,
                  color: 'var(--text-primary)', minWidth: 120,
                }}>{c.label}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {c.item_count} items &middot; {c.source_count} sources
                </span>
                {c.emotion && (
                  <span style={pill(EMOTION_COLORS[c.emotion] || '#666', '')}>
                    {c.emotion}
                  </span>
                )}
                {c.format && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.format}</span>
                )}
                <button
                  onClick={(e) => handleGenerate(e, c.cluster_id)}
                  style={{
                    padding: '4px 12px', borderRadius: 6, border: 'none',
                    background: 'var(--accent)', color: '#fff', fontSize: 12,
                    fontWeight: 600, cursor: 'pointer',
                  }}>Generate</button>
              </div>

              {isOpen && c.items && c.items.length > 0 && (
                <div style={{
                  padding: '0 16px 12px', borderTop: '1px solid var(--border)',
                  marginTop: 0,
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '8px 0 4px' }}>
                    Top items
                  </div>
                  {c.items.slice(0, 5).map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 10, alignItems: 'center',
                      padding: '6px 0', borderBottom: i < Math.min(c.items.length, 5) - 1
                        ? '1px solid var(--border)' : 'none',
                    }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 60 }}>
                        {item.source}
                      </span>
                      <span style={{
                        flex: 1, fontSize: 13, color: 'var(--text-primary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{item.title}</span>
                      <span style={pill(scoreTier(item.trend_score).bg, '')}>
                        {Math.round(item.trend_score)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {data.clusters.length === 0 && (
          <div style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>
            No clusters found. Run the cluster engine first.
          </div>
        )}
      </div>
    </div>
  );
}
