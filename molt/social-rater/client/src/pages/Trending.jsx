import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { TrendingUp, RefreshCw, Video, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const CATS = ['all','tech','crypto','business','ai','world','video','social'];
const RANGES = ['1h','6h','24h','7d'];
const SORTS = ['score','velocity','time'];

function scorePill(s) {
  const bg = s >= 70 ? '#7c3aed' : s >= 40 ? '#f97316' : '#555';
  return { background: bg, color: '#fff', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, minWidth: 36, textAlign: 'center' };
}
function priBadge(p) {
  const c = p === 'high' ? '#22c55e' : '#666';
  return { fontSize: 11, color: c, fontWeight: 600 };
}

export default function Trending() {
  const [items, setItems] = useState([]);
  const [updated, setUpdated] = useState('');
  const [cat, setCat] = useState('all');
  const [range, setRange] = useState('24h');
  const [videoOnly, setVideoOnly] = useState(false);
  const [sort, setSort] = useState('score');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (cat !== 'all') p.set('category', cat);
    p.set('range', range);
    if (videoOnly) p.set('video', '1');
    api.getTrending(p.toString())
      .then(d => { setItems(d.items || []); setUpdated(d.updated_at || ''); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [cat, range, videoOnly]);

  useEffect(() => { load(); }, [load]);

  const refresh = () => { api.refreshTrending().then(load); };

  const sorted = [...items].sort((a, b) => {
    if (sort === 'score') return (b.trend_score || 0) - (a.trend_score || 0);
    if (sort === 'velocity') return (b.velocity || 0) - (a.velocity || 0);
    return new Date(b.published_at || 0) - new Date(a.published_at || 0);
  });

  const pill = (active) => ({
    padding: '5px 14px', borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
    background: active ? 'var(--accent, #7c3aed)' : 'var(--card, #1e1e2e)',
    color: active ? '#fff' : 'var(--muted, #888)',
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <TrendingUp size={22} style={{ color: 'var(--accent, #7c3aed)' }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Trending</h2>
          <span style={{ fontSize: 13, color: 'var(--muted, #888)' }}>{sorted.length} items</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {updated && <span style={{ fontSize: 11, color: 'var(--muted, #888)' }}>Updated {new Date(updated).toLocaleTimeString()}</span>}
          <button onClick={refresh} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 8, border: 'none', background: 'var(--accent, #7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer' }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {CATS.map(c => <button key={c} style={pill(c === cat)} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        {RANGES.map(r => <button key={r} style={pill(r === range)} onClick={() => setRange(r)}>{r}</button>)}
        <label style={{ fontSize: 12, color: 'var(--muted, #888)', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
          <input type="checkbox" checked={videoOnly} onChange={e => setVideoOnly(e.target.checked)} /> Video only
        </label>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted, #888)' }}>Sort:</span>
        {SORTS.map(s => <button key={s} style={pill(s === sort)} onClick={() => setSort(s)}>{s}</button>)}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted, #888)' }}>Loading...</div>
      ) : sorted.map(item => (
        <div key={item.id || item.url} style={{ background: 'var(--card, #1e1e2e)', borderRadius: 10, padding: 12, marginBottom: 8, border: '1px solid var(--border, #2a2a3a)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
            <span style={scorePill(item.trend_score)}>{item.trend_score}</span>
            {item.thumb && <img src={item.thumb} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg, #eee)', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>{item.title}</a>
              <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--muted, #888)', marginTop: 2, flexWrap: 'wrap' }}>
                <span style={{ background: '#333', padding: '1px 6px', borderRadius: 4 }}>{item.source}</span>
                {item.emotion && <span style={{ background: '#2a2a3a', padding: '1px 6px', borderRadius: 4 }}>{item.emotion}</span>}
                {item.format && <span style={{ opacity: 0.7 }}>{item.format}</span>}
                <span>{item.ups} ups</span>
                <span>{item.comments} comments</span>
                {item.views != null && <span>{item.views} views</span>}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {item.priority && <span style={priBadge(item.priority)}>{item.priority}</span>}
              {item.has_video && <Video size={14} style={{ color: 'var(--accent, #7c3aed)' }} />}
              {expanded === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>
          {expanded === item.id && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border, #2a2a3a)', fontSize: 12, color: 'var(--muted, #888)' }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                <span>Velocity: <strong>{item.velocity}</strong></span>
                <span>Emotion score: <strong>{item.emotion_score}</strong></span>
                <span>Format score: <strong>{item.format_score}</strong></span>
                <span>Category: <strong>{item.category}</strong></span>
                <span>Published: <strong>{item.published_at && new Date(item.published_at).toLocaleString()}</strong></span>
              </div>
              {item.video_url && <a href={item.video_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent, #7c3aed)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><ExternalLink size={12} /> Watch video</a>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
