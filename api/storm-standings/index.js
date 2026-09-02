const BASKETLIVE_URL = 'https://sf14-terminlister-prod-app.azurewebsites.net/ta/TournamentStandings/';
const DEFAULT_TOURNAMENT_ID = '449378';
const REQUEST_TIMEOUT_MS = 10000;
const TEAM_WEBSITES = new Map([
    ['Ammerud', 'https://www.ammerudbasket.no/'],
    ['Bærum Basket', 'https://www.barumbasket.no/'],
    ['Centrum Tigers', 'https://www.centrumtigers.com/'],
    ['Frøya', 'https://froyabasket.no/'],
    ['Gimle', 'https://www.gimle.no/'],
    ['Fyllingen Lions', 'https://www.fyllingenlions.no/'],
    ['Kongsberg Miners', 'https://kongsbergminers.no/'],
    ['Nidaros Jets', 'https://nidarosjets.no/'],
    ['TNT Towers', 'https://tntbasket.no/']
]);

function normalizeStandings(rows) {
    return (Array.isArray(rows) ? rows : [])
        .map((row) => {
            const team = String(row.orgName || '').trim();
            return {
                position: Number(row.position),
                team,
                url: TEAM_WEBSITES.get(team) || null,
                played: Number(row.matches || 0),
                wins: Number(row.victories || 0),
                losses: Number(row.losses || 0),
                difference: Number(row.goalDifference || 0),
                points: Number(row.totalPoints || 0)
            };
        })
        .filter((row) => Number.isInteger(row.position) && row.position > 0 && row.team)
        .sort((left, right) => left.position - right.position);
}

async function getStandings(tournamentId) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const url = `${BASKETLIVE_URL}?tournamentId=${encodeURIComponent(tournamentId)}`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`BasketLive svarte med HTTP ${response.status}`);
        return normalizeStandings(await response.json());
    } finally {
        clearTimeout(timeout);
    }
}

module.exports = async function (context) {
    const tournamentId = process.env.NIF_TOURNAMENT_ID || DEFAULT_TOURNAMENT_ID;

    try {
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'public, max-age=300, stale-while-revalidate=900'
            },
            body: await getStandings(tournamentId)
        };
    } catch (error) {
        context.log.error('Kunne ikke hente BLNO-tabellen fra BasketLive', error);
        context.res = {
            status: 502,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: { error: 'BLNO-tabellen kunne ikke hentes' }
        };
    }
};

module.exports.normalizeStandings = normalizeStandings;
