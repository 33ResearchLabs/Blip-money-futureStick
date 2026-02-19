import express from "express";
import {
  registerWithEmail,
  verifyEmail,
  verifyEmailOTP,
  confirmEmailVerified,
  loginWithEmail,
  resendVerificationEmail,
  linkWallet,
  unlinkWallet,
  forgotPassword,
  resetPassword,
  syncPassword,
  logout,
  changePassword,
  commitVolume,
  getCommitVolume,
} from "../controller/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerWithEmail);
router.get("/verify-email/:token", verifyEmail); // Old method (URL token)
router.post("/verify-otp", verifyEmailOTP); // New method (OTP)
router.post("/confirm-email-verified", confirmEmailVerified); // Firebase verification
router.post("/login", loginWithEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/sync-password", syncPassword);
router.post("/logout", logout);

// Protected routes (require authentication)
router.post("/link-wallet", protect, linkWallet);
router.post("/unlink-wallet", protect, unlinkWallet);
router.post("/change-password", protect, changePassword);
router.post("/commit-volume", protect, commitVolume);
router.get("/commit-volume", protect, getCommitVolume);

export default router;
