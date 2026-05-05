// Kjemi 2 – Redoksreaksjoner og elektrokjemi
// Kompetansemål #4: Utforske redoksreaksjoner, beregne masse, ladning, spenning, energi

const REDOKS = {
  id: "redoks",
  title: "Redoksreaksjoner",
  description: "Oksidasjon, reduksjon, elektrokjemi og elektrolyse",

  flashcards: [
    {
      front: "Hva er oksidasjon?",
      back: "Tap av elektroner. Oksidasjonstallet øker. Huskeregel: OTE (Oksidasjon = Tap av Elektroner)."
    },
    {
      front: "Hva er reduksjon?",
      back: "Opptak av elektroner. Oksidasjonstallet synker. Huskeregel: ROE (Reduksjon = Opptak av Elektroner)."
    },
    {
      front: "Hva er et oksidasjonsmiddel?",
      back: "Et stoff som oksiderer et annet stoff ved å ta opp elektroner selv. Oksidasjonsmiddelet blir redusert."
    },
    {
      front: "Hva er et reduksjonsmiddel?",
      back: "Et stoff som reduserer et annet stoff ved å avgi elektroner. Reduksjonsmiddelet blir oksidert."
    },
    {
      front: "Hva er en galvanisk celle?",
      back: "En elektrisk celle som omdanner kjemisk energi til elektrisk energi gjennom en spontan redoksreaksjon."
    },
    {
      front: "Hva er en elektrolysecelle?",
      back: "En celle der elektrisk energi driver en ikke-spontan redoksreaksjon. Strøm tvinger reaksjonen i motsatt retning."
    },
    {
      front: "Hva skjer ved anoden?",
      back: "Oksidasjon skjer alltid ved anoden. I galvanisk celle er anoden negativ (−), i elektrolyse er den positiv (+)."
    },
    {
      front: "Hva skjer ved katoden?",
      back: "Reduksjon skjer alltid ved katoden. I galvanisk celle er katoden positiv (+), i elektrolyse er den negativ (−)."
    },
    {
      front: "Hva er cellespenningen (EMK)?",
      back: "E°celle = E°katode − E°anode. Positiv cellespenning betyr spontan reaksjon."
    },
    {
      front: "Hva er standardelektrodepotensial (E°)?",
      back: "Potensialet til en halvreaksjon målt mot standard hydrogenelektrode (SHE) ved standardbetingelser (25°C, 1 M, 1 atm)."
    },
    {
      front: "Hva er spenningsrekka?",
      back: "En ordnet liste over metallers standardpotensial. Metaller med lav E° er edlere (vanskelig å oksidere), metaller med høy negativ E° er uedle (lett å oksidere)."
    },
    {
      front: "Hva er Faradays lov?",
      back: "m = (M · I · t) / (n · F)\nder m = masse, M = molar masse, I = strøm (A), t = tid (s), n = antall elektroner, F = 96 485 C/mol."
    },
    {
      front: "Hva er Faradays konstant (F)?",
      back: "F = 96 485 C/mol – ladningen til 1 mol elektroner."
    },
    {
      front: "Hva er en saltbro?",
      back: "Et rør med saltløsning som kobler de to halvcelene i en galvanisk celle. Den opprettholder elektrisk nøytralitet ved å tillate ionetransport."
    },
    {
      front: "Hva er korrosjon?",
      back: "Ufrivillig oksidasjon av metaller. Jern ruster: Fe → Fe²⁺ + 2e⁻. Kan forhindres med galvanisk beskyttelse, maling eller legering."
    },
    {
      front: "Hva er galvanisk beskyttelse (offeranode)?",
      back: "Et uedlere metall (f.eks. sink) kobles til jernet. Sinken oksideres i stedet for jernet (offrer seg)."
    }
  ],

  multipleChoice: [
    {
      question: "I reaksjonen Zn + Cu²⁺ → Zn²⁺ + Cu, hva blir oksidert?",
      options: ["Cu²⁺", "Zn", "Cu", "Zn²⁺"],
      correct: 1,
      explanation: "Zn avgir 2 elektroner (Zn → Zn²⁺ + 2e⁻) og blir oksidert. Zn er reduksjonsmiddelet."
    },
    {
      question: "Hva er oksidasjonstallet til Mn i KMnO₄?",
      options: ["+4", "+7", "+2", "+5"],
      correct: 1,
      explanation: "K = +1, O = −2 (×4 = −8). Summen = 0: +1 + Mn + (−8) = 0 → Mn = +7."
    },
    {
      question: "E°(Cu²⁺/Cu) = +0,34 V og E°(Zn²⁺/Zn) = −0,76 V. Hva er cellespenningen?",
      options: ["0,42 V", "1,10 V", "−1,10 V", "−0,42 V"],
      correct: 1,
      explanation: "E°celle = E°katode − E°anode = +0,34 − (−0,76) = +1,10 V."
    },
    {
      question: "I en elektrolysecelle skjer oksidasjon ved:",
      options: ["Katoden (−)", "Anoden (+)", "Saltbroen", "Begge elektroder"],
      correct: 1,
      explanation: "Oksidasjon skjer alltid ved anoden. I elektrolyse er anoden koblet til + polen."
    },
    {
      question: "Hvilken påstand om galvaniske celler er riktig?",
      options: [
        "Anoden er positiv",
        "Elektroner strømmer fra katode til anode",
        "Reaksjonen er spontan",
        "Det trengs ekstern strømkilde"
      ],
      correct: 2,
      explanation: "Galvaniske celler driver spontane reaksjoner – kjemisk energi → elektrisk energi. Anoden er negativ."
    },
    {
      question: "Hva er oksidasjonstallet til S i H₂SO₄?",
      options: ["+4", "+6", "+2", "−2"],
      correct: 1,
      explanation: "H = +1 (×2 = +2), O = −2 (×4 = −8). Summen = 0: +2 + S + (−8) = 0 → S = +6."
    },
    {
      question: "Ved elektrolyse av smelta NaCl, hva dannes ved katoden?",
      options: ["Cl₂(g)", "Na(l)", "NaOH", "O₂(g)"],
      correct: 1,
      explanation: "Ved katoden skjer reduksjon: Na⁺ + e⁻ → Na. Natrium dannes ved katoden."
    },
    {
      question: "2 A strøm går gjennom en CuSO₄-løsning i 30 min. Hvor mye Cu avsettes? (M = 63,5 g/mol, n = 2)",
      options: ["1,19 g", "2,37 g", "0,59 g", "4,74 g"],
      correct: 0,
      explanation: "m = M·I·t / (n·F) = 63,5 × 2 × 1800 / (2 × 96485) = 1,19 g."
    },
    {
      question: "Hvilket metall er mest uedelt (lettere å oksidere)?",
      options: ["Au (E° = +1,50 V)", "Cu (E° = +0,34 V)", "Fe (E° = −0,44 V)", "Zn (E° = −0,76 V)"],
      correct: 3,
      explanation: "Mest negativ E° = mest uedelt = lettest å oksidere. Zn med E° = −0,76 V er mest uedelt her."
    },
    {
      question: "Hva er korrekt om rustdannelse (korrosjon av jern)?",
      options: [
        "Jern blir redusert",
        "Jern blir oksidert: Fe → Fe²⁺ + 2e⁻",
        "Oksygen blir oksidert",
        "Det kreves ingen fuktighet"
      ],
      correct: 1,
      explanation: "Rust er oksidasjon av jern i nærvær av oksygen og vann: Fe → Fe²⁺ + 2e⁻ (jern taper elektroner)."
    },
    {
      question: "Oksidasjonstallet til et fritt grunnstoff er alltid:",
      options: ["−1", "0", "+1", "Avhenger av grunnstoffet"],
      correct: 1,
      explanation: "Frie grunnstoffer (f.eks. O₂, Fe, N₂) har alltid oksidasjonstall = 0."
    },
    {
      question: "Hva er funksjonen til en saltbro i en galvanisk celle?",
      options: [
        "Leder elektroner mellom halvcelene",
        "Opprettholder elektrisk nøytralitet via ionetransport",
        "Øker cellespenningen",
        "Forhindrer reaksjonen"
      ],
      correct: 1,
      explanation: "Saltbroen tillater ioner å vandre mellom halvcelene slik at ladningsbalanse opprettholdes."
    },
    {
      question: "For å beskytte et jernrør mot korrosjon kan man koble det til:",
      options: ["Kobber", "Gull", "Sink", "Sølv"],
      correct: 2,
      explanation: "Sink er mer uedelt enn jern og vil oksideres i stedet (offeranode/galvanisk beskyttelse)."
    },
    {
      question: "I reaksjonen 2Fe³⁺ + Sn²⁺ → 2Fe²⁺ + Sn⁴⁺, hva er oksidasjonsmiddelet?",
      options: ["Sn²⁺", "Fe³⁺", "Fe²⁺", "Sn⁴⁺"],
      correct: 1,
      explanation: "Fe³⁺ tar opp elektroner (reduseres til Fe²⁺) → Fe³⁺ er oksidasjonsmiddelet."
    },
    {
      question: "Hvor mange Faraday (mol elektroner) trengs for å avsette 1 mol Al fra Al³⁺?",
      options: ["1 F", "2 F", "3 F", "6 F"],
      correct: 2,
      explanation: "Al³⁺ + 3e⁻ → Al. Det trengs 3 mol elektroner (= 3 F) per mol aluminium."
    }
  ],

  trueFalse: [
    {
      statement: "Oksidasjon og reduksjon skjer alltid samtidig.",
      correct: true,
      explanation: "I en redoksreaksjon må ett stoff avgi elektroner (oksidasjon) og et annet ta dem opp (reduksjon)."
    },
    {
      statement: "I en galvanisk celle er anoden positiv.",
      correct: false,
      explanation: "I en galvanisk celle er anoden negativ (−) og katoden positiv (+). Det er omvendt i elektrolyse."
    },
    {
      statement: "Et sterkt oksidasjonsmiddel har høy (positiv) standardpotensial.",
      correct: true,
      explanation: "Høy E° betyr stor tendens til å ta opp elektroner = sterkt oksidasjonsmiddel (f.eks. F₂, Cl₂)."
    },
    {
      statement: "Ved elektrolyse av vann dannes H₂ ved anoden.",
      correct: false,
      explanation: "H₂ dannes ved katoden (reduksjon: 2H₂O + 2e⁻ → H₂ + 2OH⁻). O₂ dannes ved anoden."
    },
    {
      statement: "Oksidasjonstallet til oksygen er alltid −2.",
      correct: false,
      explanation: "Unntak: I peroksider (H₂O₂) er O = −1, i OF₂ er O = +2, og i O₂ er O = 0."
    },
    {
      statement: "Sink kan beskytte jern mot korrosjon ved å fungere som offeranode.",
      correct: true,
      explanation: "Sink er mer uedelt enn jern (lavere E°) og oksideres i stedet for jernet."
    },
    {
      statement: "Cellespenningen kan være negativ for en spontan reaksjon.",
      correct: false,
      explanation: "En spontan reaksjon har alltid positiv cellespenning (E°celle > 0). Negativ E° betyr ikke-spontan."
    },
    {
      statement: "1 Faraday er ladningen til 1 mol elektroner (96 485 C).",
      correct: true,
      explanation: "F = NA · e = 6,022 × 10²³ × 1,602 × 10⁻¹⁹ C = 96 485 C/mol."
    },
    {
      statement: "I en redoksreaksjon øker alltid oksidasjonstallet til reduksjonsmiddelet.",
      correct: true,
      explanation: "Reduksjonsmiddelet avgir elektroner (oksideres), så dets oksidasjonstall øker."
    },
    {
      statement: "Gull korroderer lett fordi det har høy standard elektrodepotensial.",
      correct: false,
      explanation: "Gull har høy positiv E° (+1,50 V), som betyr at det er svært edelt og vanskelig å oksidere – det korroderer nesten ikke."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.REDOKS = REDOKS;
}
