import { SEO } from "@/components";

/* ─────────────────────────────────────────────────────────────
   AppLanding — the main page for app.blip.money
   Design: "04 Cream" layout, Black + Orange skin, no-scroll.
   One screen. Two apps. Centered chooser, decorative corner mocks.
───────────────────────────────────────────────────────────── */

const BLIP_USER_WEB   = "/dashboard";
const BLIP_MARKET_WEB = "/merchant-dashboard";

function PhoneMock() {
  return (
    <div style={{
      width: 248, borderRadius: 34, padding: 11,
      background: "linear-gradient(160deg,#2a241c,#0c0a07)",
      border: "1px solid rgba(0,0,0,.2)",
      boxShadow: "0 40px 80px -34px rgba(16,14,12,.55), inset 0 1px 0 rgba(255,255,255,.08)",
      color: "#f5f3ef",
    }}>
      <div style={{ background: "#0c0a07", borderRadius: 25, padding: "16px 15px 14px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--mono, monospace)", fontSize: 11, color: "#615c54", marginBottom: 14 }}>
          <span style={{ width: 46, height: 5, borderRadius: 3, background: "rgba(255,255,255,.18)", display: "inline-block" }} />
          <span>9:41</span>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".18em", color: "#615c54", textTransform: "uppercase" }}>Balance</div>
        <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1, marginTop: 4, color: "#fff" }}>$2,400</div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: "#615c54", fontWeight: 500, marginTop: 5 }}>≈ ₹1,99,920</div>
        <div style={{ display: "flex", gap: 7, margin: "16px 0 14px" }}>
          {["Buy","Sell","Send","Scan"].map((t,i) => (
            <div key={t} style={{ flex: 1, textAlign: "center", fontSize: 12, fontWeight: 700, padding: "9px 0", borderRadius: 11, background: i === 0 ? "#f97026" : "rgba(255,255,255,.05)", color: i === 0 ? "#fff" : "#615c54" }}>{t}</div>
          ))}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 9.5, letterSpacing: ".18em", color: "#615c54", textTransform: "uppercase", margin: "4px 0 8px" }}>Recent</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.05)" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#f97026", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>M</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#fff" }}>Maya K.</div>
            <div style={{ fontSize: 9.5, color: "#615c54", fontFamily: "monospace" }}>2m ago</div>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 12.5, fontWeight: 700, color: "#4cc98c" }}>+₹2,400</span>
        </div>
      </div>
    </div>
  );
}

function DashMock() {
  return (
    <div style={{
      width: 420, borderRadius: 14, overflow: "hidden", color: "#f5f3ef",
      background: "#0c0a07", border: "1px solid rgba(255,255,255,.08)",
      boxShadow: "0 30px 60px -30px rgba(16,14,12,.5)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", background: "#13100b", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "#fff" }}>BLIP <em style={{ color: "#ff8a4d" }}>MARKET</em></span>
        <span style={{ display: "flex", gap: 14, marginLeft: 14 }}>
          {["Orders","Analytics"].map(n => <span key={n} style={{ fontSize: 10.5, color: "#615c54" }}>{n}</span>)}
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#ff8a4d", background: "rgba(249,112,38,.14)", padding: "4px 9px", borderRadius: 7 }}>$45,280</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "108px 1fr" }}>
        <div style={{ padding: 14, borderRight: "1px solid rgba(255,255,255,.06)" }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: ".16em", color: "#615c54", textTransform: "uppercase" }}>Balance</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", marginTop: 3, color: "#fff" }}>$45k</div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#ff8a4d", fontWeight: 600, marginTop: 2 }}>↑ +$1,247</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 42, marginTop: 16 }}>
            {[30,55,40,70,50,100,60].map((h,i) => (
              <div key={i} style={{ flex: 1, background: i === 5 ? "#f97026" : "rgba(255,255,255,.12)", borderRadius: 2, height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div style={{ padding: 12 }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: ".16em", color: "#615c54", textTransform: "uppercase", marginBottom: 8 }}>Pending</div>
          {[
            { av: "P", name: "parth.sol", sub: "200 USDT", tag: "BUY", tagColor: "#4cc98c", tagBg: "rgba(76,201,140,.16)" },
            { av: "M", name: "maya.eth",  sub: "150 USDT", tag: "SELL", tagColor: "#ef7b72", tagBg: "rgba(214,73,63,.18)" },
          ].map(o => (
            <div key={o.name} style={{ display: "flex", alignItems: "center", gap: 9, padding: 8, borderRadius: 9 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "#33302a", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{o.av}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "monospace", fontSize: 11.5, fontWeight: 600, color: "#fff" }}>{o.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: "#615c54" }}>{o.sub}</div>
              </div>
              <span style={{ fontFamily: "monospace", fontSize: 9.5, fontWeight: 700, padding: "3px 8px", borderRadius: 6, letterSpacing: ".04em", color: o.tagColor, background: o.tagBg }}>{o.tag}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderTop: "1px solid rgba(255,255,255,.06)", fontFamily: "monospace", fontSize: 10, color: "#9a958c" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4cc98c" }} />
        3 orders in progress
      </div>
    </div>
  );
}

const AppleSVG = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
    <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8zM14.3 5.4c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.7-1.3z"/>
  </svg>
);

const AndroidSVG = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
    <path d="M17.6 9.5l1.6-2.8a.3.3 0 00-.5-.3l-1.6 2.8A9.3 9.3 0 0012 8c-1.9 0-3.7.5-5.1 1.2L5.3 6.4a.3.3 0 10-.5.3l1.6 2.8C3.6 11.1 2 13.7 2 16.7h20c0-3-1.6-5.6-4.4-7.2zM7 14.4a.9.9 0 110-1.8.9.9 0 010 1.8zm10 0a.9.9 0 110-1.8.9.9 0 010 1.8z"/>
  </svg>
);

const GlobeSVG = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={12} cy={12} r={9}/><path d="M3 12h18M12 3a15 15 0 010 18 15 15 0 010-18"/>
  </svg>
);

const DesktopSVG = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <rect x={3} y={4} width={18} height={12} rx={2}/><path d="M8 20h8M12 16v4"/>
  </svg>
);

const BlipSignalSVG = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#f97026" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h4l2.5-7 4 14 2.5-9 1.5 2H22"/>
  </svg>
);

const ChartSVG = () => (
  <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#f97026" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4v16h16M8 14l3-4 3 3 4-6"/>
  </svg>
);

export default function AppLanding() {
  return (
    <>
      <SEO
        title="Blip — Two apps. One network."
        description="Open the Blip money app to send & receive globally, or launch Blip Market to run a merchant desk and earn on every fill."
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,600;1,700;1,800;1,900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .al-root {
          font-family: "Archivo", system-ui, sans-serif;
          background: #0a0a0a;
          color: #f6f4f1;
          height: 100dvh;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: fixed;
          inset: 0;
          -webkit-font-smoothing: antialiased;
        }
        .al-root::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(920px 540px at 50% -8%, rgba(249,112,38,.18), transparent 62%),
            radial-gradient(620px 520px at 100% 4%, rgba(249,112,38,.07), transparent 55%);
        }

        /* ── Nav ── */
        .al-nav {
          height: 62px;
          flex: none;
          display: flex;
          align-items: center;
          gap: 22px;
          padding: 0 clamp(20px,3vw,40px);
          background: #000;
          position: relative;
          z-index: 10;
        }
        .al-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -.02em;
          color: #fff;
          text-decoration: none;
        }
        .al-brand em { font-style: italic; font-weight: 600; }
        .al-logo {
          width: 32px; height: 32px; border-radius: 9px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(249,112,38,.5);
          display: grid; place-items: center; flex-shrink: 0;
        }
        .al-status {
          display: flex; align-items: center; gap: 7px;
          font-family: "JetBrains Mono", monospace;
          font-size: 10.5px; font-weight: 600; letter-spacing: .14em;
          color: #9a958c;
          padding-left: 18px;
          border-left: 1px solid rgba(255,255,255,.09);
        }
        .al-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #f97026;
          box-shadow: 0 0 0 0 rgba(249,112,38,.6);
          animation: al-pulse 2s infinite;
          flex-shrink: 0;
        }
        @keyframes al-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(249,112,38,.5); }
          70%  { box-shadow: 0 0 0 7px rgba(249,112,38,0); }
          100% { box-shadow: 0 0 0 0 rgba(249,112,38,0); }
        }
        .al-nav-links {
          display: flex; gap: 24px; margin-left: auto;
        }
        .al-nav-links a {
          color: #9a958c; font-size: 14px; font-weight: 500;
          text-decoration: none; transition: color .2s;
        }
        .al-nav-links a:hover { color: #fff; }
        .al-signin {
          padding: 9px 16px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,.15);
          color: #fff; font-size: 13.5px; font-weight: 700;
          font-family: inherit; cursor: pointer;
          background: rgba(255,255,255,.03);
          transition: border-color .2s, background .2s;
        }
        .al-signin:hover { border-color: rgba(255,255,255,.35); background: rgba(255,255,255,.07); }

        /* ── Main stage ── */
        .al-main {
          flex: 1; min-height: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          padding: 0 clamp(24px,5vw,72px);
          z-index: 1;
        }

        /* ── Corner decorations ── */
        .al-deco { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
        .al-deco-phone {
          position: absolute; left: -46px; bottom: -150px;
          transform: rotate(12deg) scale(.92); opacity: .85;
        }
        .al-deco-dash {
          position: absolute; right: -70px; bottom: -120px;
          transform: rotate(-9deg) scale(.96); opacity: .85;
        }

        /* ── Eyebrow ── */
        .al-eyebrow {
          display: inline-flex; align-items: center; gap: 9px;
          font-family: "JetBrains Mono", monospace;
          font-size: 11.5px; font-weight: 600; letter-spacing: .2em;
          text-transform: uppercase; color: #8f8a82;
          margin-bottom: 18px;
          position: relative; z-index: 3;
          white-space: nowrap;
        }

        /* ── Headline ── */
        .al-headline {
          font-weight: 800;
          line-height: .92;
          letter-spacing: -.035em;
          font-size: clamp(38px, 5.6vw, 70px);
          color: #f6f4f1;
          position: relative; z-index: 3;
        }
        .al-headline em { font-style: italic; }

        /* ── Chooser grid ── */
        .al-chooser {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          max-width: 800px;
          width: 100%;
          margin-top: 34px;
          text-align: left;
          position: relative; z-index: 3;
        }

        /* ── Card ── */
        .al-card {
          background: #141414;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 30px 70px -42px #000;
          transition: border-color .25s, transform .25s cubic-bezier(.22,.61,.36,1), box-shadow .25s;
        }
        .al-card:hover {
          border-color: rgba(249,112,38,.42);
          transform: translateY(-4px);
          box-shadow: 0 40px 90px -40px rgba(249,112,38,.25);
        }
        .al-card-head {
          display: flex; align-items: center; gap: 14px;
          padding-bottom: 22px; margin-bottom: 22px;
          border-bottom: 1px solid rgba(255,255,255,.10);
        }
        .al-card-icon {
          width: 50px; height: 50px; border-radius: 15px;
          flex-shrink: 0; display: grid; place-items: center;
        }
        .al-card-icon.user {
          background: linear-gradient(150deg,#ff8a4d,#f2691e);
          box-shadow: 0 10px 24px -10px rgba(249,112,38,.6);
        }
        .al-card-icon.market {
          background: #000;
          border: 1px solid rgba(249,112,38,.4);
        }
        .al-card-name {
          font-weight: 800; font-size: 21px;
          letter-spacing: -.02em; line-height: 1;
          color: #f6f4f1;
        }
        .al-card-name em { font-style: italic; font-weight: 600; }
        .al-card-sub {
          color: #8f8a82; font-size: 14px; margin-top: 6px;
        }
        .al-label {
          font-family: "JetBrains Mono", monospace;
          font-size: 10.5px; letter-spacing: .16em;
          text-transform: uppercase; color: #5b574f;
          margin-bottom: 10px;
        }
        .al-label.mt { margin-top: 18px; }

        /* ── Buttons ── */
        .al-btn {
          display: flex; align-items: center; justify-content: center; gap: 9px;
          width: 100%; padding: 15px 18px; border-radius: 999px;
          font-family: inherit; font-weight: 700; font-size: 15.5px;
          cursor: pointer; border: none;
          transition: transform .25s cubic-bezier(.22,.61,.36,1), box-shadow .25s, background .2s;
        }
        .al-btn:active { transform: scale(.98) translateY(1px) !important; }
        .al-btn.orange {
          background: #f97026; color: #fff;
          box-shadow: 0 14px 34px -16px rgba(249,112,38,.65);
        }
        .al-btn.orange:hover {
          background: #ff8a4d; transform: translateY(-2px);
          box-shadow: 0 22px 46px -16px rgba(249,112,38,.7);
        }
        .al-btn.white {
          background: #fff; color: #0a0a0a;
          box-shadow: 0 14px 34px -16px rgba(0,0,0,.5);
        }
        .al-btn.white:hover { background: #f0ede8; transform: translateY(-2px); }

        /* ── Platform pills ── */
        .al-pills { display: flex; gap: 8px; }
        .al-pill {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 12px 6px; border-radius: 13px; font-size: 13.5px; font-weight: 600;
          font-family: inherit; cursor: pointer;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.18);
          color: #f6f4f1;
          transition: background .2s, border-color .2s, transform .2s cubic-bezier(.22,.61,.36,1);
        }
        .al-pill:hover {
          background: rgba(249,112,38,.12);
          border-color: #f97026;
          transform: translateY(-2px);
        }

        /* ── Mobile ── */
        @media (max-width: 820px) {
          .al-nav-links { display: none; }
          .al-status    { display: none; }
          .al-signin    { margin-left: auto; }
          .al-deco      { display: none; }
          .al-main      { justify-content: flex-start; padding-top: 28px; overflow-y: auto; }
          .al-chooser   { grid-template-columns: 1fr; }
          .al-headline  { font-size: clamp(34px,9vw,48px); }
        }
        @media (max-width: 520px) {
          .al-nav { height: 58px; padding: 0 16px; gap: 12px; }
          .al-card { padding: 20px; }
          .al-pills { flex-wrap: wrap; }
          .al-pill  { flex: 1 1 calc(50% - 4px); }
        }
      `}</style>

      <div className="al-root">
        {/* ── Nav ── */}
        <nav className="al-nav">
          <a href="https://blip.money" className="al-brand">
            <div className="al-logo"><BlipSignalSVG /></div>
            Blip <em>money</em>
          </a>
          <div className="al-status">
            <div className="al-dot" />
            MAINNET · LIVE
          </div>
          <div className="al-nav-links">
            <a href="/how-it-works">How it works</a>
            <a href="/market">Network</a>
          </div>
          <button
            className="al-signin"
            onClick={() => window.location.href = "/signin"}
          >
            Sign in
          </button>
        </nav>

        {/* ── Main ── */}
        <main className="al-main">
          {/* corner mocks */}
          <div className="al-deco">
            <div className="al-deco-phone"><PhoneMock /></div>
            <div className="al-deco-dash"><DashMock /></div>
          </div>

          {/* eyebrow */}
          <div className="al-eyebrow">
            <div className="al-dot" />
            Open liquidity network
          </div>

          {/* headline */}
          <h1 className="al-headline">Two apps. <em>One network.</em></h1>

          {/* chooser */}
          <div className="al-chooser">

            {/* ── Blip money (user) ── */}
            <div className="al-card">
              <div className="al-card-head">
                <div className="al-card-icon user">
                  <BlipSignalSVG />
                </div>
                <div>
                  <div className="al-card-name">Blip <em>money</em></div>
                  <div className="al-card-sub">Send &amp; receive money, anywhere</div>
                </div>
              </div>
              <div className="al-label">Use it now</div>
              <button
                className="al-btn orange"
                onClick={() => window.location.href = BLIP_USER_WEB}
              >
                <GlobeSVG />
                Open web app
              </button>
              <div className="al-label mt">Download the app</div>
              <div className="al-pills">
                <button className="al-pill" onClick={() => {}}>
                  <AppleSVG />iOS
                </button>
                <button className="al-pill" onClick={() => {}}>
                  <AndroidSVG />Android
                </button>
              </div>
            </div>

            {/* ── Blip Market (merchant) ── */}
            <div className="al-card">
              <div className="al-card-head">
                <div className="al-card-icon market">
                  <ChartSVG />
                </div>
                <div>
                  <div className="al-card-name">Blip <em>Market</em></div>
                  <div className="al-card-sub">Run a merchant desk &amp; earn</div>
                </div>
              </div>
              <div className="al-label">Use it now</div>
              <button
                className="al-btn white"
                onClick={() => window.location.href = BLIP_MARKET_WEB}
              >
                <DesktopSVG />
                Open web app
              </button>
              <div className="al-label mt">Download the app</div>
              <div className="al-pills">
                <button className="al-pill" onClick={() => {}}>
                  <AppleSVG />iOS
                </button>
                <button className="al-pill" onClick={() => {}}>
                  <AndroidSVG />Android
                </button>
                <button className="al-pill" onClick={() => {}}>
                  <AppleSVG />Mac
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
