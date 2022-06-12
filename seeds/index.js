const mongoose = require('mongoose');

const Campground = require('../models/campground');

const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

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
      // YOUR USER ID
      author: '62801805694678f5bb1c02e1',
      location: `${cities[randomOf1000].city}, ${cities[randomOf1000].state}`,
      title: `${sampleOne(descriptors)} ${sampleOne(places)}`,
      images: [
        {
          url: 'https://res.cloudinary.com/dyqk86nct/image/upload/v1654454816/YelpCamp/ewvj17zjivaclazdfxyb.jpg',
          filename: 'YelpCamp/ewvj17zjivaclazdfxyb',
        },
        {
          url: 'https://res.cloudinary.com/dyqk86nct/image/upload/v1654454816/YelpCamp/nzilktylkzy71sgnu3pn.jpg',
          filename: 'YelpCamp/nzilktylkzy71sgnu3pn',
        },
      ],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis ex temporibus praesentium numquam quibusdam. Ipsa libero, cum laborum magni nihil architecto vel recusandae voluptates blanditiis officia minima cupiditate labore corporis!',
      price: randomPrice,
      geometry: { type: 'Point', coordinates: [139.7263785, 35.6652065] },
    });
    promises.push(campground.save());
  }
  await Promise.all(promises);
};

seedDB().then(() => {
  mongoose.connection.close();
});
