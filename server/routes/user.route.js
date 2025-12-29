// routes/auth.routes.js
import express from "express";
import { registerAndLoginUser, logout, getMe } from "../controller/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", registerAndLoginUser);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
