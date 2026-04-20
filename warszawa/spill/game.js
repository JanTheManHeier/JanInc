/* ============================================================
   TIL KIRKEN LØPER TERJE — mobile canvas runner
   Lane-based endless-runner med gates (Count Masters-stil)
   ============================================================ */

(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  // --- World constants --------------------------------------
  const GAME_SECONDS = 60;
  const LANES = 3;
  const LANE_X = [0.2, 0.5, 0.8];     // fraksjon av bredden
  const PLAYER_Y_FRAC = 0.78;          // hvor Terje står (fra topp)
  const BASE_SPEED = 0.00042;          // world-units/ms — ramp over tid
  const SPAWN_START = 1400;            // ms mellom fiender i start
  const SPAWN_MIN = 550;
  const GATE_INTERVAL = 8500;          // ms mellom gate-trioer
  const MAX_CREW_RENDER = 12;          // cap på hvor mange prikker vi tegner
  const CHURCH_APPEAR_AT = GAME_SECONDS - 5; // sekunder igjen når kirken vises

  // --- State ------------------------------------------------
  let W = 0, H = 0;                   // CSS-piksler
  let laneW = 0;
  let running = false;
  let startTime = 0;
  let lastTime = 0;
  let elapsed = 0;                    // ms siden start
  let speedMul = 1;                   // ramp-faktor
  let entities = [];                  // {type, lane, y, payload, r}
  let nextSpawn = 0;
  let nextGate = 4000;                // første gate etter 4s
  let terje = {
    lane: 1,
    targetLane: 1,
    laneOffset: 0,                    // 0..1 visuell overgang
    crew: 1,                          // teller Terje selv
    rings: 0,
    hits: 0,
    invincibleUntil: 0,
    speedBoostUntil: 0,
    shake: 0
  };
  let particles = [];
  let scrollY = 0;                    // bakgrunn-parallax
  let churchSpawned = false;

  // --- Sizing -----------------------------------------------
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    laneW = W / LANES;
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  resize();

  // --- Input: tap venstre/høyre halvdel + swipe -------------
  let touchStartX = null, touchStartY = null, touchStartT = 0;
  function changeLane(delta) {
    const next = Math.max(0, Math.min(LANES - 1, terje.targetLane + delta));
    if (next !== terje.targetLane) {
      terje.targetLane = next;
    }
  }

  canvas.addEventListener('touchstart', (e) => {
    if (!running) return;
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchStartT = performance.now();
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    if (!running || touchStartX === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const dt = performance.now() - touchStartT;
    const absDx = Math.abs(dx), absDy = Math.abs(dy);
    // Swipe hvis rask + langt horisontalt, ellers tap
    if (dt < 500 && absDx > 30 && absDx > absDy) {
      changeLane(dx > 0 ? 1 : -1);
    } else if (absDx < 20 && absDy < 20) {
      // Tap: venstre halvdel = venstre, høyre = høyre
      changeLane(touchStartX < W / 2 ? -1 : 1);
    }
    touchStartX = null;
    e.preventDefault();
  }, { passive: false });

  // Dev: piltaster
  window.addEventListener('keydown', (e) => {
    if (!running) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') changeLane(-1);
    if (e.key === 'ArrowRight' || e.key === 'd') changeLane(1);
  });

  // --- Lifecycle --------------------------------------------
  function startGame() {
    entities = [];
    particles = [];
    terje = { lane: 1, targetLane: 1, laneOffset: 0, crew: 1, rings: 0, hits: 0,
              invincibleUntil: 0, speedBoostUntil: 0, shake: 0 };
    elapsed = 0;
    speedMul = 1;
    nextSpawn = 800;
    nextGate = 4000;
    churchSpawned = false;
    startTime = performance.now();
    lastTime = startTime;
    running = true;
    document.getElementById('start').classList.add('hidden');
    document.getElementById('end').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    requestAnimationFrame(loop);
  }

  function endGame(won) {
    running = false;
    document.getElementById('hud').classList.add('hidden');
    const end = document.getElementById('end');
    const timeLeft = Math.max(0, GAME_SECONDS - Math.floor(elapsed / 1000));
    const crew = Math.max(0, terje.crew);
    const rings = terje.rings;
    const total = crew * 50 + rings * 5 + timeLeft * 10 + (won ? 500 : 0);

    document.getElementById('end-title').textContent = won
      ? 'TERJE NÅDDE KIRKEN!'
      : 'DAMENE FIKK TAK I TERJE 💋';
    document.getElementById('end-sub').textContent = won
      ? 'Livet som gift mann kan begynne.'
      : 'Bryllupet er utsatt. Prøv igjen.';
    document.getElementById('end-crew').textContent = crew;
    document.getElementById('end-score').textContent = rings;
    document.getElementById('end-time').textContent = timeLeft;
    document.getElementById('end-total').textContent = total;
    end.classList.remove('hidden');
  }

  document.getElementById('btn-start').addEventListener('click', startGame);
  document.getElementById('btn-retry').addEventListener('click', startGame);

  // --- Spawning ---------------------------------------------
  function spawnEnemy() {
    // Velg 1-2 lanes å fylle (aldri alle 3 — må være en "path")
    const blockedLanes = Math.random() < 0.25 ? 2 : 1;
    const lanes = [0, 1, 2];
    // shuffle
    lanes.sort(() => Math.random() - 0.5);
    for (let i = 0; i < blockedLanes; i++) {
      entities.push({
        type: 'dame',
        lane: lanes[i],
        y: -0.1,
        hit: false
      });
    }
  }

  function spawnGateRow() {
    // 3 gates — en per lane. Mix av modifikatorer.
    const pool = [
      { op: 'add', val: 3, label: '+3', color: '#6fe080' },
      { op: 'add', val: 5, label: '+5', color: '#6fe080' },
      { op: 'mul', val: 2, label: '×2', color: '#6fd8ff' },
      { op: 'add', val: -2, label: '-2', color: '#ff7788' },
      { op: 'add', val: -3, label: '-3', color: '#ff7788' },
      { op: 'beer', label: '🍺', color: '#ffc866' },
      { op: 'horse', label: '🐎', color: '#d4af37' }
    ];
    // Sørg for minst én positiv
    const pick = () => pool[Math.floor(Math.random() * pool.length)];
    let gates = [pick(), pick(), pick()];
    if (!gates.some(g => g.op === 'add' && g.val > 0 || g.op === 'mul')) {
      gates[Math.floor(Math.random() * 3)] = { op: 'add', val: 3, label: '+3', color: '#6fe080' };
    }
    for (let i = 0; i < 3; i++) {
      entities.push({ type: 'gate', lane: i, y: -0.15, gate: gates[i], hit: false });
    }
  }

  function spawnPickup() {
    const r = Math.random();
    let kind;
    if (r < 0.7) kind = 'ring';
    else if (r < 0.88) kind = 'beer';
    else kind = 'horse';
    entities.push({ type: 'pickup', lane: Math.floor(Math.random() * 3), y: -0.1, kind, hit: false });
  }

  function spawnChurch() {
    entities.push({ type: 'church', lane: 1, y: -0.2, hit: false });
    churchSpawned = true;
  }

  // --- Collision --------------------------------------------
  function handleDameHit(e, now) {
    e.hit = true;
    if (now < terje.invincibleUntil) {
      // hest = plow through, gain +1 kompis
      terje.crew = Math.min(terje.crew + 1, 99);
      burst(laneX(e.lane), playerY(), '#d4af37', 12);
      return;
    }
    if (terje.crew > 1) {
      terje.crew--;
      burst(laneX(e.lane), playerY(), '#ff5577', 10);
      terje.shake = 300;
    } else {
      // Siste liv — game over
      terje.crew = 0;
      burst(laneX(e.lane), playerY(), '#ff5577', 20);
      endGame(false);
    }
  }

  function handleGateHit(e) {
    e.hit = true;
    const g = e.gate;
    if (g.op === 'add') {
      terje.crew = Math.max(0, Math.min(99, terje.crew + g.val));
      burst(laneX(e.lane), playerY(), g.val > 0 ? '#6fe080' : '#ff7788', 8);
    } else if (g.op === 'mul') {
      terje.crew = Math.min(99, terje.crew * g.val);
      burst(laneX(e.lane), playerY(), '#6fd8ff', 12);
    } else if (g.op === 'beer') {
      terje.speedBoostUntil = performance.now() + 3000;
      terje.crew = Math.min(99, terje.crew + 1);
      burst(laneX(e.lane), playerY(), '#ffc866', 10);
    } else if (g.op === 'horse') {
      terje.invincibleUntil = performance.now() + 3500;
      burst(laneX(e.lane), playerY(), '#d4af37', 15);
    }
    if (terje.crew <= 0) endGame(false);
  }

  function handlePickup(e) {
    e.hit = true;
    if (e.kind === 'ring') { terje.rings++; burst(laneX(e.lane), playerY(), '#d4af37', 6); }
    else if (e.kind === 'beer') { terje.speedBoostUntil = performance.now() + 3000; burst(laneX(e.lane), playerY(), '#ffc866', 10); }
    else if (e.kind === 'horse') { terje.invincibleUntil = performance.now() + 3500; burst(laneX(e.lane), playerY(), '#d4af37', 12); }
  }

  // --- Particles --------------------------------------------
  function burst(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 250,
        vy: (Math.random() - 0.9) * 250,
        life: 700,
        age: 0,
        color,
        size: 3 + Math.random() * 3
      });
    }
  }

  // --- Helpers ----------------------------------------------
  function laneX(lane) { return LANE_X[lane] * W; }
  function playerY() { return PLAYER_Y_FRAC * H; }

  // --- Game loop --------------------------------------------
  function loop(now) {
    if (!running) return;
    const dt = Math.min(now - lastTime, 40);
    lastTime = now;
    elapsed = now - startTime;

    // Speed ramp
    speedMul = 1 + (elapsed / 1000) * 0.028; // +2.8%/sek
    if (now < terje.speedBoostUntil) speedMul *= 1.4;

    update(dt, now);
    render(now);

    // HUD
    document.getElementById('hud-crew').textContent = Math.max(0, terje.crew);
    document.getElementById('hud-score').textContent = terje.rings;
    const left = Math.max(0, GAME_SECONDS - Math.floor(elapsed / 1000));
    document.getElementById('hud-time').textContent = left;

    // Seier: kirken nådd
    if (elapsed >= GAME_SECONDS * 1000) {
      endGame(true);
      return;
    }

    requestAnimationFrame(loop);
  }

  function update(dt, now) {
    // Lane-interp
    if (terje.lane !== terje.targetLane) {
      const dir = Math.sign(terje.targetLane - terje.lane);
      terje.laneOffset += dir * dt / 120;
      if (Math.abs(terje.laneOffset) >= 1) {
        terje.lane = terje.targetLane;
        terje.laneOffset = 0;
      }
    }

    // Spawn church når 5 sek igjen
    const secLeft = GAME_SECONDS - Math.floor(elapsed / 1000);
    if (!churchSpawned && secLeft <= CHURCH_APPEAR_AT) spawnChurch();

    // Spawn fiender
    if (!churchSpawned && now - startTime > nextSpawn) {
      const interval = Math.max(SPAWN_MIN, SPAWN_START - elapsed / 40);
      nextSpawn = now - startTime + interval;
      if (Math.random() < 0.35) spawnPickup();
      else spawnEnemy();
    }
    // Spawn gate-rad
    if (!churchSpawned && now - startTime > nextGate) {
      nextGate = now - startTime + GATE_INTERVAL;
      spawnGateRow();
    }

    // Beveg entities
    const speed = BASE_SPEED * speedMul * dt;
    scrollY += speed * 800;
    for (const e of entities) {
      e.y += speed;
      // Kollisjon: terje er ved ~0.78. Hitbox når y i [0.73, 0.83] og samme lane
      if (!e.hit && e.y > 0.72 && e.y < 0.85) {
        const sameLane = (e.lane === terje.lane && Math.abs(terje.laneOffset) < 0.3) ||
                         (terje.laneOffset !== 0 && e.lane === terje.targetLane && Math.abs(terje.laneOffset) > 0.3);
        if (sameLane) {
          if (e.type === 'dame') handleDameHit(e, now);
          else if (e.type === 'gate') handleGateHit(e);
          else if (e.type === 'pickup') handlePickup(e);
          else if (e.type === 'church') { endGame(true); return; }
        }
      }
    }
    // Fjern gamle
    entities = entities.filter(e => e.y < 1.15 && !(e.hit && e.type === 'pickup') && !(e.hit && e.type === 'gate' && e.y > 0.9));

    // Partikler
    for (const p of particles) {
      p.age += dt;
      p.x += p.vx * dt / 1000;
      p.y += p.vy * dt / 1000;
      p.vy += 600 * dt / 1000;
    }
    particles = particles.filter(p => p.age < p.life);

    if (terje.shake > 0) terje.shake -= dt;
  }

  // --- Rendering --------------------------------------------
  function render(now) {
    // Shake
    ctx.save();
    if (terje.shake > 0) {
      const s = (terje.shake / 300) * 6;
      ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
    }

    // Background
    ctx.fillStyle = '#0a0807';
    ctx.fillRect(0, 0, W, H);
    drawRoad();
    drawSkyline();

    // Entities (bakerste først)
    const sorted = entities.slice().sort((a, b) => a.y - b.y);
    for (const e of sorted) {
      if (e.type === 'dame') drawDame(e);
      else if (e.type === 'gate') drawGate(e);
      else if (e.type === 'pickup') drawPickup(e);
      else if (e.type === 'church') drawChurch(e);
    }

    // Player
    drawPlayer(now);

    // Particles
    for (const p of particles) {
      const a = 1 - p.age / p.life;
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  function drawRoad() {
    // Gulv — gylden sti som forsvinner i horisonten
    const horizonY = H * 0.3;
    const grad = ctx.createLinearGradient(0, horizonY, 0, H);
    grad.addColorStop(0, '#1a1208');
    grad.addColorStop(0.4, '#2a1a0c');
    grad.addColorStop(1, '#3a2510');
    ctx.fillStyle = grad;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // Lane-skillelinjer (perspektiv)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 1; i < LANES; i++) {
      const xBottom = (i / LANES) * W;
      const xTop = W / 2 + (xBottom - W / 2) * 0.25;
      ctx.beginPath();
      ctx.moveTo(xTop, horizonY);
      ctx.lineTo(xBottom, H);
      ctx.stroke();
    }

    // Animerte "road marks" i center lane
    ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
    const markSpacing = 120;
    const offset = scrollY % markSpacing;
    for (let i = 0; i < 10; i++) {
      const rawY = horizonY + i * markSpacing - offset;
      if (rawY < horizonY || rawY > H) continue;
      const t = (rawY - horizonY) / (H - horizonY);
      const w = 8 + t * 30;
      const hMark = 10 + t * 30;
      ctx.fillRect(W / 2 - w / 2, rawY, w, hMark);
    }
  }

  function drawSkyline() {
    // Palace of Culture silhouette (forenklet) + domes
    const y = H * 0.3;
    ctx.fillStyle = '#0d0a08';
    // Bygning 1 — venstre
    ctx.fillRect(W * 0.05, y - 50, W * 0.15, 50);
    ctx.fillRect(W * 0.09, y - 75, W * 0.07, 25);
    // Palace of Culture (sentral, tårn)
    ctx.beginPath();
    ctx.moveTo(W * 0.35, y);
    ctx.lineTo(W * 0.35, y - 90);
    ctx.lineTo(W * 0.42, y - 110);
    ctx.lineTo(W * 0.45, y - 160);
    ctx.lineTo(W * 0.48, y - 110);
    ctx.lineTo(W * 0.55, y - 90);
    ctx.lineTo(W * 0.55, y);
    ctx.closePath();
    ctx.fill();
    // Høyre kuppel
    ctx.fillRect(W * 0.68, y - 60, W * 0.12, 60);
    ctx.beginPath();
    ctx.arc(W * 0.74, y - 60, W * 0.06, Math.PI, 0);
    ctx.fill();
    // Gylne vinduslys
    ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
    for (let i = 0; i < 20; i++) {
      const rx = (i * 137) % W;
      const ry = y - ((i * 31) % 120) - 10;
      ctx.fillRect(rx, ry, 2, 2);
    }
  }

  function drawPlayer(now) {
    // Interpolert lane-X
    const curLane = terje.lane;
    const targetLane = terje.targetLane;
    const cx = laneX(curLane) + (laneX(targetLane) - laneX(curLane)) * Math.abs(terje.laneOffset);
    const cy = playerY();

    // Kompisar bak Terje (wedge-formasjon)
    const n = Math.min(terje.crew - 1, MAX_CREW_RENDER);
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 3) + 1;
      const col = (i % 3) - 1;
      const cxk = cx + col * 22;
      const cyk = cy + row * 28;
      const bob = Math.sin(now / 120 + i) * 2;
      drawPerson(cxk, cyk + bob, 10, '#c8a85c', '#5a4020');
    }

    // Terje
    const bob = Math.sin(now / 100) * 3;
    const inv = now < terje.invincibleUntil;
    const boost = now < terje.speedBoostUntil;
    if (inv) {
      // gyllen glow
      ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.beginPath();
      ctx.arc(cx, cy + bob, 28, 0, Math.PI * 2);
      ctx.fill();
    }
    if (boost) {
      // speed lines
      ctx.strokeStyle = 'rgba(255, 200, 102, 0.5)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const ox = (Math.random() - 0.5) * 40;
        ctx.beginPath();
        ctx.moveTo(cx + ox, cy + 20);
        ctx.lineTo(cx + ox, cy + 50);
        ctx.stroke();
      }
    }
    drawPerson(cx, cy + bob, 16, '#d4af37', '#3a2510', '🐎');
  }

  function drawPerson(cx, cy, r, colBody, colLeg, emoji) {
    // Ben
    ctx.fillStyle = colLeg;
    ctx.fillRect(cx - r * 0.5, cy + r * 0.4, r * 0.3, r * 0.9);
    ctx.fillRect(cx + r * 0.2, cy + r * 0.4, r * 0.3, r * 0.9);
    // Kropp
    ctx.fillStyle = colBody;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.8, r * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    // Hode
    ctx.fillStyle = '#ecc98a';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.9, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
    if (emoji) {
      ctx.font = `${r * 1.2}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, cx, cy - r * 0.9);
    }
  }

  function yToScreen(yFrac) {
    // Lineær 3D-ish: yFrac 0 = horisont, 1 = nederst (ved Terje)
    const horizonY = H * 0.3;
    return horizonY + yFrac * (H - horizonY);
  }

  function laneXPersp(lane, yFrac) {
    const xBottom = LANE_X[lane] * W;
    const xTop = W / 2 + (xBottom - W / 2) * 0.25;
    return xTop + (xBottom - xTop) * yFrac;
  }

  function drawDame(e) {
    if (e.y < 0 || e.y > 1.15) return;
    const x = laneXPersp(e.lane, e.y);
    const y = yToScreen(e.y);
    const scale = 0.3 + e.y * 0.8;
    const size = 30 * scale;
    ctx.font = `${size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Rødaktig aura
    ctx.fillStyle = `rgba(255, 85, 119, ${0.2 * scale})`;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('💃', x, y);
  }

  function drawGate(e) {
    if (e.y < 0 || e.y > 1.1) return;
    const y = yToScreen(e.y);
    const scale = 0.3 + e.y * 0.8;
    const xCenter = laneXPersp(e.lane, e.y);
    const w = laneW * scale * 0.9;
    const h = 90 * scale;
    // Pillarer
    ctx.fillStyle = e.gate.color;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(xCenter - w / 2, y - h, w, h);
    ctx.globalAlpha = 1;
    // Kantstreker
    ctx.strokeStyle = e.gate.color;
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(xCenter - w / 2, y - h, w, h);
    // Label
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${26 * scale}px -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(e.gate.label, xCenter, y - h / 2);
  }

  function drawPickup(e) {
    if (e.y < 0 || e.y > 1.15) return;
    const x = laneXPersp(e.lane, e.y);
    const y = yToScreen(e.y);
    const scale = 0.3 + e.y * 0.8;
    const size = 26 * scale;
    ctx.font = `${size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const icon = e.kind === 'ring' ? '💍' : e.kind === 'beer' ? '🍺' : '🐎';
    // Glow
    ctx.fillStyle = `rgba(212, 175, 55, ${0.3 * scale})`;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(icon, x, y);
  }

  function drawChurch(e) {
    if (e.y < 0 || e.y > 1.15) return;
    const x = laneXPersp(e.lane, e.y);
    const y = yToScreen(e.y);
    const scale = 0.4 + e.y * 1.2;
    // Stor glow
    ctx.fillStyle = `rgba(212, 175, 55, ${0.4 * scale})`;
    ctx.beginPath();
    ctx.arc(x, y - 30 * scale, 80 * scale, 0, Math.PI * 2);
    ctx.fill();
    // Kirke-emoji
    ctx.font = `${80 * scale}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⛪', x, y - 20 * scale);
  }
})();
