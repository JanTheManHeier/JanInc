// SmartHandel - Spending Insights Engine
// Analyzes receipt data to provide spending awareness, category breakdown, and comparisons

// Product equivalence groups — shared with suggestion engine
// [canonical key, patterns]
const PRODUCT_EQUIV = [
  ['brus/cola', [/coca cola/i, /pepsi/i, /solo(?:\s|$)/i, /fanta(?:\s|$)/i]],
  ['makrell i tomat', [/makrell(?!.*nudl|.*makron)/i, /stabbur.*makrell/i, /king.*makrell/i, /k\.o\s*skinnf.*makr/i]],
  ['kjøttdeig', [/kjøttdeig/i]],
  ['kyllingfilet', [/kyllingfil/i, /xtra.*kylling/i, /coop.*lårfilet/i, /grillet kylling/i, /kyllingfil.*naturell/i]],
  ['laksefilet', [/laksefil/i, /coop.*laksefil/i]],
  ['grillpølse', [/grillpølse/i]],
  ['gulost', [/norvegia/i, /synnnøve.*gulost/i, /jarlsberg/i, /burgerost/i, /duopack/i]],
  ['druer', [/drue/i]],
  ['sørlandschips', [/sørl\./i]],
  ['sjokolade', [/freia melkesjok/i, /firkløver/i, /helnøtt/i, /melkesjo\.m/i, /freia.*brown/i]],
  ['lettmelk', [/lettm.*1%/i]],
  ['potetchips', [/potetch/i, /potetstick/i]],
  ['kjøttpølse', [/gilde.*kjøttpølse/i, /(?:^|\s)kjøttpølse/i]],
  ['tortilla', [/tortilla.*[lm]\./i, /s\.m\.tortilla/i, /oep.*tortil/i]],
  ['rømme', [/lettrøm/i, /q-lettrøm/i]],
  ['yoghurt vanilje', [/yogh.*vanilje/i]],
  ['eplejuice', [/sunniva.*eple/i, /smak.*app.*juice/i]],
  ['fiskegrateng', [/fiskegrat/i]],
  ['frossenpizza', [/grandiosa|grand\.\s*del|big\s*one/i]],
  ['hundetygg', [/tyggerulle|tyggerull|chew\s*roll/i]],
  ['hundesnacks', [/hundedigg|frolic/i]],
  ['sjokomelk', [/litago/i, /sjokomelk/i, /tine\s*sjoko/i]],
  ['kims chips', [/kims/i]],
  ['kaviar', [/kaviar/i]],
  ['knekkebrød', [/knekkebrød|kn\.brød|leksands/i]],
  ['ben & jerrys', [/b&j/i, /half\s*baked/i, /choco.*fud/i]],
  ['grytemix', [/toro.*gryte/i, /toro.*kyllipanne/i, /saritas/i]],
  ['øl', [/isbj/i]],
];

function getEquivKey(itemName) {
  for (const [key, patterns] of PRODUCT_EQUIV) {
    if (patterns.some(p => p.test(itemName))) return key;
  }
  return null;
}

class InsightsEngine {
  constructor() {
    // SIFO 2025 reference budget (mat og drikke per month, excl. snacks/alcohol)
    this.sifoMonthly = {
      'Mann 31-50': 4780,
      'Kvinne 31-50': 4040,
      'Gutt 14-17': 4470,
      'Jente 10-13': 3440,
    };
    this.sifoTotal = Object.values(this.sifoMonthly).reduce((s, v) => s + v, 0); // 16730

    // Items that are athlete supplements, not discretionary treats
    this.athleteSupplements = [
      /litago/i, /sjokomelk/i, /sjoko.*melk/i, /tine\s*sjoko/i,  // daughter's training drink
      /powerade/i, /electrolyte/i,  // son's workout drink
    ];

    // Discretionary categories to flag
    this.discretionaryPatterns = {
      'Energidrikk': [/monster/i, /red\s*bull/i, /battery/i, /burn/i],
      'Brus/Soda': [/cola/i, /pepsi/i, /solo(?:\s|$)/i, /fanta/i, /sprite/i, /coca/i, /zero\s*mount/i],
      'Sjokolade': [/sjokolade|melkesjok|firkløver|helnøtt|freia(?!\s*press)|nidar|bounty|kvikk\s*lunsj|påskeegg|påskefig|kinder/i],
      'Chips/Snacks': [/chips|potetstick|potetch|potetg|cheez\s*doodle|kims|maarud|bacon\s*snack|saltsteng|soletti/i],
      'Godteri': [/haribo|smågodt|lakris|minde|s-merke|vepsebol|squashies|drumstick|godteri/i],
      'Is': [/isbj|b&j|ben.*jerry|half\s*baked|choco.*fud|magnum|ispinn|iskrem/i],
      'Ferdigmat/Pizza': [/grandiosa|grand\.\s*del|big\s*one|pizza|fiskegrat/i],
    };
  }

  async generateReport() {
    const receipts = await db.getAllReceipts();
    const purchases = await db.getAllPurchases();

    if (receipts.length === 0 || purchases.length === 0) {
      return null;
    }

    const report = {};

    // Date range
    const dates = receipts.map(r => r.date).filter(Boolean).sort();
    report.dateRange = { from: dates[0], to: dates[dates.length - 1] };
    report.totalReceipts = receipts.length;

    // Calculate months spanned
    const fromDate = new Date(report.dateRange.from);
    const toDate = new Date(report.dateRange.to);
    report.monthsSpanned = Math.max(1, (toDate - fromDate) / (1000 * 60 * 60 * 24 * 30.44));

    // Total spending
    report.totalSpent = receipts.reduce((s, r) => s + (r.total || 0), 0);
    report.avgPerTrip = report.totalSpent / report.totalReceipts;
    report.avgPerMonth = report.totalSpent / report.monthsSpanned;

    // Spending by category
    report.byCategory = this._categoryBreakdown(purchases);

    // Discretionary spending
    report.discretionary = this._discretionaryBreakdown(purchases);

    // Athlete supplement total (excluded from discretionary)
    report.athleteSupplements = this._athleteSupplementTotal(purchases);

    // Top items by total spend
    report.topItems = this._topItems(purchases, 20);

    // Frequency analysis (staples vs one-off)
    report.staples = this._stapleItems(purchases, receipts.length);
    report.oneOffs = this._oneOffItems(purchases);

    // Monthly trend
    report.monthlyTrend = this._monthlyTrend(receipts);

    // SIFO comparison
    report.sifo = this._sifoComparison(report);

    // Savings from Coop
    report.savings = receipts.reduce((s, r) => s + (r.savings || 0), 0);

    return report;
  }

  _categoryBreakdown(purchases) {
    const cats = {};
    for (const p of purchases) {
      const cat = p.category || 'Diverse';
      if (!cats[cat]) cats[cat] = { total: 0, count: 0, itemMap: {} };
      cats[cat].total += p.price || 0;
      cats[cat].count++;
      const key = p.normalizedName || p.itemName.toLowerCase();
      if (!cats[cat].itemMap[key]) cats[cat].itemMap[key] = { name: p.itemName, total: 0, count: 0 };
      cats[cat].itemMap[key].total += p.price || 0;
      cats[cat].itemMap[key].count++;
    }
    const total = Object.values(cats).reduce((s, c) => s + c.total, 0);
    for (const cat of Object.values(cats)) {
      cat.pct = total > 0 ? (cat.total / total) * 100 : 0;
      cat.items = Object.values(cat.itemMap).sort((a, b) => b.total - a.total);
      delete cat.itemMap;
    }
    return cats;
  }

  _discretionaryBreakdown(purchases) {
    const result = {};
    for (const [label, patterns] of Object.entries(this.discretionaryPatterns)) {
      result[label] = { total: 0, count: 0, itemMap: {} };
    }

    for (const p of purchases) {
      if (this._isAthleteSupplement(p.itemName)) continue;

      for (const [label, patterns] of Object.entries(this.discretionaryPatterns)) {
        if (patterns.some(pat => pat.test(p.itemName))) {
          result[label].total += p.price || 0;
          result[label].count++;
          const key = p.normalizedName || p.itemName.toLowerCase();
          if (!result[label].itemMap[key]) result[label].itemMap[key] = { name: p.itemName, total: 0, count: 0 };
          result[label].itemMap[key].total += p.price || 0;
          result[label].itemMap[key].count++;
          break;
        }
      }
    }

    // Convert itemMaps to sorted arrays, sort groups by total descending
    const sorted = Object.entries(result)
      .filter(([_, v]) => v.total > 0)
      .map(([k, v]) => {
        v.items = Object.values(v.itemMap).sort((a, b) => b.total - a.total);
        delete v.itemMap;
        return [k, v];
      })
      .sort((a, b) => b[1].total - a[1].total);

    return Object.fromEntries(sorted);
  }

  _isAthleteSupplement(name) {
    return this.athleteSupplements.some(pat => pat.test(name));
  }

  _athleteSupplementTotal(purchases) {
    let total = 0;
    let count = 0;
    for (const p of purchases) {
      if (this._isAthleteSupplement(p.itemName)) {
        total += p.price || 0;
        count++;
      }
    }
    return { total, count };
  }

  _topItems(purchases, limit) {
    const items = {};
    for (const p of purchases) {
      const key = p.normalizedName || p.itemName.toLowerCase();
      if (!items[key]) items[key] = { name: p.itemName, total: 0, count: 0, category: p.category };
      items[key].total += p.price || 0;
      items[key].count++;
    }
    return Object.values(items)
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  }

  _stapleItems(purchases, receiptCount) {
    const items = {};
    const receiptSets = {};
    for (const p of purchases) {
      const key = p.normalizedName || p.itemName.toLowerCase();
      if (!items[key]) {
        items[key] = { name: p.itemName, total: 0, count: 0, category: p.category, receipts: new Set() };
      }
      items[key].total += p.price || 0;
      items[key].count++;
      if (p.receiptId) items[key].receipts.add(p.receiptId);
    }

    // Staples: appear in >25% of receipts
    const threshold = Math.max(2, receiptCount * 0.25);
    return Object.values(items)
      .filter(i => i.receipts.size >= threshold)
      .map(i => ({ ...i, frequency: i.receipts.size, receipts: undefined }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  _oneOffItems(purchases) {
    const items = {};
    for (const p of purchases) {
      const key = getEquivKey(p.itemName) || p.normalizedName || p.itemName.toLowerCase();
      if (!items[key]) items[key] = { name: p.itemName, total: 0, count: 0, category: p.category };
      items[key].total += p.price || 0;
      items[key].count++;
    }
    return Object.values(items)
      .filter(i => i.count === 1 && i.total > 30)
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);
  }

  _monthlyTrend(receipts) {
    const months = {};
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
    for (const r of receipts) {
      if (!r.date || !r.total) continue;
      const d = new Date(r.date);
      const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      const label = monthNames[d.getMonth()] + ' ' + d.getFullYear();
      if (!months[key]) months[key] = { key, label, total: 0, trips: 0 };
      months[key].total += r.total;
      months[key].trips++;
    }
    return Object.values(months).sort((a, b) => a.key.localeCompare(b.key));
  }

  _sifoComparison(report) {
    const monthlySpend = report.avgPerMonth;

    // Estimate food-only spending (exclude Hygiene, Rengjøring, Hund, Diverse, Godis, Is)
    const nonFoodCategories = ['Hygiene', 'Rengjøringsartikler', 'Hund', 'Diverse', 'Godis', 'Is'];
    const cats = report.byCategory;
    let foodSpend = 0;
    let nonFoodSpend = 0;
    for (const [cat, data] of Object.entries(cats)) {
      if (nonFoodCategories.includes(cat)) {
        nonFoodSpend += data.total;
      } else {
        foodSpend += data.total;
      }
    }

    const foodMonthly = foodSpend / report.monthsSpanned;
    const sifoMonthly = this.sifoTotal;
    const diff = foodMonthly - sifoMonthly;
    const pct = ((foodMonthly / sifoMonthly) - 1) * 100;

    return {
      yourFoodMonthly: foodMonthly,
      sifoMonthly,
      sifoBreakdown: this.sifoMonthly,
      diff,
      pct,
      totalMonthly: monthlySpend,
      nonFoodMonthly: nonFoodSpend / report.monthsSpanned,
    };
  }
}

const insightsEngine = new InsightsEngine();
