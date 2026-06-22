const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SiljeTerje_Besok')
CREATE TABLE SiljeTerje_Besok (
    id INT IDENTITY(1,1) PRIMARY KEY,
    navn NVARCHAR(100) NULL,
    side NVARCHAR(50) NULL,
    ua NVARCHAR(500) NULL,
    ip NVARCHAR(64) NULL,
    opprettet DATETIME2 DEFAULT GETDATE()
);
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'ip' AND Object_ID = Object_ID(N'SiljeTerje_Besok'))
ALTER TABLE SiljeTerje_Besok ADD ip NVARCHAR(64) NULL;`;

function hentIp(req) {
    const xff = req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'];
    if (xff) {
        // Format: "ip:port, ip:port" — ta første
        const first = String(xff).split(',')[0].trim();
        // Strip port hvis IPv4
        const m = first.match(/^([\d.]+)(?::\d+)?$/);
        if (m) return m[1];
        return first;
    }
    return req.headers['x-azure-clientip'] || null;
}

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);

        const { navn, side, ua } = req.body || {};
        const ip = hentIp(req);
        await executeQuery(connection,
            'INSERT INTO SiljeTerje_Besok (navn, side, ua, ip) VALUES (@navn, @side, @ua, @ip)',
            [
                { name: 'navn', type: TYPES.NVarChar, value: navn ? String(navn).substring(0, 100) : null },
                { name: 'side', type: TYPES.NVarChar, value: side ? String(side).substring(0, 50) : null },
                { name: 'ua', type: TYPES.NVarChar, value: ua ? String(ua).substring(0, 500) : null },
                { name: 'ip', type: TYPES.NVarChar, value: ip ? String(ip).substring(0, 64) : null }
            ]
        );
        context.res = { status: 200, headers, body: { ok: true } };
    } catch (err) {
        context.log.error('siljeterje-track error:', err.message);
        context.res = { status: 200, headers, body: { ok: false } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
