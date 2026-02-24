// routes/auth.routes.js
import express from "express";
import { registerAndLoginUser, logout, getMe, getMyReferrals, getMyPointsHistory, fixPointsData, updateUserName, checkUserName } from "../controller/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", registerAndLoginUser);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.get("/referrals", protect, getMyReferrals);
router.get("/points-history", protect, getMyPointsHistory);

router.get("/check-username/:userName", protect, checkUserName);
router.put("/username", protect, updateUserName);

// Migration endpoint to fix old point data (run once)
router.post("/fix-points", protect, fixPointsData);

export default router;
