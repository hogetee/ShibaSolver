const express = require('express');
const { loginAdmin, logoutAdmin } = require('../controllers/adminAuthController');
const { adminProtect } = require('../middleware/adminAuth');
const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', adminProtect, logoutAdmin);

module.exports = router;