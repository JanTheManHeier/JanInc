// SmartHandel - Receipt Parser
// Parses Norwegian grocery store receipts and extracts items

class ReceiptParser {
  constructor() {
    // Known Norwegian grocery store names
    this.knownStores = [
      'REMA 1000', 'REMA', 'KIWI', 'MENY', 'COOP', 'COOP EXTRA', 'COOP MEGA',
      'COOP OBS', 'COOP PRIX', 'BUNNPRIS', 'JOKER', 'SPAR', 'EUROPRIS',
      'NORMAL', 'NARVESEN', 'DELI DE LUCA', 'ODA',
    ];

    // Lines to skip (headers, footers, metadata)
    this.skipPatterns = [
      /^org\.?\s*nr/i,
      /^tlf/i,
      /^telefon/i,
      /^\s*sum\b/i,
      /^\s*total\b/i,
      /^\s*kontant\b/i,
      /^\s*kort\b/i,
      /^\s*visa\b/i,
      /^\s*master/i,
      /^\s*vipps/i,
      /^\s*rabatt\b/i,
      /^\s*mva\b/i,
      /^\s*mvh/i,
      /^\s*\*{3,}/,
      /^\s*-{3,}/,
      /^\s*={3,}/,
      /^\s*#{3,}/,
      /^kvittering/i,
      /^faktura/i,
      /^bon\s*nr/i,
      /^kasse\s*nr/i,
      /^terminal/i,
      /^ref\.?\s*nr/i,
      /^\s*endring\b/i,
      /^\s*betalt\b/i,
      /^\s*trumf/i,
      /^\s*coop\s*medlem/i,
      /^\s*poeng/i,
      /^\s*du\s+(har\s+)?spart/i,
      /^\s*takk\s+for/i,
      /^\s*velkommen/i,
      /^\s*åpningstider/i,
      /^\s*www\./i,
      /^\s*http/i,
    ];
  }

  parse(text) {
    // Auto-detect Coop receipt format
    if (this.isCoopReceipt(text)) {
      return coopParser.parse(text);
    }

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const result = {
      store: this.detectStore(lines),
      date: this.detectDate(lines),
      items: [],
      total: this.detectTotal(lines),
      rawText: text,
      parsedAt: new Date().toISOString(),
    };

    for (const line of lines) {
      if (this.shouldSkipLine(line)) continue;
      if (this.isStoreName(line)) continue;
      if (this.isDateLine(line)) continue;

      const item = this.parseLine(line);
      if (item) {
        item.category = categorizeItemToDo(item.name);
        item.normalizedName = normalizeName(item.name);
        result.items.push(item);
      }
    }

    return result;
  }

  isCoopReceipt(text) {
    const header = text.slice(0, 500);
    return /COOP\s+(NORD|MIDT|NORDVEST|ØST|SØR|SA)\b/i.test(header) ||
           /Salgskvittering\s+\d+\s+\d{2}\.\d{2}\.\d{4}/i.test(header) ||
           /Butikk\s+\d+-\d+/i.test(header);
  }

  detectStore(lines) {
    for (const line of lines.slice(0, 5)) {
      const upper = line.toUpperCase();
      for (const store of this.knownStores) {
        if (upper.includes(store)) return store;
      }
    }
    // If first non-empty line looks like a store name (all caps, short)
    if (lines.length > 0 && lines[0].length < 30 && lines[0] === lines[0].toUpperCase()) {
      return lines[0];
    }
    return 'Ukjent butikk';
  }

  detectDate(lines) {
    for (const line of lines.slice(0, 10)) {
      // Format: YYYY-MM-DD or DD.MM.YYYY or DD/MM/YYYY
      const match = line.match(/(\d{4}[-/.]\d{2}[-/.]\d{2})|(\d{2}[-/.]\d{2}[-/.]\d{4})/);
      if (match) {
        let dateStr = match[0];
        // Normalize to YYYY-MM-DD
        if (/^\d{2}[-/.]/.test(dateStr)) {
          const parts = dateStr.split(/[-/.]/);
          dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
          dateStr = dateStr.replace(/[/.]/g, '-');
        }
        return dateStr;
      }
    }
    // Default to today
    return new Date().toISOString().split('T')[0];
  }

  detectTotal(lines) {
    for (const line of lines) {
      const match = line.match(/^\s*(sum|total|totalt|å betale)\s+(\d+[.,]\d{2})/i);
      if (match) {
        return parseFloat(match[2].replace(',', '.'));
      }
      // SUM at start, number at end
      const match2 = line.match(/^\s*(sum|total)\b.*?(\d+[.,]\d{2})\s*$/i);
      if (match2) {
        return parseFloat(match2[2].replace(',', '.'));
      }
    }
    return null;
  }

  parseLine(line) {
    // Common patterns:
    // "Item Name          34.90"
    // "Item Name  2x  34.90"
    // "Item Name 500g  34.90"
    // "2 x Item Name    34.90"

    // Try: name followed by price at end
    const priceMatch = line.match(/^(.+?)\s+(-?\d+[.,]\d{2})\s*$/);
    if (priceMatch) {
      let name = priceMatch[1].trim();
      const price = parseFloat(priceMatch[2].replace(',', '.'));

      // Check for quantity prefix: "2 x " or "2x "
      let quantity = 1;
      const qtyMatch = name.match(/^(\d+)\s*[xX*]\s+(.+)/);
      if (qtyMatch) {
        quantity = parseInt(qtyMatch[1]);
        name = qtyMatch[2].trim();
      }

      // Remove trailing quantity/weight info that's not part of name
      // But keep weight info that is part of name (e.g., "Melk 1L")

      if (name.length < 2) return null;
      if (/^\d+$/.test(name)) return null;

      return { name, price, quantity };
    }

    // Try: just a name (no price) - might still be a grocery item
    // Only if it looks like an item name (not too short, not a number)
    if (line.length > 2 && line.length < 50 && !/^\d+$/.test(line) && !this.shouldSkipLine(line)) {
      // Check if it looks like a grocery item (contains letters, reasonable length)
      if (/[a-zA-ZæøåÆØÅ]{2,}/.test(line)) {
        return { name: line, price: 0, quantity: 1 };
      }
    }

    return null;
  }

  shouldSkipLine(line) {
    return this.skipPatterns.some(p => p.test(line));
  }

  isStoreName(line) {
    const upper = line.toUpperCase();
    return this.knownStores.some(s => upper === s);
  }

  isDateLine(line) {
    return /^\d{4}[-/.]\d{2}[-/.]\d{2}/.test(line) || /^\d{2}[-/.]\d{2}[-/.]\d{4}/.test(line);
  }

  categorizeItem(name) {
    return categorizeItemToDo(name);
  }

  // Save parsed receipt and items to DB
  async saveReceipt(parsed) {
    const receipt = {
      store: parsed.store,
      date: parsed.date,
      total: parsed.total,
      itemCount: parsed.items.length,
      rawText: parsed.rawText,
      parsedAt: parsed.parsedAt,
    };

    const receiptId = await db.addReceipt(receipt);

    const purchases = parsed.items.map(item => ({
      receiptId,
      itemName: item.name,
      normalizedName: item.normalizedName,
      price: item.price,
      quantity: item.quantity,
      category: item.category,
      date: parsed.date,
    }));

    await db.addPurchases(purchases);

    // Update item database with new purchase info
    for (const item of parsed.items) {
      const existing = await db.getItem(item.normalizedName);
      if (existing) {
        existing.purchaseCount = (existing.purchaseCount || 0) + 1;
        if (item.price > 0) {
          existing.avgPrice = existing.avgPrice
            ? (existing.avgPrice + item.price) / 2
            : item.price;
        }
        await db.addItem(existing);
      } else {
        await db.addItem({
          normalizedName: item.normalizedName,
          displayName: item.name,
          category: item.category,
          alwaysBuy: false,
          avgPrice: item.price > 0 ? item.price : null,
          purchaseCount: 1,
        });
      }
    }

    return receiptId;
  }

  // Sample receipts for testing
  getSampleReceipts() {
    return [
      {
        name: 'REMA 1000 - Hverdagshandel',
        text: `REMA 1000
Org.nr: 123456789
2024-03-10 14:32

Melk 1L Tine           34.90
Brød Grovt              42.50
Kyllingfilet 500g       89.90
Ris Jasmin 1kg          35.90
Løk Gul 750g            19.90
Paprika Rød             29.90
Coconut Milk 400ml      25.90
Egg 12pk                54.90
Smør Meierismør         39.90
Tomat 6pk               35.90

SUM                    409.60
Kort                   409.60`
      },
      {
        name: 'KIWI - Middag og snacks',
        text: `KIWI
12.03.2024 17:45

Kjøttdeig 400g          59.90
Spaghetti 500g           19.90
Hakkede Tomater          15.90
Løk Gul                  12.90
Hvitløk                  14.90
Parmesan 100g            49.90
Basilikum Fersk          24.90
Agurk                    19.90
Cherrytomater            34.90
Chips Sourcream          39.90
Cola 1.5L                25.90
Sjokolade Melk           35.90

SUM                     354.90
Vipps                   354.90`
      },
      {
        name: 'MENY - Helgehandel',
        text: `MENY
2024-03-15 11:20

Laksfilet 400g          119.90
Sitron                    9.90
Brokkoli                 29.90
Poteter 1kg              19.90
Smør                     39.90
Fløte 3dl               24.90
Hvitvin                 109.90
Baguett Fersk            29.90
Jordbær 250g             49.90
Rømme Lett               24.90
Egg 6pk                  34.90
Ris Basmati              39.90
Kyllingfilet 500g        99.90
Paprika Rød              29.90
Løk Gul                  14.90
Gulrot 750g              19.90
Toalettpapir 8pk         49.90

SUM                     748.30
Kort Visa               748.30`
      },
      {
        name: 'REMA 1000 - Taco-fredag',
        text: `REMA 1000
Org.nr: 123456789
2024-03-22 16:15

Kjøttdeig 400g           54.90
Tacokrydder              15.90
Tortilla 8pk             29.90
Rømme                    19.90
Ost Revet 200g           35.90
Salat Isbergsalat        19.90
Tomat                    24.90
Paprika Rød              29.90
Agurk                    19.90
Løk Rødløk               14.90
Mais Hermetisk           19.90
Salsa Medium             34.90
Guacamole                39.90
Brus Cola 1.5L           25.90
Chips Salsa              39.90
Sjokolade Kvikk Lunsj    19.90

SUM                     446.50
Kort                    446.50`
      },
      {
        name: 'COOP EXTRA - Ukeshandel',
        text: `COOP EXTRA
15.03.2024 10:30

Melk Lett 1L             32.90
Yoghurt Jordbær          19.90
Brød Kneipp              39.90
Leverpostei              29.90
Ost Norvegia 500g        79.90
Epler Røde 6pk           34.90
Bananer                  24.90
Appelsiner 1kg           29.90
Gulrot 750g              19.90
Poteter 2kg              29.90
Kyllingfilet 650g       109.90
Ris Jasmin 1kg           35.90
Pasta Penne 500g         19.90
Hakkede Tomater 2pk      29.90
Tomatpure                14.90
Hvitløk                  14.90
Løk Gul 1kg              24.90
Smør                     42.90
Kaffe Filter 250g        49.90
Havregryn 750g           24.90
Toalettpapir 12pk        69.90
Oppvaskmiddel            29.90

SUM                     788.80
Coop Medlem Spart        42.50
Betalt Kort             746.30`
      }
    ];
  }
}

const receiptParser = new ReceiptParser();
