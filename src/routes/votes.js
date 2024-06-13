const express = require('express');
const router = express.Router();
const voteController = require('../controllers/votes');

router.post('/questions/:id', voteController.voteQuestion);
router.post('/answers/:id', voteController.voteAnswer);

module.exports = router;
