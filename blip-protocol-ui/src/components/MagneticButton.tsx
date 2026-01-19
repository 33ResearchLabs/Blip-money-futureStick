import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { sounds } from "@/lib/sounds";

/* ============================================
   MAGNETIC BUTTON - LINEAR INSPIRED
   Buttons that attract to cursor on hover
   ============================================ */

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
  as?: "button" | "a" | "div";
  disabled?: boolean;
}

export const MagneticButton = ({
  children,
  className = "",
  onClick,
  href,
  strength = 0.3,
  as = "button",
  disabled = false,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    sounds.hover();
  };

  const handleClick = () => {
    if (disabled) return;
    sounds.click();
    onClick?.();
  };

  const Component = as === "a" ? motion.a : as === "div" ? motion.div : motion.button;
  const props = as === "a" ? { href, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="relative inline-block"
    >
      <Component
        {...props}
        onClick={handleClick}
        className={className}
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 15,
          mass: 0.5,
        }}
        whileTap={{ scale: 0.95 }}
        disabled={disabled}
      >
        {children}
      </Component>
    </div>
  );
};

/* ============================================
   MAGNETIC WRAPPER - For existing elements
   ============================================ */

interface MagneticWrapperProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const MagneticWrapper = ({
  children,
  strength = 0.2,
  className = "",
}: MagneticWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 15,
        mass: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
