import speakeasy from "speakeasy";
import QRCode from "qrcode";
import User from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";

/**
 * ================================
 * ENABLE GOOGLE AUTH (QR CODE)
 * ================================
 */
export const enableGoogleAuth = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        // 🔴 ADD: prevent re-enable
        if (user.twoFactorEnabled) {
            return res.status(400).json({ message: "2FA already enabled" });
        }

        const secret = speakeasy.generateSecret({
            name: `Blip Money Airdrop (${user.email})`,
        });

        const qrCode = await QRCode.toDataURL(secret.otpauth_url);

        await User.findByIdAndUpdate(userId, {
            twoFactorSecret: secret.base32,
        });

        return res.status(200).json({
            success: true,
            qrCode,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to generate QR" });
    }
};

/**
 * ================================
 * VERIFY & CONFIRM ENABLE
 * ================================
 */
export const verifyEnableGoogleAuth = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.user.id);

        const valid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: otp,
            window: 1,
        });

        if (!valid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.twoFactorEnabled = true;
        await user.save();

        return res.json({
            success: true,
            message: "Google Authenticator enabled",
        });
    } catch {
        return res.status(500).json({ message: "Verification failed" });
    }
};

/**
 * ================================
 * VERIFY LOGIN OTP (TOTP)
 * ================================
 */

export const verifyLoginTotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 🔴 VALIDATION
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "email and otp are required",
      });
    }

    // 🔴 USER FIND BY EMAIL (INSTEAD OF userId)
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    // 🔐 VERIFY GOOGLE AUTH OTP
    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ SAME AS NORMAL LOGIN
    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 🔒 REMOVE SENSITIVE FIELD
    const safeUser = user.toObject();
    delete safeUser.twoFactorSecret;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser, // ✅ SAME RESPONSE AS NORMAL LOGIN
    });

  } catch (error) {
    console.error("verifyLoginTotp error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * ================================
 * DISABLE GOOGLE AUTH
 * ================================
 */
export const disableGoogleAuth = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.user.id);

        if (!user || !user.twoFactorSecret) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const valid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: otp,
            window: 1,
        });

        if (!valid) {
            return res.status(401).json({ message: "Invalid OTP" });
        }

        user.twoFactorEnabled = false;
        user.twoFactorSecret = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "2FA disabled successfully",
        });
    } catch (error) {
        console.error("disableGoogleAuth error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

