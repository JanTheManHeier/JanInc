// SmartHandel - Coop Receipt Parser
// Stateful multi-line parser for Coop electronic receipts (PDF text extraction)

class CoopReceiptParser {
  constructor() {
    this.states = { HEADER: 'HEADER', ITEMS: 'ITEMS', MIX_DEAL: 'MIX_DEAL', DONE: 'DONE' };
  }

  parse(text) {
    const lines = text.split('\n').map(l => l.trimEnd());
    let state = this.states.HEADER;
    const result = {
      store: null,
      storeId: null,
      date: null,
      receiptNumber: null,
      items: [],
      total: null,
      savings: null,
      memberNumber: null,
      rawText: text,
      parsedAt: new Date().toISOString(),
    };

    let currentItem = null;
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) { i++; continue; }

      if (state === this.states.HEADER) {
        // Store name: first non-empty, non-"ELEKTRONISK", non-"KVITTERING" line
        if (!result.store && trimmed !== 'ELEKTRONISK' && trimmed !== 'KVITTERING' &&
            !trimmed.startsWith('Åpent') && !trimmed.startsWith('Telefon') &&
            !trimmed.startsWith('TELEFON') && !trimmed.includes('COOP NORD') &&
            !trimmed.startsWith('Org.nr') && !trimmed.startsWith('Butikk') &&
            !trimmed.startsWith('Salgskvittering') && !trimmed.match(/^\d{4}\s/)) {
          result.store = 'Coop ' + trimmed;
        }

        // Store ID: "Butikk NNNN-NN"
        const butikkMatch = trimmed.match(/^Butikk\s+(\d+-\d+)/);
        if (butikkMatch) {
          result.storeId = butikkMatch[1];
        }

        // Date and receipt number: "Salgskvittering NNNNN DD.MM.YYYY HH:MM"
        const kvittMatch = trimmed.match(/^Salgskvittering\s+(\d+)\s+(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2})/);
        if (kvittMatch) {
          result.receiptNumber = kvittMatch[1];
          const parts = kvittMatch[2].split('.');
          result.date = `${parts[2]}-${parts[1]}-${parts[0]}`;
          state = this.states.ITEMS;
        }
        i++;
        continue;
      }

      if (state === this.states.DONE) break;

      if (state === this.states.ITEMS) {
        // Totalt line — stop parsing items
        const totalMatch = trimmed.match(/^Totalt\s*\(\d+\s+Artikler\)\s*([\d ]+[.,]\d{2})/);
        if (totalMatch) {
          if (currentItem) { result.items.push(currentItem); currentItem = null; }
          result.total = this._parsePrice(totalMatch[1]);
          state = this.states.DONE;
          i++;
          continue;
        }

        // Check for mix deal: current line has no price at end, and next non-empty line has ( price ) pattern
        if (this._isMixDealHeader(trimmed, lines, i)) {
          if (currentItem) { result.items.push(currentItem); currentItem = null; }
          const { items: mixItems, endIndex } = this._parseMixDeal(lines, i);
          result.items.push(...mixItems);
          i = endIndex + 1;
          continue;
        }

        // PANT line — skip
        if (/^PANT\s+\d/.test(trimmed)) {
          if (currentItem) { result.items.push(currentItem); currentItem = null; }
          i++;
          // Skip any following Antall line for PANT
          if (i < lines.length && lines[i].trim().startsWith('Antall:')) i++;
          continue;
        }

        // Quantity continuation: "  Antall: N stk X.XX kr/stk"
        const qtyMatch = trimmed.match(/^Antall:\s+(\d+)\s+stk\s+([\d.,]+)\s+kr\/stk/);
        if (qtyMatch && currentItem) {
          currentItem.quantity = parseInt(qtyMatch[1]);
          currentItem.unitPrice = this._parsePrice(qtyMatch[2]);
          i++;
          continue;
        }

        // Weight continuation: "  X.XXX kg Y.YY kr/kg"
        const weightMatch = trimmed.match(/^([\d.,]+)\s+kg\s+([\d.,]+)\s+kr\/kg/);
        if (weightMatch && currentItem) {
          currentItem.weight = parseFloat(weightMatch[1].replace(',', '.'));
          currentItem.unitPrice = this._parsePrice(weightMatch[2]);
          currentItem.unit = 'kg';
          i++;
          continue;
        }

        // Discount continuation: "  Rabatt: NOK X.XX (Y% av Z.ZZ)"
        const discountMatch = trimmed.match(/^Rabatt:\s+NOK\s+([\d.,]+)\s+\(([\d.,]+)%\s+av\s+([\d .,]+)\)/);
        if (discountMatch && currentItem) {
          currentItem.discountAmount = this._parsePrice(discountMatch[1]);
          currentItem.originalPrice = this._parsePrice(discountMatch[3]);
          i++;
          continue;
        }

        // Simple item line: "NAME  price"
        const itemMatch = trimmed.match(/^(.+?)\s{2,}([\d ]+[.,]\d{2})\s*$/);
        if (itemMatch) {
          if (currentItem) result.items.push(currentItem);
          const name = itemMatch[1].replace(/^¤/, '').trim();
          currentItem = {
            name,
            totalPrice: this._parsePrice(itemMatch[2]),
            unitPrice: null,
            quantity: 1,
            weight: null,
            unit: 'stk',
            originalPrice: null,
            discountAmount: 0,
            mixDeal: null,
          };
          i++;
          continue;
        }

        // Single-space item line fallback: "NAME price" (less common)
        const itemMatch2 = trimmed.match(/^([A-ZÆØÅ¤][A-ZÆØÅ0-9\s.,\/\-\+&%()']+?)\s+([\d]+[.,]\d{2})\s*$/);
        if (itemMatch2 && !this._isSkipLine(trimmed)) {
          if (currentItem) result.items.push(currentItem);
          const name = itemMatch2[1].replace(/^¤/, '').trim();
          currentItem = {
            name,
            totalPrice: this._parsePrice(itemMatch2[2]),
            unitPrice: null,
            quantity: 1,
            weight: null,
            unit: 'stk',
            originalPrice: null,
            discountAmount: 0,
            mixDeal: null,
          };
          i++;
          continue;
        }

        i++;
        continue;
      }
    }

    // Flush last item
    if (currentItem) result.items.push(currentItem);

    // Post-process: set unitPrice where missing, compute price field for DB compatibility
    for (const item of result.items) {
      if (!item.unitPrice) {
        item.unitPrice = item.quantity > 1 ? item.totalPrice / item.quantity : item.totalPrice;
      }
      // price field for DB compatibility (total price paid for this line)
      item.price = item.totalPrice;
      // Categorize
      item.category = categorizeItemToDo(item.name);
      item.normalizedName = normalizeName(item.name);
    }

    // Extract savings from footer
    this._parseSavings(text, result);

    return result;
  }

  _parsePrice(str) {
    return parseFloat(str.replace(/\s/g, '').replace(',', '.'));
  }

  _isSkipLine(line) {
    return /^(Bank|Herav|Dagligvarer|Øvrige|Miljømerket|MVA|Summer|Spart|Medlems|Ordinært|Kupong|Sum\s+medl|Utbytte|Takk\s+for|Bruk\s+Coop|Obs\s+|Retur|Salgs)/i.test(line) ||
           /^(Clerk|Terminal|Contactless|xxxx|AID:|MASTERCARD|Kjøp|Totalbeløp|Godkjent|Authorization|\d{6}\s+\/)/i.test(line) ||
           /^-{3,}/.test(line) ||
           /^\d{10,}/.test(line);
  }

  _isMixDealHeader(trimmed, lines, startIdx) {
    // A mix deal header has no price at the end and is followed by ( price ) sub-items
    if (/[\d.,]\d{2}\s*$/.test(trimmed)) return false;
    if (this._isSkipLine(trimmed)) return false;
    if (/^(Antall:|Rabatt:|\d+[.,]\d+\s+kg)/.test(trimmed)) return false;

    // Look ahead for ( price ) pattern
    for (let j = startIdx + 1; j < Math.min(startIdx + 3, lines.length); j++) {
      const next = lines[j].trim();
      if (/\(\s*[\d.,]+\)\s*$/.test(next) || /\(-\s*[\d.,]+\)\s*$/.test(next)) return true;
      if (next === '') continue;
      break;
    }
    return false;
  }

  _parseMixDeal(lines, startIdx) {
    const dealName = lines[startIdx].trim();
    const subItems = [];
    let sumOriginal = 0;
    let mixDiscount = 0;
    let sumMix = 0;
    let i = startIdx + 1;

    while (i < lines.length) {
      const trimmed = lines[i].trim();

      // "Sum mix NNN.NN" — end of deal
      const sumMixMatch = trimmed.match(/^Sum\s+mix\s+([\d ]+[.,]\d{2})/);
      if (sumMixMatch) {
        sumMix = this._parsePrice(sumMixMatch[1]);
        break;
      }

      // Antall line inside mix deal — skip (informational)
      if (/^Antall:/i.test(trimmed)) { i++; continue; }

      // PANT inside mix deal — skip
      if (/^PANT\s/i.test(trimmed)) { i++; continue; }

      // Sub-item: " NAME( price )" or " NAME ( price )" — \s* before ( to handle PDF extraction
      const subItemMatch = trimmed.match(/^(.+?)\s*\(\s*([\d.,]+)\)\s*$/);
      if (subItemMatch && !trimmed.startsWith('Sum') && !trimmed.startsWith('Mixrabatt')) {
        subItems.push({
          name: subItemMatch[1].trim(),
          originalPrice: this._parsePrice(subItemMatch[2]),
        });
        i++;
        continue;
      }

      // Per-item Rabatt within mix: " Rabatt(- N.NN)" or " Rabatt (- N.NN)"
      const rabattMatch = trimmed.match(/^Rabatt\s*\(-\s*([\d.,]+)\)/);
      if (rabattMatch) {
        if (subItems.length > 0) {
          subItems[subItems.length - 1].itemDiscount = this._parsePrice(rabattMatch[1]);
        }
        i++;
        continue;
      }

      // Sum line: " Sum( NNN.NN )" or " Sum ( NNN.NN )"
      const sumMatch = trimmed.match(/^Sum\s*\(\s*([\d.,]+)\)/);
      if (sumMatch) {
        sumOriginal = this._parsePrice(sumMatch[1]);
        i++;
        continue;
      }

      // Mixrabatt: " Mixrabatt(- NNN.NN)" or " Mixrabatt (- NNN.NN)"
      const mixRabattMatch = trimmed.match(/^Mixrabatt\s*\(-\s*([\d.,]+)\)/);
      if (mixRabattMatch) {
        mixDiscount = this._parsePrice(mixRabattMatch[1]);
        i++;
        continue;
      }

      i++;
    }

    // Distribute the total price proportionally among sub-items
    const items = [];
    const totalOriginal = subItems.reduce((s, si) => s + si.originalPrice, 0);

    for (const sub of subItems) {
      const proportion = totalOriginal > 0 ? sub.originalPrice / totalOriginal : 1 / subItems.length;
      const effectivePrice = Math.round(sumMix * proportion * 100) / 100;

      items.push({
        name: sub.name,
        totalPrice: effectivePrice,
        unitPrice: effectivePrice,
        quantity: 1,
        weight: null,
        unit: 'stk',
        originalPrice: sub.originalPrice,
        discountAmount: sub.originalPrice - effectivePrice,
        mixDeal: dealName,
      });
    }

    return { items, endIndex: i };
  }

  _parseSavings(text, result) {
    const spartMatch = text.match(/^Spart\s+([\d ]+[.,]\d{2})/m);
    if (spartMatch) result.savings = this._parsePrice(spartMatch[1]);

    const memberMatch = text.match(/Medlemsnr\.\s+(\d+)\s*-\s*CoopID\s+(\d+)/);
    if (memberMatch) result.memberNumber = memberMatch[1];
  }
}

// Category mapping: product name keywords → user's 19 To Do shopping categories
// Matches store layout of user's Coop Elverhøy / Tromsø Obs
function categorizeItemToDo(name) {
  const lower = name.toLowerCase();

  // Store-layout overrides: items placed differently than their "logical" category
  // These reflect actual store placement (where you walk to find them)
  if (/kaviar/i.test(lower)) return 'Kjøtt og Ost';           // next to cheese, not brødmat
  if (/melange|flytende\s*marg/i.test(lower)) return 'Kjøtt og Ost'; // next to cheese
  if (/(?:^|\s)egg(?:\s|$)/i.test(lower)) return 'Kjøtt og Ost';    // in meat/dairy section
  if (/salami|jubelsalam|grilstad/i.test(lower)) return 'Kjøtt og Ost'; // deli section
  if (/fiskepinn/i.test(lower)) return 'Frysevarer';          // freezer, not fresh fish
  if (/(?:^|\s)laks(?:\s|$)|laksefilet/i.test(lower) && !/røkelaks/i.test(lower)) return 'Frysevarer'; // frozen fish section
  if (/baguett(?:er|e)?(?:\s|$)/i.test(lower) && !/surdeig/i.test(lower)) return 'Frysevarer'; // frozen baguettes
  if (/pizzaost/i.test(lower)) return 'Kjøtt og Ost';         // cheese section
  if (/pizzaark/i.test(lower)) return 'Tørrvarer';            // dry goods, not freezer
  if (/aluminiumsfolie|gladpak|stekepapir|brødpose|lynlåspose/i.test(lower)) return 'Tørrvarer'; // household aisle with dry goods
  if (/kakao\s*pulver/i.test(lower)) return 'Tørrvarer';      // baking shelf in dry goods
  if (/vaffelrøre|pannekakerøre/i.test(lower)) return 'Bakevarer';   // baking section

  // 15. Hund
  if (/hund|frolic|dogmann|tygger|chew\s*roll|hundedigg|doggy/i.test(lower)) return 'Hund';

  // 14. Tran og Sanasol
  if (/tran(?:\s|$)|møllers|sanasol|vitamin|omega|d-vitamin|c.?vitamin|jern\s*tab/i.test(lower)) return 'Tran og Sanasol';

  // 11. Rengjøringsartikler
  if (/jif|zalo|ajax|klorin|rengjør|vaskemiddel|oppvask|skyllemiddel|avfallspose|plastfolie|aluminiumsfolie|tøyvask|milo|mr\.?\s*muscle|sun\s+maskin|finish\s*(aio|tab|quant|maskin)|fairy|änglamark\s*color/i.test(lower)) return 'Rengjøringsartikler';

  // 10. Hygiene
  if (/tannkrem|tannbørste|tannb|colg|sjampo|sham|balsam|dusjsåpe|håndsåpe|deodorant|zend|barberhøvel|barber|toalettpapir|tørkepapir|serviett|bind\s|tampon|q-?tips|plaster|vat|fresh\+whi|fusion\s*barb|show(?:er|\.)|sun\..*(?:bals|sham)|suns\.|bomullspad|libr.*normal/i.test(lower)) return 'Hygiene';

  // Instant noodles (before meat to prevent "biff" in "YUM YUM BIFF", "kyll" in noodle names)
  if (/yum\s*yum|mr\.?\s*lee|koppnud|mama.*nudler/i.test(lower)) return 'Andre tørrvarer';

  // Taco/tortilla items (before Godis, since "nacho chips" contains "chips")
  if (/nacho|tortilla(?!\s*mix)|taco|guacam|salsa|fajita|dip\s*mix|burrito|enchil|jalapeno/i.test(lower)) return 'Tørrvarer';

  // 12. Godis (must be checked BEFORE Frukt og grønt to prevent "potet" in "potetsticks" matching)
  if (/sjokolade|melkesjok|firkløver|freia(?!\s*press)|nidar|kvikk\s*lunsj|påskeegg|påskefig|melkerull|new\s*energy|oreo|(?:^|\s)chips|(?:^|\s)popcorn|poppet|nøtter|godteri|lakris|kjeks|småkaker|vaffel|cheez\s*doodle|kims|potetstick|potetch|potetg|saltsteng|soletti|snacks|maarud|mexican\s*fiesta|tortilla\s*mix|smågodt|cheesy|haribo|bounty|s-merke|vepsebol|squashies|drumstick|makroner|smak\s*makron|minde|helnøtt|bacon\s*snack|kinder/i.test(lower)) return 'Godis';

  // Tørrvarer brands/patterns (before Frukt to prevent false matches)
  if (/spaghetti|barilla|sopps|pasta\b|spansk\s*paprika|sprøstekt|bacalao|saritas|butterchick|tikka\s*mas/i.test(lower)) return 'Tørrvarer';

  // Frozen ready meals (before Frukt — "GRAND.DEL.SKIN" is frozen pizza)
  // 4. Frysevarer
  if (/frys|frosne|grandiosa|grand\.\s*del|big\s*one|pommes|potetstappe|potetstaver|sprø\s*p\.?frites|fish\s*finger|fiskegrat|pizza(?!gjær|dressing|fyll)/i.test(lower)) return 'Frysevarer';

  // 1. Frukt og grønt
  if (/avokado|eple(?!juice)|(?:^|\s)banan|appelsin|klementin|(?:^|\s)drue|jordbær|blåbær|(?<!lerum\s)bringebær|(?:^|\s)pære(?:r|\s|$)|(?:^|\s)mango(?!\s*(?:sham|bals|show))|ananas|kiwi(?:\s|$)|sitron(?!\s*pepp)|lime(?:\s|$)|melon|plomme|fersken|nektarin|pink\s*lady/i.test(lower)) return 'Frukt og grønt';
  if (/potet(?!stik|ch|stav|g\.|etg)|(?:^|\s)løk(?:\s|$)|strømpeløk|gulrot|brokkoli|blomkål|tomat(?!ketch|.*pølse)|(?<!spansk\s)paprika(?!krydder)|agurk|(?:^|\s)salat(?!kjøtt)|spinat|(?:^|\s)sopp(?:\s|$)|squash(?!ies)|aubergine|selleri|purre|ingefær|(?:^|\s)chili(?!\s*(?:chip|snack))|grønnkål|ruccola|hjertesalat|mais(?:kolbe|brød)|koriand|urter?(?:\s|$)|persille|dill|(?:^|\s)basilikum|kinakål|rosenkål|småpotet/i.test(lower)) return 'Frukt og grønt';

  // 2. Kjøtt og Ost
  if (/kylling(?!buljong|.*nudl)|kjøtt(?!kaker\s*premium)|svin(?!nuggets)|(?:^|\s)biff(?:\s|$)|entrecote|(?:^|\s)filet|storfe|lam(?:me)?(?:kjøtt|lår|kotelett)|bacon(?!\s*snack)|lutefisk|skinke(?!t)|pølse(?!brød)|lever(?!postei)|ribbe|kotellett|indrefilet|ytrefilet|lår(?:filet)?|grillpølse|kjøttdeig|kjøttboller|nuggets|wiener|gilde|skjeggerød|løvbiff|salatkjøtt/i.test(lower)) return 'Kjøtt og Ost';
  if (/(?:^|\s)ost(?:\s|$)|norvegia|jarlsberg|mozzarel|parmesan|brunost|kremost|philadelphia|fløtemysost|apetina|revet\s*ost|skorpefri|gulost|hvitost|castello|burgerost|synnnøve|ristor.*mozz|serrano|prosciut/i.test(lower)) return 'Kjøtt og Ost';
  if (/laks|torsk|sei(?:filet)?|reker|makrell|tunfisk|fiskepinn|fiskekak|fiskeboll|laksefilet|fiskek/i.test(lower)) return 'Kjøtt og Ost';

  // 3. Brødmat
  if (/brød|loff|ciabatta|rundstykk|polarbrød|knekkebrød|kavring|lompe|(?:^|\s)bagett|kneipp|leksands|svalbard|fullkorn(?:\s|brød)|toast|maisbrød|pølsebrød|burgerbrød|focaccia|speltlompe|brioche|landgang|croissant|superbrød|baguette/i.test(lower)) return 'Brødmat';
  if (/leverpostei|pålegg|syltetøy|nugatti|skrella|gifflar|parmaskinke/i.test(lower)) return 'Brødmat';

  // 5. Melkeskapet
  if (/melk(?!esjok)|lettm|h-melk|helmelk|skummet|smør|meierismør|bremykt|margarin|vita\s*myk|yogh|kvarg|rømme|lettrøm|fløte|kremfløte|kremtopp|matfløte|crème\s*fraîche|creme\s*fraiche|biola|kulturmelk|rislu|go\s*morgen|vanilje(?:\s|$).*(?:uten|190)|00%\s*vanilje/i.test(lower)) return 'Melkeskapet';

  // 13. Is (ice cream — NOT Isbjørn beer which is Drikke)
  if (/ispinn|iskrem|(?:^|\s)is\s+(?:\d|gl)|b&j|ben\s*&?\s*jerry|half\s*baked|choco.*fud.*brown|magnum/i.test(lower)) return 'Is';

  // 6. Drikke
  if (/juice|brus|cola(?:\s|$)|solo(?:\s|$)|fanta(?:\s|$)|(?:^|\s)vann|mineralvann|farris|kaffe|nescafe|friele|presskan|(?:^|\s)te(?:\s|$)|kakao(?:\s|$)|(?:^|\s)øl(?:\s|$)|sunniva|froosh|powerade|litago|pepsi|sprite|smak\s*app|monster|red\s*bull|battery|energi|electrolyte|skinny\s*latte|smoothie|iste|sjokomelk|coca|zero\s*mount|yt\s*rest|isbj/i.test(lower)) return 'Drikke';

  // 8. Bakevarer  (baking ingredients)
  if (/mel(?:is|\s|$)|hvetemel|sammalt|regal\s*hvete|sukker|brunt\s*sukker|gjær|pizzagjær|tørrgjær|bakepulver|vaniljesukker|marsipan|kakao(?:pulver)?|brownies|pannekak/i.test(lower)) return 'Bakevarer';

  // 7. Tørrvarer
  if (/ris(?:\s|$)|jasmin|basmati|grøtris|pasta|spaghetti|penne|fusilli|makaroni|tagliatelle|barilla|havregryn|müsli|granola|cornflakes|frokostb|coco\s*po|weetos|nesquik/i.test(lower)) return 'Tørrvarer';
  if (/tomatpur|hermetisk|hakked|kokosnøtt|coconut|cocon|kikerter|bønner.*herm|oliv|tomat\s*flå/i.test(lower)) return 'Tørrvarer';
  if (/olivenolje|rapsolje|smørolje|(?:^|\s)olje|solsikkek/i.test(lower)) return 'Tørrvarer';
  if (/soyasaus|sriracha|ketchup|sennep|majones|aioli|buljong|pesto|bearnaise|peppersaus|strogan|spagh.*saus|tomatketch|grillkrydder|sitronpepp|kanel|krydder|thous.*island|salt(?:\s|$)(?!steng)|pepper(?:\s|$)|jozo|sprøstekt|pizzadress|pizzafyll|jeger\s*gryte|kyllipanne|butterchick|tikka|nora.*sylt|lerum|lasagne/i.test(lower)) return 'Tørrvarer';
  // tortilla/taco items already caught above
  if (/fiskesu|toro(?:\s|$)|amerik.*gryte|bali.*gryte|tand.*gryte|thai\s*gryte/i.test(lower)) return 'Tørrvarer';

  // 9. Andre tørrvarer (instant noodles, misc)
  if (/änglamark(?!\s*color)|safari|yum\s*yum/i.test(lower)) return 'Andre tørrvarer';

  // 16. Polet — alcohol
  if (/vin(?:\s|$)|øl(?:\s|$)|whisky|vodka|gin(?:\s|$)|rum(?:\s|$)|cognac|champagne|prosecco|cider/i.test(lower)) return 'Polet';

  // Misc
  if (/plastpose|pose(?:\s|$)/i.test(lower)) return 'Diverse';
  if (/tennvæske|lighter|stearinlys|fyrstikk|tøynett|bukett|tulipan|isbiter/i.test(lower)) return 'Diverse';
  if (/pant(?:\s|$)/i.test(lower)) return 'Diverse';

  return 'Diverse';
}

const coopParser = new CoopReceiptParser();
