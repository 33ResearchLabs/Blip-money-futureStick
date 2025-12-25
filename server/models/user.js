// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
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
      index: true,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Custom validation: email OR phone must exist
userSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    next(new Error("Either email or phone number is required"));
  }
});

export default mongoose.model("User", userSchema);
