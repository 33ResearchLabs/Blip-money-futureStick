import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================
   SECTION 3: REWARDS TEASER - Elegant minimal banner
   ============================================ */

const CashbackBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative md:py-32 py-10 bg-black overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 60%)",
            x: useTransform(scrollYProgress, [0, 1], [-100, 100]),
          }}
        />
      </div>

      {/* Floating coins animation */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute  w-1 h-1 rounded-full bg-white/60"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Horizontal animated lines */}
      <motion.div
        className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ x }}
      />
      <motion.div
        className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ x: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
      />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6"
        style={{ opacity }}
      >
        <div className="relative p-8 md:p-12 rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-sm overflow-hidden">
          {/* Inner glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-2xl">💰</span>
                </motion.div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 block">
                    Early Access
                  </span>
                  <span className="text-xs text-white/40">
                    Limited spots available
                  </span>
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Earn while you{" "}
                <span className="relative">
                  <span className="relative z-10 text-white/60">spend.</span>
                  <motion.span
                    className="absolute bottom-1 left-0 right-0 h-3 bg-white/10 rounded-sm -z-0"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </span>
              </h3>

              <p className="text-white/50 text-base max-w-md mb-6 leading-relaxed">
                Up to{" "}
                <span className="text-white font-semibold">
                  5% cashback
                </span>{" "}
                in BLIP tokens on every payment. No tiers. No complexity.
              </p>

              {/* Mini stats */}
              <div className="flex items-center gap-6">
                {[
                  { value: "5%", label: "Max Cashback" },
                  { value: "0", label: "Min Spend" },
                  { value: "∞", label: "Rewards Cap" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col items-center gap-4"
            >
              {/* Animated percentage circle */}
              {/* Percentage circle */}
              <div className="relative w-28 h-28">
                {/* ROTATING OUTER RING */}
                <motion.svg
                  className="w-full h-full -rotate-90"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3, // ⬅ slower & calm
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                  }}
                  style={{
                    transformOrigin: "50% 50%",
                    willChange: "transform",
                  }}
                >
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="4"
                  />

                  <motion.circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="314"
                    initial={{ strokeDashoffset: 314 }}
                    whileInView={{ strokeDashoffset: 157 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />

                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#cccccc" />
                    </linearGradient>
                  </defs>
                </motion.svg>

                {/* STATIC CENTER TEXT */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">5%</span>
                </div>
              </div>

              <Link
                to="/rewards"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300"
              >
                <span>View Rewards</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CashbackBanner;
