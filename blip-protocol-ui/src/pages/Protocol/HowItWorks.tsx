import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Gavel,
  Lock,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Eye,
  type LucideIcon,
  Home,
  MessageCircle,
  Activity,
  User,
  ExternalLink,
  SunMedium,
  Bell,
  QrCode,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import {
  MerchantDashboardBody,
  useMerchantDashboardState,
} from "@/components/IndexSections/LiveMerchantDashboard";
import { CTASection } from "@/components/sections/CTASection";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ────────────────────────────────────────────────────────────
   iPhone frame (self-contained; matches the one used on /user)
   ────────────────────────────────────────────────────────────*/
function PhoneFrame({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <div
      className="relative mx-auto"
      style={{
        aspectRatio: "9/18.5",
        width: "100%",
        maxWidth: 260,
        padding: "10px",
        background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
        borderRadius: 48,
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.04) inset, 0 60px 140px -40px rgba(0,0,0,0.7), 0 24px 60px -16px rgba(204,120,92,0.25)",
      }}
    >
      <span
        aria-hidden
        className="absolute -left-[2px] top-[18%] h-6 w-[3px] rounded-r bg-[#222]"
      />
      <span
        aria-hidden
        className="absolute -left-[2px] top-[28%] h-10 w-[3px] rounded-r bg-[#222]"
      />
      <span
        aria-hidden
        className="absolute -left-[2px] top-[42%] h-10 w-[3px] rounded-r bg-[#222]"
      />
      <span
        aria-hidden
        className="absolute -right-[2px] top-[32%] h-14 w-[3px] rounded-l bg-[#222]"
      />
      <div
        className="relative w-full h-full overflow-hidden bg-white"
        style={{ borderRadius: 36 }}
      >
        {/* Black/dark section — top 75% of phone screen */}
        <div
          className="absolute inset-x-0 top-0 overflow-hidden bg-black"
          style={{ height: "75%" }}
        >
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={(e) =>
              ((e.currentTarget as HTMLImageElement).src = "/home.svg")
            }
          />
        </div>
        {/* Transactions section — bottom 25% of phone screen (3 rows) */}
        <div
          className="absolute inset-x-0 bottom-0 overflow-hidden bg-white px-3 py-2"
          style={{ height: "25%" }}
        >
          {/* <div className="text-[8.5px] font-semibold text-black mb-1.5">Transactions</div> */}
          <div className="space-y-1.5">
            {[
              {
                i: "P",
                t: "Sell USDT",
                s: "Priya M. · 22 May 2026",
                a: "+₹4,250",
                u: "50.00 USDT",
                neg: false,
              },
              {
                i: "A",
                t: "Buy USDT",
                s: "Aman K. · 21 May 2026",
                a: "-₹6,396.25",
                u: "75.25 USDT",
                neg: true,
              },
              {
                i: "N",
                t: "Sell USDT",
                s: "Neha R. · 20 May 2026",
                a: "+₹17,000",
                u: "200.00 USDT",
                neg: false,
              },
            ].map((tx) => (
              <div key={tx.i + tx.s} className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-black/[0.06] flex items-center justify-center text-[7.5px] font-semibold text-black/70 shrink-0">
                  {tx.i}
                </div>
                <div className="flex-1 min-w-0 leading-[1.15]">
                  <div className="text-[8px] font-semibold text-black truncate">
                    {tx.t}
                  </div>
                  <div className="text-[6.5px] text-black/45 truncate">
                    {tx.s}
                  </div>
                </div>
                <div className="text-right leading-[1.15] shrink-0">
                  <div
                    className={`text-[8px] font-semibold ${tx.neg ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {tx.a}
                  </div>
                  <div className="text-[6.5px] text-black/45">{tx.u}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-4 left-2 right-2 z-10"
        >
          <div className="h-11 rounded-2xl border border-[#dfe3ea] bg-[#f5f7fb]/95 backdrop-blur-xl flex items-center justify-around px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.06)]">
            {[
              { Icon: Home, label: "HOME", active: true },
              { Icon: Zap, label: "TRADE" },
              { Icon: MessageCircle, label: "INBOX" },
              { Icon: Activity, label: "ACTIVITY" },
              { Icon: User, label: "YOU" },
            ].map(({ Icon, label, active }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <Icon
                  size={12}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={active ? "text-black" : "text-[#9ca3af]"}
                />
                <span
                  className={`text-[7px] font-extrabold tracking-wide ${
                    active ? "text-black" : "text-[#9ca3af]"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 9,
            width: 78,
            height: 22,
            borderRadius: 999,
            background: "#0a0a0a",
            border: "1px solid #1a1a1a",
          }}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step block — alternating layout
   ────────────────────────────────────────────────────────────*/
function Step({
  number,
  icon: Icon,
  eyebrow,
  title,
  body,
  visual,
  reverse = false,
}: {
  number: string;
  icon: LucideIcon;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, ease: EASE }}
      className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
        reverse ? "lg:[&>:first-child]:order-2" : ""
      }`}
    >
      {/* Copy column */}
      <div>
        <div
          className="inline-flex items-center gap-2 mb-5"
          style={{ fontFamily: MONO }}
        >
          <span
            className="text-[11px] font-bold tracking-[0.22em] px-2 py-1 rounded"
            style={{
              color: ACCENT,
              background: `${ACCENT}1a`,
              border: `1px solid ${ACCENT}44`,
            }}
          >
            STEP {number}
          </span>
          <span className="text-[10.5px] font-bold tracking-[0.22em] text-black/50">
            · {eyebrow}
          </span>
        </div>

        <div className="mb-5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            style={{
              background: `${ACCENT}18`,
              border: `1px solid ${ACCENT}55`,
            }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: ACCENT }}
              strokeWidth={2}
            />
          </div>
          <h3
            className="font-semibold text-black tracking-[-0.025em] leading-[1.08]"
            style={{ fontSize: "clamp(24px, 3.2vw, 36px)" }}
          >
            {title}
          </h3>
        </div>

        <p className="text-[15px] sm:text-[16px] leading-[1.6] text-black/65 max-w-[520px]">
          {body}
        </p>
      </div>

      {/* Visual column */}
      <div className="relative">{visual}</div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Feature card (bottom strip)
   ────────────────────────────────────────────────────────────*/
function FeatureCard({
  icon: Icon,
  title,
  body,
  index,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
      whileHover={{ y: -4 }}
      className="relative p-6 rounded-[20px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44` }}
      >
        <Icon className="w-5 h-5" style={{ color: ACCENT }} strokeWidth={2} />
      </div>
      <h4 className="text-[16px] font-semibold text-white mb-1.5 tracking-[-0.01em]">
        {title}
      </h4>
      <p className="text-[13px] leading-[1.55] text-white/55">{body}</p>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Dashboard card visual — wraps live MerchantDashboardBody
   ────────────────────────────────────────────────────────────*/
function DashCard() {
  const state = useMerchantDashboardState();
  return (
    <div
      className="relative rounded-[20px] overflow-hidden"
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(0,0,0,0.85)",
        boxShadow:
          "0 60px 140px -40px rgba(204,120,92,0.35), 0 30px 80px -30px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset",
        maxHeight: 480,
      }}
    >
      {/* Subtle top sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
        }}
      />
      <div className="overflow-hidden" style={{ maxHeight: 480 }}>
        <div
          style={{
            transform: "scale(0.72)",
            transformOrigin: "top left",
            width: "139%",
          }}
        >
          <MerchantDashboardBody state={state} />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Escrow diagram visual — pure SVG, no asset deps
   ────────────────────────────────────────────────────────────*/
function EscrowVisual() {
  return (
    <div
      className="relative rounded-[24px] aspect-[5/4] p-6 sm:p-8 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(204,120,92,0.18) 0%, transparent 70%), linear-gradient(180deg, #0e0e10 0%, #050505 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-around p-8">
        {/* User node */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-[18px] font-bold"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: MONO,
            }}
          >
            U
          </div>
          <span
            className="text-[10px] font-bold tracking-[0.18em] text-white/45"
            style={{ fontFamily: MONO }}
          >
            USER
          </span>
        </div>

        {/* Escrow center */}
        <div className="flex flex-col items-center gap-2 relative ">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, #b66848)`,
              boxShadow: `0 14px 36px -10px ${ACCENT}99, inset 0 1px 0 rgba(255,255,255,0.25)`,
            }}
          >
            <Lock className="w-8 h-8 text-white" strokeWidth={2.2} />
          </motion.div>
          <span
            className="text-[10px] font-bold tracking-[0.18em]"
            style={{ color: ACCENT, fontFamily: MONO }}
          >
            ESCROW · PDA
          </span>
          <span
            className="text-[9px] text-white/40"
            style={{ fontFamily: MONO }}
          >
            on-chain
          </span>
        </div>

        {/* Merchant node */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-[18px] font-bold"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: MONO,
            }}
          >
            M
          </div>
          <span
            className="text-[10px] font-bold tracking-[0.18em] text-white/45"
            style={{ fontFamily: MONO }}
          >
            MERCHANT
          </span>
        </div>
      </div>

      {/* Connector lines — start/end outside the U and M circles so they don't overlap */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.line
          x1="30%"
          y1="50%"
          x2="42%"
          y2="50%"
          stroke={ACCENT}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
        />
        <motion.line
          x1="58%"
          y1="50%"
          x2="70%"
          y2="50%"
          stroke={ACCENT}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
        />
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Settlement visual — clean settle confirmation card
   ────────────────────────────────────────────────────────────*/
function SettleVisual() {
  return (
    <div
      className="relative rounded-[24px] aspect-[5/4] p-8 overflow-hidden flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(204,120,92,0.15) 0%, transparent 70%), linear-gradient(180deg, #0e0e10 0%, #050505 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6)",
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative rounded-[18px] p-5 sm:p-6 bg-white text-black w-full max-w-[300px]"
        style={{
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 80px -30px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="flex items-center gap-2 mb-3"
          style={{ fontFamily: MONO }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
          />
          <span
            className="text-[9.5px] font-bold tracking-[0.22em]"
            style={{ color: ACCENT }}
          >
            TX · SETTLED
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="font-bold text-black leading-none"
            style={{
              fontFamily: "ui-serif, Georgia, serif",
              fontSize: 38,
              letterSpacing: "-0.04em",
            }}
          >
            +$1,250
          </span>
          <span
            className="text-[10px] font-bold text-black/40"
            style={{ fontFamily: MONO }}
          >
            USD
          </span>
        </div>
        <div className="text-[11px] text-black/50" style={{ fontFamily: MONO }}>
          ₹104,062 INR · 0.42s
        </div>
        <div
          className="mt-4 pt-3 border-t border-black/[0.08] flex items-center justify-between text-[10px]"
          style={{ fontFamily: MONO, color: "rgba(0,0,0,0.5)" }}
        >
          <span>FEE</span>
          <span style={{ color: ACCENT, fontWeight: 700 }}>$0.00 · 0%</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Main page
   ────────────────────────────────────────────────────────────*/
export const HowItWorksPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const transactionsB = [
    {
      id: 1,
      type: "Buy USDT",
      user: "Rahul S.",
      date: "22 May 2026",
      amount: "-₹10,242.5",
      usdt: "120.50 USDT",
      negative: true,
    },
    {
      id: 2,
      type: "Sell USDT",
      user: "Priya M.",
      date: "21 May 2026",
      amount: "+₹4,250",
      usdt: "50.00 USDT",
      negative: false,
    },
    {
      id: 3,
      type: "Buy USDT",
      user: "Aman K.",
      date: "20 May 2026",
      amount: "-₹6,396.25",
      usdt: "75.25 USDT",
      negative: true,
    },
  ];

  return (
    <>
      <SEO
        title="How Blip Works | Live Merchant Auctions, On-Chain Escrow"
        description="Blip is a live order book for cross-border value. Merchants compete in sealed-bid auctions, funds settle through non-custodial escrow on Solana. Here's how."
        canonical="https://www.blip.money/how-it-works"
      />
      <HreflangTags path="/how-it-works" />

      <div className="min-h-screen bg-white text-black mt-20 relative overflow-hidden">
        {/* Ambient warm glow (subtle on white) */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[1200px] h-[700px] rounded-full opacity-[0.10] blur-3xl"
          style={{
            background: `radial-gradient(ellipse, ${ACCENT}, transparent 70%)`,
          }}
        />
        {/* Dotted grid (dark on white) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, #000 30%, transparent 80%)",
          }}
        />

        {/* ── HERO ───────────────────────────────────────── */}
        <div className="relative min-h-[calc(100vh-80px)] flex items-center pt-10 sm:pt-20 pb-16 sm:pb-24 px-5 sm:px-6">
          <div className="max-w-[1180px] mx-auto text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7"
              style={{
                background: `${ACCENT}14`,
                border: `1px solid ${ACCENT}44`,
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
              />
              <span
                className="text-[10.5px] font-bold tracking-[0.22em]"
                style={{ color: ACCENT, fontFamily: MONO }}
              >
                PROTOCOL OVERVIEW
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
              className="font-semibold tracking-[-0.035em] leading-[1.04] mb-6 max-w-[920px] mx-auto px-2"
              style={{ fontSize: "clamp(50px, 11vw, 80px)" }}
            >
              How Blip works,{" "}
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                  color: ACCENT,
                }}
              >
                in 4 steps.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
              className="max-w-[620px] mx-auto text-[14.5px] sm:text-[16px] leading-[1.6] text-black/65 mb-2 px-2"
            >
              You initiate a trade. Verified merchants compete in a sealed-bid
              auction. The winning bid locks funds in on-chain escrow.
              Settlement releases automatically.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="text-[11px] font-bold tracking-[0.22em] text-black/40 mt-3"
              style={{ fontFamily: MONO }}
            >
              ~ 60 SECONDS · 0% FEES · NON-CUSTODIAL
            </motion.p>
          </div>
        </div>

        {/* ── STEPS ──────────────────────────────────────── */}
        <div className="relative px-5 sm:px-6">
          <div className="max-w-[1180px] mx-auto space-y-24 sm:space-y-36">
            <Step
              number="01"
              icon={Smartphone}
              eyebrow="OPEN THE APP"
              title={
                <>
                  You set the amount.{" "}
                  <span
                    style={{
                      fontStyle: "italic",
                      fontWeight: 500,
                      fontFamily: "ui-serif, Georgia, serif",
                      color: ACCENT,
                    }}
                  >
                    That's it.
                  </span>
                </>
              }
              body="Pick a currency pair. Type an amount. Hit send. No banking forms, no SWIFT codes, no waiting for business hours. Your request enters a live order book the moment you tap go."
              visual={
                <div
                  className="relative mx-auto"
                  style={{
                    aspectRatio: "9/19.43",
                    width: "100%",
                    maxWidth: 280,
                    padding: "10px",
                    background:
                      "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                    borderRadius: 48,
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.04) inset, 0 60px 140px -40px rgba(0,0,0,0.7), 0 24px 60px -16px rgba(204,120,92,0.25)",
                  }}
                >
                  {/* Side buttons */}
                  <span
                    aria-hidden
                    className="absolute -left-[2px] top-[18%] h-6 w-[3px] rounded-r bg-[#222]"
                  />
                  <span
                    aria-hidden
                    className="absolute -left-[2px] top-[28%] h-10 w-[3px] rounded-r bg-[#222]"
                  />
                  <span
                    aria-hidden
                    className="absolute -left-[2px] top-[42%] h-10 w-[3px] rounded-r bg-[#222]"
                  />
                  <span
                    aria-hidden
                    className="absolute -right-[2px] top-[32%] h-14 w-[3px] rounded-l bg-[#222]"
                  />
                  {/* Dynamic island */}
                  <div
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 z-50"
                    style={{
                      top: 9,
                      width: 78,
                      height: 22,
                      borderRadius: 999,
                      background: "#0a0a0a",
                      border: "1px solid #1a1a1a",
                    }}
                  />
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1, ease: EASE }}
                  className="absolute inset-[10px] rounded-[2.4rem] z-40 overflow-hidden bg-white dark:bg-[#0a0a0a]"
                >
                  {/* Sized for the 290x600 phone mockup — values shrunk from native mobile design */}
                  <div className="absolute inset-0 bg-white flex flex-col">
                    {/* HERO — ~68% of phone height */}
                    <div className="relative bg-[#050816] rounded-b-[22px] px-3 pt-9 pb-3 overflow-hidden h-[75%] flex-shrink-0 flex flex-col">
                      {/* background glow */}
                      <div className="absolute inset-0">
                        <div className="absolute -top-12 left-[-30px] w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
                        <div className="absolute bottom-[-60px] right-[-20px] w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />
                        <div
                          className="absolute inset-0 opacity-[0.08]"
                          style={{
                            backgroundImage:
                              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
                            backgroundSize: "14px 14px",
                          }}
                        />
                      </div>

                      {/* Header */}
                      <div className="relative z-10 flex items-start justify-between ">
                        <div className="flex gap-2">
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black font-bold text-[11px]">
                            A
                          </div>
                          <div>
                            <h2 className="text-white font-bold text-[14px] leading-none">
                              alex01
                            </h2>
                            <div className="flex items-center gap-1 mt-1">
                              <p className="text-white/40 text-[8px] font-medium">
                                9pMEix...J8LgV7
                              </p>
                              <button className="w-3 h-3 rounded-[3px] border border-white/10 bg-white/5 flex items-center justify-center">
                                <ExternalLink
                                  size={6}
                                  className="text-white/50"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <SunMedium size={10} className="text-white/70" />
                          </button>
                          <button className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <Bell size={10} className="text-white/70" />
                          </button>
                        </div>
                      </div>

                      {/* Rate pill */}
                      <div className="relative z-10 mt-4 flex items-center justify-center">
                        <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
                          <span className="text-white/70 text-[9px] font-semibold">
                            96.30 INR
                          </span>
                        </div>
                      </div>

                      {/* Status pills */}
                      <div className="relative z-10 mt-3 flex items-center justify-center gap-1.5">
                        <div className="px-2 py-0.5 rounded-full bg-[#171d2c] border border-white/10 flex items-center gap-1">
                          <ShieldCheck size={8} className="text-white/50" />
                          <span className="text-white/60 text-[8px] font-semibold">
                            New · 500
                          </span>
                        </div>
                        <div className="px-2 py-0.5 rounded-full bg-[#2b2207] border border-yellow-500/20 flex items-center gap-1">
                          <Zap size={8} className="text-yellow-400" />
                          <span className="text-yellow-400 text-[8px] font-semibold">
                            0
                          </span>
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="relative z-10 text-center mt-5">
                        <div className="flex items-end justify-center">
                          <span className="text-white text-5xl font-black tracking-[-2px] leading-none">
                            425
                          </span>
                          <span className="text-white/40 text-3xl font-black tracking-[-1px] leading-none">
                            .00
                          </span>
                          <span className="text-white/50 text-xs font-bold ml-1">
                            USDT
                          </span>
                        </div>
                        <p className="mt-2 text-white/50 text-[10px] font-semibold">
                          ≈ 40,633.68 INR
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <div className="w-3.5 h-1.5 rounded-full bg-emerald-400" />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        </div>
                      </div>

                      {/* spacer absorbs leftover hero height */}
                      <div className="relative z-10 flex-1" />

                      {/* ACTION BUTTONS */}
                      <div className="relative z-10 grid grid-cols-4 gap-2 mt-5">
                        {[
                          { label: "Pay", icon: QrCode, light: false },
                          { label: "Buy", icon: ArrowDownLeft, light: true },
                          { label: "Sell", icon: ArrowUpRight, light: true },
                          { label: "Deposit", icon: Download, light: false },
                        ].map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={i}
                              className={`h-12 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                                item.light
                                  ? "bg-white text-black border-white"
                                  : "bg-white/[0.03] text-white border-white/10"
                              }`}
                            >
                              <Icon size={16} strokeWidth={2.3} />
                              <span className="text-[10px] font-bold">
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Beat any rate */}
                      <div className="relative z-10 mt-4 rounded-xl border border-white/40 overflow-hidden bg-gradient-to-r from-[#f5f7fb] via-[#e4e7ed] to-[#dce3ec] p-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#0B0F14] border border-black/10 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck size={12} className="text-[#e8b66a]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <h3 className="text-black font-extrabold text-[11px]">
                                Beat any rate
                              </h3>
                              <div className="px-1 py-[1px] rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center gap-0.5">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span className="text-[7px] font-extrabold text-emerald-700">
                                  LIVE
                                </span>
                              </div>
                            </div>
                            <p className="text-[#5d6777] text-[8px] font-medium leading-tight truncate">
                              Compared across exchanges
                            </p>
                          </div>
                          <button className="w-5 h-5 rounded-full bg-black/5 border border-black/10 flex items-center justify-center flex-shrink-0">
                            <ExternalLink size={8} className="text-black/70" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* TRANSACTIONS */}
                    <div className="px-3 pt-2 pb-14 flex-1 overflow-hidden">
                      <h2 className="text-[#5a6578] font-bold text-sm">
                        Transactions
                      </h2>
                      <div className="mt-1">
                        {transactionsB.slice(0, 1).map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center py-1.5 border-b border-[#edf0f5]"
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#f4f5f7] border border-[#e5e7eb] flex items-center justify-center font-bold text-[10px] text-[#0B1220] flex-shrink-0">
                              {tx.user[0]}
                            </div>
                            <div className="flex-1 ml-2 min-w-0">
                              <h3 className="font-bold text-[10px] text-[#0B1220] leading-tight">
                                {tx.type}
                              </h3>
                              <p className="text-[#94a3b8] text-[8px] font-medium leading-tight mt-0.5 truncate">
                                {tx.user} · {tx.date}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p
                                className={`text-[10px] font-bold leading-tight ${
                                  tx.negative
                                    ? "text-red-500"
                                    : "text-emerald-500"
                                }`}
                              >
                                {tx.amount}
                              </p>
                              <p className="text-[8px] text-[#94a3b8] font-medium leading-tight">
                                {tx.usdt}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute bottom-4 left-2 right-2 z-10"
                  >
                    <div className="h-11 rounded-2xl border border-[#dfe3ea] bg-[#f5f7fb]/95 backdrop-blur-xl flex items-center justify-around px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.06)]">
                      {[
                        { Icon: Home, label: "HOME", active: true },
                        { Icon: Zap, label: "TRADE" },
                        { Icon: MessageCircle, label: "INBOX" },
                        { Icon: Activity, label: "ACTIVITY" },
                        { Icon: User, label: "YOU" },
                      ].map(({ Icon, label, active }) => (
                        <div
                          key={label}
                          className="flex flex-col items-center gap-0.5"
                        >
                          <Icon
                            size={12}
                            strokeWidth={active ? 2.4 : 1.8}
                            className={active ? "text-black" : "text-[#9ca3af]"}
                          />
                          <span
                            className={`text-[7px] font-extrabold tracking-wide ${
                              active ? "text-black" : "text-[#9ca3af]"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
                </div>
              }
            />

            <Step
              reverse
              number="02"
              icon={Gavel}
              eyebrow="MERCHANTS COMPETE"
              title={
                <>
                  A live auction{" "}
                  <span
                    style={{
                      fontStyle: "italic",
                      fontWeight: 500,
                      fontFamily: "ui-serif, Georgia, serif",
                      color: ACCENT,
                    }}
                  >
                    runs in milliseconds.
                  </span>
                </>
              }
              body="Verified merchants see your request and bid against each other in a sealed-bid, second-price auction. The most competitive merchant wins — and you always pay the second-best price, not the winner's. The market enforces the best rate, not us."
              visual={<DashCard />}
            />

            <Step
              number="03"
              icon={Lock}
              eyebrow="ON-CHAIN ESCROW"
              title={
                <>
                  Funds lock in a{" "}
                  <span
                    style={{
                      fontStyle: "italic",
                      fontWeight: 500,
                      fontFamily: "ui-serif, Georgia, serif",
                      color: ACCENT,
                    }}
                  >
                    smart contract.
                  </span>
                </>
              }
              body="Once a merchant wins, your funds move into a Program Derived Address (PDA) on Solana. No human, no exchange, no custodian holds them — only the protocol's smart contract logic. The merchant has posted a bond that gets slashed if they don't deliver."
              visual={<EscrowVisual />}
            />

            <Step
              reverse
              number="04"
              icon={CheckCircle2}
              eyebrow="SETTLEMENT"
              title={
                <>
                  Money lands.{" "}
                  <span
                    style={{
                      fontStyle: "italic",
                      fontWeight: 500,
                      fontFamily: "ui-serif, Georgia, serif",
                      color: ACCENT,
                    }}
                  >
                    Escrow releases.
                  </span>
                </>
              }
              body="When the merchant confirms fiat delivery, the smart contract releases escrow automatically. Every step is signed, recorded, and auditable on-chain. No chargebacks. No frozen accounts. No middleman to call."
              visual={<SettleVisual />}
            />
          </div>
        </div>

        {/* ── WHY IT WORKS — full-bleed black showcase strip ─── */}
        <section className="relative mt-24 sm:mt-36 bg-black text-white overflow-hidden">
          {/* Top + bottom hairline accents */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${ACCENT}88 50%, transparent 100%)`,
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${ACCENT}55 50%, transparent 100%)`,
            }}
          />

          {/* Central radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[1100px] h-[600px] rounded-full opacity-[0.18] blur-3xl"
            style={{
              background: `radial-gradient(ellipse, ${ACCENT}, transparent 70%)`,
            }}
          />

          {/* Dotted background grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              maskImage:
                "radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 80%)",
            }}
          />

          <div className="relative px-5 sm:px-6 py-24 sm:py-36">
            <div className="max-w-[1180px] mx-auto">
              {/* Section header */}
              <div className="text-center mb-14 sm:mb-20 max-w-[820px] mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                  style={{
                    background: `${ACCENT}1a`,
                    border: `1px solid ${ACCENT}55`,
                  }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.35, 1] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: ACCENT,
                      boxShadow: `0 0 8px ${ACCENT}`,
                    }}
                  />
                  <span
                    className="text-[10.5px] font-bold tracking-[0.22em]"
                    style={{ color: ACCENT, fontFamily: MONO }}
                  >
                    PROTOCOL GUARANTEES
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="font-semibold tracking-[-0.035em] leading-[1.04] text-white px-2"
                  style={{ fontSize: "clamp(40px, 8vw, 76px)" }}
                >
                  Built so the protocol{" "}
                  <span
                    style={{
                      fontStyle: "italic",
                      fontWeight: 500,
                      fontFamily: "ui-serif, Georgia, serif",
                      color: ACCENT,
                    }}
                  >
                    cannot lie.
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                  className="mt-6 text-[14.5px] sm:text-[16px] leading-[1.6] text-white/55 max-w-[560px] mx-auto"
                >
                  No human in the loop. No middleman to call. Every guarantee
                  below is enforced by code, not policy.
                </motion.p>
              </div>

              {/* Metric strip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE }}
                className="grid grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-[820px] mx-auto"
              >
                {[
                  { value: "<400ms", label: "AVG SETTLEMENT" },
                  { value: "100%", label: "BONDED MERCHANTS" },
                  { value: "0", label: "CUSTODIANS" },
                ].map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.08,
                      ease: EASE,
                    }}
                    className="text-center"
                  >
                    <div
                      className="font-semibold leading-none mb-2 tabular-nums"
                      style={{
                        fontFamily: "ui-serif, Georgia, serif",
                        fontSize: "clamp(28px, 5vw, 44px)",
                        letterSpacing: "-0.04em",
                        color: "#fff",
                      }}
                    >
                      {m.value}
                    </div>
                    <div
                      className="text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.22em] text-white/45"
                      style={{ fontFamily: MONO }}
                    >
                      {m.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Dramatic feature bento */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[
                  {
                    icon: Zap,
                    title: "Sub-second settlement",
                    body: "Solana's high throughput means escrow lock and release happen in seconds, not minutes.",
                    tag: "PROOF · ON-CHAIN",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Merchant bonds",
                    body: "Every merchant posts collateral. Cheat the protocol, lose the bond — enforced by smart contract, not lawyers.",
                    tag: "SLASHING · AUTOMATIC",
                  },
                  {
                    icon: Eye,
                    title: "Pseudonymous by design",
                    body: "No phone numbers, no KYC for routine transfers. Trust comes from the protocol, not your personal data.",
                    tag: "PRIVACY · DEFAULT",
                  },
                ].map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                    whileHover={{ y: -6 }}
                    className="group relative p-6 sm:p-7 rounded-[22px] overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow:
                        "0 1px 0 rgba(255,255,255,0.06) inset, 0 30px 80px -30px rgba(0,0,0,0.5)",
                      transition:
                        "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {/* Top hairline accent on hover */}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 50%, transparent 100%)`,
                      }}
                    />

                    {/* Icon + index */}
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT}26, ${ACCENT}0d)`,
                          border: `1px solid ${ACCENT}55`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 20px -8px ${ACCENT}55`,
                        }}
                      >
                        <f.icon
                          className="w-5 h-5"
                          style={{ color: ACCENT }}
                          strokeWidth={2.2}
                        />
                      </div>
                      <span
                        className="text-[10px] font-bold tracking-[0.18em] mt-1"
                        style={{
                          color: "rgba(255,255,255,0.3)",
                          fontFamily: MONO,
                        }}
                      >
                        / 0{i + 1}
                      </span>
                    </div>

                    <h4 className="text-[19px] sm:text-[20px] font-semibold text-white mb-2.5 tracking-[-0.015em] leading-[1.2]">
                      {f.title}
                    </h4>
                    <p className="text-[13.5px] leading-[1.55] text-white/55 mb-5">
                      {f.body}
                    </p>

                    {/* Bottom mono tag with dot */}
                    <div
                      className="flex items-center gap-1.5 pt-4 border-t"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}
                    >
                      <motion.span
                        animate={{ opacity: [1, 0.35, 1] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-1 h-1 rounded-full"
                        style={{ background: ACCENT }}
                      />
                      <span
                        className="text-[9.5px] font-bold tracking-[0.22em]"
                        style={{ color: ACCENT, fontFamily: MONO }}
                      >
                        {f.tag}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── CTA ────────────────────────────────────────── */}
      <CTASection
        eyebrow="The next chapter"
        title={
          <>
            Ready to{" "}
            <span
              style={{
                fontStyle: "italic",
                fontFamily: "ui-serif, Georgia, serif",
                fontWeight: 500,
              }}
            >
              try it?
            </span>
          </>
        }
        description="Join the waitlist for early access, or explore the live order book."
        primaryButtonText="Join Waitlist"
        primaryButtonLink="https://app.blip.money/waitlist/user"
        secondaryButtonText="See the live market"
        secondaryButtonLink="/market"
      />
    </>
  );
};

export default HowItWorksPage;
