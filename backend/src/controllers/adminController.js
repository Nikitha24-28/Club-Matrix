const dbase = require("../config/database");

const getAllClubs = async (req, res) => {
  try {
    const [clubs] = await dbase.query(`
      SELECT club_id, club_name, email, visibility, status,
             block_status, block_reason, created_at, updated_at
      FROM clubs
      ORDER BY created_at DESC
    `);
    res.status(200).json(clubs);
  } catch (err) {
    console.error("Error fetching clubs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const blockClub = async (req, res) => {
  const { clubId } = req.params;
  const { blockReason } = req.body;

  if (!blockReason || blockReason.trim() === "") {
    return res.status(400).json({ message: "Block reason is required" });
  }

  try {
    const [result] = await dbase.query(
      `UPDATE clubs SET block_status = 'Blocked', block_reason = ?, updated_at = NOW()
       WHERE club_id = ? AND block_status = 'Unblocked'`,
      [blockReason.trim(), clubId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Club not found or already blocked" });
    }

    res.status(200).json({ message: "Club blocked successfully", blockReason: blockReason.trim() });
  } catch (err) {
    console.error("❌ Error blocking club:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const unblockClub = async (req, res) => {
  const { clubId } = req.params;

  try {
    const [result] = await dbase.query(
      `UPDATE clubs SET block_status = 'Unblocked', block_reason = NULL, updated_at = NOW()
       WHERE club_id = ? AND block_status = 'Blocked'`,
      [clubId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Club not found or already unblocked" });
    }

    res.status(200).json({ message: "Club unblocked successfully" });
  } catch (err) {
    console.error("❌ Error unblocking club:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const requestUnblock = async (req, res) => {
  const { clubId } = req.params;
  const { unblockReason, userEmail } = req.body;

  if (!unblockReason || unblockReason.trim() === "") {
    return res.status(400).json({ message: "Reason for unblocking is required" });
  }

  try {
    const [coordinatorCheck] = await dbase.query(
      `SELECT cm.role FROM club_members cm
       JOIN clients c ON cm.client_id = c.client_id
       WHERE cm.club_id = ? AND c.mail = ? AND cm.role = 'Coordinator'`,
      [clubId, userEmail]
    );

    if (coordinatorCheck.length === 0) {
      return res.status(403).json({ message: "Only coordinators can request unblock" });
    }

    const [result] = await dbase.query(
      `UPDATE clubs SET block_reason = ?, updated_at = NOW()
       WHERE club_id = ? AND block_status = 'Blocked'`,
      [`UNBLOCK_REQUEST: ${unblockReason.trim()}`, clubId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Club not found or not blocked" });
    }

    res.status(200).json({ message: "Unblock request submitted successfully. Admin will review your request." });
  } catch (err) {
    console.error("❌ Error submitting unblock request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getBlockStatus = async (req, res) => {
  const { clubId } = req.params;

  try {
    const [rows] = await dbase.query(
      `SELECT block_status, block_reason, updated_at,
              DATEDIFF(NOW(), updated_at) as days_blocked
       FROM clubs WHERE club_id = ?`,
      [clubId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }

    const clubData = rows[0];
    const daysRemaining = clubData.block_status === "Blocked"
      ? Math.max(0, 30 - clubData.days_blocked)
      : null;

    res.status(200).json({
      blockStatus: clubData.block_status,
      blockReason: clubData.block_reason,
      daysBlocked: clubData.days_blocked,
      daysRemaining,
      willBeDeleted: clubData.block_status === "Blocked" && clubData.days_blocked >= 30
    });
  } catch (err) {
    console.error("Error fetching block status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getAllClubs, blockClub, unblockClub, requestUnblock, getBlockStatus };