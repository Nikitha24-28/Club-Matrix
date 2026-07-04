const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const { getAllClubs, blockClub, unblockClub, requestUnblock, getBlockStatus } = require("../controllers/adminController");

router.get("/admin/clubs", verifyToken, requireRole("ADMIN"), getAllClubs);
router.post("/admin/clubs/:clubId/block", verifyToken, requireRole("ADMIN"), blockClub);
router.post("/admin/clubs/:clubId/unblock", verifyToken, requireRole("ADMIN"), unblockClub);
router.post("/clubs/:clubId/request-unblock", verifyToken, requestUnblock);
router.get("/clubs/:clubId/block-status", verifyToken, getBlockStatus);

module.exports = router;