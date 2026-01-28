import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ============================================
   SECTION 8: PRIVACY & TRUST
   ============================================ */

const PrivacySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-12 md:py-40 bg-transparent overflow-hidden "
    >
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 bg-black md:py-8 rounded-2xl "
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-8"
          >
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/30 font-light">
              Privacy & Trust
            </span>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1]"
          >
            Your wallet.
            <br />
            <span className="text-white/20">Your identity.</span>
          </motion.h2>
        </div>

        {/* Two column minimal grid */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:gap-40 gap-12">
          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-black p-6 sm:p-10 md:p-12 max-w-sm w-full text-center"
          >
            <h3 className="text-xl font-medium text-white mb-6">Privacy</h3>

            {/* ALIGNED LIST */}
            <ul className="space-y-4 mx-auto max-w-xs text-left pl-16 sm:pl-12">
              {[
                "Wallet-only identity",
                "No KYC for small transfers",
                "Private by default",
              ].map((item, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[6px_1fr] gap-3 text-sm text-white/40"
                >
                  <div className="w-1 h-1 rounded-full bg-white/30 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-black p-6 sm:p-10 md:p-12 max-w-sm w-full text-center"
          >
            <h3 className="text-xl font-medium text-white mb-6">Trust</h3>

            {/* ALIGNED LIST */}
            <ul className="space-y-4 mx-auto max-w-xs text-left pl-16 sm:pl-12">
              {[
                "Everything on-chain",
                "Settlement proofs",
                "Non-custodial always",
              ].map((item, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[6px_1fr] gap-3 text-sm text-white/40"
                >
                  <div className="w-1 h-1 rounded-full bg-white/30 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default PrivacySection;
