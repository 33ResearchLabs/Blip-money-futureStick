import { useRef, useState, useEffect } from "react";
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
import { SwipeHint } from "@/components/IndexSections/SwipeHint";
import StructuredData from "@/components/StructuredData";
import { MagneticWrapper } from "@/components/MagneticButton";
import { HeroDashboardVisual } from "@/components/HeroDashbaordVisual";
import { CinematicMockup } from "@/components/CinemeticMockup";
import { sounds } from "@/lib/sounds";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CTASection } from "@/components/sections/CTASection";
import {
  MerchantDashboard,
  MerchantDashboardVisual,
} from "@/components/MerchantDashboard";

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
import { EditableText } from "@/components/dashboard/Editable";

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
      key: "item1",
      title: "No waiting",
      description: "Requests come to you instead of you hunting buyers",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      key: "item2",
      title: "More control",
      description: "Filters, limits, and corridor selection",
      icon: <Sliders className="w-5 h-5" />,
    },
    {
      key: "item3",
      title: "Faster execution",
      description: "One flow, minimal steps, no noise",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      key: "item4",
      title: "Lower risk",
      description: "Escrow-first design reduces failed trades",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      key: "item5",
      title: "Clear operations",
      description: "Status timeline + trade history",
      icon: <LayoutList className="w-5 h-5" />,
    },
    {
      key: "item6",
      title: "Transparent proof",
      description: "On-chain visibility via Blip Scan",
      icon: <Globe className="w-5 h-5" />,
    },
  ];

  return (
    <section className="relative bg-[#FAF8F5] dark:bg-transparent text-black dark:text-white overflow-hidden py-6 sm:py-12 lg:py-24">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-8 lg:gap-16 items-center">
          {/* LEFT */}
          <div className="max-w-xl text-center lg:text-left">
            <h2 className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-black dark:text-white leading-[1.1] mb-2 sm:mb-4 lg:mb-6">
              <EditableText id="merchant.why.title.pre" default="Why Merchants " as="span" />
              <EditableText id="merchant.why.title.accent" default="Choose" as="span" className="text-black/70 dark:text-white/70" />
              <EditableText id="merchant.why.title.post" default=" Blip?" as="span" />
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-black/60 dark:text-white/50 font-medium leading-relaxed mb-0 sm:mb-4 lg:mb-10">
              <EditableText id="merchant.why.sub" default="Built for speed, control and repeat volume." multiline />
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
                            <EditableText id={`merchant.why.${f.key}.title`} default={f.title} as="span" />
                          </div>
                          <div className="text-sm font-medium text-black/70 dark:text-white/50">
                            <EditableText id={`merchant.why.${f.key}.description`} default={f.description} as="span" />
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
      key: "item1",
      icon: Radio,
      title: "New Orders Feed",
      description: "Real-time requests you can accept instantly",
    },
    {
      key: "item2",
      icon: TrendingUp,
      title: "Margin Control",
      description: "Adjust pricing within allowed ranges",
    },
    {
      key: "item3",
      icon: Filter,
      title: "Risk Controls",
      description: "Amount limits, corridor filters, timeouts",
    },
    {
      key: "item4",
      icon: Activity,
      title: "Trade Timeline",
      description: "Escrow → execution → release",
    },
    {
      key: "item5",
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
            <EditableText id="merchant.dashboard.eyebrow" default="Merchant Dashboard" />
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-black dark:text-white tracking-tight leading-[1.1] mb-4"
          >
            <EditableText id="merchant.dashboard.title.pre" default="Your " as="span" />
            <EditableText id="merchant.dashboard.title.accent" default="command" as="span" className="text-black/70 dark:text-white/50" />
            <EditableText id="merchant.dashboard.title.post" default=" center" as="span" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg lg:text-xl text-black/60 dark:text-white/50 max-w-xl mx-auto font-medium leading-relaxed"
          >
            <EditableText id="merchant.dashboard.sub" default="Everything needed to run a desk, without the clutter." multiline />
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Dashboard Preview */}
          <div
            key={1}
            style={{
              width: 560,
              height: 520,
              position: "relative",
              overflow: "hidden",
              borderRadius: 16,
            }}
          >
            <div
              style={{
                transform: "scale(0.46)",
                transformOrigin: "top left",
                width: 1220,
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <MerchantDashboardVisual />
            </div>
          </div>

          {/* Callouts */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 order-1 lg:order-2"
          >
            {callouts.map((callout) => {
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
                      <EditableText id={`merchant.dashboard.${callout.key}.title`} default={callout.title} as="span" />
                    </h4>
                    <p className="text-sm text-black dark:text-white/40">
                      <EditableText id={`merchant.dashboard.${callout.key}.description`} default={callout.description} as="span" />
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
   PRICING & MARGIN CONTROLS SECTION — modernized
   ============================================ */
const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [rate, setRate] = useState(3.673);
  const [trend, setTrend] = useState<"up" | "down">("up");

  // Live-feel rate ticker
  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      setRate((r) => {
        const delta = (Math.random() - 0.5) * 0.008;
        setTrend(delta >= 0 ? "up" : "down");
        return Math.max(3.66, Math.min(3.69, r + delta));
      });
    }, 1600);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <section ref={ref} className="force-light relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-black" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,107,53,0.06), transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.3em] text-black/60 dark:text-white/30 font-semibold mb-4"
          >
            <EditableText id="merchant.pricing.eyebrow" default="Pricing" />
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-5"
          >
            <EditableText id="merchant.pricing.title.pre" default="You " as="span" />
            <EditableText id="merchant.pricing.title.accent" default="control pricing." as="span" className="text-[#ff6b35]" />
            {" "}<br className="hidden md:block" />
            <EditableText id="merchant.pricing.title.post" default="We make it simple." as="span" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-black/60 dark:text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            <EditableText id="merchant.pricing.sub" default="Blip shows a live market reference rate. Adjust your quote within allowed ranges to win orders faster." multiline />
          </motion.p>
        </div>

        {/* Live rate card + margin slider preview — mobile snap-scroll */}
        <div className="relative">
        <div className="flex lg:grid lg:grid-cols-5 gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Live rate ticker card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="snap-start shrink-0 w-[88%] lg:w-auto lg:col-span-3 relative rounded-3xl overflow-hidden bg-white dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] p-8 md:p-10"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-black/40 dark:text-white/30 mb-2">
                  Live market reference
                </div>
                <div className="text-sm font-mono text-black/60 dark:text-white/50">
                  USDT / AED
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/25">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
                />
                <span className="text-[10px] font-semibold text-[#ff6b35] tracking-wider uppercase">
                  Live
                </span>
              </div>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <motion.div
                key={rate.toFixed(3)}
                initial={{ opacity: 0.7, y: trend === "up" ? 4 : -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-display text-6xl md:text-7xl font-semibold text-black dark:text-white tracking-tight leading-none tabular-nums"
              >
                {rate.toFixed(3)}
              </motion.div>
              <div
                className={`text-sm font-semibold pb-2 tabular-nums ${
                  trend === "up"
                    ? "text-[#ff6b35]"
                    : "text-black/45 dark:text-white/45"
                }`}
              >
                {trend === "up" ? "↑" : "↓"} 0.0{Math.floor(Math.random() * 8) + 1}%
              </div>
            </div>

            {/* Sparkline — orange bars, continuous up/down */}
            <div className="flex items-end gap-1.5 h-12">
              {Array.from({ length: 28 }).map((_, i) => {
                const base = 35 + Math.sin(i * 0.6) * 25 + (i % 4) * 8;
                const lo = Math.max(18, base - 22);
                const hi = Math.min(100, base + 22);
                return (
                  <motion.div
                    key={i}
                    initial={{ height: `${base}%`, opacity: 0 }}
                    animate={
                      isInView
                        ? {
                            height: [`${lo}%`, `${hi}%`, `${lo}%`],
                            opacity: 1,
                          }
                        : {}
                    }
                    transition={{
                      height: {
                        duration: 1.6 + (i % 5) * 0.18,
                        delay: (i % 6) * 0.08,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                      },
                      opacity: { duration: 0.4, delay: 0.2 + i * 0.02 },
                    }}
                    className="flex-1 rounded-full bg-gradient-to-t from-[#ff6b35]/30 to-[#ff6b35]"
                  />
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[11px] text-black/40 dark:text-white/40">
              <span>Updated continuously</span>
              <span className="font-mono">Last tick · just now</span>
            </div>
          </motion.div>

          {/* Margin control card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="snap-start shrink-0 w-[88%] lg:w-auto lg:col-span-2 relative rounded-3xl overflow-hidden bg-black dark:bg-white/[0.04] text-white border border-black/[0.06] dark:border-white/[0.06] p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white/50 mb-3">
                Your margin
              </div>
              <div className="font-display text-5xl font-semibold tracking-tight mb-2">
                ±0.5%
              </div>
              <div className="text-sm text-white/50">
                Adjustable range within protocol limits
              </div>
            </div>

            <div className="mt-8">
              <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "55%" } : {}}
                  transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                  className="absolute left-[15%] h-full bg-[#ff6b35]"
                  style={{ boxShadow: "0 0 12px rgba(255,107,53,0.45)" }}
                />
                <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-lg" />
                <div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-lg" />
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-mono text-white/40">
                <span>min</span>
                <span className="text-[#ff6b35] font-semibold">reference</span>
                <span>max</span>
              </div>
            </div>
          </motion.div>
        </div>
        <SwipeHint className="lg:!hidden" />
        </div>

        {/* Footnote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-black/40 dark:text-white/40"
        >
          <span>· Fees vary by corridor</span>
          <span>· Full breakdown per trade in your dashboard</span>
          <span>· No hidden cuts</span>
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
      mobilePagination="dots"
    />
  );
};

/* ============================================
   ALPHA / BETA ROLLOUT SECTION — modernized timeline
   ============================================ */
const RolloutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const phases = [
    {
      id: "alpha",
      label: "Alpha",
      status: "Complete",
      dotClass: "bg-green-500",
      desc: "We tested flows, edge cases, and reliability with an internal team.",
    },
    {
      id: "beta",
      label: "Beta",
      status: "Now — invite only",
      dotClass: "bg-[#ff6b35]",
      pulse: true,
      desc: "Select merchants + partners in focused Dubai corridors.",
    },
    {
      id: "live",
      label: "Live",
      status: "Coming soon",
      dotClass: "bg-black/20 dark:bg-white/20",
      desc: "Public availability with expanded corridors and lower fees.",
    },
  ];

  const benefits = [
    { key: "item1", text: "Priority visibility in matching" },
    { key: "item2", text: "Direct access to the team" },
    { key: "item3", text: "Early liquidity incentives" },
    { key: "item4", text: "Lower fees during pilot" },
  ];

  return (
    <section ref={ref} className="force-light relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-black" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.3em] text-black/60 dark:text-white/30 font-semibold mb-4"
          >
            <EditableText id="merchant.rollout.eyebrow" default="Rollout" />
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-5"
          >
            <EditableText id="merchant.rollout.title.pre" default="Invite-only " as="span" />
            <EditableText id="merchant.rollout.title.accent" default="rollout." as="span" className="text-black/60 dark:text-white/40" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-black/60 dark:text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            <EditableText id="merchant.rollout.sub" default="We're expanding in stages. Get in early and shape the protocol." multiline />
          </motion.p>
        </div>

        {/* Horizontal timeline */}
        <div className="relative mb-16">
          {/* Track */}
          <div className="absolute top-5 left-0 right-0 h-px bg-black/10 dark:bg-white/10" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 0.5 } : {}}
            transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
            className="absolute top-5 left-0 h-px bg-gradient-to-r from-green-500 via-[#ff6b35] to-transparent origin-left"
            style={{ right: 0 }}
          />

          <div className="relative">
          <div className="flex md:grid md:grid-cols-3 gap-8 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {phases.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="snap-start shrink-0 w-[85%] md:w-auto relative"
              >
                {/* Dot */}
                <div className="flex justify-center md:justify-start mb-6">
                  <div className="relative">
                    <div className={`w-2.5 h-2.5 rounded-full ${p.dotClass}`} />
                    {p.pulse && (
                      <motion.div
                        animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`absolute inset-0 rounded-full ${p.dotClass}`}
                      />
                    )}
                  </div>
                </div>

                {/* Card */}
                <div className="group relative p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] lift-on-hover">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-xl font-semibold text-black dark:text-white tracking-tight">
                      <EditableText id={`merchant.rollout.phase.${p.id}.label`} default={p.label} as="span" />
                    </h3>
                    <span
                      className={`text-[10px] uppercase tracking-widest font-semibold ${
                        p.id === "beta"
                          ? "text-[#ff6b35]"
                          : p.id === "alpha"
                            ? "text-green-600 dark:text-green-400"
                            : "text-black/40 dark:text-white/40"
                      }`}
                    >
                      <EditableText id={`merchant.rollout.phase.${p.id}.status`} default={p.status} as="span" />
                    </span>
                  </div>
                  <p className="text-sm text-black/60 dark:text-white/50 leading-relaxed">
                    <EditableText id={`merchant.rollout.phase.${p.id}.desc`} default={p.desc} as="span" />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <SwipeHint />
          </div>
        </div>

        {/* Benefits row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="rounded-3xl bg-black text-white dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] p-8 md:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white/50 mb-3">
                <EditableText id="merchant.rollout.perks.eyebrow" default="Early merchant perks" as="span" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
                <EditableText id="merchant.rollout.perks.title.line1" default="Join early," as="span" />
                <br />
                <EditableText id="merchant.rollout.perks.title.line2" default="earn more." as="span" />
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-[#ff6b35]/40 transition-colors duration-300"
                >
                  <div className="w-6 h-6 rounded-full bg-[#ff6b35]/15 border border-[#ff6b35]/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-[#ff6b35]" />
                  </div>
                  <span className="text-sm text-white/80">
                    <EditableText id={`merchant.rollout.benefit.${b.key}`} default={b.text} as="span" />
                  </span>
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
   REQUIREMENTS SECTION — modernized numbered cards
   ============================================ */
const RequirementsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const requirements = [
    {
      key: "item1",
      icon: Wallet,
      title: "Liquidity ready",
      text: "You can provide liquidity for at least one corridor.",
      accent: "#ff6b35",
      glow: "rgba(255,107,53,0.18)",
    },
    {
      key: "item2",
      icon: Zap,
      title: "Fast execution",
      text: "You respond quickly and complete trades reliably.",
      accent: "#cc785c",
      glow: "rgba(61,220,132,0.18)",
    },
    {
      key: "item3",
      icon: FileCheck,
      title: "Basic verification",
      text: "Phone, email, and wallet — no full KYC during Beta.",
      accent: "#3ec5ff",
      glow: "rgba(62,197,255,0.18)",
    },
    {
      key: "item4",
      icon: Shield,
      title: "Policy compliant",
      text: "You follow trade rules and dispute policy.",
      accent: "#7877ff",
      glow: "rgba(120,119,255,0.18)",
    },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-black" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.3em] text-black/60 dark:text-white/30 font-semibold mb-4"
          >
            <EditableText id="merchant.requirements.eyebrow" default="Requirements" />
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-5"
          >
            <EditableText id="merchant.requirements.title.pre" default="Who should " as="span" />
            <EditableText id="merchant.requirements.title.accent" default="apply." as="span" className="text-black/60 dark:text-white/40" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-black/60 dark:text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            <EditableText id="merchant.requirements.sub" default="Four simple boxes to tick. If you match, we want to talk to you." multiline />
          </motion.p>
        </div>

        {/* Numbered grid */}
        <div className="relative">
        <div className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {requirements.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="snap-start shrink-0 w-[88%] sm:w-[60%] md:w-[44%] lg:w-[32%] group relative p-8 rounded-3xl text-center border border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 duration-500 transition-colors"
                style={{ background: "rgba(255, 255, 255, 0.02)" }}
              >
                {/* Step number watermark — subtle orange */}
                <span
                  className="absolute top-4 right-4 text-4xl font-bold select-none text-[#ff6b35]/15 dark:text-[#ff6b35]/20"
                >
                  0{i + 1}
                </span>

                {/* Subtle monochrome icon panel */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-105 bg-black/[0.04] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 group-hover:border-[#ff6b35]/30"
                >
                  <Icon className="w-6 h-6 text-black/70 dark:text-white/80 group-hover:text-[#ff6b35] transition-colors" strokeWidth={1.8} />
                </div>

                <h3 className="text-lg font-semibold text-black/80 dark:text-white/85 mb-2 tracking-tight">
                  <EditableText id={`merchant.requirements.${r.key}.title`} default={r.title} as="span" />
                </h3>
                <p className="text-sm font-medium text-black/55 dark:text-white/55 leading-relaxed">
                  <EditableText id={`merchant.requirements.${r.key}.text`} default={r.text} as="span" />
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
        canonical="https://www.blip.money/merchant"
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
        eyebrow="The next chapter"
        title={
          <>
            Ready to become a Blip{" "}
            <span
              style={{
                fontStyle: "italic",
                fontFamily: "ui-serif, Georgia, serif",
                fontWeight: 500,
              }}
            >
              Merchant?
            </span>
          </>
        }
        description="Apply now. Get access to the dashboard and start executing requests."
        primaryButtonText="Apply as Merchant"
        primaryButtonLink="https://app.blip.money/waitlist/merchant-login"
      />
    </>
  );
};

export default Merchant;
