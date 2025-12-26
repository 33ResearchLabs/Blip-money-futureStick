import express from "express";
import { applyBonus } from "../controller/bonus.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/apply", protect, applyBonus);

export default router;
