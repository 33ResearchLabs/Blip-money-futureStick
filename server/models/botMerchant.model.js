import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema(
  {
    telegram_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: { type: String, default: null },
    first_name: { type: String, default: null },
    role: { type: String, required: true },
    use_case: { type: String, required: true },
    volume: { type: String, required: true },
    corridor: { type: String, required: true },
    integration_speed: { type: String, required: true },
    liquidity_role: { type: String, required: true },
    contact_method: { type: String, required: true },
    wallet: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    tier: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum"],
      required: true,
    },
    priority: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Merchant", merchantSchema, "bot_merchant");
