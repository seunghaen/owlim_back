const express = require("express");
const app = express();

app.get("/", (req, res, next) => {
  res.send("hello world");
});
app.listen(8001, (req, res, next) => {
  console.log("8001번에 서버연결");
});
