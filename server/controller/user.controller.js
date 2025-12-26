import User from "../models/user.js";
import { signToken } from "../utils/jwt.js";
import UserBlipPoint from "../models/UserBlipPoint.js";
import BlipPointLog from "../models/BlipPointLog.js";
import { REGISTER_BONUS_POINTS } from "../utils/blipPoints.js";
import { generateReferralId } from "../utils/generateReferralId.js";
import jwt from 'jsonwebtoken'
import referral from "../models/referral.js";
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
  try {
    const { email, phone,  wallet_address, referralCode } = req.body;

    // 1️⃣ Validation
    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: "Email or phone is required" });
    }

    if (!wallet_address) {
      return res
        .status(400)
        .json({ message: "Wallet address is required" });
    }

    // 2️⃣ Check if user already exists
    let user = await User.findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null,
        { wallet_address },
      ].filter(Boolean),
    });

    /**
     * =====================
     * LOGIN FLOW
     * =====================
     */
    if (user) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: generateToken(user._id),
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          wallet_address: user.wallet_address,
        },
      });
    }

    /**
     * =====================
     * REGISTER FLOW
     * =====================
     */
    user = await User.create({
      email,
      phone,
      wallet_address,
    });

    /**
     * =====================
     * REFERRAL LOGIC (only on register)
     * =====================
     */
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });

      // prevent self-referral
      if (referrer && referrer._id.toString() !== user._id.toString()) {
        await referral.create({
          referrer_id: referrer._id,
          referred_user_id: user._id,
          referral_code: referralCode,
          actions: [
            {
              action: "REGISTER",
              completed: true,
              completedAt: new Date(),
            },
            { action: "FOLLOW_TWITTER", completed: false },
            { action: "JOIN_TELEGRAM", completed: false },
          ],
        });
      }
    }

    await User.findByIdAndUpdate(user._id, {$set : })

    // 3️⃣ Send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        wallet_address: user.wallet_address,
      },
    });
  } catch (error) {
    console.error("Register/Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};