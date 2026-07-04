const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { getMoMs, getMoMById, addMoM, deleteMoM } = require("../controllers/momController");

router.get("/moms/:clubId", verifyToken, getMoMs);
router.get("/mom/:momId", verifyToken, getMoMById);
router.post("/moms/add", verifyToken, addMoM);
router.delete("/mom/:momId", verifyToken, deleteMoM);

module.exports = router;