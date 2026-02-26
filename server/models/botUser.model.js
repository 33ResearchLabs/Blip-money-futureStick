import mongoose from "mongoose";

const botUserSchema = new mongoose.Schema(
  {
    telegram_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: { type: String, default: null },
    name: { type: String, default: null },
    country: { type: String, default: null },
    role: { type: String, default: null },
    points: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 },
    referred_by: { type: String, default: null },
    join_date: { type: Date, default: Date.now },
    last_daily: { type: Date, default: null },
    onboarded: { type: Boolean, default: false },
    twitter_username: { type: String, default: null },
    tasks_completed: {
      telegram_group: { type: Boolean, default: false },
      twitter_follow: { type: Boolean, default: false },
      retweet: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model("BotUser", botUserSchema, "bot_users");
