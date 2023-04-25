const Mail = require("../models/mail");
const User = require("../models/user");

exports.receive = async (req, res) => {
  const { from, to, html, subject } = req.body;
  const letterAddress = from.split(" ")[1].slice(1, -1);
  const targetId = to.split("@")[0];
  console.log(letterAddress, targetId);
  const user = await User.findOne({ where: { loginId: targetId } });
  const letter = await Letter.findOne({ where: { letterAddress } });
  if (user) {
    const mail = await Mail.create({
      title: subject,
      html,
      from: letterAddress,
    });
    user.addMail(mail);
    if (letter) {
      mail.addLetter(letter);
    } else {
    }
  }
  res.status(200).json({
    message: "이메일 받기 성공",
  });
};
