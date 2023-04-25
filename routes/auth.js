const express = require("express");
const { login, join, logout, refreshToken } = require("../controllers/auth");
const router = express.Router();

router.post("/join", join);

router.post("/login", login);

router.get("/logout", logout);

router.post("/refreshToken", refreshToken);

//구글 로그인 일시중지
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//   })
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/?loginError=구글로그인실패",
//   }),
//   googleLoginCallback
// );

//사용중지, 방법 변경
// router.get("/login/success", loginSuccess);

module.exports = router;
