import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Video, Download, Play, ExternalLink, Search, Loader } from 'lucide-react';

const CATS = ['all', 'tech', 'crypto', 'ai', 'entertainment'];

const pill = (active) => ({
  padding: '5px 14px', borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
  background: active ? 'var(--accent, #7c3aed)' : 'var(--card, #1e1e2e)',
  color: active ? '#fff' : 'var(--muted, #888)',
});
const scorePill = (s) => ({
  background: s >= 70 ? '#7c3aed' : s >= 40 ? '#f97316' : '#555',
  color: '#fff', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
});
const card = {
  background: 'var(--card, #1e1e2e)', borderRadius: 10, overflow: 'hidden',
  border: '1px solid var(--border, #2a2a3a)',
};

export default function Videos() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState('all');
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [resolved, setResolved] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [jobs, setJobs] = useState([]);

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ category: 'video' });
    if (cat !== 'all') p.set('category', cat);
    api.getTrending(p.toString())
      .then(d => setItems((d.items || []).filter(i => i.has_video || i.format === 'video')))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [cat]);

  useEffect(() => { load(); }, [load]);

  // Poll active jobs
  useEffect(() => {
    const active = jobs.filter(j => j.status !== 'done' && j.status !== 'error');
    if (!active.length) return;
    const iv = setInterval(() => {
      active.forEach(j => {
        fetch(`/dl/remix/status?job_id=${j.id}`).then(r => r.json()).then(d => {
          setJobs(prev => prev.map(p => p.id === j.id ? { ...p, ...d } : p));
        }).catch(() => {});
      });
    }, 2000);
    return () => clearInterval(iv);
  }, [jobs]);

  const resolve = () => {
    if (!url.trim()) return;
    setResolving(true); setResolved(null);
    fetch(`/dl/resolve?u=${encodeURIComponent(url)}`).then(r => r.json())
      .then(d => setResolved(d)).catch(() => setResolved({ error: 'Failed to resolve' }))
      .finally(() => setResolving(false));
  };

  const startDownload = (videoUrl) => {
    const jid = Date.now().toString();
    setJobs(prev => [{ id: jid, url: videoUrl, status: 'starting' }, ...prev]);
    fetch(`/dl/remix/start?url=${encodeURIComponent(videoUrl)}`).then(r => r.json())
      .then(d => setJobs(prev => prev.map(j => j.id === jid ? { ...j, id: d.job_id || jid, status: d.status || 'pending' } : j)))
      .catch(() => setJobs(prev => prev.map(j => j.id === jid ? { ...j, status: 'error' } : j)));
  };

  const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : (n ?? '-');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <Video size={22} style={{ color: 'var(--accent, #7c3aed)' }} />
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Videos</h2>
        <span style={{ fontSize: 13, color: 'var(--muted, #888)' }}>Video discovery, download &amp; remix</span>
      </div>

      {/* URL resolver */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste video URL..."
          onKeyDown={e => e.key === 'Enter' && resolve()}
          style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border, #2a2a3a)', background: 'var(--card, #1e1e2e)', color: 'var(--fg, #eee)', fontSize: 13 }} />
        <button onClick={resolve} disabled={resolving} style={{ ...pill(true), display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px' }}>
          <Search size={14} /> {resolving ? 'Resolving...' : 'Resolve'}
        </button>
      </div>
      {resolved && (
        <div style={{ ...card, padding: 12, marginBottom: 12 }}>
          {resolved.error ? <span style={{ color: '#f87171' }}>{resolved.error}</span> : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {resolved.thumbnail && <img src={resolved.thumbnail} alt="" style={{ width: 80, height: 50, borderRadius: 6, objectFit: 'cover' }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg, #eee)' }}>{resolved.title || 'Video'}</div>
                <div style={{ fontSize: 11, color: 'var(--muted, #888)' }}>{resolved.duration}s &middot; {resolved.format || resolved.ext}</div>
              </div>
              <button onClick={() => startDownload(url)} style={{ ...pill(true), display: 'flex', alignItems: 'center', gap: 4 }}>
                <Download size={14} /> Download
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active downloads */}
      {jobs.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted, #888)', marginBottom: 6 }}>Downloads</div>
          {jobs.map(j => (
            <div key={j.id} style={{ ...card, padding: '8px 12px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <Loader size={13} style={{ color: j.status === 'done' ? '#22c55e' : j.status === 'error' ? '#f87171' : 'var(--accent, #7c3aed)', animation: j.status !== 'done' && j.status !== 'error' ? 'spin 1s linear infinite' : 'none' }} />
              <span style={{ flex: 1, color: 'var(--fg, #eee)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.url}</span>
              <span style={{ color: j.status === 'done' ? '#22c55e' : j.status === 'error' ? '#f87171' : 'var(--muted, #888)', fontWeight: 600 }}>{j.status}</span>
              {j.download_url && <a href={j.download_url} style={{ color: 'var(--accent, #7c3aed)' }}><Download size={13} /></a>}
            </div>
          ))}
        </div>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {CATS.map(c => <button key={c} style={pill(c === cat)} onClick={() => setCat(c)}>{c}</button>)}
      </div>

      {/* Video grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted, #888)' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {items.map(item => (
            <div key={item.id || item.url} style={card}>
              {item.thumb && (
                <a href={item.video_url || item.url} target="_blank" rel="noreferrer" style={{ display: 'block', position: 'relative' }}>
                  <img src={item.thumb} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                  <Play size={32} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#fff', opacity: 0.8, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.5))' }} />
                </a>
              )}
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg, #eee)', marginBottom: 6, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.title}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', fontSize: 11, color: 'var(--muted, #888)', marginBottom: 8 }}>
                  <span style={{ background: '#333', padding: '1px 6px', borderRadius: 4 }}>{item.source}</span>
                  {item.trend_score != null && <span style={scorePill(item.trend_score)}>{item.trend_score}</span>}
                  {item.emotion && <span style={{ background: '#2a2a3a', padding: '1px 6px', borderRadius: 4 }}>{item.emotion}</span>}
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--muted, #888)', marginBottom: 8 }}>
                  {item.views != null && <span>{fmt(item.views)} views</span>}
                  {item.ups != null && <span>{fmt(item.ups)} likes</span>}
                  {item.comments != null && <span>{fmt(item.comments)} comments</span>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => startDownload(item.video_url || item.url)} style={{ ...pill(true), display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
                    <Download size={13} /> Download
                  </button>
                  <a href={item.url} target="_blank" rel="noreferrer" style={{ ...pill(false), display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !items.length && <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted, #888)' }}>No videos found</div>}
    </div>
  );
}
