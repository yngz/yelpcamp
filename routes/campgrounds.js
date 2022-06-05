const express = require('express');
const multer = require('multer');

const { storage } = require('../cloudinary');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

const uploadParser = multer({ storage });

const router = express.Router();

router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    uploadParser.array('image'),
    validateCampground,
    // req.files can now be accessed as well as req.body
    catchAsync(campgrounds.createCampground),
  );

// needs to be defined before the :id route
router.get(
  '/new',
  isLoggedIn,
  campgrounds.renderNewForm,
);

router.route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground),
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.deleteCampground),
  );

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm),
);

module.exports = router;
