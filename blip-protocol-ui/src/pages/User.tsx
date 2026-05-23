import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  Shield,
  Globe,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Lock,
  Activity,
  Eye,
  BadgeCheck,
  Sparkles,
  Clock,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO, StructuredData } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import { CTAButton } from "@/components/Navbar";
import { SwipeHint } from "@/components/IndexSections/SwipeHint";
import SendGloballySection from "@/components/IndexSections/SendGloballySection";
import BestRatesSection from "@/components/IndexSections/BestRatesSection";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ============================================
   BEST RATES — black band, image left, text right
   ============================================ */
const BestRatesBlackSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} className="relative bg-black text-white overflow-hidden py-20 md:py-28">
      <div className="max-w-[1180px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* LEFT — image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: EASE }}
          className="relative w-full aspect-[4/5] max-w-[520px] mx-auto lg:mx-0 rounded-[28px] overflow-hidden bg-[#0f0f0f] border border-white/[0.06]"
        >
          <img
            src="/illustrations/rate-neon-card.png"
            alt="Best rates in the market — live rate ticker"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/illustrations/hero-char-2.png";
            }}
          />
        </motion.div>

        {/* RIGHT — text */}
        <div className="text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-[11px] uppercase tracking-[0.3em] text-white/45 font-semibold mb-5"
          >
            Best rates · live market
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-display font-semibold leading-[1.05] tracking-tight mb-5"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            We provide the{" "}
            <span style={{ fontStyle: "italic", fontFamily: "ui-serif, Georgia, serif", fontWeight: 500 }} className="text-white/75">
              best rates
            </span>{" "}
            in the market.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="text-white/60 text-[15px] md:text-base leading-relaxed max-w-lg mb-8"
          >
            Find a cheaper rate anywhere — we&apos;ll beat it. Live merchant
            quotes compete on every order so you always settle at the
            sharpest price.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            className="flex flex-col sm:flex-row items-start gap-3"
          >
            <Link
              to="/rates"
              className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-white text-black text-[14.5px] font-bold tracking-tight transition-transform hover:-translate-y-[1px]"
            >
              <span>Find the best rate</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full border border-white/20 text-white text-[14.5px] font-semibold tracking-tight hover:bg-white/[0.06] transition-colors"
            >
              <span>Join waitlist</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   1. CINEMATIC HERO
   ============================================ */
const UserHero = () => {
  // USDT / INR only
  const BASE_RATE = 97.2;
  const [rate, setRate] = useState(BASE_RATE);
  useEffect(() => {
    const id = setInterval(() => {
      setRate(+(BASE_RATE + (Math.random() - 0.5) * 0.1).toFixed(2));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Receiving amount (1,000 USDT * rate, with small live wobble)
  const [outAmount, setOutAmount] = useState(Math.round(1000 * BASE_RATE));
  useEffect(() => {
    let frame = 0;
    const baseOut = Math.round(1000 * BASE_RATE);
    const id = setInterval(() => {
      frame = (frame + 1) % 60;
      const wobble = Math.floor(Math.sin(frame * 0.6) * 180);
      setOutAmount(baseOut + wobble);
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[92vh] overflow-hidden flex items-center justify-center bg-white text-black">
      <main className="relative z-10 w-full max-w-[1180px] mx-auto px-6 md:px-10 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* LEFT: text + converter card + CTAs */}
          <div className="text-left">
            {/* Live rate chip */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-black/10 bg-black/[0.03] mb-6"
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-black"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/65">
                Live · USDT / INR
              </span>
              <motion.span
                key={rate}
                initial={{ opacity: 0.6, y: -1 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-mono font-bold text-black tabular-nums"
              >
                {rate.toFixed(2)}
              </motion.span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="font-display text-black font-semibold tracking-tight leading-[1.04] mb-6"
              style={{ fontSize: "clamp(1.7rem, 3.6vw, 2.6rem)", letterSpacing: "-0.04em" }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
                className="block"
              >
                Send crypto.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
                className="block text-black/70"
                style={{ fontStyle: "italic", fontFamily: "ui-serif, Georgia, serif", fontWeight: 500 }}
              >
                Get fiat instantly.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              className="text-black/60 text-[15px] md:text-base leading-relaxed max-w-md mb-7"
            >
              Convert USDT, USDC, or SOL to AED, INR, and more — settled
              on-chain, landed in your bank.
            </motion.p>

            {/* Live mini-converter mockup */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: EASE }}
              className="mb-7 w-full max-w-[460px] rounded-2xl border border-black/[0.08] bg-white p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.18)]"
            >
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div className="text-left">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/45 mb-1">
                    You send
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono font-bold text-black text-[20px] tabular-nums">
                      1,000
                    </span>
                    <span className="text-[11px] font-semibold text-black/55">
                      USDT
                    </span>
                  </div>
                </div>

                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-black/15 bg-black/[0.04]"
                >
                  <ArrowRight className="w-4 h-4 text-black" strokeWidth={2.5} />
                </motion.div>

                <div className="text-right">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/55 mb-1">
                    You receive
                  </div>
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <motion.span
                      key={outAmount}
                      initial={{ opacity: 0.7, y: -2 }}
                      className="font-mono font-bold text-black text-[20px] tabular-nums"
                    >
                      {outAmount.toLocaleString()}
                    </motion.span>
                    <span className="text-[11px] font-semibold text-black/55">
                      INR
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-black/[0.06] flex items-center justify-between text-[10px] text-black/45">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-2.5 h-2.5" /> Escrow secured
                </span>
                <span className="font-mono">~42s settlement</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-black" />
                  On-chain
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
              className="flex flex-col sm:flex-row items-start gap-3"
            >
              <CTAButton to="/register" className="min-w-[220px] sm:min-w-0">Join waitlist</CTAButton>
              <CTAButton to="/how-it-works" variant="secondary" className="min-w-[220px] sm:min-w-0">
                See how it works
              </CTAButton>
            </motion.div>
          </div>

          {/* RIGHT: Corrector character using a phone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
            className="relative w-full aspect-[4/5] max-w-[520px] mx-auto rounded-[28px] overflow-hidden bg-[#f7f4ee] border border-black/[0.06]"
          >
            <img
              src="/illustrations/user-corrector-phone.png"
              alt="The Corrector — character using a phone to send money"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Fallback while the Corrector illustration is being generated.
                (e.currentTarget as HTMLImageElement).src = "/illustrations/hero-char-1.png";
              }}
            />
          </motion.div>
        </div>
      </main>
    </section>
  );
};

/* ============================================
   2. WHY BLIP — Big image section (kept as big section with image)
   ============================================ */
const WhyBlipForUsers = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { title: "No middleman", desc: "Swap peer-to-peer, settle on-chain." },
    { title: "Your wallet, your keys", desc: "Non-custodial by design." },
    { title: "Fair market rates", desc: "Live rates, transparent margin." },
  ];

  return (
    <section ref={ref} className="relative bg-[#FAF8F5] dark:bg-transparent text-black dark:text-white overflow-hidden py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* LEFT: headline + features */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[11px] uppercase tracking-[0.3em] text-black/60 dark:text-white/30 font-semibold mb-4"
            >
              Why Blip
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.05] mb-6"
            >
              Crypto out,{" "}
              <span className="text-black/60 dark:text-white/40">cash in.</span>
              <br />
              Under a minute.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-black/60 dark:text-white/50 mb-10 max-w-lg"
            >
              No banks. No delays. No middlemen. Blip matches you instantly with vetted merchants and settles via escrow.
            </motion.p>

            <div className="space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] lift-on-hover"
                >
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
  <CheckCircle2 className="w-3.5 h-3.5 text-black/75 dark:text-white/85" />
</div>
                  <div>
                    <div className="font-semibold text-black dark:text-white mb-0.5">
                      {f.title}
                    </div>
                    <div className="text-sm text-black/50 dark:text-white/50">
                      {f.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: big image card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-black to-[#1a1a1a]"
          >
            <img
              src="/user-p2p.jpg"
              alt="Crypto to cash in under a minute"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/peer2peer.webp";
              }}
            />
            {/* Strong bottom-to-top gradient so the overlay text reads as part of the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute bottom-20 left-0 right-0 p-8">
              <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#ff6b35] mb-3">
                Instant
              </div>
              <div className="font-display text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight">
                Crypto to cash.
                <br />
                <span className="text-white/70">In under a minute.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   3. HOW IT WORKS — 4-step modern flow
   ============================================ */
const UserHowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: Wallet,
      title: "Connect wallet",
      desc: "Phantom, Solflare, or any Solana-compatible wallet.",
      accent: "#7877ff",
      glow: "rgba(120,119,255,0.18)",
    },
    {
      icon: Sparkles,
      title: "Pick your rate",
      desc: "See live market rates. Pick the best merchant match.",
      accent: "#ff6b35",
      glow: "rgba(255,107,53,0.18)",
    },
    {
      icon: Lock,
      title: "Escrow locks funds",
      desc: "Your crypto is locked on-chain. The merchant is committed.",
      accent: "#cc785c",
      glow: "rgba(61,220,132,0.18)",
    },
    {
      icon: Zap,
      title: "Cash lands",
      desc: "Fiat hits your bank. Escrow releases. Done.",
      accent: "#3ec5ff",
      glow: "rgba(62,197,255,0.18)",
    },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden bg-[#FAF8F5] dark:bg-black">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.3em] text-black/60 dark:text-white/30 font-semibold mb-4"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-5"
          >
            Four steps.{" "}
            <span className="text-black/60 dark:text-white/40">Under a minute.</span>
          </motion.h2>
        </div>

        {/* Step cards with connecting line — mobile snap-scroll */}
        <div className="relative">
        <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Connecting line (desktop only) */}
          {/* <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-black/10 dark:bg-white/10" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.6, delay: 0.6, ease: "easeOut" }}
            className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-[#ff6b35] via-[#ff6b35] to-transparent origin-left"
          /> */}

          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: EASE }}
                className="snap-start shrink-0 w-[80%] md:w-auto relative group"
              >
                <div className="relative bg-white dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden lift-on-hover group-hover:border-[#ff6b35]/25 transition-colors">
                  {/* Visual hero — subtle monochrome scene */}
                  <div className="relative h-[140px] flex items-center justify-center overflow-hidden bg-black/[0.02] dark:bg-white/[0.015] ">
                    {/* Step number badge — minimal orange */}
                    <span
                      className="absolute top-3 right-3 text-[10px] font-mono font-bold tabular-nums px-2 py-0.5 rounded-full bg-white/85 dark:bg-black/40 backdrop-blur-md text-black/75 dark:text-white/85"
                    >
                      0{i + 1}
                    </span>
                    {/* Monochrome icon panel */}
                    <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 bg-black/[0.04] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 group-hover:border-[#ff6b35]/30">
                      <Icon
                        className="w-6 h-6 text-black/75 dark:text-white/85 group-hover:text-[#ff6b35] transition-colors"
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>
                  {/* Body */}
                  <div className="p-6">
                    <h3 className="font-semibold text-black dark:text-white text-base mb-1.5 tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-sm text-black/60 dark:text-white/55 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <SwipeHint />
        </div>
      </div>
    </section>
  );
};

/* ─── Realistic iPhone 15 Pro frame around the screenshot ─── */
const IPhoneFrame = ({ src }: { src: string }) => (
  <div
    className="relative mx-auto"
    style={{
      aspectRatio: "9/19.5",
      width: "100%",
      padding: "10px",
      background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
      borderRadius: 54,
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow:
        "0 0 0 1px rgba(255,255,255,0.04) inset, 0 80px 180px -40px rgba(0,0,0,0.7), 0 30px 80px -20px rgba(0,0,0,0.6)",
    }}
  >
    {/* Side buttons */}
    <span aria-hidden className="absolute -left-[2px] top-[18%] h-9 w-[3px] rounded-r bg-[#222]" />
    <span aria-hidden className="absolute -left-[2px] top-[28%] h-14 w-[3px] rounded-r bg-[#222]" />
    <span aria-hidden className="absolute -left-[2px] top-[42%] h-14 w-[3px] rounded-r bg-[#222]" />
    <span aria-hidden className="absolute -right-[2px] top-[32%] h-20 w-[3px] rounded-l bg-[#222]" />

    {/* Inner screen */}
    <div
      className="relative w-full h-full overflow-hidden bg-black"
      style={{ borderRadius: 44 }}
    >
      <img
        src={src}
        alt="Blip app — unlocked wallet"
        className="absolute inset-0 w-full h-full object-cover object-top"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/home.svg";
        }}
      />
      {/* Dynamic Island */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: 10,
          width: 96,
          height: 28,
          borderRadius: 999,
          background: "#000",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
          zIndex: 2,
        }}
      />
    </div>
  </div>
);

/* ─── Tooltip callout — rounded pill with icon + connector line to the phone ─── */
const Tooltip = ({
  line,
  accent,
  Icon,
  side,
  delay,
}: {
  line: string;
  accent: string;
  Icon: React.ElementType;
  side: "left" | "right" | "mobile";
  delay: number;
}) => {
  const isMobile = side === "mobile";
  const isLeft = side === "left";
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -20 : isMobile ? 0 : 20, y: isMobile ? 12 : 8, scale: 0.94 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover={{ y: -3, scale: 1.02 }}
      className={`relative ${isMobile ? "" : isLeft ? "pr-5" : "pl-5"}`}
    >
      {/* Scroll-triggered glow halo behind the pill */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, margin: "-10%" }}
        transition={{ duration: 1.2, delay, ease: EASE }}
        className="absolute inset-0 -m-6 rounded-[28px] pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 50%, rgba(204,120,92,0.28), transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: delay * 2 }}
        className="relative rounded-2xl px-4 py-3 max-w-[280px] flex items-start gap-3"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow:
            "0 24px 48px -22px rgba(0,0,0,0.45), 0 8px 18px -8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Subtle inner gloss */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 50%, transparent)",
          }}
        />
        <span
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: 32,
            height: 32,
            background: "#0a0a0a",
            color: "#ffffff",
          }}
        >
          <Icon className="w-4 h-4" strokeWidth={2.2} />
        </span>
        <p
          className="font-display text-black"
          style={{
            fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)",
            fontWeight: 600,
            letterSpacing: "-0.022em",
            lineHeight: 1.25,
          }}
        >
          {line}{" "}
          <span
            style={{
              fontStyle: "italic",
              fontFamily: "ui-serif, Georgia, serif",
              fontWeight: 500,
              color: "#cc785c",
            }}
          >
            {accent}
          </span>
        </p>
        {/* Bubble tail */}
        {!isMobile && (
          <>
            <span
              aria-hidden
              className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? "-right-[5px]" : "-left-[5px]"} w-2.5 h-2.5 rotate-45`}
              style={{
                background: "#ffffff",
                borderRight: isLeft ? "1px solid rgba(0,0,0,0.06)" : undefined,
                borderTop: isLeft ? undefined : "1px solid rgba(0,0,0,0.06)",
                borderLeft: isLeft ? undefined : "1px solid rgba(0,0,0,0.06)",
                borderBottom: isLeft ? "1px solid rgba(0,0,0,0.06)" : undefined,
              }}
            />
            {/* Animated connector line */}
            <motion.span
              aria-hidden
              className={`absolute top-1/2 ${isLeft ? "left-full ml-2" : "right-full mr-2"} h-[2px] rounded-full`}
              style={{
                width: 56,
                background:
                  "linear-gradient(90deg, rgba(204,120,92,0.85) 0%, rgba(204,120,92,0.15) 100%)",
                transform: isLeft ? "translateY(-50%)" : "translateY(-50%) scaleX(-1)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay }}
            />
            {/* Travelling dot along the connector */}
            <motion.span
              aria-hidden
              className={`absolute top-1/2 ${isLeft ? "left-full ml-2" : "right-full mr-2"} w-1.5 h-1.5 rounded-full`}
              style={{
                background: "#cc785c",
                boxShadow: "0 0 8px rgba(204,120,92,0.8)",
                transform: "translateY(-50%)",
              }}
              animate={{ x: isLeft ? [0, 48, 0] : [0, -48, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

/* ============================================
   4. APP PREVIEW — grand scroll-revealed copy + phone image
   ============================================ */
const AppPreviewSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const lines: { text: string; accent: string; Icon: React.ElementType }[] = [
    { text: "Settle in under", accent: "a minute.", Icon: Zap },
    { text: "Best rates,", accent: "guaranteed.", Icon: BadgeCheck },
    { text: "Your keys.", accent: "Your money.", Icon: Lock },
    { text: "Every order,", accent: "live.", Icon: Activity },
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-32 overflow-hidden bg-black text-white"
    >
      {/* Apple-style ambient backdrop: ultra-subtle grid + soft spotlight */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 65% 55% at 50% 45%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 55% at 50% 45%, black 30%, transparent 80%)",
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(204,120,92,0.18), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-6 md:px-10">
        {/* Grand header */}
        <div className="text-center mb-16 md:mb-20 max-w-[820px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-[12px] font-bold uppercase tracking-[0.36em] mb-6"
            style={{ color: "#cc785c" }}
          >
            The app
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            className="font-display text-white"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 3.6rem)",
              fontWeight: 600,
              letterSpacing: "-0.045em",
              lineHeight: 1.02,
            }}
          >
            One app.{" "}
            <span
              style={{
                fontStyle: "italic",
                fontFamily: "ui-serif, Georgia, serif",
                fontWeight: 500,
              }}
              className="text-white/65"
            >
              Everything you need.
            </span>
          </motion.h2>
        </div>

        {/* Centered iPhone with tooltip callouts pointing to it */}
        <div className="relative">
          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_minmax(300px,360px)_1fr] gap-8 lg:gap-12 items-center">
            {/* LEFT column — top-left + bottom-left tooltips */}
            <div className="hidden lg:flex flex-col gap-20 justify-center items-end">
              {[lines[0], lines[2]].map((line, i) => (
                <Tooltip key={`l-${i}`} line={line.text} accent={line.accent} Icon={line.Icon} side="left" delay={0.25 + i * 0.18} />
              ))}
            </div>

            {/* CENTER — iPhone frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
              className="relative w-[78%] sm:w-full max-w-[280px] sm:max-w-[340px] mx-auto"
            >
              <IPhoneFrame src="/illustrations/app-unlocked-wallet.png" />
            </motion.div>

            {/* RIGHT column — top-right + bottom-right tooltips */}
            <div className="hidden lg:flex flex-col gap-20 justify-center items-start">
              {[lines[1], lines[3]].map((line, i) => (
                <Tooltip key={`r-${i}`} line={line.text} accent={line.accent} Icon={line.Icon} side="right" delay={0.35 + i * 0.18} />
              ))}
            </div>

            {/* MOBILE — stacked tooltips under the phone */}
            <div className="lg:hidden flex flex-col gap-3 max-w-[480px] mx-auto mt-4">
              {lines.map((line, i) => (
                <Tooltip key={`m-${i}`} line={line.text} accent={line.accent} Icon={line.Icon} side="mobile" delay={i * 0.1} />
              ))}
            </div>
          </div>

          {/* Stats row — centered under the whole composition */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            className="mt-16 md:mt-20 pt-8 border-t border-white/[0.08] grid grid-cols-3 gap-4 sm:gap-6 max-w-[640px] mx-auto text-center"
          >
            {[
              { val: "<60s", lbl: "avg settlement" },
              { val: "0%", lbl: "protocol fees" },
              { val: "24/7", lbl: "always on" },
            ].map((s) => (
              <div key={s.lbl}>
                <div
                  className="font-display text-white tabular-nums"
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {s.val}
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/45 mt-1.5">
                  {s.lbl}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   5. SAFETY / TRUST — modern 4-card grid
   ============================================ */
const UserTrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cards = [
    {
      icon: Lock,
      title: "Non-custodial",
      desc: "You hold your keys. We never touch your funds.",
      accent: "#7877ff",
      glow: "rgba(120,119,255,0.20)",
    },
    {
      icon: Shield,
      title: "Escrow-backed",
      desc: "Every trade protected by on-chain escrow.",
      accent: "#ff6b35",
      glow: "rgba(255,107,53,0.22)",
    },
    {
      icon: Eye,
      title: "Fully transparent",
      desc: "Every transaction verifiable on Blip Scan.",
      accent: "#3ec5ff",
      glow: "rgba(62,197,255,0.22)",
    },
    {
      icon: BadgeCheck,
      title: "Vetted merchants",
      desc: "Reputation tracked. Non-performers removed.",
      accent: "#cc785c",
      glow: "rgba(61,220,132,0.20)",
    },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden bg-[#FAF8F5] dark:bg-black">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.3em] text-black/60 dark:text-white/30 font-semibold mb-4"
          >
            Safety
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-5"
          >
            Built for{" "}
            <span className="text-black/60 dark:text-white/40">peace of mind.</span>
          </motion.h2>
        </div>

        <div className="relative">
        <div className="flex md:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto  snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="snap-start shrink-0 w-[80%] md:w-auto group relative p-8 rounded-3xl text-center border border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 duration-500 transition-colors"
                style={{ background: "rgba(255, 255, 255, 0.02)" }}
              >
                {/* Step number watermark in corner */}
                <span
                  className="absolute top-4 right-4 text-4xl font-bold select-none text-black/25 dark:text-[#ff6b35]/40" //dark:text-white/20
                >
                  0{i + 1}
                </span>

                {/* Icon panel — adapts to theme */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-105 bg-black/[0.04] dark:bg-white/[0.05] border border-black/10 dark:border-white/10"
                >
                  <Icon
                    className="w-7 h-7 text-black/80 dark:text-white/85"
                    strokeWidth={2.2}
                  />
                </div>

                <h3 className="text-lg font-semibold text-black/80 dark:text-white/85 mb-2 tracking-tight">
                  {c.title}
                </h3>
                <p className="text-sm font-medium text-black/55 dark:text-white/55 leading-relaxed">
                  {c.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
        <SwipeHint />
        </div>
      </div>
    </section>
  );
};

/* ============================================
   6. FINAL CTA
   ============================================ */
const UserCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-12 md:py-36 overflow-hidden bg-[#FAF8F5] dark:bg-black">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,107,53,0.08), transparent 70%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: EASE }}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight leading-[1.05] mb-6">
          Ready to try{" "}
          <span className="text-black/60 dark:text-white/40">Blip?</span>
        </h2>
        <p className="text-lg text-black/60 dark:text-white/50 mb-10 max-w-xl mx-auto">
          Join the waitlist. Early users get priority access and bonus rewards.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <CTAButton to="/register" className="min-w-[220px]">Join waitlist</CTAButton>
          <CTAButton to="/how-it-works" variant="secondary" className="min-w-[220px]">
            Learn more
          </CTAButton>
        </div>
      </motion.div>
    </section>
  );
};

/* ============================================
   PAGE
   ============================================ */
const User = () => {
  return (
    <>
      <SEO
        title="Blip Money for Users — Instant crypto-to-cash settlement"
        canonical="https://www.blip.money/user"
        description="Convert crypto to fiat instantly with Blip. Non-custodial, escrow-backed, peer-to-peer settlement with live market rates."
        keywords="crypto to cash, USDT to AED, USDT to INR, non-custodial swap, peer-to-peer crypto"
      />
      <HreflangTags path="/user" />
      <StructuredData type="website" />

      <UserHero />
      <BestRatesBlackSection />
      <SendGloballySection />
      <AppPreviewSection />
      <UserTrustSection />
      <UserCTA />
    </>
  );
};

export default User;
