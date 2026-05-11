import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Globe,
  Shield,
  Users,
  Eye,
  Zap,
  Lock,
  Heart,
  Target,
  ArrowRight,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import { sounds } from "@/lib/sounds";
import { SwipeHint } from "@/components/IndexSections/SwipeHint";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Light-bg primary — solid black, white text */
const PrimaryLink = ({
  to,
  children,
  className = "",
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    to={to}
    onClick={() => sounds.click()}
    onMouseEnter={() => sounds.hover()}
    className={
      "group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[16px] font-semibold transition-all duration-300 ease-out bg-black text-white border border-black hover:shadow-[0_8px_28px_rgba(0,0,0,0.25)] active:scale-[0.98] " +
      className
    }
  >
    {children}
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
  </Link>
);

/* Light-bg secondary — outlined black */
const SecondaryLink = ({
  to,
  children,
  className = "",
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    to={to}
    onClick={() => sounds.click()}
    onMouseEnter={() => sounds.hover()}
    className={
      "inline-flex items-center justify-center px-5 py-2.5 rounded-full text-[16px] font-semibold transition-all duration-300 ease-out text-black border border-black/25 hover:border-black/55 hover:bg-black/[0.04] active:scale-[0.98] " +
      className
    }
  >
    {children}
  </Link>
);

/* ── Data ────────────────────────────────────────────────── */

const visionPillars = [
  {
    icon: Globe,
    title: "Financial Freedom",
    description:
      "Anyone, anywhere — transacting without intermediaries or geography deciding access.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Every settlement verifiable on-chain. No hidden fees. No black boxes.",
  },
  {
    icon: Zap,
    title: "Speed",
    description:
      "Sub-second finality on Solana. Payments instant, not delayed by legacy rails.",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description:
      "From a solo merchant to enterprise checkout — crypto payments, simple.",
  },
];

const coreValues = [
  {
    icon: Globe,
    title: "Decentralization",
    description:
      "No single point of failure. Distributed, permissionless, censorship-resistant.",
  },
  {
    icon: Shield,
    title: "Security first",
    description:
      "Non-custodial architecture with on-chain escrow. Funds stay under your control.",
  },
  {
    icon: Users,
    title: "User-centric",
    description:
      "Built from the user backward. Obsessive about simplicity and the seamless experience.",
  },
  {
    icon: Lock,
    title: "Trust by proof",
    description:
      "Open-source protocol, public audits, real-time on-chain data. Verify, don't trust.",
  },
];

const metrics = [
  { value: "100+", label: "Merchants" },
  { value: "<60s", label: "Avg settlement" },
  { value: "24/7", label: "Always-on" },
  { value: "0", label: "Custodians" },
];

/* ── Reveal wrapper ──────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Pillar / Value card (shared, minimal) ───────────────── */

function MinimalCard({
  icon: Icon,
  title,
  description,
  onDark,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onDark: boolean;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      onMouseEnter={() => sounds.hover()}
      className={
        onDark
          ? "p-7 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          : "p-7 sm:p-8 rounded-2xl border border-black/[0.08] bg-white hover:bg-white transition-colors"
      }
    >
      <div
        className={
          "w-10 h-10 rounded-xl flex items-center justify-center mb-5 " +
          (onDark
            ? "bg-white/[0.04] border border-white/[0.08]"
            : "bg-black/[0.03] border border-black/[0.08]")
        }
      >
        <Icon
          className={onDark ? "w-5 h-5 text-white/85" : "w-5 h-5 text-black/80"}
          strokeWidth={1.7}
        />
      </div>
      <h3
        className={
          "text-[17px] font-semibold mb-1.5 tracking-tight " +
          (onDark ? "text-white" : "text-black")
        }
      >
        {title}
      </h3>
      <p
        className={
          "text-[14px] leading-relaxed " +
          (onDark ? "text-white/55" : "text-black/55")
        }
      >
        {description}
      </p>
    </motion.div>
  );
}

/* ── Main ────────────────────────────────────────────────── */

export default function About() {
  return (
    <>
      <SEO
        title="About Blip Money — Our Mission & Vision"
        description="Blip Money is the non-custodial settlement layer for the world. Instant payments, on-chain escrow, powered by Solana."
        canonical="https://blip.money/about"
        keywords="Blip Money about, Blip team, crypto payments mission, settlement infrastructure"
      />
      <HreflangTags path="/about" />

      <div className="min-h-screen bg-[#FAF8F5] text-black">
        {/* ── Hero — Grand, Apple-cinematic ── */}
        <section className="relative min-h-[92vh] flex items-center pt-32 sm:pt-36 pb-20 overflow-hidden">
          {/* Dotted grid — Apple-style backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.5]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0.18) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)",
            }}
          />
          {/* Soft orange light wash */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 55% at 50% 38%, rgba(255,107,53,0.12) 0%, rgba(255,107,53,0.04) 40%, transparent 75%)",
            }}
          />
          {/* Floating particles */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute w-1 h-1 rounded-full bg-black/25"
              style={{
                left: `${8 + ((i * 43 + 11) % 84)}%`,
                top: `${14 + ((i * 53 + 7) % 72)}%`,
              }}
              animate={{
                y: [0, -22, 0],
                opacity: [0.18, 0.55, 0.18],
              }}
              transition={{
                duration: 4.5 + (i % 4) * 0.7,
                repeat: Infinity,
                delay: (i % 5) * 0.5,
              }}
            />
          ))}
          {/* Top fade line */}
          <div
            aria-hidden
            className="absolute top-24 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-black/15 to-transparent"
          />

          <div className="relative max-w-[1200px] mx-auto px-6 w-full">
            <div className="mb-8 flex justify-center">
              <Breadcrumbs
                items={[{ label: "Home", href: "/" }, { label: "About" }]}
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-[#ff6b35] mb-8"
            >
              About Blip Money
            </motion.p>

            {/* Headline — word-by-word reveal, a touch smaller than home */}
            <h1
              className="font-display text-center font-semibold text-black tracking-tight leading-[1.04]"
              style={{ fontSize: "clamp(2.75rem, 6.5vw, 5.25rem)" }}
            >
              <motion.span
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.1, ease: EASE }}
                className="block"
              >
                Settlement
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
                className="block text-black/35"
              >
                for the next
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.32, ease: EASE }}
                className="block italic"
                style={{ color: "#ff6b35" }}
              >
                billion users.
              </motion.span>
            </h1>

            {/* Underline rule */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
              style={{ originX: 0.5 }}
              className="mx-auto mt-12 h-[2px] w-32 bg-gradient-to-r from-transparent via-black/30 to-transparent"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.85, ease: EASE }}
              className="text-center text-[17px] sm:text-xl text-black/55 max-w-2xl mx-auto leading-relaxed mt-10"
            >
              A non-custodial protocol for cash, wire, and crypto transfers.
              <br className="hidden sm:block" />
              Sub-second finality. On-chain proof. No custodians.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.0, ease: EASE }}
              className="mt-12 flex flex-col sm:flex-row gap-3 items-center justify-center"
            >
              <PrimaryLink to="/whitepaper" className="w-[200px] h-[48px]">
                Read whitepaper
              </PrimaryLink>
              <SecondaryLink to="/contact" className="w-[180px] h-[48px]">
                Get in touch
              </SecondaryLink>
            </motion.div>
          </div>
        </section>

        {/* ── Metrics strip — light, restrained ── */}
        <section className="border-t border-b border-black/[0.06] bg-white">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black/[0.06]">
              {metrics.map((m, i) => (
                <Reveal
                  key={m.label}
                  delay={i * 0.06}
                  className="text-center py-10"
                >
                  <div className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tabular-nums tracking-tight">
                    {m.value}
                  </div>
                  <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
                    {m.label}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission — DARK ── */}
        <section className="bg-black text-white py-28 sm:py-36">
          <div className="max-w-3xl mx-auto px-6">
            <Reveal>
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40 mb-7">
                Our mission
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-display text-center text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08]">
                Sending money
                <br className="hidden sm:block" />
                <span className="text-white/45">
                  {" "}should be as easy as
                </span>{" "}
                sending a message.
              </h2>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-10 space-y-5 text-center text-white/55 text-[15px] sm:text-base leading-relaxed">
                <p>
                  Blip Money exists because sending money across borders should
                  not depend on banks, business hours, or paperwork. We are
                  building non-custodial settlement infrastructure that
                  connects buyers, merchants, and liquidity providers in a
                  trustless ecosystem.
                </p>
                <p>
                  Built on Solana for sub-second finality, Blip leverages
                  on-chain escrow, stablecoin rails, and decentralized dispute
                  resolution — a payment layer that works for a street vendor
                  in Lagos and an e-commerce checkout in Dubai equally.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Vision — LIGHT ── */}
        <section className="bg-[#FAF8F5] text-black py-24 sm:py-32">
          <div className="max-w-[1100px] mx-auto px-6">
            <Reveal>
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-black/45 mb-5">
                Our vision
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-center text-3xl sm:text-5xl font-semibold tracking-tight mb-14">
                What we are building toward.
              </h2>
            </Reveal>

            <div className="relative">
              <div className="-mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 flex md:grid md:grid-cols-2 gap-4 sm:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {visionPillars.map((p, i) => (
                  <div
                    key={p.title}
                    className="snap-start shrink-0 w-[86%] md:w-auto"
                  >
                    <MinimalCard
                      icon={p.icon}
                      title={p.title}
                      description={p.description}
                      onDark={false}
                      index={i}
                    />
                  </div>
                ))}
              </div>
              <SwipeHint />
            </div>
          </div>
        </section>

        {/* ── Values — DARK ── */}
        <section className="bg-black text-white py-24 sm:py-32">
          <div className="max-w-[1100px] mx-auto px-6">
            <Reveal>
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40 mb-5">
                Core values
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-center text-3xl sm:text-5xl font-semibold tracking-tight mb-14">
                The principles that guide us.
              </h2>
            </Reveal>

            <div className="relative">
              <div className="-mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 flex md:grid md:grid-cols-2 gap-4 sm:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {coreValues.map((v, i) => (
                  <div
                    key={v.title}
                    className="snap-start shrink-0 w-[86%] md:w-auto"
                  >
                    <MinimalCard
                      icon={v.icon}
                      title={v.title}
                      description={v.description}
                      onDark={true}
                      index={i}
                    />
                  </div>
                ))}
              </div>
              <SwipeHint />
            </div>
          </div>
        </section>

        {/* ── CTA — LIGHT ── */}
        <section className="bg-[#FAF8F5] text-black py-24 sm:py-32">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Reveal>
              <Target
                className="w-9 h-9 mx-auto mb-7 text-black/65"
                strokeWidth={1.5}
              />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight mb-5">
                Want to build with us?
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-base sm:text-lg text-black/55 max-w-xl mx-auto mb-10 leading-relaxed">
                We&apos;re always looking for builders who share our vision for
                open, decentralized finance.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <PrimaryLink to="/contact" className="w-[200px] h-[48px]">
                  Get in touch
                </PrimaryLink>
                <SecondaryLink to="/whitepaper" className="w-[180px] h-[48px]">
                  Read whitepaper
                </SecondaryLink>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
