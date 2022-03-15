let recettes = [{
  name: "Tarte tatin aux tomates",
  ingredients: {
    "tomate": 7,
    "pâte feuilletée": 1,
    "pignons de pain": 1
  },
  link: "https://dekajoo.notion.site/Tarte-tatin-tomates-44bca60e13474c1ca08789eef22ac632"
},
{
  name: "Stew",
  ingredients: {
    "oignons": 1,
    "ail": 5,
    "gingembre": 1,
    "curcuma": 1,
    "pois chiches 300g": 2,
    "lait de coco gras 400ml": 1,
    "bouillons cube": 1,
    "épinards frais": 1,
    "pot yaourt skir": 1,
    "tomate": 2,
    "échalottes": 2
  },
  link: "https://owiowifouettemoi.com/2019/01/23/the-stew-pois-chiche-coco-et-curcuma/"
},
{
  name: "Burger végé féta",
  ingredients: {
    "féta": 1,
    "oeuf": 1,
    "farine 100g": 1,
    "graines": 1,
    "cumin": 1,
    "pain à burger": 2,
    "cornichons": 1,
    "ketchup": 1
  },
  link: "https://dekajoo.notion.site/Steak-feta-cfe2ad9e8ccf4795b9d9da830bc61b0a"
},
{
  name: "Conchiglionis farcis, brousse-épinard",
  ingredients: {
    "conchiglionis 300g": 1,
    "épinard surgelé 500g": 1,
    "cottage cheese 250g": 1,
    "concassé tomate 50cl": 1,
    "chapelure": 1,
    "noix de muscade": 1,
  },
  link: "https://dekajoo.notion.site/Conchiglionis-farcis-brousse-pinard-c8e5fbbca7384fc99b149f1c24cd6036"
},
{
  name: "Pâtes aux oignons rouges & gorgonzola",
  ingredients: {
    "pates courtes 250g": 1,
    "oignons rouges": 3,
    "gorgonzola 100g": 1,
    "noix 70g": 1
  },
  link: "https://owiowifouettemoi.com/2019/05/21/farniente-pasta/",
  personnes: 2
},
{
  name: "Pierogi (entrée)",
  ingredients: {
    "farine 100g": 3,
    "oeuf": 3,
    "cottage cheese 250g": 1,
    "beurre 10g": 3
  },
  link: "https://dekajoo.notion.site/Pierogi-54ec793bc45846808bf84f1e5968573d",
  personnes: 4
},
{
  name: "Chili végé",
  ingredients: {
    "oignons": 3,
    "carottes": 3,
    "poivrons": 3,
    "haricots rouge 300g": 2,
    "pois chiches 300g": 1,
    "épices chili": 1,
    "cumin": 1,
    "bouillons cube": 1,
    "concassé tomate 50cl": 2,
    "chips tortillas": 1
  },
  link: "https://dekajoo.notion.site/Chili-v-g-d9e25dc8dda84df39f841c252434b6d6",
  personnes: 6
},
{
  name: "Lasagne aux épinards",
  ingredients: {}
},
{
  name: "Lasagne aux légumes du soleil",
  ingredients: {}
},
{
  name: "Dhal de choux-fleur et de lentille corail",
  ingredients: {}
},
{
  name: "Curry sri-lankais",
  ingredients: {}
},
{
  name: "Salade de lentille",
  ingredients: {}
},
{
  name: "Gateau légé à la compote",
  ingredients: {}
},
{
  name: "PQ",
  singleItem: true,
  ingredients: {
    "PQ": 1,
  }
},
{
  name: "café",
  singleItem: true,
  ingredients: {
    "café": 1,
  }
},
{
  name: "dentrifice",
  singleItem: true,
  ingredients: {
    "dentrifice": 1,
  }
},
{
  name: "huile d'olive",
  singleItem: true,
  ingredients: {
    "huile d'olive": 1,
  }
},
{
  name: "vinaigre",
  singleItem: true,
  ingredients: {
    "vinaigre": 1,
  }
},
{
  name: "sel",
  singleItem: true,
  ingredients: {
    "sel": 1,
  }
},
{
  name: "poivre",
  singleItem: true,
  ingredients: {
    "poivre": 1,
  }
},
{
  name: "fruits",
  singleItem: true,
  ingredients: {
    "fruits": 1,
  }
}];

export let categories = {
  "fruits-et-légumes": "🍆",
  "épices": "🌶️",
  "laitages": "🐄",
  "conserves+sauces": "🥫",
  "hygiène": "🧻",
  "surgelés": "🧊",
  "apéro": "🍷"
}

export let ingredientsToValidate = [
  "curcuma",
  "cumin",
  "bouillons cube",
  "noix de muscade",
  "sel",
  "poivre",
  "épices chili",
  "ail",
  "oignons",
  "oeuf",
  "farine 100g"
]

export let categoryMap = {
  // "fruits-et-légumes",
  "oignons": "fruits-et-légumes",
  "oignons rouges": "fruits-et-légumes",
  "ail": "fruits-et-légumes",
  "gingembre": "fruits-et-légumes",
  "épinards frais": "fruits-et-légumes",
  "tomate": "fruits-et-légumes",
  "échalottes": "fruits-et-légumes",
  "fruits": "fruits-et-légumes",
  "carottes": "fruits-et-légumes",
  "poivrons": "fruits-et-légumes",

  // épices
  "curcuma": "épices",
  "cumin": "épices",
  "bouillons cube": "épices",
  "noix de muscade": "épices",
  "sel": "épices",
  "poivre": "épices",
  "épices chili": "épices",

  // laitages
  "pot yaourt skir": "laitages",
  "féta": "laitages",
  "cottage cheese 250g": "laitages",
  "gorgonzola 100g": "laitages",
  "beurre 10g": "laitages",
  "oeuf": "laitages",

  // Conserves + sauces
  "cornichons": "conserves+sauces",
  "ketchup": "conserves+sauces",
  "pois chiches 300g": "conserves+sauces",
  "mais": "conserves+sauces",
  "huile d'olive": "conserves+sauces",
  "vinaigre": "conserves+sauces",
  "conchiglionis 300g": "conserves+sauces",
  "concassé tomate 50cl": "conserves+sauces",
  "haricots rouge 300g": "conserves+sauces",
  "pates courtes 250g": "conserves+sauces",



  // hygiène produit ménager
  "PQ": "hygiène",
  "dentrifice": "hygiène",

  // Surgelés
  "épinard surgelé 500g": "surgelés",

  // Apéro + boissons
  "chips tortillas": "apéro",

  //

  "lait de coco gras 400ml": '',
  "pâte feuilletée": '',

  "pignons de pain": '',
  "noix 70g": '',

  "farine 100g": '',
  "graines": '',
  "pain à burger": '',
  "café": '',
  "chapelure": '',
}

export default recettes;