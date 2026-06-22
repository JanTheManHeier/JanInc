// siljeterje-svar — brudeparets spørrerunde. Silje og Terje fyller inn info som
// senere brukes til å fylle bryllupsappen. Svar lagres pr (person, sporsmal_id).
//
//   GET  ?person=silje|terje   -> { svar: { id: tekst, ... } } for den ene personen.
//   GET  ?all=1&key=ADMIN_KEY   -> { svar: { silje: {...}, terje: {...} } } (kun admin).
//   POST { person, svar:{...} } -> upsert av personens svar (krever IKKE admin-key,
//                                  brudeparet skal kunne lagre selv).
//
// Personvern: GET returnerer kun ÉN persons svar med mindre admin-nøkkel oppgis,
// så den enes private svar om den andre ikke lekker via API-et.
const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SiljeTerje_Svar')
CREATE TABLE SiljeTerje_Svar (
    person NVARCHAR(20) NOT NULL,
    sporsmal_id NVARCHAR(100) NOT NULL,
    svar NVARCHAR(MAX) NOT NULL,
    oppdatert DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT PK_SiljeTerje_Svar PRIMARY KEY (person, sporsmal_id)
);`;

const GYLDIGE = ['silje', 'terje'];

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);

        if (req.method === 'GET') {
            const all = req.query.all;
            if (all) {
                const adminKey = process.env.ADMIN_KEY;
                if (!adminKey || req.query.key !== adminKey) {
                    context.res = { status: 401, headers, body: { error: 'Ugyldig admin-key' } };
                    return;
                }
                const rows = await executeQuery(connection,
                    'SELECT person, sporsmal_id, svar, oppdatert FROM SiljeTerje_Svar');
                const svar = { silje: {}, terje: {} };
                const meta = {};
                let oppdatert = null;
                rows.forEach(r => {
                    if (!svar[r.person]) svar[r.person] = {};
                    svar[r.person][r.sporsmal_id] = r.svar;
                    if (!meta[r.person]) meta[r.person] = { antall: 0, sist: null };
                    if ((r.svar || '').toString().trim() !== '') meta[r.person].antall++;
                    if (!meta[r.person].sist || r.oppdatert > meta[r.person].sist) meta[r.person].sist = r.oppdatert;
                    if (!oppdatert || r.oppdatert > oppdatert) oppdatert = r.oppdatert;
                });
                context.res = { status: 200, headers, body: { svar, meta, oppdatert } };
                return;
            }

            const person = (req.query.person || '').toLowerCase();
            if (!GYLDIGE.includes(person)) {
                context.res = { status: 400, headers, body: { error: 'person må være silje eller terje' } };
                return;
            }
            const rows = await executeQuery(connection,
                'SELECT sporsmal_id, svar FROM SiljeTerje_Svar WHERE person = @person',
                [{ name: 'person', type: TYPES.NVarChar, value: person }]);
            const svar = {};
            rows.forEach(r => { svar[r.sporsmal_id] = r.svar; });
            context.res = { status: 200, headers, body: { svar } };
            return;
        }

        if (req.method === 'POST') {
            const body = req.body || {};
            const person = (body.person || '').toLowerCase();
            if (!GYLDIGE.includes(person)) {
                context.res = { status: 400, headers, body: { error: 'person må være silje eller terje' } };
                return;
            }
            const svar = body.svar;
            if (!svar || typeof svar !== 'object' || Array.isArray(svar)) {
                context.res = { status: 400, headers, body: { error: 'svar (objekt) påkrevd' } };
                return;
            }
            const ider = Object.keys(svar);
            if (ider.length > 500) {
                context.res = { status: 400, headers, body: { error: 'For mange svar' } };
                return;
            }
            for (const id of ider) {
                const tekst = svar[id] == null ? '' : String(svar[id]);
                if (id.length > 100 || tekst.length > 20000) {
                    context.res = { status: 400, headers, body: { error: 'For langt felt: ' + id } };
                    return;
                }
                await executeQuery(connection,
                    `MERGE SiljeTerje_Svar AS t
                     USING (SELECT @person AS person, @sid AS sporsmal_id) AS s
                       ON t.person = s.person AND t.sporsmal_id = s.sporsmal_id
                     WHEN MATCHED THEN UPDATE SET svar = @svar, oppdatert = GETDATE()
                     WHEN NOT MATCHED THEN INSERT (person, sporsmal_id, svar)
                       VALUES (@person, @sid, @svar);`,
                    [
                        { name: 'person', type: TYPES.NVarChar, value: person },
                        { name: 'sid', type: TYPES.NVarChar, value: id },
                        { name: 'svar', type: TYPES.NVarChar, value: tekst }
                    ]);
            }
            context.res = { status: 200, headers, body: { success: true, lagret: ider.length } };
            return;
        }

        context.res = { status: 405, headers, body: { error: 'Method not allowed' } };
    } catch (err) {
        context.log.error('siljeterje-svar error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
