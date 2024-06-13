const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questions');

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.post('/', questionController.createQuestion);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

// Answer routes
router.post('/:id/answers', questionController.addAnswer);
router.put('/:questionId/answers/:answerId', questionController.updateAnswer);
router.delete('/:questionId/answers/:answerId', questionController.deleteAnswer);

// Comment routes
router.post('/:id/comments', questionController.addCommentToQuestion);
router.post('/:questionId/answers/:answerId/comments', questionController.addCommentToAnswer);
router.put('/:questionId/comments/:commentId', questionController.updateComment);
router.put('/:questionId/answers/:answerId/comments/:commentId', questionController.updateComment);
router.delete('/:questionId/comments/:commentId', questionController.deleteComment);
router.delete('/:questionId/answers/:answerId/comments/:commentId', questionController.deleteComment);

// Voting routes
router.post('/:id/vote', questionController.voteQuestion);
router.post('/:questionId/answers/:answerId/vote', questionController.voteAnswer);

module.exports = router;
