const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");

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
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(400).send("존재하지 않는 유저");
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.status(200).json({
        code: 200,
        message: "로그인 성공",
      });
    });
  })(req, res, next);
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
