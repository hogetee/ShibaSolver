const express = require('express');
const { requireAuth } = require("../middleware/auth");
const commentsCtrl = require('../controllers/commentsController'); 

const router = express.Router();

//GET
router.get('/post/:postId/popular', requireAuth, commentsCtrl.getCommentsByPopularity);
router.get('/post/:postId/latest', requireAuth, commentsCtrl.getCommentsByLatest);
router.get('/post/:postId/oldest', requireAuth, commentsCtrl.getCommentsByOldest);
router.get('/:id', requireAuth, commentsCtrl.getComment);

//POST
router.post('/', requireAuth, commentsCtrl.createComment);

//PUT
router.put('/:id', requireAuth, commentsCtrl.editComment);

//DELETE
router.delete('/:id', requireAuth, commentsCtrl.deleteComment);

// export router
module.exports = router;