import { useState, useRef, useEffect, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, X } from "lucide-react";
import { Link } from "react-router-dom";

// Context so the Navbar can read actual banner height
const BannerContext = createContext<{ bannerHeight: number }>({
  bannerHeight: 0,
});

export const useBannerHeight = () => {
  const { bannerHeight } = useContext(BannerContext);
  return bannerHeight;
};

export function NotificationBannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);
  const [height, setHeight] = useState(40);
  const bannerRef = useRef<HTMLDivElement>(null);

  const measureHeight = useCallback(() => {
    if (bannerRef.current) {
      setHeight(bannerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    measureHeight();
    window.addEventListener("resize", measureHeight);
    return () => window.removeEventListener("resize", measureHeight);
  }, [measureHeight, visible]);

  return (
    <BannerContext.Provider value={{ bannerHeight: visible ? height : 0 }}>
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={bannerRef}
            key="notification-banner"
            initial={false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
          >
            <div className="bg-white dark:bg-[#18181B] border-b border-black/10 dark:border-white/10">
              <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
                <Rocket
                  className="flex-shrink-0 hidden sm:block w-4 h-4 text-black dark:text-white"
                />
                <p className="text-center text-sm text-black dark:text-white">
                  <span className="font-bold">Airdrop is Live!</span>{" "}
                  Over 20 million $BLIP is being airdropped to early
                  supporters.{" "}
                  <Link
                    to="/tokenomics"
                    className="font-semibold underline underline-offset-2 text-black dark:text-white"
                  >
                    Learn More
                  </Link>
                </p>
                <button
                  onClick={() => setVisible(false)}
                  className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4 text-black/40 dark:text-white/40" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Spacer so content isn't hidden behind the fixed banner */}
      {visible && <div style={{ height }} />}
      {children}
    </BannerContext.Provider>
  );
}
