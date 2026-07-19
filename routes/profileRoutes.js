const express = require("express");
const router = express.Router();
const { 
  getProfile,
  updateProfile 
} = require("../controllers/profileController");

// 1. Import it as protect
const protect = require("../middleware/authMiddleware");

// 2. Use protect right here:
router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);

module.exports = router;