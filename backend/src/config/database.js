const mysql = require("mysql2/promise");
const db = require("./db").development;

const dbase = mysql.createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database,
});

module.exports = dbase;