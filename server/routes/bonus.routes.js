import express from "express";
import { applyBonus, getBonusStatus } from "../controller/bonus.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/apply", protect, applyBonus);
router.get("/bonus-status", protect, getBonusStatus);

export default router;
