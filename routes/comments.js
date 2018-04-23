const express = require('express');
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// so that we have access to (:id) from app.js, after abstracting url to app.js
// Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence.
const router = express.Router({
  mergeParams: true,
});

// ======== COMMENT Routes =======
// NEW comment form
router.get('/new', middleware.isLoggedIn, (req, res) => {
  const movieId = req.params.id;
  console.log(movieId);
  Movie.findById(movieId, (err, commentMovie) => {
    if (err) {
      console.log(err);
    } else {
      console.log(commentMovie);
      res.render('comments/new', {
        commentMovie,
      });
    }
  });
});

// CREATE comment
router.post('/', middleware.isLoggedIn, (req, res) => {
  // 1 - look up movie using id
  const newComment = req.body.comment;
  const movieId = req.params.id;
  // first find the movie by id, then create new comment in order to link the two
  Movie.findById(movieId, (err, foundMovie) => {
    if (err) {
      console.log(err);
      res.redirect('/movies');
    } else {
      // 2 - create new comment
      Comment.create(newComment, (commentErr, comment) => {
        if (err) {
          console.log(commentErr);
        } else {
          // 3 - connect new comment to movie
          // before pushing, add username and _id to comment.author
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          console.log(comment);
          foundMovie.comments.push(comment);
          foundMovie.save();
          // 4 - redirect to show page of that movie
          req.flash('success', 'New Comment Posted.');
          res.redirect(`/movies/${movieId}`);
        }
      });
    }
  });
});

// EDIT comment
router.get('/:comment_id/edit', middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
  const movieId = req.params.id;
  const commentId = req.params.comment_id;
  Comment.findById(commentId, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/edit', {
        movieId,
        comment: req.comment,
      });
    }
  });
});

// UPDATE comment /movies/:id/comments/:comment_id
router.put('/:comment_id', middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
  const {
    comment,
  } = req.body;
  const movieId = req.params.id;
  Comment.findByIdAndUpdate(req.params.comment_id, comment, (err) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.redirect(`/movies/${movieId}`);
    }
  });
});

// DESTROY comment
router.delete('/:comment_id', middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
  // findByIdAndRemove
  const commentId = req.params.comment_id;
  Comment.findByIdAndRemove(commentId, (err) => {
    if (err) {
      console.log(err);
      res.redirect(`/movies/${req.params.id}`);
    } else {
      req.flash('success', 'Comment Deleted.');
      res.redirect(`/movies/${req.params.id}`);
    }
  });
});

module.exports = router;
