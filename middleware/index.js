const Comment = require('../models/comment');
const Movie = require('../models/movie');
const User = require('../models/user');

module.exports = {
  // chekc if user is logged in (isAuthenticate())
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Please Sign In.'); // setup flash before it goes to where we want it to be played
    res.redirect('/login');
  },

  // check if the login user matches with the comment's author
  checkCommentOwnership(req, res, next) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash('error', 'Movie not found.');
        res.redirect('back');
      } else if (foundComment.author.id.equals(req.user._id)) {
        req.comment = foundComment;
        next();
      } else {
        req.flash('error', "You don't have permission to do that.");
        res.redirect('back');
      }
    });
  },

  // check if user owns the movie
  checkMovieOwnership(req, res, next) {
    Movie.findById(req.params.id, (err, foundMovie) => {
      if (err || !foundMovie) {
        res.redirect('/movies');
        req.flash('error', 'Movie Not Found.');
      } else if (foundMovie.author.id.equals(req.user._id)) {
        // === doesn't work
        req.movie = foundMovie;
        next();
      } else {
        // if doesn't own movie, hide edit & delete button
        req.flash('error', "You don't have permission to do that.");
        return res.redirect('back');
      }
    });
  },

  // passes user info to all templates as a property of res.locals
  passUserInfo(req, res, next) {
    // req.user refers to the user authentication info auto-saved to req by passport-mongoose
    res.locals.currentUser = req.user; // res.locals === what's available inside our templates
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
  },

  // user not logged in, then log in, redirect back to new comment page after logging in
  loggedToComment(req, res, next) {
    if (req.isAuthenticated()) {
      // redirect to create comment page
    }
  },

  // check admin info
  isAdmin(req, res, next) {
    User.findById(req.user._id, (err, adminUser) => {
      if (err || !adminUser) {
        req.flash('error', 'admin authentication failed');
        res.send(req.user.username);
      } else if (adminUser.admin === true) {
        next();
      } else {
        req.flash('error', 'no permission');
        res.redirect('/movies');
      }
    });
  },
};
