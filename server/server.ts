import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth";
import collectionsRoutes from "./routes/collections";
import photosRoutes from "./routes/photos";
import notificationsRoutes from "./routes/notifications";
import analyticsRoutes from "./routes/analytics";
import usersRoutes from "./routes/users";
import { testConnection } from "./database";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - ORDER MATTERS!
app.use(cookieParser()); // Parse cookies first

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow both localhost and 127.0.0.1
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" })); // Parse JSON bodies with larger limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies

// Serve static files (uploaded photos)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Test database connection on startup
testConnection();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/photos", photosRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", usersRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    cookies: req.cookies, // Debug: show received cookies
  });
});

// Debug endpoint to check cookies
app.get("/api/debug/cookies", (req, res) => {
  res.json({
    cookies: req.cookies,
    headers: req.headers,
  });
});

// Error handling middleware
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
