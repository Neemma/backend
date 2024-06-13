const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
        return;
    }

    console.log('Connected to the database');

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS files (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            mimetype VARCHAR(50) NOT NULL,
            data BYTEA NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;

    client.query(createTableQuery, (err, res) => {
        if (err) {
            console.error('Error executing query', err.stack);
        } else {
            console.log('Table is successfully created');
        }
        client.end();
    });
});
