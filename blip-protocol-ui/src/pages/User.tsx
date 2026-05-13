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

const EASE = [0.16, 1, 0.3, 1] as const;

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
    <section className="relative min-h-[92vh] overflow-hidden flex items-center justify-center text-center bg-black">
      {/* Deep gradient base */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,107,53,0.16) 0%, rgba(255,107,53,0.04) 30%, transparent 65%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(120,119,255,0.10) 0%, transparent 70%), #050507",
        }}
      />

      {/* Dotted constellation grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 50%, black 25%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 50%, black 25%, transparent 80%)",
        }}
      />

      {/* Drifting motes */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute w-1 h-1 rounded-full bg-white/30"
          style={{
            left: `${6 + ((i * 43 + 11) % 88)}%`,
            top: `${12 + ((i * 53 + 7) % 72)}%`,
          }}
          animate={{
            y: [0, -28, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 5 + (i % 4) * 0.6,
            repeat: Infinity,
            delay: (i % 6) * 0.4,
          }}
        />
      ))}

      <main className="relative z-10 w-full max-w-[920px] mx-auto px-6 md:px-10 pt-28 pb-24 text-center">
        {/* Live rate chip */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md mb-8"
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
            style={{ boxShadow: "0 0 8px rgba(255,107,53,0.7)" }}
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
            Live · USDT / INR
          </span>
          <motion.span
            key={rate}
            initial={{ opacity: 0.6, y: -1 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-mono font-bold text-white tabular-nums"
          >
            {rate.toFixed(2)}
          </motion.span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-display text-white font-semibold tracking-tight leading-[1.04] mb-7"
          style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "-0.04em" }}
        >
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="block"
          >
            Send crypto.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.18, ease: EASE }}
            className="block"
            style={{
              background:
                "linear-gradient(90deg, #ffffff 0%, #ffe8dc 18%, #ffb899 30%, #ff8c50 42%, #ff6b35 50%, #ff8c50 58%, #ffb899 70%, #ffe8dc 82%, #ffffff 100%)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "headline-shimmer 8s ease-in-out infinite",
            }}
          >
            Get fiat instantly.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8"
        >
          Convert USDT, USDC, or SOL to AED, INR, and more —
          settled on-chain, landed in your bank.
        </motion.p>

        {/* Best-rates promise — same pill as home hero, dark-bg safe */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          className="mb-10 flex justify-center"
        >
          <Link
            to="/rates"
            className="group inline-flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl bg-white text-black shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:shadow-[0_6px_28px_rgba(255,107,53,0.35)] active:scale-[0.98] transition-all duration-300 max-w-[260px]"
          >
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff6b35] leading-none">
              <Tag className="w-3 h-3" strokeWidth={2.8} />
              Best rates, guaranteed
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-black/75 group-hover:text-black tracking-tight leading-none">
              Find cheaper. We&apos;ll cut deeper.
              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </motion.div>

        {/* Live mini-converter mockup */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="mx-auto mb-10 w-full max-w-[460px] rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-4"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            {/* From */}
            <div className="text-left">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-1">
                You send
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono font-bold text-white text-[20px] tabular-nums">
                  1,000
                </span>
                <span className="text-[11px] font-semibold text-white/60">
                  USDT
                </span>
              </div>
            </div>

            {/* Arrow with pulse */}
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[#ff6b35]/40 bg-[#ff6b35]/10"
            >
              <ArrowRight className="w-4 h-4 text-[#ff6b35]" strokeWidth={2.5} />
            </motion.div>

            {/* To */}
            <div className="text-right">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ff6b35] mb-1">
                You receive
              </div>
              <div className="flex items-baseline gap-1.5 justify-end">
                <motion.span
                  key={outAmount}
                  initial={{ opacity: 0.7, y: -2 }}
                  // animate={{ opacity: 1, y: 0 }}
                  className="font-mono font-bold text-white text-[20px] tabular-nums"
                >
                  {outAmount.toLocaleString()}
                </motion.span>
                <span className="text-[11px] font-semibold text-white/60">
                  INR
                </span>
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-white/40">
            <span className="flex items-center gap-1.5">
              <Lock className="w-2.5 h-2.5" /> Escrow secured
            </span>
            <span className="font-mono">~42s settlement</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-2.5 h-2.5 text-[#ff6b35]" />
              On-chain
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <CTAButton to="/register" className="min-w-[220px] sm:min-w-0">Join waitlist</CTAButton>
          <CTAButton to="/how-it-works" variant="secondary" className="min-w-[220px] sm:min-w-0">
            See how it works
          </CTAButton>
        </motion.div>

        {/* Token strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="mt-12 flex items-center justify-center gap-5 flex-wrap"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">
            Supports
          </span>
          {["USDT", "USDC", "SOL", "·", "AED", "INR", "PHP", "NGN"].map((t, i) =>
            t === "·" ? (
              <span key={i} className="text-white/25">·</span>
            ) : (
              <span
                key={i}
                className="text-[11px] font-mono font-bold text-white/55 tracking-tight"
              >
                {t}
              </span>
            ),
          )}
        </motion.div>
      </main>

      <style>{`
        @keyframes headline-shimmer {
          0%, 100% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
        }
      `}</style>
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
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] mb-6"
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
      accent: "#3ddc84",
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
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-5"
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
                  <div className="relative h-[140px] flex items-center justify-center overflow-hidden bg-black/[0.02] dark:bg-white/[0.015]">
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

/* ============================================
   4. APP PREVIEW — big image card with stats
   ============================================ */
const AppPreviewSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.3em] text-black/60 dark:text-white/30 font-semibold mb-4"
          >
            The app
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-5"
          >
            One app.{" "}
            <span className="text-black/60 dark:text-white/40">
              Everything you need.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-black/60 dark:text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            Swap, settle, and track — all in a simple, fast interface.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="relative rounded-3xl overflow-hidden border border-black/[0.06] dark:border-white/[0.06] bg-gradient-to-br from-[#FAF8F5] to-white dark:from-[#111] dark:to-[#050505]"
        >
          {/* Image — fully visible, no overlay covering it */}
          <div className="px-6 pt-10 sm:px-12 sm:pt-14">
            <img
              src="/home.svg"
              alt="Blip app preview — USDT to AED in under 60 seconds"
              className="w-full h-auto max-h-[620px] object-contain mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/home.webp";
              }}
            />
          </div>
          {/* Stats — sit below the image, not overlaid */}
          <div className="border-t border-black/[0.06] dark:border-white/[0.06] mt-2 px-6 sm:px-12 py-8 md:py-10">
            <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-xl mx-auto">
              {[
                { val: "<60s", lbl: "avg settlement" },
                { val: "0%", lbl: "protocol fees · for now" },
                { val: "24/7", lbl: "always on" },
              ].map((s, i) => (
                <motion.div
                  key={s.lbl}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                  className="text-center md:text-left"
                >
                  <div className="font-display text-2xl md:text-3xl font-semibold text-black dark:text-white tracking-tight tabular-nums">
                    {s.val}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-black/55 dark:text-white/50 mt-1.5">
                    {s.lbl}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
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
      accent: "#3ddc84",
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
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-5"
          >
            Built for{" "}
            <span className="text-black/60 dark:text-white/40">peace of mind.</span>
          </motion.h2>
        </div>

        <div className="relative">
        <div className="flex md:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="snap-start shrink-0 w-[80%] md:w-auto group relative p-8 rounded-3xl text-center border border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 duration-500 transition-colors"
                style={{ background: "rgba(255, 255, 255, 0.02)" }}
              >
                {/* Step number watermark in corner */}
                <span
                  className="absolute top-4 right-4 text-4xl font-bold select-none"
                  style={{ color: `${c.accent}26` }}
                >
                  0{i + 1}
                </span>

                {/* Big colored icon panel, centered */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${c.accent}26 0%, ${c.accent}0d 100%)`,
                    border: `1px solid ${c.accent}33`,
                    boxShadow: `0 8px 24px -8px ${c.glow}`,
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: c.accent }} strokeWidth={2.2} />
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
    <section ref={ref} className="relative py-24 md:py-36 overflow-hidden bg-[#FAF8F5] dark:bg-black">
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
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.05] mb-6">
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
        canonical="https://blip.money/user"
        description="Convert crypto to fiat instantly with Blip. Non-custodial, escrow-backed, peer-to-peer settlement with live market rates."
        keywords="crypto to cash, USDT to AED, USDT to INR, non-custodial swap, peer-to-peer crypto"
      />
      <HreflangTags path="/user" />
      <StructuredData type="website" />

      <UserHero />
      <WhyBlipForUsers />
      <UserHowItWorks />
      <AppPreviewSection />
      <UserTrustSection />
      <UserCTA />
    </>
  );
};

export default User;
