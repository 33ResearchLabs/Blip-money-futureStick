import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================
   SECTION 9: EARLY ADOPTER BANNER
   ============================================ */

const EarlyAdopterBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.95, 1, 1, 0.95]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Animated counter for tokens
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < 100) {
        setCount((prev) => Math.min(prev + 2, 100));
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [count]);

  const rewards = [
    {
      icon: "🎁",
      label: "Welcome Bonus",
      value: "$50",
      desc: "Connect wallet",
    },
    {
      icon: "🚀",
      label: "First Transfer",
      value: "$25",
      desc: "Complete a transaction",
    },
    { icon: "👥", label: "Referral", value: "$25", desc: "Invite a friend" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-12 md:py-40 bg-black overflow-hidden"
    >
      {/* Dramatic background */}
      <div className="absolute inset-0">
        {/* Central glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)",
          }}
        />
        {/* Animated rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6"
        style={{ opacity, scale }}
      >
        {/* Main content card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 50%, rgba(0,0,0,0.5) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Inner glow effect */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-[120px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative p-8 md:p-12 lg:p-16">
            {/* Header */}
            <div className="text-center mb-12">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <motion.div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
                <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-medium">
                  Limited Time Offer
                </span>
              </motion.div>

              {/* Big animated number */}
              <div className="mb-4 sm:mb-6">
                <motion.div
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #cccccc 50%, #999999 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 80px rgba(255,255,255,0.2)",
                  }}
                >
                  ${count}
                </motion.div>
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mt-2">
                  in Blip Tokens
                </div>
              </div>

              <p className="text-sm sm:text-base md:text-lg text-white/50 max-w-lg mx-auto px-4">
                Early supporters get rewarded. Connect your wallet and start
                earning today.
              </p>
            </div>

            {/* Rewards breakdown */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-12">
              {rewards.map((reward, i) => (
                <motion.div
                  key={reward.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="relative p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center group hover:border-white/20 transition-all"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/0 group-hover:bg-white/[0.03] transition-all" />

                  <div className="relative">
                    <span className="text-2xl sm:text-4xl mb-2 sm:mb-4 block">
                      {reward.icon}
                    </span>
                    <div className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">
                      {reward.value}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-white mb-0.5 sm:mb-1">
                      {reward.label}
                    </div>
                    <div className="text-[10px] sm:text-xs text-white/40 hidden sm:block">
                      {reward.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/join-waitlist"
                  className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white text-black text-sm sm:text-base font-semibold hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300"
                >
                  <span>Claim Your Tokens</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <Link
                to="/rewards"
                className="text-sm text-white/50 hover:text-white/80 transition-colors underline underline-offset-4"
              >
                View all rewards →
              </Link>
            </div>

            {/* Stats footer */}
            <div className="mt-12 pt-8 border-t border-white/[0.06]">
              <div className="grid grid-cols-3  items-center justify-center gap-8 md:gap-16">
                {[
                  { value: "2,847", label: "Early adopters" },
                  { value: "$284K", label: "Tokens distributed" },
                  { value: "12days", label: "Until deadline" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xs sm:text-xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-[9px] sm:text-xs text-white/40 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EarlyAdopterBanner;
