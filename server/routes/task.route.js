import express from "express";
import {
  createTask,
  getTasksByUser,
  updateTaskStatus,
  getTaskByType,
} from "../controller/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

/**
 * POST /api/tasks
 */
router.post("/",protect, createTask);

/**
 * GET /api/tasks/user/:user_id
 */
router.get("/user/:user_id", getTasksByUser);

/**
 * GET /api/tasks/:user_id/:task_type
 */
router.get("/:user_id/:task_type", getTaskByType);

/**
 * PATCH /api/tasks/:taskId
 */
router.patch("/:taskId", updateTaskStatus);

export default router;
