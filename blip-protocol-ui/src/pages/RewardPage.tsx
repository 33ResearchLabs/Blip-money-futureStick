import React, { useState, useEffect } from "react";
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
  Plane,
  ShoppingBag,
  Coffee,
  Database,
  Smartphone,
  Layers,
  BarChart3,
} from "lucide-react";

const IMAGES = {
  heroGlobe:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format",
  fiberOptics:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format",
  whitePattern:
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format",
  infrastructure:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format",
  networkNodes:
    "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format",
};

const SectionLabel = ({
  children,
  color = "text-gray-500",
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <span
    className={`text-[11px] font-bold uppercase tracking-[0.3em] ${color} block mb-6`}
  >
    {children}
  </span>
);

const BrandButton = ({
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
      "bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    secondary:
      "bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/10",
    link: "text-[#ffb088] hover:text-[#ff8c5a] px-0 py-0 font-medium",
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
  overlayOpacity = "opacity-40",
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  dark?: boolean;
  overlayOpacity?: string;
}) => (
  <div
    className={`relative overflow-hidden rounded-[3rem] group border border-white/5 shadow-2xl ${dark ? "bg-[#0a0a0b]" : "bg-white text-black"} ${className}`}
  >
    {image && (
      <>
        <img
          src={image}
          alt={title || "Tech Visual"}
          className={`absolute inset-0 w-full h-full object-cover ${overlayOpacity} group-hover:scale-105 transition-transform duration-1000 ease-out`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${dark ? "from-black via-black/80" : "from-white via-white/40"} to-transparent opacity-100 transition-opacity`}
        />
      </>
    )}
    <div className="relative z-10 p-12 h-full flex flex-col">
      {title && (
        <h3
          className={`text-4xl font-bold tracking-tight mb-4 ${dark ? "text-white" : "text-black"}`}
        >
          {title}
        </h3>
      )}
      {subtitle && (
        <p
          className={`text-base max-w-[320px] leading-relaxed mb-8 ${dark ? "text-gray-400" : "text-gray-600"}`}
        >
          {subtitle}
        </p>
      )}
      <div className="mt-auto">{children}</div>
    </div>
  </div>
);

const RewardTransaction = ({
  icon: Icon,
  name,
  amount,
}: {
  icon: React.ElementType;
  name: string;
  amount: string;
}) => (
  <div className="flex items-center justify-between py-4 border-b border-white/[0.03] last:border-0 group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-blue-400 group-hover:bg-white/10 transition duration-500">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-sm font-semibold text-white tracking-tight">
          {name}
        </div>
        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
          2% Rewards
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm font-black text-[#b4f3a3]">
        +{amount} <span className="text-[10px]">BLIP</span>
      </div>
      <div className="text-[9px] text-gray-700 font-black uppercase tracking-widest">
        Confirmed
      </div>
    </div>
  </div>
);

export default function RewardPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#000] text-white font-sans antialiased selection:bg-[#ffb088]/30">
      <main>
        {/* HERO */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={IMAGES.heroGlobe}
              alt="Global Network"
              className="w-full h-full object-cover opacity-50 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          </div>

          <div className="relative z-10 max-w-[1300px] mx-auto px-10 text-center space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-4">
              <Activity size={14} className="text-[#ffb088]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffb088]">
                Solana Mainnet: Optimized
              </span>
            </div>
            <h1 className="text-[64px] md:text-[118px] font-black tracking-[-0.05em] leading-[0.9] drop-shadow-2xl">
              Borderless finance. <br />
              <span className="bg-gradient-to-r from-[#ffb088] to-[#ff8c5a] bg-clip-text text-transparent italic">
                Settled on-chain.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Send value to anyone, anywhere. Powered by open infrastructure and
              high-performance non-custodial liquidity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
              <BrandButton className="h-18 px-14 text-xl shadow-[0_20px_60px_rgba(255,176,136,0.15)]">
                Join Waitlist
              </BrandButton>
              <BrandButton variant="secondary" className="h-18 px-14 text-xl">
                Become a Merchant <ChevronRight size={24} />
              </BrandButton>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Scroll to explore
            </span>
            <ChevronDown size={16} />
          </div>
        </section>

        {/* BENTO GRID */}
        <section
          id="how"
          className="max-w-[1400px] mx-auto px-10 pt-20 pb-40 space-y-32"
        >
          <div className="text-center space-y-6">
            <SectionLabel color="text-[#ffb088]">Protocol Pillars</SectionLabel>
            <h2 className="text-7xl font-black tracking-tighter">
              Built for everyone.
            </h2>
            <p className="text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
              Whether you're sending value globally or scaling a merchant
              business, blip.money is the rails for your value.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* FOR USERS */}
            <BentoCard
              className="lg:col-span-4 min-h-[700px]"
              title="For Users."
              subtitle="Pay freely. Globally. Tap to pay at stores and across borders with instant settlement."
              image={IMAGES.networkNodes}
              overlayOpacity="opacity-50"
            >
              <div className="space-y-4">
                {[
                  {
                    t: "Pay globally",
                    d: "Send value instantly to any wallet.",
                    i: <Globe size={18} />,
                  },
                  {
                    t: "Pay anywhere",
                    d: "Tap-to-pay functionality coming soon.",
                    i: <Smartphone size={18} />,
                  },
                  {
                    t: "Private by default",
                    d: "On-chain privacy for every transaction.",
                    i: <Lock size={18} />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-3xl group/item cursor-pointer hover:border-white/15 transition-all duration-500"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-white transition">
                        {item.i}
                      </div>
                      <div>
                        <div className="text-sm font-bold tracking-tight">
                          {item.t}
                        </div>
                        <div className="text-[11px] text-gray-600 font-medium">
                          {item.d}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>

            {/* FOR MERCHANTS */}
            <BentoCard
              className="lg:col-span-4 min-h-[700px]"
              title="For Merchants."
              subtitle="Scale without limits. Lower fees, zero chargebacks, and instant liquidity."
              image={IMAGES.fiberOptics}
              overlayOpacity="opacity-60"
            >
              <div className="space-y-4">
                {[
                  {
                    t: "Lower fees",
                    d: "0.1% vs traditional 3.5% rails.",
                    i: <BarChart3 size={18} />,
                  },
                  {
                    t: "Instant liquidity",
                    d: "Non-custodial pool settlement.",
                    i: <Database size={18} />,
                  },
                  {
                    t: "No chargebacks",
                    d: "Final settlement on every trade.",
                    i: <Shield size={18} />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-3xl group/item cursor-pointer hover:border-white/15 transition-all duration-500"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-white transition">
                        {item.i}
                      </div>
                      <div>
                        <div className="text-sm font-bold tracking-tight">
                          {item.t}
                        </div>
                        <div className="text-[11px] text-gray-600 font-medium">
                          {item.d}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>

            {/* REWARDS HUB */}
            <BentoCard
              className="lg:col-span-4 min-h-[700px] bg-gradient-to-br from-[#111] to-black border-white/10"
              title="Rewards."
              subtitle="Every payment earns BLIP rewards automatically. Experience the protocol that pays you back."
            >
              <div className="bg-black border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-3xl mt-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus size={14} className="text-gray-700" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      My Vault
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#b4f3a3]/10 border border-[#b4f3a3]/20">
                    <div className="w-1 h-1 rounded-full bg-[#b4f3a3]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#b4f3a3]">
                      On-Chain
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-b border-white/5 pb-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">
                    Total Earned
                  </div>
                  <div className="text-5xl font-black tracking-tighter text-white">
                    $862.90{" "}
                    <span className="text-xs font-bold text-gray-600">
                      BLIP
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black text-white">
                      2% BACK
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#ffb088]/10 border border-[#ffb088]/20 text-[9px] font-black text-[#ffb088]">
                      x5 STREAK
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <RewardTransaction
                    icon={Plane}
                    name="Emirates Air"
                    amount="12.80"
                  />
                  <RewardTransaction
                    icon={ShoppingBag}
                    name="Dubai Mall"
                    amount="4.20"
                  />
                  <RewardTransaction
                    icon={Coffee}
                    name="Arabica Coffee"
                    amount="0.50"
                  />
                </div>
              </div>
            </BentoCard>
          </div>
        </section>

        {/* INFRASTRUCTURE SECTION */}
        <section className="bg-[#161617] py-40 overflow-hidden relative">
          <img
            src={IMAGES.whitePattern}
            className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
            style={{ mixBlendMode: "overlay" }}
            alt="Pattern"
          />
          <div className="max-w-[1400px] mx-auto px-10 grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-10">
              <SectionLabel color="text-gray-400">Under the hood</SectionLabel>
              <h2 className="text-7xl font-black tracking-tighter leading-[1] text-white">
                Non-custodial. <br />
                Decentralized.
              </h2>
              <p className="text-2xl text-gray-500 leading-relaxed font-medium">
                The protocol uses high-yield liquidity pools to settle global
                corridors without traditional intermediaries.
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Layers size={32} className="text-[#ffb088]" />
                  <h4 className="text-xl font-bold">Layer 1 Security</h4>
                  <p className="text-sm text-gray-600">
                    Built on Solana for 65k+ TPS and military-grade security.
                  </p>
                </div>
                <div className="space-y-3">
                  <Database size={32} className="text-[#ffb088]" />
                  <h4 className="text-xl font-bold">Open Liquidity</h4>
                  <p className="text-sm text-gray-600">
                    Anyone can provide liquidity and earn protocol fees.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[150px] rounded-full" />
              <BentoCard
                className="h-[500px] border-white/10"
                title="Verified Corridors"
                subtitle="Check real-time settlement status across 50+ global currency pairs."
                image={IMAGES.infrastructure}
                overlayOpacity="opacity-60"
              >
                <div className="flex justify-between items-center p-6 bg-black/50 border border-white/5 rounded-3xl backdrop-blur-3xl">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Cpu size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white tracking-widest uppercase">
                        Active Corridors
                      </div>
                      <div className="text-2xl font-black text-white">
                        1,242
                      </div>
                    </div>
                  </div>
                  <BrandButton variant="secondary" className="h-10 px-6">
                    View Explorer
                  </BrandButton>
                </div>
              </BentoCard>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-[1400px] mx-auto px-10 py-40">
          <div className="relative bg-white text-black rounded-[5rem] p-24 md:p-40 flex flex-col items-center text-center space-y-12 shadow-[0_50px_100px_rgba(255,255,255,0.05)] overflow-hidden group">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-black/[0.03] rounded-full -mr-40 -mt-40 group-hover:scale-110 transition-transform duration-1000" />
            <SectionLabel color="text-black/40">Launch Program</SectionLabel>
            <h2 className="text-[60px] md:text-[110px] font-black tracking-[-0.07em] leading-none">
              The Future <br />
              is Settled.
            </h2>
            <p className="text-2xl text-gray-500 max-w-xl font-medium leading-relaxed">
              Join thousands of users and merchants ready to settle privately on
              the world's most performant network.
            </p>
            <BrandButton className="h-20 px-16 text-2xl font-black bg-black text-white hover:bg-black/90 shadow-2xl scale-110">
              Get Early Access
            </BrandButton>
          </div>
        </section>
      </main>

      <style>{`
        html { scroll-behavior: smooth; }
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
