import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";


import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.route.js";
import taskRoutes from "./routes/task.route.js";
import adminRoutes from "./routes/admin.route.js";

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
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3300;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
