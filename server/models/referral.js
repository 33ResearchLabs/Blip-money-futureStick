import mongoose from "mongoose";

const referralActionSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "REGISTER",
        "FOLLOW_TWITTER",
        "JOIN_TELEGRAM",
        "JOIN_DISCORD",
      ],
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
    },
  },
  { _id: false }
);

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
      index: true,
    },

    referral_code: {
      type: String,
      index: true,
    },

    actions: {
      type: [referralActionSchema],
      default: [
        { action: "REGISTER", completed: true, completedAt: new Date() },
        { action: "FOLLOW_TWITTER", completed: false },
        { action: "JOIN_TELEGRAM", completed: false },
      ],
    },

    reward_status: {
      type: String,
      enum: ["pending", "credited", "failed"],
      default: "pending",
      index: true,
    },

    reward_amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Referral", referralSchema);
