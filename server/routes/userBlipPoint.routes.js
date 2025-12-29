import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getMyBlipPoints } from "../controller/userBlipPointController.js";

const router = express.Router();

router.get("/my-points", protect, getMyBlipPoints);

export default router;
