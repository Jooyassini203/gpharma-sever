const Notification = require("../database/models/Notification.model.js");
let cron = require("node-cron");
const { getDateNow } = require("../utils/utils.js");
const {
  convertEngDayMonth,
} = require("../utils/nizwami-ibrahim/ConvertEngDayMonth.js");
const Notification_utilisateur = require("../database/models/Notification_utilisateur.model.js");
const { Op, QueryTypes } = require("sequelize");
const db = require("../config/Database.js");
const getAllNewNotification = async (req, res) => {
  try {
    const job = cron.schedule("*/50 * * * * *", async () => {
      console.log(getDateNow()); //utilisateur_id
      const response = await db.query(
        `
      SELECT A.id, A.label, A.details, A.importance, A.icon, DATE_FORMAT(createdAt, ' %W %d %M %Y ') AS createdAt FROM notification A INNER JOIN notification_utilisateur B ON (A.id = B.notification_id AND B.etat = "NOUVELLE" ) WHERE A.deletedAt IS NULL ORDER BY createdAt DESC; 
      `,
        { type: QueryTypes.SELECT }
      );
      if (response.length > 0) {
        let resp = [];
        response.map((element) => {
          element = {
            ...element,
            ["createdAt"]: convertEngDayMonth(element.createdAt),
          };
          resp.push(element);
        });
        res.json(resp);
        job.destroy();
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};
const getAllNotification = async (req, res) => {
  try {
    const job = cron.schedule("*/10 * * * * *", async () => {
      console.log(getDateNow()); //utilisateur_id
      const response = await db.query(
        `
      SELECT A.id, A.label, A.details, A.importance, A.icon, B.etat, DATE_FORMAT(createdAt, ' %W %d %M %Y ') AS createdAt FROM notification A INNER JOIN notification_utilisateur B ON (A.id = B.notification_id  AND B.etat != "SUPPRIME" ) WHERE A.deletedAt IS NULL ORDER BY createdAt DESC; 
      `,
        { type: QueryTypes.SELECT }
      );
      if (response.length > 0) {
        let resp = [];
        response.map((element) => {
          element = {
            ...element,
            ["createdAt"]: convertEngDayMonth(element.createdAt),
          };
          resp.push(element);
        });
        res.json(resp);
        job.destroy();
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Notification.findOne({
      where: { id: req.params.id },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const createOne = (req, res) => {};
const updateOne = async (req, res) => {};
const deleteOne = async (req, res) => {
  const item = await Notification.findOne({ where: { id: req.params.id } });
  if (!item)
    return res.status(404).json({ message: "Notification introvable!" });
  const _item = Notification_utilisateur.findOne({
    where: { notification_id: item.id },
  });
  try {
    await Notification.destroy({ where: { id: req.params.id } });
    _item.set({ etat: "SUPPRIME" });
    await _item.save();
    return res
      .status(200)
      .json({ message: "Notification supprimée avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getAllNotification,
  getAllNewNotification,
  getSpecific,
  createOne,
  updateOne,
  deleteOne,
};
