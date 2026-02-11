import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MerchantDashboard } from "./MerchantDashboard";

/**
 * InteractiveBackground - Shows merchant dashboard as background
 * Default: 5% opacity
 * On hover: Creates a spotlight effect revealing 50% opacity in the hovered area
 */
export const InteractiveBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        opacity: 0.05, // Base 5% opacity
      }}
    >
      {/* Base layer - always visible at 5% */}
      <div className="absolute inset-0 scale-75 flex items-center justify-center">
        <MerchantDashboard />
      </div>

      {/* Spotlight layer - reveals on hover */}
      {isHovering && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
          style={{
            maskImage: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
            WebkitMaskImage: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
            opacity: 0.45, // Additional 45% to reach 50% total (5% base + 45% spotlight)
          }}
        >
          <div className="absolute inset-0 scale-75 flex items-center justify-center">
            <MerchantDashboard />
          </div>
        </motion.div>
      )}
    </div>
  );
};
