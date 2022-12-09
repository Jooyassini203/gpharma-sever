const faker = require("@faker-js/faker").faker;
const data = require("../../utils/produit-data-polyclinique3/data.js");
let produitListe = [];
let arrayFamilleValue = [
  "CONSOMMABLE",
  "MEDICAMENT",
  "INJECTION",
  "MATÉRIAUX",
  "INSTRUMENT",
  "OUTILS",
];
let produitEmplacementListe = [];
const getNumberRadom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
data.forEach((element, index) => {
  const code_lot_produit = element.id_stock;
  const quantite_stock = element.quantite_stock;
  let date_peremption;
  if (index <= 20) date_peremption = faker.date.past();
  else date_peremption = faker.date.future();
  produitListe.push({
    code_lot_produit,
    nom_produit: element.designation_stock,
    classification_produit: " ",
    description: " ",
    // image: faker.image.imageUrl(),
    prix_stock: element.designation_stock,
    presentation_quantite: element.prst_qt,
    stock_min: element.stock_mini,
    stock_max: element.stock_maxi,
    quantite_stock,
    date_der_ravitaillement: element.date_der_entr,
    date_peremption,
    fabricant_id: getNumberRadom(1, 32),
    famille_id: getNumberRadom(1, 5),
    forme_id: getNumberRadom(1, 73),
    unite_achat: getNumberRadom(1, 16),
    unite_vente: getNumberRadom(1, 16),
    unite_stock: getNumberRadom(1, 16),
    unite_presentation: getNumberRadom(1, 16),
    voie_id: getNumberRadom(1, 5),
  });
  // if (index < 4)
  for (let i = 0; i < 2; i++) {
    produitEmplacementListe.push({
      produit_code_lot_produit: code_lot_produit,
      quantite_produit: quantite_stock / 2,
      quantite_der_depot: quantite_stock / 2,
      quantite_der_retrait: 0, //quantite_stock / 2 - getNumberRadom(1, quantite_stock / 2 - 1)
      date_der_depot: faker.date.recent(),
      date_der_retrait: faker.date.recent(),
      emplacement_id: i + 1,
    });
  }
});
// for (let index = 0; index < 6; index++) {
//   const code_lot_produit =
//     faker.commerce.productAdjective() + getNumberRadom(1, 20);
//   const quantite_stock = getNumberRadom(20, 200);
//   produitListe.push({
//     code_lot_produit,
//     nom_produit: faker.commerce.productName(),
//     classification_produit: faker.commerce.productDescription(),
//     description: faker.commerce.productDescription(),
//     // image: faker.image.imageUrl(),
//     prix_stock: faker.commerce.price(),
//     presentation_quantite: getNumberRadom(1, 20),
//     stock_min: getNumberRadom(5, 20),
//     stock_max: getNumberRadom(200, 500),
//     quantite_stock,
//     date_der_ravitaillement: faker.date.recent(),
//     date_peremption: faker.date.future(),
//     fabricant_id: getNumberRadom(1, 32),
//     famille_id: getNumberRadom(1, 5),
//     forme_id: getNumberRadom(1, 73),
//     unite_achat: getNumberRadom(1, 16),
//     unite_vente: getNumberRadom(1, 16),
//     unite_stock: getNumberRadom(1, 16),
//     unite_presentation: getNumberRadom(1, 16),
//     voie_id: getNumberRadom(1, 5),
//   });
//   // if (index < 4)
//   for (let i = 0; i < 2; i++) {
//     produitEmplacementListe.push({
//       produit_code_lot_produit: code_lot_produit,
//       quantite_produit: quantite_stock / 2,
//       quantite_der_depot: quantite_stock / 2,
//       quantite_der_retrait: 0, //quantite_stock / 2 - getNumberRadom(1, quantite_stock / 2 - 1)
//       date_der_depot: faker.date.recent(),
//       date_der_retrait: faker.date.recent(),
//       emplacement_id: i + 1,
//     });
//   }
// }
module.exports = { produitListe, produitEmplacementListe };
