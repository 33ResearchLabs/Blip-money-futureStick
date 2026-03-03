import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ShoppingBag,
  Gift,
  Eye,
  Store,
  Zap,
  ShieldOff,
  TrendingDown,
  Check,
} from "lucide-react";

/* ============================================
   SECTION 6: USE CASES — Users vs Merchants
   ============================================ */

const userCases = [
  {
    icon: Globe,
    label: "Pay globally",
    desc: "Send money to anyone, anywhere — instantly.",
  },
  {
    icon: ShoppingBag,
    label: "Pay anywhere",
    desc: "Tap to pay at stores, online shops, and across borders.",
  },
  {
    icon: Gift,
    label: "Earn rewards",
    desc: "Cashback and points on every transaction.",
  },
  {
    icon: Eye,
    label: "Private by default",
    desc: "Non-custodial. Your keys, your funds, your data.",
  },
];

const merchantCases = [
  {
    icon: Store,
    label: "Accept global payments",
    desc: "Receive from any corridor without bank accounts.",
  },
  {
    icon: Zap,
    label: "Instant liquidity",
    desc: "Access on-demand liquidity matched to your trade.",
  },
  {
    icon: ShieldOff,
    label: "No chargebacks",
    desc: "Escrow-settled trades are final and irreversible.",
  },
  {
    icon: TrendingDown,
    label: "Lower fees",
    desc: "0.1% protocol fee vs 3–7% traditional rails.",
  },
];

/* ─── Pay Anywhere phone mockup ──────────────────────────────────── */
type PayPhase = "browse" | "confirm" | "paid";

function PayAnywherePhone() {
  const [phase, setPhase] = useState<PayPhase>("browse");

  useEffect(() => {
    const run = () => {
      setPhase("browse");
      setTimeout(() => setPhase("confirm"), 2400);
      setTimeout(() => setPhase("paid"), 4400);
    };
    run();
    const id = setInterval(run, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    /* Phone frame */
    <div
      className="mx-auto mb-6"
      style={{
        width: 200,
        background: "linear-gradient(160deg, #2a2a2a 0%, #181818 50%, #222 100%)",
        borderRadius: "2rem",
        padding: "8px",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.09)",
      }}
    >
      {/* Screen */}
      <div
        className="relative overflow-hidden"
        style={{ borderRadius: "1.5rem", height: 340, background: "#0a0a0a" }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute top-[8px] left-1/2 -translate-x-1/2 z-30"
          style={{
            width: 72,
            height: 20,
            background: "#000",
            borderRadius: 999,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
          }}
        />

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-3 pb-1 z-20">
          <span className="text-[8px] text-white/30 font-medium">9:41</span>
          <span className="text-[8px] text-white/30">▌▌▌</span>
        </div>

        <AnimatePresence mode="wait">
          {phase === "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col"
              style={{ paddingTop: 36 }}
            >
              {/* Store header */}
              <div className="px-4 pt-3 pb-2 border-b border-white/[0.05]">
                <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">
                  Paying
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: "rgba(255,107,53,0.15)" }}
                  >
                    ☕
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-white">The Coffee Co.</div>
                    <div className="text-[8px] text-white/30">Dubai Mall · Gate 2</div>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="text-[10px] text-white/25 uppercase tracking-widest mb-2">
                  Total
                </div>
                <div
                  className="text-3xl font-bold text-white tracking-tight mb-1"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  18.50
                </div>
                <div className="text-[10px] text-white/30 font-medium">AED</div>
                <div className="mt-1 text-[9px] text-white/20">≈ 5.04 USDT</div>
              </div>

              {/* Pay button */}
              <div className="px-4 pb-5">
                <div
                  className="w-full py-2.5 rounded-2xl flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #3ddc84, #2ab870)" }}
                >
                  <ShoppingBag
                    style={{ width: 12, height: 12, color: "#000" }}
                    strokeWidth={2.5}
                  />
                  <span className="text-[11px] font-bold text-black">Pay with Blip</span>
                </div>
                <div className="text-center mt-2 text-[8px] text-white/20">
                  Escrow protected · Non-custodial
                </div>
              </div>
            </motion.div>
          )}

          {phase === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-4"
              style={{ paddingTop: 36 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: "rgba(61,220,132,0.12)",
                  border: "1px solid rgba(61,220,132,0.25)",
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <div
                  className="w-5 h-5 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #3ddc84, #14F195)",
                    boxShadow: "0 0 16px rgba(61,220,132,0.5)",
                  }}
                />
              </motion.div>
              <div className="text-[11px] font-semibold text-white mb-1">Confirming…</div>
              <div className="text-[9px] text-white/30 text-center">
                Locking funds in escrow
              </div>
              {/* Progress dots */}
              <div className="flex gap-1.5 mt-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.25 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {phase === "paid" && (
            <motion.div
              key="paid"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-4"
              style={{ paddingTop: 36 }}
            >
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: "#3ddc84",
                  boxShadow: "0 0 30px rgba(61,220,132,0.4)",
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <Check style={{ width: 22, height: 22, color: "#000" }} strokeWidth={3} />
              </motion.div>
              <div className="text-[13px] font-bold text-white mb-1">Paid!</div>
              <div className="text-[10px] text-[#3ddc84] font-medium mb-3">18.50 AED</div>
              <div
                className="px-3 py-1.5 rounded-xl text-center"
                style={{
                  background: "rgba(61,220,132,0.08)",
                  border: "1px solid rgba(61,220,132,0.18)",
                }}
              >
                <div className="text-[8px] text-white/40 font-mono">Settled in 420ms</div>
                <div className="text-[7px] text-white/20 mt-0.5">View on Blipscan →</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screen reflection */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 45%)",
          }}
        />
      </div>
    </div>
  );
}

const UseCasesSection = () => {
  return (
    <section className="relative py-24 md:py-40 bg-[#FAF8F5] dark:bg-black overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/50 dark:text-white/40 font-semibold">
              Use cases
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white tracking-tight leading-[1.05] text-center mb-6"
        >
          Built for everyone.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-base md:text-lg lg:text-xl text-black/80 dark:text-white/50 max-w-lg text-center mx-auto leading-relaxed mb-10 font-medium"
        >
          Whether you're sending value globally or running a merchant business,
          Blip is the network that makes it possible.
        </motion.p>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* For Users */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03] p-8 shadow-[0_4px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-none"
          >
            <div className="mb-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-black/60 dark:text-white/30 font-semibold mb-2">
                For Users
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-black dark:text-white">
                Send & spend freely.
              </h3>
            </div>

            {/* Pay anywhere phone mockup */}
            <PayAnywherePhone />

            <div className="space-y-3">
              {userCases.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-3.5 p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.02] hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-black/[0.07] dark:group-hover:bg-white/[0.07] transition-colors">
                      <Icon
                        className="w-4 h-4 text-black/70 dark:text-white/50"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-black dark:text-white mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-xs text-black dark:text-white/30 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* For Merchants */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="
    rounded-2xl sm:rounded-3xl
    border border-black/[0.08] dark:border-white/10
    bg-white/60 dark:bg-white/5
    backdrop-blur-2xl
    p-6 sm:p-8
    shadow-[0_4px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]
  "
          >
            {/* Header */}
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-black/60 dark:text-white/70 font-semibold mb-2">
                For Merchants
              </div>

              <h3 className="font-display text-2xl md:text-3xl font-semibold text-black dark:text-white">
                Scale without limits.
              </h3>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {merchantCases.map((item, i) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className="
            flex items-start gap-3.5
            p-4
            rounded-xl
            border border-black/[0.06] dark:border-white/10
            bg-black/[0.03] dark:bg-white/10
            hover:bg-black/[0.06] dark:hover:bg-white/15
            transition-all duration-300
            group
          "
                  >
                    {/* Icon */}
                    <div
                      className="
              w-9 h-9
              rounded-lg
              bg-black/[0.06] dark:bg-white/15
              flex items-center justify-center
              flex-shrink-0
              group-hover:bg-black/[0.1] dark:group-hover:bg-white/25
              transition-colors
            "
                    >
                      <Icon
                        className="w-4 h-4 text-black/80 dark:text-white"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Text */}
                    <div>
                      <div className="text-sm font-semibold text-black dark:text-white mb-0.5">
                        {item.label}
                      </div>

                      <div className="text-xs text-black dark:text-white/80 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
    </section>
  );
};

export default UseCasesSection;
