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
    referralCode: {
      type: String,
      unique: true,
      index: true,
    },
    referredByUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

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


// ✅ Custom validation: email OR phone must exist
userSchema.pre("validate", function () {
  if (!this.email && !this.phone) {
    this.invalidate("email", "Either email or phone number is required");
  }
});

export default mongoose.model("User", userSchema);
