import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Globe, Star } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

const traits = [
  {
    icon: Zap,
    label: "Instant settlement",
    desc: "Sub-second finality, on-chain",
    accent: "#ff6b35",
  },
  {
    icon: Shield,
    label: "Escrow protection",
    desc: "Non-custodial, smart-contract enforced",
    accent: "#6941ff",
  },
  {
    icon: Star,
    label: "Reputation-based",
    desc: "Merchants earn trust over time",
    accent: "#00e599",
  },
  {
    icon: Globe,
    label: "On-demand liquidity",
    desc: "Matched automatically from the network",
    accent: "#ff6b35",
  },
];

/* ─── Animated flowing dot along a connection line ─── */
function FlowingDot({
  color,
  delay = 0,
  vertical = false,
}: {
  color: string;
  delay?: number;
  vertical?: boolean;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 6,
        height: 6,
        background: color,
        boxShadow: `0 0 8px ${color}, 0 0 16px ${color}40`,
        ...(vertical
          ? { left: "50%", transform: "translateX(-50%)" }
          : { top: "50%", transform: "translateY(-50%)" }),
      }}
      animate={
        vertical
          ? { top: ["-4px", "calc(100% + 4px)"], opacity: [0, 1, 1, 0] }
          : { left: ["-4px", "calc(100% + 4px)"], opacity: [0, 1, 1, 0] }
      }
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 0.5,
      }}
    />
  );
}

/* ─── Connection line between nodes ─── */
function ConnectionLine({
  color,
  vertical = false,
}: {
  color: string;
  vertical?: boolean;
}) {
  return (
    <div
      className={`relative ${vertical ? "w-px h-12 mx-auto" : "hidden lg:block flex-1 h-px my-auto"}`}
    >
      {/* Base line */}
      <div
        className={`absolute ${vertical ? "inset-x-0 inset-y-0 w-px mx-auto" : "inset-y-0 inset-x-0 h-px my-auto"}`}
        style={{
          background: `linear-gradient(${vertical ? "to bottom" : "to right"}, transparent, ${color}40, ${color}60, ${color}40, transparent)`,
        }}
      />
      {/* Flowing dots */}
      <FlowingDot color={color} delay={0} vertical={vertical} />
      <FlowingDot color={color} delay={1.2} vertical={vertical} />
    </div>
  );
}

const SolutionSection = () => {
  return (
    <section className="relative py-24 md:py-36 lg:py-44 bg-[#FAF8F5] dark:bg-black overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full opacity-[0.06] dark:opacity-[0.1]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,53,0.8) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] rounded-full opacity-[0.04] dark:opacity-[0.08]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,153,0.7) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.03] dark:opacity-[0.05]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(105,65,255,0.5) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ─── Header ─── */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* Pill label */}
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/50 dark:text-white/40 font-semibold">
              The solution
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            style={{
              fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              marginBottom: 24,
            }}
          >
            <span className="bg-gradient-to-br from-black via-black/80 to-black/50 dark:from-white dark:via-white/80 dark:to-white/40 bg-clip-text text-transparent">
              The Blip
            </span>
            <br />
            <span className="bg-gradient-to-br from-black/70 via-black/50 to-[#ff6b35]/60 dark:from-white/50 dark:via-white/30 dark:to-[#ff6b35]/50 bg-clip-text text-transparent">
              Protocol.
            </span>
          </motion.h2>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="h-[2px] mx-auto w-24 bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent mb-6"
          />

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg lg:text-xl text-black/60 dark:text-white/45 max-w-2xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            A merchant-to-merchant settlement network. Liquidity is matched,
            funds are locked in escrow, and settlement is enforced on-chain —
            no intermediaries, no trust required.
          </motion.p>
        </motion.div>

        {/* ─── Flow Visualization ─── */}
        <motion.div
          className="mb-20 md:mb-28"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: EASE }}
        >
          {/* Desktop: Horizontal flow */}
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-0 max-w-5xl mx-auto">
            {/* ── Merchant A ── */}
            <motion.div
              className="relative w-full max-w-[340px] lg:flex-1 p-5 md:p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.04] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] backdrop-blur-sm group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              whileHover={{ y: -3, transition: { duration: 0.25 } }}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#ff6b35]/[0.03] to-transparent" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-xl">
                  🇦🇪
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/25 font-semibold">
                    Merchant · Dubai
                  </div>
                  <div className="text-sm font-semibold text-black dark:text-white">
                    Sends USDT
                  </div>
                </div>
              </div>

              <div className="text-2xl md:text-3xl font-bold text-black dark:text-white font-mono mb-1">
                $5,000
              </div>
              <div className="text-xs text-black/40 dark:text-white/25 font-mono mb-4">
                USDT · Solana
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.04]">
                <motion.div
                  className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs text-black/40 dark:text-white/30 font-medium">
                  Awaiting liquidity match…
                </span>
              </div>
            </motion.div>

            {/* ── Connection: A → Escrow ── */}
            <ConnectionLine color="#ff6b35" />
            {/* Mobile: vertical connector */}
            <div className="lg:hidden">
              <ConnectionLine color="#ff6b35" vertical />
            </div>

            {/* ── Blip Escrow (Hero Node) ── */}
            <motion.div
              className="relative w-full max-w-[340px] lg:flex-1 z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            >
              {/* Outer glow */}
              <div className="absolute -inset-6 pointer-events-none">
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(255,107,53,0.12) 0%, transparent 70%)",
                  }}
                  animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Pulse rings */}
              <motion.div
                className="absolute -inset-3 rounded-3xl border border-[#ff6b35]/15 pointer-events-none"
                animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute -inset-6 rounded-3xl border border-[#ff6b35]/8 pointer-events-none"
                animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.05, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />

              <div
                className="relative p-5 md:p-6 rounded-2xl border border-black dark:border-white bg-black dark:bg-white overflow-hidden"
                style={{
                  boxShadow:
                    "0 0 60px rgba(255,107,53,0.15), 0 25px 60px -10px rgba(0,0,0,0.35)",
                }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, white 50%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                  }}
                />

                <div className="relative flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#ff6b35] flex items-center justify-center shadow-[0_0_20px_rgba(255,107,53,0.3)]">
                      <Zap className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.2em] text-white/50 dark:text-black/35 font-semibold">
                        Protocol
                      </div>
                      <div className="text-base font-bold text-white dark:text-black">
                        Blip Escrow
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end mb-1">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-[#00e599]"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-[9px] text-white/50 dark:text-black/35 font-medium">
                        Live
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-white/50 dark:text-black/35">
                      Locked · On-chain
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-white/10 dark:bg-black/10 overflow-hidden mb-2">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #ff6b35, #ff8c50, #00e599)",
                    }}
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 2.5,
                      delay: 0.6,
                      ease: EASE,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-white/40 dark:text-black/25">
                  <span>Initiated</span>
                  <span>Matched</span>
                  <span>Settled ✓</span>
                </div>

                {/* Stats row */}
                <div className="mt-4 pt-4 border-t border-white/[0.08] dark:border-black/[0.08] flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-white/35 dark:text-black/30 uppercase tracking-wider font-medium">
                      Avg. Time
                    </div>
                    <div className="text-lg font-bold text-white dark:text-black font-mono">
                      ~2s
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-white/35 dark:text-black/30 uppercase tracking-wider font-medium">
                      Fee
                    </div>
                    <div className="text-lg font-bold text-[#00e599] font-mono">
                      0%
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Connection: Escrow → B ── */}
            <ConnectionLine color="#00e599" />
            {/* Mobile: vertical connector */}
            <div className="lg:hidden">
              <ConnectionLine color="#00e599" vertical />
            </div>

            {/* ── Merchant B ── */}
            <motion.div
              className="relative w-full max-w-[340px] lg:flex-1 p-5 md:p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.04] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] backdrop-blur-sm group"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              whileHover={{ y: -3, transition: { duration: 0.25 } }}
            >
              {/* Bottom accent */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#00e599]/[0.03] to-transparent" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-xl">
                  🇦🇪
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/25 font-semibold">
                    Merchant · Dubai
                  </div>
                  <div className="text-sm font-semibold text-black dark:text-white">
                    Receives AED
                  </div>
                </div>
              </div>

              <div className="text-2xl md:text-3xl font-bold text-black dark:text-white font-mono mb-1">
                18,350
              </div>
              <div className="text-xs text-black/40 dark:text-white/25 font-mono mb-4">
                AED · Bank Transfer
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#00e599]/[0.08] dark:bg-[#00e599]/[0.06] border border-[#00e599]/20">
                <div className="w-2 h-2 rounded-full bg-[#00e599] flex-shrink-0" />
                <span className="text-xs text-black/60 dark:text-white/50 font-medium">
                  Settlement complete · 1.8s
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00e599] ml-auto flex-shrink-0" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ─── Traits Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {traits.map((trait, i) => {
            const Icon = trait.icon;
            return (
              <motion.div
                key={trait.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: EASE }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="relative p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-300 group cursor-default"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${trait.accent}08, transparent 70%)`,
                  }}
                />

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                  style={{
                    backgroundColor: `${trait.accent}08`,
                  }}
                >
                  <Icon
                    className="w-5 h-5 transition-colors duration-300"
                    style={{ color: `${trait.accent}90` }}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="text-sm font-semibold text-black dark:text-white mb-1">
                  {trait.label}
                </div>
                <div className="text-xs text-black/45 dark:text-white/30 leading-relaxed">
                  {trait.desc}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
    </section>
  );
};

export default SolutionSection;
