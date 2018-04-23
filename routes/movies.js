const express = require('express');
const Movie = require('../models/movie');
const middleware = require('../middleware');

const router = express.Router();

// ======== ROUTES =======
// INDEX route
router.get('/', (req, res) => {
  // console.log(req.user);
  // get all campgrounds in db
  Movie.find({}, (err, allMovie) => {
    if (err) {
      console.log(err);
    } else {
      // express will automatically look for file in views directory
      res.render('movies/index', {
        movies: allMovie,
      });
    }
  });
});

// NEW route
// shows form users use to submit data
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('movies/new');
});

// CREATE route
// different than the GET movies. This is a convention of RESTful API
router.post('/', middleware.isLoggedIn, (req, res) => {
  // get data from form and add to movies array
  console.log(req.user);
  const { name, imageUrl, description } = req.body;
  const author = { id: req.user._id, username: req.user.username };
  // add user's movie to db
  Movie.create({
    name, image: imageUrl, description, author,
  }, (err, newMovie) => {
    if (err) {
      console.log(err);
    } else {
      newMovie.save();
    }
  });
  req.flash('success', 'New Movie Added.');
  // redirect back to movies page (default redirect is a GET request)
  res.redirect('/movies');
});

// SHOW route
router.get('/:id', (req, res) => {
  // find movie with the id
  const movieId = req.params.id;
  // transform comment id into actual comment object with populate
  Movie.findById(movieId).populate('comments').exec((err, movie) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Movie Not Found.');
      res.redirect('/movies');
    } else {
      res.render('movies/show', {
        movie,
      });
    }
  });
});

// EDIT route
router.get('/:id/edit', middleware.isLoggedIn, middleware.checkMovieOwnership, (req, res) => {
  Movie.findById(req.params.id, (err) => {
    res.render('movies/edit', { movie: req.movie });
  });
});

// UPDATE route
router.put('/:id', middleware.isLoggedIn, middleware.checkMovieOwnership, (req, res) => {
  const { id } = req.params;
  const { movie } = req.body;
  Movie.findByIdAndUpdate(id, movie, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', 'An error occured.');
      res.redirect('/movies');
    } else {
      req.flash('success', 'Movie Details Updated.');
      res.redirect(`/movies/${req.params.id}`);
    }
  });
});

// DESTROY
router.delete('/:id', middleware.isLoggedIn, middleware.checkMovieOwnership, (req, res) => {
  Movie.findByIdAndRemove(req.params.id, (err) => {
    req.flash('success', 'Movie Deleted.');
    res.redirect('/movies');
  });
});

module.exports = router;
