import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Globe, Shield, Zap } from "lucide-react";
import { CTAButton } from "../Navbar";
import sounds from "@/lib/sounds";

/* ============================================
   SECTION 5: BLIP PROTOCOL
   ============================================ */

const ProtocolSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotateGlow = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      ref={containerRef}
      className="relative md:py-40 py-12 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      {/* Apple-style mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large soft color blobs - visible in light, muted in dark */}
        <motion.div
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full opacity-[0.15] dark:opacity-[0.05]"
          style={{
            background:
              "radial-gradient(circle, rgba(120,119,255,0.8) 0%, rgba(120,119,255,0) 70%)",
            y,
          }}
        />
        <motion.div
          className="absolute top-[10%] -left-[15%] w-[700px] h-[700px] rounded-full opacity-[0.12] dark:opacity-[0.04]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)",
            y: useTransform(scrollYProgress, [0, 1], [-40, 40]),
          }}
        />
        <motion.div
          className="absolute -bottom-[15%] left-[20%] w-[900px] h-[600px] rounded-full opacity-[0.1] dark:opacity-[0.04]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(52,199,165,0.7) 0%, rgba(52,199,165,0) 70%)",
            rotate: rotateGlow,
          }}
        />
        <motion.div
          className="absolute top-[40%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.08] dark:opacity-[0.03]"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(168,85,247,0) 70%)",
            y: useTransform(scrollYProgress, [0, 1], [30, -30]),
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10"
          >
            <motion.span className="w-2 h-2 rounded-full bg-black dark:bg-white" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-black dark:text-white/60">
              The Protocol
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-black dark:text-white"
          >
            Blip Protocol
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg lg:text-xl text-black/80 dark:text-white/50 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            A decentralized settlement layer for instant,
            <br />
            private, global value transfer.
          </motion.p>
        </div>

        {/* Features - with flat transparent icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16">
          {[
            {
              label: "Zero-Knowledge",
              desc: "Privacy by default",
              icon: (
                <Shield
                  className="
          w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11
          text-black/50 dark:text-white/25
          group-hover:text-black dark:group-hover:text-white
          transition-colors duration-300
        "
                  strokeWidth={1.5}
                />
              ),
            },
            {
              label: "Solana-Powered",
              desc: "Sub-second finality",
              icon: (
                <Zap
                  className="
          w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11
          text-black/50 dark:text-white/25
          group-hover:text-black dark:group-hover:text-white
          transition-colors duration-300
        "
                  strokeWidth={1.5}
                />
              ),
            },
            {
              label: "Non-Custodial",
              desc: "Your keys, your funds",
              icon: (
                <Globe
                  className="
          w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11
          text-black/50 dark:text-white/25
          group-hover:text-black dark:group-hover:text-white
          transition-colors duration-300
        "
                  strokeWidth={1.5}
                />
              ),
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              className="
        group relative rounded-2xl
        p-5 sm:p-8
        text-center cursor-default overflow-hidden
        bg-white/60 dark:bg-white/[0.03]
        backdrop-blur-xl
        border border-black/[0.08] dark:border-white/[0.06]
        shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] dark:shadow-none
        md:hover:scale-[1.02] transition-transform duration-300
      "
            >
              {/* Hover glow */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-black dark:bg-white opacity-0 group-hover:opacity-[0.1] blur-[80px] rounded-full transition-opacity duration-700" />

              {/* Icon + Title */}
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="mb-2 sm:mb-4">{item.icon}</div>

                <h3
                  className="
            text-base sm:text-lg font-semibold
            text-black/70 dark:text-white/70
            group-hover:text-black dark:group-hover:text-white
            transition-colors duration-300
          "
                >
                  {item.label}
                </h3>
              </div>

              {/* Description */}
              <p
                className="
          text-xs sm:text-sm font-medium
          text-black/50 dark:text-white/50
          group-hover:text-black/70 dark:group-hover:text-white/70
          transition-colors duration-300
        "
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          {/* <a
              href="/whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
              className="group relative overflow-hidden inline-flex items-center justify-center gap-2 md:px-6 px-4 py-2 rounded-full w-[230px] h-[48px] border border-black/10 dark:border-white/10 text-black dark:text-white text-lg font-medium transition-all duration-300"
            >
              
              <span className="absolute inset-0 bg-black/20 dark:bg-white/20 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
          
              
              <span className="relative z-10 flex items-center gap-3">
                Read Whitepaper
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </a> */}
          <CTAButton to="/whitepaper" className="w-[220px] h-[48px]">
            {" "}
            Read Whitepaper{" "}
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

export default ProtocolSection;
