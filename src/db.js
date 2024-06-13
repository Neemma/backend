const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Memory = require('lowdb/adapters/Memory');

const adapter = process.env.NODE_ENV === 'production' ? new Memory() : new FileSync('src/data/questions.json');
const db = low(adapter);

db.defaults({ questions: [] }).write();

module.exports = db;
