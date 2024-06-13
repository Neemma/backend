const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questions');

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.post('/', questionController.createQuestion);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);
router.get('/search', questionController.searchQuestions);
router.get('/tags/:tag', questionController.filterQuestionsByTag);

module.exports = router;
