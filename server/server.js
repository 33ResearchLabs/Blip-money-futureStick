import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";


import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.route.js";
import walletRoutes from "./routes/wallet.route.js";
import taskRoutes from "./routes/task.route.js";
import referralRoutes from "./routes/referral.route.js";
import bonusRoutes from "./routes/bonus.routes.js";

dotenv.config();

// 🔌 DB Connect
connectDB();

const app = express();
const server = http.createServer(app);

// 🔧 Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 ROUTER MOUNT
app.use("/api/user", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/bonus", bonusRoutes);

const PORT = process.env.PORT || 3300;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
