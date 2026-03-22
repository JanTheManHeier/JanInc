// SpisSlank Meal Database — meals + 4 weekly plans
// Pathway scores 0-5: glp1, gip, glucagon, amylin, pyy, leptin, ghrelin, insulin

window.MEALS = [

  // ─── BREAKFAST (8) ────────────────────────────────────────────────

  {
    id: "overnight-oats-skyr",
    name: "Overnight Oats med Skyr",
    nameEN: "Overnight Oats with Skyr",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 4, insulin: 5 },
    scienceNote: "Betaglukan → GLP-1. Skyr 20 g protein → PYY.",
    scienceNoteEN: "Beta-glucan → GLP-1. Skyr 20g protein → PYY.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Havregryn", nameEN: "Oats", amount: "80 g", section: "Tørrvarer" },
      { name: "Skyr naturell", nameEN: "Plain skyr", amount: "150 g", section: "Meieri" },
      { name: "Blåbær", nameEN: "Blueberries", amount: "75 g", section: "Frukt & Grønt" },
      { name: "Melk", nameEN: "Milk", amount: "1 dl", section: "Meieri" }
    ],
    instructions: "Bland havregryn, skyr og melk kvelden før. Topp med blåbær om morgenen.",
    instructionsEN: "Mix oats, skyr and milk the night before. Top with blueberries in the morning.",
    tags: ["quick", "no-cook", "high-fiber", "high-protein"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "overnight-oats-banan",
    name: "Overnight Oats med Banan & Kanel",
    nameEN: "Overnight Oats with Banana & Cinnamon",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 2, leptin: 2, ghrelin: 3, insulin: 4 },
    scienceNote: "Kanel bedrer insulinfølsomhet. Betaglukan gir langvarig metthet.",
    scienceNoteEN: "Cinnamon improves insulin sensitivity. Beta-glucan provides long-lasting satiety.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Havregryn", nameEN: "Oats", amount: "80 g", section: "Tørrvarer" },
      { name: "Banan", nameEN: "Banana", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Kanel", nameEN: "Cinnamon", amount: "1 ts", section: "Tørrvarer" },
      { name: "Melk", nameEN: "Milk", amount: "1.5 dl", section: "Meieri" }
    ],
    instructions: "Bland havregryn og melk kvelden før. Skjær banan og dryss kanel på om morgenen.",
    instructionsEN: "Mix oats and milk the night before. Slice banana and sprinkle cinnamon on in the morning.",
    tags: ["quick", "no-cook", "high-fiber"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "eggerore-knekke",
    name: "Eggerøre med Knekkebrød",
    nameEN: "Scrambled Eggs with Crispbread",
    type: "breakfast",
    prepTime: 10,
    pathways: { glp1: 2, gip: 3, glucagon: 3, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Egg gir 13 g protein → glukagon + PYY-respons.",
    scienceNoteEN: "Eggs provide 13g protein → glucagon + PYY response.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Egg", nameEN: "Eggs", amount: "3 stk", section: "Meieri" },
      { name: "Melk", nameEN: "Milk", amount: "2 ss", section: "Meieri" },
      { name: "Fullkornsknekkebrød", nameEN: "Whole grain crispbread", amount: "2 stk", section: "Bakeri" },
      { name: "Smør", nameEN: "Butter", amount: "1 ts", section: "Meieri" },
      { name: "Salt og pepper", nameEN: "Salt and pepper", amount: "etter smak", section: "Tørrvarer" }
    ],
    instructions: "Visp egg og melk. Stek på lav varme med smør, rør forsiktig. Server på knekkebrød.",
    instructionsEN: "Whisk eggs and milk. Cook on low heat with butter, stir gently. Serve on crispbread.",
    tags: ["high-protein", "quick"],
    allergens: ["dairy", "gluten", "eggs"],
    dietary: ["vegetarian"]
  },

  {
    id: "kokt-egg-avokado",
    name: "Kokte Egg med Avokado",
    nameEN: "Boiled Eggs with Avocado",
    type: "breakfast",
    prepTime: 12,
    pathways: { glp1: 2, gip: 2, glucagon: 3, amylin: 2, pyy: 3, leptin: 3, ghrelin: 3, insulin: 2 },
    scienceNote: "Avokado-fett bremser absorpsjon → jevnt blodsukker + leptin.",
    scienceNoteEN: "Avocado fat slows absorption → steady blood sugar + leptin.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Egg", nameEN: "Eggs", amount: "2 stk", section: "Meieri" },
      { name: "Avokado", nameEN: "Avocado", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Fullkornsknekkebrød", nameEN: "Whole grain crispbread", amount: "2 stk", section: "Bakeri" },
      { name: "Sitronjuice", nameEN: "Lemon juice", amount: "litt", section: "Frukt & Grønt" },
      { name: "Chiliflak", nameEN: "Chili flakes", amount: "en klype", section: "Tørrvarer" }
    ],
    instructions: "Kok egg 7–8 min. Mos avokado med sitron og chili, smør på knekkebrød.",
    instructionsEN: "Boil eggs 7–8 min. Mash avocado with lemon and chili, spread on crispbread.",
    tags: ["high-protein", "healthy-fats"],
    allergens: ["gluten", "eggs"],
    dietary: ["vegetarian", "lactose-free"]
  },

  {
    id: "skyr-bowl",
    name: "Skyr-Bowl med Nøtter og Bær",
    nameEN: "Skyr Bowl with Nuts and Berries",
    type: "breakfast",
    prepTime: 3,
    pathways: { glp1: 2, gip: 2, glucagon: 1, amylin: 1, pyy: 4, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Skyr 22 g protein per porsjon → sterk PYY-frigjøring.",
    scienceNoteEN: "Skyr 22g protein per serving → strong PYY release.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Skyr naturell", nameEN: "Plain skyr", amount: "200 g", section: "Meieri" },
      { name: "Blandede nøtter", nameEN: "Mixed nuts", amount: "30 g", section: "Tørrvarer" },
      { name: "Honning", nameEN: "Honey", amount: "1 ts", section: "Tørrvarer" },
      { name: "Bringebær", nameEN: "Raspberries", amount: "50 g", section: "Frukt & Grønt" }
    ],
    instructions: "Ha skyr i bolle. Topp med nøtter, bær og en tynn strime honning.",
    instructionsEN: "Place skyr in a bowl. Top with nuts, berries and a thin drizzle of honey.",
    tags: ["quick", "no-cook", "high-protein"],
    allergens: ["dairy", "nuts"],
    dietary: ["vegetarian", "gluten-free"]
  },

  {
    id: "smoothie-gronn",
    name: "Grønn Smoothie",
    nameEN: "Green Smoothie",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 3, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 4 },
    scienceNote: "Fiber fra havre + spinat → GLP-1. Skyr gir protein for PYY.",
    scienceNoteEN: "Fiber from oats + spinach → GLP-1. Skyr provides protein for PYY.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Babyspinat", nameEN: "Baby spinach", amount: "1 håndfull", section: "Frukt & Grønt" },
      { name: "Banan", nameEN: "Banana", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Skyr naturell", nameEN: "Plain skyr", amount: "100 g", section: "Meieri" },
      { name: "Havregryn", nameEN: "Oats", amount: "2 ss", section: "Tørrvarer" },
      { name: "Vann", nameEN: "Water", amount: "1.5 dl", section: "Drikke" }
    ],
    instructions: "Blend alt til glatt konsistens. Tilsett mer vann om det er for tykt.",
    instructionsEN: "Blend everything until smooth. Add more water if too thick.",
    tags: ["quick", "high-fiber", "high-protein"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "cottage-laks-knekke",
    name: "Knekkebrød med Cottage Cheese & Røkelaks",
    nameEN: "Crispbread with Cottage Cheese & Smoked Salmon",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 2, gip: 2, glucagon: 2, amylin: 2, pyy: 4, leptin: 3, ghrelin: 3, insulin: 2 },
    scienceNote: "Omega-3 fra laks → leptin-sensitivitet. Kasein → langsom PYY.",
    scienceNoteEN: "Omega-3 from salmon → leptin sensitivity. Casein → slow PYY.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Fullkornsknekkebrød", nameEN: "Whole grain crispbread", amount: "2 stk", section: "Bakeri" },
      { name: "Cottage cheese", nameEN: "Cottage cheese", amount: "100 g", section: "Meieri" },
      { name: "Røkelaks", nameEN: "Smoked salmon", amount: "50 g", section: "Kjøtt & Fisk" },
      { name: "Dill", nameEN: "Dill", amount: "litt", section: "Frukt & Grønt" }
    ],
    instructions: "Smør cottage cheese på knekkebrød, legg på laks og dill.",
    instructionsEN: "Spread cottage cheese on crispbread, top with salmon and dill.",
    tags: ["quick", "no-cook", "high-protein", "omega-3"],
    allergens: ["dairy", "gluten", "fish"],
    dietary: []
  },

  {
    id: "omelett-gronnsaker",
    name: "Omelett med Grønnsaker",
    nameEN: "Omelette with Vegetables",
    type: "breakfast",
    prepTime: 12,
    pathways: { glp1: 2, gip: 3, glucagon: 3, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Egg + grønnsaker → protein og fiber gir dobbel PYY + GLP-1.",
    scienceNoteEN: "Eggs + vegetables → protein and fiber provide double PYY + GLP-1.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Egg", nameEN: "Eggs", amount: "3 stk", section: "Meieri" },
      { name: "Paprika", nameEN: "Bell pepper", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Tomat", nameEN: "Tomato", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Revet ost", nameEN: "Grated cheese", amount: "30 g", section: "Meieri" },
      { name: "Olivenolje", nameEN: "Olive oil", amount: "1 ts", section: "Tørrvarer" }
    ],
    instructions: "Visp egg. Stek grønnsaker i olje, hell over egg, strø ost. Stek til stivnet.",
    instructionsEN: "Whisk eggs. Sauté vegetables in oil, pour eggs over, sprinkle cheese. Cook until set.",
    tags: ["high-protein", "low-carb"],
    allergens: ["dairy", "eggs"],
    dietary: ["vegetarian", "gluten-free"]
  },

  // ─── BREAKFAST: Havregrøt-varianter (autopilot hverdager) ─────────

  {
    id: "havregrot-banan",
    name: "Havregrøt med Banan & Kanel",
    nameEN: "Oatmeal with Banana & Cinnamon",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 2, leptin: 2, ghrelin: 4, insulin: 4 },
    scienceNote: "Betaglukan i havre → GLP-1. Kanel bedrer insulinfølsomhet. Banan gir naturlig sødme uten tilsatt sukker.",
    scienceNoteEN: "Beta-glucan in oats → GLP-1. Cinnamon improves insulin sensitivity. Banana provides natural sweetness without added sugar.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Havregryn", nameEN: "Oats", amount: "80 g", section: "Tørrvarer" },
      { name: "Melk", nameEN: "Milk", amount: "1.5 dl", section: "Meieri" },
      { name: "Banan", nameEN: "Banana", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Kanel", nameEN: "Cinnamon", amount: "1 ts", section: "Tørrvarer" }
    ],
    instructions: "Kok havregryn med melk i 3-4 min. Skjær banan i skiver oppå. Dryss kanel.",
    instructionsEN: "Cook oats with milk for 3–4 min. Slice banana on top. Sprinkle cinnamon.",
    tags: ["quick", "high-fiber", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "havregrot-blabar",
    name: "Havregrøt med Blåbær",
    nameEN: "Oatmeal with Blueberries",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 2, leptin: 2, ghrelin: 4, insulin: 5 },
    scienceNote: "Betaglukan → GLP-1. Blåbær har antioksidanter som bedrer insulinfølsomhet.",
    scienceNoteEN: "Beta-glucan → GLP-1. Blueberries contain antioxidants that improve insulin sensitivity.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Havregryn", nameEN: "Oats", amount: "80 g", section: "Tørrvarer" },
      { name: "Melk", nameEN: "Milk", amount: "1.5 dl", section: "Meieri" },
      { name: "Blåbær", nameEN: "Blueberries", amount: "75 g", section: "Frukt & Grønt" },
      { name: "Kanel", nameEN: "Cinnamon", amount: "½ ts", section: "Tørrvarer" }
    ],
    instructions: "Kok havregryn med melk i 3-4 min. Ha blåbær oppå. Dryss litt kanel.",
    instructionsEN: "Cook oats with milk for 3–4 min. Add blueberries on top. Sprinkle a little cinnamon.",
    tags: ["quick", "high-fiber", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "havregrot-druer",
    name: "Havregrøt med Druer",
    nameEN: "Oatmeal with Grapes",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 2, leptin: 2, ghrelin: 3, insulin: 4 },
    scienceNote: "Betaglukan → GLP-1. Druer gir naturlig sødme og resveratrol som støtter fettforbrenning.",
    scienceNoteEN: "Beta-glucan → GLP-1. Grapes provide natural sweetness and resveratrol that supports fat burning.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Havregryn", nameEN: "Oats", amount: "80 g", section: "Tørrvarer" },
      { name: "Melk", nameEN: "Milk", amount: "1.5 dl", section: "Meieri" },
      { name: "Druer", nameEN: "Grapes", amount: "80 g", section: "Frukt & Grønt" },
      { name: "Kanel", nameEN: "Cinnamon", amount: "½ ts", section: "Tørrvarer" }
    ],
    instructions: "Kok havregryn med melk i 3-4 min. Del druene i to og legg oppå.",
    instructionsEN: "Cook oats with milk for 3–4 min. Halve the grapes and place on top.",
    tags: ["quick", "high-fiber", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "havregrot-eple",
    name: "Havregrøt med Eple & Kanel",
    nameEN: "Oatmeal with Apple & Cinnamon",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 4, insulin: 5 },
    scienceNote: "Betaglukan + pektin fra eple → dobbel GLP-1. Eplefiber senker kolesterol.",
    scienceNoteEN: "Beta-glucan + pectin from apple → double GLP-1. Apple fiber lowers cholesterol.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Havregryn", nameEN: "Oats", amount: "80 g", section: "Tørrvarer" },
      { name: "Melk", nameEN: "Milk", amount: "1.5 dl", section: "Meieri" },
      { name: "Eple", nameEN: "Apple", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Kanel", nameEN: "Cinnamon", amount: "1 ts", section: "Tørrvarer" }
    ],
    instructions: "Kok havregryn med melk i 3-4 min. Riv eller kutt eple i biter oppå. Dryss kanel.",
    instructionsEN: "Cook oats with milk for 3–4 min. Grate or chop apple on top. Sprinkle cinnamon.",
    tags: ["quick", "high-fiber", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  // ─── BREAKFAST: Knekkebrød-varianter (autopilot hverdager uke 3-4) ──

  {
    id: "knekke-egg-tomat",
    name: "Knekkebrød med Egg & Tomat",
    nameEN: "Crispbread with Egg & Tomato",
    type: "breakfast",
    prepTime: 8,
    pathways: { glp1: 2, gip: 3, glucagon: 3, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Egg gir 13 g protein → glukagon + PYY. Tomat gir lykopen og vitamin C.",
    scienceNoteEN: "Eggs provide 13g protein → glucagon + PYY. Tomato provides lycopene and vitamin C.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Fullkornsknekkebrød", nameEN: "Whole grain crispbread", amount: "2 stk", section: "Bakeri" },
      { name: "Egg", nameEN: "Eggs", amount: "2 stk", section: "Meieri" },
      { name: "Tomat", nameEN: "Tomato", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Salt og pepper", nameEN: "Salt and pepper", amount: "etter smak", section: "Tørrvarer" }
    ],
    instructions: "Kok egg 7 min (bløtkokt) eller 9 min (hardkokt). Skjær i skiver på knekkebrød med tomatskiver.",
    instructionsEN: "Boil eggs 7 min (soft) or 9 min (hard). Slice onto crispbread with tomato slices.",
    tags: ["quick", "high-protein", "autopilot"],
    allergens: ["gluten", "eggs"],
    dietary: ["vegetarian", "lactose-free"]
  },

  {
    id: "knekke-avokado",
    name: "Knekkebrød med Avokado & Chili",
    nameEN: "Crispbread with Avocado & Chili",
    type: "breakfast",
    prepTime: 5,
    pathways: { glp1: 2, gip: 2, glucagon: 2, amylin: 1, pyy: 2, leptin: 3, ghrelin: 3, insulin: 2 },
    scienceNote: "Avokado-fett bremser absorpsjon → jevnt blodsukker. Chili → termogenese.",
    scienceNoteEN: "Avocado fat slows absorption → steady blood sugar. Chili → thermogenesis.",
    drugEquivalent: "Retatrutide",
    ingredients: [
      { name: "Fullkornsknekkebrød", nameEN: "Whole grain crispbread", amount: "2 stk", section: "Bakeri" },
      { name: "Avokado", nameEN: "Avocado", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Sitronjuice", nameEN: "Lemon juice", amount: "litt", section: "Frukt & Grønt" },
      { name: "Chiliflak", nameEN: "Chili flakes", amount: "en klype", section: "Tørrvarer" },
      { name: "Salt", nameEN: "Salt", amount: "en klype", section: "Tørrvarer" }
    ],
    instructions: "Mos avokado med sitron, salt og chili. Smør på knekkebrød.",
    instructionsEN: "Mash avocado with lemon, salt and chili. Spread on crispbread.",
    tags: ["quick", "no-cook", "healthy-fats", "autopilot"],
    allergens: ["gluten"],
    dietary: ["vegetarian", "vegan", "lactose-free"]
  },

  {
    id: "knekke-cottage-agurk",
    name: "Knekkebrød med Cottage Cheese & Agurk",
    nameEN: "Crispbread with Cottage Cheese & Cucumber",
    type: "breakfast",
    prepTime: 3,
    pathways: { glp1: 2, gip: 2, glucagon: 2, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "Kasein fra cottage cheese → langsom PYY-frigjøring hele formiddagen.",
    scienceNoteEN: "Casein from cottage cheese → slow PYY release throughout the morning.",
    drugEquivalent: "CagriSema",
    ingredients: [
      { name: "Fullkornsknekkebrød", nameEN: "Whole grain crispbread", amount: "2 stk", section: "Bakeri" },
      { name: "Cottage cheese", nameEN: "Cottage cheese", amount: "100 g", section: "Meieri" },
      { name: "Agurk", nameEN: "Cucumber", amount: "¼ stk", section: "Frukt & Grønt" },
      { name: "Sort pepper", nameEN: "Black pepper", amount: "etter smak", section: "Tørrvarer" }
    ],
    instructions: "Smør cottage cheese på knekkebrød. Legg agurkskiver oppå. Kvern pepper.",
    instructionsEN: "Spread cottage cheese on crispbread. Place cucumber slices on top. Grind pepper.",
    tags: ["quick", "no-cook", "high-protein", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "knekke-ost-paprika",
    name: "Knekkebrød med Ost & Paprika",
    nameEN: "Crispbread with Cheese & Bell Pepper",
    type: "breakfast",
    prepTime: 3,
    pathways: { glp1: 1, gip: 2, glucagon: 2, amylin: 1, pyy: 2, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "Ost gir kasein-protein for langvarig metthet. Paprika er rik på C-vitamin.",
    scienceNoteEN: "Cheese provides casein protein for lasting satiety. Bell pepper is rich in vitamin C.",
    drugEquivalent: "CagriSema",
    ingredients: [
      { name: "Fullkornsknekkebrød", nameEN: "Whole grain crispbread", amount: "2 stk", section: "Bakeri" },
      { name: "Brunost eller gulost", nameEN: "Brown cheese or yellow cheese", amount: "2 skiver", section: "Meieri" },
      { name: "Paprika", nameEN: "Bell pepper", amount: "½ stk", section: "Frukt & Grønt" }
    ],
    instructions: "Legg ost på knekkebrød. Kutt paprika i strimler ved siden av.",
    instructionsEN: "Place cheese on crispbread. Cut bell pepper into strips on the side.",
    tags: ["quick", "no-cook", "autopilot"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  // ─── LUNCH ADD-ONS (5) ────────────────────────────────────────────

  {
    id: "kikerter-addon",
    name: "Kikerter til Salaten",
    nameEN: "Chickpeas for the Salad",
    type: "lunch-addon",
    prepTime: 2,
    pathways: { glp1: 3, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Kikerter har resistens-stivelse → kraftig GLP-1-frigjøring.",
    scienceNoteEN: "Chickpeas contain resistant starch → strong GLP-1 release.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Hermetiske kikerter", nameEN: "Canned chickpeas", amount: "100 g", section: "Tørrvarer" }
    ],
    instructions: "Skyll og ha på salaten. Kan krydres med paprikapulver.",
    instructionsEN: "Rinse and add to the salad. Can be seasoned with paprika powder.",
    tags: ["quick", "high-fiber", "high-protein", "budget"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "bonner-addon",
    name: "Hvite Bønner til Salaten",
    nameEN: "White Beans for the Salad",
    type: "lunch-addon",
    prepTime: 2,
    pathways: { glp1: 3, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Bønner gir fiber + protein → GLP-1 og PYY samtidig.",
    scienceNoteEN: "Beans provide fiber + protein → GLP-1 and PYY simultaneously.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Hermetiske hvite bønner", nameEN: "Canned white beans", amount: "100 g", section: "Tørrvarer" }
    ],
    instructions: "Skyll og bland inn i salaten.",
    instructionsEN: "Rinse and mix into the salad.",
    tags: ["quick", "high-fiber", "high-protein", "budget"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "linser-addon",
    name: "Linser til Salaten",
    nameEN: "Lentils for the Salad",
    type: "lunch-addon",
    prepTime: 2,
    pathways: { glp1: 3, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 4 },
    scienceNote: "Linser senker glykemisk indeks i hele måltidet → bedre insulin.",
    scienceNoteEN: "Lentils lower the glycemic index of the entire meal → better insulin.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Hermetiske linser", nameEN: "Canned lentils", amount: "100 g", section: "Tørrvarer" }
    ],
    instructions: "Skyll og ha på salaten. Passer spesielt godt med fetaost.",
    instructionsEN: "Rinse and add to the salad. Pairs especially well with feta cheese.",
    tags: ["quick", "high-fiber", "high-protein", "budget"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "notter-addon",
    name: "Nøtter til Salaten",
    nameEN: "Nuts for the Salad",
    type: "lunch-addon",
    prepTime: 1,
    pathways: { glp1: 1, gip: 1, glucagon: 1, amylin: 0, pyy: 2, leptin: 3, ghrelin: 2, insulin: 1 },
    scienceNote: "Umettet fett + protein → leptin-signalering og metthet.",
    scienceNoteEN: "Unsaturated fat + protein → leptin signaling and satiety.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Valnøtter/mandler", nameEN: "Walnuts/almonds", amount: "30 g", section: "Tørrvarer" }
    ],
    instructions: "Ha en håndfull nøtter på salaten for crunch og metthet.",
    instructionsEN: "Add a handful of nuts to the salad for crunch and satiety.",
    tags: ["quick", "no-cook", "healthy-fats"],
    allergens: ["nuts"],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "avokado-addon",
    name: "Avokado til Salaten",
    nameEN: "Avocado for the Salad",
    type: "lunch-addon",
    prepTime: 2,
    pathways: { glp1: 1, gip: 1, glucagon: 0, amylin: 0, pyy: 2, leptin: 3, ghrelin: 2, insulin: 1 },
    scienceNote: "Enumettet fett bremser magetømming → forlenget metthet.",
    scienceNoteEN: "Monounsaturated fat slows gastric emptying → prolonged satiety.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Avokado", nameEN: "Avocado", amount: "½ stk", section: "Frukt & Grønt" }
    ],
    instructions: "Skjær i skiver og legg på salaten. Dryss gjerne litt salt og sitron.",
    instructionsEN: "Slice and place on the salad. Optionally sprinkle with a little salt and lemon.",
    tags: ["quick", "no-cook", "healthy-fats"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  // ─── SNACK 15:30 (7) ──────────────────────────────────────────────

  {
    id: "cottage-notter",
    name: "Cottage Cheese med Nøttemiks",
    nameEN: "Cottage Cheese with Nut Mix",
    type: "snack",
    prepTime: 2,
    pathways: { glp1: 1, gip: 2, glucagon: 2, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "Kasein-protein → langsom fordøyelse → PYY over tid.",
    scienceNoteEN: "Casein protein → slow digestion → PYY over time.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Cottage cheese", nameEN: "Cottage cheese", amount: "150 g", section: "Meieri" },
      { name: "Nøttemiks", nameEN: "Nut mix", amount: "20 g", section: "Tørrvarer" }
    ],
    instructions: "Ha cottage cheese i boks, topp med nøtter. Ta med på jobb.",
    instructionsEN: "Put cottage cheese in a container, top with nuts. Bring to work.",
    tags: ["quick", "no-cook", "high-protein", "portable"],
    allergens: ["dairy", "nuts"],
    dietary: ["vegetarian", "gluten-free"]
  },

  {
    id: "skyr-banan",
    name: "Skyr med Banan",
    nameEN: "Skyr with Banana",
    type: "snack",
    prepTime: 2,
    pathways: { glp1: 2, gip: 2, glucagon: 1, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Skyr-protein + banan-fiber → dobbel metthetssignal.",
    scienceNoteEN: "Skyr protein + banana fiber → double satiety signal.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Skyr naturell", nameEN: "Plain skyr", amount: "150 g", section: "Meieri" },
      { name: "Banan", nameEN: "Banana", amount: "½ stk", section: "Frukt & Grønt" }
    ],
    instructions: "Skjær banan i skiver, bland med skyr. Ta med i matboks.",
    instructionsEN: "Slice banana, mix with skyr. Bring in a lunch box.",
    tags: ["quick", "no-cook", "high-protein", "portable"],
    allergens: ["dairy"],
    dietary: ["vegetarian", "gluten-free"]
  },

  {
    id: "egg-hardkokt",
    name: "Hardkokte Egg",
    nameEN: "Hard-Boiled Eggs",
    type: "snack",
    prepTime: 1,
    pathways: { glp1: 1, gip: 2, glucagon: 3, amylin: 2, pyy: 3, leptin: 1, ghrelin: 3, insulin: 2 },
    scienceNote: "Egg-protein → glukagon + PYY. Null karbohydrater.",
    scienceNoteEN: "Egg protein → glucagon + PYY. Zero carbohydrates.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Egg", nameEN: "Eggs", amount: "2 stk", section: "Meieri" }
    ],
    instructions: "Kok egg kvelden før (10 min). Ta med i matboks på jobb.",
    instructionsEN: "Boil eggs the night before (10 min). Bring in a lunch box to work.",
    tags: ["meal-prep", "high-protein", "portable", "zero-carb"],
    allergens: ["eggs"],
    dietary: ["vegetarian", "lactose-free", "gluten-free"]
  },

  {
    id: "gulrot-hummus",
    name: "Gulrotstenger med Hummus",
    nameEN: "Carrot Sticks with Hummus",
    type: "snack",
    prepTime: 3,
    pathways: { glp1: 3, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 1, ghrelin: 3, insulin: 2 },
    scienceNote: "Kikerter i hummus → GLP-1. Gulrot-fiber forsterker effekten.",
    scienceNoteEN: "Chickpeas in hummus → GLP-1. Carrot fiber enhances the effect.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Gulrøtter", nameEN: "Carrots", amount: "2 stk", section: "Frukt & Grønt" },
      { name: "Hummus", nameEN: "Hummus", amount: "3 ss", section: "Tørrvarer" }
    ],
    instructions: "Skjær gulrøtter i stenger. Ha hummus i liten boks. Ta med.",
    instructionsEN: "Cut carrots into sticks. Put hummus in a small container. Bring along.",
    tags: ["quick", "high-fiber", "portable"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "eple-peanottsmor",
    name: "Eple med Peanøttsmør",
    nameEN: "Apple with Peanut Butter",
    type: "snack",
    prepTime: 2,
    pathways: { glp1: 2, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "Pektin i eple + fett i peanøttsmør → langsom absorpsjon.",
    scienceNoteEN: "Pectin in apple + fat in peanut butter → slow absorption.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Eple", nameEN: "Apple", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Peanøttsmør", nameEN: "Peanut butter", amount: "1 ss", section: "Tørrvarer" }
    ],
    instructions: "Skjær eple i båter, dypp i peanøttsmør.",
    instructionsEN: "Cut apple into wedges, dip in peanut butter.",
    tags: ["quick", "no-cook", "portable"],
    allergens: ["nuts"],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "knekke-ost",
    name: "Knekkebrød med Brunost & Agurk",
    nameEN: "Crispbread with Brown Cheese & Cucumber",
    type: "snack",
    prepTime: 2,
    pathways: { glp1: 2, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 1, ghrelin: 2, insulin: 2 },
    scienceNote: "Fullkorn-fiber → GLP-1. Brunost gir litt protein og fett.",
    scienceNoteEN: "Whole grain fiber → GLP-1. Brown cheese provides some protein and fat.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Fullkornsknekkebrød", nameEN: "Whole grain crispbread", amount: "2 stk", section: "Bakeri" },
      { name: "Brunost", nameEN: "Brown cheese", amount: "2 skiver", section: "Meieri" },
      { name: "Agurk", nameEN: "Cucumber", amount: "noen skiver", section: "Frukt & Grønt" }
    ],
    instructions: "Legg brunost og agurk på knekkebrød. Enkelt og norsk.",
    instructionsEN: "Place brown cheese and cucumber on crispbread. Simple and Norwegian.",
    tags: ["quick", "no-cook", "portable"],
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"]
  },

  {
    id: "nottemiks",
    name: "Nøttemiks",
    nameEN: "Nut Mix",
    type: "snack",
    prepTime: 0,
    pathways: { glp1: 1, gip: 1, glucagon: 1, amylin: 0, pyy: 2, leptin: 3, ghrelin: 2, insulin: 1 },
    scienceNote: "Umettet fett → leptin-signalering. Begrens til 30 g.",
    scienceNoteEN: "Unsaturated fat → leptin signaling. Limit to 30g.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Mandler", nameEN: "Almonds", amount: "10 g", section: "Tørrvarer" },
      { name: "Valnøtter", nameEN: "Walnuts", amount: "10 g", section: "Tørrvarer" },
      { name: "Cashewnøtter", nameEN: "Cashews", amount: "10 g", section: "Tørrvarer" }
    ],
    instructions: "Ha i en liten pose eller boks. Maks 30 g per dag.",
    instructionsEN: "Put in a small bag or container. Max 30g per day.",
    tags: ["quick", "no-cook", "portable", "healthy-fats"],
    allergens: ["nuts"],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  // ─── DINNER (12) ──────────────────────────────────────────────────

  {
    id: "laks-sotpotet",
    name: "Ovnsbakt Laks med Søtpotet og Brokkoli",
    nameEN: "Oven-Baked Salmon with Sweet Potato and Broccoli",
    type: "dinner",
    prepTime: 30,
    pathways: { glp1: 3, gip: 3, glucagon: 2, amylin: 2, pyy: 4, leptin: 4, ghrelin: 4, insulin: 3 },
    scienceNote: "Omega-3 → leptin-sensitivitet. Søtpotet → GLP-1 via fiber.",
    scienceNoteEN: "Omega-3 → leptin sensitivity. Sweet potato → GLP-1 via fiber.",
    drugEquivalent: "Ozempic + Mounjaro + Wegovy",
    ingredients: [
      { name: "Laksefilet", nameEN: "Salmon fillet", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Søtpotet", nameEN: "Sweet potato", amount: "200 g", section: "Frukt & Grønt" },
      { name: "Brokkoli", nameEN: "Broccoli", amount: "150 g", section: "Frukt & Grønt" },
      { name: "Olivenolje", nameEN: "Olive oil", amount: "1 ss", section: "Tørrvarer" },
      { name: "Sitron", nameEN: "Lemon", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Salt og pepper", nameEN: "Salt and pepper", amount: "etter smak", section: "Tørrvarer" }
    ],
    instructions: "Stek søtpotet i ovn 200°C i 20 min. Legg laks og brokkoli ved siden, stek 12 min til.",
    instructionsEN: "Roast sweet potato in oven at 200°C for 20 min. Add salmon and broccoli alongside, roast 12 min more.",
    tags: ["high-protein", "omega-3", "high-fiber"],
    allergens: ["fish"],
    dietary: ["lactose-free", "gluten-free"]
  },

  {
    id: "kyllingwok",
    name: "Kyllingwok med Grønnsaker",
    nameEN: "Chicken Stir-Fry with Vegetables",
    type: "dinner",
    prepTime: 20,
    pathways: { glp1: 2, gip: 3, glucagon: 3, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Chili → capsaicin → termogenese. Ingefær demper ghrelin.",
    scienceNoteEN: "Chili → capsaicin → thermogenesis. Ginger suppresses ghrelin.",
    drugEquivalent: "Mounjaro + Contrave",
    ingredients: [
      { name: "Kyllingbryst", nameEN: "Chicken breast", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Wokgrønnsaker", nameEN: "Stir-fry vegetables", amount: "300 g", section: "Frukt & Grønt" },
      { name: "Ingefær", nameEN: "Ginger", amount: "1 ts revet", section: "Frukt & Grønt" },
      { name: "Chili", nameEN: "Chili", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Soyasaus", nameEN: "Soy sauce", amount: "2 ss", section: "Tørrvarer" },
      { name: "Sesamolje", nameEN: "Sesame oil", amount: "1 ts", section: "Tørrvarer" }
    ],
    instructions: "Stek kylling i biter. Tilsett grønnsaker, ingefær og chili. Smak til med soya.",
    instructionsEN: "Stir-fry chicken pieces. Add vegetables, ginger and chili. Season with soy sauce.",
    tags: ["high-protein", "thermogenic", "quick"],
    allergens: ["soy"],
    dietary: ["lactose-free", "gluten-free"]
  },

  {
    id: "kjottdeig-bonner",
    name: "Kjøttdeiggryte med Bønner og Tomat",
    nameEN: "Ground Beef Stew with Beans and Tomato",
    type: "dinner",
    prepTime: 25,
    pathways: { glp1: 3, gip: 3, glucagon: 2, amylin: 2, pyy: 4, leptin: 3, ghrelin: 4, insulin: 4 },
    scienceNote: "Bønner + kjøtt → fiber og protein gir maksimal PYY-respons.",
    scienceNoteEN: "Beans + meat → fiber and protein provide maximum PYY response.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Kjøttdeig 5%", nameEN: "Ground beef 5% fat", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Hermetiske kidneybønner", nameEN: "Canned kidney beans", amount: "100 g", section: "Tørrvarer" },
      { name: "Hakkede tomater", nameEN: "Chopped tomatoes", amount: "1 boks", section: "Tørrvarer" },
      { name: "Løk", nameEN: "Onion", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Hvitløk", nameEN: "Garlic", amount: "2 fedd", section: "Frukt & Grønt" },
      { name: "Paprikapulver", nameEN: "Paprika powder", amount: "1 ts", section: "Tørrvarer" },
      { name: "Spisskummen", nameEN: "Cumin", amount: "½ ts", section: "Tørrvarer" }
    ],
    instructions: "Brun kjøttdeig med løk og hvitløk. Tilsett tomater, bønner og krydder. Kok 15 min.",
    instructionsEN: "Brown ground beef with onion and garlic. Add tomatoes, beans and spices. Simmer 15 min.",
    tags: ["high-protein", "high-fiber", "meal-prep", "budget"],
    allergens: [],
    dietary: ["lactose-free", "gluten-free"]
  },

  {
    id: "fiskegrateng",
    name: "Fiskegrateng med Brokkoli",
    nameEN: "Fish Gratin with Broccoli",
    type: "dinner",
    prepTime: 35,
    pathways: { glp1: 2, gip: 3, glucagon: 2, amylin: 2, pyy: 3, leptin: 3, ghrelin: 3, insulin: 3 },
    scienceNote: "Hvit fisk → mager protein → PYY uten mye fett.",
    scienceNoteEN: "White fish → lean protein → PYY without much fat.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Torsk/sei", nameEN: "Cod/pollock", amount: "200 g", section: "Kjøtt & Fisk" },
      { name: "Brokkoli", nameEN: "Broccoli", amount: "150 g", section: "Frukt & Grønt" },
      { name: "Melk", nameEN: "Milk", amount: "2 dl", section: "Meieri" },
      { name: "Hvetemel", nameEN: "Wheat flour", amount: "2 ss", section: "Tørrvarer" },
      { name: "Revet ost", nameEN: "Grated cheese", amount: "50 g", section: "Meieri" },
      { name: "Smør", nameEN: "Butter", amount: "1 ss", section: "Meieri" }
    ],
    instructions: "Legg fisk og brokkoli i form. Lag hvit saus, hell over. Strø ost. Stek 200°C 20 min.",
    instructionsEN: "Place fish and broccoli in a baking dish. Make white sauce, pour over. Sprinkle cheese. Bake at 200°C for 20 min.",
    tags: ["high-protein", "comfort-food"],
    allergens: ["dairy", "gluten", "fish"],
    dietary: []
  },

  {
    id: "kylling-burrito",
    name: "Kylling-Burrito med Kikerter",
    nameEN: "Chicken Burrito with Chickpeas",
    type: "dinner",
    prepTime: 20,
    pathways: { glp1: 3, gip: 3, glucagon: 2, amylin: 2, pyy: 4, leptin: 2, ghrelin: 4, insulin: 4 },
    scienceNote: "Fullkorn + kikerter + kylling → trippel fiber/protein for GLP-1 og PYY.",
    scienceNoteEN: "Whole grain + chickpeas + chicken → triple fiber/protein for GLP-1 and PYY.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Fullkornstortilla", nameEN: "Whole grain tortilla", amount: "2 stk", section: "Bakeri" },
      { name: "Kyllingbryst", nameEN: "Chicken breast", amount: "120 g", section: "Kjøtt & Fisk" },
      { name: "Hermetiske kikerter", nameEN: "Canned chickpeas", amount: "80 g", section: "Tørrvarer" },
      { name: "Salat", nameEN: "Lettuce", amount: "1 håndfull", section: "Frukt & Grønt" },
      { name: "Tomat", nameEN: "Tomato", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Rømme lett", nameEN: "Light sour cream", amount: "2 ss", section: "Meieri" }
    ],
    instructions: "Stek kylling i biter med krydder. Fyll tortilla med kylling, kikerter, grønt og rømme.",
    instructionsEN: "Stir-fry chicken pieces with seasoning. Fill tortilla with chicken, chickpeas, greens and sour cream.",
    tags: ["high-protein", "high-fiber"],
    allergens: ["dairy", "gluten"],
    dietary: []
  },

  {
    id: "omelett-middag",
    name: "Stor Omelett med Feta",
    nameEN: "Large Omelette with Feta",
    type: "dinner",
    prepTime: 15,
    pathways: { glp1: 2, gip: 3, glucagon: 3, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "4 egg = 26 g protein → sterk glukagon og PYY.",
    scienceNoteEN: "4 eggs = 26g protein → strong glucagon and PYY.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Egg", nameEN: "Eggs", amount: "4 stk", section: "Meieri" },
      { name: "Paprika", nameEN: "Bell pepper", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Spinat", nameEN: "Spinach", amount: "1 håndfull", section: "Frukt & Grønt" },
      { name: "Fetaost", nameEN: "Feta cheese", amount: "40 g", section: "Meieri" },
      { name: "Olivenolje", nameEN: "Olive oil", amount: "1 ts", section: "Tørrvarer" }
    ],
    instructions: "Stek grønnsaker, hell over vispede egg. Smuldre feta over. Stek til stivnet.",
    instructionsEN: "Sauté vegetables, pour whisked eggs over. Crumble feta on top. Cook until set.",
    tags: ["high-protein", "low-carb", "quick", "budget"],
    allergens: ["dairy", "eggs"],
    dietary: ["vegetarian", "gluten-free"]
  },

  {
    id: "lakseburger",
    name: "Lakseburger uten Brød",
    nameEN: "Salmon Burger without Bread",
    type: "dinner",
    prepTime: 20,
    pathways: { glp1: 2, gip: 3, glucagon: 2, amylin: 2, pyy: 4, leptin: 4, ghrelin: 4, insulin: 2 },
    scienceNote: "Omega-3 fra laks → leptin + adiponektin-boost.",
    scienceNoteEN: "Omega-3 from salmon → leptin + adiponectin boost.",
    drugEquivalent: "Ozempic + Wegovy",
    ingredients: [
      { name: "Laksekjøttdeig/filet", nameEN: "Salmon mince/fillet", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Egg", nameEN: "Eggs", amount: "1 stk", section: "Meieri" },
      { name: "Brødrasp", nameEN: "Breadcrumbs", amount: "2 ss", section: "Tørrvarer" },
      { name: "Dill", nameEN: "Dill", amount: "1 ss", section: "Frukt & Grønt" },
      { name: "Salatblader", nameEN: "Lettuce leaves", amount: "4 stk", section: "Frukt & Grønt" },
      { name: "Agurk", nameEN: "Cucumber", amount: "noen skiver", section: "Frukt & Grønt" }
    ],
    instructions: "Bland laks, egg, rasp og dill. Form burgere, stek 4 min per side. Server i salatblader.",
    instructionsEN: "Mix salmon, egg, breadcrumbs and dill. Form burgers, fry 4 min per side. Serve in lettuce leaves.",
    tags: ["high-protein", "low-carb", "omega-3"],
    allergens: ["gluten", "eggs", "fish"],
    dietary: ["lactose-free"]
  },

  {
    id: "tikka-masala",
    name: "Kylling Tikka Masala med Blomkålris",
    nameEN: "Chicken Tikka Masala with Cauliflower Rice",
    type: "dinner",
    prepTime: 30,
    pathways: { glp1: 3, gip: 3, glucagon: 2, amylin: 2, pyy: 3, leptin: 3, ghrelin: 4, insulin: 3 },
    scienceNote: "Gurkemeie + chili → termogenese + antiinflammatorisk.",
    scienceNoteEN: "Turmeric + chili → thermogenesis + anti-inflammatory.",
    drugEquivalent: "Contrave + Mounjaro",
    ingredients: [
      { name: "Kyllingbryst", nameEN: "Chicken breast", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Yoghurt naturell", nameEN: "Plain yogurt", amount: "3 ss", section: "Meieri" },
      { name: "Tikka masala-paste", nameEN: "Tikka masala paste", amount: "2 ss", section: "Tørrvarer" },
      { name: "Hakkede tomater", nameEN: "Chopped tomatoes", amount: "½ boks", section: "Tørrvarer" },
      { name: "Blomkål", nameEN: "Cauliflower", amount: "200 g", section: "Frukt & Grønt" },
      { name: "Gurkemeie", nameEN: "Turmeric", amount: "½ ts", section: "Tørrvarer" }
    ],
    instructions: "Marinér kylling i yoghurt og paste. Stek, tilsett tomat. Riv blomkål til 'ris', dampkok.",
    instructionsEN: "Marinate chicken in yogurt and paste. Fry, add tomato. Grate cauliflower into 'rice', steam.",
    tags: ["high-protein", "thermogenic", "low-carb"],
    allergens: ["dairy"],
    dietary: ["gluten-free"]
  },

  {
    id: "fisk-taco",
    name: "Fisketaco med Kål og Lime",
    nameEN: "Fish Tacos with Cabbage and Lime",
    type: "dinner",
    prepTime: 20,
    pathways: { glp1: 2, gip: 3, glucagon: 2, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Hvit fisk = mager protein. Kål gir fiber for GLP-1.",
    scienceNoteEN: "White fish = lean protein. Cabbage provides fiber for GLP-1.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Torsk/sei", nameEN: "Cod/pollock", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Fullkornstortilla", nameEN: "Whole grain tortilla", amount: "2 stk", section: "Bakeri" },
      { name: "Rødkål", nameEN: "Red cabbage", amount: "100 g", section: "Frukt & Grønt" },
      { name: "Lime", nameEN: "Lime", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Rømme lett", nameEN: "Light sour cream", amount: "2 ss", section: "Meieri" },
      { name: "Koriander", nameEN: "Cilantro", amount: "litt", section: "Frukt & Grønt" }
    ],
    instructions: "Stek fisk med krydder, del i biter. Fyll tortilla med fisk, kålsalat og rømme.",
    instructionsEN: "Fry fish with seasoning, break into pieces. Fill tortilla with fish, coleslaw and sour cream.",
    tags: ["high-protein", "quick"],
    allergens: ["dairy", "gluten", "fish"],
    dietary: []
  },

  {
    id: "bacalao",
    name: "Bacalao",
    nameEN: "Bacalao",
    type: "dinner",
    prepTime: 35,
    pathways: { glp1: 2, gip: 2, glucagon: 2, amylin: 2, pyy: 3, leptin: 3, ghrelin: 3, insulin: 3 },
    scienceNote: "Torsk + olivenolje → protein og enumettet fett for leptin.",
    scienceNoteEN: "Cod + olive oil → protein and monounsaturated fat for leptin.",
    drugEquivalent: "Mounjaro + Wegovy",
    ingredients: [
      { name: "Torsk", nameEN: "Cod", amount: "200 g", section: "Kjøtt & Fisk" },
      { name: "Poteter", nameEN: "Potatoes", amount: "200 g", section: "Frukt & Grønt" },
      { name: "Hakkede tomater", nameEN: "Chopped tomatoes", amount: "1 boks", section: "Tørrvarer" },
      { name: "Paprika", nameEN: "Bell pepper", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Løk", nameEN: "Onion", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Olivenolje", nameEN: "Olive oil", amount: "2 ss", section: "Tørrvarer" },
      { name: "Hvitløk", nameEN: "Garlic", amount: "2 fedd", section: "Frukt & Grønt" }
    ],
    instructions: "Stek løk, hvitløk og paprika. Tilsett tomater og poteter, kok 15 min. Legg i torsk, kok 10 min.",
    instructionsEN: "Sauté onion, garlic and bell pepper. Add tomatoes and potatoes, simmer 15 min. Add cod, simmer 10 min.",
    tags: ["high-protein", "traditional"],
    allergens: ["fish"],
    dietary: ["lactose-free", "gluten-free"]
  },

  {
    id: "fiskesuppe",
    name: "Enkel Fiskesuppe",
    nameEN: "Simple Fish Soup",
    type: "dinner",
    prepTime: 25,
    pathways: { glp1: 2, gip: 2, glucagon: 2, amylin: 2, pyy: 3, leptin: 2, ghrelin: 3, insulin: 2 },
    scienceNote: "Varm suppe øker metthet via vagusnerven → ghrelin ned.",
    scienceNoteEN: "Warm soup increases satiety via the vagus nerve → ghrelin down.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Torsk/laks", nameEN: "Cod/salmon", amount: "200 g", section: "Kjøtt & Fisk" },
      { name: "Gulrot", nameEN: "Carrot", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Purre", nameEN: "Leek", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Poteter", nameEN: "Potatoes", amount: "2 stk", section: "Frukt & Grønt" },
      { name: "Fiskekraft", nameEN: "Fish stock", amount: "5 dl", section: "Tørrvarer" },
      { name: "Fløte", nameEN: "Cream", amount: "1 dl", section: "Meieri" }
    ],
    instructions: "Kok grønnsaker i kraft 10 min. Tilsett fisk i biter, kok 5 min. Rør inn fløte.",
    instructionsEN: "Simmer vegetables in stock for 10 min. Add fish pieces, cook 5 min. Stir in cream.",
    tags: ["high-protein", "comfort-food", "traditional"],
    allergens: ["dairy", "fish"],
    dietary: ["gluten-free"]
  },

  {
    id: "kylling-salat",
    name: "Kyllingsalat med Avokado og Feta",
    nameEN: "Chicken Salad with Avocado and Feta",
    type: "dinner",
    prepTime: 15,
    pathways: { glp1: 2, gip: 2, glucagon: 3, amylin: 2, pyy: 3, leptin: 3, ghrelin: 3, insulin: 2 },
    scienceNote: "Kylling + avokado-fett → protein og fett gir langvarig metthet.",
    scienceNoteEN: "Chicken + avocado fat → protein and fat provide lasting satiety.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Kyllingbryst", nameEN: "Chicken breast", amount: "150 g", section: "Kjøtt & Fisk" },
      { name: "Blandet salat", nameEN: "Mixed salad greens", amount: "100 g", section: "Frukt & Grønt" },
      { name: "Avokado", nameEN: "Avocado", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Fetaost", nameEN: "Feta cheese", amount: "40 g", section: "Meieri" },
      { name: "Cherrytomater", nameEN: "Cherry tomatoes", amount: "6 stk", section: "Frukt & Grønt" },
      { name: "Olivenolje", nameEN: "Olive oil", amount: "1 ss", section: "Tørrvarer" }
    ],
    instructions: "Stek eller bruk grillrester av kylling. Bland alle ingredienser, dryss olje over.",
    instructionsEN: "Fry or use leftover grilled chicken. Toss all ingredients, drizzle oil over.",
    tags: ["high-protein", "low-carb", "quick"],
    allergens: ["dairy"],
    dietary: ["gluten-free"]
  },


  {
    id: "kikert-curry",
    name: "Kikertcurry med Spinat",
    nameEN: "Chickpea Curry with Spinach",
    type: "dinner",
    prepTime: 25,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 4, leptin: 3, ghrelin: 4, insulin: 4 },
    scienceNote: "Kikerter har resistens-stivelse → kraftig GLP-1. Gurkemeie er antiinflammatorisk.",
    scienceNoteEN: "Chickpeas contain resistant starch → strong GLP-1. Turmeric is anti-inflammatory.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Hermetiske kikerter", nameEN: "Canned chickpeas", amount: "1 boks (400 g)", section: "Tørrvarer" },
      { name: "Babyspinat", nameEN: "Baby spinach", amount: "100 g", section: "Frukt & Grønt" },
      { name: "Kokosmelk lett", nameEN: "Light coconut milk", amount: "2 dl", section: "Tørrvarer" },
      { name: "Løk", nameEN: "Onion", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Hvitløk", nameEN: "Garlic", amount: "2 fedd", section: "Frukt & Grønt" },
      { name: "Ingefær", nameEN: "Ginger", amount: "1 ts revet", section: "Frukt & Grønt" },
      { name: "Gurkemeie", nameEN: "Turmeric", amount: "1 ts", section: "Tørrvarer" },
      { name: "Garam masala", nameEN: "Garam masala", amount: "1 ts", section: "Tørrvarer" },
      { name: "Hakkede tomater", nameEN: "Chopped tomatoes", amount: "1 boks", section: "Tørrvarer" }
    ],
    instructions: "Fres løk, hvitløk og ingefær. Tilsett krydder, tomater og kokosmelk. Kok 10 min. Ha i kikerter og spinat, kok 5 min til.",
    instructionsEN: "Sauté onion, garlic and ginger. Add spices, tomatoes and coconut milk. Simmer 10 min. Add chickpeas and spinach, cook 5 min more.",
    tags: ["high-fiber", "high-protein", "thermogenic"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "linsesuppe",
    name: "Krydret Linsesuppe",
    nameEN: "Spiced Lentil Soup",
    type: "dinner",
    prepTime: 30,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 4, leptin: 3, ghrelin: 4, insulin: 4 },
    scienceNote: "Linser senker glykemisk indeks → GLP-1 og PYY. Varm suppe øker metthet via vagusnerven.",
    scienceNoteEN: "Lentils lower glycemic index → GLP-1 and PYY. Warm soup increases satiety via the vagus nerve.",
    drugEquivalent: "Ozempic + Mounjaro",
    ingredients: [
      { name: "Røde linser", nameEN: "Red lentils", amount: "200 g", section: "Tørrvarer" },
      { name: "Gulrot", nameEN: "Carrot", amount: "2 stk", section: "Frukt & Grønt" },
      { name: "Løk", nameEN: "Onion", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Hvitløk", nameEN: "Garlic", amount: "2 fedd", section: "Frukt & Grønt" },
      { name: "Hakkede tomater", nameEN: "Chopped tomatoes", amount: "1 boks", section: "Tørrvarer" },
      { name: "Grønnsaksbuljong", nameEN: "Vegetable stock", amount: "5 dl", section: "Tørrvarer" },
      { name: "Spisskummen", nameEN: "Cumin", amount: "1 ts", section: "Tørrvarer" },
      { name: "Gurkemeie", nameEN: "Turmeric", amount: "½ ts", section: "Tørrvarer" },
      { name: "Sitron", nameEN: "Lemon", amount: "½ stk", section: "Frukt & Grønt" }
    ],
    instructions: "Fres løk, hvitløk og gulrot. Tilsett linser, tomater, buljong og krydder. Kok 20 min til linsene er myke. Press over sitron.",
    instructionsEN: "Sauté onion, garlic and carrot. Add lentils, tomatoes, stock and spices. Simmer 20 min until lentils are soft. Squeeze lemon over.",
    tags: ["high-fiber", "high-protein", "comfort-food", "budget", "meal-prep"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "tofu-wok",
    name: "Grønnsakswok med Tofu",
    nameEN: "Vegetable Stir-Fry with Tofu",
    type: "dinner",
    prepTime: 20,
    pathways: { glp1: 3, gip: 2, glucagon: 2, amylin: 1, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    scienceNote: "Tofu gir planteprotein → PYY. Chili og ingefær → termogenese og ghrelin-demping.",
    scienceNoteEN: "Tofu provides plant protein → PYY. Chili and ginger → thermogenesis and ghrelin suppression.",
    drugEquivalent: "Mounjaro + Contrave",
    ingredients: [
      { name: "Fast tofu", nameEN: "Firm tofu", amount: "200 g", section: "Kjøtt & Fisk" },
      { name: "Wokgrønnsaker", nameEN: "Stir-fry vegetables", amount: "300 g", section: "Frukt & Grønt" },
      { name: "Ingefær", nameEN: "Ginger", amount: "1 ts revet", section: "Frukt & Grønt" },
      { name: "Hvitløk", nameEN: "Garlic", amount: "2 fedd", section: "Frukt & Grønt" },
      { name: "Soyasaus", nameEN: "Soy sauce", amount: "2 ss", section: "Tørrvarer" },
      { name: "Sesamolje", nameEN: "Sesame oil", amount: "1 ts", section: "Tørrvarer" },
      { name: "Chili", nameEN: "Chili", amount: "½ stk", section: "Frukt & Grønt" },
      { name: "Sesamfrø", nameEN: "Sesame seeds", amount: "1 ss", section: "Tørrvarer" }
    ],
    instructions: "Kutt tofu i terninger og stek sprø. Tilsett grønnsaker, ingefær, hvitløk og chili. Smak til med soyasaus og sesamolje. Dryss sesamfrø.",
    instructionsEN: "Cube tofu and fry until crispy. Add vegetables, ginger, garlic and chili. Season with soy sauce and sesame oil. Sprinkle sesame seeds.",
    tags: ["high-protein", "thermogenic", "quick"],
    allergens: ["soy"],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "bonne-sotpotet-chili",
    name: "Bønne- og Søtpotetchili",
    nameEN: "Bean and Sweet Potato Chili",
    type: "dinner",
    prepTime: 30,
    pathways: { glp1: 4, gip: 2, glucagon: 1, amylin: 1, pyy: 4, leptin: 3, ghrelin: 4, insulin: 4 },
    scienceNote: "Bønner + søtpotet → dobbel fiber for kraftig GLP-1 og PYY. Chili → termogenese.",
    scienceNoteEN: "Beans + sweet potato → double fiber for strong GLP-1 and PYY. Chili → thermogenesis.",
    drugEquivalent: "Ozempic + Mounjaro + Contrave",
    ingredients: [
      { name: "Hermetiske svarte bønner", nameEN: "Canned black beans", amount: "1 boks (400 g)", section: "Tørrvarer" },
      { name: "Søtpotet", nameEN: "Sweet potato", amount: "200 g", section: "Frukt & Grønt" },
      { name: "Hakkede tomater", nameEN: "Chopped tomatoes", amount: "1 boks", section: "Tørrvarer" },
      { name: "Løk", nameEN: "Onion", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Hvitløk", nameEN: "Garlic", amount: "2 fedd", section: "Frukt & Grønt" },
      { name: "Paprika", nameEN: "Bell pepper", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Spisskummen", nameEN: "Cumin", amount: "1 ts", section: "Tørrvarer" },
      { name: "Chili", nameEN: "Chili", amount: "1 stk", section: "Frukt & Grønt" },
      { name: "Koriander", nameEN: "Cilantro", amount: "litt", section: "Frukt & Grønt" }
    ],
    instructions: "Kutt søtpotet i terninger, fres med løk og hvitløk. Tilsett tomater, bønner og krydder. Kok 20 min. Topp med koriander.",
    instructionsEN: "Cube sweet potato, sauté with onion and garlic. Add tomatoes, beans and spices. Simmer 20 min. Top with cilantro.",
    tags: ["high-fiber", "high-protein", "meal-prep", "budget", "thermogenic"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },


  // ─── EVENING (5) ──────────────────────────────────────────────────

  {
    id: "gronn-te-ingefar",
    name: "Grønn Te med Ingefær",
    nameEN: "Green Tea with Ginger",
    type: "evening",
    prepTime: 3,
    pathways: { glp1: 1, gip: 0, glucagon: 0, amylin: 0, pyy: 1, leptin: 1, ghrelin: 2, insulin: 1 },
    scienceNote: "EGCG i grønn te → øker fettoksidasjon. Ingefær demper appetitt.",
    scienceNoteEN: "EGCG in green tea → increases fat oxidation. Ginger suppresses appetite.",
    drugEquivalent: "Contrave",
    ingredients: [
      { name: "Grønn te", nameEN: "Green tea", amount: "1 pose", section: "Drikke" },
      { name: "Fersk ingefær", nameEN: "Fresh ginger", amount: "2 skiver", section: "Frukt & Grønt" }
    ],
    instructions: "Kok vann, legg i te og ingefær. Trekk 3 min.",
    instructionsEN: "Boil water, add tea and ginger. Steep 3 min.",
    tags: ["zero-cal", "thermogenic", "quick"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "skyr-kanel",
    name: "Skyr med Kanel og Valnøtter",
    nameEN: "Skyr with Cinnamon and Walnuts",
    type: "evening",
    prepTime: 2,
    pathways: { glp1: 1, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 1, ghrelin: 2, insulin: 2 },
    scienceNote: "Kasein i skyr → langsom proteinfordøyelse gjennom natten.",
    scienceNoteEN: "Casein in skyr → slow protein digestion through the night.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Skyr naturell", nameEN: "Plain skyr", amount: "100 g", section: "Meieri" },
      { name: "Kanel", nameEN: "Cinnamon", amount: "½ ts", section: "Tørrvarer" },
      { name: "Valnøtter", nameEN: "Walnuts", amount: "15 g", section: "Tørrvarer" }
    ],
    instructions: "Liten porsjon skyr med kanel og knuste valnøtter.",
    instructionsEN: "Small portion of skyr with cinnamon and crushed walnuts.",
    tags: ["quick", "no-cook", "high-protein"],
    allergens: ["dairy", "nuts"],
    dietary: ["vegetarian", "gluten-free"]
  },

  {
    id: "mork-sjokolade",
    name: "Mørk Sjokolade 70%",
    nameEN: "Dark Chocolate 70%",
    type: "evening",
    prepTime: 0,
    pathways: { glp1: 1, gip: 0, glucagon: 0, amylin: 0, pyy: 1, leptin: 1, ghrelin: 2, insulin: 1 },
    scienceNote: "Kakao-flavonoider → bedrer insulinfølsomhet i små doser.",
    scienceNoteEN: "Cocoa flavonoids → improve insulin sensitivity in small doses.",
    drugEquivalent: "Contrave",
    ingredients: [
      { name: "Mørk sjokolade 70%+", nameEN: "Dark chocolate 70%+", amount: "20 g (2–3 biter)", section: "Tørrvarer" }
    ],
    instructions: "Nyt sakte, 2–3 biter. La det smelte på tunga.",
    instructionsEN: "Enjoy slowly, 2–3 pieces. Let it melt on your tongue.",
    tags: ["treat", "mindful-eating"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "popcorn-luft",
    name: "Luftpoppet Popcorn",
    nameEN: "Air-Popped Popcorn",
    type: "evening",
    prepTime: 5,
    pathways: { glp1: 2, gip: 1, glucagon: 0, amylin: 0, pyy: 1, leptin: 1, ghrelin: 2, insulin: 2 },
    scienceNote: "Fullkorn-fiber → GLP-1. Stort volum, få kalorier.",
    scienceNoteEN: "Whole grain fiber → GLP-1. Large volume, few calories.",
    drugEquivalent: "Ozempic",
    ingredients: [
      { name: "Popcornmais", nameEN: "Popcorn kernels", amount: "40 g", section: "Tørrvarer" },
      { name: "Salt", nameEN: "Salt", amount: "en klype", section: "Tørrvarer" }
    ],
    instructions: "Popp i kjele uten fett eller bruk luftpopper. Dryss litt salt.",
    instructionsEN: "Pop in a pot without fat or use an air popper. Sprinkle a little salt.",
    tags: ["high-fiber", "low-cal", "high-volume"],
    allergens: [],
    dietary: ["vegetarian", "vegan", "lactose-free", "gluten-free"]
  },

  {
    id: "bar-cottage",
    name: "Bær med Cottage Cheese",
    nameEN: "Berries with Cottage Cheese",
    type: "evening",
    prepTime: 2,
    pathways: { glp1: 1, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 1, ghrelin: 2, insulin: 2 },
    scienceNote: "Kasein → nattlig PYY. Bær gir antioksidanter uten mye sukker.",
    scienceNoteEN: "Casein → nightly PYY. Berries provide antioxidants without much sugar.",
    drugEquivalent: "Mounjaro",
    ingredients: [
      { name: "Cottage cheese", nameEN: "Cottage cheese", amount: "100 g", section: "Meieri" },
      { name: "Blandede bær", nameEN: "Mixed berries", amount: "50 g", section: "Frukt & Grønt" }
    ],
    instructions: "Ha cottage cheese i skål, topp med bær.",
    instructionsEN: "Put cottage cheese in a bowl, top with berries.",
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
    nameEN: "Week 1 — Getting Started",
    description: "Havregrøt-autopilot hverdager, variert helg",
    descriptionEN: "Oatmeal autopilot weekdays, varied weekend",
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
    nameEN: "Week 2 — More Variety",
    description: "Havregrøt-autopilot hverdager, nye helgefrokoster",
    descriptionEN: "Oatmeal autopilot weekdays, new weekend breakfasts",
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
    nameEN: "Week 3 — Crispbread Week",
    description: "Knekkebrød-autopilot hverdager, variert helg",
    descriptionEN: "Crispbread autopilot weekdays, varied weekend",
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
    nameEN: "Week 4 — Mastery Week",
    description: "Knekkebrød-autopilot hverdager, du mestrer dette!",
    descriptionEN: "Crispbread autopilot weekdays, you've got this!",
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
