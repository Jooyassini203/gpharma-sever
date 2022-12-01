const Op = require("sequelize").Op;
const QueryTypes = require("sequelize").QueryTypes;
const db = require("../config/Database.js");
const Utilisateur = require("../database/models/utilisateur.model.js");
const Vente = require("../database/models/Vente.model.js");
const getDateNow = require("../utils/utils.js").getDateNow;
const getStatGeneral = async (req, res) => {
  const user = await Utilisateur.findOne({ id: req.params.utilisateur_id });
  if (!user)
    return res.status(404).send({ message: "Utilisateur introvable!" });
  try {
    let query = `SELECT  (    SELECT COUNT(*)  FROM ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement = "COMMANDE")  AS count_commande
      ,(    SELECT COUNT(*)  FROM   ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement != "COMMANDE") AS count_livraison
      ,(    SELECT COUNT(*)  FROM   vente WHERE deletedAt IS NULL AND etat_vente = "0") AS count_guichet
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL AND etat_vente != "0") AS count_caisse 
      ,(    SELECT COUNT(*)  FROM   ravitaillement  WHERE deletedAt IS NULL) AS count_rvt_total
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL) AS count_vente_total`;
    if (user.type_utilisateur == "CAISSIER")
      query = `SELECT  (    SELECT COUNT(*)  FROM ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement = "COMMANDE")  AS count_commande
      ,(    SELECT COUNT(*)  FROM   ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement != "COMMANDE") AS count_livraison
      ,(    SELECT COUNT(*)  FROM   vente WHERE deletedAt IS NULL AND etat_vente = "0" AND caissier_id == '${user.type_utilisateur}') AS count_guichet
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL AND etat_vente != "0" AND caissier_id == '${user.type_utilisateur}') AS count_caisse 
      ,(    SELECT COUNT(*)  FROM   ravitaillement  WHERE deletedAt IS NULL) AS count_rvt_total
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL AND caissier_id == '${user.type_utilisateur}') AS count_vente_total`;
    if (user.type_utilisateur == "GUICHETIER")
      query = `SELECT  (    SELECT COUNT(*)  FROM ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement = "COMMANDE")  AS count_commande
      ,(    SELECT COUNT(*)  FROM   ravitaillement WHERE deletedAt IS NULL AND etat_ravitaillement != "COMMANDE") AS count_livraison
      ,(    SELECT COUNT(*)  FROM   vente WHERE deletedAt IS NULL AND etat_vente = "0" AND guichetier_id == '${user.type_utilisateur}') AS count_guichet
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL AND etat_vente != "0" AND guichetier_id == '${user.type_utilisateur}') AS count_caisse 
      ,(    SELECT COUNT(*)  FROM   ravitaillement  WHERE deletedAt IS NULL) AS count_rvt_total
      ,(    SELECT COUNT(*)  FROM   vente  WHERE deletedAt IS NULL AND guichetier_id == '${user.type_utilisateur}') AS count_vente_total`;
    const count = await db.query(query, { type: QueryTypes.SELECT });
    res.status(200).send(count);
  } catch (error) {
    console.log(error.message);
  }
};
const getStatVente = async (req, res) => {
  console.log(`%${req.params.YearMonth}%`);
  try {
    const item_vente = await Vente.findOne({
      attributes: ["date_vente"],
      where: { etat_vente: "1" },
      order: [["createdAt", "ASC"]],
    });
    if (!item_vente) {
      return res.status(404).json({
        message: "Aucune vente!",
      });
    }
    // const date_vente =
    //   item_vente.date_vente.getFullYear() +
    //   "-" +
    //   item_vente.date_vente.getMonth();

    // // "-" + item_vente.date_vente.getDay().toString().length == 1
    // //   ? "0" + item_vente.date_vente.getDay()
    // //   : item_vente.date_vente.getDay();
    let dayStart = 1;
    let arrayDay = [];
    // const firstDay = parseInt(date_vente.slice(7, 9));
    // if (date_vente.slice(0, 7) == getDateNow().slice(0, 7)) {
    //   dayStart = firstDay;
    // }
    let select = "SELECT";
    for (let i = dayStart; i <= parseInt(getDateNow().slice(8, 10)); i++) {
      select += `(SELECT COUNT(date_vente)  FROM   vente  WHERE deletedAt IS NULL AND date_vente LIKE "%${getDateNow().slice(
        0,
        7
      )}-${i.toString().length == 1 ? "0" + i : i}%") AS count_${i} ,`;
      arrayDay.push(i);
    }
    select = select.slice(0, -1);
    const count = await db.query(select, { type: QueryTypes.SELECT });
    let temp = [];
    // Object.entries(newData).forEach(([key1, value1]) => {
    //     if (key === key1) {
    //       myJson[key] = value1;
    //     }
    //   });
    for (let index = dayStart; index <= arrayDay.length; index++) {
      temp.push(count[0]["count_" + index]);
    }
    res.status(200).send([arrayDay, temp]);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = { getStatGeneral, getStatVente };
