import { useEffect } from "react";

/**
 * Custom hook to add/remove 'scroll-active' class on body
 * based on scroll position relative to the hero section
 */
const useScrollActive = (heroSectionId: string = "hero") => {
  useEffect(() => {
    const heroSection = document.getElementById(heroSectionId);
    if (!heroSection) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = heroSection.offsetHeight / 4;

      if (scrollY > threshold) {
        document.body.classList.add("scroll-active");
      } else {
        document.body.classList.remove("scroll-active");
      }
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("scroll-active");
    };
  }, [heroSectionId]);
};

export default useScrollActive;
