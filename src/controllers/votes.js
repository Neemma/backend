const fs = require('fs');
const questions = require('../data/questions.json');
const answers = require('../data/answers.json');
const writeQuestions = (data) => fs.writeFileSync('src/data/questions.json', JSON.stringify(data, null, 2));
const writeAnswers = (data) => fs.writeFileSync('src/data/answers.json', JSON.stringify(data, null, 2));

// Upvote/downvote a question
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

// Upvote/downvote an answer
const voteAnswer = (req, res) => {
    const answer = answers.find(a => a.id === parseInt(req.params.id));
    if (answer) {
        const voteType = req.body.vote;
        if (voteType === 'upvote') {
            answer.votes += 1;
        } else if (voteType === 'downvote') {
            answer.votes -= 1;
        }
        writeAnswers(answers);
        res.json(answer);
    } else {
        res.status(404).json({ message: 'Answer not found' });
    }
};

module.exports = {
    voteQuestion,
    voteAnswer
};
