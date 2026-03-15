const { getConnection, executeQuery } = require('../shared/db');

module.exports = async function (context, req) {
    try {
        const connection = await getConnection();
        const rows = await executeQuery(connection, 'SELECT 1 AS ok, GETDATE() AS serverTime');
        connection.close();

        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: {
                status: 'healthy',
                database: 'connected',
                serverTime: rows[0]?.serverTime,
                timestamp: new Date().toISOString()
            }
        };
    } catch (err) {
        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: {
                status: 'healthy',
                database: 'unreachable',
                error: err.message,
                timestamp: new Date().toISOString()
            }
        };
    }
};
