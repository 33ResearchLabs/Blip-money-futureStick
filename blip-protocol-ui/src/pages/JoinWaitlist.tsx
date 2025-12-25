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
} from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";

const BlipAirdropHub = () => {
  // Solana Wallet Integration
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();

  // Navigation & Identity State
  const [view, setView] = useState("landing"); // 'landing', 'waitlist', 'connect', 'dashboard'
  const [email, setEmail] = useState("");
  const [referral_code, setReferralCode] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Derived state from wallet
  const isWalletConnected = connected;
  const walletAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

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
      if (connected && publicKey && view === "connect") {
        setIsConnecting(true);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

        try {
          const response = await fetch(`${apiUrl}/api/save-user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              referral_code: referral_code,
              wallet_address: publicKey.toBase58(),
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save user data");
          }

          const data = await response.json();
          console.log("User data saved:", data);

          toast({
            title: "Success!",
            description: "Your wallet has been connected and data saved.",
          });

          // Move to dashboard after successful save
          setTimeout(() => {
            setView("dashboard");
            setIsConnecting(false);
          }, 1000);
        } catch (error) {
          console.error("Error saving user data:", error);

          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to save data. Please try again.",
          });

          setIsConnecting(false);
          // Still move to dashboard even if save fails
          setView("dashboard");
        }
      }
    };

    saveUserData();
  }, [connected, publicKey, view, email, referral_code]);

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
        {view === "landing" && (
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-12 lg:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39ff14]/5 border border-[#39ff14]/20 text-[#39ff14] text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39ff14]"></span>
              </span>
              Mainnet Alpha Live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Join the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
                Blip.money
              </span>{" "}
              Airdrop
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl">
              The first privacy-preserving institutional payment protocol. Build
              your on-chain reputation and earn allocation by participating in
              network testing.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setView("waitlist")}
                className="w-full sm:w-auto bg-[#39ff14] text-black px-10 py-4 rounded-sm font-black text-sm uppercase tracking-widest hover:bg-[#32e012] transition-all shadow-[0_10px_30px_-10px_rgba(57,255,20,0.3)] active:scale-95 flex items-center justify-center gap-2"
              >
                Join Waitlist <ChevronRight size={18} strokeWidth={3} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 w-full border-t border-zinc-900 pt-16">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-2">
                  18.4M
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">
                  Total Stake
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-2">142K</span>
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">
                  Wallets
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white mb-2">
                  $4.2B
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">
                  Total Vol
                </span>
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
