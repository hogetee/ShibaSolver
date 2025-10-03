const express = require("express");
const postsCtrl = require("../controllers/postsController");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

//GET
router.get("/", postsCtrl.refreshFeed);
router.get('/:postId', postsCtrl.getPost);
router.get("/bookmarks/:user_id", requireAuth, postsCtrl.getBookmarks);

//POST
router.post("/bookmarks", requireAuth, postsCtrl.addBookmark);
router.post("/", requireAuth,postsCtrl.createPost);

//PUT
router.put('/:postId', requireAuth, postsCtrl.editPost);

//DELETE
router.delete("/:postId", requireAuth, postsCtrl.deletePost);
// export router
module.exports = router;
