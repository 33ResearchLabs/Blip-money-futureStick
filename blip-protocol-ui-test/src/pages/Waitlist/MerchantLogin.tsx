import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  HandCoins,
  Activity,
  Zap,
  Wallet,
  Gift,
  Users,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { airdropApi } from "@/services/Airdrop";
import { useNavigate, useSearchParams } from "react-router-dom";
import { twoFactorApi } from "@/services/twoFatctor";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import Login from "./Login";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

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

export const MerchantLogin = ({ initialView }: AirdropLoginProps) => {
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { toast } = useToast();
  const { login, isAuthenticated, logout, isLoading, user } = useAuth();
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

  // Redirect if already authenticated and email verified
  // Wallet connection is NOT required - dashboard handles wallet linking
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user?.emailVerified && !hasRedirected) {
      setHasRedirected(true);
      navigate("/merchant-dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, hasRedirected, user]);

  // Save user data to backend when wallet connects
  useEffect(() => {
    const saveUserData = async () => {
      if (!connected || !publicKey || view !== "connect" || show2FAModal)
        return;

      setIsConnecting(true);

      try {
        const response: any = await airdropApi.login({
          email: email,
          password: password,
          referral_code: referral_code,
          wallet_address: publicKey.toBase58(),
        });

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
          totalBlipPoints: response.user?.totalBlipPoints || 200,
          status: response.user?.status,
          twoFactorEnabled: response.user?.twoFactorEnabled || false,
          emailVerified: response.user?.emailVerified ?? true,
          walletLinked: response.user?.walletLinked ?? true,
        });

        toast({
          title: "Success! +200 Points",
          description: "Your account has been created with 200 bonus points!",
        });

        setTimeout(() => {
          navigate("/merchant-dashboard", { replace: true });
          setIsConnecting(false);
        }, 1000);
      } catch (error: any) {
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
          setTimeout(() => {
            navigate("/merchant-waitlist", { replace: true });
            setIsConnecting(false);
          }, 1000);
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
      navigate("/merchant-waitlist");
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
        twoFactorEnabled: res.user.twoFactorEnabled || false,
        emailVerified: res.user.emailVerified ?? true,
        walletLinked: res.user.walletLinked ?? false,
      });

      setShow2FAModal(false);
      setOtp("");

      toast({
        title: "Login Successful",
        description: "OTP verified successfully",
      });

      navigate("/merchant-dashboard");
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
          {/* WAITLIST VIEW (Email) */}
          {view === "waitlist" && !isAuthenticated && (
            <AuthPageLayout
              badge="Merchant Portal"
              heading="Merchant Sign In"
              description="Access your merchant dashboard and manage your business"
              variant="merchant"
              bottomContent={
                <div className="mt-16 w-full max-w-5xl mx-auto">
                  <p className="text-center text-xs tracking-widest text-black/40 dark:text-white/50 mb-8">
                    WHAT MERCHANTS GET
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        icon: Gift,
                        title: "Genesis Token Allocation",
                        desc: "Earn BLIP allocation for onboarding early and providing volume.",
                      },
                      {
                        icon: HandCoins,
                        title: "Zero Settlement Fees",
                        desc: "Early merchants receive reduced or zero fees during test phase.",
                      },
                      {
                        icon: Zap,
                        title: "Priority Routing",
                        desc: "Merchant nodes get faster matching + network priority.",
                      },
                      {
                        icon: Activity,
                        title: "Early App Access",
                        desc: "Test merchant dashboard before public launch.",
                      },
                      {
                        icon: Users,
                        title: "Governance Rights",
                        desc: "Vote on fees, routes, and network policies.",
                      },
                      {
                        icon: Wallet,
                        title: "Liquidity Rewards",
                        desc: "Earn rewards for committing settlement volume.",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-6 border border-black/10 dark:border-white/10 rounded-xl hover:border-black/20 dark:hover:border-white/20 transition"
                      >
                        <item.icon className="w-5 h-5 text-black/60 dark:text-white/50 mb-4" />
                        <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              }
            >
              <Login role="merchant" />
            </AuthPageLayout>
          )}
        </main>
      </div>

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm  border border-black/10 dark:border-white/10 rounded-3xl p-6"
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
