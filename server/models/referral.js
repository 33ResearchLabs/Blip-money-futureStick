// models/Referral.js
import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    referrer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    referred_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    referral_timestamp: {
      type: Date,
      default: Date.now,
    },

    reward_status: {
      type: String,
      enum: ["pending", "credited", "failed"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Referral", referralSchema);
