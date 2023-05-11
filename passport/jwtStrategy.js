const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const User = require("../models/user");

exports.jwt = () => {
  passport.use(
    "ajwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET_OR_KEY,
        passReqToCallback: false,
      },
      async (jwtpayload, done) => {
        try {
          const exUser = await User.findOne({
            where: { loginId: jwtpayload.loginId },
          });
          if (exUser) {
            return done(null, exUser);
          }
          return done(null, false);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

exports.refreshJwt = () => {
  passport.use(
    "refreshJwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => {
            if (req.cookies) {
              return req.cookies.refreshToken;
            }
          },
        ]),
        secretOrKey: process.env.JWT_SECRET_OR_KEY,
        passReqToCallback: false,
      },
      async (jwtpayload, done) => {
        try {
          const exUser = await User.findOne({
            where: { loginId: jwtpayload.loginId },
          });
          return done(null, exUser);
        } catch {
          done(error);
        }
      }
    )
  );
};
