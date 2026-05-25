import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import Login from "./Login";
import Register from "./Register";

const EASE = [0.16, 1, 0.3, 1] as const;
type Role = "user" | "merchant";
type Mode = "signin" | "signup";

interface Props {
  initialRole?: Role;
  initialMode?: Mode;
}

/* Unified auth screen.
   Defaults to MERCHANT signup. Share-links can override the role via
   `?role=user` or `?role=merchant` (e.g. /waitlist?role=user). */
export default function AuthHero({ initialRole, initialMode = "signup" }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlRole = searchParams.get("role");
  const resolvedInitialRole: Role =
    initialRole ?? (urlRole === "user" || urlRole === "merchant" ? urlRole : "merchant");
  const [role, setRole] = useState<Role>(resolvedInitialRole);
  const [mode, setMode] = useState<Mode>(initialMode);

  // Keep the URL in sync when the user toggles role — makes /waitlist?role=user
  // shareable and reflects the current view in the browser bar.
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (next.get("role") !== role) {
      next.set("role", role);
      setSearchParams(next, { replace: true });
    }
  }, [role, searchParams, setSearchParams]);

  // Copy per role
  const COPY = {
    user: {
      eyebrow: mode === "signin" ? "Welcome Back" : "Early Access",
      headline:
        mode === "signin" ? (
          <>
            Sign back in.{" "}
            <span style={{ fontStyle: "italic", fontWeight: 500, color: "#cc785c" }}>
              Hold your place.
            </span>
          </>
        ) : (
          <>
            Reserve your spot.{" "}
            <span style={{ fontStyle: "italic", fontWeight: 500, color: "#cc785c" }}>
              Skip the line.
            </span>
          </>
        ),
      sub:
        mode === "signin"
          ? "Pick up where you left off — check your waitlist position, BLIP balance, and referrals."
          : "Borderless money, settled by verified merchants in under 60 seconds.",
      bullets:
        mode === "signin"
          ? [
              "See your live waitlist position",
              "Track your BLIP point balance",
              "Get notified the moment the app opens",
            ]
          : [
              "2,000 bonus points the moment you join",
              "Priority access when the network opens",
              "Refer a friend — both of you skip 5 spots",
            ],
      cardTitle: mode === "signin" ? "Sign in to Blip." : "Join the waitlist.",
      cardSub:
        mode === "signin"
          ? "Welcome back. Your spot is right where you left it."
          : "Takes 30 seconds. Same login carries into the app.",
    },
    merchant: {
      eyebrow: mode === "signin" ? "Merchant · Welcome Back" : "Founding Merchant",
      headline:
        mode === "signin" ? (
          <>
            Welcome back, operator.{" "}
            <span style={{ fontStyle: "italic", fontWeight: 500, color: "#cc785c" }}>
              The order book is live.
            </span>
          </>
        ) : (
          <>
            Earn on every order.{" "}
            <span style={{ fontStyle: "italic", fontWeight: 500, color: "#cc785c" }}>
              Set your spread.
            </span>
          </>
        ),
      sub:
        mode === "signin"
          ? "Pick up where you left off — live orders, settlement queue, merchant earnings."
          : "Settle real orders for verified users. Compete live, win the trade, capture your margin.",
      bullets:
        mode === "signin"
          ? [
              "Live order routing and bid history",
              "Daily earnings, paid out instantly on-chain",
              "Leaderboard standing and founder perks",
            ]
          : [
              "Zero settlement fees during the beta",
              "Priority routing — faster matching, more wins",
              "Founding merchant status, recognised on launch",
            ],
      cardTitle: mode === "signin" ? "Sign in as merchant." : "Become a merchant.",
      cardSub:
        mode === "signin"
          ? "Welcome back. Your orders are right where you left them."
          : "Takes 60 seconds. Same login carries into the merchant app.",
    },
  } as const;

  const copy = COPY[role];

  return (
    <>
      <SEO
        title={mode === "signin" ? "Sign In to Blip Money" : "Join the Blip Waitlist"}
        description="Create your Blip account or sign in to track your waitlist position, bonus points, and referrals."
        canonical={`https://www.blip.money/${mode === "signin" ? "login" : "register"}`}
      />
      <HreflangTags path={mode === "signin" ? "/login" : "/register"} />

      <div className="min-h-screen bg-[#FAF8F5] text-black overflow-hidden">
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-16 md:pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_475px] gap-10 lg:gap-14 items-center min-h-[80vh]">
            {/* ── LEFT — editorial copy ─────────────────────────────── */}
            <motion.div
              key={`${role}-${mode}-left`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-center lg:text-left"
            >
              <div className="flex justify-center lg:justify-start mb-5">
                <div
                  className="relative w-[76px] h-[76px] overflow-hidden"
                  style={{
                    borderRadius: 20,
                    boxShadow:
                      "0 16px 36px -12px rgba(0,0,0,0.20), 0 6px 14px -8px rgba(204,120,92,0.24), inset 0 1px 0 rgba(255,255,255,0.6)",
                  }}
                >
                  <img
                    src="/illustrations/join-waitlist-icon.png?v=3"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              </div>

              <div className="inline-flex items-center gap-3 mb-7">
                <span className="w-5 h-px bg-black/15" />
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase whitespace-nowrap text-black">
                  {copy.eyebrow}
                </span>
                <span className="w-5 h-px bg-black/15" />
              </div>

              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(2rem, 4.4vw, 3rem)",
                  fontWeight: 600,
                  lineHeight: 1.02,
                  letterSpacing: "-0.045em",
                  color: "#1d1d1f",
                  marginBottom: 16,
                }}
              >
                {copy.headline}
              </h1>

              <p
                className="text-[15.5px] leading-[1.5] tracking-tight max-w-[480px] mx-auto lg:mx-0 mb-7"
                style={{ color: "#1d1d1f" }}
              >
                {copy.sub}
              </p>

              <ul className="space-y-3 max-w-[440px] mx-auto lg:mx-0 text-left">
                {copy.bullets.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-[14.5px] font-medium"
                    style={{ color: "#1d1d1f" }}
                  >
                    <span className="mt-[3px] inline-flex w-[18px] h-[18px] shrink-0 rounded-full items-center justify-center bg-[#1d1d1f]">
                      <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {/* Signup bonus pill — moved here from inside the form */}
              {mode === "signup" && (
                <div
                  className="mt-7 inline-flex items-center gap-3 rounded-2xl px-4 py-3 max-w-[440px]"
                  style={{
                    background: "rgba(29,29,31,0.04)",
                    border: "1px solid rgba(29,29,31,0.08)",
                  }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1d1d1f]">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <div className="leading-snug text-left">
                    <div className="text-[13.5px] font-bold tracking-tight" style={{ color: "#1d1d1f" }}>
                      {role === "merchant" ? "+10,000 BLIP points" : "+5,000 BLIP points"}{" "}
                      <span className="font-medium" style={{ color: "#3a3a3c" }}>
                        on signup
                      </span>
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: "#6e6e73" }}>
                      Auto-credited after email verification
                    </div>
                  </div>
                </div>
              )}

              <p
                className="mt-7 text-[11px] tracking-[0.18em] uppercase font-semibold"
                style={{ color: "#3a3a3c" }}
              >
                {role === "merchant" ? "1,284 merchants on the network" : "424 already in line"}
              </p>

              {/* Apple-callout cross-sell — neutral ink palette, no orange.
                  Soft ink-tinted surface, thin hairline border, restrained. */}
              <div
                className="mt-7 max-w-[440px] mx-auto lg:mx-0 rounded-2xl p-4 flex items-center gap-3.5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(29,29,31,0.05) 0%, rgba(245,245,247,0.6) 100%)",
                  border: "1px solid rgba(29,29,31,0.10)",
                  boxShadow: "0 8px 24px -16px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{
                    background: "linear-gradient(135deg, #1d1d1f 0%, #3a3a3c 100%)",
                    boxShadow: "0 6px 14px -6px rgba(0,0,0,0.30)",
                  }}
                >
                  <span className="text-[14px] font-bold tracking-tight">10%</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div
                    className="text-[10.5px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: "#6e6e73" }}
                  >
                    {role === "user" ? "Earn on every trade" : "Send money too"}
                  </div>
                  <p
                    className="text-[12.5px] leading-snug mt-0.5"
                    style={{ color: "#1d1d1f" }}
                  >
                    {role === "user" ? (
                      <>
                        Join as a{" "}
                        <span className="font-semibold">merchant / LP</span>{" "}
                        and earn up to{" "}
                        <span className="font-semibold">10%</span> on every transaction.
                      </>
                    ) : (
                      <>
                        Need to send money?{" "}
                        <span className="font-semibold">Sign up as a user</span>{" "}
                        — borderless transfers in under 60 seconds.
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRole(role === "user" ? "merchant" : "user")}
                  className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full transition-transform hover:-translate-y-[1px]"
                  style={{
                    background: "#1d1d1f",
                    color: "#ffffff",
                    boxShadow: "0 4px 12px -4px rgba(0,0,0,0.30)",
                  }}
                  aria-label={role === "user" ? "Switch to merchant" : "Switch to user"}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* ── RIGHT — auth card with toggles ────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
              className="w-full"
            >
              <div
                className="bg-white rounded-[24px] border border-black/[0.06] p-6 sm:p-7"
                style={{
                  color: "#1d1d1f",
                  boxShadow:
                    "0 40px 100px -36px rgba(0,0,0,0.18), 0 16px 40px -20px rgba(0,0,0,0.08)",
                }}
              >
                {/* Role toggle — User / Merchant */}
                <div className="grid grid-cols-2 p-[3px] rounded-full bg-[#EFEFF2] mb-5">
                  {(["user", "merchant"] as const).map((r) => {
                    const active = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2 rounded-full text-[12px] font-semibold tracking-tight transition ${
                          active
                            ? "bg-white text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.08)]"
                            : "text-[#6e6e73] hover:text-[#1d1d1f]"
                        }`}
                      >
                        {r === "user" ? "User" : "Merchant"}
                      </button>
                    );
                  })}
                </div>

                {/* Card heading */}
                <div className="mb-5">
                  <h2
                    className="font-display"
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.05,
                      color: "#1d1d1f",
                    }}
                  >
                    {copy.cardTitle}
                  </h2>
                  <p className="mt-1.5 text-[12.5px]" style={{ color: "#3a3a3c" }}>
                    {copy.cardSub}
                  </p>
                </div>

                {/* The actual form — Register/Login each render their own
                    internal Sign up / Sign in tabs, so no outer toggle here */}
                <motion.div
                  key={`${role}-${mode}-form`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {mode === "signin" ? (
                    <Login role={role} />
                  ) : (
                    <Register role={role} embedded />
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
