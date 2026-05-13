// Thomas til Festen — enkel canvas-runner
// 60 sek, tap = hopp, samle øl, unngå hindringer
(function () {
  const STORAGE_NAVN = 'thomas50-navn';

  let canvas, ctx;
  let bredde = 380, hoyde = 240;
  let kjorer = false;
  let starttid = 0;
  let varighet = 60000; // 60 sek
  let score = 0;
  let liv = 3;
  let bakkeY;
  let thomas;
  let items = [];      // beers
  let hindringer = []; // obstacles
  let bakker = [];     // background scrolling
  let nesteSpawn = 0;
  let hastighet = 3;
  let dt = 0, sisteFrame = 0;
  let rafId = null;
  let onResultat = null; // callback when game over

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
    bredde = rect.width;
    hoyde = rect.height;
    canvas.width = bredde * dpr;
    canvas.height = hoyde * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bakkeY = hoyde - 30;
  }

  function start() {
    score = 0;
    liv = 3;
    items = [];
    hindringer = [];
    bakker = [];
    hastighet = 3.5;
    nesteSpawn = 0;
    starttid = performance.now();
    sisteFrame = starttid;
    thomas = {
      x: 60,
      y: bakkeY - 36,
      w: 36, h: 36,
      vy: 0,
      grunn: true,
    };
    // Build initial background
    for (let i = 0; i < 8; i++) bakker.push({ x: i * 80, type: i % 3 });
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
      thomas.vy = -10;
      thomas.grunn = false;
    } else if (thomas.vy > -4) {
      // double-jump-ish: small extra boost
      thomas.vy = -8;
    }
  }

  function loop(t) {
    if (!kjorer) return;
    dt = Math.min(t - sisteFrame, 50);
    sisteFrame = t;
    const elapsed = t - starttid;
    const tid = Math.max(0, Math.ceil((varighet - elapsed) / 1000));

    // Increase difficulty over time
    hastighet = 3.5 + (elapsed / 60000) * 2.5;

    // Spawn items / obstacles
    if (elapsed > nesteSpawn) {
      const r = Math.random();
      if (r < 0.55) {
        // Beer (low or high)
        const hoy = Math.random() < 0.4;
        items.push({
          x: bredde + 20,
          y: hoy ? bakkeY - 90 : bakkeY - 45,
          w: 22, h: 22,
          emoji: Math.random() < 0.15 ? '🥃' : '🍺',
          poeng: Math.random() < 0.15 ? 5 : 1,
        });
      } else {
        // Obstacle
        hindringer.push({
          x: bredde + 20,
          y: bakkeY - 28,
          w: 24, h: 28,
          type: Math.random() < 0.5 ? 'kjegle' : 'eske',
        });
      }
      nesteSpawn = elapsed + 600 + Math.random() * 700;
    }

    // Physics
    thomas.vy += 0.55;
    thomas.y += thomas.vy;
    if (thomas.y + thomas.h >= bakkeY) {
      thomas.y = bakkeY - thomas.h;
      thomas.vy = 0;
      thomas.grunn = true;
    }

    // Move world
    items.forEach(i => i.x -= hastighet);
    hindringer.forEach(h => h.x -= hastighet);
    bakker.forEach(b => b.x -= hastighet * 0.5);

    // Wrap background
    bakker = bakker.filter(b => b.x > -100);
    while (bakker.length < 8) bakker.push({ x: (bakker[bakker.length-1]?.x || bredde) + 80, type: Math.floor(Math.random() * 3) });

    // Collisions
    items = items.filter(i => {
      if (i.x + i.w < 0) return false;
      if (kollider(thomas, i)) {
        score += i.poeng;
        spillLyd('beep');
        return false;
      }
      return true;
    });
    hindringer = hindringer.filter(h => {
      if (h.x + h.w < 0) return false;
      if (kollider(thomas, h) && !h.truffet) {
        h.truffet = true;
        liv--;
        spillLyd('hit');
        if (liv <= 0) {
          ferdig();
          return false;
        }
      }
      return true;
    });

    // Time up
    if (elapsed >= varighet) {
      ferdig();
      return;
    }

    tegn(tid);
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

  function tegn(tid) {
    // Sky-bakgrunn
    const grad = ctx.createLinearGradient(0, 0, 0, hoyde);
    grad.addColorStop(0, '#1A3A5C');
    grad.addColorStop(0.6, '#2A5A7A');
    grad.addColorStop(1, '#0D4A4A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, bredde, hoyde);

    // Bakgrunn (Tromsø-fjell-silhuett)
    ctx.fillStyle = 'rgba(13,27,42,0.5)';
    bakker.forEach(b => {
      ctx.beginPath();
      ctx.moveTo(b.x, bakkeY);
      ctx.lineTo(b.x + 40, bakkeY - (40 + b.type * 15));
      ctx.lineTo(b.x + 80, bakkeY);
      ctx.closePath();
      ctx.fill();
    });

    // Bakke
    ctx.fillStyle = '#1A3A2C';
    ctx.fillRect(0, bakkeY, bredde, hoyde - bakkeY);
    ctx.fillStyle = '#D4A853';
    ctx.fillRect(0, bakkeY, bredde, 3);

    // Thomas
    ctx.font = '32px Arial';
    ctx.textBaseline = 'top';
    ctx.fillText(thomas.grunn ? '🏃' : '🤸', thomas.x, thomas.y);

    // Items
    ctx.font = '22px Arial';
    items.forEach(i => ctx.fillText(i.emoji, i.x, i.y));

    // Hindringer
    hindringer.forEach(h => {
      ctx.fillStyle = h.type === 'kjegle' ? '#E8A83C' : '#8B5A2B';
      ctx.fillRect(h.x, h.y, h.w, h.h);
      ctx.strokeStyle = '#0D1B2A';
      ctx.strokeRect(h.x, h.y, h.w, h.h);
    });

    // HUD
    ctx.fillStyle = '#D4A853';
    ctx.font = 'bold 16px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText('🍺 ' + score, 10, 8);
    ctx.fillText('❤️ ' + liv, 90, 8);
    ctx.textAlign = 'right';
    ctx.fillText('⏱️ ' + tid + 's', bredde - 10, 8);
    ctx.textAlign = 'left';
  }

  function spillLyd(type) {
    try {
      const ac = window._thomas50AC || (window._thomas50AC = new (window.AudioContext || window.webkitAudioContext)());
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

  // Eksporter til script.js
  window.ThomasSpill = { init, start, stopp };
})();
