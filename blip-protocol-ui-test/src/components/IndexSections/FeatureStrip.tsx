import { motion } from "framer-motion";
import { Zap, Lock, Eye, CheckCircle2 } from "lucide-react";
import { MicroIcon } from "../visuals/MicroIcon";

/* ============================================
   SECTION 6: FEATURE STRIP
   ============================================ */

const FeatureStrip = () => {
  return (
    <section className="relative py-20 bg-[#FAF8F5] dark:bg-black overflow-hidden">
      {/* Subtle gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex justify-center "
        >
          {/* Centered block (like button) */}
          <div className="w-fit md:flex gap-12">
            {[
              { text: "Sub-second settlement", icon: Zap },
              { text: "Zero custody", icon: Lock },
              { text: "Privacy by default", icon: Eye },
              { text: "On-chain proofs", icon: CheckCircle2 },
            ].map((feature, i) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center gap-3 mb-4"
              >
                {/* Pulsing dot with ripple effect */}
                {/* <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute w-4 h-4 rounded-full bg-black/20 dark:bg-white/20"
                    animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-black/60 dark:bg-white/60"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                </div> */}

                <MicroIcon icon={feature.icon} variant="glow" size={14} delay={i * 0.2} />

                <span className="text-sm text-black dark:text-white/50 font-medium tracking-wide text-left hover:text-black dark:hover:text-white transition-colors">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureStrip;
