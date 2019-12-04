const express = require('express');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.originalUrl}`)

  next();
};

function validateUserId(req, res, next) {
  const id = req.params.id;
  const user = req.user;

  if (id.length > 0) {
    user
    next();
  } else {
    res
      .status(400)
      .json({ message: 'invalid user id.' });
  }
}

server.use(logger); // this will run globally (on every endpoint).

module.exports = server;
