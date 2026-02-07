import { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X, ChevronRight, ArrowRight } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { sounds } from "@/lib/sounds";

/* ============================================
   LINEAR-INSPIRED NAVBAR
   Minimal, refined, deeply interactive
   ============================================ */

/* ---------------- Logo ---------------- */
/* Brand Orange: #ffffff - LOCKED COLOR */
export const Logo = ({ className = "" }) => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 group"
      onClick={() => sounds.click()}
    >
      {/* Dot with motion */}
      <motion.span
        className="relative w-4 h-4 rounded-full bg-[#ff6b35] overflow-hidden"
        style={{
          boxShadow: "0 0 16px rgba(255, 255, 255, 0.35)",
        }}
        whileHover={{
          scale: 1.15,
          boxShadow: "0 0 28px rgba(255, 255, 255, 0.6)",
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {/* Shine sweep */}
        <motion.span
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
          }}
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </motion.span>

      {/* Text */}
      <motion.span
        className={`${className} text-[20px] font-semibold tracking-tight leading-none flex items-center`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-white">blip</span>
        <span className="text-white">.</span>

        {/* money text */}
        <span className="relative text-white ml-0.5">
          money
          {/* Underline effect */}
          <motion.span
            className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[#ffffff] to-transparent opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
        </span>
      </motion.span>
    </Link>
  );
};

/* ---------------- Nav Link ---------------- */
const NavItem = ({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      onClick={() => {
        sounds.click();
        onClick?.();
      }}
      onMouseEnter={() => sounds.hover()}
      className="relative px-3 py-2 text-[16px] font-medium transition-colors duration-200"
    >
      <span
        className={isActive ? "text-white" : "text-[#A1A1AA] hover:text-white"}
      >
        {children}
      </span>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute -bottom-[1px] left-3 right-3 h-[2px] rounded-full"
          style={{ background: "#ffffff" }}
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
  variant = "primary",
  className,
}: {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) => {
  const isPrimary = variant === "primary";

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="relative">
      <Link
        to={to}
        onClick={() => sounds.click()}
        onMouseEnter={() => sounds.hover()}
        className={`
          ${className}
          group relative overflow-hidden inline-flex
          items-center justify-center px-5 py-2.5 rounded-full
          text-[16px] font-medium transition-all duration-300
        
          ${
            isPrimary
              ? "bg-transparent text-white border "
              : "bg-transparent text-white border "
          }
        `}
      >
        {/* LEFT-TO-RIGHT HOVER FILL ANIMATION */}
        {isPrimary && (
          <span className="absolute inset-0 bg-white/20 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
        )}

        {/* BUTTON TEXT */}
        <span className="relative z-10 transition-colors duration-300 font-semibold flex items-center gap-2">
          {children}
          {isPrimary && (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          )}
        </span>
      </Link>
    </motion.div>
  );
};

/* ---------------- Language Switcher ---------------- */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng: string) => {
    sounds.toggle(lng === "en");
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <div className="flex items-center p-1 rounded-full bg-[#18181B] border border-[rgba(255,255,255,0.06)]">
      {["en", "ar"].map((lng) => (
        <motion.button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className={`
            relative px-2.5 py-1 text-[12px] font-medium rounded transition-colors
            ${
              currentLanguage === lng
                ? "text-white"
                : "text-[#71717A] hover:text-[#A1A1AA]"
            }
          `}
          whileTap={{ scale: 0.95 }}
        >
          {currentLanguage === lng && (
            <motion.div
              layoutId="langBg"
              className="absolute inset-0 rounded bg-[#27272A]"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">{lng === "en" ? "EN" : "عربي"}</span>
        </motion.button>
      ))}
    </div>
  );
};

/* ---------------- Mobile Menu ---------------- */
const MobileMenu = ({
  isOpen,
  onClose,
  onNavigate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const handleNavClick = () => {
    sounds.click();
    onNavigate(); // CLOSE BEFORE NAVIGATION
  };

  const menuItems = [
    { to: "/how-it-works", label: t("howItWorks") },
    { to: "/rewards", label: t("rewards") },
    { to: "/tokenomics", label: t("tokenomics") },
    { to: "/merchant", label: "Merchant" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-4 right-4 z-50 rounded-xl overflow-hidden"
            style={{
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="p-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className="flex items-center justify-between py-3 px-3 rounded-lg text-[15px] text-[#A1A1AA] hover:text-white hover:bg-[#18181B]"
                >
                  {item.label}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              ))}
            </div>

            <div className="p-4 border-t border-white/5 space-y-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={handleNavClick}
                  className="block w-full text-center py-2.5 rounded-full bg-white text-black text-sm font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <div onClick={handleNavClick}>
                    <CTAButton to="/coming-soon" className="w-full">
                      Coming Soon
                    </CTAButton>
                  </div>

                  <div onClick={handleNavClick}>
                    <CTAButton to="/waitlist" className="w-full">
                      Join Waitlist
                    </CTAButton>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ---------------- Hamburger Button ---------------- */
const HamburgerButton = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      onClick={() => {
        sounds.click();
        onClick();
      }}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center bg-[#18181B] border border-[rgba(255,255,255,0.06)]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-4 h-3 flex flex-col justify-between">
        <motion.span
          className="block h-[1.5px] bg-white rounded-full origin-left"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? -1 : 0,
            width: isOpen ? "120%" : "100%",
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="block h-[1.5px] bg-white rounded-full"
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? 8 : 0,
          }}
          transition={{ duration: 0.15 }}
        />
        <motion.span
          className="block h-[1.5px] bg-white rounded-full origin-left"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? 1 : 0,
            width: isOpen ? "120%" : "70%",
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.button>
  );
};

/* ---------------- Main Navbar ---------------- */
export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  /* ---------------- SAFE NAV HANDLER ---------------- */
  const handleNavigate = () => {
    setMobileMenuOpen(false);
  };

  /* ---------------- SCROLL BEHAVIOR ---------------- */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY.current ? "down" : "up";

    if (direction === "down" && latest > 100 && !mobileMenuOpen) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }

    setIsScrolled(latest > 20);
    lastScrollY.current = latest;
  });

  /* ---------------- CLOSE ON ROUTE CHANGE ---------------- */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  /* ---------------- BODY SCROLL LOCK ---------------- */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* ---------------- CLOSE ON DESKTOP RESIZE ---------------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{
          y: isHidden && !mobileMenuOpen ? -100 : 0,
        }}
        transition={{ duration: 0.25 }}
        className="fixed top-0 w-full z-50"
        style={{
          background: isScrolled ? "rgba(10,10,11,0.8)" : "transparent",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-[72px] flex items-center justify-between">
            <Logo />

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              <NavItem to="/how-it-works">{t("howItWorks")}</NavItem>
              <NavItem to="/rewards">{t("rewards")}</NavItem>
              <NavItem to="/tokenomics">{t("tokenomics")}</NavItem>
              <NavItem to="/merchant">{t("Merchant")}</NavItem>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <CTAButton to="/dashboard">Dashboard</CTAButton>
              ) : (
                <>
                  <CTAButton to="/coming-soon">{t("comingSoon")}</CTAButton>
                  <CTAButton to="/waitlist">Join Waitlist</CTAButton>
                </>
              )}
            </div>

            {/* Mobile Button */}
            <div className="lg:hidden">
              <HamburgerButton
                isOpen={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              />
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
};
