import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import Register from "./Register";

const EASE = [0.16, 1, 0.3, 1] as const;

/* /waitlist/user — Apple-minimal 2-column join screen.
   Editorial copy on the left, white card with the join form on the right.
   Light theme is forced via LIGHT_ROUTES in RootLayout so no dark-mode
   variants are needed inside this file. */
export default function UserRegister() {
  return (
    <>
      <SEO
        title="Join the Blip Waitlist | Early Access"
        description="Reserve your spot for borderless payments — settled by verified merchants in under 60 seconds. Early users earn bonus points and priority access."
        canonical="https://www.blip.money/waitlist/user"
      />
      <HreflangTags path="/waitlist/user" />

      <div className="min-h-screen bg-white text-black overflow-hidden">
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-16 md:pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_minmax(420px,_1fr)] gap-12 lg:gap-16 items-center min-h-[80vh]">
            {/* ── LEFT — editorial copy ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-3 mb-7">
                <span className="w-5 h-px bg-black/15" />
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase whitespace-nowrap text-black">
                  Early Access
                </span>
                <span className="w-5 h-px bg-black/15" />
              </div>

              <h1
                className="font-display text-black"
                style={{
                  fontSize: "clamp(2.6rem, 6.4vw, 4.2rem)",
                  fontWeight: 700,
                  lineHeight: 0.98,
                  letterSpacing: "-0.055em",
                  marginBottom: 20,
                }}
              >
                Reserve your spot.{" "}
                <span style={{ fontStyle: "italic", fontWeight: 600, color: "#0e7c5a" }}>
                  Skip the line.
                </span>
              </h1>

              <p className="text-black/55 text-[16px] md:text-[17px] leading-[1.55] tracking-tight max-w-[520px] mx-auto lg:mx-0 mb-10">
                Borderless money, settled by verified merchants in under 60
                seconds. Early users earn bonus points and priority access.
              </p>

              {/* Quiet value props */}
              <ul className="space-y-3 max-w-[480px] mx-auto lg:mx-0 text-left">
                {[
                  "2,000 bonus points the moment you join",
                  "Priority access when the network opens",
                  "Refer a friend — both of you skip 5 spots",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-[14.5px] text-black/70">
                    <span
                      className="mt-0.5 inline-flex w-5 h-5 shrink-0 rounded-full items-center justify-center"
                      style={{ background: "rgba(14,124,90,0.12)" }}
                    >
                      <Check className="w-3 h-3" style={{ color: "#0e7c5a" }} strokeWidth={3} />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-10 text-[12px] tracking-[0.18em] uppercase text-black/40 font-semibold">
                12,438 already in line
              </p>
            </motion.div>

            {/* ── RIGHT — form card (black, scoped dark mode) ─────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.1 }}
              className="w-full"
            >
              {/* `dark` className activates the form's existing dark-mode
                  styles locally while the surrounding page stays light. */}
              <div
                className="dark bg-black text-white rounded-[28px] border border-white/[0.06] p-6 sm:p-8 md:p-10"
                style={{
                  boxShadow:
                    "0 60px 120px -40px rgba(0,0,0,0.55), 0 24px 60px -24px rgba(0,0,0,0.35)",
                }}
              >
                <div className="mb-7">
                  <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/50 mb-2">
                    Get started
                  </div>
                  <h2
                    className="font-display text-white"
                    style={{
                      fontSize: "clamp(1.5rem, 2.4vw, 1.85rem)",
                      fontWeight: 600,
                      letterSpacing: "-0.035em",
                      lineHeight: 1.1,
                    }}
                  >
                    Join the waitlist.
                  </h2>
                </div>

                <Register embedded />
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
