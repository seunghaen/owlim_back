const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        console.log("profile", profile);
        console.log("accessToken", accessToken);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile, provider: "google" },
          });
          if (exUser) {
            done(null, exUser);
          }
        } catch (error) {
          console.error(error);
        }
      }
    )
  );
};
