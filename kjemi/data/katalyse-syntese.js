// Kjemi 2 – Katalyse, syntese og kromatografi
// Kompetansemål #9, #11, #12

const KATALYSE_SYNTESE = {
  id: "katalyse-syntese",
  title: "Katalyse, syntese og kromatografi",
  description: "Reaksjonshastiget, katalysatorer, syntese og kromatografi",

  flashcards: [
    {
      front: "Hva er en katalysator?",
      back: "Et stoff som øker reaksjonshastigheten uten å forbrukes. Den senker aktiveringsenergien ved å tilby en alternativ reaksjonsvei."
    },
    {
      front: "Hva er forskjellen mellom homogen og heterogen katalyse?",
      back: "Homogen: katalysator i samme fase som reaktantene (f.eks. enzym i løsning). Heterogen: katalysator i annen fase (f.eks. fast Pt-overflate med gass)."
    },
    {
      front: "Hva er et enzym?",
      back: "En biologisk katalysator (protein) som katalyserer spesifikke reaksjoner i levende organismer. Svært selektive og effektive."
    },
    {
      front: "Hva er aktiveringsenergi (Ea)?",
      back: "Minimumsenergien som kreves for at en reaksjon skal starte. Katalysatorer senker Ea."
    },
    {
      front: "Hva påvirker reaksjonshastigheten?",
      back: "Konsentrasjon, temperatur, overflate/fordeling, katalysator. Høyere konsentrasjon/temperatur → flere effektive kollisjoner → høyere hastighet."
    },
    {
      front: "Hva er utbytte i en syntese?",
      back: "Prosent av teoretisk mengde produkt som faktisk oppnås: Utbytte (%) = (faktisk mengde / teoretisk mengde) × 100."
    },
    {
      front: "Hva påvirker utbytte og renhet i synteser?",
      back: "Sidereaksjoner, ufullstendig reaksjon, tap ved overføring/rensing, temperatur, katalysator, reaksjonstid, løsemiddelvalg."
    },
    {
      front: "Hva er kromatografi?",
      back: "En separasjonsteknikk der stoffer separeres basert på ulik fordeling mellom en stasjonær fase og en mobil fase."
    },
    {
      front: "Hva er stasjonær fase i kromatografi?",
      back: "Den fasen som er i ro (f.eks. silika på en TLC-plate, pakking i en kolonne). Stoffer som interagerer sterkt med denne beveger seg sakte."
    },
    {
      front: "Hva er mobil fase?",
      back: "Fasen som beveger seg (løsemiddel i TLC/kolonnekromatografi, gass i GC). Stoffer som foretrekker denne fasen beveger seg raskt."
    },
    {
      front: "Hva er Rf-verdi?",
      back: "Rf = avstand stoff har vandret / avstand front har vandret. Verdien er mellom 0 og 1 og er karakteristisk for et stoff under gitte betingelser."
    },
    {
      front: "Nevn tre typer kromatografi.",
      back: "1) Tynnsjiktkromatografi (TLC), 2) Kolonnekromatografi, 3) Gasskromatografi (GC). Alle baseres på fordeling mellom stasjonær og mobil fase."
    },
    {
      front: "Hva er katalytisk converter i biler?",
      back: "Heterogen katalysator (Pt/Pd/Rh) som omdanner giftige avgasser: CO → CO₂, NOₓ → N₂, uforbrente HC → CO₂ + H₂O."
    }
  ],

  multipleChoice: [
    {
      question: "En katalysator virker ved å:",
      options: [
        "Øke temperaturen i reaksjonen",
        "Senke aktiveringsenergien",
        "Øke ΔH for reaksjonen",
        "Endre likevektskonstanten K"
      ],
      correct: 1,
      explanation: "Katalysatoren tilbyr en alternativ reaksjonsvei med lavere aktiveringsenergi. ΔH og K endres ikke."
    },
    {
      question: "Hva er et enzym?",
      options: [
        "En uorganisk katalysator",
        "En biologisk katalysator (protein)",
        "Et reaksjonsprodukt",
        "Et substrat"
      ],
      correct: 1,
      explanation: "Enzymer er proteiner som fungerer som biologiske katalysatorer – svært spesifikke og effektive."
    },
    {
      question: "Hva er Rf-verdien i kromatografi?",
      options: [
        "Reaksjonsfaktoren",
        "Forholdet mellom stoffets og frontens vandrede avstand",
        "Retensjonsfarten til mobil fase",
        "Mengden stoff i prøven"
      ],
      correct: 1,
      explanation: "Rf = avstand stoff / avstand front. Brukes til å identifisere stoffer i TLC."
    },
    {
      question: "I TLC: et stoff med høy Rf-verdi...",
      options: [
        "Interagerer sterkt med stasjonær fase",
        "Er mer løselig i mobil fase",
        "Er et tyngre molekyl",
        "Har høyere kokepunkt"
      ],
      correct: 1,
      explanation: "Høy Rf = stoffet vandrer langt = det foretrekker mobil fase fremfor stasjonær fase."
    },
    {
      question: "Utbyttet i en syntese ble 4,5 g, teoretisk utbytte var 6,0 g. Hva er prosentutbyttet?",
      options: ["45 %", "75 %", "67 %", "133 %"],
      correct: 1,
      explanation: "Utbytte = (4,5/6,0) × 100 = 75 %."
    },
    {
      question: "Hva reduserer IKKE utbyttet i en syntese?",
      options: [
        "Sidereaksjoner",
        "Ufullstendig reaksjon",
        "Bruk av katalysator",
        "Tap ved overføring"
      ],
      correct: 2,
      explanation: "En katalysator øker hastigheten og kan forbedre utbyttet. De andre faktorene reduserer utbyttet."
    },
    {
      question: "I gasskromatografi (GC) er den mobile fasen:",
      options: ["Et løsemiddel", "En inert gass", "Et fast stoff", "Vann"],
      correct: 1,
      explanation: "I GC er mobil fase en inert bæregass (f.eks. helium eller nitrogen). Stoffene separeres etter kokepunkt."
    },
    {
      question: "Hva menes med heterogen katalyse?",
      options: [
        "Katalysator og reaktanter er i ulike faser",
        "Katalysator og reaktanter er i samme fase",
        "Katalysatoren forbrukes",
        "Reaksjonen skjer uten katalysator"
      ],
      correct: 0,
      explanation: "Heterogen: ulike faser (f.eks. fast katalysator + gassreaktanter). Homogen: samme fase."
    },
    {
      question: "Haber-prosessen bruker jernkatalysator. Hva er dens rolle?",
      options: [
        "Øker K-verdien",
        "Forskyver likevekten mot NH₃",
        "Gjør at likevekt nås raskere",
        "Endrer ΔH for reaksjonen"
      ],
      correct: 2,
      explanation: "Katalysatoren gjør at likevekt nås raskere (senker Ea), men endrer ikke K eller ΔH."
    },
    {
      question: "Temperaturregel: omtrent hvor mye raskere går en reaksjon for hver 10 °C temperaturøkning?",
      options: ["Dobbelt så raskt", "10 ganger raskere", "Likt", "Halvparten så raskt"],
      correct: 0,
      explanation: "Tommelfingerregel: reaksjonshastigheten omtrent dobles for hver 10 °C temperaturøkning."
    },
    {
      question: "Hva er rekrystallisering?",
      options: [
        "En separasjonsmetode der et stoff løses varmt og krystalliserer ved avkjøling",
        "En type kromatografi",
        "En katalytisk prosess",
        "En destillasjonsmetode"
      ],
      correct: 0,
      explanation: "Rekrystallisering utnytter temperaturavhengig løselighet: løs i varmt løsemiddel, avkjøl → rent krystall felles ut."
    }
  ],

  trueFalse: [
    {
      statement: "En katalysator forbrukes i reaksjonen.",
      correct: false,
      explanation: "Katalysatoren deltar i reaksjonen, men regenereres og er uendret etter at reaksjonen er fullført."
    },
    {
      statement: "Enzymer er svært spesifikke – hvert enzym katalyserer vanligvis kun én type reaksjon.",
      correct: true,
      explanation: "Enzymer har et aktivt sete som er formet for å passe kun spesifikke substrater (nøkkel-lås-modell)."
    },
    {
      statement: "Økt temperatur øker alltid utbyttet i en syntese.",
      correct: false,
      explanation: "Høyere temperatur kan gi mer sidereaksjoner eller forskyve likevekten (for eksoterme reaksjoner). Det øker hastigheten, men ikke nødvendigvis utbyttet."
    },
    {
      statement: "I kromatografi separeres stoffer basert på ulik affinitet til stasjonær og mobil fase.",
      correct: true,
      explanation: "Stoffer med sterkere binding til stasjonær fase beveger seg saktere; de som foretrekker mobil fase beveger seg raskere."
    },
    {
      statement: "Gasskromatografi egner seg best for stoffer med høyt kokepunkt som ikke kan fordampes.",
      correct: false,
      explanation: "GC krever at stoffene kan fordampes. For stoffer med svært høyt kokepunkt brukes HPLC (væskekromatografi) i stedet."
    },
    {
      statement: "Katalysatorer i bilens eksosanlegg omdanner CO til CO₂.",
      correct: true,
      explanation: "Den katalytiske konverteren (Pt/Pd/Rh) oksiderer CO til CO₂ og reduserer NOₓ til N₂."
    },
    {
      statement: "Et utbytte på over 100 % betyr at syntesen var svært vellykket.",
      correct: false,
      explanation: "Utbytte > 100 % er teoretisk umulig og tyder på målefeil, urenheter, eller feil i beregningen."
    },
    {
      statement: "Rf-verdier er universelle og gjelder under alle betingelser.",
      correct: false,
      explanation: "Rf-verdier avhenger av løsemiddel, temperatur, type stasjonær fase osv. De er kun reproduserbare under identiske betingelser."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.KATALYSE_SYNTESE = KATALYSE_SYNTESE;
}
