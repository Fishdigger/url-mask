const app = require('express')();
const path = require('path');
const db = require('./db');
const bodyParser = require('body-parser');
const shortener = require('./shortener');
const os = require('os');

app.use(bodyParser.json());

app.post('/api/get-redirect', async (req, res) => {
  if (!req.body.redirect_to_url) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({error: 'redirect_to_url was not sent'});
    return;
  }

  let shortened = shortener.getShortenedUrl(req.body.redirect_to_url);
  try {
    await db.insert(req.body.redirect_to_url, shortened);
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.json({short_url: `http://${req.hostname}:${process.env.PORT || 3000}/${shortened}`});
    return;
  } catch (err) {
    res.sendStatus(500);
    return;
  }
});

app.get('/:short', async (req, res) => {
  let longUrl = await db.getLongUrl(req.params.short);
  if (!longUrl) {
    res.statusCode = 404;
    res.sendFile(path.join(__dirname, '404.html'));
    return;
  }

  res.redirect(longUrl);
});

app.get(/^\/$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

db.connect();

app.listen(process.env.PORT || '3000');
