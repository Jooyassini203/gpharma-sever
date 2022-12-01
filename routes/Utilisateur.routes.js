const getAll = require(path.join(
  __dirname,
  "../controllers/utilisateur.controller.js"
)).getAll;
const getSpecific = require(path.join(
  __dirname,
  "../controllers/utilisateur.controller.js"
)).getSpecific;
const createOne = require(path.join(
  __dirname,
  "../controllers/utilisateur.controller.js"
)).createOne;
const changePwd = require(path.join(
  __dirname,
  "../controllers/utilisateur.controller.js"
)).changePwd;
const updateOne = require(path.join(
  __dirname,
  "../controllers/utilisateur.controller.js"
)).updateOne;
const deleteOne = require(path.join(
  __dirname,
  "../controllers/utilisateur.controller.js"
)).deleteOne;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const UtilisateurRouter = express.Router();

UtilisateurRouter.get("/utilisateurs/:id", Autentification, getAll);
UtilisateurRouter.get("/utilisateur/:id", Autentification, getSpecific);
UtilisateurRouter.post("/utilisateur/", Autentification, createOne);
UtilisateurRouter.put("/utilisateur/:id", Autentification, updateOne);
UtilisateurRouter.delete("/utilisateur/:id", Autentification, deleteOne);
UtilisateurRouter.put("/changePwd/:id", Autentification, changePwd);

module.exports = UtilisateurRouter;
