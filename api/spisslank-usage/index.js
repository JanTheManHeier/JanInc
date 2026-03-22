const { getConnection, executeQuery, TYPES } = require('../shared/db');

module.exports = async function (context, req) {
    let connection;
    try {
        const { deviceId, eventType, eventData } = req.body || {};

        if (!deviceId || !eventType) {
            context.res = {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: { error: 'deviceId and eventType are required' }
            };
            return;
        }

        connection = await getConnection();

        await executeQuery(connection,
            'INSERT INTO SpisSlank_Usage (device_id, event_type, event_data) VALUES (@deviceId, @eventType, @eventData)',
            [
                { name: 'deviceId', type: TYPES.NVarChar, value: deviceId },
                { name: 'eventType', type: TYPES.NVarChar, value: eventType },
                { name: 'eventData', type: TYPES.NVarChar, value: eventData ? JSON.stringify(eventData) : null }
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
