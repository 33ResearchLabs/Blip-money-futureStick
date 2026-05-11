import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Globe,
  Shield,
  Users,
  Eye,
  Zap,
  Lock,
  Heart,
  Target,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import { sounds } from "@/lib/sounds";
import { SwipeHint } from "@/components/IndexSections/SwipeHint";
import { CTAButton } from "@/components/Navbar";

const EASE = [0.22, 1, 0.36, 1] as const;
const ORANGE = "#ff6b35";

/* ── Data ───────────────────────────────────────────────────── */

const visionPillars = [
  {
    icon: Globe,
    title: "Financial Freedom",
    description:
      "Anyone, anywhere — transacting without intermediaries or geography deciding their access.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Every settlement verifiable on-chain. No hidden fees, no black boxes — just open infrastructure.",
  },
  {
    icon: Zap,
    title: "Speed",
    description:
      "Sub-second finality on Solana. Payments should be instant, not delayed by legacy rails.",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description:
      "From a solo merchant to an enterprise checkout — crypto payments made simple and intuitive.",
  },
];

const coreValues = [
  {
    icon: Globe,
    title: "Decentralization",
    description:
      "No single point of failure. The protocol is distributed, permissionless, censorship-resistant.",
  },
  {
    icon: Shield,
    title: "Security First",
    description:
      "Non-custodial architecture with on-chain escrow. Your funds stay under your control.",
  },
  {
    icon: Users,
    title: "User-Centric",
    description:
      "Built from the user backward. We obsess over simplicity and a seamless experience.",
  },
  {
    icon: Lock,
    title: "Trust by Proof",
    description:
      "Open-source protocol, public audits, real-time on-chain data. Verify, don't trust.",
  },
];

const metrics = [
  { value: "150+", label: "Merchant LPs" },
  { value: "<60s", label: "Avg settlement" },
  { value: "24/7", label: "Always-on" },
  { value: "0", label: "Custodians" },
];

/* ── Cinematic Hero ─────────────────────────────────────────── */

function CinematicAboutHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section
      ref={ref}
      className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#FAF8F5] dark:bg-black"
    >
      {/* Background field */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: glowY }}
      >
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,107,53,0.15) 0%, rgba(255,107,53,0.04) 40%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div
          className="hidden dark:block absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      {/* Particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-black/30 dark:bg-white/40"
          style={{
            left: `${8 + ((i * 41 + 11) % 84)}%`,
            top: `${10 + ((i * 53 + 7) % 80)}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.6, 0.15],
          }}
          transition={{
            duration: 4 + (i % 4) * 0.7,
            repeat: Infinity,
            delay: (i % 5) * 0.4,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ y: titleY }}
      >
        <div className="mb-6 flex justify-center">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "About" }]}
          />
        </div>

        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/15 bg-white/40 dark:bg-white/[0.04] backdrop-blur-md mb-7"
        >
          <Sparkles className="w-3 h-3" style={{ color: ORANGE }} />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: ORANGE }}
          >
            The team behind Blip
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          className="font-display text-[40px] sm:text-6xl md:text-7xl lg:text-[88px] font-semibold text-black dark:text-white tracking-tight leading-[1.04] mb-7"
        >
          Settlement
          <br />
          <span className="text-black/55 dark:text-white/45">
            for the next
          </span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.4 }}
            style={{ color: ORANGE }}
            className="italic"
          >
            billion users.
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.55 }}
          className="text-[16px] sm:text-lg text-black/65 dark:text-white/50 max-w-xl mx-auto leading-relaxed mb-9"
        >
          A non-custodial protocol for cash, wire, and crypto transfers.
          Sub-second finality. On-chain proof. No custodians.
        </motion.p>

        {/* CTA pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 items-center justify-center"
        >
          <CTAButton to="/whitepaper" className="w-[200px] h-[48px]">
            Read whitepaper
          </CTAButton>
          <CTAButton
            to="/contact"
            variant="secondary"
            className="w-[180px] h-[48px]"
          >
            Get in touch
          </CTAButton>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Animated Counter ───────────────────────────────────────── */

function MetricCard({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className="text-center px-2 py-5"
    >
      <div
        className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight tabular-nums leading-none"
        style={{ color: index === 0 ? ORANGE : undefined }}
      >
        {value}
      </div>
      <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-black/40 dark:text-white/35">
        {label}
      </div>
    </motion.div>
  );
}

/* ── Mission Marquee Section ────────────────────────────────── */

function MissionSection() {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-[11px] font-bold uppercase tracking-[0.3em] text-center mb-7"
          style={{ color: ORANGE }}
        >
          Our mission
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] text-center max-w-4xl mx-auto"
        >
          Make global payments feel like{" "}
          <span className="text-black/55 dark:text-white/45">
            sending a message —
          </span>{" "}
          without anyone in the middle.
        </motion.h2>
      </div>
    </section>
  );
}

/* ── Vision / Values Cards ──────────────────────────────────── */

function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => {
        setHovered(true);
        sounds.hover();
      }}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className="group relative overflow-hidden p-7 rounded-[1.75rem] border border-black/[0.08] dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.025] backdrop-blur-xl hover:border-[#ff6b35]/30 hover:-translate-y-1 transition-all duration-500"
    >
      {/* Spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,107,53,0.08), transparent 45%)`,
        }}
      />

      <div className="relative z-10">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 border transition-all duration-300 ${
            hovered
              ? "border-[#ff6b35]/30 bg-[#ff6b35]/[0.08] scale-110"
              : "border-black/10 dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.04]"
          }`}
        >
          <Icon
            className="w-5 h-5 transition-colors"
            style={{ color: hovered ? ORANGE : undefined }}
          />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-[14px] text-black/55 dark:text-white/45 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Main page ──────────────────────────────────────────────── */

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

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-black text-black dark:text-white">
        <CinematicAboutHero />

        {/* Metrics strip */}
        <section className="relative -mt-12 sm:-mt-16 z-10">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-3xl border border-black/[0.08] dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.02] backdrop-blur-xl px-4 py-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] dark:shadow-[0_30px_80px_-30px_rgba(255,107,53,0.15)]">
              {metrics.map((m, i) => (
                <MetricCard key={m.label} value={m.value} label={m.label} index={i} />
              ))}
            </div>
          </div>
        </section>

        <MissionSection />

        {/* Mission body */}
        <section className="-mt-12 pb-24">
          <div className="max-w-3xl mx-auto px-6 space-y-5 text-black/65 dark:text-white/55 text-[16px] sm:text-lg leading-relaxed text-center">
            <p>
              Blip Money exists because sending money should be as simple as
              sending a message. We are building non-custodial settlement
              infrastructure that connects buyers, merchants, and liquidity
              providers in a trustless ecosystem.
            </p>
            <p>
              Built on Solana for sub-second finality, Blip leverages on-chain
              escrow, stablecoin rails, and decentralized dispute resolution to
              create a payment layer that works for everyone — from a street
              vendor in Lagos to an e-commerce checkout in Dubai.
            </p>
          </div>
        </section>

        {/* ── Our Vision ── */}
        <section className="py-20 sm:py-24">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-center mb-14"
            >
              <span
                className="text-[11px] uppercase tracking-[0.3em] font-bold block mb-4"
                style={{ color: ORANGE }}
              >
                Our vision
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-black dark:text-white tracking-tight">
                What we are building toward.
              </h2>
            </motion.div>

            <div className="relative">
              <div className="-mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 flex md:grid md:grid-cols-2 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {visionPillars.map((pillar, index) => (
                  <div
                    key={pillar.title}
                    className="snap-start shrink-0 w-[86%] md:w-auto"
                  >
                    <FeatureCard
                      icon={pillar.icon}
                      title={pillar.title}
                      description={pillar.description}
                      index={index}
                    />
                  </div>
                ))}
              </div>
              <SwipeHint />
            </div>
          </div>
        </section>

        {/* ── Core Values ── */}
        <section className="py-20 sm:py-24">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-center mb-14"
            >
              <span
                className="text-[11px] uppercase tracking-[0.3em] font-bold block mb-4"
                style={{ color: ORANGE }}
              >
                Core values
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-black dark:text-white tracking-tight">
                The principles that guide us.
              </h2>
            </motion.div>

            <div className="relative">
              <div className="-mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 flex md:grid md:grid-cols-2 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {coreValues.map((value, index) => (
                  <div
                    key={value.title}
                    className="snap-start shrink-0 w-[86%] md:w-auto"
                  >
                    <FeatureCard
                      icon={value.icon}
                      title={value.title}
                      description={value.description}
                      index={index}
                    />
                  </div>
                ))}
              </div>
              <SwipeHint />
            </div>
          </div>
        </section>

        {/* ── Build with us CTA ── */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(255,107,53,0.10) 0%, rgba(255,107,53,0.02) 45%, transparent 75%)",
                filter: "blur(10px)",
              }}
            />
          </div>
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Target
                className="w-9 h-9 mx-auto mb-6"
                style={{ color: ORANGE }}
              />
              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-black dark:text-white tracking-tight mb-5">
                Want to build with us?
              </h2>
              <p className="text-base sm:text-lg text-black/60 dark:text-white/45 max-w-xl mx-auto mb-9 leading-relaxed">
                We&apos;re always looking for builders who share our vision for
                open, decentralized finance.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <CTAButton to="/contact" className="w-[200px] h-[48px]">
                  Get in touch
                </CTAButton>
                <CTAButton
                  to="/whitepaper"
                  variant="secondary"
                  className="w-[180px] h-[48px]"
                >
                  Read whitepaper
                </CTAButton>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
