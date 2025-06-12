import express from "express";
import { pool } from "../database";
import { createNotification } from "./notifications";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

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

// Configure multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "avatars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for avatars
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed") as any);
    }
  },
});

// Helper function to update user counts
const updateUserCounts = async (userId: string) => {
  try {
    // Update followers count
    const [followersResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM follows WHERE following_id = ?",
      [userId]
    );
    const followersCount = (followersResult as any[])[0].count;

    // Update following count
    const [followingResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM follows WHERE follower_id = ?",
      [userId]
    );
    const followingCount = (followingResult as any[])[0].count;

    // Update uploads count
    const [uploadsResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM photos WHERE user_id = ? AND status = 'live'",
      [userId]
    );
    const uploadsCount = (uploadsResult as any[])[0].count;

    // Update total views, likes, and downloads
    const [statsResult] = await pool.execute(
      `SELECT 
        COALESCE(SUM(views), 0) as total_views,
        COALESCE(SUM(likes), 0) as total_likes,
        COALESCE(SUM(downloads), 0) as total_downloads
       FROM photos WHERE user_id = ? AND status = 'live'`,
      [userId]
    );
    const stats = (statsResult as any[])[0];

    // Update user record
    await pool.execute(
      `UPDATE users SET 
        followers_count = ?, 
        following_count = ?, 
        uploads_count = ?,
        total_views = ?,
        total_downloads = ?
       WHERE id = ?`,
      [
        followersCount,
        followingCount,
        uploadsCount,
        stats.total_views,
        stats.total_downloads,
        userId,
      ]
    );

    console.log(
      `✅ Updated counts for user ${userId}: followers=${followersCount}, following=${followingCount}, uploads=${uploadsCount}`
    );
  } catch (error) {
    console.error("Error updating user counts:", error);
  }
};

// Get user by username
router.get("/username/:username", async (req, res) => {
  try {
    const { username } = req.params;

    console.log(`🔍 Looking up user by username: ${username}`);

    const [rows] = await pool.execute(
      `SELECT id, email, username, first_name, last_name, avatar, bio, website, location,
              instagram, twitter, behance, dribbble, role, verified, followers_count,
              following_count, uploads_count, total_views, total_downloads, created_at, updated_at
       FROM users WHERE username = ?`,
      [username]
    );

    const users = rows as any[];
    if (users.length === 0) {
      console.log(`❌ User not found: ${username}`);
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    console.log(`✅ User found: ${user.email}`);

    // Update user counts before returning
    await updateUserCounts(user.id);

    // Fetch updated user data
    const [updatedRows] = await pool.execute(
      `SELECT id, email, username, first_name, last_name, avatar, bio, website, location,
              instagram, twitter, behance, dribbble, role, verified, followers_count,
              following_count, uploads_count, total_views, total_downloads, created_at, updated_at
       FROM users WHERE id = ?`,
      [user.id]
    );

    const updatedUser = (updatedRows as any[])[0];

    // Transform to match frontend expectations
    const transformedUser = {
      id: updatedUser.id.toString(),
      email: updatedUser.email,
      username: updatedUser.username,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      website: updatedUser.website,
      location: updatedUser.location,
      socialLinks: {
        instagram: updatedUser.instagram,
        twitter: updatedUser.twitter,
        behance: updatedUser.behance,
        dribbble: updatedUser.dribbble,
      },
      role: updatedUser.role,
      verified: Boolean(updatedUser.verified),
      followersCount: updatedUser.followers_count || 0,
      followingCount: updatedUser.following_count || 0,
      uploadsCount: updatedUser.uploads_count || 0,
      totalViews: updatedUser.total_views || 0,
      totalDownloads: updatedUser.total_downloads || 0,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };

    res.json(transformedUser);
  } catch (error) {
    console.error("Get user by username error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.execute(
      `SELECT id, email, username, first_name, last_name, avatar, bio, website, location,
              instagram, twitter, behance, dribbble, role, verified, followers_count,
              following_count, uploads_count, total_views, total_downloads, created_at, updated_at
       FROM users WHERE id = ?`,
      [userId]
    );

    const users = rows as any[];
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];

    // Update user counts before returning
    await updateUserCounts(user.id);

    // Fetch updated user data
    const [updatedRows] = await pool.execute(
      `SELECT id, email, username, first_name, last_name, avatar, bio, website, location,
              instagram, twitter, behance, dribbble, role, verified, followers_count,
              following_count, uploads_count, total_views, total_downloads, created_at, updated_at
       FROM users WHERE id = ?`,
      [user.id]
    );

    const updatedUser = (updatedRows as any[])[0];

    // Transform to match frontend expectations
    const transformedUser = {
      id: updatedUser.id.toString(),
      email: updatedUser.email,
      username: updatedUser.username,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      website: updatedUser.website,
      location: updatedUser.location,
      socialLinks: {
        instagram: updatedUser.instagram,
        twitter: updatedUser.twitter,
        behance: updatedUser.behance,
        dribbble: updatedUser.dribbble,
      },
      role: updatedUser.role,
      verified: Boolean(updatedUser.verified),
      followersCount: updatedUser.followers_count || 0,
      followingCount: updatedUser.following_count || 0,
      uploadsCount: updatedUser.uploads_count || 0,
      totalViews: updatedUser.total_views || 0,
      totalDownloads: updatedUser.total_downloads || 0,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };

    res.json(transformedUser);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Get user's liked photos
router.get("/:userId/liked-photos", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    console.log(`🔍 Fetching liked photos for user ${userId}`);

    const [rows] = await pool.execute(
      `SELECT 
        p.id, p.title, p.description, p.file_path, p.thumbnail_path,
        p.width, p.height, p.views, p.likes, p.downloads, p.created_at, p.updated_at,
        u.id as photographer_id, u.username as photographer_username,
        u.first_name as photographer_first_name, u.last_name as photographer_last_name,
        u.avatar as photographer_avatar, u.verified as photographer_verified, u.role as photographer_role,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT cat.name) as categories,
        l.created_at as liked_at
      FROM likes l
      JOIN photos p ON l.photo_id = p.id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN photo_tags pt ON p.id = pt.photo_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories cat ON pc.category_id = cat.id
      WHERE l.user_id = ? AND p.status = 'live'
      GROUP BY p.id, l.created_at
      ORDER BY l.created_at DESC
      LIMIT ? OFFSET ?`,
      [userId, parseInt(limit as string), parseInt(offset as string)]
    );

    const photos = (rows as any[]).map((photo) => ({
      id: photo.id.toString(),
      uuid: photo.id.toString(), // Use ID as UUID for compatibility
      title: photo.title,
      description: photo.description,
      url: photo.file_path,
      thumbnailUrl: photo.thumbnail_path,
      width: photo.width,
      height: photo.height,
      orientation:
        photo.width > photo.height
          ? "landscape"
          : photo.width < photo.height
          ? "portrait"
          : "square",
      category: photo.categories?.split(",")[0] || "Other",
      tags: photo.tags ? photo.tags.split(",") : [],
      color: "#000000",
      license: "free",
      photographer: {
        id: photo.photographer_id.toString(),
        username: photo.photographer_username,
        firstName: photo.photographer_first_name,
        lastName: photo.photographer_last_name,
        avatar: photo.photographer_avatar,
        verified: Boolean(photo.photographer_verified),
        role: photo.photographer_role,
      },
      likesCount: photo.likes,
      downloadsCount: photo.downloads,
      viewsCount: photo.views,
      featured: false,
      approved: true,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at,
      likedAt: photo.liked_at,
    }));

    // Get total count
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total
       FROM likes l
       JOIN photos p ON l.photo_id = p.id
       WHERE l.user_id = ? AND p.status = 'live'`,
      [userId]
    );
    const total = (countRows as any[])[0].total;

    console.log(`✅ Found ${photos.length} liked photos for user ${userId}`);

    res.json({
      photos,
      total,
      hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
    });
  } catch (error) {
    console.error("Get liked photos error:", error);
    res.status(500).json({ error: "Failed to fetch liked photos" });
  }
});

// Get user's saved photos
router.get("/:userId/saved-photos", async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      limit = 20,
      offset = 0,
      search = "",
      category = "",
      sort = "newest",
    } = req.query;

    console.log(`🔍 Fetching saved photos for user ${userId}`);

    // Build the query based on sort option
    let orderClause = "ORDER BY s.created_at DESC"; // default: newest
    if (sort === "oldest") {
      orderClause = "ORDER BY s.created_at ASC";
    } else if (sort === "popular") {
      orderClause = "ORDER BY p.likes DESC, p.views DESC";
    }

    // Build the search and category filters
    let whereClause = "WHERE s.user_id = ? AND p.status = 'live'";
    const queryParams: any[] = [userId];

    if (search) {
      whereClause += " AND (p.title LIKE ? OR p.description LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      whereClause += " AND cat.name = ?";
      queryParams.push(category);
    }

    // Add limit and offset
    queryParams.push(parseInt(limit as string), parseInt(offset as string));

    const [rows] = await pool.execute(
      `SELECT 
        p.id, p.title, p.description, p.file_path, p.thumbnail_path,
        p.width, p.height, p.views, p.likes, p.downloads, p.created_at, p.updated_at,
        u.id as photographer_id, u.username as photographer_username,
        u.first_name as photographer_first_name, u.last_name as photographer_last_name,
        u.avatar as photographer_avatar, u.verified as photographer_verified, u.role as photographer_role,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT cat.name) as categories,
        s.created_at as saved_at
      FROM saved_photos s
      JOIN photos p ON s.photo_id = p.id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN photo_tags pt ON p.id = pt.photo_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories cat ON pc.category_id = cat.id
      ${whereClause}
      GROUP BY p.id, s.created_at
      ${orderClause}
      LIMIT ? OFFSET ?`,
      queryParams
    );

    const photos = (rows as any[]).map((photo) => ({
      id: photo.id.toString(),
      uuid: photo.id.toString(), // Use ID as UUID for compatibility
      title: photo.title,
      description: photo.description,
      url: photo.file_path,
      thumbnailUrl: photo.thumbnail_path,
      width: photo.width,
      height: photo.height,
      orientation:
        photo.width > photo.height
          ? "landscape"
          : photo.width < photo.height
          ? "portrait"
          : "square",
      category: photo.categories?.split(",")[0] || "Other",
      tags: photo.tags ? photo.tags.split(",") : [],
      color: "#000000",
      license: "free",
      photographer: {
        id: photo.photographer_id.toString(),
        username: photo.photographer_username,
        firstName: photo.photographer_first_name,
        lastName: photo.photographer_last_name,
        avatar: photo.photographer_avatar,
        verified: Boolean(photo.photographer_verified),
        role: photo.photographer_role,
      },
      likesCount: photo.likes,
      downloadsCount: photo.downloads,
      viewsCount: photo.views,
      featured: false,
      approved: true,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at,
      savedAt: photo.saved_at,
    }));

    // Get total count with the same filters
    const countParams = queryParams.slice(0, -2); // Remove limit and offset
    const [countRows] = await pool.execute(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM saved_photos s
       JOIN photos p ON s.photo_id = p.id
       LEFT JOIN photo_categories pc ON p.id = pc.photo_id
       LEFT JOIN categories cat ON pc.category_id = cat.id
       ${whereClause}`,
      countParams
    );
    const total = (countRows as any[])[0].total;

    console.log(`✅ Found ${photos.length} saved photos for user ${userId}`);

    res.json({
      photos,
      total,
      hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
    });
  } catch (error) {
    console.error("Get saved photos error:", error);
    res.status(500).json({ error: "Failed to fetch saved photos" });
  }
});

// Get saved photos stats
router.get("/:userId/saved-stats", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;

    // Only allow users to see their own stats
    if (userId !== requestingUserId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to view these stats" });
    }

    // Get unique categories count
    const [categoriesResult] = await pool.execute(
      `SELECT COUNT(DISTINCT cat.name) as uniqueCategories
       FROM saved_photos s
       JOIN photos p ON s.photo_id = p.id
       LEFT JOIN photo_categories pc ON p.id = pc.photo_id
       LEFT JOIN categories cat ON pc.category_id = cat.id
       WHERE s.user_id = ?`,
      [userId]
    );

    // Get unique photographers count
    const [photographersResult] = await pool.execute(
      `SELECT COUNT(DISTINCT p.user_id) as uniquePhotographers
       FROM saved_photos s
       JOIN photos p ON s.photo_id = p.id
       WHERE s.user_id = ?`,
      [userId]
    );

    res.json({
      uniqueCategories: (categoriesResult as any[])[0].uniqueCategories || 0,
      uniquePhotographers:
        (photographersResult as any[])[0].uniquePhotographers || 0,
    });
  } catch (error) {
    console.error("Get saved stats error:", error);
    res.status(500).json({ error: "Failed to fetch saved stats" });
  }
});

// Get user's tab counts (for badges)
router.get("/:userId/tab-counts", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`🔍 Fetching tab counts for user ${userId}`);

    // Get photos count
    const [photosRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM photos WHERE user_id = ? AND status = 'live'",
      [userId]
    );
    const photosCount = (photosRows as any[])[0].count;

    // Get collections count
    const [collectionsRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM collections WHERE user_id = ?",
      [userId]
    );
    const collectionsCount = (collectionsRows as any[])[0].count;

    // Get liked photos count
    const [likedRows] = await pool.execute(
      `SELECT COUNT(*) as count
       FROM likes l
       JOIN photos p ON l.photo_id = p.id
       WHERE l.user_id = ? AND p.status = 'live'`,
      [userId]
    );
    const likedCount = (likedRows as any[])[0].count;

    // Get saved photos count
    const [savedRows] = await pool.execute(
      `SELECT COUNT(*) as count
       FROM saved_photos s
       JOIN photos p ON s.photo_id = p.id
       WHERE s.user_id = ? AND p.status = 'live'`,
      [userId]
    );
    const savedCount = (savedRows as any[])[0].count;

    // Get following photos count (photos from users this user follows)
    const [followingPhotosRows] = await pool.execute(
      `SELECT COUNT(DISTINCT p.id) as count
       FROM follows f
       JOIN photos p ON f.following_id = p.user_id
       WHERE f.follower_id = ? AND p.status = 'live'`,
      [userId]
    );
    const followingPhotosCount = (followingPhotosRows as any[])[0].count;

    console.log(`📊 Tab counts for user ${userId}:`, {
      photos: photosCount,
      collections: collectionsCount,
      liked: likedCount,
      saved: savedCount,
      following: followingPhotosCount,
    });

    res.json({
      photos: photosCount,
      collections: collectionsCount,
      liked: likedCount,
      saved: savedCount,
      following: followingPhotosCount,
    });
  } catch (error) {
    console.error("Get tab counts error:", error);
    res.status(500).json({ error: "Failed to fetch tab counts" });
  }
});

// Follow/unfollow user
router.post("/:userId/follow", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    if (userId === followerId.toString()) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    console.log(`👥 Follow request: ${followerId} -> ${userId}`);

    // Check if already following
    const [existingRows] = await pool.execute(
      "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
      [followerId, userId]
    );

    const existing = existingRows as any[];
    let following = false;
    let message = "";

    if (existing.length > 0) {
      // Unfollow
      await pool.execute(
        "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
        [followerId, userId]
      );

      following = false;
      message = "Unfollowed successfully";
      console.log(`👥 Unfollowed: ${followerId} -> ${userId}`);
    } else {
      // Follow
      await pool.execute(
        "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
        [followerId, userId]
      );

      // Create notification
      await createNotification(
        parseInt(userId),
        "follow",
        `${req.user.first_name} ${req.user.last_name} started following you`,
        parseInt(followerId),
        `/@${req.user.username}`
      );

      following = true;
      message = "Following successfully";
      console.log(`👥 Followed: ${followerId} -> ${userId}`);
    }

    // Update counts for both users
    await updateUserCounts(userId);
    await updateUserCounts(followerId.toString());

    res.json({ following, message });
  } catch (error) {
    console.error("Follow/unfollow error:", error);
    res.status(500).json({ error: "Failed to follow/unfollow user" });
  }
});

// Check follow status
router.get("/:userId/follow-status", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    const [rows] = await pool.execute(
      "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
      [followerId, userId]
    );

    const following = (rows as any[]).length > 0;
    res.json({ following });
  } catch (error) {
    console.error("Check follow status error:", error);
    res.status(500).json({ error: "Failed to check follow status" });
  }
});

// Update user profile
router.put("/:userId", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;

    // Only allow users to update their own profile
    if (userId !== requestingUserId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this profile" });
    }

    const {
      firstName,
      lastName,
      bio,
      website,
      location,
      instagram,
      twitter,
      behance,
      dribbble,
    } = req.body;

    await pool.execute(
      `UPDATE users SET 
        first_name = ?, 
        last_name = ?, 
        bio = ?, 
        website = ?, 
        location = ?, 
        instagram = ?, 
        twitter = ?, 
        behance = ?, 
        dribbble = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        firstName,
        lastName,
        bio,
        website,
        location,
        instagram,
        twitter,
        behance,
        dribbble,
        userId,
      ]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Upload avatar
router.post(
  "/:userId/avatar",
  requireAuth,
  avatarUpload.single("avatar"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const requestingUserId = req.user.id;

      console.log(`🖼️ Avatar upload request for user ${userId}`);

      // Only allow users to update their own avatar
      if (userId !== requestingUserId.toString()) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this avatar" });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log(
        `📁 Received file: ${file.originalname}, size: ${file.size} bytes`
      );

      // Process avatar with Sharp
      const avatarPath = file.path;
      const processedPath = avatarPath.replace(
        path.extname(avatarPath),
        "_processed" + path.extname(avatarPath)
      );

      await sharp(avatarPath)
        .resize(200, 200, { fit: "cover" })
        .jpeg({ quality: 90 })
        .toFile(processedPath);

      console.log(`✅ Processed avatar saved to: ${processedPath}`);

      // Get file URL (relative to uploads directory)
      const avatarUrl = `/uploads/avatars/${path.basename(processedPath)}`;

      // Update user avatar in database
      await pool.execute(
        "UPDATE users SET avatar = ?, updated_at = NOW() WHERE id = ?",
        [avatarUrl, userId]
      );

      console.log(`✅ Avatar URL updated in database: ${avatarUrl}`);

      // Delete original file
      try {
        fs.unlinkSync(avatarPath);
      } catch (fileError) {
        console.error("Error deleting original avatar file:", fileError);
        // Continue even if file deletion fails
      }

      res.json({
        message: "Avatar updated successfully",
        avatarUrl,
      });
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to upload avatar" });
    }
  }
);

// Get user's followers
router.get("/:userId/followers", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const [rows] = await pool.execute(
      `SELECT u.id, u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role
       FROM follows f
       JOIN users u ON f.follower_id = u.id
       WHERE f.following_id = ?
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit as string), parseInt(offset as string)]
    );

    const followers = (rows as any[]).map((user) => ({
      id: user.id.toString(),
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      avatar: user.avatar,
      verified: Boolean(user.verified),
      role: user.role,
    }));

    // Get total count
    const [countRows] = await pool.execute(
      "SELECT COUNT(*) as total FROM follows WHERE following_id = ?",
      [userId]
    );
    const total = (countRows as any[])[0].total;

    res.json({
      followers,
      total,
      hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
    });
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({ error: "Failed to fetch followers" });
  }
});

// Get user's following
router.get("/:userId/following", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const [rows] = await pool.execute(
      `SELECT u.id, u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role
       FROM follows f
       JOIN users u ON f.following_id = u.id
       WHERE f.follower_id = ?
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit as string), parseInt(offset as string)]
    );

    const following = (rows as any[]).map((user) => ({
      id: user.id.toString(),
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      avatar: user.avatar,
      verified: Boolean(user.verified),
      role: user.role,
    }));

    // Get total count
    const [countRows] = await pool.execute(
      "SELECT COUNT(*) as total FROM follows WHERE follower_id = ?",
      [userId]
    );
    const total = (countRows as any[])[0].total;

    res.json({
      following,
      total,
      hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
    });
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({ error: "Failed to fetch following" });
  }
});

// Get photos from users that the current user follows
router.get("/:userId/following-photos", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;

    // Only allow users to see their own following feed
    if (userId !== requestingUserId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this feed" });
    }

    const { limit = 20, offset = 0, sort = "newest" } = req.query;

    console.log(`📸 Fetching following photos for user ${userId}`);

    // Get photos from users that this user follows
    let orderClause = "ORDER BY p.created_at DESC";
    if (sort === "popular") {
      orderClause = "ORDER BY p.likes DESC, p.views DESC";
    } else if (sort === "oldest") {
      orderClause = "ORDER BY p.created_at ASC";
    }

    const [rows] = await pool.execute(
      `SELECT 
        p.id, p.title, p.description, p.file_path, p.thumbnail_path,
        p.width, p.height, p.views, p.likes, p.downloads, p.created_at, p.updated_at,
        u.id as photographer_id, u.username as photographer_username,
        u.first_name as photographer_first_name, u.last_name as photographer_last_name,
        u.avatar as photographer_avatar, u.verified as photographer_verified, u.role as photographer_role,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT cat.name) as categories
      FROM follows f
      JOIN photos p ON f.following_id = p.user_id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN photo_tags pt ON p.id = pt.photo_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories cat ON pc.category_id = cat.id
      WHERE f.follower_id = ? AND p.status = 'live'
      GROUP BY p.id
      ${orderClause}
      LIMIT ? OFFSET ?`,
      [userId, parseInt(limit as string), parseInt(offset as string)]
    );

    const photos = (rows as any[]).map((photo) => ({
      id: photo.id.toString(),
      uuid: photo.id.toString(), // Use ID as UUID for compatibility
      title: photo.title,
      description: photo.description,
      url: photo.file_path,
      thumbnailUrl: photo.thumbnail_path,
      width: photo.width,
      height: photo.height,
      orientation:
        photo.width > photo.height
          ? "landscape"
          : photo.width < photo.height
          ? "portrait"
          : "square",
      category: photo.categories?.split(",")[0] || "Other",
      tags: photo.tags ? photo.tags.split(",") : [],
      color: "#000000",
      license: "free",
      photographer: {
        id: photo.photographer_id.toString(),
        username: photo.photographer_username,
        firstName: photo.photographer_first_name,
        lastName: photo.photographer_last_name,
        avatar: photo.photographer_avatar,
        verified: Boolean(photo.photographer_verified),
        role: photo.photographer_role,
      },
      likesCount: photo.likes,
      downloadsCount: photo.downloads,
      viewsCount: photo.views,
      featured: false,
      approved: true,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at,
    }));

    // Get total count
    const [countRows] = await pool.execute(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM follows f
       JOIN photos p ON f.following_id = p.user_id
       WHERE f.follower_id = ? AND p.status = 'live'`,
      [userId]
    );
    const total = (countRows as any[])[0].total;

    console.log(
      `✅ Found ${photos.length} following photos for user ${userId}`
    );

    res.json({
      photos,
      total,
      hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
    });
  } catch (error) {
    console.error("Get following photos error:", error);
    res.status(500).json({ error: "Failed to fetch following photos" });
  }
});

export default router;
