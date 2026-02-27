import User from "../models/user.model.js";
import BotUser from "../models/botUser.model.js";
import Merchant from "../models/botMerchant.model.js";
import RedeemToken from "../models/redeemToken.model.js";

const MAX_ATTEMPTS = 5;

/**
 * POST /api/redeem/verify
 * Verify OTP and link Telegram account to website user.
 * Requires auth (protect middleware).
 */
export const verifyRedeemOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user._id;

    if (!otp || typeof otp !== "string" || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit OTP code.",
      });
    }

    // Check if user already has a linked Telegram account
    if (req.user.telegramUserId && req.user.telegramVerified) {
      return res.status(400).json({
        success: false,
        message: "Your account is already linked to a Telegram account.",
      });
    }

    // Find the OTP token
    const token = await RedeemToken.findOne({
      otp,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code. Please generate a new one from the Telegram bot using /redeem.",
      });
    }

    // Rate-limit attempts
    if (token.attempts >= MAX_ATTEMPTS) {
      token.used = true;
      await token.save();
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please generate a new OTP from the Telegram bot.",
      });
    }

    token.attempts += 1;
    await token.save();

    // Check if this Telegram account is already linked to another website user
    const existingLink = await User.findOne({
      telegramUserId: token.telegram_id,
      telegramVerified: true,
      _id: { $ne: userId },
    });

    if (existingLink) {
      return res.status(409).json({
        success: false,
        message: "This Telegram account is already linked to another Blip account.",
      });
    }

    const role = token.role || "user";

    // Look up the bot record based on role
    let botRecord = null;
    if (role === "merchant") {
      botRecord = await Merchant.findOne({ telegram_id: token.telegram_id });
    } else {
      botRecord = await BotUser.findOne({ telegram_id: token.telegram_id });
    }

    if (!botRecord) {
      return res.status(404).json({
        success: false,
        message: "Telegram bot account not found. Please use the Telegram bot first.",
      });
    }

    // Link the accounts
    await User.findByIdAndUpdate(userId, {
      telegramUserId: token.telegram_id,
      telegramVerified: true,
    });

    // Mark token as used
    token.used = true;
    await token.save();

    // Build response based on role
    const user = await User.findById(userId);
    const websitePoints = user.totalBlipPoints || 0;

    if (role === "merchant") {
      return res.status(200).json({
        success: true,
        message: "Merchant Telegram account linked successfully!",
        data: {
          role: "merchant",
          telegram_username: botRecord.username,
          telegram_name: botRecord.first_name,
          tier: botRecord.tier,
          status: botRecord.status,
          websitePoints,
          telegramPoints: 0,
          totalPoints: websitePoints,
        },
      });
    }

    // User role
    const telegramPoints = botRecord.points || 0;
    return res.status(200).json({
      success: true,
      message: "Telegram account linked successfully!",
      data: {
        role: "user",
        telegram_username: botRecord.username,
        telegram_name: botRecord.name,
        websitePoints,
        telegramPoints,
        totalPoints: websitePoints + telegramPoints,
      },
    });
  } catch (err) {
    console.error("[redeem] verifyOTP error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

/**
 * POST /api/redeem/verify-token
 * Auto-verify via secure linkToken (from the URL button).
 * Requires auth (protect middleware).
 */
export const verifyLinkToken = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user._id;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid link token.",
      });
    }

    // Check if user already has a linked Telegram account
    if (req.user.telegramUserId && req.user.telegramVerified) {
      return res.status(400).json({
        success: false,
        message: "Your account is already linked to a Telegram account.",
      });
    }

    // Find the token
    const redeemToken = await RedeemToken.findOne({
      linkToken: token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!redeemToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired link. Please generate a new one from the Telegram bot using /redeem.",
      });
    }

    // Check if this Telegram account is already linked to another website user
    const existingLink = await User.findOne({
      telegramUserId: redeemToken.telegram_id,
      telegramVerified: true,
      _id: { $ne: userId },
    });

    if (existingLink) {
      return res.status(409).json({
        success: false,
        message: "This Telegram account is already linked to another Blip account.",
      });
    }

    const role = redeemToken.role || "user";

    // Look up the bot record based on role
    let botRecord = null;
    if (role === "merchant") {
      botRecord = await Merchant.findOne({ telegram_id: redeemToken.telegram_id });
    } else {
      botRecord = await BotUser.findOne({ telegram_id: redeemToken.telegram_id });
    }

    if (!botRecord) {
      return res.status(404).json({
        success: false,
        message: "Telegram bot account not found. Please use the Telegram bot first.",
      });
    }

    // Link the accounts
    await User.findByIdAndUpdate(userId, {
      telegramUserId: redeemToken.telegram_id,
      telegramVerified: true,
    });

    // Mark token as used
    redeemToken.used = true;
    await redeemToken.save();

    // Build response based on role
    const user = await User.findById(userId);
    const websitePoints = user.totalBlipPoints || 0;

    if (role === "merchant") {
      return res.status(200).json({
        success: true,
        message: "Merchant Telegram account linked successfully!",
        data: {
          role: "merchant",
          telegram_username: botRecord.username,
          telegram_name: botRecord.first_name,
          tier: botRecord.tier,
          status: botRecord.status,
          websitePoints,
          telegramPoints: 0,
          totalPoints: websitePoints,
        },
      });
    }

    // User role
    const telegramPoints = botRecord.points || 0;
    return res.status(200).json({
      success: true,
      message: "Telegram account linked successfully!",
      data: {
        role: "user",
        telegram_username: botRecord.username,
        telegram_name: botRecord.name,
        websitePoints,
        telegramPoints,
        totalPoints: websitePoints + telegramPoints,
      },
    });
  } catch (err) {
    console.error("[redeem] verifyLinkToken error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

/**
 * GET /api/redeem/token-info?token=xxx
 * Public endpoint — returns role for a linkToken so the frontend
 * can show the correct login/register page (user vs merchant).
 * No auth required.
 */
export const getTokenInfo = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ success: false, message: "Missing token." });
    }

    const redeemToken = await RedeemToken.findOne({
      linkToken: token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!redeemToken) {
      return res.status(404).json({ success: false, message: "Token not found or expired." });
    }

    return res.status(200).json({
      success: true,
      data: { role: redeemToken.role || "user" },
    });
  } catch (err) {
    console.error("[redeem] tokenInfo error:", err.message);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

/**
 * GET /api/redeem/status
 * Get Telegram link status and aggregated points.
 * Requires auth (protect middleware).
 */
export const getRedeemStatus = async (req, res) => {
  try {
    const user = req.user;
    const websitePoints = user.totalBlipPoints || 0;

    if (!user.telegramUserId || !user.telegramVerified) {
      return res.status(200).json({
        success: true,
        data: {
          linked: false,
          websitePoints,
          telegramPoints: 0,
          totalPoints: websitePoints,
        },
      });
    }

    // Check both collections
    const botUser = await BotUser.findOne({ telegram_id: user.telegramUserId });
    const merchant = await Merchant.findOne({ telegram_id: user.telegramUserId });
    const telegramPoints = botUser?.points || 0;

    return res.status(200).json({
      success: true,
      data: {
        linked: true,
        telegram_username: botUser?.username || merchant?.username || null,
        telegram_name: botUser?.name || merchant?.first_name || null,
        merchant: merchant ? { tier: merchant.tier, status: merchant.status } : null,
        websitePoints,
        telegramPoints,
        totalPoints: websitePoints + telegramPoints,
      },
    });
  } catch (err) {
    console.error("[redeem] status error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
