const { getConnection, executeQuery, TYPES } = require('../shared/db');

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };

    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey) {
        context.res = { status: 500, headers, body: { error: 'ADMIN_KEY ikke konfigurert i Azure' } };
        return;
    }

    const { id, key } = req.body || {};
    if (!key || key !== adminKey) {
        context.res = { status: 401, headers, body: { error: 'Ugyldig admin-key' } };
        return;
    }
    const idNum = parseInt(id, 10);
    if (!idNum || idNum < 1) {
        context.res = { status: 400, headers, body: { error: 'Ugyldig id' } };
        return;
    }

    let connection;
    try {
        connection = await getConnection();
        const result = await executeQuery(connection,
            'DELETE FROM SiljeTerje_Hilsener WHERE id = @id',
            [{ name: 'id', type: TYPES.Int, value: idNum }]
        );
        context.res = { status: 200, headers, body: { success: true, id: idNum } };
    } catch (err) {
        context.log.error('siljeterje-admin-delete-greeting error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
