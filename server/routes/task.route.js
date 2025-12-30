import express from "express";

import { createTask, getMyTaskByType, getMyTasks, rejectTask, submitTask, verifyTask, submitQuiz, verifyTelegram } from "../controller/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * ============================
 * USER ROUTES
 * ============================
 */

// Create a task
// POST /api/tasks
router.post("/", protect, createTask);

// Get logged-in user's tasks
// GET /api/tasks
router.get("/", protect, getMyTasks);

// Get logged-in user's task by type
// GET /api/tasks/type/:task_type
router.get("/type/:task_type", protect, getMyTaskByType);

// Submit task for verification
// POST /api/tasks/:taskId/submit
router.post("/:taskId/submit", protect, submitTask);

// Submit quiz answers for whitepaper task
// POST /api/tasks/:taskId/quiz
router.post("/:taskId/quiz", protect, submitQuiz);

// Verify Telegram channel membership
// POST /api/tasks/:taskId/verify-telegram
router.post("/:taskId/verify-telegram", protect, verifyTelegram);

/**
 * ============================
 * ADMIN ROUTES
 * ============================
 */

// Verify task
// POST /api/tasks/:taskId/verify
router.post("/:taskId/verify", protect, verifyTask);

// Reject task
// POST /api/tasks/:taskId/reject
router.post("/:taskId/reject", protect, rejectTask);

export default router;
