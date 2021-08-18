// Authentication routes
// https://www.restapitutorial.com/lessons/httpmethods.html
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const ss = process.env; // Server settings

router.use(passport.initialize());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// Google Authentication
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: ss.GOOGLE_CLIENT_ID,
      clientSecret: ss.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:3040/api/v1/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      console.log(userProfile);
      return done(null, userProfile);
    }
  )
);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${ss.FRONTEND_URL}` }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
