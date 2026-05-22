const { getConnection, executeQuery, TYPES } = require('../shared/db');

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json' };
    let connection;
    try {
        const secret = req.body && req.body.secret;
        if (secret !== 'thomas50admin2026') {
            context.res = { status: 403, headers, body: { error: 'Forbidden' } };
            return;
        }

        connection = await getConnection();

        // Fix Geir-Olav: 18/16 -> 16/16 (bug allowed double-scoring via prev button)
        await executeQuery(connection,
            `UPDATE Thomas50_Highscore SET score = 16 WHERE navn = @navn AND score = 18 AND antall = 16`,
            [{ name: 'navn', type: TYPES.NVarChar, value: 'Geir-Olav Skogstad' }]
        );

        // Delete test user
        await executeQuery(connection,
            `DELETE FROM Thomas50_Highscore WHERE navn = @navn`,
            [{ name: 'navn', type: TYPES.NVarChar, value: 'Jan tester Heier' }]
        );

        // Return updated top 10
        const rows = await executeQuery(connection, `
            SELECT TOP 10 navn, MAX(score) AS score, MAX(antall) AS antall
            FROM Thomas50_Highscore
            GROUP BY navn
            ORDER BY score DESC`);

        context.res = { status: 200, headers, body: { fixed: true, toplist: rows } };
    } catch (err) {
        context.res = { status: 500, headers, body: { error: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
