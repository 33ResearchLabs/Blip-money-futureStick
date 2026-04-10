import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

const types = ['post', 'story', 'reel', 'thumbnail', 'banner'];
const platformsList = ['instagram', 'twitter', 'youtube', 'tiktok'];
const styles = ['photorealistic', 'cinematic', 'minimal', 'neon', 'abstract', 'vintage', 'cyberpunk'];
const aspects = ['1:1', '9:16', '16:9', '4:5'];
const aspectDims = { '1:1': [400, 400], '9:16': [360, 640], '16:9': [640, 360], '4:5': [400, 500] };

export default function Studio() {
  const canvasRef = useRef(null);
  const [type, setType] = useState('post');
  const [platform, setPlatform] = useState('instagram');
  const [keyword, setKeyword] = useState('');
  const [imageStyle, setImageStyle] = useState('cinematic');
  const [aspect, setAspect] = useState('1:1');
  const [overlay, setOverlay] = useState('');
  const [caption, setCaption] = useState('');
  const [generating, setGenerating] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [w, h] = aspectDims[aspect] || [400, 400];
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f1014';
    ctx.fillRect(0, 0, w, h);

    const drawOvl = () => {
      if (!overlay) return;
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, h - 48, w, 48);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(overlay, w / 2, h - 18);
    };

    if (imageData) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { ctx.drawImage(img, 0, 0, w, h); drawOvl(); };
      img.onerror = () => drawOvl();
      img.src = imageData;
    } else {
      ctx.strokeStyle = '#1c1e24';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.fillStyle = '#2a3346';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${w} x ${h} -- ${aspect}`, w / 2, h / 2);
      drawOvl();
    }
  }, [aspect, imageData, overlay]);

  const generateImage = async () => {
    setGenerating(true);
    try {
      const prompt = `${imageStyle} style, ${keyword || type}, ${aspect} aspect ratio, social media ${type} for ${platform}`;
      const d = await api.generateImage(prompt);
      if (d && d.url) setImageData(d.url);
      else if (d && d.image) setImageData(d.image);
    } catch {}
    setGenerating(false);
  };

  const suggest = async () => {
    setSuggesting(true);
    try {
      const d = await api.callAI(
        `Generate a social media ${type} for ${platform}. Topic: ${keyword || 'trending'}. Return JSON: {"headline":"...","category":"...","caption":"..."}`,
        'You are a social media content strategist. Return only valid JSON.'
      );
      if (d.ok && d.text) {
        try {
          const parsed = JSON.parse(d.text);
          if (parsed.headline) setOverlay(parsed.headline);
          if (parsed.caption) setCaption(parsed.caption);
        } catch {
          setCaption(d.text);
        }
      }
    } catch {}
    setSuggesting(false);
  };

  const generateCaption = async () => {
    setSuggesting(true);
    try {
      const d = await api.callAI(
        `Write a ${platform} caption for: ${keyword || overlay || type}. Max 200 chars. Include hashtags.`,
        'You are a social media copywriter. Be concise and engaging.'
      );
      if (d.ok && d.text) setCaption(d.text);
    } catch {}
    setSuggesting(false);
  };

  const saveToVault = async () => {
    setSaving(true);
    await api.saveToVault({
      title: overlay || keyword || type,
      platform,
      caption,
      type,
      image: imageData,
      saved_at: new Date().toISOString(),
    });
    setSaving(false);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-label">create</div>
        <div className="page-title">Studio</div>
        <div className="page-subtitle">content creation studio</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 240px', gap: 12 }}>
        {/* Left panel */}
        <div>
          <div className="label">type</div>
          <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', marginBottom: 8 }}>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="label">platform</div>
          <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ width: '100%', marginBottom: 8 }}>
            {platformsList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="label">keyword</div>
          <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="topic..." style={{ width: '100%', marginBottom: 8 }} />
          <div className="label">image style</div>
          <select value={imageStyle} onChange={e => setImageStyle(e.target.value)} style={{ width: '100%', marginBottom: 8 }}>
            {styles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="label">aspect ratio</div>
          <select value={aspect} onChange={e => setAspect(e.target.value)} style={{ width: '100%', marginBottom: 8 }}>
            {aspects.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <div className="label">overlay text</div>
          <input value={overlay} onChange={e => setOverlay(e.target.value)} placeholder="headline..." style={{ width: '100%', marginBottom: 8 }} />
          <button className="btn btn-primary" onClick={generateImage} disabled={generating} style={{ width: '100%', justifyContent: 'center', marginBottom: 4 }}>
            {generating ? <span className="spinner" /> : 'generate image'}
          </button>
          <button className="btn btn-ghost" onClick={suggest} disabled={suggesting} style={{ width: '100%', justifyContent: 'center' }}>
            {suggesting ? <span className="spinner" /> : 'AI suggest'}
          </button>
        </div>

        {/* Center canvas */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <canvas ref={canvasRef} style={{ border: '1px solid var(--border)', borderRadius: 4, maxWidth: '100%' }} />
        </div>

        {/* Right panel */}
        <div>
          <div className="label">caption</div>
          <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={10} style={{ width: '100%', marginBottom: 4, resize: 'vertical' }} placeholder="write caption..." />
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'right' }}>{caption.length} chars</div>
          <button className="btn btn-ghost" onClick={generateCaption} disabled={suggesting} style={{ width: '100%', justifyContent: 'center', marginBottom: 6 }}>
            {suggesting ? <span className="spinner" /> : 'generate caption'}
          </button>
          <button className="btn btn-success" onClick={saveToVault} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
            {saving ? <span className="spinner" /> : 'save to vault'}
          </button>
        </div>
      </div>
    </div>
  );
}
