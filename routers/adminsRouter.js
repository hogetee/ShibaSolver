const express = require('express');
const adminsCtrl = require('../controllers/adminsController'); 

const router = express.Router();

//GET
router.get('/', adminsCtrl.getAllAdmins);
router.get('/:id', adminsCtrl.getAdmin);

// export router
module.exports = router;