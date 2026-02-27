import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { verifyRedeemOTP, verifyLinkToken, getTokenInfo, getRedeemStatus } from "../controller/redeem.controller.js";

const router = Router();

router.get("/token-info", getTokenInfo); // Public — no auth needed
router.post("/verify", protect, verifyRedeemOTP);
router.post("/verify-token", protect, verifyLinkToken);
router.get("/status", protect, getRedeemStatus);

export default router;
