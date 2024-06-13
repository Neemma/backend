const fs = require('fs');
const questions = require('../data/questions.json');
const writeQuestions = (data) => fs.writeFileSync('src/data/questions.json', JSON.stringify(data, null, 2));

// Helper function to generate a unique ID
const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

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

// Answer Management
const addAnswer = (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.id));
    if (question) {
        const answer = {
            id: generateId(),
            body: req.body.body,
            comments: [],
            votes: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        question.answers.push(answer);
        question.updatedAt = new Date();
        writeQuestions(questions);
        res.status(201).json(answer);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const updateAnswer = (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (question) {
        const answer = question.answers.find(a => a.id === parseInt(req.params.answerId));
        if (answer) {
            answer.body = req.body.body || answer.body;
            answer.updatedAt = new Date();
            writeQuestions(questions);
            res.json(answer);
        } else {
            res.status(404).json({ message: 'Answer not found' });
        }
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const deleteAnswer = (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (question) {
        const index = question.answers.findIndex(a => a.id === parseInt(req.params.answerId));
        if (index !== -1) {
            question.answers.splice(index, 1);
            question.updatedAt = new Date();
            writeQuestions(questions);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Answer not found' });
        }
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

// Comment Management
const addCommentToQuestion = (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.id));
    if (question) {
        const comment = {
            id: generateId(),
            body: req.body.body,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        question.comments.push(comment);
        question.updatedAt = new Date();
        writeQuestions(questions);
        res.status(201).json(comment);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const addCommentToAnswer = (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (question) {
        const answer = question.answers.find(a => a.id === parseInt(req.params.answerId));
        if (answer) {
            const comment = {
                id: generateId(),
                body: req.body.body,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            answer.comments.push(comment);
            answer.updatedAt = new Date();
            writeQuestions(questions);
            res.status(201).json(comment);
        } else {
            res.status(404).json({ message: 'Answer not found' });
        }
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const updateComment = (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (question) {
        const comment = question.comments.find(c => c.id === parseInt(req.params.commentId));
        if (comment) {
            comment.body = req.body.body || comment.body;
            comment.updatedAt = new Date();
            writeQuestions(questions);
            res.json(comment);
        } else {
            const answer = question.answers.find(a => a.id === parseInt(req.params.answerId));
            if (answer) {
                const comment = answer.comments.find(c => c.id === parseInt(req.params.commentId));
                if (comment) {
                    comment.body = req.body.body || comment.body;
                    comment.updatedAt = new Date();
                    writeQuestions(questions);
                    res.json(comment);
                } else {
                    res.status(404).json({ message: 'Comment not found' });
                }
            } else {
                res.status(404).json({ message: 'Answer not found' });
            }
        }
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const deleteComment = (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (question) {
        const index = question.comments.findIndex(c => c.id === parseInt(req.params.commentId));
        if (index !== -1) {
            question.comments.splice(index, 1);
            question.updatedAt = new Date();
            writeQuestions(questions);
            res.status(204).send();
        } else {
            const answer = question.answers.find(a => a.id === parseInt(req.params.answerId));
            if (answer) {
                const index = answer.comments.findIndex(c => c.id === parseInt(req.params.commentId));
                if (index !== -1) {
                    answer.comments.splice(index, 1);
                    answer.updatedAt = new Date();
                    writeQuestions(questions);
                    res.status(204).send();
                } else {
                    res.status(404).json({ message: 'Comment not found' });
                }
            } else {
                res.status(404).json({ message: 'Answer not found' });
            }
        }
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

// Voting System
const voteQuestion = (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.id));
    if (question) {
        const voteType = req.body.vote;
        if (voteType === 'upvote') {
            question.votes += 1;
        } else if (voteType === 'downvote') {
            question.votes -= 1;
        }
        writeQuestions(questions);
        res.json(question);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const voteAnswer = (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (question) {
        const answer = question.answers.find(a => a.id === parseInt(req.params.answerId));
        if (answer) {
            const voteType = req.body.vote;
            if (voteType === 'upvote') {
                answer.votes += 1;
            } else if (voteType === 'downvote') {
                answer.votes -= 1;
            }
            writeQuestions(questions);
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
