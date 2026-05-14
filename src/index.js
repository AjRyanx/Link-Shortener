const express = require('express');
const path = require('path');
const shortenRoute = require('./routes/shorten');
const redirectRoute = require('./routes/redirect');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
