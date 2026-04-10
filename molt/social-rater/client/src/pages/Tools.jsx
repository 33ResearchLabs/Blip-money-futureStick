import { useState } from 'react';
import { api } from '../services/api';
import { Star, AtSign, Globe, Search, Loader } from 'lucide-react';

const cardStyle = { padding: 16, display: 'flex', flexDirection: 'column', gap: 10 };
const inputStyle = { flex: 1, padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)' };
const resultBox = { padding: 10, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', fontSize: 13, whiteSpace: 'pre-wrap', marginTop: 4 };

function ToolCard({ icon, title, children }) {
  return (
    <div className="card" style={cardStyle}>
      <h3 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>{icon}{title}</h3>
      {children}
    </div>
  );
}

export default function Tools() {
  const [imgUrl, setImgUrl] = useState('');
  const [imgResult, setImgResult] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);

  const [handle, setHandle] = useState('');
  const [handleResult, setHandleResult] = useState(null);
  const [handleLoading, setHandleLoading] = useState(false);

  const [ogUrl, setOgUrl] = useState('');
  const [ogResult, setOgResult] = useState(null);
  const [ogLoading, setOgLoading] = useState(false);

  const rateImage = async () => {
    if (!imgUrl) return;
    setImgLoading(true);
    try {
      const res = await api.rateImage(imgUrl);
      setImgResult(res.response || res.text || JSON.stringify(res));
    } catch (e) { setImgResult('Error rating image'); }
    setImgLoading(false);
  };

  const checkHandle = async () => {
    if (!handle) return;
    setHandleLoading(true);
    try {
      const res = await api.checkHandle(handle);
      setHandleResult(res);
    } catch (e) { setHandleResult({ error: 'Check failed' }); }
    setHandleLoading(false);
  };

  const scrapeOG = async () => {
    if (!ogUrl) return;
    setOgLoading(true);
    try {
      const res = await api.getOG(ogUrl);
      setOgResult(res);
    } catch (e) { setOgResult({ error: 'Scrape failed' }); }
    setOgLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Tools</h2>
          <p className="text-sm text-muted">Utilities for content creation</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {/* Image Rater */}
        <ToolCard icon={<Star size={16} />} title="Image Rater">
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="Image URL..." style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && rateImage()} />
            <button className="btn btn-primary" onClick={rateImage} disabled={imgLoading}>
              {imgLoading ? <Loader size={14} className="spin" /> : 'Rate'}
            </button>
          </div>
          {imgResult && <div style={resultBox}>{imgResult}</div>}
        </ToolCard>

        {/* Handle Checker */}
        <ToolCard icon={<AtSign size={16} />} title="Handle Checker">
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="@handle" style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && checkHandle()} />
            <button className="btn btn-primary" onClick={checkHandle} disabled={handleLoading}>
              {handleLoading ? <Loader size={14} className="spin" /> : 'Check'}
            </button>
          </div>
          {handleResult && (
            <div style={resultBox}>
              {handleResult.error ? handleResult.error
                : handleResult.available !== undefined
                  ? <span style={{ color: handleResult.available ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                      {handleResult.available ? 'Available!' : 'Taken'}
                    </span>
                  : <pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify(handleResult, null, 2)}</pre>}
            </div>
          )}
        </ToolCard>

        {/* OG Scraper */}
        <ToolCard icon={<Globe size={16} />} title="OG Scraper">
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={ogUrl} onChange={e => setOgUrl(e.target.value)} placeholder="https://..." style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && scrapeOG()} />
            <button className="btn btn-primary" onClick={scrapeOG} disabled={ogLoading}>
              {ogLoading ? <Loader size={14} className="spin" /> : 'Scrape'}
            </button>
          </div>
          {ogResult && (
            <div style={resultBox}>
              {ogResult.error ? ogResult.error : (
                <>
                  {ogResult.title && <p style={{ fontWeight: 600, margin: '0 0 4px' }}>{ogResult.title}</p>}
                  {ogResult.description && <p style={{ margin: '0 0 4px', color: 'var(--text-muted)' }}>{ogResult.description}</p>}
                  {ogResult.image && <img src={ogResult.image} alt="OG" style={{ maxWidth: '100%', borderRadius: 6, marginTop: 6 }} />}
                  {!ogResult.title && !ogResult.description && <pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify(ogResult, null, 2)}</pre>}
                </>
              )}
            </div>
          )}
        </ToolCard>
      </div>
    </div>
  );
}
