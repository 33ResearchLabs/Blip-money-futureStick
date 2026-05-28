import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ChevronDown,
  CheckCircle2,
  Copy,
  Plus,
  ArrowRight,
  Shield,
  Zap,
  ChevronRight,
  Globe,
  Cpu,
  Lock,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * HIGH-DEFINITION CINEMATIC ASSETS
 */
const IMAGES = {
  heroGlobe:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format",
  lightModeGlobe:
    "https://lh3.googleusercontent.com/gg-dl/AOI_d_8EiIYRBtnO2zznoeqW-A9YI9Kyy4_cGwnqWGRARqKLO7GED7LMHwmt79MFG8M1vAzgq22oVXSJFppOphvsJ7MdjieWt8oatnzkZnL2yJMx8uI5neF4myA8uwIPM2vLncZlizL63RQzLKDshdWqQOg5Q0YG3dMoXFFnlzc-eEdmOzk-=s1600-rj",
  fiberOptics: "/globalprovider.png",
  dataStream:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format",
  blockchainNodes: "/blockchainNodes_opt.webp",
  vault:
    "https://www.gettrx.com/wp-content/uploads/2023/08/Merchant-Account-vs-Payment-Gateway-vs-PSP.jpg",
  deepNetwork:
    "https://plus.unsplash.com/premium_photo-1677488181730-780718b005e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fGNvaW5zJTIwY3J5cHRvJTIwYmFubmVyfGVufDB8fDB8fHww",
};

/**
 * REUSABLE PREMIUM COMPONENTS
 */

const SectionLabel = ({
  children,
  color = "text-gray-500",
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <span
    className={`text-[11px] font-bold uppercase tracking-[0.3em] ${color} block mb-4`}
  >
    {children}
  </span>
);

const AppleButton = ({
  children,
  variant = "primary",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "link";
  onClick?: () => void;
  className?: string;
}) => {
  const base =
    "px-8 py-3.5 rounded-full font-semibold transition-all duration-500 text-sm flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap overflow-hidden relative group";
  const styles = {
    primary:
      "bg-white text-black border border-black/10 hover:scale-[1.01] hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98]",
    secondary:
      "bg-black/10 dark:bg-white/10 text-black dark:text-white backdrop-blur-md hover:bg-black/20 dark:hover:bg-white/20 border border-black/10 dark:border-white/10",
    link: "text-[#ffb088] hover:text-white px-0 py-0 font-medium",
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const BentoCard = ({
  children,
  className = "",
  title,
  subtitle,
  image,
  dark = true,
  opacity = 0,
  titleColor,
  overlayOpacity = "opacity-40",
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  dark?: boolean;
  opacity?: number;
  titleColor?: string;
  overlayOpacity?: string;
}) => (
  <div
    className={`${className} relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] md:rounded-[3rem] group border border-black/5 dark:border-white/5 shadow-2xl ${dark ? "bg-[#FAF8F5] dark:bg-black" : "bg-white text-black"} `}
  >
    {image && (
      <>
        <img
          src={image}
          alt={title || "Tech Visual"}
          className={`absolute inset-0 w-full h-full object-fill ${overlayOpacity} group-hover:scale-105 transition-transform duration-1000 ease-out`}
        />
        {!opacity && (
          <div
            className={`absolute inset-0 bg-gradient-to-t ${dark ? "from-[#FAF8F5] dark:from-black via-[#FAF8F5]/80 dark:via-black/80" : "from-white via-white/40"} to-transparent opacity-100 transition-opacity`}
          />
        )}
      </>
    )}
    <div className="relative z-10 p-6 sm:p-8 md:p-10 h-full flex flex-col">
      {(title || subtitle) && (
        <div>
          {title && (
            <h3
              className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 ${titleColor ? "text-black" : dark ? "text-black dark:text-white" : "text-black"}`}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              className={`text-sm sm:text-base max-w-[280px] leading-relaxed ${titleColor ? "text-black/60" : dark ? "text-black/60 dark:text-gray-400" : "text-gray-600"}`}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="mt-auto">{children}</div>
    </div>
  </div>
);

/**
 * FAQ SECTION
 */

const REWARD_FAQS = [
  {
    q: "How do I qualify for settlement rewards?",
    a: "Complete successful settlements through the Blip protocol.",
  },
  {
    q: "Are reward distributions automated on-chain?",
    a: "Yes, rewards are automatically distributed via smart contracts on-chain.",
  },
  {
    q: "What defines a 'Verified Merchant' payment?",
    a: "A payment processed through a merchant verified and approved by the Blip protocol.",
  },
  {
    q: "Can I stake BLIP for governance weight?",
    a: "Yes, staking BLIP gives you governance voting power.",
  },
];

const FAQSection = ({
  activeFaq,
  setActiveFaq,
}: {
  activeFaq: number | null;
  setActiveFaq: (v: number | null) => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-10 pt-16 md:pt-32">
      <div className="text-center mb-10 md:mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 md:mb-6">
          Common Knowledge.
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-black/50 dark:text-gray-500 font-medium">
          Clear insights into protocol reward mechanics.
        </p>
      </div>
      <div className="space-y-4">
        {REWARD_FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 * i }}
            className="border border-black/[0.08] dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl rounded-xl overflow-hidden"
          >
            <button
              className="w-full flex justify-between items-center p-5 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
            >
              <span className="font-medium text-black dark:text-white text-sm pr-4">
                {faq.q}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-black/40 dark:text-white/40 flex-shrink-0 transition-transform duration-300 ${
                  activeFaq === i ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {activeFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden bg-gray-200 dark:bg-black"
                >
                  <div className="px-5 pb-5 text-sm text-black dark:text-white/40 leading-relaxed border-t border-black/[0.06] dark:border-white/[0.06] pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/**
 * REWARDS HUB PAGE
 */

export default function RewardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddr, setWalletAddr] = useState("");
  const [copying, setCopying] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const connectWallet = () => {
    if (isConnected) {
      setIsConnected(false);
      setWalletAddr("");
    } else {
      setIsConnected(true);
      setWalletAddr("8xM...p29z");
    }
  };

  const handleCopy = () => {
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#000] text-black dark:text-white font-sans antialiased selection:bg-blue-500/30">
      {/* IMMERSIVE NAV */}

      <main className="pb-32">
        {/* CINEMATIC HERO */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={isDark ? IMAGES.heroGlobe : "/lightModeGlobe.webp"}
              alt="Global Network"
              className="w-full h-full object-cover opacity-50 scale-110 animate-subtle-zoom"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-b ${isDark ? "from-black via-transparent to-black" : "from-[#FAF8F5] via-transparent to-[#FAF8F5]"}`}
            />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 text-center space-y-6 sm:space-y-8 md:space-y-10">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-xl mb-2 sm:mb-4">
              <Activity size={14} className="text-[#ffb088]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#ffb088]">
                Network Status: Optimized
              </span>
            </div>
            <h1 className="text-[36px] sm:text-[52px] md:text-[80px] lg:text-[110px] font-black tracking-[-0.05em] leading-[1.05] sm:leading-[0.95] drop-shadow-2xl text-black dark:text-white">
              Borderless finance. <br />
              <span className="text-black/50 dark:text-gray-300">
                Settled on-chain.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black/60 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
              A high-performance P2P payment network built on Solana. Earn
              native rewards for every contribution to the ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6 md:pt-10">
              <Link to="/">
              <AppleButton className="h-12 sm:h-14 md:h-16 px-6 sm:px-10 md:px-12 text-sm sm:text-base md:text-xl shadow-[0_0_50px_rgba(0,0,0,0.15)] dark:shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-105">
                Explore Rewards
              </AppleButton></Link>
              <Link to="/whitepaper">
                <AppleButton
                  variant="link"
                  className="h-12 sm:h-14 md:h-16 px-6 sm:px-10 md:px-12 text-sm sm:text-base md:text-xl bg-black border border-white/20 text-white hover:border border-gray hover:scale-105"
                >
                  Read Whitepaper
                  <ChevronRight size={20} className="sm:hidden" />
                  <ChevronRight size={24} className="hidden sm:inline" />
                </AppleButton>
              </Link>
            </div>
          </div>
        </section>

        {/* WELCOME HUB */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 relative z-20">
          <BentoCard
            className="min-h-[320px] sm:min-h-[380px] bg-black "
            // image={IMAGES.deepNetwork}
            overlayOpacity="opacity-100"
            opacity={0}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">
                  $25 Welcome Incentive
                </h3>
                <p className="text-sm sm:text-base md:text-lg max-w-[280px] leading-relaxed text-gray-400">
                  Initiate your first settlement and unlock immediate protocol
                  rewards.
                </p>
              </div>
              <Link to="https://app.blip.money/waitlist/user">
                <AppleButton
                  variant="primary"
                  onClick={connectWallet}
                  className="h-12 sm:h-14 md:h-16 px-6 sm:px-10 md:px-14 text-sm sm:text-base md:text-xl rounded-2xl sm:rounded-[1.5rem] shrink-0 shadow-2xl md:mt-8 hover:scale-105"
                >
                  {isConnected ? "Start Settlement" : "Click To Claim"}
                </AppleButton>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full md:max-w-md">
              <div className="p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] bg-[#FAF8F5]/80 dark:bg-black/40 border border-black/10 dark:border-white/10 backdrop-blur-3xl group/item hover:border-black/20 dark:hover:border-white/20 transition-all">
                <SectionLabel color="text-black/50 dark:text-gray-400">
                  Your Status
                </SectionLabel>
                <div className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <CheckCircle2 size={18} className="text-green-500 shrink-0" />{" "}
                      Connected
                    </>
                  ) : (
                    "Inactive"
                  )}
                </div>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] bg-[#FAF8F5]/80 dark:bg-black/40 border border-black/10 dark:border-white/10 backdrop-blur-3xl group/item hover:border-black/20 dark:hover:border-white/20 transition-all">
                <SectionLabel color="text-black/50 dark:text-gray-400">
                  Available
                </SectionLabel>
                <div className="text-base sm:text-lg md:text-xl font-bold">25.00 BLIP</div>
              </div>
            </div>
          </BentoCard>
        </section>

        {/* CAMPAIGNS BENTO GRID */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 pt-16 md:pt-24 lg:pt-32 space-y-8 md:space-y-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 md:mb-12 lg:mb-16 px-0 sm:px-2 md:px-4">
            <div className="space-y-2">
              <SectionLabel color="text-[#ffb088]">
                Current Opportunities
              </SectionLabel>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter">
                Active Hubs
              </h2>
            </div>
            <AppleButton variant="link" className="text-sm sm:text-base md:text-lg self-start sm:self-auto">
              Protocol Archive <ChevronRight size={18} />
            </AppleButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8 h-auto">
            {/* LIQUIDITY HUB */}
            <BentoCard
              className="md:col-span-8 min-h-[420px] sm:min-h-[480px] md:h-[600px]"
              title="Global Liquidity Provider"
              subtitle="Power the PeopleBank network by providing deep liquidity to settlement pairs."
              image={IMAGES.fiberOptics}
              opacity={0}
              overlayOpacity="opacity-100"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4 sm:gap-6 md:gap-8 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-[1.5rem] md:rounded-[2rem] border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#ffb088]/20 border border-[#ffb088]/30 flex items-center justify-center shrink-0">
                    <Cpu className="text-[#ffb088] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-black/50 dark:text-gray-500 font-bold uppercase tracking-widest">
                      Base Reward
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-black">50.00 BLIP</div>
                  </div>
                </div>
                <AppleButton
                  variant="link"
                  className="h-11 sm:h-12 md:h-14 px-6 sm:px-8 md:px-10 text-sm md:text-base border border-white/40 text-white hover:scale-105"
                >
                  Add Liquidity
                </AppleButton>
              </div>
            </BentoCard>

            {/* P2P CARD */}
            <BentoCard
              className="md:col-span-4 min-h-[360px] sm:min-h-[420px] md:h-[600px]"
              title="Peer Settlement"
              subtitle="The core heartbeat of blip.money. Simple. Instant. Private."
              image={IMAGES.blockchainNodes}
              overlayOpacity="opacity-50"
            >
              <div className="flex items-center justify-between w-full pt-6 sm:pt-8 md:pt-10 border-t border-black/10 dark:border-white/10 group/btn cursor-pointer">
                <span className="text-2xl sm:text-3xl font-black">
                  10.00{" "}
                  <span className="text-[10px] sm:text-xs text-black/50 dark:text-gray-500 tracking-widest">
                    BLIP
                  </span>
                </span>
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center group-hover/btn:bg-black dark:group-hover/btn:bg-white group-hover/btn:text-white dark:group-hover/btn:text-black transition-all duration-500 shrink-0">
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
              </div>
            </BentoCard>

            {/* MERCHANT CARD */}
            <BentoCard
              className="md:col-span-4 min-h-[340px] sm:min-h-[400px] md:h-[500px]"
              title="Merchant Gateway"
              subtitle="Pay verified partners on-chain. Zero fees. Zero friction."
              image={
                "https://plus.unsplash.com/premium_photo-1682339354902-b19775dccc77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTMxfHxwYXltZW50fGVufDB8fDB8fHww"
              }
              opacity={0}
              titleColor="true"
              overlayOpacity="opacity-100"
            >
              <div className="flex items-center justify-between w-full pt-4 sm:pt-6 gap-3">
                <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <Zap className="text-black w-5 h-5 sm:w-6 sm:h-6" /> 20.00
                </div>
                <AppleButton
                  variant="link"
                  className="rounded-2xl border dark:bg-white text-black hover:border-white/40 border-white/20 hover:text-white text-sm sm:text-base"
                >
                  Use Pay
                </AppleButton>
              </div>
            </BentoCard>

            {/* WHITE PERFORMANCE CARD */}
            <BentoCard
              dark={false}
              className="md:col-span-8 min-h-[420px] sm:min-h-[460px] md:h-[500px]"
              title="Recurring Velocity"
              subtitle="Maintain high protocol engagement to unlock tiered performance multipliers."
            >
              <div className="space-y-6 sm:space-y-8 md:space-y-10 mt-6 sm:mt-8 md:mt-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-14 sm:h-16 md:h-20 rounded-xl sm:rounded-2xl border flex items-center justify-center text-base sm:text-lg md:text-xl font-black ${i === 1 ? "bg-black text-white border-black" : "border-black/5 text-black/70"}`}
                    >
                      {i}x
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 bg-black/5 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[1.5rem] md:rounded-[2rem]">
                  <div>
                    <SectionLabel color="text-black/40">
                      Current Multiplier
                    </SectionLabel>
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tighter">
                      15.00 BLIP
                    </span>
                  </div>
                  <AppleButton className="!bg-black !text-white hover:!bg-black/90 h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg self-start sm:self-auto">
                    Increase Velocity
                  </AppleButton>
                </div>
              </div>
            </BentoCard>
          </div>
        </section>

        {/* GLOBAL REFERRAL */}
        <section className="relative py-20 md:py-32 lg:py-40 overflow-hidden mt-16 md:mt-24 lg:mt-32">
          <div className="absolute inset-0 z-0">
            <img
              src={IMAGES.dataStream}
              alt="Global Network"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] dark:from-black via-transparent to-[#FAF8F5] dark:to-black" />
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center relative z-10">
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-4 sm:space-y-6">
                <SectionLabel color="text-[#ffb088]">
                  Network Growth
                </SectionLabel>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight">
                  Scale the <br />
                  Future Hub.
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black/60 dark:text-gray-400 max-w-md leading-relaxed font-medium">
                  Invite the next wave of participants and share in the
                  protocol's expansion rewards.
                </p>
              </div>
              <div className="grid gap-4 sm:gap-6">
                {[
                  {
                    t: "Tier 1",
                    d: "10 BLIP per Referral Transfer",
                    icon: <Globe size={20} />,
                  },
                  {
                    t: "Tier 2",
                    d: "25 BLIP for Volume Milestones",
                    icon: <Activity size={20} />,
                  },
                  {
                    t: "Tier 3",
                    d: "100 BLIP Elite Network Bonus",
                    icon: <Lock size={20} />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 backdrop-blur-3xl group cursor-pointer hover:bg-black/[0.07] dark:hover:bg-white/[0.07] transition-all duration-500"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl md:rounded-[1.2rem] bg-black dark:bg-white text-white dark:text-black flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-base sm:text-lg md:text-xl uppercase tracking-tighter">
                        {item.t}
                      </h4>
                      <p className="text-xs sm:text-sm md:text-base text-black/50 dark:text-gray-500 font-medium">
                        {item.d}
                      </p>
                    </div>
                    <ChevronRight className="ml-auto text-black/30 dark:text-gray-700 group-hover:text-black dark:group-hover:text-white transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full group-hover:bg-blue-500/40 transition-all duration-1000" />
              <div className="relative bg-[#FAF8F5]/80 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 p-6 sm:p-10 md:p-12 lg:p-16 rounded-3xl sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[4rem] shadow-2xl space-y-6 sm:space-y-8 md:space-y-12 text-center lg:text-left">
                <div className="space-y-3 sm:space-y-4">
                  <SectionLabel color="text-black dark:text-white">
                    Your Protocol Identity
                  </SectionLabel>
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter break-all bg-clip-text text-transparent bg-gradient-to-br from-black dark:from-white to-black/40 dark:to-gray-600">
                    blip.money/r/82k...
                  </div>
                </div>
                <AppleButton
                  variant="primary"
                  onClick={handleCopy}
                  className="h-14 sm:h-16 md:h-20 w-full text-base sm:text-lg md:text-2xl font-black rounded-2xl sm:rounded-[1.5rem] md:rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                  {copying ? "Identity Copied" : "Copy Link"}
                </AppleButton>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection activeFaq={activeFaq} setActiveFaq={setActiveFaq} />

        {/* FINAL MASTHEAD CTA */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-16 md:py-24 lg:py-40">
          <div className="relative bg-white text-black rounded-3xl sm:rounded-[2.5rem] md:rounded-[4rem] lg:rounded-[5rem] p-8 sm:p-12 md:p-20 lg:p-32 flex flex-col items-center text-center space-y-6 sm:space-y-8 md:space-y-12 shadow-[0_50px_100px_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-black/[0.03] rounded-full -mr-20 sm:-mr-32 md:-mr-40 -mt-20 sm:-mt-32 md:-mt-40" />
            <SectionLabel color="text-black/40">Open Protocol</SectionLabel>
            <h2 className="text-[36px] sm:text-[48px] md:text-[72px] lg:text-[100px] font-black tracking-[-0.06em] leading-none">
              The Future <br />
              is Settled.
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black/50 max-w-xl font-medium">
              Start settling payments privately and earning rewards on the
              world's most performant network.
            </p>
            <button className="h-12 sm:h-14 md:h-16 lg:h-20 px-8 sm:px-10 md:px-14 lg:px-16 text-sm sm:text-base md:text-lg lg:text-xl font-black bg-black text-white rounded-full shadow-2xl hover:bg-black/90 transition-all active:scale-95">
              Begin Journey
            </button>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
