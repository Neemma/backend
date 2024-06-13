const fs = require('fs');
const answers = require('../data/answers.json');
const questions = require('../data/questions.json');
const writeAnswers = (data) => fs.writeFileSync('src/data/answers.json', JSON.stringify(data, null, 2));

const getAnswersByQuestionId = (req, res) => {
    const questionId = parseInt(req.params.id);
    const questionAnswers = answers.filter(a => a.questionId === questionId);
    res.json(questionAnswers);
};

const createAnswer = (req, res) => {
    const questionId = parseInt(req.params.id);
    const question = questions.find(q => q.id === questionId);
    if (question) {
        const answer = {
            id: answers.length + 1,
            questionId: questionId,
            body: req.body.body,
            votes: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        answers.push(answer);
        writeAnswers(answers);
        res.status(201).json(answer);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const updateAnswer = (req, res) => {
    const answer = answers.find(a => a.id === parseInt(req.params.id));
    if (answer) {
        answer.body = req.body.body || answer.body;
        answer.updatedAt = new Date();
        writeAnswers(answers);
        res.json(answer);
    } else {
        res.status(404).json({ message: 'Answer not found' });
    }
};

const deleteAnswer = (req, res) => {
    const index = answers.findIndex(a => a.id === parseInt(req.params.id));
    if (index !== -1) {
        answers.splice(index, 1);
        writeAnswers(answers);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Answer not found' });
    }
};

module.exports = {
    getAnswersByQuestionId,
    createAnswer,
    updateAnswer,
    deleteAnswer
};
