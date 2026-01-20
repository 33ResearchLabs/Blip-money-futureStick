import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import {
  Gift,
  Percent,
  Wallet,
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  ChevronDown,
  TrendingUp,
  Star,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { sounds } from "@/lib/sounds";
import { MagneticWrapper } from "@/components/MagneticButton";

/* ============================================
   AWARD-WINNING REWARDS PAGE
   Cinematic scroll animations with gamified design
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
      className="relative h-screen"
      style={{ opacity }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background with parallax */}
        <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
          <img
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
            alt="Rewards"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </motion.div>

        {/* Animated particles */}
        <div className="absolute inset-0 z-[1]">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#ff6b35] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

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
            <span className="text-[14px] text-white/70 font-medium tracking-wide">20M BLIP Rewards Pool</span>
          </motion.div>

          {/* Headlines */}
          <div className="overflow-hidden mb-10">
  <motion.h1
    initial={{ y: 150 }}
    animate={{ y: 0 }}
    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    className="text-[clamp(2.5rem,10vw,7rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
  >
    <span className="block text-white">
      Earn in
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
      a Blip.
    </span>
  </motion.h1>
</div>


          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Get rewarded for every transaction. First-mover advantages and tiered cashback await.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <MagneticWrapper strength={0.2}>
              <Link
                to="/waitlist"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="group inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-black text-lg font-medium transition-all duration-500 hover:shadow-[0_0_100px_rgba(255,255,255,0.4)]"
              >
                Start Earning
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </MagneticWrapper>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="text-xs text-white/40 uppercase tracking-[0.2em]">Discover</span>
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
   SECTION 2: REWARD TIERS
   ============================================ */

const RewardTiersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const tiers = [
    {
      name: "Pioneer",
      reward: "100%",
      desc: "First transfer reward",
      icon: Sparkles,
      highlight: true,
    },
    {
      name: "Explorer",
      reward: "5%",
      desc: "Standard cashback",
      icon: TrendingUp,
    },
    {
      name: "Achiever",
      reward: "7.5%",
      desc: "$5K+ volume",
      icon: Star,
    },
    {
      name: "Elite",
      reward: "10%",
      desc: "$25K+ volume",
      icon: Shield,
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-black overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 block">Reward Tiers</span>
          <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight">
            More Volume.<br />
            <span className="text-white/30">More Rewards.</span>
          </h2>
        </motion.div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`group relative p-8 rounded-3xl overflow-hidden ${
                tier.highlight ? 'lg:scale-105' : ''
              }`}
              style={{
                background: tier.highlight
                  ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.02) 100%)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: tier.highlight
                  ? '1px solid rgba(255, 107, 53, 0.2)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
              }}
              onMouseEnter={() => sounds.hover()}
            >
              {/* Hover glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ff6b35] opacity-0 group-hover:opacity-[0.08] blur-[60px] rounded-full transition-opacity duration-500" />

              {tier.highlight && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#ff6b35]/20 text-white/60 text-[10px] font-medium uppercase tracking-wider">
                  Best Value
                </div>
              )}

              <div className="relative z-10">
                <div className="mb-6">
                  <tier.icon className={`w-8 h-8 ${tier.highlight ? 'text-white/60' : 'text-white/50'}`} />
                </div>

                <h3 className="text-lg text-white/60 mb-2">{tier.name}</h3>
                <div className="text-5xl font-semibold text-white mb-4">{tier.reward}</div>
                <p className="text-sm text-white/40">{tier.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION 3: HOW IT WORKS
   ============================================ */

const HowItWorksSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const steps = [
    {
      num: "01",
      title: "Connect Wallet",
      desc: "Link your Solana wallet to the Blip protocol.",
      icon: Wallet,
    },
    {
      num: "02",
      title: "Make Transfers",
      desc: "Send crypto to fiat anywhere in the world.",
      icon: Zap,
    },
    {
      num: "03",
      title: "Earn Rewards",
      desc: "Get BLIP tokens automatically credited.",
      icon: Gift,
    },
    {
      num: "04",
      title: "Level Up",
      desc: "Increase volume to unlock higher tiers.",
      icon: Layers,
    },
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
        EARN REWARDS • EARN REWARDS • EARN REWARDS •
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
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 block">Process</span>
          <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight">
            How It<br />
            <span className="text-white/30">Works.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group relative"
              onMouseEnter={() => sounds.hover()}
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-white/10 to-transparent" />
              )}

              <div
                className="relative p-8 rounded-3xl h-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {/* Number */}
                <span className="absolute top-4 right-4 text-6xl font-bold text-white/[0.03] select-none">
                  {step.num}
                </span>

                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors duration-500">
                  <step.icon className="w-7 h-7 text-white/60" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-white/50">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION 4: REWARD FEATURES
   ============================================ */

const FeaturesSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [100, -100]), smoothConfig);
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, -50]), smoothConfig);

  const features = [
    {
      title: "Instant Cashback",
      desc: "Rewards credited immediately after each successful transaction.",
    },
    {
      title: "No Minimum",
      desc: "Start earning from your very first transfer. No barriers to entry.",
    },
    {
      title: "Compounding",
      desc: "Stake your BLIP rewards to earn additional yield.",
    },
    {
      title: "Referral Bonus",
      desc: "Earn extra rewards when you invite friends to Blip.",
    },
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
              src="https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2942&auto=format&fit=crop"
              alt="Rewards"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl backdrop-blur-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/50 mb-1">Total Rewards Pool</div>
                  <div className="text-3xl font-semibold text-white">20,000,000</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/50 mb-1">Token</div>
                  <div className="text-3xl font-semibold text-white/60">BLIP</div>
                </div>
              </div>
            </motion.div>
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
              <span className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 block">Features</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6">
                Maximum<br />
                <span className="text-white/30">Value.</span>
              </h2>
            </motion.div>

            <div className="space-y-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.02]"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                  onMouseEnter={() => sounds.hover()}
                >
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/60 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/50">{feature.desc}</p>
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
   SECTION 5: CTA
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
            Start<br />
            <span className="text-white/30">Earning.</span>
          </h2>

          <p className="text-xl text-white/50 max-w-xl mx-auto mb-12">
            Join the rewards program and get cashback on every transaction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticWrapper strength={0.2}>
              <Link
                to="/waitlist"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="group inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-black text-lg font-medium transition-all duration-500 hover:shadow-[0_0_100px_rgba(255,255,255,0.4)]"
              >
                Join Waitlist
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </MagneticWrapper>

            <MagneticWrapper strength={0.2}>
              <Link
                to="/how-it-works"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="group inline-flex items-center gap-4 px-10 py-5 rounded-full border border-white/15 text-white text-lg font-medium transition-all duration-500 hover:bg-white/5 hover:border-white/30"
              >
                Learn More
              </Link>
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

const Rewards = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Blip Money Rewards | Earn for Using Crypto Payments"
        description="Discover how Blip Money rewards users for participating in secure and efficient crypto payment transactions."
        canonical="https://blip.money/rewards"
      />

      <div className="bg-black text-white overflow-x-hidden">
        <HeroSection />
        <RewardTiersSection />
        <HowItWorksSection />
        <FeaturesSection />
        <CTASection />
      </div>
    </>
  );
};

export default Rewards;
