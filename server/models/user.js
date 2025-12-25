// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true, // Allows multiple null/undefined, unique only when value exists
    },

    phone: {
      type: String,
      trim: true,
    },

    wallet_address: {
      type: String,
      required: true,
      unique: true,
    },

    referral_code: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["waitlisted", "connected"],
      default: "waitlisted",
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);



export default mongoose.model("User", userSchema);
