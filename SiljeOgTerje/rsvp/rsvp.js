// rsvp.js — RSVP-logikk. Personlig lenke (?g=slug) forhåndsvelger gjesten,
// felles lenke lar gjesten velge navn fra lista. Lagrer mot /api/siljeterje-rsvp.
(async function () {
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

  const gjester = [...(typeof GJESTER !== 'undefined' ? GJESTER : [])].filter(g => g.navn);
  try {
    const r = await fetch('/api/siljeterje-gjest-edit');
    if (r.ok) {
      const edits = await r.json();
      edits.forEach(e => {
        const eksisterende = gjester.find(g => g.navn === e.navn);
        if (e.skjult) {
          if (eksisterende) gjester.splice(gjester.indexOf(eksisterende), 1);
        } else if (e.nyGjest && !eksisterende) {
          gjester.push({ navn: e.navn, relasjon: e.relasjon || '', bordType: e.bordType || 10 });
        } else if (eksisterende && e.nyttNavn) {
          eksisterende.navn = e.nyttNavn;
        }
      });
    }
  } catch (_) {}
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
  document.querySelectorAll('#valg-fredag input').forEach(inp => {
    inp.addEventListener('change', () => {
      oppdaterValg('valg-fredag');
      $('fredag-antall-felt').classList.toggle('skjult', inp.value !== 'ja' || !inp.checked);
    });
  });

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
    if (s.fredag === true) settRadio('fredag', 'ja');
    else if (s.fredag === false) settRadio('fredag', 'nei');
    $('fredag-antall').value = s.fredagAntall || (s.fredag ? (s.antall || 1) : 1);
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
    const fredagInp = document.querySelector('input[name="fredag"]:checked');
    if (!fredagInp) { status.textContent = 'Velg om du/dere kommer på minglefesten 🙂'; status.className = 'status feil'; return; }
    const fredag = fredagInp.value === 'ja';
    const fredagAntall = fredag ? parseInt($('fredag-antall').value, 10) || 1 : 0;

    const body = {
      slug: gjestSlug(aktivGjest),
      navn: aktivGjest.navn,
      kunFredag: true,
      kommer: true,
      fredag,
      fredagAntall,
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
    if (body.fredag) {
      $('takk-emoji').textContent = '🥳';
      $('takk-tittel').textContent = `Så hyggelig, ${fornavn}!`;
      $('takk-tekst').textContent = 'Vi gleder oss til å se dere på minglefesten.';
      const rader = [];
      rader.push('<div>🥂 <strong>Bryllupet:</strong> Bekreftet</div>');
      rader.push('<div>🎉 <strong>Minglefest fredag:</strong> Ja</div>');
      rader.push(`<div>👥 <strong>Antall på minglefesten:</strong> ${body.fredagAntall}</div>`);
      $('takk-oppsummering').innerHTML = rader.join('');
    } else {
      $('takk-emoji').textContent = '💌';
      $('takk-tittel').textContent = 'Takk for svaret';
      $('takk-tekst').textContent = `Da sees vi i bryllupet, ${fornavn}!`;
      $('takk-oppsummering').innerHTML =
        '<div>🥂 <strong>Bryllupet:</strong> Bekreftet</div><div>🎉 <strong>Minglefest fredag:</strong> Nei</div>';
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
