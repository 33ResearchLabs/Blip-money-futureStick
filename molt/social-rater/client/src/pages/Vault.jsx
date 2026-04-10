import { useState, useEffect } from 'react';
import { api } from '../services/api';

const ago = ms => { if(!ms) return '--'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };

export default function Vault() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', source: 'manual', type: 'link', content: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getVault()
      .then(d => { if (d.ok !== false) setItems(d.items || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    await api.saveToVault({ ...form, saved_at: new Date().toISOString() });
    setForm({ title: '', url: '', source: 'manual', type: 'link', content: '' });
    setShowForm(false);
    setSaving(false);
    load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-label">library</div>
          <div className="page-title">Vault</div>
          <div className="page-subtitle">{items.length} saved items</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'cancel' : '+ save new'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 12, marginBottom: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
            <div>
              <div className="label">title</div>
              <input value={form.title} onChange={e => f('title', e.target.value)} placeholder="title" style={{ width: '100%' }} />
            </div>
            <div>
              <div className="label">url</div>
              <input value={form.url} onChange={e => f('url', e.target.value)} placeholder="https://..." style={{ width: '100%' }} />
            </div>
            <div>
              <div className="label">source</div>
              <select value={form.source} onChange={e => f('source', e.target.value)} style={{ width: '100%' }}>
                {['manual', 'studio', 'scraper', 'import'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div className="label">type</div>
              <select value={form.type} onChange={e => f('type', e.target.value)} style={{ width: '100%' }}>
                {['link', 'image', 'video', 'text', 'draft'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="label">content</div>
          <textarea value={form.content} onChange={e => f('content', e.target.value)} rows={3} placeholder="content or caption..." style={{ width: '100%', marginBottom: 6, resize: 'vertical' }} />
          <button className="btn btn-success btn-sm" onClick={save} disabled={saving}>
            {saving ? <span className="spinner" /> : 'save to vault'}
          </button>
        </div>
      )}

      {loading ? <div style={{ textAlign: 'center', padding: 30 }}><span className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {items.map((it, i) => (
            <div key={it.id || i} className="card" style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }} onClick={() => setExpanded(expanded === i ? null : i)}>
              {(it.image || (it.type === 'image' && it.url)) && (
                <img src={api.proxyImage(it.image || it.url)} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
              )}
              <div style={{ padding: '6px 8px' }}>
                <div className="truncate" style={{ fontSize: 11, fontWeight: 500 }}>{it.title || 'untitled'}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', gap: 6, marginTop: 2 }}>
                  {it.source && <span className="badge badge-info">{it.source}</span>}
                  {it.type && <span className="badge badge-warning">{it.type}</span>}
                  {it.platform && <span className="badge badge-info">{it.platform}</span>}
                  {it.saved_at && <span>{ago(new Date(it.saved_at).getTime())}</span>}
                </div>
                {it.content && <div className="truncate" style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 3 }}>{it.content || it.caption}</div>}

                {expanded === i && (
                  <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid var(--border)', fontSize: 10 }}>
                    {(it.content || it.caption) && <div style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', marginBottom: 4 }}>{it.content || it.caption}</div>}
                    {it.url && <div style={{ marginBottom: 4 }}><a href={it.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>open link</a></div>}
                    {it.saved_at && <div style={{ color: 'var(--text-muted)' }}>saved: {new Date(it.saved_at).toLocaleString()}</div>}
                  </div>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>vault is empty</div>}
        </div>
      )}
    </div>
  );
}
