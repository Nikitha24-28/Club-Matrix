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
// Handle CORS preflight for all routes
app.options('*', cors());

// Database Connection (promise pool)
const dbase = mysql.createPool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password }); 

    const query = "SELECT role FROM login WHERE email = ? AND password = ?";
    dbase.query(query, [email, password], (err, result) => {
        if (err) {
            console.error("Database error:", err); 
            return res.status(500).json({ error: "Database query failed" });
        }

        if (result.length === 0) {
            console.log("Invalid credentials for:", email);
            return res.status(404).json({ error: "Invalid credentials" });
        }

        console.log("Login successful:", result[0].role);
        res.status(200).json({ role: result[0].role });
    });
});

// Route to get all Public Clubs
app.get("/clubs/public", (req, res) => {
    const query = `SELECT * FROM clubs WHERE visibility = 'Public' AND status = 'Active'`;

    dbase.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching public clubs:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No public clubs found" });
        }

        res.status(200).json(results);
    });
});

//CREATE CLUB PAGE BACKEND

// Support both legacy and new paths
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
        userEmail // send from frontend (localStorage)
      } = req.body;
  
      // 1. Get login_id from login table
      const [loginRows] = await dbase.query(
        "SELECT id FROM login WHERE email = ?",
        [userEmail]
      );
  
      if (loginRows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }
      const loginId = loginRows[0].id;
  
      // 2. Get client info
      const [clientRows] = await dbase.query(
        "SELECT club1_id, club2_id, club3_id FROM clients WHERE login_id = ?",
        [loginId]
      );
  
      if (clientRows.length === 0) {
        return res.status(400).json({ message: "Client not found" });
      }
  
      const { club1_id, club2_id, club3_id } = clientRows[0];
  
      // 3. Check if already part of 3 clubs
      if (club1_id && club2_id && club3_id) {
        return res.status(403).json({
          message:
            "Already a part of 3 clubs. Upgrade to pro for more features."
        });
      }
  
      // 4. Insert into clubs table
      const clubCode =
        clubName.substring(0, 2).toUpperCase() +
        Date.now().toString().slice(-2); // simple code generator
  
      await dbase.query(
        `INSERT INTO clubs 
          (name, code, description, category, established_date, head_name, email, phone, social_link, website, logo, is_verified, visibility, status, created_at, updated_at) 
        VALUES (?, ?, ?, ?, NOW(), ?, ?, NULL, ?, NULL, ?, 0, 'Public', 'Active', NOW(), NOW())`,
        [
          clubName,
          clubCode,
          clubDescription,
          clubCategory,
          clubHead,
          clubEmail,
          clubSocialMedia,
          clubLogo || "/uploads/logos/default.png"
        ]
      );
  
      // 5. Success response
      return res
        .status(201)
        .json({ message: "New club added, congratulations on your new club!" });
    } catch (error) {
      console.error("Error creating club:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

app.post("/create", handleCreateClub);
app.post("/api/clubs/create", handleCreateClub);

// PROFILE ROUTE
app.get("/profile/:email", async (req, res) => {
    try {
      const { email } = req.params;
  
      // 1. Get login_id + email
      const [loginRows] = await dbase.query(
        "SELECT id, email, role, created_at FROM login WHERE email = ?",
        [email]
      );
  
      if (loginRows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const loginData = loginRows[0];
  
      // 2. Get client details with login_id
      const [clientRows] = await dbase.query(
        `SELECT 
            id AS client_id,
            login_id,
            name,
            reg_no,
            phone,
            department,
            year,
            section,
            club1_id, club1_role,
            club2_id, club2_role,
            club3_id, club3_role
         FROM clients
         WHERE login_id = ?`,
        [loginData.id]
      );
  
      if (clientRows.length === 0) {
        return res.status(404).json({ message: "Client details not found" });
      }
  
      const clientData = clientRows[0];
  
      // 3. Merge login + client data
      const profile = {
        email: loginData.email,
        role: loginData.role,
        created_at: loginData.created_at,
        ...clientData
      };
  
      res.status(200).json(profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});