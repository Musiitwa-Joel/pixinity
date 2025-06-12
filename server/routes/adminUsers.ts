import express from "express";
import { pool } from "../database";
import { validateSession, hashPassword } from "../auth";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const router = express.Router();

// Middleware to check admin authentication
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies["auth-token"];
    if (!token) {
      console.log("No auth token provided");
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await validateSession(token);
    if (!user) {
      console.log("Invalid session token");
      return res.status(401).json({ error: "Invalid session" });
    }

    // Check if user is admin or super_admin
    // Special case for musiitwajoel@gmail.com - always grant admin access
    const isMusiitwajoel = user.email === "musiitwajoel@gmail.com";
    if (
      !isMusiitwajoel &&
      user.role !== "admin" &&
      user.role !== "super_admin"
    ) {
      console.log(`Access denied for user: ${user.email}, role: ${user.role}`);
      return res.status(403).json({ error: "Admin access required" });
    }

    // Store if user is super admin for permission checks
    req.user = user;
    req.isSuperAdmin = isMusiitwajoel || user.role === "super_admin";

    console.log(
      `Admin access granted for user: ${user.email} (Super Admin: ${req.isSuperAdmin})`
    );
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Get user statistics
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    console.log("Fetching user statistics...");

    // Get total users count
    const [totalUsersResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM users"
    );
    const totalUsers = (totalUsersResult as RowDataPacket[])[0].count;

    // Get verified users count
    const [verifiedUsersResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM users WHERE verified = 1"
    );
    const verifiedUsers = (verifiedUsersResult as RowDataPacket[])[0].count;

    // Get admin users count
    const [adminUsersResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin' OR role = 'super_admin'"
    );
    const adminUsers = (adminUsersResult as RowDataPacket[])[0].count;

    // Get photographer users count
    const [photographerUsersResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM users WHERE role = 'photographer'"
    );
    const photographerUsers = (photographerUsersResult as RowDataPacket[])[0]
      .count;

    // Get company users count
    const [companyUsersResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM users WHERE role = 'company'"
    );
    const companyUsers = (companyUsersResult as RowDataPacket[])[0].count;

    // Get new users in the last 7 days
    const [newUsersResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
    );
    const newUsers = (newUsersResult as RowDataPacket[])[0].count;

    console.log("User statistics fetched successfully:", {
      totalUsers,
      verifiedUsers,
      adminUsers,
      photographerUsers,
      companyUsers,
      newUsers,
    });

    res.json({
      totalUsers,
      verifiedUsers,
      adminUsers,
      photographerUsers,
      companyUsers,
      newUsers,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
});

// Get all users with pagination and filtering
router.get("/", requireAdmin, async (req, res) => {
  try {
    console.log("Fetching users with filters:", req.query);

    const {
      search = "",
      role = "all",
      sort = "newest",
      limit = 10,
      offset = 0,
    } = req.query;

    // Build the query
    let query = `
      SELECT id, email, username, first_name, last_name, avatar, role, 
             verified, followers_count, following_count, uploads_count, 
             created_at, updated_at
      FROM users
      WHERE 1=1
    `;

    const queryParams: any[] = [];

    // Add search filter
    if (search) {
      query += ` AND (
        username LIKE ? OR 
        email LIKE ? OR 
        first_name LIKE ? OR 
        last_name LIKE ?
      )`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Add role filter
    if (role && role !== "all") {
      query += ` AND role = ?`;
      queryParams.push(role);
    }

    // Add sorting
    if (sort === "oldest") {
      query += ` ORDER BY created_at ASC`;
    } else if (sort === "a-z") {
      query += ` ORDER BY username ASC`;
    } else if (sort === "z-a") {
      query += ` ORDER BY username DESC`;
    } else if (sort === "most-uploads") {
      query += ` ORDER BY uploads_count DESC`;
    } else if (sort === "most-followers") {
      query += ` ORDER BY followers_count DESC`;
    } else {
      // Default: newest
      query += ` ORDER BY created_at DESC`;
    }

    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(Number(limit), Number(offset));

    // Execute the query
    const [rows] = await pool.execute(query, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM users
      WHERE 1=1
    `;

    const countParams: any[] = [];

    // Add search filter to count query
    if (search) {
      countQuery += ` AND (
        username LIKE ? OR 
        email LIKE ? OR 
        first_name LIKE ? OR 
        last_name LIKE ?
      )`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Add role filter to count query
    if (role && role !== "all") {
      countQuery += ` AND role = ?`;
      countParams.push(role);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = (countResult as RowDataPacket[])[0].total;

    // Format the response
    const users = (rows as RowDataPacket[]).map((user) => ({
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      avatar: user.avatar,
      role: user.role,
      verified: Boolean(user.verified),
      followersCount: user.followers_count || 0,
      followingCount: user.following_count || 0,
      uploadsCount: user.uploads_count || 0,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));

    console.log(`Fetched ${users.length} users out of ${total} total`);

    res.json({
      users,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get user by ID
router.get("/:userId", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching user details for ID: ${userId}`);

    const [rows] = await pool.execute(
      `SELECT id, email, username, first_name, last_name, avatar, bio, website, location,
              instagram, twitter, behance, dribbble, role, verified, followers_count,
              following_count, uploads_count, total_views, total_downloads, created_at, updated_at
       FROM users WHERE id = ?`,
      [userId]
    );

    const users = rows as RowDataPacket[];
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];

    // Transform to match frontend expectations
    const transformedUser = {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      avatar: user.avatar,
      bio: user.bio,
      website: user.website,
      location: user.location,
      socialLinks: {
        instagram: user.instagram,
        twitter: user.twitter,
        behance: user.behance,
        dribbble: user.dribbble,
      },
      role: user.role,
      verified: Boolean(user.verified),
      followersCount: user.followers_count || 0,
      followingCount: user.following_count || 0,
      uploadsCount: user.uploads_count || 0,
      totalViews: user.total_views || 0,
      totalDownloads: user.total_downloads || 0,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    res.json(transformedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update user
router.put("/:userId", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      email,
      username,
      firstName,
      lastName,
      role,
      verified,
      bio,
      website,
      location,
      socialLinks,
    } = req.body;

    console.log(`Updating user ID: ${userId}`, req.body);

    // Check if user exists
    const [userRows] = await pool.execute(
      "SELECT id, email, role FROM users WHERE id = ?",
      [userId]
    );

    if ((userRows as RowDataPacket[]).length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userToUpdate = (userRows as RowDataPacket[])[0];

    // Special permission check for super admin
    // Only the super admin (musiitwajoel@gmail.com) can modify other admins
    if (userToUpdate.email === "musiitwajoel@gmail.com" && !req.isSuperAdmin) {
      return res
        .status(403)
        .json({ error: "You don't have permission to modify the super admin" });
    }

    // Regular admins can't change other admins' roles
    if (
      userToUpdate.role === "admin" &&
      !req.isSuperAdmin &&
      role &&
      role !== userToUpdate.role
    ) {
      return res
        .status(403)
        .json({ error: "Only super admin can change admin roles" });
    }

    // Check if email is already taken by another user
    if (email) {
      const [emailRows] = await pool.execute(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, userId]
      );

      if ((emailRows as RowDataPacket[]).length > 0) {
        return res.status(400).json({ error: "Email is already taken" });
      }
    }

    // Check if username is already taken by another user
    if (username) {
      const [usernameRows] = await pool.execute(
        "SELECT id FROM users WHERE username = ? AND id != ?",
        [username, userId]
      );

      if ((usernameRows as RowDataPacket[]).length > 0) {
        return res.status(400).json({ error: "Username is already taken" });
      }
    }

    // Build the update query
    let updateQuery = "UPDATE users SET ";
    const updateParams: any[] = [];
    const updateFields: string[] = [];

    if (email !== undefined) {
      updateFields.push("email = ?");
      updateParams.push(email);
    }

    if (username !== undefined) {
      updateFields.push("username = ?");
      updateParams.push(username);
    }

    if (firstName !== undefined) {
      updateFields.push("first_name = ?");
      updateParams.push(firstName);
    }

    if (lastName !== undefined) {
      updateFields.push("last_name = ?");
      updateParams.push(lastName);
    }

    if (role !== undefined) {
      // Ensure we don't change the super admin's role
      if (userToUpdate.email === "musiitwajoel@gmail.com") {
        // For musiitwajoel@gmail.com, we'll use admin role since super_admin isn't supported
        updateFields.push("role = 'admin'");
      } else {
        updateFields.push("role = ?");
        updateParams.push(role);
      }
    }

    if (verified !== undefined) {
      updateFields.push("verified = ?");
      updateParams.push(verified ? 1 : 0);
    }

    if (bio !== undefined) {
      updateFields.push("bio = ?");
      updateParams.push(bio);
    }

    if (website !== undefined) {
      updateFields.push("website = ?");
      updateParams.push(website);
    }

    if (location !== undefined) {
      updateFields.push("location = ?");
      updateParams.push(location);
    }

    if (socialLinks) {
      if (socialLinks.instagram !== undefined) {
        updateFields.push("instagram = ?");
        updateParams.push(socialLinks.instagram);
      }
      if (socialLinks.twitter !== undefined) {
        updateFields.push("twitter = ?");
        updateParams.push(socialLinks.twitter);
      }
      if (socialLinks.behance !== undefined) {
        updateFields.push("behance = ?");
        updateParams.push(socialLinks.behance);
      }
      if (socialLinks.dribbble !== undefined) {
        updateFields.push("dribbble = ?");
        updateParams.push(socialLinks.dribbble);
      }
    }

    // Add updated_at timestamp
    updateFields.push("updated_at = NOW()");

    // If no fields to update, return success
    if (updateFields.length === 0) {
      return res.json({ message: "No changes to update" });
    }

    // Complete the query
    updateQuery += updateFields.join(", ") + " WHERE id = ?";
    updateParams.push(userId);

    // Execute the update
    await pool.execute(updateQuery, updateParams);

    console.log(`User ${userId} updated successfully`);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Create new user
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      firstName,
      lastName,
      role = "photographer",
      verified = false,
    } = req.body;

    console.log("Creating new user:", {
      email,
      username,
      firstName,
      lastName,
      role,
    });

    // Validate required fields
    if (!email || !username || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Check if email is already taken
    const [emailRows] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if ((emailRows as RowDataPacket[]).length > 0) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // Check if username is already taken
    const [usernameRows] = await pool.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if ((usernameRows as RowDataPacket[]).length > 0) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Special case: if the email is musiitwajoel@gmail.com, force role to be admin
    // We use 'admin' instead of 'super_admin' since the database doesn't support it
    const finalRole = email === "musiitwajoel@gmail.com" ? "admin" : role;

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Insert the new user
    const [result] = await pool.execute(
      `INSERT INTO users (
        email, username, password_hash, first_name, last_name, 
        role, verified, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        email,
        username,
        passwordHash,
        firstName,
        lastName,
        finalRole,
        verified ? 1 : 0,
      ]
    );

    const insertResult = result as ResultSetHeader;
    const newUserId = insertResult.insertId;

    // Get the created user
    const [userRows] = await pool.execute(
      `SELECT id, email, username, first_name, last_name, avatar, role, 
              verified, followers_count, following_count, uploads_count, 
              created_at, updated_at
       FROM users WHERE id = ?`,
      [newUserId]
    );

    const user = (userRows as RowDataPacket[])[0];

    // Transform to match frontend expectations
    const transformedUser = {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      avatar: user.avatar,
      role: user.role,
      verified: Boolean(user.verified),
      followersCount: user.followers_count || 0,
      followingCount: user.following_count || 0,
      uploadsCount: user.uploads_count || 0,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    console.log(`User created successfully with ID: ${newUserId}`);
    res.status(201).json({
      message: "User created successfully",
      user: transformedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Delete user
router.delete("/:userId", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Deleting user ID: ${userId}`);

    // Check if user exists
    const [userRows] = await pool.execute(
      "SELECT id, email, role FROM users WHERE id = ?",
      [userId]
    );

    if ((userRows as RowDataPacket[]).length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userToDelete = (userRows as RowDataPacket[])[0];

    // Special permission check for super admin
    if (userToDelete.email === "musiitwajoel@gmail.com") {
      return res
        .status(403)
        .json({ error: "The super admin account cannot be deleted" });
    }

    // Regular admins can't delete other admins
    if (
      (userToDelete.role === "admin" || userToDelete.role === "super_admin") &&
      !req.isSuperAdmin
    ) {
      return res
        .status(403)
        .json({ error: "Only super admin can delete admin accounts" });
    }

    // Delete the user
    await pool.execute("DELETE FROM users WHERE id = ?", [userId]);

    console.log(`User ${userId} deleted successfully`);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Toggle user verification status
router.post("/:userId/toggle-verification", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Toggling verification status for user ID: ${userId}`);

    // Get current verification status
    const [userRows] = await pool.execute(
      "SELECT verified, email, role FROM users WHERE id = ?",
      [userId]
    );

    if ((userRows as RowDataPacket[]).length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = (userRows as RowDataPacket[])[0];

    // Special permission check for super admin
    if (user.email === "musiitwajoel@gmail.com" && !req.isSuperAdmin) {
      return res
        .status(403)
        .json({ error: "You don't have permission to modify the super admin" });
    }

    // Regular admins can't modify other admins
    if (
      (user.role === "admin" || user.role === "super_admin") &&
      !req.isSuperAdmin
    ) {
      return res
        .status(403)
        .json({ error: "Only super admin can modify admin accounts" });
    }

    const currentStatus = Boolean(user.verified);
    const newStatus = !currentStatus;

    // Update verification status
    await pool.execute(
      "UPDATE users SET verified = ?, updated_at = NOW() WHERE id = ?",
      [newStatus ? 1 : 0, userId]
    );

    console.log(`User ${userId} verification status updated to: ${newStatus}`);
    res.json({
      message: `User ${newStatus ? "verified" : "unverified"} successfully`,
      verified: newStatus,
    });
  } catch (error) {
    console.error("Error toggling verification status:", error);
    res.status(500).json({ error: "Failed to update verification status" });
  }
});

// Toggle user admin status
router.post("/:userId/toggle-admin", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Toggling admin status for user ID: ${userId}`);

    // Get current role
    const [userRows] = await pool.execute(
      "SELECT role, email FROM users WHERE id = ?",
      [userId]
    );

    if ((userRows as RowDataPacket[]).length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = (userRows as RowDataPacket[])[0];

    // Special permission check for super admin
    if (user.email === "musiitwajoel@gmail.com") {
      return res
        .status(403)
        .json({ error: "The super admin role cannot be changed" });
    }

    // Only super admin can change admin roles
    if (
      (user.role === "admin" || user.role === "super_admin") &&
      !req.isSuperAdmin
    ) {
      return res
        .status(403)
        .json({ error: "Only super admin can modify admin roles" });
    }

    // Determine new role
    let newRole;
    if (user.role === "admin") {
      newRole = "photographer"; // Demote admin to photographer
    } else {
      newRole = "admin"; // Promote to admin
    }

    // Update role
    await pool.execute(
      "UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?",
      [newRole, userId]
    );

    console.log(`User ${userId} role updated to: ${newRole}`);
    res.json({
      message: `User role updated to ${newRole} successfully`,
      role: newRole,
    });
  } catch (error) {
    console.error("Error toggling admin status:", error);
    res.status(500).json({ error: "Failed to update admin status" });
  }
});

// Ensure super admin exists
const ensureSuperAdmin = async () => {
  try {
    console.log("Checking for super admin account...");

    // Check if musiitwajoel@gmail.com exists
    const [rows] = await pool.execute(
      "SELECT id, role FROM users WHERE email = ?",
      ["musiitwajoel@gmail.com"]
    );

    if ((rows as RowDataPacket[]).length > 0) {
      const user = (rows as RowDataPacket[])[0];

      // If exists but not admin, update role to admin
      // We use 'admin' instead of 'super_admin' since the database doesn't support it
      if (user.role !== "admin") {
        console.log("Updating musiitwajoel@gmail.com to admin role");
        await pool.execute(
          "UPDATE users SET role = 'admin', updated_at = NOW() WHERE id = ?",
          [user.id]
        );
        console.log("Updated musiitwajoel@gmail.com to admin role");
      } else {
        console.log("musiitwajoel@gmail.com already has admin role");
      }
    } else {
      console.log("musiitwajoel@gmail.com user not found");
    }
  } catch (error) {
    console.error("Error ensuring super admin:", error);
  }
};

// Run on module load
ensureSuperAdmin();

export default router;
