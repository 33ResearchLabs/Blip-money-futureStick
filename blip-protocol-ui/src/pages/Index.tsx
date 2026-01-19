import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ArrowRight,
  Wallet,
  Check,
  ChevronRight,
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
  ArrowDown,
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
      grid.addEventListener('mousemove', handleMouseMove);
      grid.addEventListener('mouseenter', () => setIsHovering(true));
      grid.addEventListener('mouseleave', () => setIsHovering(false));
    }

    return () => {
      if (grid) {
        grid.removeEventListener('mousemove', handleMouseMove);
        grid.removeEventListener('mouseenter', () => setIsHovering(true));
        grid.removeEventListener('mouseleave', () => setIsHovering(false));
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
      style={{ pointerEvents: 'auto' }}
    >
      {/* Mouse-following glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 53, 0.08) 0%, transparent 70%)',
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
              Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2)
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
                fill={isActive ? '#ff6b35' : 'rgba(255, 255, 255, 0.15)'}
                animate={{
                  r: scale * 1.5,
                  opacity,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 4px rgba(255, 107, 53, 0.5))' : 'none',
                }}
              />
            );
          })
        )}
      </svg>
    </div>
  );
};

/* ============================================
   LARGE PHONE COMPONENT
   Full-size phone mockup for immersive experience
   ============================================ */
const LargePhone = ({ children, className = "", glowColor = "orange" }: { children: React.ReactNode; className?: string; glowColor?: "orange" | "green" }) => {
  const glowStyles = {
    orange: "shadow-[0_0_100px_rgba(255,107,53,0.3),0_0_200px_rgba(255,107,53,0.1)]",
    green: "shadow-[0_0_100px_rgba(255,107,53,0.3),0_0_200px_rgba(255,107,53,0.1)]"
  };
  return (
    <div className={`relative ${className}`} style={{ width: 280, height: 580 }}>
      {/* Phone glow effect */}
      <div className={`absolute inset-0 rounded-[44px] ${glowStyles[glowColor]} blur-sm`} />
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
            <span className="text-[10px] font-mono text-white/40 uppercase">LIVE</span>
            <div className="px-2 py-0.5 rounded bg-[#ff6b35]/10 border border-[#ff6b35]/20">
              <span className="text-[10px] font-semibold text-[#ff6b35]">RELEASED</span>
            </div>
          </div>
        </div>
        <div className="px-5 py-5 border-b border-white/5">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Amount</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">$500.00</span>
            <span className="text-sm text-white/40">USDC</span>
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
            <span className="text-xs font-mono text-white/70">Ahmed M. (Dubai)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase">Escrow</span>
            <span className="text-xs font-mono text-orange-500">Blp4...kX9n</span>
          </div>
        </div>
        <div className="px-5 py-4">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Timeline</p>
          <div className="space-y-2">
            {[
              { status: "Created", time: "2s ago", icon: "○", color: "text-blue-400" },
              { status: "Locked", time: "1s ago", icon: "●", color: "text-yellow-400" },
              { status: "Released", time: "now", icon: "✓", color: "text-[#ff6b35]" },
            ].map((event) => (
              <div key={event.status} className="flex items-center gap-3">
                <span className={`text-xs ${event.color}`}>{event.icon}</span>
                <span className="text-xs text-white/70 flex-1">{event.status}</span>
                <span className="text-[10px] font-mono text-white/30">{event.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 py-3 bg-white/[0.02] flex items-center justify-between">
          <span className="text-[10px] text-white/30 font-mono">Slot #294,721,443</span>
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

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Phase transitions - more dramatic
  const phase1Opacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const phase1Scale = useTransform(smoothProgress, [0, 0.15], [1, 0.9]);
  const phase2Opacity = useTransform(smoothProgress, [0.12, 0.20, 0.40, 0.48], [0, 1, 1, 0]);
  const phase2Scale = useTransform(smoothProgress, [0.12, 0.20, 0.40, 0.48], [0.9, 1, 1, 0.9]);
  const phase3Opacity = useTransform(smoothProgress, [0.45, 0.53, 0.70, 0.78], [0, 1, 1, 0]);
  const phase3Scale = useTransform(smoothProgress, [0.45, 0.53], [0.9, 1]);
  const phase4Opacity = useTransform(smoothProgress, [0.75, 0.88], [0, 1]);
  const phase4Y = useTransform(smoothProgress, [0.75, 0.88], [80, 0]);

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Animated background */}
        <div className="absolute inset-0">
          {/* Mouse-following gradient */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, rgba(255,107,53,0.08) 0%, transparent 40%)`,
            }}
          />
          {/* Secondary glow */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${50 - mousePosition.x * 15}% ${60 + mousePosition.y * 10}%, rgba(255,107,53,0.04) 0%, transparent 50%)`,
            }}
          />
          {/* Grid */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
              backgroundPosition: `${mousePosition.x * 20}px ${mousePosition.y * 20}px`,
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#ff6b35]/40"
              style={{
                left: `${10 + (i * 4.5)}%`,
                top: `${20 + (i % 5) * 15}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="relative h-full flex items-center justify-center">
          {/* ==================== PHASE 1: IMMERSIVE INTRO WITH APP SHOWCASE ==================== */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ opacity: phase1Opacity, scale: phase1Scale }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6 max-w-7xl mx-auto">
              {/* Left: Text content */}
              <div className="flex-1 text-center lg:text-left max-w-xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#ff6b35]"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-white/60 text-sm">Peer-to-peer payments</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
                >
                  Send crypto,
                  <br />
                  <span className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c50] bg-clip-text text-transparent">receive cash</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white/40 text-lg md:text-xl mb-8 leading-relaxed"
                >
                  The fastest way to convert crypto to local currency. Non-custodial, instant, and transparent.
                </motion.p>

                {/* Quick stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center lg:justify-start gap-8 mb-8"
                >
                  {[
                    { value: "~2s", label: "Settlement" },
                    { value: "0.1%", label: "Fees" },
                    { value: "150+", label: "Countries" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center lg:text-left">
                      <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-white/30 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="flex items-center justify-center lg:justify-start gap-3"
                >
                  <span className="text-white/30 text-xs uppercase tracking-[0.2em]">Scroll to explore</span>
                  <motion.div
                    className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5"
                    animate={{ borderColor: ['rgba(255,255,255,0.2)', 'rgba(255,107,53,0.4)', 'rgba(255,255,255,0.2)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      className="w-1 h-1 rounded-full bg-[#ff6b35]"
                      animate={{ y: [0, 10, 0], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Right: App showcase with floating elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex-1 flex items-center justify-center"
                style={{
                  x: mousePosition.x * -10,
                  y: mousePosition.y * -8,
                }}
              >
                {/* Glow effect behind phone */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    className="w-[400px] h-[400px] rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 60%)',
                    }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </div>

                {/* Floating card - top left */}
                <motion.div
                  className="absolute -top-4 -left-4 lg:top-4 lg:-left-16 z-20"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  style={{
                    x: mousePosition.x * 15,
                    y: mousePosition.y * 10,
                  }}
                >
                  <motion.div
                    className="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#ff8c50] flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-semibold">Secured</div>
                        <div className="text-white/40 text-xs">Smart contract</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Floating card - top right */}
                <motion.div
                  className="absolute -top-8 right-0 lg:top-0 lg:-right-12 z-20"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  style={{
                    x: mousePosition.x * -12,
                    y: mousePosition.y * 8,
                  }}
                >
                  <motion.div
                    className="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-10 h-10 rounded-xl bg-[#ff6b35]/10 border border-[#ff6b35]/30 flex items-center justify-center"
                        animate={{ borderColor: ['rgba(255,107,53,0.3)', 'rgba(255,107,53,0.6)', 'rgba(255,107,53,0.3)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className="w-5 h-5 text-[#ff6b35]" />
                      </motion.div>
                      <div>
                        <div className="text-white text-sm font-semibold">Instant</div>
                        <div className="text-white/40 text-xs">~2s settlement</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Floating transaction notification - bottom right */}
                <motion.div
                  className="absolute -bottom-4 -right-4 lg:bottom-16 lg:-right-20 z-20"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  style={{
                    x: mousePosition.x * -18,
                    y: mousePosition.y * -10,
                  }}
                >
                  <motion.div
                    className="bg-[#111]/90 backdrop-blur-xl border border-[#ff6b35]/20 rounded-2xl p-4 shadow-2xl"
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#ff6b35]/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-[#ff6b35]" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-semibold">$500 sent</div>
                        <div className="text-[#ff6b35] text-xs">Just now</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Main phone */}
                <LargePhone glowColor="orange">
                  <div className="h-full bg-[#050505] p-4 pt-12 flex flex-col">
                    {/* Status bar */}
                    <div className="flex items-center justify-between text-[11px] text-white/50 mb-4">
                      <span className="font-medium">9:41</span>
                      <div className="flex items-center gap-1.5">
                        <Signal className="w-4 h-4" />
                        <Wifi className="w-4 h-4" />
                        <Battery className="w-4 h-4" />
                      </div>
                    </div>

                    {/* App header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b35] to-[#ff8c50] flex items-center justify-center">
                          <span className="text-white font-bold text-sm">B</span>
                        </div>
                        <span className="text-white font-semibold">Blip</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <User className="w-4 h-4 text-white/50" />
                      </div>
                    </div>

                    {/* Balance card */}
                    <div className="bg-gradient-to-br from-[#ff6b35]/20 to-[#ff8c50]/5 rounded-2xl p-4 border border-[#ff6b35]/20 mb-4">
                      <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Total Balance</div>
                      <div className="text-3xl font-bold text-white mb-2">$12,450.00</div>
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] text-xs font-medium">
                          +2.4%
                        </div>
                        <span className="text-white/30 text-xs">this week</span>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex gap-3 mb-4">
                      {[
                        { icon: Send, label: "Send" },
                        { icon: ArrowDown, label: "Receive" },
                        { icon: Wallet, label: "Wallet" },
                      ].map((action) => (
                        <div key={action.label} className="flex-1 bg-white/5 rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <action.icon className="w-4 h-4 text-white/70" />
                          </div>
                          <span className="text-white/50 text-[10px]">{action.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Recent activity */}
                    <div className="flex-1">
                      <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Recent</div>
                      <div className="space-y-2">
                        {[
                          { name: "Ahmed M.", amount: "-$500", status: "Completed", color: "text-[#ff6b35]" },
                          { name: "Sarah K.", amount: "+$1,200", status: "Received", color: "text-green-400" },
                        ].map((tx, i) => (
                          <motion.div
                            key={tx.name}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.5 + i * 0.2 }}
                          >
                            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                              <span className="text-white text-xs font-medium">{tx.name[0]}</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-white text-sm font-medium">{tx.name}</div>
                              <div className="text-white/30 text-xs">{tx.status}</div>
                            </div>
                            <div className={`text-sm font-semibold ${tx.color}`}>{tx.amount}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </LargePhone>
              </motion.div>
            </div>
          </motion.div>

          {/* ==================== PHASE 2: LOCK IN ESCROW - FULL APP SCREEN ==================== */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 px-6"
            style={{ opacity: phase2Opacity, scale: phase2Scale }}
          >
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-6xl">
              {/* Left side - Large phone showing lock escrow screen */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                  x: mousePosition.x * -15,
                  y: mousePosition.y * -10,
                }}
              >
                <LargePhone glowColor="green">
                  <div className="h-full bg-[#050505] p-5 pt-12 flex flex-col">
                    {/* Status bar */}
                    <div className="flex items-center justify-between text-[11px] text-white/50 mb-6">
                      <span className="font-medium">9:41</span>
                      <div className="flex items-center gap-1.5">
                        <Signal className="w-4 h-4" />
                        <Wifi className="w-4 h-4" />
                        <Battery className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <ChevronRight className="w-6 h-6 text-white/50 rotate-180" />
                      <span className="text-white font-semibold text-lg">Sell Crypto</span>
                      <div className="w-6" />
                    </div>

                    {/* Sell Card */}
                    <div className="bg-[#111] rounded-2xl p-4 border border-white/5 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white/40 text-xs uppercase tracking-wider">You Sell</span>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                          <span className="text-white text-sm font-medium">USDT</span>
                          <ChevronRight className="w-4 h-4 text-white/40 rotate-90" />
                        </div>
                      </div>
                      <div className="text-4xl font-bold text-white mb-1">500.00</div>
                      <div className="text-white/30 text-sm">Available: 2,450.00 USDT</div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center -my-2 z-10">
                      <motion.div
                        className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ArrowDown className="w-5 h-5 text-black" />
                      </motion.div>
                    </div>

                    {/* Receive Card */}
                    <div className="bg-[#111] rounded-2xl p-4 border border-white/5 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white/40 text-xs uppercase tracking-wider">Buyer Receives</span>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                          <Banknote className="w-5 h-5 text-[#ff6b35]" />
                          <span className="text-white text-sm font-medium">AED</span>
                        </div>
                      </div>
                      <div className="text-4xl font-bold text-[#ff6b35]">1,835.00</div>
                      <div className="text-white/30 text-sm">Rate: 1 USDT = 3.67 AED</div>
                    </div>

                    {/* Escrow Info */}
                    <div className="bg-[#ff6b35]/5 rounded-xl p-3 border border-[#ff6b35]/20 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#ff6b35]/20 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-[#ff6b35]" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">Secured by Escrow</div>
                          <div className="text-white/40 text-xs">Funds locked until confirmed</div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-[#ff6b35]" />
                      </div>
                    </div>

                    {/* Lock Button */}
                    <motion.div
                      className="bg-[#ff6b35] rounded-2xl py-4 flex items-center justify-center gap-2 mt-auto"
                      animate={{ boxShadow: ['0 0 20px rgba(255,107,53,0.3)', '0 0 40px rgba(255,107,53,0.5)', '0 0 20px rgba(255,107,53,0.3)'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lock className="w-5 h-5 text-black" />
                      <span className="text-black font-bold text-base">Lock in Escrow</span>
                    </motion.div>
                  </div>
                </LargePhone>
              </motion.div>

              {/* Right side - Info */}
              <div className="flex-1 text-center lg:text-left max-w-md">
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20 mb-6">
                    <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
                    <span className="text-[#ff6b35] text-sm font-medium">Step 2 of 3</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Lock in<br /><span className="text-[#ff6b35]">Escrow</span>
                  </h2>

                  <p className="text-white/50 text-lg mb-8 leading-relaxed">
                    Your crypto is securely locked in a smart contract. Non-custodial, transparent, and instantly verifiable on-chain.
                  </p>

                  {/* Features */}
                  <div className="space-y-4">
                    {[
                      { icon: Shield, label: "Non-custodial", desc: "You control your keys" },
                      { icon: Zap, label: "Instant lock", desc: "Sub-second confirmation" },
                      { icon: Globe, label: "On-chain proof", desc: "Fully transparent" },
                    ].map((feature, i) => (
                      <motion.div
                        key={feature.label}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-[#ff6b35]" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{feature.label}</div>
                          <div className="text-white/40 text-sm">{feature.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ==================== PHASE 3: SETTLEMENT - BLIPSCAN ==================== */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 px-6"
            style={{ opacity: phase3Opacity, scale: phase3Scale }}
          >
            <div className="flex flex-col items-center max-w-4xl">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="text-center mb-10"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20 mb-6">
                  <CheckCircle2 className="w-4 h-4 text-[#ff6b35]" />
                  <span className="text-[#ff6b35] text-sm font-medium">Transaction Complete</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  Settlement<br /><span className="text-[#ff6b35]">Verified</span>
                </h2>
                <p className="text-white/40 text-lg">Real-time on-chain verification</p>
              </motion.div>

              {/* Large Blipscan Card */}
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl"
                style={{
                  x: mousePosition.x * 10,
                  y: mousePosition.y * 5,
                }}
              >
                <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(255,107,53,0.15)]">
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-3 h-3 rounded-full bg-[#ff6b35]"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-lg font-bold text-white">blipscan</span>
                      <span className="text-white/30 text-sm">explorer</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white/30 uppercase tracking-wider">LIVE</span>
                      <div className="px-3 py-1.5 rounded-lg bg-[#ff6b35]/10 border border-[#ff6b35]/20">
                        <span className="text-sm font-semibold text-[#ff6b35]">RELEASED</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="px-6 py-6 border-b border-white/5 bg-gradient-to-r from-[#ff6b35]/5 to-transparent">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Amount Transferred</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-bold text-white">$500.00</span>
                      <span className="text-xl text-white/40">USDC</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-white/30">Fee: $0.50 (0.10%)</span>
                      <span className="text-[#ff6b35]">• Instant settlement</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="px-6 py-5 space-y-4 border-b border-white/5">
                    {[
                      { label: "From", value: "7xKpL9...3fG2hN", sub: "Your Wallet" },
                      { label: "To", value: "Ahmed M.", sub: "Dubai, UAE" },
                      { label: "Escrow", value: "Blp4mX...kX9nJp", sub: "Smart Contract", highlight: true },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-xs text-white/40 uppercase tracking-wider">{row.label}</span>
                        <div className="text-right">
                          <span className={`text-sm font-mono ${row.highlight ? 'text-[#ff6b35]' : 'text-white/80'}`}>{row.value}</span>
                          <span className="text-xs text-white/30 block">{row.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div className="px-6 py-5">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-4">Transaction Timeline</p>
                    <div className="space-y-3">
                      {[
                        { status: "Created", time: "2.1s ago", color: "bg-blue-500", done: true },
                        { status: "Locked in Escrow", time: "1.4s ago", color: "bg-yellow-500", done: true },
                        { status: "Released to Recipient", time: "0.3s ago", color: "bg-[#ff6b35]", done: true },
                      ].map((event, i) => (
                        <motion.div
                          key={event.status}
                          className="flex items-center gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                        >
                          <div className={`w-3 h-3 rounded-full ${event.color}`} />
                          <span className="text-white/80 flex-1">{event.status}</span>
                          <span className="text-sm font-mono text-white/30">{event.time}</span>
                          <CheckCircle2 className="w-4 h-4 text-[#ff6b35]" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-white/[0.02] flex items-center justify-between">
                    <span className="text-xs text-white/30 font-mono">Slot #294,721,443 • Solana Mainnet</span>
                    <div className="flex items-center gap-2">
                      <motion.span
                        className="w-2 h-2 rounded-full bg-[#ff6b35]"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-sm text-[#ff6b35] font-medium">Finalized</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ==================== PHASE 4: FINAL CTA ==================== */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-30 px-6"
            style={{ opacity: phase4Opacity, y: phase4Y }}
          >
            <div className="text-center max-w-3xl">
              {/* Success icon */}
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-[#ff8c50]/20 border border-[#ff6b35]/30 flex items-center justify-center mx-auto mb-10"
                animate={{
                  boxShadow: ['0 0 30px rgba(255,107,53,0.2)', '0 0 60px rgba(255,107,53,0.4)', '0 0 30px rgba(255,107,53,0.2)'],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-12 h-12 text-[#ff6b35]" />
              </motion.div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                The Future of<br />
                <span className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c50] bg-clip-text text-transparent">Global Payments</span>
              </h2>

              <p className="text-white/40 text-xl mb-12 max-w-xl mx-auto">
                Sub-second settlement. Zero intermediaries. Complete transparency. Join the revolution.
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-12 md:gap-20 mb-12">
                {[
                  { value: "~2s", label: "Settlement Time" },
                  { value: "0.1%", label: "Transaction Fee" },
                  { value: "150+", label: "Countries" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-xs uppercase tracking-wider text-white/30">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/waitlist"
                  className="group flex items-center gap-3 px-10 py-5 bg-[#ff6b35] text-black rounded-full font-bold text-base hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] transition-all"
                >
                  Join Waitlist
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="flex items-center gap-3 px-10 py-5 text-white/70 hover:text-white font-medium text-base transition-colors border border-white/10 rounded-full hover:border-white/20 hover:bg-white/5"
                >
                  Learn How It Works
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
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
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);

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
            background: 'radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, rgba(255,107,53,0.02) 40%, transparent 70%)',
            y: float1Y,
          }}
        />

        {/* Secondary orange glow - floating */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 60%)',
            y: float2Y,
            rotate: rotateOrb,
          }}
        />

        {/* White ambient for contrast */}
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
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
            backgroundSize: '80px 80px',
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
            background: 'rgba(255, 107, 53, 0.05)',
            border: '1px solid rgba(255, 107, 53, 0.15)',
          }}
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-[#ff6b35]"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[13px] text-white/70 font-medium tracking-wide">
            Launching 2025
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
            className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-[0.9]"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
            <span className="text-6xl md:text-8xl lg:text-9xl font-semibold text-white/15 tracking-tight">
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
          The world's fastest-growing financial hub meets the future of payments.
          <br className="hidden md:block" />
          Private. Instant. Non-custodial.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-12 md:gap-20"
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
              <div className="text-2xl md:text-3xl font-semibold text-white mb-1">{stat.value}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/30">{stat.label}</div>
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

  return (
    <section ref={containerRef} className="relative py-20 bg-black overflow-hidden">
      {/* Subtle horizontal line accent */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ x }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-white/20 rounded-full" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">Early Access</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2">
              Earn while you transact.
            </h3>
            <p className="text-white/40 text-sm max-w-md">
              Up to 5% cashback in BLIP tokens on every payment. No tiers. No complexity.
            </p>
          </motion.div>

          {/* Right CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="/rewards"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 text-white text-sm font-medium hover:border-white/30 hover:bg-white/5 transition-all duration-300"
            >
              <span>View Rewards</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
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
  const glowY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const problems = [
    { title: "High Fees", desc: "Hidden costs erode every transaction.", icon: "💸" },
    { title: "Slow Settlement", desc: "Days, not seconds.", icon: "⏳" },
    { title: "No Privacy", desc: "Your data, exposed to everyone.", icon: "🔓" },
    { title: "Middlemen", desc: "Opaque. Unaccountable.", icon: "🏦" },
  ];

  return (
    <section ref={containerRef} className="relative py-40 bg-black overflow-hidden">
      {/* Immersive background with orange glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,107,53,0.05) 0%, transparent 60%)',
            y: glowY,
          }}
        />
      </div>

      <motion.div className="relative z-10 max-w-5xl mx-auto px-6" style={{ opacity }}>
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">
              The Problem
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1]"
          >
            Global payments
            <br />
            <span className="text-[#ff6b35]/50">are broken.</span>
          </motion.h2>
        </div>

        {/* Problems Grid - with orange hover accents */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl p-8 cursor-default overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {/* Hover glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ff6b35] opacity-0 group-hover:opacity-[0.08] blur-[60px] rounded-full transition-opacity duration-500" />

              <div className="relative z-10">
                <span className="text-2xl mb-4 block">{problem.icon}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#ff6b35]/50 font-medium mb-4 block">
                  0{i + 1}
                </span>
                <h3 className="text-lg md:text-xl font-medium text-white mb-2 group-hover:text-white transition-colors">
                  {problem.title}
                </h3>
                <p className="text-sm text-white/30 group-hover:text-white/50 transition-colors leading-relaxed">
                  {problem.desc}
                </p>
              </div>

              {/* Bottom accent line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff6b35] to-transparent"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
              />
            </motion.div>
          ))}
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
    <section ref={containerRef} className="relative py-40 bg-black overflow-hidden">
      {/* Immersive background with animated orange glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 60%)',
            y,
            rotate: rotateGlow,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.04) 0%, transparent 70%)',
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
              background: 'rgba(255, 107, 53, 0.05)',
              border: '1px solid rgba(255, 107, 53, 0.15)',
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
              background: 'linear-gradient(135deg, #ff6b35 0%, #ffffff 50%, #ff8c50 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
            A decentralized settlement layer for instant, private, global value transfer.
          </motion.p>
        </div>

        {/* Features - with orange accents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Zero-Knowledge", desc: "Privacy by default", icon: "🔐" },
            { label: "Solana-Powered", desc: "Sub-second finality", icon: "⚡" },
            { label: "Non-Custodial", desc: "Your keys, your funds", icon: "🔑" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              className="group relative rounded-2xl p-8 text-center cursor-default overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
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
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#ff6b35] text-black text-sm font-semibold hover:bg-[#ff8c50] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] transition-all duration-300"
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
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
        >
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
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 group cursor-default"
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-[#ff6b35]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              <span className="text-sm md:text-base text-white/50 font-light tracking-wide group-hover:text-white/80 transition-colors">
                {feature}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION: BEAUTIFUL EFFORTLESS - Product Showcase
   ============================================ */

const BeautifulEffortlessSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const dashboardY = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const dashboardYSmooth = useSpring(dashboardY, { stiffness: 100, damping: 30 });

  // Sample transactions for the Blipscan preview
  const transactions = [
    { id: "BLP-7x2K...9fN3", from: "0x7a2...f91", to: "Ahmed M.", amount: "$500.00", status: "completed", time: "2s" },
    { id: "BLP-4mR8...2hL5", from: "0x3b8...c42", to: "Sarah K.", amount: "$1,200.00", status: "processing", time: "—" },
    { id: "BLP-9nQ1...6wT8", from: "0x5f2...a73", to: "Mohammed R.", amount: "$750.00", status: "completed", time: "1.4s" },
  ];

  return (
    <section ref={containerRef} className="relative py-32 md:py-40 bg-black overflow-hidden">
      {/* Subtle orange ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full bg-[#ff6b35]/[0.02] blur-[150px]" />
      </div>

      <motion.div className="relative z-10 max-w-7xl mx-auto px-6" style={{ opacity }}>
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#ff6b35]/30" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#ff6b35]/50 font-light">
              The Experience
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#ff6b35]/30" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-white">Beautiful.</span>
            <br />
            <span className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c50] bg-clip-text text-transparent">Effortless.</span>
          </motion.h2>
        </div>

        {/* 3-Step Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Step 1: Send */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.05] h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20 flex items-center justify-center">
                  <span className="text-sm font-mono text-[#ff6b35]">1</span>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">Send</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Initiate Transfer</h3>
              <p className="text-sm text-white/50 mb-6">Connect wallet, enter amount, select recipient's currency.</p>
              {/* Mini UI mockup */}
              <div className="rounded-xl bg-black/50 border border-white/[0.04] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/40">You send</span>
                  <span className="text-xs text-white/30">Balance: 5,420 USDC</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold text-white">500</span>
                  <div className="px-2 py-1 rounded-lg bg-white/[0.05] text-xs text-white/60">USDC</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2: Match */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.05] h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20 flex items-center justify-center">
                  <span className="text-sm font-mono text-[#ff6b35]">2</span>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">Match</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Matching</h3>
              <p className="text-sm text-white/50 mb-6">AI routes through optimal liquidity providers.</p>
              {/* Matching animation */}
              <div className="rounded-xl bg-black/50 border border-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs">👤</div>
                    <div>
                      <div className="text-xs text-white/60">You</div>
                      <div className="text-[10px] text-white/30">500 USDC</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-xs text-white/60 text-right">Merchant</div>
                      <div className="text-[10px] text-white/30 text-right">1,835 AED</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs">🏪</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3: Track on Blipscan - Full Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:col-span-1"
          >
            <div className="rounded-2xl p-6 bg-gradient-to-b from-[#ff6b35]/[0.08] to-transparent border border-[#ff6b35]/20 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#ff6b35]/20 border border-[#ff6b35]/30 flex items-center justify-center">
                  <span className="text-sm font-mono text-[#ff6b35]">3</span>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#ff6b35]/60">Track</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Live on Blipscan</h3>
              <p className="text-sm text-white/50 mb-4">Every transaction visible in real-time.</p>

              {/* Full Blipscan Dashboard */}
              <div className="rounded-xl bg-black/80 border border-white/[0.08] overflow-hidden">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04] bg-white/[0.02]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.03]">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[#ff6b35]"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-[9px] text-white/40 font-mono">blipscan.io/explorer</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Header */}
                <div className="px-3 py-2 border-b border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-white">Live Transactions</span>
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#ff6b35]/10">
                        <motion.div
                          className="w-1 h-1 rounded-full bg-[#ff6b35]"
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-[8px] uppercase text-[#ff6b35] font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-1 px-2 py-2 border-b border-white/[0.04]">
                  {[
                    { label: "24h Vol", value: "$2.4M" },
                    { label: "TXs", value: "12,847" },
                    { label: "Avg", value: "1.2s" },
                    { label: "Rate", value: "99.8%" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-[10px] font-medium text-white">{stat.value}</div>
                      <div className="text-[7px] text-white/40 uppercase">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Transaction Table */}
                <div className="px-2 py-1">
                  <div className="grid grid-cols-4 gap-1 px-1 py-1 text-[7px] text-white/30 uppercase border-b border-white/[0.03]">
                    <span>TX ID</span>
                    <span>To</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">Status</span>
                  </div>
                  {transactions.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                      className="grid grid-cols-4 gap-1 px-1 py-1.5 border-b border-white/[0.02] last:border-0"
                    >
                      <span className="text-[8px] text-white/50 font-mono truncate">{tx.id}</span>
                      <span className="text-[8px] text-white/60 truncate">{tx.to}</span>
                      <span className="text-[8px] text-white font-medium text-right">{tx.amount}</span>
                      <div className="flex justify-end">
                        {tx.status === 'completed' ? (
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-[#ff6b35]" />
                            <span className="text-[7px] text-[#ff6b35]">{tx.time}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <motion.div
                              className="w-1 h-1 rounded-full bg-white/40"
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="text-[7px] text-white/40">pending</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-2 py-1.5 border-t border-white/[0.03] bg-white/[0.01] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-[7px] text-white/30">Solana Mainnet</span>
                  </div>
                  <span className="text-[7px] text-white/20">Powered by Blip</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full Blipscan Dashboard below the 3 steps */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: dashboardYSmooth }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Browser frame */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5), 0 0 60px rgba(255,107,53,0.05)',
            }}
          >
            {/* Browser top bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  <div className="w-3 h-3 rounded-full bg-[#ff6b35]/60" />
                  <span className="text-xs text-white/40 font-mono">blipscan.io/explorer</span>
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Dashboard content */}
            <div className="p-6 md:p-8 bg-[#0a0a0c]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">Live Transactions</h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[10px] uppercase tracking-wider text-[#ff6b35] font-medium">Live</span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Volume 24h", value: "$2.4M", change: "+12.5%" },
                  { label: "Transactions", value: "12,847", change: "+8.2%" },
                  { label: "Avg. Time", value: "1.2s", change: "-0.3s" },
                  { label: "Success", value: "99.8%", change: "+0.1%" },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{stat.label}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-white">{stat.value}</span>
                      <span className="text-[10px] text-[#ff6b35]">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transaction table */}
              <div className="rounded-lg border border-white/[0.04] overflow-hidden">
                <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.04]">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">TX ID</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">From</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">To</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider text-right">Amount</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider text-center">Status</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider text-right">Time</div>
                </div>
                {[
                  { id: "BLP-7x2K...9fN3", from: "0x7a2...f91", to: "Ahmed M.", amount: "$500.00", status: "completed", time: "2s" },
                  { id: "BLP-4mR8...2hL5", from: "0x3b8...c42", to: "Sarah K.", amount: "$1,200.00", status: "processing", time: "—" },
                  { id: "BLP-9nQ1...6wT8", from: "0x5f2...a73", to: "Mohammed R.", amount: "$750.00", status: "completed", time: "1.4s" },
                  { id: "BLP-2kL4...8pM7", from: "0x8c1...d56", to: "Lisa T.", amount: "$320.00", status: "completed", time: "0.8s" },
                ].map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                    className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 px-4 py-3 border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors"
                  >
                    <div className="text-sm text-white/70 font-mono">{tx.id}</div>
                    <div className="hidden md:block text-sm text-white/50 font-mono">{tx.from}</div>
                    <div className="hidden md:block text-sm text-white/70">{tx.to}</div>
                    <div className="text-sm text-white font-medium text-right">{tx.amount}</div>
                    <div className="hidden md:flex justify-center">
                      {tx.status === 'completed' ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff6b35]/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                          <span className="text-[10px] text-[#ff6b35] uppercase tracking-wider">Done</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10">
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-white/60"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-[10px] text-white/60 uppercase tracking-wider">Pending</span>
                        </div>
                      )}
                    </div>
                    <div className="hidden md:block text-sm text-white/40 text-right">{tx.time}</div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.03]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
                  <span className="text-[10px] text-white/40">Connected to Solana Mainnet</span>
                </div>
                <span className="text-[10px] text-white/30">Powered by Blip Protocol</span>
              </div>
            </div>
          </div>

          {/* Reflection */}
          <div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[70%] h-16 blur-2xl opacity-20"
            style={{ background: 'linear-gradient(to bottom, rgba(255,107,53,0.3), transparent)' }}
          />
        </motion.div>
      </motion.div>
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
    { id: "BLP-7x2K...9fN3", from: "0x7a2...f91", to: "Ahmed M.", amount: "$500.00", status: "completed", time: "2s" },
    { id: "BLP-4mR8...2hL5", from: "0x3b8...c42", to: "Sarah K.", amount: "$1,200.00", status: "processing", time: "—" },
    { id: "BLP-9nQ1...6wT8", from: "0x5f2...a73", to: "Mohammed R.", amount: "$750.00", status: "completed", time: "1.4s" },
    { id: "BLP-2kL4...8pM7", from: "0x8c1...d56", to: "Lisa T.", amount: "$320.00", status: "completed", time: "0.8s" },
    { id: "BLP-6jP9...3mK2", from: "0x2e7...b89", to: "David W.", amount: "$890.00", status: "completed", time: "1.1s" },
  ];

  return (
    <section ref={containerRef} className="relative py-32 md:py-40 bg-black overflow-hidden">
      {/* Subtle gradient background - Linear style */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#ff6b35]/[0.03] blur-[120px]" />
      </div>

      <motion.div className="relative z-10 max-w-6xl mx-auto px-6" style={{ opacity }}>
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
            Every transaction visible. Every settlement tracked. Real-time on Blipscan.
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
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset',
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
                  <span className="text-xs text-white/40 font-mono">blipscan.io/explorer</span>
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Dashboard content */}
            <div className="p-6 md:p-8 bg-[#0a0a0c]">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-white">Transactions</h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[10px] uppercase tracking-wider text-[#ff6b35] font-medium">Live</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs text-white/50">
                    Last 24h
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Volume", value: "$2.4M", change: "+12.5%" },
                  { label: "Transactions", value: "12,847", change: "+8.2%" },
                  { label: "Avg. Settlement", value: "1.2s", change: "-0.3s" },
                  { label: "Success Rate", value: "99.8%", change: "+0.1%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="text-[11px] text-white/40 uppercase tracking-wider mb-2">{stat.label}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-semibold text-white">{stat.value}</span>
                      <span className="text-xs text-[#ff6b35]">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transaction table */}
              <div className="rounded-lg border border-white/[0.06] overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">Transaction ID</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">From</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">To</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider text-right">Amount</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider text-center">Status</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider text-right">Time</div>
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
                    <div className="text-sm text-white/70 font-mono">{tx.id}</div>
                    <div className="text-sm text-white/50 font-mono">{tx.from}</div>
                    <div className="text-sm text-white/70">{tx.to}</div>
                    <div className="text-sm text-white font-medium text-right">{tx.amount}</div>
                    <div className="flex justify-center">
                      {tx.status === 'completed' ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff6b35]/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                          <span className="text-[10px] text-[#ff6b35] uppercase tracking-wider">Completed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10">
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-white/60"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-[10px] text-white/60 uppercase tracking-wider">Processing</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-white/40 text-right">{tx.time}</div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
                  <span className="text-xs text-white/40">Connected to Solana Mainnet</span>
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
              background: 'linear-gradient(to bottom, rgba(255,107,53,0.3), transparent)',
            }}
          />
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
  const glowX = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const steps = [
    {
      num: "01",
      title: "Send",
      desc: "Create a payment from your wallet. Crypto is locked in escrow.",
      icon: "💳",
    },
    {
      num: "02",
      title: "Match",
      desc: "The Blip network routes your payment through optimal liquidity.",
      icon: "🔄",
    },
    {
      num: "03",
      title: "Receive",
      desc: "Recipient gets real-world value. Bank, cash, or goods.",
      icon: "✅",
    },
  ];

  return (
    <section ref={containerRef} className="relative py-40 bg-black overflow-hidden">
      {/* Immersive background with moving glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,107,53,0.06) 0%, transparent 60%)',
            x: glowX,
          }}
        />
      </div>

      <motion.div className="relative z-10 max-w-5xl mx-auto px-6" style={{ opacity }}>
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm"
            style={{
              background: 'rgba(255, 107, 53, 0.05)',
              border: '1px solid rgba(255, 107, 53, 0.15)',
            }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#ff6b35]"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/60">
              How It Works
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1]"
          >
            Three steps.
            <br />
            <span className="text-[#ff6b35]/60">That's it.</span>
          </motion.h2>
        </div>

        {/* Steps with orange accents */}
        <div className="relative">
          {/* Connecting orange gradient line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-14 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff6b35]/40 to-transparent hidden md:block"
            style={{ originX: 0 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-center group"
              >
                {/* Step number circle with orange glow */}
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-full mb-8 relative">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, transparent 70%)',
                      border: '1px solid rgba(255, 107, 53, 0.2)',
                    }}
                  />
                  <span className="text-4xl">{step.icon}</span>
                  {/* Pulse effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-[#ff6b35]/30"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                </div>

                {/* Content */}
                <span className="text-[#ff6b35] text-xs font-mono mb-2 block">{step.num}</span>
                <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-[#ff6b35] transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
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
    <section ref={containerRef} className="relative py-40 bg-black overflow-hidden">
      <motion.div className="relative z-10 max-w-5xl mx-auto px-6" style={{ opacity }}>
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
              Privacy & Trust
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1]"
          >
            Your wallet.
            <br />
            <span className="text-white/20">Your identity.</span>
          </motion.h2>
        </div>

        {/* Two column minimal grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.03] rounded-2xl overflow-hidden">
          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-black p-10 md:p-12"
          >
            <h3 className="text-xl font-medium text-white mb-6">Privacy</h3>
            <ul className="space-y-4">
              {[
                "Wallet-only identity",
                "No KYC for small transfers",
                "Private by default",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/40">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
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
            className="bg-black p-10 md:p-12"
          >
            <h3 className="text-xl font-medium text-white mb-6">Trust</h3>
            <ul className="space-y-4">
              {[
                "Everything on-chain",
                "Settlement proofs",
                "Non-custodial always",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/40">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
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

  const glowX = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section ref={containerRef} className="relative py-28 bg-black overflow-hidden">
      {/* Animated orange gradient lines */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6b35]/40 to-transparent"
        style={{ x: glowX }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6b35]/40 to-transparent"
        style={{ x: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
      />

      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#ff6b35]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8"
            style={{
              background: 'rgba(255, 107, 53, 0.1)',
              border: '1px solid rgba(255, 107, 53, 0.2)',
            }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#ff6b35]"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[12px] uppercase tracking-[0.2em] text-[#ff6b35]">Early Access</span>
          </motion.div>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #ff6b35 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            $100 in Blip Tokens
          </h2>

          <p className="text-base text-white/40 max-w-lg mx-auto mb-10">
            Reserved for early adopters. Connect your wallet and complete your first transfer.
          </p>

          <Link
            to="/rewards"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#ff6b35] text-black text-sm font-semibold hover:bg-[#ff8c50] hover:shadow-[0_0_50px_rgba(255,107,53,0.4)] transition-all duration-300"
          >
            <span>Join Early Access</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
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
    <section ref={containerRef} className="relative py-40 bg-black overflow-hidden">
      <motion.div className="relative z-10 max-w-5xl mx-auto px-6" style={{ opacity }}>
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
            Payments settle instantly into stable value. Earn 2.5% in Blip Tokens.
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
            <div key={item.label} className="bg-black p-10 text-center group cursor-default">
              <h3 className="text-lg font-medium text-white mb-2">{item.label}</h3>
              <p className="text-sm text-white/30">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ============================================
   SECTION 11: REWARDS
   ============================================ */

const RewardsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative py-40 bg-black overflow-hidden">
      <motion.div className="relative z-10 max-w-4xl mx-auto px-6 text-center" style={{ opacity }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-light">
            Rewards
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
          Earn while
          <br />
          <span className="text-white/20">you spend.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-white/40 max-w-lg mx-auto mb-12"
        >
          Up to 2.5% in Blip Tokens on every payment. Plus early supporter airdrops.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/rewards"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300"
          >
            <span>View Rewards</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/waitlist"
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            Join Waitlist
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative py-40 bg-black overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.01] blur-3xl" />
      </div>

      <motion.div className="relative z-10 max-w-5xl mx-auto px-6" style={{ opacity }}>
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
              The Network
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
            PeopleBank
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed"
          >
            A decentralized, human-powered liquidity network. Provide liquidity. Route payments. Earn rewards.
          </motion.p>
        </div>

        {/* Flow steps - minimal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4"
        >
          {[
            "Join",
            "Lock value",
            "Route payments",
            "Earn",
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm text-white/60">{step}</span>
              </div>
              {i < 3 && (
                <div className="hidden md:block w-12 h-px bg-white/10" />
              )}
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

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);
  const glowY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="relative py-48 bg-black overflow-hidden">
      {/* Immersive orange glow background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.03) 40%, transparent 70%)',
            y: glowY,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 60%)',
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
          className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] mb-8"
        >
          <span className="text-white">The future</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c50 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
          className="text-lg text-white/40 max-w-md mx-auto mb-12"
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
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#ff6b35] text-black text-base font-semibold hover:bg-[#ff8c50] hover:shadow-[0_0_60px_rgba(255,107,53,0.5)] transition-all duration-300"
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
        title="Blip Money - Pay with Crypto, Anyone, Anywhere"
        description="Blip money is the non-custodial settlement protocol for cash, wire, and crypto transfers without KYC, secured by DAO escrow."
        canonical="https://blip.money/"
      />

      <div className="bg-[#030303] text-white relative">
        {/* Grain overlay for premium film texture */}
        <div className="grain-overlay" />

        <HeroSection />
        <UAESection />
        <CashbackBanner />
        <ProblemSection />
        <ProtocolSection />
        <FeatureStrip />
        <BeautifulEffortlessSection />
        <HowItWorksSection />
        <PrivacySection />
        <EarlyAdopterBanner />
        <MerchantsSection />
        <RewardsSection />
        <PeopleBankSection />
        <CTASection />
      </div>
    </>
  );
};

export default Index;
