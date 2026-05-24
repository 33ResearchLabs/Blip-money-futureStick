import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Globe2,
  TrendingUp,
  Lock,
  Eye,
  type LucideIcon,
} from "lucide-react";
import SEO from "@/components/SEO";
import {
  MerchantDashboardBody,
  useMerchantDashboardState,
} from "@/components/IndexSections/LiveMerchantDashboard";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ────────────────────────────────────────────────────────────
   Annotation pin — sits at a fractional position over the dash
   ────────────────────────────────────────────────────────────*/
function AnnotationPin({
  top,
  left,
  label,
  detail,
  side = "right",
  delay = 0,
}: {
  top: string;
  left: string;
  label: string;
  detail: string;
  side?: "left" | "right";
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="hidden lg:flex absolute z-30 pointer-events-none items-center gap-3"
      style={{
        top,
        left,
        transform: "translate(-50%, -50%)",
        flexDirection: side === "left" ? "row-reverse" : "row",
      }}
    >
      {/* Connector line + dot */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-3 h-3 rounded-full"
          style={{
            background: ACCENT,
            boxShadow: `0 0 0 4px ${ACCENT}22, 0 0 14px ${ACCENT}88`,
          }}
        />
        <div
          className="h-px w-12"
          style={{
            background: `linear-gradient(${
              side === "left" ? "270deg" : "90deg"
            }, ${ACCENT}, transparent)`,
          }}
        />
      </div>

      {/* Tooltip card */}
      <div
        className="rounded-xl px-3.5 py-2.5 backdrop-blur-md"
        style={{
          background: "rgba(20,20,22,0.92)",
          border: `1px solid ${ACCENT}33`,
          boxShadow: `0 14px 36px -10px rgba(0,0,0,0.6), 0 0 24px ${ACCENT}22`,
          minWidth: 180,
          maxWidth: 220,
        }}
      >
        <div
          className="text-[9.5px] font-bold tracking-[0.22em] mb-1"
          style={{ color: ACCENT, fontFamily: MONO }}
        >
          {label}
        </div>
        <div className="text-[12px] text-white leading-[1.45] font-medium">
          {detail}
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Feature card
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
      className="relative p-6 rounded-[20px] overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
        style={{
          background: `${ACCENT}18`,
          border: `1px solid ${ACCENT}44`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: ACCENT }} strokeWidth={2} />
      </div>
      <div
        className="text-[10px] font-bold tracking-[0.22em] mb-2"
        style={{ color: ACCENT, fontFamily: MONO }}
      >
        {String(index + 1).padStart(2, "0")} · FEATURE
      </div>
      <h3 className="text-[17px] font-semibold text-white tracking-[-0.015em] mb-2 leading-[1.25]">
        {title}
      </h3>
      <p className="text-[13.5px] leading-[1.55] text-white/60">{body}</p>
    </motion.div>
  );
}

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Sealed-bid live auctions",
    body:
      "Merchants compete in real-time second-price auctions. You always get the best rate the market can offer at that moment.",
  },
  {
    icon: Lock,
    title: "Non-custodial escrow",
    body:
      "Funds sit in a Solana PDA. No human, no exchange, no custodian holds your money — only the smart contract.",
  },
  {
    icon: ShieldCheck,
    title: "Merchant bonds & slashing",
    body:
      "Every market-maker posts a cryptographic bond. Cheat the protocol, lose the bond. Reputation is on-chain and unforgeable.",
  },
  {
    icon: Zap,
    title: "Sub-second settlement",
    body:
      "Built on Solana. Quote → escrow → release happens in seconds, not the minutes or hours of legacy P2P rails.",
  },
  {
    icon: Eye,
    title: "Pseudonymous by design",
    body:
      "No phone numbers, no KYC for routine transfers. Counter-party risk is handled by the protocol, not your personal info.",
  },
  {
    icon: Globe2,
    title: "Borderless corridors",
    body:
      "USD, AED, INR, and growing. Every corridor is a live order book — open 24/7, no banking hours, no holidays.",
  },
];

const Market = () => {
  const state = useMerchantDashboardState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Blip Market | Live Open Markets"
        description="Trade in live open markets. Real-time sealed-bid auctions, non-custodial escrow, on-chain reputation — all on Solana."
        canonical="https://www.blip.money/market"
      />

      <div className="min-h-screen bg-black text-white mt-20 relative overflow-hidden">
        {/* Ambient orange glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[1200px] h-[700px] rounded-full opacity-[0.12] blur-3xl"
          style={{ background: `radial-gradient(ellipse, ${ACCENT}, transparent 70%)` }}
        />
        {/* Dotted grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, #000 30%, transparent 80%)",
          }}
        />

        {/* ── HERO ───────────────────────────────────────────── */}
        <div className="relative pt-20 pb-12 px-6">
          <div className="max-w-[1280px] mx-auto text-center">
            {/* Status chip */}
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
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
              />
              <span
                className="text-[10.5px] font-bold tracking-[0.22em]"
                style={{ color: ACCENT, fontFamily: MONO }}
              >
                MAINNET · ORDER BOOK LIVE
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
              className="font-semibold tracking-[-0.035em] leading-[1.04] mb-6 max-w-[1000px] mx-auto"
              style={{ fontSize: "clamp(40px, 6.5vw, 80px)" }}
            >
              Trade in{" "}
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                  color: ACCENT,
                }}
              >
                live open markets.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
              className="max-w-[640px] mx-auto text-[16px] leading-[1.6] text-white/60 mb-12"
            >
              An on-chain, sealed-bid auction. Verified merchants compete every
              second. You always trade at the best price the market can offer —
              with non-custodial escrow and a permanent audit trail.
            </motion.p>
          </div>
        </div>

        {/* ── DASHBOARD with annotation pins ─────────────────── */}
        <div className="relative px-4 sm:px-6">
          <div className="max-w-[1280px] mx-auto relative">
            {/* Annotation pins — desktop only, positioned over the dash */}
            <AnnotationPin
              top="14%"
              left="2%"
              label="LIVE ORDER FEED"
              detail="Every pending bid streams in real-time. Click to accept and lock escrow on-chain."
              side="right"
              delay={0.6}
            />
            <AnnotationPin
              top="38%"
              left="98%"
              label="MERCHANT EARNINGS"
              detail="Profit accrues per settled trade. Paid out instantly to your wallet — no withdrawal queue."
              side="left"
              delay={0.7}
            />
            <AnnotationPin
              top="68%"
              left="2%"
              label="REPUTATION SCORE"
              detail="On-chain, unforgeable. Slashed automatically on non-performance."
              side="right"
              delay={0.8}
            />
            <AnnotationPin
              top="88%"
              left="98%"
              label="LIVE NOTIFICATIONS"
              detail="Bid accepted, escrow released, dispute opened — every event is signed and recorded."
              side="left"
              delay={0.9}
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.1, ease: EASE }}
              className="relative rounded-[28px] bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] p-3 md:p-4 overflow-hidden"
              style={{
                boxShadow: `0 60px 140px -40px ${ACCENT}50, 0 30px 80px -30px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06) inset`,
              }}
            >
              {/* Top sheen */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                }}
              />
              <div className="overflow-x-auto">
                <MerchantDashboardBody state={state} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── FEATURES ───────────────────────────────────────── */}
        <div className="relative px-6 mt-24 md:mt-32">
          <div className="max-w-[1180px] mx-auto">
            <div className="mb-10 md:mb-14 text-center max-w-[680px] mx-auto">
              <div
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] mb-4"
                style={{ color: ACCENT, fontFamily: MONO }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: ACCENT }}
                />
                HOW THE MARKET WORKS
              </div>
              <h2
                className="font-semibold tracking-[-0.028em] leading-[1.1] text-white"
                style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
              >
                The first cross-border order book that{" "}
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
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {FEATURES.map((f, i) => (
                <FeatureCard
                  key={f.title}
                  icon={f.icon}
                  title={f.title}
                  body={f.body}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────────── */}
        <div className="relative px-6 mt-24 md:mt-32 pb-32">
          <div className="max-w-[820px] mx-auto text-center">
            <h2
              className="font-semibold tracking-[-0.028em] leading-[1.1] text-white mb-6"
              style={{ fontSize: "clamp(28px, 4.2vw, 48px)" }}
            >
              Start trading the live book.
            </h2>
            <p className="text-[15.5px] text-white/55 leading-[1.6] mb-9 max-w-[520px] mx-auto">
              Join the waitlist. Get early access when your corridor goes live.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/waitlist/user"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-[13px] font-semibold tracking-tight transition-all hover:-translate-y-[1px]"
                style={{
                  background: "#fff",
                  color: "#0a0a0a",
                  boxShadow: "0 14px 36px -10px rgba(255,255,255,0.25)",
                }}
              >
                Join as user
              </a>
              <a
                href="/waitlist/merchant"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-[13px] font-semibold tracking-tight transition-colors"
                style={{
                  background: "transparent",
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                Become a merchant
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Market;
