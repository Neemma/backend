const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const questionRoutes = require('./routes/questions');
const upload = require('./middlewares/upload');

const app = express();

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use('/questions', questionRoutes);

// File upload routes
app.post('/upload/video', upload.single('video'), (req, res) => {
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.post('/upload/image', upload.single('image'), (req, res) => {
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

module.exports = app;
