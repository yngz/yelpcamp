const express = require('express');

const { validateReview } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');

const router = express.Router({ mergeParams: true }); // to get params :id from the prefix

// reviews routes
router.post('/', validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'New review created!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted review!');
  res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;
