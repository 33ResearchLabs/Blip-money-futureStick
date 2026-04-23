import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  tiltStrength?: number;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * 3D tilt card with cursor-follow glow.
 * Uses spring physics for buttery-smooth motion.
 */
export const MotionCard = ({
  children,
  className = "",
  glowColor = "rgba(255,107,53,0.25)",
  tiltStrength = 8,
  disabled = false,
  onClick,
  style,
}: MotionCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const smx = useSpring(mx, { stiffness: 150, damping: 15 });
  const smy = useSpring(my, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(smy, [0, 1], [tiltStrength, -tiltStrength]);
  const rotateY = useTransform(smx, [0, 1], [-tiltStrength, tiltStrength]);

  const glowX = useTransform(smx, (v) => v * 100);
  const glowY = useTransform(smy, (v) => v * 100);
  const glowBg = useMotionTemplate`radial-gradient(400px circle at ${glowX}% ${glowY}%, ${glowColor}, transparent 60%)`;

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      className={`relative ${className}`}
      style={{
        transformStyle: "preserve-3d",
        rotateX: disabled ? 0 : rotateX,
        rotateY: disabled ? 0 : rotateY,
        ...style,
      }}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Cursor-follow glow layer */}
      {!disabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{ background: glowBg }}
          whileHover={{ opacity: 1 }}
        />
      )}
      <div style={{ transform: "translateZ(20px)", position: "relative" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default MotionCard;
