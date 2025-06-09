import express from "express";
import { pool } from "../database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
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

// Get all collections with filters
router.get("/", async (req, res) => {
  try {
    const {
      filter = "all",
      search = "",
      sort = "newest",
      user_id,
      limit = 20,
      offset = 0,
    } = req.query;

    let whereClause = "WHERE 1=1";
    const queryParams: any[] = [];

    // Apply filters
    if (filter === "public") {
      whereClause += " AND c.is_private = 0";
    } else if (filter === "private" && user_id) {
      whereClause += " AND c.is_private = 1 AND c.user_id = ?";
      queryParams.push(user_id);
    } else if (filter === "mine" && user_id) {
      whereClause += " AND c.user_id = ?";
      queryParams.push(user_id);
    }

    // Apply search
    if (search) {
      whereClause += " AND (c.name LIKE ? OR c.description LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Apply sorting
    let orderClause = "ORDER BY c.created_at DESC";
    if (sort === "oldest") {
      orderClause = "ORDER BY c.created_at ASC";
    } else if (sort === "photos") {
      orderClause = "ORDER BY photo_count DESC";
    }

    const query = `
      SELECT 
        c.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        cp.file_path as cover_photo_url,
        cp.title as cover_photo_title,
        COALESCE(pc.photo_count, 0) as photo_count
      FROM collections c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN photos cp ON c.cover_photo_id = cp.id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as photo_count
        FROM collection_photos
        GROUP BY collection_id
      ) pc ON c.id = pc.collection_id
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit as string), parseInt(offset as string));

    const [rows] = await pool.execute(query, queryParams);
    const collections = rows as any[];

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM collections c
      JOIN users u ON c.user_id = u.id
      ${whereClause}
    `;

    const [countRows] = await pool.execute(
      countQuery,
      queryParams.slice(0, -2)
    );
    const total = (countRows as any[])[0].total;

    // Transform data to match frontend expectations
    const transformedCollections = collections.map((collection) => ({
      id: collection.uuid || collection.id.toString(), // Use UUID if available, fallback to ID
      title: collection.name,
      description: collection.description,
      coverPhoto: collection.cover_photo_url
        ? {
            id: collection.cover_photo_id?.toString(),
            url: collection.cover_photo_url,
            title: collection.cover_photo_title,
          }
        : null,
      photosCount: collection.photo_count,
      isPrivate: Boolean(collection.is_private),
      isCollaborative: false, // Will implement later
      creator: {
        id: collection.user_id.toString(),
        username: collection.username,
        firstName: collection.first_name,
        lastName: collection.last_name,
        avatar: collection.avatar,
        verified: Boolean(collection.verified),
        role: collection.role,
      },
      createdAt: collection.created_at,
      updatedAt: collection.updated_at,
    }));

    res.json({
      collections: transformedCollections,
      total,
      hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
    });
  } catch (error) {
    console.error("Get collections error:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
});

// Get single collection by UUID or ID
router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    let whereClause = isUUID ? "WHERE c.uuid = ?" : "WHERE c.id = ?";

    // Get collection details
    const [collectionRows] = await pool.execute(
      `SELECT 
        c.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        COALESCE(pc.photo_count, 0) as photo_count
      FROM collections c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as photo_count
        FROM collection_photos
        GROUP BY collection_id
      ) pc ON c.id = pc.collection_id
      ${whereClause}`,
      [identifier]
    );

    const collections = collectionRows as any[];
    if (collections.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const collection = collections[0];

    // Get photos in collection
    const [photoRows] = await pool.execute(
      `SELECT 
        p.*,
        u.username as photographer_username,
        u.first_name as photographer_first_name,
        u.last_name as photographer_last_name,
        u.avatar as photographer_avatar,
        u.verified as photographer_verified,
        u.role as photographer_role,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT cat.name) as categories
      FROM collection_photos cp
      JOIN photos p ON cp.photo_id = p.id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN photo_tags pt ON p.id = pt.photo_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN photo_categories pc ON p.id = pc.photo_id
      LEFT JOIN categories cat ON pc.category_id = cat.id
      WHERE cp.collection_id = ?
      GROUP BY p.id
      ORDER BY cp.added_at DESC`,
      [collection.id]
    );

    const photos = (photoRows as any[]).map((photo) => ({
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
      color: "#000000", // Default color, could be extracted from image
      license: "free", // Default license
      photographer: {
        id: photo.user_id.toString(),
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
      featured: Boolean(photo.is_featured),
      approved: true,
      createdAt: photo.created_at,
      updatedAt: photo.updated_at,
    }));

    const transformedCollection = {
      id: collection.uuid || collection.id.toString(),
      title: collection.name,
      description: collection.description,
      coverPhoto: photos[0] || null,
      photosCount: collection.photo_count,
      isPrivate: Boolean(collection.is_private),
      isCollaborative: false,
      creator: {
        id: collection.user_id.toString(),
        username: collection.username,
        firstName: collection.first_name,
        lastName: collection.last_name,
        avatar: collection.avatar,
        verified: Boolean(collection.verified),
        role: collection.role,
      },
      photos,
      createdAt: collection.created_at,
      updatedAt: collection.updated_at,
    };

    res.json(transformedCollection);
  } catch (error) {
    console.error("Get collection error:", error);
    res.status(500).json({ error: "Failed to fetch collection" });
  }
});

// Create new collection
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, isPrivate = false, photoIds = [] } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Generate UUID for the collection
    const collectionUuid = uuidv4();

    // Create collection
    const [result] = await pool.execute(
      "INSERT INTO collections (uuid, user_id, name, description, is_private) VALUES (?, ?, ?, ?, ?)",
      [collectionUuid, userId, title, description, isPrivate ? 1 : 0]
    );

    const collectionId = (result as ResultSetHeader).insertId;

    // Add photos to collection if provided
    if (photoIds.length > 0) {
      const photoValues = photoIds.map((photoId: string) => [
        collectionId,
        parseInt(photoId),
      ]);
      await pool.execute(
        `INSERT INTO collection_photos (collection_id, photo_id) VALUES ${photoValues
          .map(() => "(?, ?)")
          .join(", ")}`,
        photoValues.flat()
      );

      // Set first photo as cover photo
      await pool.execute(
        "UPDATE collections SET cover_photo_id = ? WHERE id = ?",
        [photoIds[0], collectionId]
      );
    }

    // Get the created collection
    const [collectionRows] = await pool.execute(
      `SELECT 
        c.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        COALESCE(pc.photo_count, 0) as photo_count
      FROM collections c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as photo_count
        FROM collection_photos
        GROUP BY collection_id
      ) pc ON c.id = pc.collection_id
      WHERE c.id = ?`,
      [collectionId]
    );

    const collection = (collectionRows as any[])[0];

    const transformedCollection = {
      id: collection.uuid,
      title: collection.name,
      description: collection.description,
      coverPhoto: null, // Will be set if photos were added
      photosCount: collection.photo_count,
      isPrivate: Boolean(collection.is_private),
      isCollaborative: false,
      creator: {
        id: collection.user_id.toString(),
        username: collection.username,
        firstName: collection.first_name,
        lastName: collection.last_name,
        avatar: collection.avatar,
        verified: Boolean(collection.verified),
        role: collection.role,
      },
      photos: [],
      createdAt: collection.created_at,
      updatedAt: collection.updated_at,
    };

    res.status(201).json(transformedCollection);
  } catch (error) {
    console.error("Create collection error:", error);
    res.status(500).json({ error: "Failed to create collection" });
  }
});

// Update collection
router.put("/:identifier", requireAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    const { title, description, isPrivate, photoIds } = req.body;
    const userId = req.user.id;

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );
    const whereClause = isUUID ? "WHERE uuid = ?" : "WHERE id = ?";

    // Check if user owns the collection
    const [ownerRows] = await pool.execute(
      `SELECT id, user_id FROM collections ${whereClause}`,
      [identifier]
    );

    const owners = ownerRows as any[];
    if (owners.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    if (owners[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this collection" });
    }

    const collectionId = owners[0].id;

    // Update collection details
    await pool.execute(
      "UPDATE collections SET name = ?, description = ?, is_private = ?, updated_at = NOW() WHERE id = ?",
      [title, description, isPrivate ? 1 : 0, collectionId]
    );

    // Update photos if provided
    if (photoIds !== undefined) {
      // Remove existing photos
      await pool.execute(
        "DELETE FROM collection_photos WHERE collection_id = ?",
        [collectionId]
      );

      // Add new photos
      if (photoIds.length > 0) {
        const photoValues = photoIds.map((photoId: string) => [
          collectionId,
          parseInt(photoId),
        ]);
        await pool.execute(
          `INSERT INTO collection_photos (collection_id, photo_id) VALUES ${photoValues
            .map(() => "(?, ?)")
            .join(", ")}`,
          photoValues.flat()
        );

        // Update cover photo
        await pool.execute(
          "UPDATE collections SET cover_photo_id = ? WHERE id = ?",
          [photoIds[0], collectionId]
        );
      } else {
        // No photos, remove cover photo
        await pool.execute(
          "UPDATE collections SET cover_photo_id = NULL WHERE id = ?",
          [collectionId]
        );
      }
    }

    // Get updated collection
    const [collectionRows] = await pool.execute(
      `SELECT 
        c.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        COALESCE(pc.photo_count, 0) as photo_count
      FROM collections c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as photo_count
        FROM collection_photos
        GROUP BY collection_id
      ) pc ON c.id = pc.collection_id
      WHERE c.id = ?`,
      [collectionId]
    );

    const collection = (collectionRows as any[])[0];

    const transformedCollection = {
      id: collection.uuid || collection.id.toString(),
      title: collection.name,
      description: collection.description,
      coverPhoto: null,
      photosCount: collection.photo_count,
      isPrivate: Boolean(collection.is_private),
      isCollaborative: false,
      creator: {
        id: collection.user_id.toString(),
        username: collection.username,
        firstName: collection.first_name,
        lastName: collection.last_name,
        avatar: collection.avatar,
        verified: Boolean(collection.verified),
        role: collection.role,
      },
      photos: [],
      createdAt: collection.created_at,
      updatedAt: collection.updated_at,
    };

    res.json(transformedCollection);
  } catch (error) {
    console.error("Update collection error:", error);
    res.status(500).json({ error: "Failed to update collection" });
  }
});

// Delete collection
router.delete("/:identifier", requireAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    const userId = req.user.id;

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );
    const whereClause = isUUID ? "WHERE uuid = ?" : "WHERE id = ?";

    // Check if user owns the collection
    const [ownerRows] = await pool.execute(
      `SELECT id, user_id FROM collections ${whereClause}`,
      [identifier]
    );

    const owners = ownerRows as any[];
    if (owners.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    if (owners[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this collection" });
    }

    // Delete collection (cascade will handle collection_photos)
    await pool.execute("DELETE FROM collections WHERE id = ?", [owners[0].id]);

    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error("Delete collection error:", error);
    res.status(500).json({ error: "Failed to delete collection" });
  }
});

// Get user's photos for collection management
router.get("/user/:userId/photos", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { search = "", limit = 50, offset = 0 } = req.query;

    // Check if requesting user can access these photos
    if (req.user.id.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to access these photos" });
    }

    let whereClause = "WHERE p.user_id = ?";
    const queryParams: any[] = [userId];

    if (search) {
      whereClause += " AND (p.title LIKE ? OR p.description LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.execute(
      `SELECT 
        p.id, p.title, p.description, p.file_path, p.thumbnail_path,
        p.width, p.height, p.created_at
      FROM photos p
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit as string), parseInt(offset as string)]
    );

    const photos = (rows as any[]).map((photo) => ({
      id: photo.id.toString(),
      title: photo.title,
      description: photo.description,
      url: photo.file_path,
      thumbnailUrl: photo.thumbnail_path,
      width: photo.width,
      height: photo.height,
      createdAt: photo.created_at,
    }));

    res.json(photos);
  } catch (error) {
    console.error("Get user photos error:", error);
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

// Get collection analytics
router.get("/:identifier/analytics", requireAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    const userId = req.user.id;

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );
    const whereClause = isUUID ? "WHERE uuid = ?" : "WHERE id = ?";

    // Check if user owns the collection
    const [ownerRows] = await pool.execute(
      `SELECT id, user_id FROM collections ${whereClause}`,
      [identifier]
    );

    const owners = ownerRows as any[];
    if (owners.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    if (owners[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to view analytics" });
    }

    const collectionId = owners[0].id;

    // Get collection stats
    const [statsRows] = await pool.execute(
      `SELECT 
        COUNT(cp.photo_id) as total_photos,
        COALESCE(SUM(p.views), 0) as total_views,
        COALESCE(SUM(p.downloads), 0) as total_downloads,
        COALESCE(SUM(p.likes), 0) as total_likes
      FROM collections c
      LEFT JOIN collection_photos cp ON c.id = cp.collection_id
      LEFT JOIN photos p ON cp.photo_id = p.id
      WHERE c.id = ?`,
      [collectionId]
    );

    const stats = (statsRows as any[])[0];

    // Get top performing photos in collection
    const [topPhotosRows] = await pool.execute(
      `SELECT 
        p.id, p.title, p.file_path, p.views, p.downloads, p.likes
      FROM collection_photos cp
      JOIN photos p ON cp.photo_id = p.id
      WHERE cp.collection_id = ?
      ORDER BY (p.views + p.downloads + p.likes) DESC
      LIMIT 5`,
      [collectionId]
    );

    const topPhotos = (topPhotosRows as any[]).map((photo) => ({
      id: photo.id.toString(),
      title: photo.title,
      url: photo.file_path,
      views: photo.views,
      downloads: photo.downloads,
      likes: photo.likes,
      totalEngagement: photo.views + photo.downloads + photo.likes,
    }));

    res.json({
      totalPhotos: stats.total_photos,
      totalViews: stats.total_views,
      totalDownloads: stats.total_downloads,
      totalLikes: stats.total_likes,
      topPhotos,
      averageEngagement:
        stats.total_photos > 0
          ? Math.round(
              (stats.total_views + stats.total_downloads + stats.total_likes) /
                stats.total_photos
            )
          : 0,
    });
  } catch (error) {
    console.error("Get collection analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
