import { memo } from "react";

/* ═══════════════════════════════════════════════════════════
   TradePhoneUI — Coded iPhone mockup · P2P Trade USDT screen
   ═══════════════════════════════════════════════════════════ */

const TradePhoneUI = () => {
  const cardBg = "rgba(255,255,255,0.05)";
  const cardBorder = "rgba(255,255,255,0.08)";
  const activeTabBg = "rgba(255,255,255,0.10)";
  const inactiveTabBg = "rgba(255,255,255,0.04)";
  const divider = "rgba(255,255,255,0.07)";
  const muted = "rgba(255,255,255,0.28)";
  const sub = "rgba(255,255,255,0.42)";

  return (
    <div className="relative w-full flex items-center justify-center pt-4 pb-2">
      {/* Phone frame */}
      <div
        className="relative mx-auto"
        style={{
          width: 232,
          height: 490,
          background: "linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 50%, #222 100%)",
          borderRadius: 38,
          padding: 8,
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Screen */}
        <div
          className="relative w-full h-full flex flex-col overflow-hidden"
          style={{ borderRadius: 30, background: "#080810" }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 pt-2 pb-1 shrink-0">
            <span className="text-[8px] font-semibold text-white/80">9:41</span>
            <div style={{ width: 56, height: 16, background: "#000", borderRadius: 999, boxShadow: "0 0 0 1px rgba(255,255,255,0.05)" }} />
            <div className="flex items-center gap-[3px]">
              <svg width="10" height="7" viewBox="0 0 12 8" fill="none">
                <rect x="0" y="5" width="2" height="3" rx="0.5" fill="white" opacity="0.8" />
                <rect x="3" y="3.5" width="2" height="4.5" rx="0.5" fill="white" opacity="0.8" />
                <rect x="6" y="2" width="2" height="6" rx="0.5" fill="white" opacity="0.8" />
                <rect x="9" y="0" width="2" height="8" rx="0.5" fill="white" opacity="0.8" />
              </svg>
              <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                <path d="M5 7.5a0.5 0.5 0 1 0 0-1 0.5 0.5 0 0 0 0 1z" fill="white" opacity="0.8" />
                <path d="M3 5.5a3 3 0 0 1 4 0" stroke="white" strokeWidth="1" opacity="0.8" strokeLinecap="round" />
                <path d="M1 3.5a6 6 0 0 1 8 0" stroke="white" strokeWidth="1" opacity="0.8" strokeLinecap="round" />
              </svg>
              <svg width="14" height="7" viewBox="0 0 16 8" fill="none">
                <rect x="0.5" y="0.5" width="13" height="7" rx="1.5" stroke="white" strokeWidth="0.8" opacity="0.5" />
                <rect x="1.5" y="1.5" width="11" height="5" rx="0.8" fill="white" opacity="0.8" />
                <rect x="14" y="2.5" width="1.5" height="3" rx="0.5" fill="white" opacity="0.4" />
              </svg>
            </div>
          </div>

          {/* Content — fixed layout, no scroll */}
          <div className="flex-1 flex flex-col px-3 pb-2" style={{ gap: 6 }}>

            {/* Header */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>←</span>
              <div>
                <div style={{ fontSize: 6, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600 }}>
                  P2P Exchange
                </div>
                <div style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
                  ✦ Trade USDT
                </div>
              </div>
            </div>

            {/* Buy / Sell toggle */}
            <div
              className="flex gap-1 p-0.5 rounded-xl shrink-0"
              style={{ background: inactiveTabBg, border: `1px solid ${cardBorder}` }}
            >
              {["Buy", "Sell"].map((tab) => (
                <div
                  key={tab}
                  className="flex-1 rounded-lg text-center"
                  style={{
                    padding: "5px 0",
                    background: tab === "Buy" ? activeTabBg : "transparent",
                    fontWeight: 700,
                    fontSize: 10,
                    color: tab === "Buy" ? "#fff" : muted,
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Live rate card */}
            <div
              className="rounded-xl shrink-0"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, padding: "8px 10px" }}
            >
              <p style={{ fontSize: 6, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: muted, marginBottom: 3 }}>
                LIVE RATE · USDT / AED
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1 }}>3.670</p>
                  <p style={{ fontSize: 8, color: "#10b981", fontWeight: 600, marginTop: 1 }}>▲ +0.24% today</p>
                </div>
                <svg width="60" height="24">
                  <path d="M0,20 C8,16 16,22 24,17 S40,11 48,13 S54,9 60,7" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div
                className="flex justify-between mt-2 pt-2"
                style={{ borderTop: `1px solid ${divider}`, fontSize: 7, color: muted, fontWeight: 700, letterSpacing: "0.08em" }}
              >
                <span>7D LOW 3.651</span>
                <span>HIGH 3.694</span>
              </div>
            </div>

            {/* Amount input card */}
            <div
              className="rounded-xl shrink-0"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, padding: "8px 10px" }}
            >
              <p style={{ fontSize: 6, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: muted, marginBottom: 3 }}>
                YOU PAY (AED)
              </p>
              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>558</span>
                  <span style={{ fontSize: 9, fontWeight: 600, color: muted }}>AED</span>
                </div>
                <p style={{ fontSize: 8, color: sub }}>≈ 152.00 USDT</p>
              </div>
              <div
                className="flex justify-between mt-2 pt-2"
                style={{ borderTop: `1px solid ${divider}` }}
              >
                {[
                  { label: "RATE", val: "3.670" },
                  { label: "FEE", val: "2.5%" },
                  { label: "YOU GET", val: "152 USDT" },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p style={{ fontSize: 6, fontWeight: 900, letterSpacing: "0.12em", color: muted, textTransform: "uppercase" }}>{label}</p>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#fff", marginTop: 1 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pay via */}
            <div className="shrink-0">
              <p style={{ fontSize: 6, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: muted, marginBottom: 4 }}>
                PAY VIA
              </p>
              <div className="flex gap-1.5">
                {[
                  { label: "Bank Transfer", sub: "Wire / IBAN", active: true },
                  { label: "Cash", sub: "Meet in person", active: false },
                ].map(({ label, sub: s, active }) => (
                  <div
                    key={label}
                    className="flex-1 rounded-xl"
                    style={{
                      padding: "6px 8px",
                      background: active ? activeTabBg : inactiveTabBg,
                      border: `1px solid ${active ? "rgba(255,255,255,0.14)" : cardBorder}`,
                    }}
                  >
                    <p style={{ fontSize: 8, fontWeight: 700, color: "#fff" }}>{label}</p>
                    <p style={{ fontSize: 7, color: muted, marginTop: 1 }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="shrink-0">
              <p style={{ fontSize: 6, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", color: muted, marginBottom: 4 }}>
                PRIORITY
              </p>
              <div className="flex gap-1.5">
                {[
                  { label: "Fastest", val: "3.0%", color: "#f97316" },
                  { label: "Best Rate", val: "2.5%", color: "#3b82f6" },
                  { label: "Cheapest", val: "1.5%", color: "#10b981" },
                ].map(({ label, val, color }, i) => (
                  <div
                    key={label}
                    className="flex-1 rounded-xl text-center"
                    style={{
                      padding: "5px 4px",
                      background: i === 1 ? activeTabBg : inactiveTabBg,
                      border: `1px solid ${i === 1 ? "rgba(255,255,255,0.14)" : cardBorder}`,
                    }}
                  >
                    <p style={{ fontSize: 7, fontWeight: 600, color: sub }}>{label}</p>
                    <p style={{ fontSize: 8, fontWeight: 800, color, marginTop: 1 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              className="w-full rounded-xl font-bold flex items-center justify-center gap-1 shrink-0"
              style={{ padding: "9px 0", background: "#fff", color: "#000", fontSize: 11, letterSpacing: "-0.01em" }}
            >
              Buy 152 USDT ↗
            </button>
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-2 shrink-0">
            <div style={{ width: 44, height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 999 }} />
          </div>

          {/* Glass highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 35%)" }}
          />
        </div>
      </div>

      {/* Glow under phone */}
      <div
        className="absolute bottom-0 left-1/4 right-1/4 h-8 rounded-full blur-2xl"
        style={{ background: "rgba(255,107,53,0.2)" }}
      />
    </div>
  );
};

export default memo(TradePhoneUI);
