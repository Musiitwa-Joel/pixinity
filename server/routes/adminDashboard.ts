import express from "express";
import { pool } from "../database";
import { validateSession } from "../auth";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const router = express.Router();

// Middleware to check admin authentication
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies["auth-token"];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await validateSession(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid session" });
    }

    // Check if user is admin
    if (user.role !== "admin" && user.role !== "super_admin") {
      console.log(`Access denied for user: ${user.email}, role: ${user.role}`);
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = user;
    console.log(`Admin access granted for user: ${user.email}`);
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Get dashboard stats
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    console.log("Fetching dashboard stats...");

    // Get total users count
    const [usersResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM users"
    );
    const totalUsers = (usersResult as RowDataPacket[])[0].count;

    // Get total photos count
    const [photosResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM photos"
    );
    const totalPhotos = (photosResult as RowDataPacket[])[0].count;

    // Get total collections count
    const [collectionsResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM collections"
    );
    const totalCollections = (collectionsResult as RowDataPacket[])[0].count;

    // Get total views count
    const [viewsResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM photo_views"
    );
    const totalViews = (viewsResult as RowDataPacket[])[0].count;

    // Get total likes count
    const [likesResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM likes"
    );
    const totalLikes = (likesResult as RowDataPacket[])[0].count;

    // Get total downloads count
    const [downloadsResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM downloads"
    );
    const totalDownloads = (downloadsResult as RowDataPacket[])[0].count;

    // Get new users today
    const [newUsersResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()"
    );
    const newUsersToday = (newUsersResult as RowDataPacket[])[0].count;

    // Get new photos today
    const [newPhotosResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM photos WHERE DATE(created_at) = CURDATE()"
    );
    const newPhotosToday = (newPhotosResult as RowDataPacket[])[0].count;

    // Get active users (users with sessions that haven't expired)
    const [activeUsersResult] = await pool.execute(
      "SELECT COUNT(DISTINCT user_id) as count FROM user_sessions WHERE expires_at > NOW()"
    );
    const activeUsers = (activeUsersResult as RowDataPacket[])[0].count;

    console.log("Dashboard stats fetched successfully");

    res.json({
      totalUsers,
      totalPhotos,
      totalCollections,
      totalViews,
      totalLikes,
      totalDownloads,
      newUsersToday,
      newPhotosToday,
      pendingReports: 0, // Placeholder for future implementation
      activeUsers,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// Get recent users
router.get("/recent-users", requireAdmin, async (req, res) => {
  try {
    console.log("Fetching recent users...");

    const [rows] = await pool.execute(
      `SELECT id, email, username, first_name, last_name, avatar, role, created_at, updated_at
       FROM users
       ORDER BY created_at DESC
       LIMIT 4` // Changed from 10 to 4
    );

    const users = (rows as RowDataPacket[]).map((user) => ({
      id: user.id.toString(),
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));

    console.log(`Fetched ${users.length} recent users`);
    res.json(users);
  } catch (error) {
    console.error("Error fetching recent users:", error);
    res.status(500).json({ error: "Failed to fetch recent users" });
  }
});

// Get recent photos
router.get("/recent-photos", requireAdmin, async (req, res) => {
  try {
    console.log("Fetching recent photos...");

    const [rows] = await pool.execute(
      `SELECT p.id, p.title, p.thumbnail_path, p.created_at,
              u.id as photographer_id, u.username as photographer_username,
              u.first_name as photographer_first_name, u.last_name as photographer_last_name
       FROM photos p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC
       LIMIT 4` // Changed from 10 to 4
    );

    const photos = (rows as RowDataPacket[]).map((photo) => ({
      id: photo.id.toString(),
      title: photo.title,
      thumbnailUrl: photo.thumbnail_path,
      photographer: {
        id: photo.photographer_id.toString(),
        username: photo.photographer_username,
        firstName: photo.photographer_first_name,
        lastName: photo.photographer_last_name,
      },
      createdAt: photo.created_at,
    }));

    console.log(`Fetched ${photos.length} recent photos`);
    res.json(photos);
  } catch (error) {
    console.error("Error fetching recent photos:", error);
    res.status(500).json({ error: "Failed to fetch recent photos" });
  }
});

// Get recent activity
router.get("/recent-activity", requireAdmin, async (req, res) => {
  try {
    console.log("Fetching recent activity...");

    // Get recent likes
    const [likesRows] = await pool.execute(
      `SELECT l.id, l.created_at, 'like' as type,
              u.id as user_id, u.username, u.first_name, u.last_name, u.avatar,
              p.id as photo_id, p.title as photo_title
       FROM likes l
       JOIN users u ON l.user_id = u.id
       JOIN photos p ON l.photo_id = p.id
       ORDER BY l.created_at DESC
       LIMIT 5`
    );

    // Get recent comments
    const [commentsRows] = await pool.execute(
      `SELECT c.id, c.content, c.created_at, 'comment' as type,
              u.id as user_id, u.username, u.first_name, u.last_name, u.avatar,
              p.id as photo_id, p.title as photo_title
       FROM comments c
       JOIN users u ON c.user_id = u.id
       JOIN photos p ON c.photo_id = p.id
       ORDER BY c.created_at DESC
       LIMIT 5`
    );

    // Get recent downloads
    const [downloadsRows] = await pool.execute(
      `SELECT d.id, d.download_date as created_at, 'download' as type,
              u.id as user_id, u.username, u.first_name, u.last_name, u.avatar,
              p.id as photo_id, p.title as photo_title
       FROM downloads d
       JOIN users u ON d.user_id = u.id
       JOIN photos p ON d.photo_id = p.id
       ORDER BY d.download_date DESC
       LIMIT 5`
    );

    // Get recent follows
    const [followsRows] = await pool.execute(
      `SELECT f.follower_id, f.following_id, f.created_at, 'follow' as type,
              u1.username as follower_username, u1.first_name as follower_first_name, 
              u1.last_name as follower_last_name, u1.avatar as follower_avatar,
              u2.username as following_username, u2.first_name as following_first_name, 
              u2.last_name as following_last_name
       FROM follows f
       JOIN users u1 ON f.follower_id = u1.id
       JOIN users u2 ON f.following_id = u2.id
       ORDER BY f.created_at DESC
       LIMIT 5`
    );

    // Get recent registrations
    const [registrationsRows] = await pool.execute(
      `SELECT id, username, first_name, last_name, avatar, created_at, 'registration' as type
       FROM users
       ORDER BY created_at DESC
       LIMIT 5`
    );

    // Combine and format all activities
    const likes = (likesRows as RowDataPacket[]).map((row) => ({
      id: `like_${row.id}`,
      type: row.type,
      user: {
        id: row.user_id.toString(),
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        avatar: row.avatar,
      },
      content: `liked photo "${row.photo_title}"`,
      photoId: row.photo_id.toString(),
      photoTitle: row.photo_title,
      timestamp: row.created_at,
    }));

    const comments = (commentsRows as RowDataPacket[]).map((row) => ({
      id: `comment_${row.id}`,
      type: row.type,
      user: {
        id: row.user_id.toString(),
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        avatar: row.avatar,
      },
      content: `commented on "${row.photo_title}": "${row.content.substring(
        0,
        30
      )}${row.content.length > 30 ? "..." : ""}"`,
      photoId: row.photo_id.toString(),
      photoTitle: row.photo_title,
      timestamp: row.created_at,
    }));

    const downloads = (downloadsRows as RowDataPacket[]).map((row) => ({
      id: `download_${row.id}`,
      type: row.type,
      user: {
        id: row.user_id.toString(),
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        avatar: row.avatar,
      },
      content: `downloaded photo "${row.photo_title}"`,
      photoId: row.photo_id.toString(),
      photoTitle: row.photo_title,
      timestamp: row.created_at,
    }));

    const follows = (followsRows as RowDataPacket[]).map((row) => ({
      id: `follow_${row.follower_id}_${row.following_id}`,
      type: row.type,
      user: {
        id: row.follower_id.toString(),
        username: row.follower_username,
        firstName: row.follower_first_name,
        lastName: row.follower_last_name,
        avatar: row.follower_avatar,
      },
      content: `started following ${row.following_first_name} ${row.following_last_name}`,
      followingId: row.following_id.toString(),
      followingUsername: row.following_username,
      timestamp: row.created_at,
    }));

    const registrations = (registrationsRows as RowDataPacket[]).map((row) => ({
      id: `registration_${row.id}`,
      type: row.type,
      user: {
        id: row.id.toString(),
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        avatar: row.avatar,
      },
      content: `joined Pixinity`,
      timestamp: row.created_at,
    }));

    // Combine all activities and sort by timestamp
    const allActivities = [
      ...likes,
      ...comments,
      ...downloads,
      ...follows,
      ...registrations,
    ];
    allActivities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Return the 20 most recent activities
    console.log(`Fetched ${allActivities.length} recent activities`);
    res.json(allActivities.slice(0, 20));
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ error: "Failed to fetch recent activity" });
  }
});

// Get users count
router.get("/users/count", requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute("SELECT COUNT(*) as count FROM users");
    const count = (result as RowDataPacket[])[0].count;
    res.json({ count });
  } catch (error) {
    console.error("Error fetching users count:", error);
    res.status(500).json({ error: "Failed to fetch users count" });
  }
});

// Get photos count
router.get("/photos/count", requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute("SELECT COUNT(*) as count FROM photos");
    const count = (result as RowDataPacket[])[0].count;
    res.json({ count });
  } catch (error) {
    console.error("Error fetching photos count:", error);
    res.status(500).json({ error: "Failed to fetch photos count" });
  }
});

// Get collections count
router.get("/collections/count", requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute(
      "SELECT COUNT(*) as count FROM collections"
    );
    const count = (result as RowDataPacket[])[0].count;
    res.json({ count });
  } catch (error) {
    console.error("Error fetching collections count:", error);
    res.status(500).json({ error: "Failed to fetch collections count" });
  }
});

// Get photo stats (views, likes, downloads)
router.get("/photos/stats", requireAdmin, async (req, res) => {
  try {
    // Get total views
    const [viewsResult] = await pool.execute(
      "SELECT COUNT(*) as totalViews FROM photo_views"
    );
    const totalViews = (viewsResult as RowDataPacket[])[0].totalViews;

    // Get total likes
    const [likesResult] = await pool.execute(
      "SELECT COUNT(*) as totalLikes FROM likes"
    );
    const totalLikes = (likesResult as RowDataPacket[])[0].totalLikes;

    // Get total downloads
    const [downloadsResult] = await pool.execute(
      "SELECT COUNT(*) as totalDownloads FROM downloads"
    );
    const totalDownloads = (downloadsResult as RowDataPacket[])[0]
      .totalDownloads;

    res.json({
      totalViews,
      totalLikes,
      totalDownloads,
    });
  } catch (error) {
    console.error("Error fetching photo stats:", error);
    res.status(500).json({ error: "Failed to fetch photo stats" });
  }
});

// Get new users today
router.get("/users/new-today", requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute(
      "SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()"
    );
    const count = (result as RowDataPacket[])[0].count;
    res.json({ count });
  } catch (error) {
    console.error("Error fetching new users today:", error);
    res.status(500).json({ error: "Failed to fetch new users today" });
  }
});

// Get new photos today
router.get("/photos/new-today", requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute(
      "SELECT COUNT(*) as count FROM photos WHERE DATE(created_at) = CURDATE()"
    );
    const count = (result as RowDataPacket[])[0].count;
    res.json({ count });
  } catch (error) {
    console.error("Error fetching new photos today:", error);
    res.status(500).json({ error: "Failed to fetch new photos today" });
  }
});

// Get active users
router.get("/users/active", requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute(
      "SELECT COUNT(DISTINCT user_id) as count FROM user_sessions WHERE expires_at > NOW()"
    );
    const count = (result as RowDataPacket[])[0].count;
    res.json({ count });
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({ error: "Failed to fetch active users" });
  }
});

// Get recent users
router.get("/users/recent", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, email, username, first_name, last_name, avatar, role, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT 4` // Changed from 10 to 4
    );

    const users = (rows as RowDataPacket[]).map((user) => ({
      id: user.id.toString(),
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    }));

    res.json(users);
  } catch (error) {
    console.error("Error fetching recent users:", error);
    res.status(500).json({ error: "Failed to fetch recent users" });
  }
});

// Get recent photos
router.get("/photos/recent", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.id, p.title, p.thumbnail_path, p.created_at,
              u.id as photographer_id, u.username as photographer_username,
              u.first_name as photographer_first_name, u.last_name as photographer_last_name
       FROM photos p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC
       LIMIT 4` // Changed from 10 to 4
    );

    const photos = (rows as RowDataPacket[]).map((photo) => ({
      id: photo.id.toString(),
      title: photo.title,
      thumbnailUrl: photo.thumbnail_path,
      photographer: {
        username: photo.photographer_username,
        firstName: photo.photographer_first_name,
        lastName: photo.photographer_last_name,
      },
      createdAt: photo.created_at,
    }));

    res.json(photos);
  } catch (error) {
    console.error("Error fetching recent photos:", error);
    res.status(500).json({ error: "Failed to fetch recent photos" });
  }
});

export default router;
