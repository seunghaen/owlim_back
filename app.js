const express = require("express");
const cookeiParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { sequelize } = require("./models");

dotenv.config();

const authRouter = require("./routes/auth");
const { Sequelize } = require("sequelize");

const app = express();
app.set("port", process.env.PORT || 8001);
sequelize
  .sync({ force: false })
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
