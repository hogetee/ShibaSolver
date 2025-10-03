const express = require('express');
const { requireAuth } = require("../middleware/auth");
const commentsCtrl = require('../controllers/commentsController'); 

const router = express.Router();

//GET
router.get('/', commentsCtrl.getAllComments);
router.get('/:id', commentsCtrl.getComment);
//POST
router.post('/', requireAuth, commentsCtrl.createComment);
//PUT

//DELETE

// export router
module.exports = router;