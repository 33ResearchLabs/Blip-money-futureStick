import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Radar, Bookmark, ExternalLink, Loader2 } from 'lucide-react';

const NICHES = ['tech', 'crypto', 'ai', 'business', 'gaming', 'science', 'politics', 'entertainment', 'sports'];

export default function Discover() {
  const [niche, setNiche] = useState('tech');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(`/api/radar?niche=${niche}`)
      .then(r => r.json())
      .then(d => setItems(d.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [niche]);

  const save = async (item) => {
    await api.saveToVault({ title: item.title, url: item.url, source: item.source });
    setSaved(p => ({ ...p, [item.url]: true }));
  };

  const pill = (n) => ({
    padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    background: n === niche ? 'var(--accent, #7c3aed)' : 'var(--card, #1e1e2e)',
    color: n === niche ? '#fff' : 'var(--muted, #888)',
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <Radar size={22} style={{ color: 'var(--accent, #7c3aed)' }} />
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Discover</h2>
      </div>
      <p style={{ color: 'var(--muted, #888)', fontSize: 14, margin: '0 0 20px' }}>
        Trending radar across Reddit niches
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {NICHES.map(n => (
          <button key={n} style={pill(n)} onClick={() => setNiche(n)}>
            {n}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted, #888)' }}>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted, #888)' }}>
          No items found for <strong>{niche}</strong>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
          {items.map((item, i) => (
            <div key={i} style={{
              background: 'var(--card, #1e1e2e)', borderRadius: 10, padding: 16,
              border: '1px solid var(--border, #2a2a3a)',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 8px', lineHeight: 1.4 }}>
                {item.title}
              </h3>
              <div style={{ display: 'flex', gap: 14, fontSize: 13, color: 'var(--muted, #888)', marginBottom: 10 }}>
                {item.ups != null && <span>{item.ups} ups</span>}
                {item.comments != null && <span>{item.comments} comments</span>}
                {item.source && <span style={{ opacity: 0.7 }}>{item.source}</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--accent, #7c3aed)' }}>
                    <ExternalLink size={13} /> Open
                  </a>
                )}
                <button onClick={() => save(item)} disabled={saved[item.url]}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, border: 'none',
                    background: 'none', cursor: 'pointer',
                    color: saved[item.url] ? 'var(--success, #22c55e)' : 'var(--muted, #888)',
                  }}>
                  <Bookmark size={13} /> {saved[item.url] ? 'Saved' : 'Save to vault'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
