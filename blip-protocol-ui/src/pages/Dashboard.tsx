import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Twitter,
  Users,
  BookOpen,
  LogOut,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/Context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { publicKey, disconnect, connected, signTransaction } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();

  const walletAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...");

      // Disconnect wallet
      await disconnect();
      console.log("✅ Wallet disconnected");

      // Clear local auth state and call backend to clear HTTP-only cookie
      await logout();
      console.log("✅ Auth state cleared and cookie cleared");

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      navigate("/airdrop");
    } catch (error) {
      console.error("❌ Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    }
  };

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

  const completeTask = (groupIdx: number, taskId: number) => {
    const newTasks = [...userTasks];
    const task = newTasks[groupIdx].items.find((t) => t.id === taskId);

    if (task && task.status === "pending") {
      task.status = "under_review";
      setUserTasks(newTasks);

      // Simulate verification
      setTimeout(() => {
        const finalTasks = [...userTasks];
        const finalTask = finalTasks[groupIdx].items.find(
          (t) => t.id === taskId
        );
        if (finalTask) {
          finalTask.status = "completed";
          setPoints((prev) => prev + finalTask.points);
          setUserTasks(finalTasks);
        }
      }, 2000);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
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
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#39ff14] rounded-full shadow-[0_0_8px_#39ff14]" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Blip
              <span className="text-zinc-500 text-lg font-normal">.money</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
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
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="space-y-12">
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
      </main>

      {/* Global Background UI Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-[#39ff14]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-zinc-800/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
};

export default Dashboard;
