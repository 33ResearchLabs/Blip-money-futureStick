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
import CinematicHero from "@/components/IndexSections/CinematicHero";
import { CinematicHeroOfMerchant } from "@/components/MerchantSection/HeroSection";

const WhyBlipSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["28deg", "40deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

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

  const features = [
    {
      title: "No waiting",
      description: "Requests come to you instead of you hunting buyers",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      title: "More control",
      description: "Filters, limits, and corridor selection",
      icon: <Sliders className="w-5 h-5" />,
    },
    {
      title: "Faster execution",
      description: "One flow, minimal steps, no noise",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      title: "Lower risk",
      description: "Escrow-first design reduces failed trades",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      title: "Clear operations",
      description: "Status timeline + trade history",
      icon: <LayoutList className="w-5 h-5" />,
    },
    {
      title: "Transparent proof",
      description: "On-chain visibility via Blip Scan",
      icon: <Globe className="w-5 h-5" />,
    },
  ];

  return (
    <section className="relative bg-[#FAF8F5] dark:bg-transparent text-black dark:text-white overflow-hidden py-20 lg:py-28">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div className="max-w-xl text-center lg:text-left">
            <h2 className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-black dark:text-white leading-[1.1] mb-6">
              Why Merchants{" "}
              <span className="text-black/70 dark:text-white/70">Choose</span>{" "}
              Blip
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-black/60 dark:text-white/50 font-medium leading-relaxed mb-10">
              Built for speed, control and repeat volume.
            </p>
          </div>

          {/* RIGHT CARD */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: "1500px" }}
            className="w-full max-w-[680px] mx-auto"
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative rounded-[28px]
              border border-black/15 dark:border-white/10
              bg-white dark:bg-[#0c0c0d]
              backdrop-blur-xl
              shadow-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
              overflow-hidden"
            >
              {/* Feature List */}
              <div className="p-6">
                {features.map((f, index) => {
                  const isActive = activeIndex === index;
                  const isPrimary = activeIndex === null && index === 0;


                  return (
                    <motion.div
                      key={f.title}
                      onClick={() => setActiveIndex(index)}
                      whileHover={{
                        y: -4,
                        scale: 1.02,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 18,
                      }}
                      className={`
                        flex items-center justify-between
                        px-5 py-4 mb-3
                        rounded-2xl
                        cursor-pointer
                        transition-all duration-300
                        ${
                          isPrimary
                            ? `
                              bg-black/10 dark:bg-white/10
                              border border-black/30 dark:border-white/20
                              shadow-lg
                            `
                            : isActive
                              ? `
                              bg-black/8 dark:bg-white/8
                              border border-black/20 dark:border-white/20
                            `
                              : `
                              bg-white hover:bg-black/5
                              dark:bg-transparent dark:hover:bg-white/5
                            `
                        }
                      `}
                    >
                      {/* LEFT CONTENT */}
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`
                            w-11 h-11 rounded-xl
                            flex items-center justify-center
                            border transition-all
                            ${
                              isPrimary
                                ? "bg-black text-white border-black shadow-md"
                                : isActive
                                  ? "bg-black/80 text-white border-black/40"
                                  : "bg-black/5 dark:bg-white/5 text-black dark:text-white border-black/20 dark:border-white/20"
                            }
                          `}
                        >
                          {f.icon}
                        </div>

                        <div>
                          <div className="text-lg font-semibold text-black/80 dark:text-white/70">
                            {f.title}
                          </div>
                          <div className="text-sm font-medium text-black/70 dark:text-white/50">
                            {f.description}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT CHECK */}
                      {(isActive || isPrimary) && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white dark:bg-white dark:text-black shadow-md">
                          <Check className="w-4 h-4" strokeWidth={3} />
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
            className="text-[11px] uppercase tracking-[0.3em] text-black/80 dark:text-white/30 font-semibold mb-4"
          >
            Merchant Dashboard
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-black dark:text-white tracking-tight leading-[1.1] mb-4"
          >
            Your{" "}
            <span className="text-black/70 dark:text-white/50">command</span>{" "}
            center
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg lg:text-xl text-black/60 dark:text-white/50 max-w-xl mx-auto font-medium leading-relaxed"
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
          className="text-[11px] uppercase tracking-[0.3em] text-black/80 dark:text-white/30 font-semibold mb-4"
        >
          Pricing
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          You{" "}
          <span className="text-black/70 dark:text-white/50">
            control pricing.
          </span>{" "}
          We keep it simple.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg lg:text-xl text-black/60 dark:text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
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
          <div className="space-y-3 text-sm text-black dark:text-white/40">
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
              className="text-[11px] uppercase tracking-[0.3em] text-black/70 dark:text-white/30 font-semibold mb-4"
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
              className="text-[11px] uppercase tracking-[0.3em] text-black/70 dark:text-white/30 font-semibold mb-4"
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
                    <CheckCircle2 className="w-4 h-4 text-black/40 dark:text-gray-600 group-hover:text-black/60 dark:group-hover:text-white/60" />
                  </div>
                  <span className="text-black dark:text-white/70">
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
            className="text-[11px] uppercase tracking-[0.3em] text-black/80 dark:text-white/30 font-semibold mb-4"
          >
            Requirements
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-black dark:text-white tracking-tight leading-[1.1]"
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
                <p className="text-black dark:text-white/70 pt-2">{req.text}</p>
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
        secondaryButtonLink="/waitlist"
        // secondaryButtonLink="https://t.me/blip_money"
        // background="gradient"
      />
    </>
  );
};

export default Merchant;
