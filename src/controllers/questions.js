const db = require('../db');

const getAllQuestions = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM questions');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getQuestionById = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM questions WHERE id = $1', [req.params.id]);
        if (rows.length) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createQuestion = async (req, res) => {
    const { title, body, tags } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO questions (title, body, tags, answers, comments) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, body, tags, JSON.stringify([]), JSON.stringify([])]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateQuestion = async (req, res) => {
    const { title, body, tags } = req.body;
    try {
        const { rows } = await db.query(
            'UPDATE questions SET title = $1, body = $2, tags = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
            [title, body, tags, req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        await db.query('DELETE FROM questions WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addAnswer = async (req, res) => {
    const { body } = req.body;
    try {
        const questionResult = await db.query('SELECT * FROM questions WHERE id = $1', [req.params.id]);
        if (questionResult.rows.length) {
            const question = questionResult.rows[0];
            const answer = {
                id: Date.now(),
                body,
                comments: [],
                votes: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            question.answers.push(answer);
            await db.query('UPDATE questions SET answers = $1 WHERE id = $2', [JSON.stringify(question.answers), req.params.id]);
            res.status(201).json(answer);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateAnswer = async (req, res) => {
    const { body } = req.body;
    try {
        const questionResult = await db.query('SELECT * FROM questions WHERE id = $1', [req.params.questionId]);
        if (questionResult.rows.length) {
            const question = questionResult.rows[0];
            const answerIndex = question.answers.findIndex(a => a.id === parseInt(req.params.answerId));
            if (answerIndex !== -1) {
                question.answers[answerIndex].body = body || question.answers[answerIndex].body;
                question.answers[answerIndex].updatedAt = new Date();
                await db.query('UPDATE questions SET answers = $1 WHERE id = $2', [JSON.stringify(question.answers), req.params.questionId]);
                res.json(question.answers[answerIndex]);
            } else {
                res.status(404).json({ message: 'Answer not found' });
            }
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteAnswer = async (req, res) => {
    try {
        const questionResult = await db.query('SELECT * FROM questions WHERE id = $1', [req.params.questionId]);
        if (questionResult.rows.length) {
            const question = questionResult.rows[0];
            question.answers = question.answers.filter(a => a.id !== parseInt(req.params.answerId));
            await db.query('UPDATE questions SET answers = $1 WHERE id = $2', [JSON.stringify(question.answers), req.params.questionId]);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addCommentToQuestion = async (req, res) => {
    const { body } = req.body;
    try {
        const questionResult = await db.query('SELECT * FROM questions WHERE id = $1', [req.params.id]);
        if (questionResult.rows.length) {
            const question = questionResult.rows[0];
            const comment = {
                id: Date.now(),
                body,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            question.comments.push(comment);
            await db.query('UPDATE questions SET comments = $1 WHERE id = $2', [JSON.stringify(question.comments), req.params.id]);
            res.status(201).json(comment);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addCommentToAnswer = async (req, res) => {
    const { body } = req.body;
    try {
        const questionResult = await db.query('SELECT * FROM questions WHERE id = $1', [req.params.questionId]);
        if (questionResult.rows.length) {
            const question = questionResult.rows[0];
            const answerIndex = question.answers.findIndex(a => a.id === parseInt(req.params.answerId));
            if (answerIndex !== -1) {
                const comment = {
                    id: Date.now(),
                    body,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                question.answers[answerIndex].comments.push(comment);
                await db.query('UPDATE questions SET answers = $1 WHERE id = $2', [JSON.stringify(question.answers), req.params.questionId]);
                res.status(201).json(comment);
            } else {
                res.status(404).json({ message: 'Answer not found' });
            }
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateComment = async (req, res) => {
    const { body } = req.body;
    try {
        const questionResult = await db.query('SELECT * FROM questions WHERE id = $1', [req.params.questionId]);
        if (questionResult.rows.length) {
            const question = questionResult.rows[0];
            const commentIndex = question.comments.findIndex(c => c.id === parseInt(req.params.commentId));
            if (commentIndex !== -1) {
                question.comments[commentIndex].body = body || question.comments[commentIndex].body;
                question.comments[commentIndex].updatedAt = new Date();
                await db.query('UPDATE questions SET comments = $1 WHERE id = $2', [JSON.stringify(question.comments), req.params.questionId]);
                res.json(question.comments[commentIndex]);
            } else {
                const answerIndex = question.answers.findIndex(a => a.id === parseInt(req.params.answerId));
                if (answerIndex !== -1) {
                    const answerCommentIndex = question.answers[answerIndex].comments.findIndex(c => c.id === parseInt(req.params.commentId));
                    if (answerCommentIndex !== -1) {
                        question.answers[answerIndex].comments[answerCommentIndex].body = body || question.answers[answerIndex].comments[answerCommentIndex].body;
                        question.answers[answerIndex].comments[answerCommentIndex].updatedAt = new Date();
                        await db.query('UPDATE questions SET answers = $1 WHERE id = $2', [JSON.stringify(question.answers), req.params.questionId]);
                        res.json(question.answers[answerIndex].comments[answerCommentIndex]);
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const questionResult = await db.query('SELECT * FROM questions WHERE id = $1', [req.params.questionId]);
        if (questionResult.rows.length) {
            const question = questionResult.rows[0];
            question.comments = question.comments.filter(c => c.id !== parseInt(req.params.commentId));
            await db.query('UPDATE questions SET comments = $1 WHERE id = $2', [JSON.stringify(question.comments), req.params.questionId]);
            res.status(204).send();
        } else {
            const answerIndex = question.answers.findIndex(a => a.id === parseInt(req.params.answerId));
            if (answerIndex !== -1) {
                question.answers[answerIndex].comments = question.answers[answerIndex].comments.filter(c => c.id !== parseInt(req.params.commentId));
                await db.query('UPDATE questions SET answers = $1 WHERE id = $2', [JSON.stringify(question.answers), req.params.questionId]);
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Comment not found' });
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const voteQuestion = async (req, res) => {
    try {
        const questionResult = await db.query('SELECT * FROM questions WHERE id = $1', [req.params.id]);
        if (questionResult.rows.length) {
            const question = questionResult.rows[0];
            const voteType = req.body.vote;
            if (voteType === 'upvote') {
                question.votes += 1;
            } else if (voteType === 'downvote') {
                question.votes -= 1;
            }
            await db.query('UPDATE questions SET votes = $1 WHERE id = $2', [question.votes, req.params.id]);
            res.json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const voteAnswer = async (req, res) => {
    try {
        const questionResult = await db.query('SELECT * FROM questions WHERE id = $1', [req.params.questionId]);
        if (questionResult.rows.length) {
            const question = questionResult.rows[0];
            const answerIndex = question.answers.findIndex(a => a.id === parseInt(req.params.answerId));
            if (answerIndex !== -1) {
                const voteType = req.body.vote;
                if (voteType === 'upvote') {
                    question.answers[answerIndex].votes += 1;
                } else if (voteType === 'downvote') {
                    question.answers[answerIndex].votes -= 1;
                }
                await db.query('UPDATE questions SET answers = $1 WHERE id = $2', [JSON.stringify(question.answers), req.params.questionId]);
                res.json(question.answers[answerIndex]);
            } else {
                res.status(404).json({ message: 'Answer not found' });
            }
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
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
