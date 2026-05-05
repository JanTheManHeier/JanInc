const { getConnection, executeQuery, TYPES } = require('../shared/db');

module.exports = async function (context, req) {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }

    let connection;
    try {
        connection = await getConnection();

        // Get all usage events from the last 7 days
        const events = await executeQuery(connection,
            `SELECT event_type, chapter, mode, score, total, duration_sec, created_at
             FROM Kjemi_Usage
             WHERE created_at >= DATEADD(day, -7, GETDATE())
             ORDER BY created_at DESC`
        );

        // Summary stats
        const summary = await executeQuery(connection,
            `SELECT
                COUNT(*) as total_events,
                COUNT(CASE WHEN event_type = 'round_complete' THEN 1 END) as rounds_completed,
                AVG(CASE WHEN event_type = 'round_complete' AND total > 0 THEN CAST(score AS FLOAT) / total * 100 END) as avg_score_pct,
                SUM(CASE WHEN event_type = 'round_complete' THEN duration_sec ELSE 0 END) as total_seconds,
                MAX(created_at) as last_activity,
                COUNT(CASE WHEN event_type = 'session_start' AND created_at >= CAST(GETDATE() AS DATE) THEN 1 END) as sessions_today,
                COUNT(CASE WHEN event_type = 'round_complete' AND created_at >= CAST(GETDATE() AS DATE) THEN 1 END) as rounds_today
             FROM Kjemi_Usage
             WHERE created_at >= DATEADD(day, -7, GETDATE())`
        );

        // Daily breakdown
        const daily = await executeQuery(connection,
            `SELECT
                CAST(created_at AS DATE) as day,
                COUNT(CASE WHEN event_type = 'round_complete' THEN 1 END) as rounds,
                AVG(CASE WHEN event_type = 'round_complete' AND total > 0 THEN CAST(score AS FLOAT) / total * 100 END) as avg_score,
                SUM(CASE WHEN event_type = 'round_complete' THEN duration_sec ELSE 0 END) as seconds
             FROM Kjemi_Usage
             WHERE created_at >= DATEADD(day, -7, GETDATE())
             GROUP BY CAST(created_at AS DATE)
             ORDER BY CAST(created_at AS DATE) DESC`
        );

        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: {
                summary: summary[0] || {},
                daily,
                recentEvents: events.slice(0, 50)
            }
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
