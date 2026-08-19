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
    requestId NVARCHAR(80) NULL,
    opprettet DATETIME2 DEFAULT GETDATE()
);
IF COL_LENGTH('SiljeTerje_Musikkonske', 'requestId') IS NULL
    ALTER TABLE SiljeTerje_Musikkonske ADD requestId NVARCHAR(80) NULL;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_SiljeTerje_Musikkonske_RequestId')
    CREATE UNIQUE INDEX UX_SiljeTerje_Musikkonske_RequestId
    ON SiljeTerje_Musikkonske(requestId) WHERE requestId IS NOT NULL;`;

const MUSIKK_TO = process.env.MUSIKK_NOTIFY_TO || 'terje.karlstad@snn.no';
const MUSIKK_CC = process.env.MUSIKK_NOTIFY_CC || 'isilje@hotmail.com';

function escHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function lagMail({ navn, artist, laat, melding }) {
    const subject = `🎵 Musikkønske til Silje og Terjes bryllup — fra ${navn}`;
    const text = `Hei Terje og Silje!

Det er kommet inn et musikkønske til bryllupet deres 22. august 2026.

Navn:    ${navn}
Artist:  ${artist || '(ikke oppgitt)'}
Låt:     ${laat || '(ikke oppgitt)'}

${melding ? 'Melding:\n' + melding + '\n' : ''}
Hilsen
Jans agent 🤖
(Automatisk varsel fra Silje og Terje-appen på https://janinc.no/SiljeOgTerje/)`;

    const html = `
<p>Hei Terje og Silje!</p>
<p>Det er kommet inn et musikkønske til bryllupet deres 22. august 2026.</p>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
  <tr><td style="padding:6px 12px 6px 0;color:#888"><strong>Navn</strong></td><td style="padding:6px 0">${escHtml(navn)}</td></tr>
  <tr><td style="padding:6px 12px 6px 0;color:#888"><strong>Artist</strong></td><td style="padding:6px 0">${artist ? escHtml(artist) : '<em>(ikke oppgitt)</em>'}</td></tr>
  <tr><td style="padding:6px 12px 6px 0;color:#888"><strong>Låt</strong></td><td style="padding:6px 0">${laat ? escHtml(laat) : '<em>(ikke oppgitt)</em>'}</td></tr>
</table>
${melding ? `<p style="margin-top:14px"><strong>Melding:</strong></p><blockquote style="border-left:3px solid #D4A853;padding:8px 14px;color:#333;background:#fafafa;white-space:pre-wrap;font-family:sans-serif;font-size:14px">${escHtml(melding)}</blockquote>` : ''}
<p style="color:#888;font-size:13px;margin-top:24px">Hilsen<br/>Jans agent 🤖<br/><em>Automatisk varsel fra <a href="https://janinc.no/SiljeOgTerje/">Silje og Terje-appen</a></em></p>`;

    return { subject, text, html };
}

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        const rl = sjekkRate(req, 'musikk', 30);
        if (!rl.ok) {
            context.res = { status: 429, headers, body: { error: `For mange musikkønsker. Prøv igjen om ${rl.gjenstaar} sek.` } };
            return;
        }
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);

        const { navn, artist, laat, melding, requestId } = req.body || {};
        if (!navn || (!artist && !laat)) {
            context.res = { status: 400, headers, body: { error: 'navn og minst artist eller låt påkrevd' } };
            return;
        }
        if (String(navn).length > 100 || (artist && String(artist).length > 200) ||
            (laat && String(laat).length > 200) || (melding && String(melding).length > 2000) ||
            (requestId && String(requestId).length > 80)) {
            context.res = { status: 400, headers, body: { error: 'For lange felter' } };
            return;
        }

        const navnRen = String(navn).trim();
        const artistRen = artist ? String(artist).trim() : null;
        const laatRen = laat ? String(laat).trim() : null;
        const meldingRen = melding ? String(melding).trim() : null;
        const requestIdRen = requestId ? String(requestId).trim() : null;

        if (requestIdRen) {
            const eksisterende = await executeQuery(connection,
                'SELECT TOP 1 id FROM SiljeTerje_Musikkonske WHERE requestId = @requestId',
                [{ name: 'requestId', type: TYPES.NVarChar, value: requestIdRen }]
            );
            if (eksisterende.length) {
                context.res = { status: 200, headers, body: { success: true, duplicate: true } };
                return;
            }
        }

        await executeQuery(connection,
            `INSERT INTO SiljeTerje_Musikkonske (navn, artist, laat, melding, requestId)
             SELECT @navn, @artist, @laat, @melding, @requestId
             WHERE @requestId IS NULL OR NOT EXISTS (
                 SELECT 1 FROM SiljeTerje_Musikkonske WHERE requestId = @requestId
             )`,
            [
                { name: 'navn', type: TYPES.NVarChar, value: navnRen },
                { name: 'artist', type: TYPES.NVarChar, value: artistRen },
                { name: 'laat', type: TYPES.NVarChar, value: laatRen },
                { name: 'melding', type: TYPES.NVarChar, value: meldingRen },
                { name: 'requestId', type: TYPES.NVarChar, value: requestIdRen }
            ]
        );

        const mail = lagMail({ navn: navnRen, artist: artistRen, laat: laatRen, melding: meldingRen });
        const mailRes = await sendMail({
            to: MUSIKK_TO,
            cc: MUSIKK_CC || undefined,
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
