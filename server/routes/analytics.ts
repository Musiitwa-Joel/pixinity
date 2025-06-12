import express from "express";
import { pool } from "../database";
import { sendAnalyticsEmail } from "../email/emailService";
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

// Get user analytics
router.get("/user/:userId", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;

    // Only allow users to see their own analytics
    if (userId !== requestingUserId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to view analytics" });
    }

    const { period = "30" } = req.query; // days
    const days = parseInt(period as string);

    // Get overall stats
    const [statsRows] = await pool.execute(
      `SELECT 
        COUNT(*) as totalPhotos,
        COALESCE(SUM(views), 0) as totalViews,
        COALESCE(SUM(likes), 0) as totalLikes,
        COALESCE(SUM(downloads), 0) as totalDownloads,
        AVG(views) as avgViews,
        AVG(likes) as avgLikes,
        AVG(downloads) as avgDownloads
      FROM photos 
      WHERE user_id = ? AND status = 'live'`,
      [userId]
    );

    const stats = (statsRows as any[])[0];

    // Get top performing photos
    const [topPhotosRows] = await pool.execute(
      `SELECT 
        id, title, file_path as url, thumbnail_path, views, likes, downloads,
        (views + likes * 2 + downloads * 3) as engagement_score
      FROM photos 
      WHERE user_id = ? AND status = 'live'
      ORDER BY engagement_score DESC
      LIMIT 10`,
      [userId]
    );

    const topPhotos = topPhotosRows as any[];

    // Get views over time (last X days)
    const [viewsOverTimeRows] = await pool.execute(
      `SELECT 
        DATE(pv.viewed_at) as date,
        COUNT(DISTINCT pv.id) as views
      FROM photo_views pv
      JOIN photos p ON pv.photo_id = p.id
      WHERE p.user_id = ? 
        AND pv.viewed_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(pv.viewed_at)
      ORDER BY date ASC`,
      [userId, days]
    );

    const viewsOverTime = viewsOverTimeRows as any[];

    // Get likes over time
    const [likesOverTimeRows] = await pool.execute(
      `SELECT 
        DATE(l.created_at) as date,
        COUNT(*) as likes
      FROM likes l
      JOIN photos p ON l.photo_id = p.id
      WHERE p.user_id = ? 
        AND l.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(l.created_at)
      ORDER BY date ASC`,
      [userId, days]
    );

    const likesOverTime = likesOverTimeRows as any[];

    // Get downloads over time
    const [downloadsOverTimeRows] = await pool.execute(
      `SELECT 
        DATE(d.download_date) as date,
        COUNT(*) as downloads
      FROM downloads d
      JOIN photos p ON d.photo_id = p.id
      WHERE p.user_id = ? 
        AND d.download_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(d.download_date)
      ORDER BY date ASC`,
      [userId, days]
    );

    const downloadsOverTime = downloadsOverTimeRows as any[];

    // Get follower growth
    const [followersOverTimeRows] = await pool.execute(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_followers
      FROM follows 
      WHERE following_id = ? 
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC`,
      [userId, days]
    );

    const followersOverTime = followersOverTimeRows as any[];

    // Get category performance
    const [categoryStatsRows] = await pool.execute(
      `SELECT 
        c.name as category,
        COUNT(p.id) as photoCount,
        COALESCE(SUM(p.views), 0) as totalViews,
        COALESCE(SUM(p.likes), 0) as totalLikes,
        COALESCE(SUM(p.downloads), 0) as totalDownloads,
        COALESCE(AVG(p.views), 0) as avgViews
      FROM photos p
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.user_id = ? AND p.status = 'live'
      GROUP BY c.name
      ORDER BY totalViews DESC`,
      [userId]
    );

    const categoryStats = categoryStatsRows as any[];

    res.json({
      overview: {
        totalPhotos: stats.totalPhotos,
        totalViews: stats.totalViews,
        totalLikes: stats.totalLikes,
        totalDownloads: stats.totalDownloads,
        avgViews: Math.round(stats.avgViews || 0),
        avgLikes: Math.round(stats.avgLikes || 0),
        avgDownloads: Math.round(stats.avgDownloads || 0),
      },
      topPhotos,
      viewsOverTime,
      likesOverTime,
      downloadsOverTime,
      followersOverTime,
      categoryStats,
      period: days,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Send analytics email manually
router.post("/send-email/:userId", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;

    // Only allow users to send their own analytics
    if (userId !== requestingUserId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Get user analytics data (same as above but simplified)
    const [statsRows] = await pool.execute(
      `SELECT 
        COUNT(*) as totalPhotos,
        COALESCE(SUM(views), 0) as totalViews,
        COALESCE(SUM(likes), 0) as totalLikes,
        COALESCE(SUM(downloads), 0) as totalDownloads
      FROM photos 
      WHERE user_id = ? AND status = 'live'`,
      [userId]
    );

    const stats = (statsRows as any[])[0];

    // Get top 3 photos
    const [topPhotosRows] = await pool.execute(
      `SELECT title, views, likes, downloads
      FROM photos 
      WHERE user_id = ? AND status = 'live'
      ORDER BY (views + likes * 2 + downloads * 3) DESC
      LIMIT 3`,
      [userId]
    );

    const topPhotos = (topPhotosRows as any[]).map((photo) => ({
      title: photo.title,
      views: photo.views,
      likes: photo.likes,
      downloads: photo.downloads,
    }));

    // Send analytics email
    const emailSent = await sendAnalyticsEmail(req.user.email, {
      firstName: req.user.first_name,
      username: req.user.username,
      totalPhotos: stats.totalPhotos,
      totalViews: stats.totalViews,
      totalLikes: stats.totalLikes,
      totalDownloads: stats.totalDownloads,
      topPhotos,
      period: "30 days",
    });

    if (emailSent) {
      res.json({ message: "Analytics email sent successfully" });
    } else {
      res.status(500).json({ error: "Failed to send analytics email" });
    }
  } catch (error) {
    console.error("Send analytics email error:", error);
    res.status(500).json({ error: "Failed to send analytics email" });
  }
});

export default router;
