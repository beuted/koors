let recettes = [{
  name: "Tarte tatin aux tomates",
  ingredients: {
    "tomate": 7,
    "pâte feuilletée": 1,
    "pignons de pain": 1
  },
  type: "flemme",
  link: "https://dekajoo.notion.site/Tarte-tatin-tomates-44bca60e13474c1ca08789eef22ac632"
},
{
  name: "Stew",
  ingredients: {
    "oignon": 1,
    "ail": 5,
    "gingembre": 1,
    "curcuma": 1,
    "pois chiche 300g": 2,
    "lait de coco gras 400ml": 1,
    "bouillon cube": 1,
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
    "oignon rouge": 3,
    "gorgonzola 100g": 1,
    "noix 70g": 1
  },
  type: "flemme",
  link: "https://owiowifouettemoi.com/2019/05/21/farniente-pasta/",
  personnes: 2
},
{
  name: "Pierogi (entrée)",
  ingredients: {
    "farine 100g": 3,
    "oeuf": 3,
    "cottage cheese 250g": 1,
    "beurre": 1
  },
  link: "https://dekajoo.notion.site/Pierogi-54ec793bc45846808bf84f1e5968573d",
  personnes: 4
},
{
  name: "Chili végé",
  ingredients: {
    "oignon": 3,
    "carotte": 3,
    "poivron": 3,
    "haricot rouge 300g": 2,
    "pois chiche 300g": 1,
    "épices chili": 1,
    "cumin": 1,
    "bouillon cube": 1,
    "concassé tomate 50cl": 2,
    "chips tortillas": 1
  },
  link: "https://dekajoo.notion.site/Chili-v-g-d9e25dc8dda84df39f841c252434b6d6",
  personnes: 6
},
{
  name: "Lasagnes aux épinards",
  ingredients: {
    "lasagne": 1,
    "épinard surgelé 500g": 2,
    "cottage cheese 250g": 2,
    "lait": 1
  },
  personnes: 4
},
{
  name: "Lasagnes aux légumes du soleil",
  ingredients: {
    "lasagne": 1,
    "oignon": 2,
    "courgette": 3,
    "poivron": 3,
    "aubergine": 1,
    "tomate": 3,
    "concassé tomate 50cl": 1,
    "fromage rapé": 1
  },
  personnes: 4
},
{
  name: "Dhal de choux-fleur et de lentille corail",
  ingredients: {
    "choux-fleur": 1,
    "lentille corail 200g": 1,
    "lait de coco gras 400ml": 2,
    "abricots sec": 1,
    "curry": 1,
    "ail": 2,
    "carotte": 2,
    "oignon": 1,
    "huile de coco": 1
  },
  personnes: 4
},
{
  name: "Curry sri-lankais",
  ingredients: {
    "curry": 1,
    "patate douce": 1,
    "courge butternut": 1,
    "poivron": 2,
    "oignon rouge": 2,
    "ail": 3,
    "piment vert": 2,
    "épinards frais": 1,
    "citron vert": 1,
    "curcuma": 1,
  },
  personnes: 4
},
{
  name: "Curry patate douce lentilles",
  personnes: 4,
  ingredients: {
    //TODO
  },
  link: "https://dekajoo.notion.site/Curry-de-patate-douce-e8a2fee688b14c07b8f1d8eff98a201c"
},            
{
  name: "Salade de lentille",
  ingredients: {
    "lentille": 1,
    "féta": 1,
    "pomme": 1,
    "choux rouge": 1
  },
  type: "flemme",
},
{
  name: "Couscous végé",
  ingredients: {
    "semoule 200g": 3,
    "oignon rouge": 2,
    "tomate": 4,
    "courgette": 4,
    "carotte": 4,
    "pomme de terre": 3,
    "piment vert": 2,
    "choux": 1,
    "pois chiche 300g": 1,
    "concentré de tomate": 1,
    "paprika": 1,
    "ras-el-hanout": 1,
    "bouillon cube": 1,
    "harissa": 1,
    "amandes": 1,
    "coriandre": 1
  },
  personnes: 6
},
{
  name: "Rouleaux de printemps",
  ingredients: {
    "salade": 1,
    "carotte": 1,
    "avocat": 1,
    "citron vert": 1,
    "vermicelle de riz 60g": 1,
    "galette de riz": 8,
    "menthe": 1,
    "pousse de soja 100g": 1,
    "sauce soja": 1,
    "vinaigre de riz": 1
  },
  personnes: 4
},
{
  name: "Gauffre à la patate douce",
  ingredients: {
    "patate douce": 1,
    "oeuf": 3,
    "farine 100g": 2,
    "lait": 1,
    "fromage rapé": 1
  },
  personnes: 4
},
{
  name: "Pates carbo",
  ingredients: {
    "allumettes de bacon": 1,
    "oeuf": 2,
    "crème fraiche": 1,
    "pates longues 250g": 1
  },
  type: "flemme",
  personnes: 4
},
{
  name: "Crèpes aux champis",
  ingredients: {
    "galette": 4,
    "champignon": 1,
    "oignon": 1,
    "crème fraiche": 1,
    "fromage rapé": 1,
    "oeuf": 4,
    "salade": 1
  },
  personnes: 4
},
{
  name: "Risotto aux champignons & tomates séchées",
  ingredients: {
    "champignon": 1,
    "oignon": 1,
    "tomate séchée": 1,
    "riz à risotto": 1,
    "bouillon cube": 1,
    "parmesan": 1,
    "salade": 1
  },
  personnes: 4
},
{
  name: "Croques monsieur",
  ingredients: {
    "pain de mis": 1,
    "jambon": 1,
    "crème fraiche": 1,
    "fromage rapé": 1,
    "salade": 1
  },
  type: "flemme",
  personnes: 4
},
{
  name: "Pizza",
  ingredients: {
    "champignon": 1,
    "oignon": 1,
    "chorizo": 1,
    "mozzarella": 1,
    "concassé tomate 50cl": 1,
    "origan": 1,
    "salade": 1,
    "coeur d'artichaut": 1,
    "farine 100g": 1,
    "levure": 1,
  },
  personnes: 4
},
{
  name: "Quiche aux épinards",
  ingredients: {
    "épinard surgelé 500g": 1,
    "crème fraiche": 1,
    "pate feuilleté": 1,
    "oeuf": 3,
    "lait": 1,
    "féta": 1,
  },
  type: "flemme",
  personnes: 4
},
{
  name: "Quiche aux légumes",
  ingredients: {
    "légume du soleil surgelé": 1,
    "crème fraiche": 1,
    "pate feuilleté": 1,
    "oeuf": 3,
    "lait": 1,
    "féta": 1,
  },
  type: "flemme",
  personnes: 4
},
{
  name: "Bruschetta",
  ingredients: {
 //TODO
  },
  personnes: 4
},
{
  name: "Fajitas",
  ingredients: {
 //TODO
  },
  personnes: 4
},
{
  name: "Enchiladas végé",
  ingredients: {
 //TODO
  },
  personnes: 4
},
{
  name: "Flammekueche",
  ingredients: {
 //TODO
  },
  personnes: 4
},
{
  name: "Empanadas",
  ingredients: {
 //TODO
  },
  personnes: 4
},
{
  name: "Pho",
  ingredients: {
    //TODO
  },
  personnes: 4,
  link: "https://www.notion.so/dekajoo/Pho-e8ca0efeeeeb436bb28028c32aee8a29"
},
{
  name: "Crèpes sucrées",
  ingredients: {
    "farine 100g": 3,
    "oeuf": 4,
    "lait": 1,
    "beurre": 1,
    "rhum": 1,
    "sucre": 1,
    "nutella": 1,
    "citron": 1
  },
  link: "https://cuisine.journaldesfemmes.fr/recette/333415-recette-de-crepes-la-meilleure-recette-rapide",
  personnes: 4,
  type: "dessert"
},
{
  name: "Cookies",
  ingredients: {
    "beurre": 1,
    "sucre brun": 1,
    "sucre": 1,
    "oeuf": 1,
    "sucre vanillé": 1,
    "farine 100g": 2,
    "levure": 1,
    "chocolat cuisine": 1,
    "amandes": 1,
  },
  link: "https://dekajoo.notion.site/Cookies-54fdd89445744a8abfb396c825be235a",
  personnes: 4,
  type: "dessert"
},
{
  name: "Gateau léger à la compote",
  ingredients: {
    "compote de pomme 350g": 1,
    "huile de coco": 1,
    "oeuf": 2,
    "sucre": 1,
    "farine d'épeautre": 1,
    "levure": 1
  },
  type: "dessert",
  personnes: 4
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
  name: "tablettes lave vaisselle",
  singleItem: true,
  ingredients: {
    "tablettes lave vaisselle": 1,
  }
},
{
  name: "liquide rincage",
  singleItem: true,
  ingredients: {
    "liquide rincage": 1,
  }
},
{
  name: "lessive",
  singleItem: true,
  ingredients: {
    "lessive": 1,
  }
},
{
  name: "tampon",
  singleItem: true,
  ingredients: {
    "tampon": 1,
  }
},
{
  name: "beurre",
  singleItem: true,
  ingredients: {
    "beurre": 1,
  }
},
{
  name: "chocolat",
  singleItem: true,
  ingredients: {
    "beurre": 1,
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
  name: "sirop",
  singleItem: true,
  ingredients: {
    "sirop": 1,
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
  "conserves": "🥫",
  "sauce-feculent": "🍚",
  "hygiène": "🧻",
  "surgelés": "🧊",
  "apéro": "🍷",
  "ingredient-cuisine": "👨‍🍳",
  "cuisine-du-monde": "🍜",
  "000-none": "❓"
}

export let ingredientsToValidate = [
  "curcuma",
  "cumin",
  "bouillon cube",
  "noix de muscade",
  "épice chili",
  "origan",
  "ail",
  "oignon",
  "oeuf",
  "farine 100g",
  "farine d'épeautre",
  "levure",
  "fromage rapé",
  "lait",
  "parmesan",
  "curry",
  "huile de coco",
  "sucre",
  "sucre brun",
  "sucre vanillé",
  "paprika",
  "ras-el-hanout",
  "harissa",
  "coriandre",
  "sauce soja",
  "galette de riz",
  "semoule 200g",
  "pomme de terre",
  "beurre",
  "rhum",
  "nutella",
]

export let categoryMap = {
  // "fruits-et-légumes",
  "oignon": "fruits-et-légumes",
  "oignon rouge": "fruits-et-légumes",
  "ail": "fruits-et-légumes",
  "gingembre": "fruits-et-légumes",
  "épinards frais": "fruits-et-légumes",
  "tomate": "fruits-et-légumes",
  "échalottes": "fruits-et-légumes",
  "fruits": "fruits-et-légumes",
  "carotte": "fruits-et-légumes",
  "poivron": "fruits-et-légumes",
  "courgette": "fruits-et-légumes",
  "aubergine": "fruits-et-légumes",
  "choux-fleur": "fruits-et-légumes",
  "patate douce": "fruits-et-légumes",
  "courge butternut": "fruits-et-légumes",
  "piment vert": "fruits-et-légumes",
  "citron vert": "fruits-et-légumes",
  "citron": "fruits-et-légumes",
  "pomme": "fruits-et-légumes",
  "choux rouge": "fruits-et-légumes",
  "choux": "fruits-et-légumes",
  "coriandre": "fruits-et-légumes",
  "salade": "fruits-et-légumes",
  "avocat": "fruits-et-légumes",
  "menthe": "fruits-et-légumes",
  "pomme de terre": "fruits-et-légumes",
  "champignon": "fruits-et-légumes",

  // épices
  "curcuma": "épices",
  "curry": "épices",
  "cumin": "épices",
  "bouillon cube": "épices",
  "noix de muscade": "épices",
  "sel": "épices",
  "poivre": "épices",
  "épice chili": "épices",
  "paprika": "épices",
  "ras-el-hanout": "épices",
  "harissa": "épices",
  "origan": "épices",
  "épices chili": "épices",

  // laitages
  "pot yaourt skir": "laitages",
  "féta": "laitages",
  "mozzarella": "laitages",
  "cottage cheese 250g": "laitages",
  "gorgonzola 100g": "laitages",
  "beurre": "laitages",
  "oeuf": "laitages",
  "fromage rapé": "laitages",
  "parmesan": "laitages",
  "crème fraiche": "laitages",

  // Conserves
  "pois chiche 300g": "conserves",
  "mais": "conserves",
  "concassé tomate 50cl": "conserves",
  "haricot rouge 300g": "conserves",
  "concentré de tomate": "conserves",

  // sauces + feculents
  "lentille corail 200g": "sauce-feculent",
  "semoule 200g": "sauce-feculent",
  "lentille": "sauce-feculent",
  "pates courtes 250g": "sauce-feculent",
  "pates longues 250g": "sauce-feculent",
  "conchiglionis 300g": "sauce-feculent",
  "lasagne": "sauce-feculent",
  "huile d'olive": "sauce-feculent",
  "vinaigre": "sauce-feculent",
  "cornichons": "sauce-feculent",
  "ketchup": "sauce-feculent",
  "riz à risotto": "sauce-feculent",
  "tomate séchée": "sauce-feculent",
  "coeur d'artichaut": "sauce-feculent",

  // hygiène produit ménager
  "PQ": "hygiène",
  "dentrifice": "hygiène",
  "tablettes lave vaisselle": "hygiène",
  "liquide rincage": "hygiène",
  "lessive": "hygiène",
  "tampon": "hygiène",

  // Surgelés
  "épinard surgelé 500g": "surgelés",
  "légume du soleil surgelé": "surgelés",

  // Apéro + boissons
  "chips tortillas": "apéro",
  "sirop": "apéro",
  "lait": "apéro",
  "rhum": "apéro",

  // Ingrédient Cuisine
  "farine 100g": 'ingredient-cuisine',
  "farine d'épeautre": 'ingredient-cuisine',
  "sucre": 'ingredient-cuisine',
  "sucre brun": 'ingredient-cuisine',
  "sucre vanillé": 'ingredient-cuisine',
  "levure": 'ingredient-cuisine',
  "pignons de pain": 'ingredient-cuisine',
  "noix 70g": 'ingredient-cuisine',
  "abricots sec": 'ingredient-cuisine',
  "amandes": 'ingredient-cuisine',
  "graines": 'ingredient-cuisine',
  "chocolat": 'ingredient-cuisine',
  "chocolat cuisine": 'ingredient-cuisine',

  // Cuisine du monde
  "lait de coco gras 400ml": 'cuisine-du-monde',
  "huile de coco": 'cuisine-du-monde',
  "vermicelle de riz 60g": 'cuisine-du-monde',
  "galette de riz": 'cuisine-du-monde',
  "pousse de soja 100g": 'cuisine-du-monde',
  "sauce soja": 'cuisine-du-monde',
  "vinaigre de riz": 'cuisine-du-monde',

  //
  "galette": "000-none",
  "pate feuilleté": "000-none",
  "allumettes de bacon": "000-none",
  "chorizo": "000-none",
  "jambon": "000-none",
  "pâte feuilletée": "000-none",
  "pain à burger": "000-none",
  "café": "000-none",
  "chapelure": "000-none",
  "compote de pomme 350g": "000-none",
  "nutella": "000-none",
  "pain de mis": "000-none"
}

export default recettes;
