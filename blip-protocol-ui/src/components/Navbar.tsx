import React, { useEffect, useState, useRef, memo, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent, useMotionValue, useSpring } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
  Sun,
  Moon,
  Zap,
  Menu,
  X,
  Download,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { sounds } from "@/lib/sounds";
import { useTheme } from "next-themes";
import { useBannerHeight } from "./NotificationPopup";

/* ---------------- Main Navbar ---------------- */

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // ── PWA install + push-notification opt-in ────────────────────────────────
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    if (standalone) setIsInstalled(true);
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleDownload = useCallback(async () => {
    // 1) Native install prompt (Android/Chrome desktop)
    if (installPrompt) {
      installPrompt.prompt();
      try { await installPrompt.userChoice; } catch (_) {}
      setInstallPrompt(null);
    } else if (!isInstalled) {
      // 2) iOS Safari + browsers that don't fire the event: show a quick hint
      const ua = navigator.userAgent;
      const isIOS = /iPhone|iPad|iPod/.test(ua) && !(window as { MSStream?: unknown }).MSStream;
      if (isIOS) {
        alert("To install Blip on iPhone: tap the Share button in Safari, then \"Add to Home Screen\".");
      }
    }
    // 3) Request notification permission so the team can push later via /sw.js.
    if ("Notification" in window && Notification.permission === "default") {
      try { await Notification.requestPermission(); } catch (_) {}
    }
  }, [installPrompt, isInstalled]);
  const showDownload = !isInstalled;

  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bannerHeight = useBannerHeight();

  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY.current ? "down" : "up";

    // Hide once scrolled past hero, show only at top
    if (latest > 100) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }

    setIsScrolled(latest > 20);
    lastScrollY.current = latest;
  });

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{
          y: isHidden && !mobileMenuOpen ? -100 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          top: bannerHeight,
          background: "#000",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: isScrolled ? "0 10px 40px -20px rgba(0,0,0,0.6)" : "none",
        }}
        className="fixed w-full z-50"
      >
        {/* hairline accent — barely-there gradient under the bar */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(204,120,92,0.22) 50%, transparent 100%)",
          }}
        />

        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="h-[58px] flex items-center justify-between">
            {/* LEFT — Logo + tiny deep-tech status chip */}
            <div className="flex items-center gap-4">
              <Logo onDark={true} />
              <div className="hidden md:flex items-center gap-1.5 pl-4 ml-1 border-l border-white/[0.08]">
                <motion.span
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#cc785c", boxShadow: "0 0 8px rgba(204,120,92,0.7)" }}
                />
                <span
                  className="text-[9.5px] font-semibold tracking-[0.22em] text-white/55"
                  style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  MAINNET · LIVE
                </span>
              </div>
            </div>

            {/* CENTER — nav */}
            <div className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
              <NavItem to="/how-it-works" onDark={true}>
                {t("howItWorks")}
              </NavItem>
              <NavItem to="/market" onDark={true}>
                Market
              </NavItem>
              <NavItem to="/merchant" onDark={true}>
                Merchant
              </NavItem>
              <NavItem to="/user" onDark={true}>
                User
              </NavItem>
              <NavItem to="/whitepaper" onDark={true}>
                Whitepaper
              </NavItem>
            </div>

            {/* RIGHT — CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <CTAButton to="/dashboard">Dashboard</CTAButton>
              ) : (
                <CTAButton to="https://app.blip.money/waitlist/user">Join Waitlist</CTAButton>
              )}
            </div>

            {/* MOBILE — install + menu */}
            <div className="flex gap-2 lg:hidden">
              {showDownload && (
                <button
                  type="button"
                  onClick={handleDownload}
                  aria-label="Install Blip app"
                  className="h-9 inline-flex items-center gap-1.5 px-3 rounded-full text-[11.5px] font-semibold tracking-tight transition-transform active:scale-[0.97]"
                  style={{
                    background: "#cc785c",
                    color: "#ffffff",
                    boxShadow: "0 8px 22px -8px rgba(204,120,92,0.65)",
                  }}
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Install
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 text-white" />
                ) : (
                  <Menu className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

/* ---------------- Logo ---------------- */

export const Logo = memo(({ className = "", onDark = false }: { className?: string; onDark?: boolean }) => {
  return (
    <Link
      to="/"
      className="flex items-center gap-1.5 group no-underline hover:no-underline"
      onClick={() => sounds.click()}
    >
      <motion.span
        className={`${className} font-display text-[22px] leading-none flex items-center gap-1.5`}
        style={{ letterSpacing: "-0.045em", fontWeight: 700 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <svg
          viewBox="0 0 120 120"
          width="20"
          height="20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ flexShrink: 0, marginBottom: 1 }}
        >
          <path
            d="M20 60 L36 60 L48 24 L72 96 L84 60 L100 60"
            stroke={onDark ? "#ffffff" : "#0b0b0c"}
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={onDark ? "text-white" : "text-black dark:text-white"}>
          Blip
        </span>
        <span
          className={`-ml-1 ${onDark ? "text-white" : "text-black dark:text-white"}`}
          style={{
            fontStyle: "italic",
            fontWeight: 600,
            letterSpacing: "-0.045em",
          }}
        >
          money
        </span>
      </motion.span>
    </Link>
  );
});

/* ---------------- Nav Item ---------------- */

const NavItem = ({
  to,
  children,
  onDark = false,
}: {
  to: string;
  children: React.ReactNode;
  onDark?: boolean;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      onClick={() => sounds.click()}
      onMouseEnter={() => sounds.hover()}
      className="group relative px-4 h-9 inline-flex items-center rounded-full text-[14.5px] font-semibold tracking-[-0.01em] transition-colors duration-200"
    >
      {/* hover/active soft pill */}
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full transition-opacity duration-200 ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{
          background: isActive
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.05)",
          border: isActive
            ? "1px solid rgba(255,255,255,0.10)"
            : "1px solid rgba(255,255,255,0.06)",
        }}
      />
      <span
        className={`relative z-10 ${
          onDark
            ? isActive
              ? "text-white"
              : "text-white/80 group-hover:text-white"
            : isActive
              ? "text-black dark:text-white"
              : "text-black/75 dark:text-white/80 group-hover:text-black dark:group-hover:text-white"
        }`}
      >
        {children}
      </span>

      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full"
          style={{ background: "#cc785c", boxShadow: "0 0 8px rgba(204,120,92,0.6)" }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
    </NavLink>
  );
};

/* ---------------- CTA Button ---------------- */

export const CTAButton = ({
  to,
  children,
  className,
  variant = "primary",
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}) => {
  const isPrimary = variant === "primary";
  const ref = React.useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    // Subtle magnetic pull (max 6px)
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 10;
    mx.set(dx);
    my.set(dy);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.97 }}
      style={{ x: sx, y: sy }}
      className="relative inline-block"
    >
      <Link
        to={to}
        onClick={() => sounds.click()}
        onMouseEnter={() => sounds.hover()}
        className={`
          ${className ?? ""}
          group relative overflow-hidden inline-flex
          items-center justify-center h-10 px-5 rounded-full
          text-[13px] font-semibold tracking-tight transition-all duration-300 ease-out
          ${
            isPrimary
              ? "bg-white/[0.04] text-white border border-white/[0.14] hover:bg-white/[0.09] hover:border-white/30"
              : "bg-transparent text-white/85 border border-white/[0.10] hover:text-white hover:bg-white/[0.06] hover:border-white/25"
          }
        `}
      >
        {/* Shine sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
          style={{
            background:
              "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)",
          }}
        />
        <span className="relative z-10 font-semibold flex items-center gap-2">
          {children}
          {isPrimary ? (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          ) : (
            ""
          )}
        </span>
      </Link>
    </motion.div>
  );
};

/* ---------------- Theme Switcher ---------------- */

const ThemeSwitcher = memo(() => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    sounds.toggle(newTheme === "light");
    setTheme(newTheme);
  }, [theme, setTheme]);

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="relative w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-white" />
      ) : (
        <Moon className="w-4 h-4 text-white" />
      )}
    </motion.button>
  );
});

/* ---------------- Mobile Menu ---------------- */

const MobileMenu = memo(({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const bannerH = useBannerHeight();

  if (!isOpen) return null;

  const handleNavClick = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    sounds.click();
    onClose();

    setTimeout(() => {
      navigate(to);
    }, 100);
  };

  const menuItems = [
    { to: "/how-it-works", label: t("howItWorks") },
    { to: "/market", label: "Market" },
    { to: "/merchant", label: "Merchant" },
    // { to: "/research", label: "Research" },
    // { to: "/blog", label: "Blog" },
    { to: "/user", label: "User" },
    { to: "/whitepaper", label: "Whitepaper" },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div
        id="mobile-menu"
        style={{ top: 61 + bannerH }}
        className="fixed left-4 right-4 z-50 rounded-xl overflow-hidden bg-[#FAF8F5] dark:bg-[#111113] border border-black/10 dark:border-white/[0.08]"
      >
        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.to}
              href={item.to}
              onClick={(e) => handleNavClick(e, item.to)}
              className="flex items-center justify-between py-3 px-3 rounded-lg text-[19px] font-semibold text-gray-500 dark:text-[#A1A1AA] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#18181B] transition-colors"
            >
              {item.label}
              <ChevronRight className="w-4 h-4 " />
            </a>
          ))}
        </div>

        {/* mobile nav footer — always rendered now that rates moved to p2prate.live */}
        <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-2">
            {isAuthenticated ? (
              <a
                href="/dashboard"
                onClick={(e) => handleNavClick(e, "/dashboard")}
                className="block w-full text-center py-1.5 rounded-full bg-white text-black border border-black/10 text-sm font-semibold transition-all duration-200 hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98]"
              >
                Dashboard
              </a>
            ) : (
              <a
                href="https://app.blip.money/waitlist/user"
                onClick={(e) => handleNavClick(e, "https://app.blip.money/waitlist/user")}
                className="block w-full text-center py-1.5 rounded-full bg-white text-black border border-black/10 text-sm font-semibold transition-all duration-200 hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98]"
              >
                Join Waitlist
              </a>
            )}
          </div>
      </div>
      <style>{`
        @keyframes blip-trace {
          0%   { stroke-dashoffset: 140; opacity: 0.4; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { stroke-dashoffset: -140; opacity: 0.4; }
        }
      `}</style>
    </>
  );
});
