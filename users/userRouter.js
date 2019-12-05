const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(err => {
    console.log('Error adding new user.', err)
    res.status(500).json({ message: 'Error adding new user.' })
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const postData = {...req.body, user_id: req.params.id }; 

  Posts.insert(postData)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(err => {
    console.log('Error adding new post.', err);
    res.status(500).json({ message: 'Error adding new post for user.' });
  })
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

// retrieves user with specified ID
router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
  .then(user => {
    if(user) {
      res.status(200).json(user);
    } 
  })
});

// client makes GET request to retrieve posts by a specific user
router.get('/:id/posts', validateUserId, (req, res) => {
  
  Users.getUserPosts(req.params.id)
  .then(posts => {
    if (posts.length == 0) {
      res.status(400).json({ errorMessage: 'No posts found.' });
    } else {
      res.status(200).json(posts);
    }
  })
  .catch(err => {
    console.log('Posts could not be retrieved.', err);
    res.status(500).json({ error: 'The posts could not be retrieved.' });
  })
});

// deletes user with specified ID
router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;

  Users.remove(id)
  .then(user => {
    if(user.length === 0) {
      res.status(404).json({ message: 'The user with the specified' })
    } else {
      res.status(200).json({ message: 'The user is history!' });
    }
  })
  .catch(err => {
    console.log('Error deleting user.', err);
    res.status(500).json({ message: 'Error deleting user.' });
  })
});

// updates user data with specified ID
router.put('/:id', validateUserId, (req, res) => {
  const edits = req.body;
  const id = req.params.id;

  Users.update(id, edits)
  .then(user => {
    if(user.length === 0) {
      res.status(404).json({ message: 'The user with the specified ID does not exist.' });
    }
    if(!edits.name) {
      res.status(400).json({ errorMessage: 'Please provide user name.' });
    } else {
      res.status(200).json({ user: `user ${id} was updated.` });
    }
  })
  .catch(err => {
    console.log('error editing user', err);
    res.status(500).json({ error: 'The user information could not be modified.' });
  })
});

//custom middleware
//to be used on every request that expects a user id parameter.
function validateUserId(req, res, next) {
  const id = req.params.id;
  
  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
      } else {
        res
          .status(400)
          .json({ message: 'invalid user ID.' });
      }
    })
  next();
};

// // validates the body on a request to create a new user (POST)
function validateUser(req, res, next) {
  const userData = req.body;

  if (Object.keys(userData).length === 0) {
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
  const postData = {...req.body, user_id: req.params.id };

  if (Object.keys(postData).length === 0) {
    res.status(400).json({ message: 'missing post data.' });
  }
  if (!postData.text) {
    res.status(400).json({ message: 'missing required text field.' })
  } else {
    next();
  }
};


module.exports = router;
