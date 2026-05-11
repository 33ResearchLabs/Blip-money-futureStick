/* eslint-disable */
import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { SwipeHint } from "./SwipeHint";

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
            fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
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

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? "#000" : "#FAF8F5" }}>
      <div className="py-20 px-5 md:py-[120px] md:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="heading-h2 text-center"
            style={{ color: isDark ? "#fff" : "#1d1d1f", marginBottom: 48 }}
          >
            Built for everyone.
          </motion.h2>

          {/* ── Hero card: Users — full width with image ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            whileHover={{ y: -4 }}
            className="rounded-[24px] overflow-hidden mb-4 relative"
            style={{
              background: "#1d1d1f",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              minHeight: 400,
              transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            {/* Background image */}
            <img
              src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.3 }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(29,29,31,0.95) 40%, rgba(29,29,31,0.4) 100%)" }} />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 p-8 md:p-12">
              {/* Left — text */}
              <div className="flex-1 min-w-0">
                <span style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>
                  For users
                </span>
                <h3 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.15, color: "#ffffff", marginBottom: 12 }}>
                  Send USDT.<br />Get cash delivered.
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", marginBottom: 24, maxWidth: 380 }}>
                  Cross-border remittance in under 60 seconds. No banks. No forms. Recipient gets local currency instantly.
                </p>
                <div className="flex items-center gap-5 mb-6">
                  {[{ val: "<60s", lbl: "Settle" }, { val: "42", lbl: "Routes" }, { val: "On-chain", lbl: "Proof" }].map((s, i) => (
                    <div key={s.lbl} className="flex items-center gap-1.5">
                      {i > 0 && <div className="w-px h-4 bg-white/10 mr-2" />}
                      <span className="font-mono text-sm font-bold text-white">{s.val}</span>
                      <span className="text-[9px] uppercase text-white/30">{s.lbl}</span>
                    </div>
                  ))}
                </div>
                <motion.a
                  href="/waitlist"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-semibold"
                  style={{ background: "#ffffff", color: "#1d1d1f" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Start sending <span>→</span>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* ── Bottom row: Merchants + Liquidity — snap-scroll on mobile ── */}
          <div className="relative">
          <div className="-mx-5 md:mx-0 px-5 md:px-0 flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Merchants — with image */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              whileHover={{ y: -4 }}
              className="snap-start shrink-0 w-[88%] md:w-auto rounded-[24px] overflow-hidden relative"
              style={{
                background: "#1d1d1f",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                minHeight: 380,
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=800&auto=format&fit=crop&q=80"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.2 }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(29,29,31,0.95) 50%, rgba(29,29,31,0.6) 100%)" }} />

              <div className="relative z-10 p-7 flex flex-col h-full justify-end" style={{ minHeight: 380 }}>
                <span style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>
                  For merchants
                </span>
                <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#fff", marginBottom: 10 }}>
                  Accept crypto.<br />Earn on every trade.
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
                  Instant settlement. Zero chargebacks. Margin on every order.
                </p>
                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <div className="font-mono text-lg font-bold text-[#3ddc84]">$1,247</div>
                    <div className="text-[8px] uppercase tracking-wider text-white/25">Earned today</div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <div className="font-mono text-lg font-bold text-white">34</div>
                    <div className="text-[8px] uppercase tracking-wider text-white/25">Trades</div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <div className="font-mono text-lg font-bold text-white">~38s</div>
                    <div className="text-[8px] uppercase tracking-wider text-white/25">Avg settle</div>
                  </div>
                </div>
                <motion.a
                  href="/merchant"
                  className="inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-full text-[13px] font-semibold"
                  style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Accept payments <span>→</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Liquidity — with image */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              whileHover={{ y: -4 }}
              className="snap-start shrink-0 w-[88%] md:w-auto rounded-[24px] overflow-hidden relative"
              style={{
                background: isDark ? "#111" : "#ffffff",
                boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.3)" : "0 2px 24px rgba(0,0,0,0.06)",
                minHeight: 380,
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: isDark ? 0.15 : 0.08 }}
              />
              <div className="absolute inset-0" style={{ background: isDark ? "linear-gradient(to top, rgba(17,17,17,0.95) 50%, rgba(17,17,17,0.7) 100%)" : "linear-gradient(to top, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.8) 100%)" }} />

              <div className="relative z-10 p-7 flex flex-col h-full justify-end" style={{ minHeight: 380 }}>
                <span style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)", marginBottom: 10 }}>
                  For liquidity providers
                </span>
                <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, color: isDark ? "#fff" : "#1d1d1f", marginBottom: 10 }}>
                  Deploy capital.<br />Capture spread.
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)", marginBottom: 20 }}>
                  Fund settlement routes. Earn infrastructure yield. Full control.
                </p>
                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <div className="font-mono text-lg font-bold text-[#3ddc84]">11.2%</div>
                    <div className="text-[8px] uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.6)" }}>Avg APY</div>
                  </div>
                  <div className="w-px h-8" style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
                  <div>
                    <div className="font-mono text-lg font-bold" style={{ color: isDark ? "#fff" : "#1d1d1f" }}>42</div>
                    <div className="text-[8px] uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.6)" }}>Routes</div>
                  </div>
                  <div className="w-px h-8" style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
                  <div>
                    <div className="font-mono text-lg font-bold" style={{ color: isDark ? "#fff" : "#1d1d1f" }}>$4.8M</div>
                    <div className="text-[8px] uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.6)" }}>Deployed</div>
                  </div>
                </div>
                <motion.a
                  href="/waitlist"
                  className="inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-full text-[13px] font-semibold"
                  style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", color: isDark ? "#fff" : "#1d1d1f", border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Provide liquidity <span>→</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
          <SwipeHint />
          </div>

        </div>
      </div>
    </section>
  );
};

/* ── Mini merchant earnings ticker ── */
function LiveMerchantMini() {
  const [earned, setEarned] = useState(1247);
  const [trades, setTrades] = useState(34);
  useEffect(() => {
    const id = setInterval(() => {
      setEarned((v) => v + parseFloat((Math.random() * 15 + 3).toFixed(2)));
      setTrades((v) => v + 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[8px] font-semibold uppercase tracking-wider text-white/25 mb-1">Today's earnings</div>
          <motion.div key={Math.floor(earned)} initial={{ y: -3, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} className="font-mono text-xl font-bold text-[#3ddc84]">
            ${Math.floor(earned).toLocaleString()}
          </motion.div>
        </div>
        <div className="text-right">
          <div className="text-[8px] font-semibold uppercase tracking-wider text-white/25 mb-1">Trades</div>
          <motion.div key={trades} initial={{ y: -3, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} className="font-mono text-xl font-bold text-white">
            {trades}
          </motion.div>
        </div>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full bg-[#3ddc84]"
          animate={{ width: ["30%", "65%", "45%", "80%", "55%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[8px] text-white/20">Volume</span>
        <span className="text-[8px] font-mono text-white/20">$24.8K today</span>
      </div>
    </div>
  );
}

/* ── Mini LP route stats ── */
function LiveLPMini({ isDark }: { isDark: boolean }) {
  const [deployed, setDeployed] = useState(48700);
  useEffect(() => {
    const id = setInterval(() => setDeployed((v) => v + Math.floor(Math.random() * 200 + 50)), 3500);
    return () => clearInterval(id);
  }, []);

  const routes = [
    { name: "UAE → India", apy: "12.4%", util: 87 },
    { name: "UAE → PH", apy: "9.8%", util: 72 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>Deployed</div>
          <motion.div key={Math.floor(deployed)} initial={{ y: -3, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} className="font-mono text-xl font-bold" style={{ color: isDark ? "#fff" : "#1d1d1f" }}>
            ${(deployed / 1000).toFixed(1)}K
          </motion.div>
        </div>
        <div className="text-right">
          <div className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>Avg APY</div>
          <div className="font-mono text-xl font-bold text-[#3ddc84]">11.2%</div>
        </div>
      </div>
      {routes.map((r, i) => (
        <div key={r.name} className="flex items-center justify-between py-2" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
          <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{r.name}</span>
          <div className="flex items-center gap-3">
            <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
              <div className="h-full rounded-full bg-[#3ddc84]" style={{ width: `${r.util}%` }} />
            </div>
            <span className="text-xs font-bold font-mono text-[#3ddc84]">{r.apy}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(UseCasesSection);
