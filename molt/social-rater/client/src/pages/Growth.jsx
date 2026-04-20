import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const FONT = "'JetBrains Mono', 'SF Mono', 'Menlo', monospace";
const fmtN = n => { if(!n) return '0'; if(n>=1e6) return (n/1e6).toFixed(1)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toLocaleString(); };

const C = {
  bg: '#0a0a0c', card: '#0f1014', border: '#1c1e24', borderHover: '#2a3346',
  blue: '#5b8aff', blueBg: '#1a1f2e', blueBorder: '#2a3346',
  green: '#22c55e', orange: '#f97316', red: '#ef4444',
  text: '#d6dde6', muted: '#5a606c', dim: '#9ba3af',
  input: '#15171d',
  btnPrimBg: '#1e3056', btnPrimColor: '#a8c4ff', btnPrimBorder: '#2a4276',
};

const btnStyle = { background: C.input, border: `1px solid ${C.border}`, color: C.dim, padding: '5px 11px', borderRadius: 3, fontFamily: FONT, fontSize: '.65rem', cursor: 'pointer', textTransform: 'lowercase' };
const btnPrimStyle = { ...btnStyle, background: C.btnPrimBg, color: C.btnPrimColor, border: `1px solid ${C.btnPrimBorder}` };
const inputStyle = { background: C.input, border: `1px solid ${C.border}`, color: C.text, padding: '6px 8px', borderRadius: 3, fontFamily: FONT, fontSize: '.68rem', outline: 'none', boxSizing: 'border-box' };

const NICHES = ['lifestyle', 'finance', 'crypto'];
const PLATFORMS = ['youtube', 'instagram', 'tiktok'];
const PLAT_ICON = { youtube: '▶', instagram: '📸', tiktok: '🎵' };
const NICHE_COLOR = { lifestyle: '#f97316', finance: '#22c55e', crypto: '#5b8aff' };

export default function Growth() {
  const [tab, setTab] = useState('library'); // library | winners | coach
  const [niche, setNiche] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [stats, setStats] = useState([]);
  const [library, setLibrary] = useState(null);
  const [winners, setWinners] = useState([]);
  const [scraping, setScraping] = useState(false);
  const [mining, setMining] = useState(false);
  const [busyMsg, setBusyMsg] = useState('');

  const loadAll = useCallback(async () => {
    try {
      const [s, lib, w] = await Promise.all([
        fetch('/api/growth/stats').then(r => r.json()),
        fetch(`/api/growth/library?niche=${niche === 'all' ? '' : niche}&platform=${platform === 'all' ? '' : platform}`).then(r => r.json()),
        fetch(`/api/growth/winners?niche=${niche === 'all' ? '' : niche}&platform=${platform === 'all' ? '' : platform}&limit=100`).then(r => r.json()),
      ]);
      setStats(s.stats || []);
      setLibrary(lib.library || null);
      setWinners(w.items || []);
    } catch (e) { console.error(e); }
  }, [niche, platform]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const scrape = async () => {
    setScraping(true); setBusyMsg('scraping winners (this takes ~30-90s per niche)…');
    try {
      const r = await fetch('/api/growth/scrape', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: niche === 'all' ? undefined : niche, platform: platform === 'all' ? undefined : platform }),
      }).then(r => r.json());
      setBusyMsg(`done · scraped ${r.scraped}, kept ${r.kept} above threshold`);
    } catch (e) { setBusyMsg('scrape failed: ' + e.message); }
    setScraping(false);
    await loadAll();
    setTimeout(() => setBusyMsg(''), 4000);
  };

  const mine = async () => {
    setMining(true); setBusyMsg('mining DNA (LLM calls per winner)…');
    try {
      const r = await fetch('/api/growth/mine-dna', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: niche === 'all' ? undefined : niche, platform: platform === 'all' ? undefined : platform, limit: 30 }),
      }).then(r => r.json());
      setBusyMsg(`done · mined ${r.mined}, failed ${r.failed}, pending ${Math.max(0, r.total - r.mined - r.failed)}`);
    } catch (e) { setBusyMsg('mine failed: ' + e.message); }
    setMining(false);
    await loadAll();
    setTimeout(() => setBusyMsg(''), 4000);
  };

  const pillRow = (title, arr, color = '#fff') => {
    const total = (arr || []).reduce((s, x) => s + x.n, 0) || 1;
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6, fontWeight: 700 }}>{title}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(arr || []).slice(0, 8).map(x => {
            const pct = Math.round((x.n / total) * 100);
            return (
              <div key={x.key} style={{ padding: '5px 10px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, fontSize: '.62rem', display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ color }}>{x.key || '?'}</span>
                <span style={{ color: C.muted, fontVariantNumeric: 'tabular-nums' }}>{x.n}</span>
                <span style={{ color: C.muted, fontSize: '.55rem' }}>{pct}%</span>
              </div>
            );
          })}
          {(!arr || !arr.length) && <span style={{ color: C.muted, fontSize: '.65rem' }}>— no data yet, scrape + mine first</span>}
        </div>
      </div>
    );
  };

  const renderStats = () => {
    if (!stats.length) return <div style={{ color: C.muted, fontSize: '.7rem', padding: 12 }}>No winners yet — click Scrape to start.</div>;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 6, marginBottom: 14 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '.58rem' }}>
              <span style={{ color: NICHE_COLOR[s.niche] || '#fff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.niche}</span>
              <span style={{ color: C.muted }}>{PLAT_ICON[s.platform] || ''} {s.platform}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: '.65rem', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{s.winners}</span>
              <span style={{ color: C.muted }}>winners</span>
              <span style={{ color: '#4ade80', fontWeight: 600 }}>{s.mined}</span>
              <span style={{ color: C.muted }}>mined</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLibrary = () => {
    if (!library) return null;
    return (
      <div>
        <div style={{ padding: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{library.total}</span>
          <span style={{ color: C.muted, fontSize: '.7rem' }}>winners with DNA · {niche} · {platform}</span>
        </div>
        {pillRow('HOOKS', library.hooks, '#ffd54a')}
        {pillRow('EMOTIONS', library.emotions, '#fb923c')}
        {pillRow('FORMATS', library.formats, '#5b8aff')}
        {pillRow('LENGTHS', library.lengths, '#22c55e')}
        {pillRow('TOPICS', library.topics, '#a855f7')}
      </div>
    );
  };

  const renderWinners = () => {
    if (!winners.length) return <div style={{ color: C.muted, fontSize: '.7rem', padding: 20, textAlign: 'center' }}>No winners. Click Scrape.</div>;
    return (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 70px 80px 2.5fr 80px 90px 90px', gap: 8, padding: '6px 10px', fontSize: '.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: `1px solid ${C.border}` }}>
          <div>thumb</div><div>niche</div><div>platform</div><div>title</div>
          <div style={{ textAlign: 'right' }}>views</div>
          <div>hook</div><div>emotion</div>
        </div>
        {winners.map(w => (
          <div key={w.id} onClick={() => w.url && window.open(w.url, '_blank')}
            style={{ display: 'grid', gridTemplateColumns: '60px 70px 80px 2.5fr 80px 90px 90px', gap: 8, alignItems: 'center', padding: '8px 10px', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', fontSize: '.65rem' }}
            onMouseOver={e => e.currentTarget.style.background = C.input}
            onMouseOut={e => e.currentTarget.style.background = ''}
          >
            {w.thumb ? (
              <img src={w.thumb} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 3, background: C.input }} onError={e => e.target.style.display = 'none'} />
            ) : <div style={{ width: 52, height: 52, background: C.input, borderRadius: 3 }} />}
            <span style={{ color: NICHE_COLOR[w.niche] || '#fff', fontSize: '.58rem', fontWeight: 700, textTransform: 'uppercase' }}>{w.niche}</span>
            <span style={{ color: C.muted, fontSize: '.6rem' }}>{PLAT_ICON[w.platform] || ''} {w.platform}</span>
            <div style={{ color: C.text, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis' }}>
              <div>{w.title}</div>
              <div style={{ fontSize: '.52rem', color: C.muted, marginTop: 2 }}>@{w.author}</div>
            </div>
            <span style={{ color: '#4ade80', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{fmtN(w.views)}</span>
            <span style={{ color: '#ffd54a', fontSize: '.58rem' }}>{w.hook_type || '—'}</span>
            <span style={{ color: '#fb923c', fontSize: '.58rem' }}>{w.emotion || '—'}</span>
          </div>
        ))}
      </div>
    );
  };

  // Draft coach
  const [draft, setDraft] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachReport, setCoachReport] = useState(null);

  const scoreDraft = async () => {
    if (!draft.trim()) return;
    setCoachLoading(true); setCoachReport(null);
    try {
      const r = await fetch('/api/growth/score-draft', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: niche === 'all' ? 'finance' : niche,
          platform: platform === 'all' ? 'youtube' : platform,
          draft,
        }),
      }).then(r => r.json());
      setCoachReport(r.ok ? r.report : { error: r.error });
    } catch (e) { setCoachReport({ error: e.message }); }
    setCoachLoading(false);
  };

  const renderCoach = () => {
    return (
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em' }}>scoring for</span>
          <span style={{ color: NICHE_COLOR[niche] || '#fff', fontSize: '.65rem', fontWeight: 700 }}>{niche === 'all' ? 'finance (default)' : niche}</span>
          <span style={{ color: C.muted }}>·</span>
          <span style={{ color: '#fff', fontSize: '.65rem' }}>{platform === 'all' ? 'youtube (default)' : platform}</span>
          <span style={{ color: C.muted, fontSize: '.55rem', marginLeft: 'auto' }}>change at top to target another niche/platform</span>
        </div>
        <textarea
          value={draft} onChange={e => setDraft(e.target.value)}
          placeholder="paste your draft idea, hook, script, or caption here…"
          style={{ ...inputStyle, width: '100%', minHeight: 140, fontSize: '.75rem', resize: 'vertical', lineHeight: 1.5 }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={scoreDraft} disabled={coachLoading || !draft.trim()}
            style={{ ...btnPrimStyle, padding: '9px 14px', fontSize: '.72rem', fontWeight: 600, flex: 1 }}>
            {coachLoading ? 'scoring…' : '⚡ score draft against winning patterns'}
          </button>
        </div>

        {coachReport && coachReport.error && (
          <div style={{ color: C.red, padding: 12, marginTop: 10, fontSize: '.7rem' }}>Error: {coachReport.error}</div>
        )}
        {coachReport && !coachReport.error && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 12 }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: coachReport.score >= 70 ? '#4ade80' : coachReport.score >= 40 ? '#ffd54a' : '#ef4444', fontVariantNumeric: 'tabular-nums', minWidth: 80 }}>{coachReport.score}</div>
              <div>
                <div style={{ fontSize: '.55rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 4, fontWeight: 700 }}>verdict</div>
                <div style={{ fontSize: '.78rem', color: C.text, lineHeight: 1.5 }}>{coachReport.verdict}</div>
              </div>
            </div>

            {(coachReport.hook_alternatives || []).length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '.55rem', color: '#ffd54a', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6, fontWeight: 700 }}>Hook rewrites (tuned to winners)</div>
                {coachReport.hook_alternatives.map((h, i) => (
                  <div key={i} style={{ padding: '8px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 4, fontSize: '.72rem', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#ffd54a', fontWeight: 700 }}>{i + 1}.</span><span>{h}</span>
                  </div>
                ))}
              </div>
            )}

            {(coachReport.weaknesses || []).length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '.55rem', color: '#fb923c', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6, fontWeight: 700 }}>Weaknesses</div>
                {coachReport.weaknesses.map((w, i) => (
                  <div key={i} style={{ padding: '6px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 4, fontSize: '.68rem' }}>— {w}</div>
                ))}
              </div>
            )}

            {(coachReport.fix_actions || []).length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '.55rem', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 6, fontWeight: 700 }}>Fix before posting</div>
                {coachReport.fix_actions.map((a, i) => (
                  <div key={i} style={{ padding: '6px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 4, fontSize: '.68rem' }}>✓ {a}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', background: C.bg, fontFamily: FONT, color: C.text }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: C.card, borderBottom: `1px solid ${C.border}`, flexShrink: 0, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '.62rem', fontWeight: 700, color: C.blue, letterSpacing: '.15em', padding: '3px 8px', background: C.blueBg, border: `1px solid ${C.blueBorder}`, borderRadius: 3 }}>GROWTH</span>

        <select value={niche} onChange={e => setNiche(e.target.value)} style={{ ...inputStyle, width: 120 }}>
          <option value="all">all niches</option>
          {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ ...inputStyle, width: 120 }}>
          <option value="all">all platforms</option>
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <button onClick={scrape} disabled={scraping || mining} style={btnPrimStyle}>
          {scraping ? 'scraping…' : '🔎 scrape winners'}
        </button>
        <button onClick={mine} disabled={scraping || mining} style={btnStyle}>
          {mining ? 'mining…' : '🧬 mine DNA'}
        </button>
        <button onClick={loadAll} style={btnStyle}>↻</button>

        {busyMsg && <span style={{ marginLeft: 'auto', fontSize: '.6rem', color: C.dim }}>{busyMsg}</span>}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 1, padding: '0 10px', background: C.card, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {[
          ['library', '🧬 DNA Library'],
          ['winners', '🏆 Winners'],
          ['coach', '⚡ Draft Coach'],
        ].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${tab === k ? C.blue : 'transparent'}`,
            color: tab === k ? C.blue : C.muted,
            fontFamily: FONT, fontSize: '.62rem', padding: '8px 14px',
            cursor: 'pointer', textTransform: 'lowercase',
          }}>{label}</button>
        ))}
      </div>

      {/* Body */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', scrollbarWidth: 'thin' }}>
        {tab === 'library' && (
          <>
            {renderStats()}
            {renderLibrary()}
          </>
        )}
        {tab === 'winners' && renderWinners()}
        {tab === 'coach' && renderCoach()}
      </main>
    </div>
  );
}
