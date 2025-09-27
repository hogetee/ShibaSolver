const express = require('express');
const feedCtrl = require('../controllers/feed_controller');

const router = express.Router();

router.get('/', feedCtrl.getAllFeeds);

// export router
module.exports = router;