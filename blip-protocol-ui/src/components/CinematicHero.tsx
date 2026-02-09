import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Percent, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import { GlobeVisualization } from "./visuals/GlobeVisualization";
import { MicroIcon } from "./visuals/MicroIcon";

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
            opacity: 0.2,
            maskImage: `radial-gradient(circle 900px at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0) 100%)`,
            WebkitMaskImage: `radial-gradient(circle 900px at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0) 100%)`,
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

        {/* Globe network visualization */}
        <GlobeVisualization />
      </div>

      <main className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 text-center">
        {/* Small label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-black dark:text-white/30 font-semibold">
            The settlement protocol
          </span>
        </motion.div>

        {/* Main heading - massive, clean */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-black dark:text-white leading-[0.95] tracking-[-0.04em] text-[clamp(48px,10vw,120px)] mb-8"
        >
          Send money
          <br />
          <span className="text-black/80 dark:bg-gradient-to-r dark:from-white/50 dark:via-white/35 dark:to-white/50 dark:bg-clip-text dark:text-transparent">anywhere.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-black dark:text-white/40 text-base sm:text-lg font-medium max-w-md mx-auto mb-12 leading-relaxed"
        >
          Fast, borderless transfers on Solana.
          <br className="hidden sm:block" />
          No banks. No delays. Sub-second settlement.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center gap-16 sm:gap-20 mb-14"
        >
          {[
            { value: "~2s", label: "Settlement", icon: Clock },
            { value: "0.1%", label: "Fees", icon: Percent },
            { value: "150+", label: "Countries", icon: Globe2 },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MicroIcon icon={stat.icon} variant="pulse" size={14} delay={i * 0.2} />
                <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight">
                  {stat.value}
                </div>
              </div>
              <div className="text-[10px] text-black dark:text-white/30 uppercase tracking-[0.2em] font-semibold mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center"
        >
          <Link
            to="/send"
            className="group inline-flex items-center justify-center gap-3 w-[240px] h-[56px] rounded-full bg-black dark:bg-white text-white dark:text-black text-base font-semibold hover:bg-black/90 dark:hover:bg-white/90 transition-all duration-300"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
