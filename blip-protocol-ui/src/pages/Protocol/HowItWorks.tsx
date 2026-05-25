import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Gavel,
  Lock,
  CheckCircle2,
  ArrowRight,
  Zap,
  ShieldCheck,
  Eye,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import {
  MerchantDashboardBody,
  useMerchantDashboardState,
} from "@/components/IndexSections/LiveMerchantDashboard";

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
        aspectRatio: "9/19.5",
        width: "100%",
        maxWidth: 280,
        padding: "10px",
        background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
        borderRadius: 50,
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.04) inset, 0 60px 140px -40px rgba(0,0,0,0.7), 0 24px 60px -16px rgba(204,120,92,0.25)",
      }}
    >
      <span aria-hidden className="absolute -left-[2px] top-[18%] h-7 w-[3px] rounded-r bg-[#222]" />
      <span aria-hidden className="absolute -left-[2px] top-[28%] h-12 w-[3px] rounded-r bg-[#222]" />
      <span aria-hidden className="absolute -left-[2px] top-[42%] h-12 w-[3px] rounded-r bg-[#222]" />
      <span aria-hidden className="absolute -right-[2px] top-[32%] h-16 w-[3px] rounded-l bg-[#222]" />
      <div
        className="relative w-full h-full overflow-hidden bg-black"
        style={{ borderRadius: 40 }}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover object-top"
          onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/home.svg")}
        />
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 9,
            width: 86,
            height: 24,
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
          <span className="text-[10.5px] font-bold tracking-[0.22em] text-white/45">
            · {eyebrow}
          </span>
        </div>

        <div className="flex items-start gap-4 mb-5">
          <div
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: `${ACCENT}18`,
              border: `1px solid ${ACCENT}44`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: ACCENT }} strokeWidth={2} />
          </div>
          <h3
            className="font-semibold text-white tracking-[-0.025em] leading-[1.08] flex-1"
            style={{ fontSize: "clamp(26px, 3.4vw, 38px)" }}
          >
            {title}
          </h3>
        </div>

        <p
          className="text-[15px] sm:text-[16px] leading-[1.6] text-white/65 max-w-[520px]"
        >
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
      className="relative rounded-[20px] bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] p-2 sm:p-3 overflow-hidden"
      style={{
        boxShadow:
          "0 60px 140px -40px rgba(204,120,92,0.30), 0 30px 80px -30px rgba(0,0,0,0.6)",
        maxHeight: 480,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
        }}
      />
      <div className="overflow-hidden" style={{ maxHeight: 460 }}>
        <div style={{ transform: "scale(0.72)", transformOrigin: "top left", width: "139%" }}>
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
          <span className="text-[10px] font-bold tracking-[0.18em] text-white/45" style={{ fontFamily: MONO }}>
            USER
          </span>
        </div>

        {/* Escrow center */}
        <div className="flex flex-col items-center gap-2 relative">
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
          <span className="text-[10px] font-bold tracking-[0.18em]" style={{ color: ACCENT, fontFamily: MONO }}>
            ESCROW · PDA
          </span>
          <span className="text-[9px] text-white/40" style={{ fontFamily: MONO }}>
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
          <span className="text-[10px] font-bold tracking-[0.18em] text-white/45" style={{ fontFamily: MONO }}>
            MERCHANT
          </span>
        </div>
      </div>

      {/* Connector lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
        <motion.line
          x1="22%" y1="50%" x2="42%" y2="50%"
          stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
        />
        <motion.line
          x1="58%" y1="50%" x2="78%" y2="50%"
          stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 4"
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
        <div className="flex items-center gap-2 mb-3" style={{ fontFamily: MONO }}>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
          />
          <span className="text-[9.5px] font-bold tracking-[0.22em]" style={{ color: ACCENT }}>
            TX · SETTLED
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="font-bold text-black leading-none"
            style={{ fontFamily: "ui-serif, Georgia, serif", fontSize: 38, letterSpacing: "-0.04em" }}
          >
            +$1,250
          </span>
          <span className="text-[10px] font-bold text-black/40" style={{ fontFamily: MONO }}>
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

  return (
    <>
      <SEO
        title="How Blip Works | Live Merchant Auctions, On-Chain Escrow"
        description="Blip is a live order book for cross-border value. Merchants compete in sealed-bid auctions, funds settle through non-custodial escrow on Solana. Here's how."
        canonical="https://www.blip.money/how-it-works"
      />
      <HreflangTags path="/how-it-works" />

      <div className="min-h-screen bg-black text-white mt-20 relative overflow-hidden">
        {/* Ambient glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[1200px] h-[700px] rounded-full opacity-[0.12] blur-3xl"
          style={{ background: `radial-gradient(ellipse, ${ACCENT}, transparent 70%)` }}
        />
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

        {/* ── HERO ───────────────────────────────────────── */}
        <div className="relative pt-10 sm:pt-20 pb-16 sm:pb-24 px-5 sm:px-6">
          <div className="max-w-[1180px] mx-auto text-center">
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
                PROTOCOL OVERVIEW
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
              className="font-semibold tracking-[-0.035em] leading-[1.04] mb-6 max-w-[920px] mx-auto px-2"
              style={{ fontSize: "clamp(32px, 6.5vw, 80px)" }}
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
              className="max-w-[620px] mx-auto text-[14.5px] sm:text-[16px] leading-[1.6] text-white/60 mb-2 px-2"
            >
              You initiate a trade. Verified merchants compete in a sealed-bid
              auction. The winning bid locks funds in on-chain escrow.
              Settlement releases automatically.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="text-[11px] font-bold tracking-[0.22em] text-white/35 mt-3"
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
              visual={<PhoneFrame src="/screenshots/app-screen-3.png" alt="Blip app wallet" />}
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

        {/* ── WHY IT WORKS ───────────────────────────────── */}
        <div className="relative px-5 sm:px-6 mt-24 sm:mt-36">
          <div className="max-w-[1180px] mx-auto">
            <div className="text-center mb-10 sm:mb-14 max-w-[680px] mx-auto">
              <div
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] mb-4"
                style={{ color: ACCENT, fontFamily: MONO }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                WHY THIS DESIGN
              </div>
              <h2
                className="font-semibold tracking-[-0.028em] leading-[1.1] text-white px-2"
                style={{ fontSize: "clamp(24px, 4vw, 44px)" }}
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
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[
                {
                  icon: Zap,
                  title: "Sub-second settlement",
                  body:
                    "Solana's high throughput means escrow lock and release happen in seconds, not minutes.",
                },
                {
                  icon: ShieldCheck,
                  title: "Merchant bonds",
                  body:
                    "Every merchant posts collateral. Cheat the protocol, lose the bond — enforced by smart contract, not lawyers.",
                },
                {
                  icon: Eye,
                  title: "Pseudonymous by design",
                  body:
                    "No phone numbers, no KYC for routine transfers. Trust comes from the protocol, not your personal data.",
                },
              ].map((f, i) => (
                <FeatureCard key={f.title} {...f} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────── */}
        <div className="relative px-5 sm:px-6 mt-24 sm:mt-36 pb-20 sm:pb-32">
          <div className="max-w-[820px] mx-auto text-center">
            <h2
              className="font-semibold tracking-[-0.028em] leading-[1.1] text-white mb-5 sm:mb-6 px-2"
              style={{ fontSize: "clamp(24px, 4.2vw, 48px)" }}
            >
              Ready to{" "}
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                  color: ACCENT,
                }}
              >
                try it?
              </span>
            </h2>
            <p className="text-[15px] sm:text-[15.5px] text-white/55 leading-[1.6] mb-8 sm:mb-9 max-w-[520px] mx-auto">
              Join the waitlist for early access, or explore the live order
              book.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Link
                to="/waitlist/user"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-[13px] font-semibold tracking-tight transition-all hover:-translate-y-[1px] w-full sm:w-auto"
                style={{
                  background: "#fff",
                  color: "#0a0a0a",
                  boxShadow: "0 14px 36px -10px rgba(255,255,255,0.25)",
                }}
              >
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/market"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-[13px] font-semibold tracking-tight transition-colors w-full sm:w-auto"
                style={{
                  background: "transparent",
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                See the live market
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorksPage;
