const express = require("express");
const postsCtrl = require("../controllers/postsController");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const router = express.Router();

//GET
router.get("/", postsCtrl.refreshFeed);
router.get("/bookmarks", requireAuth, postsCtrl.getBookmarks);
router.get('/:postId',optionalAuth, postsCtrl.getPost);



//POST
router.post("/bookmarks/:postId", requireAuth, postsCtrl.addBookmark);
router.post("/", requireAuth,postsCtrl.createPost);

//PUT
router.put('/:postId', requireAuth, postsCtrl.editPost)

//DELETE
router.delete("/bookmarks/:postId", requireAuth, postsCtrl.removeBookmark);
router.delete("/:postId", requireAuth, postsCtrl.deletePost);
// export router
module.exports = router;
