const { getConnection, executeQuery, TYPES } = require('../shared/db');

module.exports = async function (context, req) {
    let connection;
    try {
        const { deviceId, name, language, dietaryRestrictions, allergies, mealFrequency } = req.body || {};

        if (!deviceId) {
            context.res = {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: { error: 'deviceId is required' }
            };
            return;
        }

        connection = await getConnection();

        await executeQuery(connection, `
            IF EXISTS (SELECT 1 FROM SpisSlank_Profiles WHERE device_id = @deviceId)
                UPDATE SpisSlank_Profiles SET
                    name = @name,
                    language = @language,
                    dietary_restrictions = @dietaryRestrictions,
                    allergies = @allergies,
                    meal_frequency = @mealFrequency,
                    updated_at = GETUTCDATE()
                WHERE device_id = @deviceId
            ELSE
                INSERT INTO SpisSlank_Profiles (device_id, name, language, dietary_restrictions, allergies, meal_frequency)
                VALUES (@deviceId, @name, @language, @dietaryRestrictions, @allergies, @mealFrequency);
        `, [
            { name: 'deviceId', type: TYPES.NVarChar, value: deviceId },
            { name: 'name', type: TYPES.NVarChar, value: name || null },
            { name: 'language', type: TYPES.NVarChar, value: language || 'no' },
            { name: 'dietaryRestrictions', type: TYPES.NVarChar, value: dietaryRestrictions ? JSON.stringify(dietaryRestrictions) : null },
            { name: 'allergies', type: TYPES.NVarChar, value: allergies ? JSON.stringify(allergies) : null },
            { name: 'mealFrequency', type: TYPES.NVarChar, value: mealFrequency ? JSON.stringify(mealFrequency) : null }
        ]);

        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: { status: 'ok', deviceId }
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
