const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  getPublicClubs, getProfileByEmail, getProfileByBody, joinClub, createClub,
  getClubDetails, getClubIdByName, getClubItems, getAnnouncements, getEvents,
  getTargets, createAnnouncement, createEvent, createTarget, updateItemStatus,
  deleteItem, submitJoinRequest, getUserJoinRequests, getClubJoinRequests,
  acceptJoinRequest, rejectJoinRequest, addMember
} = require("../controllers/clubController");

router.get("/clubs_fetch", getPublicClubs);
router.get("/profile/:email", verifyToken, getProfileByEmail);
router.post("/profile", verifyToken, getProfileByBody);
router.post("/clubs/join", verifyToken, joinClub);
router.post("/create", verifyToken, createClub);
router.post("/api/clubs/create", verifyToken, createClub);
router.get("/club/:clubId", verifyToken, getClubDetails);
router.get("/api/club/id/:clubName", verifyToken, getClubIdByName);
router.get("/api/club/:clubId/items", verifyToken, getClubItems);
router.get("/api/club/:clubId/announcements", verifyToken, getAnnouncements);
router.get("/api/club/:clubId/events", verifyToken, getEvents);
router.get("/api/club/:clubId/targets", verifyToken, getTargets);
router.post("/api/club/:clubId/announcements", verifyToken, createAnnouncement);
router.post("/api/club/:clubId/events", verifyToken, createEvent);
router.post("/api/club/:clubId/targets", verifyToken, createTarget);
router.put("/api/club/items/:itemId/status", verifyToken, updateItemStatus);
router.delete("/api/club/items/:itemId", verifyToken, deleteItem);
router.post("/clubs/request", verifyToken, submitJoinRequest);
router.get("/clubs/requests", verifyToken, getUserJoinRequests);
router.get("/api/club/:clubId/join-requests", verifyToken, getClubJoinRequests);
router.post("/api/club/:clubId/join-requests/:clientId/accept", verifyToken, acceptJoinRequest);
router.delete("/api/club/:clubId/join-requests/:clientId/reject", verifyToken, rejectJoinRequest);
router.post("/api/club/:clubId/add-member", verifyToken, addMember);

module.exports = router;