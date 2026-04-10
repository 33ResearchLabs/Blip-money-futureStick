import { useState, useEffect } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '--'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };

const tabs = ['all', 'social feed', 'hot clusters', 'trending', 'news'];

export default function Discover() {
  const [tab, setTab] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setItems([]);

    const load = async () => {
      try {
        let combined = [];

        if (tab === 'all' || tab === 'news') {
          const d = await api.getNews();
          if (d.ok) combined.push(...(d.items || []).slice(0, tab === 'all' ? 10 : 50).map(it => ({ ...it, _type: 'news' })));
        }
        if (tab === 'all' || tab === 'trending') {
          const d = await api.getTrending();
          if (d.items) combined.push(...(d.items || []).slice(0, tab === 'all' ? 10 : 50).map(it => ({ ...it, _type: 'trending' })));
        }
        if (tab === 'all' || tab === 'hot clusters') {
          const d = await api.getClusters(0, 50);
          if (d.ok) combined.push(...(d.clusters || []).map(c => ({ ...c, _type: 'cluster', title: c.label })));
        }
        if (tab === 'social feed') {
          const d = await api.getSocialFeed('min_views=10000');
          if (d.ok) combined.push(...(d.items || []).map(it => ({ ...it, _type: 'social' })));
        }

        setItems(combined);
      } catch {}
      setLoading(false);
    };

    load();
  }, [tab]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-label">explore</div>
        <div className="page-title">Discover</div>
        <div className="page-subtitle">unified feed from all sources</div>
      </div>

      <div className="tabs" style={{ marginBottom: 10 }}>
        {tabs.map(t => <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 30 }}><span className="spinner" /></div> : (
        <div>
          {items.map((it, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: 10, cursor: it.url ? 'pointer' : 'default', alignItems: 'flex-start' }} onClick={() => it.url && window.open(it.url, '_blank')}>
              {(it.thumb || it.image) && (
                <img src={api.proxyImage(it.thumb || it.image)} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} onError={e => e.target.style.display='none'} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className="badge badge-info" style={{ flexShrink: 0 }}>{it._type}</span>
                  <span className="truncate" style={{ fontSize: 11, fontWeight: 500 }}>{it.title || it.label || 'untitled'}</span>
                  {it.has_video && <span className="badge badge-danger">video</span>}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {it.source && <span>{it.source}</span>}
                  {it.source_brand && <span>{it.source_brand}</span>}
                  {it.views > 0 && <span>{fmtN(it.views)} views</span>}
                  {it.ups > 0 && <span>{fmtN(it.ups)} ups</span>}
                  {it.comments > 0 && <span>{fmtN(it.comments)} cmt</span>}
                  {it.trend_score > 0 && <span>score: {Math.round(it.trend_score)}</span>}
                  {it.item_count > 0 && <span>{it.item_count} items</span>}
                  {it.cluster_score > 0 && <span>heat: {Math.round(it.cluster_score)}</span>}
                  {it.emotion && <span className="badge badge-warning">{it.emotion}</span>}
                  {it.published_at && <span>{ago(new Date(it.published_at).getTime())}</span>}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>no items found</div>}
        </div>
      )}
    </div>
  );
}
