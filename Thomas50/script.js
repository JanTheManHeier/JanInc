// Thomas50 — hovedlogikk
(function () {
  const STORAGE_NAVN = 'thomas50-navn';
  const STORAGE_BILDER = 'thomas50-bilder';
  const STORAGE_HILSEN_LOKAL = 'thomas50-hilsener-lokal';
  const API_BASE = '/api';

  let mittNavn = localStorage.getItem(STORAGE_NAVN) || '';
  let aktivSide = 'hjem';
  let map = null;
  let hilsener = [];
  let bilder = JSON.parse(localStorage.getItem(STORAGE_BILDER) || '[]');
  let gjesterFilter = 'alle';
  let quizIdx = 0;
  let diskIdx = 0;
  let quizScore = 0;       // antall riktige
  let quizSvart = 0;       // antall besvart
  let quizFerdig = false;
  let aktivSpillTab = 'quiz';

  // ============ Init ============
  document.addEventListener('DOMContentLoaded', () => {
    initNavnModal();
    initNavnPille();
    initNavigasjon();
    initHjem();
    initProgram();
    initGjester();
    initHilsener();
    initToastmaster();
    initSang();
    initSpill();
    initMinnebok();
    initOverlay();
    initMario();
    sporBesok('hjem');
  });

  // ============ Navn-pille (vises hvis anonym) ============
  function initNavnPille() {
    const p = document.getElementById('navn-pille');
    if (!p) return;
    function oppdater() {
      p.hidden = !!mittNavn;
      p.style.display = mittNavn ? 'none' : '';
    }
    oppdater();
    p.onclick = () => {
      const modal = document.getElementById('navn-modal');
      modal.hidden = false;
      modal.style.display = '';
      setTimeout(() => document.getElementById('navn-input').focus(), 200);
    };
    window._oppdaterNavnPille = oppdater;
  }
  function settNavn(n) {
    if (!n || mittNavn === n) return;
    mittNavn = n;
    localStorage.setItem(STORAGE_NAVN, n);
    if (window._oppdaterNavnPille) window._oppdaterNavnPille();
  }

  // ============ Navn-modal ============
  function initNavnModal() {
    const modal = document.getElementById('navn-modal');
    function lukk() {
      modal.hidden = true;
      modal.style.display = 'none';
      sporBesok('hjem');
    }
    if (!mittNavn) {
      modal.hidden = false;
      modal.style.display = '';
      const inp = document.getElementById('navn-input');
      setTimeout(() => inp.focus(), 200);
      document.getElementById('navn-lagre').onclick = () => {
        const n = inp.value.trim();
        if (n) {
          mittNavn = n;
          localStorage.setItem(STORAGE_NAVN, n);
          lukk();
          toast(`Velkommen, ${n}! 🎉`);
        } else {
          inp.focus();
        }
      };
      document.getElementById('navn-skip').onclick = lukk;
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('navn-lagre').click(); });
    } else {
      modal.hidden = true;
      modal.style.display = 'none';
    }
  }

  // ============ Device fingerprint ============
  // Lager en stabil, lesbar enhet-ID per nettleser/enhet
  function deviceId() {
    let id = localStorage.getItem('thomas50-device');
    if (id) return id;
    const ua = navigator.userAgent;
    let device = 'Ukjent';
    if (/iPhone/.test(ua)) device = 'iPhone';
    else if (/iPad/.test(ua)) device = 'iPad';
    else if (/Android/.test(ua)) device = 'Android';
    else if (/Macintosh/.test(ua)) device = 'Mac';
    else if (/Windows/.test(ua)) device = 'Windows';
    else if (/Linux/.test(ua)) device = 'Linux';
    let browser = 'Browser';
    if (/Edg\//.test(ua)) browser = 'Edge';
    else if (/Chrome\//.test(ua)) browser = 'Chrome';
    else if (/Firefox\//.test(ua)) browser = 'Firefox';
    else if (/Safari\//.test(ua)) browser = 'Safari';
    // Hash av UA + screen + tz for unik ID
    const fp = ua + '|' + screen.width + 'x' + screen.height + '|' + (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
    let hash = 0;
    for (let i = 0; i < fp.length; i++) hash = ((hash << 5) - hash + fp.charCodeAt(i)) | 0;
    const short = Math.abs(hash).toString(36).substring(0, 5).toUpperCase();
    id = `${device}/${browser} #${short}`;
    localStorage.setItem('thomas50-device', id);
    return id;
  }

  // ============ Navigasjon ============
  function initNavigasjon() {
    document.querySelectorAll('[data-go]').forEach(b => {
      b.addEventListener('click', () => visSide(b.dataset.go));
    });
  }
  function visSide(id) {
    aktivSide = id;
    document.querySelectorAll('.page').forEach(p => p.hidden = (p.dataset.page !== id));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.go === id));
    window.scrollTo(0, 0);
    if (id === 'program') setTimeout(initMap, 100);
    if (id === 'hilsener') lastHilsener();
    if (id === 'gjester') renderGjester();
    if (id === 'mario') lastMarioTopp();
    sporBesok(id);
  }

  // ============ Hjem ============
  function initHjem() {
    const cd = document.getElementById('countdown');
    const oppdater = () => {
      const target = new Date(EVENT_DATO_ISO).getTime();
      const diff = target - Date.now();
      if (diff <= 0) { cd.innerHTML = '🎉 Festen er i gang!'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      cd.innerHTML = `⏳ ${d} dager, ${h} t, ${m} min til festen!`;
    };
    oppdater();
    setInterval(oppdater, 60000);

    // Karriere og fun-facts er fjernet fra hjem-siden for å ikke spoile quiz-svarene
  }

  // ============ Program ============
  function initProgram() {
    const liste = document.getElementById('program-list');
    liste.innerHTML = PROGRAM.map(p => `
      <div class="program-kort" style="border-left-color:${p.farge}">
        <div class="program-tid">${p.tid}</div>
        <div class="program-ikon">${p.ikon}</div>
        <div class="program-info">
          <div class="sted">${esc(p.sted)}</div>
          <div class="beskrivelse">${esc(p.beskrivelse)}</div>
          <div class="adresse">📍 ${esc(p.adresse)}</div>
          ${p.kart ? `<a class="kart-link" href="${p.kart}" target="_blank" rel="noopener">🗺️ Åpne i Google Maps →</a>` : ''}
        </div>
      </div>`).join('');
  }

  function initMap() {
    const el = document.getElementById('map');
    if (!el || map) return;
    map = L.map('map').setView([69.6493, 18.9590], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);
    PROGRAM.forEach(p => {
      if (p.lat && p.lng) {
        const m = L.marker([p.lat, p.lng]).addTo(map);
        m.bindPopup(`<strong>${esc(p.sted)}</strong><br/>${esc(p.tid)}<br/><small>${esc(p.adresse)}</small>`);
      }
    });
    setTimeout(() => map.invalidateSize(), 200);
  }

  // ============ Gjester ============
  function initGjester() {
    const stats = document.getElementById('gjester-stats');
    const totalt = GJESTER.filter(g => !g.avbud).length;
    const pust = GJESTER.filter(g => g.pust && !g.avbud).length;
    const folge = GJESTER.filter(g => g.plus > 0).reduce((a, g) => a + g.plus, 0);
    stats.innerHTML = `
      <div><strong>${totalt}</strong>Bekreftet</div>
      <div><strong>${pust}</strong>På Pust</div>
      <div><strong>${folge}</strong>Følge</div>`;

    document.querySelectorAll('.chip[data-filter]').forEach(c => {
      c.addEventListener('click', () => {
        document.querySelectorAll('.chip[data-filter]').forEach(x => x.classList.toggle('active', x === c));
        gjesterFilter = c.dataset.filter;
        renderGjester();
      });
    });
    renderGjester();
  }

  function renderGjester() {
    const grid = document.getElementById('gjester-grid');
    let liste = GJESTER.slice();
    if (gjesterFilter === 'pust') liste = liste.filter(g => g.pust);
    else if (gjesterFilter === 'toast') liste = liste.filter(g => g.rolle === 'Toastmaster');
    else if (gjesterFilter === 'avbud') liste = liste.filter(g => g.avbud);
    else liste = liste.filter(g => !g.avbud); // alle = ikke vis avbud
    if (gjesterFilter === 'avbud' && liste.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#7A8FA8;padding:20px">Ingen avbud — nice! 🎉</div>`;
      return;
    }
    grid.innerHTML = liste.map(g => {
      const init = g.navn.split(' ').map(s => s[0]).slice(0, 2).join('');
      const klasser = ['gjest-kort'];
      if (g.rolle === 'Toastmaster') klasser.push('toast');
      if (g.avbud) klasser.push('avbud');
      let tag = '';
      if (g.rolle === 'Toastmaster') tag = `<span class="gjest-tag toast">🎤 Toastmaster</span>`;
      else if (g.avbud) tag = `<span class="gjest-tag avbud">Avbud</span>`;
      else if (g.pust) tag = `<span class="gjest-tag">🧖 Pust${g.plus ? ` +${g.plus}` : ''}</span>`;
      else if (g.plus) tag = `<span class="gjest-tag">+${g.plus} følge</span>`;
      return `
        <div class="${klasser.join(' ')}">
          <div class="gjest-avatar">${esc(init)}</div>
          <div class="gjest-navn">${esc(g.navn)}</div>
          <div class="gjest-bio">${esc(g.bio)}</div>
          ${g.fbBio ? `<div class="gjest-fbbio">${esc(g.fbBio)}</div>` : ''}
          ${g.folge ? `<div class="gjest-bio" style="color:#7A8FA8">Følge: ${esc(g.folge)}</div>` : ''}
          ${tag}
          ${g.fbUrl ? `<a class="gjest-fb-link" href="${esc(g.fbUrl)}" target="_blank" rel="noopener">facebook</a>` : ''}
        </div>`;
    }).join('');
  }

  // ============ Hilsener ============
  function initHilsener() {
    document.getElementById('hilsen-lagre').onclick = sendHilsen;
    if (mittNavn) document.getElementById('hilsen-navn').value = mittNavn;
  }

  async function lastHilsener() {
    const status = document.getElementById('hilsen-status');
    status.textContent = 'Henter hilsener...';
    try {
      const res = await fetch(`${API_BASE}/thomas50-greetings`);
      if (!res.ok) throw new Error('API feil');
      hilsener = await res.json();
      status.textContent = '';
    } catch (e) {
      // Fallback: localStorage
      hilsener = JSON.parse(localStorage.getItem(STORAGE_HILSEN_LOKAL) || '[]');
      status.textContent = '(Offline — viser lokale hilsener)';
    }
    renderHilsener();
  }

  function renderHilsener() {
    const liste = document.getElementById('hilsen-liste');
    if (!hilsener.length) {
      liste.innerHTML = `<div class="empty-state"><div class="empty-icon">💌</div><div>Ingen hilsener ennå — vær den første!</div></div>`;
      return;
    }
    liste.innerHTML = hilsener.map(h => `
      <div class="hilsen-kort">
        <div class="hilsen-navn">${esc(h.navn)}</div>
        <div class="hilsen-tekst">${esc(h.tekst)}</div>
        <div class="hilsen-tid">${formaterDato(h.opprettet)}</div>
      </div>`).join('');
  }

  async function sendHilsen() {
    const navn = document.getElementById('hilsen-navn').value.trim();
    const tekst = document.getElementById('hilsen-tekst').value.trim();
    if (!navn || !tekst) { toast('Fyll inn både navn og hilsen'); return; }
    const ny = { navn, tekst, opprettet: new Date().toISOString() };
    try {
      const res = await fetch(`${API_BASE}/thomas50-greetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ny),
      });
      if (!res.ok) throw new Error('API feil');
      toast('Hilsen sendt! 🎉');
    } catch (e) {
      // Fallback til localStorage
      const lokal = JSON.parse(localStorage.getItem(STORAGE_HILSEN_LOKAL) || '[]');
      lokal.unshift(ny);
      localStorage.setItem(STORAGE_HILSEN_LOKAL, JSON.stringify(lokal));
      toast('Hilsen lagret lokalt (sendes når du er online)');
    }
    document.getElementById('hilsen-tekst').value = '';
    if (!mittNavn) settNavn(navn);
    lastHilsener();
  }

  // ============ Toastmaster ============
  function initToastmaster() {
    if (mittNavn) document.getElementById('toast-navn').value = mittNavn;
    document.getElementById('toast-lagre').onclick = sendToast;
  }

  async function sendToast() {
    const data = {
      navn: document.getElementById('toast-navn').value.trim(),
      epost: document.getElementById('toast-epost').value.trim(),
      tema: document.getElementById('toast-tema').value.trim(),
      melding: document.getElementById('toast-melding').value.trim(),
    };
    if (!data.navn || !data.melding) { toast('Fyll inn navn og melding'); return; }
    const status = document.getElementById('toast-status');
    status.textContent = 'Sender...';
    try {
      const res = await fetch(`${API_BASE}/thomas50-toast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('API feil');
      status.textContent = '';
      toast('🎤 Talemelding sendt til Ronny og Marianne!');
      document.getElementById('toast-tema').value = '';
      document.getElementById('toast-melding').value = '';
    } catch (e) {
      status.textContent = 'Kunne ikke sende — prøv igjen senere eller send mail direkte til ronnyandre@gmail.com';
    }
    if (data.navn) settNavn(data.navn);
  }

  // ============ Sang ============
  function initSang() {
    document.getElementById('lyrics-text').textContent = SANGER_LYRICS;
    document.getElementById('vis-lyrics').onclick = () => {
      const l = document.getElementById('lyrics');
      const b = document.getElementById('vis-lyrics');
      l.hidden = !l.hidden;
      b.textContent = l.hidden ? '📜 Vis sangtekst' : '🙈 Skjul tekst';
    };
    document.getElementById('kopier-tekst').onclick = async () => {
      try {
        await navigator.clipboard.writeText(SANGER_LYRICS);
        toast('Sangtekst kopiert!');
      } catch {
        toast('Kunne ikke kopiere — kopier manuelt');
      }
    };
  }

  // ============ Spill ============
  function initSpill() {
    document.querySelectorAll('.tab[data-spill]').forEach(t => {
      t.addEventListener('click', () => {
        document.querySelectorAll('.tab[data-spill]').forEach(x => x.classList.toggle('active', x === t));
        const v = t.dataset.spill;
        aktivSpillTab = v;
        document.getElementById('quiz-view').hidden = v !== 'quiz';
        document.getElementById('topp-view').hidden = v !== 'topp';
        document.getElementById('diskusjon-view').hidden = v !== 'diskusjon';
        document.getElementById('regler-view').hidden = v !== 'regler';
        if (v === 'topp') lastTopp();
      });
    });

    nullstillQuiz();
    renderQuiz();
    document.getElementById('quiz-prev').onclick = () => {
      if (quizFerdig) return;
      quizIdx = (quizIdx - 1 + SPILL_QUIZ.length) % SPILL_QUIZ.length;
      renderQuiz();
    };
    document.getElementById('quiz-next').onclick = neste;
    document.getElementById('quiz-restart').onclick = () => { nullstillQuiz(); renderQuiz(); };
    document.getElementById('quiz-se-topp').onclick = () => {
      document.querySelector('.tab[data-spill="topp"]').click();
    };

    renderDiskusjon();
    document.getElementById('disk-next').onclick = () => { diskIdx = (diskIdx + 1) % SPILL_SPØRSMÅL.length; renderDiskusjon(); };
    document.getElementById('disk-rand').onclick = () => { diskIdx = Math.floor(Math.random() * SPILL_SPØRSMÅL.length); renderDiskusjon(); };
  }

  function nullstillQuiz() {
    quizIdx = 0; quizScore = 0; quizSvart = 0; quizFerdig = false;
    document.getElementById('quiz-resultat').hidden = true;
    document.querySelector('#quiz-view .quiz-card').hidden = false;
    document.getElementById('quiz-spill-status').hidden = false;
  }

  function neste() {
    if (quizIdx < SPILL_QUIZ.length - 1) {
      quizIdx++;
      renderQuiz();
    } else {
      visResultat();
    }
  }

  function renderQuiz() {
    const q = SPILL_QUIZ[quizIdx];
    document.getElementById('quiz-spill-status').textContent = `Score: ${quizScore} / ${quizSvart}`;
    document.getElementById('quiz-num').textContent = `Spørsmål ${quizIdx + 1} / ${SPILL_QUIZ.length}`;
    document.getElementById('quiz-q').textContent = q.spm;
    const opts = document.getElementById('quiz-options');
    const fasit = document.getElementById('quiz-fasit');
    const nextBtn = document.getElementById('quiz-next');
    const prevBtn = document.getElementById('quiz-prev');
    fasit.hidden = true;
    nextBtn.textContent = quizIdx === SPILL_QUIZ.length - 1 ? '🏁 Ferdig' : 'Neste →';
    nextBtn.disabled = true;
    nextBtn.style.opacity = '0.5';
    prevBtn.disabled = quizIdx === 0;
    prevBtn.style.opacity = quizIdx === 0 ? '0.5' : '1';
    opts.innerHTML = q.valg.map((v, i) => `<button class="quiz-opt" data-i="${i}">${esc(v)}</button>`).join('');
    opts.querySelectorAll('.quiz-opt').forEach(b => {
      b.onclick = () => svarKlikket(b, q);
    });
  }

  function svarKlikket(btn, q) {
    const opts = document.getElementById('quiz-options');
    if (opts.querySelector('.disabled')) return;
    const i = +btn.dataset.i;
    opts.querySelectorAll('.quiz-opt').forEach(x => x.classList.add('disabled'));
    quizSvart++;
    if (q.svar === null) {
      btn.classList.add('korrekt');
      quizScore++;
    } else if (i === q.svar) {
      btn.classList.add('korrekt');
      quizScore++;
    } else {
      btn.classList.add('feil');
      const k = opts.querySelector(`[data-i="${q.svar}"]`);
      if (k) k.classList.add('korrekt');
    }
    document.getElementById('quiz-fasit').textContent = q.fasit;
    document.getElementById('quiz-fasit').hidden = false;
    document.getElementById('quiz-spill-status').textContent = `Score: ${quizScore} / ${quizSvart}`;
    // Aktiver Neste-knappen
    const nextBtn = document.getElementById('quiz-next');
    nextBtn.disabled = false;
    nextBtn.style.opacity = '1';
  }

  function visResultat() {
    quizFerdig = true;
    document.querySelector('#quiz-view .quiz-card').hidden = true;
    document.getElementById('quiz-spill-status').hidden = true;
    document.getElementById('quiz-resultat').hidden = false;

    const prosent = Math.round((quizScore / SPILL_QUIZ.length) * 100);
    let tittel = `${quizScore} av ${SPILL_QUIZ.length} riktig!`;
    let tekst = '';
    if (prosent === 100) tekst = 'Perfekt! Du må kjenne Thomas usedvanlig godt 🥇';
    else if (prosent >= 80) tekst = 'Imponerende! Du er definitivt en ekte venn 🥈';
    else if (prosent >= 60) tekst = 'Bra! Du kjenner Thomas godt 🥉';
    else if (prosent >= 40) tekst = 'OK — kanskje du lærer mer i kveld 🍻';
    else tekst = 'Hm... Kanskje på tide å bli bedre kjent? 😉';
    document.getElementById('quiz-resultat-tittel').textContent = tittel;
    document.getElementById('quiz-resultat-tekst').textContent = tekst;

    // Hvis ingen navn: vis input
    const tekstEl = document.getElementById('quiz-resultat-tekst');
    const eksisterende = document.getElementById('quiz-navn-form');
    if (eksisterende) eksisterende.remove();

    if (!mittNavn) {
      const form = document.createElement('div');
      form.id = 'quiz-navn-form';
      form.style.marginTop = '16px';
      form.innerHTML = `
        <p style="font-size:13px;color:#D4A853">🏆 Du kommer på topp 10! Skriv navnet ditt:</p>
        <input id="quiz-navn-input" type="text" placeholder="Ditt navn" 
          style="display:block;width:100%;padding:10px;margin:8px 0;background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#E8E0D4;font-size:15px;
          box-sizing:border-box;font-family:inherit" />
        <button id="quiz-navn-lagre" class="btn-primary" style="margin:0">💾 Lagre score</button>`;
      tekstEl.after(form);
      const inp = form.querySelector('#quiz-navn-input');
      setTimeout(() => inp.focus(), 100);
      form.querySelector('#quiz-navn-lagre').onclick = async () => {
        const n = inp.value.trim();
        if (!n) { inp.focus(); return; }
        settNavn(n);
        await sendHighscore(n, quizScore, SPILL_QUIZ.length);
        form.remove();
        toast('🏆 Score lagret!');
        lastTopp();
      };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') form.querySelector('#quiz-navn-lagre').click(); });
    } else {
      // Auto-lagre
      sendHighscore(mittNavn, quizScore, SPILL_QUIZ.length).then(() => toast('🏆 Score lagret!'));
    }
  }

  async function sendHighscore(navn, score, antall) {
    try {
      await fetch(`${API_BASE}/thomas50-highscore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ navn, score, antall }),
      });
    } catch {}
  }

  async function lastTopp() {
    const liste = document.getElementById('topp-liste');
    liste.innerHTML = '<p class="muted" style="text-align:center;padding:20px">Henter topp 10...</p>';
    try {
      const r = await fetch(`${API_BASE}/thomas50-highscore`);
      const data = await r.json();
      if (!data.length) {
        liste.innerHTML = '<div class="empty-state"><div class="empty-icon">🏆</div><div>Ingen scores ennå — bli den første!</div></div>';
        return;
      }
      liste.innerHTML = '<div class="topp-liste">' + data.map((d, i) => {
        const medalje = ['🥇', '🥈', '🥉'][i] || `${i+1}.`;
        const prosent = Math.round((d.score / d.antall) * 100);
        return `<div class="topp-rad">
          <span class="topp-medalje">${medalje}</span>
          <span class="topp-navn">${esc(d.navn)}</span>
          <span class="topp-score">${d.score}/${d.antall} (${prosent}%)</span>
        </div>`;
      }).join('') + '</div>';
    } catch {
      liste.innerHTML = '<p class="muted" style="text-align:center;padding:20px">Kunne ikke hente topp-listen.</p>';
    }
  }

  function renderDiskusjon() {
    document.getElementById('disk-num').textContent = `Spørsmål ${diskIdx + 1} / ${SPILL_SPØRSMÅL.length}`;
    document.getElementById('disk-q').textContent = SPILL_SPØRSMÅL[diskIdx];
  }

  // ============ Minnebok ============
  function initMinnebok() {
    document.getElementById('last-opp').onclick = () => document.getElementById('file-input').click();
    document.getElementById('file-input').onchange = lastOpp;
    renderBilder();
  }

  function lastOpp(e) {
    const filer = Array.from(e.target.files);
    let i = 0;
    filer.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => {
        bilder.unshift({ id: Date.now() + Math.random(), src: ev.target.result, navn: f.name });
        bilder = bilder.slice(0, 60);
        localStorage.setItem(STORAGE_BILDER, JSON.stringify(bilder));
        if (++i === filer.length) { renderBilder(); toast('📷 Bilder lastet opp!'); }
      };
      reader.readAsDataURL(f);
    });
  }

  function renderBilder() {
    const grid = document.getElementById('bilde-grid');
    const tom = document.getElementById('minnebok-tom');
    if (!bilder.length) { tom.hidden = false; grid.innerHTML = ''; return; }
    tom.hidden = true;
    grid.innerHTML = bilder.map(b => `
      <div class="bilde-wrap" data-id="${b.id}">
        <img src="${b.src}" alt="" />
      </div>`).join('');
    grid.querySelectorAll('.bilde-wrap').forEach(el => {
      el.onclick = () => visBilde(el.dataset.id);
    });
  }

  function visBilde(id) {
    const b = bilder.find(x => String(x.id) === String(id));
    if (!b) return;
    document.getElementById('overlay-img').src = b.src;
    document.getElementById('overlay').hidden = false;
    document.getElementById('overlay-close').onclick = () => {
      if (confirm('Slett dette bildet fra Minneboken?')) {
        bilder = bilder.filter(x => x.id !== b.id);
        localStorage.setItem(STORAGE_BILDER, JSON.stringify(bilder));
        renderBilder();
      }
      document.getElementById('overlay').hidden = true;
    };
  }

  function initOverlay() {
    document.getElementById('overlay').addEventListener('click', e => {
      if (e.target.id === 'overlay') document.getElementById('overlay').hidden = true;
    });
  }

  // ============ Mario-spill ============
  function initMario() {
    const canvas = document.getElementById('mario-canvas');
    const startScr = document.getElementById('mario-start');
    const resScr = document.getElementById('mario-resultat');
    const startBtn = document.getElementById('mario-start-btn');
    const restartBtn = document.getElementById('mario-restart-btn');
    const seToppBtn = document.getElementById('mario-se-topp-btn');

    if (!canvas || !window.ThomasSpill) return;

    ThomasSpill.init(canvas, async (score) => {
      canvas.hidden = true;
      resScr.hidden = false;
      let tittel = `Du tok ${score} poeng!`;
      let tekst = '';
      if (score >= 50) tekst = '🥇 Helt sykt! Du er en ekte runner.';
      else if (score >= 30) tekst = '🥈 Imponerende! Du kommer trygt til festen.';
      else if (score >= 15) tekst = '🥉 Bra jobbet! Litt øl underveis.';
      else if (score > 0) tekst = '🍺 Du fikk noen øl, men hadde litt trøbbel.';
      else tekst = '😅 Pust dypt og prøv igjen!';
      document.getElementById('mario-resultat-tittel').textContent = tittel;
      document.getElementById('mario-resultat-tekst').textContent = tekst;

      // Eksisterende navn-input fjernes hvis allerede der
      const eks = document.getElementById('mario-navn-form');
      if (eks) eks.remove();

      if (!mittNavn) {
        const form = document.createElement('div');
        form.id = 'mario-navn-form';
        form.style.marginTop = '16px';
        form.innerHTML = `
          <p style="font-size:13px;color:#D4A853">🏆 Skriv navnet ditt for å komme på topp 10!</p>
          <input id="mario-navn-input" type="text" placeholder="Ditt navn"
            style="display:block;width:100%;padding:10px;margin:8px 0;background:rgba(255,255,255,0.07);
            border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#E8E0D4;font-size:15px;
            box-sizing:border-box;font-family:inherit" />
          <button id="mario-navn-lagre" class="btn-primary" style="margin:0">💾 Lagre score</button>`;
        document.getElementById('mario-resultat-tekst').after(form);
        const inp = form.querySelector('#mario-navn-input');
        setTimeout(() => inp.focus(), 100);
        form.querySelector('#mario-navn-lagre').onclick = async () => {
          const n = inp.value.trim();
          if (!n) { inp.focus(); return; }
          settNavn(n);
          await sendMarioScore(n, score);
          form.remove();
          toast('🏆 Score lagret!');
          lastMarioTopp();
        };
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') form.querySelector('#mario-navn-lagre').click(); });
      } else {
        sendMarioScore(mittNavn, score).then(() => { toast('🏆 Score lagret!'); lastMarioTopp(); });
      }
    });

    function startSpill() {
      startScr.hidden = true;
      resScr.hidden = true;
      canvas.hidden = false;
      const form = document.getElementById('mario-navn-form');
      if (form) form.remove();
      // Wait for layout, then start
      setTimeout(() => ThomasSpill.start(), 50);
    }

    startBtn.onclick = startSpill;
    restartBtn.onclick = startSpill;
    seToppBtn.onclick = () => {
      resScr.scrollIntoView({ behavior: 'smooth' });
      lastMarioTopp();
    };

    lastMarioTopp();
  }

  async function sendMarioScore(navn, score) {
    try {
      await fetch(`${API_BASE}/thomas50-spillscore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ navn, score }),
      });
    } catch {}
  }

  async function lastMarioTopp() {
    const liste = document.getElementById('mario-topp');
    if (!liste) return;
    liste.innerHTML = '<p class="muted" style="text-align:center;padding:14px">Henter topp 10...</p>';
    try {
      const r = await fetch(`${API_BASE}/thomas50-spillscore`);
      const data = await r.json();
      if (!data.length) {
        liste.innerHTML = '<div class="empty-state"><div class="empty-icon">🎮</div><div>Ingen scores ennå — bli den første!</div></div>';
        return;
      }
      liste.innerHTML = '<div class="topp-liste">' + data.map((d, i) => {
        const medalje = ['🥇', '🥈', '🥉'][i] || `${i+1}.`;
        return `<div class="topp-rad">
          <span class="topp-medalje">${medalje}</span>
          <span class="topp-navn">${esc(d.navn)}</span>
          <span class="topp-score">${d.score} poeng</span>
        </div>`;
      }).join('') + '</div>';
    } catch {
      liste.innerHTML = '<p class="muted" style="text-align:center;padding:14px">Kunne ikke hente topp-listen.</p>';
    }
  }

  // ============ Brukerstatistikk ============
  async function sporBesok(side) {
    try {
      const navnTilSporing = mittNavn || `(anon) ${deviceId()}`;
      await fetch(`${API_BASE}/thomas50-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          navn: navnTilSporing,
          side,
          tidspunkt: new Date().toISOString(),
          ua: navigator.userAgent.substring(0, 200),
        }),
      });
    } catch { /* stille */ }
  }

  // ============ Helpers ============
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function formaterDato(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString('nb-NO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  }
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(window._tT);
    window._tT = setTimeout(() => { t.hidden = true; }, 3200);
  }
})();
