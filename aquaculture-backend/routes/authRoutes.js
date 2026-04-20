const express = require("express");
const router = express.Router();

// ✅ ADD THIS LINE (MISSING)
const authController = require("../controllers/authController");

// const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router; 