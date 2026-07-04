const dbase = require("../config/database");

const getMoMs = async (req, res) => {
  const { clubId } = req.params;
  console.log("📍 Fetching MoMs for club_id:", clubId);
  try {
    const [rows] = await dbase.query(
      "SELECT * FROM club_mom WHERE club_id = ? ORDER BY meeting_date DESC",
      [clubId]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching MoMs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMoMById = async (req, res) => {
  const { momId } = req.params;
  try {
    const [rows] = await dbase.query("SELECT * FROM club_mom WHERE mom_id = ?", [momId]);
    if (rows.length === 0) return res.status(404).json({ message: "MoM not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching MoM:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const addMoM = async (req, res) => {
  try {
    const {
      club_id, meeting_title, meeting_date, start_time, end_time,
      location, organizer_email, attendees, agenda, discussions,
      decisions, action_items, notes
    } = req.body;

    console.log("📍 Adding MoM for club_id:", club_id);

    const [result] = await dbase.query(
      `INSERT INTO club_mom 
      (club_id, meeting_title, meeting_date, start_time, end_time, location, organizer_email, attendees, agenda, discussions, decisions, action_items, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [club_id, meeting_title, meeting_date, start_time || null, end_time || null,
       location || null, organizer_email || null, attendees || null, agenda || null,
       discussions || null, decisions || null, action_items || null, notes || null]
    );

    res.status(201).json({ message: "MoM added successfully", mom_id: result.insertId });
  } catch (err) {
    console.error("❌ Error adding MoM:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteMoM = async (req, res) => {
  const { momId } = req.params;
  try {
    const [result] = await dbase.query("DELETE FROM club_mom WHERE mom_id = ?", [momId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "MoM not found" });
    res.status(200).json({ message: "MoM deleted successfully" });
  } catch (err) {
    console.error("Error deleting MoM:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMoMs, getMoMById, addMoM, deleteMoM };