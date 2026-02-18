import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
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
        className={`fixed top-0 w-full z-50 ${
          isScrolled
            ? "bg-[#FAF8F5] dark:bg-[rgba(10,10,11,0.8)] dark:backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-[72px] flex items-center justify-between">
            <Logo />

            <div className="hidden lg:flex items-center gap-1">
              <NavItem to="/how-it-works">{t("howItWorks")}</NavItem>
              <NavItem to="/merchant">Merchant</NavItem>
              <NavItem to="/research">Research</NavItem>
              <NavItem to="/blog">Blog</NavItem>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <ThemeSwitcher />
              {isAuthenticated ? (
                <CTAButton to="/dashboard">Dashboard</CTAButton>
              ) : (
                <CTAButton to="/waitlist">Join Waitlist</CTAButton>
              )}
            </div>

            <div className="flex gap-2 lg:hidden">
              <ThemeSwitcher />
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="w-9 h-9 rounded-lg bg-black/5 dark:bg-[#18181B] border border-black/10 dark:border-white/[0.06] flex items-center justify-center"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 text-black dark:text-white" />
                ) : (
                  <Menu className="w-4 h-4 text-black dark:text-white" />
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

export const Logo = ({ className = "" }) => {
  return (
    <Link
      to="/"
      className="flex items-center gap-1.5 group"
      onClick={() => sounds.click()}
    >
      <Zap
        className="w-5 h-5 text-black dark:text-white fill-black dark:fill-white"
        strokeWidth={2}
      />

      <motion.span
        className={`${className} text-[23px] font-semibold tracking-tight leading-none flex items-center`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-black dark:text-white">Blip</span>
        <span className="relative text-black dark:text-white ml-1 italic">
          money
          <motion.span
            className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-black/50 dark:from-white/50 to-transparent opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
        </span>
      </motion.span>
    </Link>
  );
};

/* ---------------- Nav Item ---------------- */

const NavItem = ({ to, children }: any) => {
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
          isActive
            ? "text-black dark:text-white"
            : "text-black/70 dark:text-[#A1A1AA] hover:text-black dark:hover:text-white"
        }
      >
        {children}
      </span>

      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute -bottom-[1px] left-3 right-3 h-[2px] rounded-full bg-black dark:bg-white"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
    </NavLink>
  );
};

/* ---------------- CTA Button ---------------- */

export const CTAButton = ({ to, children, className }: any) => {
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
          bg-black text-white border border-black
          dark:bg-white dark:text-black dark:border-white
        `}
      >
        <span className="relative z-10 font-semibold flex items-center gap-2">
          {children}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </Link>
    </motion.div>
  );
};

/* ---------------- Theme Switcher ---------------- */

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    sounds.toggle(newTheme === "light");
    setTheme(newTheme);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-white" />
      ) : (
        <Moon className="w-4 h-4 text-black" />
      )}
    </motion.button>
  );
};

/* ---------------- Mobile Menu ---------------- */

const MobileMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    { to: "/research", label: "Research" },
    { to: "/blog", label: "Blog" },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed top-[72px] left-4 right-4 z-50 rounded-xl overflow-hidden bg-[#FAF8F5] dark:bg-[#111113] border border-black/10 dark:border-white/[0.08]">
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

        <div className="p-4 border-t border-black/5 dark:border-white/5 space-y-2">
          {isAuthenticated ? (
            <a
              href="/dashboard"
              onClick={(e) => handleNavClick(e, "/dashboard")}
              className="block w-full text-center py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium"
            >
              Dashboard
            </a>
          ) : (
            <a
              href="/waitlist"
              onClick={(e) => handleNavClick(e, "/waitlist")}
              className="block w-full"
            >
              <CTAButton to="/waitlist" className="w-full">
                Join Waitlist
              </CTAButton>
            </a>
          )}
        </div>
      </div>
    </>
  );
};
