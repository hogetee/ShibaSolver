const express = require('express');
const { requireAuth, optionalAuth } = require("../middleware/auth");
const commentsCtrl = require('../controllers/commentsController'); 

const router = express.Router();

//GET
router.get('/user/:userId', requireAuth, commentsCtrl.getCommentsByUser);
router.get('/post/:postId/top', commentsCtrl.getTopComment);
router.get('/post/:postId', optionalAuth, commentsCtrl.getCommentsAccessControlled);
router.get('/:id', requireAuth, commentsCtrl.getComment);

//POST
router.post('/', requireAuth, commentsCtrl.createComment);
router.post('/:commentId/replies', requireAuth, commentsCtrl.replyToComment);

//PUT
router.put('/:id', requireAuth, commentsCtrl.editComment);

// PATCH (toggle flag/unflag solution)
router.patch('/:commentId/solution', requireAuth, commentsCtrl.toggleMyCommentSolution);

//DELETE
router.delete('/:id', requireAuth, commentsCtrl.deleteComment);

// export router
module.exports = router;