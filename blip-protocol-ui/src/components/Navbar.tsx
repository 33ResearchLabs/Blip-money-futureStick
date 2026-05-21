import React, { useEffect, useState, useRef, memo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionValue, useSpring } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Sun,
  Moon,
  Zap,
  Menu,
  X,
  User as UserIcon,
  Store,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sounds } from "@/lib/sounds";

// External waitlist URLs (the waitlist app lives at app.blip.money)
const WAITLIST_USER_URL = "https://app.blip.money/waitlist/user";
const WAITLIST_MERCHANT_URL = "https://app.blip.money/waitlist/merchant";
import { useTheme } from "next-themes";
import { useBannerHeight } from "./NotificationPopup";

/* ---------------- Main Navbar ---------------- */

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const { t } = useTranslation();
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
              <WaitlistDropdown />
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

  const isExternal = /^https?:\/\//i.test(to);
  const innerClassName = `
    ${className}
    group relative overflow-hidden inline-flex
    items-center justify-center px-5 py-2.5 rounded-full
    text-[16px] font-semibold transition-all duration-300 ease-out
    ${
      isPrimary
        ? "dark:bg-white dark:text-black border bg-white text-black border-white/20 hover:shadow-[0_8px_28px_rgba(255,255,255,0.14)]"
        : "dark:bg-transparent dark:text-white text-white border border-white/30 hover:border-white/60 hover:bg-white/10 hover:shadow-[0_8px_24px_rgba(255,255,255,0.08)]"
    }
  `;
  const innerContent = (
    <>
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
    </>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.97 }}
      style={{ x: sx, y: sy }}
      className="relative inline-block"
    >
      {isExternal ? (
        <a
          href={to}
          onClick={() => sounds.click()}
          onMouseEnter={() => sounds.hover()}
          className={innerClassName}
        >
          {innerContent}
        </a>
      ) : (
        <Link
          to={to}
          onClick={() => sounds.click()}
          onMouseEnter={() => sounds.hover()}
          className={innerClassName}
        >
          {innerContent}
        </Link>
      )}
    </motion.div>
  );
};

/* ---------------- Waitlist Dropdown (User / Merchant chooser) ---------------- */

export const WaitlistDropdown = ({
  variant = "navbar",
}: {
  /** "navbar" = compact pill for the top nav. "hero" wouldn't be used here but is here for future. */
  variant?: "navbar";
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click + on Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const options = [
    {
      url: WAITLIST_USER_URL,
      icon: UserIcon,
      label: "As a User",
      sub: "Earn points, complete quests, climb the leaderboard.",
    },
    {
      url: WAITLIST_MERCHANT_URL,
      icon: Store,
      label: "As a Merchant",
      sub: "Run a P2P desk, set your margin, earn higher rewards.",
    },
  ];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => {
          sounds.click();
          setOpen((v) => !v);
        }}
        onMouseEnter={() => sounds.hover()}
        aria-haspopup="menu"
        aria-expanded={open}
        className="
          group relative overflow-hidden inline-flex items-center justify-center
          px-5 py-2.5 rounded-full text-[16px] font-semibold
          dark:bg-white dark:text-black bg-white text-black
          border border-white/20
          hover:shadow-[0_8px_28px_rgba(255,255,255,0.14)]
          transition-all duration-300 ease-out
        "
      >
        {/* Shine sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
          style={{
            background:
              "linear-gradient(110deg, transparent 35%, rgba(255,107,53,0.35) 50%, transparent 65%)",
          }}
        />
        <span className="relative z-10 font-semibold flex items-center gap-2">
          Join Waitlist
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            role="menu"
            className="
              absolute right-0 mt-3 w-[340px] z-50
              rounded-2xl overflow-hidden
              bg-white dark:bg-[#0a0a0a]
              border border-black/[0.08] dark:border-white/[0.08]
              shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)]
              backdrop-blur-xl
            "
          >
            <div className="px-4 pt-4 pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                Join the Waitlist
              </p>
              <p className="text-[11px] text-black/60 dark:text-white/60 mt-1">
                Pick the role that fits how you'll use Blip.
              </p>
            </div>

            <div className="p-2 space-y-1">
              {options.map((opt) => (
                <a
                  key={opt.url}
                  href={opt.url}
                  role="menuitem"
                  onClick={() => sounds.click()}
                  className="
                    group/item flex items-start gap-3 p-3 rounded-xl
                    hover:bg-black/[0.04] dark:hover:bg-white/[0.05]
                    transition-colors
                  "
                >
                  <div
                    className="
                      w-10 h-10 rounded-lg shrink-0
                      bg-[#F5F3F0] dark:bg-white/5
                      border border-black/[0.08] dark:border-white/[0.08]
                      flex items-center justify-center
                      group-hover/item:border-[#ff6b35]/40
                      transition-colors
                    "
                  >
                    <opt.icon className="w-5 h-5 text-black dark:text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-black dark:text-white">
                        {opt.label}
                      </p>
                      <ArrowRight className="w-3.5 h-3.5 text-black/30 dark:text-white/30 group-hover/item:text-[#ff6b35] group-hover/item:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] text-black/55 dark:text-white/55 leading-relaxed mt-0.5">
                      {opt.sub}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="px-4 py-2.5 border-t border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
              <p className="text-[10px] text-black/40 dark:text-white/40 text-center">
                Both flows are independent — you can join either or both.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

        {/* mobile nav footer — two clear role-based waitlist CTAs */}
        <div className="p-4 border-t border-black/5 dark:border-white/5">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-black/40 dark:text-white/40 mb-2.5">
            Join the Waitlist
          </p>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={WAITLIST_USER_URL}
              onClick={() => sounds.click()}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black border border-black/10 text-[13px] font-semibold transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
            >
              <UserIcon className="w-4 h-4" />
              As a User
            </a>
            <a
              href={WAITLIST_MERCHANT_URL}
              onClick={() => sounds.click()}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-black text-white border border-black/10 dark:bg-white/5 dark:text-white dark:border-white/10 text-[13px] font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              <Store className="w-4 h-4" />
              As a Merchant
            </a>
          </div>
        </div>
      </div>
    </>
  );
});
