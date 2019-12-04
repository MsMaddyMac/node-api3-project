const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

// retrieves list of Users
router.get('/', (req, res) => {
  Users.get(req.query)
  .then(users => {
    res.status(200).json(users);
  })
  .catch(err => {
    console.log('Trouble retrieving users.', err);
    res.status(500).json({ message: 'Error retrieving users.' });
  });
});

router.get('/:id', (req, res) => {
  // do your magic!
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware
//to be used on every request that expects a user id parameter.
function validateUserId(req, res, next) {
  const id = req.params.id;
  const user = req.user;

  if (id.length > 0) {
    user
  } else {
    res
      .status(400)
      .json({ message: 'invalid user id.' });
  }
  next();
};

// // validates the body on a request to create a new user (POST)
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
  } else {
    next();
  }
};


module.exports = router;
