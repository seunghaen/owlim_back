const Letter = require("../models/letter");

exports.uploadImg = (req, res, next) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};
exports.uploadLetter = async (req, res, next) => {
  console.log(req.body);
  const { address, url, type, name, desc } = req.body;
  try {
    const letter = await Letter.create({
      name,
      type,
      desc,
      address,
      imgUrl: url,
    });
    console.log(letter);
    res.json({ message: "레터가 정상적으로 등록되었습니다.", letter });
  } catch (error) {
    next(error);
  }
};

exports.getLetters = async (req, res, next) => {
  try {
    const letters = await Letter.findAll({
      attributes: ["desc", "address", "type", "imgUrl", "name", "id"],
    });
    res.json({ message: "불러오기 성공", letters });
  } catch (error) {
    next(error);
  }
};
