const dbase = require("../config/database");

const getPublicClubs = async (req, res) => {
  try {
    const [results] = await dbase.query(
      `SELECT * FROM clubs WHERE visibility = 'Public' AND status = 'Active'`
    );
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching public clubs:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

const getProfileByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [rows] = await dbase.query(`
      SELECT c.full_name, c.mail, c.phone_number, c.date_of_birth, c.gender, c.address,
             cm.role AS club_role, cl.club_id, cl.club_name,
             cl.description AS club_description, cl.category AS club_category
      FROM clients c
      LEFT JOIN club_members cm ON c.client_id = cm.client_id
      LEFT JOIN clubs cl ON cm.club_id = cl.club_id
      WHERE c.mail = ? AND NOT cm.role = 'Request'
    `, [email]);

    if (rows.length === 0) return res.status(404).json({ message: "Profile not found" });

    res.json({
      full_name: rows[0].full_name,
      mail: rows[0].mail,
      phone_number: rows[0].phone_number,
      date_of_birth: rows[0].date_of_birth,
      gender: rows[0].gender,
      address: rows[0].address,
      clubs: rows.map(r => ({
        id: r.club_id, club_id: r.club_id, role: r.club_role,
        name: r.club_name, description: r.club_description, category: r.club_category
      })).filter(c => c.name)
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getProfileByBody = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [rows] = await dbase.query(`
      SELECT c.full_name, c.mail, c.phone_number, c.date_of_birth, c.gender, c.address,
             cm.role AS club_role, cl.club_id, cl.club_name,
             cl.description AS club_description, cl.category AS club_category
      FROM clients c
      LEFT JOIN club_members cm ON c.client_id = cm.client_id
      LEFT JOIN clubs cl ON cm.club_id = cl.club_id
      WHERE c.mail = ?
    `, [email]);

    if (rows.length === 0) return res.status(404).json({ message: "Profile not found" });

    res.json({
      full_name: rows[0].full_name,
      mail: rows[0].mail,
      phone_number: rows[0].phone_number,
      date_of_birth: rows[0].date_of_birth,
      gender: rows[0].gender,
      address: rows[0].address,
      clubs: rows.map(r => ({
        id: r.club_id, club_id: r.club_id, role: r.club_role,
        name: r.club_name, description: r.club_description, category: r.club_category
      })).filter(c => c.name !== null)
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const joinClub = async (req, res) => {
  try {
    const { userEmail, clubId } = req.body;
    if (!userEmail || !clubId) return res.status(400).json({ message: "Email and clubId are required" });

    const [clientRows] = await dbase.query("SELECT client_id FROM clients WHERE mail = ?", [userEmail]);
    if (clientRows.length === 0) return res.status(404).json({ message: "Client not found" });

    const { client_id } = clientRows[0];
    const [existing] = await dbase.query(
      "SELECT * FROM club_members WHERE client_id = ? AND club_id = ?",
      [client_id, clubId]
    );
    if (existing.length > 0) return res.status(400).json({ message: "Already a member of this club" });

    await dbase.query(
      "INSERT INTO club_members (client_id, club_id, role) VALUES (?, ?, 'Member')",
      [client_id, clubId]
    );
    await dbase.query("UPDATE clubs SET member_count = member_count + 1 WHERE club_id = ?", [clubId]);

    res.status(201).json({ message: "Joined club successfully!" });
  } catch (err) {
    console.error("Error joining club:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const createClub = async (req, res) => {
  try {
    const { clubName, clubDescription, clubCategory, clubHead, clubEmail, clubSocialMedia, clubLogo, userEmail } = req.body;

    const [loginRows] = await dbase.query("SELECT id FROM login WHERE email = ?", [userEmail]);
    if (loginRows.length === 0) return res.status(400).json({ message: "User not found" });

    const [clientRows] = await dbase.query("SELECT client_id FROM clients WHERE login_id = ?", [loginRows[0].id]);
    if (clientRows.length === 0) return res.status(400).json({ message: "Client not found" });

    const { client_id } = clientRows[0];

    const [clubResult] = await dbase.query(
      `INSERT INTO clubs 
        (club_name, description, category, founded_date, club_head, email, contact_phone, social_media, website, logo_url, member_count, visibility, status, created_at, updated_at) 
       VALUES (?, ?, ?, CURDATE(), ?, ?, NULL, ?, NULL, ?, 1, 'Public', 'Active', NOW(), NOW())`,
      [clubName, clubDescription, clubCategory, clubHead, clubEmail, clubSocialMedia || null, clubLogo || "/uploads/logos/default.png"]
    );

    await dbase.query(
      "INSERT INTO club_members (client_id, club_id, role) VALUES (?, ?, 'Coordinator')",
      [client_id, clubResult.insertId]
    );

    res.status(201).json({ message: "Club created successfully! You are the Coordinator." });
  } catch (err) {
    console.error("Error creating club:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getClubDetails = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userEmail = req.query.email;

    let clubRows;
    if (!isNaN(clubId)) {
      [clubRows] = await dbase.query("SELECT * FROM clubs WHERE club_id = ?", [clubId]);
    } else {
      [clubRows] = await dbase.query("SELECT * FROM clubs WHERE club_name = ?", [decodeURIComponent(clubId)]);
    }

    if (clubRows.length === 0) return res.status(404).json({ message: "Club not found" });

    const club = clubRows[0];

    const [memberRows] = await dbase.query(`
      SELECT c.full_name, c.mail AS email, c.phone_number, cm.role, cm.joined_at AS joined_date
      FROM club_members cm
      JOIN clients c ON cm.client_id = c.client_id
      WHERE cm.club_id = ?
    `, [club.club_id]);

    let userRole = null;
    if (userEmail) {
      const [userRoleRows] = await dbase.query(`
        SELECT cm.role FROM club_members cm
        JOIN clients c ON cm.client_id = c.client_id
        WHERE cm.club_id = ? AND c.mail = ?
      `, [club.club_id, userEmail]);
      if (userRoleRows.length > 0) userRole = userRoleRows[0].role;
    }

    res.json({
      club_id: club.club_id, club_name: club.club_name, description: club.description,
      category: club.category, member_count: club.member_count, founded_date: club.founded_date,
      club_head: club.club_head, club_email: club.email, social_media: club.social_media,
      website: club.website, logo_url: club.logo_url, visibility: club.visibility,
      status: club.status, members: memberRows, userRole, totalMembers: memberRows.length
    });
  } catch (err) {
    console.error("Error fetching club details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getClubIdByName = async (req, res) => {
  const { clubName } = req.params;
  try {
    const [rows] = await dbase.query(
      "SELECT club_id FROM clubs WHERE club_name = ?",
      [decodeURIComponent(clubName)]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Club not found" });
    res.status(200).json({ club_id: rows[0].club_id, club_name: clubName });
  } catch (err) {
    console.error("❌ Error fetching club_id:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getClubItems = async (req, res) => {
  const { clubId } = req.params;
  const { type } = req.query;
  try {
    let query = "SELECT * FROM club_items WHERE club_id = ?";
    let params = [clubId];
    if (type) { query += " AND item_type = ?"; params.push(type); }
    query += " ORDER BY created_at DESC";
    const [rows] = await dbase.query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching club items:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAnnouncements = async (req, res) => {
  const { clubId } = req.params;
  try {
    const [rows] = await dbase.query(`
      SELECT ci.*, c.full_name as author_name FROM club_items ci
      LEFT JOIN clients c ON ci.created_by = c.client_id
      WHERE ci.club_id = ? AND ci.item_type = 'announcement'
      ORDER BY ci.created_at DESC
    `, [clubId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching announcements:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getEvents = async (req, res) => {
  const { clubId } = req.params;
  try {
    const [rows] = await dbase.query(`
      SELECT ci.*, c.full_name as author_name FROM club_items ci
      LEFT JOIN clients c ON ci.created_by = c.client_id
      WHERE ci.club_id = ? AND ci.item_type = 'event'
      ORDER BY ci.start_date ASC
    `, [clubId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getTargets = async (req, res) => {
  const { clubId } = req.params;
  try {
    const [rows] = await dbase.query(`
      SELECT ci.*, c.full_name as author_name FROM club_items ci
      LEFT JOIN clients c ON ci.created_by = c.client_id
      WHERE ci.club_id = ? AND ci.item_type = 'target'
      ORDER BY ci.created_at DESC
    `, [clubId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching targets:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const createAnnouncement = async (req, res) => {
  const { clubId } = req.params;
  const { title, description, priority, visibility, userEmail } = req.body;
  try {
    const [clientRows] = await dbase.query("SELECT client_id FROM clients WHERE mail = ?", [userEmail]);
    if (clientRows.length === 0) return res.status(404).json({ message: "User not found" });

    const [result] = await dbase.query(`
      INSERT INTO club_items (club_id, created_by, item_type, title, description, priority, visibility, status)
      VALUES (?, ?, 'announcement', ?, ?, ?, ?, 'active')
    `, [clubId, clientRows[0].client_id, title, description, priority || 'medium', visibility || 'club_members']);

    res.status(201).json({ message: "Announcement created successfully", item_id: result.insertId });
  } catch (err) {
    console.error("❌ Error creating announcement:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const createEvent = async (req, res) => {
  const { clubId } = req.params;
  const { title, description, start_date, end_date, priority, visibility, userEmail } = req.body;
  try {
    const [clientRows] = await dbase.query("SELECT client_id FROM clients WHERE mail = ?", [userEmail]);
    if (clientRows.length === 0) return res.status(404).json({ message: "User not found" });

    const [result] = await dbase.query(`
      INSERT INTO club_items (club_id, created_by, item_type, title, description, start_date, end_date, priority, visibility, status)
      VALUES (?, ?, 'event', ?, ?, ?, ?, ?, ?, 'active')
    `, [clubId, clientRows[0].client_id, title, description, start_date, end_date || start_date, priority || 'medium', visibility || 'club_members']);

    res.status(201).json({ message: "Event created successfully", item_id: result.insertId });
  } catch (err) {
    console.error("❌ Error creating event:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const createTarget = async (req, res) => {
  const { clubId } = req.params;
  const { title, description, end_date, priority, visibility, userEmail } = req.body;
  try {
    const [clientRows] = await dbase.query("SELECT client_id FROM clients WHERE mail = ?", [userEmail]);
    if (clientRows.length === 0) return res.status(404).json({ message: "User not found" });

    const [result] = await dbase.query(`
      INSERT INTO club_items (club_id, created_by, item_type, title, description, end_date, priority, visibility, status)
      VALUES (?, ?, 'target', ?, ?, ?, ?, ?, 'active')
    `, [clubId, clientRows[0].client_id, title, description, end_date, priority || 'urgent', visibility || 'officers_only']);

    res.status(201).json({ message: "Target created successfully", item_id: result.insertId });
  } catch (err) {
    console.error("❌ Error creating target:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateItemStatus = async (req, res) => {
  const { itemId } = req.params;
  const { status } = req.body;
  try {
    const [result] = await dbase.query("UPDATE club_items SET status = ? WHERE item_id = ?", [status, itemId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    const [result] = await dbase.query("DELETE FROM club_items WHERE item_id = ?", [itemId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting item:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const submitJoinRequest = async (req, res) => {
  try {
    const { userEmail, clubId, requestReason } = req.body;
    if (!userEmail || !clubId || !requestReason) {
      return res.status(400).json({ message: "Email, clubId, and reason required" });
    }

    const [clientRows] = await dbase.query("SELECT client_id FROM clients WHERE mail = ?", [userEmail]);
    if (clientRows.length === 0) return res.status(404).json({ message: "Client not found" });

    const { client_id } = clientRows[0];
    const [existing] = await dbase.query(
      "SELECT * FROM club_members WHERE client_id = ? AND club_id = ?",
      [client_id, clubId]
    );

    if (existing.length > 0) {
      if (existing[0].role === "Request") return res.status(400).json({ message: "Already requested to join this club" });
      return res.status(400).json({ message: "Already a member of this club" });
    }

    await dbase.query(
      "INSERT INTO club_members (client_id, club_id, role, request_reason) VALUES (?, ?, 'Request', ?)",
      [client_id, clubId, requestReason]
    );
    res.status(201).json({ message: "Join request submitted!" });
  } catch (err) {
    console.error("Error submitting join request:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserJoinRequests = async (req, res) => {
  const userEmail = req.query.email;
  if (!userEmail) return res.status(400).json({ message: "Email query parameter is required" });

  try {
    const [clientRows] = await dbase.query("SELECT client_id FROM clients WHERE mail = ?", [userEmail]);
    if (clientRows.length === 0) return res.status(404).json({ message: "Client not found" });

    const [requests] = await dbase.query(`
      SELECT cm.club_id, cm.role, cm.request_reason, cm.joined_at AS requestDate,
             cl.club_name AS clubName, cl.description AS clubDescription, cl.category AS clubCategory
      FROM club_members cm
      JOIN clubs cl ON cm.club_id = cl.club_id
      WHERE cm.client_id = ? AND cm.role = 'Request'
    `, [clientRows[0].client_id]);

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching join requests:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getClubJoinRequests = async (req, res) => {
  const { clubId } = req.params;
  try {
    const [results] = await dbase.query(`
      SELECT cm.client_id, cm.request_reason, cm.joined_at, c.full_name, c.mail
      FROM club_members cm
      JOIN clients c ON cm.client_id = c.client_id
      WHERE cm.club_id = ? AND cm.role = 'Request'
      ORDER BY cm.joined_at DESC
    `, [clubId]);
    res.json(results);
  } catch (err) {
    console.error("Error fetching join requests:", err);
    res.status(500).json({ error: "Failed to fetch join requests" });
  }
};

const acceptJoinRequest = async (req, res) => {
  const { clubId, clientId } = req.params;
  try {
    await dbase.query(
      "UPDATE club_members SET role = 'Member', request_reason = NULL WHERE club_id = ? AND client_id = ? AND role = 'Request'",
      [clubId, clientId]
    );
    res.json({ message: "Request accepted successfully" });
  } catch (err) {
    console.error("Error accepting request:", err);
    res.status(500).json({ error: "Failed to accept request" });
  }
};

const rejectJoinRequest = async (req, res) => {
  const { clubId, clientId } = req.params;
  try {
    await dbase.query(
      "DELETE FROM club_members WHERE club_id = ? AND client_id = ? AND role = 'Request'",
      [clubId, clientId]
    );
    res.json({ message: "Request rejected successfully" });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ error: "Failed to reject request" });
  }
};

const addMember = async (req, res) => {
  const { clubId } = req.params;
  const { memberEmail, role } = req.body;

  if (!memberEmail || !role) return res.status(400).json({ message: "Email and role are required" });

  const validRoles = ["Member", "Coordinator"];
  if (!validRoles.includes(role)) return res.status(400).json({ message: "Invalid role. Must be 'Member' or 'Coordinator'" });

  try {
    const [clientRows] = await dbase.query(
      "SELECT client_id, full_name FROM clients WHERE mail = ?",
      [memberEmail]
    );
    if (clientRows.length === 0) return res.status(404).json({ message: "User with this email not found. They need to sign up first." });

    const { client_id, full_name } = clientRows[0];
    const [existingMember] = await dbase.query(
      "SELECT * FROM club_members WHERE client_id = ? AND club_id = ?",
      [client_id, clubId]
    );

    if (existingMember.length > 0) {
      if (existingMember[0].role === "Request") {
        await dbase.query(
          "UPDATE club_members SET role = ?, request_reason = NULL WHERE client_id = ? AND club_id = ?",
          [role, client_id, clubId]
        );
        return res.status(200).json({ message: `${full_name} has been added as ${role}`, updated: true });
      }
      return res.status(400).json({ message: "This user is already a member of the club" });
    }

    await dbase.query("INSERT INTO club_members (client_id, club_id, role) VALUES (?, ?, ?)", [client_id, clubId, role]);
    await dbase.query("UPDATE clubs SET member_count = member_count + 1 WHERE club_id = ?", [clubId]);

    res.status(201).json({ message: `${full_name} has been added as ${role}`, clientId: client_id, fullName: full_name });
  } catch (err) {
    console.error("❌ Error adding member:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getPublicClubs, getProfileByEmail, getProfileByBody, joinClub, createClub,
  getClubDetails, getClubIdByName, getClubItems, getAnnouncements, getEvents,
  getTargets, createAnnouncement, createEvent, createTarget, updateItemStatus,
  deleteItem, submitJoinRequest, getUserJoinRequests, getClubJoinRequests,
  acceptJoinRequest, rejectJoinRequest, addMember
};