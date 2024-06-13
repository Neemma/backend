const fs = require('fs');
const comments = require('../data/comments.json');
const writeComments = (data) => fs.writeFileSync('src/data/comments.json', JSON.stringify(data, null, 2));

const getCommentsByQuestionId = (req, res) => {
    const questionId = parseInt(req.params.id);
    const questionComments = comments.filter(c => c.questionId === questionId);
    res.json(questionComments);
};

const getCommentsByAnswerId = (req, res) => {
    const answerId = parseInt(req.params.id);
    const answerComments = comments.filter(c => c.answerId === answerId);
    res.json(answerComments);
};

const createCommentOnQuestion = (req, res) => {
    const questionId = parseInt(req.params.id);
    const comment = {
        id: comments.length + 1,
        questionId: questionId,
        answerId: null,
        body: req.body.body,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    comments.push(comment);
    writeComments(comments);
    res.status(201).json(comment);
};

const createCommentOnAnswer = (req, res) => {
    const answerId = parseInt(req.params.id);
    const comment = {
        id: comments.length + 1,
        questionId: null,
        answerId: answerId,
        body: req.body.body,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    comments.push(comment);
    writeComments(comments);
    res.status(201).json(comment);
};

const updateComment = (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (comment) {
        comment.body = req.body.body || comment.body;
        comment.updatedAt = new Date();
        writeComments(comments);
        res.json(comment);
    } else {
        res.status(404).json({ message: 'Comment not found' });
    }
};

const deleteComment = (req, res) => {
    const index = comments.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        comments.splice(index, 1);
        writeComments(comments);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Comment not found' });
    }
};

module.exports = {
    getCommentsByQuestionId,
    getCommentsByAnswerId,
    createCommentOnQuestion,
    createCommentOnAnswer,
    updateComment,
    deleteComment
};
