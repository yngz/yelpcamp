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
  // .post(
  //   isLoggedIn,
  //   validateCampground,
  //   catchAsync(campgrounds.createCampground),
  // );
  .post(uploadParser.single('image'), (req, res) => {
    console.log(req.file, req.body);
    res.send('IT WORKED?!');
  });

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
