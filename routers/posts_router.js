const express = require('express');
const postsCtrl = require('../controllers/posts_controller'); 

const router = express.Router();

router.get('/', postsCtrl.getAllPosts);
router.get('/:id', postsCtrl.getPost);
router.post('/bookmark', postsCtrl.addBookmark);
router.get('/bookmark/:user_id', postsCtrl.getBookmarkedFeed);
// export router
module.exports = router;