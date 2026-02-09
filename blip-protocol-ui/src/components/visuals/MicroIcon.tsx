import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MicroIconProps {
  icon: LucideIcon;
  variant?: "pulse" | "spin" | "bounce" | "glow" | "static";
  size?: number;
  className?: string;
  delay?: number;
}

export const MicroIcon = ({
  icon: Icon,
  variant = "static",
  size = 16,
  className = "",
  delay = 0,
}: MicroIconProps) => {
  const variants = {
    pulse: {
      scale: [1, 1.15, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      },
    },
    spin: {
      rotate: [0, 360],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear",
        delay,
      },
    },
    bounce: {
      y: [0, -4, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      },
    },
    glow: {
      opacity: [0.4, 0.8, 0.4],
      filter: [
        "drop-shadow(0 0 2px rgba(255,255,255,0.3))",
        "drop-shadow(0 0 6px rgba(255,255,255,0.6))",
        "drop-shadow(0 0 2px rgba(255,255,255,0.3))",
      ],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      },
    },
    static: {},
  };

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      animate={variants[variant]}
    >
      <Icon size={size} className="text-black/60 dark:text-white/60" strokeWidth={1.5} />
    </motion.div>
  );
};
