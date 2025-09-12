const express = require("express");
const { googleLogin, logout } = require("../controllers/auth");

const router = express.Router();

router.post("/google", googleLogin);
router.post("/logout", logout);

module.exports = router;