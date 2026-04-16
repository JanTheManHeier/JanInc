// 150 boy names — norsk · english — nature/seasons + bilingual classics
const BOY_NAMES = [
    // ── Nature & Seasons (sibling to Winter) ──
    "Storm", "Frost", "Ash", "Heath", "Reed", "Cliff", "Glen",
    "Flint", "Stone", "Brook", "River", "Sky", "Forest", "Blaze",
    "Hawk", "Fox", "Wolf", "Bear", "Orion", "Atlas", "Phoenix",
    "Sol", "Bay", "Dale", "North", "Cove", "Ridge", "Lake",
    "Elm", "Oak", "Moss", "Ember", "Slate", "Onyx", "Jet",
    "Steel", "Birk", "Summit", "Tor", "Stein", "Bjørn",
    "Sølv", "Tind", "Fjell", "Bre", "Høst",

    // ── Bilingual classics (work in NO + EN) ──
    "Oscar", "Leo", "Emil", "Max", "Noah", "Oliver", "Felix",
    "Axel", "Sebastian", "Alexander", "Adrian", "Martin", "Daniel",
    "David", "Samuel", "Simon", "Marcus", "Thomas", "Jonas", "Lucas",
    "Elias", "Henrik", "Benjamin", "Filip", "Teodor", "Nikolai",
    "Tobias", "Magnus", "Victor", "Robert", "Anton", "Herman",
    "Albert", "Alfred", "August", "Leonard", "Vincent", "William",
    "Julian", "Mathias", "Gabriel", "Rafael", "Mikael", "Stefan",
    "Philip", "Liam", "Theo", "Milo", "Leon", "Adam",

    // ── Nordic/Norse that English speakers recognize ──
    "Odin", "Thor", "Leif", "Sven", "Arne", "Lars", "Ragnar",
    "Sigurd", "Ivar", "Alvin", "Erling", "Gunnar", "Haldor",
    "Vidar", "Tristan", "Roald", "Einar", "Nils",

    // ── Modern bilingual ──
    "Casper", "Lukas", "Isak", "Aron", "Hugo", "Mats",
    "Kristian", "Edvin", "Ludvig", "Konrad", "Harald", "Sverre",
    "Brage", "Even", "Markus", "Eskil", "Vetle", "Sander",
    "Aksel", "Didrik", "Halvard", "Sindre", "Iver",

    // ── Strong & timeless ──
    "Arthur", "Edward", "Edmund", "Edgar", "Ernest", "Cecil",
    "Cedric", "Conrad", "Roland", "Ruben", "Valentin", "Severin",
    "Viljar"
];

// 50 unisex names — norsk · english — nature-inspired + modern
const UNISEX_NAMES = [
    "Rowan", "Sage", "Robin", "Rune", "Kai", "Kim", "Alex",
    "Jordan", "Morgan", "Quinn", "Eden", "Noa", "Luca",
    "Mika", "Nico", "Sam", "Charlie", "Ari", "Jesse", "Pax",
    "Reyn", "Aspen", "Indigo", "Lyric", "Wren", "Lark",
    "Stellan", "Milan", "Florian", "Jules", "Eli", "Ray",
    "Sølve", "Eira", "Idun", "Saga", "Marin", "Lin",
    "Avery", "Emery", "Blair", "Dana", "Linden", "Kellan",
    "Finley", "Riley", "Tatum", "Skye", "Bryn", "Haven"
];

// Combined list for the swipe phase
const BABY_NAMES = [...BOY_NAMES, ...UNISEX_NAMES];
