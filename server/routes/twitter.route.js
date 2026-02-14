import express from "express";
import {
  verifyTweet,
  getUserVerifications,
  getCampaignStatus,
} from "../controller/twitter.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiter for tweet verification to prevent abuse
const verifyTweetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 verification attempts per 15 minutes
  message: {
    error: "Too many verification attempts. Please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/twitter/verify - Verify tweet and award points
router.post("/verify", protect, verifyTweetLimiter, verifyTweet);

// GET /api/twitter/verifications - Get user's verification history
router.get("/verifications", protect, getUserVerifications);

// GET /api/twitter/campaign-status/:campaignId - Check campaign completion status
router.get("/campaign-status/:campaignId", protect, getCampaignStatus);

export default router;
