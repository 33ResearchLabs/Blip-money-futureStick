import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Lock, Users } from "lucide-react";
import StarfieldBackground from "./StarfieldBackground";
import { Logo } from "./Navbar";
import { MerchantDashboardCompact } from "./MerchantDashboardCompact";

const CinematicHero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const textLayerRef = useRef<HTMLDivElement>(null);
  const phoneLayerRef = useRef<HTMLDivElement>(null);
  const dashboardLayerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax (text + dashboard only)
  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (e.clientX - centerX) / centerX;
        const moveY = (e.clientY - centerY) / centerY;

        if (textLayerRef.current) {
          textLayerRef.current.style.transform = `translate3d(${
            moveX * 0.25
          }px, ${moveY * 0.25}px, 0)`;
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
      className="relative min-h-screen overflow-x-hidden bg-transparent"
    >
      <main
        className="
          relative z-10 min-h-screen
          px-4 md:px-10
          max-w-[1400px] mx-auto
          flex flex-col lg:flex-row
          items-center justify-center
          gap-12
        "
        style={{ perspective: "1200px" }}
      >
        sss{/* ==================== Text Content (2nd on mobile, 2nd on desktop) ==================== */}
        <div className="w-full lg:w-1/3 text-center lg:text-left px-4 lg:px-4 antigravity-layer order-3 lg:order-2">
          <div className="w-full text-center lg:text-left mt-2 sm:mt-12  lg:mt-0 pb-2 lg:pb-24 ">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="hidden lg:block text-3xl sm:text-4xl  md:text-5xl lg:text-6xl  font-bold text-white leading-tight tracking-tight max-w-xl mx-auto lg:mx-0"
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
            </motion.p>

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
                className="hidden lg:flex items-center justify-center sm:py-2 lg:justify-start gap-2 mb-6 sm:mb-4"
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
            <MerchantDashboardCompact />
          </div>
        </div>
      </main>
    </section>
  );
};

export default CinematicHero;
