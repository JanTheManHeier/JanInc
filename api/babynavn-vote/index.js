const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'BabyNavnVotes')
CREATE TABLE BabyNavnVotes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_name NVARCHAR(50) NOT NULL,
    baby_name NVARCHAR(100) NOT NULL,
    vote BIT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT UQ_BabyNavnVotes UNIQUE (user_name, baby_name)
);`;

module.exports = async function (context, req) {
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
    };

    let connection;
    try {
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);

        if (req.method === 'GET') {
            // Get all votes for a user
            const user = (req.query.user || '').toLowerCase();
            if (!user || !['margaux', 'peder', 'age', 'marie'].includes(user)) {
                context.res = { status: 400, headers, body: { error: 'Invalid user' } };
                return;
            }

            const rows = await executeQuery(connection, 
                'SELECT baby_name, vote FROM BabyNavnVotes WHERE user_name = @user',
                [{ name: 'user', type: TYPES.NVarChar, value: user }]
            );

            context.res = {
                status: 200, headers,
                body: { user, votes: rows.map(r => ({ name: r.baby_name, vote: r.vote })) }
            };

        } else if (req.method === 'POST') {
            const { user, name, vote } = req.body || {};
            const userLower = (user || '').toLowerCase();

            if (!userLower || !['margaux', 'peder', 'age', 'marie'].includes(userLower)) {
                context.res = { status: 400, headers, body: { error: 'Invalid user' } };
                return;
            }

            // Delete a vote (to resurface a name)
            if (vote === null) {
                await executeQuery(connection, 
                    'DELETE FROM BabyNavnVotes WHERE user_name = @user AND baby_name = @name',
                    [
                        { name: 'user', type: TYPES.NVarChar, value: userLower },
                        { name: 'name', type: TYPES.NVarChar, value: name }
                    ]
                );
                context.res = { status: 200, headers, body: { success: true, deleted: true } };
                return;
            }

            if (!name || typeof vote !== 'boolean') {
                context.res = { status: 400, headers, body: { error: 'Provide name (string) and vote (boolean)' } };
                return;
            }

            // Upsert vote
            await executeQuery(connection, `
                MERGE BabyNavnVotes AS target
                USING (SELECT @user AS user_name, @name AS baby_name) AS source
                ON target.user_name = source.user_name AND target.baby_name = source.baby_name
                WHEN MATCHED THEN UPDATE SET vote = @vote, created_at = GETDATE()
                WHEN NOT MATCHED THEN INSERT (user_name, baby_name, vote) VALUES (@user, @name, @vote);`,
                [
                    { name: 'user', type: TYPES.NVarChar, value: userLower },
                    { name: 'name', type: TYPES.NVarChar, value: name },
                    { name: 'vote', type: TYPES.Bit, value: vote }
                ]
            );

            context.res = { status: 200, headers, body: { success: true } };
        }
    } catch (err) {
        context.log.error('babynavn-vote error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
