const passport = require("passport");
const User = require("../models/user");
const google = require("./googleStrategy.js");
const local = require("./localStrategy");

module.exports = () => {
  //세션 방식은 일단 사용 중지하는 걸로
  // passport.serializeUser((user, done) => {
  //   console.log("serializeUser");
  //   done(null, user.id);
  // });
  // passport.deserializeUser((id, done) => {
  //   User.findOne({ where: { id } })
  //     .then((user) => done(null, user))
  //     .catch((err) => done(err));
  // });

  local();

  // 구글로그인 일시중지
  // google();
};
