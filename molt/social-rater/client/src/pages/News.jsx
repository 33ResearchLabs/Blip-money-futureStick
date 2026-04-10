import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RefreshCw, ExternalLink, Zap, Search } from 'lucide-react';

const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return `${Math.floor(s / 2592000)}mo ago`;
};

const categories = ['all', 'tech', 'crypto', 'business', 'ai', 'world'];

const badgeStyle = (bg) => ({
  display: 'inline-block', padding: '2px 8px', borderRadius: 12, fontSize: 11,
  fontWeight: 600, background: bg, color: '#fff', marginRight: 6,
});

const typeColors = { tech: '#3b82f6', crypto: '#f59e0b', business: '#10b981', ai: '#8b5cf6', world: '#ef4444' };

export default function News() {
  const [items, setItems] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [exploding, setExploding] = useState(null);
  const [explodeResult, setExplodeResult] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/dl/news/list');
      setItems(data.items || []);
      setUpdatedAt(data.updated_at);
    } catch (e) { console.error('Failed to fetch news', e); }
    setLoading(false);
  };

  useEffect(() => { fetchNews(); }, []);

  const refreshNews = async () => {
    setRefreshing(true);
    try {
      await api.post('/dl/news/refresh');
      await fetchNews();
    } catch (e) { console.error('Refresh failed', e); }
    setRefreshing(false);
  };

  const explodeArticle = async (item) => {
    setExploding(item.id);
    setExplodeResult(null);
    try {
      const { data } = await api.post('/dl/news/explode', {
        title: item.title, url: item.url, source: item.source, description: item.description,
      });
      setExplodeResult({ id: item.id, data });
    } catch (e) { console.error('Explode failed', e); }
    setExploding(null);
  };

  const filtered = items
    .filter(i => filter === 'all' || i.type === filter)
    .filter(i => !search || i.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>News</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>
            {filtered.length} articles{updatedAt && <> &middot; Updated {timeAgo(updatedAt)}</>}
          </p>
        </div>
        <button onClick={refreshNews} disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
            background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: filter === c ? 'var(--accent)' : 'var(--card-bg, #1a1a2e)',
              color: filter === c ? '#fff' : 'var(--text-muted)', textTransform: 'capitalize' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..."
          style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 8, border: '1px solid var(--border, #333)',
            background: 'var(--card-bg, #1a1a2e)', color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* Grid */}
      {loading && !items.length ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: 'var(--card-bg, #1a1a2e)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border, #333)' }}>
              {item.image && (
                <img src={item.image} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
              )}
              <div style={{ padding: 16 }}>
                <div style={{ marginBottom: 8 }}>
                  {item.source && <span style={badgeStyle('#555')}>{item.source}</span>}
                  {item.type && <span style={badgeStyle(typeColors[item.type] || '#666')}>{item.type}</span>}
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(item.published_at)}</span>
                </div>
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', textDecoration: 'none', display: 'block', marginBottom: 6 }}>
                  {item.title}
                </a>
                {item.description && (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 12px', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => explodeArticle(item)} disabled={exploding === item.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 6,
                      background: '#8b5cf6', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                    <Zap size={12} /> {exploding === item.id ? 'Generating...' : 'Explode'}
                  </button>
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 6,
                      background: 'var(--border, #333)', color: 'var(--text)', border: 'none', cursor: 'pointer', fontSize: 12,
                      fontWeight: 600, textDecoration: 'none' }}>
                    <ExternalLink size={12} /> Open
                  </a>
                </div>
                {/* Explode result */}
                {explodeResult?.id === item.id && (
                  <div style={{ marginTop: 12, padding: 12, background: 'var(--bg, #0d0d1a)', borderRadius: 8, fontSize: 13 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: '#8b5cf6' }}>Generated Variations</div>
                    {typeof explodeResult.data === 'object' && !Array.isArray(explodeResult.data)
                      ? Object.entries(explodeResult.data).map(([platform, content]) => (
                          <div key={platform} style={{ marginBottom: 10 }}>
                            <div style={{ fontWeight: 600, textTransform: 'capitalize', marginBottom: 4, color: 'var(--text)' }}>{platform}</div>
                            <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)', margin: 0, fontFamily: 'inherit' }}>
                              {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                            </pre>
                          </div>
                        ))
                      : <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)', margin: 0 }}>
                          {JSON.stringify(explodeResult.data, null, 2)}
                        </pre>
                    }
                    <button onClick={() => setExplodeResult(null)}
                      style={{ marginTop: 8, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border, #333)',
                        background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}>
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !filtered.length && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No articles found.</p>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
