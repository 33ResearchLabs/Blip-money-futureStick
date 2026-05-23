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
import { EditableText, EditableImage } from "@/components/dashboard/Editable";
import { useOverride } from "@/hooks/useOverride";
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
            <EditableText id="user.bestrates.eyebrow" default="Best rates · live market" />
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-display font-semibold leading-[1.05] tracking-tight mb-5"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            <EditableText id="user.bestrates.title.pre" default="We provide the " as="span" />
            <EditableText
              id="user.bestrates.title.accent"
              default="best rates"
              as="span"
              style={{ fontStyle: "italic", fontFamily: "ui-serif, Georgia, serif", fontWeight: 500 }}
              className="text-white/75"
            />
            <EditableText id="user.bestrates.title.post" default=" in the market." as="span" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="text-white/60 text-[15px] md:text-base leading-relaxed max-w-lg mb-8"
          >
            <EditableText
              id="user.bestrates.sub"
              default="Find a cheaper rate anywhere — we'll beat it. Live merchant quotes compete on every order so you always settle at the sharpest price."
              multiline
            />
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
              <EditableText id="user.bestrates.cta.primary" default="Find the best rate" as="span" />
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full border border-white/20 text-white text-[14.5px] font-semibold tracking-tight hover:bg-white/[0.06] transition-colors"
            >
              <EditableText id="user.bestrates.cta.secondary" default="Join waitlist" as="span" />
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
    <section className="relative min-h-[92vh] overflow-hidden flex flex-col items-stretch bg-white text-black">
      <main className="relative z-10 w-full max-w-[1180px] mx-auto px-4 md:px-10 pt-16 md:pt-24 pb-16 md:pb-24 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_minmax(360px,460px)] gap-10 lg:gap-14 items-center min-h-[80vh] lg:min-h-[70vh]">
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        {/* Eyebrow chip — live USDT/INR rate */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <span className="w-5 h-px bg-black/15" />
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase whitespace-nowrap text-black inline-flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#cc785c]"
            />
            Live · USDT / INR
            <motion.span
              key={rate}
              initial={{ opacity: 0.6, y: -1 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono tabular-nums text-black/65"
            >
              {rate.toFixed(2)}
            </motion.span>
          </span>
          <span className="w-5 h-px bg-black/15" />
        </motion.div>

        {/* Headline — big landing-hero scale on mobile, calmer on desktop */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}
          className="font-display text-black w-full max-w-none lg:max-w-[560px] px-1 lg:px-0 text-[clamp(3.2rem,11vw,3.9rem)] lg:text-[clamp(1.7rem,3.6vw,2.6rem)] mb-4 lg:mb-5"
          style={{
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: "-0.055em",
          }}
        >
          <EditableText id="user.hero.title.line1" default="Send crypto." />{" "}
          <EditableText id="user.hero.title.line2" default="Get fiat instantly." as="span" style={{ fontStyle: "italic", fontWeight: 600 }} className="lg:font-medium" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.18 }}
          className="text-black/55 text-[15px] md:text-[16px] leading-[1.55] tracking-tight max-w-[560px] mx-auto lg:mx-0 mb-7"
        >
          <EditableText id="user.hero.sub" default="Convert USDT, USDC, or SOL to AED, INR, and more — settled on-chain, landed in your bank." multiline />
        </motion.p>

        {/* Live settlement-request card — split into 2 stacked cards on mobile, single card on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.4 }}
          className="w-full max-w-[440px] mb-5"
        >
          <div className="flex flex-col gap-2 sm:gap-0 sm:rounded-2xl sm:overflow-hidden sm:bg-white sm:border sm:border-black/[0.08]">
            {/* Card A: header + Send */}
            <div className="rounded-2xl sm:rounded-none bg-white border border-black/[0.08] sm:border-0">
              <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inset-0 rounded-full bg-[#cc785c] opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#cc785c]" />
                  </span>
                  <span className="text-[9px] font-semibold tracking-[0.16em] uppercase text-black/55">
                    Live Settlement Request
                  </span>
                </div>
                <span className="text-[9px] font-mono text-black/40">#REQ-8421</span>
              </div>

              <div className="px-3 pb-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 text-left">
                    <div className="text-[8.5px] font-semibold tracking-[0.14em] uppercase text-black/45">You send</div>
                    <div className="font-mono text-[17px] font-semibold tracking-tight text-black tabular-nums leading-tight">
                      1,000 <span className="text-[11px] font-semibold text-black/55">USDT</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-black/30 shrink-0 hidden sm:block" />
                  {/* Desktop: receive on the right */}
                  <div className="text-right min-w-0 hidden sm:block">
                    <div className="text-[8.5px] font-semibold tracking-[0.14em] uppercase text-black/55">You receive</div>
                    <div className="font-mono text-[17px] font-semibold tracking-tight tabular-nums leading-tight" style={{ color: "#cc785c" }}>
                      {outAmount.toLocaleString()} <span className="text-[11px] font-semibold text-black/55">INR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card B: receive — mobile only */}
            <div className="sm:hidden rounded-2xl bg-white border border-black/[0.08]">
              <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                <div className="text-left min-w-0">
                  <div className="text-[8.5px] font-semibold tracking-[0.14em] uppercase text-black/55">You receive</div>
                  <div className="font-mono text-[17px] font-semibold tracking-tight tabular-nums leading-tight" style={{ color: "#cc785c" }}>
                    {outAmount.toLocaleString()} <span className="text-[11px] font-semibold text-black/55">INR</span>
                  </div>
                </div>
                <div className="text-[8.5px] font-semibold tracking-[0.14em] uppercase text-black/45 flex items-center gap-1.5">
                  <Lock className="w-2.5 h-2.5" /> ESCROW · ~42s
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTAs — full-width bold on mobile, calmer inline on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.52 }}
          className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-2 mt-2 w-full"
        >
          <a
            href="https://app.blip.money/waitlist/user"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto h-14 sm:h-12 lg:h-11 px-8 sm:px-7 lg:px-6 rounded-full bg-black text-white text-[17.5px] sm:text-[15px] lg:text-[13.5px] font-bold tracking-tight transition-transform hover:-translate-y-[1px] shadow-[0_10px_28px_-12px_rgba(0,0,0,0.55)] lg:shadow-none"
          >
            <EditableText id="user.hero.cta.primary" default="Join Waitlist" as="span" />
            <ArrowRight className="w-5 h-5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
          <Link
            to="/how-it-works"
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto h-14 sm:h-12 lg:h-11 px-8 sm:px-6 lg:px-5 rounded-full text-[17px] sm:text-[14.5px] lg:text-[13.5px] font-bold lg:font-semibold tracking-tight transition-all hover:-translate-y-[1px]"
            style={{
              background: "rgba(204,120,92,0.10)",
              color: "#cc785c",
              border: "1.5px solid #cc785c",
            }}
          >
            <EditableText id="user.hero.cta.secondary" default="See how it works" as="span" />
            <ArrowRight className="w-5 h-5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>

      {/* RIGHT: Corrector character — desktop only (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.25, ease: EASE }}
        className="hidden lg:block relative w-full aspect-[4/5] max-w-[520px] mx-auto rounded-[28px] overflow-hidden bg-[#f7f4ee] border border-black/[0.06]"
      >
        <img
          src="/illustrations/user-corrector-phone.png"
          alt="The Corrector — character using a phone to send money"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/illustrations/hero-char-1.png";
          }}
        />
      </motion.div>
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
              <EditableText id="user.why.eyebrow" default="Why Blip" />
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.05] mb-6"
            >
              <EditableText id="user.why.title.pre" default="Crypto out, " as="span" />
              <EditableText id="user.why.title.accent" default="cash in." as="span" className="text-black/60 dark:text-white/40" />
              <br />
              <EditableText id="user.why.title.post" default="Under a minute." as="span" />
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-black/60 dark:text-white/50 mb-10 max-w-lg"
            >
              <EditableText id="user.why.sub" default="No banks. No delays. No middlemen. Blip matches you instantly with vetted merchants and settles via escrow." multiline />
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
                      <EditableText id={`user.why.item${i}.title`} default={f.title} as="span" />
                    </div>
                    <div className="text-sm text-black/50 dark:text-white/50">
                      <EditableText id={`user.why.item${i}.desc`} default={f.desc} as="span" />
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
                <EditableText id="user.why.overlay.eyebrow" default="Instant" as="span" />
              </div>
              <div className="font-display text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight">
                <EditableText id="user.why.overlay.line1" default="Crypto to cash." as="span" />
                <br />
                <EditableText id="user.why.overlay.line2" default="In under a minute." as="span" className="text-white/70" />
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
            <EditableText id="user.howitworks.eyebrow" default="How it works" />
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-5"
          >
            <EditableText id="user.howitworks.title.pre" default="Four steps. " as="span" />
            <EditableText id="user.howitworks.title.accent" default="Under a minute." as="span" className="text-black/60 dark:text-white/40" />
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
                      <EditableText id={`user.howitworks.step${i}.title`} default={s.title} as="span" />
                    </h3>
                    <p className="text-sm text-black/60 dark:text-white/55 leading-relaxed">
                      <EditableText id={`user.howitworks.step${i}.desc`} default={s.desc} as="span" />
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
function PhoneScreenImage({ defaultSrc }: { defaultSrc: string }) {
  const [src] = useOverride<string>("image:user.app.screenshot", defaultSrc);
  return (
    <img
      src={src}
      alt="Blip app — unlocked wallet"
      className="absolute inset-0 w-full h-full object-cover object-top"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/home.svg";
      }}
    />
  );
}

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
      <PhoneScreenImage defaultSrc={src} />

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
  line: React.ReactNode;
  accent: React.ReactNode;
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

  const lines: { text: React.ReactNode; accent: React.ReactNode; Icon: React.ElementType }[] = [
    { text: <EditableText id="user.app.line0.text" default="Settle in under" as="span" />, accent: <EditableText id="user.app.line0.accent" default="a minute." as="span" />, Icon: Zap },
    { text: <EditableText id="user.app.line1.text" default="Best rates," as="span" />, accent: <EditableText id="user.app.line1.accent" default="guaranteed." as="span" />, Icon: BadgeCheck },
    { text: <EditableText id="user.app.line2.text" default="Your keys." as="span" />, accent: <EditableText id="user.app.line2.accent" default="Your money." as="span" />, Icon: Lock },
    { text: <EditableText id="user.app.line3.text" default="Every order," as="span" />, accent: <EditableText id="user.app.line3.accent" default="live." as="span" />, Icon: Activity },
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
            <EditableText id="user.app.eyebrow" default="The app" as="span" />
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
            <EditableText id="user.app.title.pre" default="One app. " />
            <EditableText
              id="user.app.title.accent"
              default="Everything you need."
              as="span"
              style={{ fontStyle: "italic", fontFamily: "ui-serif, Georgia, serif", fontWeight: 500 }}
              className="text-white/65"
            />
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
            ].map((s, i) => (
              <div key={s.lbl}>
                <div
                  className="font-display text-white tabular-nums"
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                  }}
                >
                  <EditableText id={`user.app.stat${i}.val`} default={s.val} as="span" />
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/45 mt-1.5">
                  <EditableText id={`user.app.stat${i}.lbl`} default={s.lbl} as="span" />
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
            <EditableText id="user.safety.eyebrow" default="Safety" />
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-5"
          >
            <EditableText id="user.safety.title.pre" default="Built for " as="span" />
            <EditableText id="user.safety.title.accent" default="peace of mind." as="span" className="text-black/60 dark:text-white/40" />
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
                  <EditableText id={`user.safety.card${i}.title`} default={c.title} as="span" />
                </h3>
                <p className="text-sm font-medium text-black/55 dark:text-white/55 leading-relaxed">
                  <EditableText id={`user.safety.card${i}.desc`} default={c.desc} as="span" />
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
          <EditableText id="user.cta.title.pre" default="Ready to try " />
          <EditableText id="user.cta.title.accent" default="Blip?" as="span" className="text-black/60 dark:text-white/40" />
        </h2>
        <p className="text-lg text-black/60 dark:text-white/50 mb-10 max-w-xl mx-auto">
          <EditableText id="user.cta.sub" default="Join the waitlist. Early users get priority access and bonus rewards." multiline />
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
