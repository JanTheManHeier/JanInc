const { getConnection, executeQuery, TYPES } = require('../shared/db');

const ENSURE_TABLE_SQL = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SiljeTerje_GjestEdit')
CREATE TABLE SiljeTerje_GjestEdit (
    navn NVARCHAR(100) PRIMARY KEY,
    bio NVARCHAR(500) NULL,
    relasjon NVARCHAR(200) NULL,
    extraBio NVARCHAR(500) NULL,
    oppdatert DATETIME2 DEFAULT GETDATE()
);
`;

// Idempotent kolonne-add for nye felt
const ENSURE_COLUMNS_SQL = `
IF COL_LENGTH('SiljeTerje_GjestEdit','nyttNavn') IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD nyttNavn NVARCHAR(100) NULL;
IF COL_LENGTH('SiljeTerje_GjestEdit','jobb')     IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD jobb NVARCHAR(200) NULL;
IF COL_LENGTH('SiljeTerje_GjestEdit','bord')     IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD bord INT NULL;
IF COL_LENGTH('SiljeTerje_GjestEdit','sete')     IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD sete INT NULL;
IF COL_LENGTH('SiljeTerje_GjestEdit','bordType') IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD bordType INT NULL;
IF COL_LENGTH('SiljeTerje_GjestEdit','fbUrl')    IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD fbUrl NVARCHAR(500) NULL;
IF COL_LENGTH('SiljeTerje_GjestEdit','liUrl')    IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD liUrl NVARCHAR(500) NULL;
IF COL_LENGTH('SiljeTerje_GjestEdit','igUrl')    IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD igUrl NVARCHAR(500) NULL;
IF COL_LENGTH('SiljeTerje_GjestEdit','bildeUrl') IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD bildeUrl NVARCHAR(MAX) NULL;
IF COL_LENGTH('SiljeTerje_GjestEdit','skjult')   IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD skjult BIT NOT NULL DEFAULT 0 WITH VALUES;
IF COL_LENGTH('SiljeTerje_GjestEdit','nyGjest')  IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD nyGjest BIT NOT NULL DEFAULT 0 WITH VALUES;
IF COL_LENGTH('SiljeTerje_GjestEdit','pust')     IS NULL ALTER TABLE SiljeTerje_GjestEdit ADD pust BIT NULL;
`;

const SELECT_SQL = `SELECT navn, bio, relasjon, extraBio, nyttNavn, jobb, bord, sete, bordType, fbUrl, liUrl, igUrl, bildeUrl, skjult, nyGjest, pust, oppdatert FROM SiljeTerje_GjestEdit`;

function s(v, max) {
    if (v === null || v === undefined) return null;
    const t = String(v).trim();
    if (!t) return null;
    return max ? t.substring(0, max) : t;
}
function n(v) {
    if (v === null || v === undefined || v === '') return null;
    const x = parseInt(v, 10);
    return Number.isFinite(x) ? x : null;
}
function b(v) {
    return v === true || v === 1 || v === '1' || v === 'true' ? 1 : 0;
}
// Tristate bit: null beholdes som null, ellers konverter
function bn(v) {
    if (v === null || v === undefined || v === '') return null;
    return v === true || v === 1 || v === '1' || v === 'true' ? 1 : 0;
}

module.exports = async function (context, req) {
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' };
    let connection;
    try {
        if (req.method !== 'GET') {
            const adminKey = process.env.ADMIN_KEY;
            if (!adminKey) {
                context.res = { status: 500, headers, body: { error: 'ADMIN_KEY ikke konfigurert' } };
                return;
            }
            const key = (req.body && req.body.key) || req.query.key || req.headers['x-admin-key'];
            if (!key || key !== adminKey) {
                context.res = { status: 401, headers, body: { error: 'Ugyldig admin-key' } };
                return;
            }
        }
        connection = await getConnection();
        await executeQuery(connection, ENSURE_TABLE_SQL);
        await executeQuery(connection, ENSURE_COLUMNS_SQL);

        if (req.method === 'GET') {
            const rows = await executeQuery(connection, SELECT_SQL);
            context.res = { status: 200, headers, body: rows };
            return;
        }

        if (req.method === 'DELETE') {
            const navn = req.query.navn || (req.body && req.body.navn);
            if (!navn) {
                context.res = { status: 400, headers, body: { error: 'navn paakrevd' } };
                return;
            }
            await executeQuery(connection,
                'DELETE FROM SiljeTerje_GjestEdit WHERE navn = @navn',
                [{ name: 'navn', type: TYPES.NVarChar, value: String(navn).substring(0, 100) }]);
            context.res = { status: 200, headers, body: { success: true, deleted: navn } };
            return;
        }

        if (req.method === 'POST') {
            const body = req.body || {};
            if (!body.navn) {
                context.res = { status: 400, headers, body: { error: 'navn paakrevd' } };
                return;
            }
            const p = {
                navn: s(body.navn, 100),
                bio: s(body.bio, 500),
                relasjon: s(body.relasjon, 200),
                extraBio: s(body.extraBio, 500),
                nyttNavn: s(body.nyttNavn, 100),
                jobb: s(body.jobb, 200),
                bord: n(body.bord),
                sete: n(body.sete),
                bordType: n(body.bordType),
                fbUrl: s(body.fbUrl, 500),
                liUrl: s(body.liUrl, 500),
                igUrl: s(body.igUrl, 500),
                bildeUrl: s(body.bildeUrl),
                skjult: b(body.skjult),
                nyGjest: b(body.nyGjest),
                pust: bn(body.pust),
            };

            await executeQuery(connection, `
                MERGE SiljeTerje_GjestEdit AS t
                USING (SELECT @navn AS navn) AS s ON t.navn = s.navn
                WHEN MATCHED THEN UPDATE SET
                    bio = @bio, relasjon = @relasjon, extraBio = @extraBio,
                    nyttNavn = @nyttNavn, jobb = @jobb,
                    bord = @bord, sete = @sete, bordType = @bordType,
                    fbUrl = @fbUrl, liUrl = @liUrl, igUrl = @igUrl,
                    bildeUrl = @bildeUrl, skjult = @skjult, nyGjest = @nyGjest, pust = @pust,
                    oppdatert = GETDATE()
                WHEN NOT MATCHED THEN INSERT
                    (navn, bio, relasjon, extraBio, nyttNavn, jobb, bord, sete, bordType, fbUrl, liUrl, igUrl, bildeUrl, skjult, nyGjest, pust)
                    VALUES (@navn, @bio, @relasjon, @extraBio, @nyttNavn, @jobb, @bord, @sete, @bordType, @fbUrl, @liUrl, @igUrl, @bildeUrl, @skjult, @nyGjest, @pust);`,
                [
                    { name: 'navn',     type: TYPES.NVarChar, value: p.navn },
                    { name: 'bio',      type: TYPES.NVarChar, value: p.bio },
                    { name: 'relasjon', type: TYPES.NVarChar, value: p.relasjon },
                    { name: 'extraBio', type: TYPES.NVarChar, value: p.extraBio },
                    { name: 'nyttNavn', type: TYPES.NVarChar, value: p.nyttNavn },
                    { name: 'jobb',     type: TYPES.NVarChar, value: p.jobb },
                    { name: 'bord',     type: TYPES.Int,      value: p.bord },
                    { name: 'sete',     type: TYPES.Int,      value: p.sete },
                    { name: 'bordType', type: TYPES.Int,      value: p.bordType },
                    { name: 'fbUrl',    type: TYPES.NVarChar, value: p.fbUrl },
                    { name: 'liUrl',    type: TYPES.NVarChar, value: p.liUrl },
                    { name: 'igUrl',    type: TYPES.NVarChar, value: p.igUrl },
                    { name: 'bildeUrl', type: TYPES.NVarChar, value: p.bildeUrl, options: { length: Infinity } },
                    { name: 'skjult',   type: TYPES.Bit,      value: p.skjult },
                    { name: 'nyGjest',  type: TYPES.Bit,      value: p.nyGjest },
                    { name: 'pust',     type: TYPES.Bit,      value: p.pust },
                ]
            );
            context.res = { status: 200, headers, body: { success: true } };
            return;
        }

        context.res = { status: 405, headers, body: { error: 'Method not allowed' } };
    } catch (err) {
        context.log.error('siljeterje-gjest-edit error:', err.message);
        context.res = { status: 500, headers, body: { error: 'Server error', details: err.message } };
    } finally {
        if (connection) try { connection.close(); } catch (_) {}
    }
};
