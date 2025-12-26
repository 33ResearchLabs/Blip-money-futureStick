import Referral from "../models/referral.model.js";
import User from "../models/user.model.js";

/**
 * CREATE REFERRAL
 * - referrer exist hona chahiye
 * - referred user exist hona chahiye
 * - same user ko 2 baar refer nahi kar sakte (schema unique handle karega)
 */
export const createReferral = async (req, res) => {
  try {
    const { referrer_id, referred_user_id } = req.body;

    if (!referrer_id || !referred_user_id) {
      return res.status(400).json({
        message: "referrer_id and referred_user_id are required",
      });
    }

    if (referrer_id === referred_user_id) {
      return res.status(400).json({
        message: "User cannot refer himself",
      });
    }

    // 🔍 check users exist
    const referrer = await User.findById(referrer_id);
    const referredUser = await User.findById(referred_user_id);

    if (!referrer || !referredUser) {
      return res.status(404).json({
        message: "Referrer or referred user not found",
      });
    }

    const referral = await Referral.create({
      referrer_id,
      referred_user_id,
    });

    return res.status(201).json({
      message: "Referral created successfully",
      referral,
    });
  } catch (error) {
    // duplicate referral (unique referred_user_id)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already referred by someone",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET REFERRALS BY REFERRER
 */
export const getReferralsByReferrer = async (req, res) => {
  try {
    const { referrer_id } = req.params;

    const referrals = await Referral.find({ referrer_id })
      .populate("referred_user_id", "email phone status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      referrals,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET REFERRAL BY REFERRED USER
 */
export const getReferralByReferredUser = async (req, res) => {
  try {
    const { referred_user_id } = req.params;

    const referral = await Referral.findOne({ referred_user_id }).populate(
      "referrer_id",
      "email phone status"
    );

    if (!referral) {
      return res.status(404).json({
        message: "Referral not found for this user",
      });
    }

    return res.status(200).json({
      referral,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * UPDATE REFERRAL REWARD STATUS (ADMIN / SYSTEM)
 */
export const updateReferralRewardStatus = async (req, res) => {
  try {
    const { referralId } = req.params;
    const { reward_status } = req.body;

    if (!["pending", "credited", "failed"].includes(reward_status)) {
      return res.status(400).json({
        message: "Invalid reward_status",
      });
    }

    const referral = await Referral.findById(referralId);

    if (!referral) {
      return res.status(404).json({
        message: "Referral not found",
      });
    }

    referral.reward_status = reward_status;
    await referral.save();

    return res.status(200).json({
      message: "Reward status updated",
      referral,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
