const Letter = require("../models/letter");

exports.uploadImg = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};
exports.uploadLetterDesc = async (req, res) => {
  const { address, url, type, name, desc } = req.body;
  try {
    const letter = await Letter.create({
      name,
      type,
      desc,
      address,
      imgUrl: url,
    });
  } catch (error) {}
};
