const { getConnection, executeQuery } = require('../shared/db');

module.exports = async function (context, req) {
    let connection;
    try {
        connection = await getConnection();

        await executeQuery(connection,
            `IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Kjemi_Usage')
             CREATE TABLE Kjemi_Usage (
                 id INT IDENTITY(1,1) PRIMARY KEY,
                 event_type NVARCHAR(50) NOT NULL,
                 chapter NVARCHAR(100) NULL,
                 mode NVARCHAR(50) NULL,
                 score INT NULL,
                 total INT NULL,
                 duration_sec INT NULL,
                 created_at DATETIME2 DEFAULT GETDATE()
             )`
        );

        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: { status: 'Table Kjemi_Usage created or already exists' }
        };
    } catch (err) {
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: { error: err.message }
        };
    } finally {
        if (connection) connection.close();
    }
};
