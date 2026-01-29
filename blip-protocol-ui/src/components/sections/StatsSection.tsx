import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

/* ============================================
   STATS SECTION COMPONENT
   Animated statistics display
   ============================================ */

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
  title?: string;
  subtitle?: string;
  background?: "dark" | "accent" | "image";
  backgroundImage?: string;
}

const AnimatedNumber = ({
  value,
  suffix = "",
  prefix = "",
  isInView,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  isInView: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isInView]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const StatsSection = ({
  stats,
  title,
  subtitle,
  background = "dark",
  backgroundImage,
}: StatsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      {background === "image" && backgroundImage ? (
        <>
          <div className="absolute inset-0">
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/80" />
        </>
      ) : background === "accent" ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff]/5 via-black to-black" />
      ) : (
        <div className="absolute inset-0 bg-[#050505]" />
      )}

      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
              >
                {subtitle}
              </motion.p>
            )}
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="heading-md text-white"
              >
                {title}
              </motion.h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-3">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  isInView={isInView}
                />
              </div>
              <div className="text-sm md:text-base text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
