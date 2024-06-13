const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments');

router.get('/questions/:id', commentController.getCommentsByQuestionId);
router.get('/answers/:id', commentController.getCommentsByAnswerId);
router.post('/questions/:id', commentController.createCommentOnQuestion);
router.post('/answers/:id', commentController.createCommentOnAnswer);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
