import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Link
        to="#"
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 rounded-full transition ${
          currentLanguage === "en"
            ? "bg-[#00FF94] text-black"
            : "text-gray-400 hover:text-white"
        }`}
      >
        EN
      </Link>

      <Link
        to="#"
        onClick={() => changeLanguage("ar")}
        className={`px-3 py-1 rounded-full transition ${
          currentLanguage === "ar"
            ? "bg-[#00FF94] text-black"
            : "text-gray-400 hover:text-white"
        }`}
      >
        العربية
      </Link>
    </div>
  );
};

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88]" />
            <div className="absolute inset-0 bg-[#2BFF88] rounded-full animate-ping opacity-50" />
          </div>
          <span className="text-2xl font-bold text-white">
            Blip.<span className="text-[#2BFF88]">money</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-8 text-sm font-medium text-gray-400">
            <Link to="/#protocol" className="hover:text-[#2BFF88]">
              {t("protocol")}
            </Link>

            <NavLink
              to="/howItWorks"
              className={({ isActive }) =>
                isActive
                  ? "text-[#2BFF88] font-semibold"
                  : "hover:text-[#2BFF88]"
              }
            >
              {t("howItWorks")}
            </NavLink>

            <NavLink
              to="/rewards"
              className={({ isActive }) =>
                isActive
                  ? "text-[#2BFF88] font-semibold"
                  : "hover:text-[#2BFF88]"
              }
            >
              {t("rewards")}
            </NavLink>

            <NavLink
              to="/tokenomics"
              className={({ isActive }) =>
                isActive
                  ? "text-[#2BFF88] font-semibold"
                  : "hover:text-[#2BFF88]"
              }
            >
              {t("tokenomics")}
            </NavLink>
          </div>

          <LanguageSwitcher />

          {/* {location.pathname !== "/coming-soon" && (
            <Link
              to="/coming-soon"
              className="px-5 py-2 rounded-full border border-white/10 text-white text-sm hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all"
            >
              Coming Soon
            </Link>
          )} */}
          <NavLink
            to="/coming-soon"
            className={({ isActive }) =>
              isActive
                ? "text-[#2BFF88]  border border-[#2BFF88] px-5 py-2 rounded-full "
                : "px-5 py-2 rounded-full border border-white/10 text-white text-sm hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all"
            }
          >
            {t("comingSoon")}
          </NavLink>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-white/10"
            >
              <div className="flex flex-col p-6 space-y-4 text-lg text-gray-400">
                <Link to="/#protocol" onClick={() => setMobileMenuOpen(false)}>
                  {t("protocol")}
                </Link>

                <Link to="/howItWorks" onClick={() => setMobileMenuOpen(false)}>
                  {t("howItWorks")}
                </Link>

                <Link to="/rewards" onClick={() => setMobileMenuOpen(false)}>
                  {t("rewards")}
                </Link>

                <Link to="/tokenomics" onClick={() => setMobileMenuOpen(false)}>
                  {t("tokenomics")}
                </Link>

                <Link
                  to="/coming-soon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 px-5 py-3 text-center rounded-full border border-white/10 text-white hover:border-[#2BFF88]"
                >
                  {t("comingSoon")}
                </Link>

                <div className="pt-4 border-t border-white/10">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
