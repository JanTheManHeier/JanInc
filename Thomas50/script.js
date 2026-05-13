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

  // ============ Init ============
  document.addEventListener('DOMContentLoaded', () => {
    initNavnModal();
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
    sporBesok('hjem');
  });

  // ============ Navn-modal ============
  function initNavnModal() {
    const modal = document.getElementById('navn-modal');
    if (!mittNavn) {
      modal.hidden = false;
      const inp = document.getElementById('navn-input');
      inp.focus();
      document.getElementById('navn-lagre').onclick = () => {
        const n = inp.value.trim();
        if (n) {
          mittNavn = n;
          localStorage.setItem(STORAGE_NAVN, n);
          modal.hidden = true;
          toast(`Velkommen, ${n}! 🎉`);
          sporBesok('hjem');
        } else {
          inp.focus();
        }
      };
      document.getElementById('navn-skip').onclick = () => { modal.hidden = true; };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('navn-lagre').click(); });
    }
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

    // Karriere
    const k = document.getElementById('karriere-liste');
    if (k && OM_THOMAS && OM_THOMAS.jobber) {
      k.innerHTML = OM_THOMAS.jobber.map(j => `
        <div class="karriere-item">
          <div class="tittel">${esc(j.tittel)}</div>
          <div class="selskap">${esc(j.selskap)}</div>
          <div class="periode">${esc(j.periode)}</div>
        </div>`).join('');
    }
    // Fun facts
    const f = document.getElementById('fun-facts');
    if (f && OM_THOMAS && OM_THOMAS.fun_facts) {
      f.innerHTML = OM_THOMAS.fun_facts.map(x => `<div>${esc(x)}</div>`).join('');
    }
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
          ${g.folge ? `<div class="gjest-bio" style="color:#7A8FA8">Følge: ${esc(g.folge)}</div>` : ''}
          ${tag}
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
    if (!mittNavn) {
      mittNavn = navn;
      localStorage.setItem(STORAGE_NAVN, navn);
    }
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
        document.getElementById('quiz-view').hidden = v !== 'quiz';
        document.getElementById('diskusjon-view').hidden = v !== 'diskusjon';
        document.getElementById('regler-view').hidden = v !== 'regler';
      });
    });

    renderQuiz();
    document.getElementById('quiz-prev').onclick = () => { quizIdx = (quizIdx - 1 + SPILL_QUIZ.length) % SPILL_QUIZ.length; renderQuiz(); };
    document.getElementById('quiz-next').onclick = () => { quizIdx = (quizIdx + 1) % SPILL_QUIZ.length; renderQuiz(); };

    renderDiskusjon();
    document.getElementById('disk-next').onclick = () => { diskIdx = (diskIdx + 1) % SPILL_SPØRSMÅL.length; renderDiskusjon(); };
    document.getElementById('disk-rand').onclick = () => { diskIdx = Math.floor(Math.random() * SPILL_SPØRSMÅL.length); renderDiskusjon(); };
  }

  function renderQuiz() {
    const q = SPILL_QUIZ[quizIdx];
    document.getElementById('quiz-num').textContent = `Spørsmål ${quizIdx + 1} / ${SPILL_QUIZ.length}`;
    document.getElementById('quiz-q').textContent = q.spm;
    const opts = document.getElementById('quiz-options');
    const fasit = document.getElementById('quiz-fasit');
    fasit.hidden = true;
    opts.innerHTML = q.valg.map((v, i) => `<button class="quiz-opt" data-i="${i}">${esc(v)}</button>`).join('');
    opts.querySelectorAll('.quiz-opt').forEach(b => {
      b.onclick = () => {
        const i = +b.dataset.i;
        opts.querySelectorAll('.quiz-opt').forEach(x => x.classList.add('disabled'));
        if (q.svar === null) {
          b.classList.add('korrekt');
        } else if (i === q.svar) {
          b.classList.add('korrekt');
        } else {
          b.classList.add('feil');
          opts.querySelector(`[data-i="${q.svar}"]`).classList.add('korrekt');
        }
        fasit.textContent = q.fasit;
        fasit.hidden = false;
      };
    });
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

  // ============ Brukerstatistikk ============
  async function sporBesok(side) {
    try {
      await fetch(`${API_BASE}/thomas50-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          navn: mittNavn || 'anonym',
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
