import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
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
  Gauge,
  ListChecks,
  Radio,
} from "lucide-react";
import { LayoutDashboard, ShieldCheck } from "lucide-react";

import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData from "@/components/StructuredData";
import { MagneticWrapper } from "@/components/MagneticButton";
import { HeroDashboardVisual } from "@/components/HeroDashbaordVisual";
import { CinematicMockup } from "@/components/CinemeticMockup";
import { sounds } from "@/lib/sounds";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CTASection } from "@/components/sections/CTASection";
import { MerchantDashboard } from "@/components/MerchantDashboard";

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
              Why Merchants{" "}
              <span className="text-black/80 dark:text-white/50">Choose </span>
              Blip
            </h2>

            <p className="text-lg text-black/40 dark:text-white/40 max-w-2xl mb-10">
              Built for speed control and repeat volume
            </p>

            <CTAButton
              to="/join-waitlist"
              className="group inline-flex items-center justify-center gap-3
      
      w-[220px]  h-[48px]
 "
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
border border-black/10 dark:border-white/10
bg-white/90 dark:bg-[#0c0c0d]/90
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
              <div className="px-4 sm:px-5 md:px-6 lg:px-8 pt-5 sm:pt-6 md:pt-7 pb-4 sm:pb-5 border-b border-black/5 dark:border-white/5">
                {" "}
                <h3 className="text-xs sm:text-sm md:text-base italic text-black/60 dark:text-zinc-300 sm:dark:text-zinc-400">
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
                bg-black/[0.04] dark:bg-white/[0.06]
                border border-black/20 dark:border-white/20
                backdrop-blur-xl
                shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)]
              `
              : isActive
                ? "bg-black/[0.03] dark:bg-[#ffffff]/[0.05] border border-black/20 dark:border-[#ffffff]/20"
                : "opacity-70 hover:opacity-100 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
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
                  ? "bg-black dark:bg-white text-white dark:text-black border-black/30 dark:border-white/30 shadow-[0_8px_20px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                  : isActive
                    ? "bg-black/30 dark:bg-white/30 text-white dark:text-black border-black/20 dark:border-white/20"
                    : "bg-[#FAF8F5] dark:bg-[#151516] border-black/10 dark:border-white/10 text-zinc-400"
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
                            <div className="text-sm sm:text-base md:text-lg font-bold text-black dark:text-white truncate">
                              {f.title}
                            </div>
                            <div className="text-xs sm:text-sm md:text-[15px] text-black/40 dark:text-zinc-400 leading-relaxed">
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
                  ? "bg-black/20 dark:bg-white/20 border border-black/30 dark:border-white/30 text-black dark:text-white"
                  : "bg-black/10 dark:bg-[#ffffff]/10 border border-black/30 dark:border-[#ffffff]/30 text-black dark:text-white"
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
            className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/60 mb-4"
          >
            Merchant Dashboard
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.1] mb-4"
          >
            Your{" "}
            <span className="text-black/80 dark:text-white/50">command</span>{" "}
            center
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-black dark:text-white/40 max-w-xl mx-auto font-medium"
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
            <div className="absolute inset-0 bg-white/80 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl">
              {/* Mock dashboard header */}
              <div className="p-4 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10" />
                  <div className="flex-1 h-4 bg-black/5 dark:bg-white/5 rounded ml-4" />
                </div>
              </div>

              {/* Mock content */}
              <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex-1 h-24 bg-black/[0.02] dark:bg-white/[0.02] rounded-lg border border-black/5 dark:border-white/5" />
                  <div className="flex-1 h-24 bg-black/[0.02] dark:bg-white/[0.02] rounded-lg border border-black/5 dark:border-white/5" />
                  <div className="flex-1 h-24 bg-black/[0.02] dark:bg-white/[0.02] rounded-lg border border-black/5 dark:border-white/5" />
                </div>
                <div className="h-40 bg-black/[0.02] dark:bg-white/[0.02] rounded-lg border border-black/5 dark:border-white/5" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex-1 h-20 bg-black/[0.02] dark:bg-white/[0.02] rounded-lg border border-black/5 dark:border-white/5" />
                  <div className="flex-1 h-20 bg-black/[0.02] dark:bg-white/[0.02] rounded-lg border border-black/5 dark:border-white/5" />
                </div>
              </div>

              {/* "Screenshot coming soon" overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mt-4">
                    <BarChart3 className="w-8 h-8 text-black/20 dark:text-white/20" />
                  </div>
                  <p className="text-sm text-black/30 dark:text-white/30">
                    Dashboard Preview
                  </p>
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
                    <p className="text-sm text-black dark:text-white/40">
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
          You{" "}
          <span className="text-black/80 dark:text-white/50">
            control pricing.
          </span>{" "}
          We keep it simple.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-black dark:text-white/40 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
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
          <span className="text-black/80 dark:text-white/50">
            escrow + transparency
          </span>
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
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Alpha
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40">
                    Internal
                  </span>
                </div>
                <p className="text-black dark:text-white/40 text-sm">
                  We test flows, edge cases, and reliability.
                </p>
              </div>

              {/* Beta */}
              <div className="group p-5 rounded-xl bg-white/60 dark:bg-transparent hover:bg-white/80 dark:hover:bg-white/5 border border-black/[0.08] dark:border-transparent hover:border-black/15 dark:hover:border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-black/30 dark:bg-white/30 group-hover:bg-black/60 dark:group-hover:bg-white/60 animate-pulse" />
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Beta
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/60">
                    Invite-only
                  </span>
                </div>
                <p className="text-black dark:text-white/40 text-sm">
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
                  <span className="text-black/70 dark:text-white/70">
                    {benefit}
                  </span>
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
                <p className="text-black/70 dark:text-white/70 pt-2">
                  {req.text}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   FAQ SECTION — Imported from separate component
   ============================================ */
import ScrollFAQ from "@/components/merchant/ScrollFAQ";

/* ============================================F
   MAIN PAGE COMPONENT
   ============================================ */
const Merchant = () => {
  return (
    <>
      <SEO
        title="Blip Money Merchant Payments – Fast & Secure Business Solutions"
        canonical="https://blip.money/merchant"
        description="Grow your business with Blip Money's merchant payment solutions — fast, secure, and simple tools to accept payments, manage sales, and boost revenue online and in-store"
        keywords="P2P merchant, crypto settlement, liquidity provider, escrow trading, Blip merchant"
      />
      <HreflangTags path="/merchant" />
      <StructuredData
        type="custom"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How do I receive orders?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Orders appear in your dashboard feed. You accept to lock.",
              },
            },
            {
              "@type": "Question",
              name: "Can I adjust pricing to win orders?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, within allowed ranges.",
              },
            },
            {
              "@type": "Question",
              name: "What if a user doesn't complete?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The trade follows the escrow timeline and dispute rules.",
              },
            },
            {
              "@type": "Question",
              name: "Do I need full KYC?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Not during early Beta. Basic verification is required.",
              },
            },
            {
              "@type": "Question",
              name: "Which corridors launch first?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Starting with Dubai-focused corridors, expanding in stages.",
              },
            },
          ],
        }}
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
      <ScrollFAQ />

      <CTASection
        title={
          <>
            Ready to become a Blip{" "}
            <span className="text-black/80 dark:text-white/50">Merchant?</span>
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
