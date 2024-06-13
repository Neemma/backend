const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notifications');

router.get('/:userId', notificationController.getNotificationsByUserId);

module.exports = router;
