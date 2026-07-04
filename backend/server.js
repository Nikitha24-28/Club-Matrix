const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

const dbase = require("./src/config/database");
const authRoutes = require("./src/routes/auth");
const clubRoutes = require("./src/routes/clubs");
const momRoutes = require("./src/routes/moms");
const adminRoutes = require("./src/routes/admin");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Test DB connection
(async () => {
  try {
    const connection = await dbase.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();

// Routes
app.use("/", authRoutes);
app.use("/", clubRoutes);
app.use("/api", momRoutes);
app.use("/api", adminRoutes);

// Cron job — delete clubs blocked for 30+ days
cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Running scheduled task: Delete clubs blocked for 30+ days");
  try {
    const [clubsToDelete] = await dbase.query(`
      SELECT club_id, club_name FROM clubs
      WHERE block_status = 'Blocked' AND DATEDIFF(NOW(), updated_at) >= 30
    `);

    for (const club of clubsToDelete) {
      await dbase.query("DELETE FROM club_members WHERE club_id = ?", [club.club_id]);
      await dbase.query("DELETE FROM club_items WHERE club_id = ?", [club.club_id]);
      await dbase.query("DELETE FROM club_mom WHERE club_id = ?", [club.club_id]);
      await dbase.query("DELETE FROM clubs WHERE club_id = ?", [club.club_id]);
      console.log(`✅ Deleted club: ${club.club_name} (ID: ${club.club_id})`);
    }

    if (clubsToDelete.length === 0) console.log("No clubs to delete");
  } catch (err) {
    console.error("❌ Error in scheduled deletion:", err);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});