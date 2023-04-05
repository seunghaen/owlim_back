const passport = require("passport");
const JWTStrategy = require("passport-local").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  passport.use(
    new JWTStrategy(
      {
        passReqToCallback: false,
        jwtFromRequest,
        secretOrKey: process.env.JWT_SECRET_OR_KEY,
      },
      async (jwtPayload, done) => {
        const { loginId, password } = jwtPayload;
        try {
          const exUser = await User.findOne({ where: { loginId } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
