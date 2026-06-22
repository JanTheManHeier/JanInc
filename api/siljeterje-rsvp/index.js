// siljeterje-rsvp — RSVP for bryllupet. Gjestene svarer om de kommer (lørdag),
// om de kommer på minglingen fredag, antall personer, allergier/matpreferanser
// og en valgfri hilsen. Hver gjest identifiseres med en stabil "slug".
//
//   GET  ?slug=<slug>          -> { svar: {...} | null }  (gjestens eget svar, til personlig lenke)
//   GET  ?all=1&key=ADMIN_KEY  -> { svar: [...], sammendrag: {...} }  (kun admin)
//   POST { slug, navn, kommer, fredag, antall, allergier, kommentar }
//                              -> upsert (krever IKKE admin-key, gjestene svarer selv)
//
// Personvern: GET uten admin-nøkkel returnerer kun ÉN gjests eget svar (via slug),
// så hele RSVP-oversikten er kun synlig for brudeparet i admin.
const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SiljeTerje_RSVP')
CREATE TABLE SiljeTerje_RSVP (
    slug NVARCHAR(80) NOT NULL PRIMARY KEY,
    navn NVARCHAR(120) NOT NULL,
    kommer BIT NOT NULL,
    fredag BIT NULL,
    antall INT NOT NULL DEFAULT 1,
    allergier NVARCHAR(2000) NULL,
    kommentar NVARCHAR(2000) NULL,
    oppdatert DATETIME2 DEFAULT GETDATE()
);`;

function reinSlug(s) {
    return String(s || '').toLowerCase().trim().replace(/[^a-z0-9\-]/g, '').slice(0, 80);
}

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
                    'SELECT slug, navn, kommer, fredag, antall, allergier, kommentar, oppdatert FROM SiljeTerje_RSVP ORDER BY navn');
                const svar = rows.map(r => ({
                    slug: r.slug,
                    navn: r.navn,
                    kommer: !!r.kommer,
                    fredag: r.fredag == null ? null : !!r.fredag,
                    antall: r.antall,
                    allergier: r.allergier || '',
                    kommentar: r.kommentar || '',
                    oppdatert: r.oppdatert,
                }));
                const sammendrag = {
                    svart: svar.length,
                    kommer: svar.filter(s => s.kommer).length,
                    kommerIkke: svar.filter(s => !s.kommer).length,
                    fredag: svar.filter(s => s.kommer && s.fredag).length,
                    antallPersoner: svar.filter(s => s.kommer).reduce((sum, s) => sum + (s.antall || 0), 0),
                };
                context.res = { status: 200, headers, body: { svar, sammendrag } };
                return;
            }

            const slug = reinSlug(req.query.slug);
            if (!slug) {
                context.res = { status: 400, headers, body: { error: 'slug påkrevd' } };
                return;
            }
            const rows = await executeQuery(connection,
                'SELECT slug, navn, kommer, fredag, antall, allergier, kommentar, oppdatert FROM SiljeTerje_RSVP WHERE slug = @slug',
                [{ name: 'slug', type: TYPES.NVarChar, value: slug }]);
            if (!rows || !rows.length) {
                context.res = { status: 200, headers, body: { svar: null } };
                return;
            }
            const r = rows[0];
            context.res = {
                status: 200, headers, body: {
                    svar: {
                        slug: r.slug, navn: r.navn, kommer: !!r.kommer,
                        fredag: r.fredag == null ? null : !!r.fredag,
                        antall: r.antall, allergier: r.allergier || '',
                        kommentar: r.kommentar || '', oppdatert: r.oppdatert,
                    }
                }
            };
            return;
        }

        if (req.method === 'POST') {
            const body = req.body || {};
            const slug = reinSlug(body.slug);
            const navn = String(body.navn || '').trim().slice(0, 120);
            if (!slug || !navn) {
                context.res = { status: 400, headers, body: { error: 'slug og navn påkrevd' } };
                return;
            }
            const kommer = (body.kommer === true || body.kommer === 1 || body.kommer === 'ja') ? 1 : 0;
            let fredag = null;
            if (kommer) {
                fredag = (body.fredag === true || body.fredag === 1 || body.fredag === 'ja') ? 1 : 0;
            }
            let antall = parseInt(body.antall, 10);
            if (isNaN(antall) || antall < 0) antall = 1;
            if (antall > 20) antall = 20;
            if (!kommer) antall = 0;
            const allergier = String(body.allergier || '').slice(0, 2000);
            const kommentar = String(body.kommentar || '').slice(0, 2000);

            await executeQuery(connection,
                `MERGE SiljeTerje_RSVP AS t
                 USING (SELECT @slug AS slug) AS s ON t.slug = s.slug
                 WHEN MATCHED THEN UPDATE SET
                     navn = @navn, kommer = @kommer, fredag = @fredag, antall = @antall,
                     allergier = @allergier, kommentar = @kommentar, oppdatert = GETDATE()
                 WHEN NOT MATCHED THEN INSERT (slug, navn, kommer, fredag, antall, allergier, kommentar)
                     VALUES (@slug, @navn, @kommer, @fredag, @antall, @allergier, @kommentar);`,
                [
                    { name: 'slug', type: TYPES.NVarChar, value: slug },
                    { name: 'navn', type: TYPES.NVarChar, value: navn },
                    { name: 'kommer', type: TYPES.Bit, value: kommer },
                    { name: 'fredag', type: TYPES.Bit, value: fredag },
                    { name: 'antall', type: TYPES.Int, value: antall },
                    { name: 'allergier', type: TYPES.NVarChar, value: allergier },
                    { name: 'kommentar', type: TYPES.NVarChar, value: kommentar },
                ]);
            context.res = { status: 200, headers, body: { success: true } };
            return;
        }

        context.res = { status: 405, headers, body: { error: 'Method not allowed' } };
    } catch (err) {
        context.log.error('siljeterje-rsvp error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
