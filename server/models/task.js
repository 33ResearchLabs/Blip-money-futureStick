// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    task_type: {
      type: String,
      enum: ["follow", "post", "quiz", "verification"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      index: true,
    },

    proof_data: {
      post_url: String,
      screenshot_url: String,
      text_proof: String,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent duplicate task per user
taskSchema.index({ user_id: 1, task_type: 1 }, { unique: true });

export default mongoose.model("Task", taskSchema);
