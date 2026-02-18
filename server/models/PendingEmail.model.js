import mongoose from "mongoose";

const pendingEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    referralCode: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["USER", "MERCHANT"],
      default: "USER",
    },

    otp: {
      type: String,
      required: true, // store hashed OTP
    },

    otpExpires: {
      type: Date,
      required: true,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // auto delete after 10 minutes (TTL index)
    },
  },
  { timestamps: true },
);

export default mongoose.model("PendingEmail", pendingEmailSchema);
