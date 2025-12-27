import User from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";
import UserBlipPoint from "../models/userBlipPoints.model.js";
import BlipPointLog from "../models/BlipPointLog.model.js";
import { REGISTER_BONUS_POINTS } from "../utils/blipPoints.js";
import { generateReferralId } from "../utils/generateReferralId.js";
import jwt from 'jsonwebtoken'
import Referral from "../models/referral.model.js";
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
    const { email, phone, wallet_address, referral_code } = req.body;

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
      user.lastLoginAt = new Date();

      // Update referralCode if not already set
      if (!user.referralCode) {
        user.referralCode = generateReferralId({ email, walletAddress: wallet_address });
      }

      await user.save();

      const token = generateToken(user._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log("✅ User logged in:", user.wallet_address);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          wallet_address: user.wallet_address,
          referralCode: user.referralCode,
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
      referralCode: generateReferralId({ email, walletAddress: wallet_address }),
    });

    console.log("✅ User registered:", user.wallet_address);

    /**
     * =====================
     * REFERRAL LOGIC (only on register)
     * =====================
     */
    if (referral_code) {
      // Find the referrer by their referral code
      const referrer = await User.findOne({ referralCode: referral_code });

      if (referrer) {
        console.log(`✅ Referral found: ${referrer.wallet_address} referred ${user.wallet_address}`);

        // Create referral record
        try {
          await Referral.create({
            referrer_id: referrer._id,
            referred_user_id: user._id,
            referral_code: referral_code,
          });

          // Update new user (who used referral)
          await User.findByIdAndUpdate(
            user._id,
            {
              $addToSet: {
                referredByUsers: referrer._id,
              },
            },
            { new: true }
          );

          console.log("✅ Referral record created successfully");
        } catch (referralError) {
          // Log error but don't fail registration
          console.error("⚠️ Referral creation failed:", referralError.message);
        }
      } else {
        console.log("⚠️ Invalid referral code provided:", referral_code);
      }
    }

    // Generate token for new user
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send response for registration (with or without referral)
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        wallet_address: user.wallet_address,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.error("Register/Login error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Session verified for user:", user.wallet_address);

    return res.status(200).json({
      user: {
        wallet_address: user.wallet_address,
        email: user.email,
        referralCode: user.referralCode,
        status: user.status,
      }
    });
  } catch (error) {
    console.error("❌ Error in getMe:", error);
    res.status(500).json({ message: error.message });
  }
};