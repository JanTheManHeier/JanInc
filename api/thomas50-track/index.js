const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Thomas50_Besok')
CREATE TABLE Thomas50_Besok (
    id INT IDENTITY(1,1) PRIMARY KEY,
    navn NVARCHAR(100) NULL,
    side NVARCHAR(50) NULL,
    ua NVARCHAR(500) NULL,
    opprettet DATETIME2 DEFAULT GETDATE()
);`;

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);

        const { navn, side, ua } = req.body || {};
        await executeQuery(connection,
            'INSERT INTO Thomas50_Besok (navn, side, ua) VALUES (@navn, @side, @ua)',
            [
                { name: 'navn', type: TYPES.NVarChar, value: navn ? String(navn).substring(0, 100) : null },
                { name: 'side', type: TYPES.NVarChar, value: side ? String(side).substring(0, 50) : null },
                { name: 'ua', type: TYPES.NVarChar, value: ua ? String(ua).substring(0, 500) : null }
            ]
        );
        context.res = { status: 200, headers, body: { ok: true } };
    } catch (err) {
        context.log.error('thomas50-track error:', err.message);
        context.res = { status: 200, headers, body: { ok: false } }; // ikke blokker brukeren
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
