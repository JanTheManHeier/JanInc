const { getConnection, executeQuery, TYPES } = require('../shared/db');

const CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Device-Id' };

module.exports = async function (context, req) {
    if (req.method === 'OPTIONS') {
        context.res = { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' } };
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
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GymTracker_BodyWeight')
            CREATE TABLE GymTracker_BodyWeight (
                id NVARCHAR(50) PRIMARY KEY,
                device_id NVARCHAR(100) NOT NULL,
                measured_date DATE NOT NULL,
                weight_kg DECIMAL(5,2) NOT NULL,
                deleted BIT DEFAULT 0,
                created_at DATETIME2 DEFAULT GETUTCDATE(),
                updated_at DATETIME2 DEFAULT GETUTCDATE()
            );
        `);

        if (req.method === 'GET') {
            const rows = await executeQuery(connection, `
                SELECT id, measured_date, weight_kg, deleted, created_at, updated_at
                FROM GymTracker_BodyWeight
                WHERE device_id = @deviceId AND deleted = 0
                ORDER BY measured_date DESC
            `, [
                { name: 'deviceId', type: TYPES.NVarChar, value: deviceId }
            ]);
            context.res = { status: 200, headers: CORS, body: rows };
        } else {
            const entries = Array.isArray(req.body) ? req.body : [req.body];
            for (const e of entries) {
                await executeQuery(connection, `
                    IF EXISTS (SELECT 1 FROM GymTracker_BodyWeight WHERE id = @id AND device_id = @deviceId)
                        UPDATE GymTracker_BodyWeight SET
                            measured_date = @measuredDate, weight_kg = @weightKg,
                            deleted = @deleted, updated_at = GETUTCDATE()
                        WHERE id = @id AND device_id = @deviceId
                    ELSE
                        INSERT INTO GymTracker_BodyWeight (id, device_id, measured_date, weight_kg, deleted)
                        VALUES (@id, @deviceId, @measuredDate, @weightKg, @deleted);
                `, [
                    { name: 'id', type: TYPES.NVarChar, value: e.id },
                    { name: 'deviceId', type: TYPES.NVarChar, value: deviceId },
                    { name: 'measuredDate', type: TYPES.NVarChar, value: e.measured_date },
                    { name: 'weightKg', type: TYPES.Decimal, value: e.weight_kg },
                    { name: 'deleted', type: TYPES.Bit, value: e.deleted ? 1 : 0 }
                ]);
            }
            context.res = { status: 200, headers: CORS, body: { status: 'ok', count: entries.length } };
        }
    } catch (err) {
        context.res = { status: 500, headers: CORS, body: { error: err.message } };
    } finally {
        if (connection) connection.close();
    }
};
