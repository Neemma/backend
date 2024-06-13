const fs = require('fs');
const notifications = require('../data/notifications.json');
const writeNotifications = (data) => fs.writeFileSync('src/data/notifications.json', JSON.stringify(data, null, 2));

const getNotificationsByUserId = (req, res) => {
    const userId = parseInt(req.params.userId);
    const userNotifications = notifications.filter(n => n.userId === userId);
    res.json(userNotifications);
};

const notifyUser = (userId, message) => {
    const notification = {
        id: notifications.length + 1,
        userId: userId,
        message: message,
        read: false,
        createdAt: new Date(),
    };
    notifications.push(notification);
    writeNotifications(notifications);
};

module.exports = {
    getNotificationsByUserId,
    notifyUser
};
