import { useRef, memo, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { SwipeHint } from "./SwipeHint";

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  {
    label: "Settlement engine",
    headline: "Deterministic. Timed. Final.",
    subline: "Every order settled in under 60 seconds.",
    desc: "Our matching engine pairs your order with the best merchant, locks it in escrow, and executes settlement — all deterministic, all on-chain, all under 60 seconds.",
    visual: "speed" as const,
  },
  {
    label: "Rate auction",
    headline: "Merchants compete. Best rate wins.",
    subline: "150+ LPs bid on every trade.",
    desc: "Merchants provide liquidity and compete in real-time auctions. The fastest, most competitive one wins your trade and earns a margin. You always get the best rate.",
    visual: "rates" as const,
  },
  {
    label: "On-chain proof",
    headline: "Every transaction. Verifiable.",
    subline: "Immutable settlement records on Solana.",
    desc: "Every trade is recorded on-chain. Full transparency — no trust required. Verify any settlement, anytime, from anywhere in the world.",
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

  const displayTime = phase === "done" ? "42" : Math.min(Math.floor(timer * 30), 42).toString();

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
            color: "#1d1d1f",
            transition: "color 0.3s",
          }}
          className="dark:text-white tabular-nums"
        >
          {displayTime}<span className="text-[0.35em] opacity-30 ml-1">sec</span>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <motion.div
          className="w-2 h-2 rounded-full"
          animate={{
            backgroundColor: phase === "idle" ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.6)",
            scale: phase === "matching" || phase === "settling" ? [1, 1.4, 1] : 1,
          }}
          transition={{ duration: 0.5, repeat: phase === "matching" ? Infinity : 0, repeatType: "loop" }}
        />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{
          color: phase === "idle" ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.6)",
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
                  backgroundColor: active ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.06)",
                }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              />
              <span className="block text-[9px] font-medium mt-1.5 text-center" style={{
                color: active ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)",
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
            className="w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40"
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
                  background: isBest ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.02)",
                  border: isBest ? "1px solid rgba(0,0,0,0.15)" : "1px solid transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: isBest ? "#1d1d1f" : "rgba(0,0,0,0.05)",
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
                  <span className="text-sm font-bold font-mono" style={{ color: isBest ? "#1d1d1f" : "rgba(0,0,0,0.4)" }}>
                    {liveRate}
                  </span>
                  {isBest && (
                    <span className="block text-[8px] font-bold uppercase tracking-wider text-black/60">Best rate</span>
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

/* ─── Engine Visual: Merchant earnings dashboard ─── */
function EngineVisual({ isInView }: { isInView: boolean }) {
  const [totalEarned, setTotalEarned] = useState(12847);
  const [todayTrades, setTodayTrades] = useState(47);
  const [trades, setTrades] = useState([
    { id: 1, pair: "USDT → AED", amount: "$2,400", margin: "+$18.20", time: "34s", status: "settled" },
    { id: 2, pair: "USDT → INR", amount: "$850", margin: "+$6.40", time: "41s", status: "settled" },
    { id: 3, pair: "USDT → PHP", amount: "$5,100", margin: "+$38.70", time: "28s", status: "settled" },
  ]);
  const [flash, setFlash] = useState(false);

  const pairs = ["USDT → AED", "USDT → INR", "USDT → PHP", "USDT → NGN", "USDT → PKR"];

  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      const pair = pairs[Math.floor(Math.random() * pairs.length)];
      const amt = Math.floor(Math.random() * 8000 + 500);
      const margin = (amt * (Math.random() * 0.012 + 0.004)).toFixed(2);
      const time = Math.floor(Math.random() * 30 + 20);
      const hash = Math.floor(Math.random() * 9000 + 1000);

      setTotalEarned((v) => v + parseFloat(margin));
      setTodayTrades((v) => v + 1);
      setTrades((prev) => [
        { id: hash, pair, amount: `$${amt.toLocaleString()}`, margin: `+$${margin}`, time: `${time}s`, status: "settled" },
        ...prev,
      ].slice(0, 3));
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }, 2800);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Merchant header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.4)" }}>
          AF
        </div>
        <div>
          <div className="text-sm font-semibold text-black/80 dark:text-white/80">AlphaFX</div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40" />
            <span className="text-[10px] text-black/30 dark:text-white/30">Active merchant · Dubai</span>
          </div>
        </div>
      </div>

      {/* Earnings summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded-xl py-3 px-3" style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="text-[8px] font-semibold uppercase tracking-wider text-black/25 dark:text-white/25 mb-1">Total earned</div>
          <motion.div key={Math.floor(totalEarned)} initial={{ y: -3, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} className="font-mono text-base font-bold text-black/80 dark:text-white/80">
            ${Math.floor(totalEarned).toLocaleString()}
          </motion.div>
        </div>
        <div className="rounded-xl py-3 px-3" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}>
          <div className="text-[8px] font-semibold uppercase tracking-wider text-black/25 dark:text-white/25 mb-1">Today</div>
          <motion.div key={todayTrades} initial={{ y: -3, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} className="font-mono text-base font-bold text-black/80 dark:text-white/80">
            {todayTrades} trades
          </motion.div>
        </div>
        <div className="rounded-xl py-3 px-3" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}>
          <div className="text-[8px] font-semibold uppercase tracking-wider text-black/25 dark:text-white/25 mb-1">Avg settle</div>
          <div className="font-mono text-base font-bold text-black/80 dark:text-white/80">~35s</div>
        </div>
      </div>

      {/* Live trade feed — showing earnings per trade */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
        <div className="flex items-center justify-between px-3 py-2" style={{ background: "rgba(0,0,0,0.02)" }}>
          <div className="flex items-center gap-1.5">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
            <span className="text-[8px] font-bold uppercase tracking-widest text-black/25 dark:text-white/25">Settled trades</span>
          </div>
          <span className="text-[8px] font-mono text-black/15 dark:text-white/15">live</span>
        </div>
        <AnimatePresence mode="popLayout">
          {trades.map((t, i) => (
            <motion.div
              key={`${t.id}-${i}`}
              initial={i === 0 ? { opacity: 0, y: -8, backgroundColor: "rgba(0,0,0,0.04)" } : false}
              animate={{ opacity: 1, y: 0, backgroundColor: "transparent" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between px-3 py-2.5"
              style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-[8px] text-black/40 dark:text-white/40">✓</span>
                <div>
                  <span className="text-[11px] font-medium text-black/60 dark:text-white/60">{t.pair}</span>
                  <span className="text-[10px] text-black/25 dark:text-white/25 ml-2">{t.amount}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-black/25 dark:text-white/25">{t.time}</span>
                <motion.span
                  className="text-[11px] font-bold font-mono text-black/80 dark:text-white/80"
                  animate={i === 0 && flash ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {t.margin}
                </motion.span>
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
                background: s.status === "confirmed" ? "rgba(0,0,0,0.05)" : "rgba(153,69,255,0.1)",
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
                color: s.status === "confirmed" ? "rgba(0,0,0,0.5)" : "#9945FF",
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
      <div className="text-center pt-20 px-5 pb-12 md:pt-[140px] md:px-6 md:pb-[60px]">
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
          className="heading-h2 text-black dark:text-white"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          style={{ marginBottom: 48 }}
        >
          The Blip Protocol
        </motion.h2>

      </div>

      {/* 3 Feature cards */}
      <div className="max-w-6xl mx-auto px-6" style={{ paddingBottom: 120 }}>
        {/* Top row — first card full width */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          whileHover={{ y: -4 }}
          className="rounded-[24px] overflow-hidden mb-4"
          style={{
            background: isDark ? "#111" : "#ffffff",
            border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
            boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.06)",
            transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-8 p-8 md:p-10">
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", marginBottom: 12 }}>
                {FEATURES[0].label}
              </div>
              <h3 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.15, color: isDark ? "#fff" : "#1d1d1f", marginBottom: 8 }}>
                {FEATURES[0].headline}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", maxWidth: 400 }}>
                {FEATURES[0].desc}
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <SpeedVisual isInView={true} />
            </div>
          </div>
        </motion.div>

        {/* Bottom row — Apple-style snap-scroll on mobile, 2-up grid at md+ */}
        <div className="relative">
        <div className="-mx-5 md:mx-0 px-5 md:px-0 flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FEATURES.slice(1).map((f, i) => {
            const Visual = i === 0 ? RatesVisual : ChainVisual;
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: EASE }}
                whileHover={{ y: -4 }}
                className="snap-start shrink-0 w-[88%] md:w-auto rounded-[24px] overflow-hidden"
                style={{
                  background: isDark ? "#111" : "#ffffff",
                  border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.06)",
                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              >
                <div className="p-7">
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", marginBottom: 12 }}>
                    {f.label}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, color: isDark ? "#fff" : "#1d1d1f", marginBottom: 6 }}>
                    {f.headline}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", marginBottom: 20 }}>
                    {f.subline}
                  </p>
                  <Visual isInView={true} />
                </div>
              </motion.div>
            );
          })}
        </div>
        <SwipeHint />
        </div>

        {/* Bottom line */}
        <div className="text-center mt-12">
          <p style={{ fontSize: 14, fontWeight: 500, color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>
            Non-custodial. Permissionless. Built on Solana.
          </p>
        </div>
      </div>
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
      className="py-14 px-5 md:py-20 md:px-6"
    >
      <div className={`max-w-6xl mx-auto flex flex-col gap-12 md:gap-16 ${isEven ? "md:flex-row" : "md:flex-row-reverse"} md:items-center`}>
        {/* Text */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
        >
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "2px",
            textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", marginBottom: 16,
          }}>
            {feature.label}
          </div>
          <h3 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700,
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
            fontSize: 15, lineHeight: 1.7,
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            maxWidth: 420, fontWeight: 400,
          }}>
            {feature.desc}
          </p>
        </motion.div>

        {/* Visual — elevated card container */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        >
          <motion.div
            className="rounded-3xl overflow-hidden p-6"
            style={{
              background: isDark ? "#111" : "#ffffff",
              border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
              boxShadow: isDark
                ? "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset"
                : "0 20px 60px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.8) inset",
            }}
            whileHover={{ y: -4, boxShadow: isDark
              ? "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset"
              : "0 30px 80px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.8) inset"
            }}
            transition={{ duration: 0.4 }}
          >
            {/* Top bar */}
            <div className="flex items-center gap-1.5 mb-5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
              <span className="ml-auto text-[9px] font-mono" style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}>
                blip.money
              </span>
            </div>
            <VisualComponent isInView={isInView} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default memo(ProtocolInterstitial);
