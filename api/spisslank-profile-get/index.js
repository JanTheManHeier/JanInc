const { getConnection, executeQuery, TYPES } = require('../shared/db');

module.exports = async function (context, req) {
    let connection;
    try {
        const deviceId = context.bindingData.deviceId;

        if (!deviceId) {
            context.res = {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: { error: 'deviceId is required' }
            };
            return;
        }

        connection = await getConnection();

        const rows = await executeQuery(connection,
            'SELECT device_id, name, language, dietary_restrictions, allergies, meal_frequency, created_at, updated_at FROM SpisSlank_Profiles WHERE device_id = @deviceId',
            [{ name: 'deviceId', type: TYPES.NVarChar, value: deviceId }]
        );

        if (rows.length === 0) {
            context.res = {
                status: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: { error: 'Profile not found' }
            };
            return;
        }

        const profile = rows[0];
        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: {
                deviceId: profile.device_id,
                name: profile.name,
                language: profile.language,
                dietaryRestrictions: profile.dietary_restrictions ? JSON.parse(profile.dietary_restrictions) : null,
                allergies: profile.allergies ? JSON.parse(profile.allergies) : null,
                mealFrequency: profile.meal_frequency ? JSON.parse(profile.meal_frequency) : null,
                createdAt: profile.created_at,
                updatedAt: profile.updated_at
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
