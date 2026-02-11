import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
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

/* ============================================
   ABOUT / TEAM PAGE
   Matching the Blip Money design system
   ============================================ */

const easeOut = [0.19, 1, 0.22, 1] as const;

/* -- Data -- */

const visionPillars = [
  {
    icon: Globe,
    title: "Financial Freedom",
    description:
      "Enabling anyone, anywhere to transact freely without intermediaries or geographic restrictions.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Every transaction is verifiable on-chain. No hidden fees, no black boxes, just open infrastructure.",
  },
  {
    icon: Zap,
    title: "Speed",
    description:
      "Sub-second settlement powered by Solana. Payments should be instant, not delayed by legacy systems.",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description:
      "Designed for everyone from solo merchants to enterprise. Crypto payments made simple and intuitive.",
  },
];

const coreValues = [
  {
    icon: Globe,
    title: "Decentralization",
    description:
      "No single point of failure. The protocol is distributed, permissionless, and censorship-resistant by design.",
  },
  {
    icon: Shield,
    title: "Security First",
    description:
      "Non-custodial architecture with on-chain escrow. Your funds are always under your control.",
  },
  {
    icon: Users,
    title: "User-Centric",
    description:
      "Every feature is built from the user backward. We obsess over simplicity and seamless experience.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Open-source protocol, public audits, and real-time on-chain data. Trust through verification.",
  },
];


/* -- Animated Section Wrapper -- */

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================
   VISION CARD
   ============================================ */

const VisionCard = ({
  pillar,
  index,
}: {
  pillar: (typeof visionPillars)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: easeOut }}
      onMouseEnter={() => sounds.hover()}
      className="group p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.12] transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        <pillar.icon className="w-5 h-5 text-black dark:text-white" />
      </div>
      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
        {pillar.title}
      </h3>
      <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed">
        {pillar.description}
      </p>
    </motion.div>
  );
};

/* ============================================
   VALUE CARD
   ============================================ */

const ValueCard = ({
  value,
  index,
}: {
  value: (typeof coreValues)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: easeOut }}
      onMouseEnter={() => sounds.hover()}
      className="group p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.12] transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        <value.icon className="w-5 h-5 text-black dark:text-white" />
      </div>
      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
        {value.title}
      </h3>
      <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed">
        {value.description}
      </p>
    </motion.div>
  );
};


/* ============================================
   MAIN ABOUT PAGE
   ============================================ */

export default function About() {
  return (
    <>
      <SEO
        title="About Blip Money - Our Mission & Vision"
        description="Learn about Blip Money's mission to build non-custodial settlement infrastructure for the world. Instant payments, on-chain escrow, powered by Solana."
        canonical="https://blip.money/about"
        keywords="Blip Money about, Blip team, crypto payments mission, settlement infrastructure"
      />
      <HreflangTags path="/about" />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* ── Hero ── */}
        <section className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-5">
                About Blip Money
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-2xl mx-auto leading-relaxed">
                We are building the non-custodial settlement layer for the
                world. Instant payments, on-chain escrow, and merchant
                infrastructure powered by Solana.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Our Mission ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
                  Our Mission
                </span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
              </div>

              <div className="max-w-3xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-6">
                  Settlement infrastructure for the next billion users.
                </h2>
                <p className="text-[15px] sm:text-lg text-gray-500 dark:text-white/40 leading-relaxed mb-4">
                  Blip Money exists to make global payments instant, transparent,
                  and accessible to everyone. We believe that sending money
                  should be as simple as sending a message, without relying on
                  centralized intermediaries that add friction, fees, and
                  gatekeeping.
                </p>
                <p className="text-[15px] sm:text-lg text-gray-500 dark:text-white/40 leading-relaxed">
                  Our protocol provides non-custodial settlement infrastructure
                  that connects buyers, merchants, and liquidity providers in a
                  trustless ecosystem. Built on Solana for sub-second finality,
                  Blip leverages on-chain escrow, stablecoin rails, and
                  decentralized dispute resolution to create a payment layer that
                  works for everyone, from a street vendor in Lagos to an
                  e-commerce platform in Dubai.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Our Vision ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center mb-14">
              <span className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 block mb-5">
                Our Vision
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
                What we are building toward
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {visionPillars.map((pillar, index) => (
                <VisionCard key={pillar.title} pillar={pillar} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Core Values ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center mb-14">
              <span className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 block mb-5">
                Core Values
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
                The principles that guide us
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {coreValues.map((value, index) => (
                <ValueCard key={value.title} value={value} index={index} />
              ))}
            </div>
          </div>
        </section>


        {/* ── Join Us CTA ── */}
        <section className="py-16 sm:py-24 pb-24 sm:pb-32">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center">
              <div className="p-10 sm:p-16 rounded-3xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]">
                <Target className="w-10 h-10 text-black dark:text-white mx-auto mb-6" />
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                  Want to build with us?
                </h2>
                <p className="text-lg text-gray-500 dark:text-white/40 max-w-md mx-auto mb-8 leading-relaxed">
                  We are always looking for talented people who share our
                  vision for open, decentralized finance.
                </p>
                <Link
                  to="/contact"
                  onClick={() => sounds.click()}
                  onMouseEnter={() => sounds.hover()}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
                >
                  Get in Touch
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </>
  );
}
