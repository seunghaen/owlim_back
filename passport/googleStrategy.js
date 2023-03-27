const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

module.exports = () => {
  const strategy = new GoogleStrategy(
    {
      clientID: "a",
      clientSecret: "a",
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log(profile);
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
  );
  passport.use(strategy);
};
