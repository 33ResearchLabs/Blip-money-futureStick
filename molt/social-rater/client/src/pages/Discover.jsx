import { useState, useEffect } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '\u2014'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };

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
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px', borderBottom: '1px solid #18181b', flexShrink: 0 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.01em' }}>Discover</span>
        <span style={{ fontSize: '0.6rem', color: '#52525b' }}>unified feed</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '4px 10px', fontSize: '0.6rem', borderRadius: 4,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: tab === t ? '#27272a' : 'transparent',
              color: tab === t ? '#fafafa' : '#71717a',
              fontWeight: tab === t ? 500 : 400,
              transition: 'all 0.15s',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {loading && <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div>}

        {!loading && items.map((it, i) => {
          const score = it.trend_score || it.cluster_score || it.score || 0;
          return (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '14px 8px',
              borderBottom: '1px solid #18181b',
              cursor: it.url ? 'pointer' : 'default', transition: 'background 0.12s',
            }}
              onClick={() => it.url && window.open(it.url, '_blank')}
              onMouseOver={e => e.currentTarget.style.background = '#111113'}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >
              {/* Thumbnail */}
              {(it.thumb || it.image) ? (
                <img src={api.proxyImage(it.thumb || it.image)} alt="" style={{
                  width: 64, height: 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0,
                }} onError={e => e.target.style.display = 'none'} />
              ) : (
                <div style={{ width: 64, height: 44, flexShrink: 0 }} />
              )}

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.78rem', fontWeight: 500, color: '#fafafa',
                  lineHeight: 1.35, marginBottom: 4,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{it.title || it.label || 'untitled'}</div>
                <div style={{ display: 'flex', gap: 6, fontSize: '0.58rem', color: '#3f3f46', alignItems: 'center' }}>
                  <span style={{ color: '#52525b', fontWeight: 500 }}>{it._type}</span>
                  {it.source && <span>{'\u00b7'} {it.source}</span>}
                  {it.source_brand && <span>{'\u00b7'} {it.source_brand}</span>}
                  {it.views > 0 && <span>{'\u00b7'} {fmtN(it.views)} views</span>}
                  {it.ups > 0 && <span>{'\u00b7'} {fmtN(it.ups)} ups</span>}
                  {it.comments > 0 && <span>{'\u00b7'} {fmtN(it.comments)} cmt</span>}
                  {it.item_count > 0 && <span>{'\u00b7'} {it.item_count} items</span>}
                  {it.emotion && <span>{'\u00b7'} {it.emotion}</span>}
                  {it.has_video && <span>{'\u00b7'} video</span>}
                  {it.published_at && <span>{'\u00b7'} {ago(new Date(it.published_at).getTime())}</span>}
                </div>
              </div>

              {/* Score */}
              {score > 0 && (
                <div style={{ width: 36, flexShrink: 0, textAlign: 'center', paddingTop: 2 }}>
                  <span style={{
                    fontSize: '0.9rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                    color: score >= 80 ? '#4ade80' : score >= 60 ? '#fbbf24' : score >= 40 ? '#fb923c' : '#52525b',
                  }}>{Math.round(score)}</span>
                </div>
              )}
            </div>
          );
        })}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#3f3f46', fontSize: '0.75rem' }}>no items found</div>
        )}
      </div>
    </div>
  );
}
