import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
  format?: (n: number) => string;
}

export const AnimatedCounter = ({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  style,
  format,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  const mv = useMotionValue(0);
  const sv = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const rounded = useTransform(sv, (latest) => {
    if (format) return format(latest);
    const n = Number(latest.toFixed(decimals));
    return `${prefix}${n.toLocaleString()}${suffix}`;
  });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  return (
    <motion.span ref={ref} className={className} style={style}>
      {rounded}
    </motion.span>
  );
};

export default AnimatedCounter;
