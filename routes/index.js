const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

const router = express.Router();

// ======== ROOT ROUTE ========
router.get('/', (req, res) => {
  res.render('landing');
});

// ======== AUTH ROUTES =========
// register form
router.get('/register', (req, res) => {
  res.render('register');
});

// register logic
router.post('/register', (req, res) => {
  // const { username, password } = req.body.registerInfo;
  const { username, password } = req.body;
  const newUser = new User({
    username,
  });
  User.register(newUser, password, (err) => {
    if (err) {
      req.flash('error', err.message); // taking advantage of passport-mongoose error messages
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, () => {
        req.flash('success', 'Signup successful.');
        res.redirect('/movies');
      });
    }
  });
});

// login form
router.get('/login', (req, res) => {
  res.render('login');
});

// login logic (with {passport.authenticate => success, failure} middleware)
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/movies',
    failureRedirect: '/login',
    failureFlash: true,
  }),
  (req, res) => {
    req.flash('success', 'signin successful');
  },
);

// logout logic
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logout successful.');
  res.redirect('/movies');
});

module.exports = router;
