import React, { useState, useEffect } from "react";
import {
  Wallet,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Twitter,
  Users,
  BookOpen,
  ArrowUpRight,
  ExternalLink,
  Menu,
  X,
  Globe,
  Mail,
  ArrowLeft,
  Loader2,
  HandCoins,
  Zap,
  Layers,
  Shield,
  Activity,
} from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { airdropApi } from "@/services/Airdrop";

const BlipAirdropHub = () => {
  // Solana Wallet Integration
  const { publicKey, connected, connecting, wallet } = useWallet();
  const { toast } = useToast();

  // Navigation & Identity State
  const [view, setView] = useState("landing"); // 'landing', 'waitlist', 'connect', 'dashboard'
  const [email, setEmail] = useState("");
  const [referral_code, setReferralCode] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  console.log("connection", connected);
  console.log("connecting", connecting);
  console.log("wallet", wallet);
  console.log("public key", publicKey);
  // Derived state from wallet
  const isWalletConnected = connected;
  const walletAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  // Debug wallet connection state
  useEffect(() => {
    console.log("📊 JoinWaitlist - Wallet State:", {
      connected,
      connecting,
      publicKey: publicKey?.toBase58(),
      walletName: wallet?.adapter.name,
      currentView: view,
    });

    // If wallet connects, log it
    if (connected && publicKey) {
      console.log("🎉 Wallet connected in JoinWaitlist!", {
        address: publicKey.toBase58(),
        view: view,
      });
    }
  }, [connected, connecting, publicKey, wallet, view]);

  // Dynamic Points & Tasks State
  const [points, setPoints] = useState(0);
  const [userTasks, setUserTasks] = useState([
    {
      category: "Core Tasks",
      items: [
        {
          id: 1,
          title: "Initialize Private Vault",
          points: 500,
          status: "pending",
          description:
            "Set up your first encrypted liquidity vault on the Blip network.",
        },
        {
          id: 2,
          title: "Execute Cross-Border Swap",
          points: 750,
          status: "pending",
          description:
            "Complete a transaction exceeding $100 equivalent in volume.",
        },
      ],
    },
    {
      category: "Social Verification",
      items: [
        {
          id: 3,
          title: "Follow Blip Institutional",
          points: 100,
          status: "pending",
          icon: <Twitter size={16} />,
        },
        {
          id: 4,
          title: "Join Global Telegram",
          points: 100,
          status: "pending",
          icon: <Users size={16} />,
        },
      ],
    },
    {
      category: "Education & Governance",
      items: [
        {
          id: 5,
          title: "Read Whitepaper 2.0",
          points: 200,
          status: "pending",
          icon: <BookOpen size={16} />,
        },
        {
          id: 6,
          title: "Stake BLIP for Voting",
          points: 1000,
          status: "pending",
          description: "Participate in the Q1 Protocol Governance vote.",
        },
      ],
    },
  ]);

  // Effect: Save user data to backend when wallet connects
  useEffect(() => {
    const saveUserData = async () => {
      if (!connected || !publicKey || view !== "connect") return;

      console.log("💾 Attempting to save user data:", {
        wallet_address: publicKey.toBase58(),
        email,
        referral_code,
        view,
      });

      setIsConnecting(true);

      try {
        const response = await airdropApi.postAirdrop({
          email: email,
          referral_code: referral_code,
          wallet_address: publicKey.toBase58(),
        });

        console.log("✅ User data saved successfully:", response);

        toast({
          title: "Success!",
          description: "Your wallet has been connected and data saved.",
        });

        setTimeout(() => {
          setView("dashboard");
          setIsConnecting(false);
        }, 1000);
      } catch (error: any) {
        console.error("❌ Error saving user data:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);

        // Still proceed to dashboard even if backend fails
        toast({
          title: "Wallet Connected",
          description:
            "Your wallet is connected. Some features may be limited.",
        });

        setTimeout(() => {
          setView("dashboard");
          setIsConnecting(false);
        }, 1000);
      }
    };

    saveUserData();
  }, [connected, publicKey, view, email, referral_code, toast]);

  // Actions
  const handleJoinWaitlist = (e) => {
    e.preventDefault();
    if (email.includes("@")) {
      setView("connect");
    }
  };

  const completeTask = (groupIdx, taskId) => {
    const newTasks = [...userTasks];
    const task = newTasks[groupIdx].items.find((t) => t.id === taskId);

    if (task.status === "pending") {
      task.status = "under_review";
      setUserTasks(newTasks);

      // Simulate verification
      setTimeout(() => {
        const finalTasks = [...userTasks];
        const finalTask = finalTasks[groupIdx].items.find(
          (t) => t.id === taskId
        );
        finalTask.status = "completed";
        setPoints((prev) => prev + finalTask.points);
        setUserTasks(finalTasks);
      }, 2000);
    }
  };

  const StatusBadge = ({ status }) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#39ff14] bg-[#39ff14]/10 px-2 py-1 rounded border border-[#39ff14]/20">
            <CheckCircle2 size={12} /> Verified
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
            Start Task
          </span>
        );
      case "under_review":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 animate-pulse">
            <Clock size={12} /> Verifying...
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#39ff14] selection:text-black transition-all duration-500">
      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => setView("landing")}
          >
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center relative overflow-hidden">
              <div className="w-1.5 h-1.5 bg-[#39ff14] rounded-full shadow-[0_0_8px_#39ff14]" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Blip
              <span className="text-zinc-500 text-lg font-normal">.money</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            {isWalletConnected && (
              <div className="flex items-center gap-6 mr-4 border-r border-zinc-800 pr-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase tracking-tighter text-zinc-500 font-bold">
                    Protocol Balance
                  </span>
                  <span className="text-[#39ff14] font-mono text-sm font-bold">
                    {points} pts
                  </span>
                </div>
              </div>
            )}
            <a href="#" className="hover:text-white transition-colors">
              Protocol
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Developers
            </a>
            <div className="h-4 w-px bg-zinc-800" />
            {isWalletConnected ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold leading-none mb-1">
                    Authenticated
                  </span>
                  <span className="text-zinc-200 font-mono text-xs">
                    {walletAddress}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center">
                  <ShieldCheck className="text-[#39ff14]" size={16} />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setView("waitlist")}
                className="bg-zinc-100 text-black px-5 py-2 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-[#39ff14] transition-all duration-300 active:scale-95"
              >
                Connect Wallet
              </button>
            )}
          </div>

          <div className="md:hidden">
            <Menu size={24} className="text-zinc-400" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* STEP 0: LANDING */}
        {/* STEP 0: ENHANCED LANDING */}
        {view === "landing" && (
          <div className="animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-center gap-16 py-20 lg:py-32">
              <div className="flex-1 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#39ff14]/5 border border-[#39ff14]/20 text-[#39ff14] text-[10px] font-bold uppercase tracking-widest mb-10">
                  <Activity size={12} className="animate-pulse" />
                  Mainnet Alpha: Live Verification
                </div>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.95] selection:bg-[#39ff14] selection:text-black">
                  Earn in a Blip.
                </h1>
                <p className="text-xl text-zinc-500 mb-12 leading-relaxed max-w-xl">
                  Support the first privacy-preserving institutional payment
                  protocol. Earn rewards by validating network integrity and
                  contributing to the global on-chain bridge.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => setView("waitlist")}
                    className="w-full sm:w-auto bg-[#39ff14] text-black px-12 py-5 rounded-sm font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#32e012] transition-all shadow-[0_20px_40px_-15px_rgba(57,255,20,0.25)] active:scale-95 flex items-center justify-center gap-3"
                  >
                    Join Hub <ChevronRight size={16} strokeWidth={3} />
                  </button>
                  <button className="w-full sm:w-auto px-12 py-5 border border-zinc-800 rounded-sm font-bold text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:bg-zinc-900 transition-all">
                    Read Whitepaper
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full lg:w-auto relative group">
                {/* Visual Decorative Element: Abstract Terminal Card */}
                <div className="bg-[#0c0c0c] border border-zinc-800 p-8 rounded-sm shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#39ff14]/20 to-transparent" />
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-900">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      Protocol_Status
                    </span>
                    <span className="text-[10px] font-mono text-[#39ff14]">
                      100% Operational
                    </span>
                  </div>
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-1 rounded-full bg-zinc-900 overflow-hidden">
                          <div className="h-full bg-zinc-800 w-1/3 animate-ping" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-2 w-full bg-zinc-900 rounded-sm" />
                          <div className="h-2 w-2/3 bg-zinc-900 rounded-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 flex items-end justify-between">
                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-600 font-bold uppercase">
                        Volume (24h)
                      </div>
                      <div className="text-xl font-mono font-bold text-zinc-300 tracking-tighter">
                        $14,293.00
                      </div>
                    </div>
                    <div className="w-24 h-12 flex items-end gap-1">
                      {[40, 60, 45, 80, 50, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-zinc-800 rounded-t-sm"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Accent glow */}
                <div className="absolute -inset-4 bg-[#39ff14]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
            </div>

            {/* Feature Utility Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-32 border-t border-zinc-900 pt-20">
              <div className="p-8 bg-zinc-900/20 border border-zinc-900 rounded-sm">
                <Shield className="text-[#39ff14] mb-6" size={24} />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-4">
                  Privacy Core.
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Every transaction is encrypted using zero-knowledge proofs.
                  Privacy is no longer a luxury, it's a protocol standard.
                </p>
              </div>
              <div className="p-8 bg-zinc-900/20 border border-zinc-800/40 rounded-sm">
                <Layers className="text-[#39ff14] mb-6" size={24} />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-4">
                  Scalability.
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Processing thousands of transactions per second with near-zero
                  latency. Built for the speed of institutional global finance.
                </p>
              </div>
              <div className="p-8 bg-zinc-900/20 border border-zinc-900 rounded-sm">
                <Zap className="text-[#39ff14] mb-6" size={24} />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-4">
                  Instant Settlement.
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Eliminate wait times. Finality achieved in a blip, moving
                  assets across borders in real-time.
                </p>
              </div>
            </div>

            {/* Network Trust Section */}
            <div className="py-20 flex flex-col items-center border-t border-zinc-900 text-center">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mb-12">
                Institutional Backing & Audits
              </span>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all hover:opacity-100 cursor-default">
                <div className="flex items-center gap-3 font-black text-xl tracking-tighter">
                  CERTIK <div className="w-1 h-1 bg-[#39ff14] rounded-full" />
                </div>
                <div className="flex items-center gap-3 font-black text-xl tracking-tighter uppercase">
                  Solana <div className="w-1 h-1 bg-[#39ff14] rounded-full" />
                </div>
                <div className="flex items-center gap-3 font-black text-xl tracking-tighter uppercase">
                  TrailOfBits{" "}
                  <div className="w-1 h-1 bg-[#39ff14] rounded-full" />
                </div>
                <div className="flex items-center gap-3 font-black text-xl tracking-tighter uppercase">
                  Jump <div className="w-1 h-1 bg-[#39ff14] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: WAITLIST (EMAIL) */}
        {view === "waitlist" && (
          <div className="max-w-md mx-auto py-24 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-10 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#39ff14] block mb-4">
                Step 1 of 3
              </span>
              <h2 className="text-3xl font-bold text-white mb-2">
                Reserve Your Spot
              </h2>
              <p className="text-zinc-500 text-sm">
                Enter your institutional or personal email to begin
                verification.
              </p>
            </div>

            <form onSubmit={handleJoinWaitlist} className="space-y-4">
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#39ff14] transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  className="w-full bg-zinc-900/50 border border-zinc-800 py-4 pl-12 pr-4 rounded-sm text-white focus:outline-none focus:border-[#39ff14]/50 focus:ring-1 focus:ring-[#39ff14]/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative group">
                {" "}
                <HandCoins
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#39ff14] transition-colors"
                  size={18}
                />
                <input
                  type="referral_code"
                  placeholder="Referral code"
                  className="w-full bg-zinc-900/50 border border-zinc-800 py-4 pl-12 pr-4 rounded-sm text-white focus:outline-none focus:border-[#39ff14]/50 focus:ring-1 focus:ring-[#39ff14]/20 transition-all"
                  value={referral_code}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#39ff14] text-black py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#32e012] transition-all active:scale-[0.98]"
              >
                Proceed to Connection
              </button>
              <button
                type="button"
                onClick={() => setView("landing")}
                className="w-full flex items-center justify-center gap-2 text-zinc-600 hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-4"
              >
                <ArrowLeft size={12} /> Back
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: CONNECT WALLET */}
        {view === "connect" && (
          <div className="max-w-lg mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-12 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#39ff14] block mb-4">
                Step 2 of 3
              </span>
              <h2 className="text-3xl font-bold text-white">Connect Wallet</h2>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-lg shadow-2xl relative overflow-hidden">
              {isConnecting && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="text-[#39ff14] animate-spin" size={40} />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
                    Requesting Signature...
                  </span>
                </div>
              )}

              <p className="text-zinc-500 text-sm mb-8 text-center">
                Authorized account:{" "}
                <span className="text-zinc-300 font-bold">{email}</span>
              </p>

              <div className="space-y-3 flex justify-center">
                <WalletConnectButton />
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-800/50 flex items-center justify-center gap-8">
                <div className="flex flex-col items-center opacity-50">
                  <ShieldCheck size={18} className="text-zinc-400 mb-2" />
                  <span className="text-[9px] text-zinc-400 uppercase font-black">
                    Secure
                  </span>
                </div>
                <div className="flex flex-col items-center opacity-50">
                  <Globe size={18} className="text-zinc-400 mb-2" />
                  <span className="text-[9px] text-zinc-400 uppercase font-black">
                    Global
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setView("waitlist")}
              className="mt-8 text-zinc-600 hover:text-zinc-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mx-auto"
            >
              <ArrowLeft size={12} /> Change Email
            </button>
          </div>
        )}

        {/* STEP 3: DASHBOARD */}
        {view === "dashboard" && (
          <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-2">
                  Authenticated As
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-200">
                    {walletAddress}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_5px_#39ff14]" />
                </div>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm relative overflow-hidden">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-2">
                  Accumulated Points
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#39ff14] tracking-tighter tabular-nums">
                    {points.toLocaleString()}
                  </span>
                </div>
                {/* Micro progress bar */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-800">
                  <div
                    className="h-full bg-[#39ff14] transition-all duration-1000"
                    style={{ width: `${(points / 4000) * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-2">
                  Protocol Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    Active Participant
                  </span>
                </div>
              </div>
              <div className="bg-[#39ff14]/5 border border-[#39ff14]/10 p-6 rounded-sm group cursor-pointer hover:bg-[#39ff14]/10 transition-all flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#39ff14] block mb-1">
                    Referral Boost
                  </span>
                  <span className="text-xs font-bold text-zinc-400">
                    +15% Multiplier
                  </span>
                </div>
                <ArrowUpRight
                  className="text-[#39ff14] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  size={18}
                />
              </div>
            </div>

            {/* Tasks Section */}
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Available Contributions
                </h2>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Update Frequency:{" "}
                  <span className="text-[#39ff14]">Instant</span>
                </div>
              </div>

              <div className="space-y-10">
                {userTasks.map((group, groupIdx) => (
                  <div key={groupIdx}>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">
                        {group.category}
                      </span>
                      <div className="h-px w-full bg-zinc-900" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.items.map((task) => (
                        <button
                          key={task.id}
                          disabled={task.status !== "pending"}
                          onClick={() => completeTask(groupIdx, task.id)}
                          className={`group text-left p-6 bg-zinc-900/30 border ${
                            task.status === "completed"
                              ? "border-[#39ff14]/20"
                              : "border-zinc-800"
                          } rounded-sm flex flex-col justify-between hover:border-zinc-600 transition-all relative overflow-hidden disabled:cursor-default`}
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4">
                              {task.icon && (
                                <div
                                  className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${
                                    task.status === "completed"
                                      ? "bg-[#39ff14]/10 text-[#39ff14]"
                                      : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-200"
                                  }`}
                                >
                                  {task.icon}
                                </div>
                              )}
                              <div>
                                <h4
                                  className={`font-bold transition-colors ${
                                    task.status === "completed"
                                      ? "text-zinc-400"
                                      : "text-zinc-100 group-hover:text-[#39ff14]"
                                  }`}
                                >
                                  {task.title}
                                </h4>
                                <p className="text-[11px] text-zinc-500 mt-1 max-w-[240px] leading-relaxed">
                                  {task.description ||
                                    "Contribute to the network growth to unlock your allocation."}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`text-sm font-mono font-bold ${
                                  task.status === "completed"
                                    ? "text-zinc-600"
                                    : "text-[#39ff14]"
                                }`}
                              >
                                +{task.points}
                              </span>
                              <div className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mt-0.5">
                                Points
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                            <StatusBadge status={task.status} />
                            {task.status === "pending" && (
                              <ChevronRight
                                size={14}
                                className="text-zinc-600 group-hover:translate-x-1 transition-transform"
                              />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Background UI Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-[#39ff14]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-zinc-800/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
};

export default BlipAirdropHub;
