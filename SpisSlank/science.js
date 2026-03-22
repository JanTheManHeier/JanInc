// ============================================================================
// SpisSlank — science.js
// Renders the science/education view: drug cards, pathway explainers,
// food arsenal table, before/after timeline, and disclaimer.
// Depends on: window.PATHWAYS, window.DRUGS, window.FOOD_ARSENAL (pathways.js)
// ============================================================================

(function () {
  'use strict';

  var PATHWAYS = window.PATHWAYS;
  var DRUGS = window.DRUGS;
  var FOOD_ARSENAL = window.FOOD_ARSENAL;

  var tFn = window.t || function (k) { return k; };

  // Ordered pathway IDs used throughout the view
  var PATHWAY_ORDER = ['glp1', 'gip', 'glucagon', 'amylin', 'pyy', 'leptin', 'ghrelin', 'insulin'];

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  function esc(str) {
    var el = document.createElement('span');
    el.textContent = str;
    return el.innerHTML;
  }

  function renderPathwayPill(pathwayId) {
    var pw = PATHWAYS[pathwayId];
    if (!pw) return '';
    return '<span class="pathway-pill pathway-' + pathwayId + '" ' +
      'style="background:' + pw.color + '22;color:' + pw.color + ';border-color:' + pw.color + '">' +
      esc(pw.name) + '</span>';
  }

  function renderGenBadge(gen) {
    return '<span class="gen-badge gen-badge--' + gen + '">Gen ' + gen + '</span>';
  }

  function renderStatusBadge(status) {
    var label = status === 'Godkjent' ? tFn('science.approved') : tFn('science.phase3');
    var cls = status === 'Godkjent' ? 'status-approved' : 'status-trial';
    return '<span class="status-badge ' + cls + '">' + esc(label) + '</span>';
  }

  function renderEvidenceBadge(level) {
    var labelMap = { 'Sterk': tFn('science.evidenceStrong'), 'Moderat': tFn('science.evidenceModerate') };
    var translated = labelMap[level] || tFn('science.evidencePreliminary');
    var cls = 'evidence-badge ';
    if (level === 'Sterk') cls += 'evidence-strong';
    else if (level === 'Moderat') cls += 'evidence-moderate';
    else cls += 'evidence-preliminary';
    return '<span class="' + cls + '">' + esc(translated) + '</span>';
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

  // Find the top foods that best cover a drug's targeted pathways
  function findFoodEquivalents(drug) {
    var targetPathways = drug.pathways;
    var scored = FOOD_ARSENAL.map(function (food) {
      var sum = 0;
      targetPathways.forEach(function (pid) {
        sum += (food.pathwayScores[pid] || 0);
      });
      return { food: food, score: sum };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, 3).map(function (s) { return s.food; });
  }

  // Find drugs that target a specific pathway
  function drugsForPathway(pathwayId) {
    return DRUGS.filter(function (d) {
      return d.pathways.indexOf(pathwayId) !== -1;
    });
  }

  // Find top foods for a pathway (score >= 3)
  function topFoodsForPathway(pathwayId) {
    return FOOD_ARSENAL.filter(function (f) {
      return (f.pathwayScores[pathwayId] || 0) >= 3;
    }).sort(function (a, b) {
      return (b.pathwayScores[pathwayId] || 0) - (a.pathwayScores[pathwayId] || 0);
    });
  }

  // -------------------------------------------------------------------------
  // Section 1: Drug cards
  // -------------------------------------------------------------------------

  function renderDrugSection() {
    var sorted = DRUGS.slice().sort(function (a, b) { return a.generation - b.generation; });

    var cards = sorted.map(function (drug) {
      var pills = drug.pathways.map(renderPathwayPill).join(' ');
      var foods = findFoodEquivalents(drug);
      var foodNames = foods.map(function (f) { return esc(f.nameNO); }).join(', ');

      return '' +
        '<article class="drug-card" role="listitem">' +
          '<div class="drug-card-top">' +
            renderGenBadge(drug.generation) +
            renderStatusBadge(drug.status) +
          '</div>' +
          '<h3 class="drug-name">' + esc(drug.name) + '</h3>' +
          '<span class="drug-brand">' + esc(drug.brand) + '</span>' +
          '<p class="drug-mechanism">' + esc(drug.mechanism) + '</p>' +
          '<div class="drug-pathways">' + pills + '</div>' +
          '<div class="drug-weight-loss">' +
            '<span class="weight-loss-label">' + esc(tFn('science.weightLoss')) + ':</span> ' +
            '<strong class="weight-loss-value">' + esc(drug.weightLoss) + '</strong>' +
          '</div>' +
          '<div class="drug-food-arrow">' +
            '<span class="arrow-icon" aria-hidden="true">↓</span>' +
            '<span class="arrow-label">Matbasert alternativ</span>' +
            '<span class="arrow-foods">' + foodNames + '</span>' +
          '</div>' +
        '</article>';
    });

    return '' +
      '<section class="science-block" aria-labelledby="science-drugs-heading">' +
        '<h2 id="science-drugs-heading" class="science-heading">' + esc(tFn('science.drugsHeading')) + '</h2>' +
        '<p class="science-intro">' +
          esc(tFn('science.drugsIntro')) +
        '</p>' +
        '<div class="drug-card-scroll">' +
          '<div class="drug-card-grid" role="list" aria-label="Oversikt over slankemedisiner">' +
            cards.join('') +
          '</div>' +
        '</div>' +
      '</section>';
  }

  // -------------------------------------------------------------------------
  // Section 2: 8 Pathways
  // -------------------------------------------------------------------------

  function renderPathwaySection() {
    var cards = PATHWAY_ORDER.map(function (pid) {
      var pw = PATHWAYS[pid];
      if (!pw) return '';

      var drugs = drugsForPathway(pid);
      var drugList = drugs.length > 0
        ? drugs.map(function (d) { return esc(d.brand); }).join(', ')
        : 'Ingen godkjente medisiner';

      var foods = topFoodsForPathway(pid);
      var foodList = foods.length > 0
        ? foods.slice(0, 5).map(function (f) { return esc(f.nameNO); }).join(', ')
        : pw.keyFoods.slice(0, 5).map(esc).join(', ');

      return '' +
        '<article class="pathway-card" role="listitem">' +
          '<div class="pathway-card-header">' +
            '<span class="pathway-icon" style="background:' + pw.color + '">' +
              '<span aria-hidden="true">' + pw.icon + '</span>' +
            '</span>' +
            '<div>' +
              '<h3 class="pathway-name">' + esc(pw.name) + '</h3>' +
              renderEvidenceBadge(pw.evidenceLevel) +
            '</div>' +
          '</div>' +
          '<p class="pathway-desc">' + esc(pw.description) + '</p>' +
          '<div class="pathway-detail-row">' +
            '<span class="detail-label">💊 Medisiner:</span> ' +
            '<span class="detail-value">' + drugList + '</span>' +
          '</div>' +
          '<div class="pathway-detail-row">' +
            '<span class="detail-label">🥗 Matvarer:</span> ' +
            '<span class="detail-value">' + foodList + '</span>' +
          '</div>' +
        '</article>';
    });

    return '' +
      '<section class="science-block" aria-labelledby="science-pathways-heading">' +
        '<h2 id="science-pathways-heading" class="science-heading">' + esc(tFn('science.pathwaysHeading')) + '</h2>' +
        '<p class="science-intro">' +
          esc(tFn('science.pathwaysIntro')) +
        '</p>' +
        '<div class="pathway-grid" role="list" aria-label="De åtte metthetsveiene">' +
          cards.join('') +
        '</div>' +
      '</section>';
  }

  // -------------------------------------------------------------------------
  // Section 3: Food Arsenal table
  // -------------------------------------------------------------------------

  function renderFoodArsenalSection() {
    // Header row with pathway color dots
    var headerCells = '<th class="food-th food-th-name">Matvare</th>' +
      '<th class="food-th food-th-cat">Kategori</th>';

    PATHWAY_ORDER.forEach(function (pid) {
      var pw = PATHWAYS[pid];
      headerCells += '<th class="food-th food-th-pathway">' +
        '<span class="th-dot" style="background:' + pw.color + '" title="' + esc(pw.name) + '"></span>' +
        '<span class="th-label">' + esc(pw.name) + '</span>' +
        '</th>';
    });

    headerCells += '<th class="food-th food-th-store">Avdeling</th>' +
      '<th class="food-th food-th-evidence">Evidens</th>';

    // Food rows
    var rows = FOOD_ARSENAL.map(function (food) {
      var cells = '<td class="food-td food-td-name">' + esc(food.nameNO) + '</td>' +
        '<td class="food-td food-td-cat">' +
          '<span class="category-badge cat-' + food.category.toLowerCase() + '">' + esc(food.category) + '</span>' +
        '</td>';

      PATHWAY_ORDER.forEach(function (pid) {
        var pw = PATHWAYS[pid];
        var score = food.pathwayScores[pid] || 0;
        cells += '<td class="food-td food-td-score">' +
          '<div class="score-dots">' + renderScoreDots(score, pw.color) + '</div>' +
          '</td>';
      });

      cells += '<td class="food-td food-td-store">' + esc(food.storeSection) + '</td>' +
        '<td class="food-td food-td-evidence">' + renderEvidenceBadge(food.evidenceLevel) + '</td>';

      return '<tr>' + cells + '</tr>';
    });

    return '' +
      '<section class="science-block" aria-labelledby="science-food-heading">' +
        '<h2 id="science-food-heading" class="science-heading">' + esc(tFn('science.foodHeading')) + '</h2>' +
        '<p class="science-intro">' +
          esc(tFn('science.foodIntro')) +
        '</p>' +
        '<div class="food-arsenal-scroll">' +
          '<table class="food-arsenal-table">' +
            '<thead><tr>' + headerCells + '</tr></thead>' +
            '<tbody>' + rows.join('') + '</tbody>' +
          '</table>' +
        '</div>' +
      '</section>';
  }

  // -------------------------------------------------------------------------
  // Section 4: Before / After timeline
  // -------------------------------------------------------------------------

  function renderBeforeAfterSection() {
    var beforeSteps = [
      { time: '07:00', text: 'Ingen frokost',          detail: 'Ghrelin = HØY',                pathways: ['ghrelin'] },
      { time: '12:00', text: 'Lunsj uten fiber',       detail: 'GLP-1 kort',                   pathways: ['glp1'] },
      { time: '14:00', text: 'Monster Zero',           detail: 'Kunstig sult-demping',          pathways: ['insulin'] },
      { time: '18:00', text: 'Hjem: SULTEN',           detail: 'Snacker mens du lager mat',     pathways: ['ghrelin', 'leptin'] },
      { time: '20:00', text: 'Overspiser middag',      detail: 'Blodsukkerfall',                pathways: ['insulin', 'glp1'] },
      { time: '21:00', text: 'Sjokolade + chips',      detail: 'Dopamin-loop',                  pathways: ['ghrelin', 'leptin'] },
    ];

    var afterSteps = [
      { time: '07:00', text: 'Overnight oats + Skyr',    detail: 'GLP-1 ↑, PYY ↑, Ghrelin ↓',     pathways: ['glp1', 'pyy', 'ghrelin'] },
      { time: '12:00', text: 'Salat + kikerter',         detail: 'GLP-1 holder til 16:00',          pathways: ['glp1', 'insulin'] },
      { time: '16:00', text: 'Cottage cheese + nøtter',  detail: 'PYY ↑, Amylin ↑',                pathways: ['pyy', 'amylin'] },
      { time: '19:00', text: 'Protein først',            detail: 'Normal porsjon',                  pathways: ['glp1', 'gip', 'amylin'] },
      { time: '21:00', text: 'Mett og fornøyd',          detail: 'Ingen cravings',                  pathways: ['leptin', 'pyy'] },
    ];

    function renderTimeline(steps) {
      return steps.map(function (step) {
        var dots = step.pathways.map(function (pid) {
          var pw = PATHWAYS[pid];
          return pw
            ? '<span class="timeline-dot" style="background:' + pw.color + '" title="' + esc(pw.name) + '"></span>'
            : '';
        }).join('');

        return '' +
          '<div class="timeline-step">' +
            '<span class="timeline-time">' + esc(step.time) + '</span>' +
            '<div class="timeline-content">' +
              '<span class="timeline-text">' + esc(step.text) + '</span>' +
              '<span class="timeline-detail">' + esc(step.detail) + '</span>' +
            '</div>' +
            '<div class="timeline-dots">' + dots + '</div>' +
          '</div>';
      }).join('');
    }

    return '' +
      '<section class="science-block" aria-labelledby="science-cascade-heading">' +
        '<h2 id="science-cascade-heading" class="science-heading">' + esc(tFn('science.cascadeHeading')) + '</h2>' +
        '<p class="science-intro">' +
          esc(tFn('science.cascadeIntro')) +
        '</p>' +
        '<div class="cascade">' +
          '<div class="cascade-column timeline-before">' +
            '<h3 class="cascade-title cascade-title-before">❌ FØR</h3>' +
            '<div class="timeline-steps">' + renderTimeline(beforeSteps) + '</div>' +
          '</div>' +
          '<div class="cascade-column timeline-after">' +
            '<h3 class="cascade-title cascade-title-after">✅ ETTER</h3>' +
            '<div class="timeline-steps">' + renderTimeline(afterSteps) + '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
  }

  // -------------------------------------------------------------------------
  // Section 5: Disclaimer
  // -------------------------------------------------------------------------

  function renderDisclaimer() {
    return '' +
      '<aside class="disclaimer" role="note" aria-label="Medisinsk ansvarsfraskrivelse">' +
        '<p>' + esc(tFn('science.disclaimer')) + '</p>' +
      '</aside>';
  }

  // -------------------------------------------------------------------------
  // Section: GLP-1 day timeline canvas graph
  // -------------------------------------------------------------------------

  function renderGLP1TimelineSection() {
    return '' +
      '<section class="science-block" aria-labelledby="science-glp1graph-heading">' +
        '<h2 id="science-glp1graph-heading" class="science-heading">GLP-1 nivå gjennom dagen</h2>' +
        '<p class="science-intro">' +
          'Grafen viser estimert metthetsnivå (GLP-1 og relaterte hormoner) gjennom en hel dag — ' +
          'nåværende mønster vs. SpisSlank-planen:' +
        '</p>' +
        '<div style="width:100%;overflow-x:auto">' +
          '<canvas id="glp1-timeline" width="600" height="250" ' +
            'style="width:100%;min-width:320px;height:auto;display:block;border-radius:12px"></canvas>' +
        '</div>' +
      '</section>';
  }

  // Convert "HH:MM" to fractional hours (06:00 → 6.0, 07:15 → 7.25)
  function timeToHours(t) {
    var parts = t.split(':');
    return parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60;
  }

  window.renderGLP1Timeline = function (canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    // High-DPI support
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var w = rect.width || 600;
    var h = rect.height || 250;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    // Layout constants
    var pad = { top: 12, right: 16, bottom: 28, left: 8 };
    var plotW = w - pad.left - pad.right;
    var plotH = h - pad.top - pad.bottom;
    var xMin = 6, xMax = 22;    // hours
    var yMin = 0, yMax = 5;     // hormone level

    function xPos(hour) { return pad.left + (hour - xMin) / (xMax - xMin) * plotW; }
    function yPos(level) { return pad.top + (1 - (level - yMin) / (yMax - yMin)) * plotH; }

    // --- Data ---
    var forData = [
      ['06:00',0.5],['07:15',0.5],['08:00',0.3],['10:00',0.2],['11:00',0.3],
      ['11:30',3.5],['12:00',3.0],['13:00',2.0],['14:00',1.0],['15:00',0.5],
      ['16:00',0.3],['17:00',0.2],['18:00',0.2],['19:00',0.5],['19:30',4.0],
      ['20:00',3.5],['20:30',2.5],['21:00',1.5],['21:30',1.0],['22:00',0.8]
    ];
    var etterData = [
      ['06:00',0.5],['07:15',0.8],['07:45',3.5],['08:30',3.8],['09:30',3.2],
      ['10:30',2.5],['11:00',2.2],['11:30',4.0],['12:00',4.2],['13:00',3.8],
      ['14:00',3.2],['15:00',2.5],['15:30',2.8],['16:00',3.5],['17:00',3.0],
      ['18:00',2.5],['19:00',2.3],['19:30',3.8],['20:00',3.5],['20:30',3.0],
      ['21:00',2.5],['21:30',2.2],['22:00',2.0]
    ];

    var mealMarkers = [
      { time: '07:15', icon: '☕' },
      { time: '11:00', icon: '🥗' },
      { time: '12:00', icon: '🥤' },
      { time: '15:30', icon: '🧀' },
      { time: '19:30', icon: '🍽️' }
    ];

    // Convert to pixel arrays
    function toPoints(data) {
      return data.map(function (d) {
        return { x: xPos(timeToHours(d[0])), y: yPos(d[1]), h: timeToHours(d[0]), v: d[1] };
      });
    }
    var forPts = toPoints(forData);
    var etterPts = toPoints(etterData);

    // --- Background ---
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    // --- Grid lines at y = 1,2,3,4,5 ---
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (var g = 1; g <= 5; g++) {
      var gy = yPos(g);
      ctx.beginPath();
      ctx.moveTo(pad.left, gy);
      ctx.lineTo(w - pad.right, gy);
      ctx.stroke();
    }

    // --- X-axis labels ---
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    for (var t = 6; t <= 22; t += 2) {
      var tx = xPos(t);
      ctx.fillText(t < 10 ? '0' + t : '' + t, tx, h - 6);
      // Subtle vertical tick
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.beginPath();
      ctx.moveTo(tx, pad.top);
      ctx.lineTo(tx, pad.top + plotH);
      ctx.stroke();
    }

    // --- Danger zone highlight (FØR 17:00-19:00) ---
    var dzX1 = xPos(17), dzX2 = xPos(19);
    var dzGrad = ctx.createLinearGradient(dzX1, 0, dzX2, 0);
    dzGrad.addColorStop(0, 'rgba(239,68,68,0)');
    dzGrad.addColorStop(0.3, 'rgba(239,68,68,0.08)');
    dzGrad.addColorStop(0.7, 'rgba(239,68,68,0.08)');
    dzGrad.addColorStop(1, 'rgba(239,68,68,0)');
    ctx.fillStyle = dzGrad;
    ctx.fillRect(dzX1, pad.top, dzX2 - dzX1, plotH);
    // Subtle danger label
    ctx.fillStyle = 'rgba(239,68,68,0.3)';
    ctx.font = '9px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ sultfelle', (dzX1 + dzX2) / 2, pad.top + 14);

    // --- Smooth bezier curve helper ---
    function drawSmoothLine(pts) {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[Math.max(i - 1, 0)];
        var p1 = pts[i];
        var p2 = pts[i + 1];
        var p3 = pts[Math.min(i + 2, pts.length - 1)];
        var tension = 0.3;
        var cp1x = p1.x + (p2.x - p0.x) * tension;
        var cp1y = p1.y + (p2.y - p0.y) * tension;
        var cp2x = p2.x - (p3.x - p1.x) * tension;
        var cp2y = p2.y - (p3.y - p1.y) * tension;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
    }

    // --- Green fill under ETTER line ---
    ctx.save();
    drawSmoothLine(etterPts);
    ctx.lineTo(etterPts[etterPts.length - 1].x, yPos(0));
    ctx.lineTo(etterPts[0].x, yPos(0));
    ctx.closePath();
    var fillGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
    fillGrad.addColorStop(0, 'rgba(34,197,94,0.18)');
    fillGrad.addColorStop(1, 'rgba(34,197,94,0.02)');
    ctx.fillStyle = fillGrad;
    ctx.fill();
    ctx.restore();

    // --- FØR line (gray dashed) ---
    ctx.save();
    ctx.strokeStyle = 'rgba(107,114,128,0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    drawSmoothLine(forPts);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // --- ETTER line (green solid with glow) ---
    ctx.save();
    ctx.shadowColor = 'rgba(34,197,94,0.5)';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    drawSmoothLine(etterPts);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    // --- Meal markers on ETTER line ---
    mealMarkers.forEach(function (m) {
      var mh = timeToHours(m.time);
      // Find closest ETTER point
      var closest = etterPts[0];
      var minDist = 999;
      etterPts.forEach(function (p) {
        var d = Math.abs(p.h - mh);
        if (d < minDist) { minDist = d; closest = p; }
      });
      // Dot
      ctx.beginPath();
      ctx.arc(closest.x, closest.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e';
      ctx.fill();
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Emoji above
      ctx.font = '11px serif';
      ctx.textAlign = 'center';
      ctx.fillText(m.icon, closest.x, closest.y - 10);
    });

    // --- Legend ---
    var legY = pad.top + 6;
    var legX = w - pad.right - 4;
    ctx.textAlign = 'right';
    ctx.font = '10px Inter, system-ui, sans-serif';
    // Green legend
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(legX - 90, legY);
    ctx.lineTo(legX - 70, legY);
    ctx.stroke();
    ctx.fillStyle = '#22c55e';
    ctx.textAlign = 'left';
    ctx.fillText('Etter (SpisSlank)', legX - 67, legY + 3.5);
    // Gray legend
    var legY2 = legY + 16;
    ctx.strokeStyle = 'rgba(107,114,128,0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(legX - 90, legY2);
    ctx.lineTo(legX - 70, legY2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'left';
    ctx.fillText('Før (nåværende)', legX - 67, legY2 + 3.5);
  };

  // -------------------------------------------------------------------------
  // Main render function
  // -------------------------------------------------------------------------

  window.renderScienceView = function () {
    var container = document.getElementById('science-content');
    if (!container) return;

    container.innerHTML =
      renderDrugSection() +
      renderPathwaySection() +
      renderFoodArsenalSection() +
      renderBeforeAfterSection() +
      renderGLP1TimelineSection() +
      renderDisclaimer();

    // Render the canvas graph after DOM is ready
    window.renderGLP1Timeline('glp1-timeline');
  };

})();
