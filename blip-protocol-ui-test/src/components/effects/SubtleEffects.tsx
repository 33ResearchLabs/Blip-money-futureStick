import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, ReactNode } from "react";

/* ============================================
   SUBTLE EFFECTS LIBRARY
   Inspired by: Perplexity, Hedera, Runway AI, Cursor
   ============================================ */

/* ---------------- Text Shimmer Effect (AI Brand Style) ---------------- */
export const TextShimmer = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        animate={{
          translateX: ["human", "200%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 5,
        }}
        style={{
          backgroundSize: "200% 100%",
        }}
      />
    </span>
  );
};

/* ---------------- Magnetic Hover (Cursor/Linear Inspired) ---------------- */
export const MagneticHover = ({
  children,
  strength = 0.3,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ---------------- Hover Tooltip (Perplexity Inspired) ---------------- */
export const HoverTooltip = ({
  children,
  content,
  delay = 0.3,
}: {
  children: ReactNode;
  content: string;
  delay?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => setShowTooltip(true), delay * 1000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-black/90 dark:bg-white/90 text-white dark:text-black text-xs font-medium whitespace-nowrap backdrop-blur-sm z-50"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90 dark:border-t-white/90" />
        </motion.div>
      )}
    </div>
  );
};

/* ---------------- Gradient Text (AI Brand Style) ---------------- */
export const GradientText = ({
  children,
  className = "",
  animated = false,
}: {
  children: ReactNode;
  className?: string;
  animated?: boolean;
}) => {
  return (
    <span
      className={`bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent ${
        animated ? "animate-gradient" : ""
      } ${className}`}
      style={
        animated
          ? {
              backgroundSize: "200% 200%",
            }
          : undefined
      }
    >
      {children}
    </span>
  );
};

/* ---------------- Subtle Glow Card (Web3 Style) ---------------- */
export const GlowCard = ({
  children,
  glowColor = "rgba(0, 255, 148, 0.15)",
  className = "",
  hoverScale = 1.02,
}: {
  children: ReactNode;
  glowColor?: string;
  className?: string;
  hoverScale?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: hoverScale }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle glow on hover */}
      <motion.div
        className="absolute -inset-[1px] rounded-xl blur-xl opacity-0"
        animate={{
          opacity: isHovered ? 0.5 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ background: glowColor }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
};

/* ---------------- Micro Bounce (Hedera Easter Egg Style) ---------------- */
export const MicroBounce = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -2,
        transition: {
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          duration: 0.1,
        },
      }}
    >
      {children}
    </motion.div>
  );
};

/* ---------------- Variable Font Weight on Hover (Kinetic Typography) ---------------- */
export const KineticText = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        fontWeight: isHovered ? 700 : 500,
        letterSpacing: isHovered ? "-0.02em" : "0em",
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  );
};

/* ---------------- Progressive Reveal (Perplexity Style) ---------------- */
export const ProgressiveReveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ---------------- Smooth Cursor Follower (Linear/Cursor AI Inspired) ---------------- */
export const CursorFollower = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotlightX = useSpring(mouseX, { stiffness: 150, damping: 30 });
  const spotlightY = useSpring(mouseY, { stiffness: 150, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Subtle spotlight effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [spotlightX, spotlightY],
            ([x, y]: any) =>
              `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.03), transparent 40%)`
          ),
        }}
      />
      {children}
    </div>
  );
};

/* ---------------- Reveal on Scroll with Blur ---------------- */
export const ScrollRevealBlur = ({
  children,
  threshold = 0.1,
  className = "",
}: {
  children: ReactNode;
  threshold?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const blur = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]
  );
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, filter: blur, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ---------------- Subtle Border Glow (Web3 Card Style) ---------------- */
export const BorderGlow = ({
  children,
  glowColor = "#00FF94",
  className = "",
}: {
  children: ReactNode;
  glowColor?: string;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border */}
      <motion.div
        className="absolute -inset-[1px] rounded-xl opacity-0"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(90deg, ${glowColor}, transparent, ${glowColor})`,
          backgroundSize: "200% 100%",
        }}
      >
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "200% 0%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
            backgroundSize: "200% 100%",
          }}
        />
      </motion.div>
      <div className="relative bg-black dark:bg-white rounded-xl">{children}</div>
    </div>
  );
};
