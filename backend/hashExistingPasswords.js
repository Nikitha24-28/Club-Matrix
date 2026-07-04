const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function hashExistingPasswords() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Fetch all users
  const [users] = await db.query("SELECT id, password FROM login");
  console.log(`Found ${users.length} users to update`);

  for (const user of users) {
    // Skip already hashed passwords (bcrypt hashes start with $2b$)
    if (user.password.startsWith("$2b$")) {
      console.log(`User ${user.id} already hashed, skipping`);
      continue;
    }

    const hashed = await bcrypt.hash(user.password, 10);
    await db.query("UPDATE login SET password = ? WHERE id = ?", [hashed, user.id]);
    console.log(`✅ Hashed password for user ${user.id}`);
  }

  console.log("Done! All passwords hashed.");
  await db.end();
}

hashExistingPasswords();