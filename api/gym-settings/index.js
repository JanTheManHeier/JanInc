const { getConnection, executeQuery, TYPES } = require('../shared/db');

const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Device-Id' };

module.exports = async function (context, req) {
    if (req.method === 'OPTIONS') {
        context.res = { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS' } };
        return;
    }

    const deviceId = req.headers['x-device-id'];
    if (!deviceId) {
        context.res = { status: 400, headers: CORS, body: { error: 'X-Device-Id header required' } };
        return;
    }

    let connection;
    try {
        connection = await getConnection();

        await executeQuery(connection, `
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GymTracker_Settings')
            CREATE TABLE GymTracker_Settings (
                device_id NVARCHAR(100) PRIMARY KEY,
                settings_json NVARCHAR(MAX),
                updated_at DATETIME2 DEFAULT GETUTCDATE()
            );
        `);

        if (req.method === 'GET') {
            const rows = await executeQuery(connection, `
                SELECT settings_json, updated_at FROM GymTracker_Settings WHERE device_id = @deviceId
            `, [
                { name: 'deviceId', type: TYPES.NVarChar, value: deviceId }
            ]);
            context.res = { status: 200, headers: CORS, body: rows[0] || { settings_json: null } };
        } else {
            const settingsJson = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
            await executeQuery(connection, `
                IF EXISTS (SELECT 1 FROM GymTracker_Settings WHERE device_id = @deviceId)
                    UPDATE GymTracker_Settings SET settings_json = @settings, updated_at = GETUTCDATE()
                    WHERE device_id = @deviceId
                ELSE
                    INSERT INTO GymTracker_Settings (device_id, settings_json) VALUES (@deviceId, @settings);
            `, [
                { name: 'deviceId', type: TYPES.NVarChar, value: deviceId },
                { name: 'settings', type: TYPES.NVarChar, value: settingsJson }
            ]);
            context.res = { status: 200, headers: CORS, body: { status: 'ok' } };
        }
    } catch (err) {
        context.res = { status: 500, headers: CORS, body: { error: err.message } };
    } finally {
        if (connection) connection.close();
    }
};
