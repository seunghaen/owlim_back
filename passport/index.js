const passport = require("passport");
const User = require("../models/user");
const google = require("./googleStrategy.js");
const jwt = require("./localStrategy");

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log("serializeUser");
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });
  jwt();
  google();
};
