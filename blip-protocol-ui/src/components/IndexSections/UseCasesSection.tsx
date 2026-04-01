/* eslint-disable */
import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "next-themes";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Live earn feed ── */
const ALL_TXNS = [
  { emoji: "☕", label: "The Coffee Co.", amount: 0.5 },
  { emoji: "🛒", label: "Dubai Mall", amount: 2.4 },
  { emoji: "✈️", label: "Emirates Air", amount: 12.8 },
  { emoji: "🏨", label: "Armani Hotel", amount: 28.6 },
  { emoji: "🍽️", label: "Zuma Dubai", amount: 5.2 },
  { emoji: "⛽", label: "ADNOC", amount: 1.8 },
  { emoji: "🏥", label: "Mediclinic", amount: 8.4 },
];

function LiveEarnFeed({ isInView }: { isInView: boolean }) {
  const [total, setTotal] = useState(847.2);
  const [cursor, setCursor] = useState(0);
  const [rows, setRows] = useState(ALL_TXNS.slice(0, 4));
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      const next = ALL_TXNS[cursor % ALL_TXNS.length];
      setTotal((prev) => parseFloat((prev + next.amount).toFixed(2)));
      setRows((prev) => [next, ...prev].slice(0, 4));
      setCursor((c) => c + 1);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }, 2200);
    return () => clearInterval(id);
  }, [cursor, isInView]);

  return (
    <div className="w-full max-w-[400px]">
      {/* Total */}
      <div className="mb-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/25 dark:text-white/25 mb-2">
          Total earned
        </div>
        <motion.div
          key={total}
          initial={{ y: -4, opacity: 0.6 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="font-mono"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "#1d1d1f",
          }}
        >
          <span className="dark:text-white">${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-sm font-medium text-black/20 dark:text-white/20 ml-2">BLIP</span>
        </motion.div>
      </div>

      {/* Badges */}
      <div className="flex gap-2 mb-6">
        {["2% cashback", "Instant", "On-chain"].map((tag) => (
          <div
            key={tag}
            className="px-3 py-1 rounded-full text-[10px] font-semibold"
            style={{
              background: "rgba(0,0,0,0.04)",
              color: "rgba(0,0,0,0.4)",
            }}
          >
            {tag}
          </div>
        ))}
      </div>

      {/* Live feed */}
      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout">
          {rows.map((tx, i) => (
            <motion.div
              key={`${tx.label}-${cursor - i}`}
              initial={i === 0 ? { opacity: 0, y: -10, scale: 0.97 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: i === 0 && flash ? "rgba(61,220,132,0.06)" : "rgba(0,0,0,0.02)",
                border: i === 0 && flash ? "1px solid rgba(61,220,132,0.12)" : "1px solid transparent",
                transition: "background 0.3s, border 0.3s",
              }}
            >
              <span className="text-lg">{tx.emoji}</span>
              <span className="flex-1 text-sm text-black/50 dark:text-white/50">{tx.label}</span>
              <span className="text-sm font-bold font-mono text-[#3ddc84]">+{tx.amount.toFixed(2)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Live send animation ── */
function LiveSendVisual({ isDark }: { isDark: boolean }) {
  const [phase, setPhase] = useState<"typing" | "sending" | "matching" | "done">("typing");
  const [cycle, setCycle] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (!isInView) return;
    const run = () => {
      setPhase("typing");
      setTimeout(() => setPhase("sending"), 1500);
      setTimeout(() => setPhase("matching"), 2500);
      setTimeout(() => setPhase("done"), 4000);
      setTimeout(() => setCycle((c) => c + 1), 7000);
    };
    run();
    const id = setInterval(run, 7500);
    return () => clearInterval(id);
  }, [isInView, cycle]);

  return (
    <div ref={ref} className="w-full max-w-[380px] mx-auto rounded-3xl overflow-hidden" style={{
      background: isDark ? "#111" : "#fff",
      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
      boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.08)",
    }}>
      <div className="px-6 pt-7 pb-5">
        <div className="flex items-center justify-between mb-5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-black/25 dark:text-white/25">Send money</div>
          <motion.div className="flex items-center gap-1.5" animate={{ opacity: phase === "done" ? 1 : 0.4 }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: phase === "done" ? "#3ddc84" : "rgba(0,0,0,0.15)" }} />
            <span className="text-[9px] font-semibold" style={{ color: phase === "done" ? "#3ddc84" : "rgba(0,0,0,0.25)" }}>
              {phase === "done" ? "Settled" : phase === "matching" ? "Matching..." : phase === "sending" ? "Sending..." : "Ready"}
            </span>
          </motion.div>
        </div>

        {/* Amount */}
        <motion.div className="font-mono mb-1" animate={{ opacity: phase === "typing" ? [0.5, 1, 0.5] : 1 }} transition={{ duration: 1, repeat: phase === "typing" ? Infinity : 0 }}
          style={{ fontSize: 36, fontWeight: 700, color: isDark ? "#fff" : "#1d1d1f", letterSpacing: "-0.03em" }}>
          $2,500
        </motion.div>
        <div className="text-sm text-black/30 dark:text-white/30 mb-5">USDT → AED</div>

        {/* Recipient */}
        <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)" }}>
          <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-sm font-bold text-black/40 dark:text-white/40">A</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-black/70 dark:text-white/70">Ahmed K.</div>
            <div className="text-[11px] text-black/30 dark:text-white/30">Dubai, UAE</div>
          </div>
          <motion.div animate={{ scale: phase === "done" ? [1, 1.2, 1] : 1 }} className="text-right">
            <div className="font-mono text-sm font-bold" style={{ color: phase === "done" ? "#3ddc84" : "rgba(0,0,0,0.3)" }}>
              {phase === "done" ? "~42s" : "—"}
            </div>
            <div className="text-[9px] text-black/20 dark:text-white/20">settle time</div>
          </motion.div>
        </div>

        {/* Progress steps */}
        <div className="flex gap-1 mb-5">
          {["Send", "Match", "Escrow", "Settle"].map((s, i) => {
            const stepDone = (phase === "sending" && i < 1) || (phase === "matching" && i < 2) || (phase === "done" && i < 4);
            return (
              <div key={s} className="flex-1">
                <motion.div className="h-1 rounded-full mb-1" animate={{ backgroundColor: stepDone ? "#3ddc84" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} transition={{ duration: 0.3 }} />
                <span className="text-[8px] font-semibold uppercase" style={{ color: stepDone ? "#3ddc84" : "rgba(0,0,0,0.2)" }}>{s}</span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div className="w-full py-3 rounded-xl text-center text-sm font-semibold" animate={{
          backgroundColor: phase === "done" ? "#3ddc84" : "#1d1d1f",
          color: "#ffffff",
        }}>
          {phase === "done" ? "✓ Settled" : phase === "typing" ? "Confirm & Send" : "Processing..."}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Live merchant earnings visual ── */
function LiveMerchantVisual({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [totalEarned, setTotalEarned] = useState(12420);
  const [orders, setOrders] = useState(142);
  const [trades, setTrades] = useState([
    { pair: "USDT→AED", amount: "$3,400", earned: "+$25.80", time: "38s" },
    { pair: "USDT→INR", amount: "$1,200", earned: "+$9.10", time: "45s" },
    { pair: "USDT→PHP", amount: "$5,800", earned: "+$43.50", time: "31s" },
  ]);

  const pairs = ["USDT→AED", "USDT→INR", "USDT→PHP", "USDT→NGN"];

  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      const pair = pairs[Math.floor(Math.random() * pairs.length)];
      const amt = Math.floor(Math.random() * 7000 + 500);
      const earn = (amt * (Math.random() * 0.01 + 0.005)).toFixed(2);
      const time = Math.floor(Math.random() * 25 + 25);
      setTotalEarned((v) => v + parseFloat(earn));
      setOrders((v) => v + 1);
      setTrades((prev) => [{ pair, amount: `$${amt.toLocaleString()}`, earned: `+$${earn}`, time: `${time}s` }, ...prev].slice(0, 3));
    }, 2500);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <div ref={ref} className="w-full max-w-[380px] mx-auto rounded-3xl overflow-hidden" style={{
      background: isDark ? "#111" : "#fff",
      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
      boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.08)",
    }}>
      <div className="px-6 pt-7 pb-5">
        <div className="flex items-center justify-between mb-5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-black/25 dark:text-white/25">Merchant dashboard</div>
          <div className="flex items-center gap-1.5">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
            <span className="text-[9px] font-semibold text-black/25 dark:text-white/25">Live</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl p-3" style={{ background: "rgba(61,220,132,0.04)", border: "1px solid rgba(61,220,132,0.08)" }}>
            <div className="text-[9px] font-semibold uppercase tracking-wider text-black/25 dark:text-white/25">Total earned</div>
            <motion.div key={Math.floor(totalEarned)} initial={{ y: -3, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }}
              className="text-xl font-bold font-mono text-[#3ddc84] tracking-tight">${Math.floor(totalEarned).toLocaleString()}</motion.div>
          </div>
          <div className="rounded-xl p-3" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
            <div className="text-[9px] font-semibold uppercase tracking-wider text-black/25 dark:text-white/25">Orders today</div>
            <motion.div key={orders} initial={{ y: -3, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }}
              className="text-xl font-bold font-mono text-black/80 dark:text-white tracking-tight">{orders}</motion.div>
          </div>
        </div>

        {/* Trade feed with earnings */}
        <div className="text-[9px] font-semibold uppercase tracking-wider text-black/25 dark:text-white/25 mb-2">Settled trades — your earnings</div>
        <AnimatePresence mode="popLayout">
          {trades.map((t, i) => (
            <motion.div key={`${t.pair}-${t.amount}-${i}`} initial={i === 0 ? { opacity: 0, y: -8 } : false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center justify-between py-2.5" style={{ borderBottom: i < 2 ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` : "none" }}>
              <div>
                <span className="text-xs font-medium text-black/60 dark:text-white/60">{t.pair}</span>
                <span className="text-[10px] text-black/25 dark:text-white/25 ml-2">{t.amount}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-black/25 dark:text-white/25">{t.time}</span>
                <motion.span initial={i === 0 ? { scale: 1.2 } : false} animate={{ scale: 1 }}
                  className="text-xs font-bold font-mono text-[#3ddc84]">{t.earned}</motion.span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Tab data ── */
const TABS = [
  {
    id: "users",
    label: "Users",
    headline: "Send USDT \u2192 real-world cash instantly",
    bullets: ["No banks, no delays", "Transparent execution", "Settled in under 60s"],
    cta: "Start sending \u2192",
  },
  {
    id: "merchants",
    label: "Merchants",
    headline: "Accept global payments. Earn on every trade.",
    bullets: ["Instant fiat settlement", "No chargebacks", "Earn margin on each order"],
    cta: "Accept payments \u2192",
  },
  {
    id: "lps",
    label: "Liquidity Providers",
    headline: "Deploy capital. Capture spread.",
    bullets: ["Fund settlement routes", "Real-time earnings", "Full control of your capital"],
    cta: "Provide liquidity \u2192",
  },
] as const;

/* ── Main section ── */
const UseCasesSection = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState(0);

  const tab = TABS[activeTab];

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? "#000" : "#FAF8F5" }}>
      <div style={{ padding: "120px 24px" }}>
        <div className="max-w-6xl mx-auto">

          {/* Section heading */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="text-center"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: isDark ? "#fff" : "#1d1d1f",
              marginBottom: 48,
            }}
          >
            Built for everyone.
          </motion.h2>

          {/* Tabs */}
          <div className="flex justify-center gap-1 mb-16">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(i)}
                className="relative px-5 py-2.5 text-sm font-medium transition-colors duration-200"
                style={{
                  color: activeTab === i
                    ? (isDark ? "#fff" : "#1d1d1f")
                    : (isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"),
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t.label}
                {activeTab === i && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ background: isDark ? "#fff" : "#1d1d1f" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-col md:flex-row md:items-center gap-12 md:gap-20"
            >
              {/* Text side */}
              <div className="flex-1 min-w-0">
                <h3 style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  color: isDark ? "#fff" : "#1d1d1f",
                  marginBottom: 28,
                }}>
                  {tab.headline}
                </h3>

                <div className="space-y-4 mb-10">
                  {tab.bullets.map((b, i) => (
                    <motion.div
                      key={b}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: EASE }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)" }}
                      />
                      <span
                        className="text-base"
                        style={{ color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)" }}
                      >
                        {b}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.a
                  href="/waitlist"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
                  style={{ background: isDark ? "#fff" : "#1d1d1f", color: isDark ? "#1d1d1f" : "#fff" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {tab.cta}
                </motion.a>
              </div>

              {/* Visual side */}
              <div className="flex-1 min-w-0 flex items-center justify-center">
                {activeTab === 0 && <LiveSendVisual isDark={isDark} />}
                {activeTab === 1 && <LiveMerchantVisual isDark={isDark} />}
                {activeTab === 2 && <LiveEarnFeed isInView={true} />}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
};

export default memo(UseCasesSection);
