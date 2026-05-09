import { useRef } from "react";

/**
 * Mobile-only side-overlay chevron button positioned at the right edge of a
 * horizontal snap-scroll container, vertically centered with the cards.
 * Once the user taps it (or swipes), they discover that left swipe is
 * possible too — so we only surface the right arrow.
 *
 * Usage: wrap the snap-scroll track + <SwipeHint /> in a `relative` parent.
 * The hint is `position: absolute` and finds its previousElementSibling (the
 * snap track) on click to scroll by one card-width.
 */
export const SwipeHint = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

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
      className={`md:hidden absolute inset-y-0 right-2 flex items-center pointer-events-none z-20 ${className}`}
    >
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Scroll right"
        className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 dark:bg-black/55 backdrop-blur-md flex items-center justify-center text-black/70 dark:text-white/85 shadow-[0_2px_12px_rgba(0,0,0,0.18)] active:scale-95 transition"
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
