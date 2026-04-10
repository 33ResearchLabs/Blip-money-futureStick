import { useState } from 'react';
import { api } from '../services/api';

const imgStyles = ['photorealistic', 'cinematic', 'minimal', 'neon', 'abstract', 'vintage', 'cyberpunk', 'watercolor'];
const captionStyles = ['professional', 'casual', 'viral', 'emotional', 'humorous', 'educational'];

export default function Tools() {
  // Image generator
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgStyle, setImgStyle] = useState('cinematic');
  const [imgResult, setImgResult] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);

  // Caption writer
  const [capText, setCapText] = useState('');
  const [capStyle, setCapStyle] = useState('professional');
  const [capResult, setCapResult] = useState('');
  const [capLoading, setCapLoading] = useState(false);

  // Handle checker
  const [handle, setHandle] = useState('');
  const [handleResult, setHandleResult] = useState(null);
  const [handleLoading, setHandleLoading] = useState(false);

  const genImage = async () => {
    setImgLoading(true);
    setImgResult(null);
    try {
      const d = await api.generateImage(`${imgStyle} style: ${imgPrompt}`);
      if (d?.url) setImgResult(d.url);
      else if (d?.image) setImgResult(d.image);
    } catch {}
    setImgLoading(false);
  };

  const rewriteCaption = async () => {
    setCapLoading(true);
    try {
      const d = await api.callAI(
        `Rewrite this for social media in a ${capStyle} tone. Include hashtags. Text: ${capText}`,
        'You are a social media copywriter. Be concise.'
      );
      if (d.ok && d.text) setCapResult(d.text);
      else if (d.text) setCapResult(d.text);
      else if (d.response) setCapResult(d.response);
    } catch {}
    setCapLoading(false);
  };

  const checkHandle = async () => {
    setHandleLoading(true);
    setHandleResult(null);
    try {
      const d = await api.checkHandle(handle);
      setHandleResult(d);
    } catch {
      setHandleResult({ error: 'check failed' });
    }
    setHandleLoading(false);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-label">utilities</div>
        <div className="page-title">Tools</div>
        <div className="page-subtitle">quick tools for content creation</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {/* Image Generator */}
        <div className="card" style={{ padding: 12 }}>
          <div className="label" style={{ marginBottom: 6 }}>image generator</div>
          <input placeholder="describe image..." value={imgPrompt} onChange={e => setImgPrompt(e.target.value)} style={{ width: '100%', marginBottom: 6 }} onKeyDown={e => e.key === 'Enter' && genImage()} />
          <select value={imgStyle} onChange={e => setImgStyle(e.target.value)} style={{ width: '100%', marginBottom: 6 }}>
            {imgStyles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={genImage} disabled={imgLoading || !imgPrompt} style={{ width: '100%', justifyContent: 'center' }}>
            {imgLoading ? <span className="spinner" /> : 'generate'}
          </button>
          {imgResult && <img src={imgResult} alt="" style={{ width: '100%', marginTop: 8, borderRadius: 3 }} />}
        </div>

        {/* Caption Writer */}
        <div className="card" style={{ padding: 12 }}>
          <div className="label" style={{ marginBottom: 6 }}>caption writer</div>
          <textarea placeholder="paste text..." value={capText} onChange={e => setCapText(e.target.value)} rows={4} style={{ width: '100%', marginBottom: 6, resize: 'vertical' }} />
          <select value={capStyle} onChange={e => setCapStyle(e.target.value)} style={{ width: '100%', marginBottom: 6 }}>
            {captionStyles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={rewriteCaption} disabled={capLoading || !capText} style={{ width: '100%', justifyContent: 'center' }}>
            {capLoading ? <span className="spinner" /> : 'rewrite'}
          </button>
          {capResult && (
            <div style={{ marginTop: 8, padding: 8, background: 'var(--bg-hover)', borderRadius: 3, fontSize: 10, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{capResult}</div>
          )}
        </div>

        {/* Handle Checker */}
        <div className="card" style={{ padding: 12 }}>
          <div className="label" style={{ marginBottom: 6 }}>handle checker</div>
          <input placeholder="@handle" value={handle} onChange={e => setHandle(e.target.value)} style={{ width: '100%', marginBottom: 6 }} onKeyDown={e => e.key === 'Enter' && checkHandle()} />
          <button className="btn btn-primary btn-sm" onClick={checkHandle} disabled={handleLoading || !handle} style={{ width: '100%', justifyContent: 'center' }}>
            {handleLoading ? <span className="spinner" /> : 'check'}
          </button>
          {handleResult && (
            <div style={{ marginTop: 8, padding: 8, background: 'var(--bg-hover)', borderRadius: 3, fontSize: 10 }}>
              {handleResult.error ? (
                <span style={{ color: 'var(--danger)' }}>{handleResult.error}</span>
              ) : handleResult.available !== undefined ? (
                <span style={{ color: handleResult.available ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                  {handleResult.available ? 'available!' : 'taken'}
                </span>
              ) : (
                <pre style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{JSON.stringify(handleResult, null, 2)}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
