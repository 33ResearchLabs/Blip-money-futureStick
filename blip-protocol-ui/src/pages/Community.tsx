import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageCircle,
  Github,
  ArrowUpRight,
  Wallet,
  Layers,
  Coins,
  Rocket,
  Vote,
  FileText,
  CheckCircle2,
  Star,
  Users,
  Globe,
  TrendingUp,
  ArrowRight,
  Award,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import { sounds } from "@/lib/sounds";
import { CTAButton } from "@/components/Navbar";
import { FaTelegramPlane, FaYoutube, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


/* ============================================
   COMMUNITY & ECOSYSTEM PAGE
   Matching the Blip Money design system
   ============================================ */

const easeOut = [0.19, 1, 0.22, 1] as const;

/* -- Data -- */

const socialPlatforms = [
  {
    icon: FaTelegramPlane,
    name: "Telegram",
    description:
      "Join our main community chat for real-time discussions, announcements, and support from the core team.",
    members: "12K+ members",
    href: "https://t.me/+3DpHLzc2BfJhOWEx",
  },
  {
    icon: FaXTwitter,
    name: "Twitter / X",
    description:
      "Follow us for the latest protocol updates, partnerships, product launches, and ecosystem news.",
    members: "25K+ followers",
    href: "https://x.com/blipmoney_",
  },
  {
    icon: FaYoutube,
    name: "YouTube",
    description:
      "Watch product demos, feature walkthroughs, announcements, and ecosystem updates.",
    members: "Video channel",
    href: "https://www.youtube.com/@BlipMoney",
  },
{
  icon: FaLinkedin,
  name: "LinkedIn",
  description:
    "Connect with us for company updates, hiring announcements, partnerships, and professional ecosystem news.",
  members: "Professional network",
  href: "https://www.linkedin.com/in/blip-money-849946386/",
},

];


const ecosystemPartners = [
  {
    category: "Wallets",
    items: ["Phantom", "Solflare"],
    icon: Wallet,
    description: "Non-custodial wallet integrations for seamless on-chain payments.",
  },
  {
    category: "Blockchain",
    items: ["Solana"],
    icon: Layers,
    description: "Built natively on Solana for sub-second finality and minimal fees.",
  },
  {
    category: "Stablecoins",
    items: ["USDT", "USDC"],
    icon: Coins,
    description: "Multi-stablecoin support for merchant settlements and user payments.",
  },
  {
    category: "Future Integrations",
    items: ["Coming Soon"],
    icon: Rocket,
    description: "Expanding to new chains, bridges, and payment rails. Stay tuned.",
  },
];

const daoSteps = [
  {
    icon: FileText,
    step: "01",
    title: "Propose",
    description:
      "Any $BLIP holder can submit a governance proposal. Proposals cover protocol upgrades, treasury allocation, fee adjustments, and ecosystem grants.",
  },
  {
    icon: Vote,
    step: "02",
    title: "Vote",
    description:
      "Token holders vote on-chain with weight proportional to their $BLIP stake. Voting periods are transparent and time-locked for fairness.",
  },
  {
    icon: CheckCircle2,
    step: "03",
    title: "Execute",
    description:
      "Approved proposals are executed automatically through smart contracts. No central authority needed, just community consensus.",
  },
];

const ambassadorBenefits = [
  "Early access to new features and beta programs",
  "Exclusive $BLIP token rewards and airdrops",
  "Direct communication channel with the core team",
  "Co-branded content and marketing support",
  "Invitations to IRL events and protocol summits",
  "Governance influence and proposal priority",
];

const communityStats = [
  { label: "Total Users", value: 42000, suffix: "+", prefix: "" },
  { label: "Transactions", value: 185000, suffix: "+", prefix: "" },
  { label: "Merchants", value: 1200, suffix: "+", prefix: "" },
  { label: "Countries", value: 65, suffix: "+", prefix: "" },
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
   ANIMATED COUNTER
   ============================================ */

const AnimatedCounter = ({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ============================================
   SOCIAL PLATFORM CARD
   ============================================ */
   




const SocialCard = ({
  platform,
  index,
}: {
  platform: (typeof socialPlatforms)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = platform.icon;

  return (
    <motion.a
      ref={ref}
      href={platform.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: easeOut }}
      onMouseEnter={() => sounds.hover()}
      onClick={() => sounds.click()}
      className="group block p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.12] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-black dark:text-white" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-white/20 group-hover:text-black dark:group-hover:text-white transition-colors" />
      </div>

      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
        {platform.name}
      </h3>
      <p className="text-[14px] text-gray-500 dark:text-white/40 leading-relaxed mb-4">
        {platform.description}
      </p>
      <span className="text-[12px] font-medium text-gray-400 dark:text-white/30">
        {platform.members}
      </span>
    </motion.a>
  );
};

/* ============================================
   ECOSYSTEM PARTNER CARD
   ============================================ */

const EcosystemCard = ({
  partner,
  index,
}: {
  partner: (typeof ecosystemPartners)[0];
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
        <partner.icon className="w-5 h-5 text-black dark:text-white" />
      </div>

      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/35 block mb-2">
        {partner.category}
      </span>

      <div className="flex flex-wrap gap-2 mb-4">
        {partner.items.map((item) => (
          <span
            key={item}
            className="inline-block px-3 py-1 rounded-full text-[12px] font-medium bg-black/[0.04] dark:bg-white/[0.06] text-black dark:text-white"
          >
            {item}
          </span>
        ))}
      </div>

      <p className="text-[14px] text-gray-500 dark:text-white/40 leading-relaxed">
        {partner.description}
      </p>
    </motion.div>
  );
};

/* ============================================
   DAO STEP CARD
   ============================================ */

const DaoStepCard = ({
  step,
  index,
}: {
  step: (typeof daoSteps)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15, ease: easeOut }}
      onMouseEnter={() => sounds.hover()}
      className="group p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.12] transition-all duration-300 text-center"
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-white/30 block mb-4">
        Step {step.step}
      </span>

      <div className="w-12 h-12 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
        <step.icon className="w-5 h-5 text-black dark:text-white" />
      </div>

      <h3 className="text-xl font-bold text-black dark:text-white mb-3">
        {step.title}
      </h3>
      <p className="text-[14px] text-gray-500 dark:text-white/40 leading-relaxed">
        {step.description}
      </p>
    </motion.div>
  );
};

/* ============================================
   STAT CARD
   ============================================ */

const StatCard = ({
  stat,
  index,
}: {
  stat: (typeof communityStats)[0];
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
      className="group p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.12] transition-all duration-300 text-center"
    >
      <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-2">
        <AnimatedCounter
          value={stat.value}
          suffix={stat.suffix}
          prefix={stat.prefix}
        />
      </div>
      <span className="text-[13px] text-gray-400 dark:text-white/40">
        {stat.label}
      </span>
    </motion.div>
  );
};

/* ============================================
   MAIN COMMUNITY PAGE
   ============================================ */

export default function Community() {
  return (
    <>
      <SEO
        title="Blip Community & Ecosystem - Join the Movement"
        description="Join the Blip Money community across Telegram, Twitter, Discord, and GitHub. Explore our ecosystem partners, DAO governance, and ambassador program."
        canonical="https://blip.money/community"
        keywords="Blip community, Blip ecosystem, Blip DAO, crypto community, Solana community, BLIP token governance"
      />
      <HreflangTags path="/community" />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* ── Hero ── */}
        <section className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Community" }]} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-5">
                Community & Ecosystem
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-2xl mx-auto leading-relaxed">
                Blip is built by and for its community. Join thousands of users,
                developers, and merchants shaping the future of decentralized
                payments.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Join the Community ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center mb-14">
              <span className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 block mb-5">
                Join the Community
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
                Connect with us everywhere
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {socialPlatforms.map((platform, index) => (
                <SocialCard
                  key={platform.name}
                  platform={platform}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Ecosystem Partners ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center mb-14">
              <span className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 block mb-5">
                Ecosystem Partners
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                Powering the Blip ecosystem
              </h2>
              <p className="text-lg text-gray-500 dark:text-white/40 max-w-lg mx-auto">
                Integrations and partnerships that make decentralized payments
                possible.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {ecosystemPartners.map((partner, index) => (
                <EcosystemCard
                  key={partner.category}
                  partner={partner}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── DAO Governance ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center mb-14">
              <span className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 block mb-5">
                DAO Governance
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                Governed by the community
              </h2>
              <p className="text-lg text-gray-500 dark:text-white/40 max-w-xl mx-auto">
                The Blip Protocol is governed by $BLIP token holders through a
                transparent, on-chain DAO. Every major decision is made
                collectively.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {daoSteps.map((step, index) => (
                <DaoStepCard key={step.title} step={step} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Ambassador Program ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <div className="p-8 sm:p-12 rounded-3xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-black dark:text-white" />
                  <span className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
                    Ambassador Program
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight mb-4">
                  Become a Blip Ambassador
                </h2>
                <p className="text-[15px] sm:text-lg text-gray-500 dark:text-white/40 leading-relaxed mb-8 max-w-2xl">
                  We are looking for passionate community members to represent
                  Blip Money in their regions. Ambassadors help grow the
                  ecosystem through education, events, and local merchant
                  onboarding.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {ambassadorBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.06,
                        ease: easeOut,
                      }}
                      className="flex items-start gap-3"
                    >
                      <Star className="w-4 h-4 text-black dark:text-white/60 mt-0.5 flex-shrink-0" />
                      <span className="text-[14px] text-gray-600 dark:text-white/50">
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* <a
                  href="#"
                  onClick={() => sounds.click()}
                  onMouseEnter={() => sounds.hover()}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </a> */}
                <CTAButton to="/waitlist" className="w-[220px] h-[48px]"> Apply Now</CTAButton>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Community Stats ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center mb-14">
              <span className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 block mb-5">
                Community Stats
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
                Growing every day
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {communityStats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 sm:py-24 pb-24 sm:pb-32">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center">
              <div className="p-10 sm:p-16 rounded-3xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]">
                <Users className="w-10 h-10 text-black dark:text-white mx-auto mb-6" />
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                  Join the Blip Community
                </h2>
                <p className="text-lg text-gray-500 dark:text-white/40 max-w-md mx-auto mb-8 leading-relaxed">
                  Be part of the movement building decentralized payment
                  infrastructure for the world.
                </p>
                <a
                  href="https://t.me/+3DpHLzc2BfJhOWEx"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.click()}
                  onMouseEnter={() => sounds.hover()}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Join on Telegram
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </>
  );
}
