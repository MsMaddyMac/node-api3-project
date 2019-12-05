const express = require('express');

const Posts = require('./postDb');

const router = express.Router();

// gets all posts in database
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

// gets post by specified ID
router.get('/:id', validatePostId, (req, res) => {
  Posts.getById(req.params.id)
  .then(post => {
    res.status(200).json(post);
  })
  .catch(err => {
    console.log('The post could not be retrieved.', err);
    res.status(500).json({ error: 'The post could not be retrieved.' })
  })
});

// deletes post by specified ID
router.delete('/:id', validatePostId, (req, res) => {
  const id = req.params.id;

  Posts.remove(id)
  .then(post => {
    if(post > 0) {
      res.status(200).json({ message: 'The post has been nuked!' });
    }
  })
  .catch(err => {
    console.log('Post could not be deleted.', err);
    res.status(500).json({
      message: 'Error removing the post.'
    });
  });
});

// updates post by specified ID
router.put('/:id', validatePostId, (req, res) => {
  const edits = req.body;
  const id = req.params.id;

  Posts.update(id, edits)
  .then(() => {
    if(!edits.text || !edits.user_id) {
      res.status(400).json({ errorMessage: 'Text and user_id are required.' });
    } else {
      res.status(200).json({ post: `post ${id} was updated.` });
    }
  })
  .catch(err => {
    console.log('error deleting post', err);
    res.status(500).json({ error: 'The post could not be modified.' });
  })
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
