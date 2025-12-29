
import User from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";
import UserBlipPoint from "../models/userBlipPoints.model.js";
import BlipPointLog from "../models/BlipPointLog.model.js";
import { REGISTER_BONUS_POINTS, REFERRAL_BONUS_POINTS } from "../utils/blipPoints.js";
import { generateReferralCode } from "../utils/generateReferralId.js";
import jwt from 'jsonwebtoken'
import referral from "../models/referral.model.js"
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
    const { email, phone, wallet_address, referralCode } = req.body;

    // 1️⃣ Validation
    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    if (!wallet_address) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    // 🔁 WALLET DUPLICATE CHECK START
    const walletExists = await User.findOne({ wallet_address });

    if (walletExists && (!email || walletExists.email !== email) && (!phone || walletExists.phone !== phone)) {
      return res.status(409).json({
        message: "Wallet address already linked with another user",
      });
    }
    // 🔁 WALLET DUPLICATE CHECK END

    // 2️⃣ Check if user exists (LOGIN CHECK)
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
      await user.save();

      const token = signToken(user._id);

      // ✅ COOKIE SET (MAIN FIX)
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "dev" ? "none" : "lax",
        secure: process.env.NODE_ENV === "dev",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });


      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: generateToken(user._id),
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

    // 🔑 generate self referral code (ALWAYS)
    const selfReferralCode = await generateReferralCode({
      wallet_address,
      email,
    });

    user = await User.create({
      email,
      phone,
      wallet_address,
      referralCode: selfReferralCode,
      lastLoginAt: new Date(),
    });

    /**
     * =====================
     * REFERRAL MAPPING (IF CODE PROVIDED)
     * =====================
     */
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });

      if (referrer && referrer._id.toString() !== user._id.toString()) {
        // Referral record
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
            { action: "WHITEPAPER_READ", completed: false },
            { action: "CROSS_BORDER_SWAP", completed: false }
          ],
        });

        // ✅ 1️⃣ Referrer ke document me new user add
        await User.updateOne(
          { _id: referrer._id },
          { $addToSet: { referredByUsers: user._id } }
        );

        // ✅ 2️⃣ New user ke document me referrer ka userId save
        await User.updateOne(
          { _id: user._id },
          { $addToSet: { referredByUsers: referrer._id } }
        );
        // SAFE POINT INCREMENT 

        // Referrer +100
        await UserBlipPoint.findOneAndUpdate(
          { userId: referrer._id },
          { $inc: { points: REFERRAL_BONUS_POINTS } },
          { upsert: true }
        );

        await BlipPointLog.create({
          userId: referrer._id,
          bonusPoints: REFERRAL_BONUS_POINTS,
          type: "CREDIT",
          event: "REFERRAL_BONUS_EARNED",
        });

        // New user +100
        await UserBlipPoint.findOneAndUpdate(
          { userId: user._id },
          { $inc: { points: REFERRAL_BONUS_POINTS } },
          { upsert: true }
        );

        await BlipPointLog.create({
          userId: user._id,
          bonusPoints: REFERRAL_BONUS_POINTS,
          type: "CREDIT",
          event: "REFERRAL_BONUS_RECEIVED",
        });
      }
    }
    /**
     * =====================
     * REGISTER BONUS + LOG
     * =====================
     */
    //  REGISTER BONUS SAFE ADD
    await UserBlipPoint.findOneAndUpdate(
      { userId: user._id },
      { $inc: { points: REGISTER_BONUS_POINTS } },
      { upsert: true }
    );

    await BlipPointLog.create({
      userId: user._id,
      bonusPoints: REGISTER_BONUS_POINTS,
      type: "CREDIT",
      event: "REGISTER",
    });
    // 🔁 CHANGE END

    /**
     * =====================
     * RESPONSE
     * =====================
     * 
     * 
     */

    const token = signToken(user._id);

    // ✅ COOKIE SET (REGISTER)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "dev" ? "none" : "lax",
      secure: process.env.NODE_ENV === "dev",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
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
    return res.status(500).json({ message: "Server error" });
  }
};




export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};