import { ArrowDown, ArrowUp } from "lucide-react";

/**
 * Smooth slow scroll utility
 */
const smoothScroll = (targetY, duration = 2400) => {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // easeInOut
    const ease =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

const ScrollToBottomButton = () => {
  const scrollToBottom = () => {
    smoothScroll(document.body.scrollHeight, 2600);
  };

  const scrollToTop = () => {
    smoothScroll(0, 2600);
  };

  return (
    <div className="">
      {/* Scroll to Bottom */}
      <button
        onClick={scrollToBottom}
        className="fixed bottom-14 right-6 z-50 p-3 rounded-full  text-white shadow-lg hover:scale-105 transition"
        aria-label="Scroll to bottom"
      >
        <ArrowDown size={18} />
      </button>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 z-50 p-3 rounded-full  text-white shadow-lg hover:scale-105 transition"
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
};

export default ScrollToBottomButton;
