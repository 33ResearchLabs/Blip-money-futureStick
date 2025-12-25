import express from "express";
import {
  createReferral,
  getReferralsByReferrer,
  getReferralByReferredUser,
  updateReferralRewardStatus,
} from "../controller/referral.controller";

const router = express.Router();

/**
 * POST /api/referrals
 */
router.post("/", createReferral);

/**
 * GET /api/referrals/referrer/:referrer_id
 */
router.get("/referrer/:referrer_id", getReferralsByReferrer);

/**
 * GET /api/referrals/referred/:referred_user_id
 */
router.get("/referred/:referred_user_id", getReferralByReferredUser);

/**
 * PATCH /api/referrals/:referralId
 */
router.patch("/:referralId", updateReferralRewardStatus);

export default router;
