// implement your API here
const express = require('express');

const db = require('./data/db');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send('API is working')
})

// create a user
server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;
  const newUser = { name, bio }

  console.log(`user info: `, newUser);
  if (!name || !bio) {
    return res.status(400)
      .json({ errorMessage: "Please provide name and bio for the user." })
  }
  db.insert(newUser)
    .then(user => {
      res.status(201).json(user);
    }).catch(err => {
      res.status(500).json({ message: `error retrieving users` });
    });
});

// get all users
server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: "The users information could not be retrieved." });
    });
});

// get user by id
server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ error: "The user information could not be retrieved." });
    });
});

// update user
server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  const updatedUser = { name, bio }
  if (!name || !bio) {
    return res.status(400)
      .json({ errorMessage: "Please provide name and bio for the user." })
  }
  db.update(id, updatedUser)
    .then(updated => {
      if (updated === 1) {
        res.status(200).json(updated);
      } else {
        res.status(404).json({ message: 'user not found' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'error retrieving users' });
    });
});

// delete user
server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(deleted => {
      if (deleted === 1) {
        res.status(204).end();
      }
      res.status(404)
        .json({ message: "The user with the specified ID does not exist." })
    })
    .catch(err => {
      res.status(500).json({ message: 'error retrieving users' });
    });
});

server.listen(4000, () => {
  console.log('\n**API up and running on port 4000 **');
});