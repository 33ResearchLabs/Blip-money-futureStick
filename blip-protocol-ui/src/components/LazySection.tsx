import { useRef, useState, useEffect, memo, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  /** How far before the viewport to start rendering (default: 300px) */
  rootMargin?: string;
  /** Minimum height placeholder to prevent layout shift */
  minHeight?: string;
  /** Optional className for the wrapper */
  className?: string;
}

/**
 * Defers mounting of children until the section is near the viewport.
 * Uses IntersectionObserver for zero main-thread cost while off-screen.
 * Once mounted, stays mounted to preserve scroll position and state.
 */
const LazySection = memo(function LazySection({
  children,
  rootMargin = "400px",
  minHeight = "100vh",
  className,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Once visible, never unload
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={isVisible ? undefined : { minHeight }}
    >
      {isVisible ? children : null}
    </div>
  );
});

export default LazySection;
