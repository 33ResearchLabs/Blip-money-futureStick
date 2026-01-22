import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  ArrowRight,
  Wallet,
  Gift,
  Users,
  CheckCircle2,
} from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { airdropApi } from "@/services/Airdrop";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { twoFactorApi } from "@/services/twoFatctor";
import { SEO } from "@/components";

/* ============================================
   2025/2026 WAITLIST PAGE
   Matching homepage design system
   - Orange (#ff6b35) accent color
   - Dark theme with subtle gradients
   - Clean, minimal aesthetic
   ============================================ */

const AirdropLogin = () => {
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { toast } = useToast();
  const { login, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Navigation & Identity State
  const refFromUrl = searchParams.get("ref") || "";
  const [view, setView] = useState(refFromUrl ? "waitlist" : "landing");
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

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Wait for wallet to finish initializing
  useEffect(() => {
    if (connecting) {
      setWalletReady(false);
      return;
    }
    const timer = setTimeout(() => {
      setWalletReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [connecting, connected]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isLoading || !walletReady) return;
    if (isAuthenticated && connected && !hasRedirected) {
      console.log("✅ User already authenticated, redirecting to dashboard");
      setHasRedirected(true);
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, hasRedirected, walletReady, connected]);

  // Save user data to backend when wallet connects
  useEffect(() => {
    const saveUserData = async () => {
      if (!connected || !publicKey || view !== "connect" || show2FAModal) return;

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

        if (response.twoFactorRequired) {
          setPendingEmail(email);
          setShow2FAModal(true);
          setIsConnecting(false);
          return;
        }

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

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
          setIsConnecting(false);
        }, 1000);
      } catch (error: any) {
        console.error("❌ Error saving user data:", error);

        const errorCode = error.response?.data?.code;
        const errorMessage = error.response?.data?.message;

        if (errorCode === "WALLET_EMAIL_MISMATCH" || error.response?.status === 409) {
          toast({
            variant: "destructive",
            title: "Wallet Already Registered",
            description:
              errorMessage ||
              "This wallet is already registered with a different email. Please use the correct email or disconnect wallet.",
          });
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
  }, [connected, publicKey, view, email, referral_code, toast, login, navigate, disconnect]);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setView("connect");
    }
  };

  const handleLogout = async () => {
    try {
      await disconnect();
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/waitlist");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    }
  };

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
      toast({
        variant: "destructive",
        title: "OTP Failed",
        description: error?.message || error?.response?.data?.message || "OTP verification failed",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Loading state
  if (isLoading || connecting || !walletReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#ff6b35] animate-spin" />
          <span className="text-white/50 text-sm">
            {isLoading ? "Loading..." : "Connecting wallet..."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Join the Blip Money Waitlist | Early Access & Rewards"
        description="Sign up for the Blip Money waitlist and get early access to fast, secure, and borderless crypto payments. Earn 2000 bonus points."
        canonical="https://blip.money/waitlist"
      />

      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black" />

          {/* Floating orbs */}
          <motion.div
            className="absolute top-[10%] right-[15%] w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)",
              x: mousePosition.x * -30,
              y: mousePosition.y * -20,
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
              x: mousePosition.x * 20,
              y: mousePosition.y * 15,
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,107,53,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,107,53,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Animated particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#ff6b35]"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.6, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24">
          {/* LANDING VIEW */}
          {view === "landing" && !isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Hero Section */}
              <div className="flex flex-col lg:flex-row items-center gap-16 py-16 lg:py-24">
                <div className="flex-1 max-w-2xl text-center lg:text-left">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10"
                    style={{
                      background: "rgba(255, 107, 53, 0.05)",
                      border: "1px solid rgba(255, 107, 53, 0.15)",
                    }}
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full bg-[#ff6b35]"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[13px] text-white/70 font-medium tracking-wide">
                      Mainnet Alpha: Live
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight"
                  >
                    Earn in
                    <br />
                    <span className="text-[#ff6b35]">a Blip.</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-lg md:text-xl text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10"
                  >
                    Support the first privacy-preserving institutional payment protocol.
                    Earn rewards by validating network integrity and contributing to the global on-chain bridge.
                  </motion.p>

                  {/* CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  >
                    <button
                      onClick={() => setView("waitlist")}
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#ff6b35] text-black text-sm font-semibold hover:bg-[#ff8c50] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] transition-all duration-300"
                    >
                      Join Waitlist
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a
                      href="/whitepaper.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                    >
                      Read Whitepaper
                    </a>
                  </motion.div>
                </div>

                {/* Protocol Status Card */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 w-full max-w-md"
                >
                  <div className="rounded-3xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-2 h-2 bg-[#ff6b35] rounded-full"
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
                          Protocol Status
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#ff6b35] uppercase tracking-wider">
                        Operational
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="px-6 py-5 space-y-4 border-b border-white/[0.06]">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-white/40 uppercase tracking-wider">
                          Network Latency
                        </span>
                        <span className="text-sm font-semibold text-white">
                          412ms
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-white/40 uppercase tracking-wider">
                          Active Vaults
                        </span>
                        <span className="text-sm font-semibold text-white">
                          12,492
                        </span>
                      </div>
                    </div>

                    {/* Volume */}
                    <div className="px-6 py-5 flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                          Global Vol (24H)
                        </div>
                        <div className="text-2xl font-bold text-white">
                          $1,293.00
                        </div>
                      </div>
                      <div className="w-28 h-14 flex items-end gap-[3px]">
                        {[35, 50, 40, 65, 45, 80, 55, 90, 60, 75].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-[#ff6b35]/30 rounded-t-[2px]"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Feature Grid */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20 border-t border-white/[0.06] pt-20"
              >
                {[
                  {
                    icon: Shield,
                    title: "Privacy Core",
                    desc: "Every transaction is encrypted using zero-knowledge proofs. Privacy is a protocol standard.",
                  },
                  {
                    icon: Layers,
                    title: "Scalability",
                    desc: "Processing thousands of transactions per second with near-zero latency.",
                  },
                  {
                    icon: Zap,
                    title: "Instant Settlement",
                    desc: "Eliminate wait times. Finality achieved in a blip, moving assets across borders in real-time.",
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 + i * 0.1 }}
                    className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] group hover:bg-white/[0.03] transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#ff6b35]/10 border border-[#ff6b35]/20 flex items-center justify-center mb-6 group-hover:bg-[#ff6b35]/20 transition-colors duration-300">
                      <feature.icon className="w-5 h-5 text-[#ff6b35]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* WAITLIST VIEW (Email) */}
          {view === "waitlist" && !isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto py-24"
            >
              <div className="mb-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{
                    background: "rgba(255, 107, 53, 0.05)",
                    border: "1px solid rgba(255, 107, 53, 0.15)",
                  }}
                >
                  <span className="text-[11px] font-semibold text-[#ff6b35] uppercase tracking-wider">
                    Step 1 of 2
                  </span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Reserve Your Spot
                </h2>
                <p className="text-white/50">
                  Enter your email to begin verification
                </p>
              </div>

              <form onSubmit={handleJoinWaitlist} className="space-y-4">
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#ff6b35] transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    className="w-full bg-white/[0.03] border border-white/[0.08] py-4 pl-12 pr-4 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff6b35]/50 focus:ring-1 focus:ring-[#ff6b35]/20 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <HandCoins
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#ff6b35] transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Referral code (optional)"
                    className="w-full bg-white/[0.03] border border-white/[0.08] py-4 pl-12 pr-4 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff6b35]/50 focus:ring-1 focus:ring-[#ff6b35]/20 transition-all"
                    value={referral_code}
                    onChange={(e) => setReferralCode(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#ff6b35] text-black py-4 rounded-2xl font-semibold hover:bg-[#ff8c50] hover:shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all duration-300"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setView("landing")}
                  className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white/60 text-sm mt-4 transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              </form>

              {/* Benefits */}
              <div className="mt-12 pt-8 border-t border-white/[0.06]">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-4 text-center">
                  What you get
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Gift, text: "2000 Bonus Points" },
                    { icon: Zap, text: "Early Access" },
                    { icon: Users, text: "Referral Rewards" },
                    { icon: Shield, text: "Priority Support" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                    >
                      <item.icon className="w-4 h-4 text-[#ff6b35]" />
                      <span className="text-xs text-white/60">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* CONNECT WALLET VIEW */}
          {view === "connect" && !isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-lg mx-auto py-16"
            >
              <div className="mb-12 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{
                    background: "rgba(255, 107, 53, 0.05)",
                    border: "1px solid rgba(255, 107, 53, 0.15)",
                  }}
                >
                  <span className="text-[11px] font-semibold text-[#ff6b35] uppercase tracking-wider">
                    Step 2 of 2
                  </span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Connect Wallet
                </h2>
                <p className="text-white/50">
                  Link your Solana wallet to complete registration
                </p>
              </div>

              <div className="rounded-3xl bg-white/[0.02] border border-white/[0.06] p-8 relative overflow-hidden">
                {/* Loading overlay */}
                {isConnecting && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4 rounded-3xl">
                    <Loader2 className="text-[#ff6b35] animate-spin" size={40} />
                    <span className="text-sm text-white/70">
                      Creating your account...
                    </span>
                  </div>
                )}

                {/* Email display */}
                <div className="text-center mb-8">
                  <p className="text-white/50 text-sm">
                    Authorized account:{" "}
                    <span className="text-white font-medium">{email}</span>
                  </p>
                </div>

                {/* Wallet connect button */}
                <div className="flex justify-center mb-8">
                  <WalletConnectButton />
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-8 pt-6 border-t border-white/[0.06]">
                  <div className="flex flex-col items-center">
                    <ShieldCheck size={18} className="text-white/30 mb-2" />
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">
                      Secure
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Globe size={18} className="text-white/30 mb-2" />
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">
                      Global
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Zap size={18} className="text-white/30 mb-2" />
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">
                      Instant
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setView("waitlist")}
                className="mt-8 flex items-center justify-center gap-2 text-white/40 hover:text-white/60 text-sm mx-auto transition-colors"
              >
                <ArrowLeft size={14} /> Change Email
              </button>
            </motion.div>
          )}
        </main>
      </div>

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-white/50 mb-6">
              Enter the 6-digit code from Google Authenticator
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white rounded-xl text-center text-xl tracking-[0.3em] mb-4 focus:outline-none focus:border-[#ff6b35]/50"
              placeholder="000000"
            />

            <button
              onClick={handleVerifyLoginOtp}
              disabled={isVerifyingOtp}
              className="w-full bg-[#ff6b35] text-black py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-[#ff8c50] transition-colors"
            >
              {isVerifyingOtp ? "Verifying..." : "Verify & Login"}
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AirdropLogin;
