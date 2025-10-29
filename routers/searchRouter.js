const express = require('express');
const searchCtrl = require('../controllers/searchController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

//GET
router.get('/users', optionalAuth, searchCtrl.searchUsers);



// export router
module.exports = router;