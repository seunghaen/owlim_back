const Sequelize = require("sequelize");

class Mail extends Sequelize.Model {
  static initiate(sequelize) {
    Mail.init(
      {
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        html: {
          type: Sequelize.TEXT("long"),
          allowNull: false,
        },
        adress: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        sender: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Mail",
        tableName: "mails",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Mail.belongsTo(db.Letter);
    db.Mail.belongsTo(db.User);
  }
}

module.exports = Mail;
