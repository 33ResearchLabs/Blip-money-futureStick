import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { sounds } from "@/lib/sounds";
import { MagneticWrapper } from "@/components/MagneticButton";

/* ============================================
   SPLIT SECTION COMPONENT
   Image on one side, content on the other
   ============================================ */

interface SplitSectionProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  description: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  imagePosition?: "left" | "right";
  background?: "dark" | "darker" | "gradient";
}

export const SplitSection = ({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  description,
  features,
  ctaText,
  ctaLink,
  imagePosition = "right",
  background = "dark",
}: SplitSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useSpring(useTransform(scrollYProgress, [0, 1], [50, -50]), {
    stiffness: 100,
    damping: 30,
  });

  const backgroundClasses = {
    dark: "bg-black",
    darker: "bg-[#050505]",
    gradient: "bg-gradient-to-b from-black to-[#0a0a0a]",
  };

  const content = (
    <div className="flex flex-col justify-center py-12 lg:py-0">
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm uppercase tracking-[0.2em] text-[#ffffff] mb-4"
        >
          {subtitle}
        </motion.p>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="heading-md text-white mb-6"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-lg text-white/50 leading-relaxed mb-8"
      >
        {description}
      </motion.p>

      {features && features.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-3 mb-8"
        >
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffffff]" />
              <span className="text-white/70">{feature}</span>
            </li>
          ))}
        </motion.ul>
      )}

      {ctaText && ctaLink && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <MagneticWrapper strength={0.15}>
            <Link
              to={ctaLink}
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
              className="group inline-flex items-center gap-2 text-white font-medium hover:text-[#ffffff] transition-colors"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </MagneticWrapper>
        </motion.div>
      )}
    </div>
  );

  const image = (
    <motion.div
      className="relative aspect-[4/3] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden"
      style={{ y: imageY }}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute inset-0 rounded-2xl border border-white/5" />
    </motion.div>
  );

  return (
    <section
      ref={ref}
      className={`relative py-24 md:py-32 overflow-hidden ${backgroundClasses[background]}`}
    >
      {/* Subtle background effect */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {imagePosition === "left" ? (
            <>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                {image}
              </motion.div>
              {content}
            </>
          ) : (
            <>
              {content}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                {image}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SplitSection;
