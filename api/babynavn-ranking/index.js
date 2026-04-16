const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'BabyNavnRankings')
CREATE TABLE BabyNavnRankings (
    user_name NVARCHAR(50) NOT NULL,
    baby_name NVARCHAR(100) NOT NULL,
    elo_score INT DEFAULT 1000,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT PK_BabyNavnRankings PRIMARY KEY (user_name, baby_name)
);`;

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;

    try {
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);

        if (req.method === 'GET') {
            const user = (req.query.user || '').toLowerCase();
            if (!user || !['margaux', 'peder', 'age', 'marie'].includes(user)) {
                context.res = { status: 400, headers, body: { error: 'Invalid user' } };
                return;
            }

            const rows = await executeQuery(connection,
                'SELECT baby_name, elo_score, wins, losses FROM BabyNavnRankings WHERE user_name = @user ORDER BY elo_score DESC',
                [{ name: 'user', type: TYPES.NVarChar, value: user }]
            );

            context.res = {
                status: 200, headers,
                body: {
                    user,
                    rankings: rows.map(r => ({
                        name: r.baby_name,
                        score: r.elo_score,
                        wins: r.wins,
                        losses: r.losses
                    }))
                }
            };

        } else if (req.method === 'POST') {
            const { user, rankings } = req.body || {};
            const userLower = (user || '').toLowerCase();

            if (!userLower || !['margaux', 'peder', 'age', 'marie'].includes(userLower)) {
                context.res = { status: 400, headers, body: { error: 'Invalid user' } };
                return;
            }
            if (!Array.isArray(rankings) || rankings.length === 0) {
                context.res = { status: 400, headers, body: { error: 'Provide rankings array' } };
                return;
            }

            // Bulk upsert rankings
            for (const r of rankings) {
                if (!r.name) continue;
                await executeQuery(connection, `
                    MERGE BabyNavnRankings AS target
                    USING (SELECT @user AS user_name, @name AS baby_name) AS source
                    ON target.user_name = source.user_name AND target.baby_name = source.baby_name
                    WHEN MATCHED THEN UPDATE SET elo_score = @score, wins = @wins, losses = @losses, updated_at = GETDATE()
                    WHEN NOT MATCHED THEN INSERT (user_name, baby_name, elo_score, wins, losses) VALUES (@user, @name, @score, @wins, @losses);`,
                    [
                        { name: 'user', type: TYPES.NVarChar, value: userLower },
                        { name: 'name', type: TYPES.NVarChar, value: r.name },
                        { name: 'score', type: TYPES.Int, value: r.score || 1000 },
                        { name: 'wins', type: TYPES.Int, value: r.wins || 0 },
                        { name: 'losses', type: TYPES.Int, value: r.losses || 0 }
                    ]
                );
            }

            context.res = { status: 200, headers, body: { success: true, count: rankings.length } };
        }
    } catch (err) {
        context.log.error('babynavn-ranking error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
