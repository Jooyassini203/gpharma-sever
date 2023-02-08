const express = require("express");
const FileUpload = require("express-fileupload");
const cors = require("cors");
const hbs = require("handlebars");
const UtilisateurRouter = require("./routes/Utilisateur.routes.js");
const VoieRouter = require("./routes/Voie.routes.js");
const ParametreRouter = require("./routes/Parametre.routes.js");
const expressLayouts = require("express-ejs-layouts");
const Migration = require("./database/migrations/Migration.js");
const CaisseRouter = require("./routes/Caisse.routes.js");
const FormeRouter = require("./routes/Forme.routes.js");
const FabricantRouter = require("./routes/Fabricant.routes.js");
const FamilleRouter = require("./routes/Famille.routes.js");
const UniteRouter = require("./routes/Unite.routes.js");
const Mode_expeditionRouter = require("./routes/Mode_expedition.routes.js");
const EmplacementRouter = require("./routes/Emplacement.routes.js");
const FournisseurRouter = require("./routes/Fournisseur.routes.js");
const LoginRouter = require("./routes/Login.routes.js");
const SocieteRouter = require("./routes/Societe.routes.js");
const ProduitRouter = require("./routes/Produit.routes.js");
const RavitaillementRouter = require("./routes/Ravitaillement.routes.js");
const AjustementRouter = require("./routes/Ajustement.routes.js");
const GuichetRouter = require("./routes/Guichet.routes.js");
const VenteRouter = require("./routes/Vente.routes.js");
const AccueilRouter = require("./routes/Accueil.routes.js");
const EntrepriseRouter = require("./routes/Entreprise.routes.js");
const DownloadRouter = require("./routes/Download.routes.js");
const path = require("path");
const Marge_beneficiaireRouter = require("./routes/Marge_beneficiaire.routes.js");
const NotificationRouter = require("./routes/Notification.routes.js");
const { getNotification } = require("./controllers/Notification.controller.js");
console.log("\n\n\tMODE ", process.env.NODE_ENV, "\n\n");
const app = express();
app.use(expressLayouts);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(FileUpload());
const http = require("http").Server(app);

app.set("view engine", "handlebars");
// app.engine("handlebars", handlebars.engines);
hbs.registerHelper("ifNull", function (v) {
  if (v == null) {
    return "";
  }
});

//New imports
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("getNotification", async (data) => {
    console.log(data);
    socketIO.emit("newNotification", await getNotification());
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

app.use(LoginRouter);
app.use(AccueilRouter);

app.use(UtilisateurRouter);
app.use(VoieRouter);
app.use(CaisseRouter);
app.use(EmplacementRouter);
app.use(FormeRouter);
app.use(FamilleRouter);
app.use(FabricantRouter);
app.use(Mode_expeditionRouter);
app.use(UniteRouter);
app.use(ParametreRouter);
app.use(FournisseurRouter);
app.use(SocieteRouter);
app.use(ProduitRouter);
app.use(RavitaillementRouter);
app.use(AjustementRouter);
app.use(GuichetRouter);
app.use(VenteRouter);
app.use(EntrepriseRouter);
app.use(DownloadRouter);
app.use(Marge_beneficiaireRouter);
app.use(NotificationRouter);

Migration();

app.listen(process.env.PORT, () => {
  console.log(`SERVEUR LANCE SUR LE PORT ${process.env.PORT} ...`);
});

module.exports = socketIO;
