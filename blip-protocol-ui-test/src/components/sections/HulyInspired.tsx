import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Zap,
  Shield,
  Globe,
  Lock,
  Eye,
  Wallet,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  Users,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================
   INFINITE MARQUEE COMPONENT
   Huly-style scrolling feature tags
   ============================================ */
export const InfiniteMarquee = () => {
  const tags = [
    { text: "Instant Settlement", icon: Zap },
    { text: "No KYC Required", icon: Shield },
    { text: "Global Coverage", icon: Globe },
    { text: "Escrow Protected", icon: Lock },
    { text: "On-Chain Proof", icon: Eye },
    { text: "Multi-Currency", icon: Wallet },
    { text: "24/7 Trading", icon: Clock },
    { text: "Verified Merchants", icon: CheckCircle2 },
    { text: "P2P Network", icon: Users },
    { text: "Real-Time Analytics", icon: BarChart3 },
  ];

  // Duplicate for seamless loop
  const allTags = [...tags, ...tags, ...tags];

  return (
    <div className="relative w-full overflow-hidden py-8 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-10" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-10" />

      <motion.div
        className="flex gap-4"
        animate={{ x: [0, -2400] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        }}
      >
        {allTags.map((tag, index) => {
          const Icon = tag.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm whitespace-nowrap hover:border-black/[0.15] hover:bg-black dark:bg-white/5 transition-all duration-300 cursor-default"
            >
              <Icon className="w-4 h-4 text-black dark:text-white" />
              <span className="text-sm text-white/70">{tag.text}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

/* ============================================
   GRADIENT TEXT HERO SECTION
   Huly-style lavender/pink gradient text
   ============================================ */
export const GradientHeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
    >
      {/* Atmospheric blur gradients - Huly style */}
      <div className="absolute inset-0">
        {/* Primary gradient blob */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(147, 112, 219, 0.4) 0%, rgba(0,0,0,0.2) 50%, transparent 70%)",
            filter: "blur(80px)",
            x: mousePos.x * 30,
            y: mousePos.y * 30,
          }}
        />
        {/* Secondary gradient blob */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 182, 193, 0.4) 0%, rgba(147, 112, 219, 0.2) 50%, transparent 70%)",
            filter: "blur(60px)",
            x: mousePos.x * -20,
            y: mousePos.y * -20,
          }}
        />
        {/* Accent glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-black dark:text-white" />
          <span className="text-sm text-white/60">
            The Everything Protocol for Payments
          </span>
        </motion.div>

        {/* Gradient headline - Huly style */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.9] mb-8"
        >
          <span
            className="block"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #c4b5fd 40%, #f0abfc 70%, #000000 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Borderless Money
          </span>
          <span
            className="block mt-2"
            style={{
              background:
                "linear-gradient(135deg, #f0abfc 0%, #c4b5fd 50%, #ffffff 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            For Everyone
          </span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          One protocol. Any currency. Zero friction. Send, receive, and settle
          payments globally with on-chain transparency.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/waitlist"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-black text-[15px] font-medium transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,0,0,0.25)]"
            style={{
              background:
                "linear-gradient(135deg, #111 0%, #333 50%, #555 100%)",
            }}
          >
            Get Started
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/how-it-works"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 text-white text-[15px] font-medium transition-all duration-500 hover:border-white/30 hover:bg-white/5"
          >
            See How It Works
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   HULY-STYLE FEATURE CARDS
   Cards with atmospheric blur and video-like backgrounds
   ============================================ */
const featureCards = [
  {
    title: "Instant Settlement",
    description:
      "Trades complete in seconds, not days. Real-time escrow release with on-chain finality.",
    icon: Zap,
    gradient: "from-white/[0.06] via-white/[0.03] to-white/[0.06]",
    accentColor: "#ffffff",
  },
  {
    title: "Global Network",
    description:
      "Access merchants worldwide. Any currency pair, any corridor, one unified protocol.",
    icon: Globe,
    gradient: "from-white/[0.06] via-white/[0.03] to-white/[0.06]",
    accentColor: "#ffffff",
  },
  {
    title: "Privacy First",
    description:
      "No KYC for basic trades. Your data stays yours. Non-custodial by design.",
    icon: Shield,
    gradient: "from-white/[0.06] via-white/[0.03] to-white/[0.06]",
    accentColor: "#ffffff",
  },
  {
    title: "Escrow Protected",
    description:
      "Every trade secured by smart contract escrow. Funds locked until both parties confirm.",
    icon: Lock,
    gradient: "from-white/[0.06] via-white/[0.03] to-white/[0.06]",
    accentColor: "#ffffff",
  },
];

export const HulyFeatureCards = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030303]" />

      {/* Atmospheric gradient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] opacity-20"
        style={{
          background:
            "radial-gradient(ellipse, rgba(147, 112, 219, 0.3) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-[0.2em] text-black dark:text-white mb-4"
          >
            Core Features
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[0.95]"
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, #c4b5fd 60%, #f0abfc 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Unmatched Power
            </span>
          </motion.h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative h-[280px] rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Card background with gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Base background */}
                <div className="absolute inset-0 bg-white/[0.02] border border-white/[0.06] rounded-2xl" />

                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: `inset 0 0 60px ${card.accentColor}15, 0 0 40px ${card.accentColor}10`,
                  }}
                />

                {/* Animated border on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    border: `1px solid ${card.accentColor}30`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500"
                    style={{
                      background: isHovered
                        ? `${card.accentColor}20`
                        : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <Icon
                      className="w-7 h-7 transition-colors duration-500"
                      style={{
                        color: isHovered ? card.accentColor : "rgba(255,255,255,0.6)",
                      }}
                    />
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                      {card.description}
                    </p>
                  </div>

                  {/* Learn more link */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: card.accentColor }}
                    >
                      Learn more
                    </span>
                    <ArrowRight
                      className="w-4 h-4"
                      style={{ color: card.accentColor }}
                    />
                  </motion.div>
                </div>

                {/* Decorative particles on hover */}
                {isHovered && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{ background: card.accentColor }}
                        initial={{
                          x: Math.random() * 100 + "%",
                          y: "100%",
                          opacity: 0,
                        }}
                        animate={{
                          y: "-20%",
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2 + Math.random(),
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   MOUSE TRACKING RADIAL GLOW
   Interactive section with cursor-following effect
   ============================================ */
export const InteractiveGlowSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const stats = [
    { value: "$2.4M+", label: "Total Volume" },
    { value: "12,847", label: "Settlements" },
    { value: "99.8%", label: "Success Rate" },
    { value: "<30s", label: "Avg. Settlement" },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Mouse-following radial glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          left: mousePos.x - 300,
          top: mousePos.y - 300,
          background:
            "radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(147, 112, 219, 0.08) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          opacity: isHovering ? 1 : 0,
          scale: isHovering ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
          >
            Network Stats
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight"
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, #000000 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Growing Every Day
            </span>
          </motion.h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center group hover:border-black/[0.15] transition-all duration-500"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-black/[0.03] to-transparent dark:from-white/[0.03]" />

              <div className="relative z-10">
                <div
                  className="text-4xl sm:text-5xl font-bold mb-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #000000 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
