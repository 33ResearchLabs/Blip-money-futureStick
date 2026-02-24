import express from "express";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import {
  getAllSubmittedTasks,
  getAllUsers,
  getDashboardStats,
  getSuperadminStats,
  getAllUsersDetailed,
  getReferralStats,
  getVolumeCommitments,
  getVolumeChart,
  getRegistrationChart,
  getPointsDistributionChart,
} from "../controller/admin.controller.js";
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

/**
 * ============================
 * SUPERADMIN ROUTES
 * ============================
 */

// Superadmin aggregated stats
router.get("/superadmin-stats", getSuperadminStats);

// All users with social quest status (paginated)
router.get("/users-detailed", getAllUsersDetailed);

// Referral stats with top referrers
router.get("/referral-stats", getReferralStats);

// All merchant volume commitments
router.get("/volume-commitments", getVolumeCommitments);

// Volume commitment chart data (last 30 days)
router.get("/volume-chart", getVolumeChart);

// Registration chart data (last 30 days)
router.get("/registration-chart", getRegistrationChart);

// Points distribution chart
router.get("/points-chart", getPointsDistributionChart);

export default router;
