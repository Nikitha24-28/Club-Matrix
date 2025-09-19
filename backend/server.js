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
      connection.release(); // release back to pool
  } catch (error) {
      console.error("❌ Database connection failed:", error.message);
  }
})();


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

// Route to get all Public Clubs
app.get("/clubs_fetch", async (req, res) => {
  try {
    const [results] = await dbase.query(
      `SELECT * FROM clubs WHERE visibility = 'Public' AND status = 'Active'`
    );

    res.status(200).json(results); // even if []
  } catch (err) {
    console.error("Error fetching public clubs:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});


// ✅ Profile routes (GET + POST)

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

    // ✅ Group client info + clubs
    const clientInfo = {
      full_name: rows[0].full_name,
      mail: rows[0].mail,
      phone_number: rows[0].phone_number,
      date_of_birth: rows[0].date_of_birth,
      gender: rows[0].gender,
      address: rows[0].address,
      clubs: rows.map(r => ({
        role: r.club_role,
        name: r.club_name,
        description: r.club_description,
        category: r.club_category
      })).filter(c => c.name) // remove nulls if no clubs
    };

    res.json(clientInfo);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Keep POST version for backward compatibility
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
          role: r.club_role,
          name: r.club_name,
          description: r.club_description,
          category: r.club_category
        }))
        .filter(c => c.name !== null) // only valid clubs
    };

    res.json(clientInfo);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/clubs/join", async (req, res) => {
  try {
    const { userEmail, clubId } = req.body;

    if (!userEmail || !clubId) {
      return res.status(400).json({ message: "Email and clubId are required" });
    }

    // Get client_id
    const [clientRows] = await dbase.query(
      "SELECT client_id FROM clients WHERE mail = ?",
      [userEmail]
    );

    if (clientRows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    const { client_id } = clientRows[0];

    // Check if already a member
    const [existing] = await dbase.query(
      "SELECT * FROM club_members WHERE client_id = ? AND club_id = ?",
      [client_id, clubId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Already a member of this club" });
    }

    // Insert membership
    await dbase.query(
      "INSERT INTO club_members (client_id, club_id, role) VALUES (?, ?, 'Member')",
      [client_id, clubId]
    );

    // Update member count in clubs
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

// CREATE CLUB HANDLER
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
      userEmail // frontend localStorage
    } = req.body;

    // 1. Get login_id
    const [loginRows] = await dbase.query(
      "SELECT id FROM login WHERE email = ?",
      [userEmail]
    );

    if (loginRows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const loginId = loginRows[0].id;

    // 2. Get client_id
    const [clientRows] = await dbase.query(
      "SELECT client_id FROM clients WHERE login_id = ?",
      [loginId]
    );

    if (clientRows.length === 0) {
      return res.status(400).json({ message: "Client not found" });
    }

    const { client_id } = clientRows[0];

    // 3. Insert new club
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

    // 4. Insert into club_members with role = Coordinator
    await dbase.query(
      "INSERT INTO club_members (client_id, club_id, role) VALUES (?, ?, 'Coordinator')",
      [client_id, newClubId]
    );

    // 5. Success
    return res
      .status(201)
      .json({ message: "Club created successfully! You are the Coordinator." });
  } catch (error) {
    console.error("Error creating club:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Routes
app.post("/create", handleCreateClub);
app.post("/api/clubs/create", handleCreateClub);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});