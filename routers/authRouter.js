const express = require("express");
const { googleLogin, logout ,getMe} = require("../controllers/authController");
const { requireAuth} = require("../middleware/auth");
const router = express.Router();

router.post("/google", googleLogin);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);

module.exports = router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

