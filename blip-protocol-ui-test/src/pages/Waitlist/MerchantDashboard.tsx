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
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { airdropApi } from "@/services/Airdrop";
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
  const { user, logout, isAuthenticated, isLoading, updatePoints, refreshSession } = useAuth();

  const { resolvedTheme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("All");
  const [activityTab, setActivityTab] = useState("All");
  const [lbFilter, setLbFilter] = useState("Points");
  const [analyticsTab, setAnalyticsTab] = useState("Priority Fee Reduction");
  const [copied, setCopied] = useState(false);
  const [feePercent] = useState(72);

  // Wallet
  const [showWalletLinkingModal, setShowWalletLinkingModal] = useState(false);

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
  const [twoFaOtp, setTwoFaOtp] = useState("");
  const [twoFaDisableOtp, setTwoFaDisableOtp] = useState("");
  const [twoFaShowDisable, setTwoFaShowDisable] = useState(false);
  const [twoFaLoading, setTwoFaLoading] = useState(false);

  // Quest completion tracking
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(
    new Set(),
  );
  const [referralCount, setReferralCount] = useState(0);

  // Leaderboard with auto-refresh
  const {
    data: leaderboardRawData,
    isRefreshing: leaderboardLoading,
    lastRefreshed: leaderboardLastRefreshed,
    refresh: refreshLeaderboard,
  } = useAutoRefreshLeaderboard(isAuthenticated);

  const leaderboardData = useMemo(() => {
    const sorted = [...leaderboardRawData];
    if (lbFilter === "Followers") {
      sorted.sort((a, b) => b.followers - a.followers);
    } else {
      sorted.sort((a, b) => b.allocation - a.allocation);
    }
    sorted.forEach((e, i) => {
      e.rank = i + 1;
    });
    return sorted;
  }, [leaderboardRawData, lbFilter]);

  const [activityData, setActivityData] = useState<ActivityEntry[]>([]);
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
        setReferralCount(res.referrals?.length || 0);
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
          RETWEET: "retweet",
        };
        const completed = new Set<string>();
        for (const entry of history) {
          const questId = eventToQuest[entry.event];
          if (questId) completed.add(questId);
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

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    if (showSettingsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettingsMenu]);

  // 2FA handlers
  const handleEnable2FA = async () => {
    try {
      const res = await twoFactorApi.enableGoogleAuth();
      setTwoFaQrCode((res as any).data?.qrCode || (res as any).qrCode);
      toast.success("Google Authenticator setup started");
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
      await twoFactorApi.verifyGoogleAuth(twoFaOtp);
      toast.success("2FA Enabled Successfully");
      setTwoFaQrCode(null);
      setTwoFaOtp("");
      await refreshSession();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to verify OTP");
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
    setCompletedQuests((prev) => new Set(prev).add("retweet"));
    setShowRetweetModal(false);
  };

  const handleQuestClick = (questId: string) => {
    if (completedQuests.has(questId)) return;
    if (questId === "twitter") setShowTwitterModal(true);
    else if (questId === "telegram") setShowTelegramModal(true);
    else if (questId === "retweet") setShowRetweetModal(true);
    else if (questId === "referral") setShowReferralModal(true);
  };

  const socialQuests = [
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
      id: "discord",
      title: "Join Discord Server",
      reward: "+500 BLIP",
      icon: Hash,
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
  const unlockedPercent = totalAllocation > 0 ? Math.round((unlocked / totalAllocation) * 1000) / 10 : 0;

  const gaugeFilled = [
    { value: unlockedPercent, color: d ? "#ffffff" : "#000000" },
    { value: 100 - unlockedPercent, color: gaugeEmpty },
  ];

  return (
    <div
      className={`min-h-screen ${bg} ${txt} font-sans antialiased transition-colors duration-300`}
    >
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header
        className={`${surface} border-b ${border} px-5 py-2.5 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300`}
      >
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-1 text-[13px] font-semibold">
            <button
              onClick={() => navigate("/merchant-dashboard")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                d
                  ? "bg-white/10 text-white"
                  : "bg-black/5 text-black font-bold"
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
                <ChevronDown className={`w-3 h-3 transition-transform ${showSettingsMenu ? "rotate-180" : ""}`} />
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
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold ${muted} ${hov} transition-colors`}
                  >
                    <User className="w-4 h-4" />
                    Account
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${muted}`}
            />
            <input
              placeholder="Search…"
              className={`${inputBg} rounded-full pl-9 pr-4 py-1.5 text-xs w-44 outline-none border ${border} focus:ring-2 focus:ring-black/20 dark:ring-white/20/20 transition-all placeholder:${sub}`}
            />
          </div>

          {/* Real BLIP points */}
          <div
            className={`flex items-center gap-1.5 ${accentLight} ${accent} px-3 py-1.5 rounded-full text-xs font-bold border ${accentBorder}`}
          >
            <Zap className="w-3 h-3 text-black dark:text-white" />
            {blipPoints.toLocaleString()} BLIP
          </div>

          {/* Wallet Connection */}
          <MerchantWalletButton isDark={d} />

          {/* User info */}
          <div
            className={`flex items-center gap-2 ${chip} border px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer ${hov} transition-colors`}
          >
            <div className="w-4 h-4 bg-gradient-to-tr from-black to-black/70 dark:from-white dark:to-white/70 rounded-full" />
            <span className={muted}>{userEmail.split("@")[0]}</span>
            <ChevronDown className="w-3 h-3" />
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

          <button
            onClick={handleLogout}
            className={`w-8 h-8 rounded-full flex items-center justify-center border ${chip} transition-all ${hov}`}
            title="Logout"
          >
            <LogOut className={`w-3.5 h-3.5 ${sub}`} />
          </button>
        </div>
      </header>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <main className="p-4 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-12 gap-4 items-start">
          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <aside className="col-span-12 lg:col-span-3 space-y-4">
            {/* blip.merchant header */}
            <div
              className={`${surface} border ${border} rounded-xl px-4 py-2.5 flex items-center justify-between`}
            >
              <div className="flex items-center gap-2">
                <Command className={`w-3.5 h-3.5 ${muted}`} />
                <span className={`text-xs font-black ${txt}`}>
                  blip.merchant
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-black dark:bg-white shadow-[0_0_6px_rgba(0,0,0,0.4)] dark:shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
                <Settings className={`w-3.5 h-3.5 ${sub} cursor-pointer`} />
                <Globe className={`w-3.5 h-3.5 ${sub} cursor-pointer`} />
              </div>
            </div>

            {/* Merchant Reward Pool card */}
            <div
              className={`${surface} border ${border} rounded-xl overflow-hidden`}
            >
              <div
                className={`px-4 py-3 border-b ${divider} flex justify-between items-center`}
              >
                <span
                  className={`text-[10px] font-black ${sub} uppercase tracking-widest`}
                >
                  Merchant Reward Pool
                </span>
                <Settings className={`w-3.5 h-3.5 ${sub}`} />
              </div>

              <div className="p-4 space-y-4">
                {/* Available + gauge */}
                <div className="flex justify-between items-start my-2">
                  <div>
                    <p
                      className={`text-[9px] font-bold ${sub} uppercase tracking-wider mb-1`}
                    >
                      Your BLIP Balance
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`text-3xl font-black ${txt} tracking-tight`}
                      >
                        {blipPoints.toLocaleString()}
                      </span>
                      <span className={`text-xs font-bold ${sub} uppercase`}>
                        BLIP
                      </span>
                    </div>
                  </div>
                  <div className="relative w-24 h-20 my-4">
                    <ResponsiveContainer width="100%" height={50}>
                      <PieChart>
                        <Pie
                          data={gaugeFilled}
                          cx="50%"
                          cy="100%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius={30}
                          outerRadius={42}
                          dataKey="value"
                          stroke="none"
                        >
                          {gaugeFilled.map((e, i) => (
                            <Cell key={i} fill={e.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center mt-1">
                      <p className="text-[11px] font-black text-black dark:text-white leading-none">
                        {unlockedPercent}%
                      </p>
                      <p className={`text-[7px] font-bold ${sub} uppercase`}>
                        unlocked
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`h-px ${d ? "bg-white/5" : "bg-black/5"}`} />

                {/* Locked / Unlocked */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Locked Allocation", locked.toLocaleString()],
                    ["Unlocked", unlocked.toLocaleString()],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p
                        className={`text-[9px] font-bold ${sub} uppercase tracking-wider mb-1`}
                      >
                        {label}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-lg font-black ${txt}`}>
                          {val}
                        </span>
                        <span
                          className={`text-[9px] font-bold ${sub} uppercase`}
                        >
                          BLIP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info row */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] ${muted}`}>
                    Merchant Status
                  </span>
                  <span className="bg-black dark:bg-white/10 text-black dark:text-white text-[9px] font-black px-2 py-1 rounded border border-black/20 dark:border-white/20">
                    {user?.status || "WAITLISTED"}
                  </span>
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-1">
                  <button className="w-full py-3 bg-black dark:bg-white hover:bg-black/80 dark:hover:bg-white/80 text-white dark:text-black text-xs font-black rounded-xl shadow-lg shadow-black/10 dark:shadow-white/10 transition-all active:scale-[0.98]">
                    Increase Allocation
                  </button>
                  <div
                    className={`grid grid-cols-2 border ${border} rounded-xl overflow-hidden divide-x ${divider}`}
                  >
                    {["Stake Liquidity", "Commit Volume"].map((l) => (
                      <button
                        key={l}
                        className={`py-2.5 text-xs font-bold ${muted} ${hov} transition-all`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`h-px ${d ? "bg-white/5" : "bg-black/5"}`} />

                {/* Fee Earnings */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[10px] font-black ${sub} uppercase tracking-wider`}
                    >
                      Fee Earnings
                    </span>
                    <span className={`text-sm font-black ${txt}`}>$1,100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1 ${chip} border px-2 py-1 rounded text-[9px] font-black ${muted}`}
                    >
                      <div
                        className={`w-2 h-2 border-[1.5px] ${d ? "border-white/40" : "border-black/30"} rounded-full`}
                      />
                      0.6%
                    </div>
                    <div className="flex-1 flex gap-0.5">
                      {[...Array(24)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-sm ${i < 14 ? "bg-black dark:bg-white" : d ? "bg-white/10" : "bg-black/10"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── COMPLETE SOCIAL QUESTS ─────────────────────────────────────── */}
            <div
              className={`${surface} border ${border} rounded-xl overflow-hidden`}
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
                  return (
                    <div
                      key={quest.id}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${hov} transition-all`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`text-xs ${isDone ? "line-through opacity-50" : ""} ${muted} truncate`}
                        >
                          {quest.title}
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

              <div className={`px-4 py-3 border-t ${divider} space-y-3`}>
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
                    <span className={`text-sm font-black ${txt}`}>
                      3,000 BLIP!
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
            </div>
          </aside>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* ── CENTER ───────────────────────────────────────────────────── */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            {/* Top tabs bar */}
            <div
              className={`${surface} border ${border} rounded-xl px-4 py-2.5 flex items-center justify-between`}
            >
              <div
                className={`flex items-center ${d ? "bg-white/5" : "bg-[#F5F3F0]"} p-1 rounded-lg gap-0.5`}
              >
                {[
                  "All",
                  "My Activity",
                  "Newscast",
                  "Resource",
                  "From",
                  "Settings",
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${activeTab === t ? pillAct : pillIna}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
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
              </div>
            </div>

            {/* Activity Feed */}
            <div
              className={`${surface} border ${border} rounded-xl overflow-hidden`}
            >
              <div className={`px-4 py-3 border-b ${divider}`}>
                <h2
                  className={`text-sm font-black uppercase tracking-wider ${txt} mb-3`}
                >
                  Merchant Reward Pool Activity
                </h2>

                {/* Sub-tabs */}
                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center ${d ? "bg-white/5" : "bg-[#F5F3F0]"} p-0.5 rounded-lg gap-0.5`}
                  >
                    {["All", "My Activity", "Network"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setActivityTab(t)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${activityTab === t ? pillAct : pillIna}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Search in activity */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${sub}`}
                    />
                    <input
                      placeholder="Search activity…"
                      className={`w-full ${inputBg} border ${border} rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-black/20 dark:ring-white/20/20 transition-all`}
                    />
                  </div>
                  <button
                    className={`${chip} border px-3 py-2 rounded-lg text-[10px] font-bold ${muted} flex items-center gap-1.5`}
                  >
                    Time <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    className={`${chip} border p-2 rounded-lg ${hov} transition-all`}
                  >
                    <Plus className={`w-3.5 h-3.5 ${sub}`} />
                  </button>
                </div>

                {/* Activity items */}
                <div className="space-y-1">
                  {activityLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className={`w-5 h-5 animate-spin ${sub}`} />
                    </div>
                  ) : activityData.length === 0 ? (
                    <div className={`text-center py-8 text-xs ${sub}`}>
                      No activity yet
                    </div>
                  ) : (
                    activityData.map((row) => (
                      <div
                        key={row.id}
                        className={`flex items-center gap-3 py-3 px-3 rounded-xl transition-all border border-transparent ${hov} cursor-pointer`}
                      >
                        <TypeIcon type={row.icon} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className={`text-[9px] font-black ${sub} uppercase tracking-wider`}
                            >
                              {row.merchant}
                            </span>
                            <span className="text-[13px] font-black text-black dark:text-white">
                              +{row.amount.toLocaleString()} BLIP
                            </span>
                          </div>
                          <span
                            className={`text-xs font-semibold ${txt} truncate`}
                          >
                            {row.desc}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-[10px] font-mono ${sub}`}>
                            {row.wallet}
                          </p>
                          <p className={`text-[9px] font-bold ${sub}`}>
                            {formatTimeAgo(row.time)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Fee slider */}
                <div className={`mt-4 pt-4 border-t ${divider}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black ${sub} uppercase tracking-widest`}
                      >
                        Fee Settings
                      </span>
                      <span className="text-[10px] font-bold text-black dark:text-white">
                        at 9%
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold ${sub}`}>
                      Finite
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold ${sub}`}>
                        Min
                      </span>
                      <div className="flex-1 relative">
                        <div
                          className={`h-2 rounded-full ${d ? "bg-white/10" : "bg-black/10"}`}
                        >
                          <div
                            className="h-2 rounded-full bg-black dark:bg-white"
                            style={{ width: `${feePercent}%` }}
                          />
                        </div>
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-black dark:bg-white rounded-full border-2 border-white shadow-md cursor-pointer"
                          style={{
                            left: `${feePercent}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>
                      <span className={`text-[10px] font-black ${txt}`}>
                        $50,000
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-[9px] ${sub}`}>0</span>
                      <span className={`text-[9px] ${sub}`}>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── LEADERBOARD ──────────────────────────────────────────────── */}
            <div
              className={`${surface} border ${border} rounded-xl overflow-hidden`}
            >
              <div
                className={`px-4 py-3 border-b ${divider} flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <Trophy className={`w-3.5 h-3.5 ${sub}`} />
                  <span
                    className={`text-[10px] font-black ${sub} uppercase tracking-widest`}
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

              <div className="px-2 py-1 max-h-[480px] overflow-y-auto">
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
                        <span className="text-[10px] font-black text-black dark:text-white">
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
                  <ArrowUpRight className={`w-3.5 h-3.5 ${sub}`} />
                  <Copy className={`w-3.5 h-3.5 ${sub}`} />
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* ── RIGHT SIDEBAR ─────────────────────────────────────────────── */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <aside className="col-span-12 lg:col-span-3 space-y-4">
            {/* Notifications */}
            <div className={`${surface} border ${border} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`flex items-center gap-2 text-[10px] font-black ${sub} uppercase tracking-widest`}
                >
                  <Bell className="w-3.5 h-3.5" /> Notifications
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`${inputBg} border ${border} p-3 rounded-xl`}>
                  <p className={`text-2xl font-black ${txt} leading-none`}>
                    {blipPoints.toLocaleString()}
                  </p>
                  <p className={`text-[9px] font-bold ${sub} uppercase mt-1`}>
                    Total BLIP
                  </p>
                </div>
                <div className={`${inputBg} border ${border} p-3 rounded-xl`}>
                  <div className="flex items-center justify-between">
                    <p className={`text-2xl font-black ${txt} leading-none`}>
                      {referralCount}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 w-6 rounded-sm ${i < referralCount ? "bg-black dark:bg-white" : d ? "bg-white/10" : "bg-black/10"}`}
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

            {/* Merchant */}
            <div className={`${surface} border ${border} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex items-center gap-2 text-[10px] font-black ${sub} uppercase tracking-widest`}
                >
                  <Zap className="w-3.5 h-3.5" /> Merchant
                </div>
                <Layout className={`w-3.5 h-3.5 ${sub}`} />
              </div>

              <div
                className={`${inputBg} border ${border} rounded-xl px-3 py-2.5 mb-4 flex items-center justify-between`}
              >
                <div>
                  <span className="text-[10px] font-black text-black dark:text-white">
                    FOUNDING
                  </span>
                  <span className={`text-[10px] font-bold ${muted} ml-2`}>
                    ({userEmail})
                  </span>
                </div>
                <span className="bg-black dark:bg-white/10 text-black dark:text-white text-[9px] font-black px-2 py-1 rounded border border-black/20 dark:border-white/20">
                  {blipPoints.toLocaleString()} BLIP
                </span>
              </div>

              {/* Points history */}
              <div className="space-y-3">
                {pointsHistory.length === 0 ? (
                  <p className={`text-[10px] ${sub} text-center py-2`}>
                    No points earned yet
                  </p>
                ) : (
                  pointsHistory.map((entry, i) => {
                    const colors = [
                      "text-black dark:text-white",
                      "text-black/80 dark:text-white/80",
                      "text-black/60 dark:text-white/60",
                      "text-black/50 dark:text-white/50",
                      "text-black/40 dark:text-white/40",
                    ];
                    return (
                      <div
                        key={entry.id}
                        className={`flex gap-3 pb-3 border-b ${divider} last:border-0 last:pb-0`}
                      >
                        <div className="shrink-0">
                          <span
                            className={`text-sm font-black ${colors[i % colors.length]}`}
                          >
                            +{entry.points.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-[10px] font-bold ${txt} truncate`}
                          >
                            {entry.eventLabel}
                          </p>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className={`text-[8px] font-bold ${sub}`}>
                              {entry.event.replace(/_/g, " ")}
                            </span>
                            <span className={`text-[8px] font-bold ${sub}`}>
                              {formatTimeAgo(entry.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

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
                  <span className={`font-black ${txt}`}>{referralCount}</span>{" "}
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
              className={`${surface} border ${border} rounded-xl overflow-hidden`}
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
                {/* Token Schedule */}
                <div>
                  <h3 className={`text-lg font-black ${txt} mb-2`}>
                    Token Schedule
                  </h3>
                  <p className={`text-xs ${muted} leading-relaxed mb-2`}>
                    Linear unlocking for genesis contract allocations.
                  </p>
                  <p className={`text-xs ${muted} leading-relaxed`}>
                    Following TGE: assets unlock over a 180-day cycle with
                    real-time settlement capabilities for merchant nodes.
                  </p>
                </div>

                <div className={`h-px ${d ? "bg-white/5" : "bg-black/5"}`} />

                {/* Priority Fee Reduction / Network Priority tabs */}
                <div>
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
                </div>
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
        <div className="flex items-center gap-2">
          <span className={`font-bold ${txt}`}>
            {blipPoints.toLocaleString()} BLIP
          </span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

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
      />

      {/* ── 2FA Settings Modal ─────────────────────────────────────────────── */}
      {show2FAModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShow2FAModal(false);
              setTwoFaQrCode(null);
              setTwoFaOtp("");
              setTwoFaDisableOtp("");
              setTwoFaShowDisable(false);
            }}
          />

          {/* Modal card */}
          <div
            className={`relative w-full max-w-md mx-4 ${surface} border ${border} rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className={`px-6 py-4 border-b ${divider} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${accentLight}`}>
                  <ShieldCheck className={`w-5 h-5 ${txt}`} />
                </div>
                <div>
                  <h2 className={`text-sm font-bold ${txt}`}>Two-Factor Authentication</h2>
                  <p className={`text-[11px] ${sub}`}>Secure your account with Google Authenticator</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShow2FAModal(false);
                  setTwoFaQrCode(null);
                  setTwoFaOtp("");
                  setTwoFaDisableOtp("");
                  setTwoFaShowDisable(false);
                }}
                className={`p-1.5 rounded-lg ${hov} transition-colors`}
              >
                <X className={`w-4 h-4 ${muted}`} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Status badge */}
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${inputBg} border ${border}`}>
                <div className={`w-2 h-2 rounded-full ${user?.twoFactorEnabled ? "bg-emerald-500" : "bg-amber-500"}`} />
                <span className={`text-xs font-semibold ${txt}`}>
                  2FA is {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>

              {/* Enable section */}
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
                      <p className={`text-xs ${muted} text-center`}>
                        Scan this QR code with Google Authenticator
                      </p>
                      <img
                        src={twoFaQrCode}
                        alt="QR Code"
                        className="mx-auto w-40 h-40 rounded-xl"
                      />
                      <input
                        value={twoFaOtp}
                        onChange={(e) => setTwoFaOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        className={`w-full px-4 py-3 text-center text-lg tracking-[0.3em] font-mono ${inputBg} border ${border} rounded-xl ${txt} focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all`}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleVerify2FAOtp}
                          disabled={twoFaLoading || twoFaOtp.length !== 6}
                          className={`flex-1 py-3 ${accentBg} ${d ? "text-black" : "text-white"} text-xs font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all`}
                        >
                          {twoFaLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                          onClick={() => { setTwoFaQrCode(null); setTwoFaOtp(""); }}
                          className={`flex-1 py-3 border ${border} ${muted} text-xs font-bold rounded-xl ${hov} transition-all`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Disable section */}
              {user?.twoFactorEnabled && (
                <div className="space-y-3">
                  {!twoFaShowDisable ? (
                    <button
                      onClick={() => setTwoFaShowDisable(true)}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Disable 2FA
                    </button>
                  ) : (
                    <>
                      <p className={`text-xs ${muted}`}>
                        Enter the OTP from your authenticator app to disable 2FA
                      </p>
                      <input
                        value={twoFaDisableOtp}
                        onChange={(e) => setTwoFaDisableOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        className={`w-full px-4 py-3 text-center text-lg tracking-[0.3em] font-mono ${inputBg} border ${border} rounded-xl ${txt} focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all`}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleDisable2FA}
                          disabled={twoFaLoading || twoFaDisableOtp.length !== 6}
                          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-all"
                        >
                          {twoFaLoading ? "Disabling..." : "Confirm Disable"}
                        </button>
                        <button
                          onClick={() => { setTwoFaShowDisable(false); setTwoFaDisableOtp(""); }}
                          className={`flex-1 py-3 border ${border} ${muted} text-xs font-bold rounded-xl ${hov} transition-all`}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
