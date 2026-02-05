import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CTAButton } from "../Navbar";

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
      className="relative md:py-40 py-12 bg-black overflow-hidden"
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
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/60">
              The Protocol
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-white"
          >
            Blip Protocol
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-light"
          >
            A decentralized settlement layer for instant, private, global value
            transfer.
          </motion.p>
        </div>

        {/* Features - with orange accents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 sm:mb-16">
          {[
            { label: "Zero-Knowledge", desc: "Privacy by default", icon: "🔐" },
            {
              label: "Solana-Powered",
              desc: "Sub-second finality",
              icon: "⚡",
            },
            {
              label: "Non-Custodial",
              desc: "Your keys, your funds",
              icon: "🔑",
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
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="text-lg font-medium text-white mb-2 group-hover:text-white/80 transition-colors">
                  {item.label}
                </h3>
              </div>

              <p className="text-sm text-white/30 group-hover:text-white/50 transition-colors">
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
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90  transition-all duration-300"
          >
            <span>Read the Whitepaper</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProtocolSection;
