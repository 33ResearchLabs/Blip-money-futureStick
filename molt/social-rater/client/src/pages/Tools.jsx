import { useState } from 'react';
import { api } from '../services/api';

const imgStyles = ['photorealistic', 'cinematic', 'minimal', 'neon', 'abstract', 'vintage', 'cyberpunk', 'watercolor'];
const captionStyles = ['professional', 'casual', 'viral', 'emotional', 'humorous', 'educational'];

const inputStyle = {
  width: '100%', padding: '6px 10px', fontSize: '0.65rem', background: '#18181b',
  border: '1px solid #27272a', borderRadius: 6, color: '#a1a1aa', fontFamily: 'inherit', marginBottom: 8,
};

export default function Tools() {
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgStyle, setImgStyle] = useState('cinematic');
  const [imgResult, setImgResult] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);

  const [capText, setCapText] = useState('');
  const [capStyle, setCapStyle] = useState('professional');
  const [capResult, setCapResult] = useState('');
  const [capLoading, setCapLoading] = useState(false);

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
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px', borderBottom: '1px solid #18181b', flexShrink: 0 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.01em' }}>Tools</span>
        <span style={{ fontSize: '0.6rem', color: '#52525b' }}>quick utilities</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, padding: '14px 0', flex: 1, minHeight: 0 }}>
        {/* Image Generator */}
        <div style={{ padding: '16px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.62rem', color: '#fafafa', fontWeight: 600, marginBottom: 12 }}>Image generator</div>
          <input placeholder="describe image..." value={imgPrompt} onChange={e => setImgPrompt(e.target.value)} style={inputStyle} onKeyDown={e => e.key === 'Enter' && genImage()} />
          <select value={imgStyle} onChange={e => setImgStyle(e.target.value)} style={inputStyle}>
            {imgStyles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={genImage} disabled={imgLoading || !imgPrompt} style={{
            width: '100%', padding: '7px 14px', fontSize: '0.62rem', borderRadius: 6, border: 'none',
            background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: (!imgPrompt || imgLoading) ? 0.5 : 1,
          }}>{imgLoading ? <span className="spinner" /> : 'generate'}</button>
          {imgResult && <img src={imgResult} alt="" style={{ width: '100%', marginTop: 12, borderRadius: 6 }} />}
        </div>

        {/* Caption Writer */}
        <div style={{ padding: '16px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.62rem', color: '#fafafa', fontWeight: 600, marginBottom: 12 }}>Caption writer</div>
          <textarea placeholder="paste text..." value={capText} onChange={e => setCapText(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          <select value={capStyle} onChange={e => setCapStyle(e.target.value)} style={inputStyle}>
            {captionStyles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={rewriteCaption} disabled={capLoading || !capText} style={{
            width: '100%', padding: '7px 14px', fontSize: '0.62rem', borderRadius: 6, border: 'none',
            background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: (!capText || capLoading) ? 0.5 : 1,
          }}>{capLoading ? <span className="spinner" /> : 'rewrite'}</button>
          {capResult && (
            <div style={{ marginTop: 12, padding: 12, background: '#18181b', borderRadius: 6, fontSize: '0.65rem', color: '#a1a1aa', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{capResult}</div>
          )}
        </div>

        {/* Handle Checker */}
        <div style={{ padding: '16px', background: '#111113', borderRadius: 8, border: '1px solid #1c1c1f', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.62rem', color: '#fafafa', fontWeight: 600, marginBottom: 12 }}>Handle checker</div>
          <input placeholder="@handle" value={handle} onChange={e => setHandle(e.target.value)} style={inputStyle} onKeyDown={e => e.key === 'Enter' && checkHandle()} />
          <button onClick={checkHandle} disabled={handleLoading || !handle} style={{
            width: '100%', padding: '7px 14px', fontSize: '0.62rem', borderRadius: 6, border: 'none',
            background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            opacity: (!handle || handleLoading) ? 0.5 : 1,
          }}>{handleLoading ? <span className="spinner" /> : 'check'}</button>
          {handleResult && (
            <div style={{ marginTop: 12, padding: 12, background: '#18181b', borderRadius: 6, fontSize: '0.65rem' }}>
              {handleResult.error ? (
                <span style={{ color: '#f87171' }}>{handleResult.error}</span>
              ) : handleResult.available !== undefined ? (
                <span style={{ color: handleResult.available ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                  {handleResult.available ? 'available!' : 'taken'}
                </span>
              ) : (
                <pre style={{ color: '#a1a1aa', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{JSON.stringify(handleResult, null, 2)}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
