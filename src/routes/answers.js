const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answers');

router.get('/:id', answerController.getAnswersByQuestionId);
router.post('/:id', answerController.createAnswer);
router.put('/:id', answerController.updateAnswer);
router.delete('/:id', answerController.deleteAnswer);

module.exports = router;
