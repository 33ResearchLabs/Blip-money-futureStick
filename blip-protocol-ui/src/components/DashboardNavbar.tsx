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
} from "lucide-react";
import { BsPeople } from "react-icons/bs";
import { twoFactorApi } from "@/services/twoFatctor";
import { toast } from "sonner";

interface DashboardNavbarProps {
  walletAddress: string;
  blipPoints: number;
  onLogout: () => void;
}

export default function DashboardNavbar({
  walletAddress,
  blipPoints,
  onLogout,
}: DashboardNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

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
    <nav className="border-b border-zinc-800/50 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff6b35] shadow-[0_0_10px_#ff6b35]" />
            <div className="absolute inset-0 rounded-full bg-[#ff6b35] animate-pulse opacity-50" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-white">
            Blip.<span className="text-[#ff6b35]">money</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Points Display */}
          <div className="flex items-center gap-6 mr-4 border-r border-zinc-800 pr-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-tighter text-zinc-500 font-bold">
                Protocol Balance
              </span>
              <span className="text-[#ff6b35] font-mono text-sm font-bold">
                {blipPoints} pts
              </span>
            </div>
          </div>

          {/* Wallet Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold leading-none mb-1">
                Authenticated
              </span>
              <span className="text-zinc-200 font-mono text-xs">
                {walletAddress}
              </span>
            </div>

            <div ref={dropdownRef} className="relative">
              <div
                className="w-8 h-8 rounded-full  border border-[#ff6b35] flex items-center justify-center cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <ShieldCheck className="text-[#ff6b35]" size={16} />
              </div>

              {open && (
                <div className="absolute -right-20 mt-3 w-40 bg-zinc-900 border border-zinc-700 rounded-sm shadow-lg z-50">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
                    onClick={() => navigate("/twoFactorAuth")}
                  >
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
            </div>

            {/* <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 bg-black border border-zinc-700 text-zinc-300 text-sm"
              >
                <User size={14} className="text-[#ff6b35]" />
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
          className="md:hidden p-2 rounded-sm bg-zinc-800/50 border border-zinc-700/50"
        >
          {isMobileMenuOpen ? (
            <X size={20} className="text-zinc-400" />
          ) : (
            <Menu size={20} className="text-zinc-400" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800/50 bg-[#050505]/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-4">
            {/* Points Display - Mobile */}
            <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-sm border border-zinc-800">
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-[#ff6b35]" />
                <span className="text-xs text-zinc-500 uppercase font-bold">
                  Balance
                </span>
              </div>
              <span className="text-[#ff6b35] font-mono text-sm font-bold">
                {blipPoints} pts
              </span>
            </div>

            {/* Wallet Info - Mobile */}
            <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-sm border border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/30 flex items-center justify-center">
                  <ShieldCheck className="text-[#ff6b35]" size={12} />
                </div>
                <span className="text-xs text-zinc-500 uppercase font-bold">
                  Wallet
                </span>
              </div>
              <span className="text-zinc-200 font-mono text-xs">
                {walletAddress}
              </span>
            </div>

            {/* Logout Button - Mobile */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all text-sm font-bold uppercase tracking-wider text-zinc-300"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
