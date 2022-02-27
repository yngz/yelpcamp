const mongoose = require('mongoose');

const { Schema } = mongoose;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  Description: String,
  location: String,
});

module.exports = mongoose.model('Campground', CampgroundSchema);
