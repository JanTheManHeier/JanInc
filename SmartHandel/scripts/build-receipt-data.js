#!/usr/bin/env node
// SmartHandel - Build Receipt Data
// Reads all Coop receipt PDFs, parses them through CoopReceiptParser,
// and outputs receipt-data.js with pre-parsed data for IndexedDB seeding.

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// --- Inline the parser functions (from db.js and coop-receipt-parser.js) ---

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\d+\s*(g|kg|ml|l|cl|dl|stk|pk)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function categorizeItemToDo(name) {
  const lower = name.toLowerCase();
  // Store-layout overrides
  if (/kaviar/i.test(lower)) return 'Kjøtt og Ost';
  if (/melange|flytende\s*marg/i.test(lower)) return 'Kjøtt og Ost';
  if (/(?:^|\s)egg(?:\s|$)/i.test(lower)) return 'Kjøtt og Ost';
  if (/salami|jubelsalam|grilstad/i.test(lower)) return 'Kjøtt og Ost';
  if (/fiskepinn/i.test(lower)) return 'Frysevarer';
  if (/(?:^|\s)laks(?:\s|$)|laksefilet/i.test(lower) && !/røkelaks/i.test(lower)) return 'Frysevarer';
  if (/baguett(?:er|e)?(?:\s|$)/i.test(lower) && !/surdeig/i.test(lower)) return 'Frysevarer';
  if (/pizzaost/i.test(lower)) return 'Kjøtt og Ost';
  if (/pizzaark/i.test(lower)) return 'Tørrvarer';
  if (/aluminiumsfolie|gladpak|stekepapir|brødpose|lynlåspose/i.test(lower)) return 'Tørrvarer';
  if (/kakao\s*pulver/i.test(lower)) return 'Tørrvarer';
  if (/vaffelrøre|pannekakerøre/i.test(lower)) return 'Bakevarer';
  if (/hund|frolic|dogmann|tygger|chew\s*roll|hundedigg|doggy/i.test(lower)) return 'Hund';
  if (/tran(?:\s|$)|møllers|sanasol|vitamin|omega|d-vitamin|c.?vitamin|jern\s*tab/i.test(lower)) return 'Tran og Sanasol';
  if (/jif|zalo|ajax|klorin|rengjør|vaskemiddel|oppvask|skyllemiddel|avfallspose|plastfolie|aluminiumsfolie|tøyvask|milo|mr\.?\s*muscle|sun\s+maskin|finish\s*(aio|tab|quant|maskin)|fairy|änglamark\s*color/i.test(lower)) return 'Rengjøringsartikler';
  if (/tannkrem|tannbørste|tannb|colg|sjampo|sham|balsam|dusjsåpe|håndsåpe|deodorant|zend|barberhøvel|barber|toalettpapir|tørkepapir|serviett|bind\s|tampon|q-?tips|plaster|vat|fresh\+whi|fusion\s*barb|show(?:er|\.)|sun\..*(?:bals|sham)|suns\.|bomullspad|libr.*normal/i.test(lower)) return 'Hygiene';
  if (/yum\s*yum|mr\.?\s*lee|koppnud|mama.*nudler/i.test(lower)) return 'Andre tørrvarer';
  if (/nacho|tortilla(?!\s*mix)|taco|guacam|salsa|fajita|dip\s*mix|burrito|enchil|jalapeno/i.test(lower)) return 'Tørrvarer';
  if (/sjokolade|melkesjok|firkløver|freia(?!\s*press)|nidar|kvikk\s*lunsj|påskeegg|påskefig|melkerull|new\s*energy|oreo|(?:^|\s)chips|(?:^|\s)popcorn|poppet|nøtter|godteri|lakris|kjeks|småkaker|vaffel|cheez\s*doodle|kims|potetstick|potetch|potetg|saltsteng|soletti|snacks|maarud|mexican\s*fiesta|tortilla\s*mix|smågodt|cheesy|haribo|bounty|s-merke|vepsebol|squashies|drumstick|makroner|smak\s*makron|minde|helnøtt|bacon\s*snack|kinder/i.test(lower)) return 'Godis';
  if (/spaghetti|barilla|sopps|pasta\b|spansk\s*paprika|sprøstekt|bacalao|saritas|butterchick|tikka\s*mas/i.test(lower)) return 'Tørrvarer';
  if (/frys|frosne|grandiosa|grand\.\s*del|big\s*one|pommes|potetstappe|potetstaver|sprø\s*p\.?frites|fish\s*finger|fiskegrat|pizza(?!gjær|dressing|fyll)/i.test(lower)) return 'Frysevarer';
  if (/avokado|eple(?!juice)|(?:^|\s)banan|appelsin|klementin|(?:^|\s)drue|jordbær|blåbær|(?<!lerum\s)bringebær|(?:^|\s)pære(?:r|\s|$)|(?:^|\s)mango(?!\s*(?:sham|bals|show))|ananas|kiwi(?:\s|$)|sitron(?!\s*pepp)|lime(?:\s|$)|melon|plomme|fersken|nektarin|pink\s*lady/i.test(lower)) return 'Frukt og grønt';
  if (/potet(?!stik|ch|stav|g\.|etg)|(?:^|\s)løk(?:\s|$)|strømpeløk|gulrot|brokkoli|blomkål|tomat(?!ketch|.*pølse)|(?<!spansk\s)paprika(?!krydder)|agurk|(?:^|\s)salat(?!kjøtt)|spinat|(?:^|\s)sopp(?:\s|$)|squash(?!ies)|aubergine|selleri|purre|ingefær|(?:^|\s)chili(?!\s*(?:chip|snack))|grønnkål|ruccola|hjertesalat|mais(?:kolbe|brød)|koriand|urter?(?:\s|$)|persille|dill|(?:^|\s)basilikum|kinakål|rosenkål|småpotet/i.test(lower)) return 'Frukt og grønt';
  if (/kylling(?!buljong|.*nudl)|kjøtt(?!kaker\s*premium)|svin(?!nuggets)|(?:^|\s)biff(?:\s|$)|entrecote|(?:^|\s)filet|storfe|lam(?:me)?(?:kjøtt|lår|kotelett)|bacon(?!\s*snack)|lutefisk|skinke(?!t)|pølse(?!brød)|lever(?!postei)|ribbe|kotellett|indrefilet|ytrefilet|lår(?:filet)?|grillpølse|kjøttdeig|kjøttboller|nuggets|wiener|gilde|skjeggerød|løvbiff|salatkjøtt/i.test(lower)) return 'Kjøtt og Ost';
  if (/(?:^|\s)ost(?:\s|$)|norvegia|jarlsberg|mozzarel|parmesan|brunost|kremost|philadelphia|fløtemysost|apetina|revet\s*ost|skorpefri|gulost|hvitost|castello|burgerost|synnnøve|ristor.*mozz|serrano|prosciut/i.test(lower)) return 'Kjøtt og Ost';
  if (/laks|torsk|sei(?:filet)?|reker|makrell|tunfisk|fiskepinn|fiskekak|fiskeboll|laksefilet|fiskek/i.test(lower)) return 'Kjøtt og Ost';
  if (/brød|loff|ciabatta|rundstykk|polarbrød|knekkebrød|kavring|lompe|(?:^|\s)bagett|kneipp|leksands|svalbard|fullkorn(?:\s|brød)|toast|maisbrød|pølsebrød|burgerbrød|focaccia|speltlompe|brioche|landgang|croissant|superbrød|baguette/i.test(lower)) return 'Brødmat';
  if (/leverpostei|pålegg|syltetøy|nugatti|skrella|gifflar|parmaskinke/i.test(lower)) return 'Brødmat';
  if (/melk(?!esjok)|lettm|h-melk|helmelk|skummet|smør|meierismør|bremykt|margarin|melange|vita\s*myk|yogh|kvarg|rømme|lettrøm|fløte|kremfløte|kremtopp|matfløte|crème\s*fraîche|creme\s*fraiche|egg(?:\s|$)|biola|kulturmelk|rislu|go\s*morgen|vanilje(?:\s|$).*(?:uten|190)|00%\s*vanilje/i.test(lower)) return 'Melkeskapet';
  if (/ispinn|iskrem|(?:^|\s)is\s+(?:\d|gl)|b&j|ben\s*&?\s*jerry|half\s*baked|choco.*fud.*brown|magnum/i.test(lower)) return 'Is';
  if (/juice|brus|cola(?:\s|$)|solo(?:\s|$)|fanta(?:\s|$)|(?:^|\s)vann|mineralvann|farris|kaffe|nescafe|friele|presskan|(?:^|\s)te(?:\s|$)|kakao(?:\s|$)|(?:^|\s)øl(?:\s|$)|sunniva|froosh|powerade|litago|pepsi|sprite|smak\s*app|monster|red\s*bull|battery|energi|electrolyte|skinny\s*latte|smoothie|iste|sjokomelk|coca|zero\s*mount|yt\s*rest|isbj/i.test(lower)) return 'Drikke';
  if (/mel(?:is|\s|$)|hvetemel|sammalt|regal\s*hvete|sukker|brunt\s*sukker|gjær|pizzagjær|tørrgjær|bakepulver|vaniljesukker|marsipan|kakao(?:pulver)?|brownies|pannekak/i.test(lower)) return 'Bakevarer';
  if (/ris(?:\s|$)|jasmin|basmati|grøtris|pasta|spaghetti|penne|fusilli|makaroni|tagliatelle|barilla|havregryn|müsli|granola|cornflakes|frokostb|coco\s*po|weetos|nesquik/i.test(lower)) return 'Tørrvarer';
  if (/tomatpur|hermetisk|hakked|kokosnøtt|coconut|cocon|kikerter|bønner.*herm|oliv|tomat\s*flå/i.test(lower)) return 'Tørrvarer';
  if (/olivenolje|rapsolje|smørolje|(?:^|\s)olje|solsikkek/i.test(lower)) return 'Tørrvarer';
  if (/soyasaus|sriracha|ketchup|sennep|majones|aioli|buljong|pesto|bearnaise|peppersaus|strogan|spagh.*saus|tomatketch|grillkrydder|sitronpepp|kanel|krydder|thous.*island|salt(?:\s|$)(?!steng)|pepper(?:\s|$)|jozo|sprøstekt|pizzadress|pizzafyll|jeger\s*gryte|kyllipanne|butterchick|tikka|nora.*sylt|lerum|lasagne/i.test(lower)) return 'Tørrvarer';
  if (/fiskesu|toro(?:\s|$)|amerik.*gryte|bali.*gryte|tand.*gryte|thai\s*gryte/i.test(lower)) return 'Tørrvarer';
  if (/änglamark(?!\s*color)|safari|yum\s*yum/i.test(lower)) return 'Andre tørrvarer';
  if (/vin(?:\s|$)|øl(?:\s|$)|whisky|vodka|gin(?:\s|$)|rum(?:\s|$)|cognac|champagne|prosecco|cider/i.test(lower)) return 'Polet';
  if (/plastpose|pose(?:\s|$)/i.test(lower)) return 'Diverse';
  if (/tennvæske|lighter|stearinlys|fyrstikk|tøynett|bukett|tulipan|isbiter/i.test(lower)) return 'Diverse';
  if (/pant(?:\s|$)/i.test(lower)) return 'Diverse';
  return 'Diverse';
}

// --- CoopReceiptParser (from coop-receipt-parser.js) ---

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
        if (!result.store && trimmed !== 'ELEKTRONISK' && trimmed !== 'KVITTERING' &&
            !trimmed.startsWith('Åpent') && !trimmed.startsWith('Telefon') &&
            !trimmed.startsWith('TELEFON') && !trimmed.includes('COOP NORD') &&
            !trimmed.startsWith('Org.nr') && !trimmed.startsWith('Butikk') &&
            !trimmed.startsWith('Salgskvittering') && !trimmed.match(/^\d{4}\s/)) {
          result.store = 'Coop ' + trimmed;
        }

        const butikkMatch = trimmed.match(/^Butikk\s+(\d+-\d+)/);
        if (butikkMatch) {
          result.storeId = butikkMatch[1];
        }

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
        const totalMatch = trimmed.match(/^Totalt\s*\(?\d+\s+Artikler\)?\s*([\d ]+[.,]\d{2})/);
        if (totalMatch) {
          if (currentItem) { result.items.push(currentItem); currentItem = null; }
          result.total = this._parsePrice(totalMatch[1]);
          state = this.states.DONE;
          i++;
          continue;
        }

        if (this._isMixDealHeader(trimmed, lines, i)) {
          if (currentItem) { result.items.push(currentItem); currentItem = null; }
          const { items: mixItems, endIndex } = this._parseMixDeal(lines, i);
          result.items.push(...mixItems);
          i = endIndex + 1;
          continue;
        }

        if (/^PANT\s+\d/.test(trimmed)) {
          if (currentItem) { result.items.push(currentItem); currentItem = null; }
          i++;
          if (i < lines.length && lines[i].trim().startsWith('Antall:')) i++;
          continue;
        }

        const qtyMatch = trimmed.match(/^Antall:\s+(\d+)\s+stk\s+([\d.,]+)\s+kr\/stk/);
        if (qtyMatch && currentItem) {
          currentItem.quantity = parseInt(qtyMatch[1]);
          currentItem.unitPrice = this._parsePrice(qtyMatch[2]);
          i++;
          continue;
        }

        const weightMatch = trimmed.match(/^([\d.,]+)\s+kg\s+([\d.,]+)\s+kr\/kg/);
        if (weightMatch && currentItem) {
          currentItem.weight = parseFloat(weightMatch[1].replace(',', '.'));
          currentItem.unitPrice = this._parsePrice(weightMatch[2]);
          currentItem.unit = 'kg';
          i++;
          continue;
        }

        const discountMatch = trimmed.match(/^Rabatt:\s+NOK\s+([\d.,]+)\s+\(([\d.,]+)%\s+av\s+([\d .,]+)\)/);
        if (discountMatch && currentItem) {
          currentItem.discountAmount = this._parsePrice(discountMatch[1]);
          currentItem.originalPrice = this._parsePrice(discountMatch[3]);
          i++;
          continue;
        }

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

    if (currentItem) result.items.push(currentItem);

    // Filter out non-item lines that slipped through
    result.items = result.items.filter(item => {
      const n = item.name;
      if (/^(Kupong|Medlems|Sum\s+medl|Totalbeløp|Ordinært|Daglig|Øvrige|Herav|Bank|Spart)/i.test(n)) return false;
      if (/rabatt:?\s*$/i.test(n)) return false;
      if (/^Sum\s/i.test(n)) return false;
      return true;
    });

    for (const item of result.items) {
      if (!item.unitPrice) {
        item.unitPrice = item.quantity > 1 ? item.totalPrice / item.quantity : item.totalPrice;
      }
      item.price = item.totalPrice;
      item.category = categorizeItemToDo(item.name);
      item.normalizedName = normalizeName(item.name);
    }

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
    if (/[\d.,]\d{2}\s*$/.test(trimmed)) return false;
    if (this._isSkipLine(trimmed)) return false;
    if (/^(Antall:|Rabatt:|\d+[.,]\d+\s+kg)/.test(trimmed)) return false;

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

      const sumMixMatch = trimmed.match(/^Sum\s+mix\s+([\d ]+[.,]\d{2})/);
      if (sumMixMatch) {
        sumMix = this._parsePrice(sumMixMatch[1]);
        break;
      }

      // Antall/PANT inside mix deal — skip
      if (/^Antall:/i.test(trimmed)) { i++; continue; }
      if (/^PANT\s/i.test(trimmed)) { i++; continue; }

      const subItemMatch = trimmed.match(/^(.+?)\s*\(\s*([\d.,]+)\)\s*$/);
      if (subItemMatch && !trimmed.startsWith('Sum') && !trimmed.startsWith('Mixrabatt')) {
        subItems.push({
          name: subItemMatch[1].trim(),
          originalPrice: this._parsePrice(subItemMatch[2]),
        });
        i++;
        continue;
      }

      const rabattMatch = trimmed.match(/^Rabatt\s*\(-\s*([\d.,]+)\)/);
      if (rabattMatch) {
        if (subItems.length > 0) {
          subItems[subItems.length - 1].itemDiscount = this._parsePrice(rabattMatch[1]);
        }
        i++;
        continue;
      }

      const sumMatch = trimmed.match(/^Sum\s*\(\s*([\d.,]+)\)/);
      if (sumMatch) {
        sumOriginal = this._parsePrice(sumMatch[1]);
        i++;
        continue;
      }

      const mixRabattMatch = trimmed.match(/^Mixrabatt\s*\(-\s*([\d.,]+)\)/);
      if (mixRabattMatch) {
        mixDiscount = this._parsePrice(mixRabattMatch[1]);
        i++;
        continue;
      }

      i++;
    }

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

// --- Main build logic ---

async function main() {
  const parser = new CoopReceiptParser();
  const pdfDir = path.join(__dirname, '..', 'data', 'coop-receipts');
  const outputFile = path.join(__dirname, '..', 'receipt-data.js');

  const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf')).sort();
  console.log(`Found ${files.length} PDF receipts in ${pdfDir}`);

  const receipts = [];
  const allPurchases = [];
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(pdfDir, file);
    try {
      const buffer = fs.readFileSync(filePath);
      const data = await pdf(buffer);
      const text = data.text;

      if (!text || text.trim().length < 50) {
        console.log(`  SKIP (no text): ${file}`);
        skipped++;
        continue;
      }

      const parsed = parser.parse(text);

      if (!parsed.date || !parsed.store || parsed.items.length === 0) {
        console.log(`  SKIP (parse failed): ${file} - store=${parsed.store}, date=${parsed.date}, items=${parsed.items.length}`);
        skipped++;
        continue;
      }

      const receiptIdx = receipts.length;
      receipts.push({
        store: parsed.store,
        storeId: parsed.storeId,
        date: parsed.date,
        receiptNumber: parsed.receiptNumber,
        total: parsed.total,
        savings: parsed.savings,
        memberNumber: parsed.memberNumber,
        itemCount: parsed.items.length,
        sourceFile: file,
      });

      for (const item of parsed.items) {
        allPurchases.push({
          receiptIdx,
          itemName: item.name,
          normalizedName: item.normalizedName,
          price: item.price,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          weight: item.weight,
          unit: item.unit,
          category: item.category,
          date: parsed.date,
          store: parsed.store,
          originalPrice: item.originalPrice,
          discountAmount: item.discountAmount,
          mixDeal: item.mixDeal,
        });
      }

      console.log(`  OK: ${file} -> ${parsed.store} ${parsed.date} (${parsed.items.length} items, ${parsed.total} kr)`);
    } catch (err) {
      console.log(`  ERROR: ${file} - ${err.message}`);
      skipped++;
    }
  }

  console.log(`\nParsed ${receipts.length} receipts, ${allPurchases.length} items total (${skipped} skipped)`);

  // Sort receipts by date
  const sortedIndices = receipts.map((r, i) => i).sort((a, b) => receipts[a].date.localeCompare(receipts[b].date));
  const sortedReceipts = sortedIndices.map(i => receipts[i]);
  const indexMap = {};
  sortedIndices.forEach((oldIdx, newIdx) => { indexMap[oldIdx] = newIdx; });
  const sortedPurchases = allPurchases.map(p => ({ ...p, receiptIdx: indexMap[p.receiptIdx] }));
  // Sort purchases by date then by name
  sortedPurchases.sort((a, b) => a.date.localeCompare(b.date) || a.itemName.localeCompare(b.itemName));

  // Generate output
  const output = `// SmartHandel - Pre-parsed Receipt Data
// Generated ${new Date().toISOString()} by scripts/build-receipt-data.js
// ${sortedReceipts.length} receipts, ${sortedPurchases.length} purchase items
//
// Usage: Include this file before app.js. Call loadReceiptData() to seed IndexedDB.

const RECEIPT_DATA = ${JSON.stringify({ receipts: sortedReceipts, purchases: sortedPurchases }, null, 2)};

/**
 * Import pre-parsed receipt data into IndexedDB.
 * Skips receipts that already exist (matched by receiptNumber + date).
 * @returns {Promise<{receipts: number, purchases: number}>} Count of newly imported records.
 */
async function loadReceiptData() {
  if (!RECEIPT_DATA || !RECEIPT_DATA.receipts.length) return { receipts: 0, purchases: 0 };

  const existing = await db.getAllReceipts();
  const existingKeys = new Set(existing.map(r => r.receiptNumber + '|' + r.date));

  let receiptCount = 0;
  let purchaseCount = 0;

  for (let i = 0; i < RECEIPT_DATA.receipts.length; i++) {
    const r = RECEIPT_DATA.receipts[i];
    const key = r.receiptNumber + '|' + r.date;

    if (existingKeys.has(key)) continue;

    const receiptId = await db.addReceipt({
      store: r.store,
      storeId: r.storeId,
      date: r.date,
      receiptNumber: r.receiptNumber,
      total: r.total,
      savings: r.savings,
      memberNumber: r.memberNumber,
      itemCount: r.itemCount,
      importedFrom: 'receipt-data.js',
    });
    receiptCount++;

    const items = RECEIPT_DATA.purchases.filter(p => p.receiptIdx === i);
    const purchases = items.map(p => ({
      receiptId,
      itemName: p.itemName,
      normalizedName: p.normalizedName,
      price: p.price,
      unitPrice: p.unitPrice,
      quantity: p.quantity,
      weight: p.weight,
      unit: p.unit,
      category: p.category,
      date: p.date,
      store: p.store,
      originalPrice: p.originalPrice,
      discountAmount: p.discountAmount,
      mixDeal: p.mixDeal,
    }));

    if (purchases.length > 0) {
      await db.addPurchases(purchases);
      purchaseCount += purchases.length;
    }
  }

  console.log(\`[receipt-data] Imported \${receiptCount} receipts, \${purchaseCount} items\`);
  return { receipts: receiptCount, purchases: purchaseCount };
}
`;

  fs.writeFileSync(outputFile, output, 'utf8');
  console.log(`\nWrote ${outputFile} (${(output.length / 1024).toFixed(1)} KB)`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
