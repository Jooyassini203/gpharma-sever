const getStatGeneral =
  require("../controllers/Accueil.controller.js").getStatGeneral;
const getStatVente =
  require("../controllers/Accueil.controller.js").getStatVente;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const AccueilRouter = express.Router();
AccueilRouter.get(
  "/Accueil/StatGeneral/:utilisateur_id",
  Autentification,
  getStatGeneral
);
AccueilRouter.get(
  "/Accueil/StatVente/:YearMonth",
  Autentification,
  getStatVente
);
module.exports = AccueilRouter;
