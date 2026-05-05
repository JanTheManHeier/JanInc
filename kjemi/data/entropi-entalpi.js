// Kjemi 2 – Entropi og entalpi
// Kompetansemål #6: Gjøre rede for entropibegrepet, bruke entropi og entalpi til å vurdere spontanitet

const ENTROPI_ENTALPI = {
  id: "entropi-entalpi",
  title: "Entropi og entalpi",
  description: "Termodynamikk, spontanitet og Gibbs fri energi",

  flashcards: [
    {
      front: "Hva er entalpi (H)?",
      back: "Et mål på energiinnholdet i et system. Entalpien kan ikke måles direkte, men endringen ΔH kan måles som varme avgitt/opptatt ved konstant trykk."
    },
    {
      front: "Hva betyr ΔH < 0?",
      back: "Reaksjonen er eksoterm – den avgir varme til omgivelsene. Produktene har lavere energi enn reaktantene."
    },
    {
      front: "Hva betyr ΔH > 0?",
      back: "Reaksjonen er endoterm – den tar opp varme fra omgivelsene. Produktene har høyere energi enn reaktantene."
    },
    {
      front: "Hva er entropi (S)?",
      back: "Et mål på uorden/spredning i et system. Høy entropi = mange mulige mikrotilstander = stor uorden."
    },
    {
      front: "Hva er termodynamikkens 2. lov?",
      back: "Totalentropien i universet øker alltid for en spontan prosess. ΔS_univers = ΔS_system + ΔS_omgivelser > 0."
    },
    {
      front: "Hva er Gibbs fri energi (G)?",
      back: "G = H − TS. Endringen ΔG = ΔH − TΔS bestemmer om en reaksjon er spontan ved gitt temperatur."
    },
    {
      front: "Når er en reaksjon spontan (ifølge Gibbs)?",
      back: "Når ΔG < 0. Reaksjonen kan skje av seg selv under gitte betingelser."
    },
    {
      front: "Hva er Hess' lov?",
      back: "Reaksjonsentalpien for en totalreaksjon er lik summen av reaksjonsentalpiene for delreaksjonene, uavhengig av reaksjonsvei."
    },
    {
      front: "Hva er standard dannelsesentalpi (ΔfH°)?",
      back: "Entalpien når 1 mol av et stoff dannes fra grunnstoffene i sine standardtilstander. For grunnstoffer i standardtilstand er ΔfH° = 0."
    },
    {
      front: "Hvordan beregner man ΔH° fra dannelsesentalpier?",
      back: "ΔH° = Σ ΔfH°(produkter) − Σ ΔfH°(reaktanter)"
    },
    {
      front: "Hva skjer med entropien når en gass ekspanderer?",
      back: "Entropien øker – molekylene har flere mulige posisjoner og mikrotilstander."
    },
    {
      front: "Hvordan påvirker temperatur spontaniteten?",
      back: "ΔG = ΔH − TΔS. Høy temperatur gjør TΔS-leddet dominerende. Reaksjoner med ΔS > 0 favoriseres ved høy T."
    },
    {
      front: "Hva betyr det at en reaksjon er spontan men langsom?",
      back: "Termodynamikk (ΔG) sier om reaksjonen kan skje, men ikke hvor fort. Kinetikk (aktiveringsenergi) bestemmer hastigheten."
    },
    {
      front: "Når er en reaksjon alltid spontan?",
      back: "Når ΔH < 0 og ΔS > 0: ΔG = ΔH − TΔS < 0 for alle temperaturer."
    },
    {
      front: "Når er en reaksjon aldri spontan?",
      back: "Når ΔH > 0 og ΔS < 0: ΔG = ΔH − TΔS > 0 for alle temperaturer."
    }
  ],

  multipleChoice: [
    {
      question: "En reaksjon har ΔH = −100 kJ og ΔS = +50 J/K. Er reaksjonen spontan ved 25 °C?",
      options: ["Ja (ΔG < 0)", "Nei (ΔG > 0)", "Kun ved høy temperatur", "Kan ikke avgjøres"],
      correct: 0,
      explanation: "ΔG = ΔH − TΔS = −100 000 − (298 × 50) = −100 000 − 14 900 = −114 900 J < 0. Spontan."
    },
    {
      question: "Hvilken prosess har positiv entropiendring (ΔS > 0)?",
      options: [
        "Vann fryser til is",
        "En gass komprimeres",
        "NaCl løses i vann",
        "Gass kondenserer til væske"
      ],
      correct: 2,
      explanation: "Når NaCl løses, spres ionene utover i løsningen → flere mikrotilstander → ΔS > 0."
    },
    {
      question: "Hva er ΔG ved likevekt?",
      options: ["ΔG = 0", "ΔG < 0", "ΔG > 0", "ΔG = ΔH"],
      correct: 0,
      explanation: "Ved likevekt er ΔG = 0. Reaksjonen har ingen netto drivkraft i noen retning."
    },
    {
      question: "En reaksjon har ΔH > 0 og ΔS > 0. Når er den spontan?",
      options: [
        "Ved alle temperaturer",
        "Bare ved høye temperaturer",
        "Bare ved lave temperaturer",
        "Aldri"
      ],
      correct: 1,
      explanation: "ΔG = ΔH − TΔS. Når T er høy nok, blir TΔS > ΔH, og ΔG < 0 (spontan)."
    },
    {
      question: "Ifølge Hess' lov, hva er ΔH for: C + O₂ → CO₂, gitt C + ½O₂ → CO (ΔH = −110 kJ) og CO + ½O₂ → CO₂ (ΔH = −283 kJ)?",
      options: ["−393 kJ", "−173 kJ", "+393 kJ", "−110 kJ"],
      correct: 0,
      explanation: "ΔH = −110 + (−283) = −393 kJ. Summen av delreaksjonene gir totalreaksjonen."
    },
    {
      question: "Enheten for entropi (S) er:",
      options: ["kJ/mol", "J/(mol·K)", "kJ", "J/K²"],
      correct: 1,
      explanation: "Entropi måles i J/(mol·K) eller J/K. Standard molar entropi har enheten J/(mol·K)."
    },
    {
      question: "Smelting av is ved 0 °C og 1 atm: Hva er ΔG?",
      options: ["ΔG < 0", "ΔG = 0", "ΔG > 0", "Kan ikke bestemmes"],
      correct: 1,
      explanation: "Ved smeltepunktet er fast og flytende i likevekt. ΔG = 0 ved faseoverganger ved likevektstemperatur."
    },
    {
      question: "Standardentropien for stoffer øker vanligvis i rekkefølgen:",
      options: [
        "Gass > Væske > Fast stoff",
        "Fast stoff > Væske > Gass",
        "Alle har lik S°",
        "Væske > Gass > Fast stoff"
      ],
      correct: 0,
      explanation: "Gasser har mest uorden (flest mikrotilstander), faste stoffer minst. S°(g) > S°(l) > S°(s)."
    },
    {
      question: "En eksoterm reaksjon med ΔS < 0 er spontan ved:",
      options: ["Høye temperaturer", "Lave temperaturer", "Alle temperaturer", "Ingen temperaturer"],
      correct: 1,
      explanation: "ΔG = ΔH − TΔS. Med ΔH < 0 og ΔS < 0: ved lav T er |ΔH| > |TΔS|, så ΔG < 0."
    },
    {
      question: "Hva er ΔfH° for O₂(g) i sin standardtilstand?",
      options: ["0 kJ/mol", "−242 kJ/mol", "+249 kJ/mol", "Avhenger av reaksjonen"],
      correct: 0,
      explanation: "Grunnstoffer i standardtilstand har alltid ΔfH° = 0 per definisjon."
    },
    {
      question: "Forbrenning av metan: CH₄ + 2O₂ → CO₂ + 2H₂O. Hva er ΔS?",
      options: [
        "ΔS ≈ 0 (like mange mol gass)",
        "ΔS < 0 (færre mol gass)",
        "ΔS > 0 (flere mol gass)",
        "Kan ikke avgjøres"
      ],
      correct: 0,
      explanation: "Venstre: 3 mol gass (CH₄ + 2O₂). Høyre: 1 mol CO₂ + 2 mol H₂O(g) = 3 mol gass. ΔS ≈ 0."
    },
    {
      question: "Hva er sammenhengen mellom ΔG° og K (likevektskonstanten)?",
      options: [
        "ΔG° = −RT ln K",
        "ΔG° = RT ln K",
        "ΔG° = K/RT",
        "ΔG° = −K × T"
      ],
      correct: 0,
      explanation: "ΔG° = −RT ln K. Negativ ΔG° betyr K > 1 (likevekten ligger til høyre)."
    },
    {
      question: "Termodynamikkens 3. lov sier at:",
      options: [
        "Entropien til et perfekt krystallinsk stoff er null ved 0 K",
        "Energi kan verken skapes eller ødelegges",
        "Entropi øker alltid",
        "ΔG = 0 ved absolutt nullpunkt"
      ],
      correct: 0,
      explanation: "3. lov: Ved absolutt nullpunkt (0 K) er entropien til et perfekt krystallinsk stoff lik null."
    }
  ],

  trueFalse: [
    {
      statement: "En eksoterm reaksjon er alltid spontan.",
      correct: false,
      explanation: "Spontanitet avhenger av både ΔH og ΔS (via ΔG = ΔH − TΔS). En eksoterm reaksjon med stor negativ ΔS kan være ikke-spontan ved høy T."
    },
    {
      statement: "Entropien i universet øker alltid for spontane prosesser.",
      correct: true,
      explanation: "Termodynamikkens 2. lov: ΔS_univers > 0 for alle spontane prosesser."
    },
    {
      statement: "ΔG = 0 betyr at systemet er i likevekt.",
      correct: true,
      explanation: "Når ΔG = 0 er det ingen netto drivkraft, og systemet er i likevekt."
    },
    {
      statement: "Hess' lov gjelder kun for eksoterme reaksjoner.",
      correct: false,
      explanation: "Hess' lov gjelder for alle reaksjoner – ΔH er en tilstandsfunksjon uavhengig av reaksjonsvei."
    },
    {
      statement: "Standard dannelsesentalpi for alle grunnstoffer i standardtilstand er 0.",
      correct: true,
      explanation: "Per definisjon er ΔfH° = 0 for grunnstoffer i sin mest stabile form ved standardbetingelser."
    },
    {
      statement: "En reaksjon med ΔG > 0 kan aldri skje.",
      correct: false,
      explanation: "Den skjer ikke spontant, men kan drives med energitilførsel (f.eks. elektrolyse) eller kobles til en spontan reaksjon."
    },
    {
      statement: "Smelting av is er en endoterm prosess med positiv entropiendring.",
      correct: true,
      explanation: "Smelting krever varme (ΔH > 0) og gir økt uorden (ΔS > 0) når ordnet is blir til uordnet vann."
    },
    {
      statement: "Ved høy temperatur dominerer entropi-leddet (TΔS) over entalpi-leddet (ΔH).",
      correct: true,
      explanation: "I ΔG = ΔH − TΔS vokser TΔS med T. Ved høy T vil fortegnet til ΔS i stor grad avgjøre spontanitet."
    },
    {
      statement: "Gibbs fri energi kan brukes til å forutsi om en reaksjon går raskt.",
      correct: false,
      explanation: "ΔG sier om reaksjonen er spontan, ikke hvor raskt den skjer. Kinetikk (aktiveringsenergi) bestemmer hastighet."
    },
    {
      statement: "Karbondioksid (CO₂) har høyere standardentropi enn diamant (C).",
      correct: true,
      explanation: "CO₂ er en gass med mye høyere entropi enn diamant som er et fast, ordnet krystallinsk stoff."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.ENTROPI_ENTALPI = ENTROPI_ENTALPI;
}
