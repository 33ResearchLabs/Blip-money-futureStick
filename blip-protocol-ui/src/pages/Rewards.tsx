import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
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
  CheckCircle2,
  Coins,
  Users,
  Signal,
  Wifi,
  Battery,
  User,
  BatteryFull,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { Header } from "@/components/Hero/PhoneMockup";
import { CTAButton } from "@/components/Navbar";

/* ============================================
   2025/2026 REWARDS PAGE
   Matching homepage design system
   - Orange (#ffffff) accent color
   - Dark theme with subtle gradients
   - Parallax animations
   - Clean, minimal aesthetic
   ============================================ */

const smoothConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

/* ============================================
   INTERACTIVE GRID BACKGROUND
   ============================================ */

const InteractiveGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener("mousemove", handleMouseMove);
      grid.addEventListener("mouseenter", () => setIsHovering(true));
      grid.addEventListener("mouseleave", () => setIsHovering(false));
    }

    return () => {
      if (grid) {
        grid.removeEventListener("mousemove", handleMouseMove);
        grid.removeEventListener("mouseenter", () => setIsHovering(true));
        grid.removeEventListener("mouseleave", () => setIsHovering(false));
      }
    };
  }, []);

  const gridSize = 60;
  const cols = Math.ceil(1920 / gridSize);
  const rows = Math.ceil(1080 / gridSize);

  return (
    <div
      ref={gridRef}
      className="absolute inset-0 overflow-hidden"
      style={{ pointerEvents: "auto" }}
    >
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
          x: mousePos.x - 200,
          y: mousePos.y - 200,
        }}
        animate={{
          opacity: isHovering ? 1 : 0,
          scale: isHovering ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      />

      <svg className="absolute inset-0 w-full h-full">
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const x = col * gridSize + gridSize / 2;
            const y = row * gridSize + gridSize / 2;
            const distance = Math.sqrt(
              Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2),
            );
            const maxDistance = 150;
            const isActive = distance < maxDistance && isHovering;
            const scale = isActive ? 1 + (1 - distance / maxDistance) * 2 : 1;
            const opacity = isActive
              ? 0.3 + (1 - distance / maxDistance) * 0.7
              : 0.08;

            return (
              <motion.circle
                key={`${row}-${col}`}
                cx={x}
                cy={y}
                r={1.5}
                fill={isActive ? "#ffffff" : "rgba(255, 255, 255, 0.15)"}
                animate={{
                  r: scale * 1.5,
                  opacity,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  filter: isActive
                    ? "drop-shadow(0 0 4px rgba(255, 107, 53, 0.5))"
                    : "none",
                }}
              />
            );
          }),
        )}
      </svg>
    </div>
  );
};

/* ============================================
   PHONE MOCKUP COMPONENT
   ============================================ */

const PhoneMockup = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      });
    };

    const reset = () => setMouse({ x: 0, y: 0 });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div ref={containerRef} className="relative">
        <motion.div
          animate={{
            x: mouse.x * -12,
            y: mouse.y * -10,
            rotateY: mouse.x * 6,
            rotateX: mouse.y * -4,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
        >
          {/* Reflection effect */}
          <motion.div
            className="absolute inset-0 rounded-[28px] sm:rounded-[36px] md:rounded-[44px] pointer-events-none z-10"
            style={{
              background: `linear-gradient(${135 + mouse.x * 25}deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)`,
            }}
          />
          <div className="w-[200px] sm:w-[250px] md:w-[290px] lg:w-[320px]">
            {/* Phone outer frame */}
            <div className="rounded-[36px] sm:rounded-[40px] md:rounded-[44px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[2px] sm:p-[2.5px] shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(255,107,53,0.08)] md:shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(255,107,53,0.1)]">
              <div className="rounded-[34px] sm:rounded-[38px] md:rounded-[42px] bg-[#0a0a0a] p-[1px] sm:p-[8px] md:p-[10px]">
                {/* Phone screen */}
                <div className="rounded-[28px] sm:rounded-[30px] md:rounded-[34px] bg-black overflow-y-auto overflow-x-hidden relative max-h-[500px] sm:max-h-[600px] md:max-h-[650px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {/* Dynamic Island */}
                  <div className="hidden md:block absolute top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-28 h-7 rounded-full bg-black flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-[#1a1a1a] mr-2" />
                    </div>
                  </div>

                  {/* Status bar */}
                  <div className="flex items-center justify-between px-8 pt-4 pb-2">
                    <span className="text-[10px] md:text-[13px] text-white font-semibold">
                      9:41
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Signal className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      <BatteryFull className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  {children}

                  {/* Home indicator */}
                  <div className="flex justify-center pb-1.5 sm:pb-2">
                    <div className="w-16 sm:w-24 md:w-28 lg:w-32 h-0.5 sm:h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ============================================
   SECTION 1: HERO
   ============================================ */

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 100]),
    smoothConfig,
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        opacity:
          typeof window !== "undefined" && window.innerWidth < 1024
            ? 1
            : opacity,
      }}
    >
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-[10%] right-[15%] w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)",
            x: mousePosition.x * -30,
            y: mousePosition.y * -20,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
            x: mousePosition.x * 20,
            y: mousePosition.y * 15,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,107,53,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.5) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Animated particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#ffffff]"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-20 lg:pt-0">
        {/* Left: Text */}
        <div className="text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10 backdrop-blur-sm"
            style={{
              background: "rgba(255, 107, 53, 0.05)",
              border: "1px solid rgba(255, 107, 53, 0.15)",
            }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#ffffff]"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[13px] text-white/70 font-medium tracking-wide">
              20M BLIP Rewards Pool
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight"
          >
            Earn in a
            <br />
            <span className="text-white/20">Blip.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-white/50 max-w-md mx-auto lg:mx-0 leading-relaxed mb-10"
          >
            Get rewarded for every transaction. Instant cashback, tiered
            rewards, and first-mover advantages.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center justify-center lg:justify-start gap-8 mb-10"
          >
            {[
              { value: "5%", label: "Max Cashback" },
              { value: "100%", label: "First Transfer" },
              { value: "∞", label: "No Cap" },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              to="/join-waitlist"
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-full bg-[#ffffff] text-black text-sm font-semibold hover:bg-[#e5e5e5] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] transition-all duration-300"
            >
              Start Earning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all duration-300"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 flex items-center justify-center lg:justify-start gap-3"
          >
            <span className="text-white/30 text-xs uppercase tracking-[0.2em]">
              Scroll to explore
            </span>
            <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#ffffff]"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>

        {/* Right: Phone Mockup */}

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex justify-center py-2"
          style={{
            y:
              typeof window !== "undefined" && window.innerWidth < 1024 ? 0 : y,
          }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="absolute w-[500px] h-[500px] rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Phone with 3D tilt */}
          <motion.div
            style={{
              x:
                typeof window !== "undefined" && window.innerWidth < 1024
                  ? 0
                  : mousePosition.x * -15,
              y:
                typeof window !== "undefined" && window.innerWidth < 1024
                  ? 0
                  : mousePosition.y * -12,
              rotateY:
                typeof window !== "undefined" && window.innerWidth < 1024
                  ? 0
                  : mousePosition.x * 8,
              rotateX:
                typeof window !== "undefined" && window.innerWidth < 1024
                  ? 0
                  : mousePosition.y * -5,
              transformPerspective: 1200,
              transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <PhoneMockup>
              {/* App content - Rewards Screen */}
              <div className="px-6 pb-3 sm:pb-10 pt-1 sm:pt-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-2 sm:mb-8">
                  <div className="flex items-center gap-3">
                    <Header />
                  </div>
                  <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                  </div>
                </div>

                {/* Total Rewards Card */}
                <div className="rounded-2xl bg-gradient-to-br from-[#ffffff]/20 to-[#ffffff]/5 border border-[#ffffff]/20 mb:p-4 p-2 mb-4">
                  <p className="md:text-[10px] text-[8px] text-white/50 uppercase tracking-wider mb-1">
                    Total Earned
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="md:text-3xl font-bold text-white">
                      2,450
                    </span>
                    <span className="text-sm text-[#ffffff]">BLIP</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] text-green-400">
                      +125 this week
                    </span>
                  </div>
                </div>

                {/* Current Tier */}
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] mb:p-3 p-2  mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="md:text-[10px] text-[8px] text-white/40 uppercase">
                        Current Tier
                      </p>
                      <p className="md:text-sm text-[12px] font-semibold text-white">
                        Explorer
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="md:text-[10px] text-[8px] text-white/40 uppercase">
                        Cashback
                      </p>
                      <p className="text-lg font-bold text-[#ffffff]">5%</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[9px] text-white/30 mb-1">
                      <span>$2,450</span>
                      <span>$5,000</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[49%] bg-gradient-to-r from-[#ffffff] to-[#e5e5e5] rounded-full" />
                    </div>
                    <p className="text-[9px] text-white/40 mt-1">
                      $2,550 to Achiever tier
                    </p>
                  </div>
                </div>

                {/* Recent rewards */}
                <div className="space-y-2">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">
                    Recent Rewards
                  </p>
                  {[
                    {
                      amount: "+25",
                      desc: "Transfer to Lagos",
                      time: "2m ago",
                    },
                    {
                      amount: "+50",
                      desc: "Transfer to Dubai",
                      time: "1h ago",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="text-xs text-white">{item.desc}</p>
                        <p className="text-[10px] text-white/30">{item.time}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#ffffff]">
                        {item.amount} BLIP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </PhoneMockup>
          </motion.div>
        </motion.div>
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
      color: "#ffffff",
    },
    {
      name: "Explorer",
      reward: "5%",
      desc: "Standard cashback",
      icon: TrendingUp,
      color: "#ffffff",
    },
    {
      name: "Achiever",
      reward: "7.5%",
      desc: "$5K+ volume",
      icon: Star,
      color: "#ffffff",
    },
    {
      name: "Elite",
      reward: "10%",
      desc: "$25K+ volume",
      icon: Shield,
      color: "#ffffff",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative md:py-32 py-12 bg-black overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#ffffff]/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#ffffff] mb-4 block">
            Reward Tiers
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
            More Volume.
            <br />
            <span className="text-white/20">More Rewards.</span>
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Unlock higher cashback rates as your transaction volume grows.
          </p>
        </motion.div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`group relative p-8 rounded-3xl overflow-hidden hover-lg:scale-105 border border-white/5" hover:border-[#ffffff]/20 transition-colors duration-500 `}
              // style={{
              //   background: tier.highlight
              //     ? "linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.02) 100%)"
              //     : "rgba(255, 255, 255, 0.02)",
              //   border: tier.highlight
              //     ? "1px solid rgba(255, 107, 53, 0.2)"
              //     : "1px solid rgba(255, 255, 255, 0.05)",
              // }}
            >
              {/* Hover glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ffffff] opacity-0 group-hover:opacity-[0.08] blur-[60px] rounded-full transition-opacity duration-500" />

              {tier.highlight && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#ffffff]/20 text-[#ffffff] text-[10px] font-medium uppercase tracking-wider">
                  Best Value
                </div>
              )}

              <div className="relative z-10">
                <div className="mb-6">
                  <tier.icon
                    className={`w-8 h-8 text-white/40 group-hover:text-[#ffffff] transition-colors duration-300 ease-in `}
                  />
                </div>

                <h3 className="text-lg text-white/60 mb-2">{tier.name}</h3>
                <div className={`text-5xl font-bold mb-4 text-white/40 `}>
                  {tier.reward}
                </div>
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
    <section
      ref={ref}
      className="relative py-12 md:py-32 bg-black overflow-hidden"
    >
      {/* Background text */}
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[12vw] font-bold text-white/[0.015] select-none pointer-events-none"
        style={{
          x: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]),
        }}
      >
        EARN REWARDS • EARN REWARDS • EARN REWARDS •
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#ffffff] mb-4 block">
            Process
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            How It
            <br />
            <span className="text-white/20">Works.</span>
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
              className="group relative "
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
              )}

              <div
                className="relative p-8 rounded-3xl h-full transition-all duration-300 group-hover:bg-white/[0.02] border group-hover:border-[#ffffff]/20  "
                style={{
                  background: "rgba(255, 255, 255, 0.01)",
                }}
              >
                {/* Number */}
                <span className="absolute top-4 right-4 text-6xl font-bold text-white/[0.03] select-none">
                  {step.num}
                </span>

                <div className="w-14 h-14 rounded-2xl border border-white/20 flex items-center justify-center mb-6 ">
                  <step.icon className="w-6 h-6 group-hover:text-[#ffffff] text-white/20" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
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
   SECTION 4: FEATURES
   ============================================ */

const FeaturesSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 1], [100, -100]),
    smoothConfig,
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, -50]),
    smoothConfig,
  );

  const features = [
    {
      title: "Instant Cashback",
      desc: "Rewards credited immediately after each successful transaction. No waiting periods.",
      icon: Zap,
    },
    {
      title: "No Minimum",
      desc: "Start earning from your very first transfer. No barriers to entry.",
      icon: CheckCircle2,
    },
    {
      title: "Compounding",
      desc: "Stake your BLIP rewards to earn additional yield on your earnings.",
      icon: Coins,
    },
    {
      title: "Referral Bonus",
      desc: "Earn extra rewards when you invite friends to join Blip.",
      icon: Users,
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-12 md:py-32 bg-black overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-10 flex justify-center"
        >
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-center uppercase tracking-[0.3em] text-[#ffffff] mb-4 block">
              Features
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-center text-white tracking-tight mb-4">
              Maximum
              <br />
              <span className="text-white/20 text-center">Value.</span>
            </h2>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Stats card */}
          <motion.div style={{ y: y1 }} className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] p-8 md:p-12">
              {/* Inner glow */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#ffffff]/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#ffffff] mb-6 block">
                  Total Rewards Pool
                </span>
                <div className="flex items-baseline gap-3 mb-8">
                  <span className="text-5xl md:text-6xl font-bold text-white">
                    20M
                  </span>
                  <span className="text-2xl text-white/40">BLIP</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "0%", label: "Min Spend" },
                    { value: "∞", label: "Rewards Cap" },
                    { value: "~2s", label: "Credit Time" },
                    { value: "100%", label: "First Bonus" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Features list */}
          <motion.div style={{ y: y2 }}>
            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group p-5 rounded-2xl transition-all duration-300  border border-white/[0.05] hover:border-[#ffffff]/20  "
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 group-hover:text-[#ffffff]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/50">{feature.desc}</p>
                    </div>
                  </div>
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

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [0.9, 1]),
    smoothConfig,
  );
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative md:min-h-screen flex items-center justify-center py-12 md:py-32 bg-black overflow-hidden"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ scale, opacity }}
      >
        <div className="w-[600px] h-[600px] rounded-full bg-[#ffffff]/10 blur-[150px]" />
      </motion.div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8">
            Start
            <br />
            <span className="text-white/20">Earning.</span>
          </h2>

          <p className="text-xl text-white/50 max-w-xl mx-auto mb-12">
            Join the rewards program and get cashback on every transaction. No
            minimum spend required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Link
              to="/waitlist"
              className="group inline-flex items-center justify-center gap-4 px-10 md:py-5 py-3 rounded-full bg-[#ffffff] text-black text-lg font-semibold hover:bg-[#e5e5e5] hover:shadow-[0_0_60px_rgba(255,107,53,0.4)] transition-all duration-300"
            >
              Join Waitlist
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link> */}
            <CTAButton
              to="/join-waitlist"
              className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-full"
            >
              Join Waitlist
            </CTAButton>

            <Link
              to="/how-it-works"
              className="w- sm:w-fit mx-auto md:mx-0 items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-full border  text-white  text-[16px] font-medium hover:bg-white/5 hover:border-white/20 transition-all duration-300"
            >
              Learn More
            </Link>
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
        title="Blip Money Rewards | Earn Cashback on Every Transaction"
        description="Earn up to 10% cashback in BLIP tokens on every payment. Tiered rewards, instant credits, and first-transfer bonuses. Join the Blip rewards program today."
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
