const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.join = async (req, res, next) => {
  const { loginId, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { loginId } });
    if (exUser) {
      return res
        .status(409)
        .json({ meessage: "이미 존재하는 유저 아이디입니다." });
      //이후에 중복확인 버튼도 만들자
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      loginId,
      nick,
      password: hash,
    });
    return res.json({ code: 200, message: "회원가입 성공" });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      console.error(error);
      next(error);
    }
    if (!user) {
      return res.status(401).json({
        message: info,
      });
    }
    const refreshToken = jwt.sign(
      { sub: "refresh", loginId: req.body.loginId },
      process.env.JWT_SECRET_OR_KEY,
      { expiresIn: "24h" }
    );
    const accessToken = jwt.sign(
      { sub: "access", loginId: req.body.loginId },
      process.env.JWT_SECRET_OR_KEY,
      { expiresIn: "5m" }
    );
    req.login(user, { session: false }, (loginError) => {
      if (loginError) {
        console.error(loginError);
        next(loginError);
      }
      return res.status(200).json({
        nick: user.nick,
        loginId: user.loginId,
        provider: user.provider,
        accessToken,
        refreshToken,
      });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};

exports.refreshToken = (req, res, next) => {
  passport.authenticate("refreshJwt", (err, user) => {
    if (!user) {
      return res
        .status(401)
        .json({ message: "존재하지 않는 유저입니다", code: "not exist" });
    }
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(419)
          .json({ message: "만료된 리프레시 토큰입니다.", code: "expired" });
      }
      return res
        .status(401)
        .json({ message: "유효하지 않은 리프레시 토큰입니다." });
    }
    const accessToken = jwt.sign(
      { sub: "access", loginId: user.loginId },
      process.env.JWT_SECRET_OR_KEY,
      { expiresIn: "5m" }
    );
    return res.status(200).json({
      nick: user.nick,
      loginId: user.loginId,
      provider: user.provider,
      accessToken,
    });
  })(req, res, next);
};

// exports.loginSuccess = (req, res) => {
//   if (req.user) {
//     res.status(200).json({
//       error: false,
//       message: "Successfully Loged In",
//       user: {
//         nick: req.user.nick,
//         loginId: req.user.loginId,
//         provider: req.user.provider,
//       },
//     });
//   } else {
//     res.status(403).json({
//       user: null,
//     });
//   }
// };

// exports.googleLoginCallback = (req, res, next) => {
//   res.redirect("http://localhost:3000");
// };
