import { motion } from "framer-motion";

/**
 * Mobile-only "Swipe →" indicator placed below a horizontal snap-scroll container.
 * Auto-hides at md+. Subtle pulsing arrow signals horizontal scrollability.
 */
export const SwipeHint = ({ className = "" }: { className?: string }) => (
  <div
    className={`md:hidden flex items-center justify-center gap-1.5 mt-4 text-[10px] uppercase tracking-[0.18em] font-semibold text-black/35 dark:text-white/35 ${className}`}
  >
    <span>Swipe</span>
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ x: [0, 4, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </motion.svg>
  </div>
);

export default SwipeHint;
