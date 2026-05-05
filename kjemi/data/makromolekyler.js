// Kjemi 2 – Makromolekyler og grønn kjemi
// Kompetansemål #13, #14

const MAKROMOLEKYLER = {
  id: "makromolekyler",
  title: "Makromolekyler og grønn kjemi",
  description: "Proteiner, DNA, karbohydrater, plast, metaller og bærekraft",

  flashcards: [
    {
      front: "Hva er et protein bygd opp av?",
      back: "Aminosyrer koblet sammen med peptidbindinger (−CO−NH−). 20 ulike aminosyrer finnes i naturen."
    },
    {
      front: "Hva er primærstrukturen til et protein?",
      back: "Rekkefølgen (sekvensen) av aminosyrer i polypeptidkjeden."
    },
    {
      front: "Hva er sekundærstruktur?",
      back: "Lokal folding av proteinkjeden: α-heliks (spiral) eller β-flak (brettet). Stabilisert av hydrogenbindinger mellom CO og NH."
    },
    {
      front: "Hva er tertiærstruktur?",
      back: "Den tredimensjonale formen til hele polypeptidkjeden. Stabilisert av hydrogenbindinger, disulfidbroer, ioniske og hydrofobe interaksjoner."
    },
    {
      front: "Hva er denaturering?",
      back: "Tap av proteinets tredimensjonale struktur (men ikke primærstruktur) pga. varme, pH-endring, løsemidler. Funksjonen ødelegges."
    },
    {
      front: "Hva er DNA bygd opp av?",
      back: "Nukleotider: deoksyribose (sukker) + fosfatgruppe + nitrogenbase (A, T, G, C). Dobbeltheliks med basepar: A−T og G−C."
    },
    {
      front: "Hvilke bindinger holder DNA-dobbeltheliks sammen?",
      back: "Hydrogenbindinger mellom baseparene: A=T (2 H-bindinger) og G≡C (3 H-bindinger)."
    },
    {
      front: "Hva er karbohydrater bygd opp av?",
      back: "Monosakkarider (enkle sukkerarter som glukose). Kobles sammen med glykosidbindinger via kondensasjon til di- og polysakkarider."
    },
    {
      front: "Hva er forskjellen på stivelse og cellulose?",
      back: "Begge er polyglukose, men har ulik glykosidbinding (α vs. β). Mennesker kan spalte stivelse (mat) men ikke cellulose (fiber)."
    },
    {
      front: "Hva er grønn kjemi?",
      back: "12 prinsipper for bærekraftig kjemi: reduser avfall, bruk fornybare råstoffer, designet for nedbryting, minimer energibruk, unngå giftige stoffer."
    },
    {
      front: "Hva er forskjellen på termoplast og herdeplast?",
      back: "Termoplast: kan smeltes og formes om (lineære/forgrenede kjeder). Herdeplast: kan ikke smeltes om (tverrbundne kjeder)."
    },
    {
      front: "Hva er bioplast?",
      back: "Plast laget av fornybare råstoffer (f.eks. maisstivelse → PLA) og/eller som er bionedbrytbar."
    },
    {
      front: "Hva er gjenvinning av metaller?",
      back: "Resirkulering av brukte metaller (smelting og ny forming). Sparer energi og råstoffer sammenlignet med utvinning fra malm."
    },
    {
      front: "Hva er korrosjon av metaller og hvordan forhindres det?",
      back: "Uønsket oksidasjon. Forhindres med: overflatebehandling (maling, galvanisering), legeringer (rustfritt stål), offeranoder, katodisk beskyttelse."
    }
  ],

  multipleChoice: [
    {
      question: "Hvilken binding kobler aminosyrer sammen i proteiner?",
      options: ["Glykosidbinding", "Peptidbinding", "Esterbinding", "Fosfodiesterbinding"],
      correct: 1,
      explanation: "Aminosyrer kobles med peptidbindinger (−CO−NH−) dannet ved kondensasjon mellom −COOH og −NH₂."
    },
    {
      question: "Hva stabiliserer sekundærstrukturen (α-heliks) i et protein?",
      options: [
        "Disulfidbroer",
        "Hydrogenbindinger mellom CO og NH i hovedkjeden",
        "Ioniske bindinger",
        "Kovalente bindinger mellom sidekjeder"
      ],
      correct: 1,
      explanation: "α-heliks holdes sammen av hydrogenbindinger mellom C=O og N−H-grupper i peptidkjeden (hver 4. aminosyre)."
    },
    {
      question: "Hva skjer ved denaturering av et protein?",
      options: [
        "Primærstrukturen endres",
        "Peptidbindingene brytes",
        "3D-strukturen ødelegges, sekvensen bevares",
        "Aminosyrene omdannes til andre stoffer"
      ],
      correct: 2,
      explanation: "Denaturering ødelegger tertiær-/sekundærstruktur (folding), men primærstrukturen (rekkefølge) bevares."
    },
    {
      question: "I DNA: Adenin (A) parer alltid med:",
      options: ["Cytosin (C)", "Guanin (G)", "Tymin (T)", "Uracil (U)"],
      correct: 2,
      explanation: "Chargaffs regel: A parer med T (2 H-bindinger) og G parer med C (3 H-bindinger) i DNA."
    },
    {
      question: "Hva er PET (polyetylentereftalat)?",
      options: [
        "En termoplast brukt i flasker og tekstiler",
        "En herdeplast brukt i elektronikk",
        "En naturlig polymer fra trær",
        "Et metallegeringsmateriale"
      ],
      correct: 0,
      explanation: "PET er en kondensasjonspolymer/termoplast brukt i brusflasker, emballasje og polyesterfiber."
    },
    {
      question: "Hvilket av disse er et prinsipp i grønn kjemi?",
      options: [
        "Bruk mest mulig løsemidler",
        "Maksimer avfall for å øke produksjon",
        "Design produkter for nedbryting etter bruk",
        "Prioriter fossile råstoffer"
      ],
      correct: 2,
      explanation: "Grønn kjemi-prinsipp: Design for nedbryting – produkter skal brytes ned til ufarlige stoffer etter bruk."
    },
    {
      question: "Hva er forskjellen mellom stivelse og cellulose?",
      options: [
        "Stivelse er et protein, cellulose er et karbohydrat",
        "De har ulike monomerer",
        "De har ulik type glykosidbinding (α vs. β)",
        "Stivelse er syntetisk, cellulose er naturlig"
      ],
      correct: 2,
      explanation: "Begge er polyglukoser, men stivelse har α-glykosidbinding (fordøyelig) og cellulose har β-binding (ikke fordøyelig for mennesker)."
    },
    {
      question: "Gjenvinning av aluminium sparer ca. hvor mye energi sammenlignet med ny utvinning?",
      options: ["10 %", "50 %", "75 %", "95 %"],
      correct: 3,
      explanation: "Gjenvinning av aluminium sparer ca. 95 % av energien det koster å utvinne nytt Al fra bauxitt."
    },
    {
      question: "Hva er en termoherding (herdeplast)?",
      options: [
        "Plast som kan smeltes om",
        "Plast med tverrbindinger som ikke kan formes om etter herding",
        "Plast som er biologisk nedbrytbar",
        "Plast laget av naturlige polymerer"
      ],
      correct: 1,
      explanation: "Herdeplast har kovalente tverrbindinger mellom kjedene. Når den er herdet, kan den ikke smeltes om."
    },
    {
      question: "Hvilken ytre faktor kan denaturere et protein?",
      options: [
        "Bare høy temperatur",
        "Bare endring i pH",
        "Høy temperatur, pH-endring, tungmetaller, og organiske løsemidler",
        "Kun UV-stråling"
      ],
      correct: 2,
      explanation: "Denaturering kan skyldes varme, pH-endring, tungmetallioner, organiske løsemidler – alle bryter de svake bindingene som stabiliserer 3D-strukturen."
    },
    {
      question: "Hvilket makromolekyl lagrer genetisk informasjon?",
      options: ["Proteiner", "Karbohydrater", "DNA", "Lipider"],
      correct: 2,
      explanation: "DNA (deoksyribonukleinsyre) inneholder den genetiske koden som bestemmer proteinene som lages."
    },
    {
      question: "Hva menes med mikroplast?",
      options: [
        "Plast som er biologisk nedbrytbar",
        "Plastpartikler mindre enn 5 mm",
        "Plast laget i små mengder",
        "Plast brukt i medisinsk utstyr"
      ],
      correct: 1,
      explanation: "Mikroplast er plastfragmenter < 5 mm som er et miljøproblem i havet og naturen."
    }
  ],

  trueFalse: [
    {
      statement: "Proteiner er bygd opp av nukleotider.",
      correct: false,
      explanation: "Proteiner er bygd av aminosyrer. Det er DNA og RNA som er bygd opp av nukleotider."
    },
    {
      statement: "G−C baseparet i DNA har 3 hydrogenbindinger, A−T har 2.",
      correct: true,
      explanation: "G≡C har 3 H-bindinger (sterkere) og A=T har 2 H-bindinger. Derfor kreves mer energi for å separere GC-rike regioner."
    },
    {
      statement: "Termoplast kan smeltes og gjenvinnes, herdeplast kan det ikke.",
      correct: true,
      explanation: "Termoplast har svake intermolekylære krefter mellom kjedene → kan smeltes. Herdeplast har kovalente tverrbindinger → kan ikke."
    },
    {
      statement: "Cellulose kan fordøyes av mennesker.",
      correct: false,
      explanation: "Mennesker mangler enzymet cellulase som bryter β-glykosidbindinger. Cellulose fungerer som fiber i kostholdet."
    },
    {
      statement: "Alle typer plast er laget fra petroleum.",
      correct: false,
      explanation: "Bioplast kan lages fra fornybare ressurser som maisstivelse, sukkerrør eller cellulose (f.eks. PLA)."
    },
    {
      statement: "Grønn kjemi handler om å bruke grønne fargestoffer.",
      correct: false,
      explanation: "Grønn kjemi er prinsipper for bærekraftig kjemi: forebygg avfall, bruk ufarlige stoffer, design for nedbryting, energieffektivitet."
    },
    {
      statement: "Aluminium kan gjenvinnes uendelig mange ganger uten kvalitetstap.",
      correct: true,
      explanation: "Metaller som aluminium kan smeltes om og gjenbrukes uten tap av materialegenskaper, i motsetning til mye plast."
    },
    {
      statement: "Denaturering av et protein er alltid irreversibel.",
      correct: false,
      explanation: "Noen proteiner kan renatureres (folde seg tilbake) under riktige betingelser. Men mange denatureringer er i praksis irreversible."
    },
    {
      statement: "DNA-dobbeltheliks holdes sammen av kovalente bindinger mellom basene.",
      correct: false,
      explanation: "Baseparene holdes sammen av hydrogenbindinger (svake, ikke-kovalente). De kovalente bindingene er i sukkerfoskatryggraden."
    },
    {
      statement: "Rustfritt stål er en legering som motstår korrosjon bedre enn rent jern.",
      correct: true,
      explanation: "Rustfritt stål inneholder krom (≥10,5 %) som danner et beskyttende kromoksid-lag på overflaten."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.MAKROMOLEKYLER = MAKROMOLEKYLER;
}
