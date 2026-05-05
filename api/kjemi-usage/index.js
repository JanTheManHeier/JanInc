const { getConnection, executeQuery, TYPES } = require('../shared/db');

module.exports = async function (context, req) {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }

    let connection;
    try {
        const { event, chapter, mode, score, total, duration } = req.body || {};

        if (!event) {
            context.res = {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: { error: 'event is required' }
            };
            return;
        }

        connection = await getConnection();

        await executeQuery(connection,
            `INSERT INTO Kjemi_Usage (event_type, chapter, mode, score, total, duration_sec)
             VALUES (@event, @chapter, @mode, @score, @total, @duration)`,
            [
                { name: 'event', type: TYPES.NVarChar, value: event },
                { name: 'chapter', type: TYPES.NVarChar, value: chapter || null },
                { name: 'mode', type: TYPES.NVarChar, value: mode || null },
                { name: 'score', type: TYPES.Int, value: score != null ? score : null },
                { name: 'total', type: TYPES.Int, value: total != null ? total : null },
                { name: 'duration', type: TYPES.Int, value: duration != null ? duration : null }
            ]
        );

        context.res = {
            status: 201,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: { status: 'ok' }
        };
    } catch (err) {
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: { error: err.message }
        };
    } finally {
        if (connection) connection.close();
    }
};
