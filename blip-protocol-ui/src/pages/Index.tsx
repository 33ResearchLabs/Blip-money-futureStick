import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Activity,
  Wallet,
  ShieldCheck,
  Smartphone,
  X,
  Coffee,
  Users,
  Hexagon,
  Utensils,
  MapPin,
  ShoppingBag,
  Car,
  Gem,
  Package,
  Truck,
  Handshake,
  Store,
  Lock,
  CreditCard,
  Building2,
  Landmark,
  Menu,
  Zap,
  Layers,
} from "lucide-react";
import { SocialSidebar } from "@/components/SocialSidebar";
import { Link } from "react-router-dom";
import TransferFlow from "@/components/TransferFlow";
import useScrollActive from "@/hooks/useScrollActive";
import ScrollReveal from "@/components/ScrollReveal";
import { SectionLabel } from "@/components/SectionLable";

// --- Visual Effects Components ---

// Button UI
// --- Visual Effects Components ---

const Button = ({ children, primary = false, className = "" }) => (
  <button
    className={`
      relative overflow-hidden px-8 py-4 rounded-full font-bold tracking-wide transition-all duration-300 group cursor-pointer
      ${
        primary
          ? "bg-[#0B9A4A] text-black hover:bg-[#08793A] hover:shadow-[0_0_24px_rgba(11,154,74,0.4)]"
          : "bg-transparent border border-[#2A2A2A] text-white hover:border-[#0B9A4A] hover:text-[#0B9A4A]"
      }
      ${className}
    `}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </button>
);

const USAGE_SCENES = [
  {
    id: "cafe",
    title: "Cafés",
    subtitle: "TAP TO PAY",
    icon: Coffee,
    headline: "Tap to pay for coffee with crypto.",
    description:
      "You scan a QR, pay in USDT from your wallet. The café receives local currency in seconds, settled via Blip.",
    statLabel: "Typical settlement",
    statValue: "< 10s",
    flow: ["Your Wallet", "Blip Protocol", "Cafe Bank / POS"],
  },
  {
    id: "restaurant",
    title: "Restaurants",
    subtitle: "TABLE SETTLEMENT",
    icon: Utensils,
    headline: "Split the bill, stay on-chain.",
    description:
      "Everyone pays their share in crypto. Blip routes it to the restaurant as a single local-currency payout.",
    statLabel: "Party size",
    statValue: "2–20 guests",
    flow: ["Multiple Wallets", "Blip Matching Engine", "Restaurant Account"],
  },
  {
    id: "hotel",
    title: "Hotels",
    subtitle: "INSTANT BOOKING",
    icon: MapPin,
    headline: "Book stays without touching fiat.",
    description:
      "Lock your booking with crypto. Hotel gets guaranteed settlement in their own currency.",
    statLabel: "Deposit hold",
    statValue: "On-chain",
    flow: ["Your Wallet", "Escrow Contract", "Hotel Payout"],
  },
  {
    id: "retail",
    title: "Retail",
    subtitle: "POS INTEGRATION",
    icon: ShoppingBag,
    headline: "Swipe, tap, or scan at checkout.",
    description:
      "Blip plugs into existing POS flows so merchants see normal payouts while you stay fully crypto-native.",
    statLabel: "Integration",
    statValue: "POS / Online",
    flow: ["Wallet", "Blip", "Store POS"],
  },
  {
    id: "friends",
    title: "Friends",
    subtitle: "P2P TRANSFER",
    icon: Users,
    headline: "Pay back friends in any country.",
    description:
      "You send USDC, they receive local funds or cash-out through PeopleBank routes.",
    statLabel: "Fees",
    statValue: "P2P low",
    flow: ["Your Wallet", "Blip Network", "Friend’s Bank / Cash"],
  },
  {
    id: "transport",
    title: "Transport",
    subtitle: "RIDE SETTLEMENT",
    icon: Car,
    headline: "Settle rides without cards.",
    description:
      "From taxis to rentals, drivers get paid in their currency while you pay from your on-chain balance.",
    statLabel: "Ideal for",
    statValue: "Travel",
    flow: ["Wallet", "Blip", "Driver / Fleet"],
  },
];
const FLOW_STEPS = {
  restaurant: [
    {
      label: "Scan & pay",
      text: "Guests scan the table QR and approve a split payment from their own wallets.",
    },
    {
      label: "P2P trader fills order",
      text: "A PeopleBank trader accepts the payout leg on-chain through Blip.",
    },
    {
      label: "Restaurant gets payout",
      text: "Blip settles one clean local-currency payout to the restaurant account.",
    },
  ],
  cafe: [
    {
      label: "Tap or scan",
      text: "You tap or scan at the counter and approve a payment from your wallet.",
    },
    {
      label: "Blip routes value",
      text: "Blip finds a matching PeopleBank node to take the other side of the trade.",
    },
    {
      label: "Cafe receives",
      text: "The café sees a normal local settlement on their POS / bank account.",
    },
  ],
  default: [
    {
      label: "Pay from wallet",
      text: "You approve a payment in stablecoins or your chosen on-chain asset.",
    },
    {
      label: "P2P trader executes",
      text: "A PeopleBank trader locks their leg and confirms payout obligations.",
    },
    {
      label: "Receiver gets value",
      text: "They receive bank funds, cash or POS credit in their local currency.",
    },
  ],
};



const UsageCard = ({ scene, active, onClick }) => {
  const Icon = scene.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group w-full text-left rounded-2xl p-4 sm:p-5 mb-2
        border transition-all duration-200 flex items-start gap-3
        bg-black/40
        ${
          active
            ? "border-[#00FF94] shadow-[0_0_24px_rgba(0,255,148,0.25)]"
            : "border-white/5 hover:border-[#00FF94]/60 hover:shadow-[0_0_18px_rgba(0,255,148,0.18)]"
        }
      `}
    >
      <div
        className={`
          flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center
          ${
            active
              ? "border-[#00FF94]/70 bg-[#00FF94]/10 text-[#00FF94]"
              : "border-white/10 bg-black/70 text-gray-200 group-hover:border-[#00FF94]/70 group-hover:text-[#00FF94]"
          }
        `}
      >
        <Icon size={18} />
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              {scene.title}
            </h3>
            <p className="text-[10px] font-mono tracking-[0.18em] uppercase text-gray-500">
              {scene.subtitle}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end text-[10px] font-mono uppercase tracking-[0.16em] text-gray-500">
            <span>{scene.statLabel}</span>
            <span className="text-[#00FF94]">{scene.statValue}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          You pay in digital value. They receive instantly.
        </p>
      </div>
    </button>
  );
};

const LiveUsagePanel = ({ scene }) => {
  const steps = FLOW_STEPS[scene.id] || FLOW_STEPS.default;

  return (
    <div className="relative w-full h-full min-h-[280px] lg:min-h-[340px] rounded-[32px] border border-[#00FF94]/35 bg-[#050806] overflow-hidden shadow-[0_0_40px_rgba(0,255,148,0.25)]">
      {/* grid + glow */}
      <div
        className="absolute inset-0 opacity-18 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00FF9420 1px, transparent 1px), linear-gradient(to bottom, #00FF9420 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,148,0.18),transparent_60%)]" />

      <div className="relative z-10 flex flex-col h-full p-6 sm:p-7 lg:p-8 gap-5">
        {/* HEADER */}
        <div>
          <p className="text-[10px] font-mono tracking-[0.26em] uppercase text-[#00FF94] mb-2">
            EXAMPLE ROUTE
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
            {scene.headline}
          </h3>
          <p className="text-sm text-gray-300">{scene.description}</p>
        </div>

        {/* MAIN DIAGRAM CARD */}
        <div className="mt-1 rounded-3xl bg-black/75 border border-white/10 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            {/* NODE 1 – WALLET */}
            <div className="flex flex-col items-center gap-2 min-w-[80px]">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#03140b] border border-[#00FF94]/70 flex items-center justify-center shadow-[0_0_16px_rgba(0,255,148,0.45)]">
                  <Wallet className="w-4 h-4 text-[#00FF94]" />
                </div>
                <span className="absolute inset-0 rounded-full border border-[#00FF94]/30 blur-[3px]" />
              </div>
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-gray-300 text-center">
                Your Wallet
              </p>
            </div>

            {/* CONNECTOR 1 */}
            <div className="relative flex-1 h-10">
              <svg
                viewBox="0 0 100 20"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00FF94" stopOpacity="0" />
                    <stop offset="50%" stopColor="#00FF94" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00FF94" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,15 C30,0 70,0 100,15"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
              {/* animated dot */}
              <div className="absolute inset-0">
                <div className="route-dot animate-flow-dot" />
              </div>
            </div>

            {/* NODE 2 – BLIP / PEOPLEBANK */}
            <div className="flex flex-col items-center gap-2 min-w-[100px]">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-[#020d09] border border-[#00FF94] flex items-center justify-center shadow-[0_0_22px_rgba(0,255,148,0.6)]">
                  <Activity className="w-4 h-4 text-[#00FF94]" />
                </div>
                <span className="absolute inset-0 rounded-full border border-[#00FF94]/40 blur-[4px]" />
              </div>
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-gray-300 text-center">
                Blip · PeopleBank
              </p>
            </div>

            {/* CONNECTOR 2 */}
            <div className="relative flex-1 h-10">
              <svg
                viewBox="0 0 100 20"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 C30,20 70,20 100,5"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0">
                <div
                  className="route-dot animate-flow-dot"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>

            {/* NODE 3 – REAL WORLD */}
            <div className="flex flex-col items-center gap-2 min-w-[90px]">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#101010] border border-white/35 flex items-center justify-center shadow-[0_0_18px_rgba(0,0,0,0.9)]">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="absolute inset-0 rounded-full border border-white/20 blur-[3px]" />
              </div>
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.16em] text-gray-300 text-center">
                Real-world payout
              </p>
            </div>
          </div>

          {/* Caption row under diagram */}
          <div className="mt-4 flex justify-between text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">
            <span>Pay from wallet</span>
            <span>On-chain routing</span>
            <span>Merchant / receiver</span>
          </div>
        </div>

        {/* THREE STEP EXPLANATION */}
        <div className="grid sm:grid-cols-3 gap-3 text-[11px] sm:text-xs">
          {steps.map((step, i) => (
            <div
              key={step.label + i}
              className="rounded-2xl bg-black/70 border border-white/10 px-3 py-3 flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border border-[#00FF94]/60 text-[10px] font-mono text-[#00FF94] flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="uppercase tracking-[0.14em] text-gray-200">
                  {step.label}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-1 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-gray-500 pt-1">
          <span>Illustrative route for {scene.title}</span>
          <span>Protocol animation · Not live data</span>
        </div>
      </div>

      {/* keyframes + dot styling */}
      <style>
        {`
          .route-dot {
            position: absolute;
            top: 50%;
            left: 0;
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: #00FF94;
            box-shadow: 0 0 16px rgba(0,255,148,0.9);
            transform: translate(-10%, -50%);
          }

          @keyframes flowDot {
            0%   { transform: translate(-10%, -50%); opacity: 0; }
            10%  { opacity: 1; }
            90%  { opacity: 1; }
            100% { transform: translate(110%, -50%); opacity: 0; }
          }

          .animate-flow-dot {
            animation: flowDot 2.6s linear infinite;
          }
        `}
      </style>
    </div>
  );
};



const RealWorldUsageSection = () => {
  const [activeId, setActiveId] = useState("cafe");
  const activeScene =
    USAGE_SCENES.find((scene) => scene.id === activeId) ?? USAGE_SCENES[0];

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal delay={0}>
          <SectionLabel
            text="Real World Usage"
            className={"items-center justify-center"}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 sm:mb-10 mint-gradient-text tracking-tight text-center">
            Use crypto the same way
            <br />
            you use money.
          </h2>
        </ScrollReveal>

        {/* 40 / 60 split */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[2fr_3fr] items-stretch">
          {/* left: usage list */}
          <div className="grid grid-cols-1 gap-3 max-h-[460px] lg:max-h-none overflow-y-auto pr-1">
            {USAGE_SCENES.map((scene, idx) => (
              <ScrollReveal key={scene.id} delay={0.15 + idx * 0.05}>
                <UsageCard
                  scene={scene}
                  active={scene.id === activeId}
                  onClick={() => setActiveId(scene.id)}
                />
              </ScrollReveal>
            ))}
          </div>

          {/* right: live stats panel */}
          <ScrollReveal delay={0.25}>
            <motion.div
              key={activeScene.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex"
            >
              <LiveUsagePanel scene={activeScene} />
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};





const ParticleBackground = () => {
  const particles = Array.from({ length: 40 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#2BFF88]"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1000),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 1000),
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [null, Math.random() * -200],
            opacity: [0, 0.4, 0],
            scale: [0, Math.random() * 3 + 1, 0],
          }}
          transition={{
            duration: Math.random() * 7 + 7,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 7,
          }}
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            filter: "blur(1px)",
          }}
        />
      ))}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(43,255,136,0.05),transparent_75%)]" />
    </div>
  );
};

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/60 supports-[backdrop-filter]:bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88] relative z-10" />
            <div className="absolute inset-0 bg-[#2BFF88] rounded-full animate-ping opacity-50" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Blip.<span className="text-[#2BFF88]">money</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-8 text-sm font-medium text-gray-400">
            <a
              href="#protocol"
              className="hover:text-[#2BFF88] transition-colors"
            >
              Protocol
            </a>
            <a
              href="#merchants"
              className="hover:text-[#2BFF88] transition-colors"
            >
              Merchants
            </a>
            <a
              href="#peoplebank"
              className="hover:text-[#2BFF88] transition-colors"
            >
              PeopleBank
            </a>
            <a
              href="/tokenomics"
              className="hover:text-[#2BFF88] transition-colors"
            >
              Tokenomics
            </a>
          </div>
          <a href="/coming-soon">
            <button className="px-5 py-2 rounded-full border border-white/10 text-white text-sm hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all bg-black/50 backdrop-blur-sm group">
              <span className="group-hover:text-[#2BFF88] transition-colors">
                Open App
              </span>
            </button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-[#2BFF88] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10"
            >
              <div className="flex flex-col p-6 space-y-4">
                <a
                  href="#protocol"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2"
                >
                  Protocol
                </a>
                <a
                  href="#merchants"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2"
                >
                  Merchants
                </a>
                <a
                  href="#peoplebank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2"
                >
                  PeopleBank
                </a>
                <a
                  href="/tokenomics"
                  className="hover:text-[#2BFF88] transition-colors"
                >
                  Tokenomics
                </a>
                <a href="/coming-soon">
                  <button className="w-full px-5 py-3 rounded-full border border-white/10 text-white hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all bg-black/50 backdrop-blur-sm mt-2">
                    Open App
                  </button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const EarlyAdopterBanner = () => {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-gradient-to-r from-[#040810] via-[#05030A] to-[#12040F]">
      {/* background glows */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#00FF94]/18 blur-3xl" />
        <div className="absolute right-[-40px] top-0 h-72 w-72 rounded-full bg-[#00C8FF]/18 blur-3xl" />
        <div className="absolute bottom-[-60px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FACC15]/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid lg:grid-cols-[1.1fr_minmax(0,1fr)] gap-10 items-center">
        {/* Text block */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94] animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-gray-300">
              EARLY ADOPTER PROGRAM
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3">
            Claim your{" "}
            <span className="text-[#00FF94]">$100 early drop</span> when you
            join Blip.
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0">
            Register, connect your wallet and complete your first transfer.
            We reserve $100 worth of Blip Tokens for every verified early
            adopter.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start text-xs sm:text-sm text-gray-400">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94]" />
              New wallet registration
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94]" />
              First successful Blip transfer
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94]" />
              $100 drop unlocked
            </div>
          </div>
        </div>

        {/* Premium card */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            {/* outer glow */}
            <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-br from-[#00FF94]/35 via-[#00C8FF]/25 to-[#FACC15]/25 blur-2xl opacity-80" />

            <div className="relative rounded-[32px] bg-[radial-gradient(circle_at_top,_#071B13,_#05040B_55%,_#020308_100%)] border border-white/8 shadow-[0_28px_80px_rgba(0,0,0,0.9)] overflow-hidden">
              {/* subtle inner highlight */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/4 via-transparent to-black/60" />

              <div className="relative px-7 sm:px-8 pt-7 pb-6 space-y-6">
                {/* top row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-mono tracking-[0.28em] uppercase text-gray-400">
                      EARLY DROP BALANCE
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Reserved for you once requirements are completed.
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-2xl border border-[#00FF94]/50 bg-black/40 flex items-center justify-center text-[#00FF94] shadow-[0_0_18px_rgba(0,255,148,0.6)]">
                    <Gem size={18} />
                  </div>
                </div>

                {/* amount */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-semibold text-[#00FF94] leading-none">
                    $100
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-200">
                      in Blip Tokens
                    </span>
                    <span className="text-[11px] text-gray-500">
                      1x per user · limited supply
                    </span>
                  </div>
                </div>

                {/* progress bar style hint (fake) */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-gray-400 font-mono uppercase tracking-[0.16em]">
                    <span>Allocation filled</span>
                    <span className="text-[#00FF94]">72%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#00FF94] via-[#00C8FF] to-[#FACC15]" />
                  </div>
                </div>

                {/* buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button
                    primary
                    className="w-full sm:w-auto justify-center px-8 py-3 text-sm bg-[#00FF94] text-black hover:bg-[#0B9A4A]"
                  >
                    Become an Early Adopter
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <button className="w-full sm:w-auto px-8 py-3 rounded-full border border-white/25 text-xs sm:text-sm text-gray-100 hover:border-[#00FF94] hover:text-[#00FF94] bg-black/40 transition-all">
                    View eligibility details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const PulseWave = () => {
  return (
    <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 -z-10 pointer-events-none opacity-80 mix-blend-screen">
      <svg
        width="100%"
        height="500"
        viewBox="0 0 1440 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="20%" stopColor="#2BFF88" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#2BFF88" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#2BFF88" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="25" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M-100,280 C300,200 400,50 720,280 C1040,400 1140,250 1540,280"
          stroke="url(#pulseGradient)"
          strokeWidth="1"
          fill="none"
          filter="url(#strongGlow)"
          className="opacity-30"
        >
          <animate
            attributeName="opacity"
            values="0.3; 0.6; 0.3"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M-100,250 C300,250 400,100 720,250 C1040,400 1140,250 1540,250"
          stroke="url(#pulseGradient)"
          strokeWidth="10"
          fill="none"
          filter="url(#strongGlow)"
          className="opacity-80"
        />

        <circle r="5" fill="white" filter="url(#strongGlow)">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M-100,250 C300,250 400,100 720,250 C1040,400 1140,250 1540,250"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
          <animate
            attributeName="opacity"
            values="0; 1; 1; 0"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          r="12"
          stroke="#FFD43B"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        >
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M-100,250 C300,250 400,100 720,250 C1040,400 1140,250 1540,250"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
          <animate
            attributeName="r"
            values="8;18;8"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="720" cy="250" r="0" fill="#FF8B1A" opacity="0.8">
          <animate
            attributeName="r"
            values="0;60;0"
            dur="4s"
            begin="1.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur="4s"
            begin="1.8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

const PhoneMockup = () => (
  <div
    className="
      mt-20 md:mt-0 flex justify-center md:justify-end 
      animate-[phoneFloat_6s_ease-in-out_infinite]
    "
    style={{ perspective: "1800px" }}
  >
    <div className="relative">
      {/* NEON RIM LIGHT ON LEFT EDGE */}
    

      {/* OUTER GLOW AURA */}

      {/* PHONE + DEPTH SHADOWS */}
      <div
        className="
          relative w-60 h-[455px] rounded-[2rem] overflow-hidden bg-[#020a06]
          border border-white/5
        "
        style={{
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.7), 0 0 80px rgba(0,255,148,0.35), 0 0 2px rgba(255,255,255,0.08)",
        }}
      >
        {/* inner subtle border / bezel */}
        <div className="absolute inset-[3px] rounded-[1.8rem] bg-black overflow-hidden">
          <img
            src="home.png"
            alt="Blip.money app"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* SOFT REFLECTION BELOW (APPLE STYLE-ish) */}
      {/* SOFT REFLECTION */}


    </div>
  </div>
);




// const ArchitectureNode = ({
//   step,
//   title,
//   sub,
//   icon: Icon,
//   color,
//   className = "",
//   delay = 0,
//   isMain = false,
// }) => {
//   const shadowStyle = {
//     "--node-color": color,
//     animationDelay: `${delay}ms`,
//   };

//   const ringClass = isMain
//     ? `ring-4 ring-offset-4 ring-offset-[#080808] ring-[${color}]/30`
//     : "ring-2 ring-gray-700/50";
//   const bgColor = isMain ? "bg-[#0F0F0F]" : "bg-[#151515]";

//   return (
//     <div
//       className={`p-6 w-56 rounded-2xl border border-white/10 flex flex-col items-center text-center transition-all duration-500 ease-out hover:shadow-lg ${bgColor} ${className}`}
//       style={shadowStyle}
//     >
//       <div
//         className={`p-3 rounded-full ${bgColor} border border-white/10 mb-4 ${ringClass}`}
//       >
//         <Icon size={28} style={{ color }} />
//       </div>
//       <p className="text-sm font-medium text-gray-400 uppercase mb-1">
//         Step {step}
//       </p>
//       <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
//       <p className="text-xs text-gray-500">{sub}</p>
//     </div>
//   );
// };

// --- Main Application Component ---
const LiquidityEngineDiagram = () => {
  const gridBg = {
    backgroundImage: `
      radial-gradient(circle at 1px 1px, rgba(0,255,148,0.12) 1px, transparent 0),
      radial-gradient(circle at 1px 1px, rgba(0,255,148,0.06) 1px, transparent 0)
    `,
    backgroundSize: "40px 40px, 40px 40px",
    backgroundPosition: "0 0, 20px 20px",
  };

  return (
    <div
      data-animate-on-scroll
      className="relative h-96 rounded-2xl border border-[#00FF94]/30 bg-[#050807] overflow-hidden shadow-[0_0_40px_rgba(0,255,148,0.15)]"
      style={gridBg}
    >
      {/* local keyframes for spin */}
      <style>
        {`
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spinReverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes pulseCore {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.08); opacity: 1; }
          }
          @keyframes flowDot {
            0% { offset-distance: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
          }
        `}
      </style>

      {/* subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black opacity-80 pointer-events-none" />

      {/* CENTRAL ENGINE */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-40 h-40">
          {/* outer aura */}
          <div className="absolute inset-[-40%] rounded-full bg-[#00FF94]/15 blur-3xl" />

          {/* rotating outer ring */}
          <div
            className="absolute inset-[-14px] rounded-full border border-[#00FF94]/25"
            style={{ animation: "spinSlow 26s linear infinite" }}
          />

          {/* second ring */}
          <div
            className="absolute inset-3 rounded-full border border-[#00FF94]/35 border-dashed"
            style={{ animation: "spinReverse 18s linear infinite" }}
          />

          {/* inner glow disk */}
          <div className="absolute inset-5 rounded-full bg-gradient-to-br from-[#02130b] via-[#041f11] to-[#000000] shadow-[0_0_40px_rgba(0,255,148,0.35)]" />

          {/* core orb */}
          <div
            className="absolute inset-9 rounded-full bg-[#00FF94] flex items-center justify-center"
            style={{ animation: "pulseCore 3.5s ease-in-out infinite" }}
          >
            <div className="absolute inset-[2px] rounded-full bg-black" />
            <span className="relative text-[11px] text-center font-semibold tracking-[0.12em] text-[#00FF94]">
              LIQUIDITY
              <br />
              ENGINE
            </span>
          </div>
        </div>
      </div>

      {/* ORBIT LABELS */}
      {/* USER WALLET (top) */}
      <div className="absolute top-6 inset-x-0 flex justify-center">
        <div className="px-4 py-1.5 rounded-full bg-black/70 border border-[#00FF94]/40 text-[11px] font-mono tracking-[0.16em] text-[#00FF94] uppercase">
          User Wallets
        </div>
      </div>

      {/* ESCROW (left) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <div className="px-3 py-1.5 rounded-full bg-black/80 border border-[#00FF94]/30 text-[10px] font-mono tracking-[0.14em] text-gray-200 uppercase">
          Escrow
          <span className="text-[#00FF94] ml-1">Contracts</span>
        </div>
      </div>

      {/* ORDER MATCHING (right) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <div className="px-3 py-1.5 rounded-full bg-black/80 border border-[#00C8FF]/40 text-[10px] font-mono tracking-[0.14em] text-[#A7F5FF] uppercase">
          Matching
          <span className="ml-1 text-white/80">Engine</span>
        </div>
      </div>

      {/* PAYOUT CHANNELS (bottom) */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center">
        <div className="px-4 py-1.5 rounded-full bg-black/80 border border-white/30 text-[11px] font-mono tracking-[0.16em] text-white uppercase">
          Fiat & Cash Payout Channels
        </div>
      </div>

      {/* CONNECTION LINES (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="blipLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FF94" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#00FF94" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00C8FF" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* wallet → engine */}
        <line
          x1="50"
          y1="18"
          x2="50"
          y2="40"
          stroke="url(#blipLine)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeDasharray="1.2 2.4"
        />

        {/* escrow → engine */}
        <line
          x1="20"
          y1="50"
          x2="42"
          y2="50"
          stroke="url(#blipLine)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeDasharray="1.2 2.4"
        />

        {/* engine → matching */}
        <line
          x1="58"
          y1="50"
          x2="80"
          y2="50"
          stroke="url(#blipLine)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeDasharray="1.2 2.4"
        />

        {/* engine → payout */}
        <line
          x1="50"
          y1="60"
          x2="50"
          y2="82"
          stroke="url(#blipLine)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeDasharray="1.2 2.4"
        />
      </svg>
    </div>
  );
};

const styles = {
  gridBackground: {
    backgroundImage: `radial-gradient(circle, #333333 1px, transparent 1px), radial-gradient(circle, #333333 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
    backgroundPosition: "0 0, 20px 20px",
  },
};

const stylesPeopleBank = {
  gridBackground: {
    backgroundImage: `linear-gradient(to right, #00FF9422 1px, transparent 1px),
                      linear-gradient(to bottom, #00FF9422 1px, transparent 1px)`,
    backgroundSize: "20px 20px",
  },
};
const FeatureStrip = () => {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-gradient-to-r from-[#02151f] via-[#05030a] to-[#140313]">
      {/* soft glows */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-24 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[#00FF94]/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#00C8FF]/20 blur-3xl" />
        <div className="absolute bottom-[-40px] left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-[#C084FC]/18 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-gray-300 mb-2">
              WHY BLIP FEELS DIFFERENT
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Built for crypto users.  
              <span className="text-[#00FF94]">Not for banks.</span>
            </h2>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="inline-flex items-center gap-3 px-3 py-2 rounded-full bg-black/40 border border-white/15 text-[11px] font-mono uppercase tracking-[0.18em] text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94] animate-pulse" />
              LIVE P2P · NO CUSTODY · ON-CHAIN
            </div>
          </div>
        </div>

        {/* 3 feature columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Fast & final */}
          <div className="rounded-2xl bg-black/50 border border-white/10 p-5 sm:p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#00FF94]/10 flex items-center justify-center text-[#00FF94]">
                <Zap size={18} />
              </div>
              <p className="text-xs font-mono tracking-[0.16em] uppercase text-gray-400">
                Speed & Finality
              </p>
            </div>
            <p className="text-sm sm:text-base text-gray-200">
              Sub-second routing and settlement proofs on-chain. No “T+3.” No
              bank hours.
            </p>
          </div>

          {/* Private layer */}
          <div className="rounded-2xl bg-black/50 border border-white/10 p-5 sm:p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#00C8FF]/10 flex items-center justify-center text-[#00C8FF]">
                <ShieldCheck size={18} />
              </div>
              <p className="text-xs font-mono tracking-[0.16em] uppercase text-gray-400">
                Privacy by default
              </p>
            </div>
            <p className="text-sm sm:text-base text-gray-200">
              Wallet-only transfers for small tickets. Your personal identity
              stays off the wire.
            </p>
          </div>

          {/* P2P liquidity */}
          <div className="rounded-2xl bg-black/50 border border-white/10 p-5 sm:p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#C084FC]/15 flex items-center justify-center text-[#C084FC]">
                <Layers size={18} />
              </div>
              <p className="text-xs font-mono tracking-[0.16em] uppercase text-gray-400">
                PeopleBank Liquidity
              </p>
            </div>
            <p className="text-sm sm:text-base text-gray-200">
              Human nodes route value across borders and earn Blip Tokens for
              every order they take.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const CashbackBanner = () => {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-gradient-to-r from-[#041520] via-[#020c08] to-[#150418]">
      {/* soft glows */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-32 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#00FF94]/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#00C8FF]/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#FFD43B]/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-between">
        {/* Left copy */}
        <div className="text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94] animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-gray-300">
              LAUNCH REWARD · LIMITED TIME
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight mb-2">
            Get <span className="text-[#00FF94] font-bold">100% cashback</span> on your transfer.
          </h2>

          <p className="text-sm sm:text-base text-gray-300">
            Early Blip users earn boosted rewards on all successful payments.
            No tiers, no games — just more value every time you move money.
          </p>
        </div>

        {/* Right stats / CTA pill */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-black/60 border border-[#00FF94]/30 min-w-[210px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono tracking-[0.18em] text-gray-400 uppercase">
                Cashback Rate
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00FF94]/10 text-[#00FF94] font-mono uppercase tracking-[0.18em]">
                x2 launch
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-[#00FF94]">
                5%
              </span>
              <span className="text-xs text-gray-400">in Blip Tokens</span>
            </div>
          </div>

          <Button
            primary
            className="w-full sm:w-auto px-8 py-3 text-sm sm:text-base bg-[#00FF94] text-black hover:bg-[#0B9A4A]"
          >
            Claim Early Rewards
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">


    <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center relative z-10">

      {/* LEFT SIDE CONTENT */}
      <div className="text-center lg:text-left pt-6 sm:pt-8 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* SMALL BADGE */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#FFD43B]/20 bg-[#FFD43B]/5 backdrop-blur-sm mb-6 hover:bg-[#FFD43B]/10 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD43B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD43B]"></span>
            </span>
            <span className="text-[10px] font-bold text-[#FFD43B] uppercase tracking-wider">
              Private On-Chain Payments.
            </span>
          </div>

          {/* MAIN HEADING — YOUR ORIGINAL VERSION */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[0.95] mb-6 tracking-tight">
            Pay with Crypto  
            <br />
            Anyone, Anywhere —  
            <br />
            <span className="text-[#2BFF88]">In a Blip.</span>
          </h1>

          {/* SUBTEXT */}
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
            Instant global transfers powered by the decentralized{" "}
            <span className="text-white font-medium">Blip Protocol</span>.  
            Crypto native. P2P. Non-custodial.
          </p>

          {/* FEATURE PILLS */}
          <div className="flex flex-wrap gap-3 mt-6 max-w-md lg:max-w-lg mx-auto lg:mx-0">
            <div className="px-4 py-2 rounded-full bg-black/40 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2BFF88]"></span>
              <span className="text-sm text-gray-300">Send to local bank accounts</span>
            </div>

            <div className="px-4 py-2 rounded-full bg-black/40 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2BFF88]"></span>
              <span className="text-sm text-gray-300">Cash out to physical cash</span>
            </div>

            <div className="px-4 py-2 rounded-full bg-black/40 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2BFF88]"></span>
              <span className="text-sm text-gray-300">Pay merchants instantly</span>
            </div>

            <div className="px-4 py-2 rounded-full bg-black/40 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2BFF88]"></span>
              <span className="text-sm text-gray-300">Cross-border P2P settlements</span>
            </div>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8 justify-center lg:justify-start">
            <Link to="#">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#2BFF88] text-black font-bold text-lg hover:shadow-[0_0_40px_rgba(43,255,136,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                Open App{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-2">
              <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent ml-0.5"></div>
              </div>
              How Blip Works
            </button>
          </div>

        </motion.div>
      </div>

      {/* RIGHT SIDE — PHONE */}
      <div className="
  flex justify-center items-center relative 
  translate-x-4 md:translate-x-8 
  scale-[1.25] md:scale-[1.35] lg:scale-[1.4] xl:scale-[1.45] 
  origin-center
">
  <div className="absolute inset-0 bg-gradient-to-tr from-[#2BFF88]/15 to-transparent blur-3xl rounded-full" />
  <PhoneMockup />
</div>



    </div>
  </section>
);





const CinematicCard = ({ title, subtitle, icon: Icon, delay, active }) => (
  <div
    className={`
      relative group h-60 overflow-hidden rounded-2xl bg-[#080808] border transition-all duration-500 flex flex-col justify-between p-8
      ${
        active
          ? "border-[#00FF94] shadow-[0_0_30px_rgba(0,255,148,0.15)]"
          : "border-white/5 hover:border-[#00FF94] hover:shadow-[0_0_30px_rgba(0,255,148,0.15)]"
      }
    `}
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Background Glow */}
    <div
      className={`absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${
        active ? "opacity-100" : "group-hover:opacity-100"
      }`}
    />

    {/* Top Row: Icon and Badge */}
    <div className="relative z-10 flex justify-between items-start">
      <div
        className={`
        w-12 h-12 rounded-xl bg-[#111] border flex items-center justify-center transition-all duration-300
        ${
          active
            ? "text-[#00FF94] border-[#00FF94] shadow-[0_0_15px_rgba(0,255,148,0.3)]"
            : "text-white border-white/10 group-hover:text-[#00FF94] group-hover:border-[#00FF94] group-hover:shadow-[0_0_15px_rgba(0,255,148,0.3)]"
        }
      `}
      >
        <Icon size={20} />
      </div>

      <div
        className={`
        px-3 py-1 rounded bg-[#00FF94]/10 border border-[#00FF94]/30 text-[#00FF94] text-[10px] font-mono font-bold tracking-widest uppercase transition-opacity duration-300
        ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
      `}
      >
        Settlement: 40ms
      </div>
    </div>

    {/* Bottom Row: Content */}
    <div className="relative z-10">
      <h3 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
        {title}
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <div
          className={`h-[1px] w-6 transition-colors duration-300 ${
            active ? "bg-[#00FF94]" : "bg-gray-600 group-hover:bg-[#00FF94]"
          }`}
        />
        <span
          className={`text-xs font-mono font-bold uppercase tracking-widest transition-colors duration-300 ${
            active
              ? "text-[#00FF94]"
              : "text-gray-500 group-hover:text-[#00FF94]"
          }`}
        >
          {subtitle}
        </span>
      </div>

      <p className="text-sm text-gray-500 font-light leading-relaxed">
        You pay in digital value.
        <br />
        They receive instantly.
      </p>
    </div>
  </div>
);

const INITIAL_NODES = Array.from({ length: 30 }).map(() => ({
  top: `${Math.random() * 80 + 10}%`,
  left: `${Math.random() * 80 + 10}%`,
  animationDuration: `${Math.random() * 2 + 1}s`,
  animationDelay: `-${Math.random() * 2}s`,
}));

const Index = () => {
  // Initialize scroll active hook
  useScrollActive("hero");
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const pathPositions = [15, 32, 50, 68, 85];
  // Optional: Add a subtle movement to the nodes over time for more dynamism
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          // Apply small random shift
          top: `${Math.min(
            90,
            Math.max(10, parseFloat(node.top) + (Math.random() - 0.5) * 0.5)
          )}%`,
          left: `${Math.min(
            90,
            Math.max(10, parseFloat(node.left) + (Math.random() - 0.5) * 0.5)
          )}%`,
        }))
      );
    }, 3000); // Shift every 3 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className="min-h-screen   bg-black text-white font-sans selection:bg-[#2BFF88] selection:text-black overflow-x-hidden overflow-y-hidden scrollbar-hide"
      style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}
    >
      <Navbar />
      <Hero />
      <CashbackBanner />

      <SocialSidebar />

      {/* <!-- 2. THE PROBLEM SECTION (Scroll-Reveal Timeline) -->
        <!-- -------------------------------------- --> */}
      <section id="the-problem" className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-24">
          <SectionLabel
            text="Global
Payments"
            className={"items-center justify-center"}
          />
          <h2 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-bold mb-8 mint-gradient-text tracking-tight text-center">
            The Problem: Why Global Payments
            <br />
            Are Broken Today
          </h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="timeline-line"></div>

          <div className="space-y-30">
            <div className="relative flex justify-start items-center group">
              <div className="w-1/2 pr-16 text-right opacity-100 transition-all duration-500">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-3 relative inline-block">
                  High Fees.
                  <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-mint-gradient-bg opacity-30 group-hover:opacity-100 transition-opacity duration-300"></span>
                </h3>
                <p className="text-lg text-gray-400">
                  Traditional banking and legacy systems impose excessive,
                  hidden costs on cross-border transactions.
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-black border-2 border-mint-gradient-bg neon-glow-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <span className="text-sm font-bold text-mint-secondary">I</span>
              </div>
            </div>

            <div className="relative flex justify-end items-center group">
              <div className="w-1/2 pl-16 text-left opacity-100 transition-all duration-500">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-3 relative inline-block">
                  Slow Settlement Times.
                  <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-mint-gradient-bg opacity-30 group-hover:opacity-100 transition-opacity duration-300"></span>
                </h3>
                <p className="text-lg text-gray-400">
                  Settlements often take days, crippling cash flow for
                  businesses and individuals.
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-black border-2 border-mint-gradient-bg neon-glow-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <span className="text-sm font-bold text-mint-secondary">
                  II
                </span>
              </div>
            </div>

            <div className="relative flex justify-start items-center group">
              <div className="w-1/2 pr-16 text-right opacity-100 transition-all duration-500">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-3 relative inline-block">
                  Lack of Privacy.
                  <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-mint-gradient-bg opacity-30 group-hover:opacity-100 transition-opacity duration-300"></span>
                </h3>
                <p className="text-lg text-gray-400">
                  Every transaction exposes sensitive data to multiple, often
                  untrustworthy, intermediaries.
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-black border-2 border-mint-gradient-bg neon-glow-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <span className="text-sm font-bold text-mint-secondary">
                  III
                </span>
              </div>
            </div>

            <div className="relative flex justify-end items-center group">
              <div className="w-1/2 pl-16 text-left opacity-100 transition-all duration-500">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-3 relative inline-block">
                  Opaque Intermediaries.
                  <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-mint-gradient-bg opacity-30 group-hover:opacity-100 transition-opacity duration-300"></span>
                </h3>
                <p className="text-lg text-gray-400">
                  The current system is controlled by centralized entities
                  lacking transparent accountability.
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-black border-2 border-mint-gradient-bg neon-glow-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <span className="text-sm font-bold text-mint-secondary">
                  IV
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*
    
        <!-- 3. THE PROTOCOL SECTION (Cinematic Diagram) -->
        <!-- -------------------------------------- --> */}
  <section
  id="protocol-section"
  className="py-40 overflow-hidden bg-[#000000]"
>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
    {/* Text Block (Left) */}
    <div className="lg:sticky lg:top-1/4">
      <SectionLabel
        text="The Global Settlement Layer"
        className={"items-center justify-start"}
      />
      <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 mint-gradient-text tracking-tight text-left">
        Blip Protocol: The Global Settlement Layer
      </h2>
      <p className="text-lg text-gray-400">
        Blip is a decentralized, open-source protocol built for instant,
        low-cost global value transfer, leveraging Zero-Knowledge proofs
        for privacy and Solana&apos;s speed for scalability. It&apos;s the new
        financial infrastructure the world needs.
      </p>
      <button className="bg-black/80 backdrop-blur border border-[#00FF94]/30 text-white hover:text-[#00FF94] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider my-4 hover:shadow-[0_0_1px_#00FF94] transition-all duration-300">
        Explore Whitepaper
      </button>
    </div>

    {/* Protocol Diagram — Liquidity Engine */}
    <LiquidityEngineDiagram />
  </div>
</section>
      <FeatureStrip />


      {/* <!-- SECTION 3: HOW IT WORKS (3 STEPS - STRIPE VIBE) --> */}
      <section id="how-it-works" className="py-32 border-t border-gray-900 bg-black">
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <SectionLabel
      text="Real-World Value"
      className="items-center justify-center"
    />

    <h2
      data-animate-on-scroll
      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 mint-gradient-text tracking-tight text-center"
    >
      How Blip Works
      <span className="block text-base md:text-lg font-normal text-gray-400 mt-3">
        One on-chain flow. Three simple steps.
      </span>
    </h2>

    {/* STEP STRIP */}
    <div className="mt-12 relative">
      {/* glowing line behind steps */}
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* STEP 1 */}
        <div
          data-animate-on-scroll
          className="relative rounded-2xl bg-[#050505] border border-white/5 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500 p-8"
        >
          {/* step badge */}
          <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-black border border-[#00FF94]/60 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,148,0.5)]">
            <span className="text-xs font-mono tracking-[0.2em] text-[#00FF94]">
              01
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-white flex items-center gap-2">
            <span className="text-2xl text-[#00FF94]">⌲</span>
            Create a payment from your wallet.
          </h3>
          <p className="text-sm md:text-base text-gray-400 mb-3">
            Choose how they receive:{" "}
            <span className="text-gray-200">
              local bank, wire, cash pickup, or goods.
            </span>
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            The crypto is locked into an on-chain escrow contract, ready to be
            matched.
          </p>
        </div>

        {/* STEP 2 */}
        <div
          data-animate-on-scroll
          className="relative rounded-2xl bg-[#050505] border border-white/5 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500 p-8"
        >
          <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-black border border-[#00FF94]/60 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,148,0.5)]">
            <span className="text-xs font-mono tracking-[0.2em] text-[#00FF94]">
              02
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-white flex items-center gap-2">
            <span className="text-2xl text-[#00FF94]">🤝</span>
            Merchants compete to fulfill it.
          </h3>
          <p className="text-sm md:text-base text-gray-400 mb-3">
            The{" "}
            <span className="text-gray-200">Blip Merchant Network</span> bids to
            take your order, routing it through the best available liquidity.
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            Matching, pricing and routing all happen on-chain via the Blip
            Protocol.
          </p>
        </div>

        {/* STEP 3 */}
        <div
          data-animate-on-scroll
          className="relative rounded-2xl bg-[#050505] border border-white/5 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500 p-8"
        >
          <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-black border border-[#00FF94]/60 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,148,0.5)]">
            <span className="text-xs font-mono tracking-[0.2em] text-[#00FF94]">
              03
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-white flex items-center gap-2">
            <span className="text-2xl text-[#00FF94]">✓</span>
            Receiver gets real-world value.
          </h3>
          <p className="text-sm md:text-base text-gray-400 mb-3">
            They receive{" "}
            <span className="text-gray-200">
              bank funds, cash, or goods in minutes
            </span>{" "}
            while you stay fully crypto-native.
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            Settlement proof hits chain, escrow releases, and the transfer is
            finalized forever.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>



      {/* --- SECTION 4: REAL WORLD USAGE --- */}

      <RealWorldUsageSection />


      {/* <!-- SECTION 7: PRIVACY & TRUST (TWO-COLUMN MINIMAL) --> */}
      <section className="py-32 border-t border-gray-900 bg-black">
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
    <SectionLabel
      text="Privacy by Design"
      className="items-center justify-center"
    />

    <h2
      data-animate-on-scroll
      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-10 mint-gradient-text tracking-tight text-center"
    >
      Privacy by Design.{" "}
      <span className="block">Trust by Protocol.</span>
    </h2>

    {/* big split card */}
    <div
      data-animate-on-scroll
      className="relative rounded-3xl bg-[#050505] border border-[#00FF94]/30 shadow-[0_0_60px_rgba(0,255,148,0.15)] overflow-hidden"
    >
      {/* faint grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00FF9422 1px, transparent 1px), linear-gradient(to bottom, #00FF9422 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#00FF94]/10">
        {/* LEFT: PRIVACY */}
        <div className="p-8 sm:p-10 lg:p-12">
          <p className="text-xs font-mono tracking-[0.25em] text-[#00FF94] uppercase mb-3">
            PRIVACY LAYER
          </p>
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Use Blip with your wallet.
            <br />
            Not your identity.
          </h3>

          <ul className="space-y-4 text-sm md:text-base text-gray-300">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#00FF94] shadow-[0_0_10px_rgba(0,255,148,0.8)]" />
              <span>
                Wallet-based identity:{" "}
                <span className="text-white">
                  your address is your ID, decoupled from personal data.
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#00FF94]" />
              <span>
                No personal info required for small transfers, keeping everyday
                payments private.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#00FF94]" />
              <span>
                End-to-end private transaction construction with encrypted
                order data.
              </span>
            </li>
          </ul>
        </div>

        {/* RIGHT: TRUST */}
        <div className="p-8 sm:p-10 lg:p-12 bg-gradient-to-br from-[#00FF9410] via-transparent to-black">
          <p className="text-xs font-mono tracking-[0.25em] text-[#00FF94] uppercase mb-3">
            ON-CHAIN TRUST
          </p>
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Everything verifiable.
            <br />
            Nothing custodial.
          </h3>

          <ul className="space-y-4 text-sm md:text-base text-gray-300">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-[#00FF94] text-xl">✓</span>
              <span>
                Orders, matching and settlement events are{" "}
                <span className="text-white">recorded on-chain</span> for anyone
                to verify.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-[#00FF94] text-xl">✓</span>
              <span>
                Settlement proofs guarantee that{" "}
                <span className="text-white">real-world payout actually
                happened</span> before funds are released.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-[#00FF94] text-xl">✓</span>
              <span>
                Immutable audit trail of every transfer, dispute and merchant
                action across the network.
              </span>
            </li>
          </ul>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#00FF94]/40 bg-black/40 px-4 py-2 text-xs font-mono uppercase tracking-[0.18em] text-gray-300">
            <span className="h-2 w-2 rounded-full bg-[#00FF94] animate-pulse" />
            Protocol, not promises.
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<EarlyAdopterBanner />

      {/* --- SECTION 5: MERCHANTS --- */}
      <section
        id="merchants"
        className="py-16 sm:py-24 md:py-32 bg-[#050505] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center">
          <ScrollReveal delay={0} className="order-2 lg:order-1">
            <div className="bg-[#080808] rounded-xl border border-white/10 shadow-2xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF94] to-blue-600 rounded-xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-[#0A0A0A] rounded-xl overflow-hidden p-1">
                <div className="bg-[#111] px-4 py-3 border-b border-white/5 flex justify-between items-center">
                  <div className="text-xs font-mono text-gray-500">
                    BLIP MERCHANT TERMINAL
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-[#111] rounded border border-white/5">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">
                        Total Volume (24h)
                      </div>
                      <div className="text-xl font-mono text-white">
                        $42,921.50
                      </div>
                    </div>
                    <div className="p-4 bg-[#00FF94]/5 rounded border border-[#00FF94]/20">
                      <div className="text-[10px] text-[#00FF94] uppercase mb-1">
                        Rewards Earned
                      </div>
                      <div className="text-xl font-mono text-[#00FF94]">
                        +2.5%
                      </div>
                    </div>
                  </div>
                  <div className="h-32 flex items-end justify-between gap-1 mb-6 px-1">
                    {[30, 45, 35, 60, 50, 75, 65, 90, 80, 55, 70, 40].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="w-full bg-[#1A1A1A] hover:bg-[#00FF94] transition-colors rounded-t-sm"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                  <div className="text-xs font-mono text-gray-600 border-t border-white/5 pt-4 flex justify-between">
                    <span>NETWORK RATING</span>
                    <span className="text-white">TIER 1 (TRUSTED)</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="order-1 lg:order-2">
            <SectionLabel text="Merchants" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Accept crypto.
              <br />
              Receive value instantly.
              <br />
              No risk.
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              You don't need crypto knowledge — payments settle instantly into
              stable value.
            </p>
            <div className="flex items-center gap-4 p-4 border border-[#00FF94]/30 bg-[#00FF94]/5 rounded-lg mb-8">
              <Gem className="text-[#00FF94]" />
              <span className="text-[#00FF94] font-bold">
                Earn up to 2.5% in Blip Tokens on every transaction.
              </span>
            </div>
            {/* <Button>Create Business Account</Button> */}
          </ScrollReveal>
        </div>
      </section>

      {/* --- SECTION 6: PREMIUM REWARDS --- */}
      <section className="py-16 sm:py-24 md:py-32 lg:py-40 relative bg-[#020202] overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-[#00FF94]/5 to-transparent opacity-50" />
        <div
          style={styles.gridBackground}
          className="absolute inset-0 opacity-20 pointer-events-none"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-10 sm:gap-16 lg:gap-20">
          {/* LEFT SIDE — TEXT */}
          <div className="flex-1 text-left">
            <SectionLabel text="Incentives & Early Access" />

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 text-white tracking-tight">
              Get rewarded every <br /> time you spend.
            </h2>

            <p className="text-xl text-gray-400 mb-10 max-w-lg">
              Earn up to 2.5% in Blip Tokens on every payment — plus early
              supporter airdrops.
            </p>

            <div className="flex flex-col gap-4 max-w-xs">
              <button className="bg-black/80 backdrop-blur border border-[#00FF94]/30 text-[#00FF94] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#00FF94] hover:text-black hover:shadow-[0_0_30px_#00FF94] transition-all duration-300">
                Join Early Supporters
              </button>

              <button className="bg-black/80 backdrop-blur border border-white/20 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300">
                Join the Waitlist
              </button>

              <button className="bg-black/80 backdrop-blur border border-white/20 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300">
                Get Airdrop Access
              </button>
            </div>
          </div>

          {/* RIGHT SIDE — IMAGE / ANIMATION */}
          <div className="flex-1 relative w-[450px] h-[450px] hidden md:block">
            <div className="absolute inset-0 w-full h-full rounded-full border border-dashed border-[#00FF94]/10 animate-[spin_60s_linear_infinite]" />

            <div className="absolute inset-0 w-[300px] h-[300px] m-auto rounded-full border border-[#00FF94]/20 animate-[spin_40s_linear_infinite_reverse]" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-40 h-40 group cursor-pointer">
                <div className="absolute inset-0 bg-[#00FF94] rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#111] to-black border-[6px] border-[#0A0A0A] flex items-center justify-center relative shadow-[0_0_60px_rgba(0,255,148,0.3)] animate-[spin_10s_linear_infinite]">
                  <div className="absolute inset-1 rounded-full border border-[#00FF94]/40" />
                  <div className="absolute inset-3 rounded-full border border-dashed border-[#00FF94]/20" />
                  <span className="text-6xl font-black text-[#00FF94] italic">
                    B
                  </span>
                </div>

                <div className="absolute -inset-1 rounded-full border border-[#00FF94]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              </div>

              <div className="absolute bottom-[-50px] text-xs font-mono text-[#00FF94] uppercase tracking-widest opacity-80">
                Early users earn higher rewards
              </div>
            </div>

            {/* Floating Buttons */}
            {/* <div className="absolute inset-0 animate-[orbit_30s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 animate-[counterOrbit_30s_linear_infinite]">
                <button className="bg-black/80 backdrop-blur border border-[#00FF94]/30 text-[#00FF94] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#00FF94] hover:text-black transition-all duration-300">
                  Join Early Supporters
                </button>
              </div>

              <div className="absolute bottom-[15%] right-[10%] animate-[counterOrbit_30s_linear_infinite]">
                <button className="bg-black/80 backdrop-blur border border-white/20 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300">
                  Join the Waitlist
                </button>
              </div>

              <div className="absolute bottom-[15%] left-[10%] animate-[counterOrbit_30s_linear_infinite]">
                <button className="bg-black/80 backdrop-blur border border-white/20 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300">
                  Get Airdrop Access
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* --- SECTION 7: PEOPLEBANK --- */}
      <>
        {" "}
        <style>
          {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.2);
            }
          }
          @keyframes flow-animation {
            to {
              /* Animates the dash pattern offset, simulating movement */
              stroke-dashoffset: 0;
            }
          }
        `}
        </style>
        <section
  id="peoplebank"
  className="relative py-16 md:py-32 border-t border-white/5 overflow-hidden
             bg-gradient-to-br from-[#020813] via-[#030608] to-[#0a030d]"
>

<div className="pointer-events-none absolute inset-0 opacity-70">
    <div className="absolute -top-24 left-1/4 w-72 h-72 rounded-full bg-[#00C8FF]/18 blur-3xl" />
    <div className="absolute -bottom-32 right-0 w-80 h-80 rounded-full bg-[#00FF94]/20 blur-3xl" />
    <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full bg-[#7C3AED]/16 blur-3xl" />
  </div>

          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20">
            {/* Left Content Area */}
            <div>
              <SectionLabel text="The Network" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 tracking-light">
                A decentralized human-powered liquidity network.
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                PeopleBank is the network that powers real-time settlement.
                Anyone can provide liquidity, route payments, and earn Blip
                Tokens for supporting global value transfer.
              </p>
              <div className="space-y-6">
                {[
                  "Liquidity providers join PeopleBank",
                  "They lock value in non-custodial channels",
                  "Blip routes P2P payments through available liquidity",
                  "Providers earn rewards",
                  "Everything is on-chain and transparent",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 text-gray-300">
                    <div className="flex-shrink-0 w-6 h-6 rounded bg-[#111] border border-[#00FF94]/20 flex items-center justify-center text-[#00FF94] text-xs font-bold">
                      {i + 1}
                    </div>
                    <p className="pt-0.5">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Live Routing Visualization */}
            <div className="relative bg-[#080808] rounded-2xl border border-white/5 p-8 flex items-center justify-center overflow-hidden min-h-[400px]">
              <div
                style={stylesPeopleBank.gridBackground}
                className="absolute inset-0 opacity-10"
              />
              {/* Network Container (Aspect Ratio fixed to square) */}
              <div className="relative w-full aspect-square max-w-md">
                {/* Animated Nodes (Dots) */}
                {nodes.map((node, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-[#00FF94] rounded-full shadow-[0_0_10px_#00FF94] transition-all duration-300 ease-in-out"
                    style={{
                      top: node.top,
                      left: node.left,
                      animation: `pulse ${node.animationDuration} infinite`,
                    }}
                  />
                ))}

                {/* Animated Connecting Lines (SVG Paths) */}
                <svg
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
                >
                  {/* Path 1: Longer, Curvier Route */}
                  <path
                    d="M50,50 Q150,150 250,50 T350,250"
                    fill="none"
                    stroke="#00FF94"
                    strokeWidth="2"
                    // Animation Setup for Flow
                    strokeDasharray="10 10" // Dash/Gap length
                    style={{
                      strokeDashoffset: "20", // Start offset (must be larger than dash array total)
                      animation: "flow-animation 4s linear infinite",
                    }}
                  />

                  {/* Path 2: Shorter, Direct Route */}
                  <path
                    d="M100,300 Q200,200 300,300"
                    fill="none"
                    stroke="#00FF94"
                    strokeWidth="1"
                    // Animation Setup for Flow
                    strokeDasharray="5 5"
                    style={{
                      strokeDashoffset: "10",
                      animation: "flow-animation 2s linear infinite reverse", // Reverse for variety
                    }}
                  />

                  {/* Path 3: Diagonal Route */}
                  <path
                    d="M300,50 L50,350"
                    fill="none"
                    stroke="#00FF94"
                    strokeWidth="1.5"
                    // Animation Setup for Flow
                    strokeDasharray="8 8"
                    style={{
                      strokeDashoffset: "16",
                      animation: "flow-animation 3s linear infinite",
                      filter: "drop-shadow(0 0 2px #00FF94)", // Add subtle glow to path
                    }}
                  />
                </svg>

                {/* LIVE ROUTING label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-sm font-mono text-[#00FF94] bg-black/70 px-4 py-2 rounded-full border border-[#00FF94]/50 shadow-xl shadow-black/50">
                    LIVE ROUTING
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>

      {/* SECTION 9: TOKEN UTILITY (SIMPLE GRID) */}
      <section className="py-32 border-t border-gray-900 container mx-auto px-4">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel
            text="Protocol Token Utility"
            className="items-center justify-center"
          />
          <h2
            data-animate-on-scroll
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 sm:mb-12 md:mb-16 tracking-tight text-center"
          >
            Protocol Token Utility
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 max-w-7xl mx-auto">
            {/* Merchant Staking */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
            >
              <div className="text-2xl text-neon-green mb-2 transition duration-300 group-hover:text-cyan">
                ◆
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Merchant Staking
              </p>
            </div>

            {/* Routing Priority */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "50ms" }}
            >
              <div className="text-2xl text-cyan mb-2 transition duration-300 group-hover:text-neon-green">
                ➤
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Routing Priority
              </p>
            </div>

            {/* Liquidity Rewards */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "100ms" }}
            >
              <div className="text-2xl text-purple-400 mb-2 transition duration-300 group-hover:text-cyan">
                ◉
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Liquidity Rewards
              </p>
            </div>

            {/* Dispute Slashing */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "150ms" }}
            >
              <div className="text-2xl text-red-400 mb-2 transition duration-300 group-hover:text-cyan">
                ⚔
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Dispute Slashing
              </p>
            </div>

            {/* Governance */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "200ms" }}
            >
              <div className="text-2xl text-yellow-300 mb-2 transition duration-300 group-hover:text-cyan">
                ⚖
              </div>
              <p className="text-sm font-semibold text-gray-300">Governance</p>
            </div>

            {/* Fee Reductions */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "250ms" }}
            >
              <div className="text-2xl text-green-300 mb-2 transition duration-300 group-hover:text-cyan">
                ⬉
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Fee Reductions
              </p>
            </div>

            {/* Marketplace Promotions */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "300ms" }}
            >
              <div className="text-2xl text-pink-400 mb-2 transition duration-300 group-hover:text-cyan">
                ✦
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Marketplace Promotions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 9: FINAL HERO --- */}
      <section className="py-20 sm:py-28 md:py-36 lg:py-40 relative flex items-center justify-center overflow-hidden bg-black text-center border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00FF94]/5 via-black to-black" />
        <div className="relative z-10 max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 tracking-tight">
            A new payment layer
            <br />
            for the real world.
          </h2>
          <div className="flex px-6 justify-center gap-2 text-gray-500 font-mono text-sm mb-12 uppercase tracking-widest">
            <span>Instant</span>•<span>Bankless</span>•<span>Borderless</span>•
            <span>P2P</span>
          </div>
          <a href="https://t.me/+Pi3Ijs3Q5-ZjZTAx" target="_blank">
            <Button
              primary
              className="text-lg px-12 py-5 shadow-[0_0_50px_rgba(0,255,148,0.2)] hover:shadow-[0_0_80px_rgba(0,255,148,0.4)] transform hover:scale-105"
            >
              Join Early Access
            </Button>
          </a>
        </div>
        <div className="absolute bottom-[-40vh] left-1/2 -translate-x-1/2 w-[150vw] h-[80vh] bg-[#00FF94]/5 rounded-[100%] blur-[120px] pointer-events-none" />
      </section>
      {/* section 10 */}
      <section className="py-16 sm:py-20 md:py-24 text-center border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111] to-black opacity-50" />
        <div className="relative z-10 px-4 sm:px-6">
          <h2 className="text-xl sm:text-1xl md:text-1xl lg:text-2xl xl:text-3xl font-bold text-white mb-6 sm:mb-8">
            Coming soon in 12 Countries
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-2xl mx-auto">
            {[
              "UAE",
              "India",
              "Philippines",
              "Brazil",
              "Nigeria",
              "Vietnam",
            ].map((country) => (
              <div
                key={country}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm text-gray-300 flex items-center gap-1.5 sm:gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#2BFF88] animate-pulse" />
                {country}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <!-- Footer --> */}
      <footer className="py-12 border-t border-gray-900 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>
            &copy; <span id="year">2025</span> Blip.money Protocol. All rights
            reserved. Bankless. Trustless. Instant. Secure and fully
            trustworthy.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
