const Utilisateur = require("../database/models/Utilisateur.model.js");
const bcrypt = require("bcrypt");
const cryptojs = require("crypto-js");
const getDateNow = require("../utils/utils.js").getDateNow;

const login = async (req, res) => {
  const nom_login = req.body.nom_login;
  const mot_de_passe = req.body.mot_de_passe;
  const user = await Utilisateur.findOne({ where: { nom_login } });
  if (!user)
    return res
      .status(404)
      .json({ message: "Nom d'utilisateur ou mot de passe incorrect!" });
  console.log("\n\nSTART COMPARE AND CRYPTE\n\n");
  bcrypt.compare(mot_de_passe, user.mot_de_passe, async (erreur, result) => {
    if (result) {
      user.set({ date_der_log: getDateNow(), isOnline: "1" });
      await user.save();

      const dataSession = {
        id: user.id,
        type_utilisateur: user.type_utilisateur,
        nom_login: user.nom_login,
        nom_utilisateur: user.nom_utilisateur,
        image: user.image,
        url: user.url,
        mot_de_passe: user.mot_de_passe,
      };
      let dataSessionCrypted = JSON.stringify(dataSession);

      dataSessionCrypted = cryptojs.AES.encrypt(
        dataSessionCrypted,
        process.env.KEY_SESSION
      ).toString();
      console.log("\n\n\n dataSession ", dataSession);
      console.log(
        "\n\n\nJSON.stringify(dataSession)",
        JSON.stringify(dataSession)
      );
      console.log("dataSessionCrypted", dataSessionCrypted);
      return res.status(200).send({
        message: "Vous êtes connecté",
        dataUser: JSON.stringify(dataSession),
      });
    } else
      return res
        .status(404)
        .send({ message: "Nom d'utilisateur ou mot de passe incorrect!" });
  });
};

const reloadDataUser = async (req, res) => {
  const user = await Utilisateur.findOne({ where: { id: req.params.id } });
  if (!user)
    return res.status(404).json({ message: "Utilisateur introuvable!" });

  const dataSession = {
    id: user.id,
    type_utilisateur: user.type_utilisateur,
    nom_login: user.nom_login,
    nom_utilisateur: user.nom_utilisateur,
    url: user.url,
    image: user.image,
    mot_de_passe: user.mot_de_passe,
  };
  let dataSessionCrypted = JSON.stringify(dataSession);

  dataSessionCrypted = cryptojs.AES.encrypt(
    dataSessionCrypted,
    process.env.KEY_SESSION
  ).toString();
  console.log("dataSessionCrypted", dataSessionCrypted);
  // localStorage.setItem("gpharma@2.0.0", JSON.stringify(dataSession));
  return res.status(200).send({ dataUser: JSON.stringify(dataSession) });
};

const logout = async (req, res) => {
  const user = await Utilisateur.findOne({
    where: { id: req.params.id },
  });
  if (!user)
    return res.status(404).json({ message: "Utilisateur introvable!" });
  try {
    user.set({ date_der_log: getDateNow(), isOnline: "0" });
    await user.save();
    return res.status(200).send({ message: "Vous êtes déconnecté" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
module.exports = { login, logout, reloadDataUser };
