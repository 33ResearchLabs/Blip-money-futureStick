import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Shield,
  Layers,
  Zap,
  ArrowRight,
  Gift,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import { CTAButton } from "@/components/Navbar";
import sounds from "@/lib/sounds";
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

const UserLogin = ({ initialView }: AirdropLoginProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Navigation & Identity State
  const refFromUrl = searchParams.get("ref") || "";
  const [view, setView] = useState(
    initialView || (refFromUrl ? "waitlist" : "landing"),
  );
  const [hasRedirected, setHasRedirected] = useState(false);

  // Sync view state with initialView prop when it changes (for route changes)
  useEffect(() => {
    if (initialView) {
      setView(initialView);
    } else if (!refFromUrl) {
      setView("landing");
    }
  }, [initialView, refFromUrl]);

  // Only fast-forward away if the user already holds the user role (or is
  // an admin). A logged-in MERCHANT-only user landing on /login should still
  // see the form so they can sign in fresh or be guided to /register.
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user?.emailVerified && !hasRedirected) {
      const effectiveRoles = (user.roles && user.roles.length > 0)
        ? user.roles
        : (user.role ? [user.role] : []);
      if (effectiveRoles.includes("SUPERADMIN")) {
        setHasRedirected(true);
        navigate("/admin-dashboard", { replace: true });
      } else if (effectiveRoles.includes("USER")) {
        setHasRedirected(true);
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, hasRedirected, user]);

  // Loading state — wallet checks removed; wallet linking now happens entirely
  // on the dashboard, not during the waitlist sign-in flow.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#ffffff] animate-spin" />
          <span className="text-black/50 dark:text-white/50 text-sm">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        canonical="https://app.blip.money/waitlist/user"
      />
      <HreflangTags path="https://app.blip.money/waitlist/user" />

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
                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10 border text-black dark:text-white "
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full bg-black dark:bg-white"
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
                      onClick={() => window.location.href = "https://app.blip.money/waitlist/user"}
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#ffffff] text-black text-sm font-semibold hover:bg-[#e5e5e5]  transition-all duration-300"
                    >
                      Join Waitlist
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button> */}
                    <CTAButton
                      to="https://app.blip.money/waitlist/user"
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
                        <motion.div className="w-2 h-2 bg-black dark:bg-white rounded-full" />
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
            <AuthPageLayout
              badge="Welcome Back"
              heading="Sign In to Blip"
              description="Access your dashboard and start earning rewards"
              variant="user"
            >
              <Login role="user" />

              {/* Benefits */}
              <div className="border-t border-black/[0.06] dark:border-white/[0.06] mt-8">
                <p className="text-[10px] text-black/80 dark:text-white/40 uppercase tracking-wider mb-4 text-center mt-2 font-medium">
                  What you get
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Gift, text: "200 Bonus Points" },
                    { icon: Zap, text: "Early Access" },
                    { icon: Users, text: "Referral Rewards" },
                    { icon: Shield, text: "Priority Support" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/80 dark:bg-white/[0.02] border border-black/70 dark:border-white/[0.05]"
                    >
                      <item.icon className="w-4 h-4 text-black/80 dark:text-white/60" />
                      <span className="text-xs text-black/80 font-medium dark:text-white/60">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AuthPageLayout>
          )}

        </main>
      </div>
    </>
  );
};

export default UserLogin;
