const router = require('express').Router();

const Users = require('./users-model.js');

const authorize = require('../auth/auth-required-middleware');

router.get('/', authorize, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
