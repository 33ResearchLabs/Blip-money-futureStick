import User from "../models/user.model.js";
import Referral from "../models/referral.model.js";
import BlipPointLog from "../models/BlipPointLog.model.js";

/**
 * GET /api/leaderboard/merchants
 * Returns top merchants ranked by totalBlipPoints
 */
export const getMerchantLeaderboard = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const sort = req.query.sort || "points"; // points | referrals

    // Get all merchants sorted by points
    const merchants = await User.find({ role: "MERCHANT" })
      .select("email totalBlipPoints emailVerified telegramVerified createdAt")
      .sort({ totalBlipPoints: -1 })
      .limit(limit)
      .lean();

    if (!merchants.length) {
      return res.status(200).json({
        success: true,
        leaderboard: [],
        total: 0,
      });
    }

    // Get referral counts for all merchants in one query
    const merchantIds = merchants.map((m) => m._id);
    const referralCounts = await Referral.aggregate([
      { $match: { referrer_id: { $in: merchantIds } } },
      { $group: { _id: "$referrer_id", count: { $sum: 1 } } },
    ]);

    const referralMap = {};
    for (const r of referralCounts) {
      referralMap[r._id.toString()] = r.count;
    }

    // Build leaderboard
    let leaderboard = merchants.map((m, i) => ({
      rank: i + 1,
      name: m.email.split("@")[0],
      verified: m.emailVerified || false,
      telegramVerified: m.telegramVerified || false,
      allocation: m.totalBlipPoints || 0,
      followers: referralMap[m._id.toString()] || 0,
    }));

    // Re-sort by referrals if requested
    if (sort === "referrals") {
      leaderboard.sort((a, b) => b.followers - a.followers);
      leaderboard = leaderboard.map((item, i) => ({ ...item, rank: i + 1 }));
    }

    return res.status(200).json({
      success: true,
      leaderboard,
      total: leaderboard.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/leaderboard/merchant-activity
 * Returns recent point activity across all merchants (or just the current user)
 * Query params:
 *   - scope: "all" (default) | "mine"
 *   - limit: number (default 20, max 50)
 */
export const getMerchantActivity = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const scope = req.query.scope || "all";

    const eventLabels = {
      REGISTER: "Joined as Founding Merchant",
      MERCHANT_REGISTER: "Joined as Founding Merchant",
      TWITTER_FOLLOW: "Completed Twitter verification",
      TELEGRAM_JOIN: "Joined Telegram channel",
      WHITEPAPER_READ: "Completed whitepaper quiz",
      CROSS_BORDER_SWAP: "Cross-border swap completed",
      REFERRAL_BONUS_EARNED: "Earned referral bonus",
      REFERRAL_BONUS_RECEIVED: "Received referral reward",
    };

    const eventIcons = {
      REGISTER: "check",
      MERCHANT_REGISTER: "check",
      TWITTER_FOLLOW: "harvest",
      TELEGRAM_JOIN: "liquidity",
      WHITEPAPER_READ: "commit",
      CROSS_BORDER_SWAP: "commit",
      REFERRAL_BONUS_EARNED: "harvest",
      REFERRAL_BONUS_RECEIVED: "liquidity",
    };

    let query;

    if (scope === "mine") {
      // Only current user's activity
      query = BlipPointLog.find({ userId: req.user._id });
    } else {
      // All merchant activity - get merchant user IDs first
      const merchantIds = await User.find({ role: "MERCHANT" })
        .select("_id")
        .lean();
      const ids = merchantIds.map((m) => m._id);
      query = BlipPointLog.find({ userId: { $in: ids } });
    }

    const logs = await query
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "email wallet_address")
      .lean();

    const activity = logs.map((log) => {
      const email = log.userId?.email || "";
      const wallet = log.userId?.wallet_address || "";
      const shortWallet = wallet
        ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
        : email.split("@")[0];

      return {
        id: log._id,
        event: log.event,
        icon: eventIcons[log.event] || "check",
        amount: log.bonusPoints || log.totalPoints || 0,
        desc: eventLabels[log.event] || log.event,
        merchant: email.split("@")[0],
        wallet: shortWallet,
        time: log.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      activity,
      total: activity.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
