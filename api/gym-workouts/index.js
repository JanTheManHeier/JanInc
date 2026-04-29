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

        // Ensure table exists
        await executeQuery(connection, `
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GymTracker_Workouts')
            CREATE TABLE GymTracker_Workouts (
                id NVARCHAR(50) PRIMARY KEY,
                device_id NVARCHAR(100) NOT NULL,
                workout_date DATETIME2 NOT NULL,
                workout_type NVARCHAR(50) NOT NULL,
                duration_minutes INT,
                notes NVARCHAR(500),
                exercises_json NVARCHAR(MAX),
                deleted BIT DEFAULT 0,
                created_at DATETIME2 DEFAULT GETUTCDATE(),
                updated_at DATETIME2 DEFAULT GETUTCDATE()
            );
        `);

        if (req.method === 'GET') {
            const since = req.query.since || '1970-01-01T00:00:00Z';
            const rows = await executeQuery(connection, `
                SELECT id, workout_date, workout_type, duration_minutes, notes, exercises_json, deleted, created_at, updated_at
                FROM GymTracker_Workouts
                WHERE device_id = @deviceId AND updated_at > @since
                ORDER BY workout_date DESC
            `, [
                { name: 'deviceId', type: TYPES.NVarChar, value: deviceId },
                { name: 'since', type: TYPES.NVarChar, value: since }
            ]);
            context.res = { status: 200, headers: CORS, body: rows };
        } else {
            const workouts = Array.isArray(req.body) ? req.body : [req.body];
            for (const w of workouts) {
                await executeQuery(connection, `
                    IF EXISTS (SELECT 1 FROM GymTracker_Workouts WHERE id = @id AND device_id = @deviceId)
                        UPDATE GymTracker_Workouts SET
                            workout_date = @workoutDate, workout_type = @workoutType,
                            duration_minutes = @duration, notes = @notes,
                            exercises_json = @exercises, deleted = @deleted, updated_at = GETUTCDATE()
                        WHERE id = @id AND device_id = @deviceId
                    ELSE
                        INSERT INTO GymTracker_Workouts (id, device_id, workout_date, workout_type, duration_minutes, notes, exercises_json, deleted)
                        VALUES (@id, @deviceId, @workoutDate, @workoutType, @duration, @notes, @exercises, @deleted);
                `, [
                    { name: 'id', type: TYPES.NVarChar, value: w.id },
                    { name: 'deviceId', type: TYPES.NVarChar, value: deviceId },
                    { name: 'workoutDate', type: TYPES.NVarChar, value: w.workout_date },
                    { name: 'workoutType', type: TYPES.NVarChar, value: w.workout_type },
                    { name: 'duration', type: TYPES.Int, value: w.duration_minutes || null },
                    { name: 'notes', type: TYPES.NVarChar, value: w.notes || null },
                    { name: 'exercises', type: TYPES.NVarChar, value: typeof w.exercises_json === 'string' ? w.exercises_json : JSON.stringify(w.exercises_json) },
                    { name: 'deleted', type: TYPES.Bit, value: w.deleted ? 1 : 0 }
                ]);
            }
            context.res = { status: 200, headers: CORS, body: { status: 'ok', count: workouts.length } };
        }
    } catch (err) {
        context.res = { status: 500, headers: CORS, body: { error: err.message } };
    } finally {
        if (connection) connection.close();
    }
};
