import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  CheckCircle,
  Star,
  Search,
  Bell,
  Settings,
  ChevronDown,
  Plus,
  Copy,
  ArrowUpRight,
  CircleCheck,
  Layout,
  Share2,
  Command,
  Moon,
  Sun,
  TrendingUp,
  Globe,
  CheckCircle2,
  Zap,
  Trophy,
  MessageCircle,
  Hash,
  Repeat2,
  Link,
  Send,
  ChevronLeft,
  ChevronRight,
  QrCode,
  BarChart3,
  LogOut,
  Loader2,
  ShieldCheck,
  User,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Wallet,
  Shield,
  Rocket,
  ChevronUp,
  Menu,
  Download,
  Check,
  KeyRound,
  Gift,
  ArrowRight,
  Crown,
  Users,
  UserPlus,
  Award,
  Info,
  Target,
  BadgeCheck,
  Sparkles,
  Store,
  ExternalLink,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { airdropApi } from "@/services/Airdrop";
import { api } from "@/services/api";
import { Logo } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import TwitterVerificationModal from "@/components/TwitterVerificationModal";
import TelegramVerificationModal from "@/components/TelegramVerificationModal";
import ReferralModal from "@/components/ReferralModal";
import RetweetVerificationModal from "@/components/RetweetVerificationModal";
import XFollowVerificationModal from "@/components/XFollowVerificationModal";
import WalletLinkingModal from "@/components/WalletLinkingModal";
import PointsHistoryModal from "@/components/PointsHistoryModal";
import { MerchantWalletButton } from "@/components/wallet/MerchantWalletButton";
import { twoFactorApi } from "@/services/twoFatctor";
import { toast } from "sonner";
import { useAutoRefreshLeaderboard } from "@/hooks/useAutoRefreshLeaderboard";

// ── Types ────────────────────────────────────────────────────────────────────
interface ActivityEntry {
  id: string;
  event: string;
  icon: string;
  amount: number;
  desc: string;
  merchant: string;
  wallet: string;
  time: string;
}

const typeColors: Record<string, { bg: string; text: string; border: string }> =
  {
    check: {
      bg: "bg-black/5 dark:bg-white/5",
      text: "text-black dark:text-white",
      border: "border-black/10 dark:border-white/10",
    },
    harvest: {
      bg: "bg-black/5 dark:bg-white/5",
      text: "text-black/70 dark:text-white/70",
      border: "border-black/10 dark:border-white/10",
    },
    liquidity: {
      bg: "bg-black/5 dark:bg-white/5",
      text: "text-black/60 dark:text-white/60",
      border: "border-black/10 dark:border-white/10",
    },
    commit: {
      bg: "bg-black/5 dark:bg-white/5",
      text: "text-black/50 dark:text-white/50",
      border: "border-black/10 dark:border-white/10",
    },
  };

// Twitter brand logo — lucide doesn't ship one
const XBrand = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TypeIcon = ({ type }: { type: string }) => {
  const c = typeColors[type] ?? typeColors.check;
  if (type === "check") {
    return (
      <div
        className={`w-8 h-8 ${c.bg} rounded-lg flex items-center justify-center border ${c.border}`}
      >
        <CheckCircle2 className={`w-4 h-4 ${c.text}`} />
      </div>
    );
  }
  if (type === "harvest") {
    return (
      <div
        className={`w-8 h-8 ${c.bg} rounded-lg flex items-center justify-center border ${c.border}`}
      >
        <BarChart3 className={`w-4 h-4 ${c.text}`} />
      </div>
    );
  }
  if (type === "liquidity") {
    return (
      <div
        className={`w-8 h-8 ${c.bg} rounded-lg flex items-center justify-center border ${c.border}`}
      >
        <Zap className={`w-4 h-4 ${c.text}`} />
      </div>
    );
  }
  return (
    <div
      className={`w-8 h-8 ${c.bg} rounded-lg flex items-center justify-center border ${c.border}`}
    >
      <TrendingUp className={`w-4 h-4 ${c.text}`} />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
export default function MerchantDashboard() {
  const navigate = useNavigate();
  const {
    user,
    logout,
    isAuthenticated,
    isLoading,
    updatePoints,
    refreshSession,
  } = useAuth();

  const { resolvedTheme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("All");
  const [activityTab, setActivityTab] = useState("All");
  const [lbFilter, setLbFilter] = useState("Points");
  const [analyticsTab, setAnalyticsTab] = useState("Priority Fee Reduction");
  const [copied, setCopied] = useState(false);
  const [feePercent] = useState(72);
  const [globalSearch, setGlobalSearch] = useState("");

  // Wallet
  const [showWalletLinkingModal, setShowWalletLinkingModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Modal states
  const [showTwitterModal, setShowTwitterModal] = useState(false);
  const [showXFollowModal, setShowXFollowModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showRetweetModal, setShowRetweetModal] = useState(false);
  const [showPointsHistoryModal, setShowPointsHistoryModal] = useState(false);

  // Settings dropdown & 2FA modal
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // 2FA state
  const [twoFaQrCode, setTwoFaQrCode] = useState<string | null>(null);
  const [twoFaManualKey, setTwoFaManualKey] = useState<string | null>(null);
  const [twoFaCopiedKey, setTwoFaCopiedKey] = useState(false);
  const [twoFaOtp, setTwoFaOtp] = useState("");
  const [twoFaDisableOtp, setTwoFaDisableOtp] = useState("");
  const [twoFaShowDisable, setTwoFaShowDisable] = useState(false);
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [twoFaRecoveryCodes, setTwoFaRecoveryCodes] = useState<string[] | null>(
    null,
  );
  const [twoFaShowRegenerate, setTwoFaShowRegenerate] = useState(false);
  const [twoFaRegenOtp, setTwoFaRegenOtp] = useState("");

  // Account modal state
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  // P2P App Test banner
  const [showP2PBanner, setShowP2PBanner] = useState(true);

  // Mobile menu
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Commit Volume modal
  const [showCommitVolumeModal, setShowCommitVolumeModal] = useState(false);

  // How It Works modal
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [selectedCorridor, setSelectedCorridor] = useState("");
  const [customCorridor, setCustomCorridor] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("");
  const [commitLoading, setCommitLoading] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState(false);
  const [existingCommitment, setExistingCommitment] = useState<{
    corridor: string;
    volumeRange: string;
  } | null>(null);

  // Quest completion tracking — "register" is always completed for merchants
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(
    new Set(["register"]),
  );
  const [referralCount, setReferralCount] = useState(0);
  const [retweetCount, setRetweetCount] = useState(0);
  const [retweetCooldownUntil, setRetweetCooldownUntil] = useState<Date | null>(
    null,
  );

  // Leaderboard with auto-refresh
  const {
    data: leaderboardRawData,
    isRefreshing: leaderboardLoading,
    lastRefreshed: leaderboardLastRefreshed,
    refresh: refreshLeaderboard,
  } = useAutoRefreshLeaderboard(isAuthenticated);

  const leaderboardData = useMemo(() => {
    let filtered = [...leaderboardRawData];

    // Global search filter
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          String(m.allocation).includes(q) ||
          String(m.followers).includes(q),
      );
    }

    if (lbFilter === "Followers") {
      filtered.sort((a, b) => b.followers - a.followers);
    } else {
      filtered.sort((a, b) => b.allocation - a.allocation);
    }
    filtered.forEach((e, i) => {
      e.rank = i + 1;
    });
    return filtered;
  }, [leaderboardRawData, lbFilter, globalSearch]);

  const [activityData, setActivityData] = useState<ActivityEntry[]>([]);
  const [activitySearch, setActivitySearch] = useState("");
  const [activitySort, setActivitySort] = useState<
    "newest" | "oldest" | "highest" | "lowest" | "name"
  >("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [activityLoading, setActivityLoading] = useState(true);
  const [pointsHistory, setPointsHistory] = useState<
    {
      id: string;
      points: number;
      event: string;
      eventLabel: string;
      date: string;
    }[]
  >([]);

  const d = resolvedTheme === "dark" || resolvedTheme === undefined;

  // Redirect to login if not authenticated.
  // Skip on the unprotected /merchant-dashboard-preview route so the team
  // can visually QA the dashboard without an account.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/merchant-dashboard-preview"
    ) {
      return;
    }
    if (!isLoading && !isAuthenticated) {
      navigate("/merchant-waitlist", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch referral count on mount
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const res: any = await airdropApi.getMyReferrals();
        const count = res.referrals?.length || 0;
        setReferralCount(count);
        if (count >= 1) {
          setCompletedQuests((prev) => new Set(prev).add("referral"));
        }
      } catch {
        // ignore
      }
    };
    if (isAuthenticated) fetchReferrals();
  }, [isAuthenticated]);

  // Fetch points history and mark completed quests
  useEffect(() => {
    const fetchPointsHistory = async () => {
      try {
        const res: any = await airdropApi.getMyPointsHistory();
        const history = res.history || [];
        setPointsHistory(history);

        // Mark quests as completed based on points history events
        const eventToQuest: Record<string, string> = {
          TWITTER_FOLLOW: "twitter",
          TELEGRAM_JOIN: "telegram",
        };
        const completed = new Set<string>();
        let retweetEntries: any[] = [];
        for (const entry of history) {
          if (entry.event === "RETWEET") {
            retweetEntries.push(entry);
          } else {
            const questId = eventToQuest[entry.event];
            if (questId) completed.add(questId);
          }
        }

        // Handle retweet: max 2 with 2-day cooldown
        const MAX_RETWEETS = 2;
        const COOLDOWN_MS = 2 * 24 * 60 * 60 * 1000;
        setRetweetCount(retweetEntries.length);
        if (retweetEntries.length >= MAX_RETWEETS) {
          completed.add("retweet");
        } else if (retweetEntries.length > 0) {
          // Check if cooldown is still active
          const lastRetweet = new Date(
            retweetEntries[0].createdAt || retweetEntries[0].date,
          );
          const cooldownEnd = new Date(lastRetweet.getTime() + COOLDOWN_MS);
          if (cooldownEnd > new Date()) {
            setRetweetCooldownUntil(cooldownEnd);
          }
        }

        if (completed.size > 0) {
          setCompletedQuests((prev) => {
            const merged = new Set(prev);
            completed.forEach((q) => merged.add(q));
            return merged;
          });
        }
      } catch {
        // ignore
      }
    };
    if (isAuthenticated) fetchPointsHistory();
  }, [isAuthenticated]);

  // Wallet linking is optional — the modal opens only when the user
  // explicitly clicks the "Link Wallet" button or the wallet status card.

  // Fetch activity feed
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setActivityLoading(true);
        const scope = activityTab === "My Activity" ? "mine" : "all";
        const res: any = await airdropApi.getMerchantActivity(
          scope as "all" | "mine",
        );
        setActivityData(res.activity || []);
      } catch {
        // ignore
      } finally {
        setActivityLoading(false);
      }
    };
    if (isAuthenticated) fetchActivity();
  }, [isAuthenticated, activityTab]);

  // Fetch existing volume commitment
  useEffect(() => {
    const fetchCommitment = async () => {
      try {
        const res: any = await api.get("/auth/commit-volume");
        if (res.commitment) {
          setExistingCommitment(res.commitment);
        }
      } catch {
        // ignore
      }
    };
    if (isAuthenticated) fetchCommitment();
  }, [isAuthenticated]);

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setShowSettingsMenu(false);
      }
    };
    if (showSettingsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettingsMenu]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    if (showSortDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSortDropdown]);

  // 2FA handlers
  const handleEnable2FA = async () => {
    try {
      const res = await twoFactorApi.enableGoogleAuth();
      setTwoFaQrCode(res.qrCode);
      setTwoFaManualKey(res.manualEntryKey);
      toast.success("Scan the QR code with your authenticator app");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to enable 2FA");
    }
  };

  const handleVerify2FAOtp = async () => {
    if (twoFaOtp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }
    try {
      setTwoFaLoading(true);
      const res = await twoFactorApi.verifyGoogleAuth(twoFaOtp);
      setTwoFaRecoveryCodes(res.recoveryCodes);
      setTwoFaQrCode(null);
      setTwoFaManualKey(null);
      setTwoFaOtp("");
      toast.success("2FA enabled! Save your recovery codes now.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to verify OTP");
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleDownloadRecoveryCodes = () => {
    if (!twoFaRecoveryCodes) return;
    const content = [
      "===========================================",
      "  BLIP MONEY - 2FA RECOVERY CODES",
      "===========================================",
      "",
      "  Keep these codes in a safe place.",
      "  Each code can only be used ONCE.",
      "",
      `  Generated: ${new Date().toLocaleDateString()}`,
      `  Account: ${user?.email}`,
      "",
      "-------------------------------------------",
      "",
      ...twoFaRecoveryCodes.map((code, i) => `  ${i + 1}.  ${code}`),
      "",
      "-------------------------------------------",
      "",
      "  If you lose access to your authenticator",
      "  app, use one of these codes to sign in.",
      "",
      "===========================================",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blip-money-recovery-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Recovery codes downloaded");
  };

  const handleConfirmRecoveryCodes = async () => {
    setTwoFaRecoveryCodes(null);
    await refreshSession();
    toast.success("2FA setup complete!");
  };

  const handleCopyManualKey = () => {
    if (!twoFaManualKey) return;
    navigator.clipboard.writeText(twoFaManualKey);
    setTwoFaCopiedKey(true);
    toast.success("Manual key copied");
    setTimeout(() => setTwoFaCopiedKey(false), 2000);
  };

  const handleRegenerateRecoveryCodes = async () => {
    if (twoFaRegenOtp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }
    try {
      setTwoFaLoading(true);
      const res = await twoFactorApi.regenerateRecoveryCodes(twoFaRegenOtp);
      setTwoFaRecoveryCodes(res.recoveryCodes);
      setTwoFaShowRegenerate(false);
      setTwoFaRegenOtp("");
      toast.success("New recovery codes generated!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to regenerate codes");
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (twoFaDisableOtp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }
    try {
      setTwoFaLoading(true);
      await twoFactorApi.disableGoogleAuth(twoFaDisableOtp);
      toast.success("2FA Disabled Successfully");
      setTwoFaDisableOtp("");
      setTwoFaShowDisable(false);
      await refreshSession();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setTwoFaLoading(false);
    }
  };

  const reset2FAModal = () => {
    setShow2FAModal(false);
    setTwoFaQrCode(null);
    setTwoFaManualKey(null);
    setTwoFaOtp("");
    setTwoFaDisableOtp("");
    setTwoFaShowDisable(false);
    setTwoFaShowRegenerate(false);
    setTwoFaRegenOtp("");
    // Don't reset recovery codes here — user might still be saving them
  };

  const referralCode = user?.referralCode || "";
  const referralLink = `${window.location.origin}/merchant-register?ref=${referralCode}`;
  const blipPoints = user?.totalBlipPoints || 0;
  const userEmail = user?.email || "";

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate("/merchant-waitlist");
  };

  const handleTwitterSuccess = (points: number) => {
    updatePoints(points);
    setCompletedQuests((prev) => new Set(prev).add("twitter"));
    setShowTwitterModal(false);
  };

  const handleXFollowSuccess = (points: number) => {
    updatePoints(points);
    // "Follow Us on Twitter" quest is satisfied by verifying the X follow
    setCompletedQuests((prev) => new Set(prev).add("twitter"));
    setShowXFollowModal(false);
  };

  const handleTelegramSuccess = (points: number) => {
    updatePoints(points);
    setCompletedQuests((prev) => new Set(prev).add("telegram"));
    setShowTelegramModal(false);
  };

  const handleRetweetSuccess = (points: number) => {
    updatePoints(points);
    const newCount = retweetCount + 1;
    setRetweetCount(newCount);
    // Set 2-day cooldown from now
    setRetweetCooldownUntil(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
    if (newCount >= 2) {
      setCompletedQuests((prev) => new Set(prev).add("retweet"));
    }
    setShowRetweetModal(false);
  };

  const handleQuestClick = (questId: string) => {
    if (completedQuests.has(questId)) return;
    if (
      questId === "retweet" &&
      retweetCooldownUntil &&
      retweetCooldownUntil > new Date()
    )
      return;
    // "Follow Us on Twitter" should verify a follow (X username), not a tweet share
    if (questId === "twitter") setShowXFollowModal(true);
    else if (questId === "telegram") setShowTelegramModal(true);
    else if (questId === "retweet") setShowRetweetModal(true);
    else if (questId === "referral") setShowReferralModal(true);
  };

  const recentActivity: {
    id: string;
    name: string;
    action: string;
    points: number | null;
    time: string;
    icon: any;
    bg: string;
    color: string;
  }[] = [
    {
      id: "a1",
      name: "John D.",
      action: "Completed KYC Verification",
      points: 250,
      time: "just now",
      icon: BadgeCheck,
      bg: "bg-emerald-500/10",
      color: "text-emerald-500",
    },
    {
      id: "a2",
      name: "Nova Merchants",
      action: "Earned from Referral",
      points: 50,
      time: "10 sec ago",
      icon: Store,
      bg: "bg-blue-500/10",
      color: "text-blue-500",
    },
    {
      id: "a3",
      name: "Sarah M.",
      action: "Completed Social Quest",
      points: 100,
      time: "30 sec ago",
      icon: Award,
      bg: "bg-amber-500/10",
      color: "text-amber-500",
    },
    {
      id: "a4",
      name: "Titan Merchants",
      action: "Reached 2,500 Points",
      points: null,
      time: "2 min ago",
      icon: Trophy,
      bg: "bg-purple-500/10",
      color: "text-purple-500",
    },
    {
      id: "a5",
      name: "Alex P.",
      action: "Joined Blip Money",
      points: 50,
      time: "3 min ago",
      icon: UserPlus,
      bg: "bg-sky-500/10",
      color: "text-sky-500",
    },
    {
      id: "a6",
      name: "Beacon Finance",
      action: "Earned from Referral",
      points: 50,
      time: "2 min ago",
      icon: Store,
      bg: "bg-[#cc785c]/10",
      color: "text-[#cc785c]",
    },
  ];

  const progressSteps: {
    id: number;
    title: string;
    desc: string;
    status: "done" | "active" | "todo";
  }[] = [
    {
      id: 1,
      title: "Join Waitlist",
      desc: "Stay updated with Blip Money",
      status: "done",
    },
    {
      id: 2,
      title: "Submit Google Form",
      desc: "Join our merchant onboarding program",
      status: existingCommitment ? "done" : "active",
    },
    {
      id: 3,
      title: "Complete Social Quests",
      desc: "Earn points by completing social quests",
      status: completedQuests.size >= 4 ? "done" : "active",
    },
    {
      id: 4,
      title: "Request for App",
      desc: "Be among the first to test our P2P app",
      status: "todo",
    },
  ];

  const socialQuests = [
    {
      id: "register",
      title: "Register Merchant",
      reward: "+2,000 BLIP",
      icon: CheckCircle2,
    },
    {
      id: "twitter",
      title: "Follow Us on Twitter",
      reward: "+500 BLIP",
      icon: XBrand,
    },
    {
      id: "telegram",
      title: "Follow Us on Telegram",
      reward: "+500 BLIP",
      icon: Users,
    },
    {
      id: "retweet",
      title: "Retweet a Post",
      reward: "+100 BLIP",
      icon: Repeat2,
    },
    {
      id: "referral",
      title: "Share Referral Link",
      reward: "+50 BLIP",
      icon: Send,
    },
  ];

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const questsCompleted = completedQuests.size;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/50 dark:text-white/50" />
      </div>
    );
  }

  // ── Theme tokens ─────────────────────────────────────────────────────────────
  const bg = d ? "bg-black" : "bg-[#FAF8F5]";
  const surface = d ? "bg-[#0f0f0f]" : "bg-white";
  const border = d ? "border-white/[0.06]" : "border-black/[0.06]";
  // Apple-style soft layered shadow on white cards (no-op in dark mode)
  const cardShadow = d ? "" : "shadow-[0_24px_60px_-30px_rgba(0,0,0,0.10),0_8px_24px_-16px_rgba(0,0,0,0.06)]";
  const txt = d ? "text-white" : "text-black";
  const muted = d ? "text-white/60" : "text-black/60";
  const sub = d ? "text-white/40" : "text-black/40";
  const hov = d ? "hover:bg-white/5" : "hover:bg-black/[0.03]";
  const inputBg = d ? "bg-white/5" : "bg-[#F5F3F0]";
  const divider = d ? "border-white/[0.06]" : "border-black/[0.06]";
  const chip = d
    ? "bg-white/5 border-white/10"
    : "bg-[#F5F3F0] border-black/[0.08]";
  const pillAct = d
    ? "bg-white/10 text-white"
    : "bg-white text-black shadow-sm";
  const pillIna = d
    ? "text-white/40 hover:text-white"
    : "text-black/40 hover:text-black";
  const gaugeEmpty = d ? "#1a1a1a" : "#e2e8f0";
  const accent = d ? "text-white" : "text-black";
  const accentBg = d ? "bg-white" : "bg-black";
  const accentBorder = d ? "border-white/20" : "border-black/20";
  const accentLight = d ? "bg-white/10" : "bg-black/5";

  // Dynamic allocation: total merchant pool = 2000 (register) + 3000 (quests) = 5000
  const totalAllocation = 5000;
  const unlocked = Math.min(blipPoints, totalAllocation);
  const locked = Math.max(0, totalAllocation - blipPoints);
  const unlockedPercent =
    totalAllocation > 0
      ? Math.round((unlocked / totalAllocation) * 1000) / 10
      : 0;

  const gaugeFilled = [
    { value: unlockedPercent, color: d ? "#ffffff" : "#000000" },
    { value: 100 - unlockedPercent, color: gaugeEmpty },
  ];

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  type Section = "points" | "wallet" | "email" | null;

  const [activeSection, setActiveSection] = useState<Section>(null);

  const toggleSection = (section: Section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const headerClass = "flex items-center justify-between cursor-pointer py-2";

  const contentClass = (section: Section) =>
    `overflow-hidden transition-all duration-300 ${
      activeSection === section
        ? "max-h-40 opacity-100 mt-2"
        : "max-h-0 opacity-0"
    }`;

  // Copy referal code and wallet address
  const handleCopy = async (value: string, label: string) => {
    if (!value || value === "—" || value === "Not linked") return;

    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div
      className={`min-h-screen ${bg} ${txt} font-sans antialiased transition-colors duration-300`}
    >
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header
        className="dark bg-black text-white border-b border-white/[0.06] sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Left: Logo + nav */}
          <div className="flex items-center gap-6 md:gap-10">
            <Logo />
            <nav className="hidden md:flex items-center gap-1 text-[13px] font-semibold">
              <button
                onClick={() => navigate("/merchant-dashboard")}
                className="relative px-3 py-1.5 text-white font-semibold"
              >
                Dashboard
              </button>
            </nav>
          </div>

          {/* Right: minimal actions (Protocol Balance + Wallet pills removed
              per request — wallet linking still accessible via Account modal
              and points balance lives prominently in the dashboard body). */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(d ? "light" : "dark")}
              className="w-9 h-9 rounded-md flex items-center justify-center border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-all"
              aria-label="Toggle theme"
            >
              {d ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
            </button>

            {/* Profile/menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="w-9 h-9 rounded-md flex items-center justify-center border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-all"
                aria-label="Menu"
              >
                <Menu className="w-4 h-4 text-white" />
              </button>

              {open && (
                <div
                  className={`absolute right-0 mt-2 w-60 ${surface} border ${border} ${cardShadow} rounded-2xl shadow-xl overflow-hidden z-50`}
                >
                  <div
                    className={`px-4 py-3 border-b ${divider} flex items-center gap-3`}
                  >
                    <div className="w-9 h-9 bg-gradient-to-tr from-black to-black/70 dark:from-white dark:to-white/70 rounded-full flex items-center justify-center text-white dark:text-black text-sm font-black uppercase shrink-0">
                      {userEmail?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${txt} truncate`}>
                        {userEmail.split("@")[0]}
                      </p>
                      <p className={`text-[10px] ${sub} truncate`}>
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShow2FAModal(true);
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold ${txt} ${hov} transition-colors`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Two-Factor Auth
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowAccountModal(true);
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold ${txt} ${hov} transition-colors`}
                  >
                    <User className="w-4 h-4" /> Account
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowCommitVolumeModal(true);
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold ${txt} ${hov} transition-colors`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    {existingCommitment ? "Edit Volume" : "Commit Volume"}
                  </button>
                  <div className={`h-px ${divider}`} />
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 ${hov} transition-colors`}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setShowMobileMenu(true)}
              className={`w-9 h-9 rounded-md flex items-center justify-center border ${border} ${inputBg} ${hov}`}
            >
              <Menu className={`w-5 h-5 ${txt}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ───────────────────────────────────────────── */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
          <div
            className={`absolute top-0 right-0 h-full w-72 ${surface} border-l ${border} shadow-2xl overflow-y-auto`}
          >
            {/* Mobile menu header */}
            <div
              className={`px-4 py-3 border-b ${divider} flex items-center justify-between`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-tr from-black to-black/70 dark:from-white dark:to-white/70 rounded-full flex items-center justify-center text-white dark:text-black text-[9px] font-black uppercase">
                  {userEmail.charAt(0)}
                </div>
                <span className={`text-xs font-bold ${txt}`}>
                  {userEmail.split("@")[0]}
                </span>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${hov} transition-colors`}
              >
                <X className={`w-4 h-4 ${muted}`} />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${muted}`}
                />
                <input
                  placeholder="Search…"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className={`w-full ${inputBg} rounded-lg pl-9 pr-4 py-2 text-xs outline-none border ${border} focus:ring-2 focus:ring-black/20 dark:ring-white/20/20 transition-all placeholder:${sub}`}
                />
              </div>
            </div>

            <div className={`h-px mx-4 ${divider}`} />

            {/* Nav links */}
            <div className="px-4 py-3 space-y-1">
              <button
                onClick={() => {
                  navigate("/merchant-dashboard");
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold ${
                  d ? "bg-white/10 text-white" : "bg-black/5 text-black"
                }`}
              >
                <Layout className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  setShow2FAModal(true);
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${txt} ${hov} transition-colors`}
              >
                <ShieldCheck className="w-4 h-4" />
                Two-Factor Auth
              </button>
              <button
                onClick={() => {
                  setShowAccountModal(true);
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${txt} ${hov} transition-colors`}
              >
                <User className="w-4 h-4" />
                Account
              </button>
            </div>

            <div className={`h-px mx-4 ${divider}`} />

            {/* Wallet */}
            <div className="px-4 py-3">
              <MerchantWalletButton isDark={d} />
            </div>

            <div className={`h-px mx-4 ${divider}`} />

            {/* Actions */}
            <div className="px-4 py-3 space-y-1">
              <button
                onClick={() => {
                  setTheme(d ? "light" : "dark");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${txt} ${hov} transition-colors`}
              >
                {d ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className={`w-4 h-4 ${sub}`} />
                )}
                {d ? "Light Mode" : "Dark Mode"}
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-500 ${hov} transition-colors`}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 pb-24 md:pb-4 relative z-10 lg:min-h-[calc(100vh-64px)] lg:flex lg:flex-col">
        {/* Top of dashboard — anchored for mobile bottom-nav "Home" tab */}
        <div id="dash-top" />

        {/* ── Top row: Refer Friends | Referral Code | Real-Time Activity ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3 items-stretch">
          {/* Card 1: Refer Friends — 2-col, text left + dark-stage hero right */}
          <div
            className={`lg:col-span-6 ${surface} border ${border} ${cardShadow} rounded-2xl overflow-hidden relative`}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] h-full">
              {/* Left: heading + description + CTAs */}
              <div className="p-5 md:p-7 flex flex-col justify-between gap-5">
                <h2 className="text-[26px] md:text-[31px] font-semibold font-display leading-[1.05] tracking-tight mb-2">
                  <span className={txt}>Refer Friends.</span>
                  <br />
                  <span className="text-[#cc785c]">Earn More.</span>
                </h2>
                <p className={`text-[13px] ${muted} mb-4 max-w-md leading-snug`}>
                  Invite your friends to Blip Money and earn{" "}
                  <span className={`font-bold ${txt}`}>50 pts</span> for each
                  successful referral. There's no limit to how much you can earn.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowReferralModal(true)}
                    className={`border border-[#cc785c]/60 ${accentBg} ${d ? "text-black" : "text-white"} px-5 py-2 rounded-lg text-[11.5px] font-semibold uppercase tracking-[0.16em] hover:opacity-90 active:scale-[0.98] transition flex items-center gap-2`}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share Your Code
                  </button>
                  <button
                    onClick={() => setShowHowItWorksModal(true)}
                    className={`${inputBg} border ${border} ${txt} px-5 py-2 rounded-lg text-[11.5px] font-semibold uppercase tracking-[0.16em] ${hov} transition flex items-center gap-2`}
                  >
                    How It Works
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right: elegant single-subject hero illustration on cream */}
              <div className="hidden md:block relative overflow-hidden" style={{ background: "#FAF8F5" }}>
                <img
                  src="/illustrations/refer-friends-hero.png?v=6"
                  alt="Refer friends and earn rewards"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Your Referral Code */}
          <div
            className={`lg:col-span-3 ${surface} border ${border} ${cardShadow} rounded-2xl p-5 md:p-6 flex flex-col gap-4 justify-between`}
          >
              <span
                className={`text-[10.5px] font-semibold uppercase tracking-[0.2em] ${sub}`}
              >
                Your Referral Code
              </span>
              <div
                className={`flex items-center justify-between ${inputBg} border border-[#cc785c]/40 rounded-md px-4 py-3`}
              >
                <span
                  className={`text-base md:text-lg font-semibold font-display ${txt} tracking-[0.12em]`}
                >
                  {referralCode || "—"}
                </span>
                <button
                  onClick={() => handleCopy(referralCode, "Referral code")}
                  className="p-1.5 rounded-md bg-[#cc785c]/10 hover:bg-[#cc785c]/20 transition"
                  aria-label="Copy referral code"
                  title="Copy code"
                >
                  <Copy className="w-3.5 h-3.5 text-[#cc785c]" />
                </button>
              </div>
              <p className={`text-[11px] ${muted} leading-relaxed`}>
                Share your code or link and earn{" "}
                <span className={`font-bold ${txt}`}>50 pts</span> for each
                successful referral.
              </p>

              <div className="flex items-center gap-2">
                <div className={`h-px flex-1 border-t ${divider}`} />
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${sub}`}
                >
                  Or share your link
                </span>
                <div className={`h-px flex-1 border-t ${divider}`} />
              </div>

              <div
                className={`flex items-center justify-between ${inputBg} border ${border} rounded-md px-3 py-2`}
              >
                <span className={`text-[11px] ${muted} truncate mr-2`}>
                  {referralLink}
                </span>
                <button
                  onClick={handleCopyReferralLink}
                  className={`p-1 rounded ${hov} transition shrink-0`}
                  aria-label="Copy referral link"
                  title="Copy link"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className={`w-3.5 h-3.5 ${muted}`} />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join Blip Money with my referral code ${referralCode}! ${referralLink}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${inputBg} border ${border} rounded-md px-2 py-2 text-[10px] font-bold ${txt} flex items-center justify-center gap-1.5 ${hov} transition`}
                >
                  <XBrand className="w-3 h-3" />
                  <span className="hidden sm:inline">Twitter</span>
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join Blip Money with my referral!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${inputBg} border ${border} rounded-md px-2 py-2 text-[10px] font-bold ${txt} flex items-center justify-center gap-1.5 ${hov} transition`}
                >
                  <Send className="w-3 h-3" />
                  <span className="hidden sm:inline">Telegram</span>
                </a>
                <button
                  onClick={() => setShowReferralModal(true)}
                  className={`${inputBg} border ${border} rounded-md px-2 py-2 text-[10px] font-bold ${txt} flex items-center justify-center gap-1.5 ${hov} transition`}
                >
                  <Share2 className="w-3 h-3" />
                  <span className="hidden sm:inline">More</span>
                </button>
              </div>
          </div>

          {/* Card 3: Real-Time Activity */}
          <div
            id="dash-activity"
            className={`lg:col-span-3 ${surface} border ${border} ${cardShadow} rounded-2xl overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className={`px-5 py-3 border-b ${divider} flex items-center justify-between`}>
              <span className={`text-[10.5px] font-semibold uppercase tracking-[0.2em] ${sub}`}>
                Real-Time Activity
              </span>
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-tight ${sub}`}>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#cc785c]/60 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#cc785c]" />
                </span>
                Live
              </span>
            </div>

            {/* Activity rows */}
            <div className="py-1 max-h-[320px] overflow-y-auto flex-1">
              {recentActivity.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.id}
                    className={`flex items-center justify-between px-5 py-2.5 ${hov} transition`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${inputBg} border ${border}`}
                      >
                        <Icon className={`w-[15px] h-[15px] ${muted}`} strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[13px] font-semibold ${txt} truncate tracking-tight`}>
                          {a.name}
                        </p>
                        <p className={`text-[11.5px] ${muted} truncate leading-snug`}>
                          {a.action}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3 flex flex-col items-end gap-0.5">
                      {a.points !== null && (
                        <span
                          className="text-[11px] font-semibold tracking-tight px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(204,120,92,0.10)", color: "#cc785c" }}
                        >
                          +{a.points} pts
                        </span>
                      )}
                      <span className={`text-[10.5px] ${sub} leading-tight tabular-nums`}>
                        {a.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer link */}
            <button
              className={`w-full px-5 py-3 border-t ${divider} flex items-center justify-between text-[12px] font-semibold ${txt} hover:opacity-70 transition`}
            >
              View all activity
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Merchant Onboarding CTA ─────────────────────────────────────── */}

        {/* Two-column grid: LEFT (Hero + Social Quests) | RIGHT (Referral + Progress + Leaderboard) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3 lg:items-stretch">
          {/* LEFT COLUMN: Hero + Social Quests */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* Hero card — natural height */}
            {/* <div
              className={`${surface} border ${border} ${cardShadow} rounded-2xl p-5 md:p-6 relative overflow-hidden`}
            >
              
              <div
                className="absolute top-0 right-0 bottom-0 w-1/2 opacity-50 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, ${d ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"} 1.2px, transparent 1.2px)`,
                  backgroundSize: "14px 14px",
                  maskImage:
                    "linear-gradient(to right, transparent, black 40%, black)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 40%, black)",
                }}
              />
              <div className="relative z-10">
                <h1
                  className={`text-3xl sm:text-4xl md:text-[44px] font-semibold font-display mb-2 tracking-tight leading-tight`}
                >
                  <span className={txt}>Refer Friends. </span>
                  <span className="text-[#cc785c]">Earn More.</span>
                </h1>
                <p className={`text-sm ${muted} mb-5 max-w-md leading-relaxed`}>
                  Earn{" "}
                  <span className={`font-bold ${txt}`}>1,000 BLIP</span> for
                  every merchant who joins with your code. The more friends
                  you invite, the more you earn.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-5">
                  <button
                    onClick={() => setShowPointsHistoryModal(true)}
                    className={`flex items-start gap-3 text-left group ${hov} rounded-md -m-1 p-1 transition`}
                    title="View points history"
                  >
                    <TrendingUp className={`w-5 h-5 ${txt} shrink-0 mt-0.5`} />
                    <div>
                      <p className={`text-2xl font-semibold font-display ${txt} leading-none mb-0.5`}>
                        {blipPoints.toLocaleString()}{" "}
                        <span className="text-xs font-bold">pts</span>
                      </p>
                      <p className={`text-[11px] font-bold ${txt}`}>
                        BLIP Points
                      </p>
                      <p className={`text-[10px] ${muted} font-semibold flex items-center gap-1 group-hover:underline group-hover:${txt}`}>
                        View History <ArrowRight className="w-2.5 h-2.5" />
                      </p>
                    </div>
                  </button>
                  <div className="flex items-start gap-3">
                    <UserPlus className={`w-5 h-5 ${txt} shrink-0 mt-0.5`} />
                    <div>
                      <p className={`text-2xl font-semibold font-display ${txt} leading-none mb-0.5`}>
                        {referralCount}
                      </p>
                      <p className={`text-[11px] font-bold ${txt}`}>
                        Your Referrals
                      </p>
                      <p className={`text-[10px] ${sub}`}>
                        Merchants joined with your code
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className={`w-5 h-5 ${txt} shrink-0 mt-0.5`} />
                    <div>
                      <p className={`text-2xl font-semibold font-display ${txt} leading-none mb-0.5`}>
                        {(referralCount * 1000).toLocaleString()}{" "}
                        <span className="text-xs font-bold">BLIP</span>
                      </p>
                      <p className={`text-[11px] font-bold ${txt}`}>
                        Referral Earnings
                      </p>
                      <p className={`text-[10px] ${sub}`}>
                        1,000 BLIP per invite
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <button
                    onClick={() => setShowCommitVolumeModal(true)}
                    className={`text-[11px] font-bold uppercase tracking-[0.12em] ${muted} hover:${txt} flex items-center gap-1.5 transition-colors`}
                  >
                    {existingCommitment ? "Edit Volume" : "Learn More"}{" "}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div> */}

            {/* ── Merchant Onboarding CTA ─────────────────────────────────────── */}
            <div
              className={`${surface} border ${border} ${cardShadow} rounded-2xl p-4 md:p-5 mb-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl ${inputBg} border ${border} flex items-center justify-center shrink-0`}
                >
                  <Store className={`w-[18px] h-[18px] ${txt}`} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className={`text-[14px] font-semibold ${txt} tracking-tight`}>
                      Join Merchant On Board Program
                    </p>
                    <span
                      className="text-[11px] font-semibold tracking-tight px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(204,120,92,0.10)", color: "#cc785c" }}
                    >
                      +500 BLIP
                    </span>
                  </div>
                  <p className={`text-[12px] ${muted} leading-snug`}>
                    Submit this Google Form to join our merchant onboarding
                    program and earn 500 pts.
                  </p>
                </div>
              </div>
              <a
                href="https://forms.gle/UyfhpcMdq8BSTQSZA"
                target="_blank"
                rel="noopener noreferrer"
                className={`${accentBg} ${d ? "text-black" : "text-white"} px-5 py-2.5 rounded-full text-[12px] font-semibold tracking-tight hover:-translate-y-[1px] active:scale-[0.99] transition shadow-[0_8px_22px_-10px_rgba(0,0,0,0.35)] flex items-center gap-2 shrink-0`}
              >
                Submit Form
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* ── Your Referral Stats ───────────────────────────────────────────── */}
            <div
              className={`${surface} border ${border} ${cardShadow} rounded-2xl p-4 md:p-5 mb-3`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-1.5 h-1.5 rounded-full bg-[#cc785c]`} />
                <span
                  className={`text-[10.5px] font-semibold uppercase tracking-[0.2em] ${sub}`}
                >
                  Your Referral Stats
                </span>
              </div>
              <div
                className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 md:divide-x ${divider}`}
              >
                {/* Total Referrals */}
                <div className={`flex flex-col items-start gap-2.5 p-3 md:p-0 md:px-5 md:flex-row md:items-center md:gap-3 ${inputBg} border ${border} rounded-lg md:bg-transparent md:border-0 md:rounded-none md:first:pl-0`}>
                  <div
                    className={`w-10 h-10 md:w-11 md:h-11 rounded-lg ${surface} border ${border} flex items-center justify-center shrink-0`}
                  >
                    <Target className={`w-4 h-4 md:w-5 md:h-5 ${txt}`} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-2xl md:text-xl font-semibold font-display ${txt} leading-tight`}
                    >
                      {referralCount}
                    </p>
                    <p className={`text-[11px] font-bold ${txt} leading-tight mt-0.5`}>
                      Total Referrals
                    </p>
                    <p className={`text-[10px] ${sub} mt-0.5`}>All time</p>
                  </div>
                </div>

                {/* Verified Referrals */}
                <div className={`flex flex-col items-start gap-2.5 p-3 md:p-0 md:px-5 md:flex-row md:items-center md:gap-3 ${inputBg} border ${border} rounded-lg md:bg-transparent md:border-0 md:rounded-none`}>
                  <div
                    className={`w-10 h-10 md:w-11 md:h-11 rounded-lg ${surface} border ${border} flex items-center justify-center shrink-0`}
                  >
                    <BadgeCheck className={`w-4 h-4 md:w-5 md:h-5 ${txt}`} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-2xl md:text-xl font-semibold font-display ${txt} leading-tight`}
                    >
                      {referralCount}
                    </p>
                    <p className={`text-[11px] font-bold ${txt} leading-tight mt-0.5`}>
                      Completed Quests
                    </p>
                    <p className={`text-[10px] ${sub} mt-0.5`}>Completed KYC</p>
                  </div>
                </div>

                {/* Total Points Earned */}
                <div className={`flex flex-col items-start gap-2.5 p-3 md:p-0 md:px-5 md:flex-row md:items-center md:gap-3 ${inputBg} border ${border} rounded-lg md:bg-transparent md:border-0 md:rounded-none`}>
                  <div
                    className={`w-10 h-10 md:w-11 md:h-11 rounded-lg ${surface} border ${border} flex items-center justify-center shrink-0`}
                  >
                    <UserPlus className={`w-4 h-4 md:w-5 md:h-5 ${txt}`} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-2xl md:text-xl font-semibold font-display ${txt} leading-tight`}
                    >
                      {(referralCount * 50).toLocaleString()}{" "}
                      <span className="text-xs font-bold">pts</span>
                    </p>
                    <p className={`text-[11px] font-bold ${txt} leading-tight mt-0.5`}>
                      Total Points Earned
                    </p>
                    <p className={`text-[10px] ${sub} mt-0.5`}>From Referrals</p>
                  </div>
                </div>

                {/* Pending Points */}
                <div className={`flex flex-col items-start gap-2.5 p-3 md:p-0 md:px-5 md:flex-row md:items-center md:gap-3 ${inputBg} border ${border} rounded-lg md:bg-transparent md:border-0 md:rounded-none md:last:pr-0`}>
                  <div
                    className={`w-10 h-10 md:w-11 md:h-11 rounded-lg ${surface} border ${border} flex items-center justify-center shrink-0`}
                  >
                    <Sparkles className={`w-4 h-4 md:w-5 md:h-5 ${txt}`} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-2xl md:text-xl font-semibold font-display ${txt} leading-tight`}
                    >
                      0 <span className="text-xs font-bold">pts</span>
                    </p>
                    <p
                      className={`text-[11px] font-bold ${txt} leading-tight flex items-center gap-1 mt-0.5`}
                    >
                      Pending Points
                    </p>
                    <p className={`text-[10px] ${sub} mt-0.5`}>Not yet claimed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Quests (under Hero in left column) */}
            <div id="social-quests">
              <div className="mb-4">
                <div className={`text-[10.5px] font-semibold uppercase tracking-[0.2em] ${sub} mb-1`}>
                  Social Quests
                </div>
                <h2 className={`text-[18px] font-semibold font-display tracking-tight ${txt}`}>
                  Earn points by{" "}
                  <span style={{ color: "#cc785c", fontStyle: "italic" }}>completing quests.</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {socialQuests
                  .filter((q) => q.id !== "register")
                  .map((quest) => {
                    const isDone = completedQuests.has(quest.id);
                    const isRetweetOnCooldown =
                      quest.id === "retweet" &&
                      !isDone &&
                      retweetCooldownUntil &&
                      retweetCooldownUntil > new Date();
                    const QuestIcon = quest.icon;
                    const description: Record<string, string> = {
                      twitter:
                        "Follow @blip_money on X to stay updated and earn points.",
                      telegram:
                        "Join our Telegram channel and verify membership.",
                      retweet:
                        retweetCount > 0 && !isDone
                          ? `Retweet our campaign post (${retweetCount}/2 completed).`
                          : "Post about Blip Money on X with the campaign message.",
                      referral:
                        "Invite merchants with your referral link to earn BLIP.",
                    };
                    return (
                      <div
                        key={quest.id}
                        className={`${surface} border ${border} ${cardShadow} rounded-2xl p-4 flex flex-col ${isDone ? "opacity-70" : ""}`}
                      >
                        {/* Top row: icon (left) + subtle reward chip (right) */}
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`w-9 h-9 rounded-xl ${inputBg} border ${border} flex items-center justify-center`}
                          >
                            <QuestIcon className={`w-4 h-4 ${txt}`} />
                          </div>
                          <span
                            className="text-[11px] font-semibold tracking-tight whitespace-nowrap px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(204,120,92,0.10)", color: "#cc785c" }}
                          >
                            {quest.reward}
                          </span>
                        </div>

                        {/* Title + description */}
                        <div className="mb-3.5">
                          <h3
                            className={`text-[14px] font-semibold ${txt} mb-1 tracking-tight leading-tight`}
                          >
                            {quest.title}
                          </h3>
                          <p className={`text-[12px] ${muted} leading-snug`}>
                            {description[quest.id] ?? ""}
                          </p>
                        </div>

                        {/* Action — Redeemed right, Start/cooldown left */}
                        <div
                          className={`mt-auto flex ${isDone ? "justify-end" : "justify-start"}`}
                        >
                          {isDone ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Redeemed
                            </div>
                          ) : isRetweetOnCooldown ? (
                            <div className={`text-[11px] ${sub}`}>
                              {Math.ceil(
                                (retweetCooldownUntil!.getTime() - Date.now()) /
                                  (60 * 60 * 1000),
                              )}
                              h cooldown
                            </div>
                          ) : (
                            <button
                              onClick={() => handleQuestClick(quest.id)}
                              className={`${accentBg} ${d ? "text-black" : "text-white"} px-5 py-2 rounded-full text-[11px] font-semibold tracking-tight hover:-translate-y-[1px] active:scale-[0.99] transition shadow-[0_6px_18px_-8px_rgba(0,0,0,0.35)]`}
                            >
                              Start →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* ── P2P App Test Banner (bottom-right) ────────────────────────────────── */}
      <div className=" ">
        
          <div
            className={`w-full  ${surface} border ${border} rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Header row */}
            <div
              className={`px-4 py-2.5 flex items-center justify-between border-b ${divider}`}
            >
              <div className="flex items-center gap-2">
                <Rocket className={`w-3.5 h-3.5 ${txt}`} />
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${txt}`}
                >
                  Merchant Beta
                </span>
                <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 rounded-full">
                  On Mainnet 
                </span>
              </div>
              
            </div>

            {/* Content */}
            <div className="px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-xs font-bold font-display ${txt} leading-tight`}
                >
                  Request for Merchant P2P App Test
                </h4>
                <p className={`text-[10px] ${muted} mt-1 leading-relaxed`}>
                  Complete Social Quests to <span className="dark:text-white/80 text-black "> unlock the ability to send your request </span>
                </p>
                
              </div>
              <button
                onClick={() =>
                  window.open(
                    "/waitlist/merchant",
                    "_blank",
                  )
                }
                className={`px-4 py-2 ${accentBg} ${d ? "text-black hover:bg-white/80" : "text-white hover:bg-black/80"} text-[11px] font-bold rounded-lg transition-colors shrink-0`}
              >
                Send Request
              </button>
            </div>
          </div>
        
      </div>

            {/* Invite Friends — pinned to bottom of left column so it aligns with Leaderboard */}
            {/* <div
              className={`${surface} border ${border} ${cardShadow} rounded-2xl p-4 mt-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${inputBg} border ${border} flex items-center justify-center shrink-0`}>
                  <Users className={`w-5 h-5 ${txt}`} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${txt}`}>
                    Invite Friends. Earn More.
                  </p>
                  <p className={`text-[11px] ${muted} leading-relaxed`}>
                    Earn 1,000 BLIP for each merchant who joins with your
                    referral code.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.14em] ${sub}`}
                  >
                    Your Referrals
                  </p>
                  <p
                    className={`text-lg font-semibold font-display ${txt} leading-tight`}
                  >
                    {referralCount}
                  </p>
                </div>
                <button
                  onClick={() => setShowReferralModal(true)}
                  className={`${inputBg} border ${border} rounded-md px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] ${txt} ${hov} transition`}
                >
                  View Referrals
                </button>
              </div>
            </div> */}
          </div>
          {/* /LEFT COLUMN */}

          {/* Right column: 2 sub-columns — A: Progress + Leaderboard, B: Activity + Steps */}
          <div className="lg:col-span-5 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:items-stretch">
            {/* Sub-col A */}
            <div className="flex flex-col gap-3 min-w-0">
            {/* Referral Code card — clickable, opens Referral modal */}
            {/* <div
              role="button"
              tabIndex={0}
              onClick={() => setShowReferralModal(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowReferralModal(true);
                }
              }}
              className={`${surface} border ${border} ${cardShadow} rounded-2xl p-4 cursor-pointer ${hov} hover:border-black/20 dark:hover:border-white/20 transition-all`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${d ? "bg-white" : "bg-black"}`}
                />
                <span
                  className={`text-[10.5px] font-semibold uppercase tracking-[0.2em] ${sub}`}
                >
                  Your Referral Code
                </span>
              </div>
              <div
                className={`flex items-center justify-between mb-2 ${inputBg} border ${border} rounded-md px-3 py-2.5`}
              >
                <span
                  className={`text-base font-semibold font-display ${txt} tracking-[0.08em]`}
                >
                  {referralCode || "—"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyReferralLink();
                  }}
                  className={`p-1 rounded ${hov} transition`}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className={`w-4 h-4 ${muted}`} />
                  )}
                </button>
              </div>
              <p className={`text-[11px] ${muted} mb-3 leading-relaxed`}>
                Share your code and earn{" "}
                <span className={`font-bold ${txt}`}>1,000 BLIP</span> for each
                successful referral.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReferralModal(true);
                }}
                className={`w-full py-2 ${inputBg} border ${border} rounded-md text-[11px] font-bold uppercase tracking-[0.12em] ${txt} flex items-center justify-center gap-2 ${hov} transition-all`}
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Code
              </button>
            </div> */}

            {/* Your Progress */}
            <div id="dash-progress" className={`${surface} border ${border} ${cardShadow} rounded-2xl p-4`}>
              <div
                className={`text-[10.5px] font-semibold uppercase tracking-[0.2em] ${sub} mb-1`}
              >
                Your Progress
              </div>
              <div className="flex flex-col items-center pt-1 pb-1">
                <div className="relative w-36 h-20">
                  <ResponsiveContainer width="100%" height={76}>
                    <PieChart>
                      <Pie
                        data={gaugeFilled}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={52}
                        outerRadius={66}
                        dataKey="value"
                        stroke="none"
                      >
                        {gaugeFilled.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
                    <p
                      className={`text-xl font-semibold font-display ${txt} leading-none`}
                    >
                      {blipPoints.toLocaleString()}
                    </p>
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.16em] ${sub} mt-0.5`}
                    >
                      Total Points
                    </p>
                  </div>
                </div>
                {(() => {
                  const milestones = [100, 250, 500, 1000, 2500];
                  const next =
                    milestones.find((m) => m > blipPoints) ??
                    milestones[milestones.length - 1];
                  return (
                    <p className={`text-[10px] ${muted} mt-2`}>
                      Next Milestone:{" "}
                      <span className={`font-bold ${txt}`}>
                        {next.toLocaleString()} pts
                      </span>
                    </p>
                  );
                })()}
              </div>
              <div className={`pt-2 border-t ${divider} space-y-0.5`}>
                {[100, 250, 500, 1000, 2500].map((m) => {
                  const achieved = blipPoints >= m;
                  return (
                    <div
                      key={m}
                      className="flex items-center justify-between py-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className={`w-3 h-3 ${achieved ? txt : sub}`} />
                        <span
                          className={`text-[11px] ${achieved ? txt : muted} font-medium`}
                        >
                          {m.toLocaleString()} pts
                        </span>
                      </div>
                      {achieved ? (
                        <Check className={`w-3.5 h-3.5 ${txt}`} />
                      ) : (
                        <Lock className={`w-3 h-3 ${sub}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard (in sub-col A under Progress) */}
            <div
              className={`${surface} border ${border} ${cardShadow} rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0`}
            >
              <div
                className={`px-4 py-2.5 border-b ${divider} flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <Trophy className={`w-3.5 h-3.5 ${txt}`} />
                  <span
                    className={`text-[10.5px] font-semibold uppercase tracking-[0.2em] ${sub}`}
                  >
                    Leaderboard
                  </span>
                </div>
                <button
                  onClick={() =>
                    setLbFilter(lbFilter === "Points" ? "Followers" : "Points")
                  }
                  className={`text-[10px] font-bold ${muted} hover:${txt} transition-colors`}
                >
                  View All
                </button>
              </div>

              <div className="px-1.5 py-1 max-h-[260px] overflow-y-auto">
                {leaderboardLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className={`w-5 h-5 animate-spin ${sub}`} />
                  </div>
                ) : leaderboardData.length === 0 ? (
                  <div className={`text-center py-8 text-xs ${sub}`}>
                    No merchants yet. Be the first!
                  </div>
                ) : (
                  leaderboardData.slice(0, 5).map((item) => (
                    <div
                      key={`${item.rank}-${item.name}`}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg ${hov} cursor-pointer group`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-4 shrink-0 flex items-center justify-center">
                          {item.rank <= 3 ? (
                            <Crown className={`w-3.5 h-3.5 ${txt}`} />
                          ) : (
                            <span className={`text-[11px] font-bold ${sub}`}>
                              {item.rank}
                            </span>
                          )}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-black to-black/70 dark:from-white dark:to-white/70 flex items-center justify-center text-white dark:text-black text-[8px] font-black uppercase shrink-0">
                          {item.name[0]}
                        </div>
                        <span
                          className={`text-[11px] font-semibold ${txt} truncate`}
                        >
                          {item.name}
                        </span>
                        {item.verified && (
                          <CircleCheck className={`w-3 h-3 ${txt} shrink-0`} />
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-semibold font-display ${txt} shrink-0`}
                      >
                        {item.allocation.toLocaleString()} pts
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            </div>
            {/* Sub-col B */}
            <div className="flex flex-col gap-3 min-w-0">

            {/* Your Progress & Steps */}
            <div
              className={`${surface} border ${border} ${cardShadow} rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0`}
            >
              <div className={`px-4 py-2.5 border-b ${divider}`}>
                <span
                  className={`text-[10.5px] font-semibold uppercase tracking-[0.2em] ${sub}`}
                >
                  Your Progress & Steps
                </span>
              </div>
              <div className="p-5 space-y-4">
                {progressSteps.map((step, i) => {
                  const isLast = i === progressSteps.length - 1;
                  const isDone = step.status === "done";
                  const isActive = step.status === "active";
                  return (
                    <div
                      key={step.id}
                      className="relative flex items-start gap-3.5"
                    >
                      {/* Subtle connector line on the left */}
                      {!isLast && (
                        <div
                          className={`absolute left-[10px] top-6 h-[calc(100%+8px)] w-px ${
                            d ? "bg-white/10" : "bg-black/10"
                          }`}
                        />
                      )}
                      {/* Apple-style minimal step marker */}
                      <div className="shrink-0 pt-0.5">
                        {isDone ? (
                          <div className="w-[20px] h-[20px] rounded-full bg-[#1d1d1f] dark:bg-white flex items-center justify-center">
                            <Check
                              className={`w-[11px] h-[11px] ${d ? "text-black" : "text-white"}`}
                              strokeWidth={3}
                            />
                          </div>
                        ) : isActive ? (
                          <div className="relative w-[20px] h-[20px] rounded-full flex items-center justify-center">
                            <span className="absolute inset-0 rounded-full bg-[#cc785c]/20 animate-ping" />
                            <span className="relative w-[8px] h-[8px] rounded-full bg-[#cc785c]" />
                          </div>
                        ) : (
                          <div className={`w-[20px] h-[20px] rounded-full border ${border} flex items-center justify-center`}>
                            <span className={`text-[10px] font-semibold ${sub}`} style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                              {step.id}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Title + description */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-semibold ${txt} tracking-tight`}>
                          {step.title}
                        </p>
                        <p className={`text-[11.5px] ${muted} leading-snug mt-0.5`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                className={`w-full px-4 py-2.5 border-t ${divider} flex items-center justify-between text-[11px] font-bold ${muted} hover:${txt} transition-colors`}
              >
                View full details
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            </div>
            {/* /Sub-col B */}
          </div>
        </div>
      </main>

      {/* ── Mobile bottom tab bar (app-style) ────────────────────────────── */}
      <nav
        aria-label="Dashboard"
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 ${surface} border-t ${border}`}
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
          backdropFilter: "saturate(140%) blur(14px)",
          WebkitBackdropFilter: "saturate(140%) blur(14px)",
          boxShadow: d
            ? "0 -8px 24px -8px rgba(0,0,0,0.5)"
            : "0 -8px 24px -12px rgba(0,0,0,0.10)",
        }}
      >
        <div className="grid grid-cols-5 px-2 pt-1.5">
          {[
            { label: "Home", Icon: Activity, href: "#dash-top" },
            { label: "Activity", Icon: TrendingUp, href: "#dash-activity" },
            { label: "Refer", Icon: Share2, action: () => setShowReferralModal(true) },
            { label: "Quests", Icon: Star, href: "#social-quests" },
            { label: "Progress", Icon: CheckCircle, href: "#dash-progress" },
          ].map(({ label, Icon, href, action }) => {
            const cls = `flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg text-[10px] font-semibold tracking-tight ${muted} hover:${txt} transition-colors`;
            if (action) {
              return (
                <button key={label} type="button" onClick={action} className={cls}>
                  <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                  <span>{label}</span>
                </button>
              );
            }
            return (
              <a key={label} href={href} className={cls}>
                <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      <Footer skipAnimation />

      {/* ── Logout Confirmation ─────────────────────────────────────────── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div
            className={`relative w-full max-w-sm mx-4 ${surface} border ${border} rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div
              className={`px-6 py-5 border-b ${divider} flex items-center gap-3`}
            >
              <div
                className={`p-2 rounded-lg ${d ? "bg-red-500/10" : "bg-red-50"}`}
              >
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className={`text-sm font-bold font-display ${txt}`}>
                  Confirm Logout
                </h2>
                <p className={`text-[11px] ${sub}`}>
                  Are you sure you want to log out?
                </p>
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`flex-1 py-2.5 border ${border} ${muted} text-xs font-bold rounded-xl ${hov} transition-all`}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <WalletLinkingModal
        isOpen={showWalletLinkingModal}
        onClose={() => setShowWalletLinkingModal(false)}
      />

      <TwitterVerificationModal
        isOpen={showTwitterModal}
        onClose={() => setShowTwitterModal(false)}
        onSuccess={handleTwitterSuccess}
        userWallet={user?.wallet_address || ""}
        userRole={user?.role}
      />

      <XFollowVerificationModal
        isOpen={showXFollowModal}
        onClose={() => setShowXFollowModal(false)}
        onSuccess={handleXFollowSuccess}
        userRole={user?.role}
      />

      <TelegramVerificationModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        onSuccess={handleTelegramSuccess}
        userRole={user?.role}
      />

      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        referralCode={referralCode}
        referralLink={referralLink}
        userRole={user?.role}
      />

      <RetweetVerificationModal
        isOpen={showRetweetModal}
        onClose={() => setShowRetweetModal(false)}
        onSuccess={handleRetweetSuccess}
        userWallet={user?.wallet_address || ""}
        userRole={user?.role}
        retweetNumber={retweetCount}
      />

      <PointsHistoryModal
        isOpen={showPointsHistoryModal}
        onClose={() => setShowPointsHistoryModal(false)}
        totalPoints={blipPoints}
      />

      {/* ── How It Works Modal ────────────────────────────────────────────── */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHowItWorksModal(false)}
          />
          <div
            className={`relative w-full max-w-3xl mx-4 ${surface} border ${border} rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            <div
              className={`px-6 py-4 border-b ${divider} flex items-center justify-between`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full bg-[#cc785c]`} />
                <span
                  className={`text-[10.5px] font-semibold uppercase tracking-[0.2em] ${sub}`}
                >
                  How It Works
                </span>
              </div>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className={`p-1.5 rounded-lg ${hov} transition-colors`}
                aria-label="Close"
              >
                <X className={`w-4 h-4 ${muted}`} />
              </button>
            </div>

            {/* Steps */}
            <div className="px-6 py-7">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-4 md:gap-2 items-start">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#cc785c]/15 border border-[#cc785c]/30 flex items-center justify-center mb-3">
                    <UserPlus className="w-6 h-6 text-[#cc785c]" />
                  </div>
                  <h3 className={`text-sm font-bold ${txt} mb-1`}>
                    1. Share Your Code
                  </h3>
                  <p
                    className={`text-[11px] ${muted} leading-relaxed max-w-[170px]`}
                  >
                    Share your referral code or link with friends.
                  </p>
                </div>

                <div className="hidden md:flex items-center justify-center pt-6">
                  <ArrowRight className={`w-4 h-4 ${sub}`} />
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-14 h-14 rounded-full ${inputBg} border ${border} flex items-center justify-center mb-3`}
                  >
                    <CheckCircle2 className={`w-6 h-6 ${txt}`} />
                  </div>
                  <h3 className={`text-sm font-bold ${txt} mb-1`}>
                    2. Friend Joins
                  </h3>
                  <p
                    className={`text-[11px] ${muted} leading-relaxed max-w-[180px]`}
                  >
                    Your friend signs up using your link and completes
                    verification.
                  </p>
                </div>

                <div className="hidden md:flex items-center justify-center pt-6">
                  <ArrowRight className={`w-4 h-4 ${sub}`} />
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-14 h-14 rounded-full ${inputBg} border ${border} flex items-center justify-center mb-3`}
                  >
                    <Gift className={`w-6 h-6 ${txt}`} />
                  </div>
                  <h3 className={`text-sm font-bold ${txt} mb-1`}>
                    3. They Complete Quests
                  </h3>
                  <p
                    className={`text-[11px] ${muted} leading-relaxed max-w-[170px]`}
                  >
                    Your friend completes at least one quest.
                  </p>
                </div>

                <div className="hidden md:flex items-center justify-center pt-6">
                  <ArrowRight className={`w-4 h-4 ${sub}`} />
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-14 h-14 rounded-full ${inputBg} border ${border} flex items-center justify-center mb-3`}
                  >
                    <Star className={`w-6 h-6 ${txt}`} />
                  </div>
                  <h3 className={`text-sm font-bold ${txt} mb-1`}>
                    4. You Earn Points
                  </h3>
                  <p
                    className={`text-[11px] ${muted} leading-relaxed max-w-[180px]`}
                  >
                    You earn 50 pts for each successful referral.
                  </p>
                </div>
              </div>

              {/* Callout */}
              <div className="mt-7 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#cc785c]/10 border border-[#cc785c]/30">
                <Zap className="w-4 h-4 text-[#cc785c] shrink-0" />
                <span className="text-[12px] font-semibold text-[#cc785c]">
                  The more friends you invite, the more points you earn!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2FA Recovery Codes Modal ────────────────────────────────────────── */}
      {twoFaRecoveryCodes && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className={`relative w-full max-w-lg mx-4 ${surface} border ${border} rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            <div
              className={`px-6 py-4 border-b ${divider} flex items-center gap-3`}
            >
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <KeyRound className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h2 className={`text-sm font-bold font-display ${txt}`}>
                  Save Your Recovery Codes
                </h2>
                <p className={`text-[11px] ${sub}`}>
                  Each code can only be used once
                </p>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Warning */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  If you lose access to your authenticator app, you'll need one
                  of these codes to sign in. Save them now — you won't see them
                  again.
                </p>
              </div>

              {/* Codes grid */}
              <div
                className={`grid grid-cols-2 gap-2 p-3 rounded-xl ${inputBg} border ${border}`}
              >
                {twoFaRecoveryCodes.map((code, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${surface} border ${border} font-mono text-xs ${txt}`}
                  >
                    <span className={`${sub} text-[10px] w-4`}>{i + 1}.</span>
                    {code}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadRecoveryCodes}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 ${accentBg} ${d ? "text-black" : "text-white"} text-xs font-bold rounded-xl hover:opacity-90 transition-all`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download (.txt)
                </button>
                <button
                  onClick={handleConfirmRecoveryCodes}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  I've Saved My Codes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2FA Settings Modal ─────────────────────────────────────────────── */}
      {show2FAModal && !twoFaRecoveryCodes && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={reset2FAModal}
          />

          {/* Modal card */}
          <div
            className={`relative w-full max-w-md mx-4 ${surface} border ${border} rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            <div
              className={`px-6 py-4 border-b ${divider} flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${accentLight}`}>
                  <ShieldCheck className={`w-5 h-5 ${txt}`} />
                </div>
                <div>
                  <h2 className={`text-sm font-bold font-display ${txt}`}>
                    Two-Factor Authentication
                  </h2>
                  <p className={`text-[11px] ${sub}`}>
                    Secure your account with Google Authenticator
                  </p>
                </div>
              </div>
              <button
                onClick={reset2FAModal}
                className={`p-1.5 rounded-lg ${hov} transition-colors`}
              >
                <X className={`w-4 h-4 ${muted}`} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Status badge */}
              <div
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${inputBg} border ${border}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${user?.twoFactorEnabled ? "bg-emerald-500" : "bg-amber-500"}`}
                />
                <span className={`text-xs font-semibold ${txt}`}>
                  2FA is {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>

              {/* ── Enable section ──────────────────────────────────── */}
              {!user?.twoFactorEnabled && (
                <>
                  {!twoFaQrCode ? (
                    <button
                      onClick={handleEnable2FA}
                      className={`w-full py-3 ${accentBg} ${d ? "text-black" : "text-white"} text-xs font-bold rounded-xl hover:opacity-90 transition-all`}
                    >
                      Enable 2FA
                    </button>
                  ) : (
                    <div className="space-y-4">
                      {/* Step 1 */}
                      <div>
                        <p className={`text-xs font-semibold ${txt} mb-1`}>
                          Step 1: Scan QR Code
                        </p>
                        <p className={`text-[11px] ${sub}`}>
                          Open Google Authenticator (or any TOTP app) and scan
                          this code.
                        </p>
                      </div>

                      <img
                        src={twoFaQrCode}
                        alt="QR Code"
                        className="mx-auto w-40 h-40 rounded-xl"
                      />

                      {/* Manual entry key */}
                      {twoFaManualKey && (
                        <div>
                          <p className={`text-[11px] ${sub} mb-1.5`}>
                            Can't scan? Enter this key manually:
                          </p>
                          <div
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${inputBg} border ${border}`}
                          >
                            <code
                              className={`flex-1 text-[11px] font-mono ${txt} break-all select-all`}
                            >
                              {twoFaManualKey}
                            </code>
                            <button
                              onClick={handleCopyManualKey}
                              className={`shrink-0 p-1.5 rounded-md ${hov} transition`}
                              title="Copy key"
                            >
                              {twoFaCopiedKey ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className={`w-3.5 h-3.5 ${muted}`} />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Step 2 */}
                      <div>
                        <p className={`text-xs font-semibold ${txt} mb-1`}>
                          Step 2: Enter Verification Code
                        </p>
                        <p className={`text-[11px] ${sub}`}>
                          Enter the 6-digit code from your authenticator app.
                        </p>
                      </div>

                      <input
                        value={twoFaOtp}
                        onChange={(e) =>
                          setTwoFaOtp(
                            e.target.value.replace(/\D/g, "").slice(0, 6),
                          )
                        }
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        className={`w-full px-4 py-3 text-center text-lg tracking-[0.3em] font-mono ${inputBg} border ${border} rounded-xl ${txt} focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all`}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleVerify2FAOtp}
                          disabled={twoFaLoading || twoFaOtp.length !== 6}
                          className={`flex-1 py-3 ${accentBg} ${d ? "text-black" : "text-white"} text-xs font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all`}
                        >
                          {twoFaLoading ? "Verifying..." : "Verify & Enable"}
                        </button>
                        <button
                          onClick={() => {
                            setTwoFaQrCode(null);
                            setTwoFaManualKey(null);
                            setTwoFaOtp("");
                          }}
                          className={`flex-1 py-3 border ${border} ${muted} text-xs font-bold rounded-xl ${hov} transition-all`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── Enabled: Recovery Codes + Disable ──────────────── */}
              {user?.twoFactorEnabled && (
                <div className="space-y-4">
                  {/* Recovery Codes Section */}
                  <div>
                    <p className={`text-xs font-semibold ${txt} mb-1`}>
                      Recovery Codes
                    </p>
                    <p className={`text-[11px] ${sub} mb-3`}>
                      Lost or used your recovery codes? Generate new ones here.
                    </p>

                    {!twoFaShowRegenerate ? (
                      <button
                        onClick={() => setTwoFaShowRegenerate(true)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold ${inputBg} border ${border} ${txt} ${hov} transition-all`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Regenerate Recovery Codes
                      </button>
                    ) : (
                      <div
                        className={`space-y-3 p-3 rounded-xl ${inputBg} border ${border}`}
                      >
                        <p className={`text-[11px] ${sub}`}>
                          Enter your authenticator code to generate new codes.
                          Old codes will be invalidated.
                        </p>
                        <input
                          value={twoFaRegenOtp}
                          onChange={(e) =>
                            setTwoFaRegenOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                          maxLength={6}
                          placeholder="Enter 6-digit code"
                          className={`w-full px-4 py-2.5 text-center font-mono tracking-[0.2em] ${surface} border ${border} rounded-lg ${txt} focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all`}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleRegenerateRecoveryCodes}
                            disabled={
                              twoFaLoading || twoFaRegenOtp.length !== 6
                            }
                            className={`flex-1 py-2.5 ${accentBg} ${d ? "text-black" : "text-white"} text-xs font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all`}
                          >
                            {twoFaLoading
                              ? "Generating..."
                              : "Generate New Codes"}
                          </button>
                          <button
                            onClick={() => {
                              setTwoFaShowRegenerate(false);
                              setTwoFaRegenOtp("");
                            }}
                            className={`px-4 py-2.5 border ${border} ${muted} text-xs font-bold rounded-xl ${hov} transition-all`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className={`border-t ${divider}`} />

                  {/* Disable Section */}
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-3">
                      Disable Two-Factor Authentication
                    </p>

                    {!twoFaShowDisable ? (
                      <button
                        onClick={() => setTwoFaShowDisable(true)}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Disable 2FA
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <p className={`text-[11px] ${muted}`}>
                          Enter your authenticator code to disable 2FA.
                        </p>
                        <input
                          value={twoFaDisableOtp}
                          onChange={(e) =>
                            setTwoFaDisableOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                          maxLength={6}
                          placeholder="Enter 6-digit OTP"
                          className={`w-full px-4 py-3 text-center text-lg tracking-[0.3em] font-mono ${inputBg} border ${border} rounded-xl ${txt} focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all`}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleDisable2FA}
                            disabled={
                              twoFaLoading || twoFaDisableOtp.length !== 6
                            }
                            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-all"
                          >
                            {twoFaLoading ? "Disabling..." : "Confirm Disable"}
                          </button>
                          <button
                            onClick={() => {
                              setTwoFaShowDisable(false);
                              setTwoFaDisableOtp("");
                            }}
                            className={`flex-1 py-3 border ${border} ${muted} text-xs font-bold rounded-xl ${hov} transition-all`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Account Settings Modal ────────────────────────────────────────────── */}
      {showAccountModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowAccountModal(false);
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
              setPwError("");
              setPwSuccess(false);
            }}
          />

          <div
            className={`relative w-full max-w-md mx-4 ${surface} border ${border} rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            <div
              className={`px-6 py-4 border-b ${divider} flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${accentLight}`}>
                  <User className={`w-5 h-5 ${txt}`} />
                </div>
                <div>
                  <h2 className={`text-sm font-bold font-display ${txt}`}>
                    Account Settings
                  </h2>
                  <p className={`text-[11px] ${sub}`}>
                    Manage your profile and security
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAccountModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setPwError("");
                  setPwSuccess(false);
                }}
                className={`p-1.5 rounded-lg ${hov} transition-colors`}
              >
                <X className={`w-4 h-4 ${muted}`} />
              </button>
            </div>

            {/* Profile Info */}
            <div className={`px-6 py-5 space-y-3 border-b ${divider}`}>
              <h3
                className={`text-[10px] font-bold uppercase tracking-widest ${sub}`}
              >
                Profile
              </h3>

              <div className="space-y-2.5">
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${inputBg} border ${border}`}
                >
                  <Mail className={`w-4 h-4 ${muted}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[10px] ${sub}`}>Email</p>
                    <p className={`text-xs font-semibold ${txt} truncate`}>
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${inputBg} border ${border}`}
                >
                  <Shield className={`w-4 h-4 ${muted}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[10px] ${sub}`}>Role</p>
                    <p className={`text-xs font-semibold ${txt}`}>
                      {user?.role}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${inputBg} border ${border}`}
                >
                  <Share2 className={`w-4 h-4 ${muted}`} />

                  <div className="min-w-0 flex-1">
                    <p className={`text-[10px] ${sub}`}>Referral Code</p>
                    <p className={`text-xs font-semibold font-mono ${txt}`}>
                      {user?.referralCode || "—"}
                    </p>
                  </div>

                  {user?.referralCode && (
                    <button
                      onClick={() =>
                        handleCopy(user.referralCode, "Referral code")
                      }
                      className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition"
                      title="Copy referral code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${inputBg} border ${border}`}
                >
                  <Wallet className={`w-4 h-4 ${muted}`} />

                  <div className="min-w-0 flex-1">
                    <p className={`text-[10px] ${sub}`}>Wallet</p>
                    <p
                      className={`text-xs font-semibold font-mono ${txt} truncate`}
                    >
                      {user?.wallet_address || "Not linked"}
                    </p>
                  </div>

                  {user?.wallet_address && (
                    <button
                      onClick={() =>
                        handleCopy(user.wallet_address, "Wallet address")
                      }
                      className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition"
                      title="Copy wallet address"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${inputBg} border ${border}`}
                >
                  <ShieldCheck className={`w-4 h-4 ${muted}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[10px] ${sub}`}>Two-Factor Auth</p>
                    <p
                      className={`text-xs font-semibold ${user?.twoFactorEnabled ? "text-emerald-500" : "text-amber-500"}`}
                    >
                      {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="px-6 py-5 space-y-3">
              <h3
                className={`text-[10px] font-bold uppercase tracking-widest ${sub}`}
              >
                Change Password
              </h3>

              {pwSuccess ? (
                <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-500">
                    Password changed successfully
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Current Password */}
                  <div>
                    <label
                      className={`text-[10px] font-semibold ${sub} mb-1.5 block`}
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`}
                      />
                      <input
                        type={showCurrentPw ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setPwError("");
                        }}
                        placeholder="Enter current password"
                        className={`w-full pl-10 pr-10 py-2.5 text-xs ${inputBg} border ${border} rounded-xl ${txt} focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${muted}`}
                      >
                        {showCurrentPw ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      className={`text-[10px] font-semibold ${sub} mb-1.5 block`}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`}
                      />
                      <input
                        type={showNewPw ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setPwError("");
                        }}
                        placeholder="Enter new password (min 8 chars)"
                        className={`w-full pl-10 pr-10 py-2.5 text-xs ${inputBg} border ${border} rounded-xl ${txt} focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${muted}`}
                      >
                        {showNewPw ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      className={`text-[10px] font-semibold ${sub} mb-1.5 block`}
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`}
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPwError("");
                        }}
                        placeholder="Confirm new password"
                        className={`w-full pl-10 pr-10 py-2.5 text-xs ${inputBg} border ${border} rounded-xl ${txt} focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all`}
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {pwError && (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                      <X className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <span className="text-[11px] font-medium text-red-500">
                        {pwError}
                      </span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={async () => {
                      if (
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword
                      ) {
                        setPwError("All fields are required");
                        return;
                      }
                      if (newPassword.length < 8) {
                        setPwError(
                          "New password must be at least 8 characters",
                        );
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        setPwError("Passwords do not match");
                        return;
                      }
                      setPwLoading(true);
                      setPwError("");
                      try {
                        const res: any = await api.post(
                          "/auth/change-password",
                          {
                            currentPassword,
                            newPassword,
                          },
                        );
                        if (res.success) {
                          setPwSuccess(true);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          toast.success("Password changed successfully");
                        }
                      } catch (err: any) {
                        setPwError(
                          err.response?.data?.message ||
                            "Failed to change password",
                        );
                      } finally {
                        setPwLoading(false);
                      }
                    }}
                    disabled={
                      pwLoading ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    className={`w-full py-3 ${accentBg} ${d ? "text-black" : "text-white"} text-xs font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2`}
                  >
                    {pwLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Commit Volume Modal ──────────────────────────────────────────────── */}
      {showCommitVolumeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowCommitVolumeModal(false);
              setSelectedCorridor("");
              setCustomCorridor("");
              setSelectedVolume("");
              setCommitSuccess(false);
            }}
          />

          <div
            className={`relative w-full max-w-md mx-4 ${surface} border ${border} rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div
              className={`px-6 py-4 border-b ${divider} flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${accentLight}`}>
                  <BarChart3 className={`w-5 h-5 ${txt}`} />
                </div>
                <div>
                  <h2 className={`text-sm font-bold font-display ${txt}`}>
                    {existingCommitment ? "Edit Volume" : "Commit Volume"}
                  </h2>
                  <p className={`text-[11px] ${sub}`}>
                    {existingCommitment
                      ? "Update your corridor and expected volume"
                      : "Select your corridor and expected volume"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCommitVolumeModal(false);
                  setSelectedCorridor("");
                  setCustomCorridor("");
                  setSelectedVolume("");
                  setCommitSuccess(false);
                }}
                className={`p-1.5 rounded-lg ${hov} transition-colors`}
              >
                <X className={`w-4 h-4 ${muted}`} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {commitSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold font-display ${txt}`}>
                      Volume Committed
                    </p>
                    <p className={`text-xs ${muted} mt-1`}>
                      {selectedCorridor === "Other"
                        ? customCorridor
                        : selectedCorridor}{" "}
                      &middot; {selectedVolume}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCommitVolumeModal(false);
                      setSelectedCorridor("");
                      setCustomCorridor("");
                      setSelectedVolume("");
                      setCommitSuccess(false);
                    }}
                    className={`px-6 py-2.5 ${accentBg} ${d ? "text-black" : "text-white"} text-xs font-bold rounded-xl hover:opacity-90 transition-all`}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Corridor Selection */}
                  <div className="space-y-2.5">
                    <h3
                      className={`text-[10px] font-bold uppercase tracking-widest ${sub}`}
                    >
                      Corridor
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "USDT → AED",
                        "USD → NGN",
                        "USD → KES",
                        "EUR → NGN",
                        "GBP → NGN",
                        "USD → GHS",
                        "USD → ZAR",
                        "EUR → KES",
                        "Other",
                      ].map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedCorridor(c)}
                          className={`px-3 py-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
                            selectedCorridor === c
                              ? `${accentBg} ${d ? "text-black" : "text-white"} border-transparent`
                              : `${inputBg} ${border} ${muted} ${hov}`
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    {selectedCorridor === "Other" && (
                      <input
                        value={customCorridor}
                        onChange={(e) => setCustomCorridor(e.target.value)}
                        placeholder="Enter corridor (e.g. CAD → INR)"
                        className={`w-full px-4 py-2.5 text-xs ${inputBg} border ${border} rounded-xl ${txt} focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all mt-2`}
                        autoFocus
                      />
                    )}
                  </div>

                  {/* Volume Range */}
                  <div className="space-y-2.5">
                    <h3
                      className={`text-[10px] font-bold uppercase tracking-widest ${sub}`}
                    >
                      Expected Monthly Volume
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "$0 - $10K",
                        "$10K - $50K",
                        "$50K - $100K",
                        "$100K - $500K",
                        "$500K+",
                      ].map((v) => (
                        <button
                          key={v}
                          onClick={() => setSelectedVolume(v)}
                          className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all ${
                            selectedVolume === v
                              ? `${accentBg} ${d ? "text-black" : "text-white"} border-transparent`
                              : `${inputBg} ${border} ${muted} ${hov}`
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={async () => {
                      const corridor =
                        selectedCorridor === "Other"
                          ? customCorridor
                          : selectedCorridor;
                      if (!corridor || !selectedVolume) return;
                      setCommitLoading(true);
                      try {
                        const res: any = await api.post("/auth/commit-volume", {
                          corridor,
                          volumeRange: selectedVolume,
                        });
                        if (res.success) {
                          setCommitSuccess(true);
                          setExistingCommitment({
                            corridor,
                            volumeRange: selectedVolume,
                          });
                          toast.success("Volume commitment saved");
                        }
                      } catch (err: any) {
                        toast.error(
                          err.response?.data?.message ||
                            "Failed to save commitment",
                        );
                      } finally {
                        setCommitLoading(false);
                      }
                    }}
                    disabled={
                      commitLoading ||
                      !selectedVolume ||
                      !selectedCorridor ||
                      (selectedCorridor === "Other" && !customCorridor)
                    }
                    className={`w-full py-3 ${accentBg} ${d ? "text-black" : "text-white"} text-xs font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2`}
                  >
                    {commitLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : existingCommitment ? (
                      "Update Volume"
                    ) : (
                      "Commit Volume"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── P2P App Test Banner (bottom-right) ────────────────────────────────── */}
      

      {/* {!showP2PBanner && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={() => setShowP2PBanner(true)}
            className={`${surface} border ${border} ${cardShadow} rounded-2xl shadow-xl p-3 flex items-center gap-2 ${hov} transition-all`}
          >
            <Rocket className={`w-4 h-4 ${txt}`} />
            <span className={`text-[10px] font-bold ${txt}`}>P2P Beta</span>
            <ChevronUp className={`w-3 h-3 ${muted}`} />
          </button>
        </div>
      )} */}
    </div>
  );
}
