const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SiljeTerje_Highscore')
CREATE TABLE SiljeTerje_Highscore (
    id INT IDENTITY(1,1) PRIMARY KEY,
    navn NVARCHAR(100) NOT NULL,
    score INT NOT NULL,
    antall INT NOT NULL,
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
                SELECT TOP 10 navn, MAX(score) AS score, MAX(antall) AS antall, MAX(opprettet) AS sist
                FROM SiljeTerje_Highscore
                GROUP BY navn
                ORDER BY score DESC, sist ASC`);
            context.res = { status: 200, headers, body: rows };
            return;
        }

        if (req.method === 'POST') {
            const { navn, score, antall } = req.body || {};
            if (!navn || typeof score !== 'number' || typeof antall !== 'number') {
                context.res = { status: 400, headers, body: { error: 'navn (string), score (number), antall (number) paakrevd' } };
                return;
            }
            if (String(navn).length > 100 || score < 0 || antall < 1 || antall > 100) {
                context.res = { status: 400, headers, body: { error: 'Ugyldige verdier' } };
                return;
            }
            await executeQuery(connection,
                'INSERT INTO SiljeTerje_Highscore (navn, score, antall) VALUES (@navn, @score, @antall)',
                [
                    { name: 'navn', type: TYPES.NVarChar, value: String(navn).trim() },
                    { name: 'score', type: TYPES.Int, value: Math.floor(score) },
                    { name: 'antall', type: TYPES.Int, value: Math.floor(antall) }
                ]
            );
            context.res = { status: 200, headers, body: { success: true } };
        }
    } catch (err) {
        context.log.error('siljeterje-highscore error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
