import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import {
  Shield,
  Zap,
  Lock,
  Wallet,
  Users,
  Globe,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { sounds } from "@/lib/sounds";
import { MagneticWrapper } from "@/components/MagneticButton";

/* ============================================
   AWARD-WINNING HOW IT WORKS PAGE
   Cinematic scroll animations with storytelling
   ============================================ */

const smoothConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

/* ============================================
   SECTION 1: CINEMATIC HERO
   ============================================ */

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), smoothConfig);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <motion.section
      ref={ref}
      className="relative "
      style={{ opacity }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background with parallax */}
        <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
          <img
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop"
            alt="Blockchain technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </motion.div>

        {/* Grid overlay */}
        <div className="absolute inset-0 z-[1] opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, white 1px, transparent 1px),
                linear-gradient(to bottom, white 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10 backdrop-blur-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
            <span className="text-[14px] text-white/70 font-medium tracking-wide">How Blip Works</span>
          </motion.div>

          {/* Headlines */}
          <div className="overflow-hidden mb-10">
  <motion.h1
    initial={{ y: 150 }}
    animate={{ y: 0 }}
    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    className="text-[clamp(2.5rem,10vw,7rem)] font-semibold text-white leading-[0.95] tracking-[-0.04em]"
  >
    <span className="block">
      Value. Settled.
    </span>

    <span
      className="block"
      style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c50 50%, #ffffff 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      Privately.
    </span>
  </motion.h1>
</div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            The on-chain protocol for instant, secure, and KYC-free global value transfer.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="text-xs text-white/40 uppercase tracking-[0.2em]">Explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5 text-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

/* ============================================
   SECTION 2: KEY CONCEPTS
   ============================================ */

const KeyConceptsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const concepts = [
    {
      icon: Lock,
      title: "Non-Custodial Escrow",
      desc: "Funds are secured by code, not intermediaries.",
    },
    {
      icon: Zap,
      title: "Zero Intermediaries",
      desc: "Direct settlement between wallet and merchant.",
    },
    {
      icon: Shield,
      title: "Privacy-First Design",
      desc: "Wallet-based access with zero KYC required.",
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-black overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {concepts.map((concept, i) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 rounded-3xl overflow-hidden cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
              onMouseEnter={() => sounds.hover()}
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors duration-500">
                  <concept.icon className="w-6 h-6 text-white/70 group-hover:text-white/60 transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{concept.title}</h3>
                <p className="text-white/50">{concept.desc}</p>
              </div>

              {/* Bottom accent line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff6b35] to-transparent"
                initial={{ scaleX: 0, originX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION 3: CORE PROTOCOL
   ============================================ */

const CoreProtocolSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const pillars = [
    { icon: Lock, title: "Escrow PDA", desc: "Funds secured by immutable smart contract." },
    { icon: Users, title: "Merchant Staking", desc: "Collateral locked for secure execution." },
    { icon: Globe, title: "DAO Governance", desc: "Decentralized arbitration for disputes." },
    { icon: Wallet, title: "Wallet-Only", desc: "Zero KYC, financial privacy preserved." },
  ];

  return (
    <section ref={ref} className="relative py-40 bg-black overflow-hidden">
      {/* Background text */}
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[15vw] font-bold text-white/[0.015] select-none pointer-events-none"
        style={{
          x: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]),
        }}
      >
        TRUST REDEFINED • TRUST REDEFINED • TRUST REDEFINED •
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 block">The Protocol</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight">
            Trust<br />
            <span className="text-white/30">Redefined.</span>
          </h2>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group relative p-8 rounded-3xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
              onMouseEnter={() => sounds.hover()}
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-6xl font-bold text-white/[0.03] select-none">
                0{i + 1}
              </span>

              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-white/10 transition-colors duration-500">
                <pillar.icon className="w-7 h-7 text-white/60" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{pillar.title}</h3>
              <p className="text-sm text-white/50">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION 4: TRANSACTION FLOW
   ============================================ */

const TransactionFlowSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const steps = [
    {
      num: "01",
      title: "Initiation & Lock",
      content: "User defines order parameters and executes FUND_ESCROW.",
      result: "Funds secured in immutable Escrow PDA.",
    },
    {
      num: "02",
      title: "Commitment & Stake",
      content: "Merchant accepts and locks proportional collateral.",
      result: "Escrow moves to IN_PROGRESS state.",
    },
    {
      num: "03",
      title: "Off-Chain Payout",
      content: "Merchant executes fiat payout to recipient.",
      result: "Value delivered, ready for verification.",
    },
    {
      num: "04",
      title: "Verification & Release",
      content: "User confirms receipt, escrow executes RELEASE_FUNDS.",
      result: "Crypto sent, stake returned, COMPLETED.",
    },
    {
      num: "05",
      title: "Finality or Arbitration",
      content: "Disputes reviewed by DAO, final resolution voted.",
      result: "COMPLETED, RESOLVED, or SLASHED.",
    },
  ];

  const lineProgress = useSpring(useTransform(scrollYProgress, [0.1, 0.8], [0, 100]), smoothConfig);

  return (
    <section ref={ref} className="relative py-40 bg-black overflow-hidden">
      {/* Background image with parallax */}
      <div className="absolute inset-0 z-0">
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
          className="w-full h-[120%] -mt-[10%]"
        >
          <img
            src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=2874&auto=format&fit=crop"
            alt="Technology"
            className="w-full h-full object-cover opacity-10"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 block">Transaction Flow</span>
          <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-6">
            Atomic.<br />
            <span className="text-white/30">Guaranteed.</span>
          </h2>
          <p className="text-xl text-white/50 max-w-xl mx-auto">
            Every transaction executes atomically, guaranteed by on-chain escrow state transitions.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-white/10">
            <motion.div
              className="w-full bg-gradient-to-b from-[#ff6b35] to-[#ff6b35]/30"
              style={{ height: lineProgress.get() + '%' }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative pl-16"
              >
                {/* Number circle */}
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-black border-2 border-[#ff6b35]/50 flex items-center justify-center">
                  <span className="text-sm font-mono text-white/60">{step.num}</span>
                </div>

                {/* Content card */}
                <div
                  className="p-8 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-white/60 mb-4">{step.content}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-white/60" />
                    <span className="text-white/40">Result: {step.result}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION 5: SECURITY MODEL
   ============================================ */

const SecuritySection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [100, -100]), smoothConfig);
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, -50]), smoothConfig);

  const securityPillars = [
    {
      title: "Economic Enforcement",
      desc: "Security enforced by economic incentives. Merchant stake at risk if delivery fails.",
    },
    {
      title: "Immutable Code",
      desc: "No admin keys control funds. Non-upgradable contracts ensure finality.",
    },
    {
      title: "DAO Arbiter",
      desc: "Decentralized control prevents single-party failure during disputes.",
    },
  ];

  const metrics = [
    { value: "~500ms", label: "Escrow Lock" },
    { value: "< 1s", label: "Proof Verification" },
    { value: "Instant", label: "On-chain Finality" },
  ];

  return (
    <section ref={ref} className="relative py-40 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Image with parallax */}
          <motion.div
            className="relative aspect-square rounded-3xl overflow-hidden"
            style={{ y: y1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2940&auto=format&fit=crop"
              alt="Security"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Floating metrics */}
            <div className="absolute bottom-8 left-8 right-8 grid grid-cols-3 gap-4">
              {metrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="text-center p-4 rounded-xl backdrop-blur-xl"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="text-2xl font-semibold text-white">{metric.value}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div style={{ y: y2 }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="mb-12"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 block">Security Model</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">
                Cryptographic<br />
                <span className="text-white/30">Security.</span>
              </h2>
            </motion.div>

            <div className="space-y-6">
              {securityPillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.02]"
                  onMouseEnter={() => sounds.hover()}
                >
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/60 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-white/50">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION 6: ORDER TYPES
   ============================================ */

const OrderTypesSection = () => {
  const orderTypes = [
    {
      title: "Crypto → Cash",
      desc: "Convert digital assets to physical currency anywhere, secured by staked merchant commitment.",
      image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=2942&auto=format&fit=crop",
    },
    {
      title: "Crypto → Bank",
      desc: "Settle high-value transactions directly into any bank account, bypassing identity requirements.",
      image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?q=80&w=2940&auto=format&fit=crop",
    },
    {
      title: "Crypto → Crypto",
      desc: "Swap assets across chains using the same escrow security, without CEX infrastructure.",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2787&auto=format&fit=crop",
    },
  ];

  return (
    <section className="relative py-40 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 block">Order Types</span>
          <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight">
            Multiple<br />
            <span className="text-white/30">Destinations.</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {orderTypes.map((type, i) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer"
              onMouseEnter={() => sounds.hover()}
            >
              {/* Image */}
              <motion.img
                src={type.image}
                alt={type.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-semibold text-white mb-3">{type.title}</h3>
                <p className="text-white/60 leading-relaxed">{type.desc}</p>
              </div>

              {/* Hover border */}
              <div className="absolute inset-0 rounded-3xl border border-white/0 group-hover:border-[#ff6b35]/30 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION 7: FINAL CTA
   ============================================ */

const CTASection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [0.8, 1]), smoothConfig);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center py-40 bg-black overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ scale, opacity }}
      >
        <div className="w-[600px] h-[600px] rounded-full bg-white/10 blur-[150px]" />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight mb-8">
            Code over<br />
            <span className="text-white/30">Trust.</span>
          </h2>

          <p className="text-xl text-white/50 max-w-xl mx-auto mb-12">
            The certainty of code replacing the necessity of trust. Start your journey with Blip today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticWrapper strength={0.2}>
              <Link
                to="/waitlist"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="group inline-flex items-center gap-4 px-10 py-5 rounded-full   bg-[#ff6b35] text-black text-lg font-medium hover:bg-[#ff8c50] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] transition-all duration-300"
              >
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </MagneticWrapper>

            <MagneticWrapper strength={0.2}>
              <a
                href="/whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="group inline-flex items-center gap-4 px-10 py-[18px] rounded-full border border-white/15 text-white text-lg font-medium transition-all duration-500 hover:bg-white/5 hover:border-white/30"
              >
                Read Whitepaper
              </a>
            </MagneticWrapper>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */

export const HowItWorksPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="How Blip Money Works | Simple Crypto Payment Flow"
        description="Learn how Blip Money enables seamless crypto payments through a simple, transparent, and secure settlement process."
        canonical="https://blip.money/how-it-works"
      />

      <div className="bg-black text-white overflow-x-hidden">
        <HeroSection />
        <KeyConceptsSection />
        <CoreProtocolSection />
        <TransactionFlowSection />
        <SecuritySection />
        <OrderTypesSection />
        <CTASection />
      </div>
    </>
  );
};

export default HowItWorksPage;
