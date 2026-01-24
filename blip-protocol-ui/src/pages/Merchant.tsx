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
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { MagneticWrapper } from "@/components/MagneticButton";
import { HeroDashboardVisual } from "@/components/HeroDashbaordVisual";
import { CinematicMockup } from "@/components/CinemeticMockup";
import { sounds } from "@/lib/sounds";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CTASection } from "@/components/sections/CTASection";
import { MerchantDashboardSection } from "./Index";

/* ============================================
   MERCHANT PAGE
   Dedicated landing page for merchants
   ============================================ */

/* ============================================
   HERO SECTION
   ============================================ */
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
      className="relative min-h-[100vh] overflow-hidden bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Subtle gradient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-[0.06]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,107,53,1) 0%, transparent 70%)",
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* ---------------- TEXT CONTENT ---------------- */}
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
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
            Become a Blip Merchant
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
                  <Icon className="w-4 h-4 text-[#ff6b35]" />
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
            className="flex flex-col sm:flex-row gap-4"
          >
            <MagneticWrapper strength={0.2}>
              <Link
                to="/waitlist"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black text-[15px] font-medium transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
              >
                Apply as Merchant
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticWrapper>

            <MagneticWrapper strength={0.2}>
              <a
                href="https://t.me/blip_money"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 text-white text-[15px] font-medium transition-all duration-500 hover:border-white/30 hover:bg-white/5"
              >
                Join Merchant Community
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </MagneticWrapper>
          </motion.div>
        </div>

        {/* ---------------- DASHBOARD VISUAL ---------------- */}
        <HeroDashboardVisual>
          <CinematicMockup>
            {/* Replace this with your real dashboard component */}
            <div className="w-[1100px] max-w-full h-[520px] bg-[#0f0f0f] border border-white/10 flex items-center justify-center text-white/30">
              <MerchantDashboardSection />
            </div>
          </CinematicMockup>
        </HeroDashboardVisual>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

/* ============================================
   HOW IT WORKS SECTION
   4 steps merchant flow
   ============================================ */
const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      title: "Requests appear in your dashboard",
      description: "See amount, corridor, price, and urgency.",
      icon: ListChecks,
    },
    {
      number: "02",
      title: "Accept to lock the request",
      description: "Once accepted, the order is reserved for you.",
      icon: CheckCircle2,
    },
    {
      number: "03",
      title: "Escrow secures the trade",
      description: "Funds are held while the trade completes.",
      icon: Lock,
    },
    {
      number: "04",
      title: "Settle + track on-chain",
      description:
        "Release happens on completion. Every trade is visible in Blip Scan.",
      icon: Eye,
    },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="heading-lg text-white"
          >
            How merchants execute on Blip
          </motion.h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                {/* Step number */}
                <div className="text-5xl font-semibold text-white/5 absolute top-4 right-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-[#ff6b35]/10 transition-colors">
                  <Icon className="w-6 h-6 text-white/70 group-hover:text-[#ff6b35] transition-colors" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-sm">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   WHY MERCHANTS CHOOSE BLIP
   ============================================ */
const WhyBlipSection = () => {
  const features = [
    {
      title: "No waiting",
      description: "Requests come to you instead of you hunting buyers",
      icon: Zap,
    },
    {
      title: "More control",
      description: "Filters, limits, and corridor selection",
      icon: Settings,
    },
    {
      title: "Faster execution",
      description: "One flow, minimal steps, no noise",
      icon: Gauge,
    },
    {
      title: "Lower risk",
      description: "Escrow-first design reduces failed trades",
      icon: Shield,
    },
    {
      title: "Clear operations",
      description: "Status timeline + trade history",
      icon: Activity,
    },
    {
      title: "Transparent proof",
      description: "On-chain visibility via Blip Scan",
      icon: Eye,
    },
  ];

  return (
    <FeatureGrid
      title="Built for speed, control, and repeat volume"
      subtitle="Why Merchants Choose Blip"
      features={features}
      columns={3}
      variant="cards"
    />
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
      <div className="absolute inset-0 bg-black" />

      {/* Gradient accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-[0.04]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255, 107, 53, 1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-[0.2em] text-[#ff6b35] mb-4"
          >
            Merchant Dashboard
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="heading-lg text-white mb-4"
          >
            Your command center
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/50 max-w-xl mx-auto"
          >
            Everything needed to run a desk, without the clutter.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Dashboard Preview Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden order-2 lg:order-1"
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
              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 h-24 bg-white/[0.02] rounded-lg border border-white/5" />
                  <div className="flex-1 h-24 bg-white/[0.02] rounded-lg border border-white/5" />
                  <div className="flex-1 h-24 bg-white/[0.02] rounded-lg border border-white/5" />
                </div>
                <div className="h-40 bg-white/[0.02] rounded-lg border border-white/5" />
                <div className="flex gap-4">
                  <div className="flex-1 h-20 bg-white/[0.02] rounded-lg border border-white/5" />
                  <div className="flex-1 h-20 bg-white/[0.02] rounded-lg border border-white/5" />
                </div>
              </div>

              {/* "Screenshot coming soon" overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-sm text-white/30">Dashboard Preview</p>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_80px_rgba(255,107,53,0.1)] pointer-events-none" />
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
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                  onMouseEnter={() => sounds.hover()}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#ff6b35]" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-white mb-1">
                      {callout.title}
                    </h4>
                    <p className="text-sm text-white/50">
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
      <div className="absolute inset-0 bg-[#050505]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
        >
          Pricing
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="heading-lg text-white mb-6"
        >
          You control pricing. We keep it simple.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Blip shows a live market reference rate. You can adjust your quote
          within allowed ranges to win the request faster when needed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 max-w-xl mx-auto"
        >
          <div className="space-y-3 text-sm text-white/40">
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
      title="Trades secured by escrow + transparency"
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
      <div className="absolute inset-0 bg-black" />

      {/* Border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Rollout Phases */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-sm uppercase tracking-[0.2em] text-[#ff6b35] mb-4"
            >
              Rollout
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="heading-lg text-white mb-8"
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
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                  <h3 className="text-lg font-semibold text-white">Alpha</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                    Internal
                  </span>
                </div>
                <p className="text-white/50 text-sm">
                  We test flows, edge cases, and reliability.
                </p>
              </div>

              {/* Beta */}
              <div className="p-5 rounded-xl bg-[#ff6b35]/5 border border-[#ff6b35]/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
                  <h3 className="text-lg font-semibold text-white">Beta</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff6b35]/10 text-[#ff6b35]">
                    Invite-only
                  </span>
                </div>
                <p className="text-white/50 text-sm">
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
              className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
            >
              Benefits
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="heading-md text-white mb-8"
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
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#ff6b35]" />
                  </div>
                  <span className="text-white/70">{benefit}</span>
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
      <div className="absolute inset-0 bg-[#050505]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
          >
            Requirements
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="heading-lg text-white"
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
                className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white/60" />
                </div>
                <p className="text-white/70 pt-2">{req.text}</p>
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
      <div className="absolute inset-0 bg-black" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
          >
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="heading-lg text-white"
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
              className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden"
            >
              <button
                onClick={() => {
                  setOpenIndex(openIndex === index ? null : index);
                  sounds.click();
                }}
                onMouseEnter={() => sounds.hover()}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-white/40 transition-transform duration-300 ${
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
                    <div className="px-5 pb-5 text-white/50">{faq.answer}</div>
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

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */
const Merchant = () => {
  return (
    <>
      <SEO
        title="Become a Merchant | Blip"
        canonical="https://blip.money/merchant"
        description="Accept high-intent crypto-to-cash requests in seconds. Set your margin, execute with escrow protection, and track everything on-chain."
        keywords="P2P merchant, crypto settlement, liquidity provider, escrow trading, Blip merchant"
      />

      <MerchantHero />
      <HowItWorksSection />
      <WhyBlipSection />
      <DashboardSection />
      <PricingSection />
      <TrustSection />
      <RolloutSection />
      <RequirementsSection />
      <FAQSection />

      <CTASection
        title="Ready to become a Blip Merchant?"
        description="Apply now. Get access to the dashboard and start executing requests."
        primaryButtonText="Apply as Merchant"
        primaryButtonLink="/waitlist"
        secondaryButtonText="Join Merchant Community"
        secondaryButtonLink="https://t.me/blip_money"
        background="gradient"
      />
    </>
  );
};

export default Merchant;
