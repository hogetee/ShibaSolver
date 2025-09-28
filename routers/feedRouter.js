const express = require('express');
const feedCtrl = require('../controllers/feedsController');

const router = express.Router();

//GET
router.get('/', feedCtrl.getAllFeeds);

//POST

//PUT

//DELETE

// export router
module.exports = router;