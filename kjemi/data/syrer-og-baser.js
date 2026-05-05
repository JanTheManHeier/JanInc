// Kjemi 2 – Syrer og baser
// Basert på KJE01-02 kompetansemål #7 og lærebok av Haraldsrud (Aschehoug)

const SYRER_OG_BASER = {
  id: "syrer-og-baser",
  title: "Syrer og baser",
  description: "Brønsted-teori, pH, Ka/Kb, buffere og titrering",

  flashcards: [
    {
      front: "Hva er en Brønsted-syre?",
      back: "Et stoff som kan avgi et proton (H⁺) til en annen partikkel."
    },
    {
      front: "Hva er en Brønsted-base?",
      back: "Et stoff som kan ta opp et proton (H⁺) fra en annen partikkel."
    },
    {
      front: "Hva er et konjugert syre-base-par?",
      back: "To stoffer som skiller seg fra hverandre med ett proton (H⁺). Syren avgir protonet og danner den konjugerte basen."
    },
    {
      front: "Hva er protolyse?",
      back: "En reaksjon der et proton (H⁺) overføres fra en syre til en base."
    },
    {
      front: "Hva er et amfotært stoff (amfolytt)?",
      back: "Et stoff som kan reagere både som syre og som base, f.eks. vann (H₂O) og HCO₃⁻."
    },
    {
      front: "Hva er vannets ioneprodukt (Kw)?",
      back: "Kw = [H₃O⁺] · [OH⁻] = 1,0 × 10⁻¹⁴ ved 25 °C"
    },
    {
      front: "Hvordan defineres pH?",
      back: "pH = −log[H₃O⁺]"
    },
    {
      front: "Hvordan defineres pOH?",
      back: "pOH = −log[OH⁻]"
    },
    {
      front: "Hva er sammenhengen mellom pH og pOH?",
      back: "pH + pOH = 14 (ved 25 °C)"
    },
    {
      front: "Hva kjennetegner en sterk syre?",
      back: "En syre som protolyserer fullstendig i vann – alle syremolekylene avgir proton. Eksempler: HCl, HNO₃, H₂SO₄."
    },
    {
      front: "Hva kjennetegner en svak syre?",
      back: "En syre som bare delvis protolyserer i vann – det innstiller seg en likevekt. Eksempel: CH₃COOH (eddiksyre)."
    },
    {
      front: "Hva er syrekonstanten Ka?",
      back: "Ka = [H₃O⁺][A⁻] / [HA] – likevektskonstanten for protolysen av en svak syre. Stor Ka = sterk syre."
    },
    {
      front: "Hva er basekonstanten Kb?",
      back: "Kb = [BH⁺][OH⁻] / [B] – likevektskonstanten for protolysen av en svak base. Stor Kb = sterk base."
    },
    {
      front: "Hva er sammenhengen mellom Ka og Kb for et konjugert par?",
      back: "Ka · Kb = Kw = 1,0 × 10⁻¹⁴ (ved 25 °C)"
    },
    {
      front: "Hva er protolysegrad (α)?",
      back: "Andelen av syremolekylene som har avgitt proton: α = [A⁻] / c₀, der c₀ er startkonsentrasjonen."
    },
    {
      front: "Hva er en bufferløsning?",
      back: "En løsning som motstår pH-endringer ved tilsetning av syre eller base. Inneholder en svak syre og dens konjugerte base (eller omvendt)."
    },
    {
      front: "Hvordan beregner man pH i en buffer?",
      back: "Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA])"
    },
    {
      front: "Hva er titrering?",
      back: "En analysemetode der man tilsetter en løsning med kjent konsentrasjon (titrant) til en løsning med ukjent konsentrasjon for å bestemme stoffmengden."
    },
    {
      front: "Hva er ekvivalenspunktet?",
      back: "Punktet i en titrering der tilsatt stoffmengde titrant er lik stoffmengden av analytten – all syren/basen er nøytralisert."
    },
    {
      front: "Hva er en indikator i syre-base-sammenheng?",
      back: "Et svakt syre-base-stoff som skifter farge ved en bestemt pH (omslaget). Velges slik at fargeomslaget er nær ekvivalenspunktet."
    },
    {
      front: "Hva skjer med pH ved ekvivalenspunktet når man titrerer svak syre med sterk base?",
      back: "pH > 7 ved ekvivalenspunktet, fordi den konjugerte basen (A⁻) som dannes er en base."
    },
    {
      front: "Hva er pKa?",
      back: "pKa = −log(Ka). Lav pKa betyr sterk syre."
    },
    {
      front: "Nevn to eksempler på buffere i kroppen.",
      back: "Bikarbonatbufferen (H₂CO₃/HCO₃⁻) i blodet og fosfatbufferen (H₂PO₄⁻/HPO₄²⁻) i cellene."
    },
    {
      front: "Hva er autoprotolys av vann?",
      back: "Reaksjonen der to vannmolekyler reagerer: H₂O + H₂O ⇌ H₃O⁺ + OH⁻"
    }
  ],

  multipleChoice: [
    {
      question: "Hva er pH i en 0,01 M HCl-løsning?",
      options: ["1", "2", "3", "4"],
      correct: 1,
      explanation: "HCl er en sterk syre som protolyserer fullstendig. [H₃O⁺] = 0,01 M. pH = −log(0,01) = 2."
    },
    {
      question: "Hvilken av disse er en sterk syre?",
      options: ["CH₃COOH", "HNO₃", "H₂CO₃", "HF"],
      correct: 1,
      explanation: "HNO₃ (salpetersyre) er en sterk syre som protolyserer fullstendig i vann. De andre er svake syrer."
    },
    {
      question: "Hva er [OH⁻] i en løsning med pH = 10?",
      options: ["1,0 × 10⁻¹⁰ M", "1,0 × 10⁻⁴ M", "1,0 × 10⁻¹⁴ M", "1,0 × 10⁻² M"],
      correct: 1,
      explanation: "pOH = 14 − 10 = 4, så [OH⁻] = 10⁻⁴ = 1,0 × 10⁻⁴ M."
    },
    {
      question: "Hva er den konjugerte basen til H₂O?",
      options: ["H₃O⁺", "OH⁻", "O²⁻", "H₂"],
      correct: 1,
      explanation: "Når H₂O avgir et proton, dannes OH⁻. Altså er OH⁻ den konjugerte basen til H₂O."
    },
    {
      question: "En svak syre HA har Ka = 1,8 × 10⁻⁵. Hva er pKa?",
      options: ["5,00", "4,74", "4,52", "3,74"],
      correct: 1,
      explanation: "pKa = −log(1,8 × 10⁻⁵) = −log(1,8) − log(10⁻⁵) = −0,26 + 5 = 4,74."
    },
    {
      question: "Hvilken løsning har lavest pH?",
      options: ["0,1 M NaOH", "0,1 M HCl", "0,1 M CH₃COOH", "Rent vann"],
      correct: 1,
      explanation: "0,1 M HCl er en sterk syre med pH = 1. Eddiksyre (svak) har pH > 1, vann har pH = 7, og NaOH er basisk (pH = 13)."
    },
    {
      question: "Hva skjer med likevekten H₂O + H₂O ⇌ H₃O⁺ + OH⁻ når man tilsetter syre?",
      options: [
        "Likevekten forskyves mot høyre",
        "Likevekten forskyves mot venstre",
        "Likevekten påvirkes ikke",
        "Kw endres"
      ],
      correct: 1,
      explanation: "Tilsatt syre øker [H₃O⁺]. Ifølge Le Chateliers prinsipp forskyves likevekten mot venstre for å motvirke endringen."
    },
    {
      question: "Hva er pH i en bufferløsning med [HA] = 0,10 M og [A⁻] = 0,10 M, der pKa = 4,74?",
      options: ["4,74", "7,00", "3,74", "5,74"],
      correct: 0,
      explanation: "Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]) = 4,74 + log(1) = 4,74 + 0 = 4,74."
    },
    {
      question: "Hva er den konjugerte syren til NH₃?",
      options: ["NH₂⁻", "NH₄⁺", "N₂H₄", "NO₃⁻"],
      correct: 1,
      explanation: "Når NH₃ tar opp et proton, dannes NH₄⁺. Altså er NH₄⁺ den konjugerte syren til NH₃."
    },
    {
      question: "Hvilken påstand om en buffer er korrekt?",
      options: [
        "En buffer kan motstå ubegrenset med syre/base",
        "En buffer inneholder en sterk syre og en sterk base",
        "En buffer virker best når [HA] ≈ [A⁻]",
        "En buffer har alltid pH = 7"
      ],
      correct: 2,
      explanation: "En buffer har størst kapasitet når [HA] ≈ [A⁻], dvs. når pH ≈ pKa. Den kan ikke motstå ubegrenset mengde."
    },
    {
      question: "Ved titrering av svak syre med sterk base – hva er pH ved ekvivalenspunktet?",
      options: ["Nøyaktig 7", "Over 7", "Under 7", "Avhenger av temperaturen"],
      correct: 1,
      explanation: "Ved ekvivalenspunktet er all syren omdannet til konjugert base (A⁻), som er basisk. Derfor er pH > 7."
    },
    {
      question: "Hva er pH i en 0,001 M NaOH-løsning?",
      options: ["3", "11", "12", "10"],
      correct: 1,
      explanation: "NaOH er en sterk base. [OH⁻] = 0,001 M → pOH = 3 → pH = 14 − 3 = 11."
    },
    {
      question: "Hvilket stoff er amfotært?",
      options: ["HCl", "NaOH", "HCO₃⁻", "Na⁺"],
      correct: 2,
      explanation: "HCO₃⁻ kan både avgi proton (syre: HCO₃⁻ → CO₃²⁻ + H⁺) og ta opp proton (base: HCO₃⁻ + H⁺ → H₂CO₃)."
    },
    {
      question: "Hva er Kw ved 25 °C?",
      options: ["1,0 × 10⁻⁷", "1,0 × 10⁻¹⁴", "1,0 × 10⁻¹²", "7,0"],
      correct: 1,
      explanation: "Vannets ioneprodukt Kw = [H₃O⁺][OH⁻] = 1,0 × 10⁻¹⁴ ved 25 °C."
    },
    {
      question: "Eddiksyre har Ka = 1,8 × 10⁻⁵. Hva er Kb for acetat-ionet (CH₃COO⁻)?",
      options: ["1,8 × 10⁻⁵", "5,6 × 10⁻¹⁰", "1,0 × 10⁻⁷", "1,0 × 10⁻¹⁴"],
      correct: 1,
      explanation: "Ka · Kb = Kw → Kb = Kw/Ka = (1,0 × 10⁻¹⁴)/(1,8 × 10⁻⁵) = 5,6 × 10⁻¹⁰."
    },
    {
      question: "Hvilken indikator egner seg best for titrering av sterk syre med sterk base?",
      options: ["Metylrødt (pH 4,4–6,2)", "Bromtymolblått (pH 6,0–7,6)", "Fenolftalein (pH 8,2–10,0)", "Alle tre fungerer"],
      correct: 3,
      explanation: "Ved titrering av sterk syre med sterk base er pH-endringen ved ekvivalenspunktet så bratt at alle vanlige indikatorer gir godt resultat."
    },
    {
      question: "Hva er halvtitrerpunktet?",
      options: [
        "Punktet der halvparten av titranten er tilsatt",
        "Punktet der pH = pKa",
        "Punktet der pH = 7",
        "Punktet der all syren er nøytralisert"
      ],
      correct: 1,
      explanation: "Ved halvtitrerpunktet er [HA] = [A⁻], og da gir Henderson-Hasselbalch: pH = pKa + log(1) = pKa."
    },
    {
      question: "Hva skjer med pH i rent vann hvis temperaturen øker?",
      options: [
        "pH øker",
        "pH synker",
        "pH forblir 7",
        "pH blir udefinert"
      ],
      correct: 1,
      explanation: "Autoprotolys av vann er endoterm. Økt temperatur øker Kw, og dermed øker [H₃O⁺], som gir lavere pH. Men løsningen er fortsatt nøytral."
    },
    {
      question: "Hva er protolysegraden for en 0,10 M løsning av en sterk syre?",
      options: ["0 %", "50 %", "100 %", "Avhenger av Ka"],
      correct: 2,
      explanation: "En sterk syre protolyserer fullstendig (100 %) i vann."
    },
    {
      question: "Hvilken av disse er den sterkeste syren?",
      options: ["Ka = 1,8 × 10⁻⁵", "Ka = 6,8 × 10⁻⁴", "Ka = 4,0 × 10⁻¹⁰", "Ka = 1,0 × 10⁻²"],
      correct: 3,
      explanation: "Høyest Ka betyr sterkest syre. Ka = 1,0 × 10⁻² er størst."
    },
    {
      question: "I en titrering tilsettes 25 mL 0,10 M NaOH til 25 mL 0,10 M HCl. Hva er pH etter tilsetning?",
      options: ["1", "7", "13", "14"],
      correct: 1,
      explanation: "Stoffmengdene er like (begge 0,0025 mol), så all syre og base nøytraliseres. Løsningen er nøytral → pH = 7."
    },
    {
      question: "Hva er formelen for å beregne pH fra [H₃O⁺]?",
      options: ["pH = log[H₃O⁺]", "pH = −log[H₃O⁺]", "pH = 1/[H₃O⁺]", "pH = ln[H₃O⁺]"],
      correct: 1,
      explanation: "pH er definert som den negative logaritmen (base 10) av oksoniumion-konsentrasjonen: pH = −log[H₃O⁺]."
    },
    {
      question: "Hva er [H₃O⁺] i en løsning med pH = 3?",
      options: ["3 M", "0,001 M", "0,003 M", "1000 M"],
      correct: 1,
      explanation: "[H₃O⁺] = 10⁻ᵖᴴ = 10⁻³ = 0,001 M."
    },
    {
      question: "Hvilken er den konjugerte basen til HSO₄⁻?",
      options: ["H₂SO₄", "SO₄²⁻", "SO₃²⁻", "H₃O⁺"],
      correct: 1,
      explanation: "Når HSO₄⁻ avgir et proton, dannes SO₄²⁻. Det er den konjugerte basen."
    },
    {
      question: "En buffer lages av 0,20 M eddiksyre og 0,10 M natriumacetat. pKa = 4,74. Hva er pH?",
      options: ["4,44", "4,74", "5,04", "5,44"],
      correct: 0,
      explanation: "pH = pKa + log([A⁻]/[HA]) = 4,74 + log(0,10/0,20) = 4,74 + log(0,5) = 4,74 − 0,30 = 4,44."
    },
    {
      question: "Hva er en flerprotisk syre?",
      options: [
        "En syre med flere Ka-verdier",
        "En syre som kan avgi mer enn ett proton",
        "En syre som løses i flere løsemidler",
        "Både A og B er riktige"
      ],
      correct: 3,
      explanation: "En flerprotisk syre kan avgi mer enn ett proton (f.eks. H₂SO₄, H₃PO₄), og har én Ka-verdi for hvert protolysesteg."
    },
    {
      question: "Hva er pH i en 0,10 M løsning av NaCl?",
      options: ["7", "Under 7", "Over 7", "Kan ikke beregnes"],
      correct: 0,
      explanation: "NaCl er et salt av sterk syre (HCl) og sterk base (NaOH). Verken Na⁺ eller Cl⁻ påvirker pH. pH = 7."
    },
    {
      question: "Hva er bufferkapasitet?",
      options: [
        "Mengden buffer man kan lage",
        "Mengden syre/base en buffer kan nøytralisere før pH endres vesentlig",
        "Konsentrasjonen av bufferen",
        "pH-verdien til bufferen"
      ],
      correct: 1,
      explanation: "Bufferkapasitet er mengden sterk syre eller base som kan tilsettes før pH endres mer enn én enhet."
    },
    {
      question: "Bikarbonatbufferen i blodet: CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. Hva skjer hvis man hyperventilerer?",
      options: [
        "pH i blodet synker",
        "pH i blodet stiger",
        "pH forblir uendret",
        "CO₂ øker i blodet"
      ],
      correct: 1,
      explanation: "Hyperventilering fjerner CO₂. Likevekten forskyves mot venstre → [H⁺] synker → pH stiger (respiratorisk alkalose)."
    },
    {
      question: "Hva er den konjugerte syren til H₂O?",
      options: ["OH⁻", "H₃O⁺", "H₂", "O₂"],
      correct: 1,
      explanation: "Når H₂O tar opp et proton, dannes H₃O⁺ (oksoniumionet). Det er den konjugerte syren til H₂O."
    },
    {
      question: "Saltsyre (HCl) er en monoprotisk syre. Hva betyr det?",
      options: [
        "Den kan avgi ett proton per molekyl",
        "Den har bare én Cl-atom",
        "Den er den eneste sterke syren",
        "Den reagerer bare med én type base"
      ],
      correct: 0,
      explanation: "Monoprotisk betyr at syren kan avgi kun ett proton (H⁺) per molekyl."
    },
    {
      question: "Ved titrering av svak base med sterk syre – hva er pH ved ekvivalenspunktet?",
      options: ["Over 7", "Nøyaktig 7", "Under 7", "Lik pKb"],
      correct: 2,
      explanation: "Ved ekvivalenspunktet er all base omdannet til sin konjugerte syre (BH⁺), som er sur. Derfor pH < 7."
    },
    {
      question: "Fosforsyre (H₃PO₄) er en triprotisk syre. Hvor mange Ka-verdier har den?",
      options: ["1", "2", "3", "4"],
      correct: 2,
      explanation: "En triprotisk syre har tre protolysesteg og dermed tre Ka-verdier (Ka1, Ka2, Ka3)."
    },
    {
      question: "Hva er typisk pH i magesaft?",
      options: ["1–2", "4–5", "7", "8–9"],
      correct: 0,
      explanation: "Magesaften inneholder saltsyre (HCl) og har pH mellom 1 og 2."
    },
    {
      question: "En løsning har pOH = 3. Hva er pH?",
      options: ["3", "7", "11", "14"],
      correct: 2,
      explanation: "pH + pOH = 14 → pH = 14 − 3 = 11."
    }
  ],

  trueFalse: [
    {
      statement: "Eddiksyre (CH₃COOH) er en sterk syre.",
      correct: false,
      explanation: "Eddiksyre er en svak syre med Ka ≈ 1,8 × 10⁻⁵. Den protolyserer bare delvis i vann."
    },
    {
      statement: "pH + pOH = 14 gjelder alltid, uansett temperatur.",
      correct: false,
      explanation: "pH + pOH = 14 gjelder bare ved 25 °C. Ved andre temperaturer er Kw annerledes, og summen endres."
    },
    {
      statement: "En nøytral løsning har alltid pH = 7.",
      correct: false,
      explanation: "pH = 7 gjelder kun ved 25 °C. Ved høyere temperatur er Kw større, og nøytral pH er lavere enn 7."
    },
    {
      statement: "Vann er et amfotært stoff.",
      correct: true,
      explanation: "Vann kan både avgi proton (syre: H₂O → OH⁻ + H⁺) og ta opp proton (base: H₂O + H⁺ → H₃O⁺)."
    },
    {
      statement: "Ka · Kb = Kw for et konjugert syre-base-par.",
      correct: true,
      explanation: "For et konjugert syre-base-par (f.eks. CH₃COOH/CH₃COO⁻) er produktet av Ka og Kb alltid lik Kw."
    },
    {
      statement: "En buffer med pH = pKa har størst bufferkapasitet.",
      correct: true,
      explanation: "Når pH = pKa er [HA] = [A⁻], og bufferen har like stor evne til å nøytralisere både syre og base."
    },
    {
      statement: "HCl protolyserer fullstendig i vann.",
      correct: true,
      explanation: "HCl er en sterk syre. Alle HCl-molekyler avgir sitt proton til vann: HCl + H₂O → H₃O⁺ + Cl⁻."
    },
    {
      statement: "Ved ekvivalenspunktet i en titrering er alltid pH = 7.",
      correct: false,
      explanation: "pH = 7 ved ekvivalenspunktet gjelder bare for sterk syre + sterk base. For svak syre/base er pH ≠ 7."
    },
    {
      statement: "En løsning med pH = 5 har 100 ganger høyere [H₃O⁺] enn en løsning med pH = 7.",
      correct: true,
      explanation: "pH er logaritmisk. Forskjell på 2 pH-enheter betyr 10² = 100 ganger forskjell i [H₃O⁺]."
    },
    {
      statement: "NaOH er en Brønsted-base fordi den tar opp protoner.",
      correct: false,
      explanation: "NaOH er en base, men den virker ved å frigi OH⁻-ioner i vann. Det er OH⁻ som tar opp protoner (H⁺ + OH⁻ → H₂O)."
    },
    {
      statement: "Jo lavere pKa-verdi, desto sterkere er syren.",
      correct: true,
      explanation: "pKa = −log(Ka). Lav pKa betyr høy Ka, som betyr at syren protolyserer i større grad."
    },
    {
      statement: "Saltsyre og salpetersyre er begge sterke syrer.",
      correct: true,
      explanation: "Både HCl og HNO₃ protolyserer fullstendig i vann og regnes som sterke syrer."
    },
    {
      statement: "En buffer kan motstå ubegrenset med tilsatt syre.",
      correct: false,
      explanation: "En buffer har begrenset kapasitet. Når all konjugert base er brukt opp, kan ikke bufferen lenger motstå syretilsetning."
    },
    {
      statement: "Fenolftalein er fargeløs i sure løsninger og rosa/lilla i basiske løsninger.",
      correct: true,
      explanation: "Fenolftalein er fargeløs under pH ≈ 8,2 og rosa/lilla over pH ≈ 10."
    },
    {
      statement: "I halvtitrerpunktet er pH = pKa for en svak syre.",
      correct: true,
      explanation: "Ved halvtitrerpunktet er [HA] = [A⁻]. Henderson-Hasselbalch gir pH = pKa + log(1) = pKa."
    }
  ]
};

// Eksporter for bruk i app.js
if (typeof window !== 'undefined') {
  window.SYRER_OG_BASER = SYRER_OG_BASER;
}
