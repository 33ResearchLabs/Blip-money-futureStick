import mongoose from "mongoose";

const volumeCommitmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    corridor: {
      type: String,
      required: true,
      trim: true,
    },
    volumeRange: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "expired"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("VolumeCommitment", volumeCommitmentSchema);
