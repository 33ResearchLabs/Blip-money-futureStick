import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
      className="relative md:py-40 py-12 bg-white dark:bg-black overflow-hidden"
    >
      {/* Immersive background with animated glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)",
            y,
            rotate: rotateGlow,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
            y: useTransform(scrollYProgress, [0, 1], [-50, 50]),
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
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <motion.span className="w-2 h-2 rounded-full bg-[#ff6b35]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-black dark:text-white/60">
              The Protocol
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-black dark:text-white"
          >
            Blip Protocol
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-black dark:text-white/40 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            A decentralized settlement layer for instant, private, global value
            transfer.
          </motion.p>
        </div>

        {/* Features - with flat transparent icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 sm:mb-16">
          {[
            {
              label: "Zero-Knowledge",
              desc: "Privacy by default",
              icon: (
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L4 6V11C4 16.55 7.84 21.74 13 23C18.16 21.74 22 16.55 22 11V6L14 2H12Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black dark:text-white/40 group-hover:text-black/60 group-hover:dark:text-white/60 transition-colors"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-black dark:text-white/40 group-hover:text-black/60 group-hover:dark:text-white/60 transition-colors"
                  />
                </svg>
              ),
            },
            {
              label: "Solana-Powered",
              desc: "Sub-second finality",
              icon: (
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black dark:text-white/40 group-hover:text-black/60 group-hover:dark:text-white/60 transition-colors"
                  />
                </svg>
              ),
            },
            {
              label: "Non-Custodial",
              desc: "Your keys, your funds",
              icon: (
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12H3M12 21C7.02944 21 3 16.9706 3 12M12 21C13.6569 21 15 16.9706 15 12C15 7.02944 13.6569 3 12 3M12 21C10.3431 21 9 16.9706 9 12C9 7.02944 10.3431 3 12 3M3 12C3 7.02944 7.02944 3 12 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-black dark:text-white/40 group-hover:text-black/60 group-hover:dark:text-white/60 transition-colors"
                  />
                </svg>
              ),
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              className="group relative rounded-2xl p-4 sm:p-8 text-center cursor-default overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {/* Hover glow */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-white opacity-0 group-hover:opacity-[0.06] blur-[60px] rounded-full transition-opacity duration-500" />

              <div className="flex gap-2 sm:flex-col justify-center items-center">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-medium text-black dark:text-white mb-2 group-hover:text-black/80 group-hover:dark:text-white/80 transition-colors">
                  {item.label}
                </h3>
              </div>

              <p className="text-sm text-black dark:text-white/30 group-hover:text-black/50 group-hover:dark:text-white/50 transition-colors">
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
           <a
              href="/whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
              className="group relative overflow-hidden inline-flex items-center justify-center gap-2 md:px-6 px-4 py-2 rounded-full w-[230px] h-[48px] border border-black/10 dark:border-white/10 text-black dark:text-white text-lg font-medium transition-all duration-300"
            >
              {/* LEFT TO RIGHT HOVER FILL (Same As CTA) */}
              <span className="absolute inset-0 bg-black/20 dark:bg-white/20 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
          
              {/* BUTTON TEXT */}
              <span className="relative z-10 flex items-center gap-3">
                Read Whitepaper
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProtocolSection;
