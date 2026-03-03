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
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Data ── */
const userCases = [
  { icon: Globe,      label: "Pay globally",        desc: "Send money to anyone, anywhere — instantly." },
  { icon: ShoppingBag,label: "Pay anywhere",        desc: "Tap to pay at stores, online shops, and across borders." },
  { icon: Gift,       label: "Earn rewards",         desc: "Cashback and points on every transaction." },
  { icon: Eye,        label: "Private by default",   desc: "Non-custodial. Your keys, your funds, your data." },
];

const merchantCases = [
  { icon: Store,       label: "Accept global payments", desc: "Receive from any corridor without bank accounts." },
  { icon: Zap,         label: "Instant liquidity",       desc: "Access on-demand liquidity matched to your trade." },
  { icon: ShieldOff,   label: "No chargebacks",          desc: "Escrow-settled trades are final and irreversible." },
  { icon: TrendingDown,label: "Lower fees",              desc: "0.1% protocol fee vs 3–7% traditional rails." },
];

/* ── Earn UI ── */
const EARN_TXNS = [
  { emoji: "☕", label: "The Coffee Co.",  amount: 0.50,  pct: "2%" },
  { emoji: "🛒", label: "Dubai Mall",      amount: 2.40,  pct: "2%" },
  { emoji: "✈️", label: "Emirates Air",    amount: 12.80, pct: "2%" },
  { emoji: "🏨", label: "Armani Hotel",    amount: 28.60, pct: "2%" },
  { emoji: "🍽️", label: "Zuma Dubai",     amount: 5.20,  pct: "2%" },
];

type TxRow = typeof EARN_TXNS[number];

function EarnUI() {
  const [total, setTotal]         = useState(847.20);
  const [cursor, setCursor]       = useState(0);
  const [rows, setRows]           = useState<TxRow[]>(EARN_TXNS.slice(0, 3));
  const [flash, setFlash]         = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const next = EARN_TXNS[cursor % EARN_TXNS.length];
      setTotal(prev => parseFloat((prev + next.amount).toFixed(2)));
      setRows(prev => [next, ...prev].slice(0, 3));
      setCursor(c => c + 1);
      setFlash(true);
      setTimeout(() => setFlash(false), 700);
    }, 2600);
    return () => clearInterval(id);
  }, [cursor]);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18,
        padding: "18px 18px 14px",
      }}
    >
      {/* Total row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.28)",
              marginBottom: 5,
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            Total earned
          </div>
          <motion.div
            key={total}
            initial={{ y: -6, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.045em",
              lineHeight: 1,
              fontFamily: "monospace",
            }}
          >
            ${total.toFixed(2)}
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.25)",
                marginLeft: 6,
                letterSpacing: 0,
              }}
            >
              BLIP
            </span>
          </motion.div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
          <div
            style={{
              padding: "3px 9px",
              borderRadius: 999,
              background: "rgba(255,107,53,0.12)",
              border: "1px solid rgba(255,107,53,0.22)",
              fontSize: 9,
              fontWeight: 700,
              color: "#ff6b35",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            2% BACK
          </div>
          <div
            style={{
              padding: "3px 9px",
              borderRadius: 999,
              background: "rgba(61,220,132,0.08)",
              border: "1px solid rgba(61,220,132,0.18)",
              fontSize: 9,
              fontWeight: 700,
              color: "#3ddc84",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            ×5 STREAK
          </div>
        </div>
      </div>

      {/* Separator */}
      <div
        style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 10 }}
      />

      {/* Transaction rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <AnimatePresence mode="popLayout">
          {rows.map((tx, i) => (
            <motion.div
              key={`${tx.label}-${cursor - i}`}
              initial={i === 0 ? { opacity: 0, y: -10 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 9px",
                borderRadius: 9,
                background:
                  i === 0 && flash
                    ? "rgba(255,107,53,0.07)"
                    : "rgba(255,255,255,0.015)",
                border:
                  i === 0 && flash
                    ? "1px solid rgba(255,107,53,0.14)"
                    : "1px solid transparent",
                transition: "background 0.3s, border 0.3s",
              }}
            >
              <span style={{ fontSize: 14 }}>{tx.emoji}</span>
              <span
                style={{
                  flex: 1,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "monospace",
                }}
              >
                {tx.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#3ddc84",
                  fontFamily: "monospace",
                  marginRight: 4,
                }}
              >
                +{tx.amount.toFixed(2)}
              </span>
              <span
                style={{
                  fontSize: 8,
                  padding: "1px 5px",
                  borderRadius: 999,
                  background: "rgba(255,107,53,0.09)",
                  color: "#ff6b35",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {tx.pct}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================
   SECTION: USE CASES
   ============================================ */
const UseCasesSection = () => {
  return (
    <section
      className="relative py-24 md:py-40 overflow-hidden"
      style={{ background: "#FAF8F5" }}
    >
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,107,53,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.03) 0%, transparent 40%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/[0.08] bg-white/70">
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/50 font-semibold">
              Use cases
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-[1.05] text-center mb-5"
        >
          Built for everyone.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-base md:text-lg text-black/50 max-w-lg text-center mx-auto leading-relaxed mb-12 font-medium"
        >
          Whether you're sending value globally or running a merchant business,
          Blip is the network that makes it possible.
        </motion.p>

        {/* Top 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* For Users */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="rounded-3xl border border-black/[0.07] bg-white/70 p-7 shadow-[0_4px_40px_-12px_rgba(0,0,0,0.07)]"
          >
            <div className="mb-5">
              <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-semibold mb-1">
                For Users
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-black">
                Pay freely. Globally.
              </h3>
            </div>

            <div className="space-y-2.5">
              {userCases.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.05 + i * 0.07 }}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl border border-black/[0.05] bg-white/50 hover:border-black/[0.1] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-black/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-black/[0.07] transition-colors">
                      <Icon className="w-4 h-4 text-black/60" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-black mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-xs text-black/40 leading-relaxed">
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
            transition={{ duration: 0.8, ease: EASE }}
            className="rounded-3xl border border-black/[0.07] bg-white/70 p-7 shadow-[0_4px_40px_-12px_rgba(0,0,0,0.07)]"
          >
            <div className="mb-5">
              <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-semibold mb-1">
                For Merchants
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-black">
                Scale without limits.
              </h3>
            </div>

            <div className="space-y-2.5">
              {merchantCases.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.05 + i * 0.07 }}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl border border-black/[0.05] bg-white/50 hover:border-black/[0.1] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-black/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-black/[0.07] transition-colors">
                      <Icon className="w-4 h-4 text-black/60" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-black mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-xs text-black/40 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Earn card — full width */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: "#0a0a0f",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — copy */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,107,53,0.6)",
                  fontWeight: 600,
                  marginBottom: 18,
                }}
              >
                Rewards
              </div>

              <h3
                style={{
                  fontSize: "clamp(2rem,3.5vw,3rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.08,
                  color: "#ffffff",
                  marginBottom: 12,
                }}
              >
                Earn while you spend.{" "}
                <span style={{ color: "rgba(255,255,255,0.28)" }}>
                  Every transaction.
                </span>
              </h3>

              <p
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.38)",
                  lineHeight: 1.7,
                  maxWidth: 380,
                  marginBottom: 28,
                }}
              >
                Every payment earns you BLIP rewards automatically — no
                sign-ups, no points programs. Just instant cashback, on-chain
                and non-custodial.
              </p>

              {/* Stat pills */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { label: "2% cashback",       accent: true },
                  { label: "Instant rewards",   accent: false },
                  { label: "Non-custodial",      accent: false },
                ].map((pill) => (
                  <div
                    key={pill.label}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 999,
                      background: pill.accent
                        ? "rgba(255,107,53,0.12)"
                        : "rgba(255,255,255,0.05)",
                      border: pill.accent
                        ? "1px solid rgba(255,107,53,0.25)"
                        : "1px solid rgba(255,255,255,0.08)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: pill.accent ? "#ff6b35" : "rgba(255,255,255,0.45)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {pill.label}
                  </div>
                ))}
              </div>

              {/* CTA link */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 28,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#ff6b35",
                  letterSpacing: "0.02em",
                }}
              >
                Learn about Blip Rewards
                <ArrowUpRight style={{ width: 13, height: 13 }} />
              </div>
            </div>

            {/* Right — live UI */}
            <div
              className="flex items-center justify-center p-8 lg:p-10"
              style={{
                background: "rgba(255,255,255,0.015)",
                borderLeft: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ width: "100%", maxWidth: 360 }}>
                {/* Mini header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "rgba(255,107,53,0.15)",
                      border: "1px solid rgba(255,107,53,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sparkles
                      style={{ width: 13, height: 13, color: "#ff6b35" }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    My Rewards
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#3ddc84",
                      boxShadow: "0 0 6px rgba(61,220,132,0.7)",
                    }}
                  />
                </div>

                <EarnUI />

                {/* Bottom note */}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    fontSize: 9,
                    color: "rgba(255,255,255,0.18)",
                    letterSpacing: "0.05em",
                    fontFamily: "monospace",
                  }}
                >
                  LIVE · REWARDS ACCUMULATING
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
    </section>
  );
};

export default UseCasesSection;
