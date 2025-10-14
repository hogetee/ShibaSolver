const express = require("express");
const { googleLogin, logout ,getMe} = require("../controllers/authController");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const router = express.Router();

router.post("/google", googleLogin);
router.post("/logout", logout);
router.get("/me", requireAuth ,optionalAuth, getMe);

module.exports = router;
