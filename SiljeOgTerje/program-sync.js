// Felles programfasit for gjesteappen og admin.
(function () {
  function normaliser(program) {
    if (!Array.isArray(program)) return [];

    program.forEach(p => {
      const tekst = `${p.tittel || ''} ${p.sted || ''}`.toLowerCase();
      if (tekst.includes('walter')) {
        Object.assign(p, {
          tid: '14:00', tittel: 'Aperitiff og mingling', sted: 'Walter & Leonard', ikon: '🍸',
          beskrivelse: 'Dick tar imot oss i restauranten i kjelleren på Rødbanken. Her blir det litt aperitiff og forfriskninger mens brudeparet fotograferes.',
          adresse: 'Storgata 65, 9008 Tromsø',
          lat: 69.64909901495177, lng: 18.956037276009752,
          kart: 'https://www.google.com/maps/search/?api=1&query=69.64909901495177%2C18.956037276009752',
          nettside: 'https://walterogleonard.no/',
        });
      } else if (tekst.includes('amtmand') || tekst.includes('minglefest') || tekst.includes('mingling kvelden før')) {
        Object.assign(p, {
          tid: '19:00', dag: 'Fredag 21. august', tittel: 'Minglefest',
          sted: 'Amtmandens Datter', adresse: 'Grønnegata 83, 9008 Tromsø',
          ikon: '🎉', beskrivelse: 'Uformell minglefest kvelden før bryllupet. Kom som du er – vi tar en skål sammen!',
          lat: 69.6507843, lng: 18.9559258,
          kart: 'https://www.google.com/maps/search/?api=1&query=69.6507843%2C18.9559258',
        });
      } else if (tekst.includes('elverhøy') || tekst.includes('elverhoy') || tekst.includes('vielse')) {
        Object.assign(p, {
          tid: '12:00', dag: p.dag || 'Lørdag 22. august',
          tittel: 'Vigsel i Elverhøy kirke', sted: 'Elverhøy kirke',
          adresse: 'Barduvegen 16, 9012 Tromsø', ikon: '💒',
          beskrivelse: 'Vi gifter oss! Møt opp i god tid – dørene åpner 11:30.',
          lat: 69.6484610, lng: 18.9212894,
          kart: 'https://www.google.com/maps/search/?api=1&query=69.6484610%2C18.9212894',
        });
      } else if (tekst.includes('rødbanken') || tekst.includes('rodbanken')) {
        Object.assign(p, {
          sted: p.tittel && /middag|mottakelse|fest/i.test(p.tittel) ? 'Festsalen i Rødbanken' : p.sted,
          adresse: 'Storgata 65, 9008 Tromsø',
          lat: 69.64934760314557, lng: 18.955826114305662,
          kart: 'https://www.google.com/maps/search/?api=1&query=69.64934760314557%2C18.955826114305662',
        });
        if (/middag|mottakelse|fest/i.test(p.tittel || '') && !/bryllupsmiddag|langt på natt/i.test(p.tittel || '')) {
          p.tid = '17:00';
          p.tittel = 'Middag og fest';
          p.ikon = '🏛️';
        }
      }
    });

    // Admininnhold kan inneholde både «Bryllupsmiddag» og «Middag og fest» kl. 17.
    // Slå dem sammen til ett tydelig programpunkt og behold den mest informative teksten.
    const middagKandidater = program
      .map((p, index) => ({ p, index }))
      .filter(({ p }) => /bryllupsmiddag|middag og fest|mottakelse på rødbanken/i.test(p.tittel || ''));
    if (middagKandidater.length) {
      const behold = middagKandidater.find(({ p }) => /bryllupsmiddag/i.test(p.tittel || '')) || middagKandidater[0];
      Object.assign(behold.p, {
        tid: '17:00',
        tittel: 'Middag og fest',
        sted: 'Festsalen i Rødbanken',
        ikon: '🏛️',
        beskrivelse: behold.p.beskrivelse || behold.p.tekst || 'Tre retter, taler og gode historier.',
        adresse: 'Storgata 65, 9008 Tromsø',
        lat: 69.64934760314557,
        lng: 18.955826114305662,
        kart: 'https://www.google.com/maps/search/?api=1&query=69.64934760314557%2C18.955826114305662',
      });
      middagKandidater
        .filter(({ index }) => index !== behold.index)
        .sort((a, b) => b.index - a.index)
        .forEach(({ index }) => program.splice(index, 1));
    }

    const harWalter = program.some(p => /walter\s*(?:&|og)\s*leonard/i.test(`${p.tittel || ''} ${p.sted || ''}`));
    if (!harWalter) {
      const middagIdx = program.findIndex(p => /middag og fest|mottakelse på rødbanken/i.test(p.tittel || ''));
      program.splice(middagIdx >= 0 ? middagIdx : program.length, 0, {
        tid: '14:00', tittel: 'Aperitiff og mingling', sted: 'Walter & Leonard', ikon: '🍸',
        beskrivelse: 'Dick tar imot oss i restauranten i kjelleren på Rødbanken. Her blir det litt aperitiff og forfriskninger mens brudeparet fotograferes.',
        adresse: 'Storgata 65, 9008 Tromsø',
        lat: 69.64909901495177, lng: 18.956037276009752,
        kart: 'https://www.google.com/maps/search/?api=1&query=69.64909901495177%2C18.956037276009752',
        nettside: 'https://walterogleonard.no/',
      });
    }

    if (!program.some(p => /amtmand|minglefest|mingling kvelden før/i.test(`${p.tittel || ''} ${p.sted || ''}`))) {
      program.unshift({
        tid: '19:00', dag: 'Fredag 21. august', tittel: 'Minglefest',
        sted: 'Amtmandens Datter', adresse: 'Grønnegata 83, 9008 Tromsø',
        ikon: '🎉', beskrivelse: 'Uformell minglefest kvelden før bryllupet. Kom som du er – vi tar en skål sammen!',
        lat: 69.6507843, lng: 18.9559258,
        kart: 'https://www.google.com/maps/search/?api=1&query=69.6507843%2C18.9559258',
      });
    }
    if (!program.some(p => /elverhøy|elverhoy|vielse/i.test(`${p.tittel || ''} ${p.sted || ''}`))) {
      const fredagIdx = program.findIndex(p => /minglefest/i.test(p.tittel || ''));
      program.splice(fredagIdx + 1, 0, {
        tid: '12:00', dag: 'Lørdag 22. august', tittel: 'Vigsel i Elverhøy kirke',
        sted: 'Elverhøy kirke', adresse: 'Barduvegen 16, 9012 Tromsø', ikon: '💒',
        beskrivelse: 'Vi gifter oss! Møt opp i god tid – dørene åpner 11:30.',
        lat: 69.6484610, lng: 18.9212894,
        kart: 'https://www.google.com/maps/search/?api=1&query=69.6484610%2C18.9212894',
      });
    }
    if (!program.some(p => /middag og fest|mottakelse på rødbanken/i.test(p.tittel || ''))) {
      program.push({
        tid: '17:00', tittel: 'Middag og fest', sted: 'Festsalen i Rødbanken', ikon: '🏛️',
        beskrivelse: 'Velkomstdrink og mingling i Festsalen i Rødbanken – midt i Tromsø sentrum.',
        adresse: 'Storgata 65, 9008 Tromsø',
        lat: 69.64934760314557, lng: 18.955826114305662,
        kart: 'https://www.google.com/maps/search/?api=1&query=69.64934760314557%2C18.955826114305662',
      });
    }
    return program;
  }

  window.SiljeTerjeProgram = { normaliser };
})();
