module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // store the url of the unsuccessful request
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be logged in first!');
    res.redirect('/login');
    return;
  }
  next();
};
