// siljeterje-forlover — hemmelig spørrerunde for forloverne. De svarer på spørsmål og
// skriver litt om brudeparet (innsider-info brudeparet sjelden deler selv). Svarene er
// KUN for admin (brudeparet skal ikke se dem). Lagres pr (person, sporsmal_id).
//
//   GET  ?person=<slug>        -> { svar: { id: tekst } } for den ene forloveren.
//   GET  ?all=1&key=ADMIN_KEY  -> { svar: { <slug>: {...}, ... } } (kun admin).
//   POST { person, svar:{...} } -> upsert (krever ikke admin-key, forloverne lagrer selv).
const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SiljeTerje_Forlover')
CREATE TABLE SiljeTerje_Forlover (
    person NVARCHAR(40) NOT NULL,
    sporsmal_id NVARCHAR(100) NOT NULL,
    svar NVARCHAR(MAX) NOT NULL,
    oppdatert DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT PK_SiljeTerje_Forlover PRIMARY KEY (person, sporsmal_id)
);`;

// Gyldige forlover-slugs (samme som forlover-data.js på frontend).
const GYLDIGE = ['hege', 'annsissel', 'vegard', 'mikal', 'olenicolai'];

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);

        if (req.method === 'GET') {
            if (req.query.all) {
                const adminKey = process.env.ADMIN_KEY;
                if (!adminKey || req.query.key !== adminKey) {
                    context.res = { status: 401, headers, body: { error: 'Ugyldig admin-key' } };
                    return;
                }
                const rows = await executeQuery(connection,
                    'SELECT person, sporsmal_id, svar, oppdatert FROM SiljeTerje_Forlover');
                const svar = {};
                let oppdatert = null;
                rows.forEach(r => {
                    if (!svar[r.person]) svar[r.person] = {};
                    svar[r.person][r.sporsmal_id] = r.svar;
                    if (!oppdatert || r.oppdatert > oppdatert) oppdatert = r.oppdatert;
                });
                context.res = { status: 200, headers, body: { svar, oppdatert } };
                return;
            }

            const person = (req.query.person || '').toLowerCase();
            if (!GYLDIGE.includes(person)) {
                context.res = { status: 400, headers, body: { error: 'ukjent person' } };
                return;
            }
            const rows = await executeQuery(connection,
                'SELECT sporsmal_id, svar FROM SiljeTerje_Forlover WHERE person = @person',
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
                context.res = { status: 400, headers, body: { error: 'ukjent person' } };
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
                    `MERGE SiljeTerje_Forlover AS t
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
        context.log.error('siljeterje-forlover error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
