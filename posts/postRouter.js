const express = require('express');

const Posts = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;
  
  Posts.getById(id)
    .then(post => {
      if (post) {
        req.post = post;
      } else {
        res
          .status(400)
          .json({ message: 'invalid post ID.' });
      }
    })
  next();
};

module.exports = router;
