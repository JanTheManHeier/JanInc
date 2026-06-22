const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SiljeTerje_Spillscore')
CREATE TABLE SiljeTerje_Spillscore (
    id INT IDENTITY(1,1) PRIMARY KEY,
    navn NVARCHAR(100) NOT NULL,
    score INT NOT NULL,
    opprettet DATETIME2 DEFAULT GETDATE()
);`;

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);

        if (req.method === 'GET') {
            const rows = await executeQuery(connection, `
                SELECT TOP 10 navn, MAX(score) AS score, MAX(opprettet) AS sist
                FROM SiljeTerje_Spillscore
                GROUP BY navn
                ORDER BY score DESC, sist ASC`);
            context.res = { status: 200, headers, body: rows };
            return;
        }

        if (req.method === 'POST') {
            const { navn, score } = req.body || {};
            if (!navn || typeof score !== 'number' || score < 0 || score > 1000) {
                context.res = { status: 400, headers, body: { error: 'navn og score paakrevd' } };
                return;
            }
            await executeQuery(connection,
                'INSERT INTO SiljeTerje_Spillscore (navn, score) VALUES (@navn, @score)',
                [
                    { name: 'navn', type: TYPES.NVarChar, value: String(navn).trim().substring(0, 100) },
                    { name: 'score', type: TYPES.Int, value: Math.floor(score) }
                ]
            );
            context.res = { status: 200, headers, body: { success: true } };
        }
    } catch (err) {
        context.log.error('siljeterje-spillscore error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
