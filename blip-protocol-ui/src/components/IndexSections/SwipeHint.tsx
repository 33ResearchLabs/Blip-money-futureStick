import { useEffect, useRef, useState } from "react";

/**
 * Mobile-only side-overlay chevron button positioned at the right edge of a
 * horizontal snap-scroll container. Auto-hides once the user has scrolled to
 * the last card. Once they tap or swipe right, they discover left-swipe
 * naturally — so we only ever surface the right arrow.
 *
 * Usage: wrap the snap-scroll track + <SwipeHint /> in a `relative` parent.
 * The hint finds its previousElementSibling (the snap track) on click and
 * scrolls by one card-width. It also listens to that track's scroll events
 * to know when it's reached the end.
 */
export const SwipeHint = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = ref.current?.previousElementSibling as HTMLElement | null;
    if (!track) return;

    const update = () => {
      // 8px slop so we hit "end" even if scrollWidth has sub-pixel rounding.
      const reachedEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      // If the track is shorter than the viewport (no overflow), there's
      // nothing to scroll — treat as "at end" so the hint hides.
      const noOverflow = track.scrollWidth <= track.clientWidth + 1;
      setAtEnd(reachedEnd || noOverflow);
    };

    update();
    track.addEventListener("scroll", update, { passive: true });

    // Card widths can change with viewport / late image loads — re-check.
    const ro = new ResizeObserver(update);
    ro.observe(track);

    return () => {
      track.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const scrollNext = () => {
    const track = ref.current?.previousElementSibling as HTMLElement | null;
    if (!track) return;
    const firstCard = track.firstElementChild as HTMLElement | null;
    const cardW = firstCard?.getBoundingClientRect().width ?? 280;
    track.scrollBy({ left: cardW + 16, behavior: "smooth" });
  };

  return (
    <div
      ref={ref}
      aria-hidden={atEnd}
      className={`md:hidden absolute inset-y-0 right-2 flex items-center pointer-events-none z-20 transition-opacity duration-300 ${atEnd ? "opacity-0" : "opacity-100"} ${className}`}
    >
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Scroll right"
        disabled={atEnd}
        tabIndex={atEnd ? -1 : 0}
        className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 dark:bg-black/55 backdrop-blur-md flex items-center justify-center text-black/70 dark:text-white/85 shadow-[0_2px_12px_rgba(0,0,0,0.18)] active:scale-95 transition disabled:pointer-events-none"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default SwipeHint;
