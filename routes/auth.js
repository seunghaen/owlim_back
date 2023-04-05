const express = require("express");
const passport = require("passport");
const {
  loginSuccess,
  googleLoginCallback,
  login,
  join,
  logout,
} = require("../controllers/auth");
const router = express.Router();
const { isNotLoggedIn, isLoggedIn } = require("../middlewares");

router.post("/join", isNotLoggedIn, join);

router.post("/login", isNotLoggedIn, login);

router.get("/logout", isLoggedIn, logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/?loginError=구글로그인실패",
  }),
  googleLoginCallback
);
router.get("/login/success", loginSuccess);

module.exports = router;
