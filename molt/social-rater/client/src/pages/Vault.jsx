import { useState, useEffect } from 'react';
import { api } from '../services/api';

const ago = ms => { if(!ms) return '\u2014'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };

const inputStyle = {
  width: '100%', padding: '6px 10px', fontSize: '0.65rem', background: '#18181b',
  border: '1px solid #27272a', borderRadius: 6, color: '#a1a1aa', fontFamily: 'inherit',
};

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
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px', borderBottom: '1px solid #18181b', flexShrink: 0 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.01em' }}>Vault</span>
        <span style={{ fontSize: '0.6rem', color: '#52525b' }}>{items.length} saved items</span>
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '5px 14px', fontSize: '0.6rem', borderRadius: 6, border: 'none',
          background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
        }}>{showForm ? 'cancel' : '+ save new'}</button>
      </div>

      {/* Save form */}
      {showForm && (
        <div style={{ padding: '14px', background: '#111113', borderBottom: '1px solid #18181b', flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>title</div>
              <input value={form.title} onChange={e => f('title', e.target.value)} placeholder="title" style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>url</div>
              <input value={form.url} onChange={e => f('url', e.target.value)} placeholder="https://..." style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>source</div>
              <select value={form.source} onChange={e => f('source', e.target.value)} style={inputStyle}>
                {['manual', 'studio', 'scraper', 'import'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>type</div>
              <select value={form.type} onChange={e => f('type', e.target.value)} style={inputStyle}>
                {['link', 'image', 'video', 'text', 'draft'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>content</div>
          <textarea value={form.content} onChange={e => f('content', e.target.value)} rows={3} placeholder="content or caption..." style={{ ...inputStyle, resize: 'vertical', marginBottom: 8 }} />
          <button onClick={save} disabled={saving} style={{
            padding: '6px 16px', fontSize: '0.62rem', borderRadius: 6, border: 'none',
            background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
          }}>{saving ? '...' : 'save to vault'}</button>
        </div>
      )}

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 0', scrollbarWidth: 'thin' }}>
        {loading ? <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {items.map((it, i) => (
              <div key={it.id || i} style={{
                background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f',
                cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.12s',
              }}
                onClick={() => setExpanded(expanded === i ? null : i)}
                onMouseOver={e => e.currentTarget.style.borderColor = '#27272a'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#1c1c1f'}
              >
                {(it.image || (it.type === 'image' && it.url)) && (
                  <img src={api.proxyImage(it.image || it.url)} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                )}
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 500, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title || 'untitled'}</div>
                  <div style={{ fontSize: '0.58rem', color: '#3f3f46', marginTop: 4, display: 'flex', gap: 6 }}>
                    {it.source && <span>{it.source}</span>}
                    {it.type && <span>{'\u00b7'} {it.type}</span>}
                    {it.platform && <span>{'\u00b7'} {it.platform}</span>}
                    {it.saved_at && <span>{'\u00b7'} {ago(new Date(it.saved_at).getTime())}</span>}
                  </div>
                  {it.content && <div style={{ fontSize: '0.62rem', color: '#52525b', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.content || it.caption}</div>}

                  {expanded === i && (
                    <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #18181b', fontSize: '0.62rem' }}>
                      {(it.content || it.caption) && <div style={{ color: '#a1a1aa', whiteSpace: 'pre-wrap', marginBottom: 6, lineHeight: 1.5 }}>{it.content || it.caption}</div>}
                      {it.url && <div style={{ marginBottom: 4 }}><a href={it.url} target="_blank" rel="noreferrer" style={{ color: '#6366f1', textDecoration: 'none' }}>open link</a></div>}
                      {it.saved_at && <div style={{ color: '#3f3f46' }}>saved: {new Date(it.saved_at).toLocaleString()}</div>}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {items.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#3f3f46', fontSize: '0.75rem' }}>vault is empty</div>}
          </div>
        )}
      </div>
    </div>
  );
}
