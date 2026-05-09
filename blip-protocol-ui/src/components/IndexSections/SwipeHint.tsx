import { useRef } from "react";

/**
 * Mobile-only side-overlay chevron buttons positioned at the left/right edges
 * of a horizontal snap-scroll container, vertically centered with the cards.
 *
 * Usage: wrap the snap-scroll track + <SwipeHint /> in a `relative` parent.
 * The hint is `position: absolute` and finds its previousElementSibling (the
 * snap track) on click to scroll by one card-width.
 *
 * <div className="relative">
 *   <div className="...flex snap-x...">
 *     {cards}
 *   </div>
 *   <SwipeHint />
 * </div>
 */
export const SwipeHint = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const track = ref.current?.previousElementSibling as HTMLElement | null;
    if (!track) return;
    const firstCard = track.firstElementChild as HTMLElement | null;
    const cardW = firstCard?.getBoundingClientRect().width ?? 280;
    track.scrollBy({ left: dir * (cardW + 16), behavior: "smooth" });
  };

  const Btn = ({
    dir,
    label,
    path,
  }: {
    dir: -1 | 1;
    label: string;
    path: string;
  }) => (
    <button
      type="button"
      onClick={() => scrollBy(dir)}
      aria-label={label}
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
        <path d={path} />
      </svg>
    </button>
  );

  return (
    <div
      ref={ref}
      className={`md:hidden absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none z-20 ${className}`}
    >
      <Btn dir={-1} label="Scroll left" path="M15 18l-6-6 6-6" />
      <Btn dir={1} label="Scroll right" path="M9 18l6-6-6-6" />
    </div>
  );
};

export default SwipeHint;
