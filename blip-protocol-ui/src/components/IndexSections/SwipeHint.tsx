import { useRef } from "react";

/**
 * Mobile-only twin chevron buttons placed below a horizontal snap-scroll container.
 * Auto-hides at md+. Buttons scroll the previous sibling element (the snap track)
 * by one card-width at a time, matching native swipe behavior.
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

  return (
    <div
      ref={ref}
      className={`md:hidden flex items-center justify-center gap-3 mt-5 ${className}`}
    >
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="w-10 h-10 rounded-full bg-black/[0.06] dark:bg-white/[0.08] flex items-center justify-center text-black/40 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/12 active:scale-95 transition"
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
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="w-10 h-10 rounded-full bg-black/[0.12] dark:bg-white/[0.16] flex items-center justify-center text-black/70 dark:text-white/80 hover:bg-black/[0.18] dark:hover:bg-white/[0.22] active:scale-95 transition"
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
