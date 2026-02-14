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
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { airdropApi } from "@/services/Airdrop";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { twoFactorApi } from "@/services/twoFatctor";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import { CTAButton } from "@/components/Navbar";
import sounds from "@/lib/sounds";
import Login from "./Login";

/* ============================================
   2025/2026 WAITLIST PAGE
   Matching homepage design system
   - Orange (#ffffff) accent color
   - Dark theme with subtle gradients
   - Clean, minimal aesthetic
   ============================================ */

interface AirdropLoginProps {
  initialView?: "landing" | "waitlist" | "connect";
}

const AirdropLogin = ({ initialView }: AirdropLoginProps) => {
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { toast } = useToast();
  const { login, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Navigation & Identity State
  const refFromUrl = searchParams.get("ref") || "";
  const [view, setView] = useState(
    initialView || (refFromUrl ? "waitlist" : "landing"),
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sync view state with initialView prop when it changes (for route changes)
  useEffect(() => {
    if (initialView) {
      setView(initialView);
    } else if (!refFromUrl) {
      setView("landing");
    }
  }, [initialView, refFromUrl]);
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
  }, [
    isAuthenticated,
    isLoading,
    navigate,
    hasRedirected,
    walletReady,
    connected,
  ]);

  // Save user data to backend when wallet connects
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
          password: password,
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
          twoFactorEnabled: response.user?.twoFactorEnabled || false,
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

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address",
      });
      return;
    }

    // Validate password
    if (!password || password.length < 8) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: "Password must be at least 8 characters long",
      });
      return;
    }

    // Check if password has uppercase, number
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasUppercase || !hasNumber) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description:
          "Password must contain at least 1 uppercase letter and 1 number",
      });
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match",
      });
      return;
    }

    setView("connect");
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
        description:
          error?.message ||
          error?.response?.data?.message ||
          "OTP verification failed",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Loading state
  if (isLoading || connecting || !walletReady) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#ffffff] animate-spin" />
          <span className="text-black/50 dark:text-white/50 text-sm">
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
      <HreflangTags path="/waitlist" />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-hidden">
        {/* Background */}

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
                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10 border text-[#ff6b35] "
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full bg-[#ff6b35]"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[13px] text-black/70 dark:text-white/70 font-medium tracking-wide">
                      Mainnet Alpha: Live
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white leading-[1.05] mb-6 tracking-tight"
                  >
                    Join the Blip
                    <br />
                    <span className="text-black/20 dark:text-[#ffffff]/20">
                      Waitlist{" "}
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-lg md:text-xl text-black/50 dark:text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10"
                  >
                    Support the first privacy-preserving institutional payment
                    protocol. Earn rewards by validating network integrity and
                    contributing to the global on-chain bridge.
                  </motion.p>

                  {/* CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
                  >
                    {/* <button
                      onClick={() => navigate("/join-waitlist")}
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#ffffff] text-black text-sm font-semibold hover:bg-[#e5e5e5]  transition-all duration-300"
                    >
                      Join Waitlist
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button> */}
                    <CTAButton
                      to="/join-waitlist"
                      className=" w-[225px]  h-[48px]"
                    >
                      Join Waitlist{" "}
                    </CTAButton>
                    {/* <a
                      href="/whitepaper.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                    >
                      Read Whitepaper
                    </a> */}
                    <a
                      href="/whitepaper.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sounds.click()}
                      onMouseEnter={() => sounds.hover()}
                      className="
      group relative overflow-hidden inline-flex items-center justify-center gap-2
      md:px-6  py-1
      rounded-full
       w-[230px]  h-[48px]
      
      border border-black/10 dark:border-white/10
      text-black dark:text-white text-lg font-medium
      transition-all duration-300
    "
                    >
                      {/* LEFT TO RIGHT HOVER FILL (Same As CTA) */}
                      <span
                        className="
      absolute inset-0
      bg-black/10 dark:bg-white/20
      rounded-full
      scale-x-0 group-hover:scale-x-100
      origin-left
      transition-transform duration-700 ease-out
    "
                      />

                      {/* BUTTON TEXT */}
                      <span className="relative z-10 flex items-center gap-3">
                        Read Whitepaper
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </a>
                  </motion.div>
                </div>

                {/* Protocol Status Card */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex-1 w-full max-w-md"
                >
                  <div className="rounded-3xl bg-white/80 dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <motion.div className="w-2 h-2 bg-[#ff6b35] rounded-full" />
                        <span className="text-[11px] font-medium text-black/50 dark:text-white/50 uppercase tracking-wider">
                          Protocol Status
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#ffffff] uppercase tracking-wider">
                        Operational
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="px-6 py-5 space-y-4 border-b border-black/[0.06] dark:border-white/[0.06]">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-black/40 dark:text-white/40 uppercase tracking-wider">
                          Network Latency
                        </span>
                        <span className="text-sm font-semibold text-black dark:text-white">
                          412ms
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-black/40 dark:text-white/40 uppercase tracking-wider">
                          Active Vaults
                        </span>
                        <span className="text-sm font-semibold text-black dark:text-white">
                          12,492
                        </span>
                      </div>
                    </div>

                    {/* Volume */}
                    <div className="px-6 py-5 flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">
                          Global Vol (24H)
                        </div>
                        <div className="text-2xl font-bold text-black dark:text-white">
                          $1,293.00
                        </div>
                      </div>
                      <div className="w-28 h-14 flex items-end gap-[3px]">
                        {[35, 50, 40, 65, 45, 80, 55, 90, 60, 75].map(
                          (h, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-black/20 dark:bg-[#ffffff]/30 rounded-t-[2px]"
                              style={{ height: `${h}%` }}
                            />
                          ),
                        )}
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
                className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20 border-t border-black/[0.06] dark:border-white/[0.06] pt-20"
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
                    className="p-8 rounded-3xl bg-white/80 dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] group hover:bg-white dark:hover:bg-white/[0.03] transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#ffffff]/10 border border-[#ffffff]/20 flex items-center justify-center mb-6 group-hover:bg-[#ffffff]/20 transition-colors duration-300">
                      <feature.icon className="w-5 h-5 text-[#ffffff]" />
                    </div>
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed">
                      {feature.desc}
                    </p>
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
              <Login />

              {/* Login/Register Links */}
              <div className="mt-6 text-center space-y-3">
                <p className="text-sm text-black/60 dark:text-white/60">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-black dark:text-white font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Want full features?{" "}
                  <Link
                    to="/register"
                    className="text-black dark:text-white font-medium hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-12 pt-8 border-t border-black/[0.06] dark:border-white/[0.06]">
                <p className="text-[10px] text-black/40 dark:text-white/40 uppercase tracking-wider mb-4 text-center">
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
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/80 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]"
                    >
                      <item.icon className="w-4 h-4 text-[#ffffff]" />
                      <span className="text-xs text-black/60 dark:text-white/60">
                        {item.text}
                      </span>
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
                  <span className="text-[11px] font-semibold text-[#ffffff] uppercase tracking-wider">
                    Step 2 of 2
                  </span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
                  Connect Walletghgh
                </h2>
                <p className="text-black/50 dark:text-white/50">
                  Link your Solana wallet to complete registration
                </p>
              </div>

              <div className="rounded-3xl bg-white/80 dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] p-8 relative overflow-hidden">
                {/* Loading overlay */}
                {isConnecting && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4 rounded-3xl">
                    <Loader2
                      className="text-[#ffffff] animate-spin"
                      size={40}
                    />
                    <span className="text-sm text-white/70 dark:text-white/70">
                      Creating your account...
                    </span>
                  </div>
                )}

                {/* Email display */}
                <div className="text-center mb-8">
                  <p className="text-black/50 dark:text-white/50 text-sm">
                    Authorized account:{" "}
                    <span className="text-black dark:text-white font-medium">
                      {email}
                    </span>
                  </p>
                </div>

                {/* Wallet connect button */}
                <div className="flex justify-center mb-8">
                  <WalletConnectButton />
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.06]">
                  <div className="flex flex-col items-center">
                    <ShieldCheck
                      size={18}
                      className="text-black/30 dark:text-white/30 mb-2"
                    />
                    <span className="text-[10px] text-black/30 dark:text-white/30 uppercase tracking-wider">
                      Secure
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Globe
                      size={18}
                      className="text-black/30 dark:text-white/30 mb-2"
                    />
                    <span className="text-[10px] text-black/30 dark:text-white/30 uppercase tracking-wider">
                      Global
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Zap
                      size={18}
                      className="text-black/30 dark:text-white/30 mb-2"
                    />
                    <span className="text-[10px] text-black/30 dark:text-white/30 uppercase tracking-wider">
                      Instant
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setView("waitlist")}
                className="mt-8 flex items-center justify-center gap-2 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 text-sm mx-auto transition-colors"
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
            className="w-full max-w-sm bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-black/50 dark:text-white/50 mb-6">
              Enter the 6-digit code from Google Authenticator
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-white dark:bg-white/[0.03] border border-black/10 dark:border-white/10 px-4 py-3 text-black dark:text-white rounded-xl text-center text-xl tracking-[0.3em] mb-4 focus:outline-none focus:border-[#ffffff]/50"
              placeholder="000000"
            />

            <button
              onClick={handleVerifyLoginOtp}
              disabled={isVerifyingOtp}
              className="w-full bg-[#ffffff] text-black py-3 rounded-full font-semibold disabled:opacity-50 hover:bg-[#e5e5e5] transition-colors"
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
