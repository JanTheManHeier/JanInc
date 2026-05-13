const { getConnection, executeQuery } = require('../shared/db');

const TABELL_FOR_TYPE = {
    quiz: 'Thomas50_Highscore',
    spill: 'Thomas50_Spillscore',
};

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };

    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey) {
        context.res = { status: 500, headers, body: { error: 'ADMIN_KEY ikke konfigurert i Azure' } };
        return;
    }

    const { type, key } = req.body || {};
    if (!key || key !== adminKey) {
        context.res = { status: 401, headers, body: { error: 'Ugyldig admin-key' } };
        return;
    }

    const tabell = TABELL_FOR_TYPE[type];
    if (!tabell) {
        context.res = { status: 400, headers, body: { error: 'Ugyldig type — bruk "quiz" eller "spill"' } };
        return;
    }

    let connection;
    try {
        connection = await getConnection();
        await executeQuery(connection, `DELETE FROM ${tabell}`);
        context.res = { status: 200, headers, body: { success: true, type, tabell } };
    } catch (err) {
        context.log.error('thomas50-admin-reset error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
