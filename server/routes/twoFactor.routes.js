import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  enableGoogleAuth,
  verifyEnableGoogleAuth,
  verifyLoginTotp,
  verifyRecoveryCode,
  regenerateRecoveryCodes,
  disableGoogleAuth,
} from "../controller/googleAuth.controller.js";

const router = express.Router();

router.post("/enable", protect, enableGoogleAuth);
router.post("/verify-enable", protect, verifyEnableGoogleAuth);
router.post("/verify-login", verifyLoginTotp);
router.post("/verify-recovery", verifyRecoveryCode);
router.post("/regenerate-recovery", protect, regenerateRecoveryCodes);
router.post("/disable", protect, disableGoogleAuth);

export default router;
