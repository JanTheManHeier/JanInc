// Silje & Terje — bryllupsbobler, et lite Bubble Bobble-inspirert arkadespill
(function () {
  'use strict';

  const VARIGHET_MS = 60000;
  const KONTROLL_ID = 'boble-touch-kontroller';
  const KNAPP_IDS = {
    venstre: 'boble-knapp-venstre',
    hoyre: 'boble-knapp-hoyre',
    hopp: 'boble-knapp-hopp',
    skyt: 'boble-knapp-skyt',
  };

  let canvas = null;
  let ctx = null;
  let bredde = 720;
  let hoyde = 420;
  let rafId = null;
  let kjorer = false;
  let avsluttet = false;
  let onResultat = null;
  let starttid = 0;
  let sisteFrame = 0;
  let dpr = 1;

  let spiller;
  let plattformer = [];
  let bobler = [];
  let fiender = [];
  let partikler = [];
  let stjerner = [];
  let score = 0;
  let liv = 3;
  let bolge = 1;
  let nesteBolgeTid = 0;
  let invuln = 0;
  let risteTid = 0;
  let skuddCooldown = 0;

  const taster = { venstre: false, hoyre: false };
  const inputHandlers = { keydown: null, keyup: null, touchstart: null, mousedown: null };
  let aktivtCanvas = null;
  let kontroller = null;

  function init(canvasEl, ferdigCallback) {
    stopp();
    if (aktivtCanvas && inputHandlers.touchstart) {
      aktivtCanvas.removeEventListener('touchstart', inputHandlers.touchstart);
      aktivtCanvas.removeEventListener('mousedown', inputHandlers.mousedown);
    }

    canvas = canvasEl || null;
    ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
    onResultat = typeof ferdigCallback === 'function' ? ferdigCallback : null;

    if (!canvas || !ctx) return;

    resize();
    window.removeEventListener('resize', resize);
    window.addEventListener('resize', resize);

    inputHandlers.touchstart = function (e) { e.preventDefault(); hopp(); };
    inputHandlers.mousedown = function (e) { e.preventDefault(); hopp(); };
    canvas.addEventListener('touchstart', inputHandlers.touchstart, { passive: false });
    canvas.addEventListener('mousedown', inputHandlers.mousedown);
    aktivtCanvas = canvas;

    if (!inputHandlers.keydown) {
      inputHandlers.keydown = handterKeydown;
      inputHandlers.keyup = handterKeyup;
      window.addEventListener('keydown', inputHandlers.keydown);
      window.addEventListener('keyup', inputHandlers.keyup);
    }

    lagTouchKontroller();
    visTouchKontroller(false);
    tegnStartskjerm();
  }

  function start() {
    if (!canvas || !ctx) return;
    stopp();
    resize();

    score = 0;
    liv = 3;
    bolge = 1;
    bobler = [];
    fiender = [];
    partikler = [];
    stjerner = [];
    invuln = 0;
    risteTid = 0;
    skuddCooldown = 0;
    nesteBolgeTid = 0;
    avsluttet = false;
    taster.venstre = false;
    taster.hoyre = false;

    byggBane();
    spiller = {
      x: bredde * 0.5 - 16,
      y: plattformer[0].y - 46,
      w: 32,
      h: 46,
      vx: 0,
      vy: 0,
      retning: 1,
      paBakke: false,
      anim: 0,
    };
    lagBakgrunnsglitter();
    startBolge(bolge);

    starttid = performance.now();
    sisteFrame = starttid;
    kjorer = true;
    visTouchKontroller(true);
    rafId = requestAnimationFrame(loop);
  }

  function stopp() {
    kjorer = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    visTouchKontroller(false);
    taster.venstre = false;
    taster.hoyre = false;
  }

  function hopp() {
    if (!kjorer || !spiller) return;
    if (spiller.paBakke) {
      spiller.vy = -620;
      spiller.paBakke = false;
      lagPartikler(spiller.x + spiller.w / 2, spiller.y + spiller.h, '#FAF6EE', 8, 90);
      spillLyd('hopp');
    }
  }

  function skyt() {
    if (!kjorer || !spiller || skuddCooldown > 0) return;
    const r = 15;
    bobler.push({
      x: spiller.x + spiller.w / 2 + spiller.retning * 18,
      y: spiller.y + 18,
      r,
      vx: spiller.retning * 270,
      vy: -24,
      liv: 3300,
      fanget: null,
      fase: Math.random() * Math.PI * 2,
    });
    skuddCooldown = 280;
    lagPartikler(spiller.x + spiller.w / 2 + spiller.retning * 22, spiller.y + 20, '#F4A6B8', 5, 60);
    spillLyd('skyt');
  }

  function resize() {
    if (!canvas || !ctx) return;
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    bredde = rect.width || canvas.clientWidth || parseInt(canvas.getAttribute('width'), 10) || 720;
    hoyde = rect.height || canvas.clientHeight || parseInt(canvas.getAttribute('height'), 10) || 420;
    canvas.width = Math.max(1, Math.floor(bredde * dpr));
    canvas.height = Math.max(1, Math.floor(hoyde * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (plattformer.length) byggBane();
  }

  function byggBane() {
    const bunnY = hoyde - 34;
    plattformer = [
      { x: 0, y: bunnY, w: bredde, h: 28 },
      { x: bredde * 0.08, y: hoyde * 0.72, w: bredde * 0.34, h: 16 },
      { x: bredde * 0.58, y: hoyde * 0.72, w: bredde * 0.34, h: 16 },
      { x: bredde * 0.25, y: hoyde * 0.52, w: bredde * 0.50, h: 16 },
      { x: bredde * 0.08, y: hoyde * 0.34, w: bredde * 0.30, h: 16 },
      { x: bredde * 0.62, y: hoyde * 0.34, w: bredde * 0.30, h: 16 },
    ];
  }

  function lagBakgrunnsglitter() {
    for (let i = 0; i < 42; i++) {
      stjerner.push({
        x: Math.random() * bredde,
        y: 20 + Math.random() * (hoyde * 0.65),
        r: 0.8 + Math.random() * 1.8,
        fase: Math.random() * Math.PI * 2,
      });
    }
  }

  function startBolge(nr) {
    const antall = Math.min(8, 2 + nr);
    const typer = ['kalde føtter', 'nervøsitet', 'bordkaos', 'tale-panikk'];
    for (let i = 0; i < antall; i++) {
      const p = plattformer[1 + (i % (plattformer.length - 1))];
      const w = 30;
      const h = 26;
      const fart = (35 + nr * 12 + Math.random() * 20) * (Math.random() < 0.5 ? -1 : 1);
      fiender.push({
        x: p.x + 20 + Math.random() * Math.max(10, p.w - 60),
        y: p.y - h,
        w,
        h,
        vx: fart,
        plattform: plattformer.indexOf(p),
        type: typer[(nr + i) % typer.length],
        fanget: false,
        borte: false,
        anim: Math.random() * Math.PI * 2,
      });
    }
    lagPartikler(bredde / 2, hoyde * 0.22, '#D9B45C', 20, 140);
  }

  function loop(tid) {
    if (!kjorer) return;
    const ms = Math.min(50, tid - sisteFrame || 16);
    const dt = ms / 1000;
    sisteFrame = tid;

    const brukt = tid - starttid;
    const igjen = Math.max(0, VARIGHET_MS - brukt);

    oppdater(dt, ms, igjen);
    tegn(igjen);

    if (liv <= 0 || igjen <= 0) {
      ferdig();
      return;
    }
    rafId = requestAnimationFrame(loop);
  }

  function oppdater(dt, ms) {
    if (invuln > 0) invuln = Math.max(0, invuln - ms);
    if (risteTid > 0) risteTid = Math.max(0, risteTid - ms);
    if (skuddCooldown > 0) skuddCooldown = Math.max(0, skuddCooldown - ms);

    spiller.anim += dt * 7;
    const aks = 1900;
    const maks = 245;
    if (taster.venstre) {
      spiller.vx -= aks * dt;
      spiller.retning = -1;
    }
    if (taster.hoyre) {
      spiller.vx += aks * dt;
      spiller.retning = 1;
    }
    if (!taster.venstre && !taster.hoyre) spiller.vx *= Math.pow(0.001, dt);
    spiller.vx = begrens(spiller.vx, -maks, maks);
    spiller.vy += 1550 * dt;

    const forrigeY = spiller.y;
    spiller.x += spiller.vx * dt;
    spiller.y += spiller.vy * dt;
    spiller.x = begrens(spiller.x, 4, bredde - spiller.w - 4);
    landPaPlattform(spiller, forrigeY);
    if (spiller.y > hoyde + 60) mistLiv();

    oppdaterFiender(dt);
    oppdaterBobler(dt, ms);
    oppdaterPartikler(dt);
    sjekkKollisjoner();

    if (fiender.every(f => f.borte)) {
      if (!nesteBolgeTid) nesteBolgeTid = performance.now() + 900;
      if (performance.now() >= nesteBolgeTid) {
        score += 250;
        bolge += 1;
        nesteBolgeTid = 0;
        fiender = [];
        startBolge(bolge);
        spillLyd('bonus');
      }
    }
  }

  function landPaPlattform(obj, forrigeY) {
    obj.paBakke = false;
    for (const p of plattformer) {
      const forrigeBunn = forrigeY + obj.h;
      const bunn = obj.y + obj.h;
      const horisontal = obj.x + obj.w > p.x + 4 && obj.x < p.x + p.w - 4;
      if (obj.vy >= 0 && horisontal && forrigeBunn <= p.y + 8 && bunn >= p.y && bunn <= p.y + p.h + 28) {
        obj.y = p.y - obj.h;
        obj.vy = 0;
        obj.paBakke = true;
        return;
      }
    }
  }

  function oppdaterFiender(dt) {
    fiender.forEach(f => {
      if (f.borte) return;
      f.anim += dt * 8;
      if (f.fanget) return;
      const p = plattformer[f.plattform] || plattformer[0];
      f.x += f.vx * dt;
      if (f.x < p.x + 8) {
        f.x = p.x + 8;
        f.vx = Math.abs(f.vx);
      } else if (f.x + f.w > p.x + p.w - 8) {
        f.x = p.x + p.w - f.w - 8;
        f.vx = -Math.abs(f.vx);
      }
      f.y = p.y - f.h + Math.sin(f.anim) * 1.8;
    });
  }

  function oppdaterBobler(dt, ms) {
    bobler.forEach(b => {
      b.fase += dt * 4;
      if (b.fanget) {
        b.x += Math.sin(b.fase) * 12 * dt;
        b.y -= 28 * dt;
        b.y = Math.max(48, b.y);
        b.liv -= ms * 0.25;
        b.fanget.x = b.x - b.fanget.w / 2;
        b.fanget.y = b.y - b.fanget.h / 2;
      } else {
        b.x += b.vx * dt;
        b.y += (b.vy - 34 + Math.sin(b.fase) * 16) * dt;
        b.vx *= Math.pow(0.92, dt * 6);
        b.liv -= ms;
        if (b.x - b.r < 0 || b.x + b.r > bredde) b.vx *= -0.75;
      }
    });
    bobler = bobler.filter(b => b.liv > 0 && b.y + b.r > 0 && b.y - b.r < hoyde + 40 && (!b.fanget || !b.fanget.borte));
  }

  function oppdaterPartikler(dt) {
    partikler.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 160 * dt;
      p.liv -= dt;
      p.rot += dt * p.spin;
    });
    partikler = partikler.filter(p => p.liv > 0);
  }

  function sjekkKollisjoner() {
    bobler.forEach(b => {
      if (b.fanget) return;
      fiender.forEach(f => {
        if (f.borte || f.fanget) return;
        if (sirkelRekt(b.x, b.y, b.r, f)) {
          f.fanget = true;
          f.vx = 0;
          b.fanget = f;
          b.vx = 0;
          b.vy = -20;
          b.liv = 12000;
          score += 25;
          lagPartikler(b.x, b.y, '#F4A6B8', 10, 110);
          spillLyd('fang');
        }
      });
    });

    bobler.forEach(b => {
      if (b.fanget && sirkelRekt(b.x, b.y, b.r + 6, spiller)) {
        b.fanget.borte = true;
        score += 100;
        lagHjerteBurst(b.x, b.y);
        b.liv = 0;
        spillLyd('popp');
      }
    });

    if (invuln <= 0) {
      fiender.forEach(f => {
        if (!f.borte && !f.fanget && kollider(spiller, f)) mistLiv();
      });
    }
  }

  function mistLiv() {
    if (invuln > 0 || !spiller) return;
    liv -= 1;
    invuln = 1400;
    risteTid = 320;
    spiller.x = bredde * 0.5 - spiller.w / 2;
    spiller.y = plattformer[0].y - spiller.h;
    spiller.vx = 0;
    spiller.vy = -360;
    spiller.paBakke = false;
    lagPartikler(spiller.x + spiller.w / 2, spiller.y + spiller.h / 2, '#8A6420', 18, 160);
    spillLyd('treff');
  }

  function ferdig() {
    if (avsluttet) return;
    avsluttet = true;
    kjorer = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    visTouchKontroller(false);
    tegn(Math.max(0, VARIGHET_MS - (performance.now() - starttid)), true);
    if (onResultat) onResultat(Math.max(0, Math.round(score)));
  }

  function handterKeydown(e) {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') { taster.venstre = true; e.preventDefault(); }
    if (k === 'ArrowRight' || k === 'd' || k === 'D') { taster.hoyre = true; e.preventDefault(); }
    if (k === 'ArrowUp' || k === ' ' || k === 'w' || k === 'W') { hopp(); e.preventDefault(); }
    if (k === 'ArrowDown' || k === 's' || k === 'S' || k === 'Enter') { skyt(); e.preventDefault(); }
  }

  function handterKeyup(e) {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') { taster.venstre = false; e.preventDefault(); }
    if (k === 'ArrowRight' || k === 'd' || k === 'D') { taster.hoyre = false; e.preventDefault(); }
  }

  function lagTouchKontroller() {
    if (!canvas || !canvas.parentElement) return;
    kontroller = document.getElementById(KONTROLL_ID);
    if (kontroller && kontroller.parentElement !== canvas.parentElement) canvas.parentElement.appendChild(kontroller);
    if (kontroller) return;

    kontroller = document.createElement('div');
    kontroller.id = KONTROLL_ID;
    kontroller.setAttribute('aria-label', 'Berøringskontroller for bryllupsbobler');
    Object.assign(kontroller.style, {
      position: 'fixed',
      left: '0',
      right: '0',
      bottom: '12px',
      height: '96px',
      pointerEvents: 'none',
      zIndex: '9999',
      display: 'none',
      fontFamily: 'system-ui, sans-serif',
    });

    const venstre = lagKnapp(KNAPP_IDS.venstre, '◀', 'Gå til venstre');
    const hoyre = lagKnapp(KNAPP_IDS.hoyre, '▶', 'Gå til høyre');
    const hoppKnapp = lagKnapp(KNAPP_IDS.hopp, '⤒', 'Hopp');
    const skytKnapp = lagKnapp(KNAPP_IDS.skyt, '💕', 'Skyt hjerteboble');

    Object.assign(venstre.style, { left: '16px', bottom: '16px' });
    Object.assign(hoyre.style, { left: '92px', bottom: '16px' });
    Object.assign(hoppKnapp.style, { right: '92px', bottom: '16px' });
    Object.assign(skytKnapp.style, { right: '16px', bottom: '16px' });

    bindHoldKnapp(venstre, 'venstre');
    bindHoldKnapp(hoyre, 'hoyre');
    bindTrykkKnapp(hoppKnapp, hopp);
    bindTrykkKnapp(skytKnapp, skyt);

    kontroller.appendChild(venstre);
    kontroller.appendChild(hoyre);
    kontroller.appendChild(hoppKnapp);
    kontroller.appendChild(skytKnapp);
    canvas.parentElement.appendChild(kontroller);
  }

  function lagKnapp(id, tekst, label) {
    const b = document.createElement('button');
    b.id = id;
    b.type = 'button';
    b.textContent = tekst;
    b.setAttribute('aria-label', label);
    Object.assign(b.style, {
      position: 'absolute',
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      border: '2px solid rgba(250,246,238,0.85)',
      background: 'rgba(26,22,18,0.62)',
      color: '#FAF6EE',
      boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
      fontSize: '28px',
      fontWeight: '700',
      pointerEvents: 'auto',
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    });
    return b;
  }

  function bindHoldKnapp(knapp, retning) {
    const ned = e => { e.preventDefault(); taster[retning] = true; };
    const opp = e => { e.preventDefault(); taster[retning] = false; };
    knapp.addEventListener('pointerdown', ned);
    knapp.addEventListener('pointerup', opp);
    knapp.addEventListener('pointercancel', opp);
    knapp.addEventListener('pointerleave', opp);
  }

  function bindTrykkKnapp(knapp, fn) {
    knapp.addEventListener('pointerdown', e => { e.preventDefault(); fn(); });
  }

  function visTouchKontroller(vis) {
    if (!kontroller) kontroller = typeof document !== 'undefined' ? document.getElementById(KONTROLL_ID) : null;
    if (kontroller) kontroller.style.display = vis ? 'block' : 'none';
  }

  function tegnStartskjerm() {
    if (!ctx) return;
    tegnBakgrunn();
    tegnPlakett(bredde / 2, hoyde * 0.42, 'Bryllupsbobler', 'Silje & Terje · 22. august 2026');
    ctx.fillStyle = '#4A3422';
    ctx.font = '16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Hopp, skyt hjertebobler og sprett bryllupsrampene!', bredde / 2, hoyde * 0.62);
    ctx.textAlign = 'left';
  }

  function tegn(igjenMs, gameOver) {
    if (!ctx) return;
    ctx.save();
    if (risteTid > 0) ctx.translate((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 4);
    tegnBakgrunn();
    tegnPlattformer();
    tegnBobler();
    tegnFiender();
    if (spiller) tegnSpiller();
    tegnPartikler();
    tegnHud(igjenMs);
    if (nesteBolgeTid && !gameOver) tegnBolgeKlar();
    if (gameOver) tegnPlakett(bredde / 2, hoyde * 0.44, 'Spillet er slutt', 'Poeng: ' + Math.round(score));
    ctx.restore();
  }

  function tegnBakgrunn() {
    const grad = ctx.createLinearGradient(0, 0, 0, hoyde);
    grad.addColorStop(0, '#1D2430');
    grad.addColorStop(0.48, '#FAF6EE');
    grad.addColorStop(1, '#E8DDC8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, bredde, hoyde);

    ctx.fillStyle = 'rgba(160,120,40,0.12)';
    ctx.beginPath();
    ctx.arc(bredde * 0.78, hoyde * 0.16, 88, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(250,246,238,0.28)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bredde * 0.12, hoyde * 0.18);
    ctx.bezierCurveTo(bredde * 0.35, hoyde * 0.06, bredde * 0.62, hoyde * 0.3, bredde * 0.9, hoyde * 0.13);
    ctx.stroke();

    stjerner.forEach(s => {
      const a = 0.25 + 0.45 * (0.5 + Math.sin(performance.now() / 700 + s.fase) * 0.5);
      ctx.fillStyle = 'rgba(255,232,180,' + a + ')';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    tegnBryllupssal();
  }

  function tegnBryllupssal() {
    const gulvY = hoyde - 34;
    ctx.fillStyle = '#2A211A';
    ctx.fillRect(0, gulvY, bredde, hoyde - gulvY);
    ctx.fillStyle = '#8A6420';
    ctx.fillRect(0, gulvY - 3, bredde, 3);
    ctx.fillStyle = 'rgba(160,120,40,0.2)';
    for (let x = 0; x < bredde; x += 46) ctx.fillRect(x, gulvY + 9, 28, 2);

    ctx.fillStyle = 'rgba(250,246,238,0.72)';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Silje & Terje', bredde / 2, 34);
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText('gifter seg 22. august 2026', bredde / 2, 55);
    ctx.textAlign = 'left';
  }

  function tegnPlattformer() {
    plattformer.forEach((p, i) => {
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      grad.addColorStop(0, i === 0 ? '#A07828' : '#D9B45C');
      grad.addColorStop(1, '#8A6420');
      rundRekt(p.x, p.y, p.w, p.h, 9, grad, '#4A3422');
      ctx.fillStyle = 'rgba(250,246,238,0.35)';
      ctx.fillRect(p.x + 8, p.y + 3, Math.max(0, p.w - 16), 2);
    });
  }

  function tegnSpiller() {
    const s = spiller;
    if (invuln > 0 && Math.floor(invuln / 90) % 2 === 0) return;
    const cx = s.x + s.w / 2;
    const cy = s.y + s.h / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(s.retning, 1);

    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(0, 26, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FAF6EE';
    ctx.strokeStyle = '#8A6420';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -5, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(250,246,238,0.55)';
    ctx.beginPath();
    ctx.moveTo(-12, -18);
    ctx.quadraticCurveTo(-26, 0, -18, 24);
    ctx.quadraticCurveTo(-7, 17, -5, -16);
    ctx.fill();

    ctx.fillStyle = '#4A3422';
    ctx.beginPath();
    ctx.arc(5, -9, 2, 0, Math.PI * 2);
    ctx.arc(13, -9, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4A3422';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(9, -3, 5, 0.1, Math.PI - 0.1);
    ctx.stroke();

    ctx.fillStyle = '#8A6420';
    ctx.beginPath();
    ctx.moveTo(-5, 13);
    ctx.lineTo(9, 13);
    ctx.lineTo(2, 22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#F4A6B8';
    ctx.beginPath();
    ctx.arc(-2, -22, 3, 0, Math.PI * 2);
    ctx.arc(3, -22, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function tegnBobler() {
    bobler.forEach(b => {
      const grad = ctx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.35, 2, b.x, b.y, b.r);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.45, 'rgba(244,166,184,0.34)');
      grad.addColorStop(1, 'rgba(160,120,40,0.25)');
      ctx.fillStyle = grad;
      ctx.strokeStyle = b.fanget ? '#D84D75' : '#F4A6B8';
      ctx.lineWidth = b.fanget ? 3 : 2;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r + (b.fanget ? Math.sin(b.fase) * 1.5 : 0), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.font = b.fanget ? '16px serif' : '13px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💕', b.x, b.y + 1);
    });
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  function tegnFiender() {
    fiender.forEach(f => {
      if (f.borte) return;
      const cx = f.x + f.w / 2;
      const cy = f.y + f.h / 2;
      ctx.save();
      ctx.translate(cx, cy);
      const kropp = f.fanget ? '#C7A36A' : '#4A3422';
      ctx.fillStyle = kropp;
      ctx.strokeStyle = '#FAF6EE';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 1, f.w / 2, f.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = f.type === 'kalde føtter' ? '#A9D6E5' : '#F4A6B8';
      ctx.beginPath();
      ctx.arc(-6, -2, 3, 0, Math.PI * 2);
      ctx.arc(6, -2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8A6420';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-11, 9); ctx.lineTo(-16, 13 + Math.sin(f.anim) * 2);
      ctx.moveTo(11, 9); ctx.lineTo(16, 13 - Math.sin(f.anim) * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  function tegnPartikler() {
    partikler.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.liv / p.maxLiv);
      ctx.fillStyle = p.farge;
      if (p.hjerte) {
        ctx.font = p.str + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♥', 0, 0);
      } else {
        ctx.fillRect(-p.str / 2, -p.str / 2, p.str, p.str);
      }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  function tegnHud(igjenMs) {
    const tid = Math.max(0, Math.ceil(igjenMs / 1000));
    pille(10, 110, 'Poeng ' + Math.round(score), '#D9B45C');
    pille(130, 86, 'Liv ' + liv, '#F4A6B8');
    pille(226, 94, 'Bølge ' + bolge, '#FAF6EE');
    pille(bredde - 108, 98, tid + ' sek', tid <= 10 ? '#F46B6B' : '#D9B45C');
  }

  function pille(x, w, tekst, farge) {
    const h = 30;
    rundRekt(x, 72, w, h, 15, 'rgba(29,36,48,0.74)', farge);
    ctx.fillStyle = farge;
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tekst, x + w / 2, 87);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  function tegnBolgeKlar() {
    ctx.fillStyle = 'rgba(29,36,48,0.72)';
    ctx.fillRect(0, hoyde * 0.42, bredde, 44);
    ctx.fillStyle = '#FAF6EE';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Neste bølge gjør seg klar ...', bredde / 2, hoyde * 0.42 + 22);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  function tegnPlakett(x, y, tittel, undertittel) {
    const w = Math.min(430, bredde - 40);
    const h = 118;
    rundRekt(x - w / 2, y - h / 2, w, h, 18, 'rgba(250,246,238,0.94)', '#8A6420');
    ctx.fillStyle = '#8A6420';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tittel, x, y - 18);
    ctx.fillStyle = '#4A3422';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText(undertittel, x, y + 22);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  function lagPartikler(x, y, farge, antall, kraft) {
    for (let i = 0; i < antall; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = Math.random() * kraft;
      const livstid = 0.45 + Math.random() * 0.55;
      partikler.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 40,
        liv: livstid,
        maxLiv: livstid,
        farge,
        str: 3 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        spin: -5 + Math.random() * 10,
        hjerte: false,
      });
    }
  }

  function lagHjerteBurst(x, y) {
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 70 + Math.random() * 130;
      const livstid = 0.65 + Math.random() * 0.55;
      partikler.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 60,
        liv: livstid,
        maxLiv: livstid,
        farge: i % 2 ? '#F4A6B8' : '#D9B45C',
        str: 12 + Math.random() * 6,
        rot: 0,
        spin: -2 + Math.random() * 4,
        hjerte: true,
      });
    }
  }

  function rundRekt(x, y, w, h, r, fyll, strek) {
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
    }
    ctx.fillStyle = fyll;
    ctx.fill();
    if (strek) {
      ctx.strokeStyle = strek;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function kollider(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function sirkelRekt(cx, cy, r, rekt) {
    const nx = begrens(cx, rekt.x, rekt.x + rekt.w);
    const ny = begrens(cy, rekt.y, rekt.y + rekt.h);
    const dx = cx - nx;
    const dy = cy - ny;
    return dx * dx + dy * dy <= r * r;
  }

  function begrens(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function spillLyd(type) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ac = window._siljeterjeAC || (window._siljeterjeAC = new AC());
      if (ac.state === 'suspended') ac.resume();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.connect(g);
      g.connect(ac.destination);
      const frekvens = { hopp: 520, skyt: 760, fang: 640, popp: 920, bonus: 1040, treff: 180 }[type] || 440;
      o.frequency.value = frekvens;
      o.type = type === 'treff' ? 'sawtooth' : 'sine';
      g.gain.value = type === 'treff' ? 0.045 : 0.025;
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);
      o.stop(ac.currentTime + 0.13);
    } catch (e) {}
  }

  window.BobleSpill = { init, start, stopp, hopp };
})();
