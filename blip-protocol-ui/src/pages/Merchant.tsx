import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Wallet,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  BarChart3,
  Settings,
  Eye,
  Lock,
  FileCheck,
  Zap,
  Globe,
  BadgeCheck,
  Banknote,
  Filter,
  Timer,
  Activity,
  ChevronDown,
  Gauge,
  ListChecks,
  Radio,
} from "lucide-react";
import { LayoutDashboard, ShieldCheck } from "lucide-react";

import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { MagneticWrapper } from "@/components/MagneticButton";
import { HeroDashboardVisual } from "@/components/HeroDashbaordVisual";
import { CinematicMockup } from "@/components/CinemeticMockup";
import { sounds } from "@/lib/sounds";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CTASection } from "@/components/sections/CTASection";
import { MerchantDashboard } from "@/components/MerchantDashboard";

const MerchantHero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const bullets = [
    { icon: Radio, text: "Instant request feed (pick what you want)" },
    { icon: Lock, text: "Escrow-backed execution (safer trades)" },
    { icon: Eye, text: "Blip Scan transparency (audit trail)" },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-[100vh] overflow-hidden bg-transparent border-none"
    >
      {/* ---------------- BACKGROUND ---------------- */}
      <div className="absolute inset-0" />

      {/* Subtle white glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-[0.04] border-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,255,255,1) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ---------------- TEXT CONTENT ---------------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm text-white/60">
              Beta access open for qualified merchants
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="heading-xl text-white mb-6"
          >
            Become a <span className="text-white">Blip</span>{" "}
            <span className="text-white/30">Merchant</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 mb-8 max-w-2xl leading-relaxed"
          >
            Accept high-intent crypto-to-cash requests in seconds. Set your
            margin, execute with escrow protection, and track everything
            on-chain.
          </motion.p>

          {/* Bullets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10"
          >
            {bullets.map((bullet, index) => {
              const Icon = bullet.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-white/60"
                >
                  <Icon className="w-4 h-4 text-white/70" />
                  <span>{bullet.text}</span>
                </div>
              );
            })}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 max-w-xl"
          >
            <CTAButton
              to="/join-waitlist"
              className="w-full sm:w-auto gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5"
            >
              Apply as Merchent
            </CTAButton>

            <MagneticWrapper strength={0.2}>
              <a
                href="https://t.me/blip_money"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="group
  inline-flex sm:inline-flex
  w-full sm:w-auto
  justify-center
  items-center
  gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5
  text-[16px]
  rounded-full
  border border-white/10
  text-white
  font-medium
  transition-all duration-500
  hover:border-white/30 hover:bg-white/5"
              >
                Join Merchant Community
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </MagneticWrapper>
          </motion.div>
        </div>
      </div>

      {/* ---------------- DASHBOARD VISUAL ---------------- */}
      <div className="relative z-0 w-full mt-24">
        <HeroDashboardVisual>
          <div className="relative w-full h-[1200px] object-center">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 90 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="
    reletive
    left-1/2
    -translate-x-1/2
    bottom-[-18%]
  "
            >
              <MerchantDashboard />
            </motion.div>

            {/* Depth fade */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" /> */}
            <div
              className="absolute inset-x-0 bottom-0 h-40
  bg-gradient-to-t from-transparent via-transparent to-transparent"
            />

            {/* Vignette */}
            {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,black_100%)] pointer-events-none" /> */}
            <div
              className="absolute inset-0 pointer-events-none
  bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(0,0,0,0.6)_100%)]"
            />
          </div>
        </HeroDashboardVisual>
      </div>
    </section>
  );
};
/* ============================================
   HOW IT WORKS SECTION
   4 steps merchant flow
   ============================================ */

/* ----------------------------------
      CARD COMPONENT
   ----------------------------------- */
const Card = ({ title, subtitle, icon: Icon, children, delay, step }) => {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/[0.03] bg-[#050505] p-8 transition-all duration-700 hover:border-white/10"
      style={{
        animation: `fadeInUp 0.8s cubic-bezier(0.2,0.8,0.2,1) ${delay}s both`,
      }}
    >
      {/* Border beam */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-[-1px] rounded-[2rem] border border-[#ffffff]/20 [mask-image:linear-gradient(to_right,transparent,white,transparent)] animate-[move_5s_linear_infinite]" />
      </div>

      {/* Step number */}
      <div className="absolute top-5 right-6 text-4xl font-mono text-white/[0.03]">
        0{step}
      </div>

      {/* Icon */}
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a0a0a] border border-white/5 text-zinc-500 group-hover:text-[#ffffff] group-hover:border-[#ffffff]/30 transition">
        <Icon size={22} strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h3 className="text-xl font-medium text-zinc-100 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 mb-6">{subtitle}</p>

      {/* Mockup */}
      <div className="relative mt-auto h-52 rounded-2xl overflow-hidden border border-white/[0.05] bg-[#080808]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px]" />
        <div className="relative z-10 h-full w-full">{children}</div>
      </div>
    </div>
  );
};

/* ----------------------------------
      MOCKUPS
   ----------------------------------- */
const MockupDashboard = () => (
  <div className="p-4 flex flex-col h-full space-y-2">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex justify-between items-center p-2 rounded bg-zinc-900/30 border border-white/[0.03]"
      >
        <div className="h-1.5 w-10 bg-zinc-800 rounded" />
        <div className="h-1.5 w-6 bg-[#ffffff]/30 rounded" />
      </div>
    ))}
    <div className="mt-auto h-2 bg-zinc-800 rounded overflow-hidden">
      <div className="h-full w-1/3 bg-[#ffffff]/40 group-hover:w-full transition-all duration-[2000ms]" />
    </div>
  </div>
);

const MockupLock = () => (
  <div className="h-full flex items-center justify-center">
    <div className="h-12 w-12 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
      <Lock size={18} className="text-zinc-600 group-hover:text-[#ffffff]" />
    </div>
  </div>
);

const MockupEscrow = () => (
  <div className="p-4 h-full">
    <div className="rounded-xl border border-white/[0.03] p-4 bg-zinc-900/20">
      <ShieldCheck
        size={14}
        className="text-zinc-600 group-hover:text-[#ffffff] mb-3"
      />
      <div className="space-y-2">
        <div className="h-1 w-full bg-zinc-800 rounded" />
        <div className="h-1 w-2/3 bg-zinc-800 rounded" />
      </div>
    </div>
  </div>
);

const MockupOnChain = () => (
  <div className="p-4 font-mono text-[9px] text-zinc-600">
    <div>{`> SYSTEM_INIT`}</div>
    <div className="mt-1">{`> TX_HASH: 0x82...11`}</div>
    <div className="mt-3 text-[#ffffff]/60">{`> VERIFIED`}</div>
  </div>
);

/* ----------------------------------
      MAIN SECTION
   ----------------------------------- */

/* ============================================
   WHY MERCHANTS CHOOSE BLIP
   ============================================ */
import { ChevronRight, Sliders, LayoutList, Check } from "lucide-react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { CTAButton } from "@/components/Navbar";
import HowItWorksSection from "@/components/merchant/How-it-works";
import CinematicHero from "@/components/CinematicHero";
import { CinematicHeroOfMerchant } from "@/components/MerchantSection/HeroSection";

const WhyBlipSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRef = useRef(null);

  /* -----------------------------
        3D Mouse Tracking
     ----------------------------- */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["30deg", "40deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  /* -----------------------------
        Features
     ----------------------------- */
  const features = [
    {
      title: "No waiting",
      description: "Requests come to you instead of you hunting buyers",
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      title: "More control",
      description: "Filters, limits, and corridor selection",
      icon: <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      title: "Faster execution",
      description: "One flow, minimal steps, no noise",
      icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      title: "Lower risk",
      description: "Escrow-first design reduces failed trades",
      icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      title: "Clear operations",
      description: "Status timeline + trade history",
      icon: <LayoutList className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      title: "Transparent proof",
      description: "On-chain visibility via Blip Scan",
      icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ];

  return (
    <section className="relative bg-[#FAF8F5] dark:bg-transparent text-black dark:text-white overflow-hidden py-12 sm:py-20 md:py-28 lg:py-32">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-black/[0.02] dark:bg-white/[0.02] blur-[140px] rounded-full" />
        <motion.div
          animate={{ opacity: [0.03, 0.06, 0.03], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.03)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.04)_0%,transparent_60%)]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Grid: 1 col on sm, 2 cols on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Header */}
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#ff6b35] " />
              <span className="text-xs tracking-[0.2em] uppercase text-black/40 dark:text-white/40">
                Next-Gen Merchant Protocol
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white leading-tight mb-6 sm:mb-8 tracking-tight max-w-xl mx-auto lg:mx-0">
              Why Merchants <span className="text-black/20 dark:text-white/20">Choose </span>Blip
            </h2>

            <p className="text-lg text-black/40 dark:text-white/40 max-w-2xl mb-10">
              Built for speed control and repeat volume
            </p>

            <CTAButton
              to="/join-waitlist"
              className="group inline-flex items-center justify-center gap-3
      px-10 py-4
      w-[220px]  h-[48px]
      rounded-full
      border border-white/20
      text-white
      text-sm font-semibold
      hover:bg-white/10
      transition-all duration-300"
            >
              Start Trading
            </CTAButton>
          </div>

          {/* Right: 3D Interactive Card */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: "1500px" }}
            className="w-full max-w-[520px] sm:max-w-[560px] md:max-w-[620px] lg:max-w-[680px] xl:max-w-[720px] mx-auto lg:mx-0"
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}


              className="relative
rounded-[18px] sm:rounded-[22px] md:rounded-[26px] lg:rounded-[32px]
border border-white/10
bg-[#0c0c0d]/90
backdrop-blur-2xl
overflow-hidden"
            >
              {/* Shine */}
              <motion.div
                style={{ left: shineX, top: shineY }}
                className="absolute -translate-x-1/2 -translate-y-1/2
  w-[300px] h-[300px]
  sm:w-[420px] sm:h-[420px]
  lg:w-[600px] lg:h-[600px]
  bg-white/[0.05]
  blur-[60px] sm:blur-[70px] lg:blur-[90px]
  rounded-full pointer-events-none"
              />

              {/* Header */}
              <div className="px-4 sm:px-5 md:px-6 lg:px-8 pt-5 sm:pt-6 md:pt-7 pb-4 sm:pb-5 border-b border-white/5">
                {" "}
                <h3 className="text-xs sm:text-sm md:text-base italic text-zinc-300 sm:text-zinc-400">
                  Platform Capabilities
                </h3>
              </div>

              {/* Feature List */}
              <div className="px-3 sm:px-4 md:px-5 py-4 sm:py-5">
                {features.map((f, index) => {
                  const isActive = activeIndex === index;
                  const isPrimary = index === 0;

                  return (
                    <motion.div
                      key={f.title}
                      onClick={() => setActiveIndex(index)}
                      initial={false}
                      whileHover={
                        isPrimary
                          ? { y: -6, rotateX: 6, rotateY: -6 }
                          : { y: -2 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                      className={`
          relative
flex items-center justify-between
gap-3 sm:gap-4
px-3 sm:px-4 md:px-5
py-3 sm:py-4
mb-2 sm:mb-2.5
rounded-xl sm:rounded-2xl
cursor-pointer
transition-all duration-300
min-w-0
          ${
            isPrimary
              ? `
                bg-white/[0.06]
                border border-white/20
                backdrop-blur-xl
                shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)]
              `
              : isActive
                ? "bg-[#ffffff]/[0.05] border border-[#ffffff]/20"
                : "opacity-60 hover:opacity-100 hover:bg-white/[0.02]"
          }
        `}
                    >
                      {/* Inner glow for 3D card */}
                      {isPrimary && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                      )}

                      <div className="flex items-center gap-3 sm:gap-4 md:gap-5 relative z-10 min-w-0 flex-1">
                        {/* Icon */}
                        <div
                          className={`
              w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12
 rounded-lg sm:rounded-xl flex items-center justify-center border transition-all
              ${
                isPrimary
                  ? "bg-white text-black border-white/30 shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                  : isActive
                    ? "bg-white/30 text-black border-white/20"
                    : "bg-[#151516] border-white/10 text-zinc-400"
              }
            `}
                          style={
                            isPrimary
                              ? { transform: "translateZ(20px)" }
                              : undefined
                          }
                        >
                          {f.icon}
                        </div>

                        <div
                          style={
                            isPrimary
                              ? { transform: "translateZ(16px)" }
                              : undefined
                          }
                        >
                          <div className="min-w-0">
                            <div className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
                              {f.title}
                            </div>
                            <div className="text-xs sm:text-sm md:text-[15px] text-zinc-400 leading-relaxed">
                              {f.description}
                            </div>
                          </div>
                        </div>
                      </div>

                      {(isActive || isPrimary) && (
                        <div
                          className={`
              relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
              ${
                isPrimary
                  ? "bg-white/20 border border-white/30 text-white"
                  : "bg-[#ffffff]/10 border border-[#ffffff]/30 text-white"
              }
            `}
                          style={
                            isPrimary
                              ? { transform: "translateZ(24px)" }
                              : undefined
                          }
                        >
                          <Check
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            strokeWidth={3}
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   MERCHANT DASHBOARD SECTION
   ============================================ */
const DashboardSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const callouts = [
    {
      icon: Radio,
      title: "New Orders Feed",
      description: "Real-time requests you can accept instantly",
    },
    {
      icon: TrendingUp,
      title: "Margin Control",
      description: "Adjust pricing within allowed ranges",
    },
    {
      icon: Filter,
      title: "Risk Controls",
      description: "Amount limits, corridor filters, timeouts",
    },
    {
      icon: Activity,
      title: "Trade Timeline",
      description: "Escrow → execution → release",
    },
    {
      icon: BarChart3,
      title: "Performance",
      description: "Volume, speed, completion rate, profit view",
    },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-black" />

      {/* Gradient accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-[0.04]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255, 255, 255, 1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.3em] text-black dark:text-white/60 mb-4"
          >
            Merchant Dashboard
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.1] mb-4"
          >
            Your <span className="text-black/20 dark:text-white/20">command</span> center
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-black/40 dark:text-white/50 max-w-xl mx-auto font-medium"
          >
            Everything needed to run a desk, without the clutter.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Dashboard Preview Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="
  relative
  w-full
  min-h-[388px]
  
  md:min-h-[476px]
  xl:min-h-[460px]
  rounded-xl sm:rounded-2xl
  order-2 lg:order-1 overflow-hidden lg:overflow-auto
"
          >
            {/* Placeholder frame */}
            <div className="absolute inset-0 bg-[#0a0a0a] border border-white/10 rounded-2xl">
              {/* Mock dashboard header */}
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="flex-1 h-4 bg-white/5 rounded ml-4" />
                </div>
              </div>

              {/* Mock content */}
              <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex-1 h-24 bg-white/[0.02] rounded-lg border border-white/5" />
                  <div className="flex-1 h-24 bg-white/[0.02] rounded-lg border border-white/5" />
                  <div className="flex-1 h-24 bg-white/[0.02] rounded-lg border border-white/5" />
                </div>
                <div className="h-40 bg-white/[0.02] rounded-lg border border-white/5" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex-1 h-20 bg-white/[0.02] rounded-lg border border-white/5" />
                  <div className="flex-1 h-20 bg-white/[0.02] rounded-lg border border-white/5" />
                </div>
              </div>

              {/* "Screenshot coming soon" overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mt-4">
                    <BarChart3 className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-sm text-white/30">Dashboard Preview</p>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_80px_rgba(255,255,255,0.1)] pointer-events-none" />
          </motion.div>

          {/* Callouts */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 order-1 lg:order-2"
          >
            {callouts.map((callout, index) => {
              const Icon = callout.icon;
              return (
                <div
                  key={callout.title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500 backdrop-blur-xl"
                  onMouseEnter={() => sounds.hover()}
                >
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-black/60 dark:text-white/60" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-black dark:text-white mb-1">
                      {callout.title}
                    </h4>
                    <p className="text-sm text-black/40 dark:text-white/50">
                      {callout.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   PRICING & MARGIN CONTROLS SECTION
   ============================================ */
const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-black" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4"
        >
          Pricing
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          You <span className="text-black/20 dark:text-white/20">control pricing.</span> We keep it
          simple.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-black/40 dark:text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Blip shows a live market reference rate. You can adjust your quote
          within allowed ranges to win the request faster when needed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/5 max-w-xl mx-auto hover:border-black/20 dark:hover:border-white/30 transition-colors duration-500 backdrop-blur-xl"
        >
          <div className="space-y-3 text-sm text-black/40 dark:text-white/40">
            <p>
              Exact fees and ranges may vary by corridor and stage (Alpha/Beta).
            </p>
            <p>Your dashboard shows the full breakdown per trade.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   TRUST & SAFETY SECTION
   ============================================ */
const TrustSection = () => {
  const features = [
    {
      title: "Escrow-backed execution",
      description: "Reduces non-completion and disputes",
      icon: Lock,
    },
    {
      title: "On-chain traceability",
      description: "Verify status through Blip Scan",
      icon: Eye,
    },
    {
      title: "Clear dispute process",
      description: "Handled by internal team during Beta",
      icon: Shield,
    },
    {
      title: "Merchant reputation",
      description: "Performance tracking and enforcement",
      icon: BadgeCheck,
    },
  ];

  return (
    <FeatureGrid
      title={
        <>
          Trades secured by
          <br />
          <span className="text-black/20 dark:text-white/20">escrow + transparency</span>
        </>
      }
      subtitle="Trust & Safety"
      features={features}
      columns={4}
      variant="cards"
    />
  );
};

/* ============================================
   ALPHA / BETA ROLLOUT SECTION
   ============================================ */
const RolloutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const earlyBenefits = [
    "Priority visibility in matching",
    "Direct access to the team",
    "Early incentives (limited)",
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-black" />

      {/* Border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Rollout Phases */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4"
            >
              Rollout
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-black dark:text-white tracking-tight leading-[1.1] mb-8"
            >
              Invite-only rollout
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Alpha */}
              <div className="group p-5 rounded-xl bg-white/60 dark:bg-white/[0.02] hover:bg-white/80 dark:hover:bg-white/5 border border-black/[0.08] dark:border-transparent hover:border-black/15 dark:hover:border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-black/30 dark:bg-white/30 group-hover:bg-black/60 dark:group-hover:bg-white/60" />
                  <h3 className="text-lg font-semibold text-black dark:text-white">Alpha</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40">
                    Internal
                  </span>
                </div>
                <p className="text-black/40 dark:text-white/50 text-sm">
                  We test flows, edge cases, and reliability.
                </p>
              </div>

              {/* Beta */}
              <div className="group p-5 rounded-xl bg-white/60 dark:bg-transparent hover:bg-white/80 dark:hover:bg-white/5 border border-black/[0.08] dark:border-transparent hover:border-black/15 dark:hover:border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-black/30 dark:bg-white/30 group-hover:bg-black/60 dark:group-hover:bg-white/60 animate-pulse" />
                  <h3 className="text-lg font-semibold text-black dark:text-white">Beta</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/60">
                    Invite-only
                  </span>
                </div>
                <p className="text-black/40 dark:text-white/50 text-sm">
                  Select merchants + partners in focused corridors.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Early Benefits */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4"
            >
              Benefits
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-black dark:text-white tracking-tight leading-[1.1] mb-8"
            >
              Early merchant benefits
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              {earlyBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/5 hover:bg-white/80 dark:hover:bg-white/5 hover:border-black/15 dark:hover:border-white/10 backdrop-blur-xl"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-black/30 dark:text-gray-600 group-hover:text-black/60 dark:group-hover:text-white/60" />
                  </div>
                  <span className="text-black/70 dark:text-white/70">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   REQUIREMENTS SECTION
   ============================================ */
const RequirementsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const requirements = [
    {
      icon: Wallet,
      text: "You can provide liquidity for at least one corridor",
    },
    {
      icon: Zap,
      text: "You respond fast and execute reliably",
    },
    {
      icon: FileCheck,
      text: "You can verify basic identity (phone/email + wallet)",
    },
    {
      icon: Shield,
      text: "You follow trade rules and dispute policy",
    },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-black" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4"
          >
            Requirements
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.1]"
          >
            Who should apply
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {requirements.map((req, index) => {
            const Icon = req.icon;
            return (
              <div
                key={index}
                className="group flex items-start gap-4 p-5 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 backdrop-blur-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-black/60 dark:text-white/60 group-hover:text-black/80 dark:group-hover:text-white/80" />
                </div>
                <p className="text-black/70 dark:text-white/70 pt-2">{req.text}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   FAQ SECTION
   ============================================ */
const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I receive orders?",
      answer: "Orders appear in your dashboard feed. You accept to lock.",
    },
    {
      question: "Can I adjust pricing to win orders?",
      answer: "Yes, within allowed ranges.",
    },
    {
      question: "What if a user doesn't complete?",
      answer: "The trade follows the escrow timeline and dispute rules.",
    },
    {
      question: "Do I need full KYC?",
      answer: "Not during early Beta. Basic verification is required.",
    },
    {
      question: "Which corridors launch first?",
      answer: "Starting with Dubai-focused corridors, expanding in stages.",
    },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-black" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4"
          >
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.1]"
          >
            Common questions
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl border overflow-hidden transition-colors duration-300 hover:border-black/20 dark:hover:border-white/20 backdrop-blur-xl
    ${
      openIndex === index
        ? "bg-white/80 dark:bg-white/5 border-black/20 dark:border-white/20"
        : "bg-white/60 dark:bg-white/[0.02] border-black/[0.08] dark:border-white/5"
    }
  `}
            >
              <button
                onClick={() => {
                  setOpenIndex(openIndex === index ? null : index);
                  sounds.click();
                }}
                onMouseEnter={() => sounds.hover()}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-black dark:text-white font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-black/40 dark:text-white/40 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 text-black/40 dark:text-white/50">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================F
   MAIN PAGE COMPONENT
   ============================================ */
const Merchant = () => {
  return (
    <>
      <SEO
        title="Blip Money Merchant Payments – Fast & Secure Business Solutions"
        canonical="https://blip.money/merchant"
        description="Grow your business with Blip Money’s merchant payment solutions — fast, secure, and simple tools to accept payments, manage sales, and boost revenue online and in-store"
        keywords="P2P merchant, crypto settlement, liquidity provider, escrow trading, Blip merchant"
      />

      {/* <MerchantHero /> */}
      <CinematicHeroOfMerchant />
      <HowItWorksSection />
      <WhyBlipSection />
      <DashboardSection />
      <PricingSection />
      <TrustSection />
      <RolloutSection />
      <RequirementsSection />
      <FAQSection />

      <CTASection
        title={
          <>
            Ready to become a Blip{" "}
            <span className="text-black/20 dark:text-white/20">Merchant?</span>
          </>
        }
        description="Apply now. Get access to the dashboard and start executing requests."
        primaryButtonText="Apply as Merchant"
        primaryButtonLink="/waitlist"
        secondaryButtonText="Join Merchant "
        secondaryButtonLink="https://t.me/blip_money"
        // background="gradient"
      />
    </>
  );
};

export default Merchant;
