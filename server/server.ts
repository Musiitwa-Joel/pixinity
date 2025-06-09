import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // Parse JSON bodies

// Test database connection on startup
testConnection();

// Routes
app.use("/api/auth", authRoutes);

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
