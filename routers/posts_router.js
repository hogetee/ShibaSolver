const express = require('express');
const postsCtrl = require('../controllers/posts_controller'); 

const router = express.Router();

router.get('/', postsCtrl.getAllPosts);
router.get('/:id', postsCtrl.getPost);


// export router
module.exports = router;