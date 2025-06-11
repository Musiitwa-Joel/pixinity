import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { pool } from "../database";
import { sendPhotoPublishedEmail } from "../email/emailService";
import { createNotification } from "./notifications";
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

// Optional auth middleware - sets user if authenticated but doesn't require it
const optionalAuth = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies["auth-token"];
    if (token) {
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
      if (users.length > 0) {
        req.user = users[0];
      }
    }
    next();
  } catch (error) {
    next(); // Continue without auth
  }
};

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
    }
  },
});

// Ensure upload directories exist
const ensureDirectories = async () => {
  const dirs = [
    "uploads",
    "uploads/photos",
    "uploads/thumbnails",
    "uploads/avatars",
  ];
  for (const dir of dirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
    }
  }
};

// Initialize directories
ensureDirectories();

// Helper function to get or create tag
const getOrCreateTag = async (tagName: string): Promise<number> => {
  const normalizedTag = tagName.toLowerCase().trim();

  // Check if tag exists
  const [existingTags] = await pool.execute(
    "SELECT id FROM tags WHERE name = ?",
    [normalizedTag]
  );

  const tags = existingTags as any[];
  if (tags.length > 0) {
    return tags[0].id;
  }

  // Create new tag
  const [result] = await pool.execute("INSERT INTO tags (name) VALUES (?)", [
    normalizedTag,
  ]);

  return (result as ResultSetHeader).insertId;
};

// Helper function to get category ID
const getCategoryId = async (categoryName: string): Promise<number | null> => {
  const [rows] = await pool.execute(
    "SELECT id FROM categories WHERE name = ?",
    [categoryName]
  );

  const categories = rows as any[];
  return categories.length > 0 ? categories[0].id : null;
};

// ENHANCED: Track photo view with interaction type
const trackPhotoView = async (
  photoId: string,
  userId?: number,
  ipAddress?: string,
  userAgent?: string,
  interaction?: string
) => {
  try {
    console.log(
      `🔍 Tracking ${
        interaction || "view"
      } for photo ${photoId}, user: ${userId}, IP: ${ipAddress}`
    );

    // Only track if we have either a user ID or IP address
    if (!userId && !ipAddress) {
      console.log(
        "❌ No user ID or IP address provided, skipping view tracking"
      );
      return;
    }

    // For authenticated users, use user_id and set ip_address to NULL
    // For anonymous users, use ip_address and set user_id to NULL
    const viewUserId = userId || null;
    const viewIpAddress = userId ? null : ipAddress || null;

    console.log(
      `📝 Tracking ${
        interaction || "view"
      } with userId: ${viewUserId}, ipAddress: ${viewIpAddress}`
    );

    // Try to insert a new view record
    try {
      const [insertResult] = (await pool.execute(
        `INSERT INTO photo_views (photo_id, user_id, ip_address, user_agent) 
         VALUES (?, ?, ?, ?)`,
        [photoId, viewUserId, viewIpAddress, userAgent || null]
      )) as [ResultSetHeader, any];

      console.log(
        `✅ New ${interaction || "view"} recorded - affected rows: ${
          insertResult.affectedRows
        }`
      );
    } catch (insertError: any) {
      // If it's a duplicate key error, still count it as a view for interactions
      if (insertError.code === "ER_DUP_ENTRY") {
        console.log(
          `ℹ️ ${
            interaction || "View"
          } already tracked for this user/IP, but counting interaction`
        );
        // For interactions (not just page views), we still want to increment the count
        if (interaction && interaction !== "page_view") {
          // Don't return early, continue to update the count
        } else {
          return; // For regular page views, don't double count
        }
      } else {
        console.error("❌ Error inserting view:", insertError);
        return; // Don't update count if insert failed for other reasons
      }
    }

    // Always update the photo's view count
    const [updateResult] = (await pool.execute(
      `UPDATE photos SET views = views + 1 WHERE id = ?`,
      [photoId]
    )) as [ResultSetHeader, any];

    console.log(
      `📊 Updated view count - affected rows: ${updateResult.affectedRows}`
    );

    // Get the updated view count for logging
    const [viewCountRows] = await pool.execute(
      "SELECT views FROM photos WHERE id = ?",
      [photoId]
    );
    const currentViews = (viewCountRows as any[])[0]?.views || 0;

    console.log(
      `🎯 ${
        interaction || "View"
      } tracking complete for photo ${photoId}. Current views: ${currentViews}`
    );

    return currentViews;
  } catch (error) {
    console.error("❌ Error in trackPhotoView:", error);
    // Don't fail the request if view tracking fails
    return null;
  }
};

// NEW: Dedicated view tracking endpoint
router.post("/:photoId/view", optionalAuth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const { interaction } = req.body;
    const userId = req.user?.id;

    console.log(
      `🎯 View tracking request for photo ${photoId}, interaction: ${interaction}, user: ${userId}`
    );

    // Check if photo exists and is live (or user owns it)
    const [photoRows] = await pool.execute(
      "SELECT id, status, user_id FROM photos WHERE id = ?",
      [photoId]
    );

    const photos = photoRows as any[];
    if (photos.length === 0) {
      return res.status(404).json({ error: "Photo not found" });
    }

    const photo = photos[0];
    const isOwner = userId && userId === photo.user_id;

    // Only track views for live photos and not by owner (unless it's an interaction)
    if (photo.status !== "live" && !isOwner) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // Don't track owner's own page views, but track their interactions
    if (isOwner && interaction === "page_view") {
      const [viewCountRows] = await pool.execute(
        "SELECT views FROM photos WHERE id = ?",
        [photoId]
      );
      const currentViews = (viewCountRows as any[])[0]?.views || 0;
      return res.json({
        viewsCount: currentViews,
        message: "Owner view not tracked",
      });
    }

    // Track the view
    const newViewCount = await trackPhotoView(
      photoId,
      userId,
      req.ip || req.socket.remoteAddress,
      req.get("User-Agent"),
      interaction
    );

    // Get current view count if tracking failed
    let viewsCount = newViewCount;
    if (viewsCount === null) {
      const [viewCountRows] = await pool.execute(
        "SELECT views FROM photos WHERE id = ?",
        [photoId]
      );
      viewsCount = (viewCountRows as any[])[0]?.views || 0;
    }

    res.json({
      viewsCount,
      message: `${interaction || "View"} tracked successfully`,
      interaction,
    });
  } catch (error) {
    console.error("View tracking error:", error);
    res.status(500).json({ error: "Failed to track view" });
  }
});

// Get platform stats
router.get("/stats", async (req, res) => {
  try {
    // Get total views from all photos
    const [viewsRows] = await pool.execute(
      "SELECT COALESCE(SUM(views), 0) as totalViews FROM photos WHERE status = 'live'"
    );
    const totalViews = (viewsRows as any[])[0].totalViews;

    // Get total downloads from all photos
    const [downloadsRows] = await pool.execute(
      "SELECT COALESCE(SUM(downloads), 0) as totalDownloads FROM photos WHERE status = 'live'"
    );
    const totalDownloads = (downloadsRows as any[])[0].totalDownloads;

    // Get total likes from all photos
    const [likesRows] = await pool.execute(
      "SELECT COALESCE(SUM(likes), 0) as totalLikes FROM photos WHERE status = 'live'"
    );
    const totalLikes = (likesRows as any[])[0].totalLikes;

    // Get count of active photographers (users with at least one live photo)
    const [photographersRows] = await pool.execute(
      "SELECT COUNT(DISTINCT user_id) as activePhotographers FROM photos WHERE status = 'live'"
    );
    const activePhotographers = (photographersRows as any[])[0]
      .activePhotographers;

    res.json({
      totalViews,
      totalDownloads,
      totalLikes,
      activePhotographers,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Upload photos endpoint
router.post(
  "/upload",
  requireAuth,
  upload.array("photos", 10),
  async (req, res) => {
    try {
      const {
        title,
        description,
        tags,
        category,
        license,
        status = "draft",
      } = req.body;
      const files = req.files as Express.Multer.File[];
      const userId = req.user.id;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const uploadedPhotos = [];
      const photoTitles = [];
      const isLive = status === "live";

      for (const file of files) {
        try {
          // Generate unique filename
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const filename = `${timestamp}_${randomString}`;
          const extension =
            path.extname(file.originalname).toLowerCase() || ".jpg";

          const photoPath = `uploads/photos/${filename}${extension}`;
          const thumbnailPath = `uploads/thumbnails/${filename}_thumb${extension}`;

          // Process main image
          const imageBuffer = await sharp(file.buffer)
            .resize(1920, 1920, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({ quality: 85 })
            .toBuffer();

          // Create thumbnail
          const thumbnailBuffer = await sharp(file.buffer)
            .resize(400, 400, {
              fit: "cover",
            })
            .jpeg({ quality: 80 })
            .toBuffer();

          // Get image metadata
          const metadata = await sharp(file.buffer).metadata();
          const width = metadata.width || 0;
          const height = metadata.height || 0;
          const sizeKb = Math.round(imageBuffer.length / 1024);

          // Save files
          await fs.promises.writeFile(photoPath, imageBuffer);
          await fs.promises.writeFile(thumbnailPath, thumbnailBuffer);

          // Insert photo into database with status
          const [photoResult] = await pool.execute(
            `INSERT INTO photos (user_id, title, description, file_path, thumbnail_path, 
           width, height, size_kb, format, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              title,
              description || null,
              `/${photoPath}`,
              `/${thumbnailPath}`,
              width,
              height,
              sizeKb,
              extension.substring(1), // Remove the dot
              status,
              isLive ? new Date() : null,
            ]
          );

          const photoId = (photoResult as ResultSetHeader).insertId;

          // Handle tags
          if (tags) {
            const tagList = tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter(Boolean);
            for (const tagName of tagList) {
              const tagId = await getOrCreateTag(tagName);
              await pool.execute(
                "INSERT IGNORE INTO photo_tags (photo_id, tag_id) VALUES (?, ?)",
                [photoId, tagId]
              );
            }
          }

          // Handle category
          if (category) {
            const categoryId = await getCategoryId(category);
            if (categoryId) {
              await pool.execute(
                "INSERT INTO photo_categories (photo_id, category_id) VALUES (?, ?)",
                [photoId, categoryId]
              );
            }
          }

          uploadedPhotos.push({
            id: photoId,
            title,
            description,
            url: `/${photoPath}`,
            thumbnailUrl: `/${thumbnailPath}`,
            width,
            height,
            sizeKb,
            format: extension.substring(1),
            status,
          });

          photoTitles.push(title);
        } catch (fileError) {
          console.error(
            `Error processing file ${file.originalname}:`,
            fileError
          );
          // Continue with other files
        }
      }

      // Update user's upload count only for live photos
      if (isLive) {
        await pool.execute(
          "UPDATE users SET uploads_count = uploads_count + ? WHERE id = ?",
          [uploadedPhotos.length, userId]
        );

        // Send email notification for live photos
        try {
          await sendPhotoPublishedEmail(req.user.email, {
            firstName: req.user.first_name,
            photoCount: uploadedPhotos.length,
            photoTitles: photoTitles,
            username: req.user.username,
          });
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Don't fail the upload if email fails
        }
      }

      const statusMessage = isLive ? "published" : "saved as draft";
      res.status(201).json({
        message: `Successfully ${statusMessage} ${uploadedPhotos.length} photo(s)`,
        photos: uploadedPhotos,
        status,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload photos" });
    }
  }
);

// Publish draft photos
router.patch("/:photoId/publish", requireAuth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user.id;

    // Check if user owns the photo and it's a draft
    const [photoRows] = await pool.execute(
      "SELECT id, title, status, user_id FROM photos WHERE id = ? AND user_id = ?",
      [photoId, userId]
    );

    const photos = photoRows as any[];
    if (photos.length === 0) {
      return res
        .status(404)
        .json({ error: "Photo not found or not authorized" });
    }

    const photo = photos[0];
    if (photo.status !== "draft") {
      return res.status(400).json({ error: "Photo is already published" });
    }

    // Update photo status to live
    await pool.execute(
      "UPDATE photos SET status = 'live', published_at = NOW() WHERE id = ?",
      [photoId]
    );

    // Update user's upload count
    await pool.execute(
      "UPDATE users SET uploads_count = uploads_count + 1 WHERE id = ?",
      [userId]
    );

    // Send email notification
    try {
      await sendPhotoPublishedEmail(req.user.email, {
        firstName: req.user.first_name,
        photoCount: 1,
        photoTitles: [photo.title],
        username: req.user.username,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }

    res.json({ message: "Photo published successfully" });
  } catch (error) {
    console.error("Publish photo error:", error);
    res.status(500).json({ error: "Failed to publish photo" });
  }
});

// Get user's photos (including drafts for owner)
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      search = "",
      category = "",
      sort = "newest",
      limit = 20,
      offset = 0,
      status = "all",
    } = req.query;

    // Check if requesting user is the owner (for draft access)
    const token = req.cookies["auth-token"];
    let isOwner = false;
    if (token) {
      try {
        const [userRows] = await pool.execute(
          `SELECT u.id FROM user_sessions s 
           JOIN users u ON s.user_id = u.id 
           WHERE s.token = ? AND s.expires_at > NOW()`,
          [token]
        );
        const users = userRows as any[];
        isOwner = users.length > 0 && users[0].id.toString() === userId;
      } catch (error) {
        // Continue without owner privileges
      }
    }

    let whereClause = "WHERE p.user_id = ?";
    const queryParams: any[] = [userId];

    // Filter by status - only show live photos to non-owners
    if (!isOwner) {
      whereClause += " AND p.status = 'live'";
    } else if (status !== "all") {
      whereClause += " AND p.status = ?";
      queryParams.push(status);
    }

    // Add search filter
    if (search) {
      whereClause += " AND (p.title LIKE ? OR p.description LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Add category filter
    if (category) {
      whereClause +=
        " AND EXISTS (SELECT 1 FROM photo_categories pc JOIN categories c ON pc.category_id = c.id WHERE pc.photo_id = p.id AND c.name = ?)";
      queryParams.push(category);
    }

    // Determine sort order
    let orderClause = "ORDER BY p.created_at DESC";
    switch (sort) {
      case "oldest":
        orderClause = "ORDER BY p.created_at ASC";
        break;
      case "popular":
        orderClause = "ORDER BY p.likes DESC, p.views DESC";
        break;
      case "views":
        orderClause = "ORDER BY p.views DESC";
        break;
      case "downloads":
        orderClause = "ORDER BY p.downloads DESC";
        break;
    }

    const query = `
      SELECT 
        p.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT cat.name) as categories
      FROM photos p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN photo_tags pt ON p.id = pt.photo_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories cat ON pc.category_id = cat.id
      ${whereClause}
      GROUP BY p.id
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit as string), parseInt(offset as string));

    const [rows] = await pool.execute(query, queryParams);
    const photos = (rows as any[]).map((photo) => ({
      id: photo.id.toString(),
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
      status: photo.status,
      publishedAt: photo.published_at,
      photographer: {
        id: photo.user_id.toString(),
        username: photo.username,
        firstName: photo.first_name,
        lastName: photo.last_name,
        avatar: photo.avatar,
        verified: Boolean(photo.verified),
        role: photo.role,
      },
      likesCount: photo.likes,
      downloadsCount: photo.downloads,
      viewsCount: photo.views,
      featured: Boolean(photo.is_featured),
      approved: true,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at,
    }));

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM photos p
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories cat ON pc.category_id = cat.id
      ${whereClause}
    `;

    const [countRows] = await pool.execute(
      countQuery,
      queryParams.slice(0, -2)
    );
    const total = (countRows as any[])[0].total;

    res.json({
      photos,
      total,
      hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
      isOwner,
    });
  } catch (error) {
    console.error("Get user photos error:", error);
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

// Get all live photos (for explore/trending pages)
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      sort = "trending",
      limit = 20,
      offset = 0,
    } = req.query;

    let whereClause = "WHERE p.status = 'live'";
    const queryParams: any[] = [];

    // Add search filter
    if (search) {
      whereClause += " AND (p.title LIKE ? OR p.description LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Add category filter
    if (category) {
      whereClause +=
        " AND EXISTS (SELECT 1 FROM photo_categories pc JOIN categories c ON pc.category_id = c.id WHERE pc.photo_id = p.id AND c.name = ?)";
      queryParams.push(category);
    }

    // Determine sort order
    let orderClause =
      "ORDER BY (p.views + p.likes + p.downloads) DESC, p.published_at DESC";
    switch (sort) {
      case "newest":
        orderClause = "ORDER BY p.published_at DESC";
        break;
      case "oldest":
        orderClause = "ORDER BY p.published_at ASC";
        break;
      case "popular":
        orderClause = "ORDER BY p.likes DESC, p.views DESC";
        break;
      case "views":
        orderClause = "ORDER BY p.views DESC";
        break;
      case "downloads":
        orderClause = "ORDER BY p.downloads DESC";
        break;
    }

    const query = `
      SELECT 
        p.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT cat.name) as categories
      FROM photos p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN photo_tags pt ON p.id = pt.photo_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories cat ON pc.category_id = cat.id
      ${whereClause}
      GROUP BY p.id
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit as string), parseInt(offset as string));

    const [rows] = await pool.execute(query, queryParams);
    const photos = (rows as any[]).map((photo) => ({
      id: photo.id.toString(),
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
        id: photo.user_id.toString(),
        username: photo.username,
        firstName: photo.first_name,
        lastName: photo.last_name,
        avatar: photo.avatar,
        verified: Boolean(photo.verified),
        role: photo.role,
      },
      likesCount: photo.likes,
      downloadsCount: photo.downloads,
      viewsCount: photo.views,
      featured: Boolean(photo.is_featured),
      approved: true,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at,
    }));

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM photos p
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories cat ON pc.category_id = cat.id
      ${whereClause}
    `;

    const [countRows] = await pool.execute(
      countQuery,
      queryParams.slice(0, -2)
    );
    const total = (countRows as any[])[0].total;

    res.json({
      photos,
      total,
      hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
    });
  } catch (error) {
    console.error("Get photos error:", error);
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

// Like a photo
router.post("/:photoId/like", requireAuth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user.id;

    // Get photo owner info for notification
    const [photoRows] = await pool.execute(
      "SELECT user_id, title FROM photos WHERE id = ?",
      [photoId]
    );

    const photos = photoRows as any[];
    if (photos.length === 0) {
      return res.status(404).json({ error: "Photo not found" });
    }

    const photoOwnerId = photos[0].user_id;
    const photoTitle = photos[0].title;

    // Check if already liked
    const [existingLikes] = await pool.execute(
      "SELECT id FROM likes WHERE user_id = ? AND photo_id = ?",
      [userId, photoId]
    );

    const likes = existingLikes as any[];
    if (likes.length > 0) {
      // Unlike
      await pool.execute(
        "DELETE FROM likes WHERE user_id = ? AND photo_id = ?",
        [userId, photoId]
      );
      await pool.execute(
        "UPDATE photos SET likes = likes - 1 WHERE id = ? AND likes > 0",
        [photoId]
      );

      // Get updated like count
      const [photoRows] = await pool.execute(
        "SELECT likes FROM photos WHERE id = ?",
        [photoId]
      );
      const likesCount = (photoRows as any[])[0]?.likes || 0;

      res.json({ liked: false, likesCount, message: "Photo unliked" });
    } else {
      // Like
      const [likeResult] = await pool.execute(
        "INSERT INTO likes (user_id, photo_id) VALUES (?, ?)",
        [userId, photoId]
      );

      const likeId = (likeResult as ResultSetHeader).insertId;

      await pool.execute("UPDATE photos SET likes = likes + 1 WHERE id = ?", [
        photoId,
      ]);

      // Create notification for photo owner (if not liking own photo)
      if (photoOwnerId !== userId) {
        await createNotification(
          photoOwnerId,
          "like",
          `${req.user.first_name} ${req.user.last_name} liked your photo "${photoTitle}"`,
          likeId,
          `/photos/${photoId}`
        );
      }

      // Get updated like count
      const [photoRows] = await pool.execute(
        "SELECT likes FROM photos WHERE id = ?",
        [photoId]
      );
      const likesCount = (photoRows as any[])[0]?.likes || 0;

      res.json({ liked: true, likesCount, message: "Photo liked" });
    }
  } catch (error) {
    console.error("Like photo error:", error);
    res.status(500).json({ error: "Failed to like photo" });
  }
});

// Check if user liked a photo
router.get("/:photoId/like-status", optionalAuth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.json({ liked: false });
    }

    const [existingLikes] = await pool.execute(
      "SELECT 1 FROM likes WHERE user_id = ? AND photo_id = ?",
      [userId, photoId]
    );

    const likes = existingLikes as any[];
    res.json({ liked: likes.length > 0 });
  } catch (error) {
    console.error("Check like status error:", error);
    res.status(500).json({ error: "Failed to check like status" });
  }
});

// Save/unsave a photo
router.post("/:photoId/save", requireAuth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user.id;

    // Check if already saved
    const [existingSaves] = await pool.execute(
      "SELECT 1 FROM saved_photos WHERE user_id = ? AND photo_id = ?",
      [userId, photoId]
    );

    const saves = existingSaves as any[];
    if (saves.length > 0) {
      // Unsave
      await pool.execute(
        "DELETE FROM saved_photos WHERE user_id = ? AND photo_id = ?",
        [userId, photoId]
      );

      res.json({ saved: false, message: "Photo removed from saved" });
    } else {
      // Save
      await pool.execute(
        "INSERT INTO saved_photos (user_id, photo_id) VALUES (?, ?)",
        [userId, photoId]
      );

      res.json({ saved: true, message: "Photo saved" });
    }
  } catch (error) {
    console.error("Save photo error:", error);
    res.status(500).json({ error: "Failed to save photo" });
  }
});

// Check if user saved a photo
router.get("/:photoId/save-status", optionalAuth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.json({ saved: false });
    }

    const [existingSaves] = await pool.execute(
      "SELECT 1 FROM saved_photos WHERE user_id = ? AND photo_id = ?",
      [userId, photoId]
    );

    const saves = existingSaves as any[];
    res.json({ saved: saves.length > 0 });
  } catch (error) {
    console.error("Check save status error:", error);
    res.status(500).json({ error: "Failed to check save status" });
  }
});

// Get user's saved photos
router.get("/saved/:userId", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;

    // Only allow users to see their own saved photos
    if (userId !== requestingUserId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to view saved photos" });
    }

    const {
      search = "",
      category = "",
      sort = "newest",
      limit = 20,
      offset = 0,
    } = req.query;

    let whereClause = "WHERE sp.user_id = ? AND p.status = 'live'";
    const queryParams: any[] = [userId];

    // Add search filter
    if (search) {
      whereClause += " AND (p.title LIKE ? OR p.description LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Add category filter
    if (category) {
      whereClause +=
        " AND EXISTS (SELECT 1 FROM photo_categories pc JOIN categories c ON pc.category_id = c.id WHERE pc.photo_id = p.id AND c.name = ?)";
      queryParams.push(category);
    }

    // Determine sort order
    let orderClause = "ORDER BY sp.created_at DESC";
    switch (sort) {
      case "oldest":
        orderClause = "ORDER BY sp.created_at ASC";
        break;
      case "popular":
        orderClause = "ORDER BY p.likes DESC, p.views DESC";
        break;
      case "views":
        orderClause = "ORDER BY p.views DESC";
        break;
      case "downloads":
        orderClause = "ORDER BY p.downloads DESC";
        break;
    }

    const query = `
      SELECT 
        p.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT cat.name) as categories,
        sp.created_at as saved_at
      FROM saved_photos sp
      JOIN photos p ON sp.photo_id = p.id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN photo_tags pt ON p.id = pt.photo_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories cat ON pc.category_id = cat.id
      ${whereClause}
      GROUP BY p.id
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit as string), parseInt(offset as string));

    const [rows] = await pool.execute(query, queryParams);
    const photos = (rows as any[]).map((photo) => ({
      id: photo.id.toString(),
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
        id: photo.user_id.toString(),
        username: photo.username,
        firstName: photo.first_name,
        lastName: photo.last_name,
        avatar: photo.avatar,
        verified: Boolean(photo.verified),
        role: photo.role,
      },
      likesCount: photo.likes,
      downloadsCount: photo.downloads,
      viewsCount: photo.views,
      featured: Boolean(photo.is_featured),
      approved: true,
      savedAt: photo.saved_at,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at,
    }));

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM saved_photos sp
      JOIN photos p ON sp.photo_id = p.id
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories cat ON pc.category_id = cat.id
      ${whereClause}
    `;

    const [countRows] = await pool.execute(
      countQuery,
      queryParams.slice(0, -2)
    );
    const total = (countRows as any[])[0].total;

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

// Follow/unfollow a user
router.post("/users/:userId/follow", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    // Can't follow yourself
    if (userId === followerId.toString()) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    // Get user info for notification
    const [userRows] = await pool.execute(
      "SELECT first_name, last_name FROM users WHERE id = ?",
      [userId]
    );

    const users = userRows as any[];
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const targetUser = users[0];

    // Check if already following
    const [existingFollows] = await pool.execute(
      "SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?",
      [followerId, userId]
    );

    const follows = existingFollows as any[];
    if (follows.length > 0) {
      // Unfollow
      await pool.execute(
        "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
        [followerId, userId]
      );

      // Update follower counts
      await pool.execute(
        "UPDATE users SET followers_count = followers_count - 1 WHERE id = ? AND followers_count > 0",
        [userId]
      );
      await pool.execute(
        "UPDATE users SET following_count = following_count - 1 WHERE id = ? AND following_count > 0",
        [followerId]
      );

      res.json({ following: false, message: "User unfollowed" });
    } else {
      // Follow
      await pool.execute(
        "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
        [followerId, userId]
      );

      // Update follower counts
      await pool.execute(
        "UPDATE users SET followers_count = followers_count + 1 WHERE id = ?",
        [userId]
      );
      await pool.execute(
        "UPDATE users SET following_count = following_count + 1 WHERE id = ?",
        [followerId]
      );

      // Create notification for followed user
      await createNotification(
        parseInt(userId),
        "follow",
        `${req.user.first_name} ${req.user.last_name} started following you`,
        followerId,
        `/@${req.user.username}`
      );

      res.json({ following: true, message: "User followed" });
    }
  } catch (error) {
    console.error("Follow user error:", error);
    res.status(500).json({ error: "Failed to follow user" });
  }
});

// Check if user is following another user
router.get("/users/:userId/follow-status", optionalAuth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const followerId = req.user?.id;

    if (!followerId) {
      return res.json({ following: false });
    }

    const [existingFollows] = await pool.execute(
      "SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?",
      [followerId, photoId]
    );

    const follows = existingFollows as any[];
    res.json({ following: follows.length > 0 });
  } catch (error) {
    console.error("Check follow status error:", error);
    res.status(500).json({ error: "Failed to check follow status" });
  }
});

// Download a photo
router.post("/:photoId/download", optionalAuth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user?.id; // Optional for anonymous downloads

    // Increment download count
    await pool.execute(
      "UPDATE photos SET downloads = downloads + 1 WHERE id = ?",
      [photoId]
    );

    // Track download if user is logged in
    if (userId) {
      await pool.execute(
        "INSERT INTO downloads (user_id, photo_id) VALUES (?, ?)",
        [userId, photoId]
      );
    }

    // Get updated download count
    const [photoRows] = await pool.execute(
      "SELECT downloads FROM photos WHERE id = ?",
      [photoId]
    );
    const downloadsCount = (photoRows as any[])[0]?.downloads || 0;

    res.json({ downloadsCount, message: "Download tracked" });
  } catch (error) {
    console.error("Download photo error:", error);
    res.status(500).json({ error: "Failed to track download" });
  }
});

// Get photo by ID with view tracking
router.get("/:photoId", optionalAuth, async (req, res) => {
  try {
    const { photoId } = req.params;

    const [rows] = await pool.execute(
      `SELECT 
        p.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT cat.name) as categories
      FROM photos p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN photo_tags pt ON p.id = pt.photo_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories cat ON pc.category_id = cat.id
      WHERE p.id = ?
      GROUP BY p.id`,
      [photoId]
    );

    const photos = rows as any[];
    if (photos.length === 0) {
      return res.status(404).json({ error: "Photo not found" });
    }

    const photo = photos[0];

    // Only show live photos to non-owners
    const userId = req.user?.id;
    let isOwner = false;
    if (userId) {
      isOwner = userId === photo.user_id;
    }

    if (photo.status !== "live" && !isOwner) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // Track view (only for live photos and not by owner)
    if (photo.status === "live" && !isOwner) {
      await trackPhotoView(
        photoId,
        userId,
        req.ip || req.socket.remoteAddress,
        req.get("User-Agent"),
        "page_view"
      );
    }

    const transformedPhoto = {
      id: photo.id.toString(),
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
      status: photo.status,
      publishedAt: photo.published_at,
      photographer: {
        id: photo.user_id.toString(),
        username: photo.username,
        firstName: photo.first_name,
        lastName: photo.last_name,
        avatar: photo.avatar,
        verified: Boolean(photo.verified),
        role: photo.role,
      },
      likesCount: photo.likes,
      downloadsCount: photo.downloads,
      viewsCount: photo.views,
      featured: Boolean(photo.is_featured),
      approved: true,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at,
    };

    res.json(transformedPhoto);
  } catch (error) {
    console.error("Get photo error:", error);
    res.status(500).json({ error: "Failed to fetch photo" });
  }
});

// Add comment to photo
router.post("/:photoId/comments", requireAuth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    console.log(
      `💬 Adding comment to photo ${photoId}, parent: ${parentId}, user: ${userId}`
    );

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    if (content.length > 1000) {
      return res
        .status(400)
        .json({ error: "Comment is too long (max 1000 characters)" });
    }

    // Check if photo exists and is live
    const [photoRows] = await pool.execute(
      "SELECT id, status, user_id, title FROM photos WHERE id = ?",
      [photoId]
    );

    const photos = photoRows as any[];
    if (photos.length === 0) {
      return res.status(404).json({ error: "Photo not found" });
    }

    if (photos[0].status !== "live") {
      return res.status(400).json({ error: "Cannot comment on draft photos" });
    }

    const photoOwnerId = photos[0].user_id;
    const photoTitle = photos[0].title;

    // If this is a reply, check if parent comment exists
    if (parentId) {
      console.log(`🔍 Checking parent comment ${parentId}`);
      const [parentRows] = await pool.execute(
        "SELECT id FROM comments WHERE id = ? AND photo_id = ?",
        [parentId, photoId]
      );

      if ((parentRows as any[]).length === 0) {
        console.log(`❌ Parent comment ${parentId} not found`);
        return res.status(404).json({ error: "Parent comment not found" });
      }
      console.log(`✅ Parent comment ${parentId} found`);
    }

    // Insert comment
    console.log(`📝 Inserting comment...`);
    const [result] = await pool.execute(
      "INSERT INTO comments (photo_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)",
      [photoId, userId, parentId || null, content.trim()]
    );

    const commentId = (result as ResultSetHeader).insertId;
    console.log(`✅ Comment inserted with ID: ${commentId}`);

    // Create notification for photo owner (if not commenting on own photo)
    if (photoOwnerId !== userId) {
      const notificationMessage = parentId
        ? `${req.user.first_name} ${req.user.last_name} replied to a comment on your photo "${photoTitle}"`
        : `${req.user.first_name} ${req.user.last_name} commented on your photo "${photoTitle}"`;

      await createNotification(
        photoOwnerId,
        "comment",
        notificationMessage,
        commentId,
        `/photos/${photoId}`
      );
    }

    // Get the created comment with user info
    const [commentRows] = await pool.execute(
      `SELECT 
        c.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?`,
      [commentId]
    );

    const comment = (commentRows as any[])[0];

    const transformedComment = {
      id: comment.id.toString(),
      content: comment.content,
      parentId: comment.parent_id?.toString() || null,
      user: {
        id: comment.user_id.toString(),
        username: comment.username,
        firstName: comment.first_name,
        lastName: comment.last_name,
        avatar: comment.avatar,
        verified: Boolean(comment.verified),
        role: comment.role,
      },
      likesCount: 0,
      repliesCount: 0,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    };

    console.log(`🎉 Comment created successfully:`, transformedComment);
    res.status(201).json(transformedComment);
  } catch (error) {
    console.error("❌ Add comment error:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Get comments for a photo
router.get("/:photoId/comments", async (req, res) => {
  try {
    const { photoId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Get top-level comments with user info and reply counts
    const [rows] = await pool.execute(
      `SELECT 
        c.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        COALESCE(cl.likes_count, 0) as likes_count,
        COALESCE(cr.replies_count, 0) as replies_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT comment_id, COUNT(*) as likes_count
        FROM comment_likes
        GROUP BY comment_id
      ) cl ON c.id = cl.comment_id
      LEFT JOIN (
        SELECT parent_id, COUNT(*) as replies_count
        FROM comments
        WHERE parent_id IS NOT NULL
        GROUP BY parent_id
      ) cr ON c.id = cr.parent_id
      WHERE c.photo_id = ? AND c.parent_id IS NULL
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?`,
      [photoId, parseInt(limit as string), parseInt(offset as string)]
    );

    const comments = (rows as any[]).map((comment) => ({
      id: comment.id.toString(),
      content: comment.content,
      parentId: null,
      user: {
        id: comment.user_id.toString(),
        username: comment.username,
        firstName: comment.first_name,
        lastName: comment.last_name,
        avatar: comment.avatar,
        verified: Boolean(comment.verified),
        role: comment.role,
      },
      likesCount: comment.likes_count,
      repliesCount: comment.replies_count,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    }));

    // Get total count
    const [countRows] = await pool.execute(
      "SELECT COUNT(*) as total FROM comments WHERE photo_id = ? AND parent_id IS NULL",
      [photoId]
    );
    const total = (countRows as any[])[0].total;

    res.json({
      comments,
      total,
      hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Get replies for a comment
router.get("/comments/:commentId/replies", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const [rows] = await pool.execute(
      `SELECT 
        c.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        COALESCE(cl.likes_count, 0) as likes_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT comment_id, COUNT(*) as likes_count
        FROM comment_likes
        GROUP BY comment_id
      ) cl ON c.id = cl.comment_id
      WHERE c.parent_id = ?
      ORDER BY c.created_at ASC
      LIMIT ? OFFSET ?`,
      [commentId, parseInt(limit as string), parseInt(offset as string)]
    );

    const replies = (rows as any[]).map((reply) => ({
      id: reply.id.toString(),
      content: reply.content,
      parentId: reply.parent_id.toString(),
      user: {
        id: reply.user_id.toString(),
        username: reply.username,
        firstName: reply.first_name,
        lastName: reply.last_name,
        avatar: reply.avatar,
        verified: Boolean(reply.verified),
        role: reply.role,
      },
      likesCount: reply.likes_count,
      repliesCount: 0, // Replies don't have sub-replies
      createdAt: reply.created_at,
      updatedAt: reply.updated_at,
    }));

    // Get total count
    const [countRows] = await pool.execute(
      "SELECT COUNT(*) as total FROM comments WHERE parent_id = ?",
      [commentId]
    );
    const total = (countRows as any[])[0].total;

    res.json({
      replies,
      total,
      hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
    });
  } catch (error) {
    console.error("Get replies error:", error);
    res.status(500).json({ error: "Failed to fetch replies" });
  }
});

// Like a comment
router.post("/comments/:commentId/like", requireAuth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // Get comment info for notification
    const [commentRows] = await pool.execute(
      `SELECT c.id, c.user_id, c.photo_id, c.content, p.title as photo_title
       FROM comments c
       JOIN photos p ON c.photo_id = p.id
       WHERE c.id = ?`,
      [commentId]
    );

    const comments = commentRows as any[];
    if (comments.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = comments[0];
    const commentOwnerId = comment.user_id;
    const photoTitle = comment.photo_title;
    const commentPreview =
      comment.content.length > 30
        ? comment.content.substring(0, 30) + "..."
        : comment.content;

    // Check if already liked
    const [existingLikes] = await pool.execute(
      "SELECT 1 FROM comment_likes WHERE user_id = ? AND comment_id = ?",
      [userId, commentId]
    );

    const likes = existingLikes as any[];
    if (likes.length > 0) {
      // Unlike
      await pool.execute(
        "DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?",
        [userId, commentId]
      );

      // Get updated like count
      const [countRows] = await pool.execute(
        "SELECT COUNT(*) as likes_count FROM comment_likes WHERE comment_id = ?",
        [commentId]
      );
      const likesCount = (countRows as any[])[0].likes_count;

      res.json({ liked: false, likesCount, message: "Comment unliked" });
    } else {
      // Like
      await pool.execute(
        "INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)",
        [userId, commentId]
      );

      // Create notification for comment owner (if not liking own comment)
      if (commentOwnerId !== userId) {
        await createNotification(
          commentOwnerId,
          "comment_like",
          `${req.user.first_name} ${req.user.last_name} liked your comment "${commentPreview}" on "${photoTitle}"`,
          parseInt(commentId),
          `/photos/${comment.photo_id}`
        );
      }

      // Get updated like count
      const [countRows] = await pool.execute(
        "SELECT COUNT(*) as likes_count FROM comment_likes WHERE comment_id = ?",
        [commentId]
      );
      const likesCount = (countRows as any[])[0].likes_count;

      res.json({ liked: true, likesCount, message: "Comment liked" });
    }
  } catch (error) {
    console.error("Like comment error:", error);
    res.status(500).json({ error: "Failed to like comment" });
  }
});

// Delete photo
router.delete("/:photoId", requireAuth, async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user.id;

    // Check if user owns the photo
    const [photoRows] = await pool.execute(
      "SELECT file_path, thumbnail_path, user_id, status FROM photos WHERE id = ?",
      [photoId]
    );

    const photos = photoRows as any[];
    if (photos.length === 0) {
      return res.status(404).json({ error: "Photo not found" });
    }

    if (photos[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this photo" });
    }

    const photo = photos[0];

    // Delete files from filesystem
    try {
      await fs.promises.unlink(photo.file_path.substring(1)); // Remove leading slash
      await fs.promises.unlink(photo.thumbnail_path.substring(1)); // Remove leading slash
    } catch (fileError) {
      console.error("Error deleting files:", fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database (cascading will handle related records)
    await pool.execute("DELETE FROM photos WHERE id = ?", [photoId]);

    // Update user's upload count only if it was a live photo
    if (photo.status === "live") {
      await pool.execute(
        "UPDATE users SET uploads_count = uploads_count - 1 WHERE id = ? AND uploads_count > 0",
        [userId]
      );
    }

    res.json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Delete photo error:", error);
    res.status(500).json({ error: "Failed to delete photo" });
  }
});

export default router;
