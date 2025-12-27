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
    referralCode: {
      type: String,
      unique: true,
      sparse: true, // ✅ VERY IMPORTANT
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
userSchema.pre("validate", function () {
  if (!this.email && !this.phone) {
    this.invalidate("email", "Either email or phone number is required");
  }
});

export default mongoose.model("User", userSchema);
