const { getConnection, executeQuery } = require('../shared/db');

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;

    try {
        connection = await getConnection();

        // Get all votes
        const rows = await executeQuery(connection,
            'SELECT user_name, baby_name, vote FROM BabyNavnVotes'
        );

        const margauxVotes = rows.filter(r => r.user_name === 'margaux');
        const pederVotes = rows.filter(r => r.user_name === 'peder');

        const margauxLikes = new Set(margauxVotes.filter(r => r.vote).map(r => r.baby_name));
        const pederLikes = new Set(pederVotes.filter(r => r.vote).map(r => r.baby_name));

        // Names both liked
        const matches = [...margauxLikes].filter(n => pederLikes.has(n)).sort();

        context.res = {
            status: 200, headers,
            body: {
                matches,
                margaux: {
                    voted: margauxVotes.length,
                    likes: margauxLikes.size,
                    favorites: [...margauxLikes].sort()
                },
                peder: {
                    voted: pederVotes.length,
                    likes: pederLikes.size,
                    favorites: [...pederLikes].sort()
                }
            }
        };
    } catch (err) {
        // Table might not exist yet — return empty results
        context.res = {
            status: 200, headers,
            body: { matches: [], margaux: { voted: 0, likes: 0, favorites: [] }, peder: { voted: 0, likes: 0, favorites: [] } }
        };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
