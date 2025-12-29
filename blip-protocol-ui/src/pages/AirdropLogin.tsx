import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ShieldCheck,
  Globe,
  Mail,
  ArrowLeft,
  Loader2,
  HandCoins,
  Menu,
  LogOut,
} from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { airdropApi } from "@/services/Airdrop";
import { useNavigate } from "react-router-dom";

const AirdropLogin = () => {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const { login, isAuthenticated , logout } = useAuth();
   const { publicKeys, disconnect } = useWallet();
  const navigate = useNavigate();

  // Navigation & Identity State
  const [view, setView] = useState("landing"); // 'landing', 'waitlist', 'connect'
  const [email, setEmail] = useState("");
  const [referral_code, setReferralCode] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Derived state from wallet
  const isWalletConnected = connected;
  const walletAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("✅ User already authenticated, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Effect: Save user data to backend when wallet connects
  useEffect(() => {
    const saveUserData = async () => {
      if (!connected || !publicKey || view !== "connect") return;

      console.log("💾 Attempting to save user data:", {
        wallet_address: publicKey.toBase58(),
        email,
        referral_code,
        view,
      });

      setIsConnecting(true);

      try {
        const response = await airdropApi.postAirdrop({
          email: email,
          referral_code: referral_code,
          wallet_address: publicKey.toBase58(),
        });

        console.log("✅ User data saved successfully:", response);

        // Login user with auth context
        login({
          wallet_address: publicKey.toBase58(),
          email,
          referral_code,
          isNewUser: response.isNewUser,
        });

        toast({
          title: "Success!",
          description: "Your wallet has been connected and data saved.",
        });

        // Navigate to dashboard
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
          setIsConnecting(false);
        }, 1000);
      } catch (error: any) {
        console.error("❌ Error saving user data:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);

        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "Failed to save data. Please try again.",
        });

        setIsConnecting(false);
      }
    };

    saveUserData();
  }, [connected, publicKey, view, email, referral_code, toast, login, navigate]);

  // Actions
  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setView("connect");
    }
  };


  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...");

      // Disconnect wallet
      await disconnect();
      console.log("✅ Wallet disconnected");

      // Clear local auth state and call backend to clear HTTP-only cookie
      await logout();
      console.log("✅ Auth state cleared and cookie cleared");

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      navigate("/airdrop");
    } catch (error) {
      console.error("❌ Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    }
  };

  return (
    <>
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#39ff14] selection:text-black transition-all duration-500">
      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => setView("landing")}
          >
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center relative overflow-hidden">
              <div className="w-1.5 h-1.5 bg-[#39ff14] rounded-full shadow-[0_0_8px_#39ff14]" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Blip
              <span className="text-zinc-500 text-lg font-normal">.money</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">
              Protocol
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Developers
            </a>
            <div className="h-4 w-px bg-zinc-800" />
            {isWalletConnected ? (
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
                <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white"
              >
                <LogOut size={14} />
                Logout
              </button>
              </div>
            ) : (
              <button
                onClick={() => setView("waitlist")}
                className="bg-zinc-100 text-black px-5 py-2 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-[#39ff14] transition-all duration-300 active:scale-95"
              >
                Connect Wallet
              </button>
            )}
          </div>

          <div className="md:hidden">
            <Menu size={24} className="text-zinc-400" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* STEP 0: LANDING */}
        {view === "landing" && (
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-12 lg:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39ff14]/5 border border-[#39ff14]/20 text-[#39ff14] text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39ff14]"></span>
              </span>
              Mainnet Alpha Live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Join the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
                Blip.money
              </span>{" "}
              Airdrop
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl">
              The first privacy-preserving institutional payment protocol. Build
              your on-chain reputation and earn allocation by participating in
              network testing.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setView("waitlist")}
                className="w-full sm:w-auto bg-[#39ff14] text-black px-10 py-4 rounded-sm font-black text-sm uppercase tracking-widest hover:bg-[#32e012] transition-all shadow-[0_10px_30px_-10px_rgba(57,255,20,0.3)] active:scale-95 flex items-center justify-center gap-2"
              >
                Join Waitlist <ChevronRight size={18} strokeWidth={3} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 w-full border-t border-zinc-900 pt-16">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-2">
                  18.4M
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">
                  Total Stake
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-2">142K</span>
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">
                  Wallets
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-2">
                  $4.2B
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">
                  Total Vol
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: WAITLIST (EMAIL) */}
        {view === "waitlist" && (
          <div className="max-w-md mx-auto py-24 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-10 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#39ff14] block mb-4">
                Step 1 of 2
              </span>
              <h2 className="text-3xl font-bold text-white mb-2">
                Reserve Your Spot
              </h2>
              <p className="text-zinc-500 text-sm">
                Enter your institutional or personal email to begin
                verification.
              </p>
            </div>

            <form onSubmit={handleJoinWaitlist} className="space-y-4">
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#39ff14] transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  className="w-full bg-zinc-900/50 border border-zinc-800 py-4 pl-12 pr-4 rounded-sm text-white focus:outline-none focus:border-[#39ff14]/50 focus:ring-1 focus:ring-[#39ff14]/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative group">
                <HandCoins
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#39ff14] transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Referral code (optional)"
                  className="w-full bg-zinc-900/50 border border-zinc-800 py-4 pl-12 pr-4 rounded-sm text-white focus:outline-none focus:border-[#39ff14]/50 focus:ring-1 focus:ring-[#39ff14]/20 transition-all"
                  value={referral_code}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#39ff14] text-black py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#32e012] transition-all active:scale-[0.98]"
              >
                Proceed to Connection
              </button>
              <button
                type="button"
                onClick={() => setView("landing")}
                className="w-full flex items-center justify-center gap-2 text-zinc-600 hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-4"
              >
                <ArrowLeft size={12} /> Back
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: CONNECT WALLET */}
        {view === "connect" && (
          <div className="max-w-lg mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-12 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#39ff14] block mb-4">
                Step 2 of 2
              </span>
              <h2 className="text-3xl font-bold text-white">Connect Wallet</h2>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-lg shadow-2xl relative overflow-hidden">
              {isConnecting && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="text-[#39ff14] animate-spin" size={40} />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
                    Saving to database...
                  </span>
                </div>
              )}

              <p className="text-zinc-500 text-sm mb-8 text-center">
                Authorized account:{" "}
                <span className="text-zinc-300 font-bold">{email}</span>
              </p>

              <div className="space-y-3 flex justify-center">
                <WalletConnectButton />
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-800/50 flex items-center justify-center gap-8">
                <div className="flex flex-col items-center opacity-50">
                  <ShieldCheck size={18} className="text-zinc-400 mb-2" />
                  <span className="text-[9px] text-zinc-400 uppercase font-black">
                    Secure
                  </span>
                </div>
                <div className="flex flex-col items-center opacity-50">
                  <Globe size={18} className="text-zinc-400 mb-2" />
                  <span className="text-[9px] text-zinc-400 uppercase font-black">
                    Global
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setView("waitlist")}
              className="mt-8 text-zinc-600 hover:text-zinc-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mx-auto"
            >
              <ArrowLeft size={12} /> Change Email
            </button>
          </div>
        )}
      </main>

      {/* Global Background UI Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-[#39ff14]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-zinc-800/10 blur-[100px] rounded-full" />
      </div>
    </div>
    </>
  );
};

export default AirdropLogin;
