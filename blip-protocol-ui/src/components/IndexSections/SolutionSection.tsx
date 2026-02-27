import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Globe, Star } from "lucide-react";

/* ============================================
   SECTION 3: THE SOLUTION — Blip Protocol
   Left: copy + traits  |  Right: flow diagram
   ============================================ */

const traits = [
  {
    icon: Zap,
    label: "Instant settlement",
    desc: "Sub-second finality, on-chain",
  },
  {
    icon: Shield,
    label: "Escrow protection",
    desc: "Non-custodial, smart-contract enforced",
  },
  {
    icon: Star,
    label: "Reputation-based",
    desc: "Merchants earn trust over time",
  },
  {
    icon: Globe,
    label: "On-demand liquidity",
    desc: "Matched automatically from the network",
  },
];

const SolutionSection = () => {
  return (
    <section className="relative py-24 md:py-40 bg-[#FAF8F5] dark:bg-black overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-[30%] -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.05] dark:opacity-[0.08]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,53,0.8) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[40%] right-[20%] w-[350px] h-[350px] rounded-full opacity-[0.04] dark:opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,153,0.7) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* LEFT: Copy + traits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Label */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03]">
              <span className="text-[10px] uppercase tracking-[0.25em] text-black/50 dark:text-white/40 font-semibold">
                The solution
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.05] mb-5">
              The Blip
              <br />
              <span className="text-black/50 dark:text-white/40">
                Protocol.
              </span>
            </h2>

            <p className="text-base md:text-lg text-black/50 dark:text-white/40 font-medium leading-relaxed mb-10 max-w-md">
              A merchant-to-merchant settlement network. Liquidity is matched,
              funds are locked in escrow, and settlement is enforced on-chain —
              no intermediaries, no trust required.
            </p>

            {/* Trait list */}
            <div className="space-y-3">
              {traits.map((trait, i) => {
                const Icon = trait.icon;
                return (
                  <motion.div
                    key={trait.label}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-3.5 p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-all duration-300 group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-black/[0.07] dark:group-hover:bg-white/[0.07] transition-colors">
                      <Icon
                        className="w-4 h-4 text-black/50 dark:text-white/50"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-black dark:text-white">
                        {trait.label}
                      </div>
                      <div className="text-xs text-black/40 dark:text-white/30">
                        {trait.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT: Flow diagram */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center gap-4"
          >
            {/* Glow behind diagram */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="w-[300px] h-[300px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Merchant A card */}
            <motion.div
              className="relative w-full max-w-[320px] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.04] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-none backdrop-blur-sm"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25 }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-lg">
                    🇦🇪
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-black/30 dark:text-white/25 font-semibold">
                      Merchant · Dubai
                    </div>
                    <div className="text-sm font-semibold text-black dark:text-white">
                      Sends USDT
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-black dark:text-white font-mono">
                    $5,000
                  </div>
                  <div className="text-[9px] text-black/30 dark:text-white/25 font-mono">
                    USDT
                  </div>
                </div>
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

            {/* Connector — top arrow */}
            <div className="relative flex flex-col items-center w-px h-10">
              <div className="flex-1 w-px bg-gradient-to-b from-black/10 dark:from-white/10 to-[#ff6b35]/40" />
              {/* Animated pulse */}
              <motion.div
                className="absolute w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
                animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                style={{ left: "50%", transform: "translateX(-50%)" }}
              />
            </div>

            {/* Blip Escrow — center */}
            <motion.div
              className="relative w-full max-w-[320px] p-5 rounded-2xl border border-black dark:border-white bg-black dark:bg-white overflow-hidden"
              style={{
                boxShadow:
                  "0 0 50px rgba(255,107,53,0.15), 0 20px 60px -10px rgba(0,0,0,0.35)",
              }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 opacity-[0.04]"
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

              {/* Outer pulse rings */}
              <motion.div
                className="absolute -inset-3 rounded-3xl border border-[#ff6b35]/20"
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ff6b35] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 dark:text-black/40 font-semibold">
                      Protocol
                    </div>
                    <div className="text-sm font-bold text-white dark:text-black">
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
                    <span className="text-[9px] text-white/40 dark:text-black/40 font-medium">
                      Live
                    </span>
                  </div>
                  <div className="text-xs font-mono text-white/50 dark:text-black/40">
                    Locked · On-chain
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1 rounded-full bg-white/10 dark:bg-black/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff6b35] to-[#00e599]"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 2,
                    delay: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[9px] font-mono text-white/25 dark:text-black/25">
                <span>Initiated</span>
                <span>Matched</span>
                <span>Settled ✓</span>
              </div>
            </motion.div>

            {/* Connector — bottom arrow */}
            <div className="relative flex flex-col items-center w-px h-10">
              <div className="flex-1 w-px bg-gradient-to-b from-[#00e599]/40 to-black/10 dark:to-white/10" />
              <motion.div
                className="absolute w-1.5 h-1.5 rounded-full bg-[#00e599]"
                animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.6,
                }}
                style={{ left: "50%", transform: "translateX(-50%)" }}
              />
            </div>

            {/* Merchant B card */}
            <motion.div
              className="relative w-full max-w-[320px] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.04] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-none backdrop-blur-sm"
              whileHover={{ y: 2 }}
              transition={{ duration: 0.25 }}
            >
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-lg">
                    🇦🇪
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-black/30 dark:text-white/25 font-semibold">
                      Merchant · Dubai
                    </div>
                    <div className="text-sm font-semibold text-black dark:text-white">
                      Receives AED
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-black dark:text-white font-mono">
                    1361.47
                  </div>
                  <div className="text-[9px] text-black/30 dark:text-white/25 font-mono">
                    AED
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#00e599]/[0.08] dark:bg-[#00e599]/[0.06] border border-[#00e599]/20">
                <div className="w-2 h-2 rounded-full bg-[#00e599] flex-shrink-0" />
                <span className="text-xs text-black/60 dark:text-white/50 font-medium">
                  Settlement complete · 1.8s
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00e599] ml-auto flex-shrink-0" />
              </div>
            </motion.div>

            {/* Floating badge */}
            <motion.div
              className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block"
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <div className="px-3 py-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white/90 dark:bg-white/[0.06] backdrop-blur-sm shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)]">
                <div className="text-[9px] uppercase tracking-widest text-black/30 dark:text-white/30 font-semibold mb-0.5">
                  Avg time
                </div>
                <div className="text-sm font-bold text-black dark:text-white font-mono">
                  ~2s
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
    </section>
  );
};

export default SolutionSection;
