const getAll = require("../controllers/Unite.controller.js").getAll;
const getSpecific = require("../controllers/Unite.controller.js").getSpecific;
const createOne = require("../controllers/Unite.controller.js").createOne;
const updateOne = require("../controllers/Unite.controller.js").updateOne;
const deleteOne = require("../controllers/Unite.controller.js").deleteOne;
const express = require("express");
const Autentification = require("../middlewares/Authentification.middleware.js");
const UniteRouter = express.Router();
UniteRouter.get("/Unite/", Autentification, getAll);
UniteRouter.get("/Unite/:id", Autentification, getSpecific);
UniteRouter.post("/Unite/", Autentification, createOne);
UniteRouter.put("/Unite/:id", Autentification, updateOne);
UniteRouter.delete("/Unite/:id", Autentification, deleteOne);
module.exports = UniteRouter;
