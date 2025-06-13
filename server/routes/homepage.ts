import express from "express";
import { pool } from "../database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const router = express.Router();

// Get homepage sections
router.get("/sections", async (req, res) => {
  try {
    console.log("Fetching homepage sections...");

    // Check if homepage_sections table exists
    const [tablesResult] = await pool.execute(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = 'homepage_sections'`
    );

    const tableExists = (tablesResult as RowDataPacket[])[0].count > 0;

    // Create table if it doesn't exist
    if (!tableExists) {
      console.log("Creating homepage_sections table...");
      await pool.execute(`
        CREATE TABLE homepage_sections (
          id VARCHAR(50) PRIMARY KEY,
          title VARCHAR(100) NOT NULL,
          type VARCHAR(50) NOT NULL,
          content JSON NOT NULL,
          is_visible BOOLEAN NOT NULL DEFAULT TRUE,
          order_index INT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Insert default sections
      await insertDefaultSections();
      console.log("Default homepage sections created");
    }

    // Fetch sections
    const [rows] = await pool.execute(
      `SELECT id, title, type, content, is_visible, order_index, created_at, updated_at
       FROM homepage_sections
       ORDER BY order_index ASC`
    );

    const sections = (rows as RowDataPacket[]).map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      content: JSON.parse(row.content.toString()),
      isVisible: Boolean(row.is_visible),
      order: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    console.log(`Fetched ${sections.length} homepage sections`);
    res.json(sections);
  } catch (error) {
    console.error("Error fetching homepage sections:", error);
    res.status(500).json({ error: "Failed to fetch homepage sections" });
  }
});

// Update homepage section
router.put("/sections/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isVisible, order } = req.body;

    console.log(`Updating homepage section: ${id}`);

    // Validate content is valid JSON
    let contentJson;
    try {
      contentJson = JSON.stringify(content);
    } catch (e) {
      return res.status(400).json({ error: "Invalid content format" });
    }

    await pool.execute(
      `UPDATE homepage_sections 
       SET title = ?, content = ?, is_visible = ?, order_index = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, contentJson, isVisible, order, id]
    );

    console.log(`Homepage section ${id} updated successfully`);
    res.json({ message: "Section updated successfully" });
  } catch (error) {
    console.error("Error updating homepage section:", error);
    res.status(500).json({ error: "Failed to update homepage section" });
  }
});

// Add new homepage section
router.post("/sections", async (req, res) => {
  try {
    const { id, title, type, content, isVisible, order } = req.body;

    console.log(`Adding new homepage section: ${title} (${type})`);

    // Validate content is valid JSON
    let contentJson;
    try {
      contentJson = JSON.stringify(content);
    } catch (e) {
      return res.status(400).json({ error: "Invalid content format" });
    }

    await pool.execute(
      `INSERT INTO homepage_sections (id, title, type, content, is_visible, order_index)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, title, type, contentJson, isVisible, order]
    );

    console.log(`New homepage section ${id} added successfully`);
    res.status(201).json({
      message: "Section added successfully",
      section: {
        id,
        title,
        type,
        content,
        isVisible,
        order,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error adding homepage section:", error);
    res.status(500).json({ error: "Failed to add homepage section" });
  }
});

// Delete homepage section
router.delete("/sections/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Deleting homepage section: ${id}`);

    await pool.execute("DELETE FROM homepage_sections WHERE id = ?", [id]);

    console.log(`Homepage section ${id} deleted successfully`);
    res.json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting homepage section:", error);
    res.status(500).json({ error: "Failed to delete homepage section" });
  }
});

// Get all photos for handpicked masterpieces section
router.get("/photos", async (req, res) => {
  try {
    console.log("Fetching photos for homepage...");

    // Check if is_featured column exists in photos table
    const [columnsResult] = await pool.execute(
      `SELECT COUNT(*) as count FROM information_schema.columns 
       WHERE table_schema = DATABASE() AND table_name = 'photos' AND column_name = 'is_featured'`
    );

    const columnExists = (columnsResult as RowDataPacket[])[0].count > 0;

    // Add is_featured column if it doesn't exist
    if (!columnExists) {
      console.log("Adding is_featured column to photos table...");
      await pool.execute(
        "ALTER TABLE photos ADD COLUMN is_featured TINYINT(1) DEFAULT 0"
      );
    }

    const [rows] = await pool.execute(
      `SELECT 
        p.id, p.title, p.description, p.file_path, p.thumbnail_path,
        p.width, p.height, p.views, p.likes, p.downloads, p.is_featured,
        p.created_at, p.updated_at,
        u.id as photographer_id, u.username as photographer_username,
        u.first_name as photographer_first_name, u.last_name as photographer_last_name,
        u.avatar as photographer_avatar, u.verified as photographer_verified
      FROM photos p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'live'
      ORDER BY p.is_featured DESC, p.views DESC, p.likes DESC
      LIMIT 20`
    );

    const photos = (rows as RowDataPacket[]).map((photo) => ({
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
      viewsCount: photo.views,
      likesCount: photo.likes,
      downloadsCount: photo.downloads,
      featured: Boolean(photo.is_featured),
      photographer: {
        id: photo.photographer_id.toString(),
        username: photo.photographer_username,
        firstName: photo.photographer_first_name,
        lastName: photo.photographer_last_name,
        avatar: photo.photographer_avatar,
        verified: Boolean(photo.photographer_verified),
      },
      createdAt: photo.created_at,
      updatedAt: photo.updated_at,
    }));

    console.log(`Fetched ${photos.length} photos for homepage`);
    res.json(photos);
  } catch (error) {
    console.error("Error fetching homepage photos:", error);
    res.status(500).json({ error: "Failed to fetch homepage photos" });
  }
});

// Update featured status of a photo
router.put("/photos/:id/featured", async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    console.log(`Updating featured status of photo ${id} to ${featured}`);

    await pool.execute(
      "UPDATE photos SET is_featured = ?, updated_at = NOW() WHERE id = ?",
      [featured ? 1 : 0, id]
    );

    res.json({
      message: `Photo ${featured ? "featured" : "unfeatured"} successfully`,
      featured,
    });
  } catch (error) {
    console.error("Error updating photo featured status:", error);
    res.status(500).json({ error: "Failed to update photo featured status" });
  }
});

// Helper function to insert default sections
async function insertDefaultSections() {
  const defaultSections = [
    {
      id: "hero-section",
      title: "Hero Section",
      type: "hero",
      content: {
        heading: "Discover Beautiful Photography",
        subheading:
          "Explore millions of high-quality photos from talented creators around the world",
        ctaText: "Start Exploring",
        ctaLink: "/explore",
        secondaryCtaText: "Join Free",
        secondaryCtaLink: "/signup",
        backgroundImage:
          "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
      },
      isVisible: true,
      order: 1,
    },
    {
      id: "features-section",
      title: "Features Section",
      type: "features",
      content: {
        heading: "Why Choose Pixinity",
        features: [
          {
            title: "High Quality Photos",
            description: "Access millions of high-resolution images",
            icon: "image",
          },
          {
            title: "Smart Discovery",
            description: "Find exactly what you need with powerful search",
            icon: "search",
          },
          {
            title: "Global Community",
            description: "Connect with photographers worldwide",
            icon: "users",
          },
        ],
      },
      isVisible: true,
      order: 2,
    },
    {
      id: "categories-section",
      title: "Categories Section",
      type: "categories",
      content: {
        heading: "Explore Categories",
        categories: [
          {
            name: "Nature",
            image:
              "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
            link: "/categories/nature",
          },
          {
            name: "Architecture",
            image:
              "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
            link: "/categories/architecture",
          },
          {
            name: "Travel",
            image:
              "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg",
            link: "/categories/travel",
          },
        ],
      },
      isVisible: true,
      order: 3,
    },
    {
      id: "masterpieces-section",
      title: "Handpicked Masterpieces",
      type: "masterpieces",
      content: {
        heading: "Handpicked Masterpieces",
        subheading:
          "Curated selection of exceptional photography from our community",
        photoIds: [],
      },
      isVisible: true,
      order: 4,
    },
  ];

  for (const section of defaultSections) {
    await pool.execute(
      `INSERT INTO homepage_sections (id, title, type, content, is_visible, order_index)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        section.id,
        section.title,
        section.type,
        JSON.stringify(section.content),
        section.isVisible,
        section.order,
      ]
    );
  }
}

export default router;
