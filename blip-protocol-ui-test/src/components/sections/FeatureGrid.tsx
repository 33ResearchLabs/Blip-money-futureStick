import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { sounds } from "@/lib/sounds";
import { LucideIcon } from "lucide-react";

/* ============================================
   FEATURE GRID SECTION
   Grid of feature cards with images or icons
   ============================================ */

interface Feature {
  title: string;
  description: string;
  icon?: LucideIcon;
  image?: string;
}

interface FeatureGridProps {
  title: ReactNode;
  subtitle?: string;
  description?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: "cards" | "minimal" | "images";
}

const FeatureCard = ({
  feature,
  index,
  variant,
}: {
  feature: Feature;
  index: number;
  variant: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = feature.icon;

  if (variant === "images" && feature.image) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
        onMouseEnter={() => sounds.hover()}
      >
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-sm text-white/60">{feature.description}</p>
        </div>
      </motion.div>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group"
        onMouseEnter={() => sounds.hover()}
      >
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-4 group-hover:border-[#ff6b35]/30 transition-colors">
            <Icon className="w-5 h-5 text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white transition-colors" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
          {feature.title}
        </h3>
        <p className="text-sm text-black/40 dark:text-white/50 leading-relaxed">
          {feature.description}
        </p>
      </motion.div>
    );
  }

  // Default cards variant
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group p-6 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-black/[0.08] dark:border-transparent hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500 backdrop-blur-xl"
      onMouseEnter={() => sounds.hover()}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-5 group-hover:bg-black/10 dark:group-hover:bg-white/20 transition-colors">
          <Icon className="w-6 h-6 text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white transition-colors" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-black dark:text-white mb-3">{feature.title}</h3>
      <p className="text-black/40 dark:text-white/50 leading-relaxed">{feature.description}</p>
    </motion.div>
  );
};

export const FeatureGrid = ({
  title,
  subtitle,
  description,
  features,
  columns = 3,
  variant = "cards",
}: FeatureGridProps) => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  const columnClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 md:mb-20">
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4"
            >
              {subtitle}
            </motion.p>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
          >
            {title}
          </motion.h2>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-black/40 dark:text-white/50 max-w-2xl mx-auto font-medium"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Grid */}
        <div className={`grid ${columnClasses[columns]} gap-6`}>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
