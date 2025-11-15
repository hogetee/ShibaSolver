const express = require('express');
const { requireAuth } = require("../middleware/auth");
const  notiCtrl= require('../controllers/notificationsController'); 
const router = express.Router();

router.use(requireAuth);

//GET
router.get('/', notiCtrl.getNotifications);
router.get('/unread', notiCtrl.getUnreadNotifications);
router.get('/unread-count', notiCtrl.getUnreadCount);

//PATCH
router.patch('/:id/read', notiCtrl.markAsRead);
router.patch('/read-all', notiCtrl.markAllAsRead);

module.exports = router;