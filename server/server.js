import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cluster from "cluster";
import os from "os";

import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";
import adminRoutes from "./routes/admin.route.js";
import twoFactorRoutes from "./routes/twoFactor.routes.js";
import twitterRoutes from "./routes/twitter.route.js";
import telegramRoutes from "./routes/telegram.route.js";

dotenv.config();

// 🚀 Cluster Mode for Multi-Core CPU Utilization
const numCPUs = os.cpus().length;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && cluster.isPrimary) {
  console.log(`🔧 Primary ${process.pid} is running`);
  console.log(`🚀 Forking ${numCPUs} workers...`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`💀 Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker process or development mode

  // 🔌 DB Connect
  connectDB();

  const app = express();
  const server = http.createServer(app);

  // 🔒 Trust proxy - Required for Render/Heroku/etc (reverse proxy)
  // This allows express-rate-limit to correctly identify users by IP
  app.set("trust proxy", 1);

  // ⚡ Performance: Increase server connection limits
  server.maxConnections = 10000;
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  // 🛡️ Security Middlewares
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    }),
  );

  // 📦 Compression - Reduce response size by ~70%
  app.use(
    compression({
      level: 6, // Balanced compression level
      threshold: 1024, // Only compress responses > 1KB
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) return false;
        return compression.filter(req, res);
      },
    }),
  );

  // 🚦 Rate Limiting (increased for production)
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isProduction ? 1000 : 100, // 1000 requests in production, 100 in dev
    message: {
      error: "Too many requests, please try again later.",
      retryAfter: "15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === "/api/health", // Skip rate limit for health checks
  });

  // Stricter rate limit for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isProduction ? 50 : 10, // 50 login attempts in production
    message: {
      error: "Too many login attempts, please try again later.",
      retryAfter: "15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // 🔧 Middlewares
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "10kb" })); // Limit body size
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  // Apply global rate limiting to all API routes
  app.use("/api", globalLimiter);

  // Apply stricter rate limiting to auth endpoints
  app.use("/api/user/login", authLimiter);
  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/register", authLimiter);

  // 🔗 ROUTER MOUNT
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/twofa", twoFactorRoutes);
  app.use("/api/twitter", twitterRoutes);
  app.use("/api/telegram", telegramRoutes);

  // 🏥 Health Check Endpoint (for load testing)
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      worker: cluster.isWorker ? cluster.worker.id : "primary",
    });
  });

  const PORT = process.env.PORT || 3300;

  server.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} running on http://localhost:${PORT}`);
  });
}
