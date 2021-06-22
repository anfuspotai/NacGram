var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../config/config')

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}


/* GET home page. */
router.get('/', verifyLogin, function (req, res, next) {
  db.get().collection('messages').find().toArray()
    .then((messages) => {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.render('index', { messages, user: req.session.user })
    })
    .catch(error => console.error(error))
});

router.get('/login', function (req, res) {
  if (req.session.user) {
    res.redirect('/chat')
  } else {
    message = false;
    if (req.session.invalid) {
      var message = true;
      req.session.invalid = false;
    }
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('login', { message: message });
  }
});

router.post('/login', function (req, res) {
  let formData = req.body;

  db.get().collection('login').findOne({ email: formData.username })
    .then((result) => {
      if (!result) {
        req.session.invalid = true
        res.redirect('/login')
      } else {
        if (result.status) {
          bcrypt.compare(formData.password, result.password)
            .then(check => {
              if (check) {
                req.session.user = { username: result.name, id: result._id };
                res.redirect('/');
              } else {
                req.session.invalid = true
                res.redirect('/login')
              }
            })
        }
        else {
          res.render('error', { status: '403', message: 'You are Banned', layout: '' })
        }
      }
    })
    .catch(error => console.error(error))
});

router.get('/lgt', verifyLogin, function (req, res, next) {
  req.session.destroy()
});


module.exports = router;
