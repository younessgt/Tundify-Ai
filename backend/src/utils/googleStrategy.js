const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userActions = require("../services/userActions");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/v1/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      try {
        const user = profile;
        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);
