import { useState, useEffect } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };

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

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: '0.6rem', color: '#52525b' }}>
        <span>{total} clusters</span>
        <span>{'\u00b7'} {hot} hot</span>
      </div>

      {clusters.map((c, i) => (
        <div key={c.cluster_id || i} style={{
          padding: '12px 8px', borderBottom: '1px solid #18181b',
          cursor: 'pointer', transition: 'background 0.12s',
        }}
          onClick={() => setExpanded(expanded === i ? null : i)}
          onMouseOver={e => e.currentTarget.style.background = '#111113'}
          onMouseOut={e => e.currentTarget.style.background = ''}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontWeight: 700, fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums', minWidth: 30,
              color: (c.cluster_score || 0) >= 70 ? '#4ade80' : (c.cluster_score || 0) >= 40 ? '#fbbf24' : '#52525b',
            }}>{Math.round(c.cluster_score || 0)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</div>
              {c.keywords && (
                <div style={{ fontSize: '0.55rem', color: '#3f3f46', marginTop: 3 }}>
                  {(Array.isArray(c.keywords) ? c.keywords : [c.keywords]).join(', ')}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
              {c.emotion && <span style={{ fontSize: '0.55rem', color: '#52525b' }}>{c.emotion}</span>}
              {c.format && <span style={{ fontSize: '0.55rem', color: '#3f3f46' }}>{c.format}</span>}
              <span style={{ fontSize: '0.58rem', color: '#3f3f46' }}>{c.item_count} items</span>
              <button onClick={e => generate(e, c.cluster_id)} disabled={generating === c.cluster_id} style={{
                padding: '4px 12px', fontSize: '0.58rem', borderRadius: 6, border: 'none',
                background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
              }}>{generating === c.cluster_id ? '...' : 'generate'}</button>
              <span style={{ fontSize: '0.58rem', color: '#3f3f46' }}>{expanded === i ? '\u25be' : '\u203a'}</span>
            </div>
          </div>

          {expanded === i && c.items && c.items.length > 0 && (
            <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #18181b', marginLeft: 42 }}>
              {c.items.slice(0, 8).map((it, j) => (
                <div key={j} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 0', borderBottom: j < Math.min(c.items.length, 8) - 1 ? '1px solid #18181b' : 'none',
                  cursor: it.url ? 'pointer' : 'default', fontSize: '0.62rem',
                }} onClick={e => { e.stopPropagation(); it.url && window.open(it.url, '_blank'); }}>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#a1a1aa' }}>{it.title}</span>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 10 }}>
                    <span style={{ color: '#3f3f46' }}>{it.source}</span>
                    {it.trend_score > 0 && <span style={{
                      fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                      color: it.trend_score >= 70 ? '#4ade80' : it.trend_score >= 40 ? '#fbbf24' : '#52525b',
                    }}>{Math.round(it.trend_score)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {clusters.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#3f3f46', fontSize: '0.7rem' }}>no clusters found. run the cluster engine first.</div>}
    </div>
  );
}
