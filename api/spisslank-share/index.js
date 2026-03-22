const { getConnection, executeQuery, TYPES } = require('../shared/db');

function generateShortCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code.slice(0, 4) + '-' + code.slice(4);
}

module.exports = async function (context, req) {
    let connection;
    try {
        const { deviceId, planData, title } = req.body || {};

        if (!deviceId || !planData) {
            context.res = {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: { error: 'deviceId and planData are required' }
            };
            return;
        }

        connection = await getConnection();

        // Retry with new code on collision
        let shortCode;
        let inserted = false;
        for (let attempt = 0; attempt < 5; attempt++) {
            shortCode = generateShortCode();
            try {
                await executeQuery(connection,
                    'INSERT INTO SpisSlank_SharedPlans (short_code, device_id, plan_data, title) VALUES (@shortCode, @deviceId, @planData, @title)',
                    [
                        { name: 'shortCode', type: TYPES.NVarChar, value: shortCode },
                        { name: 'deviceId', type: TYPES.NVarChar, value: deviceId },
                        { name: 'planData', type: TYPES.NVarChar, value: JSON.stringify(planData) },
                        { name: 'title', type: TYPES.NVarChar, value: title || null }
                    ]
                );
                inserted = true;
                break;
            } catch (e) {
                if (e.message && e.message.includes('UNIQUE') && attempt < 4) continue;
                throw e;
            }
        }

        if (!inserted) {
            throw new Error('Failed to generate unique short code');
        }

        context.res = {
            status: 201,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: {
                shortCode,
                url: `/SpisSlank/?plan=${shortCode}`
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
