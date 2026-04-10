import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const EMOTION_COLORS = {
  anger: '#ff4757', fear: '#ff9f43', money: '#00d68f',
  status: '#a855f7', curiosity: '#0abde3',
};
const STATUS_COLORS = { pending: '#ff9f43', approved: '#00d68f', published: '#0abde3', rejected: '#ff4757' };

const pill = (bg, extra = {}) => ({
  display: 'inline-block', padding: '2px 8px', borderRadius: 12,
  fontSize: 11, fontWeight: 600, background: bg, color: '#fff', ...extra,
});

function timeAgo(ts) {
  if (!ts) return '';
  const d = (Date.now() - new Date(ts).getTime()) / 1000;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export default function QueuePanel() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, published: 0, rejected: 0, urgent: 0 });
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    Promise.all([api.getQueueStats(), api.getQueue('limit=50')])
      .then(([s, q]) => {
        if (s) setStats(s);
        if (q?.items) setItems(q.items);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const act = async (fn) => { await fn; load(); };

  if (loading) return <div style={{ padding: 24, color: 'var(--text-muted)' }}>Loading queue...</div>;

  const statCards = [
    { label: 'Total', val: stats.total, bg: 'var(--bg-tertiary)' },
    { label: 'Pending', val: stats.pending, bg: '#ff9f43' },
    { label: 'Approved', val: stats.approved, bg: '#00d68f' },
    { label: 'Published', val: stats.published, bg: '#0abde3' },
    { label: 'Urgent', val: stats.urgent, bg: '#ff4757' },
  ];

  return (
    <div style={{ padding: 0 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
        Queue
      </h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '10px 16px', minWidth: 90, textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              <span style={{ ...pill(s.bg), padding: '1px 6px' }}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(item => {
          const isOpen = expanded === item.id;
          return (
            <div key={item.id}
              onClick={() => setExpanded(isOpen ? null : item.id)}
              style={{
                background: 'var(--bg-secondary)', borderRadius: 10,
                border: '1px solid var(--border)', cursor: 'pointer',
                borderColor: isOpen ? 'var(--accent)' : 'var(--border)',
              }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', flexWrap: 'wrap',
              }}>
                <span style={pill(item.priority === 'urgent' ? '#ff4757' : '#666')}>
                  {item.priority || 'normal'}
                </span>
                <span style={{
                  flex: 1, fontSize: 14, fontWeight: 600,
                  color: 'var(--text-primary)', minWidth: 120,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{item.trend_title}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {(item.platforms || []).join(', ')}
                </span>
                {item.emotion && (
                  <span style={pill(EMOTION_COLORS[item.emotion] || '#666')}>{item.emotion}</span>
                )}
                <span style={pill(STATUS_COLORS[item.status] || '#666')}>{item.status}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(item.queued_at)}</span>
                {item.reviewed && <span style={{ fontSize: 13 }} title="Reviewed">&#10003;</span>}
              </div>

              {isOpen && (
                <div style={{ padding: '0 16px 12px', borderTop: '1px solid var(--border)' }}>
                  {item.aggressive && (
                    <div style={{
                      margin: '8px 0', padding: '6px 10px', borderRadius: 6,
                      background: 'rgba(255,71,87,.12)', color: '#ff4757',
                      fontSize: 12, fontWeight: 600,
                    }}>&#9888; Aggressive content flagged</div>
                  )}
                  {item.hooks?.length > 0 && (
                    <div style={{ margin: '8px 0' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Hooks</div>
                      {item.hooks.map((h, i) => (
                        <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '2px 0' }}>
                          &bull; {h}
                        </div>
                      ))}
                    </div>
                  )}
                  {item.angles?.length > 0 && (
                    <div style={{ margin: '8px 0' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Angles</div>
                      {item.angles.map((a, i) => (
                        <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '2px 0' }}>
                          &bull; {a}
                        </div>
                      ))}
                    </div>
                  )}
                  {item.scripts && (
                    <div style={{ margin: '8px 0' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Script</div>
                      <pre style={{
                        fontSize: 12, color: 'var(--text-secondary)',
                        background: 'var(--bg-tertiary)', padding: 10, borderRadius: 6,
                        whiteSpace: 'pre-wrap', margin: 0, maxHeight: 160, overflow: 'auto',
                      }}>{typeof item.scripts === 'string' ? item.scripts : JSON.stringify(item.scripts, null, 2)}</pre>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    {item.status === 'pending' && <>
                      <button onClick={e => { e.stopPropagation(); act(api.updateQueueStatus(item.id, 'approved')); }}
                        style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#00d68f', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Approve</button>
                      <button onClick={e => { e.stopPropagation(); act(api.updateQueueStatus(item.id, 'rejected')); }}
                        style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#ff4757', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Reject</button>
                    </>}
                    {item.status === 'approved' && (
                      <button onClick={e => { e.stopPropagation(); act(api.updateQueueStatus(item.id, 'published')); }}
                        style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#0abde3', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Mark Published</button>
                    )}
                    <button onClick={e => { e.stopPropagation(); act(api.removeFromQueue(item.id)); }}
                      style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#666', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>
            Queue is empty.
          </div>
        )}
      </div>
    </div>
  );
}
