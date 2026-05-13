import { useEffect, useRef, useState } from "react";

/**
 * Mobile-only side-overlay chevron buttons positioned at the edges of a
 * horizontal snap-scroll container. Auto-hides each side once the user has
 * reached that end of the track.
 *
 * Usage: wrap the snap-scroll track + <SwipeHint /> in a `relative` parent.
 * The hint finds its previousElementSibling (the snap track) on click and
 * scrolls by one card-width. It also listens to that track's scroll events
 * to know its current position.
 */
export const SwipeHint = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = ref.current?.previousElementSibling as HTMLElement | null;
    if (!track) return;

    const update = () => {
      // 8px slop so we hit "end" even if scrollWidth has sub-pixel rounding.
      const reachedEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      const reachedStart = track.scrollLeft <= 8;
      // If the track is shorter than the viewport (no overflow), there's
      // nothing to scroll — treat as "at both ends" so both hints hide.
      const noOverflow = track.scrollWidth <= track.clientWidth + 1;
      setAtEnd(reachedEnd || noOverflow);
      setAtStart(reachedStart || noOverflow);
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

  const getCardWidth = () => {
    const track = ref.current?.previousElementSibling as HTMLElement | null;
    if (!track) return 280;
    const firstCard = track.firstElementChild as HTMLElement | null;
    return firstCard?.getBoundingClientRect().width ?? 280;
  };

  const scrollNext = () => {
    const track = ref.current?.previousElementSibling as HTMLElement | null;
    if (!track) return;
    track.scrollBy({ left: getCardWidth() + 16, behavior: "smooth" });
  };

  const scrollPrev = () => {
    const track = ref.current?.previousElementSibling as HTMLElement | null;
    if (!track) return;
    track.scrollBy({ left: -(getCardWidth() + 16), behavior: "smooth" });
  };

  const buttonClass =
    "pointer-events-auto w-10 h-10 rounded-full bg-white/90 dark:bg-black/55 backdrop-blur-md flex items-center justify-center text-black/70 dark:text-white/85 shadow-[0_2px_12px_rgba(0,0,0,0.18)] active:scale-95 transition disabled:pointer-events-none";

  return (
    <div
      ref={ref}
      className={`md:hidden absolute inset-y-0 left-0 right-0 pointer-events-none z-20 ${className}`}
    >
      {/* Left chevron */}
      <div
        aria-hidden={atStart}
        className={`absolute inset-y-0 left-2 flex items-center transition-opacity duration-300 ${atStart ? "opacity-0" : "opacity-100"}`}
      >
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Scroll left"
          disabled={atStart}
          tabIndex={atStart ? -1 : 0}
          className={buttonClass}
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
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Right chevron */}
      <div
        aria-hidden={atEnd}
        className={`absolute inset-y-0 right-2 flex items-center transition-opacity duration-300 ${atEnd ? "opacity-0" : "opacity-100"}`}
      >
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Scroll right"
          disabled={atEnd}
          tabIndex={atEnd ? -1 : 0}
          className={buttonClass}
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
    </div>
  );
};

export default SwipeHint;
