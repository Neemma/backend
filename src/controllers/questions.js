const fs = require('fs');
const questions = require('../data/questions.json');
const writeQuestions = (data) => fs.writeFileSync('src/data/questions.json', JSON.stringify(data, null, 2));

const getAllQuestions = (req, res) => {
    res.json(questions);
};

const getQuestionById = (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.id));
    if (question) {
        res.json(question);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const createQuestion = (req, res) => {
    const question = {
        id: questions.length + 1,
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags || [],
        votes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    questions.push(question);
    writeQuestions(questions);
    res.status(201).json(question);
};

const updateQuestion = (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.id));
    if (question) {
        question.title = req.body.title || question.title;
        question.body = req.body.body || question.body;
        question.tags = req.body.tags || question.tags;
        question.updatedAt = new Date();
        writeQuestions(questions);
        res.json(question);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const deleteQuestion = (req, res) => {
    const index = questions.findIndex(q => q.id === parseInt(req.params.id));
    if (index !== -1) {
        questions.splice(index, 1);
        writeQuestions(questions);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const searchQuestions = (req, res) => {
    const keyword = req.query.q;
    const filteredQuestions = questions.filter(q => q.title.includes(keyword) || q.body.includes(keyword));
    res.json(filteredQuestions);
};

const filterQuestionsByTag = (req, res) => {
    const tag = req.params.tag;
    const filteredQuestions = questions.filter(q => q.tags.includes(tag));
    res.json(filteredQuestions);
};

module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    searchQuestions,
    filterQuestionsByTag
};
