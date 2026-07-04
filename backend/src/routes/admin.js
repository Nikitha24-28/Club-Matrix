const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { getAllClubs, blockClub, unblockClub, requestUnblock, getBlockStatus } = require("../controllers/adminController");

router.get("/admin/clubs", verifyToken, getAllClubs);
router.post("/admin/clubs/:clubId/block", verifyToken, blockClub);
router.post("/admin/clubs/:clubId/unblock", verifyToken, unblockClub);
router.post("/clubs/:clubId/request-unblock", verifyToken, requestUnblock);
router.get("/clubs/:clubId/block-status", verifyToken, getBlockStatus);

module.exports = router;