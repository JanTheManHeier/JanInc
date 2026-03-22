// SpisSlank Meal Database — meals + 4 weekly plans
// Pathway scores 0-5: glp1, gip, glucagon, amylin, pyy, leptin, ghrelin, insulin

window.MEALS = [

  // ─── BREAKFAST (8) ────────────────────────────────────────────────

  {
    id: "overnight-oats-skyr",
    name: "Overnight Oats med Skyr",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 4, insulin: 5 },
    scienceNote: "Betaglukan → GLP-1. Skyr 20 g protein → PYY.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Havregryn", amount: "80 g", section: "Tørrvarer" },
      { name: "Skyr naturell", amount: "150 g", section: "Meieri" },
      { name: "Blåbær", amount: "75 g", section: "Frukt & Grønt" },
      { name: "Melk", amount: "1 dl", section: "Meieri" }
    ],
    instructions: "Bland havregryn, skyr og melk kvelden før. Topp med blåbær om morgenen.",
    tags: ["quick", "no-cook", "high-fiber", "high-protein"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "overnight-oats-banan",
    name: "Overnight Oats med Banan & Kanel",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 2, leptin: 2, ghrelin: 3, insulin: 4 },
    scienceNote: "Kanel bedrer insulinfølsomhet. Betaglukan gir langvarig metthet.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Havregryn", amount: "80 g", section: "Tørrvarer" },
      { name: "Banan", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Kanel", amount: "1 ts", section: "Tørrvarer" },
      { name: "Melk", amount: "1.5 dl", section: "Meieri" }
    ],
    instructions: "Bland havregryn og melk kvelden før. Skjær banan og dryss kanel på om morgenen.",
    tags: ["quick", "no-cook", "high-fiber"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "eggerore-knekke",
    name: "Eggerøre med Knekkebrød",
    type: "breakfast",
    prepTime: 10,
    pathways: { glp1: 2, gip: 3, glucagon: 3, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Egg gir 13 g protein → glukagon + PYY-respons.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Egg", amount: "3 stk", section: "Meieri" },
      { name: "Melk", amount: "2 ss", section: "Meieri" },
      { name: "Fullkornsknekkebrød", amount: "2 stk", section: "Bakeri" },
      { name: "Smør", amount: "1 ts", section: "Meieri" },
      { name: "Salt og pepper", amount: "etter smak", section: "Tørrvarer" }
    ],
    instructions: "Visp egg og melk. Stek på lav varme med smør, rør forsiktig. Server på knekkebrød.",
    tags: ["high-protein", "quick"],
    allergens: ["dairy", "gluten", "eggs"],
    dietary: ["vegetarian"]
  },

  {
    id: "kokt-egg-avokado",
    name: "Kokte Egg med Avokado",
    type: "breakfast",
    prepTime: 12,
    pathways: { glp1: 2, gip: 2, glucagon: 3, amylin: 2, pyy: 3, leptin: 3, ghrelin: 3, insulin: 2 },
    scienceNote: "Avokado-fett bremser absorpsjon → jevnt blodsukker + leptin.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Egg", amount: "2 stk", section: "Meieri" },
      { name: "Avokado", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Fullkornsknekkebrød", amount: "2 stk", section: "Bakeri" },
      { name: "Sitronjuice", amount: "litt", section: "Frukt & Grønt" },
      { name: "Chiliflak", amount: "en klype", section: "Tørrvarer" }
    ],
    instructions: "Kok egg 7–8 min. Mos avokado med sitron og chili, smør på knekkebrød.",
    tags: ["high-protein", "healthy-fats"],
    allergens: ["gluten", "eggs"],
    dietary: ["vegetarian", "lactose-free"]
  },

  {
    id: "skyr-bowl",
    name: "Skyr-Bowl med Nøtter og Bær",
    type: "breakfast",
    prepTime: 3,
    pathways: { glp1: 2, gip: 2, glucagon: 1, amylin: 1, pyy: 4, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Skyr 22 g protein per porsjon → sterk PYY-frigjøring.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Skyr naturell", amount: "200 g", section: "Meieri" },
      { name: "Blandede nøtter", amount: "30 g", section: "Tørrvarer" },
      { name: "Honning", amount: "1 ts", section: "Tørrvarer" },
      { name: "Bringebær", amount: "50 g", section: "Frukt & Grønt" }
    ],
    instructions: "Ha skyr i bolle. Topp med nøtter, bær og en tynn strime honning.",
    tags: ["quick", "no-cook", "high-protein"],
    allergens: ["dairy", "nuts"],
    dietary: ["vegetarian", "gluten-free"]
  },

  {
    id: "smoothie-gronn",
    name: "Grønn Smoothie",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 3, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 4 },
    scienceNote: "Fiber fra havre + spinat → GLP-1. Skyr gir protein for PYY.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Babyspinat", amount: "1 håndfull", section: "Frukt & Grønt" },
      { name: "Banan", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Skyr naturell", amount: "100 g", section: "Meieri" },
      { name: "Havregryn", amount: "2 ss", section: "Tørrvarer" },
      { name: "Vann", amount: "1.5 dl", section: "Drikke" }
    ],
    instructions: "Blend alt til glatt konsistens. Tilsett mer vann om det er for tykt.",
    tags: ["quick", "high-fiber", "high-protein"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "cottage-laks-knekke",
    name: "Knekkebrød med Cottage Cheese & Røkelaks",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 2, gip: 2, glucagon: 2, amylin: 2, pyy: 4, leptin: 3, ghrelin: 3, insulin: 2 },
    scienceNote: "Omega-3 fra laks → leptin-sensitivitet. Kasein → langsom PYY.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Fullkornsknekkebrød", amount: "2 stk", section: "Bakeri" },
      { name: "Cottage cheese", amount: "100 g", section: "Meieri" },
      { name: "Røkelaks", amount: "50 g", section: "Kjøtt & Fisk" },
      { name: "Dill", amount: "litt", section: "Frukt & Grønt" }
    ],
    instructions: "Smør cottage cheese på knekkebrød, legg på laks og dill.",
    tags: ["quick", "no-cook", "high-protein", "omega-3"],
    allergens: ["dairy", "gluten", "fish"],
    dietary: []
  },

  {
    id: "omelett-gronnsaker",
    name: "Omelett med Grønnsaker",
    type: "breakfast",
    prepTime: 12,
    pathways: { glp1: 2, gip: 3, glucagon: 3, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Egg + grønnsaker → protein og fiber gir dobbel PYY + GLP-1.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Egg", amount: "3 stk", section: "Meieri" },
      { name: "Paprika", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Tomat", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Revet ost", amount: "30 g", section: "Meieri" },
      { name: "Olivenolje", amount: "1 ts", section: "Tørrvarer" }
    ],
    instructions: "Visp egg. Stek grønnsaker i olje, hell over egg, strø ost. Stek til stivnet.",
    tags: ["high-protein", "low-carb"],
    allergens: ["dairy", "eggs"],
    dietary: ["vegetarian", "gluten-free"]
  },

  // ─── BREAKFAST: Havregrøt-varianter (autopilot hverdager) ─────────

  {
    id: "havregrot-banan",
    name: "Havregrøt med Banan & Kanel",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 2, leptin: 2, ghrelin: 4, insulin: 4 },
    scienceNote: "Betaglukan i havre → GLP-1. Kanel bedrer insulinfølsomhet. Banan gir naturlig sødme uten tilsatt sukker.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Havregryn", amount: "80 g", section: "Tørrvarer" },
      { name: "Melk", amount: "1.5 dl", section: "Meieri" },
      { name: "Banan", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Kanel", amount: "1 ts", section: "Tørrvarer" }
    ],
    instructions: "Kok havregryn med melk i 3-4 min. Skjær banan i skiver oppå. Dryss kanel.",
    tags: ["quick", "high-fiber", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "havregrot-blabar",
    name: "Havregrøt med Blåbær",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 2, leptin: 2, ghrelin: 4, insulin: 5 },
    scienceNote: "Betaglukan → GLP-1. Blåbær har antioksidanter som bedrer insulinfølsomhet.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Havregryn", amount: "80 g", section: "Tørrvarer" },
      { name: "Melk", amount: "1.5 dl", section: "Meieri" },
      { name: "Blåbær", amount: "75 g", section: "Frukt & Grønt" },
      { name: "Kanel", amount: "½ ts", section: "Tørrvarer" }
    ],
    instructions: "Kok havregryn med melk i 3-4 min. Ha blåbær oppå. Dryss litt kanel.",
    tags: ["quick", "high-fiber", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "havregrot-druer",
    name: "Havregrøt med Druer",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 2, leptin: 2, ghrelin: 3, insulin: 4 },
    scienceNote: "Betaglukan → GLP-1. Druer gir naturlig sødme og resveratrol som støtter fettforbrenning.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Havregryn", amount: "80 g", section: "Tørrvarer" },
      { name: "Melk", amount: "1.5 dl", section: "Meieri" },
      { name: "Druer", amount: "80 g", section: "Frukt & Grønt" },
      { name: "Kanel", amount: "½ ts", section: "Tørrvarer" }
    ],
    instructions: "Kok havregryn med melk i 3-4 min. Del druene i to og legg oppå.",
    tags: ["quick", "high-fiber", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "havregrot-eple",
    name: "Havregrøt med Eple & Kanel",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 4, insulin: 5 },
    scienceNote: "Betaglukan + pektin fra eple → dobbel GLP-1. Eplefiber senker kolesterol.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Havregryn", amount: "80 g", section: "Tørrvarer" },
      { name: "Melk", amount: "1.5 dl", section: "Meieri" },
      { name: "Eple", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Kanel", amount: "1 ts", section: "Tørrvarer" }
    ],
    instructions: "Kok havregryn med melk i 3-4 min. Riv eller kutt eple i biter oppå. Dryss kanel.",
    tags: ["quick", "high-fiber", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  // ─── BREAKFAST: Knekkebrød-varianter (autopilot hverdager uke 3-4) ──

  {
    id: "knekke-egg-tomat",
    name: "Knekkebrød med Egg & Tomat",
    type: "breakfast",
    prepTime: 8,
    pathways: { glp1: 2, gip: 3, glucagon: 3, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Egg gir 13 g protein → glukagon + PYY. Tomat gir lykopen og vitamin C.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Fullkornsknekkebrød", amount: "2 stk", section: "Bakeri" },
      { name: "Egg", amount: "2 stk", section: "Meieri" },
      { name: "Tomat", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Salt og pepper", amount: "etter smak", section: "Tørrvarer" }
    ],
    instructions: "Kok egg 7 min (bløtkokt) eller 9 min (hardkokt). Skjær i skiver på knekkebrød med tomatskiver.",
    tags: ["quick", "high-protein", "autopilot"],
    allergens: ["gluten", "eggs"],
    dietary: ["vegetarian", "lactose-free"]
  },

  {
    id: "knekke-avokado",
    name: "Knekkebrød med Avokado & Chili",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 2, gip: 2, glucagon: 2, amylin: 1, pyy: 2, leptin: 3, ghrelin: 3, insulin: 2 },
    scienceNote: "Avokado-fett bremser absorpsjon → jevnt blodsukker. Chili → termogenese.",
    drugEquivalent: "Retatrutide",
    ingredients: [
      { name: "Fullkornsknekkebrød", amount: "2 stk", section: "Bakeri" },
      { name: "Avokado", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Sitronjuice", amount: "litt", section: "Frukt & Grønt" },
      { name: "Chiliflak", amount: "en klype", section: "Tørrvarer" },
      { name: "Salt", amount: "en klype", section: "Tørrvarer" }
    ],
    instructions: "Mos avokado med sitron, salt og chili. Smør på knekkebrød.",
    tags: ["quick", "no-cook", "healthy-fats", "autopilot"],
    allergens: ["gluten"],
    dietary: ["vegetarian", "vegan", "lactose-free"]
  },

  {
    id: "knekke-cottage-agurk",
    name: "Knekkebrød med Cottage Cheese & Agurk",
    type: "breakfast",
    prepTime: 3,
    pathways: { glp1: 2, gip: 2, glucagon: 2, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "Kasein fra cottage cheese → langsom PYY-frigjøring hele formiddagen.",
    drugEquivalent: "CagriSema",
    ingredients: [
      { name: "Fullkornsknekkebrød", amount: "2 stk", section: "Bakeri" },
      { name: "Cottage cheese", amount: "100 g", section: "Meieri" },
      { name: "Agurk", amount: "¼ stk", section: "Frukt & Grønt" },
      { name: "Sort pepper", amount: "etter smak", section: "Tørrvarer" }
    ],
    instructions: "Smør cottage cheese på knekkebrød. Legg agurkskiver oppå. Kvern pepper.",
    tags: ["quick", "no-cook", "high-protein", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "knekke-ost-paprika",
    name: "Knekkebrød med Ost & Paprika",
    type: "breakfast",
    prepTime: 3,
    pathways: { glp1: 1, gip: 2, glucagon: 2, amylin: 1, pyy: 2, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "Ost gir kasein-protein for langvarig metthet. Paprika er rik på C-vitamin.",
    drugEquivalent: "CagriSema",
    ingredients: [
      { name: "Fullkornsknekkebrød", amount: "2 stk", section: "Bakeri" },
      { name: "Brunost eller gulost", amount: "2 skiver", section: "Meieri" },
      { name: "Paprika", amount: "½ stk", section: "Frukt & Grønt" }
    ],
    instructions: "Legg ost på knekkebrød. Kutt paprika i strimler ved siden av.",
    tags: ["quick", "no-cook", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  // ─── LUNCH ADD-ONS (5) ────────────────────────────────────────────

  {
    id: "kikerter-addon",
    name: "Kikerter til Salaten",
    type: "lunch-addon",
    prepTime: 2,
    pathways: { glp1: 3, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Kikerter har resistens-stivelse → kraftig GLP-1-frigjøring.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Hermetiske kikerter", amount: "100 g", section: "Tørrvarer" }
    ],
    instructions: "Skyll og ha på salaten. Kan krydres med paprikapulver.",
    tags: ["quick", "high-fiber", "high-protein", "budget"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "bonner-addon",
    name: "Hvite Bønner til Salaten",
    type: "lunch-addon",
    prepTime: 2,
    pathways: { glp1: 3, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Bønner gir fiber + protein → GLP-1 og PYY samtidig.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Hermetiske hvite bønner", amount: "100 g", section: "Tørrvarer" }
    ],
    instructions: "Skyll og bland inn i salaten.",
    tags: ["quick", "high-fiber", "high-protein", "budget"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "linser-addon",
    name: "Linser til Salaten",
    type: "lunch-addon",
    prepTime: 2,
    pathways: { glp1: 3, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 4 },
    scienceNote: "Linser senker glykemisk indeks i hele måltidet → bedre insulin.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Hermetiske linser", amount: "100 g", section: "Tørrvarer" }
    ],
    instructions: "Skyll og ha på salaten. Passer spesielt godt med fetaost.",
    tags: ["quick", "high-fiber", "high-protein", "budget"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "notter-addon",
    name: "Nøtter til Salaten",
    type: "lunch-addon",
    prepTime: 1,
    pathways: { glp1: 1, gip: 1, glucagon: 1, amylin: 0, pyy: 2, leptin: 3, ghrelin: 2, insulin: 1 },
    scienceNote: "Umettet fett + protein → leptin-signalering og metthet.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Valnøtter/mandler", amount: "30 g", section: "Tørrvarer" }
    ],
    instructions: "Ha en håndfull nøtter på salaten for crunch og metthet.",
    tags: ["quick", "no-cook", "healthy-fats"],
    allergens: ["nuts"],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "avokado-addon",
    name: "Avokado til Salaten",
    type: "lunch-addon",
    prepTime: 2,
    pathways: { glp1: 1, gip: 1, glucagon: 0, amylin: 0, pyy: 2, leptin: 3, ghrelin: 2, insulin: 1 },
    scienceNote: "Enumettet fett bremser magetømming → forlenget metthet.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Avokado", amount: "½ stk", section: "Frukt & Grønt" }
    ],
    instructions: "Skjær i skiver og legg på salaten. Dryss gjerne litt salt og sitron.",
    tags: ["quick", "no-cook", "healthy-fats"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  // ─── SNACK 15:30 (7) ──────────────────────────────────────────────

  {
    id: "cottage-notter",
    name: "Cottage Cheese med Nøttemiks",
    type: "snack",
    prepTime: 2,
    pathways: { glp1: 1, gip: 2, glucagon: 2, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "Kasein-protein → langsom fordøyelse → PYY over tid.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Cottage cheese", amount: "150 g", section: "Meieri" },
      { name: "Nøttemiks", amount: "20 g", section: "Tørrvarer" }
    ],
    instructions: "Ha cottage cheese i boks, topp med nøtter. Ta med på jobb.",
    tags: ["quick", "no-cook", "high-protein", "portable"],
    allergens: ["dairy", "nuts"],
    dietary: ["vegetarian", "gluten-free"]
  },

  {
    id: "skyr-banan",
    name: "Skyr med Banan",
    type: "snack",
    prepTime: 2,
    pathways: { glp1: 2, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Skyr-protein + banan-fiber → dobbel metthetssignal.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Skyr naturell", amount: "150 g", section: "Meieri" },
      { name: "Banan", amount: "½ stk", section: "Frukt & Grønt" }
    ],
    instructions: "Skjær banan i skiver, bland med skyr. Ta med i matboks.",
    tags: ["quick", "no-cook", "high-protein", "portable"],
    allergens: ["dairy"],
    dietary: ["vegetarian", "gluten-free"]
  },

  {
    id: "egg-hardkokt",
    name: "Hardkokte Egg",
    type: "snack",
    prepTime: 1,
    pathways: { glp1: 1, gip: 2, glucagon: 3, amylin: 2, pyy: 3, leptin: 1, ghrelin: 3, insulin: 2 },
    scienceNote: "Egg-protein → glukagon + PYY. Null karbohydrater.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Egg", amount: "2 stk", section: "Meieri" }
    ],
    instructions: "Kok egg kvelden før (10 min). Ta med i matboks på jobb.",
    tags: ["meal-prep", "high-protein", "portable", "zero-carb"],
    allergens: ["eggs"],
    dietary: ["vegetarian", "lactose-free", "gluten-free"]
  },

  {
    id: "gulrot-hummus",
    name: "Gulrotstenger med Hummus",
    type: "snack",
    prepTime: 3,
    pathways: { glp1: 3, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 1, ghrelin: 3, insulin: 2 },
    scienceNote: "Kikerter i hummus → GLP-1. Gulrot-fiber forsterker effekten.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Gulrøtter", amount: "2 stk", section: "Frukt & Grønt" },
      { name: "Hummus", amount: "3 ss", section: "Tørrvarer" }
    ],
    instructions: "Skjær gulrøtter i stenger. Ha hummus i liten boks. Ta med.",
    tags: ["quick", "high-fiber", "portable"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "eple-peanottsmor",
    name: "Eple med Peanøttsmør",
    type: "snack",
    prepTime: 2,
    pathways: { glp1: 2, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "Pektin i eple + fett i peanøttsmør → langsom absorpsjon.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Eple", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Peanøttsmør", amount: "1 ss", section: "Tørrvarer" }
    ],
    instructions: "Skjær eple i båter, dypp i peanøttsmør.",
    tags: ["quick", "no-cook", "portable"],
    allergens: ["nuts"],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "knekke-ost",
    name: "Knekkebrød med Brunost & Agurk",
    type: "snack",
    prepTime: 2,
    pathways: { glp1: 2, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 1, ghrelin: 2, insulin: 2 },
    scienceNote: "Fullkorn-fiber → GLP-1. Brunost gir litt protein og fett.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Fullkornsknekkebrød", amount: "2 stk", section: "Bakeri" },
      { name: "Brunost", amount: "2 skiver", section: "Meieri" },
      { name: "Agurk", amount: "noen skiver", section: "Frukt & Grønt" }
    ],
    instructions: "Legg brunost og agurk på knekkebrød. Enkelt og norsk.",
    tags: ["quick", "no-cook", "portable"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "nottemiks",
    name: "Nøttemiks",
    type: "snack",
    prepTime: 0,
    pathways: { glp1: 1, gip: 1, glucagon: 1, amylin: 0, pyy: 2, leptin: 3, ghrelin: 2, insulin: 1 },
    scienceNote: "Umettet fett → leptin-signalering. Begrens til 30 g.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Mandler", amount: "10 g", section: "Tørrvarer" },
      { name: "Valnøtter", amount: "10 g", section: "Tørrvarer" },
      { name: "Cashewnøtter", amount: "10 g", section: "Tørrvarer" }
    ],
    instructions: "Ha i en liten pose eller boks. Maks 30 g per dag.",
    tags: ["quick", "no-cook", "portable", "healthy-fats"],
    allergens: ["nuts"],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  // ─── DINNER (12) ──────────────────────────────────────────────────

  {
    id: "laks-sotpotet",
    name: "Ovnsbakt Laks med Søtpotet og Brokkoli",
    type: "dinner",
    prepTime: 30,
    pathways: { glp1: 3, gip: 3, glucagon: 2, amylin: 2, pyy: 4, leptin: 4, ghrelin: 4, insulin: 3 },
    scienceNote: "Omega-3 → leptin-sensitivitet. Søtpotet → GLP-1 via fiber.",
    drugEquivalent: "Ozempic + Mounjaro + Wegovy",
    ingredients: [
      { name: "Laksefilet", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Søtpotet", amount: "200 g", section: "Frukt & Grønt" },
      { name: "Brokkoli", amount: "150 g", section: "Frukt & Grønt" },
      { name: "Olivenolje", amount: "1 ss", section: "Tørrvarer" },
      { name: "Sitron", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Salt og pepper", amount: "etter smak", section: "Tørrvarer" }
    ],
    instructions: "Stek søtpotet i ovn 200°C i 20 min. Legg laks og brokkoli ved siden, stek 12 min til.",
    tags: ["high-protein", "omega-3", "high-fiber"],
    allergens: ["fish"],
    dietary: ["lactose-free", "gluten-free"]
  },

  {
    id: "kyllingwok",
    name: "Kyllingwok med Grønnsaker",
    type: "dinner",
    prepTime: 20,
    pathways: { glp1: 2, gip: 3, glucagon: 3, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Chili → capsaicin → termogenese. Ingefær demper ghrelin.",
    drugEquivalent: "Mounjaro + Contrave",
    ingredients: [
      { name: "Kyllingbryst", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Wokgrønnsaker", amount: "300 g", section: "Frukt & Grønt" },
      { name: "Ingefær", amount: "1 ts revet", section: "Frukt & Grønt" },
      { name: "Chili", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Soyasaus", amount: "2 ss", section: "Tørrvarer" },
      { name: "Sesamolje", amount: "1 ts", section: "Tørrvarer" }
    ],
    instructions: "Stek kylling i biter. Tilsett grønnsaker, ingefær og chili. Smak til med soya.",
    tags: ["high-protein", "thermogenic", "quick"],
    allergens: ["soy"],
    dietary: ["lactose-free", "gluten-free"]
  },

  {
    id: "kjottdeig-bonner",
    name: "Kjøttdeiggryte med Bønner og Tomat",
    type: "dinner",
    prepTime: 25,
    pathways: { glp1: 3, gip: 3, glucagon: 2, amylin: 2, pyy: 4, leptin: 3, ghrelin: 4, insulin: 4 },
    scienceNote: "Bønner + kjøtt → fiber og protein gir maksimal PYY-respons.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Kjøttdeig 5%", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Hermetiske kidneybønner", amount: "100 g", section: "Tørrvarer" },
      { name: "Hakkede tomater", amount: "1 boks", section: "Tørrvarer" },
      { name: "Løk", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Hvitløk", amount: "2 fedd", section: "Frukt & Grønt" },
      { name: "Paprikapulver", amount: "1 ts", section: "Tørrvarer" },
      { name: "Spisskummen", amount: "½ ts", section: "Tørrvarer" }
    ],
    instructions: "Brun kjøttdeig med løk og hvitløk. Tilsett tomater, bønner og krydder. Kok 15 min.",
    tags: ["high-protein", "high-fiber", "meal-prep", "budget"],
    allergens: [],
    dietary: ["lactose-free", "gluten-free"]
  },

  {
    id: "fiskegrateng",
    name: "Fiskegrateng med Brokkoli",
    type: "dinner",
    prepTime: 35,
    pathways: { glp1: 2, gip: 3, glucagon: 2, amylin: 2, pyy: 3, leptin: 3, ghrelin: 3, insulin: 3 },
    scienceNote: "Hvit fisk → mager protein → PYY uten mye fett.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Torsk/sei", amount: "200 g", section: "Kjøtt & Fisk" },
      { name: "Brokkoli", amount: "150 g", section: "Frukt & Grønt" },
      { name: "Melk", amount: "2 dl", section: "Meieri" },
      { name: "Hvetemel", amount: "2 ss", section: "Tørrvarer" },
      { name: "Revet ost", amount: "50 g", section: "Meieri" },
      { name: "Smør", amount: "1 ss", section: "Meieri" }
    ],
    instructions: "Legg fisk og brokkoli i form. Lag hvit saus, hell over. Strø ost. Stek 200°C 20 min.",
    tags: ["high-protein", "comfort-food"],
    allergens: ["dairy", "gluten", "fish"],
    dietary: []
  },

  {
    id: "kylling-burrito",
    name: "Kylling-Burrito med Kikerter",
    type: "dinner",
    prepTime: 20,
    pathways: { glp1: 3, gip: 3, glucagon: 2, amylin: 2, pyy: 4, leptin: 2, ghrelin: 4, insulin: 4 },
    scienceNote: "Fullkorn + kikerter + kylling → trippel fiber/protein for GLP-1 og PYY.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Fullkornstortilla", amount: "2 stk", section: "Bakeri" },
      { name: "Kyllingbryst", amount: "120 g", section: "Kjøtt & Fisk" },
      { name: "Hermetiske kikerter", amount: "80 g", section: "Tørrvarer" },
      { name: "Salat", amount: "1 håndfull", section: "Frukt & Grønt" },
      { name: "Tomat", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Rømme lett", amount: "2 ss", section: "Meieri" }
    ],
    instructions: "Stek kylling i biter med krydder. Fyll tortilla med kylling, kikerter, grønt og rømme.",
    tags: ["high-protein", "high-fiber"],
    allergens: ["dairy", "gluten"],
    dietary: []
  },

  {
    id: "omelett-middag",
    name: "Stor Omelett med Feta",
    type: "dinner",
    prepTime: 15,
    pathways: { glp1: 2, gip: 3, glucagon: 3, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "4 egg = 26 g protein → sterk glukagon og PYY.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Egg", amount: "4 stk", section: "Meieri" },
      { name: "Paprika", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Spinat", amount: "1 håndfull", section: "Frukt & Grønt" },
      { name: "Fetaost", amount: "40 g", section: "Meieri" },
      { name: "Olivenolje", amount: "1 ts", section: "Tørrvarer" }
    ],
    instructions: "Stek grønnsaker, hell over vispede egg. Smuldre feta over. Stek til stivnet.",
    tags: ["high-protein", "low-carb", "quick", "budget"],
    allergens: ["dairy", "eggs"],
    dietary: ["vegetarian", "gluten-free"]
  },

  {
    id: "lakseburger",
    name: "Lakseburger uten Brød",
    type: "dinner",
    prepTime: 20,
    pathways: { glp1: 2, gip: 3, glucagon: 2, amylin: 2, pyy: 4, leptin: 4, ghrelin: 4, insulin: 2 },
    scienceNote: "Omega-3 fra laks → leptin + adiponektin-boost.",
    drugEquivalent: "Ozempic + Wegovy",
    ingredients: [
      { name: "Laksekjøttdeig/filet", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Egg", amount: "1 stk", section: "Meieri" },
      { name: "Brødrasp", amount: "2 ss", section: "Tørrvarer" },
      { name: "Dill", amount: "1 ss", section: "Frukt & Grønt" },
      { name: "Salatblader", amount: "4 stk", section: "Frukt & Grønt" },
      { name: "Agurk", amount: "noen skiver", section: "Frukt & Grønt" }
    ],
    instructions: "Bland laks, egg, rasp og dill. Form burgere, stek 4 min per side. Server i salatblader.",
    tags: ["high-protein", "low-carb", "omega-3"],
    allergens: ["gluten", "eggs", "fish"],
    dietary: ["lactose-free"]
  },

  {
    id: "tikka-masala",
    name: "Kylling Tikka Masala med Blomkålris",
    type: "dinner",
    prepTime: 30,
    pathways: { glp1: 3, gip: 3, glucagon: 2, amylin: 2, pyy: 3, leptin: 3, ghrelin: 4, insulin: 3 },
    scienceNote: "Gurkemeie + chili → termogenese + antiinflammatorisk.",
    drugEquivalent: "Contrave + Mounjaro",
    ingredients: [
      { name: "Kyllingbryst", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Yoghurt naturell", amount: "3 ss", section: "Meieri" },
      { name: "Tikka masala-paste", amount: "2 ss", section: "Tørrvarer" },
      { name: "Hakkede tomater", amount: "½ boks", section: "Tørrvarer" },
      { name: "Blomkål", amount: "200 g", section: "Frukt & Grønt" },
      { name: "Gurkemeie", amount: "½ ts", section: "Tørrvarer" }
    ],
    instructions: "Marinér kylling i yoghurt og paste. Stek, tilsett tomat. Riv blomkål til 'ris', dampkok.",
    tags: ["high-protein", "thermogenic", "low-carb"],
    allergens: ["dairy"],
    dietary: ["gluten-free"]
  },

  {
    id: "fisk-taco",
    name: "Fisketaco med Kål og Lime",
    type: "dinner",
    prepTime: 20,
    pathways: { glp1: 2, gip: 3, glucagon: 2, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Hvit fisk = mager protein. Kål gir fiber for GLP-1.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Torsk/sei", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Fullkornstortilla", amount: "2 stk", section: "Bakeri" },
      { name: "Rødkål", amount: "100 g", section: "Frukt & Grønt" },
      { name: "Lime", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Rømme lett", amount: "2 ss", section: "Meieri" },
      { name: "Koriander", amount: "litt", section: "Frukt & Grønt" }
    ],
    instructions: "Stek fisk med krydder, del i biter. Fyll tortilla med fisk, kålsalat og rømme.",
    tags: ["high-protein", "quick"],
    allergens: ["dairy", "gluten", "fish"],
    dietary: []
  },

  {
    id: "bacalao",
    name: "Bacalao",
    type: "dinner",
    prepTime: 35,
    pathways: { glp1: 2, gip: 2, glucagon: 2, amylin: 2, pyy: 3, leptin: 3, ghrelin: 3, insulin: 3 },
    scienceNote: "Torsk + olivenolje → protein og enumettet fett for leptin.",
    drugEquivalent: "Mounjaro + Wegovy",
    ingredients: [
      { name: "Torsk", amount: "200 g", section: "Kjøtt & Fisk" },
      { name: "Poteter", amount: "200 g", section: "Frukt & Grønt" },
      { name: "Hakkede tomater", amount: "1 boks", section: "Tørrvarer" },
      { name: "Paprika", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Løk", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Olivenolje", amount: "2 ss", section: "Tørrvarer" },
      { name: "Hvitløk", amount: "2 fedd", section: "Frukt & Grønt" }
    ],
    instructions: "Stek løk, hvitløk og paprika. Tilsett tomater og poteter, kok 15 min. Legg i torsk, kok 10 min.",
    tags: ["high-protein", "traditional"],
    allergens: ["fish"],
    dietary: ["lactose-free", "gluten-free"]
  },

  {
    id: "fiskesuppe",
    name: "Enkel Fiskesuppe",
    type: "dinner",
    prepTime: 25,
    pathways: { glp1: 2, gip: 2, glucagon: 2, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "Varm suppe øker metthet via vagusnerven → ghrelin ned.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Torsk/laks", amount: "200 g", section: "Kjøtt & Fisk" },
      { name: "Gulrot", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Purre", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Poteter", amount: "2 stk", section: "Frukt & Grønt" },
      { name: "Fiskekraft", amount: "5 dl", section: "Tørrvarer" },
      { name: "Fløte", amount: "1 dl", section: "Meieri" }
    ],
    instructions: "Kok grønnsaker i kraft 10 min. Tilsett fisk i biter, kok 5 min. Rør inn fløte.",
    tags: ["high-protein", "comfort-food", "traditional"],
    allergens: ["dairy", "fish"],
    dietary: ["gluten-free"]
  },

  {
    id: "kylling-salat",
    name: "Kyllingsalat med Avokado og Feta",
    type: "dinner",
    prepTime: 15,
    pathways: { glp1: 2, gip: 2, glucagon: 3, amylin: 2, pyy: 3, leptin: 3, ghrelin: 3, insulin: 2 },
    scienceNote: "Kylling + avokado-fett → protein og fett gir langvarig metthet.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Kyllingbryst", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Blandet salat", amount: "100 g", section: "Frukt & Grønt" },
      { name: "Avokado", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Fetaost", amount: "40 g", section: "Meieri" },
      { name: "Cherrytomater", amount: "6 stk", section: "Frukt & Grønt" },
      { name: "Olivenolje", amount: "1 ss", section: "Tørrvarer" }
    ],
    instructions: "Stek eller bruk grillrester av kylling. Bland alle ingredienser, dryss olje over.",
    tags: ["high-protein", "low-carb", "quick"],
    allergens: ["dairy"],
    dietary: ["gluten-free"]
  },


  {
    id: "kikert-curry",
    name: "Kikertcurry med Spinat",
    type: "dinner",
    prepTime: 25,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 4, leptin: 3, ghrelin: 4, insulin: 4 },
    scienceNote: "Kikerter har resistens-stivelse → kraftig GLP-1. Gurkemeie er antiinflammatorisk.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Hermetiske kikerter", amount: "1 boks (400 g)", section: "Tørrvarer" },
      { name: "Babyspinat", amount: "100 g", section: "Frukt & Grønt" },
      { name: "Kokosmelk lett", amount: "2 dl", section: "Tørrvarer" },
      { name: "Løk", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Hvitløk", amount: "2 fedd", section: "Frukt & Grønt" },
      { name: "Ingefær", amount: "1 ts revet", section: "Frukt & Grønt" },
      { name: "Gurkemeie", amount: "1 ts", section: "Tørrvarer" },
      { name: "Garam masala", amount: "1 ts", section: "Tørrvarer" },
      { name: "Hakkede tomater", amount: "1 boks", section: "Tørrvarer" }
    ],
    instructions: "Fres løk, hvitløk og ingefær. Tilsett krydder, tomater og kokosmelk. Kok 10 min. Ha i kikerter og spinat, kok 5 min til.",
    tags: ["high-fiber", "high-protein", "thermogenic"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "linsesuppe",
    name: "Krydret Linsesuppe",
    type: "dinner",
    prepTime: 30,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 4, leptin: 3, ghrelin: 4, insulin: 4 },
    scienceNote: "Linser senker glykemisk indeks → GLP-1 og PYY. Varm suppe øker metthet via vagusnerven.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Røde linser", amount: "200 g", section: "Tørrvarer" },
      { name: "Gulrot", amount: "2 stk", section: "Frukt & Grønt" },
      { name: "Løk", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Hvitløk", amount: "2 fedd", section: "Frukt & Grønt" },
      { name: "Hakkede tomater", amount: "1 boks", section: "Tørrvarer" },
      { name: "Grønnsaksbuljong", amount: "5 dl", section: "Tørrvarer" },
      { name: "Spisskummen", amount: "1 ts", section: "Tørrvarer" },
      { name: "Gurkemeie", amount: "½ ts", section: "Tørrvarer" },
      { name: "Sitron", amount: "½ stk", section: "Frukt & Grønt" }
    ],
    instructions: "Fres løk, hvitløk og gulrot. Tilsett linser, tomater, buljong og krydder. Kok 20 min til linsene er myke. Press over sitron.",
    tags: ["high-fiber", "high-protein", "comfort-food", "budget", "meal-prep"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "tofu-wok",
    name: "Grønnsakswok med Tofu",
    type: "dinner",
    prepTime: 20,
    pathways: { glp1: 3, gip: 2, glucagon: 2, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Tofu gir planteprotein → PYY. Chili og ingefær → termogenese og ghrelin-demping.",
    drugEquivalent: "Mounjaro + Contrave",
    ingredients: [
      { name: "Fast tofu", amount: "200 g", section: "Kjøtt & Fisk" },
      { name: "Wokgrønnsaker", amount: "300 g", section: "Frukt & Grønt" },
      { name: "Ingefær", amount: "1 ts revet", section: "Frukt & Grønt" },
      { name: "Hvitløk", amount: "2 fedd", section: "Frukt & Grønt" },
      { name: "Soyasaus", amount: "2 ss", section: "Tørrvarer" },
      { name: "Sesamolje", amount: "1 ts", section: "Tørrvarer" },
      { name: "Chili", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Sesamfrø", amount: "1 ss", section: "Tørrvarer" }
    ],
    instructions: "Kutt tofu i terninger og stek sprø. Tilsett grønnsaker, ingefær, hvitløk og chili. Smak til med soyasaus og sesamolje. Dryss sesamfrø.",
    tags: ["high-protein", "thermogenic", "quick"],
    allergens: ["soy"],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "bonne-sotpotet-chili",
    name: "Bønne- og Søtpotetchili",
    type: "dinner",
    prepTime: 30,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 4, leptin: 3, ghrelin: 4, insulin: 4 },
    scienceNote: "Bønner + søtpotet → dobbel fiber for kraftig GLP-1 og PYY. Chili → termogenese.",
    drugEquivalent: "Ozempic + Mounjaro + Contrave",
    ingredients: [
      { name: "Hermetiske svarte bønner", amount: "1 boks (400 g)", section: "Tørrvarer" },
      { name: "Søtpotet", amount: "200 g", section: "Frukt & Grønt" },
      { name: "Hakkede tomater", amount: "1 boks", section: "Tørrvarer" },
      { name: "Løk", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Hvitløk", amount: "2 fedd", section: "Frukt & Grønt" },
      { name: "Paprika", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Spisskummen", amount: "1 ts", section: "Tørrvarer" },
      { name: "Chili", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Koriander", amount: "litt", section: "Frukt & Grønt" }
    ],
    instructions: "Kutt søtpotet i terninger, fres med løk og hvitløk. Tilsett tomater, bønner og krydder. Kok 20 min. Topp med koriander.",
    tags: ["high-fiber", "high-protein", "meal-prep", "budget", "thermogenic"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },


  // ─── EVENING (5) ──────────────────────────────────────────────────

  {
    id: "gronn-te-ingefar",
    name: "Grønn Te med Ingefær",
    type: "evening",
    prepTime: 3,
    pathways: { glp1: 1, gip: 0, glucagon: 0, amylin: 0, pyy: 1, leptin: 1, ghrelin: 2, insulin: 1 },
    scienceNote: "EGCG i grønn te → øker fettoksidasjon. Ingefær demper appetitt.",
    drugEquivalent: "Contrave",
    ingredients: [
      { name: "Grønn te", amount: "1 pose", section: "Drikke" },
      { name: "Fersk ingefær", amount: "2 skiver", section: "Frukt & Grønt" }
    ],
    instructions: "Kok vann, legg i te og ingefær. Trekk 3 min.",
    tags: ["zero-cal", "thermogenic", "quick"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "skyr-kanel",
    name: "Skyr med Kanel og Valnøtter",
    type: "evening",
    prepTime: 2,
    pathways: { glp1: 1, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 1, ghrelin: 2, insulin: 2 },
    scienceNote: "Kasein i skyr → langsom proteinfordøyelse gjennom natten.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Skyr naturell", amount: "100 g", section: "Meieri" },
      { name: "Kanel", amount: "½ ts", section: "Tørrvarer" },
      { name: "Valnøtter", amount: "15 g", section: "Tørrvarer" }
    ],
    instructions: "Liten porsjon skyr med kanel og knuste valnøtter.",
    tags: ["quick", "no-cook", "high-protein"],
    allergens: ["dairy", "nuts"],
    dietary: ["vegetarian", "gluten-free"]
  },

  {
    id: "mork-sjokolade",
    name: "Mørk Sjokolade 70%",
    type: "evening",
    prepTime: 0,
    pathways: { glp1: 1, gip: 0, glucagon: 0, amylin: 0, pyy: 1, leptin: 1, ghrelin: 2, insulin: 1 },
    scienceNote: "Kakao-flavonoider → bedrer insulinfølsomhet i små doser.",
    drugEquivalent: "Contrave",
    ingredients: [
      { name: "Mørk sjokolade 70%+", amount: "20 g (2–3 biter)", section: "Tørrvarer" }
    ],
    instructions: "Nyt sakte, 2–3 biter. La det smelte på tunga.",
    tags: ["treat", "mindful-eating"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "popcorn-luft",
    name: "Luftpoppet Popcorn",
    type: "evening",
    prepTime: 5,
    pathways: { glp1: 2, gip: 1, glucagon: 0, amylin: 0, pyy: 1, leptin: 1, ghrelin: 2, insulin: 2 },
    scienceNote: "Fullkorn-fiber → GLP-1. Stort volum, få kalorier.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Popcornmais", amount: "40 g", section: "Tørrvarer" },
      { name: "Salt", amount: "en klype", section: "Tørrvarer" }
    ],
    instructions: "Popp i kjele uten fett eller bruk luftpopper. Dryss litt salt.",
    tags: ["high-fiber", "low-cal", "high-volume"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "bar-cottage",
    name: "Bær med Cottage Cheese",
    type: "evening",
    prepTime: 2,
    pathways: { glp1: 1, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 1, ghrelin: 2, insulin: 2 },
    scienceNote: "Kasein → nattlig PYY. Bær gir antioksidanter uten mye sukker.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Cottage cheese", amount: "100 g", section: "Meieri" },
      { name: "Blandede bær", amount: "50 g", section: "Frukt & Grønt" }
    ],
    instructions: "Ha cottage cheese i skål, topp med bær.",
    tags: ["quick", "no-cook", "high-protein"],
    allergens: ["dairy"],
    dietary: ["vegetarian", "gluten-free"]
  }
];

// ─── WEEKLY PLANS (4) ─────────────────────────────────────────────────

window.WEEKLY_PLANS = [

  {
    id: "week-1",
    name: "Uke 1 — Komme i Gang",
    description: "Havregrøt-autopilot hverdager, variert helg",
    days: [
      { day: "Mandag",  meals: { breakfast: "havregrot-banan",         lunchAddon: "kikerter-addon", snack: "cottage-notter",    dinner: "laks-sotpotet",    evening: null } },
      { day: "Tirsdag", meals: { breakfast: "havregrot-blabar",        lunchAddon: "bonner-addon",   snack: "skyr-banan",        dinner: "kyllingwok",       evening: "gronn-te-ingefar" } },
      { day: "Onsdag",  meals: { breakfast: "havregrot-druer",         lunchAddon: "avokado-addon",  snack: "egg-hardkokt",      dinner: "kjottdeig-bonner", evening: null } },
      { day: "Torsdag", meals: { breakfast: "havregrot-eple",          lunchAddon: "notter-addon",   snack: "gulrot-hummus",     dinner: "fiskegrateng",     evening: "mork-sjokolade" } },
      { day: "Fredag",  meals: { breakfast: "havregrot-banan",         lunchAddon: "kikerter-addon", snack: "eple-peanottsmor",  dinner: "fisk-taco",        evening: "popcorn-luft" } },
      { day: "Lørdag",  meals: { breakfast: "eggerore-knekke",         lunchAddon: "linser-addon",   snack: "knekke-ost",        dinner: "kylling-salat",    evening: "skyr-kanel" } },
      { day: "Søndag",  meals: { breakfast: "omelett-gronnsaker",      lunchAddon: "bonner-addon",   snack: "nottemiks",         dinner: "kylling-salat",    evening: "bar-cottage" } }
    ]
  },

  {
    id: "week-2",
    name: "Uke 2 — Mer Variasjon",
    description: "Havregrøt-autopilot hverdager, nye helgefrokoster",
    days: [
      { day: "Mandag",  meals: { breakfast: "havregrot-eple",          lunchAddon: "linser-addon",   snack: "cottage-notter",    dinner: "kylling-burrito",  evening: null } },
      { day: "Tirsdag", meals: { breakfast: "havregrot-banan",         lunchAddon: "kikerter-addon", snack: "gulrot-hummus",     dinner: "omelett-middag",   evening: "gronn-te-ingefar" } },
      { day: "Onsdag",  meals: { breakfast: "havregrot-blabar",        lunchAddon: "bonner-addon",   snack: "skyr-banan",        dinner: "lakseburger",      evening: null } },
      { day: "Torsdag", meals: { breakfast: "havregrot-druer",         lunchAddon: "avokado-addon",  snack: "egg-hardkokt",      dinner: "bacalao",          evening: "mork-sjokolade" } },
      { day: "Fredag",  meals: { breakfast: "havregrot-eple",          lunchAddon: "notter-addon",   snack: "eple-peanottsmor",  dinner: "laks-sotpotet",    evening: "popcorn-luft" } },
      { day: "Lørdag",  meals: { breakfast: "kokt-egg-avokado",        lunchAddon: "kikerter-addon", snack: "knekke-ost",        dinner: "tikka-masala",     evening: "skyr-kanel" } },
      { day: "Søndag",  meals: { breakfast: "smoothie-gronn",          lunchAddon: "linser-addon",   snack: "nottemiks",         dinner: "kjottdeig-bonner", evening: "bar-cottage" } }
    ]
  },

  {
    id: "week-3",
    name: "Uke 3 — Knekkebrød-uke",
    description: "Knekkebrød-autopilot hverdager, variert helg",
    days: [
      { day: "Mandag",  meals: { breakfast: "cottage-laks-knekke",     lunchAddon: "kikerter-addon", snack: "gulrot-hummus",     dinner: "tikka-masala",     evening: "gronn-te-ingefar" } },
      { day: "Tirsdag", meals: { breakfast: "knekke-egg-tomat",        lunchAddon: "linser-addon",   snack: "cottage-notter",    dinner: "kyllingwok",       evening: null } },
      { day: "Onsdag",  meals: { breakfast: "knekke-avokado",          lunchAddon: "bonner-addon",   snack: "egg-hardkokt",      dinner: "fisk-taco",        evening: "mork-sjokolade" } },
      { day: "Torsdag", meals: { breakfast: "knekke-cottage-agurk",    lunchAddon: "avokado-addon",  snack: "eple-peanottsmor",  dinner: "bacalao",          evening: null } },
      { day: "Fredag",  meals: { breakfast: "knekke-ost-paprika",      lunchAddon: "notter-addon",   snack: "skyr-banan",        dinner: "lakseburger",      evening: "popcorn-luft" } },
      { day: "Lørdag",  meals: { breakfast: "skyr-bowl",               lunchAddon: "kikerter-addon", snack: "knekke-ost",        dinner: "kjottdeig-bonner", evening: "skyr-kanel" } },
      { day: "Søndag",  meals: { breakfast: "omelett-gronnsaker",      lunchAddon: "linser-addon",   snack: "nottemiks",         dinner: "fiskesuppe",       evening: "bar-cottage" } }
    ]
  },

  {
    id: "week-4",
    name: "Uke 4 — Mestringsuken",
    description: "Knekkebrød-autopilot hverdager, du mestrer dette!",
    days: [
      { day: "Mandag",  meals: { breakfast: "knekke-egg-tomat",        lunchAddon: "linser-addon",   snack: "cottage-notter",    dinner: "laks-sotpotet",    evening: "gronn-te-ingefar" } },
      { day: "Tirsdag", meals: { breakfast: "knekke-avokado",          lunchAddon: "kikerter-addon", snack: "gulrot-hummus",     dinner: "tikka-masala",     evening: null } },
      { day: "Onsdag",  meals: { breakfast: "cottage-laks-knekke",     lunchAddon: "bonner-addon",   snack: "egg-hardkokt",      dinner: "kylling-burrito",  evening: "mork-sjokolade" } },
      { day: "Torsdag", meals: { breakfast: "knekke-cottage-agurk",    lunchAddon: "avokado-addon",  snack: "skyr-banan",        dinner: "fiskegrateng",     evening: null } },
      { day: "Fredag",  meals: { breakfast: "knekke-ost-paprika",      lunchAddon: "notter-addon",   snack: "eple-peanottsmor",  dinner: "kyllingwok",       evening: "popcorn-luft" } },
      { day: "Lørdag",  meals: { breakfast: "eggerore-knekke",         lunchAddon: "kikerter-addon", snack: "knekke-ost",        dinner: "bacalao",          evening: "skyr-kanel" } },
      { day: "Søndag",  meals: { breakfast: "smoothie-gronn",          lunchAddon: "linser-addon",   snack: "nottemiks",         dinner: "kylling-salat",    evening: "bar-cottage" } }
    ]
  }
];
