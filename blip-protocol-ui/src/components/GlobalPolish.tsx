import { useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

/**
 * Thin orange progress bar pinned to the top of the viewport.
 * Uses spring physics for smooth, Linear/Stripe-style tracking.
 */
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] z-[200] origin-left pointer-events-none"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, transparent, rgba(255,107,53,0.3) 15%, #ff6b35 50%, rgba(255,107,53,0.3) 85%, transparent)",
        boxShadow: "0 0 12px rgba(255,107,53,0.5)",
      }}
    />
  );
};

/**
 * Subtle film-grain noise layer — adds premium texture.
 * Only renders once, pointer-events-none.
 */
export const GrainOverlay = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 z-[150] opacity-[0.025] mix-blend-overlay"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
    }}
  />
);

/**
 * Fade + subtle lift on route change.
 */
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * IntersectionObserver-driven reveal.
 * Adds `.revealed` class to any element with `[data-reveal]` when it enters the viewport.
 * CSS in index.css handles the actual motion — keeps the JS cheap.
 */
export const GlobalRevealObserver = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.classList.add("revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const rescan = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.revealed)")
        .forEach((el) => io.observe(el));
    };
    rescan();

    // Re-scan when new sections mount (lazy-loaded ones)
    const mo = new MutationObserver(() => rescan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
};
