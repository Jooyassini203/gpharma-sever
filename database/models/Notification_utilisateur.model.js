const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Notification_utilisateur = db.define(
  "notification_utilisateur",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    etat: {
      type: DataTypes.BOOLEAN,
      defaultValue: "NOUVELLE",
    },
  },
  { paranoid: true, timestamps: false }
);

module.exports = Notification_utilisateur;
