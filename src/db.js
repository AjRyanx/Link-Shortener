const { createClient } = require('@libsql/client');
const path = require('path');

const isVercel = process.env.VERCEL === '1';

const db = createClient(
  isVercel
    ? {
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: `file:${path.join(__dirname, '..', 'urls.db')}`,
      },
);

db.execute(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    visit_count INTEGER DEFAULT 0
  )
`);

module.exports = db;
