const { getConnection, executeQuery, TYPES } = require('../shared/db');

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

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
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

        await executeQuery(connection,
            'INSERT INTO Thomas50_Toaster (navn, epost, tema, melding) VALUES (@navn, @epost, @tema, @melding)',
            [
                { name: 'navn', type: TYPES.NVarChar, value: String(navn).trim() },
                { name: 'epost', type: TYPES.NVarChar, value: epost ? String(epost).trim() : null },
                { name: 'tema', type: TYPES.NVarChar, value: tema ? String(tema).trim() : null },
                { name: 'melding', type: TYPES.NVarChar, value: String(melding).trim() }
            ]
        );

        context.res = { status: 200, headers, body: { success: true, info: 'Toastmasterne får beskjed via admin-side. Send også gjerne mail direkte til ronnyandre@gmail.com' } };
    } catch (err) {
        context.log.error('thomas50-toast error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
