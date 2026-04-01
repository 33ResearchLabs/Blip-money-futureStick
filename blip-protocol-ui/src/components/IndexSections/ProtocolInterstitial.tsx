import { useRef, memo, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  {
    label: "Settlement speed",
    headline: "Best-in-class matching engine.",
    subline: "Settled before you blink.",
    desc: "Our proprietary matching engine processes orders in under 2 seconds. 150+ merchants compete simultaneously — the fastest, most reliable one wins your trade.",
    visual: "speed" as const,
  },
  {
    label: "Fees",
    headline: "The lowest fees. Guaranteed.",
    subline: "Merchants bid. You save.",
    desc: "Real-time auction between verified merchants drives your cost down to 1.5%. No hidden spreads. No markups. Transparent, every time.",
    visual: "rates" as const,
  },
  {
    label: "Matching engine",
    headline: "150+ merchants. One winner.",
    subline: "Matched in milliseconds.",
    desc: "Our engine evaluates reputation, speed, rate, and liquidity across 150+ merchants — then locks the best match instantly. You don't lift a finger.",
    visual: "engine" as const,
  },
  {
    label: "Proof",
    headline: "On-chain settlement.",
    subline: "Immutable. Verifiable. Always.",
    desc: "Every trade is recorded on Solana. Full transparency — no trust required. Verify any settlement, anytime, from anywhere in the world.",
    visual: "chain" as const,
  },
];

/* ─── Hooks ─── */
function useCountUp(target: number, duration: number, start: boolean, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start, decimals]);
  return decimals > 0 ? value.toFixed(decimals) : Math.floor(value);
}

function useTicker(interval: number, start: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!start) return;
    const id = setInterval(() => setTick((t) => t + 1), interval);
    return () => clearInterval(id);
  }, [interval, start]);
  return tick;
}

/* ─── Speed Visual: Live settlement timer ─── */
function SpeedVisual({ isInView }: { isInView: boolean }) {
  const [phase, setPhase] = useState<"idle" | "matching" | "settling" | "done">("idle");
  const [timer, setTimer] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    // Run settlement cycle
    const run = () => {
      setPhase("matching");
      setTimer(0);
      const startTime = Date.now();
      const interval = setInterval(() => {
        setTimer((Date.now() - startTime) / 1000);
      }, 30);
      setTimeout(() => {
        setPhase("settling");
      }, 600);
      setTimeout(() => {
        clearInterval(interval);
        setPhase("done");
      }, 1400);
      setTimeout(() => {
        setPhase("idle");
        setCycle((c) => c + 1);
      }, 4000);
    };
    run();
    const loop = setInterval(run, 5500);
    return () => { clearInterval(loop); };
  }, [isInView, cycle]);

  const displayTime = phase === "done" ? "1.38" : timer.toFixed(2);

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Main timer display */}
      <div className="text-center mb-6">
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(4rem, 10vw, 6rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: phase === "done" ? "#3ddc84" : "#1d1d1f",
            transition: "color 0.3s",
          }}
          className="dark:text-white"
        >
          {displayTime}<span className="text-[0.4em] opacity-40">s</span>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <motion.div
          className="w-2 h-2 rounded-full"
          animate={{
            backgroundColor: phase === "done" ? "#3ddc84" : phase === "idle" ? "rgba(0,0,0,0.15)" : "#ff6b35",
            scale: phase === "matching" || phase === "settling" ? [1, 1.4, 1] : 1,
          }}
          transition={{ duration: 0.5, repeat: phase === "matching" ? Infinity : 0, repeatType: "loop" }}
        />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{
          color: phase === "done" ? "#3ddc84" : phase === "idle" ? "rgba(0,0,0,0.25)" : "#ff6b35",
          transition: "color 0.3s",
        }}>
          {phase === "idle" ? "Ready" : phase === "matching" ? "Matching merchant..." : phase === "settling" ? "Settling..." : "Complete"}
        </span>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-1">
        {["Order", "Match", "Escrow", "Settle"].map((step, i) => {
          const stepIdx = phase === "idle" ? -1 : phase === "matching" ? 0 : phase === "settling" ? 2 : 3;
          const active = i <= stepIdx;
          return (
            <div key={step} className="flex-1">
              <motion.div
                className="h-1 rounded-full"
                animate={{
                  backgroundColor: active ? (phase === "done" ? "#3ddc84" : "#ff6b35") : "rgba(0,0,0,0.06)",
                }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              />
              <span className="block text-[9px] font-medium mt-1.5 text-center" style={{
                color: active ? (phase === "done" ? "#3ddc84" : "#ff6b35") : "rgba(0,0,0,0.2)",
                transition: "color 0.3s",
              }}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Rates Visual: Live auction feed ─── */
function RatesVisual({ isInView }: { isInView: boolean }) {
  const tick = useTicker(2000, isInView);
  const merchants = [
    { name: "AlphaFX", rate: 3.672, speed: "1.2s" },
    { name: "GulfTrade", rate: 3.668, speed: "0.9s" },
    { name: "SwiftExch", rate: 3.665, speed: "1.8s" },
    { name: "NovaP2P", rate: 3.671, speed: "1.1s" },
    { name: "CedarFX", rate: 3.669, speed: "2.1s" },
  ];

  // Shuffle best rate position based on tick
  const sorted = [...merchants].sort((a, b) => {
    const aRate = a.rate + (Math.sin(tick * 0.7 + merchants.indexOf(a)) * 0.003);
    const bRate = b.rate + (Math.sin(tick * 0.7 + merchants.indexOf(b)) * 0.003);
    return bRate - aRate;
  });

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">Live auction</span>
        </div>
        <span className="text-[10px] font-mono text-black/20 dark:text-white/20">USDT → AED</span>
      </div>

      {/* Merchant rows */}
      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout">
          {sorted.map((m, i) => {
            const liveRate = (m.rate + Math.sin(tick * 0.5 + i) * 0.002).toFixed(3);
            const isBest = i === 0;
            return (
              <motion.div
                key={m.name}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{
                  background: isBest ? "rgba(255,107,53,0.06)" : "rgba(0,0,0,0.02)",
                  border: isBest ? "1px solid rgba(255,107,53,0.15)" : "1px solid transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: isBest ? "#ff6b35" : "rgba(0,0,0,0.05)",
                      color: isBest ? "#fff" : "rgba(0,0,0,0.3)",
                    }}
                  >
                    {m.name.slice(0, 2)}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-black/80 dark:text-white/80 block leading-tight">{m.name}</span>
                    <span className="text-[10px] text-black/30 dark:text-white/30">{m.speed} avg</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono" style={{ color: isBest ? "#ff6b35" : "rgba(0,0,0,0.6)" }}>
                    {liveRate}
                  </span>
                  {isBest && (
                    <span className="block text-[8px] font-bold uppercase tracking-wider text-[#ff6b35]">Best rate</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Engine Visual: Live metrics dashboard ─── */
function EngineVisual({ isInView }: { isInView: boolean }) {
  const ordersProcessed = useCountUp(14847, 2, isInView);
  const avgMatch = useCountUp(0.8, 1.5, isInView, 1);
  const tick = useTicker(3000, isInView);
  const uptime = "99.97";

  const recentMatches = [
    { pair: "USDT → AED", time: "0.6s", amount: "$2,400" },
    { pair: "USDT → INR", time: "0.9s", amount: "$850" },
    { pair: "USDT → PHP", time: "0.4s", amount: "$1,200" },
    { pair: "USDT → NGN", time: "1.1s", amount: "$3,100" },
    { pair: "USDT → PKR", time: "0.7s", amount: "$500" },
  ];

  const visibleMatches = recentMatches.slice(tick % 3, (tick % 3) + 3);

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Top stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Orders", value: Number(ordersProcessed).toLocaleString(), sub: "processed" },
          { label: "Avg match", value: `${avgMatch}s`, sub: "latency" },
          { label: "Uptime", value: `${uptime}%`, sub: "last 30d" },
        ].map((s) => (
          <div key={s.label} className="text-center rounded-xl py-3 px-2" style={{ background: "rgba(0,0,0,0.02)" }}>
            <div className="text-lg sm:text-xl font-bold font-mono text-black/80 dark:text-white/80 leading-tight">{s.value}</div>
            <div className="text-[8px] font-semibold uppercase tracking-wider text-black/25 dark:text-white/25 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Live match feed */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
        <div className="flex items-center justify-between px-4 py-2" style={{ background: "rgba(0,0,0,0.03)" }}>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">Live matches</span>
          </div>
          <motion.span
            className="text-[9px] font-mono text-black/20 dark:text-white/20"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            streaming
          </motion.span>
        </div>
        <AnimatePresence mode="popLayout">
          {visibleMatches.map((m, i) => (
            <motion.div
              key={`${m.pair}-${tick}-${i}`}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(255,107,53,0.08)" }}>
                  <span className="text-[8px] font-bold text-[#ff6b35]">✓</span>
                </div>
                <span className="text-xs font-medium text-black/60 dark:text-white/60">{m.pair}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-[#3ddc84]">{m.time}</span>
                <span className="text-xs font-semibold text-black/40 dark:text-white/40">{m.amount}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Chain Visual: Live settlement log ─── */
function ChainVisual({ isInView }: { isInView: boolean }) {
  const tick = useTicker(2500, isInView);
  const blockNum = 248173 + tick;

  const settlements = [
    { tx: "7xKm...4pQn", status: "confirmed", block: blockNum, time: "0.4s" },
    { tx: "3aRt...9mWz", status: "confirmed", block: blockNum - 1, time: "0.6s" },
    { tx: "9pLx...2cNv", status: "confirmed", block: blockNum - 2, time: "0.5s" },
    { tx: "5wQk...8jFs", status: "finalized", block: blockNum - 3, time: "0.3s" },
  ];

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Block counter */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-black/25 dark:text-white/25 mb-1">Latest block</div>
          <motion.div
            key={blockNum}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold font-mono text-black/80 dark:text-white/80"
          >
            #{blockNum.toLocaleString()}
          </motion.div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-bold uppercase tracking-widest text-black/25 dark:text-white/25 mb-1">Network</div>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#9945FF]"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-semibold text-black/60 dark:text-white/60">Solana</span>
          </div>
        </div>
      </div>

      {/* Settlement log */}
      <div className="space-y-2">
        {settlements.map((s, i) => (
          <motion.div
            key={`${s.tx}-${tick}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{
              background: i === 0 ? "rgba(153,69,255,0.04)" : "rgba(0,0,0,0.02)",
              border: i === 0 ? "1px solid rgba(153,69,255,0.1)" : "1px solid transparent",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{
                background: s.status === "confirmed" ? "rgba(61,220,132,0.1)" : "rgba(153,69,255,0.1)",
              }}>
                <span className="text-[10px]">{s.status === "confirmed" ? "✓" : "◆"}</span>
              </div>
              <div>
                <span className="text-xs font-mono font-medium text-black/60 dark:text-white/60 block leading-tight">{s.tx}</span>
                <span className="text-[9px] text-black/25 dark:text-white/25">Block #{s.block.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold" style={{
                color: s.status === "confirmed" ? "#3ddc84" : "#9945FF",
              }}>{s.status}</span>
              <span className="block text-[9px] font-mono text-black/20 dark:text-white/20">{s.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─── */
const ProtocolInterstitial = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? "#000000" : "#FAF8F5" }}>
      {/* Header */}
      <div className="text-center" style={{ padding: "140px 24px 60px" }}>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: isDark ? "#555" : "#999",
            marginBottom: 32,
          }}
        >
          Introducing
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          style={{
            fontSize: "clamp(3rem, 7vw, 6rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: isDark ? "#fff" : "#1d1d1f",
            marginBottom: 24,
          }}
        >
          The Blip Protocol
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            lineHeight: 1.6,
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          Best-in-class matching engine. Real-time merchant auctions.
          On-chain settlement proof. This is how money should move.
        </motion.p>
      </div>

      {/* Feature blocks */}
      {FEATURES.map((f, i) => (
        <FeatureBlock key={f.label} feature={f} index={i} isDark={isDark} />
      ))}

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="text-center"
        style={{ padding: "60px 24px 140px" }}
      >
        <div style={{
          width: 48, height: 1,
          background: isDark ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" : "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
          margin: "0 auto 28px",
        }} />
        <p style={{
          fontSize: 16, fontWeight: 500,
          color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
        }}>
          Non-custodial. Permissionless. Built on Solana.
        </p>
      </motion.div>
    </section>
  );
};

/* ─── Feature block wrapper ─── */
function FeatureBlock({
  feature,
  index,
  isDark,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
  isDark: boolean;
}) {
  const blockRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(blockRef, { once: true, margin: "-15%" });
  const isEven = index % 2 === 0;

  const VisualComponent = {
    speed: SpeedVisual,
    rates: RatesVisual,
    engine: EngineVisual,
    chain: ChainVisual,
  }[feature.visual];

  return (
    <div
      ref={blockRef}
      style={{
        padding: "80px 24px",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <div className={`max-w-6xl mx-auto flex flex-col gap-12 md:gap-20 ${isEven ? "md:flex-row" : "md:flex-row-reverse"} md:items-center`}>
        {/* Text */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
        >
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "2px",
            textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", marginBottom: 16,
          }}>
            {feature.label}
          </div>
          <h3 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700,
            letterSpacing: "-0.035em", lineHeight: 1.1,
            color: isDark ? "#fff" : "#1d1d1f", marginBottom: 8,
          }}>
            {feature.headline}
          </h3>
          <p style={{
            fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 500,
            color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
            marginBottom: 20, letterSpacing: "-0.01em",
          }}>
            {feature.subline}
          </p>
          <p style={{
            fontSize: 16, lineHeight: 1.7,
            color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
            maxWidth: 420, fontWeight: 400,
          }}>
            {feature.desc}
          </p>
        </motion.div>

        {/* Visual */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, x: isEven ? 40 : -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        >
          <VisualComponent isInView={isInView} />
        </motion.div>
      </div>
    </div>
  );
}

export default memo(ProtocolInterstitial);
