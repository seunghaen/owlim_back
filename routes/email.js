const express = require("express");
const {
  receive,
  getMailController,
  getMailHtmlController,
} = require("../controllers/email");

const router = express.Router();
const multer = require("multer");

const upload = multer();

router.post("/receive", upload.none(), receive);
router.get("/get", getMailController);
router.get("/read/:id", getMailHtmlController);

module.exports = router;
