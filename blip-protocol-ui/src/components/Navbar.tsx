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
        transition={{ duration: 0.25 }}
        style={{ top: bannerHeight }}
        className={`fixed w-full z-50  ${
          isScrolled
            ? "bg-[#1d1d1f]/90 dark:bg-[rgba(10,10,11,0.8)] backdrop-blur-xl dark:backdrop-blur-xl border-b border-white/[0.06] dark:border-white/[0.06]"
            : "bg-black border-b border-white/[0.06] dark:border-white/[0.06]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-[61px] flex items-center justify-between">
            <Logo onDark={true} />

            <div className="hidden lg:flex items-center gap-1">
              <NavItem to="/how-it-works" onDark={true}>
                {t("howItWorks")}
              </NavItem>
              <NavItem to="/merchant" onDark={true}>
                Merchant
              </NavItem>
              {/* <NavItem to="/research" onDark={true}>
                Research
              </NavItem>
              <NavItem to="/blog" onDark={true}>
                Blog
              </NavItem> */}
              <NavItem to="/user" onDark={true}>
                User
              </NavItem>
              <NavItem to="/whitepaper" onDark={true}>
                Whitepaper
              </NavItem>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <CTAButton to="/dashboard">Dashboard</CTAButton>
              ) : (
                <CTAButton to="/waitlist">Join Waitlist</CTAButton>
              )}
            </div>

            <div className="flex gap-2 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className="w-9 h-9 rounded-lg bg-white/10 dark:bg-[#18181B] border border-white/[0.1] dark:border-white/[0.06] flex items-center justify-center"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 text-white dark:text-white" />
                ) : (
                  <Menu className="w-4 h-4 text-white dark:text-white" />
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
      <svg
        viewBox="0 0 70 60"
        className="h-[17px] w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 36 L16 36 L25 8 L38 52 L47 28 L66 28"
          className={onDark ? "stroke-white" : "stroke-black dark:stroke-white"}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <motion.span
        className={`${className} text-[20px] font-semibold tracking-tight leading-none flex items-center`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <span className={onDark ? "text-white" : "text-black dark:text-white"}>
          Blip
        </span>
        <span
          className={`relative ml-1 italic ${onDark ? "text-white" : "text-black dark:text-white"}`}
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
      className="relative px-3 py-2 text-[17px] font-semibold transition-colors duration-200"
    >
      <span
        className={
          onDark
            ? isActive
              ? "text-white"
              : "text-white/60 hover:text-white"
            : isActive
              ? "text-black dark:text-white"
              : "text-black/70 dark:text-[#A1A1AA] hover:text-black dark:hover:text-white"
        }
      >
        {children}
      </span>

      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className={`absolute -bottom-[1px] left-3 right-3 h-[2px] rounded-full ${onDark ? "bg-white" : "bg-black dark:bg-white"}`}
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
          ${className}
          group relative overflow-hidden inline-flex
          items-center justify-center px-5 py-2.5 rounded-full
          text-[16px] font-semibold transition-all duration-300 ease-out
          ${
            isPrimary
              ? "dark:bg-white dark:text-black border bg-white text-black border-white/20 hover:shadow-[0_8px_28px_rgba(255,255,255,0.14)]"
              : "dark:bg-transparent dark:text-white text-white border border-white/30 hover:border-white/60 hover:bg-white/10 hover:shadow-[0_8px_24px_rgba(255,255,255,0.08)]"
          }
        `}
      >
        {/* Shine sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
          style={{
            background: isPrimary
              ? "linear-gradient(110deg, transparent 35%, rgba(255,107,53,0.35) 50%, transparent 65%)"
              : "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%)",
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
              className="flex items-center justify-between py-3 px-3 rounded-lg text-[15px] text-gray-500 dark:text-[#A1A1AA] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#18181B] transition-colors"
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
                href="/waitlist"
                onClick={(e) => handleNavClick(e, "/waitlist")}
                className="block w-full text-center py-1.5 rounded-full bg-white text-black border border-black/10 text-sm font-semibold transition-all duration-200 hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98]"
              >
                Join Waitlist
              </a>
            )}
          </div>
      </div>
    </>
  );
});
