const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadImg, uploadLetterDesc } = require("../controllers/letter");

const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /letter/img
router.post("/img", upload.single("img"), uploadImg);

// POST /letter/post
const upload2 = multer();
router.post("/post", upload2.none(), uploadLetterDesc);

module.exports = router;
