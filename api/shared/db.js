const { Connection, Request, TYPES } = require('tedious');

function getConnection() {
    const connStr = process.env.DATABASE_CONNECTION_STRING;
    if (!connStr) throw new Error('DATABASE_CONNECTION_STRING not configured');

    const parts = {};
    connStr.split(';').forEach(part => {
        const [key, ...vals] = part.split('=');
        if (key && vals.length) parts[key.trim()] = vals.join('=');
    });

    return new Promise((resolve, reject) => {
        const connection = new Connection({
            server: (parts['Server'] || '').replace('tcp:', '').split(',')[0],
            authentication: {
                type: 'default',
                options: {
                    userName: parts['User ID'],
                    password: parts['Password']
                }
            },
            options: {
                database: parts['Initial Catalog'],
                encrypt: true,
                port: 1433,
                connectTimeout: 30000,
                requestTimeout: 30000
            }
        });
        connection.on('connect', err => err ? reject(err) : resolve(connection));
        connection.connect();
    });
}

function executeQuery(connection, sql, params = []) {
    return new Promise((resolve, reject) => {
        const rows = [];
        const request = new Request(sql, (err) => {
            if (err) reject(err);
            else resolve(rows);
        });
        params.forEach(p => request.addParameter(p.name, p.type, p.value, p.options));
        request.on('row', columns => {
            const row = {};
            columns.forEach(col => { row[col.metadata.colName] = col.value; });
            rows.push(row);
        });
        connection.execSql(request);
    });
}

module.exports = { getConnection, executeQuery, TYPES };
