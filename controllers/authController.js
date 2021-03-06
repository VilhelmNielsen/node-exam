const passport = require('passport');

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/');
};

exports.login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Login failed!',
  successFlash: 'You are logged in!',
});

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'You must be logged in');
  res.redirect('/login');
};

exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

exports.googleAuthCallback = passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Login failed!',
  successFlash: 'You are logged in!',
});
