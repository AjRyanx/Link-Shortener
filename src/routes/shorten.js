const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../db');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'url is required' });
    }

    const longUrl = url.trim();

    if (longUrl.length === 0) {
      return res.status(400).json({ error: 'url is required' });
    }

    try {
      new URL(longUrl);
    } catch {
      return res.status(400).json({ error: 'invalid url' });
    }

    const shortCode = nanoid(7);

    await db.execute({
      sql: 'INSERT INTO urls (short_code, long_url) VALUES (?, ?)',
      args: [shortCode, longUrl],
    });

    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;

    res.json({ shortCode, shortUrl });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
