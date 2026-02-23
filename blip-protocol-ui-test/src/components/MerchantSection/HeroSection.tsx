import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MerchantDashboardVisual,
  MerchantHeroDashbaord,
} from "../MerchantDashboard";
import { HeroDashboardVisual } from "../HeroDashbaordVisual";
import { CTAButton } from "../Navbar";

/**
 * CinematicHero - 3-column layout with parallax mouse tracking
 * Matches the blip.money design with iPhone mockup, center text, and dashboard panel
 */
export const CinematicHeroOfMerchant = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const phoneLayerRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const dashboardLayerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax/antigravity effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) / centerX;
      const moveY = (e.clientY - centerY) / centerY;

      // Phone layer - more movement
      if (phoneLayerRef.current) {
        const x = moveX * 25 * 0.02;
        const y = moveY * 25 * 0.02;
        const rotationX = moveY * 10 * 0.02;
        const rotationY = -moveX * 10 * 0.02;
        phoneLayerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      }

      // Text layer - subtle movement
      if (textLayerRef.current) {
        const x = moveX * 25 * 0.01;
        const y = moveY * 25 * 0.01;
        textLayerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      // Dashboard layer - medium movement
      if (dashboardLayerRef.current) {
        const x = moveX * 25 * 0.015;
        const y = moveY * 25 * 0.015;
        const rotationX = moveY * 10 * 0.015;
        const rotationY = -moveX * 10 * 0.015;
        dashboardLayerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-[#FAF8F5] dark:bg-transparent"
    >
      {/* Main Hero Content - 2-column Layout on Desktop */}
      <main className="relative z-10 pt-20 md:pt-24 lg:pt-20 pb-20  lg:pb-36 px-4 md:px-8 lg:px-10 max-w-7xl mx-auto flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-center md:items-start lg:items-center justify-center md:justify-center lg:justify-start gap-6 md:gap-8 lg:gap-12">
        {/* ==================== Phone Mockup (1st on mobile, 1st on desktop) ==================== */}

        {/* ==================== Text Content (2nd on mobile, 2nd on desktop) ==================== */}
        <div
          ref={textLayerRef}
          className="w-full pt-20 px-4 pb-20 sm:pb-28 lg:pb-4 lg:px-4 antigravity-layer order-2 relative z-20 text-center
  "
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <span className="text-[11px]  uppercase tracking-[0.3em] text-black dark:text-white/30 font-semibold">
              The merchant protocol
            </span>
          </motion.div>
          <motion.h1 className=" font-display font-bold text-black dark:text-white leading-[0.95] tracking-[-0.04em] text-[clamp(38px,8vw,96px)] mx-auto text-center py-12 mb-8 ">
            The settlement layer
            <br /> for{" "}
            <span className="text-black/80 dark:text-white/50">
              borderless
            </span>{" "}
            money.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-black dark:text-white/40 text-base sm:text-lg max-w-md mx-auto mb-12 leading-relaxed font-medium"
          >
            Users create requests.{" "}
            <strong className="text-black/70 dark:text-white/70">
              Merchants accept
            </strong>
            , price, and settle off-chain.{" "}
            <strong className="text-black/70 dark:text-white/70">
              Escrow-secured
            </strong>
            , on-chain verified.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
          >
            {/* <Link
    to="/coming-soon"
    className="inline-flex items-center justify-center gap-3
      px-10 py-4
      min-h-[52px] w-[220px]
      rounded-full
      bg-white text-black
      text-sm font-semibold
      transition-all duration-300
      hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]
      hover:-translate-y-1"
  >
    Become a Merchant
  </Link> */}
            {/* <CTAButton to="/waitlist" className="w-[225px]  h-[48px]">
              Become a Merchant
            </CTAButton> */}

            {/* <Link
    to="/waitlist"
    className="group inline-flex items-center justify-center gap-3
      px-10 py-4
      min-h-[52px] w-[220px]
      rounded-full
      border border-white/20
      text-white
      text-sm font-semibold
      hover:bg-white/10
      transition-all duration-300"
  >
    Join Waitlist
  </Link> */}
            <CTAButton to="/merchant-waitlist" className="w-[225px]  h-[48px]">
              Join Waitlist
            </CTAButton>
          </motion.div>
        </div>
      </main>

      {/* ==================== Dashboard Panel - Outside main for proper z-index overlap ==================== */}
      <div
      // className="hidden md:block absolute  xl:right-36 top-6 md:top-16 lg:top-6 z-0 antigravity-layer"
      // ref={dashboardLayerRef}
      >
        <HeroDashboardVisual>
          <MerchantHeroDashbaord />
        </HeroDashboardVisual>
      </div>
    </section>
  );
};
