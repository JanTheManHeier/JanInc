// siljeterje-content — lagrer redigerbart innhold (program, gjester, meny, gaveønske,
// forsidetekster) som ett JSON-dokument. GET er offentlig, POST krever admin-key.
// Lar Silje og Terje oppdatere appen selv via admin-grensesnittet.
const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SiljeTerje_Content')
CREATE TABLE SiljeTerje_Content (
    id INT PRIMARY KEY,
    json NVARCHAR(MAX) NOT NULL,
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
                'SELECT TOP 1 json, oppdatert FROM SiljeTerje_Content WHERE id = 1');
            if (!rows || !rows.length) {
                context.res = { status: 200, headers, body: { content: null } };
                return;
            }
            let content = null;
            try { content = JSON.parse(rows[0].json); } catch (_) { content = null; }
            context.res = { status: 200, headers, body: { content, oppdatert: rows[0].oppdatert } };
            return;
        }

        if (req.method === 'POST') {
            const adminKey = process.env.ADMIN_KEY;
            if (!adminKey) {
                context.res = { status: 500, headers, body: { error: 'ADMIN_KEY ikke konfigurert i Azure' } };
                return;
            }
            const { key, content } = req.body || {};
            if (!key || key !== adminKey) {
                context.res = { status: 401, headers, body: { error: 'Ugyldig admin-key' } };
                return;
            }
            if (content === undefined || content === null) {
                context.res = { status: 400, headers, body: { error: 'content påkrevd' } };
                return;
            }
            const json = JSON.stringify(content);
            if (json.length > 2000000) {
                context.res = { status: 400, headers, body: { error: 'For stort innhold' } };
                return;
            }
            await executeQuery(connection,
                `MERGE SiljeTerje_Content AS t
                 USING (SELECT 1 AS id) AS s ON t.id = s.id
                 WHEN MATCHED THEN UPDATE SET json = @json, oppdatert = GETDATE()
                 WHEN NOT MATCHED THEN INSERT (id, json) VALUES (1, @json);`,
                [{ name: 'json', type: TYPES.NVarChar, value: json }]
            );
            context.res = { status: 200, headers, body: { success: true } };
            return;
        }

        context.res = { status: 405, headers, body: { error: 'Method not allowed' } };
    } catch (err) {
        context.log.error('siljeterje-content error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
