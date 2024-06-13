const express = require('express');
const bodyParser = require('body-parser');
const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answers');
const commentRoutes = require('./routes/comments');
const voteRoutes = require('./routes/votes');
const notificationRoutes = require('./routes/notifications');
const upload = require('./middlewares/upload');

const app = express();

app.use(bodyParser.json());
app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);
app.use('/comments', commentRoutes);
app.use('/votes', voteRoutes);
app.use('/notifications', notificationRoutes);

// File upload routes
app.post('/upload/video', upload.single('video'), (req, res) => {
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.post('/upload/image', upload.single('image'), (req, res) => {
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

module.exports = app;
