// routes/auth.routes.js
import express from "express";
import { loginOrRegister, logout, getMe } from "../controller/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", loginOrRegister);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
