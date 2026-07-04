const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbase = require("../config/database");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email });

    const query = "SELECT id, role, password FROM login WHERE email = ?";
    const [rows] = await dbase.query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: rows[0].id, email: email, role: rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("Login successful:", rows[0].role);
    res.status(200).json({ role: rows[0].role, token: token });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

const signup = async (req, res) => {
  console.log("📍 Signup route hit");
  let connection;

  try {
    const { fullName, email, password, phone, dateOfBirth, gender, address } = req.body;

    if (!fullName || !email || !password || !phone || !dateOfBirth || !gender || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    connection = await dbase.getConnection();
    await connection.beginTransaction();

    const [existingUser] = await connection.query(
      "SELECT id FROM login WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ error: "Email already registered" });
    }

    const [loginResult] = await connection.query(
      "INSERT INTO login (email, password, role) VALUES (?, ?, 'CLIENT')",
      [email, await bcrypt.hash(password, 10)]
    );

    const loginId = loginResult.insertId;

    await connection.query(
      `INSERT INTO clients 
        (login_id, full_name, mail, phone_number, date_of_birth, gender, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [loginId, fullName, email, phone, dateOfBirth, gender, address]
    );

    await connection.commit();
    res.status(201).json({ message: "Account created successfully", email });

  } catch (err) {
    console.error("❌ Signup error:", err);
    if (connection) {
      try { await connection.rollback(); } catch (e) { }
    }
    res.status(500).json({ error: "Failed to create account. Please try again." });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { login, signup };