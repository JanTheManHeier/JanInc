// ── ROUND 1 + ROUND 2 (400 names) ──
// Round 1: Nature/season-themed + bilingual NO/EN names
// Round 2: Curated based on Åge & Marie's round 1 preferences + SSB Top 100

// ── ROUND 1 (original 200) ──
const ROUND_1 = [
    "Alba", "Alden", "Alder", "Andes", "Archer", "Aria", "Asher", "Aspen",
    "Atlas", "August", "Aurora", "Autumn", "Axel", "Bear", "Birch", "Bjørk",
    "Blaze", "Brage", "Bris", "Brook", "Bryn", "Calder", "Caspian", "Cedar",
    "Clay", "Cliff", "Cloud", "Cove", "Cypress", "Dagny", "Dale", "Dune",
    "Eden", "Eik", "Einar", "Eira", "Elm", "Ember", "Erika", "Falcon",
    "Felix", "Fenris", "Fern", "Field", "Finn", "Fjell", "Fjord", "Flame",
    "Flora", "Flint", "Forrest", "Frost", "Gale", "Glen", "Grizzly", "Grove",
    "Gust", "Hagen", "Hav", "Haven", "Hawk", "Hazel", "Heath", "Idun",
    "Iris", "Isak", "Isfjell", "Isfjord", "Ivy", "Jasper", "Kai", "Lake",
    "Lark", "Leif", "Leo", "Lin", "Lind", "Linden", "Luna", "Lynx",
    "Maple", "Marina", "Meadow", "Mist", "Mona", "Moon", "Moss", "Myrk",
    "Natt", "Neptune", "Nord", "Oaken", "Ocean", "Odin", "Olive", "Oliver",
    "Orca", "Pearl", "Phoenix", "Pine", "Rain", "Ranger", "Raven", "Reed",
    "Ridge", "Rind", "River", "Robin", "Roc", "Rocky", "Rose", "Rowan",
    "Saga", "Sahara", "Sander", "Selene", "Sierra", "Sigrid", "Silje",
    "Silver", "Sjø", "Skai", "Sky", "Slate", "Snow", "Sol", "Solveig",
    "Sparrow", "Star", "Steel", "Stella", "Stellan", "Storm", "Stream",
    "Summr", "Sune", "Sunrise", "Sverre", "Terra", "Thorn", "Thunder",
    "Tide", "Timber", "Tor", "Torbjørn", "Tundra", "Ulv", "Vale",
    "Valkyrie", "Vega", "Vesper", "Viggo", "Viking", "Vine", "Violet",
    "Vinter", "Voss", "Wave", "Wick", "Wren", "Zephyr",
    "Adam", "Adrian", "Alva", "Bruno", "Charlie", "Dagr", "Drake", "Elias",
    "Embla", "Erik", "Falk", "Freya", "Frøya", "Gaia", "Harald", "Heks",
    "Hugo", "Høst", "Iver", "Jordan", "Liam", "Loki", "Marcus", "Markus",
    "Milo", "Nils", "North", "Orion", "Oscar", "Quinn", "Ragnar", "Sigurd",
    "Avery", "Florian", "Albert", "Alfred", "Arthur", "Ludvig", "Aksel"
];

// ── ROUND 2 (200 new names) ──

// SSB Top 100 Norway 2024
const SSB_POPULAR = [
    "Johannes", "Olav", "Jakob", "Ulrik", "Matheo", "Gustav", "Mikkel",
    "Johan", "Håkon", "Jens", "Henry", "Ole", "Jacob", "Ola",
    "Mio", "Leander", "Jesper", "Edvard", "Linus", "Ask", "Elliot",
    "Andreas", "Amund", "Jonathan", "Fredrik", "Levi", "Emrik", "Georg",
    "Hans", "Trym"
];

// Celestial & mythic (Åge loved Orion)
const CELESTIAL = [
    "Cassian", "Sirius", "Apollo", "Cosmo", "Perseus",
    "Zenith", "Altair", "Caius", "Rigel", "Stellaris", "Aster", "Oriel"
];

// Elegant nature (Marie loved Aspen, Høst, North)
const NATURE_ELEGANT = [
    "Harbor", "Canyon", "Glacier", "Reef", "Shore", "Spruce",
    "Horizon", "Wilder", "Prairie", "Haze", "Summit", "Crest",
    "Bay", "Moor", "Briar", "Quill", "Marsh",
    "Sage", "Talon", "Loch", "Peak",
    "Boulder"
];

// Modern international (Åge's sweet spot)
const MODERN_INTL = [
    "Zane", "Blake", "Cameron", "Dylan", "Evan", "Hayden", "Ryan",
    "Spencer", "Beckett", "Griffin", "Sawyer", "Logan", "Hudson",
    "Mason", "Parker", "Hunter", "Cooper", "Carter", "Carson",
    "Devon", "Ashton", "Lennon", "Ronan", "Nolan", "Callum", "Declan"
];

// Elegant classics (Marie's sweet spot)
const CLASSICS = [
    "Benedict", "Leopold", "Desmond", "Lawrence", "Malcolm",
    "Quentin", "Winston", "Douglas", "Duncan", "Patrick", "Wesley",
    "Lionel", "Hamish", "Ambrose", "Hector", "Clarence", "Wallace",
    "Rupert", "Lysander", "Percival", "Barnaby", "Edmund"
];

// Short & clean (bridges both tastes)
const SHORT_CLEAN = [
    "Cole", "Jude", "Beau", "Knox", "Tate", "Wade", "Lane", "Dean",
    "Grant", "Nash", "Reid", "Cruz", "Jace", "Rhys", "Rex",
    "Seth", "Noel", "Kit", "Gage", "Shane", "Scott", "Brett",
    "Ace", "Rune", "Grim"
];

// Modern-classic bridge names
const BRIDGE = [
    "Miles", "Everett", "Emmett", "Calvin", "Hayes", "Barrett",
    "Brooks", "Fletcher", "Graham", "Harvey", "Dawson",
    "Edison", "Marshall", "Porter", "Lincoln", "Silas", "Ezra", "Caleb",
    "Kieran", "Pierce", "Warren", "Thane", "Sullivan", "Harlan",
    "Hendrix", "Amos", "Cyrus", "Tobias", "Casper", "Sterling"
];

// European & Nordic extras
const EXTRAS = [
    "Otto", "Elio", "Rio", "Remy", "Alec", "Dante", "Enzo",
    "Bastian", "Soren", "Cato", "Bo", "Anders", "Petter", "Niklas",
    "Mattis", "Torsten", "Fritjof", "Halvar", "Lev", "Ivo",
    "Alaric", "Theron", "Boden", "Stig", "Tarjei", "Kristoffer",
    "Vebjørn", "Teodor", "Rafael", "Arvid", "Viljar", "Sindre",
    "Birger"
];

// Combined list for swipe phase (400 total)
const BABY_NAMES = [
    ...ROUND_1,
    ...SSB_POPULAR, ...CELESTIAL, ...NATURE_ELEGANT, ...MODERN_INTL,
    ...CLASSICS, ...SHORT_CLEAN, ...BRIDGE, ...EXTRAS
];
