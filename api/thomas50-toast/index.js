const { getConnection, executeQuery, TYPES } = require('../shared/db');
const { sendMail } = require('../shared/mailer');
const { sjekkRate } = require('../shared/ratelimit');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Thomas50_Toaster')
CREATE TABLE Thomas50_Toaster (
    id INT IDENTITY(1,1) PRIMARY KEY,
    navn NVARCHAR(100) NOT NULL,
    epost NVARCHAR(200) NULL,
    tema NVARCHAR(200) NULL,
    melding NVARCHAR(MAX) NOT NULL,
    opprettet DATETIME2 DEFAULT GETDATE()
);`;

const TOAST_TO = process.env.TOAST_NOTIFY_TO || 'ronnyandre@gmail.com';
const TOAST_CC = process.env.TOAST_NOTIFY_CC || '';

function escHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function lagMail({ navn, epost, tema, melding }) {
    const subject = `🎤 Ny taleforespørsel til Thomas 50 — fra ${navn}`;
    const epostLinje = epost || '(ikke oppgitt)';
    const temaLinje = tema || '(ikke oppgitt)';
    const text = `Hei Ronny og Marianne!

Det er noen som ønsker å holde tale i Thomas sin 50-årsfeiring 30. mai 2026.

Navn:    ${navn}
E-post:  ${epostLinje}
Tema:    ${temaLinje}

Melding:
${melding}

Svar gjerne direkte til avsenderen for å avtale plass i programmet.

Hilsen
Jans agent 🤖
(Automatisk varsel fra Thomas50-appen på https://janinc.no/Thomas50/)`;

    const html = `
<p>Hei Ronny og Marianne!</p>
<p>Det er noen som ønsker å holde tale i Thomas sin 50-årsfeiring 30. mai 2026.</p>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
  <tr><td style="padding:6px 12px 6px 0;color:#888"><strong>Navn</strong></td><td style="padding:6px 0">${escHtml(navn)}</td></tr>
  <tr><td style="padding:6px 12px 6px 0;color:#888"><strong>E-post</strong></td><td style="padding:6px 0">${epost ? `<a href="mailto:${escHtml(epost)}">${escHtml(epost)}</a>` : '<em>(ikke oppgitt)</em>'}</td></tr>
  <tr><td style="padding:6px 12px 6px 0;color:#888"><strong>Tema</strong></td><td style="padding:6px 0">${tema ? escHtml(tema) : '<em>(ikke oppgitt)</em>'}</td></tr>
</table>
<p style="margin-top:14px"><strong>Melding:</strong></p>
<blockquote style="border-left:3px solid #D4A853;padding:8px 14px;color:#333;background:#fafafa;white-space:pre-wrap;font-family:sans-serif;font-size:14px">${escHtml(melding)}</blockquote>
<p>Svar gjerne direkte til avsenderen for å avtale plass i programmet.</p>
<p style="color:#888;font-size:13px;margin-top:24px">Hilsen<br/>Jans agent 🤖<br/><em>Automatisk varsel fra <a href="https://janinc.no/Thomas50/">Thomas50-appen</a></em></p>`;

    return { subject, text, html };
}

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        const rl = sjekkRate(req, 'toast', 3);
        if (!rl.ok) {
            context.res = { status: 429, headers, body: { error: `For mange taleforespørsler. Prøv igjen om ${rl.gjenstaar} sek.` } };
            return;
        }
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);

        const { navn, epost, tema, melding } = req.body || {};
        if (!navn || !melding) {
            context.res = { status: 400, headers, body: { error: 'navn og melding påkrevd' } };
            return;
        }
        if (String(navn).length > 100 || String(melding).length > 4000 ||
            (epost && String(epost).length > 200) || (tema && String(tema).length > 200)) {
            context.res = { status: 400, headers, body: { error: 'For lange felter' } };
            return;
        }

        const navnRen = String(navn).trim();
        const epostRen = epost ? String(epost).trim() : null;
        const temaRen = tema ? String(tema).trim() : null;
        const meldingRen = String(melding).trim();

        await executeQuery(connection,
            'INSERT INTO Thomas50_Toaster (navn, epost, tema, melding) VALUES (@navn, @epost, @tema, @melding)',
            [
                { name: 'navn', type: TYPES.NVarChar, value: navnRen },
                { name: 'epost', type: TYPES.NVarChar, value: epostRen },
                { name: 'tema', type: TYPES.NVarChar, value: temaRen },
                { name: 'melding', type: TYPES.NVarChar, value: meldingRen }
            ]
        );

        // Send e-postvarsel (failer ikke API-et hvis e-post feiler)
        const mail = lagMail({ navn: navnRen, epost: epostRen, tema: temaRen, melding: meldingRen });
        const mailRes = await sendMail({
            to: TOAST_TO,
            cc: TOAST_CC || undefined,
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
        });
        if (!mailRes.ok) {
            context.log.warn('thomas50-toast: e-postvarsel feilet:', mailRes.reason);
        }

        context.res = { status: 200, headers, body: { success: true, mailSent: mailRes.ok } };
    } catch (err) {
        context.log.error('thomas50-toast error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};

