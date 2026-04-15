// Standalone News Forge — extracted from /rater/ index.html so the React app
// at /33/app/news can call window.nfOpenForge(item). Self-contained: no
// external deps besides the same /api/ai, /api/imagegen, /api/drafts, /dl/og
// endpoints the server already exposes.
(function () {
  if (window.nfOpenForge) return; // already loaded

  // ---------- styles ----------
  if (!document.getElementById('nf-forge-style')) {
    const s = document.createElement('style');
    s.id = 'nf-forge-style';
    s.textContent = `
      .nf-forge-grp{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
      .nf-forge-lbl{font-size:.55rem;color:#6b7280;text-transform:uppercase;letter-spacing:.1em;font-weight:600;display:flex;justify-content:space-between;align-items:center}
      .nf-forge-lbl b{color:#fafafa;font-variant-numeric:tabular-nums}
      .nf-forge-input,.nf-forge-ta{width:100%;background:#15171d;border:1px solid #1e2030;color:#fafafa;padding:7px 9px;border-radius:3px;font-family:inherit;font-size:.7rem;outline:none;box-sizing:border-box;resize:vertical}
      .nf-forge-input:focus,.nf-forge-ta:focus{border-color:#6366f1}
      .nf-forge-ta{min-height:140px;line-height:1.5}
      .nf-forge-row{display:flex;gap:4px;flex-wrap:wrap}
      .nf-forge-row select,.nf-forge-row button{flex:1;min-width:0}
      .nf-act-prim{background:#1e3056;color:#a8c4ff;border:1px solid #2a4276;border-radius:3px;cursor:pointer;font-family:inherit}
      .nf-act-prim:hover{background:#264068;color:#fff}
      .nf-plat{background:#15171d;border:1px solid #1e2030;color:#9ba3af;padding:6px 10px;border-radius:3px;font-family:inherit;font-size:.65rem;cursor:pointer;font-weight:600}
      .nf-plat:hover{color:#fafafa}
      .nf-plat.active{background:#1a0d2e;color:#c4a8ff;border-color:#2d1856}
    `;
    document.head.appendChild(s);
  }

  // ---------- helpers / state ----------
  const nfEsc = (s) => (s || '').replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
  let NF_CURRENT = null, NF_PLAT = 'twitter', NF_IMG_SEED = 0;
  const getKey = () => { try { return localStorage.getItem('moltKey') || ''; } catch { return ''; } };

  // ---------- image prompt builder ----------
  async function nfBuildImagePrompt() {
    const head = document.getElementById('nfHead')?.value || NF_CURRENT.title || '';
    const body = (NF_CURRENT.summary || NF_CURRENT.description || NF_CURRENT.body || '').slice(0, 800);
    const style = (document.getElementById('nfImgStyle')?.value) || 'editorial photo, cinematic lighting, premium magazine';
    const key = getKey();
    if (key) {
      try {
        const sysPrompt = `You are an expert visual director for a premium news publication. Your job: convert a news headline into an image generation prompt for AI (Stable Diffusion / Flux).\n\nCRITICAL RULES:\n- NEVER describe text, logos, words, letters, or UI elements\n- NEVER literally depict what words say — instead find the VISUAL METAPHOR\n- Think like a Reuters/Bloomberg photo editor choosing the perfect stock image\n- Use CONCRETE visual objects: devices, buildings, people, landscapes, objects\n- Include lighting, mood, composition, camera angle\n\nNow convert this story:`;
        const userPrompt = `Headline: ${head}\nContext: ${body || head}\nVisual style: ${style}\n\nWrite ONE image prompt (2-3 sentences max). Output ONLY the prompt.`;
        const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 250, system: sysPrompt, messages: [{ role: 'user', content: userPrompt }] }) });
        const j = await r.json();
        const txt = (j.content && j.content[0] && j.content[0].text || '').trim();
        if (txt && txt.length > 20) return txt + ', absolutely no text, no words, no letters, no logos, no watermarks';
      } catch {}
    }
    const keywords = (body || head).toLowerCase();
    let scene = 'abstract conceptual editorial illustration';
    if (/crypto|bitcoin|blockchain|defi/i.test(keywords)) scene = 'golden digital coins and blockchain nodes floating in dark space, neon blue connections';
    else if (/ai|artificial|gpt|model|neural/i.test(keywords)) scene = 'neural network visualization with glowing nodes and data streams, futuristic tech environment';
    else if (/market|stock|finance|etf|invest/i.test(keywords)) scene = 'financial charts and trading screens reflected in glass, dramatic Wall Street lighting';
    else if (/hack|breach|security|privacy|data/i.test(keywords)) scene = 'cracked digital shield with data fragments scattering, red alert glow, cybersecurity concept';
    else if (/social|twitter|meta|tiktok|platform/i.test(keywords)) scene = 'interconnected social media holographic interfaces floating in dark space, digital communication';
    else if (/climate|energy|green|solar/i.test(keywords)) scene = 'dramatic landscape split between industrial pollution and clean renewable energy, aerial view';
    else if (/law|regulation|congress|government|bill/i.test(keywords)) scene = 'gavel and scales of justice with digital holographic overlays, marble government architecture';
    else if (/apple|google|microsoft|tech/i.test(keywords)) scene = 'sleek modern technology devices in a minimalist studio with dramatic product lighting';
    else if (/war|conflict|military|defense/i.test(keywords)) scene = 'geopolitical map with strategic overlays, dramatic satellite perspective, dark moody atmosphere';
    else {
      const words = (body || '').split(/\s+/).filter(w => w.length > 5).slice(0, 8).join(' ');
      scene = words + ', conceptual editorial visualization, symbolic';
    }
    return scene + ', ' + style + ', absolutely no text, no words, no letters, no logos';
  }

  async function nfGenImage(force) {
    if (!NF_CURRENT) return;
    const box = document.getElementById('nfImgBox');
    const loadEl = document.getElementById('nfImgLoad');
    if (loadEl) { loadEl.style.display = 'flex'; loadEl.textContent = '⏳ generating image...'; }
    NF_IMG_SEED = Math.floor(Math.random() * 999999);
    const prompt = await nfBuildImagePrompt();
    let r = null, lastErr = '';
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0 && loadEl) loadEl.textContent = '⏳ retrying...';
        r = await fetch('/api/imagegen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, width: 1024, height: 1024, seed: NF_IMG_SEED + attempt }) });
        if (r.ok) break;
        lastErr = r.status; r = null;
        await new Promise(x => setTimeout(x, 3000));
      } catch (e) { lastErr = e.message; r = null; }
    }
    try {
      if (!r || !r.ok) throw new Error(lastErr || 'failed');
      const blob = await r.blob();
      const objUrl = URL.createObjectURL(blob);
      box.style.backgroundImage = 'url("' + objUrl + '")';
      if (loadEl) loadEl.style.display = 'none';
    } catch (e) {
      if (loadEl) { loadEl.style.display = 'flex'; loadEl.textContent = '⚠ image failed (' + e.message + ') — click regenerate'; }
    }
  }

  const NF_PLAT_RULES = {
    twitter:   { name: 'X / Twitter', limit: 280,  fmt: 'Single tweet, max 280 chars. Strong hook line 1, payoff line 2. 0-2 hashtags max. Use line breaks.' },
    instagram: { name: 'Instagram',   limit: 2200, fmt: '1-line hook, 2-3 short paragraphs, end with CTA question. Hashtag block of 8-15 niche tags on a separate line.' },
    linkedin:  { name: 'LinkedIn',    limit: 3000, fmt: 'Pro tone but human. Hook in first 2 lines. Short paragraphs (1-2 sentences). End with a question. Max 3 hashtags.' },
    threads:   { name: 'Threads',     limit: 500,  fmt: 'Conversational, 1-3 short paragraphs, no hashtags.' },
    facebook:  { name: 'Facebook',    limit: 2000, fmt: 'Friendly, 2-3 paragraphs, end with CTA.' }
  };

  async function nfGenText(remix) {
    if (!NF_CURRENT) return;
    const ta = document.getElementById('nfPostText'); if (!ta) return;
    ta.value = '⏳ generating...';
    const tone = document.getElementById('nfTone').value;
    const hook = document.getElementById('nfHook').value;
    const head = document.getElementById('nfHead').value;
    const rules = NF_PLAT_RULES[NF_PLAT];
    const sys = `You are an elite viral content writer. Turn this news story into a ${rules.name} post that gets MAXIMUM engagement.\n\nPLATFORM: ${rules.name}\nRULES: ${rules.fmt}\nLIMIT: ${rules.limit} chars\nTONE: ${tone}\nHOOK: ${hook === 'auto' ? 'pick the strongest hook' : hook}\n\nSOURCE:\nTitle: ${head}\nSource: ${NF_CURRENT.source || NF_CURRENT.srcLabel || ''}\nBody: ${(NF_CURRENT.summary || NF_CURRENT.body || NF_CURRENT.description || '').slice(0, 1200)}\n\nINSTRUCTIONS:\n1. DO NOT just copy the headline. Repackage with a strong opinion/angle.\n2. First line must be a scroll-stopper.\n3. Write like a human, not a press release.\n4. ${remix ? 'Make this COMPLETELY DIFFERENT from any previous version.' : 'Fresh and shareable.'}\n5. NO fluff, no "in conclusion", no "stay tuned".\n6. Output ONLY the post text. No commentary, no labels.`;
    try {
      const key = getKey();
      if (!key) { ta.value = '⚠ No API key — run in browser console: localStorage.setItem("moltKey","sk-ant-YOUR-KEY")  then refresh'; return; }
      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1200, messages: [{ role: 'user', content: sys }] }) });
      const j = await r.json();
      if (j.error) { ta.value = '⚠ API error: ' + (j.error.message || JSON.stringify(j.error)); return; }
      const txt = (j.content && j.content[0] && j.content[0].text) || '(empty response)';
      ta.value = txt;
      document.getElementById('nfChars').textContent = txt.length;
    } catch (e) { ta.value = '⚠ Error: ' + e.message; }
  }

  function nfShare() {
    const t = encodeURIComponent(document.getElementById('nfPostText').value);
    const u = encodeURIComponent(NF_CURRENT.url || '');
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${t}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${t}`,
      threads: `https://www.threads.net/intent/post?text=${t}`,
      instagram: 'https://www.instagram.com/'
    };
    if (urls[NF_PLAT]) window.open(urls[NF_PLAT], '_blank');
  }

  async function nfSave() {
    const b = document.getElementById('nfSaveVault');
    let user = 'anon';
    try { user = (JSON.parse(localStorage.getItem('33tools_auth_v1') || '{}').u) || 'anon'; } catch {}
    const box = document.getElementById('nfImgBox');
    const img = box.style.backgroundImage.match(/url\(["']?([^"')]+)/)?.[1] || '';
    const payload = { plat: NF_PLAT, text: document.getElementById('nfPostText').value, title: document.getElementById('nfHead').value, url: NF_CURRENT.url, img };
    try {
      await fetch('/api/drafts', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-User': user }, body: JSON.stringify(payload) });
      b.textContent = '✓ saved'; setTimeout(() => b.textContent = '💾 vault', 1500);
    } catch { b.textContent = '✗ failed'; }
  }

  async function nfOpenForge(item) {
    NF_CURRENT = item; NF_PLAT = 'twitter';
    let f = document.getElementById('nfForge');
    if (!f) { f = document.createElement('div'); f.id = 'nfForge'; document.body.appendChild(f); }
    f.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#06060a;display:flex;flex-direction:column;font-family:"SF Mono","JetBrains Mono","Menlo",monospace';

    f.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;padding:8px 14px;background:#0a0c12;border-bottom:1px solid #14161e;flex-shrink:0">
      <span style="font-size:.62rem;font-weight:700;color:#a855f7;letter-spacing:.15em;padding:3px 8px;background:#1a0d2e;border:1px solid #2d1856;border-radius:3px">FORGE</span>
      <span style="font-size:.58rem;color:#6b7280;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${nfEsc((item.title || '').slice(0, 80))}</span>
      <a href="${nfEsc(item.url || '')}" target="_blank" style="font-size:.55rem;color:#5b8aff;text-decoration:none">↗ source</a>
      <button id="nfForgeClose" style="background:#15171d;border:1px solid #1e2030;color:#9ba3af;padding:5px 14px;border-radius:3px;font-family:inherit;font-size:.6rem;cursor:pointer">✕ close</button>
    </div>
    <div style="flex:1;display:grid;grid-template-columns:260px 1fr 320px;gap:1px;background:#14161e;overflow:hidden;min-height:0">
      <div style="background:#0a0a0c;overflow-y:auto;padding:10px;scrollbar-width:thin">
        <div class="nf-forge-grp"><div class="nf-forge-lbl">headline</div>
          <input id="nfHead" class="nf-forge-input" value="${nfEsc((item.title || '').slice(0, 180))}">
        </div>
        <div class="nf-forge-grp"><div class="nf-forge-lbl">platform</div>
          <div class="nf-forge-row" id="nfPlatRow">
            <button class="nf-plat active" data-p="twitter">𝕏</button>
            <button class="nf-plat" data-p="instagram">IG</button>
            <button class="nf-plat" data-p="linkedin">LI</button>
            <button class="nf-plat" data-p="threads">@</button>
            <button class="nf-plat" data-p="facebook">FB</button>
          </div>
        </div>
        <div class="nf-forge-grp"><div class="nf-forge-lbl">tone</div>
          <select id="nfTone" class="nf-forge-input">
            <option value="alpha">🔥 alpha</option><option value="degen">💎 degen</option><option value="pro">▶ pro</option><option value="storyteller">📖 story</option><option value="contrarian">⚡ contrarian</option><option value="analyst">📊 analyst</option><option value="memey">😂 memey</option>
          </select>
        </div>
        <div class="nf-forge-grp"><div class="nf-forge-lbl">hook style</div>
          <select id="nfHook" class="nf-forge-input">
            <option value="auto">auto</option><option value="question">❓ question</option><option value="stat">📊 stat</option><option value="story">📖 story</option><option value="contrarian">⚡ hot take</option><option value="list">📋 list</option>
          </select>
        </div>
        <div class="nf-forge-grp"><div class="nf-forge-lbl">image style</div>
          <select id="nfImgStyle" class="nf-forge-input">
            <option value="editorial photo, cinematic lighting, premium magazine">editorial</option>
            <option value="dark moody, neon accents, dramatic">dark neon</option>
            <option value="3d render, octane, futuristic">3d render</option>
            <option value="minimal abstract, geometric shapes">abstract</option>
            <option value="oil painting, classical art">oil painting</option>
          </select>
        </div>
        <div class="nf-forge-grp"><div class="nf-forge-lbl">source</div>
          <div style="font-size:.58rem;color:#5a606c;line-height:1.4">${nfEsc((item.source || item.srcLabel || ''))}<br>${nfEsc((item.description || item.summary || item.body || '').slice(0, 200))}</div>
        </div>
      </div>
      <div style="background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px;overflow:hidden">
        <div id="nfImgBox" style="width:100%;max-width:512px;aspect-ratio:1;background:#0c0e14 center/cover no-repeat;border:1px solid #1e2030;border-radius:4px;position:relative">
          <div id="nfImgLoad" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#5a606c;font-size:.65rem;background:#0c0e14">⏳ generating image...</div>
        </div>
        <div style="display:flex;gap:4px;margin-top:8px">
          <button class="nf-act-prim" id="nfImgRegen" style="padding:6px 14px;font-size:.6rem">🔄 regenerate</button>
          <button id="nfImgDl" style="padding:6px 14px;font-size:.6rem;background:#15171d;border:1px solid #1e2030;color:#9ba3af;border-radius:3px;cursor:pointer;font-family:inherit">⬇ download</button>
        </div>
      </div>
      <div style="background:#0a0a0c;overflow-y:auto;padding:10px;scrollbar-width:thin;display:flex;flex-direction:column">
        <div class="nf-forge-grp" style="flex:1;display:flex;flex-direction:column">
          <div class="nf-forge-lbl">post text <b id="nfChars">0</b></div>
          <textarea id="nfPostText" class="nf-forge-ta" style="flex:1;min-height:200px" placeholder="generating..."></textarea>
        </div>
        <div style="display:flex;gap:4px;margin-top:6px">
          <button id="nfRegenText" style="flex:1;padding:8px;font-size:.62rem;background:#1e3056;border:1px solid #2a4276;color:#a8c4ff;border-radius:3px;cursor:pointer;font-family:inherit">⚡ generate</button>
          <button id="nfRemix" style="flex:1;padding:8px;font-size:.62rem;background:#15171d;border:1px solid #1e2030;color:#9ba3af;border-radius:3px;cursor:pointer;font-family:inherit">↻ remix</button>
        </div>
        <div style="display:flex;gap:4px;margin-top:4px">
          <button id="nfCopy" style="flex:1;padding:8px;font-size:.62rem;background:#15171d;border:1px solid #1e2030;color:#9ba3af;border-radius:3px;cursor:pointer;font-family:inherit">📋 copy</button>
          <button id="nfShare" style="flex:1;padding:8px;font-size:.62rem;background:#15171d;border:1px solid #1e2030;color:#9ba3af;border-radius:3px;cursor:pointer;font-family:inherit">🚀 share</button>
          <button id="nfSaveVault" style="flex:1;padding:8px;font-size:.62rem;background:#143020;border:1px solid #1f4630;color:#7ee0a4;border-radius:3px;cursor:pointer;font-family:inherit">💾 vault</button>
        </div>
      </div>
    </div>`;

    document.getElementById('nfForgeClose').onclick = () => { f.style.display = 'none'; };
    document.getElementById('nfImgRegen').onclick = () => nfGenImage(true);
    document.getElementById('nfImgDl').onclick = () => {
      const img = document.getElementById('nfImgBox');
      const url = img.style.backgroundImage.match(/url\(["']?([^"')]+)/)?.[1];
      if (url) { const a = document.createElement('a'); a.href = url; a.download = 'forge-' + Date.now() + '.jpg'; a.click(); }
    };
    document.getElementById('nfRegenText').onclick = () => nfGenText(false);
    document.getElementById('nfRemix').onclick = () => nfGenText(true);
    document.getElementById('nfCopy').onclick = () => {
      const b = document.getElementById('nfCopy');
      navigator.clipboard.writeText(document.getElementById('nfPostText').value);
      b.textContent = '✓ copied'; setTimeout(() => b.textContent = '📋 copy', 1000);
    };
    document.getElementById('nfShare').onclick = nfShare;
    document.getElementById('nfSaveVault').onclick = nfSave;
    document.getElementById('nfPostText').addEventListener('input', () => {
      document.getElementById('nfChars').textContent = document.getElementById('nfPostText').value.length;
    });
    document.querySelectorAll('#nfPlatRow .nf-plat').forEach(b => b.onclick = () => {
      document.querySelectorAll('#nfPlatRow .nf-plat').forEach(x => x.classList.remove('active'));
      b.classList.add('active'); NF_PLAT = b.dataset.p; nfGenText(false);
    });

    if (NF_CURRENT.url && !(NF_CURRENT.description || NF_CURRENT.summary || NF_CURRENT.body || '').trim()) {
      try {
        const ogr = await fetch('/dl/og?u=' + encodeURIComponent(NF_CURRENT.url));
        const ogd = await ogr.json();
        if (ogd.ok) { if (ogd.description) NF_CURRENT.description = ogd.description; if (ogd.title && !NF_CURRENT.title) NF_CURRENT.title = ogd.title; }
      } catch {}
    }
    nfGenImage(false);
    nfGenText(false);
  }

  window.nfOpenForge = nfOpenForge;
})();
