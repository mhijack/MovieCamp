const express = require('express');
const Movie = require('../models/movie');
const middleware = require('../middleware');

const router = express.Router();

router.get('/', middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
  res.render('admin/admin');
});

router.get('/movies', middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
  Movie.find({}, (err, movies) => {
    if (err) {
      req.flash('error', 'unknown error');
      res.redirect('/admin');
    } else {
      res.render('admin/movie', { movies });
    }
  });
});

router.delete('/movies/:id', middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
  Movie.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/admin/movies');
    }
  });
});

module.exports = router;
