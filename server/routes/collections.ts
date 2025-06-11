import express from "express";
import { pool } from "../database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import { sendCollaborationInviteEmail } from "../email/emailService";
import { createNotification } from "./notifications";

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
    } else if (sort === "popular") {
      orderClause = "ORDER BY engagement_score DESC";
    }

    const query = `
      SELECT 
        c.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        cp.file_path as cover_photo_url,
        cp.title as cover_photo_title,
        COALESCE(pc.photo_count, 0) as photo_count,
        COALESCE(cl.likes_count, 0) as likes_count,
        COALESCE(cc.comments_count, 0) as comments_count,
        COALESCE(cv.views_count, 0) as views_count,
        (COALESCE(cv.views_count, 0) + COALESCE(cl.likes_count, 0) * 3 + COALESCE(cc.comments_count, 0) * 5) as engagement_score
      FROM collections c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN photos cp ON c.cover_photo_id = cp.id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as photo_count
        FROM collection_photos
        GROUP BY collection_id
      ) pc ON c.id = pc.collection_id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as likes_count
        FROM collection_likes
        GROUP BY collection_id
      ) cl ON c.id = cl.collection_id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as comments_count
        FROM collection_comments
        GROUP BY collection_id
      ) cc ON c.id = cc.collection_id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as views_count
        FROM collection_views
        GROUP BY collection_id
      ) cv ON c.id = cv.collection_id
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
      id: collection.uuid || collection.id.toString(),
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
      viewsCount: collection.views_count,
      likesCount: collection.likes_count,
      commentsCount: collection.comments_count,
      isPrivate: Boolean(collection.is_private),
      isCollaborative: Boolean(collection.is_collaborative),
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

    // Get collection ID
    let collectionId;
    if (isUUID) {
      const [rows] = await pool.execute(
        "SELECT id FROM collections WHERE uuid = ?",
        [identifier]
      );

      const collections = rows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;
    } else {
      collectionId = identifier;
    }

    // Get collection details with engagement metrics
    const [collectionRows] = await pool.execute(
      `SELECT 
        c.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        COALESCE(pc.photo_count, 0) as photo_count,
        COALESCE(cl.likes_count, 0) as likes_count,
        COALESCE(cc.comments_count, 0) as comments_count,
        COALESCE(cv.views_count, 0) as views_count
      FROM collections c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as photo_count
        FROM collection_photos
        GROUP BY collection_id
      ) pc ON c.id = pc.collection_id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as likes_count
        FROM collection_likes
        GROUP BY collection_id
      ) cl ON c.id = cl.collection_id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as comments_count
        FROM collection_comments
        GROUP BY collection_id
      ) cc ON c.id = cc.collection_id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as views_count
        FROM collection_views
        GROUP BY collection_id
      ) cv ON c.id = cv.collection_id
      WHERE c.id = ?`,
      [collectionId]
    );

    const collections = collectionRows as any[];
    if (collections.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const collection = collections[0];

    // Track view if request includes a tracking parameter
    if (req.query.track === "true") {
      try {
        const userId = req.cookies["auth-token"]
          ? await getUserIdFromToken(req.cookies["auth-token"])
          : null;
        const ipAddress = req.ip || req.socket.remoteAddress || "Unknown";

        await pool.execute(
          "INSERT INTO collection_views (collection_id, user_id, ip_address, interaction) VALUES (?, ?, ?, 'view')",
          [collectionId, userId, ipAddress]
        );
      } catch (viewError) {
        console.error("Error tracking collection view:", viewError);
        // Continue even if view tracking fails
      }
    }

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
      [collectionId]
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
      color: "#000000",
      license: "free",
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

    // Get collaborators
    const [collaboratorRows] = await pool.execute(
      `SELECT 
        cc.id, cc.user_id, cc.role, cc.status, cc.invited_at, cc.responded_at,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role as user_role,
        u.email
      FROM collection_collaborators cc
      LEFT JOIN users u ON cc.user_id = u.id
      WHERE cc.collection_id = ?`,
      [collectionId]
    );

    const collaborators = (collaboratorRows as any[]).map((collab) => ({
      id: collab.id.toString(),
      userId: collab.user_id ? collab.user_id.toString() : null,
      username: collab.username || null,
      firstName: collab.first_name || null,
      lastName: collab.last_name || null,
      avatar: collab.avatar || null,
      verified: Boolean(collab.verified),
      role: collab.user_role || null,
      collaboratorRole: collab.role,
      status: collab.status,
      email: collab.email || null,
      invitedAt: collab.invited_at,
      respondedAt: collab.responded_at || null,
    }));
    const transformedCollection = {
      id: collection.uuid || collection.id.toString(),
      title: collection.name,
      description: collection.description,
      coverPhoto: photos[0] || null,
      photosCount: collection.photo_count,
      viewsCount: collection.views_count,
      likesCount: collection.likes_count,
      commentsCount: collection.comments_count,
      isPrivate: Boolean(collection.is_private),
      isCollaborative: Boolean(collection.is_collaborative),
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
      collaborators: collection.is_collaborative ? collaborators : [],
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
    const {
      title,
      description,
      isPrivate = false,
      photoIds = [],
      isCollaborative = false,
      collaboratorEmails = [],
    } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Generate UUID for the collection
    const collectionUuid = uuidv4();

    // Create collection
    const [result] = await pool.execute(
      "INSERT INTO collections (uuid, user_id, name, description, is_private, is_collaborative) VALUES (?, ?, ?, ?, ?, ?)",
      [
        collectionUuid,
        userId,
        title,
        description,
        isPrivate ? 1 : 0,
        isCollaborative ? 1 : 0,
      ]
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

    // Process collaborator invitations if this is a collaborative collection
    if (isCollaborative && !isPrivate && collaboratorEmails.length > 0) {
      for (const email of collaboratorEmails) {
        // Generate a 6-digit OTP code
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiration date (24 hours from now)
        const otpExpiresAt = new Date();
        otpExpiresAt.setDate(otpExpiresAt.getDate() + 1);

        // Check if user exists
        const [userRows] = await pool.execute(
          "SELECT id FROM users WHERE email = ?",
          [email]
        );

        const users = userRows as any[];
        let collaboratorUserId = null;

        if (users.length > 0) {
          // User exists
          collaboratorUserId = users[0].id;
        }

        // Insert into collection_collaborators
        await pool.execute(
          `INSERT INTO collection_collaborators 
           (collection_id, user_id, role, status, invited_by, otp_code, otp_expires_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            collectionId,
            collaboratorUserId,
            "editor",
            "pending",
            userId,
            otpCode,
            otpExpiresAt,
          ]
        );

        // Send invitation email
        try {
          await sendCollaborationInviteEmail(email, {
            collectionTitle: title,
            collectionId: collectionUuid,
            otpCode,
            inviterName: `${req.user.first_name} ${req.user.last_name}`,
            inviterUsername: req.user.username,
            expiresAt: otpExpiresAt.toLocaleString(),
            isNewUser: !collaboratorUserId,
          });
          console.log(`Collaboration invitation email sent to ${email}`);
        } catch (emailError) {
          console.error(
            `Failed to send invitation email to ${email}:`,
            emailError
          );
          // Continue with other invitations even if one fails
        }
      }
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
      coverPhoto: null,
      photosCount: collection.photo_count,
      viewsCount: 0,
      likesCount: 0,
      commentsCount: 0,
      isPrivate: Boolean(collection.is_private),
      isCollaborative: Boolean(collection.is_collaborative),
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
    const {
      title,
      description,
      isPrivate,
      isCollaborative,
      photoIds,
      collaboratorEmails,
    } = req.body;
    const userId = req.user.id;

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    // Get collection ID
    let collectionId;
    if (isUUID) {
      const [collectionRows] = await pool.execute(
        "SELECT id FROM collections WHERE uuid = ?",
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;
    } else {
      collectionId = identifier;
    }

    // Check if user owns the collection
    const [ownerRows] = await pool.execute(
      `SELECT id, user_id FROM collections WHERE id = ?`,
      [collectionId]
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

    // Update collection details
    await pool.execute(
      "UPDATE collections SET name = ?, description = ?, is_private = ?, is_collaborative = ?, updated_at = NOW() WHERE id = ?",
      [
        title,
        description,
        isPrivate ? 1 : 0,
        isCollaborative ? 1 : 0,
        collectionId,
      ]
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

    // Process collaborator invitations if this is a collaborative collection
    if (
      isCollaborative &&
      collaboratorEmails &&
      collaboratorEmails.length > 0
    ) {
      for (const email of collaboratorEmails) {
        // Check if this email is already a collaborator
        const [existingCollabRows] = await pool.execute(
          `SELECT cc.id 
           FROM collection_collaborators cc
           JOIN users u ON cc.user_id = u.id
           WHERE cc.collection_id = ? AND u.email = ?`,
          [collectionId, email]
        );

        if ((existingCollabRows as any[]).length > 0) {
          // Already a collaborator, skip
          continue;
        }

        // Generate a 6-digit OTP code
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiration date (24 hours from now)
        const otpExpiresAt = new Date();
        otpExpiresAt.setDate(otpExpiresAt.getDate() + 1);

        // Check if user exists
        const [userRows] = await pool.execute(
          "SELECT id FROM users WHERE email = ?",
          [email]
        );

        const users = userRows as any[];
        let collaboratorUserId = null;

        if (users.length > 0) {
          // User exists
          collaboratorUserId = users[0].id;
        }

        // Insert into collection_collaborators
        await pool.execute(
          `INSERT INTO collection_collaborators 
           (collection_id, user_id, role, status, invited_by, otp_code, otp_expires_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            collectionId,
            collaboratorUserId,
            "editor",
            "pending",
            userId,
            otpCode,
            otpExpiresAt,
          ]
        );

        // Send invitation email
        try {
          // Get collection UUID for the email link
          const [uuidRows] = await pool.execute(
            "SELECT uuid FROM collections WHERE id = ?",
            [collectionId]
          );

          const uuids = uuidRows as any[];
          const collectionUuid = uuids[0].uuid;

          await sendCollaborationInviteEmail(email, {
            collectionTitle: title,
            collectionId: collectionUuid,
            otpCode,
            inviterName: `${req.user.first_name} ${req.user.last_name}`,
            inviterUsername: req.user.username,
            expiresAt: otpExpiresAt.toLocaleString(),
            isNewUser: !collaboratorUserId,
          });
          console.log(`Collaboration invitation email sent to ${email}`);
        } catch (emailError) {
          console.error(
            `Failed to send invitation email to ${email}:`,
            emailError
          );
          // Continue with other invitations even if one fails
        }
      }
    }

    // Get updated collection
    const [collectionRows] = await pool.execute(
      `SELECT 
        c.*,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        COALESCE(pc.photo_count, 0) as photo_count,
        COALESCE(cl.likes_count, 0) as likes_count,
        COALESCE(cc.comments_count, 0) as comments_count,
        COALESCE(cv.views_count, 0) as views_count
      FROM collections c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as photo_count
        FROM collection_photos
        GROUP BY collection_id
      ) pc ON c.id = pc.collection_id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as likes_count
        FROM collection_likes
        GROUP BY collection_id
      ) cl ON c.id = cl.collection_id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as comments_count
        FROM collection_comments
        GROUP BY collection_id
      ) cc ON c.id = cc.collection_id
      LEFT JOIN (
        SELECT collection_id, COUNT(*) as views_count
        FROM collection_views
        GROUP BY collection_id
      ) cv ON c.id = cv.collection_id
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
      viewsCount: collection.views_count,
      likesCount: collection.likes_count,
      commentsCount: collection.comments_count,
      isPrivate: Boolean(collection.is_private),
      isCollaborative: Boolean(collection.is_collaborative),
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

    // Get collection ID
    let collectionId;
    if (isUUID) {
      const [collectionRows] = await pool.execute(
        "SELECT id, user_id FROM collections WHERE uuid = ?",
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;

      if (collections[0].user_id !== userId) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this collection" });
      }
    } else {
      // Check if user owns the collection
      const [ownerRows] = await pool.execute(
        `SELECT id, user_id FROM collections WHERE id = ?`,
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

      collectionId = owners[0].id;
    }

    // Delete collection (cascade will handle collection_photos)
    await pool.execute("DELETE FROM collections WHERE id = ?", [collectionId]);

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

    // Get collection ID
    let collectionId;
    if (isUUID) {
      const [collectionRows] = await pool.execute(
        "SELECT id, user_id FROM collections WHERE uuid = ?",
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;

      if (collections[0].user_id !== userId) {
        return res
          .status(403)
          .json({ error: "Not authorized to view analytics" });
      }
    } else {
      // Check if user owns the collection
      const [ownerRows] = await pool.execute(
        `SELECT id, user_id FROM collections WHERE id = ?`,
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

      collectionId = owners[0].id;
    }

    // Get collection stats
    const [statsRows] = await pool.execute(
      `SELECT 
        COUNT(cp.photo_id) as total_photos,
        COALESCE(SUM(p.views), 0) as total_views,
        COALESCE(SUM(p.downloads), 0) as total_downloads,
        COALESCE(SUM(p.likes), 0) as total_likes,
        COALESCE((SELECT COUNT(*) FROM collection_views WHERE collection_id = ?), 0) as collection_views,
        COALESCE((SELECT COUNT(*) FROM collection_likes WHERE collection_id = ?), 0) as collection_likes,
        COALESCE((SELECT COUNT(*) FROM collection_comments WHERE collection_id = ?), 0) as collection_comments
      FROM collections c
      LEFT JOIN collection_photos cp ON c.id = cp.collection_id
      LEFT JOIN photos p ON cp.photo_id = p.id
      WHERE c.id = ?`,
      [collectionId, collectionId, collectionId, collectionId]
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

    // Get views over time (last 30 days)
    const [viewsOverTimeRows] = await pool.execute(
      `SELECT 
        DATE(viewed_at) as date,
        COUNT(*) as views
      FROM collection_views
      WHERE collection_id = ? 
        AND viewed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(viewed_at)
      ORDER BY date ASC`,
      [collectionId]
    );

    const viewsOverTime = (viewsOverTimeRows as any[]).map((row) => ({
      date: row.date,
      views: row.views,
    }));

    res.json({
      totalPhotos: stats.total_photos,
      totalViews: stats.total_views,
      totalDownloads: stats.total_downloads,
      totalLikes: stats.total_likes,
      collectionViews: stats.collection_views,
      collectionLikes: stats.collection_likes,
      collectionComments: stats.collection_comments,
      topPhotos,
      viewsOverTime,
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

// Join collection as collaborator with OTP
router.post("/:identifier/join", requireAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    const { otpCode } = req.body;
    const userId = req.user.id;

    if (!otpCode) {
      return res.status(400).json({ error: "OTP code is required" });
    }

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    // Get collection ID
    let collectionId;
    let collectionData;

    if (isUUID) {
      const [collectionRows] = await pool.execute(
        `SELECT 
          id, name, user_id, is_collaborative, is_private
        FROM collections 
        WHERE uuid = ?`,
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;
      collectionData = collections[0];
    } else {
      const [collectionRows] = await pool.execute(
        `SELECT 
          id, name, user_id, is_collaborative, is_private
        FROM collections 
        WHERE id = ?`,
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;
      collectionData = collections[0];
    }

    // Check if collection is collaborative
    if (!collectionData.is_collaborative) {
      return res
        .status(403)
        .json({ error: "This collection does not allow collaborators" });
    }

    // Check if collection is private
    if (collectionData.is_private && collectionData.user_id !== userId) {
      return res.status(403).json({ error: "This collection is private" });
    }

    // Verify OTP code
    const [otpRows] = await pool.execute(
      `SELECT 
        id, user_id, status, otp_expires_at
      FROM collection_collaborators
      WHERE collection_id = ? AND otp_code = ? AND status = 'pending'`,
      [collectionId, otpCode]
    );

    const otpResults = otpRows as any[];
    if (otpResults.length === 0) {
      return res.status(400).json({ error: "Invalid OTP code" });
    }

    const otpData = otpResults[0];

    // Check if OTP is expired
    if (new Date(otpData.otp_expires_at) < new Date()) {
      return res.status(400).json({ error: "OTP code has expired" });
    }

    // If the invitation was for a specific user (email), check if it matches
    if (otpData.user_id && otpData.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "This invitation is for another user" });
    }

    // Update the collaborator record
    await pool.execute(
      `UPDATE collection_collaborators
       SET user_id = ?, status = 'accepted', responded_at = NOW()
       WHERE id = ?`,
      [userId, otpData.id]
    );

    // Notify collection owner
    const [ownerRows] = await pool.execute(
      "SELECT user_id, name FROM collections WHERE id = ?",
      [collectionId]
    );

    const owners = ownerRows as any[];
    if (owners.length > 0) {
      const ownerId = owners[0].user_id;
      const collectionName = owners[0].name;

      // Only notify if the owner is not the one joining
      if (ownerId !== userId) {
        await createNotification(
          ownerId,
          "collaboration_invite",
          `${req.user.first_name} ${req.user.last_name} joined your collection "${collectionName}" as a collaborator`,
          userId,
          `/collections/${identifier}`
        );
      }
    }

    res.json({
      message: "You have successfully joined the collection as a collaborator",
      collectionId: isUUID ? identifier : collectionId,
    });
  } catch (error) {
    console.error("Join collection error:", error);
    res.status(500).json({ error: "Failed to join collection" });
  }
});

// Get collection collaborators
router.get("/:identifier/collaborators", requireAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    const userId = req.user.id;

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    // Get collection ID
    let collectionId;

    if (isUUID) {
      const [collectionRows] = await pool.execute(
        "SELECT id, user_id, is_collaborative FROM collections WHERE uuid = ?",
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;

      // Check if user is the owner or a collaborator
      if (collections[0].user_id !== userId) {
        const [collaboratorRows] = await pool.execute(
          `SELECT id FROM collection_collaborators
           WHERE collection_id = ? AND user_id = ? AND status = 'accepted'`,
          [collectionId, userId]
        );

        if ((collaboratorRows as any[]).length === 0) {
          return res
            .status(403)
            .json({ error: "Not authorized to view collaborators" });
        }
      }
    } else {
      // Get collection details
      const [collectionRows] = await pool.execute(
        `SELECT id, user_id, is_collaborative FROM collections WHERE id = ?`,
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;

      // Check if user is the owner or a collaborator
      if (collections[0].user_id !== userId) {
        const [collaboratorRows] = await pool.execute(
          `SELECT id FROM collection_collaborators
           WHERE collection_id = ? AND user_id = ? AND status = 'accepted'`,
          [collectionId, userId]
        );

        if ((collaboratorRows as any[]).length === 0) {
          return res
            .status(403)
            .json({ error: "Not authorized to view collaborators" });
        }
      }
    }

    // Get collaborators
    const [collaboratorRows] = await pool.execute(
      `SELECT 
        cc.id, cc.user_id, cc.role, cc.status, cc.invited_at, cc.responded_at,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role as user_role,
        u.email
      FROM collection_collaborators cc
      LEFT JOIN users u ON cc.user_id = u.id
      WHERE cc.collection_id = ?
      ORDER BY cc.status, cc.invited_at DESC`,
      [collectionId]
    );

    const collaborators = (collaboratorRows as any[]).map((collab) => ({
      id: collab.id.toString(),
      userId: collab.user_id ? collab.user_id.toString() : null,
      username: collab.username || null,
      firstName: collab.first_name || null,
      lastName: collab.last_name || null,
      avatar: collab.avatar || null,
      verified: Boolean(collab.verified),
      role: collab.user_role || null,
      collaboratorRole: collab.role,
      status: collab.status,
      email: collab.email,
      invitedAt: collab.invited_at,
      respondedAt: collab.responded_at || null,
    }));

    res.json(collaborators);
  } catch (error) {
    console.error("Get collaborators error:", error);
    res.status(500).json({ error: "Failed to fetch collaborators" });
  }
});

// Remove collaborator
router.delete(
  "/:identifier/collaborators/:collaboratorId",
  requireAuth,
  async (req, res) => {
    try {
      const { identifier, collaboratorId } = req.params;
      const userId = req.user.id;

      // Check if identifier is UUID format or numeric ID
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          identifier
        );

      // Get collection ID
      let collectionId;

      if (isUUID) {
        const [collectionRows] = await pool.execute(
          "SELECT id, user_id FROM collections WHERE uuid = ?",
          [identifier]
        );

        const collections = collectionRows as any[];
        if (collections.length === 0) {
          return res.status(404).json({ error: "Collection not found" });
        }

        collectionId = collections[0].id;

        // Check if user is the owner
        if (collections[0].user_id !== userId) {
          return res.status(403).json({
            error: "Only the collection owner can remove collaborators",
          });
        }
      } else {
        // Get collection details
        const [collectionRows] = await pool.execute(
          `SELECT id, user_id FROM collections WHERE id = ?`,
          [identifier]
        );

        const collections = collectionRows as any[];
        if (collections.length === 0) {
          return res.status(404).json({ error: "Collection not found" });
        }

        collectionId = collections[0].id;

        // Check if user is the owner
        if (collections[0].user_id !== userId) {
          return res.status(403).json({
            error: "Only the collection owner can remove collaborators",
          });
        }
      }

      // Remove collaborator
      await pool.execute(
        `DELETE FROM collection_collaborators
       WHERE id = ? AND collection_id = ?`,
        [collaboratorId, collectionId]
      );

      res.json({ message: "Collaborator removed successfully" });
    } catch (error) {
      console.error("Remove collaborator error:", error);
      res.status(500).json({ error: "Failed to remove collaborator" });
    }
  }
);

// Resend invitation
router.post(
  "/:identifier/collaborators/:collaboratorId/resend",
  requireAuth,
  async (req, res) => {
    try {
      const { identifier, collaboratorId } = req.params;
      const userId = req.user.id;

      // Check if identifier is UUID format or numeric ID
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          identifier
        );

      // Get collection ID
      let collectionId;
      let collectionUuid;
      let collectionName;

      if (isUUID) {
        const [collectionRows] = await pool.execute(
          "SELECT id, uuid, name, user_id FROM collections WHERE uuid = ?",
          [identifier]
        );

        const collections = collectionRows as any[];
        if (collections.length === 0) {
          return res.status(404).json({ error: "Collection not found" });
        }

        collectionId = collections[0].id;
        collectionUuid = collections[0].uuid;
        collectionName = collections[0].name;

        // Check if user is the owner
        if (collections[0].user_id !== userId) {
          return res.status(403).json({
            error: "Only the collection owner can resend invitations",
          });
        }
      } else {
        // Get collection details
        const [collectionRows] = await pool.execute(
          `SELECT id, uuid, name, user_id FROM collections WHERE id = ?`,
          [identifier]
        );

        const collections = collectionRows as any[];
        if (collections.length === 0) {
          return res.status(404).json({ error: "Collection not found" });
        }

        collectionId = collections[0].id;
        collectionUuid = collections[0].uuid;
        collectionName = collections[0].name;

        // Check if user is the owner
        if (collections[0].user_id !== userId) {
          return res.status(403).json({
            error: "Only the collection owner can resend invitations",
          });
        }
      }

      // Get collaborator details
      const [collaboratorRows] = await pool.execute(
        `SELECT 
        cc.id, cc.user_id, cc.otp_code, cc.status,
        u.email
      FROM collection_collaborators cc
      LEFT JOIN users u ON cc.user_id = u.id
      WHERE cc.id = ? AND cc.collection_id = ?`,
        [collaboratorId, collectionId]
      );

      const collaborators = collaboratorRows as any[];
      if (collaborators.length === 0) {
        return res.status(404).json({ error: "Collaborator not found" });
      }

      const collaborator = collaborators[0];

      // Check if invitation is still pending
      if (collaborator.status !== "pending") {
        return res.status(400).json({
          error: "This invitation has already been accepted or declined",
        });
      }

      // Generate a new OTP code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Set new expiration date (24 hours from now)
      const otpExpiresAt = new Date();
      otpExpiresAt.setDate(otpExpiresAt.getDate() + 1);

      // Update the OTP code and expiration
      await pool.execute(
        `UPDATE collection_collaborators
       SET otp_code = ?, otp_expires_at = ?
       WHERE id = ?`,
        [otpCode, otpExpiresAt, collaboratorId]
      );

      // Get user details for email
      const [userRows] = await pool.execute(
        `SELECT first_name, last_name, username FROM users WHERE id = ?`,
        [userId]
      );

      const users = userRows as any[];
      if (users.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = users[0];

      // Send invitation email
      try {
        const email = collaborator.email;
        await sendCollaborationInviteEmail(email, {
          collectionTitle: collectionName,
          collectionId: collectionUuid,
          otpCode,
          inviterName: `${user.first_name} ${user.last_name}`,
          inviterUsername: user.username,
          expiresAt: otpExpiresAt.toLocaleString(),
          isNewUser: !collaborator.user_id,
        });
        console.log(`Collaboration invitation email resent to ${email}`);
      } catch (emailError) {
        console.error(`Failed to resend invitation email:`, emailError);
        // Continue even if email fails
      }

      res.json({ message: "Invitation resent successfully" });
    } catch (error) {
      console.error("Resend invitation error:", error);
      res.status(500).json({ error: "Failed to resend invitation" });
    }
  }
);

// Like a collection
router.post("/:identifier/like", requireAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    const userId = req.user.id;

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    // Get collection ID
    let collectionId;
    let collectionOwnerId;
    let collectionName;

    if (isUUID) {
      const [collectionRows] = await pool.execute(
        "SELECT id, user_id, name FROM collections WHERE uuid = ?",
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;
      collectionOwnerId = collections[0].user_id;
      collectionName = collections[0].name;
    } else {
      const [collectionRows] = await pool.execute(
        "SELECT id, user_id, name FROM collections WHERE id = ?",
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;
      collectionOwnerId = collections[0].user_id;
      collectionName = collections[0].name;
    }

    // Check if user already liked this collection
    const [likeRows] = await pool.execute(
      "SELECT id FROM collection_likes WHERE collection_id = ? AND user_id = ?",
      [collectionId, userId]
    );

    const likes = likeRows as any[];
    let liked = false;
    let message = "";

    if (likes.length > 0) {
      // Unlike
      await pool.execute(
        "DELETE FROM collection_likes WHERE collection_id = ? AND user_id = ?",
        [collectionId, userId]
      );

      liked = false;
      message = "Collection unliked successfully";
    } else {
      // Like
      await pool.execute(
        "INSERT INTO collection_likes (collection_id, user_id) VALUES (?, ?)",
        [collectionId, userId]
      );

      liked = true;
      message = "Collection liked successfully";

      // Notify collection owner if it's not the same user
      if (collectionOwnerId !== userId) {
        await createNotification(
          collectionOwnerId,
          "collection_like",
          `${req.user.first_name} ${req.user.last_name} liked your collection "${collectionName}"`,
          userId,
          `/collections/${identifier}`
        );
      }
    }

    // Get updated likes count
    const [countRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM collection_likes WHERE collection_id = ?",
      [collectionId]
    );

    const likesCount = (countRows as any[])[0].count;

    res.json({
      liked,
      likesCount,
      message,
    });
  } catch (error) {
    console.error("Like collection error:", error);
    res.status(500).json({ error: "Failed to like/unlike collection" });
  }
});

// Check if user liked a collection
router.get("/:identifier/like-status", requireAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    const userId = req.user.id;

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    // Get collection ID
    let collectionId;

    if (isUUID) {
      const [collectionRows] = await pool.execute(
        "SELECT id FROM collections WHERE uuid = ?",
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;
    } else {
      collectionId = identifier;
    }

    // Check if user liked this collection
    const [likeRows] = await pool.execute(
      "SELECT id FROM collection_likes WHERE collection_id = ? AND user_id = ?",
      [collectionId, userId]
    );

    const liked = (likeRows as any[]).length > 0;

    // Get total likes count
    const [countRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM collection_likes WHERE collection_id = ?",
      [collectionId]
    );

    const likesCount = (countRows as any[])[0].count;

    res.json({
      liked,
      likesCount,
    });
  } catch (error) {
    console.error("Check like status error:", error);
    res.status(500).json({ error: "Failed to check like status" });
  }
});

// Add comment to a collection
router.post("/:identifier/comments", requireAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Comment content is required" });
    }

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    // Get collection ID
    let collectionId;
    let collectionOwnerId;
    let collectionName;

    if (isUUID) {
      const [collectionRows] = await pool.execute(
        "SELECT id, user_id, name FROM collections WHERE uuid = ?",
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;
      collectionOwnerId = collections[0].user_id;
      collectionName = collections[0].name;
    } else {
      const [collectionRows] = await pool.execute(
        "SELECT id, user_id, name FROM collections WHERE id = ?",
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;
      collectionOwnerId = collections[0].user_id;
      collectionName = collections[0].name;
    }

    // If parentId is provided, check if it exists
    if (parentId) {
      const [parentRows] = await pool.execute(
        "SELECT id FROM collection_comments WHERE id = ? AND collection_id = ?",
        [parentId, collectionId]
      );

      if ((parentRows as any[]).length === 0) {
        return res.status(404).json({ error: "Parent comment not found" });
      }
    }

    // Add comment
    const [result] = await pool.execute(
      "INSERT INTO collection_comments (collection_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)",
      [collectionId, userId, parentId || null, content.trim()]
    );

    const commentId = (result as ResultSetHeader).insertId;

    // Get the created comment with user details
    const [commentRows] = await pool.execute(
      `SELECT 
        cc.id, cc.collection_id, cc.user_id, cc.parent_id, cc.content, cc.created_at, cc.updated_at,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        (SELECT COUNT(*) FROM collection_comment_likes WHERE comment_id = cc.id) as likes_count,
        (SELECT COUNT(*) FROM collection_comments WHERE parent_id = cc.id) as replies_count
      FROM collection_comments cc
      JOIN users u ON cc.user_id = u.id
      WHERE cc.id = ?`,
      [commentId]
    );

    const comment = (commentRows as any[])[0];

    // Notify collection owner if it's not the same user
    if (collectionOwnerId !== userId) {
      await createNotification(
        collectionOwnerId,
        "collection_comment",
        `${req.user.first_name} ${req.user.last_name} commented on your collection "${collectionName}"`,
        userId,
        `/collections/${identifier}`
      );
    }

    // If this is a reply, also notify the parent comment author
    if (parentId) {
      const [parentAuthorRows] = await pool.execute(
        "SELECT user_id FROM collection_comments WHERE id = ?",
        [parentId]
      );

      const parentAuthor = (parentAuthorRows as any[])[0];
      if (
        parentAuthor &&
        parentAuthor.user_id !== userId &&
        parentAuthor.user_id !== collectionOwnerId
      ) {
        await createNotification(
          parentAuthor.user_id,
          "collection_comment",
          `${req.user.first_name} ${req.user.last_name} replied to your comment on collection "${collectionName}"`,
          userId,
          `/collections/${identifier}`
        );
      }
    }

    res.status(201).json({
      id: comment.id.toString(),
      content: comment.content,
      parentId: comment.parent_id ? comment.parent_id.toString() : null,
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
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Get collection comments
router.get("/:identifier/comments", async (req, res) => {
  try {
    const { identifier } = req.params;
    const { limit = 20, offset = 0, parentId } = req.query;

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    // Get collection ID
    let collectionId;

    if (isUUID) {
      const [collectionRows] = await pool.execute(
        "SELECT id FROM collections WHERE uuid = ?",
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;
    } else {
      collectionId = identifier;
    }

    // Build query based on whether we want top-level comments or replies
    let whereClause = "WHERE cc.collection_id = ?";
    const queryParams: any[] = [collectionId];

    if (parentId) {
      whereClause += " AND cc.parent_id = ?";
      queryParams.push(parentId);
    } else {
      whereClause += " AND cc.parent_id IS NULL";
    }

    // Get comments
    const [commentRows] = await pool.execute(
      `SELECT 
        cc.id, cc.collection_id, cc.user_id, cc.parent_id, cc.content, cc.created_at, cc.updated_at,
        u.username, u.first_name, u.last_name, u.avatar, u.verified, u.role,
        (SELECT COUNT(*) FROM collection_comment_likes WHERE comment_id = cc.id) as likes_count,
        (SELECT COUNT(*) FROM collection_comments WHERE parent_id = cc.id) as replies_count
      FROM collection_comments cc
      JOIN users u ON cc.user_id = u.id
      ${whereClause}
      ORDER BY cc.created_at DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit as string), parseInt(offset as string)]
    );

    const comments = (commentRows as any[]).map((comment) => ({
      id: comment.id.toString(),
      content: comment.content,
      parentId: comment.parent_id ? comment.parent_id.toString() : null,
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
      `SELECT COUNT(*) as total
       FROM collection_comments cc
       ${whereClause}`,
      queryParams
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

// Like a comment
router.post("/comments/:commentId/like", requireAuth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // Check if comment exists
    const [commentRows] = await pool.execute(
      `SELECT cc.id, cc.collection_id, cc.user_id, c.name as collection_name, c.uuid as collection_uuid
       FROM collection_comments cc
       JOIN collections c ON cc.collection_id = c.id
       WHERE cc.id = ?`,
      [commentId]
    );

    const comments = commentRows as any[];
    if (comments.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = comments[0];

    // Check if user already liked this comment
    const [likeRows] = await pool.execute(
      "SELECT id FROM collection_comment_likes WHERE comment_id = ? AND user_id = ?",
      [commentId, userId]
    );

    const likes = likeRows as any[];
    let liked = false;
    let message = "";

    if (likes.length > 0) {
      // Unlike
      await pool.execute(
        "DELETE FROM collection_comment_likes WHERE comment_id = ? AND user_id = ?",
        [commentId, userId]
      );

      liked = false;
      message = "Comment unliked successfully";
    } else {
      // Like
      await pool.execute(
        "INSERT INTO collection_comment_likes (comment_id, user_id) VALUES (?, ?)",
        [commentId, userId]
      );

      liked = true;
      message = "Comment liked successfully";

      // Notify comment author if it's not the same user
      if (comment.user_id !== userId) {
        await createNotification(
          comment.user_id,
          "comment_like",
          `${req.user.first_name} ${req.user.last_name} liked your comment on collection "${comment.collection_name}"`,
          userId,
          `/collections/${comment.collection_uuid}`
        );
      }
    }

    // Get updated likes count
    const [countRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM collection_comment_likes WHERE comment_id = ?",
      [commentId]
    );

    const likesCount = (countRows as any[])[0].count;

    res.json({
      liked,
      likesCount,
      message,
    });
  } catch (error) {
    console.error("Like comment error:", error);
    res.status(500).json({ error: "Failed to like/unlike comment" });
  }
});

// Track collection view
router.post("/:identifier/view", async (req, res) => {
  try {
    const { identifier } = req.params;
    const { interaction = "view" } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress || "Unknown";

    // Get user ID if authenticated
    let userId = null;
    if (req.cookies["auth-token"]) {
      userId = await getUserIdFromToken(req.cookies["auth-token"]);
    }

    // Check if identifier is UUID format or numeric ID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier
      );

    // Get collection ID
    let collectionId;

    if (isUUID) {
      const [collectionRows] = await pool.execute(
        "SELECT id FROM collections WHERE uuid = ?",
        [identifier]
      );

      const collections = collectionRows as any[];
      if (collections.length === 0) {
        return res.status(404).json({ error: "Collection not found" });
      }

      collectionId = collections[0].id;
    } else {
      collectionId = identifier;
    }

    // Track view
    await pool.execute(
      "INSERT INTO collection_views (collection_id, user_id, ip_address, interaction) VALUES (?, ?, ?, ?)",
      [collectionId, userId, ipAddress, interaction]
    );

    // Get updated views count
    const [countRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM collection_views WHERE collection_id = ?",
      [collectionId]
    );

    const viewsCount = (countRows as any[])[0].count;

    res.json({
      success: true,
      viewsCount,
      message: "View tracked successfully",
    });
  } catch (error) {
    console.error("Track view error:", error);
    res.status(500).json({ error: "Failed to track view" });
  }
});

// Helper function to get user ID from token
async function getUserIdFromToken(token: string): Promise<string | null> {
  try {
    const [rows] = await pool.execute(
      "SELECT user_id FROM user_sessions WHERE token = ? AND expires_at > NOW()",
      [token]
    );

    const sessions = rows as any[];
    if (sessions.length === 0) return null;

    return sessions[0].user_id;
  } catch (error) {
    console.error("Error getting user ID from token:", error);
    return null;
  }
}

export default router;
