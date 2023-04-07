const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.join = async (req, res, next) => {
  const { loginId, nick, password } = req.body;
  console.log(req.body);
  try {
    const exUser = await User.findOne({ where: { loginId } });
    if (exUser) {
      return res
        .status(409)
        .json({ code: 409, meessage: "이미 존재하는 유저 아이디입니다." });
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
      console.error(err);
      next(err);
    }
    if (!user) {
      res.status(401).json({
        message: info.meessage,
      });
    }
    const refreshToken = jwt.sign(
      { sub: "refresh", email: req.body.email },
      process.env.JWT_SECRET_OR_KEY,
      { expiresIn: "24h" }
    );
    const accessToken = jwt.sign(
      { sub: "access", email: req.body.email },
      process.env.JWT_SECRET_OR_KEY,
      { expiresIn: "5m" }
    );
    res.status(200).json({
      nick: user.nick,
      loginId: user.loginId,
      accessToken,
      refreshToken,
    });
  });
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};

exports.loginSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: {
        nick: req.user.nick,
        loginId: req.user.loginId,
        provider: req.user.provider,
      },
    });
  } else {
    res.status(403).json({
      user: null,
    });
  }
};

exports.googleLoginCallback = (req, res, next) => {
  res.redirect("http://localhost:3000");
};
