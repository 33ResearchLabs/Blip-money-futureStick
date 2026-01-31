import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Lock, Users, Zap, Shield, ArrowRight } from "lucide-react";
import { Logo } from "./Navbar";
import { MagneticWrapper } from "./MagneticButton";
import { Link } from "react-router-dom";

/**
 * CinematicHero - Premium Web3 aesthetic with responsive layout
 * Mobile: Badge → Heading → Phone → Description → Stats → Dashboard
 * Desktop: 3-column layout with parallax effects
 */
const CinematicHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const phoneLayerRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const dashboardLayerRef = useRef<HTMLDivElement>(null);

  // Smooth parallax values
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 150]), {
    stiffness: 100,
    damping: 30,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse tracking for desktop parallax
  useEffect(() => {
    if (window.innerWidth < 1024) return; // Disable on mobile

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (e.clientX - centerX) / centerX;
        const moveY = (e.clientY - centerY) / centerY;

        if (phoneLayerRef.current) {
          phoneLayerRef.current.style.transform = `translate3d(${
            moveX * 15
          }px, ${moveY * 15}px, 0)`;
        }

        if (textLayerRef.current) {
          textLayerRef.current.style.transform = `translate3d(${moveX * 8}px, ${
            moveY * 8
          }px, 0)`;
        }

        if (dashboardLayerRef.current) {
          dashboardLayerRef.current.style.transform = `translate3d(${
            moveX * 20
          }px, ${moveY * 20}px, 0)
            rotateX(${moveY * 3}deg) rotateY(${-moveX * 3}deg)`;
        }

        rafId = null;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-black"
      style={{ opacity }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0a0a0a]" />
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)",
            y,
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
            y: useTransform(y, (val) => -val * 0.5),
          }}
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative z-10 min-h-screen flex flex-col items-center justify-start px-6 pt-28 pb-12">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl font-bold text-white text-center mb-8 tracking-tight leading-[1.1]"
        >
          Send money anywhere,
          <br />
          <span className="text-white/30">anytime.</span>
        </motion.h1>

        {/* Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <PhoneMockup />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/60 text-base text-center mb-8 leading-relaxed max-w-md"
        >
          Fast, borderless transfers with crypto rails. Connect wallet, enter
          amount, and send globally in seconds.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex items-center justify-center gap-8 mb-12"
        >
          {[
            { value: "~2s", label: "Settlement" },
            { value: "0.1%", label: "Fees" },
            { value: "150+", label: "Countries" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-white/90">
                {stat.value}
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <DashboardMockup />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-12"
        >
          <Link
            to="/waitlist"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black text-base font-semibold hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300"
          >
            Get Started
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Desktop Layout - 3 Columns */}
      <div
        className="hidden lg:flex relative z-10 min-h-screen items-center justify-center px-8 xl:px-16 max-w-[1600px] mx-auto"
        style={{ perspective: "2000px" }}
      >
        {/* Left Column - Phone Mockup */}
        <motion.div
          ref={phoneLayerRef}
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-1/3 flex justify-center items-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <PhoneMockup />
        </motion.div>

        {/* Center Column - Text Content */}
        <motion.div
          ref={textLayerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-1/3 px-8 text-center"
        >
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
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
              <span className="text-xs text-white/50 font-medium">
                Powered by
              </span>
              <span className="text-xs font-bold text-white">Solana</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl xl:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
            Send money
            <br />
            anywhere,
            <br />
            <span className="text-white/30">anytime.</span>
          </h1>

          {/* Description */}
          <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Fast, borderless transfers with crypto rails. Connect wallet, enter
            amount, and send globally in seconds.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mb-12">
            {[
              { value: "~2s", label: "Settlement" },
              { value: "0.1%", label: "Fees" },
              { value: "150+", label: "Countries" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white/90">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <MagneticWrapper strength={0.3}>
            <Link
              to="/waitlist"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-black text-lg font-semibold hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </MagneticWrapper>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 flex items-center justify-center gap-3"
          >
            <span className="text-white/30 text-xs uppercase tracking-widest font-medium">
              Scroll to explore
            </span>
            <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Dashboard Mockup */}
        <motion.div
          ref={dashboardLayerRef}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-1/3 flex justify-center items-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </motion.section>
  );
};

/* ==================== Phone Mockup Component ==================== */
const PhoneMockup = () => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/20 to-purple-500/20 blur-3xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative w-[280px] h-[570px] rounded-[3.5rem] p-[8px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl">
        {/* Screen */}
        <div className="w-full h-full bg-black rounded-[3.2rem] relative overflow-hidden">
          {/* Reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-50" />

          {/* Status bar */}
          <div className="absolute top-0 left-0 w-full h-12 flex items-center justify-between px-8 z-30">
            <div className="text-xs font-semibold text-white">9:41</div>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="10" viewBox="0 0 18 12" fill="white">
                <path d="M0 10.5C0 10.2239 0.223858 10 0.5 10H1.5C1.77614 10 2 10.2239 2 10.5V11.5C2 11.7761 1.77614 12 1.5 12H0.5C0.223858 12 0 11.7761 0 11.5V10.5Z" />
                <path d="M4 8.5C4 8.22386 4.22386 8 4.5 8H5.5C5.77614 8 6 8.22386 6 8.5V11.5C6 11.7761 5.77614 12 5.5 12H4.5C4.22386 12 4 11.7761 4 11.5V8.5Z" />
                <path d="M8 5.5C8 5.22386 8.22386 5 8.5 5H9.5C9.77614 5 10 5.22386 10 5.5V11.5C10 11.7761 9.77614 12 9.5 12H8.5C8.22386 12 8 11.7761 8 11.5V5.5Z" />
                <path d="M12 2.5C12 2.22386 12.2239 2 12.5 2H13.5C13.7761 2 14 2.22386 14 2.5V11.5C14 11.7761 13.7761 12 13.5 12H12.5C12.2239 12 12 11.7761 12 11.5V2.5Z" />
              </svg>
              <div className="w-6 h-3 rounded-sm border border-white/40 relative flex items-center p-[1px]">
                <div className="bg-white h-full w-[80%] rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-40 border border-white/10" />

          {/* Screen Content */}
          <div className="p-5 pt-14 flex flex-col h-full">
            <Logo className="text-sm mb-2" />
            <div className="text-xs text-white/40 mb-6 font-medium">
              Accepting Requests
            </div>

            {/* Request Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-2xl p-5 mb-5 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="text-xl font-bold tracking-tight text-white">
                  5,000 <span className="text-white/50 font-medium">USDT</span>
                </div>
                <div className="px-2 py-1 bg-[#ff6b35]/20 rounded-full text-[10px] text-white/80 font-bold border border-[#ff6b35]/30">
                  +0.5%
                </div>
              </div>
              <div className="text-sm text-white/40 font-medium mb-8">
                AED → USDT
              </div>
              <div className="text-xs text-white/30 mb-3 italic">
                Accept within 1 min
              </div>
              <button className="w-full py-2.5 bg-white text-black text-sm font-bold rounded-full mb-3 shadow-[0_4px_20px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_30px_rgba(255,255,255,0.4)] transition-all">
                Accept Request
              </button>
              <div className="flex gap-2 text-[10px] text-white/50 font-medium">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Escrow-secured
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  On-chain
                </span>
              </div>
            </motion.div>

            {/* Security bar */}
            <div className="mt-auto mb-6 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/80">
                ✓ SECURED
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/80">
                ✓ VERIFIED
              </div>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ==================== Dashboard Mockup Component ==================== */
const DashboardMockup = () => {
  return (
    <motion.div
      className="relative w-full max-w-[460px]"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-br from-[#ff6b35]/10 via-purple-500/10 to-blue-500/10 blur-3xl rounded-3xl opacity-60" />

      <div className="relative w-full h-[560px] backdrop-blur-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#ff6b35] rounded-full shadow-[0_0_10px_rgba(255,107,53,0.6)]" />
            <span className="text-sm font-semibold text-white">
              blip. <span className="text-[#ff6b35]">money</span>
            </span>
          </div>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b35] shadow-[0_0_8px_rgba(255,107,53,0.5)]" />
          </div>
        </div>

        {/* Amount Section */}
        <div className="relative z-10 flex justify-between items-start mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs text-white/60 font-medium mb-4 border border-white/10"
            >
              Request Accepted
            </motion.div>
            <div className="text-4xl font-bold text-white">
              5,000 <span className="text-white/40">USDT</span>
            </div>
            <div className="text-xs text-white/30 mt-2 font-medium">
              Corridor AED ~ USDT
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
              <Lock className="w-3.5 h-3.5" />
              Escrow Locked
            </div>
            <div className="text-sm font-bold text-[#ff6b35]">88.5%</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative z-10 mb-10">
          <div className="text-xs text-white/30 font-bold uppercase tracking-wider mb-6">
            Overview
          </div>
          <div className="relative pl-8 space-y-8">
            {/* Timeline line */}
            <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-gradient-to-b from-white/20 via-[#ff6b35]/40 to-white/10" />

            {[
              { label: "Request Created", time: "09:41", active: false },
              { label: "Request Accepted", time: "09:42", active: false },
              { label: "Escrow Locked", time: "09:43", active: true },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
                className="flex justify-between items-center relative"
              >
                <div
                  className={`absolute -left-8 w-4 h-4 rounded-full border-2 ${
                    step.active
                      ? "bg-[#ff6b35] border-[#ff6b35] shadow-[0_0_12px_rgba(255,107,53,0.6)]"
                      : "bg-white/10 border-white/30"
                  }`}
                />
                <div
                  className={`flex-1 text-sm font-medium ${
                    step.active ? "text-white" : "text-white/60"
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-xs text-white/30 font-mono">
                  {step.time}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Merchant Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="relative z-10 border-t border-white/5 pt-8"
        >
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b35]/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                <Users className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  PrimeX Holdings
                </div>
                <div className="text-xs text-white/60 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Active now
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white">
                5,000 <span className="text-white/40">USDT</span>
              </div>
              <div className="text-xs text-[#ff6b35]">★ 4.95</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CinematicHero;
