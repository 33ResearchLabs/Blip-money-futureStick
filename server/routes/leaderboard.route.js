import express from "express";
import { getMerchantLeaderboard, getMerchantActivity } from "../controller/leaderboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET /api/leaderboard/merchants - Get merchant leaderboard (protected)
router.get("/merchants", protect, getMerchantLeaderboard);

// GET /api/leaderboard/merchant-activity - Get merchant activity feed (protected)
router.get("/merchant-activity", protect, getMerchantActivity);

export default router;
