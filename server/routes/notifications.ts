import express from "express";
import { pool } from "../database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const router = express.Router();

// Middleware to check authentication
const requireAuth = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies["auth-token"];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.username, u.first_name, u.last_name, u.avatar, u.bio, u.website, u.location,
              u.instagram, u.twitter, u.behance, u.dribbble, u.role, u.verified, u.followers_count,
              u.following_count, u.uploads_count, u.total_views, u.total_downloads, u.created_at, u.updated_at
       FROM user_sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.token = ? AND s.expires_at > NOW()`,
      [token]
    );

    const users = rows as any[];
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid session" });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Create notifications table if it doesn't exist
const ensureNotificationsTable = async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id int(11) NOT NULL AUTO_INCREMENT,
        user_id int(11) NOT NULL,
        type varchar(50) NOT NULL,
        message text NOT NULL,
        related_id int(11) DEFAULT NULL,
        action_url varchar(255) DEFAULT NULL,
        read_at timestamp NULL DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (id),
        KEY idx_notifications_user_id (user_id),
        KEY idx_notifications_type (type),
        KEY idx_notifications_read_at (read_at),
        KEY idx_notifications_created_at (created_at),
        KEY idx_notifications_user_read_created (user_id, read_at, created_at),
        CONSTRAINT notifications_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log("✅ Notifications table ensured");
  } catch (error) {
    console.error("❌ Error creating notifications table:", error);
  }
};

// Initialize table on module load
ensureNotificationsTable();

// Create a notification
export const createNotification = async (
  userId: number,
  type: string,
  message: string,
  relatedId?: number,
  actionUrl?: string
) => {
  try {
    // Ensure table exists before inserting
    await ensureNotificationsTable();

    // Convert userId to integer if it's a string
    const userIdInt =
      typeof userId === "string" ? parseInt(userId, 10) : userId;

    await pool.execute(
      `INSERT INTO notifications (user_id, type, message, related_id, action_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [userIdInt, type, message, relatedId || null, actionUrl || null]
    );
    console.log(`📢 Notification created for user ${userIdInt}: ${message}`);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// Get user notifications
router.get("/", requireAuth, async (req, res) => {
  try {
    // Ensure table exists
    await ensureNotificationsTable();

    // Convert user ID to integer
    const userId = parseInt(req.user.id.toString(), 10);
    const { limit = 20, offset = 0, unread_only = false } = req.query;

    console.log(
      `🔍 Fetching notifications for user ID: ${userId} (type: ${typeof userId})`
    );

    let whereClause = "WHERE n.user_id = ?";
    const queryParams: any[] = [userId];

    if (unread_only === "true") {
      whereClause += " AND n.read_at IS NULL";
    }

    const [rows] = await pool.execute(
      `SELECT 
        n.id,
        n.user_id,
        n.type,
        n.message,
        n.related_id,
        n.action_url,
        n.read_at,
        n.created_at,
        CASE 
          WHEN n.type = 'like' THEN (
            SELECT JSON_OBJECT(
              'id', u.id,
              'username', u.username,
              'firstName', u.first_name,
              'lastName', u.last_name,
              'avatar', u.avatar,
              'verified', u.verified
            )
            FROM likes l 
            JOIN users u ON l.user_id = u.id 
            WHERE l.id = n.related_id
            LIMIT 1
          )
          WHEN n.type = 'comment' THEN (
            SELECT JSON_OBJECT(
              'id', u.id,
              'username', u.username,
              'firstName', u.first_name,
              'lastName', u.last_name,
              'avatar', u.avatar,
              'verified', u.verified
            )
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.id = n.related_id
            LIMIT 1
          )
          WHEN n.type = 'follow' THEN (
            SELECT JSON_OBJECT(
              'id', u.id,
              'username', u.username,
              'firstName', u.first_name,
              'lastName', u.last_name,
              'avatar', u.avatar,
              'verified', u.verified
            )
            FROM users u 
            WHERE u.id = n.related_id
            LIMIT 1
          )
          ELSE NULL
        END as actor_data
      FROM notifications n
      ${whereClause}
      ORDER BY n.created_at DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit as string), parseInt(offset as string)]
    );

    console.log(
      `✅ Found ${(rows as any[]).length} notifications for user ${userId}`
    );

    const notifications = (rows as any[]).map((notification) => ({
      id: notification.id.toString(),
      type: notification.type,
      message: notification.message,
      actionUrl: notification.action_url,
      read: !!notification.read_at,
      actor: notification.actor_data
        ? JSON.parse(notification.actor_data)
        : null,
      createdAt: notification.created_at,
      readAt: notification.read_at,
    }));

    // Get total count
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM notifications n ${whereClause}`,
      [userId] // Use the converted integer userId
    );
    const total = (countRows as any[])[0].total;

    // Get unread count
    const [unreadRows] = await pool.execute(
      "SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND read_at IS NULL",
      [userId] // Use the converted integer userId
    );
    const unreadCount = (unreadRows as any[])[0].unread;

    console.log(`📊 Total: ${total}, Unread: ${unreadCount}`);

    res.json({
      notifications,
      total,
      unreadCount,
      hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark notification as read
router.patch("/:notificationId/read", requireAuth, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = parseInt(req.user.id.toString(), 10);

    await pool.execute(
      "UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?",
      [parseInt(notificationId, 10), userId]
    );

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

// Mark all notifications as read
router.patch("/mark-all-read", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.user.id.toString(), 10);

    await pool.execute(
      "UPDATE notifications SET read_at = NOW() WHERE user_id = ? AND read_at IS NULL",
      [userId]
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
});

// Delete notification
router.delete("/:notificationId", requireAuth, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = parseInt(req.user.id.toString(), 10);

    await pool.execute(
      "DELETE FROM notifications WHERE id = ? AND user_id = ?",
      [parseInt(notificationId, 10), userId]
    );

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export default router;
