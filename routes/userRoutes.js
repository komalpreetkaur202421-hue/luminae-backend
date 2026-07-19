const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
} = require("../controllers/userController");

router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Welcome! You are authorized.",
    user: req.user,
  });
});

module.exports = router;