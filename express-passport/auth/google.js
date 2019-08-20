// Dependencies
var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('../config/')('auth')
const siteConfig = require('../config.js')('config');
var userModel = require('../model/user');
const {
  authCallback
} = require('./utils');

// Setup passport Google strategy
passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: siteConfig.apiUrl + '/' + siteConfig.apiVersion + config.google.callbackURL,
  },
  async function(accessToken, refreshToken, profile, done) {
    const isValid = await userModel.verifyProfile(profile);

    if (isValid.valid) {
      return done(null, {
        ...profile,
        exists: isValid.exists,
      });
    }
    done('Email already in use', null);
  }
));

/* ROUTES */

// /auth/google/callback
router.get('/callback', authCallback('google'));

// /auth/google
router.get('/:invite_code?',
  (req, res, next) => {
    req.session.referer = req.header('referer');
    req.session.inviteCode = req.params.invite_code;

    next();
  },
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
  })
);

// Return router
module.exports = router;


