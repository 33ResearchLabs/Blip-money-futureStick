import { motion } from "framer-motion";
import { Zap, Lock, Eye, CheckCircle2, Star, LayoutDashboard } from "lucide-react";
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
              { text: "Instant settlement", icon: Zap },
              { text: "Reputation layer", icon: Star },
              { text: "Escrow protection", icon: Lock },
              { text: "On-demand liquidity", icon: CheckCircle2 },
              { text: "Chain-agnostic", icon: Eye },
              { text: "Merchant dashboard", icon: LayoutDashboard },
            ].map((feature, i) => (
              <motion.div
  key={feature.text}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  
  className="group flex items-center gap-3 mb-4 cursor-pointer"
>
  <MicroIcon
    icon={feature.icon}
    variant="glow"
    size={16}
    
    className="transition-all duration-300 group-hover:scale-110"
  />

  <span className="text-sm text-black dark:text-white/50 font-medium tracking-wide text-left transition-colors group-hover:text-black dark:group-hover:text-white">
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
