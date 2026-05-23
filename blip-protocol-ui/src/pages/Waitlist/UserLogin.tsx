import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { EditorialMerchantCards } from "@/pages/CardPreview";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Hero character slideshow — mirrors the home page treatment.
   Same PNGs used by CinematicHero so the visual language is shared. */
const HERO_CHARS = [
  { src: "/illustrations/hero-char-1.png?v=2", alt: "" },
  { src: "/illustrations/hero-char-3.png?v=2", alt: "" },
  { src: "/illustrations/hero-char-4.png?v=2", alt: "" },
] as const;

function WaitlistHeroSlideshow() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % HERO_CHARS.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
      className="relative w-full max-w-[480px] mx-auto lg:mx-0 lg:justify-self-end"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-3xl overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={HERO_CHARS[idx].src}
            src={HERO_CHARS[idx].src}
            alt={HERO_CHARS[idx].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

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
        title="Join the Blip Money Waitlist | Early Access & Rewards"
        description="Sign up for the Blip Money waitlist and get early access to fast, secure, and borderless crypto payments. Earn 2000 bonus points."
        canonical="https://www.blip.money/waitlist"
      />
      <HreflangTags path="/waitlist" />

      <div className="min-h-screen bg-white text-black overflow-hidden">
        {/* Background */}

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24">
          {/* LANDING VIEW — Apple product page treatment */}
          {view === "landing" && !isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-black"
            >
              {/* ── HERO — single centered column ───────────────────────── */}
              <div className="flex flex-col items-center text-center pt-20 md:pt-32 pb-16 md:pb-24 max-w-[820px] mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="inline-flex items-center gap-3 mb-7"
                >
                  <span className="w-5 h-px bg-black/15" />
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase whitespace-nowrap text-black">
                    Early Access
                  </span>
                  <span className="w-5 h-px bg-black/15" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}
                  className="font-display text-black"
                  style={{
                    fontSize: "clamp(3rem, 9vw, 5.2rem)",
                    fontWeight: 700,
                    lineHeight: 0.98,
                    letterSpacing: "-0.06em",
                    marginBottom: 22,
                  }}
                >
                  Send money like{" "}
                  <span style={{ fontStyle: "italic", fontWeight: 600, color: "#cc785c" }}>
                    a message.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.18 }}
                  className="text-black/55 text-[16px] md:text-[18px] leading-[1.55] tracking-tight max-w-[580px] mx-auto mb-10"
                >
                  Join 12,400+ already in line for borderless money — settled
                  by verified merchants in under 60 seconds. Early users earn
                  bonus points and priority access.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.28 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                  <button
                    onClick={() => navigate("/join-waitlist")}
                    className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-black text-white text-[15px] font-bold tracking-tight transition-transform hover:-translate-y-[1px] shadow-[0_10px_28px_-12px_rgba(0,0,0,0.55)]"
                  >
                    <span>Join waitlist</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                  <a
                    href="/whitepaper.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-[14.5px] font-bold tracking-tight transition-all hover:-translate-y-[1px]"
                    style={{
                      background: "rgba(204,120,92,0.08)",
                      color: "#cc785c",
                      border: "1.5px solid #cc785c",
                    }}
                  >
                    <span>Read whitepaper</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                </motion.div>
              </div>

              {/* ── HERO IMAGE — one beautiful frame ────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.1, ease: EASE }}
                className="max-w-[1100px] mx-auto px-2 md:px-0"
              >
                <div
                  className="rounded-[28px] overflow-hidden border border-black/[0.06] bg-[#FAF8F5]"
                  style={{
                    aspectRatio: "16 / 10",
                    boxShadow:
                      "0 60px 120px -40px rgba(0,0,0,0.22), 0 24px 60px -24px rgba(0,0,0,0.12)",
                  }}
                >
                  <img
                    src="/illustrations/hero-vibe.png?v=2"
                    alt=""
                    className="w-full h-full object-cover block"
                    loading="eager"
                  />
                </div>
              </motion.div>

              {/* ── STATS STRIP — quiet proof bar ───────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 1, ease: EASE }}
                className="max-w-[920px] mx-auto px-6 py-16 md:py-24 grid grid-cols-3 gap-6"
              >
                {[
                  { kpi: "12,438", label: "Already in line" },
                  { kpi: "<60s", label: "Median settle time" },
                  { kpi: "0.0%", label: "First-week fees" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div
                      className="font-display text-black"
                      style={{
                        fontSize: "clamp(2rem, 5vw, 3rem)",
                        fontWeight: 600,
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                      }}
                    >
                      {s.kpi}
                    </div>
                    <div className="mt-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-black/45">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* ── CLOSING BAND — live merchant signal ─────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 1, ease: EASE }}
                className="pb-24 md:pb-32 pt-8"
              >
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <span className="w-5 h-px bg-black/15" />
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-black/70">
                    Live network signal
                  </span>
                  <span className="w-5 h-px bg-black/15" />
                </div>
                <h2
                  className="font-display text-center text-black mb-12"
                  style={{
                    fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Real merchants,{" "}
                  <span style={{ fontStyle: "italic", color: "#cc785c" }}>
                    real numbers.
                  </span>
                </h2>
                <EditorialMerchantCards />
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
