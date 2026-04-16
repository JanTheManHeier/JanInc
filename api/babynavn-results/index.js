const { getConnection, executeQuery, TYPES } = require('../shared/db');

// Couple configurations
const COUPLES = {
    default: { user1: 'margaux', user2: 'peder' },
    am:      { user1: 'age',     user2: 'marie' }
};

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;

    const coupleKey = (req.query.couple || '').toLowerCase();
    const couple = COUPLES[coupleKey] || COUPLES.default;
    const { user1, user2 } = couple;

    try {
        connection = await getConnection();

        // Get all votes for this couple
        const rows = await executeQuery(connection,
            'SELECT user_name, baby_name, vote FROM BabyNavnVotes WHERE user_name = @user1 OR user_name = @user2',
            [
                { name: 'user1', type: TYPES.NVarChar, value: user1 },
                { name: 'user2', type: TYPES.NVarChar, value: user2 }
            ]
        );

        const user1Votes = rows.filter(r => r.user_name === user1);
        const user2Votes = rows.filter(r => r.user_name === user2);

        const user1Likes = new Set(user1Votes.filter(r => r.vote).map(r => r.baby_name));
        const user2Likes = new Set(user2Votes.filter(r => r.vote).map(r => r.baby_name));

        // Names both liked
        const matches = [...user1Likes].filter(n => user2Likes.has(n)).sort();

        const body = { matches };
        body[user1] = {
            voted: user1Votes.length,
            likes: user1Likes.size,
            favorites: [...user1Likes].sort()
        };
        body[user2] = {
            voted: user2Votes.length,
            likes: user2Likes.size,
            favorites: [...user2Likes].sort()
        };

        context.res = { status: 200, headers, body };
    } catch (err) {
        // Table might not exist yet — return empty results
        const body = { matches: [] };
        body[user1] = { voted: 0, likes: 0, favorites: [] };
        body[user2] = { voted: 0, likes: 0, favorites: [] };
        context.res = { status: 200, headers, body };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
