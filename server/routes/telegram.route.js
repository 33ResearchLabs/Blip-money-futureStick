import express from "express";
import {
  verifyMembership,
  getTelegramStatus,
  testBotConfig,
} from "../controller/telegram.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/telegram/verify - Verify channel membership and award points
router.post("/verify", protect, verifyMembership);

// GET /api/telegram/status - Check if user's Telegram is verified
router.get("/status", protect, getTelegramStatus);

// GET /api/telegram/test-bot - Test bot configuration (for debugging)
router.get("/test-bot", testBotConfig);

export default router;
