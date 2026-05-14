const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Thomas50_GjestEdit')
CREATE TABLE Thomas50_GjestEdit (
    navn NVARCHAR(100) PRIMARY KEY,
    bio NVARCHAR(500) NULL,
    relasjon NVARCHAR(200) NULL,
    extraBio NVARCHAR(500) NULL,
    oppdatert DATETIME2 DEFAULT GETDATE()
);`;

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);
        if (req.method === 'GET') {
            const rows = await executeQuery(connection,
                'SELECT navn, bio, relasjon, extraBio, oppdatert FROM Thomas50_GjestEdit');
            context.res = { status: 200, headers, body: rows };
            return;
        }
        if (req.method === 'POST') {
            const { navn, bio, relasjon, extraBio } = req.body || {};
            if (!navn) {
                context.res = { status: 400, headers, body: { error: 'navn paakrevd' } };
                return;
            }
            const trimNavn = String(navn).trim().substring(0, 100);
            const trimBio = bio ? String(bio).trim().substring(0, 500) : null;
            const trimRel = relasjon ? String(relasjon).trim().substring(0, 200) : null;
            const trimEx = extraBio ? String(extraBio).trim().substring(0, 500) : null;
            await executeQuery(connection, `
                MERGE Thomas50_GjestEdit AS t
                USING (SELECT @navn AS navn) AS s ON t.navn = s.navn
                WHEN MATCHED THEN UPDATE SET bio = @bio, relasjon = @relasjon, extraBio = @extraBio, oppdatert = GETDATE()
                WHEN NOT MATCHED THEN INSERT (navn, bio, relasjon, extraBio) VALUES (@navn, @bio, @relasjon, @extraBio);`,
                [
                    { name: 'navn', type: TYPES.NVarChar, value: trimNavn },
                    { name: 'bio', type: TYPES.NVarChar, value: trimBio },
                    { name: 'relasjon', type: TYPES.NVarChar, value: trimRel },
                    { name: 'extraBio', type: TYPES.NVarChar, value: trimEx }
                ]
            );
            context.res = { status: 200, headers, body: { success: true } };
        }
    } catch (err) {
        context.log.error('thomas50-gjest-edit error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
