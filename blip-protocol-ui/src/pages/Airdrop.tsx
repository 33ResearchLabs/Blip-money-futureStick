import React, { useState, useEffect, useMemo } from "react";
import {
  Wallet,
  ChevronRight,
  CheckCircle2,
  ArrowUpRight,
  Users,
  Zap,
  Gift,
  ShieldCheck,
  Info,
  Plus,
  Minus,
  Copy,
  ExternalLink,
  Coins,
  LayoutDashboard,
  Trophy,
  Activity,
  Vote,
  TrendingUp,
  Percent,
  Star,
  Globe,
  AlertCircle,
  Clock,
  Scale,
} from "lucide-react";

/**
 * BLIP.MONEY REWARDS HUB - TYPOGRAPHY UPDATED
 * Headings: Inter Bold / SemiBold
 * Body: Inter Regular
 * Buttons: Inter Medium
 */

// --- Mock Data ---
const CAMPAIGNS = [
  {
    id: 1,
    title: "First P2P Payment",
    reward: "10 BLIP",
    condition: "Send your first transfer of any amount.",
    icon: <ArrowUpRight className="w-6 h-6 text-orange-500" />,
    image:
      "https://images.unsplash.com/photo-1621416848440-2369dadbe357?auto=format&fit=crop&q=80&w=400",
    status: "available",
    progress: 0,
  },
  {
    id: 2,
    title: "Merchant Payment",
    reward: "20 BLIP",
    condition: "Complete a payment to a verified merchant.",
    icon: <ShieldCheck className="w-6 h-6 text-orange-500" />,
    image:
      "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=400",
    status: "available",
    progress: 0,
  },
  {
    id: 3,
    title: "Liquidity Provider",
    reward: "50 BLIP",
    condition: "Provide liquidity to the PeopleBank pool.",
    icon: <Coins className="w-6 h-6 text-orange-500" />,
    image:
      "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=400",
    status: "available",
    progress: 0,
  },
  {
    id: 4,
    title: "Recurring Transfers",
    reward: "15 BLIP",
    condition: "Send 5 transfers in a 30-day window.",
    icon: <Zap className="w-6 h-6 text-orange-500" />,
    image:
      "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=400",
    status: "available",
    progress: 20,
  },
];

const LEADERBOARD = [
  {
    rank: 1,
    user: "sol_dev_99",
    earnings: "12,450 BLIP",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    rank: 2,
    user: "whale_hunter",
    earnings: "10,200 BLIP",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    rank: 3,
    user: "p2p_king",
    earnings: "9,840 BLIP",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    rank: 4,
    user: "blip_early",
    earnings: "7,100 BLIP",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
  {
    rank: 5,
    user: "node_runner",
    earnings: "6,920 BLIP",
    avatar: "https://i.pravatar.cc/150?u=5",
  },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    user: "0x3a...4f",
    action: "Claimed Welcome Airdrop",
    amount: "25 BLIP",
    time: "2m ago",
  },
  {
    id: 2,
    user: "7vB9...p2",
    action: "Provided Liquidity",
    amount: "50 BLIP",
    time: "5m ago",
  },
  {
    id: 3,
    user: "9kL1...m5",
    action: "Referral Bonus",
    amount: "10 BLIP",
    time: "12m ago",
  },
];

const UTILITIES = [
  {
    title: "Governance",
    desc: "Vote on protocol upgrades and new asset listings.",
    icon: <Vote className="w-6 h-6 text-orange-500" />,
  },
  {
    title: "Fee Rebates",
    desc: "Hold BLIP to get up to 50% discount on P2P transfers.",
    icon: <Percent className="w-6 h-6 text-orange-500" />,
  },
  {
    title: "Staking Boost",
    desc: "Stake BLIP to earn higher APY on your stablecoin vaults.",
    icon: <TrendingUp className="w-6 h-6 text-orange-500" />,
  },
];

const RULES = [
  {
    id: 1,
    title: "Account Eligibility",
    desc: "One reward claim per unique Solana wallet and IP address. Use of multiple accounts to game the system (Sybil attack) will result in permanent blacklisting.",
    icon: <Users size={18} />,
  },
  {
    id: 2,
    title: "Distribution Timeline",
    desc: 'Verified rewards are typically distributed within 24–48 hours. Campaigns involving "Holding Periods" require funds to stay locked.',
    icon: <Clock size={18} />,
  },
  {
    id: 3,
    title: "Anti-Fraud & Validation",
    desc: "All transactions are subject to on-chain analysis. Wash trading or automated script interactions will be voided.",
    icon: <ShieldCheck size={18} />,
  },
  {
    id: 4,
    title: "Program Modifications",
    desc: "Blip Protocol reserves the right to modify or terminate any campaign based on market conditions.",
    icon: <Scale size={18} />,
  },
];

const FAQS = [
  {
    q: "How do I qualify for rewards?",
    a: "Qualification depends on the specific campaign. Most require a connected Solana wallet and a minimum transaction volume through the Blip protocol.",
  },
  {
    q: "What wallets are supported?",
    a: "Blip currently supports Phantom, Solflare, and any WalletConnect-compatible Solana wallets.",
  },
  {
    q: "How are rewards distributed?",
    a: "Rewards are distributed directly to your connected wallet within 24 hours of task verification.",
  },
];

// --- Sub-components ---

const TickerBar = ({ text }: { text: string }) => (
  <div className="w-full bg-black/[0.03] dark:bg-[#1c1c1c] py-6 border-y border-black/10 dark:border-zinc-800 my-12 overflow-hidden">
    <p className="text-center text-black dark:text-white text-xl font-bold tracking-tight uppercase italic px-4 animate-pulse">
      {text}
    </p>
  </div>
);

const Badge = ({
  children,
  variant = "orange",
}: {
  children: React.ReactNode;
  variant?: "orange" | "green" | "zinc";
}) => {
  const styles = {
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    green: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    zinc: "bg-black/5 dark:bg-zinc-800 text-black/40 dark:text-zinc-400 border-black/10 dark:border-zinc-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

export default function Airdrop() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [rewardBalance, setRewardBalance] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [airdropSteps, setAirdropSteps] = useState({
    connected: false,
    transferred: false,
    holding: false,
  });

  const connectWallet = () => {
    if (!walletConnected) {
      setWalletConnected(true);
      setWalletAddress("7xKX...vB9p");
      setAirdropSteps((prev) => ({ ...prev, connected: true }));
    } else {
      setWalletConnected(false);
      setWalletAddress("");
      setAirdropSteps({ connected: false, transferred: false, holding: false });
    }
  };

  const simulateTransfer = () => {
    if (!walletConnected) return;
    setAirdropSteps((prev) => ({ ...prev, transferred: true }));
    setTimeout(() => {
      setAirdropSteps((prev) => ({ ...prev, holding: true }));
      setRewardBalance((prev) => prev + 25);
    }, 2000);
  };

  const airdropProgress = useMemo(() => {
    const steps = Object.values(airdropSteps).filter(Boolean).length;
    return (steps / 3) * 100;
  }, [airdropSteps]);

  return (
    <div
      className="min-h-screen bg-[#FAF8F5] dark:bg-[#0b0b0b] text-black dark:text-zinc-200 font-normal selection:bg-orange-500/30 overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Import Inter with specific weights */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}
      </style>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0 hidden dark:block">
        <img
          src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832"
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b] via-[#0b0b0b]/90 to-[#0b0b0b]"></div>
      </div>

      {/* Navigation */}
      {/* <nav className="fixed top-0 w-full z-50 bg-[#0b0b0b]/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5 fill-current" />
              </div>
              <span className="font-bold text-xl text-white tracking-tighter">Blip<span className="text-orange-500">.</span>money</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Pay</a>
              <a href="#" className="text-white border-b-2 border-orange-500 pb-5 pt-5 translate-y-[2px]">Rewards</a>
              <a href="#" className="hover:text-white transition-colors">Vault</a>
            </div>
          </div>
          <button
            onClick={connectWallet}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              walletConnected ? 'bg-zinc-800 text-white' : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            <Wallet size={16} />
            {walletConnected ? 'Disconnect' : 'Connect Wallet'}
          </button>
        </div>
      </nav> */}

      <main className="relative z-10 pt-24 pb-20 px-4 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="orange">Ecosystem Rewards Hub</Badge>
            <h1 className="text-6xl lg:text-7xl font-bold text-black dark:text-white mt-4 leading-none tracking-tighter">
              Earn Rewards <br />
              <span className="text-zinc-600 italic">With Blip</span>
            </h1>
            <p className="text-black/50 dark:text-zinc-400 text-xl mt-6 max-w-lg leading-relaxed font-normal">
              Join 50k+ users earning tokens for every payment and trade. Built
              on the lightning-fast Solana network.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-medium text-lg shadow-2xl shadow-orange-500/20 transition-all flex items-center gap-3 group">
                Start Earning{" "}
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button className="bg-black/[0.03] dark:bg-[#161616] border border-black/10 dark:border-zinc-800 text-black dark:text-white px-10 py-4 rounded-2xl font-medium text-lg hover:border-black/20 dark:hover:border-zinc-600 transition-all">
                The Roadmap
              </button>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-10 bg-orange-500/10 blur-[100px] rounded-full"></div>
              <div className="relative w-96 h-96 bg-white dark:bg-[#0f0f0f] border border-black/10 dark:border-zinc-800 rounded-[3.5rem] rotate-3 flex items-center justify-center overflow-hidden shadow-2xl">
                <Coins className="w-32 h-32 text-orange-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-10 left-10 right-10 p-5 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                    Total Rewards Distributed
                  </div>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    $14,204,551
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Screenshot Ticker 1 */}
        <TickerBar text="The more you trade, the more rewards you unlock." />

        {/* Welcome Airdrop */}
        <section className="mb-20">
          <div className="bg-white/80 dark:bg-[#111111] border border-black/10 dark:border-zinc-800 rounded-[2.5rem] p-8 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-1/3 opacity-10 grayscale group-hover:grayscale-0 transition-all">
              <img
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative z-10 lg:flex items-center justify-between gap-12">
              <div className="flex-1">
                <Badge variant="green">Live Campaign</Badge>
                <h2 className="text-4xl font-bold text-black dark:text-white mb-4 mt-6 tracking-tight">
                  $25 BLIP Welcome Airdrop
                </h2>
                <p className="text-black/50 dark:text-zinc-500 text-lg mb-8 max-w-md">
                  The genesis event is here. Complete simple on-chain tasks to
                  claim your piece of the pool.
                </p>
                <div className="space-y-4 max-w-md mb-10">
                  <div className="flex justify-between font-bold text-sm">
                    <span className="text-black/50 dark:text-zinc-400">Your Progress</span>
                    <span className="text-emerald-500">
                      {Math.round(airdropProgress)}%
                    </span>
                  </div>
                  <div className="h-3 bg-black/10 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${airdropProgress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { l: "Connect Wallet", d: airdropSteps.connected },
                    { l: "Send $50+", d: airdropSteps.transferred },
                    { l: "Hold 7 Days", d: airdropSteps.holding },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${s.d ? "bg-emerald-500 border-emerald-500 text-black" : "border-black/10 dark:border-zinc-800 text-black/30 dark:text-zinc-700 font-bold"}`}
                      >
                        {s.d ? <CheckCircle2 size={16} /> : i + 1}
                      </div>
                      <span
                        className={`text-sm font-semibold ${s.d ? "text-black dark:text-zinc-200" : "text-black/40 dark:text-zinc-600"}`}
                      >
                        {s.l}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-12 lg:mt-0 min-w-[300px]">
                <button
                  onClick={simulateTransfer}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium py-5 rounded-2xl text-lg shadow-xl shadow-emerald-500/10 transition-all"
                >
                  {airdropSteps.holding
                    ? "Claimed Successfully"
                    : "Execute Mission"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Screenshot Referral Section */}
        <section className="mb-20">
          <div className="flex flex-col mb-10">
            <h2 className="text-5xl font-bold text-black dark:text-white mb-4 tracking-tighter">
              Invite friends, get rewards
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-black/50 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs">
                Protocol Referral Program
              </span>
              <a
                href="#"
                className="text-orange-500 hover:text-orange-400 font-bold flex items-center gap-1 text-sm group"
              >
                Rules{" "}
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: 5 USDC */}
            <div className="bg-white/80 dark:bg-[#1a1c1f] border border-black/10 dark:border-zinc-800 rounded-3xl p-10 flex flex-col hover:border-black/20 dark:hover:border-zinc-600 transition-all group">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-orange-500 group-hover:scale-110 transition-transform origin-left">
                  5
                </span>
                <span className="text-md font-bold text-black/50 dark:text-zinc-500 uppercase">
                  USDC
                </span>
              </div>
              <div className="border-b-2 border-dotted border-black/20 dark:border-zinc-700 w-fit text-[11px] font-bold text-black/40 dark:text-zinc-600 mb-8 uppercase tracking-[0.2em]">
                Airdrop &bull; Spot
              </div>
              <p className="text-black dark:text-white font-bold text-2xl mb-8 leading-tight">
                Top up &ge; $100
              </p>
              <div className="mt-auto">
                <div className="flex justify-between items-center text-xs mb-3">
                  <div className="h-2 bg-black/10 dark:bg-zinc-800 rounded-full flex-1 mr-4 overflow-hidden">
                    <div className="h-full bg-orange-500/50 w-0"></div>
                  </div>
                  <span className="text-black/50 dark:text-zinc-500 font-bold">0%</span>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-400 text-black font-medium py-4 rounded-full transition-all text-sm uppercase tracking-widest shadow-xl shadow-orange-500/10">
                  Top Up Now
                </button>
              </div>
            </div>

            {/* Card 2: 10 USDC */}
            <div className="bg-white/80 dark:bg-[#1a1c1f] border border-black/10 dark:border-zinc-800 rounded-3xl p-10 flex flex-col hover:border-black/20 dark:hover:border-zinc-600 transition-all group">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-orange-500 group-hover:scale-110 transition-transform origin-left">
                  10
                </span>
                <span className="text-md font-bold text-black/50 dark:text-zinc-500 uppercase">
                  USDC
                </span>
              </div>
              <div className="border-b-2 border-dotted border-black/20 dark:border-zinc-700 w-fit text-[11px] font-bold text-black/40 dark:text-zinc-600 mb-8 uppercase tracking-[0.2em]">
                Airdrop &bull; Spot
              </div>
              <p className="text-black dark:text-white font-bold text-2xl mb-8 leading-tight">
                Top up &ge; $100{" "}
                <span className="text-black/40 dark:text-zinc-600 font-light italic text-xl">
                  &amp;
                </span>{" "}
                Trade &ge; $500
              </p>
              <div className="mt-auto">
                <div className="flex justify-between items-center text-xs mb-3">
                  <div className="h-2 bg-black/10 dark:bg-zinc-800 rounded-full flex-1 mr-4 overflow-hidden">
                    <div className="h-full bg-orange-500/50 w-0"></div>
                  </div>
                  <span className="text-black/50 dark:text-zinc-500 font-bold">0%</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-black/10 dark:bg-zinc-800 hover:bg-black/15 dark:hover:bg-zinc-700 text-black dark:text-white font-medium py-4 rounded-full text-[10px] transition-all uppercase tracking-widest">
                    Top Up
                  </button>
                  <button className="bg-orange-500 hover:bg-orange-400 text-black font-medium py-4 rounded-full text-[10px] transition-all uppercase tracking-widest">
                    Trade Now
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: 100 USDC */}
            <div className="bg-white/80 dark:bg-[#1a1c1f] border border-black/10 dark:border-zinc-800 rounded-3xl p-10 flex flex-col hover:border-black/20 dark:hover:border-zinc-600 transition-all group">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-orange-500 group-hover:scale-110 transition-transform origin-left">
                  100
                </span>
                <span className="text-md font-bold text-black/50 dark:text-zinc-500 uppercase">
                  USDC
                </span>
              </div>
              <div className="border-b-2 border-dotted border-black/20 dark:border-zinc-700 w-fit text-[11px] font-bold text-black/40 dark:text-zinc-600 mb-8 uppercase tracking-[0.2em]">
                Airdrop &bull; Spot
              </div>
              <p className="text-black dark:text-white font-bold text-2xl mb-8 leading-tight">
                Top up &ge; $100{" "}
                <span className="text-black/40 dark:text-zinc-600 font-light italic text-xl">
                  &amp;
                </span>{" "}
                Trade &ge; $250k
              </p>
              <div className="mt-auto">
                <div className="flex justify-between items-center text-xs mb-3">
                  <div className="h-2 bg-black/10 dark:bg-zinc-800 rounded-full flex-1 mr-4 overflow-hidden">
                    <div className="h-full bg-orange-500/50 w-0"></div>
                  </div>
                  <span className="text-black/50 dark:text-zinc-500 font-bold">0%</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-black/10 dark:bg-zinc-800 hover:bg-black/15 dark:hover:bg-zinc-700 text-black dark:text-white font-medium py-4 rounded-full text-[10px] transition-all uppercase tracking-widest">
                    Top Up
                  </button>
                  <button className="bg-orange-500 hover:bg-orange-400 text-black font-medium py-4 rounded-full text-[10px] transition-all uppercase tracking-widest">
                    Trade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Screenshot Ticker 2 */}
        <TickerBar text="Exciting events and rewards await you. Join today!" />

        {/* Live Feed & Leaderboard */}
        <section className="mb-20 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white/80 dark:bg-[#111111] border border-black/10 dark:border-zinc-800 rounded-[2.5rem] p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-black dark:text-white flex items-center gap-3">
                  <Trophy className="text-orange-500" size={32} /> Top Earners
                </h2>
                <p className="text-black/50 dark:text-zinc-500 text-sm mt-1 uppercase tracking-widest font-bold">
                  Global Ranking Season 01
                </p>
              </div>
              <Badge variant="zinc">Mainnet Beta</Badge>
            </div>

            <div className="space-y-3">
              {LEADERBOARD.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-5 bg-black/[0.03] dark:bg-[#161616] hover:bg-black/[0.05] dark:hover:bg-[#1d1d1d] border border-black/10 dark:border-zinc-800 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <span
                      className={`w-8 font-bold text-xl ${item.rank <= 3 ? "text-orange-500" : "text-black/40 dark:text-zinc-600"}`}
                    >
                      0{item.rank}
                    </span>
                    <img
                      src={item.avatar}
                      alt={item.user}
                      className="w-12 h-12 rounded-full border-2 border-black/10 dark:border-zinc-800"
                    />
                    <span className="font-semibold text-black dark:text-zinc-200 uppercase tracking-widest text-sm">
                      {item.user}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-black dark:text-white font-bold text-lg">
                      {item.earnings}
                    </div>
                    <div className="text-[10px] text-black/40 dark:text-zinc-600 font-bold uppercase tracking-widest">
                      Verified Payout
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-[#111111] border border-black/10 dark:border-zinc-800 rounded-[2.5rem] p-10 flex flex-col">
            <h3 className="text-2xl font-bold text-black dark:text-white mb-8 flex items-center gap-3">
              <Activity className="text-orange-500" size={24} /> Live Feed
            </h3>
            <div className="space-y-8 flex-1">
              {RECENT_ACTIVITY.map((act) => (
                <div
                  key={act.id}
                  className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-[-32px] before:w-[2px] before:bg-black/10 dark:before:bg-zinc-800 last:before:hidden"
                >
                  <div className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-orange-500 border-4 border-white dark:border-[#111111]"></div>
                  <div className="text-[10px] text-black/40 dark:text-zinc-600 font-bold mb-1 uppercase tracking-widest">
                    {act.time}
                  </div>
                  <div className="text-sm font-semibold text-black/70 dark:text-zinc-300 mb-1">
                    {act.user}{" "}
                    <span className="font-normal text-black/50 dark:text-zinc-500">
                      {act.action}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-500 font-bold tracking-widest">
                    +{act.amount}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-12 w-full border border-black/10 dark:border-zinc-800 py-4 rounded-2xl text-[11px] font-medium text-black/50 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-zinc-600 transition-all uppercase tracking-[0.2em]">
              View On Solana Explorer
            </button>
          </div>
        </section>

        {/* Missions Grid */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-black dark:text-white tracking-tight">
                Active Missions
              </h2>
              <p className="text-black/40 dark:text-zinc-600 text-sm mt-1 uppercase tracking-widest font-bold italic">
                Interactive tasks for the protocol ecosystem
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CAMPAIGNS.map((camp) => (
              <div
                key={camp.id}
                className="group bg-white/80 dark:bg-[#111111] border border-black/10 dark:border-zinc-800 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all"
              >
                <div className="h-40 w-full relative overflow-hidden">
                  <img
                    src={camp.image}
                    alt={camp.title}
                    className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#111111] to-transparent"></div>
                  <div className="absolute bottom-4 left-5 bg-white/60 dark:bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/5">
                    {camp.icon}
                  </div>
                </div>
                <div className="p-8 pt-4 flex flex-col min-h-[220px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-black dark:text-white text-md uppercase tracking-tight">
                      {camp.title}
                    </h3>
                    <Badge variant="orange">{camp.reward}</Badge>
                  </div>
                  <p className="text-black/50 dark:text-zinc-500 text-xs leading-relaxed mb-8 flex-1 font-normal">
                    {camp.condition}
                  </p>
                  <div className="mt-auto">
                    <div className="h-1.5 bg-black/10 dark:bg-zinc-900 rounded-full mb-6">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${camp.progress}%` }}
                      ></div>
                    </div>
                    <button className="w-full bg-black/[0.03] dark:bg-[#161616] group-hover:bg-orange-500 group-hover:text-white border border-black/10 dark:border-zinc-800 group-hover:border-orange-500 text-black/50 dark:text-zinc-500 py-3 rounded-xl text-xs font-medium transition-all uppercase tracking-widest">
                      Launch Mission
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Token Utility */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-black dark:text-white mb-4 tracking-tighter uppercase">
              Why Hold BLIP?
            </h2>
            <p className="text-black/50 dark:text-zinc-500 text-lg font-normal italic">
              Fueling the world's most accessible P2P payment network.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {UTILITIES.map((util, i) => (
              <div
                key={i}
                className="p-10 bg-white/80 dark:bg-[#111111] border border-black/10 dark:border-zinc-800 rounded-[2.5rem] hover:border-orange-500/30 transition-all text-center group"
              >
                <div className="w-20 h-20 bg-black/5 dark:bg-zinc-900 border border-black/10 dark:border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                  {util.icon}
                </div>
                <h4 className="text-xl font-bold text-black dark:text-white mb-4 uppercase tracking-tighter">
                  {util.title}
                </h4>
                <p className="text-black/50 dark:text-zinc-500 text-sm leading-relaxed font-normal">
                  {util.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* New User Blast Off */}
        <section className="mb-20">
          <div className="bg-orange-600 rounded-[3rem] p-10 lg:p-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-full w-2/3 bg-white/5 skew-x-[-20deg] translate-x-32"></div>
            <div className="relative z-10 lg:flex items-center justify-between gap-12">
              <div className="max-w-2xl">
                <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tighter">
                  New User <br />
                  Blast Off
                </h2>
                <p className="text-white/90 text-xl mb-10 font-normal max-w-lg leading-relaxed">
                  Enter the grand reward pool of{" "}
                  <span className="text-black font-bold bg-white px-2 rounded">
                    50,000 BLIP
                  </span>
                  . Complete your first deposit and enter the tiered raffle.
                </p>
                <div className="flex flex-wrap gap-5">
                  <button className="bg-black text-white px-10 py-5 rounded-2xl font-medium text-lg hover:scale-105 transition-all shadow-2xl">
                    Deposit $200
                  </button>
                  <button className="bg-white/20 backdrop-blur-xl text-white border-2 border-white/30 px-10 py-5 rounded-2xl font-medium text-lg">
                    Transfer Funds
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-black/10 p-12 rounded-[3rem] border-2 border-white/10 backdrop-blur-3xl animate-pulse">
                  <LayoutDashboard
                    size={100}
                    className="text-white opacity-40"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rules & Terms */}
        <section className="mb-20">
          <div className="bg-white/80 dark:bg-[#111111] border border-black/10 dark:border-zinc-800 rounded-[3rem] p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 opacity-[0.02] text-black dark:text-white">
              <Scale size={400} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-12">
                <div className="p-4 bg-black/5 dark:bg-zinc-900 border border-black/10 dark:border-zinc-800 rounded-2xl text-orange-500">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-black dark:text-white tracking-tight uppercase">
                    Rewards Hub Policy
                  </h2>
                  <p className="text-black/50 dark:text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">
                    Version 2.4 &bull; Effective Immediately
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                {RULES.map((rule) => (
                  <div key={rule.id} className="group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-zinc-900 flex items-center justify-center border border-black/10 dark:border-zinc-800 text-black/50 dark:text-zinc-500 group-hover:border-orange-500 transition-colors">
                        {rule.icon}
                      </div>
                      <h4 className="font-bold text-black dark:text-zinc-100 uppercase tracking-widest text-sm">
                        {rule.id}. {rule.title}
                      </h4>
                    </div>
                    <p className="text-black/50 dark:text-zinc-500 text-sm leading-relaxed pl-14 font-normal">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-12 uppercase tracking-tighter">
            F.A.Q
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="border border-black/10 dark:border-zinc-800 rounded-2xl overflow-hidden group"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className={`w-full flex items-center justify-between p-7 text-left transition-colors ${activeFaq === idx ? "bg-black/5 dark:bg-zinc-900" : "hover:bg-black/[0.03] dark:hover:bg-zinc-900/40"}`}
                >
                  <span className="font-bold text-black dark:text-zinc-200 tracking-tight">
                    {faq.q}
                  </span>
                  {activeFaq === idx ? (
                    <Minus size={20} className="text-orange-500" />
                  ) : (
                    <Plus
                      size={20}
                      className="text-black/30 dark:text-zinc-600 group-hover:text-black/50 dark:group-hover:text-zinc-400"
                    />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="p-7 text-black/50 dark:text-zinc-400 text-sm leading-relaxed border-t border-black/10 dark:border-zinc-800 bg-black/[0.02] dark:bg-[#0a0a0a] animate-in slide-in-from-top-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center pb-20">
          <div className="bg-white/80 dark:bg-[#111111] border border-black/10 dark:border-zinc-800 rounded-[3rem] p-20 max-w-4xl mx-auto overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
            <h2 className="text-5xl font-bold text-black dark:text-white mb-8 tracking-tighter">
              The future of P2P is{" "}
              <span className="text-orange-500 italic">Blip</span>.
            </h2>
            <p className="text-black/50 dark:text-zinc-500 text-xl mb-12 font-normal">
              Claim your spot in the ecosystem today.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-14 py-5 rounded-2xl font-medium text-xl shadow-2xl shadow-orange-500/30 transition-all">
              Connect & Begin
            </button>
          </div>
          <div className="mt-24 flex flex-col items-center gap-10">
            <div className="flex items-center gap-3">
              <Zap className="text-orange-500" />
              <span className="font-bold text-3xl text-black dark:text-white tracking-tighter">
                Blip.money
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-12 text-black/40 dark:text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">
                Explorer
              </a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">
                Solana Status
              </a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">
                Audits
              </a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">
                Media Kit
              </a>
            </div>
            <p className="text-black/30 dark:text-zinc-700 text-xs font-semibold uppercase tracking-widest">
              &copy; 2024 Blip Protocol &bull; Decentralized Fintech
            </p>
          </div>
        </section>
      </main>

      {/* Wallet Simulation Sidebar */}
      <div
        className={`fixed bottom-0 right-0 m-10 z-[100] transition-all transform duration-700 ${walletConnected ? "translate-y-0 opacity-100" : "translate-y-40 opacity-0 pointer-events-none"}`}
      >
        <div className="bg-black/90 backdrop-blur-2xl border-2 border-zinc-800 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,1)] p-6 w-80">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                Connected
              </span>
            </div>
            <button
              onClick={() => setWalletConnected(false)}
              className="text-zinc-600 hover:text-white"
            >
              <Plus size={16} className="rotate-45" />
            </button>
          </div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold italic text-2xl shadow-xl shadow-purple-500/20">
              P
            </div>
            <div>
              <div className="text-md font-bold text-white">Phantom</div>
              <div className="text-[10px] text-zinc-500 font-mono font-bold tracking-widest">
                {walletAddress}
              </div>
            </div>
          </div>
          <div className="space-y-4 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-bold uppercase">
                Balance
              </span>
              <span className="text-white font-bold">12.42 SOL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-bold uppercase">
                Rewards
              </span>
              <span className="text-orange-500 font-bold">
                +{rewardBalance} BLIP
              </span>
            </div>
          </div>
          <button className="mt-6 w-full bg-white text-black text-xs font-medium py-4 rounded-xl hover:bg-zinc-200 transition-colors uppercase tracking-[0.2em]">
            Manage Assets
          </button>
        </div>
      </div>
    </div>
  );
}
