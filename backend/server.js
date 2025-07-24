const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./src/config/db").development;

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database Connection
const dbase = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});

dbase.connect((error) => {
    if (error) {
        console.error("Database Connection Failed:", error.message);
        return;
    }
    console.log("Connected to Database");
    
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



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});