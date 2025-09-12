const express = require('express');
const postsCtrl = require('../controllers/posts_controller'); 

const router = express.Router();

router.get('/', postsCtrl.getAllPosts);
router.get('/:id', postsCtrl.getPost);
router.post('/bookmarks', postsCtrl.addBookmark);
router.get('/bookmarks/:user_id', postsCtrl.getBookmarks);
// export router
module.exports = router;