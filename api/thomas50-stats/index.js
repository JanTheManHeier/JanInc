const { getConnection, executeQuery } = require('../shared/db');
const https = require('https');

// In-memory cache i function-instansen — varer så lenge functionen er varm
const geoCache = {};

function slaaOppGeo(ip) {
    return new Promise((resolve) => {
        if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('10.') || ip.startsWith('192.168.')) {
            return resolve({ ip, sted: '🏠 Lokalt' });
        }
        if (geoCache[ip]) return resolve(geoCache[ip]);
        https.get(`https://ipwho.is/${encodeURIComponent(ip)}`, { timeout: 3000 }, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                try {
                    const d = JSON.parse(body);
                    if (d && d.success !== false) {
                        const sted = d.city || d.region || '';
                        const land = d.country || '';
                        const flagg = d.flag && d.flag.emoji ? d.flag.emoji : '';
                        const tekst = sted && land ? `${flagg} ${sted}, ${land}` : (flagg + ' ' + (sted || land || '?')).trim();
                        const result = { ip, sted: tekst };
                        geoCache[ip] = result;
                        resolve(result);
                    } else {
                        resolve({ ip, sted: '?' });
                    }
                } catch { resolve({ ip, sted: '?' }); }
            });
        }).on('error', () => resolve({ ip, sted: '?' })).on('timeout', function() { this.destroy(); resolve({ ip, sted: '?' }); });
    });
}

const ENSURE_TABLES_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Thomas50_Hilsener')
CREATE TABLE Thomas50_Hilsener (id INT IDENTITY(1,1) PRIMARY KEY, navn NVARCHAR(100) NOT NULL, tekst NVARCHAR(MAX) NOT NULL, opprettet DATETIME2 DEFAULT GETDATE());
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Thomas50_Toaster')
CREATE TABLE Thomas50_Toaster (id INT IDENTITY(1,1) PRIMARY KEY, navn NVARCHAR(100) NOT NULL, epost NVARCHAR(200) NULL, tema NVARCHAR(200) NULL, melding NVARCHAR(MAX) NOT NULL, opprettet DATETIME2 DEFAULT GETDATE());
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Thomas50_Besok')
CREATE TABLE Thomas50_Besok (id INT IDENTITY(1,1) PRIMARY KEY, navn NVARCHAR(100) NULL, side NVARCHAR(50) NULL, ua NVARCHAR(500) NULL, ip NVARCHAR(64) NULL, opprettet DATETIME2 DEFAULT GETDATE());
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'ip' AND Object_ID = Object_ID(N'Thomas50_Besok'))
ALTER TABLE Thomas50_Besok ADD ip NVARCHAR(64) NULL;`;

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLES_SQL);

        // Hent statistikk: total besøk, unike navn, besøk per side, siste 50 besøk, alle hilsener, alle taler
        const totalt = await executeQuery(connection, "SELECT COUNT(*) AS total FROM Thomas50_Besok");
        const unike = await executeQuery(connection, "SELECT COUNT(DISTINCT navn) AS unike FROM Thomas50_Besok WHERE navn IS NOT NULL AND navn <> 'anonym'");
        const perSide = await executeQuery(connection, "SELECT side, COUNT(*) AS antall FROM Thomas50_Besok GROUP BY side ORDER BY antall DESC");
        const perNavn = await executeQuery(connection, `
            SELECT b.navn,
                   COUNT(*) AS besok,
                   MAX(b.opprettet) AS sist,
                   (SELECT TOP 1 ip FROM Thomas50_Besok WHERE navn = b.navn AND ip IS NOT NULL ORDER BY opprettet DESC) AS ip
            FROM Thomas50_Besok b
            WHERE b.navn IS NOT NULL AND b.navn <> 'anonym'
            GROUP BY b.navn
            ORDER BY sist DESC`);
        const sisteBesok = await executeQuery(connection, "SELECT TOP 50 navn, side, ip, opprettet FROM Thomas50_Besok ORDER BY opprettet DESC");
        const hilsener = await executeQuery(connection, "SELECT id, navn, tekst, opprettet FROM Thomas50_Hilsener ORDER BY opprettet DESC");
        const taler = await executeQuery(connection, "SELECT id, navn, epost, tema, melding, opprettet FROM Thomas50_Toaster ORDER BY opprettet DESC");
        let highscore = [];
        try {
            highscore = await executeQuery(connection, `
                SELECT TOP 20 navn, MAX(score) AS score, MAX(antall) AS antall, COUNT(*) AS forsok, MAX(opprettet) AS sist
                FROM Thomas50_Highscore GROUP BY navn ORDER BY score DESC, sist ASC`);
        } catch {}
        let spillTopp = [];
        try {
            spillTopp = await executeQuery(connection, `
                SELECT TOP 20 navn, MAX(score) AS score, MAX(opprettet) AS sist
                FROM Thomas50_Spillscore GROUP BY navn ORDER BY score DESC, sist ASC`);
        } catch {}

        // Berik med geo-info (server-side, ingen CORS-problem)
        const alleIp = [...new Set([
            ...perNavn.map(r => r.ip).filter(Boolean),
            ...sisteBesok.map(r => r.ip).filter(Boolean)
        ])];
        const geoResultater = await Promise.all(alleIp.map(slaaOppGeo));
        const geoMap = {};
        geoResultater.forEach(g => { geoMap[g.ip] = g.sted; });
        perNavn.forEach(r => { r.sted = r.ip ? (geoMap[r.ip] || '?') : ''; });
        sisteBesok.forEach(r => { r.sted = r.ip ? (geoMap[r.ip] || '?') : ''; });

        context.res = {
            status: 200, headers,
            body: {
                totalt: totalt[0]?.total || 0,
                unikeNavn: unike[0]?.unike || 0,
                perSide,
                perNavn,
                sisteBesok,
                hilsener,
                taler,
                highscore,
                spillTopp,
                generertAt: new Date().toISOString()
            }
        };
    } catch (err) {
        context.log.error('thomas50-stats error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
