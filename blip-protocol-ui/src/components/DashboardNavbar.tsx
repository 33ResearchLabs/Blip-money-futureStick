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
  const [show2FA, setShow2FA] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

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

  const handleEnable2FA = async () => {
    try {
      const res = await twoFactorApi.enableGoogleAuth();

      if (res?.success) {
        setQrCode(res.qrCode);
        setShow2FA(false); // close settings modal
      }
      toast({
        title: "2FA Setup Started",
        description: "Scan the QR code using Google Authenticator",
      })
    } catch (error) {
      alert(error?.message || "Failed to enable 2FA");
    }
  };

  // Verify otp
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);

      const res = await twoFactorApi.verifyGoogleAuth(otp);

      if (res?.success) {
        alert("2FA enabled successfully ");
        setShowVerifyModal(false);
        setQrCode(null);
        setOtp("");
      }
    } catch (error) {
      alert(error?.message || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <nav className="border-b border-zinc-800/50 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88]" />
            <div className="absolute inset-0 rounded-full bg-[#2BFF88] animate-pulse opacity-50" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-white">
            Blip.<span className="text-[#2BFF88]">money</span>
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
              <span className="text-[#39ff14] font-mono text-sm font-bold">
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
            <div className="w-8 h-8 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center">
              <ShieldCheck className="text-[#39ff14]" size={16} />
            </div>
            {/* <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white"
            >
              <LogOut size={14} />
              Logout
            </button> */}

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 bg-black border border-zinc-700 text-zinc-300 text-sm"
              >
                <User size={14} className="text-[#39ff14]" />
                User
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-700 rounded-sm shadow-lg z-50">
                  <button
                    onClick={() => {
                      setShow2FA(true);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
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
                <Coins size={16} className="text-[#39ff14]" />
                <span className="text-xs text-zinc-500 uppercase font-bold">
                  Balance
                </span>
              </div>
              <span className="text-[#39ff14] font-mono text-sm font-bold">
                {blipPoints} pts
              </span>
            </div>

            {/* Wallet Info - Mobile */}
            <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-sm border border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center">
                  <ShieldCheck className="text-[#39ff14]" size={12} />
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

      {show2FA && (
        <div className="fixed inset-0 top-48 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-md shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
              <div className="flex items-center gap-2 text-zinc-100">
                <ShieldCheck size={18} className="text-green-400" />
                <h2 className="text-sm font-semibold">
                  Two-Factor Authentication
                </h2>
              </div>
              <button onClick={() => setShow2FA(false)}>
                <X size={18} className="text-zinc-400 hover:text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 text-sm text-zinc-400">
              <p>
                Add an extra layer of security to your account by enabling
                two-factor authentication (2FA).
              </p>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-zinc-700 flex justify-end">
              <button
                onClick={handleEnable2FA}
                className="px-4 py-2 bg-green-500 text-black text-xs font-bold rounded hover:bg-green-400 transition"
              >
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {qrCode && (
        <div className="fixed inset-0 z-50 top-48  flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-md p-6 text-center">
            <h3 className="text-sm font-semibold text-white mb-2">
              Scan QR Code
            </h3>

            <p className="text-xs text-zinc-400 mb-4">
              Scan this QR code using Google Authenticator
            </p>

            <img src={qrCode} alt="2FA QR" className="mx-auto mb-6" />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setQrCode(null)}
                className="px-4 py-2 text-xs bg-zinc-800 text-zinc-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowVerifyModal(true)}
                className="px-4 py-2 text-xs bg-green-500 text-black font-bold rounded"
              >
                Verify QR
              </button>
            </div>
          </div>
        </div>
      )}

      {showVerifyModal && (
        <div className="fixed inset-0 z-50 top-48  flex items-center justify-center bg-black/70">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-md p-6">
            <h3 className="text-sm font-semibold text-white mb-3">
              Verify OTP
            </h3>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-2 bg-black border border-zinc-700 text-white rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 text-xs bg-zinc-800 text-zinc-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="px-4 py-2 text-xs bg-green-500 text-black font-bold rounded disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
