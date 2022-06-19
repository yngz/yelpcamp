if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');

const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const helmet = require('helmet');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const ExpressError = require('./utils/ExpressError');

const app = express();

mongoose.connect('mongodb://localhost:27017/yelpcamp')
  .then(
    () => console.log('db connection open'),
    (err) => console.log('db connection error:\n', err),
  );

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const sessionConfig = {
  name: 'session', // simply making it different from the default
  secret: 'thishouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com',
  'https://api.tiles.mapbox.com',
  'https://api.mapbox.com',
  'https://kit.fontawesome.com',
  'https://cdnjs.cloudflare.com',
  'https://cdn.jsdelivr.net',
];
const styleSrcUrls = [
  'https://kit-free.fontawesome.com',
  'https://stackpath.bootstrapcdn.com',
  'https://api.mapbox.com',
  'https://api.tiles.mapbox.com',
  'https://fonts.googleapis.com',
  'https://use.fontawesome.com',
  'https://cdn.jsdelivr.net',
];
const connectSrcUrls = [
  'https://api.mapbox.com',
  'https://*.tiles.mapbox.com',
  'https://events.mapbox.com',
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      childSrc: ['blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/dyqk86nct/', // SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        'https://images.unsplash.com',
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session()); // needs to be after app.use(session(...))
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // get the flash messages that were set in routes/*.js
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// routes
app.get('/', (req, res) => {
  res.render('home');
});
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// The 404 route
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Custom error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh no, something went wrong!';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
