import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, Users } from "lucide-react";
import StarfieldBackground from "./StarfieldBackground";
import { Logo } from "./Navbar";

/**
 * CinematicHero - 3-column layout with parallax mouse tracking
 * Matches the blip.money design with iPhone mockup, center text, and dashboard panel
 */
const CinematicHero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const phoneLayerRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const dashboardLayerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax/antigravity effect
  useEffect(() => {
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
            moveX * 0.5
          }px, ${moveY * 0.5}px, 0)
           rotateX(${moveY * 2}deg) rotateY(${-moveX * 2}deg)`;
        }

        if (textLayerRef.current) {
          textLayerRef.current.style.transform = `translate3d(${
            moveX * 0.3
          }px, ${moveY * 0.3}px, 0)`;
        }

        if (dashboardLayerRef.current) {
          const rx = Math.max(-6, Math.min(6, moveY * 2));
          const ry = Math.max(-6, Math.min(6, -moveX * 2));

          dashboardLayerRef.current.style.transform = `translate3d(${
            moveX * 0.4
          }px, ${moveY * 0.4}px, 0)
           rotateX(${rx}deg) rotateY(${ry}deg)`;
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
    <section
      ref={ref}
      className="relative min-h-screen overflow-x-hidden overflow-y-visible bg-transparent"
    >
      {/* Main Hero Content - 3-column Layout on Desktop */}
      <main
        className="relative min-h-screen z-10 pt-10 sm:pt-24 md:pt-28 lg:pt-0 px-4 md:px-10 
             max-w-[1600px] mx-auto flex flex-col lg:flex-row 
             items-center justify-center gap-8 lg:gap-6"
        style={{ perspective: "1200px" }}
      >
        {/* only phone screen show  */}
        <div
          className="w-full lg:w-1/3 text-center lg:text-left px-4 lg:px-4 antigravity-layer order-1 md:hidden"
          ref={textLayerRef}
        >
          <div className="">
            {/* Powered by crypto badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center justify-center sm:py-2 lg:justify-start gap-2 mb-0 sm:mb-4"
            >
              <div className="flex items-center gap-2 px-3 my-3 sm:my-0 py-1.5 sm:py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
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
                <span className="text-xs font-semibold text-white">Solana</span>
              </div>
            </motion.div>
          </div>
          <div className="w-full text-center lg:text-left mt-0 sm:mt-12 lg:mt-0 pb-2 md:pb-24 sm:pb-0">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight max-w-xl mx-auto lg:mx-0"
            >
              {/* Mobile */}
              <span className="block sm:hidden">
                Send money anywhere
                <br />
                <span className="text-white/40">anytime.</span>
              </span>

              {/* Desktop */}
              <span className="hidden sm:inline">
                Send money anywhere,
                <br />
                <span className="text-white/40">anytime.</span>
              </span>
            </motion.h1>
          </div>
        </div>

        {/* ==================== Phone Mockup (1st on mobile, 1st on desktop) ==================== */}
        <div
          className="w-full lg:w-1/3 flex justify-center order-2 md:order-1 antigravity-layer relative z-20 "
          ref={phoneLayerRef}
        >
          <div className="phone-container-hero animate-float-hero reflect-hero ">
            <div className="relative w-[250px] sm:w-[280px] h-[430px] sm:h-[570px] iphone-bezel rounded-[3.5rem] p-[8px]">
              {/* iPhone physical buttons */}

              {/* Screen */}
              <div className="w-full h-full bg-black rounded-[3.2rem] relative overflow-hidden ring-1 ring-white/10">
                <div className="iphone-reflection" />

                {/* Status bar */}
                <div className="absolute top-0 left-0 w-full h-12 flex items-center justify-between px-8 z-30">
                  <div className="text-[12px] font-bold text-white">9:41</div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 18 12"
                      fill="white"
                    >
                      <path d="M0 10.5C0 10.2239 0.223858 10 0.5 10H1.5C1.77614 10 2 10.2239 2 10.5V11.5C2 11.7761 1.77614 12 1.5 12H0.5C0.223858 12 0 11.7761 0 11.5V10.5Z" />
                      <path d="M4 8.5C4 8.22386 4.22386 8 4.5 8H5.5C5.77614 8 6 8.22386 6 8.5V11.5C6 11.7761 5.77614 12 5.5 12H4.5C4.22386 12 4 11.7761 4 11.5V8.5Z" />
                      <path d="M8 5.5C8 5.22386 8.22386 5 8.5 5H9.5C9.77614 5 10 5.22386 10 5.5V11.5C10 11.7761 9.77614 12 9.5 12H8.5C8.22386 12 8 11.7761 8 11.5V5.5Z" />
                      <path d="M12 2.5C12 2.22386 12.2239 2 12.5 2H13.5C13.7761 2 14 2.22386 14 2.5V11.5C14 11.7761 13.7761 12 13.5 12H12.5C12.2239 12 12 11.7761 12 11.5V2.5Z" />
                    </svg>
                    <div className="w-6 h-3 rounded-[2px] border border-white/40 relative flex items-center p-[1px]">
                      <div className="bg-white h-full w-[80%] rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-40 border border-white/5" />

                {/* Screen Content */}
                <div className="p-3 pt-10 sm:pt-14 flex flex-col h-full">
                  <Logo className="text-sm" />
                  <div className="text-[11px] text-white/40 mb-2 sm:mb-6 font-medium px-2 py-2">
                    Accepting Requests
                  </div>

                  {/* Request Card */}
                  <div className="glass-card-dark-hero rounded-2xl p-5 mb-5 border border-white/10 shadow-2xl">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-base sm:text-lg font-extrabold tracking-tighter text-white">
                        5,000{" "}
                        <span className="text-white/50 font-medium text-base sm:text-lg px-1">
                          USDT
                        </span>
                      </div>
                      <div className="mt-2 text-[9px] bg-orange-500/20 px-2 py-0.5 rounded-full text-white/70 font-bold border border-orange-500/20">
                        +0.5%
                      </div>
                    </div>
                    <div className="text-[13px] text-white/40 font-medium mb-4 sm:mb-10">
                      AED → USDT
                    </div>
                    <div className="text-[11px] text-white/30 mb-3 italic font-medium">
                      Accept within 1 min
                    </div>
                    <button className="w-full py-1.5 bg-white text-black text-[14px] font-black rounded-full mb-3 shadow-[0_4px_12px_rgba(255,255,255,0.2)]">
                      Accept Request
                    </button>
                    <div className=" flex  gap-2 text-[9px] text-white/50 font-medium">
                      <span className="flex items-center gap-1">
                        ✓ Escrow-secured
                      </span>
                      <span className="flex items-center gap-1">
                        ✓ Visible on-chain
                      </span>
                    </div>
                  </div>

                  {/* Bottom security bar */}
                  <div className="mt-2 mb-8 mx-2 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-5">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-white/80">
                      ✓ SECURED
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-white/80">
                      ✓ VERIFIED
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== Text Content (2nd on mobile, 2nd on desktop) ==================== */}
        <div
          className="w-full lg:w-1/3 text-center lg:text-left px-4 lg:px-4 antigravity-layer order-3 lg:order-2"
          ref={textLayerRef}
        >
          <div className="w-full text-center lg:text-left mt-2 sm:mt-12 lg:mt-0 pb-2 sm:pb-24 ">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="hidden md:block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight max-w-xl mx-auto lg:mx-0"
            >
              {/* Mobile */}
              <span className="block sm:hidden">
                Send money anywhere
                <br />
                <span className="text-white/40">anytime.</span>
              </span>

              {/* Desktop */}
              <span className="hidden sm:inline">
                Send money anywhere,
                <br />
                <span className="text-white/40">anytime.</span>
              </span>
            </motion.h1>

            <div className="">
              {/* Powered by crypto badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="hidden md:flex items-center justify-center sm:py-2 lg:justify-start gap-2 mb-6 sm:mb-4"
              >
                <div className="flex items-center gap-2 px-3 my-3 sm:my-0 sm:py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
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
                className="text-white/50 text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0"
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
                className="flex items-center justify-center lg:justify-center gap-12 mb-10 sm:mb-12"
              >
                {[
                  { value: "~2s", label: "Settlement" },
                  { value: "0.1%", label: "Fees" },
                  { value: "150+", label: "Countries" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/40 uppercase tracking-widest font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="hidden mt-12 sm:mt-16 lg:flex items-center justify-center gap-3"
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
            </div>
          </div>
        </div>

        {/* ==================== Dashboard Panel (3rd on mobile, 3rd on desktop) ==================== */}
        <div
          className="w-full px-2 sm:px-0 lg:w-1/3 flex justify-center antigravity-layer order-4 lg:order-3"
          ref={dashboardLayerRef}
        >
          <div
            className="dashboard-container-hero animate-float-hero reflect-hero w-full max-w-[420px] xl:max-w-[460px]"
            style={{ animationDelay: "1s" }}
          >
            <div className="w-full h-[520px] xl:h-[560px] glass-panel-hero rounded-3xl p-4 sm:p-6 xl:p-8 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 xl:mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-[#ff6b35] rounded-full" />
                  <span className="text-sm font-medium text-white">
                    blip. <span className="text-[#ff6b35]">money</span>
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-orange-500/40 shadow-[0_0_8px_rgba(249,115,22,0.3)]" />
                </div>
              </div>

              {/* Amount Section */}
              <div className="flex justify-between items-start mb-8 xl:mb-10">
                <div>
                  <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-[11px] text-white/60 font-medium mb-4">
                    Request Accepted
                  </div>
                  <div className="text-3xl xl:text-4xl font-bold">
                    5,000 <span className="text-white/40">USDT</span>
                  </div>
                  <div className="text-xs text-white/30 mt-2">
                    Corridor AED ~ USDT
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[11px] text-white/60 mb-1">
                    <Lock className="w-3 h-3" />
                    Escrow Locked
                  </div>
                  <div className="text-[13px] font-bold text-white/70">
                    88.5%
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-8 xl:mb-10">
                <div className="text-[11px] text-white/30 font-bold uppercase tracking-wider mb-5 xl:mb-6">
                  Overview
                </div>
                <div className="relative pl-8 space-y-6 xl:space-y-8">
                  <div className="hero-timeline-line" />

                  <div className="flex justify-between items-center relative">
                    <div className="hero-timeline-dot" />
                    <div className="flex-1 ml-4 text-[13px] font-medium text-white/80">
                      Request Created
                    </div>
                    <div className="text-[11px] text-white/30 font-mono">
                      09:41
                    </div>
                  </div>

                  <div className="flex justify-between items-center relative">
                    <div className="hero-timeline-dot" />
                    <div className="flex-1 ml-4 text-[13px] font-medium text-white/80">
                      Request Accepted
                    </div>
                    <div className="text-[11px] text-white/30 font-mono">
                      09:42
                    </div>
                  </div>

                  <div className="flex justify-between items-center relative">
                    <div className="hero-timeline-dot active" />
                    <div className="flex-1 ml-4 text-[13px] font-bold text-white">
                      Escrow Locked
                    </div>
                    <div className="text-[11px] text-white/30 font-mono">
                      09:43
                    </div>
                  </div>
                </div>
              </div>

              {/* Merchant Card */}
              <div className="border-t border-white/5 pt-6 xl:pt-8">
                <div className="glass-card-dark-hero rounded-2xl p-4 flex items-center justify-between transition-all hover:border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Users className="w-4 h-4 opacity-50" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold">
                        PrimeX Holdings
                      </div>
                      <div className="text-[10px] text-white/80">
                        Active now
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-bold">
                      5,000 <span className="text-white/40">USDT</span>
                    </div>
                    <div className="text-[10px] text-white/60">★ 4.95</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="lg:hidden order-5 md:order-4 mt-12 sm:mt-16 flex items-center justify-center gap-3"
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
      </main>
    </section>
  );
};

export default CinematicHero;
