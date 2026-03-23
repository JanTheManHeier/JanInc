// ============================================================================
// SpisSlank — carnivore-science.js
// Renders the science/education view when carnivore mode is active:
// mechanism cards, food arsenal table, references, and comparison.
// Depends on: carnivore-pathways.js, translations.js
// ============================================================================

(function () {
  'use strict';

  var PATHWAYS = window.CARNIVORE_PATHWAYS;
  var PATHWAY_ORDER = window.CARNIVORE_PATHWAY_ORDER;
  var FOOD_ARSENAL = window.CARNIVORE_FOOD_ARSENAL;
  var REFERENCES = window.CARNIVORE_REFERENCES;

  var tFn = function (k) { return (window.t || function (x) { return x; })(k); };
  var getLang = window.getLanguage || function () { return 'no'; };

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  function esc(str) {
    var el = document.createElement('span');
    el.textContent = str;
    return el.innerHTML;
  }

  function isEN() {
    return getLang() === 'en';
  }

  function renderScoreDots(score, color) {
    var dots = '';
    for (var i = 1; i <= 5; i++) {
      var filled = i <= score;
      dots += '<span class="score-dot' + (filled ? ' filled' : '') + '" ' +
        'style="' + (filled ? 'background:' + color : 'background:transparent;border-color:' + color + '40') + '"' +
        '></span>';
    }
    return dots;
  }

  function renderEvidenceBadge(level) {
    var labelMap = {
      'Sterk': tFn('science.evidenceStrong'),
      'Moderat': tFn('science.evidenceModerate'),
      'Foreløpig': tFn('science.evidencePreliminary')
    };
    var translated = labelMap[level] || tFn('science.evidencePreliminary');
    var cls = 'evidence-badge ';
    if (level === 'Sterk') cls += 'evidence-strong';
    else if (level === 'Moderat') cls += 'evidence-moderate';
    else cls += 'evidence-preliminary';
    return '<span class="' + cls + '">' + esc(translated) + '</span>';
  }

  function renderVariantBadge(variants) {
    if (!variants || !variants.length) return '';
    var hasStrict = variants.indexOf('strict') !== -1;
    var badge = hasStrict ? '🥩' : '🥩+';
    var label = hasStrict
      ? (isEN() ? 'Strict' : 'Strikt')
      : (isEN() ? 'Animal-Based' : 'Animal-Based');
    return '<span class="variant-badge" title="' + esc(label) + '">' + badge + '</span>';
  }

  function refTypeBadge(type) {
    var labels = { book: '📖', study: '📊', research: '🔬' };
    var icon = labels[type] || '📄';
    return '<span class="ref-type">' + icon + ' ' + esc(type) + '</span>';
  }

  // -------------------------------------------------------------------------
  // Section 1: Introduction
  // -------------------------------------------------------------------------

  function renderIntroSection() {
    return '' +
      '<section class="science-block" aria-labelledby="carnivore-intro-heading">' +
        '<h2 id="carnivore-intro-heading" class="science-heading">' +
          esc(tFn('carnivore.scienceTitle')) +
        '</h2>' +
        '<p class="science-intro">' +
          esc(tFn('carnivore.scienceIntro')) +
        '</p>' +
        '<aside class="disclaimer warning-box" role="note" aria-label="' +
          (isEN() ? 'Disclaimer' : 'Ansvarsfraskrivelse') + '">' +
          '<p>' + esc(tFn('carnivore.disclaimer')) + '</p>' +
        '</aside>' +
      '</section>';
  }

  // -------------------------------------------------------------------------
  // Section 2: Mechanism Cards
  // -------------------------------------------------------------------------

  function renderMechanismSection() {
    var cards = PATHWAY_ORDER.map(function (pid) {
      var pw = PATHWAYS[pid];
      if (!pw) return '';

      var name = isEN() ? pw.nameEN : pw.name;
      var desc = isEN() ? pw.descriptionEN : pw.description;
      var foods = pw.keyFoods.slice(0, 5).map(esc).join(', ');

      return '' +
        '<div class="carnivore-mechanism-card" style="border-left-color:' + pw.color + '">' +
          '<div class="mechanism-header">' +
            '<span class="mechanism-icon" aria-hidden="true">' + pw.icon + '</span>' +
            '<h3>' + esc(name) + '</h3>' +
            renderEvidenceBadge(pw.evidenceLevel) +
          '</div>' +
          '<p>' + esc(desc) + '</p>' +
          '<div class="mechanism-foods">' +
            '<strong>' + (isEN() ? 'Key foods:' : 'Nøkkelmatvarer:') + '</strong> ' +
            foods +
          '</div>' +
        '</div>';
    });

    return '' +
      '<section class="science-block" aria-labelledby="carnivore-mechanisms-heading">' +
        '<h2 id="carnivore-mechanisms-heading" class="science-heading">' +
          esc(tFn('carnivore.mechanismsHeading')) +
        '</h2>' +
        '<div class="pathway-grid" role="list" aria-label="' +
          (isEN() ? 'Carnivore mechanisms' : 'Carnivore-mekanismer') + '">' +
          cards.join('') +
        '</div>' +
      '</section>';
  }

  // -------------------------------------------------------------------------
  // Section 3: Food Arsenal Table
  // -------------------------------------------------------------------------

  function renderFoodArsenalSection() {
    // Header row — pathway icons
    var headerCells = '<th class="food-th food-th-name">' +
        (isEN() ? 'Food' : 'Matvare') + '</th>' +
      '<th class="food-th food-th-cat">' +
        (isEN() ? 'Category' : 'Kategori') + '</th>';

    PATHWAY_ORDER.forEach(function (pid) {
      var pw = PATHWAYS[pid];
      var name = isEN() ? pw.nameEN : pw.name;
      headerCells += '<th class="food-th food-th-pathway">' +
        '<span class="th-dot" style="background:' + pw.color + '" title="' + esc(name) + '"></span>' +
        '<span class="th-icon" aria-hidden="true">' + pw.icon + '</span>' +
        '</th>';
    });

    headerCells += '<th class="food-th food-th-variant">' +
      (isEN() ? 'Variant' : 'Variant') + '</th>';

    // Food rows
    var rows = FOOD_ARSENAL.map(function (food) {
      var foodName = isEN() ? food.nameEN : food.name;
      var catName = isEN() ? food.categoryEN : food.category;

      var cells = '<td class="food-td food-td-name">' + esc(foodName) + '</td>' +
        '<td class="food-td food-td-cat">' +
          '<span class="category-badge">' + esc(catName) + '</span>' +
        '</td>';

      PATHWAY_ORDER.forEach(function (pid) {
        var pw = PATHWAYS[pid];
        var score = food.scores[pid] || 0;
        cells += '<td class="food-td food-td-score">' +
          '<div class="score-dots">' + renderScoreDots(score, pw.color) + '</div>' +
          '</td>';
      });

      cells += '<td class="food-td food-td-variant">' +
        renderVariantBadge(food.variant) + '</td>';

      return '<tr>' + cells + '</tr>';
    });

    return '' +
      '<section class="science-block" aria-labelledby="carnivore-food-heading">' +
        '<h2 id="carnivore-food-heading" class="science-heading">' +
          esc(tFn('carnivore.foodHeading')) +
        '</h2>' +
        '<div class="carnivore-food-table food-arsenal-scroll">' +
          '<table class="food-arsenal-table">' +
            '<thead><tr>' + headerCells + '</tr></thead>' +
            '<tbody>' + rows.join('') + '</tbody>' +
          '</table>' +
        '</div>' +
      '</section>';
  }

  // -------------------------------------------------------------------------
  // Section 4: References
  // -------------------------------------------------------------------------

  function renderReferencesSection() {
    var items = REFERENCES.map(function (ref) {
      return '<li>' +
        esc(ref.author) + ' — <em>' + esc(ref.title) + '</em> (' + ref.year + ') ' +
        refTypeBadge(ref.type) +
      '</li>';
    });

    return '' +
      '<section class="science-block" aria-labelledby="carnivore-refs-heading">' +
        '<h2 id="carnivore-refs-heading" class="science-heading">' +
          '📚 ' + esc(tFn('carnivore.referencesHeading')) +
        '</h2>' +
        '<div class="science-references">' +
          '<ul>' + items.join('') + '</ul>' +
        '</div>' +
      '</section>';
  }

  // -------------------------------------------------------------------------
  // Section 5: Comparison — SpisSlank vs Carnivore
  // -------------------------------------------------------------------------

  function renderComparisonSection() {
    var ssTitle = 'SpisSlank';
    var ssDesc = isEN()
      ? 'Mimics weight-loss drugs (GLP-1, PYY) through strategic plant + protein foods'
      : 'Etterligner slankemedisiner (GLP-1, PYY) gjennom strategiske plante- + proteinmatvarer';
    var cvTitle = 'Carnivore';
    var cvDesc = isEN()
      ? 'Eliminates all plants, relies on protein leverage, ketosis, and elimination of antinutrients'
      : 'Eliminerer alle planter, baserer seg på proteinmetthet, ketose og fjerning av antinutrienter';

    return '' +
      '<section class="science-block" aria-labelledby="carnivore-comparison-heading">' +
        '<h2 id="carnivore-comparison-heading" class="science-heading">' +
          (isEN() ? '⚖️ Comparison' : '⚖️ Sammenligning') +
        '</h2>' +
        '<div class="cascade">' +
          '<div class="cascade-column">' +
            '<h3 class="cascade-title" style="color:#22c55e">🥗 ' + esc(ssTitle) + '</h3>' +
            '<p class="science-intro">' + esc(ssDesc) + '</p>' +
          '</div>' +
          '<div class="cascade-column">' +
            '<h3 class="cascade-title" style="color:#f97316">🥩 ' + esc(cvTitle) + '</h3>' +
            '<p class="science-intro">' + esc(cvDesc) + '</p>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  // -------------------------------------------------------------------------
  // Main render function
  // -------------------------------------------------------------------------

  window.renderCarnivoreScienceView = function () {
    var container = document.getElementById('science-content');
    if (!container) return;

    container.innerHTML =
      renderIntroSection() +
      renderMechanismSection() +
      renderFoodArsenalSection() +
      renderReferencesSection() +
      renderComparisonSection();
  };

})();
