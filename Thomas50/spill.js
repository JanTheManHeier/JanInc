// Thomas til Festen — runner med dag→natt-bakgrunn, nordnorske fjell og midnattsol
(function () {
  let canvas, ctx;
  let bredde = 720, hoyde = 420;
  let kjorer = false;
  let starttid = 0;
  let varighet = 60000; // 60 sek
  let score = 0;
  let liv = 3;
  let bakkeY;
  let thomas;
  let items = [];
  let hindringer = [];
  let fjellFar = [];   // langt bak
  let fjellNer = [];   // nærmere
  let snofnugg = [];
  let nesteSpawn = 0;
  let hastighet = 4;
  let dt = 0, sisteFrame = 0;
  let rafId = null;
  let onResultat = null;
  let invuln = 0;       // ms igjen av usårbarhet etter treff
  let blinkTid = 0;     // for rød blink
  let bakkeOffset = 0;  // for rullende bakke

  function init(canvasEl, ferdigCallback) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    onResultat = ferdigCallback;
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); hopp(); }, { passive: false });
    canvas.addEventListener('mousedown', hopp);
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    bredde = rect.width || canvas.clientWidth || parseInt(canvas.getAttribute('width'), 10) || 720;
    hoyde = rect.height || canvas.clientHeight || parseInt(canvas.getAttribute('height'), 10) || 420;
    canvas.width = bredde * dpr;
    canvas.height = hoyde * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bakkeY = hoyde - 50;
  }

  function start() {
    resize();
    score = 0;
    liv = 3;
    items = [];
    hindringer = [];
    fjellFar = [];
    fjellNer = [];
    snofnugg = [];
    hastighet = 4;
    nesteSpawn = 0;
    invuln = 0;
    blinkTid = 0;
    bakkeOffset = 0;
    starttid = performance.now();
    sisteFrame = starttid;
    thomas = {
      x: bredde * 0.15,
      y: bakkeY - 44,
      w: 44, h: 44,
      vy: 0,
      grunn: true,
    };
    // Bygg fjell-lag
    for (let i = 0; i < 10; i++) {
      fjellFar.push({ x: i * 140, h: 60 + Math.random() * 50, w: 140 + Math.random() * 60 });
    }
    for (let i = 0; i < 8; i++) {
      fjellNer.push({ x: i * 180, h: 110 + Math.random() * 80, w: 180 + Math.random() * 80 });
    }
    kjorer = true;
    if (rafId) cancelAnimationFrame(rafId);
    loop(starttid);
  }

  function stopp() {
    kjorer = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  function hopp() {
    if (!kjorer) return;
    if (thomas.grunn) {
      thomas.vy = -12;
      thomas.grunn = false;
    } else if (thomas.vy > -5) {
      thomas.vy = -9;
    }
  }

  function loop(t) {
    if (!kjorer) return;
    dt = Math.min(t - sisteFrame, 50);
    sisteFrame = t;
    const elapsed = t - starttid;
    const tid = Math.max(0, Math.ceil((varighet - elapsed) / 1000));
    const fase = Math.min(1, elapsed / varighet); // 0..1 dag→natt

    hastighet = 4 + fase * 3;
    if (invuln > 0) invuln = Math.max(0, invuln - dt);
    if (blinkTid > 0) blinkTid = Math.max(0, blinkTid - dt);
    bakkeOffset = (bakkeOffset + hastighet) % 40;

    // Spawn
    if (elapsed > nesteSpawn) {
      const r = Math.random();
      if (r < 0.55) {
        const hoy = Math.random() < 0.4;
        items.push({
          x: bredde + 20,
          y: hoy ? bakkeY - 110 : bakkeY - 55,
          w: 28, h: 28,
          emoji: Math.random() < 0.18 ? '🥃' : '🍺',
          poeng: Math.random() < 0.18 ? 5 : 1,
        });
      } else {
        hindringer.push({
          x: bredde + 20,
          y: bakkeY - 34,
          w: 30, h: 34,
          type: Math.random() < 0.5 ? 'kjegle' : 'eske',
        });
      }
      nesteSpawn = elapsed + 600 + Math.random() * 600;
    }

    // Spawn snøfnugg på natta
    if (fase > 0.5 && Math.random() < 0.3 * (fase - 0.5) * 2) {
      snofnugg.push({
        x: Math.random() * bredde,
        y: -5,
        vy: 0.5 + Math.random() * 1.2,
        vx: -0.3 - Math.random() * 0.5,
        r: 1 + Math.random() * 2.2,
      });
    }

    // Fysikk
    thomas.vy += 0.6;
    thomas.y += thomas.vy;
    if (thomas.y + thomas.h >= bakkeY) {
      thomas.y = bakkeY - thomas.h;
      thomas.vy = 0;
      thomas.grunn = true;
    }

    // Beveg verden
    items.forEach(i => i.x -= hastighet);
    hindringer.forEach(h => h.x -= hastighet);
    fjellFar.forEach(m => m.x -= hastighet * 0.15);
    fjellNer.forEach(m => m.x -= hastighet * 0.4);
    snofnugg.forEach(s => { s.y += s.vy; s.x += s.vx - hastighet * 0.2; });

    // Wrap fjell
    if (fjellFar[0] && fjellFar[0].x + fjellFar[0].w < 0) {
      const sist = fjellFar[fjellFar.length - 1];
      fjellFar.shift();
      fjellFar.push({ x: sist.x + sist.w, h: 60 + Math.random() * 50, w: 140 + Math.random() * 60 });
    }
    if (fjellNer[0] && fjellNer[0].x + fjellNer[0].w < 0) {
      const sist = fjellNer[fjellNer.length - 1];
      fjellNer.shift();
      fjellNer.push({ x: sist.x + sist.w, h: 110 + Math.random() * 80, w: 180 + Math.random() * 80 });
    }
    snofnugg = snofnugg.filter(s => s.y < hoyde + 5 && s.x > -5);

    // Kollisjoner — items
    items = items.filter(i => {
      if (i.x + i.w < 0) return false;
      if (kollider(thomas, i)) {
        score += i.poeng;
        spillLyd('beep');
        return false;
      }
      return true;
    });
    // Kollisjoner — hindringer (knockback + sprett)
    hindringer.forEach(h => {
      if (h.truffet || invuln > 0) return;
      if (kollider(thomas, h)) {
        h.truffet = true;
        liv--;
        invuln = 1000;
        blinkTid = 400;
        // Sprett bakover og opp
        thomas.vy = -10;
        thomas.x = Math.max(8, thomas.x - 24);
        thomas.grunn = false;
        spillLyd('hit');
        if (liv <= 0) { ferdig(); return; }
      }
    });
    hindringer = hindringer.filter(h => h.x + h.w > -10);

    if (elapsed >= varighet) { ferdig(); return; }

    tegn(tid, fase);
    rafId = requestAnimationFrame(loop);
  }

  function kollider(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function ferdig() {
    kjorer = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (onResultat) onResultat(score);
  }

  // Lineær interpolasjon mellom to fargestopper basert på fase 0..1
  function lerpFarge(c1, c2, t) {
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
    return `rgb(${r},${g},${b})`;
  }

  // Velg himmelfarger basert på fase
  // 0.0 dag, 0.35 ettermiddag, 0.6 midnattsol/kveld, 0.85 sen kveld, 1.0 natt
  function himmelStopps(fase) {
    const stopps = [
      { t: 0.00, top: [120, 195, 235], mid: [180, 220, 240], bunn: [220, 235, 245] }, // dag
      { t: 0.35, top: [255, 165, 110], mid: [255, 200, 140], bunn: [250, 220, 180] }, // ettermiddag varm
      { t: 0.60, top: [220, 100,  90], mid: [255, 145, 100], bunn: [255, 195, 130] }, // midnattsol
      { t: 0.82, top: [ 50,  60, 130], mid: [120,  90, 150], bunn: [200, 110, 130] }, // tussmørke
      { t: 1.00, top: [  8,  14,  40], mid: [ 18,  28,  70], bunn: [ 35,  55,  95] }, // natt
    ];
    let a = stopps[0], b = stopps[stopps.length - 1];
    for (let i = 0; i < stopps.length - 1; i++) {
      if (fase >= stopps[i].t && fase <= stopps[i+1].t) { a = stopps[i]; b = stopps[i+1]; break; }
    }
    const lokal = (fase - a.t) / Math.max(0.0001, (b.t - a.t));
    return {
      top: lerpFarge(a.top, b.top, lokal),
      mid: lerpFarge(a.mid, b.mid, lokal),
      bunn: lerpFarge(a.bunn, b.bunn, lokal),
    };
  }

  function tegn(tid, fase) {
    // Himmel-gradient
    const farger = himmelStopps(fase);
    const grad = ctx.createLinearGradient(0, 0, 0, bakkeY);
    grad.addColorStop(0, farger.top);
    grad.addColorStop(0.55, farger.mid);
    grad.addColorStop(1, farger.bunn);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, bredde, hoyde);

    // Sol / midnattsol — beveger seg fra høyt til nær horisonten
    const solX = bredde * (0.78 - fase * 0.25);
    const solY = bakkeY - 40 - (1 - Math.abs(fase - 0.5) * 2) * 60 - (fase < 0.5 ? (0.5 - fase) * 200 : 0);
    const solR = 38 + fase * 14;
    let solFarge;
    if (fase < 0.35) solFarge = '#FFF4C2';
    else if (fase < 0.7) solFarge = '#FF9A4D';     // midnattsol-rød
    else if (fase < 0.9) solFarge = '#9C6BB8';
    else solFarge = '#E8E8FF';                     // måne
    // Glød
    const solGrad = ctx.createRadialGradient(solX, solY, solR * 0.4, solX, solY, solR * 2.2);
    solGrad.addColorStop(0, solFarge);
    solGrad.addColorStop(0.4, hexAlpha(solFarge, 0.4));
    solGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = solGrad;
    ctx.beginPath();
    ctx.arc(solX, solY, solR * 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = solFarge;
    ctx.beginPath();
    ctx.arc(solX, solY, solR, 0, Math.PI * 2);
    ctx.fill();

    // Stjerner på natta
    if (fase > 0.75) {
      const alpha = Math.min(1, (fase - 0.75) * 4);
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
      for (let i = 0; i < 40; i++) {
        const sx = (i * 137.5) % bredde;
        const sy = (i * 53.3) % (bakkeY - 80);
        const sr = (i % 3 === 0) ? 1.4 : 0.8;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Fjern fjell (bak)
    tegnFjell(fjellFar, fase, true);
    // Nære fjell
    tegnFjell(fjellNer, fase, false);

    // Snø-bakke nederst
    const snoGrad = ctx.createLinearGradient(0, bakkeY, 0, hoyde);
    if (fase < 0.5) {
      snoGrad.addColorStop(0, '#F0F4FA');
      snoGrad.addColorStop(1, '#B8C8DC');
    } else if (fase < 0.85) {
      snoGrad.addColorStop(0, '#D8C0D0');
      snoGrad.addColorStop(1, '#7A6A8A');
    } else {
      snoGrad.addColorStop(0, '#5A6A85');
      snoGrad.addColorStop(1, '#1E2A45');
    }
    ctx.fillStyle = snoGrad;
    ctx.fillRect(0, bakkeY, bredde, hoyde - bakkeY);
    // Bakke-stripe (gull-linje)
    ctx.fillStyle = '#D4A853';
    ctx.fillRect(0, bakkeY - 1, bredde, 2);
    // Rullende stripe-mønster i snøen
    ctx.strokeStyle = fase < 0.5 ? 'rgba(140,160,190,0.4)' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    for (let x = -bakkeOffset; x < bredde; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, bakkeY + 14);
      ctx.lineTo(x + 24, bakkeY + 14);
      ctx.stroke();
    }

    // Snøfnugg
    if (snofnugg.length) {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      snofnugg.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Items
    ctx.font = '28px Arial';
    ctx.textBaseline = 'top';
    items.forEach(i => ctx.fillText(i.emoji, i.x, i.y));

    // Hindringer
    hindringer.forEach(h => {
      if (h.type === 'kjegle') {
        ctx.fillStyle = '#E8A83C';
        ctx.beginPath();
        ctx.moveTo(h.x + h.w / 2, h.y);
        ctx.lineTo(h.x + h.w, h.y + h.h);
        ctx.lineTo(h.x, h.y + h.h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#0D1B2A';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // hvit stripe
        ctx.fillStyle = 'white';
        ctx.fillRect(h.x + 6, h.y + h.h * 0.55, h.w - 12, 4);
      } else {
        ctx.fillStyle = '#8B5A2B';
        ctx.fillRect(h.x, h.y, h.w, h.h);
        ctx.strokeStyle = '#3A2410';
        ctx.lineWidth = 2;
        ctx.strokeRect(h.x, h.y, h.w, h.h);
        // X-mønster
        ctx.beginPath();
        ctx.moveTo(h.x, h.y);
        ctx.lineTo(h.x + h.w, h.y + h.h);
        ctx.moveTo(h.x + h.w, h.y);
        ctx.lineTo(h.x, h.y + h.h);
        ctx.stroke();
      }
    });

    // Thomas — speilet horisontalt + blink ved treff
    ctx.font = '40px Arial';
    ctx.textBaseline = 'top';
    const visThomas = invuln <= 0 || Math.floor(invuln / 80) % 2 === 0;
    if (visThomas) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.fillText(thomas.grunn ? '🏃' : '🤸', -thomas.x - thomas.w, thomas.y);
      ctx.restore();
    }

    // Rød blink-overlay etter treff
    if (blinkTid > 0) {
      ctx.fillStyle = `rgba(220,40,40,${(blinkTid / 400) * 0.35})`;
      ctx.fillRect(0, 0, bredde, hoyde);
    }

    // HUD
    ctx.fillStyle = '#0D1B2A';
    ctx.globalAlpha = 0.45;
    ctx.fillRect(6, 6, bredde - 12, 32);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#D4A853';
    ctx.font = 'bold 18px sans-serif';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText('🍺 ' + score, 16, 12);
    ctx.fillText('❤️ ' + liv, 110, 12);
    ctx.textAlign = 'right';
    ctx.fillText('⏱️ ' + tid + 's', bredde - 16, 12);
    ctx.textAlign = 'left';
  }

  function tegnFjell(liste, fase, fjern) {
    const baseFarge = fjern
      ? (fase < 0.5 ? [70, 95, 130] : fase < 0.85 ? [55, 60, 95] : [22, 30, 55])
      : (fase < 0.5 ? [40, 60,  90] : fase < 0.85 ? [35, 40, 75]  : [12, 18, 38]);
    const sneFarge = fase < 0.5 ? [248, 252, 255] : fase < 0.85 ? [220, 200, 220] : [150, 160, 190];
    ctx.fillStyle = `rgb(${baseFarge[0]},${baseFarge[1]},${baseFarge[2]})`;
    liste.forEach(m => {
      ctx.beginPath();
      ctx.moveTo(m.x, bakkeY);
      ctx.lineTo(m.x + m.w * 0.5, bakkeY - m.h);
      ctx.lineTo(m.x + m.w, bakkeY);
      ctx.closePath();
      ctx.fill();
    });
    // Snø på toppen
    ctx.fillStyle = `rgb(${sneFarge[0]},${sneFarge[1]},${sneFarge[2]})`;
    liste.forEach(m => {
      const toppX = m.x + m.w * 0.5;
      const toppY = bakkeY - m.h;
      const sneHoyde = m.h * 0.32;
      const sneBredde = m.w * 0.32;
      ctx.beginPath();
      ctx.moveTo(toppX, toppY);
      ctx.lineTo(toppX + sneBredde * 0.5, toppY + sneHoyde);
      ctx.lineTo(toppX + sneBredde * 0.2, toppY + sneHoyde * 0.7);
      ctx.lineTo(toppX, toppY + sneHoyde);
      ctx.lineTo(toppX - sneBredde * 0.2, toppY + sneHoyde * 0.6);
      ctx.lineTo(toppX - sneBredde * 0.5, toppY + sneHoyde);
      ctx.closePath();
      ctx.fill();
    });
  }

  function hexAlpha(farge, a) {
    // Aksepter både hex og rgb
    if (farge.startsWith('#')) {
      const h = farge.slice(1);
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${a})`;
    }
    return farge.replace('rgb(', 'rgba(').replace(')', `,${a})`);
  }

  function spillLyd(type) {
    try {
      const ac = window._thomas50AC || (window._thomas50AC = new (window.AudioContext || window.webkitAudioContext)());
      if (ac.state === 'suspended') ac.resume();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      if (type === 'beep') {
        o.frequency.value = 880; g.gain.value = 0.05;
      } else {
        o.frequency.value = 180; g.gain.value = 0.1;
      }
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
      o.stop(ac.currentTime + 0.15);
    } catch {}
  }

  window.ThomasSpill = { init, start, stopp, hopp };
})();
