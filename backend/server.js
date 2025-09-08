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
// // Handle CORS preflight for all routes
// app.options('*', cors());

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

        -- Club 1
        c.club1_role AS club1_role,
        cl1.club_name AS club1_name,
        cl1.description AS club1_description,
        cl1.category AS club1_category,

        -- Club 2
        c.club2_role AS club2_role,
        cl2.club_name AS club2_name,
        cl2.description AS club2_description,
        cl2.category AS club2_category,

        -- Club 3
        c.club3_role AS club3_role,
        cl3.club_name AS club3_name,
        cl3.description AS club3_description,
        cl3.category AS club3_category

    FROM clients c
    LEFT JOIN clubs cl1 ON c.club1_id = cl1.club_id
    LEFT JOIN clubs cl2 ON c.club2_id = cl2.club_id
    LEFT JOIN clubs cl3 ON c.club3_id = cl3.club_id
    WHERE c.mail = ?;
  `;

  try {
    const [rows] = await dbase.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(rows[0]); // ✅ send profile data
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

        -- Club 1
        c.club1_role AS club1_role,
        cl1.club_name AS club1_name,
        cl1.description AS club1_description,
        cl1.category AS club1_category,

        -- Club 2
        c.club2_role AS club2_role,
        cl2.club_name AS club2_name,
        cl2.description AS club2_description,
        cl2.category AS club2_category,

        -- Club 3
        c.club3_role AS club3_role,
        cl3.club_name AS club3_name,
        cl3.description AS club3_description,
        cl3.category AS club3_category

    FROM clients c
    LEFT JOIN clubs cl1 ON c.club1_id = cl1.club_id
    LEFT JOIN clubs cl2 ON c.club2_id = cl2.club_id
    LEFT JOIN clubs cl3 ON c.club3_id = cl3.club_id
    WHERE c.mail = ?;
  `;

  try {
    const [rows] = await dbase.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(rows[0]); // ✅ send profile data
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});


//CREATE CLUB PAGE BACKEND

// // Support both legacy and new paths
// const handleCreateClub = async (req, res) => {
//     try {
//       const {
//         clubName,
//         clubDescription,
//         clubCategory,
//         clubHead,
//         clubEmail,
//         clubSocialMedia,
//         clubLogo,
//         userEmail // send from frontend (localStorage)
//       } = req.body;
  
//       // 1. Get login_id from login table
//       const [loginRows] = await dbase.query(
//         "SELECT id FROM login WHERE email = ?",
//         [userEmail]
//       );
  
//       if (loginRows.length === 0) {
//         return res.status(400).json({ message: "User not found" });
//       }
//       const loginId = loginRows[0].id;
  
//       // 2. Get client info
//       const [clientRows] = await dbase.query(
//         "SELECT club1_id, club2_id, club3_id FROM clients WHERE login_id = ?",
//         [loginId]
//       );
  
//       if (clientRows.length === 0) {
//         return res.status(400).json({ message: "Client not found" });
//       }
  
//       const { club1_id, club2_id, club3_id } = clientRows[0];
  
//       // 3. Check if already part of 3 clubs
//       if (club1_id && club2_id && club3_id) {
//         return res.status(403).json({
//           message:
//             "Already a part of 3 clubs. Upgrade to pro for more features."
//         });
//       }
  
//       // 4. Insert into clubs table
//       const clubCode =
//         clubName.substring(0, 2).toUpperCase() +
//         Date.now().toString().slice(-2); // simple code generator
  
//       await dbase.query(
//         `INSERT INTO clubs 
//           (name, code, description, category, established_date, head_name, email, phone, social_link, website, logo, is_verified, visibility, status, created_at, updated_at) 
//         VALUES (?, ?, ?, ?, NOW(), ?, ?, NULL, ?, NULL, ?, 0, 'Public', 'Active', NOW(), NOW())`,
//         [
//           clubName,
//           clubCode,
//           clubDescription,
//           clubCategory,
//           clubHead,
//           clubEmail,
//           clubSocialMedia,
//           clubLogo || "/uploads/logos/default.png"
//         ]
//       );
  
//       // 5. Success response
//       return res
//         .status(201)
//         .json({ message: "New club added, congratulations on your new club!" });
//     } catch (error) {
//       console.error("Error creating club:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   };

// app.post("/create", handleCreateClub);
// app.post("/api/clubs/create", handleCreateClub);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});