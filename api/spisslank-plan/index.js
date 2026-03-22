const { getConnection, executeQuery, TYPES } = require('../shared/db');

module.exports = async function (context, req) {
    let connection;
    try {
        const code = context.bindingData.code;

        if (!code) {
            context.res = {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: { error: 'code is required' }
            };
            return;
        }

        connection = await getConnection();

        // Increment view count and fetch in one go
        await executeQuery(connection,
            'UPDATE SpisSlank_SharedPlans SET view_count = view_count + 1 WHERE short_code = @code',
            [{ name: 'code', type: TYPES.NVarChar, value: code }]
        );

        const rows = await executeQuery(connection,
            'SELECT plan_data, title, created_at, view_count FROM SpisSlank_SharedPlans WHERE short_code = @code',
            [{ name: 'code', type: TYPES.NVarChar, value: code }]
        );

        if (rows.length === 0) {
            context.res = {
                status: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: { error: 'Plan not found' }
            };
            return;
        }

        const plan = rows[0];
        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: {
                planData: JSON.parse(plan.plan_data),
                title: plan.title,
                createdAt: plan.created_at,
                viewCount: plan.view_count
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
