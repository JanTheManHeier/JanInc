// 100 girl names — norsk · français · english
const GIRL_NAMES = [
    "Adèle", "Agathe", "Alice", "Alma", "Amalie", "Amelia", "Anna",
    "Annabelle", "Anne", "Ariane", "Astrid", "Aurora", "Béatrice",
    "Caroline", "Céleste", "Céline", "Charlotte", "Claire", "Clara",
    "Clémentine", "Colette", "Constance", "Daphné", "Diane", "Éléonore",
    "Élise", "Élodie", "Émilie", "Emma", "Estelle", "Eva", "Florence",
    "Gabrielle", "Hélène", "Héloïse", "Ida", "Inès", "Ingrid", "Iris",
    "Isabelle", "Jasmine", "Jeanne", "Joséphine", "Julie", "Juliette",
    "Laura", "Léa", "Lena", "Léonie", "Lily", "Lina", "Lisa", "Louise",
    "Lucie", "Luna", "Lydia", "Madeleine", "Manon", "Margot", "Marie",
    "Marina", "Marion", "Mathilde", "Mia", "Mila", "Nadia", "Nathalie",
    "Nicole", "Nina", "Nora", "Noémie", "Olivia", "Pauline", "Pénélope",
    "Rose", "Rosalie", "Roxane", "Sarah", "Simone", "Sophie", "Stella",
    "Suzanne", "Sylvie", "Théa", "Valentine", "Valérie", "Vera",
    "Victoria", "Violette", "Vivienne", "Zoé", "Alexandra", "Aurélie",
    "Delphine", "Elisabeth", "Ella", "Fleur", "Renée", "Stéphanie", "Maja"
];

// 100 unisex names — work as both girl & boy in norsk · français · english
const UNISEX_NAMES = [
    "Adrien", "Aimé", "Alex", "Alexis", "Alix", "Ange", "Andrea",
    "Ariel", "Aubrey", "Avery", "Blair", "Blaise", "Camille", "Charlie",
    "Chris", "Claude", "Cleo", "Dana", "Dani", "Darcy", "Dominique",
    "Eden", "Eli", "Émile", "Emery", "Esme", "Florian", "Francis",
    "Frankie", "Gabriel", "Gaël", "Honoré", "Ilan", "Jade", "Jamie",
    "Jean", "Jesse", "Jo", "Joël", "Jordan", "Jules", "Kai", "Kim",
    "Laurent", "Léo", "Leslie", "Lilian", "Lin", "Lou", "Luca", "Lucien",
    "Maël", "Manu", "Marin", "Max", "Maxime", "Mika", "Milan", "Morgan",
    "Nico", "Nikita", "Noa", "Noé", "Noël", "Nour", "Olive", "Paris",
    "Pascal", "Patrice", "Quinn", "Raphaël", "Ray", "Rémi", "René",
    "Robin", "Romy", "Rowan", "Sacha", "Sage", "Sam", "Sandy", "Soleil",
    "Søren", "Stellan", "Théo", "Toni", "Val", "Vivian", "Yael",
    "Yannick", "Aube", "Ciel", "Gaby", "Kerry", "Lori", "Nicky", "Pat",
    "Rue", "Corin", "Brune"
];

// Combined list for the swipe phase
const BABY_NAMES = [...GIRL_NAMES, ...UNISEX_NAMES];
