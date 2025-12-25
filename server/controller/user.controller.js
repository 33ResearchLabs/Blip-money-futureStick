import User from "../models/user.js";
import { signToken } from "../utils/jwt.js";

export const loginOrRegister = async (req, res) => {
  try {
    const { wallet_address, email, phone, referral_code } = req.body;

    console.log("📥 Login/Register request:", {
      wallet_address,
      email,
      phone,
      referral_code,
    });

    if (!wallet_address) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    if (!email && !phone) {
      return res.status(400).json({
        message: "Email or phone number is required",
      });
    }

    let user = await User.findOne({ wallet_address });

    // ✅ LOGIN
    if (user) {
      user.lastLoginAt = new Date();

      // Update referral_code if provided and not already set
      if (referral_code && !user.referral_code) {
        user.referral_code = referral_code;
      }

      await user.save();

      const token = signToken({ id: user._id });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log("✅ User logged in:", user.wallet_address);

      return res.status(200).json({
        message: "Login successful",
        user,
        isNewUser: false,
      });
    }

    // 🆕 REGISTER
    user = await User.create({
      wallet_address,
      email,
      phone,
      referral_code,
      status: "connected",
      lastLoginAt: new Date(),
    });

    const token = signToken({ id: user._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ New user registered:", user.wallet_address);

    return res.status(201).json({
      message: "User registered successfully",
      user,
      isNewUser: true,
    });
  } catch (error) {
    console.error("❌ Error in loginOrRegister:", error);
    res.status(500).json({ message: error.message });
  }
};


export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};