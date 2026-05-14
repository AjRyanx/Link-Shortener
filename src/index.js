const express = require('express');
const path = require('path');
const db = require('./db');
const shortenRoute = require('./routes/shorten');
const redirectRoute = require('./routes/redirect');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(async (req, res, next) => {
  try {
    if (db.init) await db.init;
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/shorten', shortenRoute);
app.use('/', redirectRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
