// routes/auth.routes.js
import express from "express";
import { registerAndLoginUser, logout, getMe, getMyReferrals, getMyPointsHistory } from "../controller/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", registerAndLoginUser);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.get("/referrals", protect, getMyReferrals);
router.get("/points-history", protect, getMyPointsHistory);

export default router;
