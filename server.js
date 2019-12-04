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

// to be used on every request that expects a user id parameter.
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
};

// validates the body on a request to create a new user (POST)
function validateUser(req, res, next) {
  const userData = req.body;

  if (userData.length === 0) {
    res.status(400).json({ message: 'missing user data.' });
  }
  if (!userData.name) {
    res.status(400).json({ message: 'missing required name field.' });
  } else {
    next();
  }
};

// validates body on a request to create a new post 
function validatePost(req, res, next) {
  const postData = req.body;

  if (postData.length === 0) {
    res.status(400).json({ message: 'missing post data.' });
  }
  if (!postData.text) {
    res.status(400).json({ message: 'missing required text field.' })
  }
};

server.use(logger); // this will run globally (on every endpoint).

module.exports = server;
