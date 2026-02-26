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
              className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 w-[192px] z-10"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Phone body */}
              <div
                style={{
                  background: "linear-gradient(145deg, #2e2e2e 0%, #181818 50%, #202020 100%)",
                  borderRadius: "3rem",
                  padding: "8px",
                  boxShadow:
                    "0 60px 120px rgba(0,0,0,0.85), 0 0 55px rgba(255,107,53,0.15), inset 0 1px 0 rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ borderRadius: "2.6rem", aspectRatio: "9/19.5", background: "#000" }}
                >
                  {/* Dynamic Island */}
                  <div
                    className="absolute top-[10px] left-1/2 -translate-x-1/2 z-30"
                    style={{
                      width: "76px", height: "26px",
                      background: "#000",
                      borderRadius: "999px",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                    }}
                  />
                  {/* Status bar fade */}
                  <div
                    className="absolute top-0 left-0 right-0 h-14 z-20 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.72), transparent)" }}
                  />
                  {/* Ken Burns — screenshot */}
                  <motion.img
                    src="/images/app-flow-1.jpg"
                    alt="Blip app — send payment"
                    className="w-full h-full object-cover"
                    animate={{ scale: [1, 1.07, 1], x: [0, -5, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Glass specular */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 45%)" }}
                  />
                </div>
              </div>
              {/* Orange glow under phone */}
              <div
                className="absolute -bottom-3 left-[15%] right-[15%] h-5 rounded-full blur-xl"
                style={{ background: "rgba(255,107,53,0.38)" }}
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

              {/* Phone peeking from bottom */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[126px] z-10"
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div
                  className="rounded-t-2xl overflow-hidden h-[168px]"
                  style={{
                    border: "1px solid rgba(105,65,255,0.25)",
                    borderBottom: "none",
                    boxShadow: "0 -30px 55px rgba(105,65,255,0.18)",
                  }}
                >
                  <motion.img
                    src="/images/app-flow-2.jpg"
                    alt="Blip — merchant matching"
                    className="w-full h-full object-cover object-top"
                    animate={{ scale: [1.05, 1, 1.05] }}
                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(6,0,20,0.65) 0%, transparent 50%)" }}
                  />
                </div>
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

              {/* App screen peeking */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[108px] z-10"
                animate={{ y: [10, 0, 10] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
              >
                <div
                  className="rounded-t-xl overflow-hidden h-[68px]"
                  style={{ border: "1px solid rgba(0,229,153,0.18)", borderBottom: "none" }}
                >
                  <motion.img
                    src="/images/app-flow-4.jpg"
                    alt="Blip — settled"
                    className="w-full h-full object-cover object-top"
                    animate={{ scale: [1.04, 1, 1.04] }}
                    transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                  />
                </div>
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
            {/* Mini phone peek, bottom-right */}
            <motion.div
              className="absolute bottom-0 right-6 w-[88px] z-10"
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div
                className="rounded-t-2xl overflow-hidden h-[132px]"
                style={{ border: "1px solid rgba(255,107,53,0.2)", borderBottom: "none" }}
              >
                <motion.img
                  src="/images/app-flow-3.jpg"
                  alt="Blip — verify escrow"
                  className="w-full h-full object-cover object-top"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
              </div>
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
              src="/images/showcase-1.jpg"
              alt="Blip app showcase"
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
