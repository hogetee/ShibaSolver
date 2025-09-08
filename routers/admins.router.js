const express = require('express');
const adminsCtrl = require('../controllers/admins.controller'); 

const router = express.Router();

router.get('/', adminsCtrl.listAdmins);
router.get('/:id', adminsCtrl.getAdmin);

// export router
module.exports = router;