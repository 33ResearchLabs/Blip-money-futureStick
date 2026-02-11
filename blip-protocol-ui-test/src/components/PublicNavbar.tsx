import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, LogOut, Menu, X, Wallet } from "lucide-react";

interface PublicNavbarProps {
  isWalletConnected: boolean;
  isAuthenticated?: boolean;
  walletAddress: string;
  onLogout?: () => void;
  onConnectClick?: () => void;
}

export default function PublicNavbar({
  isWalletConnected,
  isAuthenticated = false,
  walletAddress,
  onLogout,
  onConnectClick,
}: PublicNavbarProps) {
  // Show authenticated state only if both wallet connected AND authenticated
  const showAuthenticatedState = isWalletConnected && isAuthenticated;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-zinc-800/50 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            const protocolSection = document.getElementById("hero");
            if (protocolSection) {
              protocolSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <div className="relative">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88]" />
            <div className="absolute inset-0 rounded-full bg-[#2BFF88] animate-pulse opacity-50" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-white">
            Blip.<span className="text-[#2BFF88]">money</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <div className="h-4 w-px bg-zinc-800" />
          {showAuthenticatedState ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold leading-none mb-1">
                  Authenticated
                </span>
                <span className="text-zinc-200 font-mono text-xs">
                  {walletAddress}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center">
                <ShieldCheck className="text-[#39ff14]" size={16} />
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onConnectClick}
              className="bg-zinc-100 text-black px-5 py-2 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-[#39ff14] transition-all duration-300 active:scale-95"
            >
              Connect Wallet
            </button>
          )}
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
            {showAuthenticatedState ? (
              <>
                {/* Wallet Info - Mobile */}
                <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-sm border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center">
                      <ShieldCheck className="text-[#39ff14]" size={12} />
                    </div>
                    <span className="text-xs text-zinc-500 uppercase font-bold">
                      Connected
                    </span>
                  </div>
                  <span className="text-zinc-200 font-mono text-xs">
                    {walletAddress}
                  </span>
                </div>

                {/* Logout Button - Mobile */}
                {onLogout && (
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
                )}
              </>
            ) : (
              /* Connect Wallet Button - Mobile */
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onConnectClick?.();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-[#39ff14] hover:bg-[#32e012] transition-all text-sm font-bold uppercase tracking-wider text-black"
              >
                <Wallet size={16} />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
