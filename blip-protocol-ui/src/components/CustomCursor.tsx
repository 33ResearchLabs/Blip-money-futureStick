import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

/* ============================================
   CUSTOM CURSOR - LINEAR INSPIRED
   Smooth, magnetic, context-aware cursor
   ============================================ */

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "click" | "text">("default");
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Smooth spring animation for cursor movement
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Dot follows cursor exactly
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const dotXSpring = useSpring(dotX, { damping: 50, stiffness: 800 });
  const dotYSpring = useSpring(dotY, { damping: 50, stiffness: 800 });

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    const hasFineMouse = window.matchMedia("(pointer: fine)").matches;
    if (!hasFineMouse) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const handleMouseDown = () => setCursorVariant("click");
    const handleMouseUp = () => setCursorVariant("default");

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for interactive elements
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor='pointer']") ||
        target.classList.contains("cursor-pointer")
      ) {
        setCursorVariant("hover");
        return;
      }

      // Check for text elements
      if (
        target.tagName === "P" ||
        target.tagName === "H1" ||
        target.tagName === "H2" ||
        target.tagName === "H3" ||
        target.tagName === "H4" ||
        target.tagName === "SPAN" ||
        target.closest("[data-cursor='text']")
      ) {
        setCursorVariant("text");
        return;
      }

      setCursorVariant("default");
    };

    const handleMouseLeave = () => {
      setCursorVariant("default");
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  if (!isVisible) return null;

  const variants = {
    default: {
      width: 40,
      height: 40,
      backgroundColor: "transparent",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      mixBlendMode: "difference" as const,
    },
    hover: {
      width: 60,
      height: 60,
      backgroundColor: "rgba(255, 107, 53, 0.05)",
      border: "1px solid rgba(255, 107, 53, 0.4)",
      mixBlendMode: "normal" as const,
    },
    click: {
      width: 30,
      height: 30,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      mixBlendMode: "difference" as const,
    },
    text: {
      width: 3,
      height: 28,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      border: "none",
      borderRadius: 2,
      mixBlendMode: "difference" as const,
    },
  };

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={cursorVariant}
        variants={variants}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotXSpring,
          y: dotYSpring,
          translateX: "-50%",
          translateY: "-50%",
          width: 6,
          height: 6,
          backgroundColor: cursorVariant === "text" ? "transparent" : "#FFFFFF",
        }}
        animate={{
          scale: cursorVariant === "click" ? 0.5 : 1,
          opacity: cursorVariant === "text" ? 0 : 1,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Global style to hide default cursor */}
      <style>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
