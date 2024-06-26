const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const questionRoutes = require('./routes/questions');
const db = require('./db'); // Ensure you have db.js configured properly
require('dotenv').config();

const app = express();

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use('/questions', questionRoutes);

// Configure multer for file uploads with size limits
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

// Upload Image Endpoint
app.post('/upload/image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { originalname, mimetype, buffer } = req.file;
    
    const queryText = `
        INSERT INTO files (filename, mimetype, data) 
        VALUES ($1, $2, $3) 
        RETURNING id, filename, mimetype, created_at
    `;
    const values = [originalname, mimetype, buffer];

    try {
        const result = await db.query(queryText, values);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload Video Endpoint
app.post('/upload/video', upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { originalname, mimetype, buffer } = req.file;

    const queryText = `
        INSERT INTO files (filename, mimetype, data) 
        VALUES ($1, $2, $3) 
        RETURNING id, filename, mimetype, created_at
    `;
    const values = [originalname, mimetype, buffer];

    try {
        const result = await db.query(queryText, values);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).send('File size exceeds the allowed limit.');
    }
    res.status(500).send(err.message);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
