import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  Wallet,
  Check,
  ChevronRight,
  ChevronDown,
  Lock,
  Send,
  Signal,
  Wifi,
  Battery,
  Building2,
  Shield,
  Zap,
  Globe,
  Clock,
  User,
  Banknote,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";

/* ============================================
   2025/2026 DESIGN TRENDS INDEX PAGE
   - Full-page feature reveals
   - Subtle, clean aesthetic
   - Animated phone mockup
   - All original content preserved
   ============================================ */

/* ============================================
   SECTION 1: HERO
   ============================================ */

/* Interactive Grid Component */
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

  // Generate grid points
  const gridSize = 60;
  const cols = Math.ceil(1920 / gridSize);
  const rows = Math.ceil(1080 / gridSize);

  return (
    <div
      ref={gridRef}
      className="absolute inset-0 overflow-hidden"
      style={{ pointerEvents: "auto" }}
    >
      {/* Mouse-following glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 107, 53, 0.08) 0%, transparent 70%)",
          x: mousePos.x - 200,
          y: mousePos.y - 200,
        }}
        animate={{
          opacity: isHovering ? 1 : 0,
          scale: isHovering ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Grid dots */}
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
                fill={isActive ? "#ff6b35" : "rgba(255, 255, 255, 0.15)"}
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
   LARGE PHONE COMPONENT
   Full-size phone mockup for immersive experience
   ============================================ */
const LargePhone = ({
  children,
  className = "",
  glowColor = "orange",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: "orange" | "green";
}) => {
  const glowStyles = {
    orange:
      "shadow-[0_0_100px_rgba(255,107,53,0.3),0_0_200px_rgba(255,107,53,0.1)]",
    green:
      "shadow-[0_0_100px_rgba(255,107,53,0.3),0_0_200px_rgba(255,107,53,0.1)]",
  };
  return (
    <div
      className={`relative ${className}`}
      style={{ width: 280, height: 580 }}
    >
      {/* Phone glow effect */}
      <div
        className={`absolute inset-0 rounded-[44px] ${glowStyles[glowColor]} blur-sm`}
      />
      {/* Phone frame */}
      <div className="absolute inset-0 rounded-[44px] bg-[#1a1a1a] border border-white/20 overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20" />
        {/* Screen content */}
        <div className="absolute inset-[3px] rounded-[40px] bg-[#0a0a0a] overflow-hidden">
          {children}
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-20" />
      </div>
    </div>
  );
};

/* ============================================
   BLIPSCAN CARD COMPONENT
   Transaction view styled like blipscan explorer
   ============================================ */
const BlipscanCard = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <div className="rounded-2xl bg-[#111113] border border-white/10 overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-sm font-semibold text-white">blipscan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/40 uppercase">
              LIVE
            </span>
            <div className="px-2 py-0.5 rounded bg-[#ff6b35]/10 border border-[#ff6b35]/20">
              <span className="text-[10px] font-semibold text-[#ff6b35]">
                RELEASED
              </span>
            </div>
          </div>
        </div>
        <div className="px-5 py-5 border-b border-white/5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
            Amount
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">$500.00</span>
            <span className="text-sm text-white/40">USDT</span>
          </div>
          <p className="text-[10px] text-white/30 mt-1">Fee: 0.10%</p>
        </div>
        <div className="px-5 py-4 space-y-3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase">From</span>
            <span className="text-xs font-mono text-white/70">7xKp...3fG2</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase">To</span>
            <span className="text-xs font-mono text-white/70">
              Ahmed M. (Dubai)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase">Escrow</span>
            <span className="text-xs font-mono text-orange-500">
              Blp4...kX9n
            </span>
          </div>
        </div>
        <div className="px-5 py-4">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
            Timeline
          </p>
          <div className="space-y-2">
            {[
              {
                status: "Created",
                time: "2s ago",
                icon: "○",
                color: "text-blue-400",
              },
              {
                status: "Locked",
                time: "1s ago",
                icon: "●",
                color: "text-yellow-400",
              },
              {
                status: "Released",
                time: "now",
                icon: "✓",
                color: "text-[#ff6b35]",
              },
            ].map((event) => (
              <div key={event.status} className="flex items-center gap-3">
                <span className={`text-xs ${event.color}`}>{event.icon}</span>
                <span className="text-xs text-white/70 flex-1">
                  {event.status}
                </span>
                <span className="text-[10px] font-mono text-white/30">
                  {event.time}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 py-3 bg-white/[0.02] flex items-center justify-between">
          <span className="text-[10px] text-white/30 font-mono">
            Slot #294,721,443
          </span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
            <span className="text-[10px] text-[#ff6b35]">Finalized</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll progress - very low stiffness for ultra-smooth one-page-per-scroll feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 25,
    damping: 50,
    mass: 1.2,
  });

  // Responsive parallax values - reduced for smaller screens to prevent content overlap
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Multi-layer parallax transforms - scaled based on screen size
  const parallaxMultiplier = isMobile ? 0.3 : isTablet ? 0.5 : 0.7;
  const bgLayer1Y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -200 * parallaxMultiplier],
  );
  const bgLayer2Y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -400 * parallaxMultiplier],
  );
  const bgLayer3Y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100 * parallaxMultiplier],
  );
  const bgRotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 15 * parallaxMultiplier],
  );
  const bgScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1 + 0.1 * parallaxMultiplier, 1 + 0.2 * parallaxMultiplier],
  );

  // Smooth spring for parallax layers - very high damping for silky smooth movement
  const layer1YSpring = useSpring(bgLayer1Y, {
    stiffness: 20,
    damping: 60,
    mass: 1.5,
  });
  const layer2YSpring = useSpring(bgLayer2Y, {
    stiffness: 15,
    damping: 65,
    mass: 1.5,
  });
  const layer3YSpring = useSpring(bgLayer3Y, {
    stiffness: 25,
    damping: 55,
    mass: 1.5,
  });

  // Phase transitions for 4 steps + final CTA - expanded for smoother one-page-per-scroll feel
  // Step 1: Claim (0 - 0.17) - First section
  const step1Opacity = useTransform(
    smoothProgress,
    [0, 0.02, 0.14, 0.17],
    [1, 1, 1, 0],
  );
  const step1Scale = useTransform(
    smoothProgress,
    [0, 0.14, 0.17],
    [1, 1, 0.95],
  );

  // Step 2: Escrow (0.15 - 0.35) - Second section
  const step2Opacity = useTransform(
    smoothProgress,
    [0.15, 0.18, 0.32, 0.35],
    [0, 1, 1, 0],
  );
  const step2Scale = useTransform(
    smoothProgress,
    [0.15, 0.18, 0.32, 0.35],
    [0.95, 1, 1, 0.95],
  );

  // Step 3: Match (0.33 - 0.53) - Third section
  const step3Opacity = useTransform(
    smoothProgress,
    [0.33, 0.36, 0.5, 0.53],
    [0, 1, 1, 0],
  );
  const step3Scale = useTransform(
    smoothProgress,
    [0.33, 0.36, 0.5, 0.53],
    [0.95, 1, 1, 0.95],
  );

  // Step 4: Verify (0.51 - 0.71) - Fourth section
  const step4Opacity = useTransform(
    smoothProgress,
    [0.51, 0.54, 0.68, 0.71],
    [0, 1, 1, 0],
  );
  const step4Scale = useTransform(
    smoothProgress,
    [0.51, 0.54, 0.68, 0.71],
    [0.95, 1, 1, 0.95],
  );

  // Final CTA (0.69 - 1.0) - Fifth section
  const finalOpacity = useTransform(smoothProgress, [0.69, 0.75], [0, 1]);
  const finalY = useTransform(smoothProgress, [0.69, 0.75], [60, 0]);

  // Progress bar transforms for 4 steps - adjusted for new timing
  const progressBar0 = useTransform(smoothProgress, [0, 0.17], ["0%", "100%"]);
  const progressBar1 = useTransform(
    smoothProgress,
    [0.17, 0.35],
    ["0%", "100%"],
  );
  const progressBar2 = useTransform(
    smoothProgress,
    [0.35, 0.53],
    ["0%", "100%"],
  );
  const progressBar3 = useTransform(
    smoothProgress,
    [0.53, 0.71],
    ["0%", "100%"],
  );
  const progressBars = [progressBar0, progressBar1, progressBar2, progressBar3];

  // Merchant orders for step 3
  const merchantOrders = [
    {
      id: "ORD-7821",
      user: "🦁",
      name: "lionking_fx",
      amount: "500 USDT",
      rate: "₦1,620",
      country: "🇳🇬",
      time: "Just now",
    },
    {
      id: "ORD-7820",
      user: "🐯",
      name: "tiger_trades",
      amount: "1,200 USDT",
      rate: "₦1,618",
      country: "🇳🇬",
      time: "2m ago",
    },
    {
      id: "ORD-7819",
      user: "🦊",
      name: "fox_crypto",
      amount: "800 USDT",
      rate: "₦1,615",
      country: "🇳🇬",
      time: "5m ago",
    },
  ];

  // Blipscan transactions for step 4
  const blipscanTxs = [
    {
      id: "BLP-7x2K...9fN3",
      from: "0x8a9...3f2",
      to: "Ahmed M.",
      amount: "$500.00",
      status: "verified",
      time: "2s",
      hash: "4mK8...pQ2x",
    },
    {
      id: "BLP-4mR8...2hL5",
      from: "0x3b7...9k1",
      to: "Sarah K.",
      amount: "$1,200.00",
      status: "verified",
      time: "1.4s",
      hash: "9nL3...rT7y",
    },
    {
      id: "BLP-9pT4...6wM2",
      from: "0x7c4...2m8",
      to: "James O.",
      amount: "$750.00",
      status: "verified",
      time: "1.8s",
      hash: "2hF6...kM9z",
    },
  ];

  // Enhanced mouse parallax with hover detection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative bg-black">
      {/* ==================== IMMERSIVE MULTI-LAYER PARALLAX BACKGROUND (FIXED) ==================== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 overflow-hidden">
          {/* Layer 1: Deep background gradient - slowest parallax */}
          <motion.div className="absolute inset-0" style={{ y: layer1YSpring }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black" />
            {/* Large ambient orb */}
            <motion.div
              className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 60%)",
                scale: bgScale,
                rotate: bgRotate,
              }}
            />
          </motion.div>

          {/* Layer 2: Mid-depth floating orbs - medium parallax */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ y: layer2YSpring }}
          >
            {/* Floating orb 1 */}
            <motion.div
              className="absolute top-[10%] right-[15%] w-[400px] h-[400px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)",
                x: mousePosition.x * -30,
                y: mousePosition.y * -20,
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Floating orb 2 */}
            <motion.div
              className="absolute bottom-[20%] left-[10%] w-[250px] h-[300px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
                x: mousePosition.x * 20,
                y: mousePosition.y * 15,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            {/* Floating orb 3 - orange accent */}
            <motion.div
              className="absolute top-[50%] left-[60%] w-[250px] h-[250px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 60%)",
                x: mousePosition.x * -15,
                y: mousePosition.y * -25,
              }}
              animate={{
                scale: [1.1, 1, 1.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.div>

          {/* Layer 3: Foreground elements - fastest parallax */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ y: layer3YSpring }}
          >
            {/* Mouse-following gradient spotlight */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${50 + mousePosition.x * 25}% ${50 + mousePosition.y * 25}%, rgba(255,107,53,0.08) 0%, transparent 40%)`,
              }}
              animate={{ opacity: isHovering ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            />
            {/* Secondary mouse-following glow */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${50 - mousePosition.x * 20}% ${60 + mousePosition.y * 15}%, rgba(255,255,255,0.02) 0%, transparent 45%)`,
              }}
            />
          </motion.div>

          {/* Grid overlay with subtle animation */}
          <motion.div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,107,53,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,107,53,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              y: layer1YSpring,
            }}
          />

          {/* Noise texture overlay for depth */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* ==================== MINIMAL FLOATING PARTICLES ==================== */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Reduced particles - only 4 static glowing dots for subtle ambiance */}
          {[
            { left: "15%", top: "25%", color: "#ff6b35" },
            { left: "85%", top: "35%", color: "rgba(255,255,255,0.3)" },
            { left: "25%", top: "70%", color: "rgba(255,255,255,0.2)" },
            { left: "75%", top: "60%", color: "#ff6b35" },
          ].map((dot, i) => (
            <div
              key={`dot-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: dot.left,
                top: dot.top,
                background: dot.color,
                opacity: dot.color === "#ff6b35" ? 0.4 : 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* ==================== CONTENT SECTIONS ==================== */}
      <div className="relative z-10">
        {/* ==================== STEP 1: CLAIM - Full iPhone Mockup ==================== */}
        <motion.div
          className="relative min-h-screen flex items-center justify-center z-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 xl:gap-20 items-center pt-16 sm:pt-20 lg:pt-0">
            {/* Left: Text content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-3 sm:mb-5 tracking-tight"
              >
                Send money
                <br />
                <span className="text-[#ff6b35]">anywhere,</span>{" "}
                <span className="text-white/20">anytime.</span>
              </motion.h1>

              {/* Powered by crypto badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center justify-center sm:justify-start gap-2 mb-8"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="text-xs text-white/50">Powered by</span>
                  <span className="text-xs font-semibold text-white">
                    Solana
                  </span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-white/50 text-base sm:text-lg mb-8 leading-relaxed max-w-sm mx-auto lg:mx-0"
              >
                Fast, borderless transfers with crypto rails. Connect wallet,
                enter amount, and send globally in seconds.
              </motion.p>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center justify-center lg:justify-start gap-8 mb-8"
              >
                {[
                  { value: "~2s", label: "Settlement" },
                  { value: "0.1%", label: "Fees" },
                  { value: "150+", label: "Countries" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="text-xl md:text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Scroll indicator - static */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <span className="text-white/30 text-xs uppercase tracking-[0.2em]">
                  Scroll to explore
                </span>
                <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                </div>
              </div>
            </div>

            {/* Right: Full iPhone Mockup with Global Network */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex justify-center order-1 lg:order-2"
            >
              {/* Global Network Visualization Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <svg
                  className="absolute w-[800px] h-[800px] opacity-60"
                  viewBox="0 0 800 800"
                >
                  <defs>
                    <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient
                      id="lineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#ff6b35" stopOpacity="0" />
                      <stop
                        offset="50%"
                        stopColor="#ff6b35"
                        stopOpacity="0.6"
                      />
                      <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Network nodes - representing global locations (static) */}
                  {[
                    { x: 400, y: 400, size: 8 }, // Center (you)
                    { x: 200, y: 250, size: 5 }, // North America
                    { x: 550, y: 200, size: 5 }, // Europe
                    { x: 650, y: 350, size: 4 }, // Middle East
                    { x: 580, y: 500, size: 4 }, // South Asia
                    { x: 150, y: 450, size: 4 }, // South America
                    { x: 680, y: 250, size: 3 }, // East Europe
                    { x: 280, y: 350, size: 3 }, // West Africa
                    { x: 500, y: 600, size: 3 }, // Southeast Asia
                    { x: 120, y: 300, size: 3 }, // Canada
                  ].map((node, i) => (
                    <g key={i}>
                      {/* Glow effect - static */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size * 2}
                        fill="url(#nodeGlow)"
                        opacity="0.3"
                      />
                      {/* Main node */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size}
                        fill={i === 0 ? "#ff6b35" : "rgba(255,255,255,0.6)"}
                      />
                    </g>
                  ))}

                  {/* Connection lines - static */}
                  {[
                    { x1: 400, y1: 400, x2: 200, y2: 250 },
                    { x1: 400, y1: 400, x2: 550, y2: 200 },
                    { x1: 400, y1: 400, x2: 650, y2: 350 },
                    { x1: 400, y1: 400, x2: 580, y2: 500 },
                    { x1: 400, y1: 400, x2: 150, y2: 450 },
                    { x1: 550, y1: 200, x2: 680, y2: 250 },
                    { x1: 200, y1: 250, x2: 280, y2: 350 },
                    { x1: 650, y1: 350, x2: 500, y2: 600 },
                  ].map((line, i) => (
                    <line
                      key={i}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Location labels - static */}
                  {[
                    { x: 200, y: 230, label: "USA" },
                    { x: 550, y: 180, label: "EU" },
                    { x: 665, y: 335, label: "UAE" },
                    { x: 580, y: 520, label: "India" },
                    { x: 150, y: 470, label: "LATAM" },
                  ].map((loc, i) => (
                    <text
                      key={`label-${i}`}
                      x={loc.x}
                      y={loc.y}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.3)"
                      fontSize="11"
                      fontWeight="500"
                    >
                      {loc.label}
                    </text>
                  ))}
                </svg>
              </div>

              {/* Ambient glow behind phone - static */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Primary glow - static */}
                <div
                  className="absolute w-[600px] h-[600px] rounded-full opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 50%)",
                  }}
                />
                {/* Secondary ring glow - static */}
                <div className="absolute w-[450px] h-[450px] rounded-full border border-[#ff6b35]/15" />
                {/* Inner bright core - static */}
                <div
                  className="absolute w-[300px] h-[300px] rounded-full opacity-60 "
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)",
                  }}
                />
              </div>

              {/* iPhone Frame with 3D Perspective Tilt */}
              <motion.div
                className="relative"
                style={{
                  x: mousePosition.x * -15,
                  y: mousePosition.y * -12,
                  rotateY: mousePosition.x * 8,
                  rotateX: mousePosition.y * -5,
                  transformPerspective: 1200,
                  transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                {/* Reflection/shine effect on tilt */}
                <motion.div
                  className="absolute inset-0 rounded-[52px] pointer-events-none z-10"
                  style={{
                    background: `linear-gradient(${135 + mousePosition.x * 30}deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)`,
                  }}
                />
                <div className=" mt-8 w-[200px] md:mt-0 sm:w-[250px] lg:w-[320px]  ">
                  {/* Phone outer frame with enhanced shadow */}
                  <div className="rounded-[36px] sm:rounded-[40px] md:rounded-[44px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[2px] sm:p-[2.5px] shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(255,107,53,0.08)] md:shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(255,107,53,0.1)]">
                    <div className="rounded-[34px] sm:rounded-[38px] md:rounded-[42px] bg-[#0a0a0a] p-[1px] sm:p-[8px] md:p-[10px]">
                      {/* Phone screen */}
                      <div className="rounded-[28px] sm:rounded-[30px] md:rounded-[34px] bg-black overflow-hidden relative">
                        {/* Dynamic Island */}
                        <div className=" hidden md:block absolute top-3 left-1/2 -translate-x-1/2 z-10">
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
                            <Battery className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        </div>

                        {/* App content */}
                        <div className="px-6 pb-3 sm:pb-10 pt-1 sm:pt-8 max-w-[360px] mx-auto">
                          {/* App header */}
                          <div className="flex items-center justify-between mb-2 sm:mb-8">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-xl bg-[#ff6b35] flex items-center justify-center">
                                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                              </div>
                              <span className="text-sm sm:text-lg font-bold text-white">
                                Blip
                              </span>
                            </div>
                            <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                            </div>
                          </div>

                          {/* Send label */}
                          <div className="text-center mb-3 sm:mb-4">
                            <span className="text-[9px] sm:text-sm text-white/40 uppercase tracking-wider">
                              You send
                            </span>
                          </div>

                          {/* Amount input */}
                          <div className="text-center mb-3 sm:mb-8">
                            <div className="flex items-center justify-center gap-2 sm:gap-3">
                              <span className="text-sm sm:text-[clamp(2rem,6vw,3.75rem)] font-bold text-white leading-none">
                                500
                              </span>

                              <div className="flex items-center gap-2 px-3 py-1 sm:py-2 rounded-xl bg-white/5">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#2775CA] flex items-center justify-center">
                                  <span className="text-white text-sm sm:text-xs font-bold">
                                    $
                                  </span>
                                </div>
                                <span className="text-sm sm:text-base md:text-lg text-white font-medium">
                                  USDT
                                </span>
                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                              </div>
                            </div>
                          </div>

                          {/* Divider with swap */}
                          <div className="flex items-center justify-center my-2 sm:my-6">
                            <div className="flex-1 h-px bg-white/10" />
                            <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-3 sm:mx-4">
                              <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                            </div>
                            <div className="flex-1 h-px bg-white/10" />
                          </div>

                          {/* Receive preview */}
                          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 sm:p-5 mb-3 sm:mb-8">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs sm:text-sm text-white/40">
                                They receive
                              </span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-sm md:text-2xl font-bold text-white">
                                  1,835
                                </span>
                                <span className="text-sm sm:text-base md:text-lg text-white/50">
                                  AED
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                              <span className="text-[10px] sm:text-xs text-white/30">
                                Rate
                              </span>
                              <span className="text-[10px] sm:text-xs text-white/50">
                                1 USDT = 3.67 AED
                              </span>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <motion.button
                            className="w-full py-1 sm:py-5 rounded-2xl bg-[#ff6b35] text-black text-sm sm:text-base font-bold"
                            animate={{
                              boxShadow: [
                                "0 0 30px rgba(255,107,53,0.3)",
                                "0 0 60px rgba(255,107,53,0.5)",
                                "0 0 30px rgba(255,107,53,0.3)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Continue
                          </motion.button>
                        </div>

                        {/* Home indicator */}
                        <div className="flex justify-center pb-2">
                          <div className="w-32 h-1 bg-white/30 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* ==================== STEP 2: ESCROW - Full iPhone Mockup ==================== */}
        <motion.div
          className="relative min-h-screen flex items-center justify-center z-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 xl:gap-20 items-center pt-16 sm:pt-20 lg:pt-0">
            {/* Left: Full iPhone Mockup */}
            <motion.div className="relative flex justify-center">
              {/* Ambient glow behind phone - subtle neutral with hint of orange */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Primary subtle glow */}
                <motion.div
                  className="absolute w-[450px] h-[450px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 50%)",
                    x: mousePosition.x * 10,
                    y: mousePosition.y * 8,
                  }}
                />
                {/* Secondary ring - very subtle */}
                <div className="absolute w-[350px] h-[350px] rounded-full border border-white/[0.04]" />
              </div>

              {/* iPhone Frame with 3D Perspective Tilt */}
              <motion.div
                className="relative"
                style={{
                  x: mousePosition.x * -12,
                  y: mousePosition.y * -10,
                  rotateY: mousePosition.x * 6,
                  rotateX: mousePosition.y * -4,
                  transformPerspective: 1200,
                  transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                {/* Reflection effect */}
                <motion.div
                  className="absolute inset-0 rounded-[28px] sm:rounded-[36px] md:rounded-[44px] lg:rounded-[52px] pointer-events-none z-10"
                  style={{
                    background: `linear-gradient(${135 + mousePosition.x * 25}deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)`,
                  }}
                />
                <div className="w-[200px] sm:w-[250px] md:w-[290px] lg:w-[320px]">
                  {/* Phone outer frame - subtle neutral shadow */}
                  <div className="rounded-[28px] sm:rounded-[36px] md:rounded-[40px] lg:rounded-[44px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[1.5px] sm:p-[2px] md:p-[2.5px] shadow-[0_20px_40px_rgba(0,0,0,0.5)] sm:shadow-[0_25px_50px_rgba(0,0,0,0.5)] md:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                    <div className="rounded-[26px] sm:rounded-[34px] md:rounded-[38px] lg:rounded-[42px] bg-[#0a0a0a] p-[6px] sm:p-[8px] md:p-[10px] lg:p-[12px]">
                      {/* Phone screen */}
                      <div className="rounded-[22px] sm:rounded-[28px] md:rounded-[30px] lg:rounded-[34px] bg-black overflow-hidden relative">
                        {/* Dynamic Island */}
                        <div className="hidden sm:block absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-10">
                          <div className="w-24 h-6 sm:w-28 sm:h-7 rounded-full bg-black flex items-center justify-center">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#1a1a1a] mr-1.5 sm:mr-2" />
                          </div>
                        </div>

                        {/* Status bar */}
                        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-3 sm:pt-3.5 md:pt-4 pb-1.5 sm:pb-2">
                          <span className="text-[9px] sm:text-[11px] md:text-[13px] text-white font-semibold">
                            9:41
                          </span>
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <Signal className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                            <Wifi className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                            <Battery className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                          </div>
                        </div>

                        {/* App content */}
                        <div className="px-3 sm:px-4 md:px-5 lg:px-6 pb-6 sm:pb-8 md:pb-10 pt-4 sm:pt-6 md:pt-8">
                          {/* App header */}
                          <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                            <button className="flex items-center gap-1.5 sm:gap-2 text-white/50">
                              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="text-xs sm:text-sm">Back</span>
                            </button>
                            <span className="text-xs sm:text-sm font-medium text-white">
                              Transaction
                            </span>
                          </div>

                          {/* Lock animation */}
                          <div className="flex justify-center mb-2 sm:mb-5 md:mb-6">
                            <motion.div
                              className="w-10 h-10 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center"
                              animate={{ scale: [1, 1.02, 1] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              <Lock className="w-7 h-7 sm:w-7.5 sm:h-7.5 md:w-8 md:h-8 text-white/60" />
                            </motion.div>
                          </div>

                          <div className="text-center mb-4 sm:mb-5 md:mb-6">
                            <span className="text-xs sm:text-sm text-white/50 block mb-1.5 sm:mb-2">
                              Funds Secured
                            </span>
                            <div className="text-sm sm:text-2xl md:text-3xl font-bold text-white">
                              500 USDT
                            </div>
                            <span className="text-[10px] sm:text-xs text-white/40">
                              ≈ $500.00
                            </span>
                          </div>

                          {/* Status card */}
                          <div className="rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 sm:p-3.5 md:p-4 mb-3 sm:mb-4 md:mb-5">
                            <div className="flex items-center justify-between mb-2 sm:mb-2.5 md:mb-3">
                              <span className="text-[10px] sm:text-xs text-white/40">
                                Status
                              </span>
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <motion.div
                                  className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
                                  animate={{ opacity: [1, 0.5, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-[10px] sm:text-xs text-[#ff6b35] font-medium">
                                  In Escrow
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                              <span className="text-xs sm:text-sm text-white/40">
                                Contract
                              </span>
                              <span className="text-xs sm:text-sm text-white/60 font-mono">
                                0x7a2...f91
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm text-white/40">
                                Network
                              </span>
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                                <span className="text-xs sm:text-sm text-white/60">
                                  Solana
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                            <div className="flex-1 h-0.5 sm:h-1 rounded-full bg-[#ff6b35]" />
                            <div className="flex-1 h-0.5 sm:h-1 rounded-full bg-[#ff6b35]/30" />
                            <div className="flex-1 h-0.5 sm:h-1 rounded-full bg-white/10" />
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/40"
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] sm:text-xs text-white/30 mt-1.5 sm:mt-2 block">
                              Finding best merchant...
                            </span>
                          </div>
                        </div>

                        {/* Home indicator */}
                        <div className="flex justify-center pb-1.5 sm:pb-2">
                          <div className="w-24 sm:w-28 md:w-32 h-0.5 sm:h-1 bg-white/30 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Text content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10 rounded-lg border border-white/[0.08] flex items-center justify-center group hover:border-white/20 transition-colors">
                  <Lock
                    className="w-4 h-4 text-white/40 group-hover:text-[#ff6b35] transition-colors"
                    strokeWidth={1.5}
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] font-medium text-white/50">
                      2
                    </span>
                  </div>
                </div>
                <span className="text-lg font-semibold text-white">Escrow</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight">
                Locked &
                <br />
                <span className="text-white/20">secured.</span>
              </h2>

              <p className="text-white/50 text-base sm:text-lg mb-8 leading-relaxed max-w-sm mx-auto lg:mx-0">
                Funds locked in smart contract. Protected by DAO escrow. Your
                crypto stays safe until the transaction completes.
              </p>

              {/* Features */}
              <div className="space-y-3 max-w-sm mx-auto lg:mx-0">
                {[
                  {
                    icon: Shield,
                    label: "Non-custodial",
                    desc: "You control your keys",
                  },
                  {
                    icon: Zap,
                    label: "Instant lock",
                    desc: "Sub-second confirmation",
                  },
                  {
                    icon: Globe,
                    label: "On-chain proof",
                    desc: "Fully transparent",
                  },
                ].map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white/40" />
                    </div>
                    <div>
                      <div className="text-white text-left text-sm font-medium">
                        {feature.label}
                      </div>
                      <div className="text-white/40 text-xs">
                        {feature.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ==================== STEP 3: MATCH - Advanced Merchant Dashboard ==================== */}
        <motion.div
          className="relative min-h-screen flex items-start justify-center z-20 pt-20 sm:pt-24 lg:pt-28"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-white/[0.08] flex items-center justify-center group hover:border-white/20 transition-colors">
                  <Zap
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-[#ff6b35]/60 transition-colors"
                    strokeWidth={1.5}
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] font-medium text-white/50">
                      3
                    </span>
                  </div>
                </div>
                <span className="text-lg sm:text-xl font-semibold text-white">
                  Match
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-4 tracking-tight">
                Instant <span className="text-white/20">bidding.</span>
              </h2>
              <p className="text-white/50 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto hidden sm:block">
                Merchants compete in real-time to fulfill your order. Best rate
                wins automatically.
              </p>
            </div>

            {/* Powered by badge - hidden on mobile */}
            <div className="hidden sm:flex justify-center mb-4 lg:mb-6">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.02] border border-white/[0.06]">
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] sm:text-xs text-white/50">
                  Powered by
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-white">
                  150+ Verified Merchants
                </span>
              </div>
            </div>

            {/* Full Browser Mockup with 3D Perspective - Shows ~60% with gradient fade */}
            <motion.div
              className="relative mx-auto max-w-5xl lg:max-w-6xl"
              style={{
                x: mousePosition.x * -12,
                y: mousePosition.y * -8,
                rotateY: mousePosition.x * 4,
                rotateX: mousePosition.y * -2,
                transformPerspective: 1500,
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              {/* Ambient glow - enhanced with parallax */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                <motion.div
                  className="absolute w-full h-full rounded-3xl bg-gradient-to-b from-[#ff6b35]/8 to-transparent "
                  style={{
                    x: mousePosition.x * 25,
                    y: mousePosition.y * 20,
                  }}
                />
                {/* Secondary glow ring */}
                <motion.div
                  className="absolute w-[90%] h-[90%] rounded-3xl border border-[#ff6b35]/5"
                  style={{
                    x: mousePosition.x * -10,
                    y: mousePosition.y * -8,
                  }}
                  animate={{
                    borderColor: [
                      "rgba(255,107,53,0.05)",
                      "rgba(255,107,53,0.15)",
                      "rgba(255,107,53,0.05)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>

              {/* Reflection/shine overlay */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                style={{
                  background: `linear-gradient(${130 + mousePosition.x * 20}deg, rgba(255,255,255,0.04) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)`,
                }}
              />

              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a0a] shadow-[0_30px_60px_rgba(0,0,0,0.4)] sm:shadow-[0_50px_100px_rgba(0,0,0,0.5),0_0_80px_rgba(255,107,53,0.08)] max-h-[55vh] sm:max-h-[60vh] lg:max-h-[65vh] relative">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-4 bg-[#111] border-b border-white/[0.06]">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28ca42]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white/40" />
                      </div>
                      <span className="text-[10px] sm:text-sm text-white/40 font-mono truncate">
                        settle.blipprotocol.com/merchant
                      </span>
                      <div className="hidden sm:flex items-center gap-1.5 ml-auto shrink-0">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-emerald-500"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-[10px] text-emerald-400 font-medium">
                          LIVE
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white">
                      M
                    </div>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                    {/* Left Panel - Order Details */}
                    <div className="lg:col-span-5">
                      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs uppercase tracking-wider text-white/40">
                            Active Order
                          </span>
                          <div className="flex items-center gap-2">
                            <motion.div
                              className="px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20"
                              animate={{ opacity: [1, 0.7, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <span className="text-[10px] text-amber-400 font-medium">
                                BIDDING OPEN
                              </span>
                            </motion.div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-orange-500/10 flex items-center justify-center">
                            <span className="text-2xl">🇺🇸</span>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-white">
                              500 USDT
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/40">
                              <ArrowRight className="w-3 h-3" />
                              <span>AED (United Arab Emirates)</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                            <span className="text-sm text-white/40">
                              Order ID
                            </span>
                            <span className="text-sm text-white font-mono">
                              #BLP-8472
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                            <span className="text-sm text-white/40">
                              Escrow Status
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="text-sm text-emerald-400">
                                Locked
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-white/40">
                              Time Remaining
                            </span>
                            <motion.span
                              className="text-sm text-[#ff6b35] font-mono font-medium"
                              animate={{ opacity: [1, 0.6, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              00:12
                            </motion.span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="relative h-2 rounded-full bg-white/[0.05] overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ff6b35] to-orange-400 rounded-full"
                            initial={{ width: "20%" }}
                            animate={{ width: "65%" }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-white/30">
                            Collecting bids...
                          </span>
                          <span className="text-[10px] text-white/30">
                            4 merchants bidding
                          </span>
                        </div>
                      </div>

                      {/* Quick stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-center">
                          <div className="text-2xl font-bold text-white">
                            ~8s
                          </div>
                          <div className="text-[10px] text-white/40 uppercase tracking-wider">
                            Avg Match
                          </div>
                        </div>
                        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-center">
                          <div className="text-2xl font-bold text-emerald-400">
                            99.9%
                          </div>
                          <div className="text-[10px] text-white/40 uppercase tracking-wider">
                            Fill Rate
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel - Live Merchant Bids */}
                    <div className="lg:col-span-7">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            Live Merchant Bids
                          </h3>
                          <span className="text-xs text-white/40">
                            Real-time competitive pricing
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Bid cards */}
                      <div className="space-y-3">
                        {[
                          {
                            name: "QuickSwap Pro",
                            rate: "3.672",
                            profit: "+$1.85",
                            trades: "2,847",
                            time: "~30s",
                            best: true,
                            avatar: "🏆",
                          },
                          {
                            name: "FastSettle UAE",
                            rate: "3.668",
                            profit: "+$1.65",
                            trades: "1,923",
                            time: "~45s",
                            best: false,
                            avatar: "⚡",
                          },
                          {
                            name: "DubaiExchange",
                            rate: "3.665",
                            profit: "+$1.50",
                            trades: "3,102",
                            time: "~60s",
                            best: false,
                            avatar: "🌴",
                          },
                          {
                            name: "GulfTrade",
                            rate: "3.660",
                            profit: "+$1.25",
                            trades: "892",
                            time: "~90s",
                            best: false,
                            avatar: "🌊",
                          },
                        ].map((bid, i) => (
                          <motion.div
                            key={bid.name}
                            className={`p-4 rounded-xl border transition-all ${
                              bid.best
                                ? "bg-[#ff6b35]/5 border-[#ff6b35]/30"
                                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                            }`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                                    bid.best
                                      ? "bg-[#ff6b35]/20"
                                      : "bg-white/[0.05]"
                                  }`}
                                >
                                  {bid.avatar}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-white">
                                      {bid.name}
                                    </span>
                                    {bid.best && (
                                      <span className="px-2 py-0.5 rounded-full bg-[#ff6b35]/20 text-[9px] text-[#ff6b35] font-bold uppercase">
                                        Best Rate
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-white/40">
                                    <span>{bid.trades} trades</span>
                                    <span>•</span>
                                    <span>ETA {bid.time}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="text-lg font-bold text-white">
                                    {bid.rate}{" "}
                                    <span className="text-xs text-white/40">
                                      AED
                                    </span>
                                  </div>
                                  <div className="text-xs text-emerald-400">
                                    {bid.profit} profit
                                  </div>
                                </div>
                                <motion.div
                                  className={`w-3 h-3 rounded-full ${bid.best ? "bg-[#ff6b35]" : "bg-white/20"}`}
                                  animate={
                                    bid.best ? { scale: [1, 1.2, 1] } : {}
                                  }
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Auto-select notice */}
                      <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <span className="text-sm text-emerald-400 font-medium">
                              Auto-selecting best offer
                            </span>
                            <span className="text-xs text-white/40 block">
                              You'll receive 1,836 AED in ~30 seconds
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Gradient fade at bottom to show it continues */}
                <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ==================== STEP 4: VERIFY - Full Browser Mockup ==================== */}
        <motion.div
          className="relative min-h-screen flex items-start justify-center z-20 pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
              <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg border border-white/[0.08] flex items-center justify-center group hover:border-white/20 transition-colors">
                  <Check
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white/40 group-hover:text-[#ff6b35] transition-colors"
                    strokeWidth={1.5}
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                    <span className="text-[9px] sm:text-[10px] font-medium text-white/50">
                      4
                    </span>
                  </div>
                </div>
                <span className="text-base sm:text-lg md:text-xl font-semibold text-white">
                  Verify
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 tracking-tight px-4">
                Settlement <span className="text-white/20">verified.</span>
              </h2>
              <p className="text-white/50 text-xs sm:text-sm md:text-base lg:text-lg max-w-xl mx-auto hidden sm:block px-4">
                Every transaction on-chain. Transparent and immutable. Track in
                real-time.
              </p>
            </div>

            {/* Full Browser Mockup - Blipscan with 3D Perspective - Shows ~60% */}
            <motion.div
              className="relative mx-auto max-w-3xl md:max-w-4xl lg:max-w-5xl"
              style={{
                x: mousePosition.x * -10,
                y: mousePosition.y * -7,
                rotateY: mousePosition.x * 3,
                rotateX: mousePosition.y * -2,
                transformPerspective: 1400,
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              {/* Ambient glow - enhanced */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                <motion.div
                  className="absolute w-full h-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-emerald-500/8 to-transparent blur-2xl sm:blur-3xl"
                  style={{
                    x: mousePosition.x * 20,
                    y: mousePosition.y * 15,
                  }}
                />
                {/* Secondary glow ring */}
                <motion.div
                  className="absolute w-[85%] h-[85%] rounded-2xl sm:rounded-3xl border border-emerald-500/5"
                  style={{
                    x: mousePosition.x * -8,
                    y: mousePosition.y * -6,
                  }}
                  animate={{
                    borderColor: [
                      "rgba(16,185,129,0.05)",
                      "rgba(16,185,129,0.12)",
                      "rgba(16,185,129,0.05)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>

              {/* Reflection overlay */}
              <motion.div
                className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none z-10"
                style={{
                  background: `linear-gradient(${130 + mousePosition.x * 15}deg, rgba(255,255,255,0.03) 0%, transparent 45%, rgba(0,0,0,0.08) 100%)`,
                }}
              />

              <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a0a] shadow-[0_20px_40px_rgba(0,0,0,0.3)] sm:shadow-[0_30px_60px_rgba(0,0,0,0.4)] md:shadow-[0_50px_100px_rgba(0,0,0,0.5),0_0_60px_rgba(16,185,129,0.06)] max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] lg:max-h-[65vh] relative">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-4 bg-[#111] border-b border-white/[0.06]">
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-[#28ca42]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg bg-white/[0.03] border border-white/[0.06] w-full max-w-[150px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px]">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Lock className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 text-white/40" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] md:text-sm text-white/40 font-mono truncate">
                        blipscan.io/explorer
                      </span>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ff6b35] ml-auto shrink-0" />
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5" />
                  </div>
                </div>

                {/* Blipscan content */}
                <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-[#ff6b35] flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-0.5 sm:mb-1">
                          Blipscan Explorer
                        </h3>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-emerald-500/10">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[7px] sm:text-[8px] md:text-[10px] text-emerald-400 uppercase font-medium">
                              Mainnet
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-xs md:text-sm text-white/30">
                            Solana
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                      {[
                        { label: "Total Volume", value: "$2.4M" },
                        { label: "Settlements", value: "12,847" },
                        { label: "Success Rate", value: "99.8%" },
                      ].map((stat) => (
                        <div key={stat.label} className="text-right">
                          <div className="text-[10px] xl:text-xs text-white/40">
                            {stat.label}
                          </div>
                          <div className="text-sm xl:text-base 2xl:text-lg font-bold text-white">
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transaction table header */}
                  <div className="flex items-center justify-between px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-t-lg sm:rounded-t-xl bg-white/[0.02] border border-white/[0.06] border-b-0">
                    <span className="text-[9px] sm:text-[10px] md:text-xs text-white/40 uppercase tracking-wider">
                      Recent Verified Settlements
                    </span>
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                      <motion.div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-[9px] sm:text-[10px] md:text-xs text-emerald-400">
                        Live
                      </span>
                    </div>
                  </div>

                  {/* Transaction rows */}
                  <div className="border border-white/[0.06] rounded-b-lg sm:rounded-b-xl overflow-x-auto">
                    {blipscanTxs.map((tx, i) => (
                      <motion.div
                        key={tx.id}
                        className={`flex items-center justify-between gap-3 sm:gap-4 p-2.5 sm:p-3 md:p-4 lg:p-5 ${i !== blipscanTxs.length - 1 ? "border-b border-white/[0.04]" : ""} hover:bg-white/[0.02] transition-colors min-w-[500px] sm:min-w-0`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-emerald-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                              <span className="text-[11px] sm:text-xs md:text-sm font-mono text-white/60 truncate">
                                {tx.id}
                              </span>
                              <span className="text-[10px] sm:text-xs text-white/30 shrink-0">
                                →
                              </span>
                              <span className="text-[11px] sm:text-xs md:text-sm text-white font-medium truncate">
                                {tx.to}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <span className="text-[9px] sm:text-[10px] md:text-xs text-white/30 font-mono truncate">
                                {tx.from}
                              </span>
                              <span className="text-[9px] sm:text-[10px] md:text-xs text-white/20 shrink-0">
                                •
                              </span>
                              <span className="text-[9px] sm:text-[10px] md:text-xs text-white/30 font-mono truncate">
                                {tx.hash}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 shrink-0">
                          <div className="text-right">
                            <div className="text-sm sm:text-base font-semibold text-white">
                              {tx.amount}
                            </div>
                            <div className="text-[9px] sm:text-[10px] md:text-xs text-white/30">
                              USDT → AED
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-emerald-500/10">
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-emerald-400" />
                            <span className="text-[10px] sm:text-xs md:text-sm text-emerald-400 font-medium whitespace-nowrap">
                              {tx.time}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer - hidden as we clip the content */}
                  <div className="mt-4 sm:mt-5 md:mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ff6b35]" />
                      <span className="text-[10px] sm:text-xs md:text-sm text-white/30">
                        Powered by Blip Protocol
                      </span>
                    </div>
                    <button className="text-[10px] sm:text-xs md:text-sm text-[#ff6b35] hover:underline">
                      View all →
                    </button>
                  </div>
                </div>
                {/* Gradient fade at bottom to show it continues */}
                <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 lg:h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ==================== FINAL CTA - Enhanced Immersive ==================== */}
        <motion.div
          className="relative min-h-screen flex flex-col items-center justify-center z-30 px-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Immersive background effects for final CTA */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Central radial glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 50%)",
                x: mousePosition.x * 30,
                y: mousePosition.y * 25,
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Orbiting rings */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#ff6b35]/10"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-white/[0.03]"
              animate={{
                rotate: [0, -360],
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            {/* Floating celebration particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`celebration-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  left: `${30 + i * 4}%`,
                  top: `${40 + (i % 3) * 10}%`,
                  background: i % 2 === 0 ? "#ff6b35" : "rgba(255,255,255,0.5)",
                  boxShadow:
                    i % 2 === 0 ? "0 0 15px rgba(255,107,53,0.5)" : "none",
                }}
                animate={{
                  y: [-20, -50, -20],
                  x: [-10, 10, -10],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="relative text-center max-w-3xl">
            {/* Success icon with enhanced glow */}
            <motion.div
              className="relative w-28 h-28 rounded-3xl bg-[#ff6b35]/10 border border-[#ff6b35]/20 flex items-center justify-center mx-auto mb-10"
              animate={{
                borderColor: [
                  "rgba(255,107,53,0.2)",
                  "rgba(255,107,53,0.5)",
                  "rgba(255,107,53,0.2)",
                ],
                scale: [1, 1.03, 1],
                boxShadow: [
                  "0 0 40px rgba(255,107,53,0.1)",
                  "0 0 80px rgba(255,107,53,0.25)",
                  "0 0 40px rgba(255,107,53,0.1)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Inner glow */}
              <motion.div
                className="absolute inset-2 rounded-2xl bg-gradient-to-br from-[#ff6b35]/20 to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Sparkles className="relative w-12 h-12 text-[#ff6b35]" />
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-[1.05] tracking-tight px-4"
              style={{
                textShadow: "0 0 60px rgba(255,107,53,0.2)",
              }}
            >
              Four steps.
              <br />
              <span className="text-white/20">That's it.</span>
            </motion.h2>

            <p className="text-white/50 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-xl mx-auto px-4">
              The fastest, most transparent way to convert crypto to local
              currency. Ready to experience it?
            </p>

            {/* Stats with stagger animation */}
            <div className="flex justify-center gap-6 sm:gap-12 md:gap-20 mb-8 sm:mb-12">
              {[
                { value: "~2s", label: "Settlement" },
                { value: "0.1%", label: "Fees" },
                { value: "150+", label: "Countries" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <motion.div
                    className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2"
                    whileHover={{ scale: 1.05, color: "#ff6b35" }}
                    transition={{ duration: 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs sm:text-sm uppercase tracking-wider text-white/30">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTAs with enhanced hover effects */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/waitlist"
                  className="group flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-[#ff6b35] text-black rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-[0_0_40px_rgba(255,107,53,0.3)] hover:shadow-[0_0_80px_rgba(255,107,53,0.5)] transition-all"
                >
                  Join Waitlist
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/how-it-works"
                  className="flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 text-white/50 hover:text-white font-semibold text-sm sm:text-base transition-colors border border-white/[0.1] rounded-xl sm:rounded-2xl hover:border-white/20 hover:bg-white/[0.03]"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   BLIPSCAN EXPLORER SECTION - Linear.app style
   Interactive real-time transaction viewer
   ============================================ */
const BlipscanExplorerSection = () => {
  const [transactions, setTransactions] = useState([
    {
      id: "BLP-7x2K",
      from: "0x8a9...3f2",
      to: "Ahmed M.",
      amount: "$500",
      time: "2s",
      new: false,
    },
    {
      id: "BLP-4mR8",
      from: "0x3b7...9k1",
      to: "Sarah K.",
      amount: "$1,200",
      time: "5s",
      new: false,
    },
    {
      id: "BLP-9pT4",
      from: "0x7c4...2m8",
      to: "James O.",
      amount: "$750",
      time: "8s",
      new: false,
    },
  ]);

  // Add new transaction every 3 seconds
  useEffect(() => {
    const names = [
      "Alex T.",
      "Maria G.",
      "John D.",
      "Lisa W.",
      "Mike R.",
      "Emma S.",
    ];
    const addresses = [
      "0x1a2...4b5",
      "0x6c7...8d9",
      "0x2e3...7f4",
      "0x9a1...3c6",
    ];

    const interval = setInterval(() => {
      const newTx = {
        id: `BLP-${Math.random().toString(36).substr(2, 4)}`,
        from: addresses[Math.floor(Math.random() * addresses.length)],
        to: names[Math.floor(Math.random() * names.length)],
        amount: `$${(Math.random() * 2000 + 100).toFixed(0)}`,
        time: "Just now",
        new: true,
      };

      setTransactions((prev) => {
        const updated = [newTx, ...prev.slice(0, 4)].map((tx, i) => ({
          ...tx,
          new: i === 0,
        }));
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-black py-20 sm:py-32 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
            <span className="text-xs text-white/50 uppercase tracking-wider">
              Live on Solana
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            Every transaction, <span className="text-white/20">verified.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto"
          >
            Watch settlements happen in real-time on Blipscan Explorer
          </motion.p>
        </div>

        {/* Blipscan Window - Linear style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          {/* Ambient glow */}
          <div className="absolute -inset-4 bg-gradient-to-b from-[#ff6b35]/5 via-transparent to-transparent blur-3xl" />

          {/* Main container */}
          <div className="relative rounded-2xl border border-white/[0.06] bg-black/40 backdrop-blur-xl overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <Globe className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-xs text-white/40 font-mono">
                    blipscan.io/explorer
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs text-emerald-400 font-medium">
                  Live
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "24h Volume", value: "$2.4M" },
                  { label: "Settlements", value: "12,847" },
                  { label: "Avg Speed", value: "1.8s" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className="text-center p-3 rounded-lg bg-white/[0.01] border border-white/[0.04]"
                  >
                    <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Transaction table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-xs text-white/30 uppercase tracking-wider">
                    Recent Settlements
                  </span>
                </div>

                <AnimatePresence mode="popLayout">
                  {transactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      layout
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        backgroundColor: tx.new
                          ? "rgba(255, 107, 53, 0.05)"
                          : "rgba(255, 255, 255, 0.01)",
                      }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02] transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#ff6b35]/10 border border-[#ff6b35]/20 flex items-center justify-center flex-shrink-0">
                          <Check
                            className="w-4 h-4 text-[#ff6b35]"
                            strokeWidth={2}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-white/60 truncate">
                              {tx.id}
                            </span>
                            <span className="text-xs text-white/20">→</span>
                            <span className="text-sm text-white font-medium truncate">
                              {tx.to}
                            </span>
                          </div>
                          <div className="text-xs text-white/30 font-mono truncate">
                            {tx.from}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <div className="text-base font-semibold text-white">
                            {tx.amount}
                          </div>
                          <div className="text-xs text-white/30">USDT</div>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-xs text-emerald-400 font-medium whitespace-nowrap">
                            {tx.time}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
                  <span className="text-xs text-white/30">
                    Powered by Blip Protocol
                  </span>
                </div>
                <div className="text-xs text-[#ff6b35] hover:text-[#ff6b35]/80 transition-colors flex items-center gap-1 cursor-pointer">
                  View Explorer
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION 2: UAE ANNOUNCEMENT - Apple-style cinematic
   ============================================ */

const UAESection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.9, 1, 1, 0.9],
  );

  // Floating elements for depth - more dynamic
  const float1Y = useTransform(scrollYProgress, [0, 1], [100, -150]);
  const float2Y = useTransform(scrollYProgress, [0, 1], [50, -200]);
  const float3Y = useTransform(scrollYProgress, [0, 1], [150, -100]);
  const rotateOrb = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Immersive background with orange glow */}
      <div className="absolute inset-0">
        {/* Deep gradient atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#080404] to-black" />

        {/* Orange ambient glow - top */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, rgba(255,107,53,0.02) 40%, transparent 70%)",
            y: float1Y,
          }}
        />

        {/* Secondary orange glow - floating */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 60%)",
            y: float2Y,
            rotate: rotateOrb,
          }}
        />

        {/* White ambient for contrast */}
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
            y: float3Y,
          }}
        />

        {/* Animated particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#ff6b35]"
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

        {/* Grid overlay */}
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
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        style={{ opacity, scale }}
      >
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-12 backdrop-blur-sm"
          style={{
            background: "rgba(255, 107, 53, 0.05)",
            border: "1px solid rgba(255, 107, 53, 0.15)",
          }}
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-[#ff6b35]"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[13px] text-white/70 font-medium tracking-wide">
            Launching 2026{" "}
          </span>
        </motion.div>

        {/* Main headline with orange gradient */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h2
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-[0.9]"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dubai
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-semibold text-white/15 tracking-tight">
              is next.
            </span>
          </motion.div>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-light mb-12"
        >
          The world's fastest-growing financial hub meets the future of
          payments.
          <br className="hidden md:block" />
          Private. Instant. Non-custodial.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-6 sm:gap-12 md:gap-20"
        >
          {[
            { value: "40+", label: "Banks" },
            { value: "180+", label: "Nationalities" },
            { value: "$2T+", label: "Annual Trade" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/30">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};

/* ============================================
   SECTION 3: REWARDS TEASER - Elegant minimal banner
   ============================================ */

const CashbackBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 60%)",
            x: useTransform(scrollYProgress, [0, 1], [-100, 100]),
          }}
        />
      </div>

      {/* Floating coins animation */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c50] flex items-center justify-center text-[8px] font-bold text-black shadow-lg shadow-[#ff6b35]/20">
            $
          </div>
        </motion.div>
      ))}

      {/* Horizontal animated lines */}
      <motion.div
        className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent"
        style={{ x }}
      />
      <motion.div
        className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ x: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
      />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6"
        style={{ opacity }}
      >
        <div className="relative p-8 md:p-12 rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-sm overflow-hidden">
          {/* Inner glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#ff6b35]/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-[#ff6b35]/10 border border-[#ff6b35]/20 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-2xl">💰</span>
                </motion.div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#ff6b35] block">
                    Early Access
                  </span>
                  <span className="text-xs text-white/40">
                    Limited spots available
                  </span>
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Earn while you{" "}
                <span className="relative">
                  <span className="relative z-10 text-[#ff6b35]">spend.</span>
                  <motion.span
                    className="absolute bottom-1 left-0 right-0 h-3 bg-[#ff6b35]/20 rounded-sm -z-0"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </span>
              </h3>

              <p className="text-white/50 text-base max-w-md mb-6 leading-relaxed">
                Up to{" "}
                <span className="text-[#ff6b35] font-semibold">
                  5% cashback
                </span>{" "}
                in BLIP tokens on every payment. No tiers. No complexity.
              </p>

              {/* Mini stats */}
              <div className="flex items-center gap-6">
                {[
                  { value: "5%", label: "Max Cashback" },
                  { value: "0", label: "Min Spend" },
                  { value: "∞", label: "Rewards Cap" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col items-center gap-4"
            >
              {/* Animated percentage circle */}
              <motion.div
                className="relative w-28 h-28"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="314"
                    initial={{ strokeDashoffset: 314 }}
                    whileInView={{ strokeDashoffset: 157 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#ff6b35" />
                      <stop offset="100%" stopColor="#ff8c50" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">5%</span>
                </div>
              </motion.div>

              <Link
                to="/rewards"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#ff6b35] text-black text-sm font-semibold hover:bg-[#ff8c50] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] transition-all duration-300"
              >
                <span>View Rewards</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ============================================
   SECTION 4: THE PROBLEM - Interactive Timeline
   ============================================ */

const ProblemSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const problems = [
    {
      year: "2024",
      title: "High Fees",
      desc: "Banks charge 3-7% on international transfers. Hidden costs erode every transaction.",
      stat: "~$48B",
      statLabel: "Lost to fees annually",
    },
    {
      year: "2025",
      title: "Slow Settlement",
      desc: "SWIFT takes 2-5 business days. Money stuck in limbo while you wait.",
      stat: "3-5 days",
      statLabel: "Average settlement",
    },
    {
      year: "2026",
      title: "No Privacy",
      desc: "Every transaction tracked, reported, and stored. Your financial life exposed.",
      stat: "100%",
      statLabel: "Transactions monitored",
    },
    {
      year: "Now",
      title: "Enter Blip",
      desc: "Sub-second settlement. 0.1% fees. Full privacy. The future of money transfer is here.",
      stat: "~2s",
      statLabel: "Settlement time",
      highlight: true,
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-40 bg-black overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#ff6b35]/[0.03] blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header - Centered focus headline */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6"
          >
            Global payments
            <br />
            <span className="text-[#ff6b35]">are broken.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-white/40 max-w-xl mx-auto"
          >
            The traditional financial system was built for a different era. It's
            time for something better.
          </motion.p>
        </div>

        {/* Interactive Timeline */}
        <div className="relative">
          {/* Central timeline line */}
          <motion.div
            className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/[0.06] via-[#ff6b35]/30 to-white/[0.06]"
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Timeline items */}
          <div className="space-y-12 md:space-y-0">
            {problems.map((problem, i) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative md:grid md:grid-cols-2 md:gap-12 ${i % 2 === 0 ? "" : "md:direction-rtl"}`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-8 md:left-1/2 -translate-x-1/2 top-6 z-10`}
                >
                  <motion.div
                    className={`w-4 h-4 rounded-full border-2 ${problem.highlight ? "bg-[#ff6b35] border-[#ff6b35]" : "bg-black border-white/20"}`}
                    whileInView={
                      problem.highlight
                        ? {
                            boxShadow: [
                              "0 0 0 0 rgba(255,107,53,0)",
                              "0 0 20px 4px rgba(255,107,53,0.3)",
                              "0 0 0 0 rgba(255,107,53,0)",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                {/* Content card */}
                <div
                  className={`ml-20 md:ml-0 ${i % 2 === 0 ? "md:text-right md:pr-16" : "md:col-start-2 md:pl-16 md:text-left"}`}
                >
                  <div
                    className={`inline-block p-6 rounded-2xl ${problem.highlight ? "bg-[#ff6b35]/[0.08] border border-[#ff6b35]/20" : "bg-white/[0.02] border border-white/[0.05]"}`}
                  >
                    <div
                      className={`text-[10px] uppercase tracking-[0.3em] ${problem.highlight ? "text-[#ff6b35]" : "text-[#ff6b35]"} font-medium mb-2`}
                    >
                      {problem.year}
                    </div>
                    <h3
                      className={`text-xl md:text-2xl font-semibold ${problem.highlight ? "text-[#ff6b35]" : "text-white"} mb-2`}
                    >
                      {problem.title}
                    </h3>
                    <p className="text-sm text-white/50 mb-4 leading-relaxed max-w-sm">
                      {problem.desc}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-bold ${problem.highlight ? "text-[#ff6b35]" : "text-white"}`}
                      >
                        {problem.stat}
                      </span>
                      <span className="text-xs text-white/30">
                        {problem.statLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ============================================
   SECTION 5: BLIP PROTOCOL
   ============================================ */

const ProtocolSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotateGlow = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      ref={containerRef}
      className="relative py-40 bg-black overflow-hidden"
    >
      {/* Immersive background with animated orange glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 60%)",
            y,
            rotate: rotateGlow,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,53,0.04) 0%, transparent 70%)",
            y: useTransform(scrollYProgress, [0, 1], [-50, 50]),
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm"
            style={{
              background: "rgba(255, 107, 53, 0.05)",
              border: "1px solid rgba(255, 107, 53, 0.15)",
            }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#ff6b35]"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/60">
              The Protocol
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6"
            style={{
              background:
                "linear-gradient(135deg, #ff6b35 0%, #ffffff 50%, #ff8c50 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Blip Protocol
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-light"
          >
            A decentralized settlement layer for instant, private, global value
            transfer.
          </motion.p>
        </div>

        {/* Features - with orange accents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Zero-Knowledge", desc: "Privacy by default", icon: "🔐" },
            {
              label: "Solana-Powered",
              desc: "Sub-second finality",
              icon: "⚡",
            },
            {
              label: "Non-Custodial",
              desc: "Your keys, your funds",
              icon: "🔑",
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              className="group relative rounded-2xl p-8 text-center cursor-default overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {/* Hover glow */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#ff6b35] opacity-0 group-hover:opacity-[0.1] blur-[60px] rounded-full transition-opacity duration-500" />

              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h3 className="text-lg font-medium text-white mb-2 group-hover:text-[#ff6b35] transition-colors">
                {item.label}
              </h3>
              <p className="text-sm text-white/30 group-hover:text-white/50 transition-colors">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <a
            href="/whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full  bg-[#ff6b35] text-black text-sm font-semibold hover:bg-[#ff8c50] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] transition-all duration-300"
          >
            <span>Read the Whitepaper</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION 6: FEATURE STRIP
   ============================================ */

const FeatureStrip = () => {
  return (
    <section className="relative py-20 bg-black overflow-hidden">
      {/* Subtle orange gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex justify-center "
        >
          {/* Centered block (like button) */}
          <div className="w-fit md:flex gap-12">
            {[
              "Sub-second settlement",
              "Zero custody",
              "Privacy by default",
              "On-chain proofs",
            ].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-start  gap-3 mb-4"
              >
                <motion.div
                  className="w-2 h-2 mt-2 rounded-full bg-[#ff6b35]"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                <span className="text-sm text-white/50 font-light tracking-wide text-left hover:text-white">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION: BLIPSCAN DASHBOARD - Linear.app Inspired
   ============================================ */

const AppShowcaseSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const browserY = useTransform(scrollYProgress, [0, 1], [60, -30]);
  const browserYSmooth = useSpring(browserY, { stiffness: 100, damping: 30 });

  // Transaction data for the Blipscan dashboard
  const transactions = [
    {
      id: "BLP-7x2K...9fN3",
      from: "0x7a2...f91",
      to: "Ahmed M.",
      amount: "$500.00",
      status: "completed",
      time: "2s",
    },
    {
      id: "BLP-4mR8...2hL5",
      from: "0x3b8...c42",
      to: "Sarah K.",
      amount: "$1,200.00",
      status: "processing",
      time: "—",
    },
    {
      id: "BLP-9nQ1...6wT8",
      from: "0x5f2...a73",
      to: "Mohammed R.",
      amount: "$750.00",
      status: "completed",
      time: "1.4s",
    },
    {
      id: "BLP-2kL4...8pM7",
      from: "0x8c1...d56",
      to: "Lisa T.",
      amount: "$320.00",
      status: "completed",
      time: "0.8s",
    },
    {
      id: "BLP-6jP9...3mK2",
      from: "0x2e7...b89",
      to: "David W.",
      amount: "$890.00",
      status: "completed",
      time: "1.1s",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-40 bg-black overflow-hidden"
    >
      {/* Subtle gradient background - Linear style */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#ff6b35]/[0.03] blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-4"
          >
            Built for transparency.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-white/40 max-w-xl mx-auto"
          >
            Every transaction visible. Every settlement tracked. Real-time on
            Blipscan.
          </motion.p>
        </div>

        {/* Browser Window - Linear.app inspired */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: browserYSmooth }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Browser frame */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 50px 100px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
            }}
          >
            {/* Browser top bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              {/* Traffic lights */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              {/* URL bar */}
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  <div className="w-3 h-3 rounded-full bg-[#ff6b35]/60" />
                  <span className="text-xs text-white/40 font-mono">
                    blipscan.io/explorer
                  </span>
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Dashboard content */}
            <div className="p-6 md:p-8 bg-[#0a0a0c]">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-white">
                    Transactions
                  </h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[10px] uppercase tracking-wider text-[#ff6b35] font-medium">
                      Live
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs text-white/50">
                    Last 24h
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                  { label: "Total Volume", value: "$2.4M", change: "+12.5%" },
                  { label: "Transactions", value: "12,847", change: "+8.2%" },
                  { label: "Avg. Settlement", value: "1.2s", change: "-0.3s" },
                  { label: "Success Rate", value: "99.8%", change: "+0.1%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="text-[10px] sm:text-[11px] text-white/40 uppercase tracking-wider mb-1 sm:mb-2">
                      {stat.label}
                    </div>
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-base sm:text-xl font-semibold text-white">
                        {stat.value}
                      </span>
                      <span className="text-[10px] sm:text-xs text-[#ff6b35]">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transaction table - Desktop */}
              <div className="rounded-lg border border-white/[0.06] overflow-hidden hidden md:block">
                {/* Table header */}
                <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">
                    Transaction ID
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">
                    From
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">
                    To
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider text-right">
                    Amount
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider text-center">
                    Status
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider text-right">
                    Time
                  </div>
                </div>

                {/* Table rows */}
                {transactions.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="text-sm text-white/70 font-mono">
                      {tx.id}
                    </div>
                    <div className="text-sm text-white/50 font-mono">
                      {tx.from}
                    </div>
                    <div className="text-sm text-white/70">{tx.to}</div>
                    <div className="text-sm text-white font-medium text-right">
                      {tx.amount}
                    </div>
                    <div className="flex justify-center">
                      {tx.status === "completed" ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff6b35]/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                          <span className="text-[10px] text-[#ff6b35] uppercase tracking-wider">
                            Completed
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10">
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-white/60"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-[10px] text-white/60 uppercase tracking-wider">
                            Processing
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-white/40 text-right">
                      {tx.time}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Transaction cards - Mobile */}
              <div className="space-y-3 md:hidden">
                {transactions.slice(0, 3).map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-white/50 font-mono">
                        {tx.id}
                      </span>
                      {tx.status === "completed" ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff6b35]/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                          <span className="text-[10px] text-[#ff6b35] uppercase">
                            Done
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          <span className="text-[10px] text-white/60 uppercase">
                            Processing
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white font-medium">
                          {tx.to}
                        </div>
                        <div className="text-xs text-white/30">{tx.from}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-semibold text-white">
                          {tx.amount}
                        </div>
                        <div className="text-xs text-white/40">{tx.time}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
                  <span className="text-xs text-white/40">
                    Connected to Solana Mainnet
                  </span>
                </div>
                <div className="text-xs text-white/30">
                  Powered by Blip Protocol
                </div>
              </div>
            </div>
          </div>

          {/* Reflection effect */}
          <div
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-20 blur-2xl opacity-20"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,107,53,0.3), transparent)",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ============================================
   SECTION 6.5: MERCHANT DASHBOARD - Linear.app style
   ============================================ */

const MerchantDashboardSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0],
  );
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  // Mock merchant order data
  const newOrders = [
    {
      id: "ORD-7821",
      user: "🦁",
      amount: "500 USDT",
      rate: "₦1,620",
      time: "2m",
      country: "🇳🇬",
    },
    {
      id: "ORD-7820",
      user: "🐯",
      amount: "1,200 USDT",
      rate: "₦1,618",
      time: "5m",
      country: "🇳🇬",
    },
    {
      id: "ORD-7819",
      user: "🦊",
      amount: "250 USDT",
      rate: "3.67 AED",
      time: "8m",
      country: "🇦🇪",
    },
  ];

  const inEscrow = [
    {
      id: "ORD-7815",
      user: "🐻",
      amount: "800 USDT",
      rate: "₦1,615",
      progress: 75,
      country: "🇳🇬",
    },
    {
      id: "ORD-7812",
      user: "🐼",
      amount: "2,000 USDT",
      rate: "3.68 AED",
      progress: 40,
      country: "🇦🇪",
    },
  ];

  const completed = [
    {
      id: "ORD-7810",
      user: "🦅",
      amount: "350 USDT",
      rate: "₦1,620",
      time: "12m ago",
    },
    {
      id: "ORD-7808",
      user: "🐨",
      amount: "1,500 USDT",
      rate: "3.67 AED",
      time: "28m ago",
    },
    {
      id: "ORD-7805",
      user: "🦋",
      amount: "600 USDT",
      rate: "₦1,618",
      time: "45m ago",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 bg-black overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#ff6b35]/[0.02] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-white/[0.01] blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-light">
              For Merchants
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1] mb-6"
          >
            Live matching.
            <br />
            <span className="text-white/20">Instant profits.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-white/40 max-w-2xl mx-auto"
          >
            Real-time order matching. Set your rates. Accept orders. Get paid
            instantly. No custody, no risk.
          </motion.p>
        </div>

        {/* Merchant Dashboard Browser Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ scale }}
          className="relative"
        >
          {/* Browser window chrome */}
          <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a0a] shadow-2xl">
            {/* Browser header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#111111] border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-black/40 border border-white/[0.06]">
                  <div className="w-3 h-3 rounded-full bg-[#ff6b35]/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                  </div>
                  <span className="text-xs text-white/40">
                    merchant.blipprotocol.com
                  </span>
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Dashboard content */}
            <div className="p-4 md:p-6">
              {/* Top stats bar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-[#28ca42]"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs text-white/50">Live</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <span className="text-xs text-white/30">
                    Connected to Solana Mainnet
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">
                      Today's Volume
                    </div>
                    <div className="text-sm font-semibold text-white">
                      $12,450
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">
                      Earnings
                    </div>
                    <div className="text-sm font-semibold text-[#ff6b35]">
                      +$311.25
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Column Dashboard Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: New Orders */}
                <div className="rounded-xl bg-[#0d0d0d] border border-white/[0.04] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
                      <span className="text-sm font-medium text-white">
                        New Orders
                      </span>
                    </div>
                    <span className="text-xs text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full">
                      {newOrders.length}
                    </span>
                  </div>
                  <div className="p-3 space-y-2">
                    {newOrders.map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                        className="group relative p-3 rounded-lg bg-[#111111] border border-white/[0.04] hover:border-[#ff6b35]/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{order.user}</span>
                            <span className="text-xs font-mono text-white/40">
                              {order.id}
                            </span>
                          </div>
                          <span className="text-lg">{order.country}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {order.amount}
                            </div>
                            <div className="text-[11px] text-white/40">
                              @ {order.rate}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/30">
                              {order.time}
                            </span>
                            <motion.div
                              className="px-2 py-1 rounded-md text-[10px] font-medium bg-[#ff6b35] text-black opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ scale: 1.05 }}
                            >
                              Accept
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Column 2: In Escrow */}
                <div className="rounded-xl bg-[#0d0d0d] border border-white/[0.04] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-yellow-500"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-sm font-medium text-white">
                        In Escrow
                      </span>
                    </div>
                    <span className="text-xs text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full">
                      {inEscrow.length}
                    </span>
                  </div>
                  <div className="p-3 space-y-2">
                    {inEscrow.map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                        className="p-3 rounded-lg bg-[#111111] border border-yellow-500/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{order.user}</span>
                            <span className="text-xs font-mono text-white/40">
                              {order.id}
                            </span>
                          </div>
                          <span className="text-lg">{order.country}</span>
                        </div>
                        <div className="mb-3">
                          <div className="text-sm font-semibold text-white">
                            {order.amount}
                          </div>
                          <div className="text-[11px] text-white/40">
                            @ {order.rate}
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-white/30">
                              Settlement progress
                            </span>
                            <span className="text-yellow-500">
                              {order.progress}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-yellow-500 to-[#ff6b35] rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${order.progress}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 1,
                                delay: 0.6 + i * 0.1,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Completed */}
                <div className="rounded-xl bg-[#0d0d0d] border border-white/[0.04] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#28ca42]" />
                      <span className="text-sm font-medium text-white">
                        Completed
                      </span>
                    </div>
                    <span className="text-xs text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full">
                      {completed.length}
                    </span>
                  </div>
                  <div className="p-3 space-y-2">
                    {completed.map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                        className="p-3 rounded-lg bg-[#111111] border border-[#28ca42]/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{order.user}</span>
                            <span className="text-xs font-mono text-white/40">
                              {order.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-[#28ca42]">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span>Settled</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {order.amount}
                            </div>
                            <div className="text-[11px] text-white/40">
                              @ {order.rate}
                            </div>
                          </div>
                          <span className="text-[10px] text-white/30">
                            {order.time}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live matching indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#ff6b35]/5 to-transparent border border-[#ff6b35]/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="relative w-10 h-10 rounded-full bg-[#ff6b35]/10 flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full border border-[#ff6b35]/30"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <svg
                        className="w-5 h-5 text-[#ff6b35]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        Live Matching Active
                      </div>
                      <div className="text-xs text-white/40">
                        3 orders matched in the last 5 minutes
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">
                        Avg. Match Time
                      </div>
                      <div className="text-sm font-semibold text-white">
                        12 seconds
                      </div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="text-right">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">
                        Success Rate
                      </div>
                      <div className="text-sm font-semibold text-[#28ca42]">
                        99.8%
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating notification */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute right-6 top-24 hidden lg:block"
          >
            <div className="p-3 pr-4 rounded-xl bg-[#111111] border border-white/[0.08] shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ff6b35]/10 flex items-center justify-center">
                  <span className="text-sm">🔔</span>
                </div>
                <div>
                  <div className="text-xs font-medium text-white">
                    New order matched!
                  </div>
                  <div className="text-[10px] text-white/40">
                    500 USDT → ₦810,000
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reflection effect */}
          <div
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-20 blur-2xl opacity-20"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,107,53,0.3), transparent)",
            }}
          />
        </motion.div>

        {/* Bottom feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {[
            {
              title: "Set Your Rates",
              desc: "Full control over your exchange rates. Compete for the best deals.",
            },
            {
              title: "Instant Settlement",
              desc: "Funds released immediately after confirmation. No waiting.",
            },
            {
              title: "2.5% Rewards",
              desc: "Earn Blip tokens on every successful transaction you complete.",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#ff6b35]/20 transition-colors"
            >
              <h3 className="text-base font-medium text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-white/40">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ============================================
   SECTION 7: HOW IT WORKS - Interactive Horizontal Timeline
   ============================================ */

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const steps = [
    {
      num: "01",
      title: "Send",
      desc: "Create a payment from your wallet. Connect, enter amount, and send globally.",
      app: "Blip App",
      appIcon: "📱",
      screen: (
        <div className="p-3 sm:p-4 h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-[#ff6b35] flex items-center justify-center">
                <Zap className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-black" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white">
                Blip
              </span>
            </div>
            <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-white/5 flex items-center justify-center">
              <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white/40" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-h-0">
            <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider mb-2">
              You send
            </span>
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                500
              </span>
              <span className="text-sm sm:text-base text-white/50">USDT</span>
            </div>
            <div className="w-full px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center mb-2">
              <span className="text-[10px] text-white/30 block mb-0.5">
                Recipient gets
              </span>
              <span className="text-sm sm:text-base text-white font-medium">
                1,835 AED
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/30">
              <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-emerald-400" />
              <span>Best rate locked</span>
            </div>
          </div>
          <div className="w-full py-2.5 sm:py-3 rounded-xl bg-[#ff6b35] text-center mt-3 flex-shrink-0">
            <span className="text-xs sm:text-sm font-semibold text-black">
              Continue
            </span>
          </div>
        </div>
      ),
    },
    {
      num: "02",
      title: "Match",
      desc: "150+ verified merchants compete to fulfill your order. Best rate wins.",
      app: "Merchant Dashboard",
      appIcon: "🏪",
      screen: (
        <div className="p-3 sm:p-4 h-full flex flex-col text-left overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-semibold text-white">
              Live Orders
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ff6b35]/10">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
              <span className="text-[8px] sm:text-[10px] text-[#ff6b35] font-medium">
                LIVE
              </span>
            </div>
          </div>
          <div className="space-y-2 flex-1 min-h-0 overflow-hidden">
            {[
              {
                rate: "3.672",
                profit: "+$1.85",
                best: true,
                merchant: "Dubai Exchange",
              },
              {
                rate: "3.668",
                profit: "+$1.65",
                best: false,
                merchant: "Emirates FX",
              },
              {
                rate: "3.665",
                profit: "+$1.50",
                best: false,
                merchant: "Gulf Markets",
              },
            ].map((bid, i) => (
              <div
                key={i}
                className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl ${bid.best ? "bg-[#ff6b35]/10 border border-[#ff6b35]/20" : "bg-white/[0.02] border border-white/[0.04]"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 sm:w-7 h-6 sm:h-7 rounded-md sm:rounded-lg ${bid.best ? "bg-[#ff6b35]/20" : "bg-white/5"} flex items-center justify-center`}
                    >
                      {bid.best ? (
                        <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#ff6b35]" />
                      ) : (
                        <Building2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white/40" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-white block">
                        {bid.rate} AED
                      </span>
                      <span className="text-[8px] sm:text-[10px] text-white/30">
                        {bid.merchant}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-emerald-400 font-medium">
                    {bid.profit}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-[#ff6b35]/30 border-t-[#ff6b35]" />
              <span className="text-[10px] sm:text-xs text-white/40">
                Auto-selecting best rate...
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: "03",
      title: "Verify",
      desc: "Every transaction on-chain. Track, verify, and confirm on Blipscan.",
      app: "Blipscan",
      appIcon: "🔍",
      screen: (
        <div className="p-3 sm:p-4 h-full flex flex-col text-left overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-md sm:rounded-lg bg-[#ff6b35] flex items-center justify-center">
                <Globe className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-black" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white">
                Blipscan
              </span>
            </div>
            <div className="px-2 py-0.5 rounded bg-white/[0.05]">
              <span className="text-[8px] sm:text-[10px] text-white/40 font-mono">
                Mainnet
              </span>
            </div>
          </div>
          <div className="space-y-2 flex-1 min-h-0 overflow-hidden">
            {[
              { id: "BLP-7x2K", to: "Ahmed M.", amount: "$500", time: "2s" },
              {
                id: "BLP-4mR8",
                to: "Sarah K.",
                amount: "$1,200",
                time: "1.4s",
              },
              { id: "BLP-9nP3", to: "John D.", amount: "$320", time: "1.8s" },
            ].map((tx, i) => (
              <div
                key={i}
                className="p-2.5 sm:p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] sm:text-[10px] text-white/40 font-mono">
                    {tx.id}...
                  </span>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10">
                    <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-emerald-400" />
                    <span className="text-[8px] sm:text-[10px] text-emerald-400 font-medium">
                      {tx.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-white">{tx.to}</span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {tx.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 flex-shrink-0 px-2 py-1.5 rounded-md bg-white/[0.02]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[8px] sm:text-[10px] text-white/40">
              Connected to Solana
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-40 bg-black overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#ff6b35]/[0.02] blur-[100px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-5 sm:mb-6 md:mb-8"
          >
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ff6b35]" />
            <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider">
              How it works
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-4 sm:mb-5 md:mb-6 px-4 sm:px-0"
          >
            Three steps.
            <br />
            <span className="text-[#ff6b35]">Zero friction.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-white/40 max-w-md lg:max-w-lg mx-auto px-4 sm:px-0"
          >
            From crypto to cash in under 2 seconds. No banks, no delays, no
            complexity.
          </motion.p>
        </div>

        {/* Steps with phone mockups */}
        <div className="relative">
          {/* Connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[260px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent hidden lg:block"
            style={{ originX: 0 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 lg:gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative text-center"
              >
                {/* App label - Above the phone */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4">
                  <span className="text-sm sm:text-base">{step.appIcon}</span>
                  <span className="text-xs sm:text-sm text-white/50 font-medium">
                    {step.app}
                  </span>
                </div>

                {/* Phone mockup - optimized for mobile */}
                <div className="relative mx-auto mb-8 w-[200px] sm:w-[220px] md:w-[200px] lg:w-[260px]">
                  <div className="rounded-[32px] sm:rounded-[36px] lg:rounded-[40px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[2px] sm:p-[3px] shadow-[0_20px_40px_rgba(0,0,0,0.5)] sm:shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                    <div className="rounded-[30px] sm:rounded-[34px] lg:rounded-[38px] bg-[#0a0a0a] p-[6px] sm:p-[8px] lg:p-[10px]">
                      <div className="rounded-[24px] sm:rounded-[28px] lg:rounded-[30px] bg-black overflow-hidden h-[320px] sm:h-[360px] md:h-[320px] lg:h-[400px] relative">
                        {/* Dynamic Island */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 sm:w-20 lg:w-24 h-5 sm:h-6 lg:h-7 bg-black rounded-full z-10" />
                        {/* Screen content */}
                        <div className="pt-9 sm:pt-10 lg:pt-12 h-full">
                          {step.screen}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-8 sm:mt-10">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] text-[10px] sm:text-xs font-mono mb-2 sm:mb-3">
                    {step.num}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/40 leading-relaxed max-w-[280px] mx-auto px-4 md:px-0">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ============================================
   SECTION 8: PRIVACY & TRUST
   ============================================ */

const PrivacySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-20 sm:py-28 md:py-40 bg-black overflow-hidden "
    >
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-8"
          >
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/30 font-light">
              Privacy & Trust
            </span>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1]"
          >
            Your wallet.
            <br />
            <span className="text-white/20">Your identity.</span>
          </motion.h2>
        </div>

        {/* Two column minimal grid */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:gap-40 gap-12">
          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-black p-6 sm:p-10 md:p-12 max-w-sm text-center md:text-left"
          >
            <h3 className="text-xl font-medium text-white mb-6">Privacy</h3>

            <ul className="space-y-4 mx-auto md:mx-0 max-w-xs">
              {[
                "Wallet-only identity",
                "No KYC for small transfers",
                "Private by default",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-white/40"
                >
                  <div className="w-1 h-1 rounded-full bg-white/30 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-black p-6 sm:p-10 md:p-12 max-w-sm text-center md:text-left"
          >
            <h3 className="text-xl font-medium text-white mb-6">Trust</h3>

            <ul className="space-y-4 mx-auto md:mx-0 max-w-xs">
              {[
                "Everything on-chain",
                "Settlement proofs",
                "Non-custodial always",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-white/40"
                >
                  <div className="w-1 h-1 rounded-full bg-white/30 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

/* ============================================
   SECTION 9: EARLY ADOPTER BANNER
   ============================================ */

const EarlyAdopterBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.95, 1, 1, 0.95],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Animated counter for tokens
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < 100) {
        setCount((prev) => Math.min(prev + 2, 100));
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [count]);

  const rewards = [
    {
      icon: "🎁",
      label: "Welcome Bonus",
      value: "$50",
      desc: "Connect wallet",
    },
    {
      icon: "🚀",
      label: "First Transfer",
      value: "$25",
      desc: "Complete a transaction",
    },
    { icon: "👥", label: "Referral", value: "$25", desc: "Invite a friend" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-40 bg-black overflow-hidden"
    >
      {/* Dramatic background */}
      <div className="absolute inset-0">
        {/* Central glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,107,53,0.12) 0%, rgba(255,107,53,0.03) 40%, transparent 70%)",
          }}
        />
        {/* Animated rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#ff6b35]/10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#ff6b35]/5"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6"
        style={{ opacity, scale }}
      >
        {/* Main content card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,107,53,0.02) 50%, rgba(0,0,0,0.5) 100%)",
            border: "1px solid rgba(255,107,53,0.15)",
          }}
        >
          {/* Inner glow effect */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#ff6b35]/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative p-8 md:p-12 lg:p-16">
            {/* Header */}
            <div className="text-center mb-12">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8"
                style={{
                  background: "rgba(255, 107, 53, 0.15)",
                  border: "1px solid rgba(255, 107, 53, 0.3)",
                }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#ff6b35]"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs uppercase tracking-[0.2em] text-[#ff6b35] font-medium">
                  Limited Time Offer
                </span>
              </motion.div>

              {/* Big animated number */}
              <div className="mb-4 sm:mb-6">
                <motion.div
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #ff6b35 50%, #ff8c50 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 80px rgba(255,107,53,0.3)",
                  }}
                >
                  ${count}
                </motion.div>
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mt-2">
                  in Blip Tokens
                </div>
              </div>

              <p className="text-sm sm:text-base md:text-lg text-white/50 max-w-lg mx-auto px-4">
                Early supporters get rewarded. Connect your wallet and start
                earning today.
              </p>
            </div>

            {/* Rewards breakdown */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-12">
              {rewards.map((reward, i) => (
                <motion.div
                  key={reward.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="relative p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center group hover:border-[#ff6b35]/30 transition-all"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-[#ff6b35]/0 group-hover:bg-[#ff6b35]/5 transition-all" />

                  <div className="relative">
                    <span className="text-2xl sm:text-4xl mb-2 sm:mb-4 block">
                      {reward.icon}
                    </span>
                    <div className="text-lg sm:text-2xl font-bold text-[#ff6b35] mb-0.5 sm:mb-1">
                      {reward.value}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-white mb-0.5 sm:mb-1">
                      {reward.label}
                    </div>
                    <div className="text-[10px] sm:text-xs text-white/40 hidden sm:block">
                      {reward.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/waitlist"
                  className="group flex items-center gap-3 px-10 py-5 bg-[#ff6b35] text-black rounded-2xl font-bold text-base shadow-[0_0_50px_rgba(255,107,53,0.3)] hover:shadow-[0_0_80px_rgba(255,107,53,0.5)] transition-all"
                >
                  <span>Claim Your Tokens</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <Link
                to="/rewards"
                className="text-sm text-white/50 hover:text-white/80 transition-colors underline underline-offset-4"
              >
                View all rewards →
              </Link>
            </div>

            {/* Stats footer */}
            <div className="mt-12 pt-8 border-t border-white/[0.06]">
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                {[
                  { value: "2,847", label: "Early adopters" },
                  { value: "$284K", label: "Tokens distributed" },
                  { value: "12 days", label: "Until deadline" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ============================================
   SECTION 10: MERCHANTS
   ============================================ */

const MerchantsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-40 bg-black overflow-hidden"
    >
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-light">
              For Merchants
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1] mb-6"
          >
            Accept crypto.
            <br />
            <span className="text-white/20">Zero risk.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-white/40 max-w-xl mx-auto"
          >
            Payments settle instantly into stable value. Earn 2.5% in Blip
            Tokens.
          </motion.p>
        </div>

        {/* Minimal feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.03] rounded-2xl overflow-hidden"
        >
          {[
            { label: "Instant Settlement", desc: "No waiting. No volatility." },
            { label: "2.5% Rewards", desc: "Earn on every transaction." },
            { label: "No Crypto Needed", desc: "We handle everything." },
          ].map((item, i) => (
            <div
              key={item.label}
              className="bg-black p-10 text-center group cursor-default"
            >
              <h3 className="text-lg font-medium text-white mb-2">
                {item.label}
              </h3>
              <p className="text-sm text-white/30">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ============================================
   SECTION 11: REWARDS - Minimal black/white
   ============================================ */

const RewardsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const rewards = [
    { value: "2.5%", label: "Cashback", desc: "On every payment" },
    { value: "10x", label: "Early Bonus", desc: "For first 1000 users" },
    { value: "20M", label: "Pool", desc: "Total BLIP rewards" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-20 sm:py-28 md:py-32 lg:py-40 bg-black overflow-hidden"
    >
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
          >
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/30 font-light">
              Rewards
            </span>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1] mb-4 sm:mb-6"
          >
            Earn while you spend.
            <br />
            <span className="text-white/20">Every transaction.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-white/40 max-w-xl mx-auto leading-relaxed"
          >
            Up to 2.5% back in BLIP tokens on every payment. Early supporters
            unlock multipliers and exclusive airdrops.
          </motion.p>
        </div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 gap-px bg-white/[0.03] rounded-xl sm:rounded-2xl overflow-hidden mb-12 sm:mb-16"
        >
          {rewards.map((reward) => (
            <div
              key={reward.label}
              className="bg-black p-6 sm:p-8 md:p-10 text-center"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                {reward.value}
              </div>
              <div className="text-xs sm:text-sm text-white/50 mb-1">
                {reward.label}
              </div>
              <div className="text-[10px] sm:text-xs text-white/25 hidden sm:block">
                {reward.desc}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link
            to="/rewards"
            className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[#ff6b35] text-black text-sm sm:text-base font-semibold hover:shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all duration-300"
          >
            <span>View Rewards</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ============================================
   SECTION 12: PEOPLEBANK
   ============================================ */

const PeopleBankSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Mouse tracking for interactive effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!networkRef.current) return;
      const rect = networkRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    const network = networkRef.current;
    if (network) {
      network.addEventListener("mousemove", handleMouseMove);
      return () => network.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Network node positions
  const nodes = [
    { x: 50, y: 25, label: "You", isCentral: true },
    { x: 22, y: 40, label: "Node" },
    { x: 78, y: 40, label: "Node" },
    { x: 15, y: 65, label: "Node" },
    { x: 38, y: 70, label: "Node" },
    { x: 62, y: 70, label: "Node" },
    { x: 85, y: 65, label: "Node" },
    { x: 50, y: 85, label: "Node" },
  ];

  // Connection pairs
  const connections = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [4, 7],
    [5, 7],
    [3, 4],
    [5, 6],
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 bg-black overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <motion.div
              className="h-px w-16 bg-gradient-to-r from-transparent to-white/20"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/40 font-light">
              The Network
            </span>
            <motion.div
              className="h-px w-16 bg-gradient-to-l from-transparent to-white/20"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-white">People</span>
            <span className="text-white/20">Bank</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-white/30 max-w-xl mx-auto leading-relaxed"
          >
            A decentralized, human-powered liquidity network
          </motion.p>
        </div>

        {/* Interactive Network Visualization */}
        <motion.div
          ref={networkRef}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative h-[280px] sm:h-[350px] md:h-[500px] mb-12 sm:mb-16 md:mb-20 cursor-crosshair"
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient
                id="lineGradWhite"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient
                id="lineGradActive"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255,107,53,0)" />
                <stop offset="50%" stopColor="rgba(255,107,53,0.6)" />
                <stop offset="100%" stopColor="rgba(255,107,53,0)" />
              </linearGradient>
            </defs>
            {connections.map(([from, to], i) => {
              const isActive = hoveredNode === from || hoveredNode === to;
              return (
                <motion.line
                  key={i}
                  x1={`${nodes[from].x}%`}
                  y1={`${nodes[from].y}%`}
                  x2={`${nodes[to].x}%`}
                  y2={`${nodes[to].y}%`}
                  stroke={
                    isActive ? "url(#lineGradActive)" : "url(#lineGradWhite)"
                  }
                  strokeWidth={isActive ? "2" : "1"}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.05 }}
                />
              );
            })}
          </svg>

          {/* Network Nodes */}
          {nodes.map((node, i) => {
            // Subtle parallax based on mouse position
            const offsetX = (mousePos.x - 0.5) * (node.isCentral ? 10 : 20);
            const offsetY = (mousePos.y - 0.5) * (node.isCentral ? 10 : 20);
            const isHovered = hoveredNode === i;
            const isConnectedToHovered =
              hoveredNode !== null &&
              connections.some(
                ([from, to]) =>
                  (from === hoveredNode && to === i) ||
                  (to === hoveredNode && from === i),
              );

            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  x: offsetX,
                  y: offsetY,
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + i * 0.1,
                  type: "spring",
                }}
                onMouseEnter={() => setHoveredNode(i)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <motion.div
                  className={`
                    relative -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer
                    transition-all duration-300
                    ${node.isCentral ? "w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24" : "w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14"}
                  `}
                  style={{
                    background:
                      isHovered || node.isCentral
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.03)",
                    border: isHovered
                      ? "1px solid rgba(255,107,53,0.5)"
                      : isConnectedToHovered
                        ? "1px solid rgba(255,255,255,0.2)"
                        : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: isHovered
                      ? "0 0 30px rgba(255,107,53,0.15)"
                      : "none",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Icon */}
                  <div
                    className={`
                    transition-colors duration-300
                    ${node.isCentral ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}
                    ${isHovered ? "text-[#ff6b35]" : "text-white/40"}
                  `}
                  >
                    {node.isCentral ? "◉" : "○"}
                  </div>

                  {/* Label on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                      >
                        <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium">
                          {node.label}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pulse ring for central node */}
                  {node.isCentral && (
                    <motion.div
                      className="absolute inset-0 rounded-full border border-white/10"
                      animate={{
                        scale: [1, 1.5, 1.5],
                        opacity: [0.3, 0, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}

          {/* Data flow particles */}
          {connections.slice(0, 4).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/30"
              style={{
                left: `${nodes[0].x}%`,
                top: `${nodes[0].y}%`,
              }}
              animate={{
                left: [
                  `${nodes[0].x}%`,
                  `${nodes[i + 1].x}%`,
                  `${nodes[0].x}%`,
                ],
                top: [`${nodes[0].y}%`, `${nodes[i + 1].y}%`, `${nodes[0].y}%`],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Flow steps - clean minimal cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {[
            { step: "Join", desc: "Connect wallet" },
            { step: "Lock", desc: "Stake assets" },
            { step: "Route", desc: "Process payments" },
            { step: "Earn", desc: "Get rewarded" },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="group relative p-5 md:p-6 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="relative">
                <span className="text-[12px] text-[#ff6b35] uppercase tracking-[0.3em]  block mb-4 font-mono">
                  {String(i + 1).padStart(2, "#")}
                </span>
                <h4 className="text-base md:text-lg font-medium text-white mb-1 group-hover:text-white transition-colors">
                  {item.step}
                </h4>
                <p className="text-xs text-white/30">{item.desc}</p>
              </div>

              {/* Subtle hover indicator */}
              <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-12 md:gap-20"
        >
          {[
            { value: "100+", label: "Active Nodes" },
            { value: "$2M+", label: "TVL" },
            { value: "12%", label: "Avg APY" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center group cursor-default">
              <motion.div
                className="text-2xl md:text-3xl font-semibold text-white/90 mb-1 group-hover:text-white transition-colors"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 1 + i * 0.1,
                  type: "spring",
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-[10px] text-white/25 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ============================================
   SECTION 13: CTA
   ============================================ */

const CTASection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.8, 1],
    [0, 1, 1, 0.8],
  );
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);
  const glowY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 md:py-48 bg-black overflow-hidden"
    >
      {/* Immersive orange glow background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.03) 40%, transparent 70%)",
            y: glowY,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#ff6b35]"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{ opacity, scale }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] mb-6 sm:mb-8"
        >
          <span className="text-white">The future</span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #ff6b35 0%, #ff8c50 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            is borderless.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg text-white/40 max-w-md mx-auto mb-8 sm:mb-12 px-4"
        >
          Join the waitlist and be among the first.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/waitlist"
            className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-full bg-[#ff6b35] text-black text-sm sm:text-base font-semibold hover:bg-[#ff8c50] hover:shadow-[0_0_60px_rgba(255,107,53,0.5)] transition-all duration-300"
          >
            <span>Join Waitlist</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ============================================
   MAIN INDEX PAGE
   ============================================ */

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Blip Money - Fast, Secure, and Simple Payment Solutions"
        description="Pay with Crypto — Anyone, Anywhere. Blip money is the non-custodial settlement protocol for cash, wire, and crypto transfers without KYC, secured by DAO escrow."
        canonical="https://blip.money/"
      />

      <div className="bg-[#030303] text-white relative overflow-x-hidden">
        {/* Grain overlay for premium film texture */}
        <div className="grain-overlay" />

        <HeroSection />
        <BlipscanExplorerSection />
        <UAESection />
        <CashbackBanner />
        <ProblemSection />
        <ProtocolSection />
        <FeatureStrip />
        <MerchantDashboardSection />
        <HowItWorksSection />
        <PrivacySection />
        <EarlyAdopterBanner />
        <RewardsSection />
        <PeopleBankSection />
        <CTASection />
      </div>
    </>
  );
};

export default Index;
