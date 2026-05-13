const { getConnection, executeQuery } = require('../shared/db');

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        connection = await getConnection();

        // Hent statistikk: total besøk, unike navn, besøk per side, siste 50 besøk, alle hilsener, alle taler
        const totalt = await executeQuery(connection, "SELECT COUNT(*) AS total FROM Thomas50_Besok");
        const unike = await executeQuery(connection, "SELECT COUNT(DISTINCT navn) AS unike FROM Thomas50_Besok WHERE navn IS NOT NULL AND navn <> 'anonym'");
        const perSide = await executeQuery(connection, "SELECT side, COUNT(*) AS antall FROM Thomas50_Besok GROUP BY side ORDER BY antall DESC");
        const perNavn = await executeQuery(connection, `
            SELECT navn,
                   COUNT(*) AS besok,
                   MAX(opprettet) AS sist
            FROM Thomas50_Besok
            WHERE navn IS NOT NULL AND navn <> 'anonym'
            GROUP BY navn
            ORDER BY sist DESC`);
        const sisteBesok = await executeQuery(connection, "SELECT TOP 50 navn, side, opprettet FROM Thomas50_Besok ORDER BY opprettet DESC");
        const hilsener = await executeQuery(connection, "SELECT id, navn, tekst, opprettet FROM Thomas50_Hilsener ORDER BY opprettet DESC");
        const taler = await executeQuery(connection, "SELECT id, navn, epost, tema, melding, opprettet FROM Thomas50_Toaster ORDER BY opprettet DESC");

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
