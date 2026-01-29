import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";

/* ============================================
   SCROLL ANIMATIONS - LINEAR INSPIRED
   Smooth scroll-triggered animations
   ============================================ */

/* ---------------- Fade In On Scroll ---------------- */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  once?: boolean;
}

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 30,
  className = "",
  once = true,
}: FadeInProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const { x, y } = directions[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

/* ---------------- Stagger Children ---------------- */
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
  once = true,
}: StaggerContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

/* ---------------- Parallax ---------------- */
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const Parallax = ({ children, speed = 0.5, className = "" }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y: smoothY }}>{children}</motion.div>
    </div>
  );
};

/* ---------------- Scale On Scroll ---------------- */
interface ScaleOnScrollProps {
  children: React.ReactNode;
  className?: string;
  startScale?: number;
  endScale?: number;
}

export const ScaleOnScroll = ({
  children,
  className = "",
  startScale = 0.8,
  endScale = 1,
}: ScaleOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [startScale, endScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ scale: smoothScale, opacity: smoothOpacity }}
    >
      {children}
    </motion.div>
  );
};

/* ---------------- Horizontal Scroll ---------------- */
interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

export const HorizontalScroll = ({ children, className = "" }: HorizontalScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div className="flex" style={{ x }}>
        {children}
      </motion.div>
    </div>
  );
};

/* ---------------- Reveal Text ---------------- */
interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export const RevealText = ({ text, className = "", delay = 0, once = true }: RevealTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const words = text.split(" ");

  return (
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

/* ---------------- Line Draw ---------------- */
interface LineDrawProps {
  className?: string;
  direction?: "horizontal" | "vertical";
  once?: boolean;
}

export const LineDraw = ({
  className = "",
  direction = "horizontal",
  once = true,
}: LineDrawProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        className={`bg-gradient-to-r from-[#ffffff] to-[#e5e5e5] ${
          direction === "horizontal" ? "h-[1px] w-full" : "w-[1px] h-full"
        }`}
        initial={{ scaleX: direction === "horizontal" ? 0 : 1, scaleY: direction === "vertical" ? 0 : 1 }}
        animate={
          isInView
            ? { scaleX: 1, scaleY: 1 }
            : { scaleX: direction === "horizontal" ? 0 : 1, scaleY: direction === "vertical" ? 0 : 1 }
        }
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: direction === "horizontal" ? "left" : "top" }}
      />
    </div>
  );
};

/* ---------------- Counter Animation ---------------- */
interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  once?: boolean;
}

export const Counter = ({
  from = 0,
  to,
  duration = 2,
  suffix = "",
  prefix = "",
  className = "",
  once = true,
}: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: "-100px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(from + (to - from) * easeOutExpo);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ---------------- Blur In ---------------- */
interface BlurInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const BlurIn = ({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  once = true,
}: BlurInProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  Parallax,
  ScaleOnScroll,
  HorizontalScroll,
  RevealText,
  LineDraw,
  Counter,
  BlurIn,
};
