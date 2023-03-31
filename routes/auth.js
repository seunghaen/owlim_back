const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/?loginError=구글로그인실패",
  }),
  (req, res, next) => {
    res.redirect("http://localhost:3000");
  }
);
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: {
        nick: req.user.nick,
        email: req.user.email,
        provider: req.user.provider,
      },
    });
  } else {
    res.status(403).json({
      user: null,
    });
  }
});

module.exports = router;
