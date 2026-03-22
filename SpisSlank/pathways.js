// ============================================================================
// SpisSlank — Pathway-definisjonsfil
// Kartlegger hvordan vekttap-medisiner virker gjennom hormonelle signalveier,
// og hvordan mat kan aktivere de samme mekanismene naturlig.
// ============================================================================

// ---------------------------------------------------------------------------
// PATHWAYS — De 8 hormonelle signalveiene
// ---------------------------------------------------------------------------
window.PATHWAYS = {
  glp1: {
    id: 'glp1',
    name: 'GLP-1',
    color: '#22c55e',
    icon: '🟢',
    description:
      'GLP-1 demper appetitt, bremser magetømming og øker metthetsfølelsen. ' +
      'Dette er den mest studerte signalveien for vekttap.',
    descriptionEN:
      'GLP-1 suppresses appetite, slows gastric emptying and increases satiety. ' +
      'This is the most studied pathway for weight loss.',
    drugReference: 'Ozempic, Wegovy, Saxenda',
    drugReferenceEN: 'Ozempic, Wegovy, Saxenda',
    foodStrategy:
      'Spis fiber- og proteinrik mat som stimulerer L-cellene i tarmen til å frigjøre GLP-1 naturlig.',
    foodStrategyEN:
      'Eat fiber- and protein-rich foods that stimulate L-cells in the gut to release GLP-1 naturally.',
    keyFoods: ['havregryn', 'linser', 'kikerter', 'egg', 'Skyr', 'laks', 'olivenolje'],
    evidenceLevel: 'Sterk',
  },

  gip: {
    id: 'gip',
    name: 'GIP',
    color: '#eab308',
    icon: '🟡',
    description:
      'GIP optimaliserer insulinresponsen og forbedrer glukosekontroll. ' +
      'Samspillet med GLP-1 gir kraftigere vekttap enn GLP-1 alene.',
    descriptionEN:
      'GIP optimizes insulin response and improves glucose control. ' +
      'The interplay with GLP-1 produces stronger weight loss than GLP-1 alone.',
    drugReference: 'Mounjaro / Zepbound (tirzepatid)',
    drugReferenceEN: 'Mounjaro / Zepbound (tirzepatide)',
    foodStrategy:
      'Velg sunne fettkilder og proteinrik mat som stimulerer K-cellene i tynntarmen.',
    foodStrategyEN:
      'Choose healthy fat sources and protein-rich foods that stimulate K-cells in the small intestine.',
    keyFoods: ['egg', 'nøtter', 'avokado', 'fet fisk', 'olivenolje', 'ost'],
    evidenceLevel: 'Moderat',
  },

  glucagon: {
    id: 'glucagon',
    name: 'Glukagon',
    color: '#ef4444',
    icon: '🔴',
    description:
      'Glukagon øker fettforbrenning, termogenese og energiforbruk. ' +
      'Aktivering hjelper kroppen å bruke fettlagre som drivstoff.',
    descriptionEN:
      'Glucagon increases fat burning, thermogenesis and energy expenditure. ' +
      'Activation helps the body use fat stores as fuel.',
    drugReference: 'Retatrutid, Survodutid',
    drugReferenceEN: 'Retatrutide, Survodutide',
    foodStrategy:
      'Kombiner proteinrike måltider med termogene krydder og drikker som øker stoffskiftet.',
    foodStrategyEN:
      'Combine protein-rich meals with thermogenic spices and beverages that boost metabolism.',
    keyFoods: ['kylling', 'laks', 'egg', 'chili', 'ingefær', 'grønn te', 'kaffe'],
    evidenceLevel: 'Moderat',
  },

  amylin: {
    id: 'amylin',
    name: 'Amylin',
    color: '#a855f7',
    icon: '🟣',
    description:
      'Amylin utskilles sammen med insulin og forsterker metthetssignaler. ' +
      'Den bremser magetømming og reduserer matinntaket per måltid.',
    descriptionEN:
      'Amylin is co-secreted with insulin and amplifies satiety signals. ' +
      'It slows gastric emptying and reduces food intake per meal.',
    drugReference: 'CagriSema (cagrilintid)',
    drugReferenceEN: 'CagriSema (cagrilintide)',
    foodStrategy:
      'Prioriter langsomfordøyelig protein som gir jevn insulinfrigjøring og dermed amylin.',
    foodStrategyEN:
      'Prioritize slow-digesting protein that provides steady insulin release and thus amylin.',
    keyFoods: ['egg', 'cottage cheese', 'kyllingbryst', 'fisk'],
    evidenceLevel: 'Moderat',
  },

  pyy: {
    id: 'pyy',
    name: 'PYY',
    color: '#3b82f6',
    icon: '🔵',
    description:
      'PYY er «jeg er mett»-signalet fra tarmen til hjernen. ' +
      'Høye PYY-nivåer reduserer sulten i flere timer etter et måltid.',
    descriptionEN:
      'PYY is the "I am full" signal from the gut to the brain. ' +
      'High PYY levels reduce hunger for several hours after a meal.',
    drugReference: 'Indirekte via alle GLP-1-baserte medisiner',
    drugReferenceEN: 'Indirectly via all GLP-1-based medications',
    foodStrategy:
      'Spis proteinrike måltider med belgfrukter — de er spesielt effektive for PYY-frigjøring.',
    foodStrategyEN:
      'Eat protein-rich meals with legumes — they are especially effective for PYY release.',
    keyFoods: ['Skyr', 'egg', 'kylling', 'bønner', 'linser'],
    evidenceLevel: 'Sterk',
  },

  leptin: {
    id: 'leptin',
    name: 'Leptin',
    color: '#f97316',
    icon: '🟠',
    description:
      'Leptin regulerer langtidsappetitt og energibalanse fra fettvevet. ' +
      'Leptinresistens er vanlig ved overvekt og saboterer vekttap.',
    descriptionEN:
      'Leptin regulates long-term appetite and energy balance from adipose tissue. ' +
      'Leptin resistance is common in obesity and sabotages weight loss.',
    drugReference: 'Ingen godkjente medisiner (livsstilsbasert)',
    drugReferenceEN: 'No approved medications (lifestyle-based)',
    foodStrategy:
      'Hold regelmessige måltider, sov nok og unngå store kalorioverskudd for å bedre leptinfølsomheten.',
    foodStrategyEN:
      'Maintain regular meals, get enough sleep and avoid large calorie surpluses to improve leptin sensitivity.',
    keyFoods: ['regelmessige måltider', 'konsistente porsjoner', 'tilstrekkelig søvn'],
    evidenceLevel: 'Moderat',
  },

  ghrelin: {
    id: 'ghrelin',
    name: 'Ghrelin↓',
    color: '#6b7280',
    icon: '⚫',
    description:
      'Ghrelin er sulthormonet — det stiger før måltider og trigger appetitt. ' +
      'Å undertrykke ghrelin-topper reduserer sug og impulsiv spising.',
    descriptionEN:
      'Ghrelin is the hunger hormone — it rises before meals and triggers appetite. ' +
      'Suppressing ghrelin spikes reduces cravings and impulsive eating.',
    drugReference: 'Ingen godkjente medisiner ennå',
    drugReferenceEN: 'No approved medications yet',
    foodStrategy:
      'Spis proteinrik frokost tidlig på dagen og prioriter god søvnkvalitet for å holde ghrelin nede.',
    foodStrategyEN:
      'Eat a protein-rich breakfast early in the day and prioritize good sleep quality to keep ghrelin down.',
    keyFoods: ['proteinrik frokost', 'god søvn'],
    evidenceLevel: 'Foreløpig',
  },

  insulin: {
    id: 'insulin',
    name: 'Insulinstabilitet',
    color: '#06b6d4',
    icon: '🩵',
    description:
      'Stabilt blodsukker forhindrer energidipp og sukkersug. ' +
      'Jevn insulinrespons er grunnlaget for å unngå overspising.',
    descriptionEN:
      'Stable blood sugar prevents energy dips and sugar cravings. ' +
      'Steady insulin response is the foundation for avoiding overeating.',
    drugReference: 'Alle GLP-1-medisiner bidrar indirekte til bedre insulinstabilitet',
    drugReferenceEN: 'All GLP-1 medications contribute indirectly to better insulin stability',
    foodStrategy:
      'Velg mat med lav glykemisk indeks og kombiner karbohydrater med fiber, protein og fett.',
    foodStrategyEN:
      'Choose foods with a low glycemic index and combine carbohydrates with fiber, protein and fat.',
    keyFoods: ['søtpoteter', 'fullkorn', 'grønnsaker', 'bønner'],
    evidenceLevel: 'Sterk',
  },
};

// ---------------------------------------------------------------------------
// DRUGS — Medisiner for vekttap, sortert etter generasjon
// ---------------------------------------------------------------------------
window.DRUGS = [
  // --- Generasjon 1: Enkeltreseptor (GLP-1 alene) ---
  {
    id: 'liraglutide',
    name: 'Liraglutid',
    brand: 'Saxenda',
    generation: 1,
    mechanism: 'GLP-1-reseptoragonist (daglig injeksjon)',
    mechanismEN: 'GLP-1 receptor agonist (daily injection)',
    pathways: ['glp1'],
    weightLoss: '~5–10 %',
    status: 'Godkjent',
    description:
      'Førstegenerasjons GLP-1-medisin som krever daglig injeksjon. ' +
      'Gir moderat vekttap og var den første i klassen til å bli godkjent for overvekt. ' +
      'Nå i stor grad erstattet av semaglutid på grunn av bedre effekt og ukentlig dosering.',
    descriptionEN:
      'First-generation GLP-1 medication requiring daily injection. ' +
      'Provides moderate weight loss and was the first in its class approved for obesity. ' +
      'Now largely replaced by semaglutide due to better efficacy and weekly dosing.',
  },
  {
    id: 'semaglutide',
    name: 'Semaglutid',
    brand: 'Ozempic / Wegovy',
    generation: 1,
    mechanism: 'GLP-1-reseptoragonist (ukentlig injeksjon)',
    mechanismEN: 'GLP-1 receptor agonist (weekly injection)',
    pathways: ['glp1'],
    weightLoss: '~15 %',
    status: 'Godkjent',
    description:
      'Markedsleder for vekttap med sterk klinisk dokumentasjon (STEP-studiene). ' +
      'Ozempic er godkjent for diabetes, Wegovy for overvekt — samme virkestoff. ' +
      'Gir betydelig appetittdemping og bedret blodsukkerkontroll.',
    descriptionEN:
      'Market leader for weight loss with strong clinical evidence (STEP trials). ' +
      'Ozempic is approved for diabetes, Wegovy for obesity — same active ingredient. ' +
      'Provides significant appetite suppression and improved blood sugar control.',
  },
  {
    id: 'orforglipron',
    name: 'Orforglipron',
    brand: 'Eli Lilly (tablettform)',
    generation: 1,
    mechanism: 'Oral GLP-1-reseptoragonist (daglig tablett)',
    mechanismEN: 'Oral GLP-1 receptor agonist (daily tablet)',
    pathways: ['glp1'],
    weightLoss: '~12–15 %',
    status: 'Fase 3',
    description:
      'Første potensielle GLP-1-medisin i tablettform fra Eli Lilly. ' +
      'Kan revolusjonere tilgangen fordi den ikke krever injeksjon. ' +
      'Fase 3-studier pågår med lovende resultater for både vekttap og blodsukker.',
    descriptionEN:
      'First potential GLP-1 medication in tablet form from Eli Lilly. ' +
      'Could revolutionize access because it does not require injection. ' +
      'Phase 3 trials are underway with promising results for both weight loss and blood sugar.',
  },

  // --- Generasjon 2: Dobbeltreseptor ---
  {
    id: 'tirzepatide',
    name: 'Tirzepatid',
    brand: 'Mounjaro / Zepbound',
    generation: 2,
    mechanism: 'Dobbel GLP-1/GIP-reseptoragonist (ukentlig injeksjon)',
    mechanismEN: 'Dual GLP-1/GIP receptor agonist (weekly injection)',
    pathways: ['glp1', 'gip'],
    weightLoss: '~15–22 %',
    status: 'Godkjent',
    description:
      'Førsteklasses dobbeltagonist som aktiverer både GLP-1 og GIP samtidig. ' +
      'Viste opptil 22 % vekttap i SURMOUNT-studiene — betydelig mer enn semaglutid. ' +
      'Mounjaro er godkjent for diabetes, Zepbound for overvekt.',
    descriptionEN:
      'Best-in-class dual agonist that activates both GLP-1 and GIP simultaneously. ' +
      'Showed up to 22% weight loss in the SURMOUNT trials — significantly more than semaglutide. ' +
      'Mounjaro is approved for diabetes, Zepbound for obesity.',
  },
  {
    id: 'survodutide',
    name: 'Survodutid',
    brand: 'Boehringer Ingelheim',
    generation: 2,
    mechanism: 'Dobbel GLP-1/Glukagon-reseptoragonist (ukentlig injeksjon)',
    mechanismEN: 'Dual GLP-1/Glucagon receptor agonist (weekly injection)',
    pathways: ['glp1', 'glucagon'],
    weightLoss: '~19 %',
    status: 'Fase 3',
    description:
      'Kombinerer GLP-1-effekten med glukagonreseptor-aktivering for økt fettforbrenning. ' +
      'Glukagon-komponenten gir termogene fordeler som de fleste andre medisiner mangler. ' +
      'Fase 3-studier viser lovende resultater for vekttap og fettlever.',
    descriptionEN:
      'Combines the GLP-1 effect with glucagon receptor activation for increased fat burning. ' +
      'The glucagon component provides thermogenic benefits that most other medications lack. ' +
      'Phase 3 trials show promising results for weight loss and fatty liver.',
  },
  {
    id: 'cagrisema',
    name: 'CagriSema',
    brand: 'Novo Nordisk',
    generation: 2,
    mechanism: 'GLP-1 (semaglutid) + Amylinanalog (cagrilintid)',
    mechanismEN: 'GLP-1 (semaglutide) + Amylin analog (cagrilintide)',
    pathways: ['glp1', 'amylin'],
    weightLoss: 'Under utprøving',
    status: 'Fase 3',
    description:
      'Kombinerer den velprøvde semaglutid-effekten med cagrilintid, en amylinanalog. ' +
      'Amylin forsterker metthetssignalene og bremser magetømmingen ytterligere. ' +
      'Novo Nordisk sin kandidat for å overgå Mounjaro i vekttap-effekt.',
    descriptionEN:
      'Combines the proven semaglutide effect with cagrilintide, an amylin analog. ' +
      'Amylin amplifies satiety signals and further slows gastric emptying. ' +
      "Novo Nordisk's candidate to surpass Mounjaro in weight loss efficacy.",
  },

  // --- Generasjon 3: Trippelreseptor ---
  {
    id: 'retatrutide',
    name: 'Retatrutid',
    brand: 'Eli Lilly',
    generation: 3,
    mechanism: 'Trippel GLP-1/GIP/Glukagon-reseptoragonist (ukentlig injeksjon)',
    mechanismEN: 'Triple GLP-1/GIP/Glucagon receptor agonist (weekly injection)',
    pathways: ['glp1', 'gip', 'glucagon'],
    weightLoss: '~24–29 %',
    status: 'Fase 3',
    description:
      'Den mest potente kandidaten — aktiverer tre signalveier samtidig. ' +
      'Fase 2-data viste opptil 29 % vekttap på 48 uker, det høyeste noensinne i en klinisk studie. ' +
      'Kan endre hele behandlingslandskapet hvis Fase 3-resultatene holder seg.',
    descriptionEN:
      'The most potent candidate — activates three pathways simultaneously. ' +
      'Phase 2 data showed up to 29% weight loss at 48 weeks, the highest ever in a clinical trial. ' +
      'Could transform the entire treatment landscape if Phase 3 results hold up.',
  },
];

// ---------------------------------------------------------------------------
// FOOD_ARSENAL — Matvarene som aktiverer signalveiene
// ---------------------------------------------------------------------------
window.FOOD_ARSENAL = [
  // --- Protein ---
  {
    id: 'egg',
    nameNO: 'Egg',
    nameEN: 'Eggs',
    pathwayScores: { glp1: 4, gip: 4, glucagon: 3, amylin: 5, pyy: 4, leptin: 2, ghrelin: 4, insulin: 3 },
    category: 'Protein',
    storeSection: 'Meieri',
    evidenceLevel: 'Sterk',
  },
  {
    id: 'laks',
    nameNO: 'Laks',
    nameEN: 'Salmon',
    pathwayScores: { glp1: 4, gip: 4, glucagon: 4, amylin: 3, pyy: 3, leptin: 3, ghrelin: 3, insulin: 3 },
    category: 'Protein',
    storeSection: 'Kjøtt & Fisk',
    evidenceLevel: 'Sterk',
  },
  {
    id: 'kyllingbryst',
    nameNO: 'Kyllingbryst',
    nameEN: 'Chicken breast',
    pathwayScores: { glp1: 3, gip: 2, glucagon: 4, amylin: 4, pyy: 4, leptin: 2, ghrelin: 4, insulin: 2 },
    category: 'Protein',
    storeSection: 'Kjøtt & Fisk',
    evidenceLevel: 'Sterk',
  },
  {
    id: 'cottage-cheese',
    nameNO: 'Cottage cheese',
    nameEN: 'Cottage cheese',
    pathwayScores: { glp1: 3, gip: 3, glucagon: 2, amylin: 4, pyy: 3, leptin: 2, ghrelin: 3, insulin: 3 },
    category: 'Protein',
    storeSection: 'Meieri',
    evidenceLevel: 'Moderat',
  },
  {
    id: 'skyr',
    nameNO: 'Skyr',
    nameEN: 'Skyr',
    pathwayScores: { glp1: 4, gip: 2, glucagon: 2, amylin: 3, pyy: 4, leptin: 2, ghrelin: 3, insulin: 3 },
    category: 'Protein',
    storeSection: 'Meieri',
    evidenceLevel: 'Sterk',
  },
  {
    id: 'feta',
    nameNO: 'Feta',
    nameEN: 'Feta cheese',
    pathwayScores: { glp1: 2, gip: 3, glucagon: 1, amylin: 2, pyy: 2, leptin: 1, ghrelin: 2, insulin: 2 },
    category: 'Protein',
    storeSection: 'Meieri',
    evidenceLevel: 'Foreløpig',
  },

  // --- Fiber ---
  {
    id: 'havregryn',
    nameNO: 'Havregryn',
    nameEN: 'Oats',
    pathwayScores: { glp1: 5, gip: 2, glucagon: 1, amylin: 2, pyy: 3, leptin: 3, ghrelin: 3, insulin: 4 },
    category: 'Fiber',
    storeSection: 'Tørrvarer',
    evidenceLevel: 'Sterk',
  },
  {
    id: 'linser',
    nameNO: 'Linser',
    nameEN: 'Lentils',
    pathwayScores: { glp1: 5, gip: 2, glucagon: 2, amylin: 2, pyy: 4, leptin: 3, ghrelin: 3, insulin: 4 },
    category: 'Fiber',
    storeSection: 'Tørrvarer',
    evidenceLevel: 'Sterk',
  },
  {
    id: 'kikerter',
    nameNO: 'Kikerter',
    nameEN: 'Chickpeas',
    pathwayScores: { glp1: 5, gip: 2, glucagon: 2, amylin: 2, pyy: 3, leptin: 3, ghrelin: 3, insulin: 4 },
    category: 'Fiber',
    storeSection: 'Tørrvarer',
    evidenceLevel: 'Sterk',
  },
  {
    id: 'bonner',
    nameNO: 'Bønner',
    nameEN: 'Beans',
    pathwayScores: { glp1: 4, gip: 2, glucagon: 2, amylin: 2, pyy: 4, leptin: 3, ghrelin: 3, insulin: 5 },
    category: 'Fiber',
    storeSection: 'Tørrvarer',
    evidenceLevel: 'Sterk',
  },
  {
    id: 'sotpotet',
    nameNO: 'Søtpotet',
    nameEN: 'Sweet potato',
    pathwayScores: { glp1: 3, gip: 2, glucagon: 1, amylin: 1, pyy: 2, leptin: 3, ghrelin: 2, insulin: 5 },
    category: 'Fiber',
    storeSection: 'Frukt & Grønt',
    evidenceLevel: 'Moderat',
  },
  {
    id: 'fullkornsbrød',
    nameNO: 'Fullkornsbrød',
    nameEN: 'Whole grain bread',
    pathwayScores: { glp1: 3, gip: 2, glucagon: 1, amylin: 1, pyy: 2, leptin: 3, ghrelin: 2, insulin: 4 },
    category: 'Fiber',
    storeSection: 'Tørrvarer',
    evidenceLevel: 'Moderat',
  },
  {
    id: 'blabaer',
    nameNO: 'Blåbær',
    nameEN: 'Blueberries',
    pathwayScores: { glp1: 3, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 3, ghrelin: 2, insulin: 4 },
    category: 'Fiber',
    storeSection: 'Frukt & Grønt',
    evidenceLevel: 'Moderat',
  },

  // --- Fett ---
  {
    id: 'olivenolje',
    nameNO: 'Olivenolje',
    nameEN: 'Olive oil',
    pathwayScores: { glp1: 4, gip: 4, glucagon: 1, amylin: 1, pyy: 2, leptin: 3, ghrelin: 2, insulin: 3 },
    category: 'Fett',
    storeSection: 'Tørrvarer',
    evidenceLevel: 'Sterk',
  },
  {
    id: 'avokado',
    nameNO: 'Avokado',
    nameEN: 'Avocado',
    pathwayScores: { glp1: 3, gip: 4, glucagon: 1, amylin: 1, pyy: 2, leptin: 3, ghrelin: 2, insulin: 3 },
    category: 'Fett',
    storeSection: 'Frukt & Grønt',
    evidenceLevel: 'Moderat',
  },
  {
    id: 'notter',
    nameNO: 'Nøtter (blanding)',
    nameEN: 'Mixed nuts',
    pathwayScores: { glp1: 3, gip: 4, glucagon: 2, amylin: 2, pyy: 3, leptin: 3, ghrelin: 3, insulin: 3 },
    category: 'Fett',
    storeSection: 'Tørrvarer',
    evidenceLevel: 'Sterk',
  },
  {
    id: 'oliven',
    nameNO: 'Oliven',
    nameEN: 'Olives',
    pathwayScores: { glp1: 2, gip: 3, glucagon: 1, amylin: 1, pyy: 1, leptin: 2, ghrelin: 1, insulin: 2 },
    category: 'Fett',
    storeSection: 'Tørrvarer',
    evidenceLevel: 'Foreløpig',
  },

  // --- Fermentert ---
  {
    id: 'surkaal-kimchi',
    nameNO: 'Surkål / Kimchi',
    nameEN: 'Sauerkraut / Kimchi',
    pathwayScores: { glp1: 3, gip: 1, glucagon: 1, amylin: 1, pyy: 2, leptin: 3, ghrelin: 2, insulin: 3 },
    category: 'Fermentert',
    storeSection: 'Frukt & Grønt',
    evidenceLevel: 'Foreløpig',
  },

  // --- Krydder ---
  {
    id: 'chili',
    nameNO: 'Chili / Cayenne',
    nameEN: 'Chili / Cayenne pepper',
    pathwayScores: { glp1: 2, gip: 1, glucagon: 4, amylin: 0, pyy: 1, leptin: 2, ghrelin: 2, insulin: 2 },
    category: 'Krydder',
    storeSection: 'Tørrvarer',
    evidenceLevel: 'Moderat',
  },
  {
    id: 'ingefaer',
    nameNO: 'Ingefær',
    nameEN: 'Ginger',
    pathwayScores: { glp1: 2, gip: 1, glucagon: 3, amylin: 0, pyy: 1, leptin: 2, ghrelin: 2, insulin: 2 },
    category: 'Krydder',
    storeSection: 'Frukt & Grønt',
    evidenceLevel: 'Moderat',
  },
  {
    id: 'kanel',
    nameNO: 'Kanel',
    nameEN: 'Cinnamon',
    pathwayScores: { glp1: 2, gip: 1, glucagon: 1, amylin: 0, pyy: 1, leptin: 2, ghrelin: 1, insulin: 4 },
    category: 'Krydder',
    storeSection: 'Tørrvarer',
    evidenceLevel: 'Moderat',
  },
  {
    id: 'gurkemeie',
    nameNO: 'Gurkemeie',
    nameEN: 'Turmeric',
    pathwayScores: { glp1: 2, gip: 1, glucagon: 2, amylin: 0, pyy: 1, leptin: 3, ghrelin: 1, insulin: 3 },
    category: 'Krydder',
    storeSection: 'Tørrvarer',
    evidenceLevel: 'Foreløpig',
  },

  // --- Drikke ---
  {
    id: 'gronn-te',
    nameNO: 'Grønn te',
    nameEN: 'Green tea',
    pathwayScores: { glp1: 2, gip: 1, glucagon: 3, amylin: 0, pyy: 1, leptin: 3, ghrelin: 2, insulin: 3 },
    category: 'Drikke',
    storeSection: 'Drikke',
    evidenceLevel: 'Moderat',
  },
  {
    id: 'kaffe',
    nameNO: 'Kaffe',
    nameEN: 'Coffee',
    pathwayScores: { glp1: 2, gip: 1, glucagon: 3, amylin: 0, pyy: 1, leptin: 2, ghrelin: 3, insulin: 2 },
    category: 'Drikke',
    storeSection: 'Drikke',
    evidenceLevel: 'Moderat',
  },
];
