const express = require("express");
const { receive, getMailTitle } = require("../controllers/email");

const router = express.Router();
const multer = require("multer");

const upload = multer();

router.post("/receive", upload.none(), receive);
router.get("/get", getMailTitle);

module.exports = router;
