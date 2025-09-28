const express = require('express');
const commentsCtrl = require('../controllers/commentsController'); 

const router = express.Router();

//GET
router.get('/', commentsCtrl.getAllComments);
router.get('/:id', commentsCtrl.getComment);
//POST

//PUT

//DELETE

// export router
module.exports = router;