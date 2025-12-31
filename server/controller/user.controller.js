import mongoose from "mongoose";

import User from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";
import UserBlipPoint from "../models/userBlipPoints.model.js";
import BlipPointLog from "../models/BlipPointLog.model.js";
import { REGISTER_BONUS_POINTS, REFERRAL_BONUS_POINTS } from "../utils/blipPoints.js";
import { generateReferralCode } from "../utils/generateReferralId.js";
import jwt from 'jsonwebtoken'
import Referral from "../models/referral.model.js"
/**
 * ============================
 * REGISTER USER
 * ============================
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};



export const registerAndLoginUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, phone, wallet_address, referral_code } = req.body;

    // 1️⃣ BASIC VALIDATION
    if (!wallet_address) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    // 2️⃣ FIND USER (LOGIN CHECK)
    let user = await User.findOne({
      wallet_address,
    }).session(session);

    /**
     * =====================
     * LOGIN FLOW
     * =====================
     */
    if (user) {
      // Check if email matches (if user has email and request has email)
      if (email && user.email && user.email !== email) {
        await session.abortTransaction();
        session.endSession();
        return res.status(409).json({
          success: false,
          message: "This wallet is already registered with a different email",
          code: "WALLET_EMAIL_MISMATCH",
        });
      }

      user.lastLoginAt = new Date();
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      const token = signToken(user._id);

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user,
      });
    }

    /**
     * =====================
     * REGISTER FLOW
     * =====================
     */

    // 🔑 Generate self referral code
    const selfReferralCode = await generateReferralCode({
      wallet_address,
      email,
    });

    user = await User.create(
      [
        {
          email,
          phone,
          wallet_address,
          referralCode: selfReferralCode,
          lastLoginAt: new Date(),
          totalBlipPoints: REGISTER_BONUS_POINTS, // Set initial registration bonus
        },
      ],
      { session }
    );

    user = user[0];

    // 🔹 Register bonus (NEW USER)
    await UserBlipPoint.findOneAndUpdate(
      { userId: user._id },
      { $inc: { points: REGISTER_BONUS_POINTS } },
      { upsert: true, session }
    );

    await BlipPointLog.create(
      [
        {
          userId: user._id,
          bonusPoints: REGISTER_BONUS_POINTS,
          event: "REGISTER",
        },
      ],
      { session }
    );

    /**
     * =====================
     * REFERRAL LOGIC
     * =====================
     */
    if (referral_code) {
      const referrer = await User.findOne({
        referralCode: referral_code,
      }).session(session);

      if (referrer && referrer._id.toString() !== user._id.toString()) {
        // Prevent duplicate referral
        const alreadyReferred = await Referral.findOne({
          referred_user_id: user._id,
        }).session(session);

        if (!alreadyReferred) {
          await Referral.create(
            [
              {
                referrer_id: referrer._id,
                referred_user_id: user._id,
                referral_code: referral_code,
                reward_status: "credited",
                reward_amount: REFERRAL_BONUS_POINTS,
              },
            ],
            { session }
          );

          // Cache referrer in user
          await User.updateOne(
            { _id: user._id },
            { $set: { referredBy: referrer._id } },
            { session }
          );

          // 🎁 REFERRER BONUS
          await UserBlipPoint.findOneAndUpdate(
            { userId: referrer._id },
            { $inc: { points: REFERRAL_BONUS_POINTS } },
            { upsert: true, session }
          );

          await BlipPointLog.create(
            [
              {
                userId: referrer._id,
                bonusPoints: REFERRAL_BONUS_POINTS,
                event: "REFERRAL_BONUS_EARNED",
              },
            ],
            { session }
          );

          // 🎁 NEW USER BONUS
          await UserBlipPoint.findOneAndUpdate(
            { userId: user._id },
            { $inc: { points: REFERRAL_BONUS_POINTS } },
            { upsert: true, session }
          );

          await BlipPointLog.create(
            [
              {
                userId: user._id,
                bonusPoints: REFERRAL_BONUS_POINTS,
                event: "REFERRAL_BONUS_RECEIVED",
              },
            ],
            { session }
          );

          // 🔄 Update cached totalBlipPoints on User model
          await User.updateOne(
            { _id: referrer._id },
            { $inc: { totalBlipPoints: REFERRAL_BONUS_POINTS } },
            { session }
          );
          await User.updateOne(
            { _id: user._id },
            { $inc: { totalBlipPoints: REFERRAL_BONUS_POINTS } },
            { session }
          );
        }
      }
    }

    await session.commitTransaction();
    session.endSession();

    const token = signToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Register/Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
/**
 * ============================
 * Logout user
 * ============================
 */

export const logout = (req, res) => {
  // Must include same options used when setting the cookie
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
/**
 * ============================
 * GET CURRENT USER (ME)
 * ============================
 */
export const getMe = async (req, res) => {
  try {
    // req.user is attached by protect middleware
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Calculate actual points from BlipPointLog (most accurate)
    const pointLogs = await BlipPointLog.find({ userId: user._id });
    const calculatedPoints = pointLogs.reduce((sum, log) => {
      return sum + (log.bonusPoints || log.totalPoints || 0);
    }, 0);

    // Fallback to UserBlipPoint if no logs found
    let actualPoints = calculatedPoints;
    if (actualPoints === 0) {
      const userPoints = await UserBlipPoint.findOne({ userId: user._id });
      actualPoints = userPoints?.points || user.totalBlipPoints || 0;
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        wallet_address: user.wallet_address,
        referralCode: user.referralCode,
        totalBlipPoints: actualPoints,
        status: user.status,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET MY REFERRALS
 * ============================
 * Returns list of users referred by the current user
 */
export const getMyReferrals = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all referrals where current user is the referrer
    const referrals = await Referral.find({
      referrer_id: userId,
    })
      .populate("referred_user_id", "email wallet_address createdAt totalBlipPoints")
      .sort({ createdAt: -1 });

    // Format the response
    const referredUsers = referrals.map((ref) => ({
      id: ref.referred_user_id?._id,
      email: ref.referred_user_id?.email,
      wallet_address: ref.referred_user_id?.wallet_address,
      joinedAt: ref.referred_user_id?.createdAt || ref.createdAt,
      totalBlipPoints: ref.referred_user_id?.totalBlipPoints || 0,
      rewardStatus: ref.reward_status,
      rewardAmount: ref.reward_amount,
    }));

    // Calculate total rewards earned from referrals
    const totalRewardsEarned = referrals.reduce(
      (sum, ref) => sum + (ref.reward_amount || 0),
      0
    );

    return res.status(200).json({
      success: true,
      referrals: referredUsers,
      totalReferrals: referredUsers.length,
      totalRewardsEarned,
    });
  } catch (error) {
    console.error("GetMyReferrals error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET MY POINTS HISTORY
 * ============================
 * Returns list of all points earned by the user
 */
export const getMyPointsHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all point logs for this user
    const pointsHistory = await BlipPointLog.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    // Format the response with readable event names
    const eventLabels = {
      REGISTER: "Registration Bonus",
      TWITTER_FOLLOW: "Twitter Follow",
      TELEGRAM_JOIN: "Telegram Join",
      WHITEPAPER_READ: "Whitepaper Quiz",
      CROSS_BORDER_SWAP: "Cross Border Swap",
      REFERRAL_BONUS_EARNED: "Referral Bonus (You referred someone)",
      REFERRAL_BONUS_RECEIVED: "Referral Bonus (You were referred)",
    };

    const history = pointsHistory.map((log) => ({
      id: log._id,
      points: log.bonusPoints || log.totalPoints || 0,
      event: log.event,
      eventLabel: eventLabels[log.event] || log.event,
      date: log.createdAt,
    }));

    // Calculate total points
    const totalPoints = history.reduce((sum, log) => sum + log.points, 0);

    return res.status(200).json({
      success: true,
      history,
      totalPoints,
      totalTransactions: history.length,
    });
  } catch (error) {
    console.error("GetMyPointsHistory error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * FIX POINTS DATA (MIGRATION)
 * ============================
 * Fixes BlipPointLog entries that have bonusPoints: 0 or missing
 * This is needed because old entries were saved incorrectly
 */
export const fixPointsData = async (req, res) => {
  try {
    const pointsMap = {
      REGISTER: 500,
      TWITTER_FOLLOW: 50,
      TELEGRAM_JOIN: 50,
      WHITEPAPER_READ: 50,
      CROSS_BORDER_SWAP: 100,
      REFERRAL_BONUS_EARNED: 100,
      REFERRAL_BONUS_RECEIVED: 100,
    };

    // Step 1: Fix all BlipPointLog entries with missing or zero bonusPoints
    const logsToFix = await BlipPointLog.find({
      $or: [
        { bonusPoints: { $exists: false } },
        { bonusPoints: 0 },
        { bonusPoints: null },
      ],
    });

    let fixedLogsCount = 0;

    for (const log of logsToFix) {
      const correctPoints = pointsMap[log.event] || 0;
      if (correctPoints > 0) {
        await BlipPointLog.updateOne(
          { _id: log._id },
          { $set: { bonusPoints: correctPoints } }
        );
        fixedLogsCount++;
      }
    }

    // Step 2: Recalculate and fix User.totalBlipPoints for all users
    const allUsers = await User.find({});
    let fixedUsersCount = 0;

    for (const user of allUsers) {
      // Calculate total from BlipPointLog
      const userLogs = await BlipPointLog.find({ userId: user._id });
      const calculatedTotal = userLogs.reduce((sum, log) => {
        return sum + (log.bonusPoints || pointsMap[log.event] || 0);
      }, 0);

      // Update user's totalBlipPoints if different
      if (user.totalBlipPoints !== calculatedTotal && calculatedTotal > 0) {
        await User.updateOne(
          { _id: user._id },
          { $set: { totalBlipPoints: calculatedTotal } }
        );
        fixedUsersCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Fixed ${fixedLogsCount} point logs and ${fixedUsersCount} user totals`,
      fixedLogsCount,
      fixedUsersCount,
      totalLogsChecked: logsToFix.length,
      totalUsersChecked: allUsers.length,
    });
  } catch (error) {
    console.error("FixPointsData error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
