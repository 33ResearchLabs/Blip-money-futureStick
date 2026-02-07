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
        {/* ================= TEXT SECTION ================= */}
        <div
          ref={textLayerRef}
          className="w-full my-24 md:my-0 lg:w-1/2 antigravity-layer text-center lg:text-left"
        >
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="
              font-bold text-white leading-[1.1] tracking-tight
              text-[clamp(32px,5vw,80px)]
              max-w-[720px] mx-auto lg:mx-0
            "
          >
            Send money anywhere,
            <br />
            <span className="text-white/40">anytime.</span>
          </motion.h1>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start mb-6"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a]" />
              <span className="text-xs text-white/50">Powered by</span>
              <span className="text-xs font-semibold text-white">Solana</span>
            </div>
          </motion.div>
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-white/50 text-lg max-w-lg mx-auto lg:mx-0"
          >
            Fast, borderless transfers using crypto rails. Connect your wallet,
            enter an amount, and send globally in seconds.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center lg:justify-start gap-12 mt-10"
          >
            {[
              { value: "~2s", label: "Settlement" },
              { value: "0.1%", label: "Fees" },
              { value: "150+", label: "Countries" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ================= DASHBOARD ================= */}
        <MerchantDashboardCompact />
      </main>
    </section>
  );
};

export default CinematicHero;
