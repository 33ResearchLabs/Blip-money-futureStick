import { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { MerchantDashboard } from "./MerchantDashboard";

/**
 * InteractiveBackground - Shows merchant dashboard as background
 * Default: 5% opacity
 * On hover: Creates a spotlight effect revealing higher opacity in the hovered area
 *
 * Optimized: Single MerchantDashboard render + CSS mask for spotlight
 */
export const InteractiveBackground = memo(() => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle to animation frame
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        if (!isHovering) setIsHovering(true);
        rafRef.current = null;
      });
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovering]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Single render — use CSS mask to create spotlight effect */}
      <div
        className="absolute inset-0 scale-75 flex items-center justify-center"
        style={{
          opacity: isHovering ? 0.5 : 0.05,
          transition: "opacity 0.3s ease",
          ...(isHovering
            ? {
                maskImage: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                WebkitMaskImage: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
              }
            : {}),
        }}
      >
        <MerchantDashboard />
      </div>
    </div>
  );
});

InteractiveBackground.displayName = "InteractiveBackground";
