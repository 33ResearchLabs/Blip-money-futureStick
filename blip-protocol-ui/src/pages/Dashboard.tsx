import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  Twitter,
  XCircle,
  ExternalLink,
  Loader2,
  Coins,
  FileText,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Copy,
  Share2,
  Check,
  Link,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { airdropApi } from "@/services/Airdrop";
import WhitepaperQuiz from "@/components/WhitepaperQuiz";
import TelegramVerify from "@/components/TelegramVerify";
import ReferralModal from "@/components/ReferralModal";
import PointsHistoryModal from "@/components/PointsHistoryModal";
import DashboardNavbar from "@/components/DashboardNavbar";

// Task types matching backend
type TaskType = "TWITTER" | "TELEGRAM" | "QUIZ" | "WHITEPAPER" | "CUSTOM";
type TaskStatus = "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED";

// 4-Stage UI Flow:
// Stage 1: NOT_STARTED -> "Start Task" button
// Stage 2: PENDING -> "Follow/Join/Read" button (opens link)
// Stage 3: SUBMITTED -> "Verifying..." (auto-submitted after action)
// Stage 4: VERIFIED -> "Earned +50" (completed)

interface Task {
  _id: string;
  task_type: TaskType;
  status: TaskStatus;
  proof_data?: {
    post_url?: string;
    screenshot_url?: string;
    text_proof?: string;
  };
  completedAt?: string;
}

// Task configuration with links and action labels
const TASK_CONFIG: Record<TaskType, { actionLabel: string; link: string }> = {
  TWITTER: {
    actionLabel: "Follow",
    link: "https://twitter.com/intent/follow?screen_name=blipmoney_",
  },
  TELEGRAM: {
    actionLabel: "Join",
    link: "https://t.me/+3DpHLzc2BfJhOWEx", // Replace with actual Telegram link
  },
  WHITEPAPER: {
    actionLabel: "Read",
    link: "https://www.blip.money/whitepaper.pdf", // Replace with actual whitepaper link
  },
  QUIZ: {
    actionLabel: "Start Quiz",
    link: "/quiz", // Or external quiz link
  },
  CUSTOM: {
    actionLabel: "Complete",
    link: "#",
  },
};

const Dashboard = () => {
  const { logout, user, refreshSession } = useAuth();
  const { publicKey, disconnect } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [whitepaperRead, setWhitepaperRead] = useState(false);
  const [showTelegramVerify, setShowTelegramVerify] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showPointsHistoryModal, setShowPointsHistoryModal] = useState(false);

  // Get points from user context (comes from /api/user/me)
  const blipPoints = user?.totalBlipPoints ?? 0;

  // Referral link
  const referralLink = user?.referralCode
    ? `${import.meta.env.VITE_FRONTEND_URL}/waitlist?ref=${user.referralCode}`
    : "";

  // Copy referral code to clipboard (just the code, not the full link)
  const handleCopyReferralCode = async () => {
    if (!user?.referralCode) return;

    try {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please copy the code manually.",
      });
    }
  };

  // Share referral link
  const handleShareReferral = async () => {
    if (!referralLink) return;

    const shareData = {
      title: "Join Blip Money",
      text: `Join Blip Money and earn rewards! Use my referral code: ${user?.referralCode}`,
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy code to clipboard
        await handleCopyReferralCode();
      }
    } catch (err) {
      // User cancelled share or error
      console.log("Share cancelled or failed");
    }
  };

  const displayWalletAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  // Fetch user's tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res: any = await airdropApi.getMyTasks();
        setTasks(res.tasks || []);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Get task status by type
  const getTaskStatus = (taskType: TaskType): TaskStatus | "NOT_STARTED" => {
    const task = tasks.find((t) => t.task_type === taskType);
    return task?.status || "NOT_STARTED";
  };

  const handleLogout = async () => {
    try {
      await disconnect();
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/waitlist");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    }
  };

  // Stage 1: Create task (moves to PENDING)
  const handleStartTask = async (taskType: TaskType) => {
    try {
      setLoading(true);

      // Create the task - status will be PENDING
      const createRes: any = await airdropApi.createTask({
        task_type: taskType,
      });
      const newTask = createRes.task;

      // Update local state
      setTasks((prev) => [
        ...prev.filter((t) => t.task_type !== taskType),
        newTask,
      ]);

      toast({
        title: "Task Started",
        description: `Now complete the action to earn points.`,
      });
    } catch (err: any) {
      if (err?.response?.status === 409) {
        toast({
          title: "Task Already Started",
          description: "You have already started this task.",
        });
        // Refresh tasks to get current state
        const res: any = await airdropApi.getMyTasks();
        setTasks(res.tasks || []);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: err?.response?.data?.message || "Failed to start task",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Stage 2: Complete action (Follow/Join/Read) and submit for verification
  const handleCompleteAction = async (taskType: TaskType) => {
    const task = tasks.find((t) => t.task_type === taskType);
    if (!task) return;

    const config = TASK_CONFIG[taskType];

    // Special handling for WHITEPAPER - open link and mark as read
    if (taskType === "WHITEPAPER") {
      window.open(config.link, "_blank");
      setWhitepaperRead(true);
      toast({
        title: "Whitepaper Opened",
        description:
          "Read the whitepaper, then complete the quiz to earn points.",
      });
      return;
    }

    // Special handling for TELEGRAM - show verification dialog
    if (taskType === "TELEGRAM") {
      setShowTelegramVerify(true);
      return;
    }

    // Open the link in new tab
    window.open(config.link, "_blank");

    // Wait a moment then submit for verification
    setTimeout(async () => {
      try {
        setLoading(true);

        // Submit the task for verification
        await airdropApi.submitTask(task._id);

        // Update local state to SUBMITTED
        setTasks((prev) =>
          prev.map((t) =>
            t.task_type === taskType ? { ...t, status: "SUBMITTED" } : t
          )
        );

        toast({
          title: "Verifying...",
          description: "Your action is being verified. Please wait.",
        });
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err?.response?.data?.message || "Failed to submit task",
        });
      } finally {
        setLoading(false);
      }
    }, 2000); // Wait 2 seconds after opening link
  };

  // Handle Telegram verification
  const handleTelegramVerify = async (telegramUserId: string) => {
    const task = tasks.find((t) => t.task_type === "TELEGRAM");
    if (!task) return;

    const res: any = await airdropApi.verifyTelegram(task._id, telegramUserId);

    if (res.success) {
      // Update local state
      setTasks((prev) =>
        prev.map((t) =>
          t.task_type === "TELEGRAM" ? { ...t, status: "VERIFIED" } : t
        )
      );

      // Refresh user to get updated points
      await refreshSession();

      toast({
        title: "Telegram Verified!",
        description: `You earned ${res.pointsAwarded || 50} points!`,
      });

      setShowTelegramVerify(false);
    }
  };

  // Handle quiz completion
  const handleQuizComplete = async (score: number, answers: number[]) => {
    const task = tasks.find((t) => t.task_type === "WHITEPAPER");
    if (!task) return;

    try {
      // Submit quiz answers to backend
      const res: any = await airdropApi.submitQuiz(task._id, {
        score,
        answers,
      });

      if (res.success) {
        // Update local state
        setTasks((prev) =>
          prev.map((t) =>
            t.task_type === "WHITEPAPER" ? { ...t, status: "VERIFIED" } : t
          )
        );

        // Refresh user to get updated points
        await refreshSession();

        toast({
          title: "Quiz Completed!",
          description: `You earned ${res.pointsAwarded || 50} points!`,
        });
      }

      setShowQuiz(false);
      setWhitepaperRead(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Quiz Failed",
        description:
          err?.response?.data?.message ||
          "You need at least 4/5 correct answers.",
      });
    }
  };

  // Task Card Component with 4-Stage Flow
  const TaskCard = ({
    taskType,
    title,
    description,
    points,
    icon,
  }: {
    taskType: TaskType;
    title: string;
    description?: string;
    points: number;
    icon?: React.ReactNode;
  }) => {
    const status = getTaskStatus(taskType);
    const config = TASK_CONFIG[taskType];

    // Render action button based on stage
    const renderActionButton = () => {
      switch (status) {
        // Stage 1: Not started - Show "Start Task"
        case "NOT_STARTED":
          return (
            <button
              onClick={() => handleStartTask(taskType)}
              disabled={loading}
              className="px-4 py-2 rounded font-bold transition bg-zinc-700 text-white hover:bg-zinc-600 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Processing...
                </span>
              ) : (
                "Start Task"
              )}
            </button>
          );

        // Stage 2: Pending - Show action button (Follow/Join/Read)
        case "PENDING":
          // Special handling for WHITEPAPER - show quiz button after reading
          if (taskType === "WHITEPAPER" && whitepaperRead) {
            return (
              <button
                onClick={() => setShowQuiz(true)}
                className="px-4 py-2 rounded font-bold transition bg-[#39ff14] text-black hover:bg-[#2fe610] flex items-center gap-2"
              >
                <HelpCircle size={14} />
                Take Quiz
              </button>
            );
          }

          return (
            <button
              onClick={() => handleCompleteAction(taskType)}
              disabled={loading}
              className="px-4 py-2 rounded font-bold transition bg-[#39ff14] text-black hover:bg-[#2fe610] disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Processing...
                </span>
              ) : (
                <>
                  {config.actionLabel}
                  <ExternalLink size={14} />
                </>
              )}
            </button>
          );

        // Stage 3: Submitted - Show "Awaiting Approval"
        case "SUBMITTED":
          return (
            <span
              className="flex items-center gap-2 px-4 py-2 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-help relative group/tooltip"
              title="Admin will review and approve your submission"
            >
              <Clock size={14} />
              Awaiting Approval
              {/* Tooltip on hover */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 text-zinc-300 text-xs rounded border border-zinc-700 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
                Admin will review and approve
              </span>
            </span>
          );

        // Stage 4: Verified - Show "Earned"
        case "VERIFIED":
          return (
            <span className="flex items-center gap-2 px-4 py-2 rounded font-bold bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/30">
              <Coins size={14} />
              Earned +{points}
            </span>
          );

        // Rejected - Show retry option
        case "REJECTED":
          return (
            <span className="flex items-center gap-2 px-4 py-2 rounded font-bold bg-red-500/20 text-red-400 border border-red-500/30">
              <XCircle size={14} />
              Rejected
            </span>
          );

        default:
          return null;
      }
    };

    // Progress indicator
    const getStageNumber = () => {
      switch (status) {
        case "NOT_STARTED":
          return 1;
        case "PENDING":
          return 2;
        case "SUBMITTED":
          return 3;
        case "VERIFIED":
          return 4;
        default:
          return 0;
      }
    };

    const stage = getStageNumber();

    return (
      <div className="group text-left p-6 bg-zinc-900/30 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-all">
        {/* Progress Steps */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full transition-all ${
                step <= stage
                  ? step === 4
                    ? "bg-[#39ff14]"
                    : "bg-[#39ff14]/60"
                  : "bg-zinc-800"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            {icon && (
              <div
                className={`w-10 h-10 rounded flex items-center justify-center transition-all ${
                  status === "VERIFIED"
                    ? "bg-[#39ff14]/20 text-[#39ff14]"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {status === "VERIFIED" ? <CheckCircle2 size={16} /> : icon}
              </div>
            )}
            <div>
              <h4
                className={`font-bold transition-colors ${
                  status === "VERIFIED"
                    ? "text-[#39ff14]"
                    : "text-zinc-100 group-hover:text-[#39ff14]"
                }`}
              >
                {title}
              </h4>
              {description && (
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-sm font-mono font-bold ${
                status === "VERIFIED" ? "text-[#39ff14]" : "text-zinc-500"
              }`}
            >
              +{points}
            </span>
            <div className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">
              Points
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
          {renderActionButton()}

          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">
            {status === "NOT_STARTED" && "Step 1/4"}
            {status === "PENDING" && "Step 2/4"}
            {status === "SUBMITTED" && "Step 3/4"}
            {status === "VERIFIED" && "Complete"}
            {status === "REJECTED" && "Failed"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      {/* Quiz Modal */}
      {showQuiz && (
        <WhitepaperQuiz
          onComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Telegram Verify Modal */}
      {showTelegramVerify && (
        <TelegramVerify
          onVerify={handleTelegramVerify}
          onClose={() => setShowTelegramVerify(false)}
          telegramLink={TASK_CONFIG.TELEGRAM.link}
        />
      )}

      {/* Referral Modal */}
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        referralCode={user?.referralCode || ""}
        referralLink={referralLink}
      />

      {/* Points History Modal */}
      <PointsHistoryModal
        isOpen={showPointsHistoryModal}
        onClose={() => setShowPointsHistoryModal(false)}
        totalPoints={blipPoints}
      />

      {/* Navigation */}
      <DashboardNavbar
        walletAddress={displayWalletAddress}
        blipPoints={blipPoints}
        onLogout={handleLogout}
      />

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
            <div
              onClick={() => setShowPointsHistoryModal(true)}
              className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm relative overflow-hidden hover:border-[#39ff14]/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  Accumulated Points
                </span>
                <span className="text-[10px] text-zinc-600 group-hover:text-[#39ff14] transition-colors">
                  View history →
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#39ff14] tracking-tighter tabular-nums">
                  {blipPoints}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-800">
                <div
                  className="h-full bg-[#39ff14] transition-all duration-1000"
                  style={{
                    width: `${Math.min((blipPoints / 4000) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-2">
                Protocol Status
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {user?.status === "ACTIVE"
                    ? "Active Participant"
                    : "Waitlisted"}
                </span>
              </div>
            </div>
            <div
              onClick={() => setShowReferralModal(true)}
              className="bg-[#39ff14]/5 border border-[#39ff14]/10 p-6 rounded-sm hover:bg-[#39ff14]/10 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#39ff14]">
                  Your Referral Code
                </span>
                <span className="text-xs font-bold text-[#39ff14]">
                  +100 pts per referral
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-lg font-mono font-bold text-white tracking-wider">
                  {user?.referralCode || "—"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyReferralCode();
                    }}
                    className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-[#39ff14]/50 transition-all"
                    title="Copy referral code"
                  >
                    {copied ? (
                      <Check size={14} className="text-[#39ff14]" />
                    ) : (
                      <Copy
                        size={14}
                        className="text-zinc-400 hover:text-[#39ff14]"
                      />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareReferral();
                    }}
                    className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-[#39ff14]/50 transition-all"
                    title="Share referral link"
                  >
                    <Share2
                      size={14}
                      className="text-zinc-400 hover:text-[#39ff14]"
                    />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-800/50 flex items-center justify-between">
                <p className="text-[10px] text-zinc-500 truncate flex-1">
                  {referralLink || "Generate your referral link"}
                </p>
                <span className="text-[10px] text-zinc-600 group-hover:text-[#39ff14] transition-colors ml-2">
                  Click to view referrals →
                </span>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Available Tasks
              </h2>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Complete tasks to earn points
              </div>
            </div>

            <div className="space-y-10">
              {/* Social Verification Tasks */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">
                    Social Verification
                  </span>
                  <div className="h-px w-full bg-zinc-900" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TaskCard
                    taskType="TWITTER"
                    title="Follow Blip on Twitter"
                    description="Follow our official Twitter account for updates."
                    points={50}
                    icon={<Twitter size={16} />}
                  />

                  <TaskCard
                    taskType="TELEGRAM"
                    title="Join Telegram Community"
                    description="Join our global Telegram group."
                    points={50}
                    icon={<MessageCircle size={16} />}
                  />
                </div>
              </div>

              {/* Education Tasks */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">
                    Education
                  </span>
                  <div className="h-px w-full bg-zinc-900" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TaskCard
                    taskType="WHITEPAPER"
                    title="Read Whitepaper & Quiz"
                    description="Read the whitepaper and complete a 5-question quiz to earn points."
                    points={50}
                    icon={<BookOpen size={16} />}
                  />
                </div>
              </div>

              <section>
                <div className="flex items-center gap-6 mb-10 opacity-90">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-700 whitespace-nowrap">
                    CORE PROTOCOL (COMING SOON)
                  </h3>
                  <div className="h-px flex-1 bg-zinc-900/20"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-zinc-950/40 border border-zinc-800/40 rounded-sm flex flex-col justify-between">
                    <div className="mb-10 flex gap-6">
                      <div className="w-12 h-12 bg-zinc-900 text-zinc-800 flex items-center justify-center rounded-sm">
                        <i data-lucide="globe" className="w-5 h-5"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold tracking-tight text-zinc-500">
                            Join Testnet Alpha
                          </h4>
                          <span className="font-mono text-xs font-bold text-zinc-800">
                            +1000
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-zinc-600 font-medium">
                          Test core features and earn highest participation
                          tier.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-900/30">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 bg-zinc-800/30 px-2 py-1 rounded-sm border border-zinc-700/50">
                        <i data-lucide="lock" className="w-3 h-3"></i> Coming
                        Soon.
                      </span>
                    </div>
                  </div>

                  <div className="p-8 bg-zinc-950/40 border border-zinc-800/40 rounded-sm flex flex-col justify-between">
                    <div className="mb-10 flex gap-6">
                      <div className="w-12 h-12 bg-zinc-900 text-zinc-800 flex items-center justify-center rounded-sm">
                        <i data-lucide="lock" className="w-5 h-5"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold tracking-tight text-zinc-500">
                            Initialize Private Vault
                          </h4>
                          <span className="font-mono text-xs font-bold text-zinc-800">
                            +500
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-zinc-600 font-medium">
                          Setup your first encrypted liquidity vault.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-900/30">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 bg-zinc-800/30 px-2 py-1 rounded-sm border border-zinc-700/50">
                        <i data-lucide="lock" className="w-3 h-3"></i> Coming
                        Soon.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-6 mb-10 opacity-90">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-700 whitespace-nowrap">
                    ACTIVITY & CONTRIBUTION (COMING SOON)
                  </h3>
                  <div className="h-px flex-1 bg-zinc-900/20"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-8 bg-zinc-950/40 border border-zinc-800/40 rounded-sm flex flex-col justify-between">
                    <div className="mb-10 flex gap-6">
                      <div className="w-12 h-12 bg-zinc-900 text-zinc-800 flex items-center justify-center rounded-sm">
                        <i data-lucide="trending-up" className="w-5 h-5"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold tracking-tight text-zinc-500">
                            Trade & Earn
                          </h4>
                          <span className="font-mono text-xs font-bold text-zinc-800">
                            +1500
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                          Generate volume on the testnet or mainnet alpha.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-900/30">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Locked.
                      </span>
                    </div>
                  </div>

                  <div className="p-8 bg-zinc-950/40 border border-zinc-800/40 rounded-sm flex flex-col justify-between">
                    <div className="mb-10 flex gap-6">
                      <div className="w-12 h-12 bg-zinc-900 text-zinc-800 flex items-center justify-center rounded-sm">
                        <i data-lucide="droplets" className="w-5 h-5"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold tracking-tight text-zinc-500">
                            Provide Liquidity
                          </h4>
                          <span className="font-mono text-xs font-bold text-zinc-800">
                            +2000
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                          Strengthen the protocol by staking in pools.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-900/30">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Locked.
                      </span>
                    </div>
                  </div>

                  <div className="p-8 bg-zinc-950/40 border border-zinc-800/40 rounded-sm flex flex-col justify-between">
                    <div className="mb-10 flex gap-6">
                      <div className="w-12 h-12 bg-zinc-900 text-zinc-800 flex items-center justify-center rounded-sm">
                        <i data-lucide="coins" className="w-5 h-5"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold tracking-tight text-zinc-500">
                            Deposit Vaults
                          </h4>
                          <span className="font-mono text-xs font-bold text-zinc-800">
                            +1200
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                          Commit capital into protocol secure vaults.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-900/30">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Locked.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-6 mb-10 opacity-90">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-700 whitespace-nowrap">
                    GOVERNANCE & SECURITY (COMING SOON)
                  </h3>
                  <div className="h-px flex-1 bg-zinc-900/20"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-8 bg-zinc-950/40 border border-zinc-800/40 rounded-sm flex flex-col justify-between">
                    <div className="mb-10 flex gap-6">
                      <div className="w-12 h-12 bg-zinc-900 text-zinc-800 flex items-center justify-center rounded-sm">
                        <i data-lucide="gavel" className="w-5 h-5"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold tracking-tight text-zinc-500">
                            Snapshot Vote
                          </h4>
                          <span className="font-mono text-xs font-bold text-zinc-800">
                            +400
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                          Participate in mock proposals for DAO readiness.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-900/30">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Locked.
                      </span>
                    </div>
                  </div>

                  <div className="p-8 bg-zinc-950/40 border border-zinc-800/40 rounded-sm flex flex-col justify-between">
                    <div className="mb-10 flex gap-6">
                      <div className="w-12 h-12 bg-zinc-900 text-zinc-800 flex items-center justify-center rounded-sm">
                        <i data-lucide="bug" className="w-5 h-5"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold tracking-tight text-zinc-500">
                            Report Bug
                          </h4>
                          <span className="font-mono text-xs font-bold text-zinc-800">
                            +5000
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                          Submit valid safety reports to improve security.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-900/30">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Locked.
                      </span>
                    </div>
                  </div>

                  <div className="p-8 bg-zinc-950/40 border border-zinc-800/40 rounded-sm flex flex-col justify-between">
                    <div className="mb-10 flex gap-6">
                      <div className="w-12 h-12 bg-zinc-900 text-zinc-800 flex items-center justify-center rounded-sm">
                        <i data-lucide="store" className="w-5 h-5"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold tracking-tight text-zinc-500">
                            Merchant Trial
                          </h4>
                          <span className="font-mono text-xs font-bold text-zinc-800">
                            +2500
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-600 font-medium">
                          Test merchant payment flows as early adopter.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-900/30">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Locked.
                      </span>
                    </div>
                  </div>
                </div>
              </section>
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
