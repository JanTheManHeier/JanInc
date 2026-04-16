// ── ROUND 2 ──
// Curated based on Åge & Marie's round 1 preferences:
//   Åge: loves modern/unisex/celestial (Quinn, Jordan, Avery, Adam, Orion)
//   Marie: loves elegant classics + poetic nature (Oscar, Arthur, Aspen, Høst, Hugo, Florian)
//   Middle ground: international elegance, celestial, refined nature, short & clean
//   + SSB Top 100 Norway 2024

// SSB Top 100 Norway 2024 (not in round 1)
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

// Combined list for swipe phase
const BABY_NAMES = [
    ...SSB_POPULAR, ...CELESTIAL, ...NATURE_ELEGANT, ...MODERN_INTL,
    ...CLASSICS, ...SHORT_CLEAN, ...BRIDGE, ...EXTRAS
];
