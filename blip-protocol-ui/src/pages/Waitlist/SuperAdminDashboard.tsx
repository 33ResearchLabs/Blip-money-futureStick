import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { airdropApi } from "@/services/Airdrop";
import {
  Users,
  Store,
  Coins,
  Share2,
  BarChart3,
  CheckCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Trophy,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ── Types ──────────────────────────────────────────

interface SuperadminStats {
  totalUsers: number;
  totalMerchants: number;
  totalAdmins: number;
  totalAllUsers: number;
  totalBlipPoints: number;
  totalReferrals: number;
  totalVolumeCommitments: number;
  tweetVerifications: number;
  socialQuests: {
    twitter: { verified: number; total: number };
    telegram: { verified: number; total: number };
    whitepaper: { verified: number; total: number };
  };
}

interface UserDetailed {
  _id: string;
  email: string;
  role: string;
  totalBlipPoints: number;
  emailVerified: boolean;
  walletLinked: boolean;
  telegramVerified: boolean;
  createdAt: string;
  socialQuests: {
    twitter: string | null;
    telegram: string | null;
    whitepaper: string | null;
  };
}

interface ReferralEntry {
  _id: string;
  referrer_id: { email: string; totalBlipPoints: number; role: string } | null;
  referred_user_id: { email: string; totalBlipPoints: number; role: string } | null;
  reward_amount: number;
  reward_status: string;
  createdAt: string;
}

interface TopReferrer {
  email: string;
  role: string;
  count: number;
  totalReward: number;
}

interface VolumeCommitmentEntry {
  _id: string;
  userId: { email: string; totalBlipPoints: number; role: string } | null;
  corridor: string;
  volumeRange: string;
  status: string;
  createdAt: string;
}

interface ChartDataPoint {
  date: string;
  users: number;
  merchants: number;
}

interface PointsChartPoint {
  event: string;
  totalPoints: number;
  count: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Helpers ──────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatNumber = (n: number) => n.toLocaleString();

const eventLabels: Record<string, string> = {
  REGISTER: "User Register",
  MERCHANT_REGISTER: "Merchant Register",
  TWITTER_FOLLOW: "Twitter Follow",
  TELEGRAM_JOIN: "Telegram Join",
  WHITEPAPER_READ: "Whitepaper Read",
  CROSS_BORDER_SWAP: "Cross Border Swap",
  REFERRAL_BONUS_EARNED: "Referral Earned",
  REFERRAL_BONUS_RECEIVED: "Referral Received",
};

const QuestBadge = ({ status }: { status: string | null }) => {
  if (!status) return <span className="text-white/30 text-xs">—</span>;
  if (status === "VERIFIED")
    return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (status === "REJECTED")
    return <XCircle className="w-4 h-4 text-red-400" />;
  return (
    <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
      {status}
    </span>
  );
};

// ── Main Component ──────────────────────────────────

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "referrals" | "volume">("overview");

  // Stats
  const [stats, setStats] = useState<SuperadminStats | null>(null);

  // Charts
  const [regChart, setRegChart] = useState<ChartDataPoint[]>([]);
  const [pointsChart, setPointsChart] = useState<PointsChartPoint[]>([]);

  // Users table
  const [users, setUsers] = useState<UserDetailed[]>([]);
  const [usersPagination, setUsersPagination] = useState<Pagination | null>(null);
  const [usersPage, setUsersPage] = useState(1);
  const [usersRoleFilter, setUsersRoleFilter] = useState<string>("");
  const [usersSearch, setUsersSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Referrals
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [referralsPagination, setReferralsPagination] = useState<Pagination | null>(null);
  const [referralsPage, setReferralsPage] = useState(1);

  // Volume
  const [volumes, setVolumes] = useState<VolumeCommitmentEntry[]>([]);

  // ── Data Fetching ──

  const fetchStats = useCallback(async () => {
    try {
      const res: any = await airdropApi.getSuperadminStats();
      setStats(res.stats);
    } catch (e) {
      console.error("Failed to fetch superadmin stats:", e);
    }
  }, []);

  const fetchCharts = useCallback(async () => {
    try {
      const [regRes, pointsRes]: any = await Promise.all([
        airdropApi.getRegistrationChart(),
        airdropApi.getPointsChart(),
      ]);
      setRegChart(regRes.chart || []);
      setPointsChart(pointsRes.chart || []);
    } catch (e) {
      console.error("Failed to fetch chart data:", e);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res: any = await airdropApi.getUsersDetailed(
        usersPage,
        20,
        usersRoleFilter || undefined,
        usersSearch || undefined
      );
      setUsers(res.users || []);
      setUsersPagination(res.pagination || null);
    } catch (e) {
      console.error("Failed to fetch users:", e);
    }
  }, [usersPage, usersRoleFilter, usersSearch]);

  const fetchReferrals = useCallback(async () => {
    try {
      const res: any = await airdropApi.getReferralStats(referralsPage, 20);
      setReferrals(res.referrals || []);
      setTopReferrers(res.topReferrers || []);
      setReferralsPagination(res.pagination || null);
    } catch (e) {
      console.error("Failed to fetch referrals:", e);
    }
  }, [referralsPage]);

  const fetchVolumes = useCallback(async () => {
    try {
      const res: any = await airdropApi.getVolumeCommitments();
      setVolumes(res.commitments || []);
    } catch (e) {
      console.error("Failed to fetch volumes:", e);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }
    Promise.all([fetchStats(), fetchCharts()]).finally(() => setLoading(false));
  }, [user, navigate, fetchStats, fetchCharts]);

  // Tab data loading
  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "referrals") fetchReferrals();
    if (activeTab === "volume") fetchVolumes();
  }, [activeTab, fetchUsers, fetchReferrals, fetchVolumes]);

  const handleLogout = async () => {
    await logout();
    navigate("/waitlist");
  };

  const handleSearch = () => {
    setUsersPage(1);
    setUsersSearch(searchInput);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-sm z-50">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff6b35] flex items-center justify-center text-sm font-bold">
              B
            </div>
            <h1 className="text-xl font-display font-bold">Superadmin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/50 text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/70 hover:text-white hover:border-white/30 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Nav Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 rounded-lg p-1 w-fit">
          {(["overview", "users", "referrals", "volume"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition capitalize ${
                activeTab === tab
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ════════════════════ OVERVIEW TAB ════════════════════ */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <StatCard icon={<Users className="w-5 h-5" />} label="Total Users" value={stats?.totalUsers || 0} />
              <StatCard icon={<Store className="w-5 h-5" />} label="Total Merchants" value={stats?.totalMerchants || 0} />
              <StatCard icon={<Users className="w-5 h-5" />} label="All Accounts" value={stats?.totalAllUsers || 0} />
              <StatCard icon={<Coins className="w-5 h-5" />} label="Total Blip Points" value={stats?.totalBlipPoints || 0} />
              <StatCard icon={<Share2 className="w-5 h-5" />} label="Total Referrals" value={stats?.totalReferrals || 0} />
              <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Volume Commits" value={stats?.totalVolumeCommitments || 0} />
            </div>

            {/* Social Quest Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <QuestStatCard
                label="Twitter Quests"
                verified={stats?.socialQuests.twitter.verified || 0}
                total={stats?.socialQuests.twitter.total || 0}
              />
              <QuestStatCard
                label="Telegram Quests"
                verified={stats?.socialQuests.telegram.verified || 0}
                total={stats?.socialQuests.telegram.total || 0}
              />
              <QuestStatCard
                label="Whitepaper Quests"
                verified={stats?.socialQuests.whitepaper.verified || 0}
                total={stats?.socialQuests.whitepaper.total || 0}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Registration Chart */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Registrations (Last 30 Days)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={regChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
                        tickFormatter={(v) => v.slice(5)}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8,
                          color: "#fff",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="users"
                        name="Users"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="merchants"
                        name="Merchants"
                        stroke="#ff6b35"
                        fill="#ff6b35"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Points Distribution Chart */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Points Distribution by Event</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pointsChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="event"
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }}
                        tickFormatter={(v) => eventLabels[v] || v}
                        angle={-35}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8,
                          color: "#fff",
                        }}
                        labelFormatter={(v) => eventLabels[v] || v}
                        formatter={(value: number, name: string) => [
                          formatNumber(value),
                          name === "totalPoints" ? "Total Points" : "Count",
                        ]}
                      />
                      <Bar dataKey="totalPoints" name="Total Points" fill="#ff6b35" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ════════════════════ USERS TAB ════════════════════ */}
        {activeTab === "users" && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                {[
                  { label: "All", value: "" },
                  { label: "Users", value: "USER" },
                  { label: "Merchants", value: "MERCHANT" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setUsersRoleFilter(opt.value);
                      setUsersPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm transition ${
                      usersRoleFilter === opt.value
                        ? "bg-white text-black font-medium"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 w-64"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-left">
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium text-right">Blip Points</th>
                      <th className="px-4 py-3 font-medium text-center">Twitter</th>
                      <th className="px-4 py-3 font-medium text-center">Telegram</th>
                      <th className="px-4 py-3 font-medium text-center">Whitepaper</th>
                      <th className="px-4 py-3 font-medium text-center">Wallet</th>
                      <th className="px-4 py-3 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-white/30">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-white/90">{u.email}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                u.role === "MERCHANT"
                                  ? "bg-[#ff6b35]/20 text-[#ff6b35]"
                                  : u.role === "ADMIN"
                                  ? "bg-purple-500/20 text-purple-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-white/80">
                            {formatNumber(u.totalBlipPoints)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <QuestBadge status={u.socialQuests.twitter} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <QuestBadge status={u.socialQuests.telegram} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <QuestBadge status={u.socialQuests.whitepaper} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {u.walletLinked ? (
                              <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                            ) : (
                              <XCircle className="w-4 h-4 text-white/20 mx-auto" />
                            )}
                          </td>
                          <td className="px-4 py-3 text-white/50">{formatDate(u.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {usersPagination && usersPagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                  <span className="text-sm text-white/40">
                    Showing {(usersPagination.page - 1) * usersPagination.limit + 1}–
                    {Math.min(usersPagination.page * usersPagination.limit, usersPagination.total)} of{" "}
                    {usersPagination.total}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                      disabled={usersPage === 1}
                      className="p-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-white/60 min-w-[80px] text-center">
                      Page {usersPagination.page} of {usersPagination.totalPages}
                    </span>
                    <button
                      onClick={() => setUsersPage((p) => Math.min(usersPagination.totalPages, p + 1))}
                      disabled={usersPage === usersPagination.totalPages}
                      className="p-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ════════════════════ REFERRALS TAB ════════════════════ */}
        {activeTab === "referrals" && (
          <>
            {/* Top Referrers */}
            {topReferrers.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Top Referrers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {topReferrers.map((r, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-white/30">#{i + 1}</span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            r.role === "MERCHANT"
                              ? "bg-[#ff6b35]/20 text-[#ff6b35]"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {r.role}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 truncate">{r.email}</p>
                      <p className="text-xs text-white/40 mt-1">
                        {r.count} referrals · {formatNumber(r.totalReward)} pts earned
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Referrals Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-left">
                      <th className="px-4 py-3 font-medium">Referrer</th>
                      <th className="px-4 py-3 font-medium">Referred User</th>
                      <th className="px-4 py-3 font-medium text-right">Reward</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-white/30">
                          No referrals found
                        </td>
                      </tr>
                    ) : (
                      referrals.map((r) => (
                        <tr key={r._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-white/90">
                            {r.referrer_id?.email || "Unknown"}
                          </td>
                          <td className="px-4 py-3 text-white/70">
                            {r.referred_user_id?.email || "Unknown"}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-white/80">
                            {formatNumber(r.reward_amount)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                r.reward_status === "credited"
                                  ? "bg-green-500/20 text-green-400"
                                  : r.reward_status === "failed"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {r.reward_status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white/50">{formatDate(r.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {referralsPagination && referralsPagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                  <span className="text-sm text-white/40">
                    Showing {(referralsPagination.page - 1) * referralsPagination.limit + 1}–
                    {Math.min(referralsPagination.page * referralsPagination.limit, referralsPagination.total)} of{" "}
                    {referralsPagination.total}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReferralsPage((p) => Math.max(1, p - 1))}
                      disabled={referralsPage === 1}
                      className="p-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-white/60 min-w-[80px] text-center">
                      Page {referralsPagination.page} of {referralsPagination.totalPages}
                    </span>
                    <button
                      onClick={() => setReferralsPage((p) => Math.min(referralsPagination.totalPages, p + 1))}
                      disabled={referralsPage === referralsPagination.totalPages}
                      className="p-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ════════════════════ VOLUME TAB ════════════════════ */}
        {activeTab === "volume" && (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-left">
                    <th className="px-4 py-3 font-medium">Merchant Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Corridor</th>
                    <th className="px-4 py-3 font-medium">Volume Range</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {volumes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-white/30">
                        No volume commitments found
                      </td>
                    </tr>
                  ) : (
                    volumes.map((v) => (
                      <tr key={v._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-white/90">
                          {v.userId?.email || "Unknown"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              v.userId?.role === "MERCHANT"
                                ? "bg-[#ff6b35]/20 text-[#ff6b35]"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {v.userId?.role || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/70">{v.corridor}</td>
                        <td className="px-4 py-3 font-mono text-white/80">{v.volumeRange}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              v.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : v.status === "expired"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {v.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/50">{formatDate(v.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 text-white/40 mb-2">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold font-mono">{formatNumber(value)}</p>
    </div>
  );
}

function QuestStatCard({
  label,
  verified,
  total,
}: {
  label: string;
  verified: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((verified / total) * 100) : 0;
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-sm text-white/50 mb-2">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold font-mono">{verified}</span>
        <span className="text-white/30 text-sm mb-0.5">/ {total}</span>
        <span className="text-white/30 text-sm mb-0.5 ml-auto">{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
