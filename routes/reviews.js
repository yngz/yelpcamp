const express = require('express');

const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

const router = express.Router({ mergeParams: true }); // to get params :id from the prefix

router.post(
  '/',
  isLoggedIn,
  validateReview,
  catchAsync(reviews.createReview),
);

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview),
);

module.exports = router;
