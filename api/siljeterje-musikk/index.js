const { getConnection, executeQuery, TYPES } = require('../shared/db');
const { sendMail } = require('../shared/mailer');
const { sjekkRate } = require('../shared/ratelimit');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SiljeTerje_Musikkonske')
CREATE TABLE SiljeTerje_Musikkonske (
    id INT IDENTITY(1,1) PRIMARY KEY,
    navn NVARCHAR(100) NOT NULL,
    artist NVARCHAR(200) NULL,
    laat NVARCHAR(200) NULL,
    melding NVARCHAR(MAX) NULL,
    opprettet DATETIME2 DEFAULT GETDATE()
);`;

const AGGIE_TO = process.env.MUSIKK_NOTIFY_TO || 'aggiepeterson@mac.com';
const AGGIE_CC = process.env.MUSIKK_NOTIFY_CC || '';

function escHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function lagMail({ navn, artist, laat, melding }) {
    const subject = `🎵 Musikkønske til Thomas 50 — fra ${navn}`;
    const text = `Hei Aggie!

Det er kommet inn et musikkønske til Thomas sin 50-årsfeiring 30. mai 2026.

Navn:    ${navn}
Artist:  ${artist || '(ikke oppgitt)'}
Låt:     ${laat || '(ikke oppgitt)'}

${melding ? 'Melding:\n' + melding + '\n' : ''}
Hilsen
Jans agent 🤖
(Automatisk varsel fra SiljeTerje-appen på https://janinc.no/SiljeTerje/)`;

    const html = `
<p>Hei Aggie!</p>
<p>Det er kommet inn et musikkønske til Thomas sin 50-årsfeiring 30. mai 2026.</p>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
  <tr><td style="padding:6px 12px 6px 0;color:#888"><strong>Navn</strong></td><td style="padding:6px 0">${escHtml(navn)}</td></tr>
  <tr><td style="padding:6px 12px 6px 0;color:#888"><strong>Artist</strong></td><td style="padding:6px 0">${artist ? escHtml(artist) : '<em>(ikke oppgitt)</em>'}</td></tr>
  <tr><td style="padding:6px 12px 6px 0;color:#888"><strong>Låt</strong></td><td style="padding:6px 0">${laat ? escHtml(laat) : '<em>(ikke oppgitt)</em>'}</td></tr>
</table>
${melding ? `<p style="margin-top:14px"><strong>Melding:</strong></p><blockquote style="border-left:3px solid #D4A853;padding:8px 14px;color:#333;background:#fafafa;white-space:pre-wrap;font-family:sans-serif;font-size:14px">${escHtml(melding)}</blockquote>` : ''}
<p style="color:#888;font-size:13px;margin-top:24px">Hilsen<br/>Jans agent 🤖<br/><em>Automatisk varsel fra <a href="https://janinc.no/SiljeTerje/">SiljeTerje-appen</a></em></p>`;

    return { subject, text, html };
}

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        const rl = sjekkRate(req, 'musikk', 5);
        if (!rl.ok) {
            context.res = { status: 429, headers, body: { error: `For mange musikkønsker. Prøv igjen om ${rl.gjenstaar} sek.` } };
            return;
        }
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);

        const { navn, artist, laat, melding } = req.body || {};
        if (!navn || (!artist && !laat)) {
            context.res = { status: 400, headers, body: { error: 'navn og minst artist eller låt påkrevd' } };
            return;
        }
        if (String(navn).length > 100 || (artist && String(artist).length > 200) ||
            (laat && String(laat).length > 200) || (melding && String(melding).length > 2000)) {
            context.res = { status: 400, headers, body: { error: 'For lange felter' } };
            return;
        }

        const navnRen = String(navn).trim();
        const artistRen = artist ? String(artist).trim() : null;
        const laatRen = laat ? String(laat).trim() : null;
        const meldingRen = melding ? String(melding).trim() : null;

        await executeQuery(connection,
            'INSERT INTO SiljeTerje_Musikkonske (navn, artist, laat, melding) VALUES (@navn, @artist, @laat, @melding)',
            [
                { name: 'navn', type: TYPES.NVarChar, value: navnRen },
                { name: 'artist', type: TYPES.NVarChar, value: artistRen },
                { name: 'laat', type: TYPES.NVarChar, value: laatRen },
                { name: 'melding', type: TYPES.NVarChar, value: meldingRen }
            ]
        );

        const mail = lagMail({ navn: navnRen, artist: artistRen, laat: laatRen, melding: meldingRen });
        const mailRes = await sendMail({
            to: AGGIE_TO,
            cc: AGGIE_CC || undefined,
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
        });
        if (!mailRes.ok) {
            context.log.warn('siljeterje-musikk: e-postvarsel feilet:', mailRes.reason);
        }

        context.res = { status: 200, headers, body: { success: true, mailSent: mailRes.ok } };
    } catch (err) {
        context.log.error('siljeterje-musikk error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
