import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Archive, Plus, Copy, X, Check } from 'lucide-react';

const badge = (bg) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: bg, color: '#fff', marginRight: 6 });
const sourceColors = { studio: '#8b5cf6', scraper: '#3b82f6', manual: '#10b981', import: '#f59e0b' };
const typeColors = { image: '#e1306c', video: '#f00', text: '#3b82f6', link: '#10b981', draft: '#f59e0b' };
const inputStyle = { width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', marginBottom: 8 };

const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export default function Vault() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', source: 'manual', type: 'link', content: '' });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(null);

  const load = async () => {
    try {
      const res = await api.getVault();
      setItems(res.items || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    await api.saveToVault({ ...form, saved_at: new Date().toISOString() });
    setForm({ title: '', url: '', source: 'manual', type: 'link', content: '' });
    setShowForm(false);
    setSaving(false);
    load();
  };

  const copyItem = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}><Archive size={20} style={{ display: 'inline', marginRight: 8 }} />Vault <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>({items.length})</span></h2>
          <p className="text-sm text-muted">Saved drafts & content library</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? 'Cancel' : 'Save New'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <input value={form.title} onChange={e => f('title', e.target.value)} placeholder="Title" style={inputStyle} />
          <input value={form.url} onChange={e => f('url', e.target.value)} placeholder="URL (optional)" style={inputStyle} />
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <select value={form.source} onChange={e => f('source', e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }}>
              {Object.keys(sourceColors).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={form.type} onChange={e => f('type', e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }}>
              {Object.keys(typeColors).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <textarea value={form.content} onChange={e => f('content', e.target.value)} placeholder="Content (optional)" style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} />
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save to Vault'}</button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <p className="text-muted">No items in vault yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {items.map((item, i) => (
            <div key={item.id || i} className="card" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title || 'Untitled'}</div>
              <div>
                {item.source && <span style={badge(sourceColors[item.source] || '#666')}>{item.source}</span>}
                {item.type && <span style={badge(typeColors[item.type] || '#666')}>{item.type}</span>}
              </div>
              {item.saved_at && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(item.saved_at)}</span>}
              {item.content && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{item.content}</p>}
              {(item.image || (item.type === 'image' && item.url)) && (
                <img src={item.image || item.url} alt="" style={{ width: '100%', borderRadius: 6, maxHeight: 120, objectFit: 'cover' }} />
              )}
              <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
                <button className="btn" style={{ fontSize: 11, padding: '2px 8px' }}
                  onClick={() => copyItem(item.url || item.content || item.title, item.id || i)}>
                  {copied === (item.id || i) ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
