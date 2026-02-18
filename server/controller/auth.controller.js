import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.model.js";
import Wallet from "../models/wallet.model.js";
import UserBlipPoints from "../models/userBlipPoints.model.js";
import BlipPointLog from "../models/BlipPointLog.model.js";
import { signToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendCustomPasswordResetEmail,
  sendWelcomeEmail,
} from "../services/email.service.js";
import { getFirebaseAdminAuth } from "../config/firebase-admin.js";
import PendingEmailModel from "../models/PendingEmail.model.js";
import { sendVerificationEmailNew } from "../utils/VerificationEmail.js";
import Referral from "../models/referral.model.js";
import { REGISTER_BONUS_POINTS, REFERRAL_BONUS_POINTS, merchantBlipPoints } from "../utils/blipPoints.js";

const production = process.env.NODE_ENV === "production";

/**
 * Register a new user with email and password
 * POST /api/auth/register
 */

export const registerWithEmail = async (req, res) => {
  try {
    const { email, password, referral_code, captchaToken, role } = req.body;
    const isMerchant = role === "merchant";
    const registerPoints = isMerchant ? merchantBlipPoints.register : REGISTER_BONUS_POINTS;
    const referralPoints = isMerchant ? merchantBlipPoints.referral : REFERRAL_BONUS_POINTS;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // Verify reCAPTCHA (only in production when secret key is set)
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!captchaToken) {
        return res.status(400).json({
          success: false,
          message: "Captcha verification required",
        });
      }

      try {
        const captchaResponse = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
          { method: "POST" }
        );
        const captchaData = await captchaResponse.json();
        if (!captchaData.success) {
          return res.status(400).json({
            success: false,
            message: "Captcha verification failed",
          });
        }
      } catch (captchaError) {
        console.error("Captcha verification error:", captchaError);
        return res.status(500).json({
          success: false,
          message: "Captcha verification failed",
        });
      }
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate referral code
    const generateReferralCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "BLIP";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let referralCode = generateReferralCode();
    let codeExists = await User.findOne({ referralCode });
    while (codeExists) {
      referralCode = generateReferralCode();
      codeExists = await User.findOne({ referralCode });
    }

    // Create user with email verification pending (Firebase handles verification)
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      emailVerified: false,
      referralCode,
      totalBlipPoints: registerPoints,
      status: "WAITLISTED",
      role: isMerchant ? "MERCHANT" : "USER",
    });

    // Create UserBlipPoints entry
    await UserBlipPoints.create({
      userId: newUser._id,
      points: registerPoints,
      isActive: true,
    });

    // Log registration bonus points
    await BlipPointLog.create({
      userId: newUser._id,
      bonusPoints: registerPoints,
      event: isMerchant ? "MERCHANT_REGISTER" : "REGISTER",
    });

    // Handle referral if provided
    if (referral_code) {
      const referrer = await User.findOne({ referralCode: referral_code });
      if (referrer && referrer._id.toString() !== newUser._id.toString()) {
        referrer.totalBlipPoints = (referrer.totalBlipPoints || 0) + referralPoints;
        await referrer.save();

        await UserBlipPoints.findOneAndUpdate(
          { userId: referrer._id },
          { $inc: { points: referralPoints } },
          { upsert: true }
        );

        await BlipPointLog.create({
          userId: referrer._id,
          bonusPoints: referralPoints,
          event: "REFERRAL_BONUS_EARNED",
        });

        // Create Referral document for tracking
        await Referral.create({
          referrer_id: referrer._id,
          referred_user_id: newUser._id,
          referral_code: referral_code,
          reward_status: "credited",
          reward_amount: referralPoints,
        });

        newUser.totalBlipPoints = (newUser.totalBlipPoints || 0) + referralPoints;
        newUser.referredBy = referrer._id;
        await newUser.save();

        await UserBlipPoints.findOneAndUpdate(
          { userId: newUser._id },
          { $inc: { points: referralPoints } },
          { upsert: true }
        );

        await BlipPointLog.create({
          userId: newUser._id,
          bonusPoints: referralPoints,
          event: "REFERRAL_BONUS_RECEIVED",
        });
      }
    }

    // Don't set JWT cookie - user must verify email first via Firebase
    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      emailVerified: false,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      Error: error.message,
    });
  }
};

/**
 * Confirm email verified via Firebase
 * POST /api/auth/confirm-email-verified
 */
export const confirmEmailVerified = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email already verified",
      });
    }

    // Mark email as verified
    user.emailVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("Confirm email verified error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

// export const registerWithEmail = async (req, res) => {
//   try {
//     const { email, password, referral_code } = req.body;

//     // Validation
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     // Validate password strength
//     if (password.length < 8) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 8 characters long",
//       });
//     }

//     // Check for uppercase and number
//     if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must contain at least one uppercase letter and one number",
//       });
//     }

//     // Check if email already exists
//     const existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already registered. Please login instead.",
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate 6-digit OTP for email verification
//     const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
//     const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // Generate unique referral code
//     const generateReferralCode = () => {
//       const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//       let code = "BLIP";
//       for (let i = 0; i < 6; i++) {
//         code += chars.charAt(Math.floor(Math.random() * chars.length));
//       }
//       return code;
//     };

//     let referralCode = generateReferralCode();
//     let codeExists = await User.findOne({ referralCode });
//     while (codeExists) {
//       referralCode = generateReferralCode();
//       codeExists = await User.findOne({ referralCode });
//     }

//     // Create user
//     const newUser = await User.create({
//       email: email.toLowerCase(),
//       password: hashedPassword,
//       emailVerified: false,
//       emailVerificationToken: verificationOTP, // Store OTP in verification token field
//       emailVerificationExpires: verificationExpires,
//       walletLinked: false,
//       referralCode,
//       totalBlipPoints: 500, // Initial points
//       status: "WAITLISTED",
//       role: "USER",
//     });

//     // Create UserBlipPoints entry
//     await UserBlipPoints.create({
//       userId: newUser._id,
//       points: 500,
//       isActive: true,
//     });

//     // Log initial points
//     await BlipPointLog.create({
//       userId: newUser._id,
//       bonusPoints: 500,
//       totalPoints: 500,
//       event: "REGISTER",
//     });

//     // Handle referral if provided
//     if (referral_code) {
//       const referrer = await User.findOne({ referralCode: referral_code });
//       if (referrer) {
//         newUser.referredBy = referrer._id;
//         await newUser.save();

//         // Award referral bonus (100 points to both)
//         referrer.totalBlipPoints += 100;
//         await referrer.save();

//         await BlipPointLog.create({
//           userId: referrer._id,
//           bonusPoints: 100,
//           totalPoints: referrer.totalBlipPoints,
//           event: "REFERRAL_BONUS_EARNED",
//         });

//         newUser.totalBlipPoints += 100;
//         await newUser.save();

//         await BlipPointLog.create({
//           userId: newUser._id,
//           bonusPoints: 100,
//           totalPoints: newUser.totalBlipPoints,
//           event: "REFERRAL_BONUS_RECEIVED",
//         });
//       }
//     }

//     // Send OTP verification email
//     try {
//       await sendVerificationEmail(email, verificationOTP); // Send OTP instead of token
//     } catch (emailError) {
//       console.error("Email sending failed:", emailError);
//       // Continue even if email fails - user can request resend
//     }

//     res.status(201).json({
//       success: true,
//       message: "Registration successful! Please check your email to verify your account.",
//       user: {
//         id: newUser._id,
//         email: newUser.email,
//         emailVerified: false,
//       },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Registration failed. Please try again.",
//       error: error.message,
//     });
//   }
// };

/**
 * Verify email with OTP
 * POST /api/auth/verify-otp
 */
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pending = await PendingEmailModel.findOne({
      email: email.toLowerCase(),
    });

    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found",
      });
    }

    if (pending.otpAttempts >= 3) {
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts",
      });
    }

    if (pending.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(otp, pending.otp);

    if (!isMatch) {
      pending.otpAttempts += 1;
      await pending.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Generate referral code
    const generateReferralCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "BLIP";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let referralCode = generateReferralCode();
    let codeExists = await User.findOne({ referralCode });

    while (codeExists) {
      referralCode = generateReferralCode();
      codeExists = await User.findOne({ referralCode });
    }

    // Determine points based on role
    const pendingIsMerchant = pending.role === "MERCHANT";
    const otpRegisterPoints = pendingIsMerchant ? merchantBlipPoints.register : REGISTER_BONUS_POINTS;
    const otpReferralPoints = pendingIsMerchant ? merchantBlipPoints.referral : REFERRAL_BONUS_POINTS;

    // Create real user
    const newUser = await User.create({
      email: pending.email,
      password: pending.password,
      emailVerified: true,
      referralCode,
      totalBlipPoints: otpRegisterPoints,
      status: "WAITLISTED",
      role: pendingIsMerchant ? "MERCHANT" : "USER",
    });

    // Create UserBlipPoints entry
    await UserBlipPoints.create({
      userId: newUser._id,
      points: otpRegisterPoints,
      isActive: true,
    });

    // Log registration bonus points
    await BlipPointLog.create({
      userId: newUser._id,
      bonusPoints: otpRegisterPoints,
      event: pendingIsMerchant ? "MERCHANT_REGISTER" : "REGISTER",
    });

    // Handle referral if provided
    if (pending.referral_code) {
      const referrer = await User.findOne({ referralCode: pending.referral_code });
      if (referrer && referrer._id.toString() !== newUser._id.toString()) {
        // Referrer bonus
        referrer.totalBlipPoints = (referrer.totalBlipPoints || 0) + otpReferralPoints;
        await referrer.save();

        await UserBlipPoints.findOneAndUpdate(
          { userId: referrer._id },
          { $inc: { points: otpReferralPoints } },
          { upsert: true }
        );

        await BlipPointLog.create({
          userId: referrer._id,
          bonusPoints: otpReferralPoints,
          event: "REFERRAL_BONUS_EARNED",
        });

        // New user referral bonus
        newUser.totalBlipPoints = (newUser.totalBlipPoints || 0) + otpReferralPoints;
        newUser.referredBy = referrer._id;
        await newUser.save();

        await UserBlipPoints.findOneAndUpdate(
          { userId: newUser._id },
          { $inc: { points: otpReferralPoints } },
          { upsert: true }
        );

        await BlipPointLog.create({
          userId: newUser._id,
          bonusPoints: otpReferralPoints,
          event: "REFERRAL_BONUS_RECEIVED",
        });
      }
    }

    // Delete pending
    await PendingEmailModel.deleteOne({ email: pending.email });

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set httpOnly cookie (same as login)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: production ? "none" : "lax",
      secure: production ? true : false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        wallet_address: newUser.wallet_address,
        phone: newUser.phone,
        referralCode: newUser.referralCode,
        totalBlipPoints: newUser.totalBlipPoints,
        status: newUser.status,
        role: newUser.role,
        twoFactorEnabled: newUser.twoFactorEnabled || false,
        emailVerified: newUser.emailVerified,
        walletLinked: newUser.walletLinked || false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

/* =========================================
   3️⃣ RESEND OTP
========================================= */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const pending = await PendingEmailModel.findOne({
      email: email.toLowerCase(),
    });

    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found",
      });
    }

    const rawOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(rawOTP, 10);

    pending.otp = hashedOTP;
    pending.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    pending.otpAttempts = 0;

    await pending.save();

    await sendVerificationEmailNew(email, rawOTP);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Resend failed",
      error: error.message,
    });
  }
};

/**
 * Verify email address (old method with URL token)
 * GET /api/auth/verify-email/:token
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    // Update user
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Email verification failed",
      error: error.message,
    });
  }
};

/**
 * Login with email and password
 * POST /api/auth/login
 */
export const loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        emailVerified: false,
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      return res.status(200).json({
        success: true,
        twoFactorRequired: true,
        userId: user._id,
        message: "Please enter your 2FA code",
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT
    const token = signToken(user._id);

    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: production ? "none" : "lax",
      secure: production ? true : false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data (without password)
    const userData = {
      id: user._id,
      email: user.email,
      wallet_address: user.wallet_address,
      phone: user.phone,
      referralCode: user.referralCode,
      totalBlipPoints: user.totalBlipPoints,
      status: user.status,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
      emailVerified: user.emailVerified,
      walletLinked: user.walletLinked,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
      error: error.message,
    });
  }
};

/**
 * Resend verification email
 * POST /api/auth/resend-verification
 */
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check PendingEmailModel first (new OTP flow)
    const pending = await PendingEmailModel.findOne({ email: email.toLowerCase() });

    if (pending) {
      // Generate new OTP
      const rawOTP = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOTP = await bcrypt.hash(rawOTP, 10);

      pending.otp = hashedOTP;
      pending.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      pending.otpAttempts = 0;
      await pending.save();

      try {
        await sendVerificationEmailNew(email, rawOTP);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        return res.status(500).json({
          success: false,
          message: "Failed to send verification email",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Verification code resent successfully",
      });
    }

    // Fallback: check User model (old flow)
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, a verification link has been sent.",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new token for old flow
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email",
      });
    }

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email",
      error: error.message,
    });
  }
};

/**
 * Link wallet to user account
 * POST /api/auth/link-wallet
 * Protected route - requires authentication
 */
export const linkWallet = async (req, res) => {
  try {
    const { wallet_address } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!wallet_address) {
      return res.status(400).json({
        success: false,
        message: "Wallet address is required",
      });
    }

    // Validate wallet address format (Solana addresses are base58, 32-44 characters)
    if (wallet_address.length < 32 || wallet_address.length > 44) {
      return res.status(400).json({
        success: false,
        message: "Invalid wallet address format",
      });
    }

    // Check if wallet already linked to a DIFFERENT user
    const existingUser = await User.findOne({ wallet_address, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This wallet is already linked to another account",
      });
    }

    // Also check Wallet collection (safety net for unlinked-but-not-cleaned entries)
    const existingWalletEntry = await Wallet.findOne({ wallet_address, userId: { $ne: userId } });
    if (existingWalletEntry) {
      return res.status(409).json({
        success: false,
        message: "This wallet is already linked to another account",
      });
    }

    // Update user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.wallet_address = wallet_address;
    user.walletLinked = true;
    await user.save();

    // Create Wallet entry
    await Wallet.create({
      wallet_address,
      userId: user._id,
      wallet_connection_timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Wallet linked successfully",
      user: {
        id: user._id,
        email: user.email,
        wallet_address: user.wallet_address,
        phone: user.phone,
        referralCode: user.referralCode,
        totalBlipPoints: user.totalBlipPoints,
        status: user.status,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled || false,
        emailVerified: user.emailVerified || false,
        walletLinked: true,
      },
    });
  } catch (error) {
    console.error("Wallet linking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to link wallet",
      error: error.message,
    });
  }
};

/**
 * Unlink wallet from user account
 * POST /api/auth/unlink-wallet
 * Protected route - requires authentication
 */
export const unlinkWallet = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const walletAddress = user.wallet_address;

    // Update user
    user.wallet_address = null;
    user.walletLinked = false;
    await user.save();

    // Delete Wallet entry
    if (walletAddress) {
      await Wallet.deleteOne({ wallet_address: walletAddress });
    }

    res.status(200).json({
      success: true,
      message: "Wallet unlinked successfully",
      user: {
        id: user._id,
        email: user.email,
        wallet_address: null,
        phone: user.phone,
        referralCode: user.referralCode,
        totalBlipPoints: user.totalBlipPoints,
        status: user.status,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled || false,
        emailVerified: user.emailVerified || false,
        walletLinked: false,
      },
    });
  } catch (error) {
    console.error("Wallet unlinking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unlink wallet",
      error: error.message,
    });
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Don't reveal if email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, a password reset link has been sent.",
      });
    }

    try {
      // Generate Firebase password reset link
      const firebaseResetLink = await getFirebaseAdminAuth().generatePasswordResetLink(
        email.toLowerCase(),
        {
          url: `${process.env.FRONTEND_URL}/waitlist`,
        }
      );

      // Extract oobCode from Firebase link and build our own clean URL
      const url = new URL(firebaseResetLink);
      const oobCode = url.searchParams.get("oobCode");
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?oobCode=${oobCode}`;

      // Send via Resend with our custom branded template
      await sendCustomPasswordResetEmail(email, resetUrl);
    } catch (emailError) {
      console.error("Password reset email failed:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send password reset email",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
      error: error.message,
    });
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter and one number",
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};

/**
 * Sync password from Firebase reset to MongoDB
 * POST /api/auth/sync-password
 */
export const syncPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password synced successfully",
      role: user.role,
    });
  } catch (error) {
    console.error("Password sync error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync password",
      error: error.message,
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: production ? "none" : "lax",
      secure: production ? true : false,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};
