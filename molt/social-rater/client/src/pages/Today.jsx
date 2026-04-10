import { useState, useEffect } from 'react';
import { api } from '../services/api';

const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };
const ago = ms => { if(!ms) return '\u2014'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };

export default function Today() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardToday()
      .then(d => { if (d.ok) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}><span className="spinner" /></div>;
  if (!data) return <div style={{ padding: 60, color: '#3f3f46', fontSize: '0.75rem' }}>failed to load dashboard</div>;

  const { stats = {}, top_news = [], recent_vault = [], accounts = [] } = data;

  return (
    <div className="fade-in" style={{ padding: '0 4px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '10px 0', borderBottom: '1px solid #18181b', marginBottom: 16 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.01em' }}>Today</span>
        <span style={{ fontSize: '0.6rem', color: '#52525b' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[
          { val: fmtN(stats.news_24h), lbl: 'news 24h', color: '#6366f1' },
          { val: fmtN(stats.vault_total), lbl: 'vault items', color: '#4ade80' },
          { val: fmtN(stats.accounts_tracked), lbl: 'accounts', color: '#fbbf24' },
          { val: top_news.length, lbl: 'top stories', color: '#fafafa' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: '14px 16px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
            <div style={{ fontSize: '0.58rem', color: '#52525b', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Top news */}
        <div>
          <div style={{ fontSize: '0.6rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 8 }}>Top news</div>
          {top_news.slice(0, 8).map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, padding: '12px 8px', borderBottom: '1px solid #18181b',
              cursor: 'pointer', transition: 'background 0.12s',
            }}
              onClick={() => item.url && window.open(item.url, '_blank')}
              onMouseOver={e => e.currentTarget.style.background = '#111113'}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >
              <span style={{ color: '#3f3f46', fontSize: '0.65rem', fontWeight: 500, minWidth: 18, fontVariantNumeric: 'tabular-nums' }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.35 }}>{item.title}</div>
                <div style={{ fontSize: '0.58rem', color: '#3f3f46', marginTop: 4, display: 'flex', gap: 6 }}>
                  <span style={{ color: '#52525b' }}>{item.source}</span>
                  {item.published_at && <span>{'\u00b7'} {ago(new Date(item.published_at).getTime())}</span>}
                  {item.score > 0 && <span>{'\u00b7'} score {item.score}</span>}
                </div>
              </div>
              {item.score > 0 && (
                <span style={{
                  fontSize: '0.82rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', flexShrink: 0,
                  color: item.score >= 80 ? '#4ade80' : item.score >= 60 ? '#fbbf24' : item.score >= 40 ? '#fb923c' : '#52525b',
                }}>{item.score}</span>
              )}
            </div>
          ))}
          {top_news.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: '#3f3f46', fontSize: '0.7rem' }}>no news yet</div>}
        </div>

        {/* Right column */}
        <div>
          {/* Recent vault */}
          <div style={{ fontSize: '0.6rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 8 }}>Recent vault</div>
          {recent_vault.slice(0, 5).map((item, i) => (
            <div key={i} style={{ padding: '10px 8px', borderBottom: '1px solid #18181b' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 500, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || item.caption || 'untitled'}</div>
              <div style={{ fontSize: '0.58rem', color: '#3f3f46', marginTop: 3 }}>{item.platform || item.source || '\u2014'}</div>
            </div>
          ))}
          {recent_vault.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#3f3f46', fontSize: '0.65rem' }}>vault empty</div>}

          {/* Tracked accounts */}
          <div style={{ fontSize: '0.6rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 8, marginTop: 20 }}>Tracked accounts</div>
          {accounts.slice(0, 5).map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 8px', borderBottom: '1px solid #18181b' }}>
              <span style={{ fontSize: '0.72rem', color: '#fafafa' }}>{a.handle || a.name}</span>
              <span style={{ fontSize: '0.58rem', color: '#52525b' }}>{a.platform}</span>
            </div>
          ))}
          {accounts.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#3f3f46', fontSize: '0.65rem' }}>no accounts</div>}
        </div>
      </div>
    </div>
  );
}
