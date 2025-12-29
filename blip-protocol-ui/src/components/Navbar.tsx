import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, ShieldCheck, LogOut } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/* ---------------- Language Switcher ---------------- */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      {["en", "ar"].map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className={`px-3 py-1 rounded-full transition ${
            currentLanguage === lng
              ? "bg-[#2BFF88] text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {lng === "en" ? "EN" : "العربية"}
        </button>
      ))}
    </div>
  );
};

/* ---------------- Navbar ---------------- */
export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { publicKey, connected, disconnect } = useWallet();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardPage = location.pathname === "/dashboard";

  const walletAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey
        .toBase58()
        .slice(-4)}`
    : "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await disconnect();
      await logout();

      toast.success("Logged out", {
        description: "You have been successfully logged out.",
      });

      navigate("/");
    } catch (error) {
      toast.error("Logout failed", {
        description: "Please try again.",
      });
    }
  };

  /* ================= DASHBOARD NAVBAR ================= */
  if (isDashboardPage) {
    return (
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88]" />
            <span className="text-2xl font-bold text-white">
              Blip.<span className="text-[#2BFF88]">money</span>
            </span>
          </Link>

          {/* Auth Section */}
          {connected && (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  Authenticated
                </span>
                <span className="text-zinc-200 font-mono text-xs">
                  {walletAddress}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#2BFF88]/10 border border-[#2BFF88]/30 flex items-center justify-center">
                <ShieldCheck size={16} className="text-[#2BFF88]" />
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  }

  /* ================= PUBLIC NAVBAR ================= */
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88]" />
          <span className="text-2xl font-bold text-white">
            Blip.<span className="text-[#2BFF88]">money</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-8 text-sm text-gray-400">
            <NavLink to="/howItWorks" className="hover:text-[#2BFF88]">
              {t("howItWorks")}
            </NavLink>
            <NavLink to="/rewards" className="hover:text-[#2BFF88]">
              {t("rewards")}
            </NavLink>
            <NavLink to="/tokenomics" className="hover:text-[#2BFF88]">
              {t("tokenomics")}
            </NavLink>
          </div>

          <LanguageSwitcher />

          <NavLink
            to="/coming-soon"
            className="px-5 py-2 rounded-full border border-white/10 text-white hover:border-[#2BFF88]"
          >
            {t("comingSoon")}
          </NavLink>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 lg:hidden"
          >
            <div className="flex flex-col p-6 space-y-4 text-gray-400">
              <Link to="/howItWorks" onClick={() => setMobileMenuOpen(false)}>
                {t("howItWorks")}
              </Link>
              <Link to="/rewards" onClick={() => setMobileMenuOpen(false)}>
                {t("rewards")}
              </Link>
              <Link to="/tokenomics" onClick={() => setMobileMenuOpen(false)}>
                {t("tokenomics")}
              </Link>

              <div className="pt-4 border-t border-white/10">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
