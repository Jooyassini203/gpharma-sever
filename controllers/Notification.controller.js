const Notification = require("../database/models/Notification.model.js");
let cron = require("node-cron");
const getAll = async (req, res) => {
  cron.schedule("*/2 * * * *", () => {
    console.log("running a task every two minutes");
  });
  //   try {
  //     const response = await Notification.findAll();
  //     res.json(response);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
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
  const item = Notification.findOne({ where: { id: req.params.id } });
  if (!item)
    return res.status(404).json({ message: "Notification introvable!" });
  try {
    await Notification.destroy({ where: { id: req.params.id } });
    return res
      .status(200)
      .json({ message: "Notification supprimé avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getAll, getSpecific, createOne, updateOne, deleteOne };
