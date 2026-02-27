import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white tracking-tight leading-[1.05] text-center mb-6"
        >
          Built to be felt.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-base md:text-lg text-black/50 dark:text-white/40 font-medium max-w-lg mx-auto text-center leading-relaxed mb-16"
        >
          Every screen engineered for speed. Every tap designed to disappear.
        </motion.p>

        {/* ══════════════════════════════════════════════════════════
            ROW 1 — Big phone + 2×2 right grid
            ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* ── CARD 1 — Hero iPhone, orange ──────────────────────── */}
          <motion.div
            style={{
              y: p1,
              background: "linear-gradient(145deg, #1c0900 0%, #0f0f0f 55%, #000 100%)",
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5 relative rounded-3xl overflow-hidden h-[520px] md:h-[610px]"
          >
            {/* Radial orange glow at bottom */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[360px] h-[360px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,107,53,0.24) 0%, transparent 70%)" }}
            />

            {/* Live badge */}
            <div className="absolute top-7 left-7 z-20">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)" }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[#00e599]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">
                  Blip · Live
                </span>
              </div>
            </div>
            <div className="absolute top-7 right-7 z-20 text-white/15 font-mono text-xs">01</div>

            {/* ── Floating iPhone ── */}
            <motion.div
              className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 w-[220px] z-10"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Phone chassis — titanium frame */}
              <div
                style={{
                  background: "linear-gradient(160deg, #3a3a3a 0%, #1a1a1a 40%, #2a2a2a 60%, #1a1a1a 100%)",
                  borderRadius: "3.2rem",
                  padding: "10px",
                  boxShadow:
                    "0 60px 120px rgba(0,0,0,0.9), 0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,107,53,0.18), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Side button hints */}
                <div
                  className="absolute right-[-2px] top-[28%] w-[3px] h-[32px] rounded-r-sm"
                  style={{ background: "linear-gradient(to bottom, #3a3a3a, #252525)" }}
                />
                <div
                  className="absolute left-[-2px] top-[22%] w-[3px] h-[18px] rounded-l-sm"
                  style={{ background: "linear-gradient(to bottom, #3a3a3a, #252525)" }}
                />
                <div
                  className="absolute left-[-2px] top-[32%] w-[3px] h-[28px] rounded-l-sm"
                  style={{ background: "linear-gradient(to bottom, #3a3a3a, #252525)" }}
                />
                <div
                  className="absolute left-[-2px] top-[42%] w-[3px] h-[28px] rounded-l-sm"
                  style={{ background: "linear-gradient(to bottom, #3a3a3a, #252525)" }}
                />

                <div
                  className="relative overflow-hidden"
                  style={{ borderRadius: "2.6rem", aspectRatio: "9/19.5", background: "#000" }}
                >
                  {/* Dynamic Island */}
                  <div
                    className="absolute top-[11px] left-1/2 -translate-x-1/2 z-30 flex items-center justify-center"
                    style={{
                      width: "82px", height: "24px",
                      background: "#000",
                      borderRadius: "999px",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.06), inset 0 0 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* Camera lens */}
                    <div
                      className="w-[7px] h-[7px] rounded-full ml-5"
                      style={{
                        background: "radial-gradient(circle, #1a1a3a 30%, #0a0a1a 70%)",
                        boxShadow: "0 0 2px rgba(100,100,255,0.15), inset 0 0 1px rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>

                  {/* Status bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-12 z-20 pointer-events-none flex items-center justify-between px-7 pt-1"
                  >
                    <span className="text-[8px] font-semibold text-white/60">9:41</span>
                    <div className="flex items-center gap-1">
                      <svg width="10" height="8" viewBox="0 0 16 12" fill="white" fillOpacity={0.6}>
                        <rect x="0" y="8" width="3" height="4" rx="0.5"/>
                        <rect x="4.5" y="5" width="3" height="7" rx="0.5"/>
                        <rect x="9" y="2" width="3" height="10" rx="0.5"/>
                        <rect x="13" y="0" width="3" height="12" rx="0.5"/>
                      </svg>
                      <svg width="12" height="8" viewBox="0 0 25 12" fill="none">
                        <rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke="white" strokeOpacity={0.5}/>
                        <rect x="2" y="2" width="14" height="8" rx="1" fill="#00e599"/>
                        <rect x="22.5" y="3.5" width="2" height="5" rx="1" fill="white" fillOpacity={0.4}/>
                      </svg>
                    </div>
                  </div>

                  {/* ── Coded Place Order Screen ── */}
                  <div className="absolute inset-0 z-10 flex flex-col" style={{ background: "#0a0a0a", paddingTop: "42px" }}>

                    {/* Nav bar */}
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                      <span className="text-[10px] font-semibold text-white tracking-wide">Place Order</span>
                      <div className="w-[14px]" />
                    </div>

                    {/* Amount section */}
                    <div className="flex flex-col items-center mt-3 mb-3">
                      <div className="text-[8px] text-white/30 uppercase tracking-widest mb-1.5 font-medium">You send</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[22px] font-bold text-white tracking-tight leading-none">500.00</span>
                        <span className="text-[9px] font-semibold text-[#ff6b35]">USDT</span>
                      </div>
                      {/* Swap arrow */}
                      <div className="my-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity={0.4} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 10l5 5 5-5" />
                        </svg>
                      </div>
                      <div className="text-[8px] text-white/30 uppercase tracking-widest mb-1.5 font-medium">Recipient gets</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[22px] font-bold text-white tracking-tight leading-none">1,837.50</span>
                        <span className="text-[9px] font-semibold text-[#00e599]">AED</span>
                      </div>
                    </div>

                    {/* Rate badge */}
                    <div className="mx-4 mb-3 flex justify-center">
                      <div
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{ background: "rgba(0,229,153,0.08)", border: "1px solid rgba(0,229,153,0.15)" }}
                      >
                        <div className="w-1 h-1 rounded-full bg-[#00e599]" />
                        <span className="text-[7px] text-[#00e599] font-semibold">1 USDT = 3.675 AED</span>
                      </div>
                    </div>

                    {/* Details card */}
                    <div
                      className="mx-3 rounded-xl p-3 flex-1"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      {[
                        { label: "Corridor", value: "UAE 🇦🇪" },
                        { label: "Network fee", value: "0.50 USDT" },
                        { label: "Blip fee", value: "Free" , highlight: true },
                        { label: "Settlement", value: "~8 sec" },
                        { label: "Escrow", value: "On-chain" },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between py-[5px]" style={i < 4 ? { borderBottom: "1px solid rgba(255,255,255,0.04)" } : {}}>
                          <span className="text-[7.5px] text-white/30 font-medium">{row.label}</span>
                          <span className={`text-[7.5px] font-semibold ${row.highlight ? "text-[#00e599]" : "text-white/70"}`}>{row.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Place Order button */}
                    <div className="px-3 pb-3 pt-2 mt-auto">
                      <motion.div
                        className="w-full py-2.5 rounded-2xl flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)",
                          boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
                        }}
                        animate={{ boxShadow: ["0 4px 20px rgba(255,107,53,0.4)", "0 4px 30px rgba(255,107,53,0.6)", "0 4px 20px rgba(255,107,53,0.4)"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <span className="text-[9px] font-bold text-white tracking-wide">Place Order</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Glass specular highlight */}
                  <div
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.02) 100%)",
                    }}
                  />

                  {/* Home indicator */}
                  <div
                    className="absolute bottom-[6px] left-1/2 -translate-x-1/2 z-30 w-[72px] h-[4px] rounded-full"
                    style={{ background: "rgba(255,255,255,0.25)" }}
                  />
                </div>
              </div>

              {/* Reflection / glow under phone */}
              <div
                className="absolute -bottom-4 left-[10%] right-[10%] h-8 rounded-full blur-2xl"
                style={{ background: "rgba(255,107,53,0.35)" }}
              />
              <div
                className="absolute -bottom-2 left-[20%] right-[20%] h-3 rounded-full blur-md"
                style={{ background: "rgba(255,107,53,0.2)" }}
              />
            </motion.div>

            {/* Caption */}
            <div className="absolute bottom-9 left-7 z-20">
              <h3 className="text-white font-display text-xl font-bold leading-tight mb-1">
                Initiate a transfer
              </h3>
              <p className="text-white/35 text-sm">USDT → any corridor, instantly</p>
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
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative rounded-3xl overflow-hidden h-[280px] md:h-[293px]"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(105,65,255,0.22) 0%, transparent 60%)" }}
              />
              <div className="absolute top-7 right-7 z-20 text-white/12 font-mono text-xs">02</div>

              {/* Phone peeking from bottom — with frame */}
              <motion.div
                className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-[136px] z-10"
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div
                  style={{
                    background: "linear-gradient(160deg, #2a2a2a 0%, #181818 50%, #222 100%)",
                    borderRadius: "1.6rem 1.6rem 0 0",
                    padding: "6px 6px 0 6px",
                    boxShadow: "0 -30px 55px rgba(105,65,255,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderBottom: "none",
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ borderRadius: "1.2rem 1.2rem 0 0", height: "180px", background: "#000" }}
                  >
                    {/* Mini Dynamic Island */}
                    <div
                      className="absolute top-[6px] left-1/2 -translate-x-1/2 z-30"
                      style={{
                        width: "44px", height: "14px",
                        background: "#000",
                        borderRadius: "999px",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                      }}
                    />
                    {/* Coded matching screen */}
                    <div className="absolute inset-0 flex flex-col" style={{ background: "#0a0a0a", paddingTop: "24px" }}>
                      <div className="px-3 py-2">
                        <div className="text-[7px] text-white/30 uppercase tracking-widest font-medium mb-2">Finding match</div>
                      </div>
                      {/* Animated pulse */}
                      <div className="flex-1 flex items-center justify-center relative">
                        <motion.div
                          className="absolute w-14 h-14 rounded-full"
                          style={{ border: "1px solid rgba(105,65,255,0.25)" }}
                          animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute w-10 h-10 rounded-full"
                          style={{ border: "1px solid rgba(105,65,255,0.35)" }}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                        />
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(105,65,255,0.2)", border: "1px solid rgba(105,65,255,0.3)" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6941ff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                          </svg>
                        </div>
                      </div>
                      {/* Merchant found row */}
                      <div className="px-3 pb-3">
                        <div className="flex items-center gap-1.5 p-2 rounded-lg" style={{ background: "rgba(105,65,255,0.08)", border: "1px solid rgba(105,65,255,0.12)" }}>
                          <div className="w-4 h-4 rounded-full bg-[#6941ff]/30 flex items-center justify-center">
                            <span className="text-[6px] font-bold text-[#6941ff]">M</span>
                          </div>
                          <div>
                            <div className="text-[7px] text-white/70 font-semibold">Merchant #4821</div>
                            <div className="text-[6px] text-white/30">Dubai · 4.9★ · 1,200+ trades</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Glass highlight */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)" }}
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
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative rounded-3xl overflow-hidden h-[280px] md:h-[293px]"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,229,153,0.14) 0%, transparent 60%)" }}
              />

              {/* Pulse rings + check */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[1.7, 1.3, 1].map((scale, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: `${scale * 62}px`,
                      height: `${scale * 62}px`,
                      border: "1px solid rgba(0,229,153,0.16)",
                    }}
                    animate={{ scale: [1, 1.28, 1], opacity: [0.55, 0, 0.55] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.35 }}
                  />
                ))}
                <motion.div
                  className="relative w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "#00e599", boxShadow: "0 0 40px rgba(0,229,153,0.55)" }}
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>

              {/* App screen peeking — with frame */}
              <motion.div
                className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-[116px] z-10"
                animate={{ y: [10, 0, 10] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
              >
                <div
                  style={{
                    background: "linear-gradient(160deg, #2a2a2a 0%, #181818 50%, #222 100%)",
                    borderRadius: "1.4rem 1.4rem 0 0",
                    padding: "5px 5px 0 5px",
                    boxShadow: "0 -20px 40px rgba(0,229,153,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderBottom: "none",
                  }}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ borderRadius: "1rem 1rem 0 0", height: "80px", background: "#000" }}
                  >
                    {/* Coded settled confirmation */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "#0a0a0a" }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center mb-1.5" style={{ background: "#00e599" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="text-[8px] font-bold text-white">Settled</div>
                      <div className="text-[6px] text-white/30 mt-0.5">1,837.50 AED</div>
                    </div>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)" }}
                    />
                  </div>
                </div>
                <div
                  className="absolute -bottom-2 left-[15%] right-[15%] h-3 rounded-full blur-lg"
                  style={{ background: "rgba(0,229,153,0.18)" }}
                />
              </motion.div>

              <div className="relative z-20 p-6">
                <div className="font-display text-2xl font-bold text-[#00e599] tracking-tight">420ms</div>
                <div className="text-white/30 text-xs mt-0.5 uppercase tracking-wider font-semibold">
                  Settlement finality
                </div>
              </div>
            </motion.div>

            {/* CARD 4 — Browser / merchant dashboard (spans 2 cols) */}
            <motion.div
              style={{ y: p2, background: "#080808" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
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
                  style={{ background: "#1c1c1c", borderBottom: "1px solid rgba(255,255,255,0.055)" }}
                >
                  <div className="flex gap-[5px]">
                    <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                    <div className="w-[11px] h-[11px] rounded-full bg-[#ffbd2e]" />
                    <div className="w-[11px] h-[11px] rounded-full bg-[#28ca42]" />
                  </div>
                  <div
                    className="flex-1 mx-3 flex items-center gap-2 px-3 py-[5px] rounded"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={2}>
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.28)" }}>
                      dashboard.blip.money/merchant
                    </span>
                    <div className="ml-auto flex items-center gap-1.5">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-[#00e599]"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>
                {/* Screenshot — slow Ken Burns pan */}
                <div className="relative overflow-hidden" style={{ height: "calc(100% - 38px)" }}>
                  <motion.img
                    src="/images/merchant-dashboard.png"
                    alt="Blip merchant dashboard"
                    className="w-full h-full object-cover object-top"
                    animate={{ scale: [1, 1.04, 1], x: [0, -10, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                  />
                  {/* Right edge fade */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to right, transparent 55%, rgba(8,8,8,0.5) 100%)" }}
                  />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-7 right-7 z-10 text-right">
                <div className="text-white text-sm font-semibold mb-0.5">Merchant Dashboard</div>
                <div className="text-white/30 text-xs">Live P&L · Active orders · Blipscan</div>
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative rounded-3xl overflow-hidden h-[210px]"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 25% 80%, rgba(255,107,53,0.15) 0%, transparent 55%)" }}
            />
            {/* Mini phone peek, bottom-right — with frame */}
            <motion.div
              className="absolute bottom-[-4px] right-5 w-[96px] z-10"
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div
                style={{
                  background: "linear-gradient(160deg, #2a2a2a 0%, #181818 50%, #222 100%)",
                  borderRadius: "1.3rem 1.3rem 0 0",
                  padding: "5px 5px 0 5px",
                  boxShadow: "0 -20px 40px rgba(255,107,53,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderBottom: "none",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ borderRadius: "0.9rem 0.9rem 0 0", height: "140px", background: "#000" }}
                >
                  {/* Mini Dynamic Island */}
                  <div
                    className="absolute top-[5px] left-1/2 -translate-x-1/2 z-30"
                    style={{
                      width: "36px", height: "12px",
                      background: "#000",
                      borderRadius: "999px",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                    }}
                  />
                  {/* Coded escrow screen */}
                  <div className="absolute inset-0 flex flex-col" style={{ background: "#0a0a0a", paddingTop: "20px" }}>
                    <div className="px-2.5 py-1.5">
                      <div className="text-[6px] text-white/30 uppercase tracking-widest font-medium">Escrow</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center px-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center mb-1" style={{ background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.2)" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <div className="text-[7px] font-bold text-white">500 USDT</div>
                      <div className="text-[5.5px] text-white/25 mt-0.5">Locked on-chain</div>
                      {/* Progress bar */}
                      <div className="w-full mt-2 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "linear-gradient(90deg, #ff6b35, #ff8f5a)" }}
                          animate={{ width: ["30%", "100%", "30%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                      <div className="text-[5px] text-white/20 mt-1">Verifying...</div>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)" }}
                  />
                </div>
              </div>
              <div
                className="absolute -bottom-2 left-[10%] right-[10%] h-3 rounded-full blur-lg"
                style={{ background: "rgba(255,107,53,0.15)" }}
              />
            </motion.div>
            <div className="relative z-20 p-6">
              <div className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold mb-1">Step 03</div>
              <h3 className="text-white font-semibold text-base leading-snug">Escrow<br />secured</h3>
            </div>
          </motion.div>

          {/* Card 6 — showcase-1, full-bleed with Ken Burns */}
          <motion.div
            style={{ y: p3 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative rounded-3xl overflow-hidden h-[210px]"
          >
            <motion.img
              src="/images/nonCustodial.webp"
              alt="Non-custodial wallet"
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ scale: [1, 1.07, 1], x: [0, -8, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }}
            />
            <div className="absolute bottom-6 left-6 z-10">
              <div className="text-white text-sm font-semibold">Non-custodial</div>
              <div className="text-white/40 text-xs mt-0.5">Your keys · Your funds</div>
            </div>
          </motion.div>

          {/* Card 7 — showcase-2, pan effect */}
          <motion.div
            style={{ y: p2 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="relative rounded-3xl overflow-hidden h-[210px]"
          >
            <motion.img
              src="/images/showcase-2.jpg"
              alt="Blip app showcase"
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ scale: [1.05, 1, 1.05], y: [0, -8, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)" }}
            />
            <div className="absolute bottom-6 left-6 z-10">
              <div className="text-white text-sm font-semibold">Global reach</div>
              <div className="text-white/40 text-xs mt-0.5">150+ countries · Any currency</div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
    </section>
  );
};

export default AppShowcaseSection;
