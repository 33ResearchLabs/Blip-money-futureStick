// routes/auth.routes.js
import express from "express";
import { registerAndLoginUser } from "../controller/user.controller.js";


const router = express.Router();

router.post("/login", registerAndLoginUser);


export default router;
