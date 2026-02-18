import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Coins,
  User,
  Settings,
  Sun,
  Moon,
  Wallet,
  MenuIcon,
} from "lucide-react";
import { BsPeople } from "react-icons/bs";
import { twoFactorApi } from "@/services/twoFatctor";
import { toast } from "sonner";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useTheme } from "next-themes";
import { Logo } from "./Navbar";
import { AnimatePresence } from "framer-motion";

interface DashboardNavbarProps {
  walletAddress: string;
  blipPoints: number;
  onLogout: () => void;
  onPointsClick?: () => void;
}

export default function DashboardNavbar({
  walletAddress,
  blipPoints,
  onLogout,
  onPointsClick,
}: DashboardNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const lastScrollY = useRef(0);

  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const { scrollY } = useScroll();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  /* ---------------- SCROLL BEHAVIOR ---------------- */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > lastScrollY.current ? "down" : "up";

    if (direction === "down" && latest > 100 && !isMobileMenuOpen) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }

    setIsScrolled(latest > 20);
    lastScrollY.current = latest;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{
        y: isHidden && !isMobileMenuOpen ? -100 : 0,
      }}
      transition={{ duration: 0.25 }}
      className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 border-b border-black/5 dark:border-white/5"
      style={{
        backdropFilter: isScrolled ? "blur(12px)" : "blur(8px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Points Display */}
          <div
            onClick={onPointsClick}
            className="flex items-center gap-6 mr-4 border-r border-black/10 dark:border-white/10 pr-6 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-tighter text-black/50 dark:text-white/50 font-bold">
                Protocol Balance
              </span>
              <span className="text-black dark:text-white font-mono text-sm font-bold">
                {blipPoints} pts
              </span>
            </div>
          </div>

          

          {/* Wallet Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-black/50 dark:text-white/50 uppercase tracking-widest font-bold leading-none mb-1">
                {walletAddress !== "Not Connected" ? "Wallet" : "No Wallet"}
              </span>
              <span className="text-black/80 dark:text-white/80 font-mono text-xs flex items-center gap-1">
                {walletAddress !== "Not Connected" && (
                  <Wallet className="w-3 h-3" />
                )}
                {walletAddress}
              </span>
            </div>


            {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-sm bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-white" />
            ) : (
              <Moon className="w-4 h-4 text-black" />
            )}
          </button>

          

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-sm bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-colors"
              >
                {open ? (
                  <X className="w-4 h-4 text-black dark:text-white" />
                ) : (
                  <MenuIcon className="w-4 h-4 text-black dark:text-white" />
                )}
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-48 
                 backdrop-blur-xl bg-white dark:bg-[#0f0f12]/80
                 border border-black/10 dark:border-white/10
                 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    {/* Settings */}
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="group w-full flex items-center gap-3 px-4 py-3 text-sm
                   text-black/70 dark:text-white/70
                   hover:bg-black/5 dark:hover:bg-white/5
                   transition-all duration-200"
                      onClick={() => {
                        navigate("/twoFactorAuth");
                        setOpen(false);
                      }}
                    >
                      <Settings
                        size={16}
                        className="group-hover:rotate-12 transition-transform duration-200"
                      />
                      <span>Settings</span>
                    </motion.button>

                    {/* Divider */}
                    <div className="h-px bg-black/5 dark:bg-white/5 mx-3" />

                    {/* Logout */}
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onLogout();
                        setOpen(false);
                      }}
                      className="group w-full flex items-center gap-3 px-4 py-3 text-sm
                   text-red-600 dark:text-red-400
                   hover:bg-red-500/5
                   transition-all duration-200"
                    >
                      <LogOut
                        size={16}
                        className="group-hover:-rotate-12 transition-transform duration-200"
                      />
                      <span>Logout</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 bg-black border border-zinc-700 text-zinc-300 text-sm"
              >
                <User size={14} className="text-[#ffffff]" />
                User
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-700 rounded-sm shadow-lg z-50">
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
                  onClick={()=>navigate("/twoFactorAuth")}>
                    <Settings size={14} />
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      onLogout();
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-zinc-800"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
              
            </div> */}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
        >
          {isMobileMenuOpen ? (
            <X size={20} className="text-black dark:text-white" />
          ) : (
            <Menu size={20} className="text-black dark:text-white" />
          )}
        </button>
      </div>

      

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-black/10 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-4">
            
            <div
              onClick={onPointsClick}
              className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-sm border border-black/10 dark:border-white/10 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-black dark:text-white" />
                <span className="text-xs text-black/50 dark:text-white/50 uppercase font-bold">
                  Balance
                </span>
              </div>
              <span className="text-black dark:text-white font-mono text-sm font-bold">
                {blipPoints} pts
              </span>
            </div>

          
            <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-sm border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/30 flex items-center justify-center">
                  <ShieldCheck
                    className="text-black dark:text-white"
                    size={12}
                  />
                </div>
                <span className="text-xs text-black/50 dark:text-white/50 uppercase font-bold">
                  Wallet
                </span>
              </div>
              <span className="text-black/80 dark:text-white/80 font-mono text-xs">
                {walletAddress}
              </span>
            </div>

           
            <button
              onClick={() => navigate("/twoFactorAuth")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-all text-sm font-bold uppercase tracking-wider text-black/70 dark:text-white/70"
            >
              <Settings size={14} />
              Settings
            </button>

            
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-800 transition-all text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-400"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
