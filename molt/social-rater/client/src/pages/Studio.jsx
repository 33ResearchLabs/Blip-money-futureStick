import { useState } from 'react';
import { api } from '../services/api';
import { Sparkles, Image, Copy, Send, Check, Save } from 'lucide-react';

const platforms = ['tiktok', 'youtube', 'instagram', 'twitter'];
const badge = (bg) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: bg, color: '#fff', marginRight: 6 });
const platColors = { tiktok: '#ff0050', youtube: '#f00', instagram: '#e1306c', twitter: '#1da1f2' };

export default function Studio() {
  const [topic, setTopic] = useState('');
  const [selected, setSelected] = useState(['instagram', 'twitter']);
  const [captions, setCaptions] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgUrl, setImgUrl] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatReply, setChatReply] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const togglePlat = (p) => setSelected(s => s.includes(p) ? s.filter(x => x !== p) : [...s, p]);

  const generateCaptions = async () => {
    if (!topic || !selected.length) return;
    setGenLoading(true);
    try {
      const sys = 'You are a social media content expert. Return JSON: { "platform": "caption" } for each requested platform. Captions only, no extra text.';
      const prompt = `Write captions for: "${topic}"\nPlatforms: ${selected.join(', ')}\nReturn JSON object mapping platform to caption.`;
      const res = await api.callAI(prompt, sys);
      const text = res.response || res.text || '';
      const match = text.match(/\{[\s\S]*\}/);
      setCaptions(match ? JSON.parse(match[0]) : { raw: text });
    } catch (e) { setCaptions({ error: 'Failed to generate' }); }
    setGenLoading(false);
  };

  const copyText = (txt, key) => {
    navigator.clipboard.writeText(txt);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const generateImage = async () => {
    if (!imgPrompt) return;
    setImgLoading(true);
    try {
      const res = await api.generateImage(imgPrompt);
      setImgUrl(res.url || res.image || null);
    } catch (e) { console.error(e); }
    setImgLoading(false);
  };

  const saveToVault = async () => {
    if (!imgUrl) return;
    setSaving(true);
    await api.saveToVault({ title: imgPrompt, url: imgUrl, source: 'studio', type: 'image' });
    setSaving(false);
  };

  const sendChat = async () => {
    if (!chatInput) return;
    setChatLoading(true);
    try {
      const res = await api.callAI(chatInput, 'You are a helpful creative assistant. Be concise.');
      setChatReply(res.response || res.text || 'No response');
    } catch (e) { setChatReply('Error'); }
    setChatLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Studio</h2>
          <p className="text-sm text-muted">Create content with AI & brand tools</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left: Content Creator */}
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}><Sparkles size={16} style={{ display: 'inline', marginRight: 6 }} />Content Creator</h3>
          <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter topic or content idea..."
            style={{ width: '100%', minHeight: 80, padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', resize: 'vertical', marginBottom: 8 }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {platforms.map(p => (
              <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={selected.includes(p)} onChange={() => togglePlat(p)} />
                <span style={badge(platColors[p])}>{p}</span>
              </label>
            ))}
          </div>
          <button className="btn btn-primary" onClick={generateCaptions} disabled={genLoading} style={{ marginBottom: 12 }}>
            {genLoading ? 'Generating...' : 'Generate Captions'}
          </button>
          {captions && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(captions).map(([plat, text]) => (
                <div key={plat} style={{ padding: 10, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={badge(platColors[plat] || '#666')}>{plat}</span>
                    <button onClick={() => copyText(text, plat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      {copied === plat ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p style={{ fontSize: 13, margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Image Generator */}
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}><Image size={16} style={{ display: 'inline', marginRight: 6 }} />Image Generator</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input value={imgPrompt} onChange={e => setImgPrompt(e.target.value)} placeholder="Describe the image..."
              style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)' }} />
            <button className="btn btn-primary" onClick={generateImage} disabled={imgLoading}>{imgLoading ? '...' : 'Generate'}</button>
          </div>
          {imgUrl && (
            <div style={{ textAlign: 'center' }}>
              <img src={imgUrl} alt="Generated" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 8 }} />
              <button className="btn" onClick={saveToVault} disabled={saving}>
                <Save size={14} style={{ marginRight: 4 }} />{saving ? 'Saving...' : 'Save to Vault'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick AI Chat */}
      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Quick AI Chat</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask AI anything..."
            onKeyDown={e => e.key === 'Enter' && sendChat()}
            style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)' }} />
          <button className="btn btn-primary" onClick={sendChat} disabled={chatLoading}><Send size={14} /></button>
        </div>
        {chatReply && <p style={{ marginTop: 10, fontSize: 13, whiteSpace: 'pre-wrap', padding: 10, background: 'var(--bg)', borderRadius: 8 }}>{chatReply}</p>}
      </div>
    </div>
  );
}
