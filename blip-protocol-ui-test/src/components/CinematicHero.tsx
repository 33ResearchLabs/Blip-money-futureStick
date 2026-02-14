import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Percent, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import { GlobeVisualization } from "./visuals/GlobeVisualization";
import { MicroIcon } from "./visuals/MicroIcon";
import { CTAButton } from "./Navbar";

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
            // maskImage: `radial-gradient(circle 1000px at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0) 100%)`,
            // WebkitMaskImage: `radial-gradient(circle 1000px at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0) 100%)`,
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

        {/* Globe network visualization */}
        {/* <GlobeVisualization /> */}
      </div>

      <main className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 text-center pt-12 sm:pt-0">
        {/* Small label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <span className="text-[11px]  uppercase tracking-[0.3em] text-black dark:text-white/30 font-semibold">
            The settlement protocol
          </span>
        </motion.div>

        {/* Main heading - massive, clean */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-black dark:text-white leading-[0.95] tracking-[-0.04em] text-[clamp(38px,8vw,96px)] mb-8"
        >
          The settlement layer
          <br />
          <span className="text-black/80 dark:text-white/50">
            for{" "}
            <span className="relative inline-block">
              <span className="relative z-10">borderless</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[1.5px] rounded-full bg-gradient-to-r from-[#ff6b35]/60 via-[#ff8f5e]/50 to-[#ff6b35]/20"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 1.2,
                  delay: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </span>{" "}
            money.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-black dark:text-white/40 text-base sm:text-lg font-medium max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Users buy and sell crypto. Merchants provide liquidity.
          <br />
          Blip settles instantly.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center gap-8 sm:gap-20 mb-14 mx-4"
        >
          {[
            { value: "~2s", label: "Settlement", icon: Clock },
            { value: "0.1%", label: "Fees", icon: Percent },
            { value: "150+", label: "Countries", icon: Globe2 },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center ">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MicroIcon
                  icon={stat.icon}
                  variant="pulse"
                  size={14}
                  delay={i * 0.2}
                />
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
          {/* <Link
            to="/waitlist"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-3 w-[240px] h-[56px] rounded-full bg-black dark:bg-white text-white dark:text-black text-base font-semibold transition-all duration-300"
          >
            <span className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link> */}
          <CTAButton to="/join-waitlist" className="w-[220px] h-[48px]">
            Get Started
          </CTAButton>
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
