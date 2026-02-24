import mongoose from "mongoose";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import BlipPointLog from "../models/BlipPointLog.model.js";
import { verifyTelegramMembership } from "../utils/telegram.js";
import { merchantBlipPoints } from "../utils/blipPoints.js";

// 🔧 CONFIG (can move to env / DB later)
const TASK_REWARD_POINTS = 50;

// Get reward points based on user role and task type
const getTaskRewardPoints = (userRole, taskType) => {
  if (userRole === "MERCHANT") {
    const merchantTaskMap = {
      TWITTER: merchantBlipPoints.twitter,
      TELEGRAM: merchantBlipPoints.telegram,
      DISCORD: merchantBlipPoints.discord,
    };
    return merchantTaskMap[taskType] || merchantBlipPoints.twitter;
  }
  return TASK_REWARD_POINTS;
};
const QUIZ_MIN_SCORE = 4; // Minimum correct answers to pass (out of 5)

// Quiz answers (index of correct option for each question)
const QUIZ_CORRECT_ANSWERS = [1, 1, 2, 1, 1]; // Solana, Non-Custodial, DAO, Bond, Second-Price

/**
 * ============================
 * CREATE TASK (USER)
 * ============================
 * - One task per user per task_type
 */
export const createTask = async (req, res) => {
  try {
    const { task_type, proof_data } = req.body;

    if (!task_type) {
      return res.status(400).json({ message: "task_type is required" });
    }

    const user_id = req.user._id;

    const task = await Task.create({
      user_id,
      task_type,
      proof_data,
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Task created",
      task,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Task already exists for this user",
      });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET MY TASKS (USER)
 * ============================
 */
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user_id: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * GET TASK BY TYPE (USER)
 * ============================
 */
export const getMyTaskByType = async (req, res) => {
  try {
    const { task_type } = req.params;

    const task = await Task.findOne({
      user_id: req.user._id,
      task_type,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * SUBMIT TASK (USER)
 * PENDING → SUBMITTED
 * ============================
 */
export const submitTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { proof_data } = req.body;

    const task = await Task.findOne({
      _id: taskId,
      user_id: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status !== "PENDING") {
      return res.status(400).json({
        message: "Task already submitted or verified",
      });
    }

    task.status = "SUBMITTED";
    if (proof_data) task.proof_data = proof_data;

    await task.save();

    return res.json({
      success: true,
      message: "Task submitted for verification",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * VERIFY TASK (ADMIN)
 * SUBMITTED → VERIFIED
 * ============================
 */
export const verifyTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).session(session);

    if (!task || task.status !== "SUBMITTED") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Invalid task state",
      });
    }

    // Map task_type to BlipPointLog event
    const eventMap = {
      TWITTER: "TWITTER_FOLLOW",
      TELEGRAM: "TELEGRAM_JOIN",
      WHITEPAPER: "WHITEPAPER_READ",
      CROSS_BORDER_SWAP: "CROSS_BORDER_SWAP",
    };

    // Get user to check role
    const taskUser = await User.findById(task.user_id).session(session);
    const rewardPoints = getTaskRewardPoints(taskUser?.role, task.task_type);

    // ✅ Mark verified
    task.status = "VERIFIED";
    task.completedAt = new Date();
    await task.save({ session });

    // 🎁 Credit BlipPoints to User
    await User.findByIdAndUpdate(
      task.user_id,
      { $inc: { totalBlipPoints: rewardPoints } },
      { session }
    );

    // 📝 Log points
    await BlipPointLog.create(
      [
        {
          userId: task.user_id,
          bonusPoints: rewardPoints,
          totalPoints: rewardPoints,
          event: eventMap[task.task_type] || "TWITTER_FOLLOW",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: "Task verified & reward credited",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * REJECT TASK (ADMIN)
 * SUBMITTED → REJECTED
 * ============================
 */
export const rejectTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task || task.status !== "SUBMITTED") {
      return res.status(400).json({
        message: "Invalid task state",
      });
    }

    task.status = "REJECTED";
    await task.save();

    return res.json({
      success: true,
      message: "Task rejected",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * SUBMIT QUIZ (USER)
 * For WHITEPAPER task - verify quiz answers
 * PENDING → VERIFIED (if passed)
 * ============================
 */
export const submitQuiz = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { taskId } = req.params;
    const { score, answers } = req.body;

    // Validate input
    if (!answers || !Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({
        message: "Invalid quiz submission",
      });
    }

    // Find the task
    const task = await Task.findOne({
      _id: taskId,
      user_id: req.user._id,
    }).session(session);

    if (!task) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.task_type !== "WHITEPAPER") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Quiz only available for whitepaper task" });
    }

    if (task.status !== "PENDING") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Task already completed or submitted" });
    }

    // Verify answers server-side
    let correctCount = 0;
    for (let i = 0; i < QUIZ_CORRECT_ANSWERS.length; i++) {
      if (answers[i] === QUIZ_CORRECT_ANSWERS[i]) {
        correctCount++;
      }
    }

    // Check if passed
    if (correctCount < QUIZ_MIN_SCORE) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `You need at least ${QUIZ_MIN_SCORE}/5 correct answers. You got ${correctCount}/5.`,
        score: correctCount,
      });
    }

    // Get user to check role for reward calculation
    const quizUser = await User.findById(task.user_id).session(session);
    const quizReward = getTaskRewardPoints(quizUser?.role, task.task_type);

    // Quiz passed - mark task as VERIFIED and award points
    task.status = "VERIFIED";
    task.completedAt = new Date();
    task.proof_data = { quiz_score: correctCount, quiz_answers: answers };
    await task.save({ session });

    // Credit BlipPoints to User
    await User.findByIdAndUpdate(
      task.user_id,
      { $inc: { totalBlipPoints: quizReward } },
      { session }
    );

    // Log points
    await BlipPointLog.create(
      [
        {
          userId: task.user_id,
          bonusPoints: quizReward,
          totalPoints: quizReward,
          event: "WHITEPAPER_READ",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: "Quiz passed! Points credited.",
      score: correctCount,
      pointsAwarded: quizReward,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ============================
 * VERIFY TELEGRAM (USER)
 * Auto-verify Telegram channel membership
 * PENDING → VERIFIED (if member)
 * ============================
 */
export const verifyTelegram = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { taskId } = req.params;
    const { telegram_user_id } = req.body;

    if (!telegram_user_id) {
      return res.status(400).json({
        message: "Telegram user ID is required",
      });
    }

    // Find the task
    const task = await Task.findOne({
      _id: taskId,
      user_id: req.user._id,
    }).session(session);

    if (!task) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.task_type !== "TELEGRAM") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "This endpoint is only for Telegram tasks" });
    }

    if (task.status === "VERIFIED") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Task already verified" });
    }

    // Verify membership via Telegram Bot API
    const verification = await verifyTelegramMembership(telegram_user_id);

    if (!verification.isMember) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "You have not joined the Telegram channel yet. Please join and try again.",
        status: verification.status,
      });
    }

    // Get user to check role for reward calculation
    const tgUser = await User.findById(task.user_id).session(session);
    const tgReward = getTaskRewardPoints(tgUser?.role, task.task_type);

    // User is a member - mark task as VERIFIED and award points
    task.status = "VERIFIED";
    task.completedAt = new Date();
    task.proof_data = {
      telegram_user_id,
      membership_status: verification.status,
      verified_at: new Date().toISOString()
    };
    await task.save({ session });

    // Credit BlipPoints to User
    await User.findByIdAndUpdate(
      task.user_id,
      { $inc: { totalBlipPoints: tgReward } },
      { session }
    );

    // Log points
    await BlipPointLog.create(
      [
        {
          userId: task.user_id,
          bonusPoints: tgReward,
          totalPoints: tgReward,
          event: "TELEGRAM_JOIN",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: "Telegram membership verified! Points credited.",
      pointsAwarded: tgReward,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error" });
  }
};
