const express = require("express");
const cookeiParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { sequelize } = require("./models");
const passportConfig = require("./passport");
const cors = require("cors");
const axios = require("axios");
dotenv.config();

const authRouter = require("./routes/auth");
const passport = require("passport");
const app = express();
passportConfig();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.set("port", process.env.PORT || 8001);
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("데이터베이스 연결");
  })
  .catch((err) => {
    console.error(err);
  });
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookeiParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get("/sample", async (req, res, next) => {
  console.log("req.user", req.user);
  try {
    const result = await axios.get(
      "https://www.googleapis.com/gmail/v1/users/me/messages?q=from:miricanvas@miricanvas.com",
      { headers: { Authorization: `Bearer ${req.user.accessToken}` } }
    );
    console.log(result);
    res.send("ㅎㅇ");
  } catch (error) {
    next(error);
  }
});
app.use("/auth", authRouter);
app.use((req, res, next) => {
  const error = new Error(`${req.method},${req.url} 라우터 없음`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err);
});

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번 포트에서 서버 연결중`);
});
