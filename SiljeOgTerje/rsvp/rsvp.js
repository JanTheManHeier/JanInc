// rsvp.js — RSVP-logikk. Personlig lenke (?g=slug) forhåndsvelger gjesten,
// felles lenke lar gjesten velge navn fra lista. Lagrer mot /api/siljeterje-rsvp.
(function () {
  'use strict';

  // Stabil slug per gjest — utledes fra bildefil-navnet (generert ved scraping),
  // ellers slugifiseres navnet. Samme funksjon brukes i admin for personlige lenker.
  function slugify(s) {
    return String(s || '').toLowerCase()
      .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
      .replace(/[àáâ]/g, 'a').replace(/[èéê]/g, 'e').replace(/[ìí]/g, 'i')
      .replace(/[òó]/g, 'o').replace(/[ùú]/g, 'u')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  function gjestSlug(g) {
    if (g.slug) return g.slug;
    if (g.bildeFil) {
      const m = g.bildeFil.match(/([^\/\\]+)\.(?:jpg|jpeg|png|webp)$/i);
      if (m) return m[1].toLowerCase();
    }
    return slugify(g.navn);
  }

  const gjester = (typeof GJESTER !== 'undefined' ? GJESTER : []).filter(g => g.navn);
  const slugTilGjest = {};
  gjester.forEach(g => { slugTilGjest[gjestSlug(g)] = g; });

  const $ = id => document.getElementById(id);
  const velgKort = $('velg-kort');
  const velgGjest = $('velg-gjest');
  const skjema = $('skjema');
  const takk = $('takk');
  let aktivGjest = null;

  // Fyll dropdown (alfabetisk på fornavn)
  [...gjester].sort((a, b) => a.navn.localeCompare(b.navn, 'nb'))
    .forEach(g => {
      const o = document.createElement('option');
      o.value = gjestSlug(g);
      o.textContent = g.navn;
      velgGjest.appendChild(o);
    });

  // Radio-visuell oppdatering
  function oppdaterValg(gruppeId, navn) {
    document.querySelectorAll('#' + gruppeId + ' label').forEach(l => {
      const inp = l.querySelector('input');
      l.classList.remove('valgt-ja', 'valgt-nei');
      if (inp.checked) l.classList.add(inp.value === 'ja' ? 'valgt-ja' : 'valgt-nei');
    });
  }
  document.querySelectorAll('#valg-kommer input').forEach(inp => {
    inp.addEventListener('change', () => {
      oppdaterValg('valg-kommer');
      $('ja-felter').classList.toggle('skjult', inp.value !== 'ja' || !inp.checked);
    });
  });
  document.querySelectorAll('#valg-fredag input').forEach(inp => {
    inp.addEventListener('change', () => oppdaterValg('valg-fredag'));
  });

  // Vis navnefelt for ledsager(e) når antall > 1
  function oppdaterLedsager() {
    const n = parseInt($('antall').value, 10) || 1;
    $('ledsager-felt').classList.toggle('skjult', n <= 1);
  }
  $('antall').addEventListener('input', oppdaterLedsager);

  function visSkjema(g) {
    aktivGjest = g;
    velgKort.classList.add('skjult');
    skjema.classList.remove('skjult');
    takk.classList.add('skjult');
    const fornavn = g.navn.split(' ')[0];
    $('hilsen').textContent = `Hei ${fornavn}! 💛`;
    hentTidligereSvar(gjestSlug(g));
  }

  async function hentTidligereSvar(slug) {
    try {
      const r = await fetch('/api/siljeterje-rsvp?slug=' + encodeURIComponent(slug));
      if (!r.ok) return;
      const d = await r.json();
      if (d && d.svar) fyllSkjema(d.svar);
    } catch (_) { /* tom = nytt svar */ }
  }

  function settRadio(navn, verdi) {
    const el = document.querySelector(`input[name="${navn}"][value="${verdi}"]`);
    if (el) { el.checked = true; el.dispatchEvent(new Event('change')); }
  }

  function fyllSkjema(s) {
    if (s.kommer) settRadio('kommer', 'ja'); else settRadio('kommer', 'nei');
    if (s.fredag === true) settRadio('fredag', 'ja');
    else if (s.fredag === false) settRadio('fredag', 'nei');
    if (s.antall) $('antall').value = s.antall;
    $('ledsagere').value = s.ledsagere || '';
    oppdaterLedsager();
    $('allergier').value = s.allergier || '';
    $('kommentar').value = s.kommentar || '';
    $('lagre-btn').textContent = 'Oppdater svaret mitt';
  }

  velgGjest.addEventListener('change', () => {
    const g = slugTilGjest[velgGjest.value];
    if (g) visSkjema(g);
  });

  skjema.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = $('status');
    const kommerInp = document.querySelector('input[name="kommer"]:checked');
    if (!kommerInp) { status.textContent = 'Velg om du kommer eller ikke 🙂'; status.className = 'status feil'; return; }
    const kommer = kommerInp.value === 'ja';
    const fredagInp = document.querySelector('input[name="fredag"]:checked');
    const antall = kommer ? parseInt($('antall').value, 10) || 1 : 0;
    const ledsagere = kommer ? $('ledsagere').value.trim() : '';

    if (kommer && antall > 1 && !ledsagere) {
      status.textContent = 'Skriv inn navnet på den/de du har med deg 🙂';
      status.className = 'status feil';
      $('ledsager-felt').classList.remove('skjult');
      $('ledsagere').focus();
      return;
    }

    const body = {
      slug: gjestSlug(aktivGjest),
      navn: aktivGjest.navn,
      kommer: kommer,
      fredag: kommer && fredagInp ? fredagInp.value === 'ja' : false,
      antall: antall,
      ledsagere: ledsagere,
      allergier: kommer ? $('allergier').value.trim() : '',
      kommentar: $('kommentar').value.trim(),
    };

    const btn = $('lagre-btn');
    btn.disabled = true;
    status.textContent = 'Lagrer …'; status.className = 'status';
    try {
      const r = await fetch('/api/siljeterje-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error('status ' + r.status);
      visTakk(body);
    } catch (err) {
      status.textContent = 'Beklager, kunne ikke lagre. Prøv igjen. (' + (err.message || err) + ')';
      status.className = 'status feil';
    } finally {
      btn.disabled = false;
    }
  });

  function visTakk(body) {
    skjema.classList.add('skjult');
    takk.classList.remove('skjult');
    const fornavn = body.navn.split(' ')[0];
    if (body.kommer) {
      $('takk-emoji').textContent = '🥳';
      $('takk-tittel').textContent = `Så gøy, ${fornavn}!`;
      $('takk-tekst').textContent = 'Vi gleder oss til å feire sammen med deg.';
      const rader = [];
      rader.push(`<div>🥂 <strong>Kommer i bryllupet:</strong> Ja</div>`);
      rader.push(`<div>🍕 <strong>Mingling fredag:</strong> ${body.fredag ? 'Ja' : 'Nei'}</div>`);
      rader.push(`<div>👥 <strong>Antall personer:</strong> ${body.antall}</div>`);
      if (body.ledsagere) rader.push(`<div>🧑‍🤝‍🧑 <strong>Med deg:</strong> ${esc(body.ledsagere).replace(/\n/g, ', ')}</div>`);
      if (body.allergier) rader.push(`<div>🌿 <strong>Allergier/preferanser:</strong> ${esc(body.allergier)}</div>`);
      $('takk-oppsummering').innerHTML = rader.join('');
    } else {
      $('takk-emoji').textContent = '💔';
      $('takk-tittel').textContent = 'Takk for svaret';
      $('takk-tekst').textContent = `Så synd at du ikke kan komme, ${fornavn}. Vi savner deg!`;
      $('takk-oppsummering').innerHTML = `<div>🥂 <strong>Kommer i bryllupet:</strong> Nei</div>`;
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  $('endre-btn').addEventListener('click', () => {
    takk.classList.add('skjult');
    skjema.classList.remove('skjult');
  });

  // Personlig lenke: ?g=slug forhåndsvelger gjesten
  const params = new URLSearchParams(location.search);
  const gParam = (params.get('g') || params.get('gjest') || '').toLowerCase();
  if (gParam && slugTilGjest[gParam]) {
    visSkjema(slugTilGjest[gParam]);
  }
})();
