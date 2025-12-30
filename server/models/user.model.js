import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },

    phone: {
      type: String,
      trim: true,
      sparse: true,
    },

    wallet_address: {
      type: String,
      required: true,
      unique: true,
      index: true,
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
      enum: ["WAITLISTED", "ACTIVE"],
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
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);