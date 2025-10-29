const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./src/config/db").development;

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database Connection (promise pool)
const dbase = mysql.createPool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
});

(async () => {
  try {
      const connection = await dbase.getConnection();
      console.log("✅ Database connected successfully!");
      connection.release();
  } catch (error) {
      console.error("❌ Database connection failed:", error.message);
  }
})();

// ======================== LOGIN ========================
app.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      console.log("Login attempt:", { email, password });

      const query = "SELECT role FROM login WHERE email = ? AND password = ?";
      const [rows] = await dbase.query(query, [email, password]);

      if (rows.length === 0) {
          console.log("Invalid credentials for:", email);
          return res.status(404).json({ error: "Invalid credentials" });
      }

      console.log("Login successful:", rows[0].role);
      res.status(200).json({ role: rows[0].role });
  } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database query failed" });
  }
});

// ======================== SIGNUP ========================
app.post("/signup", async (req, res) => {
  console.log("📍 Signup route hit");
  console.log("Request body:", req.body);
  
  let connection;
  
  try {
    const {
      fullName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address
    } = req.body;

    console.log("Signup attempt for:", email);

    // Validate required fields
    if (!fullName || !email || !password || !phone || !dateOfBirth || !gender || !address) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        error: "All fields are required" 
      });
    }

    // Get connection from pool
    connection = await dbase.getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    console.log("✅ Transaction started");

    // Check if email already exists in login table
    const [existingUser] = await connection.query(
      "SELECT id FROM login WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      console.log("❌ Email already exists:", email);
      await connection.rollback();
      connection.release();
      return res.status(400).json({ 
        error: "Email already registered" 
      });
    }

    // Insert into login table
    const [loginResult] = await connection.query(
      "INSERT INTO login (email, password, role) VALUES (?, ?, 'CLIENT')",
      [email, password]
    );

    const loginId = loginResult.insertId;
    console.log("✅ Login entry created with ID:", loginId);

    // Insert into clients table
    const [clientResult] = await connection.query(
      `INSERT INTO clients 
        (login_id, full_name, mail, phone_number, date_of_birth, gender, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [loginId, fullName, email, phone, dateOfBirth, gender, address]
    );

    console.log("✅ Client entry created with ID:", clientResult.insertId);

    // Commit transaction
    await connection.commit();
    console.log("✅ Transaction committed successfully");

    res.status(201).json({ 
      message: "Account created successfully",
      email: email
    });

  } catch (err) {
    console.error("❌ Signup error:", err);
    
    // Rollback transaction on error
    if (connection) {
      try {
        await connection.rollback();
        console.log("⚠️ Transaction rolled back");
      } catch (rollbackErr) {
        console.error("❌ Rollback error:", rollbackErr);
      }
    }
    
    res.status(500).json({ 
      error: "Failed to create account. Please try again.",
      details: err.message
    });
  } finally {
    // Always release connection back to pool
    if (connection) {
      connection.release();
      console.log("✅ Connection released");
    }
  }
});

// ======================== CLUBS ========================
app.get("/clubs_fetch", async (req, res) => {
  try {
    const [results] = await dbase.query(
      `SELECT * FROM clubs WHERE visibility = 'Public' AND status = 'Active'`
    );
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching public clubs:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// ======================== PROFILE ========================
app.get("/profile/:email", async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const query = `
    SELECT 
        c.full_name,
        c.mail,
        c.phone_number,
        c.date_of_birth,
        c.gender,
        c.address,
        cm.role AS club_role,
        cl.club_id,
        cl.club_name,
        cl.description AS club_description,
        cl.category AS club_category 
    FROM clients c
    LEFT JOIN club_members cm ON c.client_id = cm.client_id
    LEFT JOIN clubs cl ON cm.club_id = cl.club_id
    WHERE c.mail = ? and not cm.role='Request';
  `;

  try {
    const [rows] = await dbase.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const clientInfo = {
      full_name: rows[0].full_name,
      mail: rows[0].mail,
      phone_number: rows[0].phone_number,
      date_of_birth: rows[0].date_of_birth,
      gender: rows[0].gender,
      address: rows[0].address,
      clubs: rows.map(r => ({
        id: r.club_id,
        club_id: r.club_id,
        role: r.club_role,
        name: r.club_name,
        description: r.club_description,
        category: r.club_category
      })).filter(c => c.name)
    };

    res.json(clientInfo);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/profile", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const query = `
    SELECT 
        c.full_name,
        c.mail,
        c.phone_number,
        c.date_of_birth,
        c.gender,
        c.address,
        cm.role AS club_role,
        cl.club_id,
        cl.club_name,
        cl.description AS club_description,
        cl.category AS club_category
    FROM clients c
    LEFT JOIN club_members cm ON c.client_id = cm.client_id
    LEFT JOIN clubs cl ON cm.club_id = cl.club_id
    WHERE c.mail = ?;
  `;

  try {
    const [rows] = await dbase.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const clientInfo = {
      full_name: rows[0].full_name,
      mail: rows[0].mail,
      phone_number: rows[0].phone_number,
      date_of_birth: rows[0].date_of_birth,
      gender: rows[0].gender,
      address: rows[0].address,
      clubs: rows
        .map(r => ({
          id: r.club_id,
          club_id: r.club_id,
          role: r.club_role,
          name: r.club_name,
          description: r.club_description,
          category: r.club_category
        }))
        .filter(c => c.name !== null)
    };

    res.json(clientInfo);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================== JOIN CLUB ========================
app.post("/clubs/join", async (req, res) => {
  try {
    const { userEmail, clubId } = req.body;

    if (!userEmail || !clubId) {
      return res.status(400).json({ message: "Email and clubId are required" });
    }

    const [clientRows] = await dbase.query(
      "SELECT client_id FROM clients WHERE mail = ?",
      [userEmail]
    );

    if (clientRows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    const { client_id } = clientRows[0];

    const [existing] = await dbase.query(
      "SELECT * FROM club_members WHERE client_id = ? AND club_id = ?",
      [client_id, clubId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Already a member of this club" });
    }

    await dbase.query(
      "INSERT INTO club_members (client_id, club_id, role) VALUES (?, ?, 'Member')",
      [client_id, clubId]
    );

    await dbase.query(
      "UPDATE clubs SET member_count = member_count + 1 WHERE club_id = ?",
      [clubId]
    );

    res.status(201).json({ message: "Joined club successfully!" });
  } catch (err) {
    console.error("Error joining club:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================== CREATE CLUB ========================
const handleCreateClub = async (req, res) => {
  try {
    const {
      clubName,
      clubDescription,
      clubCategory,
      clubHead,
      clubEmail,
      clubSocialMedia,
      clubLogo,
      userEmail
    } = req.body;

    const [loginRows] = await dbase.query(
      "SELECT id FROM login WHERE email = ?",
      [userEmail]
    );

    if (loginRows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const loginId = loginRows[0].id;

    const [clientRows] = await dbase.query(
      "SELECT client_id FROM clients WHERE login_id = ?",
      [loginId]
    );

    if (clientRows.length === 0) {
      return res.status(400).json({ message: "Client not found" });
    }

    const { client_id } = clientRows[0];

    const [clubResult] = await dbase.query(
      `INSERT INTO clubs 
        (club_name, description, category, founded_date, club_head, email, contact_phone, social_media, website, logo_url, member_count, visibility, status, created_at, updated_at) 
       VALUES (?, ?, ?, CURDATE(), ?, ?, NULL, ?, NULL, ?, 1, 'Public', 'Active', NOW(), NOW())`,
      [
        clubName,
        clubDescription,
        clubCategory,
        clubHead,
        clubEmail,
        clubSocialMedia || null,
        clubLogo || "/uploads/logos/default.png"
      ]
    );

    const newClubId = clubResult.insertId;

    await dbase.query(
      "INSERT INTO club_members (client_id, club_id, role) VALUES (?, ?, 'Coordinator')",
      [client_id, newClubId]
    );

    return res
      .status(201)
      .json({ message: "Club created successfully! You are the Coordinator." });
  } catch (error) {
    console.error("Error creating club:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

app.post("/create", handleCreateClub);
app.post("/api/clubs/create", handleCreateClub);

// ======================== GET CLUB DETAILS ========================
app.get("/club/:clubId", async (req, res) => {
  try {
    const { clubId } = req.params;
    const userEmail = req.query.email;

    console.log("📍 Fetching club details for clubId:", clubId, "userEmail:", userEmail);

    if (!clubId) {
      return res.status(400).json({ message: "Club ID is required" });
    }

    let clubRows;
    if (!isNaN(clubId)) {
      [clubRows] = await dbase.query(
        `SELECT * FROM clubs WHERE club_id = ?`,
        [clubId]
      );
    } else {
      [clubRows] = await dbase.query(
        `SELECT * FROM clubs WHERE club_name = ?`,
        [decodeURIComponent(clubId)]
      );
    }

    if (clubRows.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }

    const club = clubRows[0];

    const [memberRows] = await dbase.query(
      `SELECT 
        c.full_name,
        c.mail AS email,
        c.phone_number,
        cm.role,
        cm.joined_at AS joined_date
      FROM club_members cm
      JOIN clients c ON cm.client_id = c.client_id
      WHERE cm.club_id = ?`,
      [club.club_id]
    );

    let userRole = null;
    if (userEmail) {
      const [userRoleRows] = await dbase.query(
        `SELECT cm.role 
         FROM club_members cm
         JOIN clients c ON cm.client_id = c.client_id
         WHERE cm.club_id = ? AND c.mail = ?`,
        [club.club_id, userEmail]
      );
      if (userRoleRows.length > 0) {
        userRole = userRoleRows[0].role;
      }
    }

    console.log("✅ Club found:", club.club_name, "Members:", memberRows.length, "User role:", userRole);

    res.json({
      club_id: club.club_id,
      club_name: club.club_name,
      description: club.description,
      category: club.category,
      member_count: club.member_count,
      founded_date: club.founded_date,
      club_head: club.club_head,
      club_email: club.email,
      social_media: club.social_media,
      website: club.website,
      logo_url: club.logo_url,
      visibility: club.visibility,
      status: club.status,
      members: memberRows,
      userRole,
      totalMembers: memberRows.length
    });
  } catch (err) {
    console.error("Error fetching club details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================== GET CLUB ID BY NAME ========================
app.get("/api/club/id/:clubName", async (req, res) => {
  const { clubName } = req.params;
  console.log("📍 Fetching club_id for club name:", clubName);
  
  try {
    const [rows] = await dbase.query(
      "SELECT club_id FROM clubs WHERE club_name = ?",
      [decodeURIComponent(clubName)]
    );
    
    if (rows.length === 0) {
      console.log("❌ Club not found:", clubName);
      return res.status(404).json({ message: "Club not found" });
    }
    
    console.log("✅ Found club_id:", rows[0].club_id, "for club:", clubName);
    res.status(200).json({ club_id: rows[0].club_id, club_name: clubName });
  } catch (err) {
    console.error("❌ Error fetching club_id:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ======================== CLUB ITEMS ROUTES (ANNOUNCEMENTS, EVENTS, TARGETS) ========================

// GET all items for a specific club
app.get("/api/club/:clubId/items", async (req, res) => {
  const { clubId } = req.params;
  const { type } = req.query;
  
  console.log("📍 GET /api/club/:clubId/items - clubId:", clubId, "type:", type);
  
  try {
    let query = "SELECT * FROM club_items WHERE club_id = ?";
    let params = [clubId];
    
    if (type) {
      query += " AND item_type = ?";
      params.push(type);
    }
    
    query += " ORDER BY created_at DESC";
    
    const [rows] = await dbase.query(query, params);
    console.log(`✅ Found ${rows.length} items for club_id: ${clubId}`);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching club items:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET announcements for a club
app.get("/api/club/:clubId/announcements", async (req, res) => {
  const { clubId } = req.params;
  
  console.log("📍 GET /api/club/:clubId/announcements - clubId:", clubId);
  
  try {
    const [rows] = await dbase.query(
      `SELECT ci.*, c.full_name as author_name 
       FROM club_items ci
       LEFT JOIN clients c ON ci.created_by = c.client_id
       WHERE ci.club_id = ? AND ci.item_type = 'announcement'
       ORDER BY ci.created_at DESC`,
      [clubId]
    );
    
    console.log(`✅ Found ${rows.length} announcements for club_id: ${clubId}`);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching announcements:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET events for a club
app.get("/api/club/:clubId/events", async (req, res) => {
  const { clubId } = req.params;
  
  console.log("📍 GET /api/club/:clubId/events - clubId:", clubId);
  
  try {
    const [rows] = await dbase.query(
      `SELECT ci.*, c.full_name as author_name 
       FROM club_items ci
       LEFT JOIN clients c ON ci.created_by = c.client_id
       WHERE ci.club_id = ? AND ci.item_type = 'event'
       ORDER BY ci.start_date ASC`,
      [clubId]
    );
    
    console.log(`✅ Found ${rows.length} events for club_id: ${clubId}`);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET targets for a club
app.get("/api/club/:clubId/targets", async (req, res) => {
  const { clubId } = req.params;
  
  console.log("📍 GET /api/club/:clubId/targets - clubId:", clubId);
  
  try {
    const [rows] = await dbase.query(
      `SELECT ci.*, c.full_name as author_name 
       FROM club_items ci
       LEFT JOIN clients c ON ci.created_by = c.client_id
       WHERE ci.club_id = ? AND ci.item_type = 'target'
       ORDER BY ci.created_at DESC`,
      [clubId]
    );
    
    console.log(`✅ Found ${rows.length} targets for club_id: ${clubId}`);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching targets:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST - Create new announcement
app.post("/api/club/:clubId/announcements", async (req, res) => {
  const { clubId } = req.params;
  const { title, description, priority, visibility, userEmail } = req.body;
  
  console.log("📍 POST /api/club/:clubId/announcements - clubId:", clubId);
  
  try {
    const [clientRows] = await dbase.query(
      "SELECT client_id FROM clients WHERE mail = ?",
      [userEmail]
    );
    
    if (clientRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const clientId = clientRows[0].client_id;
    
    const [result] = await dbase.query(
      `INSERT INTO club_items (club_id, created_by, item_type, title, description, priority, visibility, status)
       VALUES (?, ?, 'announcement', ?, ?, ?, ?, 'active')`,
      [clubId, clientId, title, description, priority || 'medium', visibility || 'club_members']
    );
    
    console.log(`✅ Announcement created with ID: ${result.insertId}`);
    res.status(201).json({ 
      message: "Announcement created successfully", 
      item_id: result.insertId 
    });
  } catch (err) {
    console.error("❌ Error creating announcement:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST - Create new event
app.post("/api/club/:clubId/events", async (req, res) => {
  const { clubId } = req.params;
  const { title, description, start_date, end_date, priority, visibility, userEmail } = req.body;
  
  console.log("📍 POST /api/club/:clubId/events - clubId:", clubId);
  
  try {
    const [clientRows] = await dbase.query(
      "SELECT client_id FROM clients WHERE mail = ?",
      [userEmail]
    );
    
    if (clientRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const clientId = clientRows[0].client_id;
    
    const [result] = await dbase.query(
      `INSERT INTO club_items (club_id, created_by, item_type, title, description, start_date, end_date, priority, visibility, status)
       VALUES (?, ?, 'event', ?, ?, ?, ?, ?, ?, 'active')`,
      [clubId, clientId, title, description, start_date, end_date || start_date, priority || 'medium', visibility || 'club_members']
    );
    
    console.log(`✅ Event created with ID: ${result.insertId}`);
    res.status(201).json({ 
      message: "Event created successfully", 
      item_id: result.insertId 
    });
  } catch (err) {
    console.error("❌ Error creating event:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST - Create new target
app.post("/api/club/:clubId/targets", async (req, res) => {
  const { clubId } = req.params;
  const { title, description, end_date, priority, visibility, userEmail } = req.body;
  
  console.log("📍 POST /api/club/:clubId/targets - clubId:", clubId);
  
  try {
    const [clientRows] = await dbase.query(
      "SELECT client_id FROM clients WHERE mail = ?",
      [userEmail]
    );
    
    if (clientRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const clientId = clientRows[0].client_id;
    
    const [result] = await dbase.query(
      `INSERT INTO club_items (club_id, created_by, item_type, title, description, end_date, priority, visibility, status)
       VALUES (?, ?, 'target', ?, ?, ?, ?, ?, 'active')`,
      [clubId, clientId, title, description, end_date, priority || 'urgent', visibility || 'officers_only']
    );
    
    console.log(`✅ Target created with ID: ${result.insertId}`);
    res.status(201).json({ 
      message: "Target created successfully", 
      item_id: result.insertId 
    });
  } catch (err) {
    console.error("❌ Error creating target:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT - Update item status
app.put("/api/club/items/:itemId/status", async (req, res) => {
  const { itemId } = req.params;
  const { status } = req.body;
  
  console.log("📍 PUT /api/club/items/:itemId/status - itemId:", itemId);
  
  try {
    const [result] = await dbase.query(
      "UPDATE club_items SET status = ? WHERE item_id = ?",
      [status, itemId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    console.log(`✅ Item ${itemId} status updated to ${status}`);
    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE - Delete an item
app.delete("/api/club/items/:itemId", async (req, res) => {
  const { itemId } = req.params;
  
  console.log("📍 DELETE /api/club/items/:itemId - itemId:", itemId);
  
  try {
    const [result] = await dbase.query(
      "DELETE FROM club_items WHERE item_id = ?",
      [itemId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    console.log(`✅ Item ${itemId} deleted successfully`);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting item:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ======================== MoM ROUTES ========================

// GET all MoMs for a club
app.get("/api/moms/:clubId", async (req, res) => {
  const { clubId } = req.params;
  console.log("📍 Fetching MoMs for club_id:", clubId);
  
  try {
    const [rows] = await dbase.query(
      "SELECT * FROM club_mom WHERE club_id = ? ORDER BY meeting_date DESC",
      [clubId]
    );
    
    console.log("✅ Found", rows.length, "MoMs for club_id:", clubId);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching MoMs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET single MoM by ID
app.get("/api/mom/:momId", async (req, res) => {
  const { momId } = req.params;
  try {
    const [rows] = await dbase.query("SELECT * FROM club_mom WHERE mom_id = ?", [momId]);
    if (rows.length === 0) return res.status(404).json({ message: "MoM not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching MoM:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new MoM
app.post("/api/moms/add", async (req, res) => {
  try {
    const {
      club_id,
      meeting_title,
      meeting_date,
      start_time,
      end_time,
      location,
      organizer_email,
      attendees,
      agenda,
      discussions,
      decisions,
      action_items,
      notes
    } = req.body;

    console.log("📍 Adding MoM for club_id:", club_id);

    const sql = `
      INSERT INTO club_mom 
      (club_id, meeting_title, meeting_date, start_time, end_time, location, organizer_email, attendees, agenda, discussions, decisions, action_items, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await dbase.query(sql, [
      club_id,
      meeting_title,
      meeting_date,
      start_time || null,
      end_time || null,
      location || null,
      organizer_email || null,
      attendees || null,
      agenda || null,
      discussions || null,
      decisions || null,
      action_items || null,
      notes || null
    ]);

    console.log("✅ MoM added successfully with ID:", result.insertId);
    res.status(201).json({ message: "MoM added successfully", mom_id: result.insertId });
  } catch (err) {
    console.error("❌ Error adding MoM:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE a MoM
app.delete("/api/mom/:momId", async (req, res) => {
  const { momId } = req.params;
  try {
    const [result] = await dbase.query("DELETE FROM club_mom WHERE mom_id = ?", [momId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "MoM not found" });
    res.status(200).json({ message: "MoM deleted successfully" });
  } catch (err) {
    console.error("Error deleting MoM:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/clubs/request", async (req, res) => {
  try {
    const { userEmail, clubId, requestReason } = req.body;
    if (!userEmail || !clubId || !requestReason) {
      return res.status(400).json({ message: "Email, clubId, and reason required" });
    }

    const [clientRows] = await dbase.query(
      "SELECT client_id FROM clients WHERE mail = ?",
      [userEmail]
    );
    if (clientRows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    const { client_id } = clientRows[0];

    // Check for existing membership or request
    const [existing] = await dbase.query(
      "SELECT * FROM club_members WHERE client_id = ? AND club_id = ?",
      [client_id, clubId]
    );
    if (existing.length > 0) {
      if (existing[0].role === "Request") {
        return res.status(400).json({ message: "Already requested to join this club" });
      }
      return res.status(400).json({ message: "Already a member of this club" });
    }

    await dbase.query(
      "INSERT INTO club_members (client_id, club_id, role, request_reason) VALUES (?, ?, 'Request', ?)",
      [client_id, clubId, requestReason]
    );
    res.status(201).json({ message: "Join request submitted!" });
  } catch (err) {
    console.error("Error submitting join request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET JOIN REQUESTS FOR A USER (using query param for email)
app.get("/clubs/requests", async (req, res) => {
  const userEmail = req.query.email;
  if (!userEmail) {
    return res.status(400).json({ message: "Email query parameter is required" });
  }

  try {
    // Get client_id from email
    const [clientRows] = await dbase.query(
      "SELECT client_id FROM clients WHERE mail = ?",
      [userEmail]
    );
    if (clientRows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    const { client_id } = clientRows[0];

    // Query join requests and memberships
    const [requests] = await dbase.query(`
      SELECT 
        cm.club_id, 
        cm.role, 
        cm.request_reason, 
        cm.joined_at AS requestDate,
        cl.club_name AS clubName, 
        cl.description AS clubDescription, 
        cl.category AS clubCategory
      FROM club_members cm
      JOIN clubs cl ON cm.club_id = cl.club_id
      WHERE cm.client_id = ? AND (
        cm.role = 'Request'
      )
    `, [client_id]);

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching join requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET join requests for a specific club
app.get('/api/club/:clubId/join-requests', async (req, res) => {
  const { clubId } = req.params;
  
  try {
    const query = `
      SELECT 
        cm.client_id,
        cm.request_reason,
        cm.joined_at,
        c.full_name,
        c.mail
      FROM club_members cm
      JOIN clients c ON cm.client_id = c.client_id
      WHERE cm.club_id = ? AND cm.role = 'Request'
      ORDER BY cm.joined_at DESC
    `;
    
    const [results] = await dbase.query(query, [clubId]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching join requests:', error);
    res.status(500).json({ error: 'Failed to fetch join requests' });
  }
});

// Accept join request
app.post('/api/club/:clubId/join-requests/:clientId/accept', async (req, res) => {
  const { clubId, clientId } = req.params;
  
  try {
    const query = `
      UPDATE club_members 
      SET role = 'Member', request_reason = NULL
      WHERE club_id = ? AND client_id = ? AND role = 'Request'
    `;
    
    await dbase.query(query, [clubId, clientId]);
    res.json({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

// Reject join request
app.delete('/api/club/:clubId/join-requests/:clientId/reject', async (req, res) => {
  const { clubId, clientId } = req.params;
  
  try {
    const query = `
      DELETE FROM club_members 
      WHERE club_id = ? AND client_id = ? AND role = 'Request'
    `;
    
    await dbase.query(query, [clubId, clientId]);
    res.json({ message: 'Request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

// ======================== ADD MEMBER TO CLUB (COORDINATOR ONLY) ========================
app.post("/api/club/:clubId/add-member", async (req, res) => {
  const { clubId } = req.params;
  const { memberEmail, role } = req.body;
  
  console.log("📍 POST /api/club/:clubId/add-member - clubId:", clubId);
  console.log("Request body:", { memberEmail, role });
  
  try {
    // Validate inputs
    if (!memberEmail || !role) {
      return res.status(400).json({ 
        message: "Email and role are required" 
      });
    }

    // Validate role
    const validRoles = ['Member', 'Coordinator'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role. Must be 'Member' or 'Coordinator'" 
      });
    }

    // Check if the email exists in clients table
    const [clientRows] = await dbase.query(
      "SELECT client_id, full_name FROM clients WHERE mail = ?",
      [memberEmail]
    );

    if (clientRows.length === 0) {
      return res.status(404).json({ 
        message: "User with this email not found. They need to sign up first." 
      });
    }

    const clientId = clientRows[0].client_id;
    const fullName = clientRows[0].full_name;

    // Check if already a member
    const [existingMember] = await dbase.query(
      "SELECT * FROM club_members WHERE client_id = ? AND club_id = ?",
      [clientId, clubId]
    );

    if (existingMember.length > 0) {
      // If they have a pending request, update it
      if (existingMember[0].role === 'Request') {
        await dbase.query(
          "UPDATE club_members SET role = ?, request_reason = NULL WHERE client_id = ? AND club_id = ?",
          [role, clientId, clubId]
        );
        
        console.log(`✅ Updated pending request to ${role} for client_id: ${clientId}`);
        return res.status(200).json({ 
          message: `${fullName} has been added as ${role}`,
          updated: true
        });
      }
      
      return res.status(400).json({ 
        message: "This user is already a member of the club" 
      });
    }

    // Add member to club
    await dbase.query(
      "INSERT INTO club_members (client_id, club_id, role) VALUES (?, ?, ?)",
      [clientId, clubId, role]
    );

    // Update member count in clubs table
    await dbase.query(
      "UPDATE clubs SET member_count = member_count + 1 WHERE club_id = ?",
      [clubId]
    );

    console.log(`✅ Member added successfully - client_id: ${clientId}, role: ${role}`);
    
    res.status(201).json({ 
      message: `${fullName} has been added as ${role}`,
      clientId: clientId,
      fullName: fullName
    });

  } catch (err) {
    console.error("❌ Error adding member:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
});

// Add these routes to your server.js file

// ======================== ADMIN - GET ALL CLUBS ========================
app.get("/api/admin/clubs", async (req, res) => {
  try {
    const [clubs] = await dbase.query(`
      SELECT 
        club_id,
        club_name,
        email,
        visibility,
        status,
        block_status,
        block_reason,
        created_at,
        updated_at
      FROM clubs
      ORDER BY created_at DESC
    `);
    
    res.status(200).json(clubs);
  } catch (err) {
    console.error("Error fetching clubs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ======================== ADMIN - BLOCK CLUB ========================
app.post("/api/admin/clubs/:clubId/block", async (req, res) => {
  const { clubId } = req.params;
  const { blockReason } = req.body;
  
  console.log("📍 Blocking club_id:", clubId, "Reason:", blockReason);
  
  if (!blockReason || blockReason.trim() === '') {
    return res.status(400).json({ message: "Block reason is required" });
  }
  
  try {
    const [result] = await dbase.query(
      `UPDATE clubs 
       SET block_status = 'Blocked', 
           block_reason = ?, 
           updated_at = NOW() 
       WHERE club_id = ? AND block_status = 'Unblocked'`,
      [blockReason.trim(), clubId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Club not found or already blocked" });
    }
    
    console.log("✅ Club blocked successfully");
    res.status(200).json({ 
      message: "Club blocked successfully",
      blockReason: blockReason.trim()
    });
  } catch (err) {
    console.error("❌ Error blocking club:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ======================== ADMIN - UNBLOCK CLUB ========================
app.post("/api/admin/clubs/:clubId/unblock", async (req, res) => {
  const { clubId } = req.params;
  
  console.log("📍 Unblocking club_id:", clubId);
  
  try {
    const [result] = await dbase.query(
      `UPDATE clubs 
       SET block_status = 'Unblocked', 
           block_reason = NULL, 
           updated_at = NOW() 
       WHERE club_id = ? AND block_status = 'Blocked'`,
      [clubId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Club not found or already unblocked" });
    }
    
    console.log("✅ Club unblocked successfully");
    res.status(200).json({ message: "Club unblocked successfully" });
  } catch (err) {
    console.error("❌ Error unblocking club:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ======================== COORDINATOR - REQUEST UNBLOCK ========================
app.post("/api/clubs/:clubId/request-unblock", async (req, res) => {
  const { clubId } = req.params;
  const { unblockReason, userEmail } = req.body;
  
  console.log("📍 Unblock request for club_id:", clubId);
  
  if (!unblockReason || unblockReason.trim() === '') {
    return res.status(400).json({ message: "Reason for unblocking is required" });
  }
  
  try {
    // Verify user is coordinator of this club
    const [coordinatorCheck] = await dbase.query(
      `SELECT cm.role 
       FROM club_members cm
       JOIN clients c ON cm.client_id = c.client_id
       WHERE cm.club_id = ? AND c.mail = ? AND cm.role = 'Coordinator'`,
      [clubId, userEmail]
    );
    
    if (coordinatorCheck.length === 0) {
      return res.status(403).json({ message: "Only coordinators can request unblock" });
    }
    
    // Update block_reason with coordinator's request
    const [result] = await dbase.query(
      `UPDATE clubs 
       SET block_reason = ?, 
           updated_at = NOW() 
       WHERE club_id = ? AND block_status = 'Blocked'`,
      [`UNBLOCK_REQUEST: ${unblockReason.trim()}`, clubId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Club not found or not blocked" });
    }
    
    console.log("✅ Unblock request submitted successfully");
    res.status(200).json({ 
      message: "Unblock request submitted successfully. Admin will review your request."
    });
  } catch (err) {
    console.error("❌ Error submitting unblock request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ======================== GET CLUB BLOCK STATUS ========================
app.get("/api/clubs/:clubId/block-status", async (req, res) => {
  const { clubId } = req.params;
  
  try {
    const [rows] = await dbase.query(
      `SELECT 
        block_status, 
        block_reason, 
        updated_at,
        DATEDIFF(NOW(), updated_at) as days_blocked
       FROM clubs 
       WHERE club_id = ?`,
      [clubId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }
    
    const clubData = rows[0];
    const daysRemaining = clubData.block_status === 'Blocked' 
      ? Math.max(0, 30 - clubData.days_blocked)
      : null;
    
    res.status(200).json({
      blockStatus: clubData.block_status,
      blockReason: clubData.block_reason,
      daysBlocked: clubData.days_blocked,
      daysRemaining: daysRemaining,
      willBeDeleted: clubData.block_status === 'Blocked' && clubData.days_blocked >= 30
    });
  } catch (err) {
    console.error("Error fetching block status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ======================== CRON JOB - DELETE BLOCKED CLUBS AFTER 30 DAYS ========================
// This should run daily - you can use node-cron package
// npm install node-cron
const cron = require('node-cron');

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('🔄 Running scheduled task: Delete clubs blocked for 30+ days');
  
  try {
    const [clubsToDelete] = await dbase.query(`
      SELECT club_id, club_name 
      FROM clubs 
      WHERE block_status = 'Blocked' 
      AND DATEDIFF(NOW(), updated_at) >= 30
    `);
    
    if (clubsToDelete.length > 0) {
      console.log(`Found ${clubsToDelete.length} clubs to delete`);
      
      for (const club of clubsToDelete) {
        // Delete related data first (foreign key constraints)
        await dbase.query('DELETE FROM club_members WHERE club_id = ?', [club.club_id]);
        await dbase.query('DELETE FROM club_items WHERE club_id = ?', [club.club_id]);
        await dbase.query('DELETE FROM club_mom WHERE club_id = ?', [club.club_id]);
        
        // Delete the club
        await dbase.query('DELETE FROM clubs WHERE club_id = ?', [club.club_id]);
        
        console.log(`✅ Deleted club: ${club.club_name} (ID: ${club.club_id})`);
      }
    } else {
      console.log('No clubs to delete');
    }
  } catch (err) {
    console.error('❌ Error in scheduled deletion:', err);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});