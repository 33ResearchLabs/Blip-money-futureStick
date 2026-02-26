import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CinematicHero = () => {
  const ref = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const rect = (ref.current as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      return () => element.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-[#FAF8F5] dark:bg-black flex items-center justify-center"
    >
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Merchant dashboard background - dark mode only, revealed where mouse is */}
        <div
          className="absolute inset-0 transition-all duration-150 ease-out hidden dark:block"
          style={{
            opacity: 0.65,
            maskImage: `radial-gradient(ellipse 380px 300px at ${mousePosition.x}% ${mousePosition.y}%,
  rgba(0,0,0,0.75) 0%,
  rgba(0,0,0,0.65) 25%,
  rgba(0,0,0,0.45) 50%,
  rgba(0,0,0,0.25) 70%,
  rgba(0,0,0,0.05) 90%,
  rgba(0,0,0,0) 100%)`,

            WebkitMaskImage: `radial-gradient(ellipse 380px 300px at ${mousePosition.x}% ${mousePosition.y}%,
  rgba(0,0,0,0.75) 0%,
  rgba(0,0,0,0.65) 25%,
  rgba(0,0,0,0.45) 50%,
  rgba(0,0,0,0.25) 70%,
  rgba(0,0,0,0.05) 90%,
  rgba(0,0,0,0) 100%)`,
          }}
        >
          <img
            src="/images/merchant-dashboard.png"
            alt=""
            className="w-full h-full object-contain object-center"
          />
        </div>

        {/* Dark gradient edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/60 dark:from-black/60 via-transparent to-[#FAF8F5]/60 dark:to-black/60" />
      </div>

      <main className="relative z-10 w-full max-w-[900px] mx-auto px-6 md:px-10 text-center pt-12 sm:pt-0">
        {/* Small label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-10 sm:mb-14"
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-black dark:text-white/30 font-semibold">
            The settlement protocol · Powered by Blip
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-black dark:text-white leading-[1.1] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-10 sm:mb-14"
        >
          Instant merchant-to-merchant
          <br />
          <span className="text-black/80 dark:text-white/50">
            crypto{" "}
            <span className="text-black dark:text-white font-extrabold">
              settlement.
            </span>
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-black/60 dark:text-white/35 text-base sm:text-lg font-medium max-w-xl mx-auto mb-12 leading-relaxed tracking-wide"
        >
          No banks. No delays. Global liquidity.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/waitlist"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-3 w-[240px] h-[56px] rounded-full bg-black dark:bg-white text-white dark:text-black text-base font-semibold transition-all duration-300 ring-1 ring-black/[0.10] hover:ring-black/[0.20] dark:ring-white/[0.10] dark:hover:ring-white/[0.20]"
          >
            <span className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
            <span className="relative z-10">Join Waitlist</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/merchant"
            className="inline-flex items-center justify-center w-[240px] h-[56px] rounded-full border border-black/20 dark:border-white/20 text-black/80 dark:text-white/50 text-base font-medium hover:border-black/40 dark:hover:border-white/40 hover:text-black dark:hover:text-white/70 transition-all duration-300"
          >
            Become a Merchant
          </Link>

          <Link
            to="/protocol"
            className="inline-flex items-center gap-1.5 text-sm text-black/40 dark:text-white/30 font-medium hover:text-black/70 dark:hover:text-white/50 transition-colors duration-300"
          >
            View Protocol
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Subtle bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-20 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent"
        />
      </main>
    </section>
  );
};

export default CinematicHero;
