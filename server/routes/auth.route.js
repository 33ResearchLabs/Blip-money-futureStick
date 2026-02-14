import express from "express";
import {
  registerWithEmail,
  verifyEmail,
  verifyEmailOTP,
  loginWithEmail,
  resendVerificationEmail,
  linkWallet,
  unlinkWallet,
  forgotPassword,
  resetPassword,
  logout,
} from "../controller/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerWithEmail);
router.get("/verify-email/:token", verifyEmail); // Old method (URL token)
router.post("/verify-otp", verifyEmailOTP); // New method (OTP)
router.post("/login", loginWithEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);

// Protected routes (require authentication)
router.post("/link-wallet", protect, linkWallet);
router.post("/unlink-wallet", protect, unlinkWallet);

export default router;
