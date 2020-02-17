const router = require('express').Router();

const bcrypt = require('bcryptjs');

const authorize = require('./auth-required-middleware');

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let user = req.body;
  console.log(user);

  const hash = bcrypt.hashSync(user.password, 10);
  console.log(hash);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;


    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          req.session.loggedin = true;
          res.status(200).json({ message: `Welcome ${user.username}!`, });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
});

router.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('error logging out');
        } else {
          res.send('good bye');
        }
      })
    } else {
        res.end();
    }
  });

module.exports = router;
