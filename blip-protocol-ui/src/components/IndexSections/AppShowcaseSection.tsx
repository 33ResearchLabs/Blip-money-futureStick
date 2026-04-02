import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, memo } from "react";
import TradePhoneUI from "../TradePhoneUI";

/* ============================================
   APP SHOWCASE — Apple-style bento grid
   Real app screenshots inside phone / browser
   device frames. Ken Burns zoom + scroll parallax.

   Layout:
   Row 1: [Big hero phone (5/12)] [2×2 grid (7/12)]
          └─ orange / app-flow-1    ├─ purple / app-flow-2
                                    ├─ green checkmark / app-flow-4
                                    └─ browser / merchant-dashboard
   Row 2: [app-flow-3] [showcase-1 full-bleed] [showcase-2 full-bleed]
   ============================================ */

const AppShowcaseSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* Three parallax depths — cards move at different rates on scroll */
  const p1 = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const p2 = useTransform(scrollYProgress, [0, 1], [25, -50]);
  const p3 = useTransform(scrollYProgress, [0, 1], [100, -25]);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-40 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* ── Section header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/50 dark:text-white/40 font-semibold">
              The App
            </span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="heading-h2 text-black dark:text-white text-center"
          style={{
            marginBottom: 24,
          }}
        >
          Built to be felt.
        </motion.h2>

        {/* ══════════════════════════════════════════════════════════
            ROW 1 — Big phone + 2×2 right grid
            ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* ── CARD 1 — Hero iPhone, orange ──────────────────────── */}
          <motion.div
            style={{
              y: p1,
              background:
                "linear-gradient(145deg, #2a1200 0%, #0d0a14 55%, #0a0e1a 100%)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5 relative rounded-3xl overflow-hidden"
          >
            <TradePhoneUI />
            <div className="relative z-10 px-6 pb-6">
              <div className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-1">
                Step 01
              </div>
              <h3 className="text-white font-semibold text-base leading-snug">
                Best rates, instant liquidity
              </h3>
              <p className="text-white/35 text-xs mt-1">
                Seamless multi-corridor transfers, instantly.
              </p>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN — 2×2 ─────────────────────────────── */}
          <div className="md:col-span-7 grid grid-cols-2 gap-4">
            {/* CARD 2 — Matching, purple */}
            <motion.div
              style={{
                y: p2,
                background: "linear-gradient(145deg, #060014 0%, #090011 100%)",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative rounded-3xl overflow-hidden h-[280px] md:h-[293px]"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 80% 20%, rgba(105,65,255,0.22) 0%, transparent 60%)",
                }}
              />
              <div className="absolute top-7 right-7 z-20 text-white/12 font-mono text-xs">
                02
              </div>

              {/* Phone peeking from bottom — with frame */}
              <motion.div
                className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-[136px] z-10"
                style={{ willChange: "transform" }}
                animate={{ y: [8, -8, 8] }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(160deg, #2a2a2a 0%, #181818 50%, #222 100%)",
                    borderRadius: "1.6rem 1.6rem 0 0",
                    padding: "6px 6px 0 6px",
                    boxShadow:
                      "0 -30px 55px rgba(105,65,255,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderBottom: "none",
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      borderRadius: "1.2rem 1.2rem 0 0",
                      height: "180px",
                      background: "#000",
                    }}
                  >
                    {/* Mini Dynamic Island */}
                    <div
                      className="absolute top-[6px] left-1/2 -translate-x-1/2 z-30"
                      style={{
                        width: "44px",
                        height: "14px",
                        background: "#000",
                        borderRadius: "999px",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                      }}
                    />
                    {/* Coded matching screen */}
                    <div
                      className="absolute inset-0 flex flex-col"
                      style={{ background: "#0a0a0a", paddingTop: "24px" }}
                    >
                      <div className="px-3 py-2">
                        <div className="text-[7px] text-white/30 uppercase tracking-widest font-medium mb-2">
                          Finding match
                        </div>
                      </div>
                      {/* Animated pulse */}
                      <div className="flex-1 flex items-center justify-center relative">
                        <motion.div
                          className="absolute w-12 h-12 rounded-full"
                          style={{
                            border: "1px solid rgba(105,65,255,0.3)",
                            willChange: "transform, opacity",
                          }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            background: "rgba(105,65,255,0.2)",
                            border: "1px solid rgba(105,65,255,0.3)",
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6941ff"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                          </svg>
                        </div>
                      </div>
                      {/* Merchant found row */}
                      <div className="px-3 pb-3">
                        <div
                          className="flex items-center gap-1.5 p-2 rounded-lg"
                          style={{
                            background: "rgba(105,65,255,0.08)",
                            border: "1px solid rgba(105,65,255,0.12)",
                          }}
                        >
                          <div className="w-4 h-4 rounded-full bg-[#6941ff]/30 flex items-center justify-center">
                            <span className="text-[6px] font-bold text-[#6941ff]">
                              M
                            </span>
                          </div>
                          <div>
                            <div className="text-[7px] text-white/70 font-semibold">
                              Merchant #4821
                            </div>
                            <div className="text-[6px] text-white/30">
                              Dubai · 4.9★ · 1,200+ trades
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Glass highlight */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)",
                      }}
                    />
                  </div>
                </div>
                {/* Purple glow under phone */}
                <div
                  className="absolute -bottom-2 left-[15%] right-[15%] h-4 rounded-full blur-xl"
                  style={{ background: "rgba(105,65,255,0.25)" }}
                />
              </motion.div>

              <div className="relative z-20 p-6">
                <div className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-1">
                  Step 02
                </div>
                <h3 className="text-white font-semibold text-base leading-snug">
                  Matched in
                  <br />
                  ~8 seconds
                </h3>
              </div>
            </motion.div>

            {/* CARD 3 — Settled, green */}
            <motion.div
              style={{
                y: p3,
                background: "linear-gradient(145deg, #001108 0%, #000d06 100%)",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative rounded-3xl overflow-hidden h-[280px] md:h-[293px]"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 45%, rgba(0,229,153,0.14) 0%, transparent 60%)",
                }}
              />

              {/* Pulse rings + check */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[1.5, 1].map((scale, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: `${scale * 62}px`,
                      height: `${scale * 62}px`,
                      border: "1px solid rgba(0,229,153,0.16)",
                      willChange: "transform, opacity",
                    }}
                    animate={{ scale: [1, 1.28, 1], opacity: [0.55, 0, 0.55] }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
                <motion.div
                  className="relative w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: "#00e599",
                    boxShadow: "0 0 40px rgba(0,229,153,0.55)",
                  }}
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>

              {/* App screen peeking — with frame */}
              <motion.div
                className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-[116px] z-10"
                style={{ willChange: "transform" }}
                animate={{ y: [10, 0, 10] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.5,
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(160deg, #2a2a2a 0%, #181818 50%, #222 100%)",
                    borderRadius: "1.4rem 1.4rem 0 0",
                    padding: "5px 5px 0 5px",
                    boxShadow:
                      "0 -20px 40px rgba(0,229,153,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderBottom: "none",
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      borderRadius: "1rem 1rem 0 0",
                      height: "80px",
                      background: "#000",
                    }}
                  >
                    {/* Coded settled confirmation */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center"
                      style={{ background: "#0a0a0a" }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center mb-1.5"
                        style={{ background: "#00e599" }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="text-[8px] font-bold text-white">
                        Settled
                      </div>
                      <div className="text-[6px] text-white/30 mt-0.5">
                        1,837.50 AED
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="absolute -bottom-2 left-[15%] right-[15%] h-3 rounded-full blur-lg"
                  style={{ background: "rgba(0,229,153,0.18)" }}
                />
              </motion.div>

              <div className="relative z-20 p-6">
                <div className="font-display text-2xl font-bold text-[#00e599] tracking-tight">
                  420ms
                </div>
                <div className="text-white/30 text-xs mt-0.5 uppercase tracking-wider font-semibold">
                  Settlement finality
                </div>
              </div>
            </motion.div>

            {/* CARD 4 — Browser / merchant dashboard (spans 2 cols) */}
            <motion.div
              style={{ y: p2, background: "#080808" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-2 relative rounded-3xl overflow-hidden h-[246px] md:h-[258px]"
            >
              {/* Inset browser */}
              <div
                className="absolute inset-[14px] rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
                }}
              >
                {/* Chrome bar */}
                <div
                  className="flex items-center gap-1.5 px-4 py-[10px]"
                  style={{
                    background: "#1c1c1c",
                    borderBottom: "1px solid rgba(255,255,255,0.055)",
                  }}
                >
                  <div className="flex gap-[5px]">
                    <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                    <div className="w-[11px] h-[11px] rounded-full bg-[#ffbd2e]" />
                    <div className="w-[11px] h-[11px] rounded-full bg-[#28ca42]" />
                  </div>
                  <div
                    className="flex-1 mx-3 flex items-center gap-2 px-3 py-[5px] rounded"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth={2}
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: "rgba(255,255,255,0.28)" }}
                    >
                      dashboard.blip.money/merchant
                    </span>
                    <div className="ml-auto flex items-center gap-1.5">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-[#00e599]"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span
                        className="text-[9px] font-semibold"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>
                {/* Screenshot — slow Ken Burns pan */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: "calc(100% - 38px)" }}
                >
                  <motion.img
                    src="/images/merchant-dashboard.webp"
                    alt="Blip merchant dashboard"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                    style={{ willChange: "transform" }}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{
                      duration: 22,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 5,
                    }}
                  />
                  {/* Right edge fade */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to right, transparent 55%, rgba(8,8,8,0.5) 100%)",
                    }}
                  />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-7 right-7 z-10 text-right">
                <div className="text-white text-sm font-semibold mb-0.5">
                  Merchant Dashboard
                </div>
                <div className="text-white/30 text-xs">
                  Live P&L · Active orders · Blipscan
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            ROW 2 — Three landscape cards
            ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {/* Card 5 — Escrow / app-flow-3 */}
          <motion.div
            style={{
              y: p1,
              background: "linear-gradient(145deg, #120600 0%, #0a0a0a 100%)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative rounded-3xl overflow-hidden h-[210px]"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 25% 80%, rgba(255,107,53,0.15) 0%, transparent 55%)",
              }}
            />
            {/* Mini phone peek, bottom-right — with frame */}
            <motion.div
              className="absolute bottom-[-4px] right-5 w-[96px] z-10"
              style={{ willChange: "transform" }}
              animate={{ y: [6, -6, 6] }}
              transition={{
                duration: 8.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(160deg, #2a2a2a 0%, #181818 50%, #222 100%)",
                  borderRadius: "1.3rem 1.3rem 0 0",
                  padding: "5px 5px 0 5px",
                  boxShadow:
                    "0 -20px 40px rgba(255,107,53,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderBottom: "none",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: "0.9rem 0.9rem 0 0",
                    height: "140px",
                    background: "#000",
                  }}
                >
                  {/* Mini Dynamic Island */}
                  <div
                    className="absolute top-[5px] left-1/2 -translate-x-1/2 z-30"
                    style={{
                      width: "36px",
                      height: "12px",
                      background: "#000",
                      borderRadius: "999px",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                    }}
                  />
                  {/* Coded escrow screen */}
                  <div
                    className="absolute inset-0 flex flex-col"
                    style={{ background: "#0a0a0a", paddingTop: "20px" }}
                  >
                    <div className="px-2.5 py-1.5">
                      <div className="text-[6px] text-white/30 uppercase tracking-widest font-medium">
                        Escrow
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center px-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center mb-1"
                        style={{
                          background: "black",
                          border: "white",
                        }}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <div className="text-[7px] font-bold text-white">
                        500 USDT
                      </div>
                      <div className="text-[5.5px] text-white/25 mt-0.5">
                        Locked on-chain
                      </div>
                      {/* Progress bar */}
                      <div
                        className="w-full mt-2 h-[3px] rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, #ff6b35, #ff8f5a)",
                            transformOrigin: "left",
                            willChange: "transform",
                          }}
                          animate={{ scaleX: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </div>
                      <div className="text-[5px] text-white/20 mt-1">
                        Verifying...
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)",
                    }}
                  />
                </div>
              </div>
              <div
                className="absolute -bottom-2 left-[10%] right-[10%] h-3 rounded-full blur-lg"
                style={{ background: "rgba(255,107,53,0.15)" }}
              />
            </motion.div>
            <div className="relative z-20 p-6">
              <div className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-1">
                Step 03
              </div>
              <h3 className="text-white font-semibold text-base leading-snug">
                Escrow
                <br />
                secured
              </h3>
            </div>
          </motion.div>

          {/* Card 6 — Wallet with falling tokens animation */}
          <motion.div
            style={{
              y: p3,
              background:
                "linear-gradient(145deg, #0a0014 0%, #050008 50%, #000 100%)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative rounded-3xl overflow-hidden h-[210px]"
          >
            {/* Subtle radial glow behind wallet */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 75%, rgba(255,107,53,0.12) 0%, transparent 60%)",
              }}
            />

            {/* Falling tokens — all converge to wallet center */}
            {[
              { icon: "₿", color: "#f7931a", startX: -40, delay: 0, size: 28 },
              { icon: "Ξ", color: "#627eea", startX: 10, delay: 0.9, size: 26 },
              { icon: "◎", color: "#9945ff", startX: 50, delay: 1.8, size: 24 },
              {
                icon: "₮",
                color: "#26a17b",
                startX: -20,
                delay: 2.7,
                size: 26,
              },
              { icon: "◆", color: "#2775ca", startX: 35, delay: 3.6, size: 22 },
            ].map((token, i) => (
              <motion.div
                key={i}
                className="absolute z-30 flex items-center justify-center rounded-full"
                style={{
                  left: "50%",
                  width: token.size + 10,
                  height: token.size + 10,
                  background: `${token.color}22`,
                  border: `1px solid ${token.color}55`,
                  boxShadow: `0 0 16px ${token.color}44`,
                  willChange: "transform, opacity",
                }}
                animate={{
                  x: [token.startX, token.startX * 0.3, 0],
                  y: ["-30px", "55px", "105px"],
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1, 0.9, 0.3],
                }}
                transition={{
                  duration: 2,
                  delay: token.delay,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  times: [0, 0.2, 0.7, 1],
                }}
              >
                <span
                  style={{
                    color: token.color,
                    fontSize: token.size * 0.55,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {token.icon}
                </span>
              </motion.div>
            ))}

            {/* Wallet — large, centered in lower half */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
              {/* Glow pulse behind wallet */}
              <motion.div
                className="absolute -inset-4 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(255,107,53,0.25) 0%, transparent 70%)",
                  filter: "blur(10px)",
                  willChange: "opacity",
                }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="relative flex items-center justify-center"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  width="110"
                  height="88"
                  viewBox="0 0 110 88"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Wallet flap/top */}
                  <path
                    d="M14 20V14C14 8.48 18.48 4 24 4H86C91.52 4 96 8.48 96 14V20"
                    fill="#1e1e1e"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1.5"
                  />
                  {/* Wallet body */}
                  <rect
                    x="6"
                    y="20"
                    width="98"
                    height="62"
                    rx="10"
                    fill="#1a1a1a"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1.5"
                  />
                  {/* Inner shadow line */}
                  <rect
                    x="12"
                    y="28"
                    width="86"
                    height="46"
                    rx="6"
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                  {/* Card slot on right */}
                  <rect
                    x="70"
                    y="36"
                    width="28"
                    height="22"
                    rx="5"
                    fill="#111"
                    stroke="rgba(255,107,53,0.35)"
                    strokeWidth="1"
                  />
                  {/* Clasp circle */}
                  <circle cx="84" cy="47" r="5" fill="#ff6b35" opacity="0.8" />
                  {/* Blip logo text */}
                  <text
                    x="30"
                    y="55"
                    fill="rgba(255,255,255,0.12)"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                    letterSpacing="0.08em"
                  >
                    BLIP
                  </text>
                </svg>
              </motion.div>
            </div>

            {/* Top-left caption */}
            <div className="relative z-20 p-6">
              <div className="text-white text-sm font-semibold">
                Non custodial
                <br />
                wallet
              </div>
            </div>
          </motion.div>

          {/* Card 7 — showcase-2, pan effect */}
          <motion.div
            style={{ y: p2 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="relative rounded-3xl overflow-hidden h-[210px]"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Global reach"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ willChange: "transform" }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <div className="absolute top-6 left-6 z-10">
              <div className="text-white text-sm font-semibold">
                Global reach
              </div>
              <div className="text-white/80 text-xs mt-0.5">
                150+ countries · Any currency
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
    </section>
  );
};

export default memo(AppShowcaseSection);
