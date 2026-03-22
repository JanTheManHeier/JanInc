const { getConnection, executeQuery } = require('../shared/db');

module.exports = async function (context, req) {
    let connection;
    try {
        connection = await getConnection();

        await executeQuery(connection, `
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SpisSlank_Profiles')
            CREATE TABLE SpisSlank_Profiles (
                device_id NVARCHAR(36) PRIMARY KEY,
                name NVARCHAR(100),
                language NVARCHAR(2) DEFAULT 'no',
                dietary_restrictions NVARCHAR(MAX),
                allergies NVARCHAR(MAX),
                meal_frequency NVARCHAR(MAX),
                created_at DATETIME2 DEFAULT GETUTCDATE(),
                updated_at DATETIME2 DEFAULT GETUTCDATE()
            );
        `);

        await executeQuery(connection, `
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SpisSlank_Usage')
            CREATE TABLE SpisSlank_Usage (
                id INT IDENTITY PRIMARY KEY,
                device_id NVARCHAR(36),
                event_type NVARCHAR(50),
                event_data NVARCHAR(MAX),
                created_at DATETIME2 DEFAULT GETUTCDATE()
            );
        `);

        await executeQuery(connection, `
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SpisSlank_SharedPlans')
            CREATE TABLE SpisSlank_SharedPlans (
                id INT IDENTITY PRIMARY KEY,
                short_code NVARCHAR(10) UNIQUE,
                device_id NVARCHAR(36),
                plan_data NVARCHAR(MAX),
                title NVARCHAR(200),
                created_at DATETIME2 DEFAULT GETUTCDATE(),
                view_count INT DEFAULT 0
            );
        `);

        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: { status: 'ok', message: 'SpisSlank tables created/verified' }
        };
    } catch (err) {
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: { status: 'error', message: err.message }
        };
    } finally {
        if (connection) connection.close();
    }
};
