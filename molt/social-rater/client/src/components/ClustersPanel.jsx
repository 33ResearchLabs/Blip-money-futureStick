import { useState, useEffect } from 'react';
import { api } from '../services/api';

function scoreColor(s) {
  if (s >= 70) return 'var(--danger)';
  if (s >= 40) return 'var(--warning)';
  return 'var(--accent)';
}

export default function ClustersPanel() {
  const [clusters, setClusters] = useState([]);
  const [total, setTotal] = useState(0);
  const [hot, setHot] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    api.getClusters(0, 100)
      .then(d => {
        if (d.ok) { setClusters(d.clusters || []); setTotal(d.total || 0); setHot(d.hot || 0); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const generate = async (e, clusterId) => {
    e.stopPropagation();
    setGenerating(clusterId);
    try { await api.generateSingle({ cluster_id: clusterId }); } catch {}
    setGenerating(null);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 20 }}><span className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
        <span className="badge badge-info">{total} clusters</span>
        <span className="badge badge-danger">{hot} hot</span>
      </div>

      {clusters.map((c, i) => (
        <div key={c.cluster_id || i} className="card" style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === i ? null : i)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, minWidth: 0 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: scoreColor(c.cluster_score), minWidth: 28 }}>{Math.round(c.cluster_score || 0)}</span>
              <span className="truncate" style={{ fontSize: 11, fontWeight: 500 }}>{c.label}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              {c.emotion && <span className="badge badge-warning">{c.emotion}</span>}
              {c.format && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{c.format}</span>}
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.item_count} items</span>
              <button className="btn btn-primary btn-sm" onClick={e => generate(e, c.cluster_id)} disabled={generating === c.cluster_id}>
                {generating === c.cluster_id ? <span className="spinner" /> : 'generate'}
              </button>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{expanded === i ? 'v' : '>'}</span>
            </div>
          </div>
          {c.keywords && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
              {(Array.isArray(c.keywords) ? c.keywords : [c.keywords]).join(', ')}
            </div>
          )}
          {expanded === i && c.items && c.items.length > 0 && (
            <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid var(--border)' }}>
              {c.items.slice(0, 8).map((it, j) => (
                <div key={j} style={{ fontSize: 10, padding: '3px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: j < c.items.length - 1 ? '1px solid var(--border)' : 'none', cursor: it.url ? 'pointer' : 'default' }} onClick={e => { e.stopPropagation(); it.url && window.open(it.url, '_blank'); }}>
                  <span className="truncate" style={{ flex: 1, color: 'var(--text-primary)' }}>{it.title}</span>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{it.source}</span>
                    {it.trend_score > 0 && <span style={{ color: scoreColor(it.trend_score), fontWeight: 600 }}>{Math.round(it.trend_score)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {clusters.length === 0 && <div style={{ color: 'var(--text-muted)', padding: 12, textAlign: 'center' }}>no clusters found. run the cluster engine first.</div>}
    </div>
  );
}
