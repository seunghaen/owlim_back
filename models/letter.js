const Sequelize = require("sequelize");

class Letter extends Sequelize.Model {
  static initiate(sequelize) {
    Letter.init(
      {
        title: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
        },
        letterAddress: {
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Letter",
        tableName: "letters",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Letter.hasMany(db.Mail);
    db.Letter.hasMany(db.Keyword);
  }
}

module.exports = Letter;
