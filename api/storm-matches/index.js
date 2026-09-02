const TOKEN_URL = 'https://id.nif.no/connect/token';
const DATA_URL = 'https://data.nif.no/api/v1/ta/ScheduledMatches/club';
const DEFAULT_ORG_ID = '220005';
const TOKEN_SCOPE = 'data_ta_scheduledmatches_read';
const REQUEST_TIMEOUT_MS = 10000;
const TEAM_SUFFIX = /\s+-\s+MEN\s+1$/i;
const TEAM_ALIASES = new Map([
    ['Ammerud BLNO', 'Ammerud'],
    ['Tønsberg, Nøtterøy, Tjøme Basket Klubb', 'TNT Towers']
]);

let cachedToken = null;
let tokenExpiresAt = 0;

function displayTeamName(name) {
    const normalized = String(name || '').replace(TEAM_SUFFIX, '').trim();
    return TEAM_ALIASES.get(normalized) || normalized;
}

function formatTime(value) {
    if (value === null || value === undefined) return '';
    return String(value).padStart(4, '0').replace(/^(\d{2})(\d{2})$/, '$1:$2');
}

function normalizeMatch(match) {
    const date = String(match.matchDate || '').slice(0, 10);
    const matchId = Number(match.matchId || match.id);
    const time = formatTime(match.matchStartTime);

    return {
        id: matchId,
        date,
        time,
        endTime: formatTime(match.matchEndTime),
        venue: match.activityAreaName || '',
        home: displayTeamName(match.hometeam),
        away: displayTeamName(match.awayteam),
        tournament: match.tournamentName || '',
        status: match.statusType || '',
        result: match.matchResult || null,
        url: Number.isFinite(matchId) ? `https://wp.nif.no/MatchDetails?id=${matchId}` : null
    };
}

function normalizeMatches(matches) {
    const uniqueMatches = new Map();

    for (const match of Array.isArray(matches) ? matches : []) {
        const normalized = normalizeMatch(match);
        if (
            !normalized.id ||
            !/^\d{4}-\d{2}-\d{2}$/.test(normalized.date) ||
            !/^\d{2}:\d{2}$/.test(normalized.time)
        ) continue;
        uniqueMatches.set(normalized.id, normalized);
    }

    return [...uniqueMatches.values()].sort((left, right) =>
        `${left.date}T${left.time}`.localeCompare(`${right.date}T${right.time}`)
    );
}

async function requestJson(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        const body = await response.text();

        if (!response.ok) {
            throw new Error(`NIF svarte med HTTP ${response.status}`);
        }

        return body ? JSON.parse(body) : null;
    } finally {
        clearTimeout(timeout);
    }
}

async function getAccessToken(clientId, clientSecret) {
    if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await requestJson(TOKEN_URL, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            scope: TOKEN_SCOPE
        }).toString()
    });

    if (!tokenResponse?.access_token) {
        throw new Error('NIF returnerte ikke et tilgangstoken');
    }

    cachedToken = tokenResponse.access_token;
    tokenExpiresAt = Date.now() + Math.max(0, Number(tokenResponse.expires_in || 3600) - 60) * 1000;
    return cachedToken;
}

module.exports = async function (context) {
    const clientId = process.env.NIF_CLIENT_ID;
    const clientSecret = process.env.NIF_CLIENT_SECRET;
    const orgId = process.env.NIF_ORG_ID || DEFAULT_ORG_ID;

    if (!clientId || !clientSecret) {
        context.log.error('NIF_CLIENT_ID og NIF_CLIENT_SECRET må konfigureres');
        context.res = {
            status: 503,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: { error: 'Resultattjenesten er ikke konfigurert' }
        };
        return;
    }

    try {
        const token = await getAccessToken(clientId, clientSecret);
        const matches = await requestJson(`${DATA_URL}/${encodeURIComponent(orgId)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'public, max-age=300, stale-while-revalidate=900'
            },
            body: normalizeMatches(matches)
        };
    } catch (error) {
        context.log.error('Kunne ikke hente kamper fra NIF', error);
        context.res = {
            status: 502,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: { error: 'Terminlisten kunne ikke hentes fra NIF' }
        };
    }
};

module.exports.normalizeMatches = normalizeMatches;
