import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import Referral from "../models/referral.model.js";
import VolumeCommitment from "../models/volumeCommitment.model.js";
import BlipPointLog from "../models/BlipPointLog.model.js";
import TweetVerification from "../models/TweetVerification.model.js";
import BotMerchant from "../models/botMerchant.model.js";
import BotUser from "../models/botUser.model.js";

/**
 * ============================
 * GET ALL SUBMITTED TASKS (ADMIN)
 * ============================
 */
export const getAllSubmittedTasks = async (req, res) => {
  try {
    const { status = "SUBMITTED", task_type } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (task_type) filter.task_type = task_type;

    const tasks = await Task.find(filter)
      .populate("user_id", "wallet_address email totalBlipPoints")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET ALL USERS (ADMIN)
 * ============================
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET DASHBOARD STATS (ADMIN)
 * ============================
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      pendingTasks,
      submittedTasks,
      verifiedTasks,
    ] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments({ status: "PENDING" }),
      Task.countDocuments({ status: "SUBMITTED" }),
      Task.countDocuments({ status: "VERIFIED" }),
    ]);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        pendingTasks,
        submittedTasks,
        verifiedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * SUPERADMIN STATS (AGGREGATED)
 * GET /api/admin/superadmin-stats
 * ============================
 */
export const getSuperadminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMerchants,
      totalAdmins,
      totalReferrals,
      totalVolumeCommitments,
      blipPointsAgg,
      twitterVerified,
      telegramVerified,
      whitepaperVerified,
      twitterTotal,
      telegramTotal,
      whitepaperTotal,
      tweetVerifications,
    ] = await Promise.all([
      User.countDocuments({ role: "USER" }),
      User.countDocuments({ role: "MERCHANT" }),
      User.countDocuments({ role: "ADMIN" }),
      Referral.countDocuments(),
      VolumeCommitment.countDocuments(),
      User.aggregate([{ $group: { _id: null, total: { $sum: "$totalBlipPoints" } } }]),
      Task.countDocuments({ task_type: "TWITTER", status: "VERIFIED" }),
      Task.countDocuments({ task_type: "TELEGRAM", status: "VERIFIED" }),
      Task.countDocuments({ task_type: "WHITEPAPER", status: "VERIFIED" }),
      Task.countDocuments({ task_type: "TWITTER" }),
      Task.countDocuments({ task_type: "TELEGRAM" }),
      Task.countDocuments({ task_type: "WHITEPAPER" }),
      TweetVerification.countDocuments({ verificationStatus: "verified" }),
    ]);

    const totalBlipPoints = blipPointsAgg[0]?.total || 0;

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalMerchants,
        totalAdmins,
        totalAllUsers: totalUsers + totalMerchants + totalAdmins,
        totalBlipPoints,
        totalReferrals,
        totalVolumeCommitments,
        tweetVerifications,
        socialQuests: {
          twitter: { verified: twitterVerified, total: twitterTotal },
          telegram: { verified: telegramVerified, total: telegramTotal },
          whitepaper: { verified: whitepaperVerified, total: whitepaperTotal },
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET ALL USERS DETAILED (PAGINATED)
 * GET /api/admin/users-detailed?page=1&limit=20&role=USER&search=email
 * ============================
 */
export const getAllUsersDetailed = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (role) filter.role = role;
    if (search) filter.email = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i" };

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter),
    ]);

    // Get task completion status for all users in this page
    const userIds = users.map((u) => u._id);
    const tasks = await Task.find({ user_id: { $in: userIds } })
      .select("user_id task_type status")
      .lean();

    // Map tasks by user
    const tasksByUser = {};
    tasks.forEach((task) => {
      const uid = task.user_id.toString();
      if (!tasksByUser[uid]) tasksByUser[uid] = [];
      tasksByUser[uid].push({ task_type: task.task_type, status: task.status });
    });

    // Attach social quest status to each user
    const usersWithQuests = users.map((user) => {
      const userTasks = tasksByUser[user._id.toString()] || [];
      return {
        ...user,
        socialQuests: {
          twitter: userTasks.find((t) => t.task_type === "TWITTER")?.status || null,
          telegram: userTasks.find((t) => t.task_type === "TELEGRAM")?.status || null,
          whitepaper: userTasks.find((t) => t.task_type === "WHITEPAPER")?.status || null,
        },
      };
    });

    return res.json({
      success: true,
      users: usersWithQuests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET REFERRAL STATS
 * GET /api/admin/referral-stats
 * ============================
 */
export const getReferralStats = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [referrals, total, topReferrers] = await Promise.all([
      Referral.find()
        .populate("referrer_id", "email totalBlipPoints role")
        .populate("referred_user_id", "email totalBlipPoints role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Referral.countDocuments(),
      Referral.aggregate([
        { $group: { _id: "$referrer_id", count: { $sum: 1 }, totalReward: { $sum: "$reward_amount" } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            email: "$user.email",
            role: "$user.role",
            count: 1,
            totalReward: 1,
          },
        },
      ]),
    ]);

    return res.json({
      success: true,
      referrals,
      topReferrers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET VOLUME COMMITMENTS
 * GET /api/admin/volume-commitments
 * ============================
 */
export const getVolumeCommitments = async (req, res) => {
  try {
    const commitments = await VolumeCommitment.find()
      .populate("userId", "email totalBlipPoints role")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: commitments.length,
      commitments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET REGISTRATION CHART DATA (LAST 30 DAYS)
 * GET /api/admin/registration-chart
 * ============================
 */
export const getRegistrationChart = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Transform into { date, users, merchants } format
    const chartMap = {};
    data.forEach((item) => {
      const date = item._id.date;
      if (!chartMap[date]) chartMap[date] = { date, users: 0, merchants: 0 };
      if (item._id.role === "USER") chartMap[date].users = item.count;
      if (item._id.role === "MERCHANT") chartMap[date].merchants = item.count;
    });

    // Fill in missing days with 0
    const chart = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      chart.push(chartMap[dateStr] || { date: dateStr, users: 0, merchants: 0 });
    }

    return res.json({ success: true, chart });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET VOLUME CHART DATA (LAST 30 DAYS)
 * GET /api/admin/volume-chart
 * ============================
 */
export const getVolumeChart = async (req, res) => {
  try {
    // Helper to parse volumeRange like "$50K - $100K" → upper bound in dollars
    const parseVolume = (range) => {
      const match = range?.match(/\$(\d+)K\s*(?:-\s*\$(\d+)K)?/);
      if (!match) return 0;
      return (match[2] ? parseInt(match[2]) : parseInt(match[1])) * 1000;
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all commitments in last 30 days with date + volumeRange
    const recentCommitments = await VolumeCommitment.find({
      createdAt: { $gte: thirtyDaysAgo },
    }).select("volumeRange createdAt").lean();

    // Group by day, sum volume amounts
    const chartMap = {};
    for (const c of recentCommitments) {
      const dateStr = c.createdAt.toISOString().split("T")[0];
      if (!chartMap[dateStr]) chartMap[dateStr] = 0;
      chartMap[dateStr] += parseVolume(c.volumeRange);
    }

    // Fill in missing days with cumulative total
    const chart = [];
    const now = new Date();
    let cumulative = 0;
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const daily = chartMap[dateStr] || 0;
      cumulative += daily;
      chart.push({ date: dateStr, daily, cumulative });
    }

    // Calculate total committed volume (all time)
    const allCommitments = await VolumeCommitment.find().select("volumeRange").lean();
    let totalVolume = 0;
    for (const c of allCommitments) {
      totalVolume += parseVolume(c.volumeRange);
    }

    return res.json({ success: true, chart, totalVolume });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET POINTS DISTRIBUTION CHART
 * GET /api/admin/points-chart
 * ============================
 */
/**
 * ============================
 * GET BOT MERCHANTS (from Telegram bot)
 * GET /api/admin/bot-merchants?page=1&limit=20&status=pending&search=username
 * ============================
 */
export const getBotMerchants = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { username: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i" } },
        { first_name: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i" } },
        { telegram_id: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i" } },
      ];
    }

    const [merchants, total] = await Promise.all([
      BotMerchant.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      BotMerchant.countDocuments(filter),
    ]);

    // Stats summary
    const [totalBotMerchants, pendingCount, approvedCount, rejectedCount] = await Promise.all([
      BotMerchant.countDocuments(),
      BotMerchant.countDocuments({ status: "pending" }),
      BotMerchant.countDocuments({ status: "approved" }),
      BotMerchant.countDocuments({ status: "rejected" }),
    ]);

    return res.json({
      success: true,
      merchants,
      stats: {
        total: totalBotMerchants,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET BOT USERS (from Telegram airdrop bot)
 * GET /api/admin/bot-users?page=1&limit=20&country=India&onboarded=true&search=username
 * ============================
 */
export const getBotUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, country, onboarded, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (country) filter.country = country;
    if (onboarded === "true") filter.onboarded = true;
    if (onboarded === "false") filter.onboarded = false;
    if (search) {
      filter.$or = [
        { name: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i" } },
        { username: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i" } },
        { telegram_id: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i" } },
      ];
    }

    const [botUsers, total] = await Promise.all([
      BotUser.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      BotUser.countDocuments(filter),
    ]);

    // Stats summary
    const [totalBotUsers, onboardedCount, pointsAgg, referralsAgg] = await Promise.all([
      BotUser.countDocuments(),
      BotUser.countDocuments({ onboarded: true }),
      BotUser.aggregate([{ $group: { _id: null, total: { $sum: "$points" } } }]),
      BotUser.aggregate([{ $group: { _id: null, total: { $sum: "$referrals" } } }]),
    ]);

    return res.json({
      success: true,
      botUsers,
      stats: {
        total: totalBotUsers,
        onboarded: onboardedCount,
        totalPoints: pointsAgg[0]?.total || 0,
        totalReferrals: referralsAgg[0]?.total || 0,
      },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPointsDistributionChart = async (req, res) => {
  try {
    const data = await BlipPointLog.aggregate([
      {
        $group: {
          _id: "$event",
          totalPoints: { $sum: "$bonusPoints" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalPoints: -1 } },
    ]);

    const chart = data.map((item) => ({
      event: item._id,
      totalPoints: item.totalPoints,
      count: item.count,
    }));

    return res.json({ success: true, chart });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
