import express from "express";
import { pool } from "../database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
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

// Configure multer for photo uploads
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "photos");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "_" + Math.random().toString(36).substring(2, 15);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const photoUpload = multer({
  storage: photoStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed") as any);
    }
  },
});

// Check if user is a member of a collection
router.get("/:identifier/check-membership", requireAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    const userId = req.user.id;

    console.log(
      `Checking membership for user ${userId} in collection ${identifier}`
    );

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

    // Check if user is the owner
    const [ownerRows] = await pool.execute(
      "SELECT user_id FROM collections WHERE id = ?",
      [collectionId]
    );

    const owners = ownerRows as any[];
    if (owners.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const isOwner = owners[0].user_id === userId;

    // Check if user is a collaborator
    const [collaboratorRows] = await pool.execute(
      "SELECT id FROM collection_collaborators WHERE collection_id = ? AND user_id = ? AND status = 'accepted'",
      [collectionId, userId]
    );

    const isCollaborator = (collaboratorRows as any[]).length > 0;

    console.log(
      `Membership check result: isOwner=${isOwner}, isCollaborator=${isCollaborator}`
    );

    res.json({
      isMember: isOwner || isCollaborator,
      isOwner,
      isCollaborator,
    });
  } catch (error) {
    console.error("Check membership error:", error);
    res.status(500).json({ error: "Failed to check membership" });
  }
});

// Upload photos to a collection
router.post(
  "/:identifier/upload",
  requireAuth,
  photoUpload.array("photos", 10),
  async (req, res) => {
    try {
      const { identifier } = req.params;
      const { title, description, tags, category, license = "free" } = req.body;
      const userId = req.user.id;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Check if identifier is UUID format or numeric ID
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          identifier
        );

      // Get collection ID and check permissions
      let collectionId;
      let collectionOwnerId;

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
        collectionOwnerId = collections[0].user_id;
        const isOwner = collections[0].user_id === userId;
        const isCollaborative = collections[0].is_collaborative;

        if (!isOwner && !isCollaborative) {
          return res
            .status(403)
            .json({ error: "Not authorized to add photos to this collection" });
        }

        // If not owner, check if user is an accepted collaborator
        if (!isOwner) {
          const [collaboratorRows] = await pool.execute(
            "SELECT id FROM collection_collaborators WHERE collection_id = ? AND user_id = ? AND status = 'accepted'",
            [collectionId, userId]
          );

          if ((collaboratorRows as any[]).length === 0) {
            return res.status(403).json({
              error: "Not an accepted collaborator for this collection",
            });
          }
        }
      } else {
        collectionId = identifier;

        // Check permissions
        const [collectionRows] = await pool.execute(
          "SELECT user_id, is_collaborative FROM collections WHERE id = ?",
          [collectionId]
        );

        const collections = collectionRows as any[];
        if (collections.length === 0) {
          return res.status(404).json({ error: "Collection not found" });
        }

        collectionOwnerId = collections[0].user_id;
        const isOwner = collections[0].user_id === userId;
        const isCollaborative = collections[0].is_collaborative;

        if (!isOwner && !isCollaborative) {
          return res
            .status(403)
            .json({ error: "Not authorized to add photos to this collection" });
        }

        // If not owner, check if user is an accepted collaborator
        if (!isOwner) {
          const [collaboratorRows] = await pool.execute(
            "SELECT id FROM collection_collaborators WHERE collection_id = ? AND user_id = ? AND status = 'accepted'",
            [collectionId, userId]
          );

          if ((collaboratorRows as any[]).length === 0) {
            return res.status(403).json({
              error: "Not an accepted collaborator for this collection",
            });
          }
        }
      }

      // Process each uploaded file
      const uploadedPhotos = [];
      const thumbnailsDir = path.join(process.cwd(), "uploads", "thumbnails");

      if (!fs.existsSync(thumbnailsDir)) {
        fs.mkdirSync(thumbnailsDir, { recursive: true });
      }

      for (const file of files) {
        // Generate thumbnail
        const thumbnailFilename = file.filename.replace(
          path.extname(file.filename),
          "_thumb" + path.extname(file.filename)
        );
        const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);

        // Get image dimensions
        const metadata = await sharp(file.path).metadata();
        const width = metadata.width || 0;
        const height = metadata.height || 0;

        // Create thumbnail
        await sharp(file.path)
          .resize(400, 400, { fit: "inside" })
          .jpeg({ quality: 80 })
          .toFile(thumbnailPath);

        // Insert photo into database
        const [result] = await pool.execute(
          `INSERT INTO photos 
         (user_id, title, description, file_path, thumbnail_path, width, height, size_kb, format, status, published_at, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'live', NOW(), NOW(), NOW())`,
          [
            userId,
            title || file.originalname,
            description || "",
            `/uploads/photos/${file.filename}`,
            `/uploads/thumbnails/${thumbnailFilename}`,
            width,
            height,
            Math.round(file.size / 1024),
            path.extname(file.filename).substring(1),
          ]
        );

        const photoId = (result as ResultSetHeader).insertId;

        // Add photo to collection
        await pool.execute(
          "INSERT INTO collection_photos (collection_id, photo_id) VALUES (?, ?)",
          [collectionId, photoId]
        );

        // If this is the first photo in the collection, set it as cover photo
        const [coverCheckResult] = await pool.execute(
          "SELECT cover_photo_id FROM collections WHERE id = ?",
          [collectionId]
        );

        const coverCheck = coverCheckResult as any[];
        if (coverCheck.length > 0 && !coverCheck[0].cover_photo_id) {
          await pool.execute(
            "UPDATE collections SET cover_photo_id = ? WHERE id = ?",
            [photoId, collectionId]
          );
        }

        // Add category if provided
        if (category) {
          // Check if category exists
          const [categoryRows] = await pool.execute(
            "SELECT id FROM categories WHERE name = ?",
            [category]
          );

          const categories = categoryRows as any[];
          let categoryId;

          if (categories.length > 0) {
            categoryId = categories[0].id;
          } else {
            // Create new category
            const [categoryResult] = await pool.execute(
              "INSERT INTO categories (name) VALUES (?)",
              [category]
            );
            categoryId = (categoryResult as ResultSetHeader).insertId;
          }

          // Add photo-category relationship
          await pool.execute(
            "INSERT INTO photo_categories (photo_id, category_id) VALUES (?, ?)",
            [photoId, categoryId]
          );
        }

        // Add tags if provided
        if (tags) {
          const tagList = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);

          for (const tagName of tagList) {
            // Check if tag exists
            const [tagRows] = await pool.execute(
              "SELECT id FROM tags WHERE name = ?",
              [tagName]
            );

            const existingTags = tagRows as any[];
            let tagId;

            if (existingTags.length > 0) {
              tagId = existingTags[0].id;
            } else {
              // Create new tag
              const [tagResult] = await pool.execute(
                "INSERT INTO tags (name) VALUES (?)",
                [tagName]
              );
              tagId = (tagResult as ResultSetHeader).insertId;
            }

            // Add photo-tag relationship
            await pool.execute(
              "INSERT INTO photo_tags (photo_id, tag_id) VALUES (?, ?)",
              [photoId, tagId]
            );
          }
        }

        uploadedPhotos.push({
          id: photoId,
          title: title || file.originalname,
          url: `/uploads/photos/${file.filename}`,
          thumbnailUrl: `/uploads/thumbnails/${thumbnailFilename}`,
          width,
          height,
        });
      }

      // Get collection owner to notify them if the uploader is a collaborator
      if (collectionOwnerId !== userId) {
        // Notify collection owner about new photos
        await createNotification(
          collectionOwnerId,
          "collection_upload",
          `${req.user.first_name} ${req.user.last_name} added ${uploadedPhotos.length} photo(s) to your collection`,
          parseInt(collectionId),
          `/collections/${identifier}`
        );
      }

      res.status(201).json({
        message: `${uploadedPhotos.length} photo(s) uploaded successfully to the collection`,
        photos: uploadedPhotos,
      });
    } catch (error: any) {
      console.error("Upload to collection error:", error);
      res.status(500).json({
        error: error.message || "Failed to upload photos to collection",
      });
    }
  }
);

export default router;
