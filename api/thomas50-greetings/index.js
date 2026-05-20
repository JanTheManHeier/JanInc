const { getConnection, executeQuery, TYPES } = require('../shared/db');
const { sjekkRate } = require('../shared/ratelimit');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Thomas50_Hilsener')
CREATE TABLE Thomas50_Hilsener (
    id INT IDENTITY(1,1) PRIMARY KEY,
    navn NVARCHAR(100) NOT NULL,
    tekst NVARCHAR(MAX) NOT NULL,
    opprettet DATETIME2 DEFAULT GETDATE()
);`;

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);

        if (req.method === 'GET') {
            const rows = await executeQuery(connection,
                'SELECT TOP 200 id, navn, tekst, opprettet FROM Thomas50_Hilsener ORDER BY opprettet DESC');
            context.res = { status: 200, headers, body: rows };
            return;
        }

        if (req.method === 'POST') {
            const rl = sjekkRate(req, 'greetings', 5);
            if (!rl.ok) {
                context.res = { status: 429, headers, body: { error: `For mange forespørsler. Prøv igjen om ${rl.gjenstaar} sek.` } };
                return;
            }
            const { navn, tekst } = req.body || {};
            if (!navn || !tekst) {
                context.res = { status: 400, headers, body: { error: 'navn og tekst påkrevd' } };
                return;
            }
            if (String(navn).length > 100 || String(tekst).length > 4000) {
                context.res = { status: 400, headers, body: { error: 'For langt navn eller tekst' } };
                return;
            }
            await executeQuery(connection,
                'INSERT INTO Thomas50_Hilsener (navn, tekst) VALUES (@navn, @tekst)',
                [
                    { name: 'navn', type: TYPES.NVarChar, value: String(navn).trim() },
                    { name: 'tekst', type: TYPES.NVarChar, value: String(tekst).trim() }
                ]
            );
            context.res = { status: 200, headers, body: { success: true } };
        }
    } catch (err) {
        context.log.error('thomas50-greetings error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
