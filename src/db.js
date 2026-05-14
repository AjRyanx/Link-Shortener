const { createClient } = require('@libsql/client');
const path = require('path');

const isVercel = process.env.VERCEL === '1';

function createDbClient() {
  if (isVercel) {
    if (!process.env.TURSO_DATABASE_URL) {
      throw new Error('TURSO_DATABASE_URL environment variable is required on Vercel');
    }
    return createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return createClient({
    url: `file:${path.join(__dirname, '..', 'urls.db')}`,
  });
}

const db = createDbClient();

async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      short_code TEXT UNIQUE NOT NULL,
      long_url TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      visit_count INTEGER DEFAULT 0
    )
  `);
}

const initPromise = initDb().catch(err => {
  console.error('Database initialization failed:', err);
});

db.init = initPromise;

module.exports = db;
