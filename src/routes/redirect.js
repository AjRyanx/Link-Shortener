const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/stats/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    const result = await db.execute({
      sql: 'SELECT short_code, long_url, visit_count, created_at FROM urls WHERE short_code = ?',
      args: [code],
    });

    const row = result.rows[0];

    if (!row) {
      return res.status(404).json({ error: 'not found' });
    }

    res.json({
      shortCode: row.short_code,
      longUrl: row.long_url,
      visitCount: row.visit_count,
      createdAt: row.created_at,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    if (code === 'favicon.ico' || code.startsWith('.')) {
      return res.status(404).end();
    }

    const result = await db.execute({
      sql: 'SELECT long_url FROM urls WHERE short_code = ?',
      args: [code],
    });

    const row = result.rows[0];

    if (!row) {
      return res.status(404).send('Not found');
    }

    await db.execute({
      sql: 'UPDATE urls SET visit_count = visit_count + 1 WHERE short_code = ?',
      args: [code],
    });

    res.redirect(301, row.long_url);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
