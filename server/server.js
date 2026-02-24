import "dotenv/config";
import express from "express";
import cors from "cors";
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
import leaderboardRoutes from "./routes/leaderboard.route.js";

const numCPUs = os.cpus().length;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && cluster.isPrimary) {
  const workerCount = Math.min(numCPUs, 4);
  for (let i = 0; i < workerCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    cluster.fork();
  });
} else {
  connectDB();

  const app = express();
  const server = http.createServer(app);

  app.set("trust proxy", 1);

  server.maxConnections = 10000;
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      contentSecurityPolicy: isProduction ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", process.env.CLIENT_URL],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      } : false,
      hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    }),
  );

  // Compression
  app.use(
    compression({
      level: 6,
      threshold: 1024,
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) return false;
        return compression.filter(req, res);
      },
    }),
  );

  // Rate limiting - ENABLED
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 1000 : 500,
    message: {
      success: false,
      error: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === "/api/health",
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 30 : 50,
    message: {
      success: false,
      error: "Too many attempts, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // CORS
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map(o => o.trim())
    : [];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    }),
  );

  app.use(cookieParser());
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  // Apply rate limiting
  app.use("/api", globalLimiter);
  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/register", authLimiter);
  app.use("/api/user/login", authLimiter);
  app.use("/api/auth/forgot-password", authLimiter);
  app.use("/api/auth/verify-otp", authLimiter);

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/twofa", twoFactorRoutes);
  app.use("/api/twitter", twitterRoutes);
  app.use("/api/telegram", telegramRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ success: false, error: "Not found" });
  });

  // Global error handler - sanitize errors in production
  app.use((err, req, res, _next) => {
    if (err.message === "Not allowed by CORS") {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: isProduction ? "Internal server error" : err.message,
    });
  });

  const PORT = process.env.PORT || 3300;

  server.listen(PORT, () => {
    if (!isProduction) {
      console.log(`Server running on http://localhost:${PORT}`);
    }
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    server.close(() => {
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("unhandledRejection", (reason) => {
    if (!isProduction) console.error("Unhandled Rejection:", reason);
  });
  process.on("uncaughtException", (error) => {
    if (!isProduction) console.error("Uncaught Exception:", error);
    process.exit(1);
  });
}
