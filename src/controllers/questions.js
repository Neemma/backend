const db = require('../db');

const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

const getAllQuestions = (req, res) => {
    const questions = db.get('questions').value();
    res.json(questions);
};

const getQuestionById = (req, res) => {
    const question = db.get('questions').find({ id: parseInt(req.params.id) }).value();
    if (question) {
        res.json(question);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const createQuestion = (req, res) => {
    const question = {
        id: generateId(),
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags || [],
        answers: [],
        comments: [],
        votes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    db.get('questions').push(question).write();
    res.status(201).json(question);
};

const updateQuestion = (req, res) => {
    const question = db.get('questions').find({ id: parseInt(req.params.id) }).assign({
        title: req.body.title || question.title,
        body: req.body.body || question.body,
        tags: req.body.tags || question.tags,
        updatedAt: new Date(),
    }).write();
    res.json(question);
};

const deleteQuestion = (req, res) => {
    db.get('questions').remove({ id: parseInt(req.params.id) }).write();
    res.status(204).send();
};

// Answer Management
const addAnswer = (req, res) => {
    const question = db.get('questions').find({ id: parseInt(req.params.id) }).value();
    if (question) {
        const answer = {
            id: generateId(),
            body: req.body.body,
            comments: [],
            votes: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        db.get('questions').find({ id: parseInt(req.params.id) }).get('answers').push(answer).write();
        res.status(201).json(answer);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const updateAnswer = (req, res) => {
    const question = db.get('questions').find({ id: parseInt(req.params.questionId) }).value();
    if (question) {
        const answer = db.get('questions').find({ id: parseInt(req.params.questionId) }).get('answers').find({ id: parseInt(req.params.answerId) }).assign({
            body: req.body.body || answer.body,
            updatedAt: new Date(),
        }).write();
        res.json(answer);
    } else {
        res.status(404).json({ message: 'Answer not found' });
    }
};

const deleteAnswer = (req, res) => {
    const question = db.get('questions').find({ id: parseInt(req.params.questionId) }).value();
    if (question) {
        db.get('questions').find({ id: parseInt(req.params.questionId) }).get('answers').remove({ id: parseInt(req.params.answerId) }).write();
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Answer not found' });
    }
};

// Comment Management
const addCommentToQuestion = (req, res) => {
    const question = db.get('questions').find({ id: parseInt(req.params.id) }).value();
    if (question) {
        const comment = {
            id: generateId(),
            body: req.body.body,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        db.get('questions').find({ id: parseInt(req.params.id) }).get('comments').push(comment).write();
        res.status(201).json(comment);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const addCommentToAnswer = (req, res) => {
    const question = db.get('questions').find({ id: parseInt(req.params.questionId) }).value();
    if (question) {
        const answer = db.get('questions').find({ id: parseInt(req.params.questionId) }).get('answers').find({ id: parseInt(req.params.answerId) }).value();
        if (answer) {
            const comment = {
                id: generateId(),
                body: req.body.body,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            db.get('questions').find({ id: parseInt(req.params.questionId) }).get('answers').find({ id: parseInt(req.params.answerId) }).get('comments').push(comment).write();
            res.status(201).json(comment);
        } else {
            res.status(404).json({ message: 'Answer not found' });
        }
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const updateComment = (req, res) => {
    const question = db.get('questions').find({ id: parseInt(req.params.questionId) }).value();
    if (question) {
        const comment = db.get('questions').find({ id: parseInt(req.params.questionId) }).get('comments').find({ id: parseInt(req.params.commentId) }).assign({
            body: req.body.body || comment.body,
            updatedAt: new Date(),
        }).write();
        res.json(comment);
    } else {
        const answer = db.get('questions').find({ id: parseInt(req.params.questionId) }).get('answers').find({ id: parseInt(req.params.answerId) }).value();
        if (answer) {
            const comment = db.get('questions').find({ id: parseInt(req.params.questionId) }).get('answers').find({ id: parseInt(req.params.answerId) }).get('comments').find({ id: parseInt(req.params.commentId) }).assign({
                body: req.body.body || comment.body,
                updatedAt: new Date(),
            }).write();
            res.json(comment);
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    }
};

const deleteComment = (req, res) => {
    const question = db.get('questions').find({ id: parseInt(req.params.questionId) }).value();
    if (question) {
        db.get('questions').find({ id: parseInt(req.params.questionId) }).get('comments').remove({ id: parseInt(req.params.commentId) }).write();
        res.status(204).send();
    } else {
        const answer = db.get('questions').find({ id: parseInt(req.params.questionId) }).get('answers').find({ id: parseInt(req.params.answerId) }).value();
        if (answer) {
            db.get('questions').find({ id: parseInt(req.params.questionId) }).get('answers').find({ id: parseInt(req.params.answerId) }).get('comments').remove({ id: parseInt(req.params.commentId) }).write();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    }
};

// Voting System
const voteQuestion = (req, res) => {
    const question = db.get('questions').find({ id: parseInt(req.params.id) }).value();
    if (question) {
        const voteType = req.body.vote;
        if (voteType === 'upvote') {
            db.get('questions').find({ id: parseInt(req.params.id) }).update('votes', n => n + 1).write();
        } else if (voteType === 'downvote') {
            db.get('questions').find({ id: parseInt(req.params.id) }).update('votes', n => n - 1).write();
        }
        res.json(question);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const voteAnswer = (req, res) => {
    const question = db.get('questions').find({ id: parseInt(req.params.questionId) }).value();
    if (question) {
        const answer = db.get('questions').find({ id: parseInt(req.params.questionId) }).get('answers').find({ id: parseInt(req.params.answerId) }).value();
        if (answer) {
            const voteType = req.body.vote;
            if (voteType === 'upvote') {
                db.get('questions').find({ id: parseInt(req.params.questionId) }).get('answers').find({ id: parseInt(req.params.answerId) }).update('votes', n => n + 1).write();
            } else if (voteType === 'downvote') {
                db.get('questions').find({ id: parseInt(req.params.questionId) }).get('answers').find({ id: parseInt(req.params.answerId) }).update('votes', n => n - 1).write();
            }
            res.json(answer);
        } else {
            res.status(404).json({ message: 'Answer not found' });
        }
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    addAnswer,
    updateAnswer,
    deleteAnswer,
    addCommentToQuestion,
    addCommentToAnswer,
    updateComment,
    deleteComment,
    voteQuestion,
    voteAnswer
};
