const express = require("express");
const { receive } = require("../controllers/email");

const router = express.Router();
const multer = require("multer");

const upload = multer();

router.post("/receive", upload.none(), receive);

module.exports = router;
Í;
