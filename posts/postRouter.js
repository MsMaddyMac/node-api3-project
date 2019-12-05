const express = require('express');

const Posts = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get(req.query)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(err => {
    console.log('Could not get posts.', err);
    res.status(500).json({ message: 'Posts could not be retrieved.' });
  });
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
