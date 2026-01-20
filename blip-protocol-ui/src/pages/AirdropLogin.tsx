import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Globe,
  Mail,
  ArrowLeft,
  Loader2,
  HandCoins,
  Activity,
  Shield,
  Layers,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { airdropApi } from "@/services/Airdrop";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PublicNavbar from "@/components/PublicNavbar";
import { twoFactorApi } from "@/services/twoFatctor";
import { SEO } from "@/components";

const AirdropLogin = () => {
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { toast } = useToast();
  const { login, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Navigation & Identity State
  // Check if user came via referral link - auto-fill referral code and go to waitlist
  const refFromUrl = searchParams.get("ref") || "";
  const [view, setView] = useState(refFromUrl ? "waitlist" : "landing"); // 'landing', 'waitlist', 'connect'
  const [email, setEmail] = useState("");
  const [referral_code, setReferralCode] = useState(refFromUrl);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [walletReady, setWalletReady] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  // Derived state from wallet
  const isWalletConnected = connected;
  const walletAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  // Wait for wallet to finish initializing before making redirect decisions
  useEffect(() => {
    if (connecting) {
      setWalletReady(false);
      return;
    }

    // Give wallet adapter a moment to auto-reconnect on page refresh
    const timer = setTimeout(() => {
      setWalletReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [connecting, connected]);

  // Redirect if already authenticated (only after loading completes AND wallet is ready)
  useEffect(() => {
    // Wait for auth loading AND wallet to be ready before checking
    if (isLoading || !walletReady) return;

    // Only redirect once to prevent loops
    // Also check that wallet is connected and matches the authenticated user
    if (isAuthenticated && connected && !hasRedirected) {
      console.log("✅ User already authenticated, redirecting to dashboard");
      setHasRedirected(true);
      navigate("/dashboard", { replace: true });
    }
  }, [
    isAuthenticated,
    isLoading,
    navigate,
    hasRedirected,
    walletReady,
    connected,
  ]);

  // Effect: Save user data to backend when wallet connects
  useEffect(() => {
    const saveUserData = async () => {
      if (!connected || !publicKey || view !== "connect" || show2FAModal)
        return;

      console.log("💾 Attempting to save user data:", {
        wallet_address: publicKey.toBase58(),
        email,
        referral_code,
        view,
      });

      setIsConnecting(true);

      try {
        const response: any = await airdropApi.login({
          email: email,
          referral_code: referral_code,
          wallet_address: publicKey.toBase58(),
        });

        console.log("✅ User data saved successfully:", response);

        // 🚨 2FA REQUIRED
        if (response.twoFactorRequired) {
          setPendingEmail(email);
          setShow2FAModal(true);
          setIsConnecting(false);
          return;
        }

        // ✅ NORMAL LOGIN (NO 2FA)
        login({
          id: response.user?._id,
          wallet_address: publicKey.toBase58(),
          email,
          referralCode: response.user?.referralCode,
          totalBlipPoints: response.user?.totalBlipPoints || 500,
          status: response.user?.status,
        });

        toast({
          title: "Success! +2000 Points",
          description: "Your account has been created with 2000 bonus points!",
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

        const errorCode = error.response?.data?.code;
        const errorMessage = error.response?.data?.message;

        // Handle wallet already registered with different email
        if (
          errorCode === "WALLET_EMAIL_MISMATCH" ||
          error.response?.status === 409
        ) {
          toast({
            variant: "destructive",
            title: "Wallet Already Registered",
            description:
              errorMessage ||
              "This wallet is already registered with a different email. Please use the correct email or disconnect wallet.",
          });

          // Disconnect wallet and reset to waitlist view
          await disconnect();
          setEmail("");
          setView("waitlist");
          setIsConnecting(false);
          return;
        }

        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage || "Failed to save data. Please try again.",
        });

        setIsConnecting(false);
      }
    };

    saveUserData();
  }, [
    connected,
    publicKey,
    view,
    email,
    referral_code,
    toast,
    login,
    navigate,
    disconnect,
  ]);

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

      navigate("/waitlist");
    } catch (error) {
      console.error("❌ Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    }
  };

  // Show loading while checking authentication or wallet is connecting
  if (isLoading || connecting || !walletReady) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#39ff14] animate-spin" />
          <span className="text-zinc-500 text-sm">
            {isLoading ? "Loading..." : "Connecting wallet..."}
          </span>
        </div>
      </div>
    );
  }

  const handleVerifyLoginOtp = async () => {
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Enter a valid 6-digit OTP",
      });
      return;
    }

    try {
      setIsVerifyingOtp(true);

      const res = await twoFactorApi.verifyOtpLogin({
        email: pendingEmail,
        otp,
      });

      console.log("✅ OTP VERIFY RESPONSE:", res);

      // 🛡️ SAFETY CHECK
      if (!res || !res.user) {
        throw new Error("Invalid OTP response from server");
      }

      login({
        id: res.user._id,
        wallet_address: publicKey?.toBase58(),
        email: res.user.email,
        referralCode: res.user.referralCode,
        totalBlipPoints: res.user.totalBlipPoints,
        status: res.user.status,
      });

      setShow2FAModal(false);
      setOtp("");

      toast({
        title: "Login Successful",
        description: "OTP verified successfully",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("❌ error in otp", error);

      toast({
        variant: "destructive",
        title: "OTP Failed",
        description:
          error?.message ||
          error?.response?.data?.message ||
          "OTP verification failed",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <>
      <SEO
        title="Join the Blip Money Waitlist | Early Access to Crypto Payments."
        description="Sign up for the Blip Money waitlist and get early access to fast, secure, and borderless crypto payments."
        canonical="https://blip.money/waitlist"
      />

      <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#2BFF88] selection:text-black transition-all duration-500">
        {/* Navigation */}
        {/* <PublicNavbar
          isWalletConnected={isWalletConnected}
          isAuthenticated={isAuthenticated}
          walletAddress={walletAddress}
          onLogout={handleLogout}
          onConnectClick={() => setView("waitlist")}
        /> */}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
          {/* STEP 0: LANDING */}
          {/* STEP 0: ENHANCED LANDING */}

          {view === "landing" && !isAuthenticated && (
            <div className="animate-in fade-in duration-700">
              {/* Hero Section */}
              <div className="flex flex-col lg:flex-row items-center gap-16 py-20 lg:py-32">
                <div className="flex-1 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm  border border-[#2BFF88] text-[#2BFF88] text-[10px] font-bold uppercase tracking-widest mb-10">
                    <Activity size={12} className="animate-pulse" />
                    Mainnet Alpha: Live Verification
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem]  font-bold tracking-tighter text-white mb-8 leading-[0.95] selection:bg-[#2BFF88] selection:text-black">
                    Earn in a Blip.
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-400  mb-12 leading-relaxed max-w-xl">
                    Support the first privacy-preserving institutional payment
                    protocol. Earn rewards by validating network integrity and
                    contributing to the global on-chain bridge.
                  </p>

                  {/* <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => setView("waitlist")}
                      className="w-full sm:w-auto bg-[#00FF94] text-black px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#00FF94]/80 transition-all shadow-[0_20px_40px_-15px_rgba(57,255,20,0.25)]  active:scale-95 flex items-center justify-center gap-3"
                    >
                      Join waitlist <ChevronRight size={16} strokeWidth={3} />
                    </button>
                    
                    <a
                      href="/whitepaper.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="w-full sm:w-auto px-12 py-5 border border-zinc-800 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:bg-zinc-900 transition-all">
                        Read Whitepaper
                      </button>
                    </a>
                  </div> */}

                  <div className="flex gap-4 ">
                    <div onClick={() => setView("waitlist")}>
                      <button className="w-full bg-black/80 backdrop-blur border border-white/20 text-white px-16 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300">
                        Join the Waitlist
                      </button>
                    </div>

                    <a
                      href="/whitepaper.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="w-full bg-black/80 backdrop-blur border border-white/20 text-white px-16 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300">
                        Read Whitepaper
                      </button>
                    </a>
                  </div>
                </div>

                <div className="flex-1 w-full lg:w-auto relative group">
                  {/* Visual Decorative Element: Protocol Status Card */}
                  <div className="bg-[#0a0a0a] border border-zinc-800 rounded-sm shadow-2xl relative overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#9df5c3] rounded-full shadow-[0_0_8px_#39ff14]" />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                          Protocol Status
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#2BFF88] uppercase tracking-wider">
                        Operational
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="px-6 py-5 space-y-4 border-b border-zinc-800/50">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                          Network_Latency
                        </span>
                        <span className="text-sm font-mono font-bold text-zinc-300">
                          412MS
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                          Active_Vaults
                        </span>
                        <span className="text-sm font-mono font-bold text-zinc-300">
                          12,492
                        </span>
                      </div>
                    </div>

                    {/* Volume Section */}
                    <div className="px-6 py-5 flex items-end justify-between">
                      <div className="space-y-1">
                        <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider">
                          Global Vol (24H)
                        </div>
                        <div className="text-2xl font-mono font-bold text-zinc-200 tracking-tight">
                          $1,293.00
                        </div>
                      </div>
                      <div className="w-28 h-14 flex items-end gap-[3px]">
                        {[35, 50, 40, 65, 45, 80, 55, 90, 60, 75].map(
                          (h, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-zinc-700/80 rounded-t-[2px]"
                              style={{ height: `${h}%` }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Accent glow */}
                  <div className="absolute -inset-4 bg-[#39ff14]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
              </div>

              {/* Feature Utility Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-32 border-t border-zinc-900 pt-20">
                <div className="p-8 bg-zinc-900/20 border border-zinc-900 rounded-sm">
                  <Shield className="text-[#2BFF88] mb-6" size={24} />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-4">
                    Privacy Core.
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Every transaction is encrypted using zero-knowledge proofs.
                    Privacy is no longer a luxury, it's a protocol standard.
                  </p>
                </div>
                <div className="p-8 bg-zinc-900/20 border border-zinc-800/40 rounded-sm">
                  <Layers className="text-[#2BFF88] mb-6" size={24} />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-4">
                    Scalability.
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Processing thousands of transactions per second with
                    near-zero latency. Built for the speed of institutional
                    global finance.
                  </p>
                </div>
                <div className="p-8 bg-zinc-900/20 border border-zinc-900 rounded-sm">
                  <Zap className="text-[#2BFF88] mb-6" size={24} />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-4">
                    Instant Settlement.
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Eliminate wait times. Finality achieved in a blip, moving
                    assets across borders in real-time.
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* STEP 1: WAITLIST (EMAIL) */}
          {view === "waitlist" && !isAuthenticated && (
            <div className="max-w-md mx-auto py-24 animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-10 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2BFF88] block mb-4">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#2BFF88] transition-colors"
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#2BFF88] transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Referral code (optional)"
                    className="w-full bg-zinc-900/50 border border-zinc-800 py-4 pl-12 pr-4 rounded-sm text-white focus:outline-none focus:border-[#2BFF88] focus:ring-1 focus:ring-[#2BFF88] transition-all"
                    value={referral_code}
                    onChange={(e) => setReferralCode(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#2BFF88] text-black py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#2BFF88] transition-all active:scale-[0.98]"
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
          {view === "connect" && !isAuthenticated && (
            <div className="max-w-lg mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-12 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2BFF88] block mb-4">
                  Step 2 of 2
                </span>
                <h2 className="text-3xl font-bold text-white">
                  Connect Wallet
                </h2>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-lg shadow-2xl relative overflow-hidden">
                {isConnecting && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                    <Loader2
                      className="text-[#2BFF88] animate-spin"
                      size={40}
                    />
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
          <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-[#2BFF88] blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-zinc-800/10 blur-[100px] rounded-full" />
        </div>
      </div>

      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-md p-6">
            <h3 className="text-sm font-bold text-white mb-4">
              Two-Factor Authentication
            </h3>

            <p className="text-xs text-zinc-400 mb-4">
              Enter the 6-digit code from Google Authenticator
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-black border border-zinc-700 px-4 py-2 text-white rounded mb-4"
              placeholder="123456"
            />

            <button
              onClick={handleVerifyLoginOtp}
              disabled={isVerifyingOtp}
              className="w-full bg-[#2BFF88] text-black py-2 rounded font-bold disabled:opacity-50"
            >
              {isVerifyingOtp ? "Verifying..." : "Verify & Login"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AirdropLogin;
