// ============================================================================
// SpisSlank — Carnivore Pathway-definisjonsfil
// Kartlegger de fysiologiske mekanismene bak et animalsk/karnivort kostholds
// effekt på vekttap, metthet og helse.
// ============================================================================

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // CARNIVORE_PATHWAYS — De 8 fysiologiske mekanismene
  // -------------------------------------------------------------------------
  window.CARNIVORE_PATHWAYS = {
    ketosis: {
      id: 'ketosis',
      name: 'Ketose',
      nameEN: 'Ketosis',
      color: '#f97316',
      icon: '🔥',
      description:
        'Når karbohydratinntaket er nær null, bytter kroppen til å brenne fett som drivstoff ' +
        'og produserer ketonlegemer (BHB). Dette gir stabil energi gjennom hele dagen, ' +
        'redusert sult og bedre mental klarhet.',
      descriptionEN:
        'When carb intake is near zero, the body switches to burning fat for fuel, ' +
        'producing ketone bodies (BHB). This provides stable energy throughout the day, ' +
        'reduced hunger and improved mental clarity.',
      keyFoods: ['biff', 'smør', 'bacon', 'egg', 'laks'],
      evidenceLevel: 'Sterk',
    },

    protein: {
      id: 'protein',
      name: 'Proteinmetthet',
      nameEN: 'Protein Satiety',
      color: '#ef4444',
      icon: '💪',
      description:
        'Proteinhypotesen: høyt proteininntak trigger CCK og andre metthetshormon. ' +
        'Kroppen har et «proteinmål» og slutter ikke å være sulten før det er nådd. ' +
        'Animalsk protein har høyest biotilgjengelighet (DIAAS-skår).',
      descriptionEN:
        'Protein leverage hypothesis: high protein intake triggers CCK and other satiety hormones. ' +
        'The body has a "protein target" and won\'t stop being hungry until it\'s met. ' +
        'Animal protein has highest bioavailability (DIAAS score).',
      keyFoods: ['biff', 'kyllinglår', 'egg', 'laks', 'reker'],
      evidenceLevel: 'Sterk',
    },

    mtor: {
      id: 'mtor',
      name: 'mTOR / Muskelbygging',
      nameEN: 'mTOR / Muscle Building',
      color: '#8b5cf6',
      icon: '🏋️',
      description:
        'mTOR (mechanistic target of rapamycin) aktiveres av leucinrikt animalsk protein. ' +
        'Driver muskelproteinsyntese og bevarer muskelmasse under vekttap. ' +
        'Rødt kjøtt og egg er de beste leucinkildene.',
      descriptionEN:
        'mTOR (mechanistic target of rapamycin) is activated by leucine-rich animal protein. ' +
        'Drives muscle protein synthesis and preserves lean mass during weight loss. ' +
        'Red meat and eggs are top leucine sources.',
      keyFoods: ['biff', 'egg', 'lammekotelett', 'indrefilet'],
      evidenceLevel: 'Sterk',
    },

    autophagy: {
      id: 'autophagy',
      name: 'Autofagi',
      nameEN: 'Autophagy',
      color: '#06b6d4',
      icon: '🔄',
      description:
        'Cellulær resirkulering — et forenklet kostholds uten plantebaserte antinutrienter ' +
        'reduserer fordøyelsesstress. Kombinert med naturlig periodisk faste (høy metthet ' +
        'fra kjøtt = færre måltider) fremmes autofagi.',
      descriptionEN:
        'Cellular recycling — a simplified diet without plant antinutrients reduces digestive stress. ' +
        'Combined with natural intermittent fasting (high satiety from meat = fewer meals), ' +
        'autophagy is promoted.',
      keyFoods: ['biff', 'beinbuljong', 'lever'],
      evidenceLevel: 'Moderat',
    },

    omega: {
      id: 'omega',
      name: 'Omega-3 / DHA',
      nameEN: 'Omega-3 / DHA',
      color: '#3b82f6',
      icon: '🧠',
      description:
        'DHA og EPA fra fet fisk og gressfôret kjøtt er direkte brukbare av kroppen, ' +
        'i motsetning til plantebasert ALA som har under 5 % konvertering. ' +
        'Kritisk for hjernehelse, betennelsesdemping og hormonbalanse.',
      descriptionEN:
        'DHA and EPA from fatty fish and grass-fed meat are directly usable by the body, ' +
        'unlike plant ALA which has less than 5% conversion rate. ' +
        'Critical for brain health, inflammation resolution and hormonal balance.',
      keyFoods: ['laks', 'makrell', 'sardiner', 'biff'],
      evidenceLevel: 'Sterk',
    },

    collagen: {
      id: 'collagen',
      name: 'Kollagen',
      nameEN: 'Collagen',
      color: '#d4a574',
      icon: '🦴',
      description:
        'Glycin og prolin fra beinbuljong, kjøtt med skinn og innmat støtter bindevev, ' +
        'reparasjon av tarmslimhinnen, leddhelse og hudens elastisitet. ' +
        'Balanserer metionin fra muskelkjøtt.',
      descriptionEN:
        'Glycine and proline from bone broth, skin-on meat and organ meats support connective tissue, ' +
        'gut lining repair, joint health and skin elasticity. ' +
        'Balances methionine from muscle meat.',
      keyFoods: ['beinbuljong', 'kyllinglår', 'svinekotelett', 'marg'],
      evidenceLevel: 'Moderat',
    },

    iron: {
      id: 'iron',
      name: 'Jernstatus',
      nameEN: 'Iron Status',
      color: '#dc2626',
      icon: '🩸',
      description:
        'Hemjern fra rødt kjøtt absorberes 5–10 ganger mer effektivt enn plantenes ikke-hemjern. ' +
        'Ingen fytater eller oksalater blokkerer opptaket. ' +
        'Støtter oksygentransport, energiproduksjon og skjoldbruskkjertelfunksjon.',
      descriptionEN:
        'Heme iron from red meat is absorbed 5–10x more efficiently than plant non-heme iron. ' +
        'No phytates or oxalates blocking absorption. ' +
        'Supports oxygen transport, energy production and thyroid function.',
      keyFoods: ['lever', 'biff', 'lammekotelett', 'kjøttdeig'],
      evidenceLevel: 'Sterk',
    },

    inflam: {
      id: 'inflam',
      name: 'Anti-inflammasjon',
      nameEN: 'Anti-inflammation',
      color: '#22c55e',
      icon: '🛡️',
      description:
        'Å eliminere plantebaserte antinutrienter (lektiner, oksalater, fytater, saponiner) ' +
        'kan redusere systemisk betennelse. Mange autoimmune tilstander viser ' +
        'bedring på et karnivort eliminasjonskostholds.',
      descriptionEN:
        'Eliminating plant antinutrients (lectins, oxalates, phytates, saponins) ' +
        'can reduce systemic inflammation. Many autoimmune conditions show ' +
        'improvement on a carnivore elimination diet.',
      keyFoods: ['biff', 'laks', 'smør', 'egg'],
      evidenceLevel: 'Moderat',
    },
  };

  // -------------------------------------------------------------------------
  // CARNIVORE_PATHWAY_ORDER — Rekkefølge for visning
  // -------------------------------------------------------------------------
  window.CARNIVORE_PATHWAY_ORDER = [
    'ketosis',
    'protein',
    'mtor',
    'autophagy',
    'omega',
    'collagen',
    'iron',
    'inflam',
  ];

  // -------------------------------------------------------------------------
  // CARNIVORE_FOOD_ARSENAL — Matvarene som aktiverer mekanismene
  // -------------------------------------------------------------------------
  window.CARNIVORE_FOOD_ARSENAL = [
    // --- Rødt kjøtt ---
    {
      id: 'entrecote',
      name: 'Biff (Entrecôte)',
      nameEN: 'Ribeye Steak',
      category: 'Rødt kjøtt',
      categoryEN: 'Red Meat',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 4, protein: 5, mtor: 5, autophagy: 3, omega: 2, collagen: 2, iron: 5, inflam: 4 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'kjottdeig',
      name: 'Kjøttdeig',
      nameEN: 'Ground Beef',
      category: 'Rødt kjøtt',
      categoryEN: 'Red Meat',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 4, protein: 4, mtor: 4, autophagy: 2, omega: 1, collagen: 2, iron: 4, inflam: 3 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'lammekotelett',
      name: 'Lammekotelett',
      nameEN: 'Lamb Chops',
      category: 'Rødt kjøtt',
      categoryEN: 'Red Meat',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 4, protein: 5, mtor: 5, autophagy: 3, omega: 2, collagen: 3, iron: 4, inflam: 4 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'svinekotelett',
      name: 'Svinekotelett',
      nameEN: 'Pork Chops',
      category: 'Rødt kjøtt',
      categoryEN: 'Red Meat',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 3, protein: 4, mtor: 4, autophagy: 2, omega: 1, collagen: 3, iron: 3, inflam: 3 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'lever',
      name: 'Lever (storfe)',
      nameEN: 'Beef Liver',
      category: 'Rødt kjøtt',
      categoryEN: 'Red Meat',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 2, protein: 5, mtor: 4, autophagy: 4, omega: 2, collagen: 3, iron: 5, inflam: 4 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'indrefilet',
      name: 'Indrefilet (storfe)',
      nameEN: 'Beef Tenderloin',
      category: 'Rødt kjøtt',
      categoryEN: 'Red Meat',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 3, protein: 5, mtor: 5, autophagy: 3, omega: 1, collagen: 1, iron: 4, inflam: 4 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'bacon',
      name: 'Bacon',
      nameEN: 'Bacon',
      category: 'Rødt kjøtt',
      categoryEN: 'Red Meat',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 5, protein: 3, mtor: 3, autophagy: 2, omega: 1, collagen: 2, iron: 2, inflam: 2 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Moderat',
    },

    // --- Fjærkre ---
    {
      id: 'kyllinglar',
      name: 'Kyllinglår (med skinn)',
      nameEN: 'Chicken Thighs (skin-on)',
      category: 'Fjærkre',
      categoryEN: 'Poultry',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 3, protein: 4, mtor: 4, autophagy: 2, omega: 1, collagen: 4, iron: 2, inflam: 3 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'kalkun',
      name: 'Kalkunfilet',
      nameEN: 'Turkey Breast',
      category: 'Fjærkre',
      categoryEN: 'Poultry',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 2, protein: 5, mtor: 4, autophagy: 2, omega: 1, collagen: 1, iron: 2, inflam: 3 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },

    // --- Fisk ---
    {
      id: 'laks',
      name: 'Laks',
      nameEN: 'Salmon',
      category: 'Fisk',
      categoryEN: 'Fish',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 4, protein: 4, mtor: 4, autophagy: 3, omega: 5, collagen: 2, iron: 2, inflam: 5 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'makrell',
      name: 'Makrell',
      nameEN: 'Mackerel',
      category: 'Fisk',
      categoryEN: 'Fish',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 4, protein: 4, mtor: 3, autophagy: 3, omega: 5, collagen: 2, iron: 2, inflam: 5 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'sardiner',
      name: 'Sardiner (boks)',
      nameEN: 'Sardines (canned)',
      category: 'Fisk',
      categoryEN: 'Fish',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 3, protein: 4, mtor: 3, autophagy: 3, omega: 5, collagen: 3, iron: 3, inflam: 5 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'torsk',
      name: 'Torsk',
      nameEN: 'Cod',
      category: 'Fisk',
      categoryEN: 'Fish',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 2, protein: 5, mtor: 3, autophagy: 2, omega: 2, collagen: 1, iron: 1, inflam: 3 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'reker',
      name: 'Reker',
      nameEN: 'Shrimp',
      category: 'Fisk',
      categoryEN: 'Fish',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 2, protein: 4, mtor: 3, autophagy: 2, omega: 3, collagen: 2, iron: 2, inflam: 3 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },

    // --- Egg & Meieri ---
    {
      id: 'egg',
      name: 'Egg',
      nameEN: 'Eggs',
      category: 'Egg & Meieri',
      categoryEN: 'Eggs & Dairy',
      section: 'Meieri',
      scores: { ketosis: 4, protein: 4, mtor: 4, autophagy: 3, omega: 2, collagen: 1, iron: 2, inflam: 4 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'smor',
      name: 'Smør',
      nameEN: 'Butter',
      category: 'Egg & Meieri',
      categoryEN: 'Eggs & Dairy',
      section: 'Meieri',
      scores: { ketosis: 5, protein: 0, mtor: 0, autophagy: 2, omega: 1, collagen: 0, iron: 0, inflam: 3 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Sterk',
    },
    {
      id: 'kremost',
      name: 'Kremost',
      nameEN: 'Cream Cheese',
      category: 'Egg & Meieri',
      categoryEN: 'Eggs & Dairy',
      section: 'Meieri',
      scores: { ketosis: 4, protein: 2, mtor: 1, autophagy: 1, omega: 1, collagen: 1, iron: 0, inflam: 2 },
      variant: ['animal-based'],
      evidenceLevel: 'Moderat',
    },
    {
      id: 'romme',
      name: 'Rømme',
      nameEN: 'Sour Cream',
      category: 'Egg & Meieri',
      categoryEN: 'Eggs & Dairy',
      section: 'Meieri',
      scores: { ketosis: 4, protein: 1, mtor: 1, autophagy: 1, omega: 1, collagen: 0, iron: 0, inflam: 2 },
      variant: ['animal-based'],
      evidenceLevel: 'Moderat',
    },
    {
      id: 'ost',
      name: 'Ost (Norvegia/Jarlsberg)',
      nameEN: 'Cheese (hard)',
      category: 'Egg & Meieri',
      categoryEN: 'Eggs & Dairy',
      section: 'Meieri',
      scores: { ketosis: 3, protein: 3, mtor: 2, autophagy: 1, omega: 1, collagen: 1, iron: 1, inflam: 2 },
      variant: ['animal-based'],
      evidenceLevel: 'Moderat',
    },

    // --- Innmat & Spesial ---
    {
      id: 'beinbuljong',
      name: 'Beinbuljong',
      nameEN: 'Bone Broth',
      category: 'Innmat & Spesial',
      categoryEN: 'Organ Meats & Specialty',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 2, protein: 2, mtor: 1, autophagy: 4, omega: 1, collagen: 5, iron: 1, inflam: 4 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Moderat',
    },
    {
      id: 'leverpostei',
      name: 'Leverpostei (hjemmelaget)',
      nameEN: 'Liver Pâté (homemade)',
      category: 'Innmat & Spesial',
      categoryEN: 'Organ Meats & Specialty',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 3, protein: 3, mtor: 3, autophagy: 3, omega: 1, collagen: 2, iron: 4, inflam: 3 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Moderat',
    },
    {
      id: 'marg',
      name: 'Benmarg',
      nameEN: 'Bone Marrow',
      category: 'Innmat & Spesial',
      categoryEN: 'Organ Meats & Specialty',
      section: 'Kjøtt & Fisk',
      scores: { ketosis: 5, protein: 1, mtor: 1, autophagy: 3, omega: 2, collagen: 4, iron: 1, inflam: 4 },
      variant: ['strict', 'animal-based'],
      evidenceLevel: 'Moderat',
    },

    // --- Animal-Based extras (kun for animal-based-variant) ---
    {
      id: 'honning',
      name: 'Honning',
      nameEN: 'Honey',
      category: 'Animal-Based tillegg',
      categoryEN: 'Animal-Based Extras',
      section: 'Tørrvarer',
      scores: { ketosis: 0, protein: 0, mtor: 0, autophagy: 1, omega: 0, collagen: 0, iron: 0, inflam: 1 },
      variant: ['animal-based'],
      evidenceLevel: 'Foreløpig',
    },
    {
      id: 'blabaer',
      name: 'Blåbær',
      nameEN: 'Blueberries',
      category: 'Animal-Based tillegg',
      categoryEN: 'Animal-Based Extras',
      section: 'Frukt & Grønt',
      scores: { ketosis: 0, protein: 0, mtor: 0, autophagy: 2, omega: 0, collagen: 0, iron: 0, inflam: 2 },
      variant: ['animal-based'],
      evidenceLevel: 'Foreløpig',
    },
    {
      id: 'avokado',
      name: 'Avokado',
      nameEN: 'Avocado',
      category: 'Animal-Based tillegg',
      categoryEN: 'Animal-Based Extras',
      section: 'Frukt & Grønt',
      scores: { ketosis: 3, protein: 1, mtor: 0, autophagy: 1, omega: 1, collagen: 0, iron: 0, inflam: 2 },
      variant: ['animal-based'],
      evidenceLevel: 'Moderat',
    },
  ];

  // -------------------------------------------------------------------------
  // CARNIVORE_REFERENCES — Forskning og bøker
  // -------------------------------------------------------------------------
  window.CARNIVORE_REFERENCES = [
    { author: 'Shawn Baker', title: 'The Carnivore Diet', year: 2019, type: 'book' },
    { author: 'Paul Saladino', title: 'The Carnivore Code', year: 2020, type: 'book' },
    { author: 'Amber O\'Hearn', title: 'Carnivore research compilation', year: 2023, type: 'research' },
    { author: 'Georgia Ede', title: 'Change Your Diet, Change Your Mind', year: 2024, type: 'book' },
    { author: 'Vilhjalmur Stefansson', title: 'The Fat of the Land', year: 1956, type: 'book' },
    { author: 'Belinda & Gary Fettke', title: 'Nutrition Network — carnivore clinical outcomes', year: 2022, type: 'research' },
    { author: 'Kevin Stock', title: 'The Carnivore Diet Handbook', year: 2020, type: 'book' },
    { author: 'Lennerz et al.', title: 'Behavioral characteristics and self-reported health status among 2029 adults consuming a carnivore diet', year: 2021, type: 'study' },
    { author: 'O\'Hearn, A.', title: 'Can a carnivore diet provide all essential nutrients?', year: 2020, type: 'study' },
    { author: 'Norwitz et al.', title: 'Ketogenic diet as metabolic therapy', year: 2022, type: 'study' },
  ];
})();
