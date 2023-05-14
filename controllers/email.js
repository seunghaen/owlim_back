const Mail = require("../models/mail");
const User = require("../models/user");
const Letter = require("../models/letter");
const passport = require("passport");

exports.receive = async (req, res, next) => {
  const { from, to, html, subject } = req.body;
  const address = from.split(" ")[1].slice(1, -1);
  const sender = from.split(" ")[0];
  const targetId = to.split("@")[0].slice(1);
  console.log(address, targetId);
  try {
    const user = await User.findOne({ where: { loginId: targetId } });
    const letter = await Letter.findOne({ where: { address } });
    if (user) {
      const mail = await Mail.create({
        title: subject,
        html,
        address,
        sender,
      });
      user.addMail(mail);
      if (letter) {
        letter.addMail(mail);
      }
    }
    res.status(200).json({
      message: "이메일 받기 성공",
    });
  } catch (error) {
    next(error);
  }
};

exports.getMailController = (req, res, next) => {
  passport.authenticate("ajwt", async (error, user) => {
    if (!user) {
      return res.status(401).json({
        message: "존재하지 않는 유저입니다.",
        code: "not exist",
      });
    }
    if (error) {
      if (err.name == "TokenExpiredError") {
        return res
          .status(419)
          .json({ message: "만료된 엑세스 토큰입니다.", code: "expired" });
      }
    }
    const mails = await user.getMails({
      attributes: ["title", "id", "adress", "createdAt", "sender", "isread"],
      include: "Letter",
    });
    let mailList = [];
    mails.map(async (mail) => {
      let letterName = null;
      const createdDate = [
        mail.createdAt.getFullYear(),
        mail.createdAt.getMonth(),
        mail.createdAt.getDay(),
      ];
      if (mail.Letter) {
        letterName = mail.Letter.name;
      }
      mailList.push({
        title: mail.title,
        id: mail.id,
        sender: mail.sender,
        address: mail.address,
        isRead: mail.isread,
        letterName,
        createdDate,
      });
    });
    res.status(200).json({ mailList });
  })(req, res, next);
};

exports.getMailHtmlController = (req, res, next) => {
  passport.authenticate("ajwt", async (error, user) => {
    if (!user) {
      return res.status(401).json({
        message: "존재하지 않는 유저입니다",
        code: "not exist",
      });
    }
    if (error) {
      if (err.name == "TokenExpiredError") {
        return res
          .status(419)
          .json({ message: "만료된 엑세스 토큰입니다.", code: "expired" });
      }
    }
    console.log(req.params);
    const mails = await user.getMails({
      where: { id: req.params.id },
      attributes: ["html"],
    });
    res.status(200).json({ html: mails[0].html });
  })(req, res, next);
};
