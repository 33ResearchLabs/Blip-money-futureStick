import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { sounds } from "@/lib/sounds";

/* ============================================
   IMAGE SECTION COMPONENT
   Full-width image with overlay content
   ============================================ */

interface ImageSectionProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  alignment?: "left" | "right" | "center";
  height?: "full" | "large" | "medium";
  overlay?: "dark" | "light" | "gradient";
  children?: React.ReactNode;
}

export const ImageSection = ({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  description,
  badge,
  alignment = "left",
  height = "large",
  overlay = "dark",
  children,
}: ImageSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), {
    stiffness: 100,
    damping: 30,
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.05, 1]), {
    stiffness: 100,
    damping: 30,
  });

  const heightClasses = {
    full: "min-h-screen",
    large: "min-h-[80vh]",
    medium: "min-h-[60vh]",
  };

  const overlayClasses = {
    dark: "bg-gradient-to-t from-black via-black/60 to-black/30",
    light: "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
    gradient: "bg-gradient-to-r from-black via-black/70 to-transparent",
  };

  const alignmentClasses = {
    left: "items-start text-left",
    right: "items-end text-right",
    center: "items-center text-center",
  };

  return (
    <section
      ref={ref}
      className={`relative w-full ${heightClasses[height]} overflow-hidden`}
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col justify-end ${alignmentClasses[alignment]} max-w-7xl mx-auto px-6 py-16 md:py-24`}>
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
            <span className="text-[13px] text-white/70 font-medium">{badge}</span>
          </motion.div>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="heading-lg text-white mb-6 max-w-3xl"
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/60 max-w-xl mb-8"
          >
            {description}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ImageSection;
