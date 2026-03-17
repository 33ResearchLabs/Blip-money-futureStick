import { motion } from "framer-motion";
import { memo } from "react";

/* ═══════════════════════════════════════════════════════════
   TradePhoneUI — Coded iPhone mockup matching actual app UI
   P2P Exchange → Trade USDT screen
   ═══════════════════════════════════════════════════════════ */

const TradePhoneUI = () => {
  return (
    <div className="relative w-full flex items-center justify-center pt-4 pb-2">
      {/* Phone frame */}
      <div
        className="relative mx-auto"
        style={{
          width: 232,
          height: 490,
          background:
            "linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 50%, #222 100%)",
          borderRadius: 38,
          padding: 8,
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Screen */}
        <div
          className="relative w-full h-full overflow-hidden flex flex-col"
          style={{
            borderRadius: 30,
            background: "#0c0c0c",
          }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <span className="text-[8px] font-semibold text-white/80">9:41</span>
            {/* Dynamic Island */}
            <div
              style={{
                width: 62,
                height: 18,
                background: "#000",
                borderRadius: 999,
                boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
              }}
            />
            <div className="flex items-center gap-[3px]">
              {/* Signal bars */}
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <rect x="0" y="5" width="2" height="3" rx="0.5" fill="white" opacity="0.8" />
                <rect x="3" y="3.5" width="2" height="4.5" rx="0.5" fill="white" opacity="0.8" />
                <rect x="6" y="2" width="2" height="6" rx="0.5" fill="white" opacity="0.8" />
                <rect x="9" y="0" width="2" height="8" rx="0.5" fill="white" opacity="0.8" />
              </svg>
              {/* WiFi */}
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M5 7.5a0.5 0.5 0 1 0 0-1 0.5 0.5 0 0 0 0 1z" fill="white" opacity="0.8" />
                <path d="M3 5.5a3 3 0 0 1 4 0" stroke="white" strokeWidth="1" opacity="0.8" strokeLinecap="round" />
                <path d="M1 3.5a6 6 0 0 1 8 0" stroke="white" strokeWidth="1" opacity="0.8" strokeLinecap="round" />
              </svg>
              {/* Battery */}
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                <rect x="0.5" y="0.5" width="13" height="7" rx="1.5" stroke="white" strokeWidth="0.8" opacity="0.5" />
                <rect x="1.5" y="1.5" width="11" height="5" rx="0.8" fill="white" opacity="0.8" />
                <rect x="14" y="2.5" width="1.5" height="3" rx="0.5" fill="white" opacity="0.4" />
              </svg>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 flex flex-col overflow-hidden px-3.5">
            {/* Header — P2P Exchange */}
            <div className="flex items-center gap-2 mb-2.5 mt-1">
              <div className="text-[8px] text-white/30 font-medium">←</div>
              <div>
                <div className="text-[6px] text-white/25 uppercase tracking-[0.2em] font-medium">
                  P2P Exchange
                </div>
                <div className="text-[11px] font-bold text-white tracking-tight flex items-center gap-1">
                  <span>✦</span> Trade USDT
                </div>
              </div>
            </div>

            {/* Buy / Sell cards */}
            <div className="flex gap-1.5 mb-3">
              <div
                className="flex-1 rounded-lg p-2"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-center gap-1 mb-1">
                  <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                    <path d="M8 2L2 8M2 8V3M2 8H7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                  </svg>
                </div>
                <div className="text-[8px] font-bold text-white">Buy USDT</div>
                <div className="text-[6px] text-white/25 uppercase tracking-wider mt-0.5">
                  Pay AED
                </div>
              </div>
              <div
                className="flex-1 rounded-lg p-2"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-1 mb-1">
                  <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                    <path d="M2 8L8 2M8 2V7M8 2H3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                  </svg>
                </div>
                <div className="text-[8px] font-semibold text-white/40">Sell USDT</div>
                <div className="text-[6px] text-white/15 uppercase tracking-wider mt-0.5">
                  Get AED
                </div>
              </div>
            </div>

            {/* YOU PAY */}
            <div className="text-center mb-1">
              <div className="text-[6px] text-white/25 uppercase tracking-[0.25em] font-medium mb-1.5">
                You pay
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[10px] text-[#26a17b] font-bold">₮</span>
                <span className="text-[26px] font-bold text-white tracking-tighter leading-none">
                  5000
                </span>
                <span className="text-[8px] text-white/25 font-medium self-end mb-[3px]">
                  USDT
                </span>
              </div>
            </div>

            {/* AED equivalent */}
            <div className="text-center mb-1">
              <div className="text-[13px] font-bold text-white/50 tracking-tight" style={{ direction: "ltr" }}>
                ١٨,٣٥٠ <span className="text-[8px] text-white/25">AED</span>
              </div>
              <div className="text-[6px] text-white/20 uppercase tracking-wider mt-1">
                Balance: 51080 OJ USDT
              </div>
            </div>

            {/* Swap icon */}
            <div className="flex justify-center my-1.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M5 2V8M5 8L3 6M5 8L7 6" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Mini chart + fee */}
            <div className="flex items-center justify-between mb-2">
              {/* Mini chart */}
              <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
                <path
                  d="M1 12 L5 10 L9 11 L13 7 L17 8 L21 4 L25 6 L29 3 L33 5 L35 4"
                  stroke="#ff6b35"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M1 12 L5 10 L9 11 L13 7 L17 8 L21 4 L25 6 L29 3 L33 5 L35 4 V16 H1Z"
                  fill="url(#chartGrad)"
                  opacity="0.15"
                />
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b35" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex items-center gap-2">
                <span className="text-[5.5px] text-white/25">
                  FEE <span className="text-white/40 font-semibold">3.0%</span>
                </span>
                <span className="text-[5.5px] text-white/25">
                  TRADER GETS <span className="text-[#00e599]/60 font-semibold">1.00%</span>
                </span>
              </div>
            </div>

            {/* PAY VIA */}
            <div className="mb-2">
              <div className="text-[6px] text-white/20 uppercase tracking-[0.2em] font-medium mb-1.5">
                Pay via
              </div>
              <div className="flex gap-1.5">
                <div
                  className="flex-1 flex items-center gap-1.5 p-1.5 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                      <rect x="1" y="4" width="22" height="16" rx="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[7px] text-white/80 font-semibold">Bank Transfer</div>
                    <div className="text-[5px] text-white/25 uppercase tracking-wider">Wire / IBAN</div>
                  </div>
                </div>
                <div
                  className="flex-1 flex items-center gap-1.5 p-1.5 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <path d="M12 12h.01" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[7px] text-white/40 font-semibold">Cash</div>
                    <div className="text-[5px] text-white/15 uppercase tracking-wider">USDT in person</div>
                  </div>
                </div>
              </div>
            </div>

            {/* PRIORITY */}
            <div className="mb-2.5">
              <div className="text-[6px] text-white/20 uppercase tracking-[0.2em] font-medium mb-1.5">
                Priority
              </div>
              <div className="flex gap-1">
                {[
                  { icon: "⚡", label: "Fastest", value: "2%", active: true },
                  { icon: "★", label: "Best Rate", value: "1.5%", active: false },
                  { icon: "◎", label: "Cheapest", value: "1%", active: false },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="flex-1 flex flex-col items-center py-1.5 rounded-lg"
                    style={{
                      background: p.active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${p.active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}`,
                    }}
                  >
                    <span className="text-[8px] mb-0.5" style={{ opacity: p.active ? 0.8 : 0.3 }}>
                      {p.icon}
                    </span>
                    <span
                      className="text-[6px] font-semibold"
                      style={{ color: p.active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}
                    >
                      {p.label}
                    </span>
                    <span
                      className="text-[5px] mt-0.5"
                      style={{ color: p.active ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)" }}
                    >
                      {p.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* CTA Button */}
            <div className="pb-3">
              <motion.div
                className="w-full py-2.5 rounded-2xl text-center"
                style={{
                  background: "#f5f5f0",
                }}
              >
                <span className="text-[9px] font-bold text-black tracking-wide">
                  Buy 5000 USDT
                </span>
                <span className="text-[9px] text-black/40 ml-1">↗</span>
              </motion.div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center pb-2">
              <div
                className="rounded-full"
                style={{
                  width: 48,
                  height: 4,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 999,
                }}
              />
            </div>
          </div>

          {/* Glass highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 35%)",
            }}
          />
        </div>
      </div>

      {/* Orange glow under phone */}
      <div
        className="absolute bottom-0 left-1/4 right-1/4 h-8 rounded-full blur-2xl"
        style={{ background: "rgba(255,107,53,0.2)" }}
      />
    </div>
  );
};

export default memo(TradePhoneUI);
