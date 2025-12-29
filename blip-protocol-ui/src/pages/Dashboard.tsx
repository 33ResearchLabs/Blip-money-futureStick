import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Twitter,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { airdropApi } from "@/services/Airdrop";

const Dashboard = () => {
  const { logout, user } = useAuth();
  const { publicKey, disconnect } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [walletConnected, setWalletConnected] = useState(false);
  const [taskStatus, setTaskStatus] = useState({
    TWITTER_FOLLOW: "pending",
    TELEGRAM_JOIN: "pending",
    WHITEPAPER_READ: "pending",
    CROSS_BORDER_SWAP: "pending",
  });

  const displayWalletAddress = publicKey
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

  const [blipPoints, setBlipPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setLoading(true);
        const res = await airdropApi.getMyPoints();
        setBlipPoints(res.data.points);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load points");
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#39ff14] bg-[#39ff14]/10 px-2 py-1 rounded border border-[#39ff14]/20">
            <CheckCircle2 size={12} /> Claimed
          </span>
        );

      case "pending":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
            Start Task
          </span>
        );

      case "under_review":
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 animate-pulse">
            <Clock size={12} /> Verifying…
          </span>
        );

      default:
        return null;
    }
  };

  //Wallet Connect
  const handleConnectWallet = async () => {
    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet first",
      });
      return;
    }

    try {
      setLoading(true);

      await airdropApi.connectWallet(publicKey.toBase58());

      setWalletConnected(true);

      toast({
        title: "Wallet Connected",
        description: "Wallet connected successfully",
      });
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setWalletConnected(true);
        toast({
          title: "Wallet Already Connected",
          description: err.response.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            err?.response?.data?.message || "Failed to connect wallet",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Apply Bonous

  const handleApplyBonus = async (label: string) => {
    try {
      setLoading(true);

      const res = await airdropApi.applyBonus(label);

      setTaskStatus((prev) => ({
        ...prev,
        [label]: "completed",
      }));

      setBlipPoints(res.totalPoints);

      toast({
        title: "Bonus Applied",
        description: `+${res.addedPoints} points added`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: err?.response?.data?.message || "Bonus already claimed",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get status of bonus points
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const res = await airdropApi.fetchStatus();
        setTaskStatus(res.actions);
      } catch (err) {
        console.error("Failed to fetch bonus status", err);
      }
    };

    loadStatus();
  }, []);

  // get status of wallet connected or not
  useEffect(() => {
    const fetchWalletStatus = async () => {
      try {
        const res: any = await airdropApi.getWalletStatus();
        // res is already response.data due to axios interceptor
        setWalletConnected(!!res.connected);
      } catch (err) {
        setWalletConnected(false);
      }
    };

    fetchWalletStatus();
  }, []);
  console.log(user);
  return (
    <>
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
                <span className="text-zinc-500 text-lg font-normal">
                  .money
                </span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-6 mr-4 border-r border-zinc-800 pr-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase tracking-tighter text-zinc-500 font-bold">
                    Protocol Balance
                  </span>
                  <span className="text-[#39ff14] font-mono text-sm font-bold">
                    {blipPoints} pts
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold leading-none mb-1">
                    Authenticated
                  </span>
                  <span className="text-zinc-200 font-mono text-xs">
                    {displayWalletAddress}
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
                    {displayWalletAddress}
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
                    {blipPoints}
                  </span>
                </div>
                {/* Micro progress bar */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-800">
                  <div
                    className="h-full bg-[#39ff14] transition-all duration-1000"
                    style={{ width: `${(blipPoints / 4000) * 100}%` }}
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
                    Your Referral Code
                  </span>
                  <span className="text-lg font-mono font-bold text-white tracking-wider">
                    {user?.referralCode || "—"}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                    Bonus
                  </span>
                  <span className="text-xs font-bold text-[#39ff14]">+15%</span>
                </div>
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
                {/* ================= CORE TASKS ================= */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">
                      Core Tasks
                    </span>
                    <div className="h-px w-full bg-zinc-900" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card 1 */}
                    <div className="group text-left p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-bold text-zinc-100 group-hover:text-[#39ff14]">
                            Initialize Private Vault
                          </h4>
                          <p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]">
                            Set up your first encrypted liquidity vault on the
                            Blip network.
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-[#39ff14]">
                            +500
                          </span>
                          <div className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">
                            Points
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                        {walletConnected ? (
                          <StatusBadge status="completed" />
                        ) : (
                          <button
                            onClick={handleConnectWallet}
                            disabled={loading}
                            className="px-4 py-2 rounded font-bold transition bg-[#39ff14] text-black hover:bg-[#2fe610]"
                          >
                            {loading ? "Connecting..." : "Connect Wallet"}
                          </button>
                        )}

                        <ChevronRight
                          size={14}
                          className={`text-zinc-600 transition-transform ${
                            !walletConnected ? "group-hover:translate-x-1" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group text-left p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-bold text-zinc-100 group-hover:text-[#39ff14]">
                            Execute Cross-Border Swap
                          </h4>
                          <p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]">
                            Complete a transaction exceeding $100 equivalent in
                            volume.
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-[#39ff14]">
                            +750
                          </span>
                          <div className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">
                            Points
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                        {/* ACTION BUTTON */}
                        <button
                          onClick={() =>
                            taskStatus.CROSS_BORDER_SWAP === "pending" &&
                            handleApplyBonus("CROSS_BORDER_SWAP")
                          }
                          disabled={taskStatus.CROSS_BORDER_SWAP !== "pending"}
                          className={`group flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-bold uppercase tracking-wider transition-all
      ${
        taskStatus.CROSS_BORDER_SWAP === "completed"
          ? "border-[#39ff14]/30 text-[#39ff14] bg-[#39ff14]/10 cursor-default"
          : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-200"
      }`}
                        >
                          <StatusBadge status={taskStatus.CROSS_BORDER_SWAP} />
                        </button>

                        {/* CHEVRON */}
                        <ChevronRight
                          size={14}
                          className={`transition-transform text-zinc-600
      ${
        taskStatus.CROSS_BORDER_SWAP === "pending"
          ? "group-hover:translate-x-1"
          : ""
      }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= SOCIAL VERIFICATION ================= */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">
                      Social Verification
                    </span>
                    <div className="h-px w-full bg-zinc-900" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group text-left p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-500">
                            <Twitter size={16} />
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-100 group-hover:text-[#39ff14]">
                              Follow Blip Institutional
                            </h4>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-[#39ff14]">
                            +100
                          </span>
                          <div className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">
                            Points
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                        <button
                          onClick={() => handleApplyBonus("TWITTER_FOLLOW")}
                          disabled={taskStatus.TWITTER_FOLLOW !== "pending"}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-bold uppercase tracking-wider transition-all
    ${
      taskStatus.TWITTER_FOLLOW === "completed"
        ? "border-[#39ff14]/30 text-[#39ff14] bg-[#39ff14]/10 cursor-default"
        : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
    }
  `}
                        >
                          <StatusBadge status={taskStatus.TWITTER_FOLLOW} />
                        </button>

                        <ChevronRight
                          size={14}
                          className={`text-zinc-600 transition-transform ${
                            taskStatus.TWITTER_FOLLOW === "pending"
                              ? "group-hover:translate-x-1"
                              : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="group text-left p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-500">
                            <Users size={16} />
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-100 group-hover:text-[#39ff14]">
                              Join Global Telegram
                            </h4>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-[#39ff14]">
                            +100
                          </span>
                          <div className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">
                            Points
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                        <button
                          onClick={() => handleApplyBonus("TELEGRAM_JOIN")}
                          disabled={taskStatus.TELEGRAM_JOIN !== "pending"}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-bold uppercase tracking-wider transition-all
    ${
      taskStatus.TELEGRAM_JOIN === "completed"
        ? "border-[#39ff14]/30 text-[#39ff14] bg-[#39ff14]/10 cursor-default"
        : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
    }
  `}
                        >
                          <StatusBadge status={taskStatus.TELEGRAM_JOIN} />
                        </button>

                        <ChevronRight size={14} className="text-zinc-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= Education & Governance ================= */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">
                      Education & Governance
                    </span>
                    <div className="h-px w-full bg-zinc-900" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card 1 */}
                    <div className="group text-left p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-bold text-zinc-100 group-hover:text-[#39ff14]">
                            Read Whitepaper 2.0
                          </h4>
                          <p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]"></p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-[#39ff14]">
                            +200
                          </span>
                          <div className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">
                            Points
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                        <button
                          onClick={() => handleApplyBonus("WHITEPAPER_READ")}
                          disabled={taskStatus.WHITEPAPER_READ !== "pending"}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-bold uppercase tracking-wider transition-all
    ${
      taskStatus.WHITEPAPER_READ === "completed"
        ? "border-[#39ff14]/30 text-[#39ff14] bg-[#39ff14]/10 cursor-default"
        : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
    }
  `}
                        >
                          <StatusBadge status={taskStatus.WHITEPAPER_READ} />
                        </button>

                        <ChevronRight
                          size={14}
                          className="text-zinc-600 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group text-left p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-bold text-zinc-100 group-hover:text-[#39ff14]">
                            Stake BLIP for Voting
                          </h4>
                          <p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]">
                            Participate in the Q1 Protocol Governance vote.
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-[#39ff14]">
                            +1000
                          </span>
                          <div className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">
                            Points
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                        <StatusBadge status="pending" />
                        <ChevronRight
                          size={14}
                          className="text-zinc-600 group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
    </>
  );
};

export default Dashboard;
