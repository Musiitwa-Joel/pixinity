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
