import speakeasy from "speakeasy";
import QRCode from "qrcode";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";

const MAX_2FA_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Generate 10 random recovery codes
 */
function generateRecoveryCodes() {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    // 8-char hex codes, grouped as XXXX-XXXX for readability
    const raw = crypto.randomBytes(4).toString("hex").toUpperCase();
    codes.push(`${raw.slice(0, 4)}-${raw.slice(4)}`);
  }
  return codes;
}

/**
 * Hash recovery codes with bcrypt for storage
 */
async function hashRecoveryCodes(codes) {
  return Promise.all(codes.map((code) => bcrypt.hash(code, 10)));
}

/**
 * Check if user is locked out from 2FA attempts
 */
function isLockedOut(user) {
  if (user.twoFactorLockUntil && user.twoFactorLockUntil > new Date()) {
    const remainingMs = user.twoFactorLockUntil - new Date();
    const remainingMin = Math.ceil(remainingMs / 60000);
    return { locked: true, remainingMin };
  }
  return { locked: false };
}

/**
 * Record a failed 2FA attempt and lock if threshold reached
 */
async function recordFailedAttempt(user) {
  user.twoFactorAttempts = (user.twoFactorAttempts || 0) + 1;

  if (user.twoFactorAttempts >= MAX_2FA_ATTEMPTS) {
    user.twoFactorLockUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
    user.twoFactorAttempts = 0;
  }

  await user.save();
}

/**
 * Reset failed attempts on successful verification
 */
async function resetAttempts(user) {
  if (user.twoFactorAttempts > 0 || user.twoFactorLockUntil) {
    user.twoFactorAttempts = 0;
    user.twoFactorLockUntil = undefined;
  }
}

/**
 * ================================
 * ENABLE GOOGLE AUTH (QR CODE)
 * ================================
 */
export const enableGoogleAuth = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: "2FA already enabled" });
    }

    const secret = speakeasy.generateSecret({
      name: `Blip Money (${user.email})`,
      issuer: "Blip Money",
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    await User.findByIdAndUpdate(userId, {
      twoFactorSecret: secret.base32,
    });

    return res.status(200).json({
      success: true,
      qrCode,
      manualEntryKey: secret.base32,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate QR" });
  }
};

/**
 * ================================
 * VERIFY & CONFIRM ENABLE
 * Returns recovery codes on success
 * ================================
 */
export const verifyEnableGoogleAuth = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id).select("+twoFactorSecret");

    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: "Please start 2FA setup first" });
    }

    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!valid) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // Generate recovery codes
    const recoveryCodes = generateRecoveryCodes();
    const hashedCodes = await hashRecoveryCodes(recoveryCodes);

    user.twoFactorEnabled = true;
    user.recoveryCodes = hashedCodes;
    await user.save();

    return res.json({
      success: true,
      message: "Two-factor authentication enabled successfully",
      recoveryCodes, // Return plain-text codes ONCE for user to save
    });
  } catch {
    return res.status(500).json({ message: "Verification failed" });
  }
};

/**
 * ================================
 * VERIFY LOGIN OTP (TOTP)
 * With brute-force protection
 * ================================
 */
export const verifyLoginTotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+twoFactorSecret +recoveryCodes"
    );

    if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    // Check lockout
    const lockStatus = isLockedOut(user);
    if (lockStatus.locked) {
      return res.status(429).json({
        success: false,
        message: `Too many failed attempts. Try again in ${lockStatus.remainingMin} minute(s).`,
        locked: true,
        retryAfterMinutes: lockStatus.remainingMin,
      });
    }

    // Verify TOTP
    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!valid) {
      await recordFailedAttempt(user);

      const attemptsLeft = MAX_2FA_ATTEMPTS - (user.twoFactorAttempts || 0);
      return res.status(401).json({
        success: false,
        message: attemptsLeft > 0
          ? `Invalid code. ${attemptsLeft} attempt(s) remaining.`
          : "Too many failed attempts. Account temporarily locked.",
      });
    }

    // Success - reset attempts
    resetAttempts(user);
    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = user.toObject();
    delete safeUser.twoFactorSecret;
    delete safeUser.recoveryCodes;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * ================================
 * VERIFY RECOVERY CODE LOGIN
 * ================================
 */
export const verifyRecoveryCode = async (req, res) => {
  try {
    const { email, recoveryCode } = req.body;

    if (!email || !recoveryCode) {
      return res.status(400).json({
        success: false,
        message: "Email and recovery code are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+recoveryCodes +twoFactorSecret"
    );

    if (!user || !user.twoFactorEnabled || !user.recoveryCodes?.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    // Check lockout
    const lockStatus = isLockedOut(user);
    if (lockStatus.locked) {
      return res.status(429).json({
        success: false,
        message: `Too many failed attempts. Try again in ${lockStatus.remainingMin} minute(s).`,
        locked: true,
      });
    }

    // Normalize: strip dashes, uppercase
    const normalizedCode = recoveryCode.replace(/-/g, "").toUpperCase();
    const normalizedInput = `${normalizedCode.slice(0, 4)}-${normalizedCode.slice(4)}`;

    // Check each hashed recovery code
    let matchedIndex = -1;
    for (let i = 0; i < user.recoveryCodes.length; i++) {
      const isMatch = await bcrypt.compare(normalizedInput, user.recoveryCodes[i]);
      if (isMatch) {
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex === -1) {
      await recordFailedAttempt(user);
      return res.status(401).json({
        success: false,
        message: "Invalid recovery code",
      });
    }

    // Remove used recovery code (one-time use)
    user.recoveryCodes.splice(matchedIndex, 1);

    // Reset attempts on success
    resetAttempts(user);
    user.lastLoginAt = new Date();
    await user.save();

    const remainingCodes = user.recoveryCodes.length;

    const token = signToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = user.toObject();
    delete safeUser.twoFactorSecret;
    delete safeUser.recoveryCodes;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser,
      remainingRecoveryCodes: remainingCodes,
      warning: remainingCodes <= 2
        ? `Warning: You only have ${remainingCodes} recovery code(s) left. Please regenerate your codes.`
        : undefined,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * ================================
 * REGENERATE RECOVERY CODES
 * (requires OTP confirmation)
 * ================================
 */
export const regenerateRecoveryCodes = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id).select("+twoFactorSecret");

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: "2FA is not enabled" });
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

    const recoveryCodes = generateRecoveryCodes();
    const hashedCodes = await hashRecoveryCodes(recoveryCodes);

    user.recoveryCodes = hashedCodes;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Recovery codes regenerated. Save these new codes securely.",
      recoveryCodes,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to regenerate recovery codes" });
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
    const user = await User.findById(req.user.id).select("+twoFactorSecret");

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
    user.recoveryCodes = undefined;
    user.twoFactorAttempts = 0;
    user.twoFactorLockUntil = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "2FA disabled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
