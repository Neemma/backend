const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        body TEXT,
        tags TEXT[],
        answers JSONB,
        comments JSONB,
        votes INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
`;

client.query(createTableQuery, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Table is successfully created');
    }
    client.end();
});
