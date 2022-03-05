const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp')
  .then(
    () => console.log('db connection open'),
    (err) => console.log('db connection error:\n', err),
  );

const sampleOne = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  const promises = [];
  for (let i = 0; i < 50; i += 1) {
    const randomOf1000 = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 30);
    const campground = new Campground({
      location: `${cities[randomOf1000].city}, ${cities[randomOf1000].state}`,
      title: `${sampleOne(descriptors)} ${sampleOne(places)}`,
      image: 'https://source.unsplash.com/collection/483251',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis ex temporibus praesentium numquam quibusdam. Ipsa libero, cum laborum magni nihil architecto vel recusandae voluptates blanditiis officia minima cupiditate labore corporis!',
      price: randomPrice,
    });
    promises.push(campground.save());
  }
  await Promise.all(promises);
};

seedDB().then(() => {
  mongoose.connection.close();
});
