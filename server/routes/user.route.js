// routes/auth.routes.js
import express from "express";
import { loginOrRegister } from "../controller/user.controller";

const router = express.Router();

router.post("/login", loginOrRegister);

export default router;
