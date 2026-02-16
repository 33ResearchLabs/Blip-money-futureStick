import User from "../models/user.model.js";
import { verifyTelegramMembership, getBotInfo } from "../utils/telegram.js";

const TELEGRAM_REWARD_POINTS = 100;

/**
 * Verify Telegram channel membership and award points
 * Accepts telegramUserId directly from request body (no bot linking needed)
 * POST /api/telegram/verify
 */
export const verifyMembership = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { telegramUserId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!telegramUserId || !/^\d+$/.test(telegramUserId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid Telegram User ID (numeric).",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check wallet is linked
    if (!user.walletLinked) {
      return res.status(403).json({
        success: false,
        message: "Please link your wallet first.",
      });
    }

    // Check if already verified
    if (user.telegramVerified) {
      return res.status(400).json({
        success: false,
        message: "Telegram membership already verified.",
      });
    }

    // Check if this Telegram ID is already used by another user
    const existingUser = await User.findOne({
      telegramUserId,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This Telegram account is already linked to another user.",
      });
    }

    // Verify membership via Telegram Bot API
    const verification = await verifyTelegramMembership(telegramUserId);

    if (!verification.isMember) {
      return res.status(400).json({
        success: false,
        message:
          verification.status === "error"
            ? "Could not verify membership. Please try again."
            : "You haven't joined the Telegram channel yet. Please join and try again.",
        code: "NOT_MEMBER",
      });
    }

    // Mark as verified, save Telegram ID, and award points
    user.telegramUserId = telegramUserId;
    user.telegramVerified = true;
    user.totalBlipPoints = (user.totalBlipPoints || 0) + TELEGRAM_REWARD_POINTS;

    if (!user.pointsHistory) {
      user.pointsHistory = [];
    }
    user.pointsHistory.push({
      action: "Telegram Channel - Join & Verify",
      points: TELEGRAM_REWARD_POINTS,
      date: new Date(),
      details: `Telegram ID: ${telegramUserId}`,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Telegram membership verified! Points awarded.",
      data: {
        pointsAwarded: TELEGRAM_REWARD_POINTS,
        totalPoints: user.totalBlipPoints,
      },
    });
  } catch (error) {
    console.error("Telegram verify error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed. Please try again.",
    });
  }
};

/**
 * Check if user's Telegram is verified
 * GET /api/telegram/status
 */
export const getTelegramStatus = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);

    return res.status(200).json({
      success: true,
      data: {
        linked: !!user?.telegramUserId,
        verified: !!user?.telegramVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get status",
    });
  }
};

/**
 * Test bot configuration (for debugging)
 * GET /api/telegram/test-bot
 */
export const testBotConfig = async (req, res) => {
  try {
    const botInfo = await getBotInfo();

    if (!botInfo.ok) {
      return res.status(500).json({
        success: false,
        message: "Bot configuration error",
        error: botInfo.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bot is configured correctly",
      data: {
        botUsername: botInfo.result.username,
        botName: botInfo.result.first_name,
        botId: botInfo.result.id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to test bot configuration",
      error: error.message,
    });
  }
};
