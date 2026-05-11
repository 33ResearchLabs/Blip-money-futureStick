import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
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
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { airdropApi } from "@/services/Airdrop";
import { api } from "@/services/api";
import { Logo } from "@/components/Navbar";
import TwitterVerificationModal from "@/components/TwitterVerificationModal";
import TelegramVerificationModal from "@/components/TelegramVerificationModal";
import ReferralModal from "@/components/ReferralModal";
import RetweetVerificationModal from "@/components/RetweetVerificationModal";
import WalletLinkingModal from "@/components/WalletLinkingModal";
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
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showRetweetModal, setShowRetweetModal] = useState(false);

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
  const [twoFaRecoveryCodes, setTwoFaRecoveryCodes] = useState<string[] | null>(null);
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

  // Redirect to login if not authenticated
  useEffect(() => {
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

  // Auto-open wallet linking modal when wallet isn't linked
  useEffect(() => {
    if (isAuthenticated && user && !user.walletLinked) {
      setShowWalletLinkingModal(true);
    }
  }, [isAuthenticated, user]);

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
    if (questId === "twitter") setShowTwitterModal(true);
    else if (questId === "telegram") setShowTelegramModal(true);
    else if (questId === "retweet") setShowRetweetModal(true);
    else if (questId === "referral") setShowReferralModal(true);
  };

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
      icon: Share2,
    },
    {
      id: "telegram",
      title: "Follow Us on Telegram",
      reward: "+500 BLIP",
      icon: MessageCircle,
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
      reward: "+1,000 BLIP",
      icon: Link,
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
  const border = d ? "border-white/[0.06]" : "border-black/[0.08]";
  const txt = d ? "text-white" : "text-black";
  const muted = d ? "text-white/60" : "text-black/60";
  const sub = d ? "text-white/40" : "text-black/80";
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
        className={`${surface} border-b ${border} px-3 md:px-5 py-2.5 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300`}
      >
        <div className="flex items-center gap-4 md:gap-8">
          <Logo />
          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1 text-[13px] font-semibold">
            <button
              onClick={() => navigate("/merchant-dashboard")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                d ? "bg-white/10 text-white" : "bg-black/5 text-black font-bold"
              }`}
            >
              Dashboard
            </button>

            {/* Settings dropdown */}
            <div ref={settingsRef} className="relative">
              <button
                onClick={() => setShowSettingsMenu((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${muted} ${hov}`}
              >
                Settings
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${showSettingsMenu ? "rotate-180" : ""}`}
                />
              </button>

              {showSettingsMenu && (
                <div
                  className={`absolute top-full left-0 mt-1 w-48 ${surface} border ${border} rounded-xl shadow-xl overflow-hidden z-50`}
                >
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      setShow2FAModal(true);
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold ${txt} ${hov} transition-colors`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Two-Factor Auth
                  </button>
                  <div className={`h-px ${divider}`} />
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      setShowAccountModal(true);
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold ${txt} ${hov} transition-colors`}
                  >
                    <User className="w-4 h-4" />
                    Account
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative group">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${muted}`}
            />
            <input
              placeholder="Search…"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className={`${inputBg} rounded-full pl-9 pr-4 py-1.5 text-xs w-44 outline-none border ${border} focus:ring-2 focus:ring-black/20 dark:ring-white/20/20 transition-all placeholder:${sub}`}
            />
          </div>

          <button
            onClick={() => setTheme(d ? "light" : "dark")}
            className={`w-8 h-8 rounded-full flex items-center justify-center border ${chip} transition-all ${hov}`}
          >
            {d ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className={`w-3.5 h-3.5 ${sub}`} />
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            {/* Profile Icon Button */}
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-full flex items-center justify-center"
            >
              <div
                className="w-8 h-8 bg-gradient-to-tr from-black to-black/70 
                        dark:from-white dark:to-white/70 
                        rounded-full flex items-center justify-center 
                        text-white dark:text-black text-sm font-black uppercase shadow-md"
              >
                {userEmail?.charAt(0)}
              </div>
            </button>

            {/* Dropdown */}
            {open && (
              <div
                className="absolute right-0 mt-3 w-56 bg-white dark:bg-neutral-900 
                        border border-neutral-200 dark:border-neutral-700 
                        rounded-xl shadow-xl p-3 space-y-3 text-sm"
              >
                {/* BLIP Points removed */}
                <div className="space-y-2 text-sm">
                  {/* 💼 Wallet */}
                  <div>
                    <div
                      onClick={() => toggleSection("wallet")}
                      className={headerClass}
                    >
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 " />
                        <span>Wallet</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeSection === "wallet" ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <div className={contentClass("wallet")}>
                      <div className="pt-2">
                        <MerchantWalletButton isDark={d} />
                      </div>
                    </div>
                  </div>

                  {/* 📧 Email */}
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2">
                    <div
                      onClick={() => toggleSection("email")}
                      className={headerClass}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeSection === "email" ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <div className={contentClass("email")}>
                      <div className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800 p-2 rounded-lg">
                        {userEmail}
                      </div>
                    </div>
                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 ">
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className={`flex items-center gap-2      transition-all  `}
                        title="Logout"
                      >
                        <LogOut className={`w-4 h-4 ${sub}`} />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border ${chip} transition-all ${hov}`}
            title="Logout"
          >
            <LogOut className={`w-3.5 h-3.5 ${sub}`} />
          </button> */}
        </div>

        {/* Mobile: hamburger only (BLIP points badge removed) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setShowMobileMenu(true)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${chip} transition-all ${hov}`}
          >
            <Menu className={`w-5 h-5 ${txt}`} />
          </button>
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
      <main className="p-2 max-w-[1800px] mx-auto min-h-screen ">
        <div className="grid grid-cols-12 gap-2 items-stretch h-full">
          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <aside className="col-span-12 lg:col-span-3 space-y-2 flex flex-col gap-2 ">
            {/* blip.merchant header */}
            <div
              className={`${surface} border ${border} rounded-xl px-4 py-3 flex items-center justify-between`}
            >
              <div className="flex items-center gap-2">
                <Command className={`w-3.5 h-3.5 ${muted}`} />
                <span className={`text-xs font-black ${txt}`}>
                  blip merchant
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-black dark:bg-white shadow-[0_0_6px_rgba(0,0,0,0.4)] dark:shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
              </div>
            </div>


            {/* ── COMPLETE SOCIAL QUESTS ─────────────────────────────────────── */}

            <div
              className={`${surface} border ${border} rounded-xl overflow-hidden flex-1 flex flex-col relative`}
            >
              <div
                className={`px-4 py-3 border-b ${divider} flex items-center gap-2`}
              >
                <Trophy className={`w-3.5 h-3.5 ${sub}`} />
                <span
                  className={`text-[10px] font-black ${sub} uppercase tracking-widest`}
                >
                  Complete Social Quests
                </span>
              </div>

              <div className="p-3 space-y-1">
                {socialQuests.map((quest) => {
                  const isDone = completedQuests.has(quest.id);
                  const isRetweetOnCooldown =
                    quest.id === "retweet" &&
                    !isDone &&
                    retweetCooldownUntil &&
                    retweetCooldownUntil > new Date();
                  const retweetLabel =
                    quest.id === "retweet" && retweetCount > 0 && !isDone
                      ? `${quest.title} (${retweetCount}/2)`
                      : quest.title;
                  return (
                    <div
                      key={quest.id}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${hov} transition-all`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`text-xs ${isDone ? "line-through opacity-50" : ""} ${muted} truncate`}
                        >
                          {retweetLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold ${sub}`}>
                          {quest.reward}
                        </span>
                        {isDone ? (
                          <span className="text-black dark:text-white text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Redeemed
                          </span>
                        ) : isRetweetOnCooldown ? (
                          <span className={`text-[10px] font-medium ${sub}`}>
                            {Math.ceil(
                              (retweetCooldownUntil!.getTime() - Date.now()) /
                                (60 * 60 * 1000),
                            )}
                            h cooldown
                          </span>
                        ) : (
                          <button
                            onClick={() => handleQuestClick(quest.id)}
                            className="bg-black dark:bg-white hover:bg-black/80 dark:hover:bg-white/80 text-white dark:text-black text-[10px] font-bold px-3 py-1 rounded-md transition-all"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`px-4 py-3 border-t  ${divider} space-y-3`}>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold ${sub}`}>
                    {questsCompleted} / {socialQuests.length} Quests Completed
                  </span>
                  <div className="flex-1 flex gap-0.5">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-sm ${
                          i <
                          Math.round(
                            (questsCompleted / socialQuests.length) * 20,
                          )
                            ? "bg-black dark:bg-white"
                            : d
                              ? "bg-white/10"
                              : "bg-black/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-xs ${muted}`}>Earn Up to </span>
                    <span className={`text-sm font-black font-display ${txt}`}>
                      5,000 BLIP!
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-black dark:bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                    style={{
                      width: `${(questsCompleted / socialQuests.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <hr className="absolute bottom-[43px] left-0 right-0 h-px bg-black/10 dark:bg-white/10" />
            </div>
          </aside>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* ── CENTER ───────────────────────────────────────────────────── */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div className="col-span-12 lg:col-span-6 space-y-2 h-full flex flex-col gap-2">
            {/* Top tabs bar */}
            <div
              className={`${surface} border ${border} rounded-xl px-4 py-2.5 flex items-center justify-between`}
            >
              <div
                className={`flex items-center ${d ? "bg-white/5" : "bg-[#F5F3F0]"} p-1 rounded-lg gap-0.5`}
              >
                {["All"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${activeTab === t ? pillAct : pillIna}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {/* <div className="flex items-center gap-2">
                <button
                  className={`${chip} border p-1.5 rounded-lg ${hov} transition-all`}
                >
                  <Search className={`w-3.5 h-3.5 ${sub}`} />
                </button>
                <button
                  className={`${chip} border p-1.5 rounded-lg ${hov} transition-all`}
                >
                  <QrCode className={`w-3.5 h-3.5 ${sub}`} />
                </button>
              </div> */}
            </div>


            {/* ── LEADERBOARD ──────────────────────────────────────────────── */}
            <div
              className={`${surface} border ${border} rounded-xl overflow-hidden  flex-1 flex flex-col `}
            >
              <div
                className={`px-4 py-3 border-b ${divider} flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <Trophy className={`w-3.5 h-3.5 ${sub}`} />
                  <span
                    className={`text-[14px] text-black font-black font-display ${sub} uppercase tracking-widest`}
                  >
                    Leaderboard
                  </span>
                </div>
                <div
                  className={`flex ${d ? "bg-white/5" : "bg-[#F5F3F0]"} p-0.5 rounded-lg`}
                >
                  {["Points", "Followers"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setLbFilter(f)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition-all ${
                        lbFilter === f ? pillAct : pillIna
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table header */}
              <div
                className={`px-4 py-2 grid grid-cols-12 text-[9px] font-black ${sub} uppercase tracking-wider border-b ${divider}`}
              >
                <span className="col-span-1"></span>
                <span className="col-span-5">Merchant</span>
                <span className="col-span-3 text-center">Referrals</span>
                <span className="col-span-3 text-right">BLIP Allocation</span>
              </div>

              <div className="px-2 py-1 max-h-[356px] overflow-y-auto">
                {leaderboardLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className={`w-5 h-5 animate-spin ${sub}`} />
                  </div>
                ) : leaderboardData.length === 0 ? (
                  <div className={`text-center py-8 text-xs ${sub}`}>
                    No merchants yet. Be the first!
                  </div>
                ) : (
                  leaderboardData.map((item) => (
                    <div
                      key={`${item.rank}-${item.name}`}
                      className={`grid grid-cols-12 items-center px-2 py-2.5 rounded-lg transition-all duration-500 ease-in-out ${hov} cursor-pointer group ${
                        leaderboardLoading
                          ? "opacity-0 translate-y-2"
                          : "opacity-100 translate-y-0"
                      }`}
                      style={{ transitionDelay: `${item.rank * 30}ms` }}
                    >
                      <span
                        className={`col-span-1 text-[11px] font-bold ${sub}`}
                      >
                        {item.rank}
                      </span>
                      <div className="col-span-5 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-black to-black/70 dark:from-white dark:to-white/70 flex items-center justify-center text-white dark:text-black text-[7px] font-black uppercase shrink-0">
                          {item.name[0]}
                        </div>
                        <span
                          className={`text-[11px] font-bold ${txt} truncate`}
                        >
                          {item.name}
                        </span>
                        {item.verified && (
                          <CircleCheck className="w-2.5 h-2.5 text-black dark:text-white shrink-0" />
                        )}
                      </div>
                      <span
                        className={`col-span-3 text-center text-[11px] font-bold ${muted}`}
                      >
                        {item.followers}
                      </span>
                      <div className="col-span-3 text-right">
                        <span className="text-[10px] font-black font-display text-black dark:text-white">
                          {item.allocation.toLocaleString()} BLIP
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div
                className={`px-4 py-2.5 border-t ${divider} flex items-center justify-between`}
              >
                <span className={`text-[10px] font-bold ${sub}`}>
                  {leaderboardLastRefreshed
                    ? `Updated ${formatTimeAgo(leaderboardLastRefreshed.toISOString())}`
                    : "Loading..."}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshLeaderboard}
                    className={`${sub} hover:${txt} p-1 rounded transition-all`}
                    title="Refresh leaderboard"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${leaderboardLoading ? "animate-spin" : ""}`}
                    />
                  </button>
                  {/* <ArrowUpRight className={`w-3.5 h-3.5 ${sub}`} />
                  <Copy className={`w-3.5 h-3.5 ${sub}`} /> */}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* ── RIGHT SIDEBAR ─────────────────────────────────────────────── */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-2">
            {/* Notifications */}
            <div className={`${surface} border ${border} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`flex items-center gap-2 text-[10px] font-black ${sub} uppercase tracking-widest`}
                >
                  <Bell className="w-3.5 h-3.5" /> Notifications
                </div>
              </div>

              <div className="mb-4">
                <div className={`${inputBg} border ${border} p-3 rounded-xl`}>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-2xl font-black font-display ${txt} leading-none`}
                    >
                      {referralCount}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 w-6 rounded-sm ${referralCount > 0 ? "bg-black dark:bg-white" : d ? "bg-white/10" : "bg-black/10"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className={`text-[9px] font-bold ${sub} uppercase mt-1`}>
                    Referrals
                  </p>
                </div>
              </div>
            </div>

            {/* Total BLIP tile + Merchant points-history block removed */}

            {/* Referrals */}
            <div className={`${surface} border ${border} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex items-center gap-2 text-[10px] font-black ${sub} uppercase tracking-widest`}
                >
                  <Share2 className="w-3.5 h-3.5" /> Referrals
                </div>
                <button
                  onClick={() => setShowReferralModal(true)}
                  className={`text-[9px] font-bold text-black dark:text-white hover:underline`}
                >
                  View All
                </button>
              </div>

              {/* Referral code */}
              <div
                className={`${inputBg} border ${border} rounded-xl px-4 py-2.5 text-[11px] font-mono flex items-center justify-between mb-2`}
              >
                <span className={txt}>{referralCode || "—"}</span>
              </div>

              {/* Referral link */}
              <div
                className={`${inputBg} border ${border} rounded-xl px-4 py-2.5 text-[10px] font-mono flex items-center justify-between mb-3`}
              >
                <span className={`${muted} truncate mr-2`}>{referralLink}</span>
              </div>

              <div className="flex items-center justify-between">
                <p
                  className={`text-[10px] font-bold ${sub} flex items-center gap-1.5`}
                >
                  <CircleCheck className="w-3.5 h-3.5 text-black dark:text-white" />
                  <span className={`font-black font-display ${txt}`}>
                    {referralCount}
                  </span>{" "}
                  merchants joined
                </p>
                <button
                  onClick={handleCopyReferralLink}
                  className={`flex items-center gap-1 ${chip} border px-2.5 py-1 rounded-md text-[9px] font-bold ${muted} ${hov} transition-all`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-black dark:text-white" />{" "}
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> COPY
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Network Pool Analytics */}
            <div
              className={`${surface} border ${border} rounded-xl overflow-hidden flex-1 flex flex-col`}
            >
              <div
                className={`px-4 py-3 border-b ${divider} flex items-center gap-2`}
              >
                <Globe className={`w-3.5 h-3.5 ${sub}`} />
                <span
                  className={`text-[10px] font-black ${sub} uppercase tracking-widest`}
                >
                  Network Pool Analytics
                </span>
              </div>

              <div className="p-4 space-y-4">
                {/* Token Schedule removed */}

                {/* Priority Fee Reduction / Network Priority tabs */}
                {/* <div>
                  <div
                    className={`flex ${d ? "bg-white/5" : "bg-[#F5F3F0]"} p-0.5 rounded-lg gap-0.5 mb-4`}
                  >
                    {["Priority Fee Reduction", "Network Priority"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setAnalyticsTab(t)}
                        className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                          analyticsTab === t ? pillAct : pillIna
                        }`}
                      >
                        {t === "Network Priority" && (
                          <Globe className="w-3 h-3" />
                        )}
                        {t}
                      </button>
                    ))}
                  </div>

                  <ul className="space-y-2.5">
                    {[
                      "Priority Fee Reduction",
                      "Governance Rights",
                      "Network Priority",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <div
                          className={`w-1 h-1 rounded-full ${d ? "bg-white/40" : "bg-black/40"}`}
                        />
                        <span className={`text-xs ${muted}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div> */}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Bottom Bar ────────────────────────────────────────────────────── */}
      <div
        className={`${surface} border-t ${border} px-5 py-2 flex items-center justify-between text-[11px] ${muted} sticky bottom-0 z-40`}
      >
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="font-bold uppercase tracking-wider">Merchant</span>
          <span className={`mx-2 ${sub}`}>·</span>
          <span className="font-bold uppercase tracking-wider">
            {userEmail.split("@")[0]}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
        {/* <div className="flex items-center gap-2">
          <span className={`font-bold ${txt}`}>
            {blipPoints.toLocaleString()} BLIP
          </span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div> */}
        {!showP2PBanner && (
          <div className=" ">
            <button
              onClick={() => setShowP2PBanner(true)}
              className={`${surface} border ${border} rounded-xl shadow-xl p-2 flex items-center gap-2 ${hov} transition-all`}
            >
              <Rocket className={`w-4 h-4 ${txt}`} />
              <span className={`text-[10px] font-bold ${txt}`}>P2P Beta</span>
              <ChevronUp className={`w-3 h-3 ${muted}`} />
            </button>
          </div>
        )}
      </div>

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
        required
      />

      <TwitterVerificationModal
        isOpen={showTwitterModal}
        onClose={() => setShowTwitterModal(false)}
        onSuccess={handleTwitterSuccess}
        userWallet={user?.wallet_address || ""}
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

      {/* ── 2FA Recovery Codes Modal ────────────────────────────────────────── */}
      {twoFaRecoveryCodes && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className={`relative w-full max-w-lg mx-4 ${surface} border ${border} rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            <div className={`px-6 py-4 border-b ${divider} flex items-center gap-3`}>
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
              <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl ${inputBg} border ${border}`}>
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
                      <div className={`space-y-3 p-3 rounded-xl ${inputBg} border ${border}`}>
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
                            disabled={twoFaLoading || twoFaRegenOtp.length !== 6}
                            className={`flex-1 py-2.5 ${accentBg} ${d ? "text-black" : "text-white"} text-xs font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all`}
                          >
                            {twoFaLoading ? "Generating..." : "Generate New Codes"}
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
      <div className="fixed bottom-4 right-4 z-50 ">
        {showP2PBanner && (
          <div
            className={`w-full max-w-[480px] ${surface} border ${border} rounded-2xl shadow-2xl overflow-hidden`}
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
                  Mainnet in 32 Days
                </span>
              </div>
              <button
                onClick={() => setShowP2PBanner(false)}
                className={`p-1 rounded-lg ${hov} transition-colors`}
              >
                <X className={`w-3.5 h-3.5 ${muted}`} />
              </button>
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
                  Trial our P2P release app. Early access &amp; governance
                  rights included.
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span
                    className={`flex items-center gap-1 text-[10px] ${muted}`}
                  >
                    <CircleCheck className="w-3 h-3 text-emerald-500" /> P2P
                    Access
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[10px] ${muted}`}
                  >
                    <CircleCheck className="w-3 h-3 text-emerald-500" />{" "}
                    Governance
                  </span>
                  <span className={`text-[9px] font-mono ${sub}`}>
                    iOS 9.44.6
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  window.open("https://blip.money/merchant-waitlist", "_blank")
                }
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-lg transition-colors shrink-0"
              >
                Sign Up Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* {!showP2PBanner && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={() => setShowP2PBanner(true)}
            className={`${surface} border ${border} rounded-xl shadow-xl p-3 flex items-center gap-2 ${hov} transition-all`}
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
