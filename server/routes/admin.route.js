import express from "express";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { getAllSubmittedTasks, getAllUsers, getDashboardStats } from "../controller/admin.controller.js";
import { verifyTask, rejectTask } from "../controller/task.controller.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

/**
 * ============================
 * ADMIN ROUTES
 * ============================
 */

// Get dashboard stats
// GET /api/admin/stats
router.get("/stats", getDashboardStats);

// Get all users
// GET /api/admin/users
router.get("/users", getAllUsers);

// Get all tasks (filter by status/type)
// GET /api/admin/tasks?status=SUBMITTED&task_type=TWITTER
router.get("/tasks", getAllSubmittedTasks);

// Verify a task
// POST /api/admin/tasks/:taskId/verify
router.post("/tasks/:taskId/verify", verifyTask);

// Reject a task
// POST /api/admin/tasks/:taskId/reject
router.post("/tasks/:taskId/reject", rejectTask);

export default router;
