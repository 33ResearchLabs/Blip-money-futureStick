import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { MerchantDashboardVisual } from "../MerchantDashboard";
import { HeroDashboardVisual } from "../HeroDashbaordVisual";

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
      className="relative min-h-screen overflow-hidden bg-transparent"
    >
      {/* Main Hero Content - 2-column Layout on Desktop */}
      <main className="relative z-10 pt-20 md:pt-24 lg:pt-20 pb-16 md:pb-20 lg:pb-32 px-4 md:px-8 lg:px-10 max-w-7xl mx-auto flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-center md:items-start lg:items-center justify-center md:justify-center lg:justify-start gap-6 md:gap-8 lg:gap-12">
        {/* ==================== Phone Mockup (1st on mobile, 1st on desktop) ==================== */}

        {/* ==================== Text Content (2nd on mobile, 2nd on desktop) ==================== */}
        <div
          className="w-full  px-4 pb-20 sm:pb-28  lg:pb-4 lg:px-4 antigravity-layer order-2 relative z-20"
          ref={textLayerRef}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="
text-3xl md:text-4xl lg:text-5xl xl:text-6xl
    font-bold text-white
    leading-[1.15]
    mb-4 md:mb-6 lg:mb-8
    tracking-tight
    max-w-2xl
    mx-auto md:mx-0
  "
          >
            On-demand crypto <span className="text-white/20">settlement</span>,
            executed by merchants.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base lg:text-[17px] text-white/50 leading-relaxed mb-6 md:mb-8 lg:mb-10 max-w-md mx-auto md:mx-0 lg:mx-0"
          >
            Users create requests.{" "}
            <strong className="text-white/70">Merchants accept</strong>, price,
            and settle off-chain.{" "}
            <strong className="text-white/70">Escrow-secured</strong>, on-chain
            verified.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start lg:justify-start gap-3 md:gap-4"
          >
            <Link
              to="/coming-soon"
              className="gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-white text-black font-bold text-[14px] md:text-[15px] rounded-full transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1"
            >
              Become a Merchant
            </Link>
            <Link
              to="/join-waitlist"
              className="gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 btn-pill-outline-hero font-bold text-[14px] md:text-[15px] bg-transparent hover:border-white/30"
            >
              Join Waitlist
            </Link>
          </motion.div>
        </div>
      </main>

      {/* ==================== Dashboard Panel - Outside main for proper z-index overlap ==================== */}
      <div
      // className="hidden md:block absolute  xl:right-36 top-6 md:top-16 lg:top-6 z-0 antigravity-layer"
      // ref={dashboardLayerRef}
      >
        <HeroDashboardVisual>
          <MerchantDashboardVisual />
        </HeroDashboardVisual>
      </div>
    </section>
  );
};
