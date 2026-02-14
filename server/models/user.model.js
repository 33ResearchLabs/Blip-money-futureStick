import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // Don't return password in queries by default
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      sparse: true,
    },

    wallet_address: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allow null but enforce uniqueness when set
      index: true,
    },

    walletLinked: {
      type: Boolean,
      default: false,
    },

    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    status: {
      type: String,
      enum: ["WAITLISTED", "ACTIVE", "waitlisted", "active"],
      default: "WAITLISTED",
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    totalBlipPoints: {
      type: Number,
      default: 500, // 🔥 cache for fast reads
    },

    lastLoginAt: Date,

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    // 🔴🔴 NEW (Google Authenticator Secret)
    twoFactorSecret: {
      type: String, // base32
    },

    // Telegram verification
    telegramUserId: {
      type: String,
      sparse: true,
      index: true,
    },
    telegramVerified: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);