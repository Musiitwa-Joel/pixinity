import express from "express";
import {
  createUser,
  getUserWithPassword,
  comparePassword,
  generateToken,
  saveSession,
  deleteSession,
  validateSession,
  hashPassword,
} from "../auth";
import {
  sendWelcomeEmail,
  sendLoginNotificationEmail,
} from "../email/emailService";
import useragent from "express-useragent";

const router = express.Router();

// Add user-agent parsing middleware
router.use(useragent.express());

// Test endpoint to verify password hashing
router.post("/test-password", async (req, res) => {
  try {
    const { password } = req.body;
    const hash = await hashPassword(password || "password123");
    const isValid = await comparePassword(password || "password123", hash);

    res.json({
      password: password || "password123",
      hash,
      isValid,
      message: "Password test completed",
    });
  } catch (error) {
    console.error("Password test error:", error);
    res.status(500).json({ error: "Password test failed" });
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, username, password, firstName, lastName, role } = req.body;

    console.log("Registration attempt:", { email, username });

    // Validation
    if (!email || !username || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Create user
    const user = await createUser({
      email,
      username,
      password,
      firstName,
      lastName,
      role,
    });

    console.log("User created:", user.email);

    // Generate token and save session
    const token = generateToken(user.id);
    await saveSession(user.id, token);

    console.log("Token generated and session saved");

    // Set cookie with explicit options
    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: false, // Set to false for localhost
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/", // Ensure cookie is available for all paths
    });

    console.log("Cookie set for registration");

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, {
      firstName,
      username,
      role: role || "photographer",
    })
      .then((success) => {
        if (success) {
          console.log(`Welcome email sent successfully to ${email}`);
        }
      })
      .catch((error) => {
        console.error("Failed to send welcome email:", error);
      });

    res.status(201).json({ user, message: "Registration successful" });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "Email or username already exists" });
    }

    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.useragent;

    console.log("=== LOGIN ATTEMPT ===");
    console.log("Email:", email);
    console.log("Password provided:", !!password);

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Get user with password
    console.log("Fetching user from database...");
    const userWithPassword = await getUserWithPassword(email);

    if (!userWithPassword) {
      console.log(`❌ User not found: ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log(`✅ User found: ${email}`);

    // Test password comparison
    console.log("Testing password comparison...");
    const isValidPassword = await comparePassword(
      password,
      userWithPassword.passwordHash
    );
    console.log("Password comparison result:", isValidPassword);

    if (!isValidPassword) {
      console.log(`❌ Invalid password for user: ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log(`✅ Password valid for user: ${email}`);

    // Remove password from user object
    const { passwordHash, ...user } = userWithPassword;

    // Generate token and save session
    const token = generateToken(user.id);
    await saveSession(user.id, token);

    console.log("Token generated and session saved");

    // Set cookie with explicit options
    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: false, // Set to false for localhost
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/", // Ensure cookie is available for all paths
    });

    console.log(`✅ Login successful for: ${email}`);

    // Send login notification email (non-blocking)
    const loginTime = new Date().toLocaleString();
    const ipAddress = req.ip || req.socket.remoteAddress || "Unknown";
    const device = userAgent?.source
      ? `${userAgent.browser} on ${userAgent.os}`
      : "Unknown device";

    sendLoginNotificationEmail(email, {
      firstName: user.firstName,
      loginTime,
      ipAddress,
      device,
    })
      .then((success) => {
        if (success) {
          console.log(`Login notification email sent successfully to ${email}`);
        }
      })
      .catch((error) => {
        console.error("Failed to send login notification:", error);
      });

    res.json({ user, message: "Login successful" });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Change password
router.post("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.cookies["auth-token"];

    console.log("🔐 Password change request received");

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new passwords are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "New password must be at least 8 characters" });
    }

    // Validate session and get user
    const user = await validateSession(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid session" });
    }

    console.log(`🔍 Validating password change for user: ${user.email}`);

    // Get user with password hash
    const userWithPassword = await getUserWithPassword(user.email);
    if (!userWithPassword) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      userWithPassword.passwordHash
    );

    if (!isCurrentPasswordValid) {
      console.log("❌ Current password is incorrect");
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    console.log("✅ Current password verified");

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password in database
    const { pool } = await import("../database");
    await pool.execute(
      "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?",
      [newPasswordHash, user.id]
    );

    console.log(`✅ Password updated for user: ${user.email}`);

    res.json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies["auth-token"];
    console.log("Logout attempt, token exists:", !!token);

    if (token) {
      await deleteSession(token);
    }

    res.clearCookie("auth-token", {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    console.log("Logout successful");
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies["auth-token"];
    console.log("Auth check - Token exists:", !!token);

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await validateSession(token);
    if (!user) {
      console.log("Invalid session token");
      res.clearCookie("auth-token", {
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      return res.status(401).json({ error: "Invalid session" });
    }

    console.log(`User authenticated: ${user.email}`);
    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

export default router;
