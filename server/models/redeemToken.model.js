import mongoose from "mongoose";

const redeemTokenSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
      index: true,
    },
    linkToken: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    telegram_id: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "merchant"],
      default: "user",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL — auto-delete after expiry
    },
    used: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("RedeemToken", redeemTokenSchema);
