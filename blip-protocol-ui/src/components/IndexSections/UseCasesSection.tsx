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

/* ── Main section ── */
const UseCasesSection = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <section className="relative overflow-hidden" style={{ background: isDark ? "#000" : "#FAF8F5" }}>

      {/* ── Block 1: Users ── */}
      <FeatureBlock
        isDark={isDark}
        label="For you"
        headline="Send money like a text message."
        subline="To anyone. Anywhere. In seconds."
        desc="Pay with USDT. Your recipient gets local currency — cash, bank transfer, or mobile money. No forms, no delays, no banks in between."
        features={["Pay globally in seconds", "Recipient gets local fiat", "Private by default", "Earn rewards on every tx"]}
        visual={
          <div className="w-full max-w-[380px] mx-auto">
            {/* Mini phone mockup showing a send flow */}
            <div className="rounded-3xl overflow-hidden" style={{
              background: isDark ? "#111" : "#fff",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            }}>
              <div className="px-6 pt-8 pb-4">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-black/25 dark:text-white/25 mb-4">Sending</div>
                <div className="text-4xl font-bold text-black/80 dark:text-white tracking-tight mb-1">$2,500</div>
                <div className="text-sm text-black/30 dark:text-white/30 mb-6">USDT → AED</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#ff6b35]/10 flex items-center justify-center text-sm font-bold text-[#ff6b35]">A</div>
                  <div>
                    <div className="text-sm font-semibold text-black/70 dark:text-white/70">Ahmed K.</div>
                    <div className="text-xs text-black/30 dark:text-white/30">Dubai, UAE</div>
                  </div>
                  <div className="ml-auto text-xs font-mono text-[#3ddc84] font-semibold">1.2s</div>
                </div>
              </div>
              <div className="px-6 py-4" style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black/30 dark:text-white/30">Fee</span>
                  <span className="text-xs font-semibold text-black/50 dark:text-white/50">$1.25 (0.05%)</span>
                </div>
              </div>
              <div className="px-6 pb-6 pt-3">
                <div className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white" style={{ background: "#ff6b35" }}>
                  Confirm & Send
                </div>
              </div>
            </div>
          </div>
        }
        isEven={true}
      />

      {/* ── Block 2: Merchants ── */}
      <FeatureBlock
        isDark={isDark}
        label="For merchants"
        headline="Accept crypto. Get paid in fiat."
        subline="Zero chargebacks. Instant settlement."
        desc="Join our merchant network and tap into global crypto liquidity. Our matching engine brings you orders — you provide liquidity and earn on every trade."
        features={["Receive from any corridor", "No chargebacks — ever", "0.1% merchant fee", "On-demand liquidity"]}
        visual={
          <div className="w-full max-w-[380px] mx-auto">
            <div className="rounded-3xl overflow-hidden" style={{
              background: isDark ? "#111" : "#fff",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            }}>
              <div className="px-6 pt-8 pb-5">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-black/25 dark:text-white/25 mb-4">Merchant dashboard</div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Today", value: "$24,847", sub: "+12.3%" },
                    { label: "Orders", value: "142", sub: "matched" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-3" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)" }}>
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-black/25 dark:text-white/25">{s.label}</div>
                      <div className="text-xl font-bold text-black/80 dark:text-white tracking-tight">{s.value}</div>
                      <div className="text-[10px] font-semibold text-[#3ddc84]">{s.sub}</div>
                    </div>
                  ))}
                </div>
                {/* Recent orders */}
                <div className="text-[9px] font-semibold uppercase tracking-wider text-black/25 dark:text-white/25 mb-2">Recent orders</div>
                {[
                  { pair: "USDT → AED", amount: "$1,200", time: "0.8s" },
                  { pair: "USDT → AED", amount: "$3,400", time: "1.1s" },
                  { pair: "USDT → AED", amount: "$850", time: "0.6s" },
                ].map((o, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5" style={{
                    borderBottom: i < 2 ? (isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)") : "none",
                  }}>
                    <span className="text-xs text-black/50 dark:text-white/50">{o.pair}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#3ddc84]">{o.time}</span>
                      <span className="text-xs font-semibold text-black/60 dark:text-white/60">{o.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        isEven={false}
      />

      {/* ── Block 3: Earn ── */}
      <EarnBlock isDark={isDark} />

    </section>
  );
};

/* ── Full-width feature block ── */
function FeatureBlock({
  isDark,
  label,
  headline,
  subline,
  desc,
  features,
  visual,
  isEven,
}: {
  isDark: boolean;
  label: string;
  headline: string;
  subline: string;
  desc: string;
  features: string[];
  visual: React.ReactNode;
  isEven: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <div
      ref={ref}
      style={{
        padding: "100px 24px",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <div className={`max-w-6xl mx-auto flex flex-col gap-12 md:gap-20 ${isEven ? "md:flex-row" : "md:flex-row-reverse"} md:items-center`}>
        {/* Text */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="text-[11px] font-bold uppercase tracking-[2px] text-[#ff6b35] mb-4">
            {label}
          </div>
          <h3 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: isDark ? "#fff" : "#1d1d1f",
            marginBottom: 8,
          }}>
            {headline}
          </h3>
          <p style={{
            fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
            fontWeight: 500,
            color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
            marginBottom: 20,
          }}>
            {subline}
          </p>
          <p style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
            maxWidth: 440,
            marginBottom: 28,
          }}>
            {desc}
          </p>

          {/* Feature checklist */}
          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.div
                key={f}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE }}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,107,53,0.1)" }}>
                  <span className="text-[10px] text-[#ff6b35]">✓</span>
                </div>
                <span className="text-sm font-medium" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)" }}>
                  {f}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          className="flex-1 min-w-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        >
          {visual}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Earn block — full-section white card, Apple style ── */
function EarnBlock({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  /* Animated counter */
  const [earnedToday, setEarnedToday] = useState(47.2);
  const [txCount, setTxCount] = useState(12);
  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      setEarnedToday((v) => parseFloat((v + (Math.random() * 3 + 0.5)).toFixed(2)));
      setTxCount((v) => v + 1);
    }, 3500);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <div ref={ref} className="flex justify-center" style={{ padding: "40px 24px 100px" }}>
      <div
        className="relative overflow-hidden w-full"
        style={{
          maxWidth: "82%",
          borderRadius: 32,
          background: "#ffffff",
          boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── Top: Full-width hero image area ── */}
        <div className="relative w-full overflow-hidden" style={{ height: "50vh", minHeight: 340 }}>
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&auto=format&fit=crop&q=80"
            alt="Shopping and earning rewards"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Bottom fade into white */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.6) 75%, #ffffff 100%)" }} />

          {/* Floating badges */}
          <motion.div
            className="absolute top-8 left-8 px-5 py-2.5 rounded-full backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.88)", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            initial={{ opacity: 0, y: -15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#3ddc84]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-semibold text-[#1d1d1f]">Rewards active</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-8 right-8 px-5 py-2.5 rounded-full backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.88)", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            initial={{ opacity: 0, y: -15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          >
            <span className="text-xs font-semibold text-[#ff6b35]">2% back on everything</span>
          </motion.div>

          {/* Big centered text on image */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: EASE }}
          >
            <h3 style={{
              fontSize: "clamp(3rem, 6vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: "#ffffff",
              textShadow: "0 4px 30px rgba(0,0,0,0.3)",
              textAlign: "center",
            }}>
              Earn while<br />you spend.
            </h3>
          </motion.div>
        </div>

        {/* ── Middle: Stats strip ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 px-8 py-8"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        >
          {[
            { value: "2%", label: "Cashback rate" },
            { value: "Instant", label: "Credit to wallet" },
            { value: "$0", label: "To get started" },
            { value: "On-chain", label: "Verified rewards" },
          ].map((s, i) => (
            <div key={s.label} className="text-center flex items-center gap-6">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">{s.value}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-black/30 mt-1">{s.label}</div>
              </div>
              {i < 3 && <div className="hidden sm:block w-px h-10 bg-black/[0.06]" />}
            </div>
          ))}
        </motion.div>

        {/* ── Bottom: Two-column content ── */}
        <div className="flex flex-col md:flex-row gap-0">

          {/* Left — description + features */}
          <motion.div
            className="flex-1 px-10 sm:px-14 py-12 md:py-16"
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5" style={{ background: "rgba(255,107,53,0.08)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#ff6b35]">How it works</span>
            </div>

            <p style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: "rgba(0,0,0,0.5)",
              marginBottom: 32,
              maxWidth: 420,
            }}>
              Every payment you make on Blip automatically earns you BLIP tokens. No sign-ups, no loyalty programs, no points to track. Just spend and earn — it's that simple.
            </p>

            {/* Steps */}
            <div className="space-y-5">
              {[
                { num: "01", title: "Make a payment", desc: "Send USDT to anyone, anywhere through Blip." },
                { num: "02", title: "Earn instantly", desc: "2% cashback credited to your wallet in real-time." },
                { num: "03", title: "Stack rewards", desc: "Rewards compound. The more you use, the more you earn." },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -15 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: EASE }}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1d1d1f] flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-white font-mono">{step.num}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#1d1d1f] mb-1">{step.title}</div>
                    <div className="text-sm text-black/40 leading-relaxed">{step.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.a
              href="/waitlist"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold mt-10"
              style={{ background: "#1d1d1f", color: "#ffffff" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Start earning
              <span style={{ fontSize: 16 }}>→</span>
            </motion.a>
          </motion.div>

          {/* Right — live dashboard */}
          <motion.div
            className="flex-1 px-10 sm:px-14 py-12 md:py-16"
            style={{ borderLeft: "1px solid rgba(0,0,0,0.05)" }}
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          >
            {/* Live counter card */}
            <div className="rounded-2xl p-6 mb-6" style={{ background: "#fafafa", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#3ddc84]"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[9px] font-bold uppercase tracking-widest text-black/30">Live — your rewards</span>
              </div>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-black/30 mb-1">Earned today</div>
                  <motion.div
                    key={earnedToday}
                    initial={{ y: -4, opacity: 0.5 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold text-[#1d1d1f] tracking-tight font-mono"
                  >
                    ${earnedToday.toFixed(2)}
                  </motion.div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-black/30 mb-1">Transactions</div>
                  <motion.div
                    key={txCount}
                    initial={{ y: -4, opacity: 0.5 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold text-[#1d1d1f] tracking-tight font-mono"
                  >
                    {txCount}
                  </motion.div>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] font-semibold text-black/30">Monthly goal</span>
                  <span className="text-[9px] font-bold text-[#ff6b35]">$847 / $1,000</span>
                </div>
                <div className="h-1.5 rounded-full bg-black/[0.04] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#ff6b35]"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "84.7%" } : {}}
                    transition={{ duration: 1.5, delay: 0.6, ease: EASE }}
                  />
                </div>
              </div>
            </div>

            {/* Live feed */}
            <div className="rounded-2xl p-5" style={{ background: "#fafafa", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-bold uppercase tracking-widest text-black/30">Recent rewards</span>
                <span className="text-[9px] font-semibold text-[#ff6b35]">See all →</span>
              </div>
              <LiveEarnFeed isInView={isInView} />
            </div>

            {/* Reward tiers teaser */}
            <motion.div
              className="mt-6 rounded-2xl p-5 flex items-center gap-4"
              style={{ background: "#fafafa", border: "1px solid rgba(0,0,0,0.04)" }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#ff6b35]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🏆</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#1d1d1f]">Gold tier unlocked</div>
                <div className="text-xs text-black/35">3x multiplier active — earning 6% on every transaction</div>
              </div>
              <div className="text-[#ff6b35] font-bold text-lg">3x</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default memo(UseCasesSection);
