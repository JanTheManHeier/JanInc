// ── Translations (Norwegian for both) ──
const T = {
    age: {
        welcomeSub: "Finn det perfekte navnet sammen",
        loading: "Laster navn…",
        progressOf: "av",
        doneTitle: "Ferdig!",
        doneSub: "Du likte {n} av {total} navn.",
        doneBtn: "Se resultater",
        resultsTitle: "Resultater",
        matchesSection: "❄️ Navn dere begge liker",
        myFavs: "Mine favoritter",
        partnerFavs: "Marie sine favoritter",
        progressSection: "Fremgang",
        noMatches: "Ingen felles navn ennå. Fortsett å stemme!",
        noFavs: "Ingen favoritter ennå",
        voted: "stemt",
        likes: "favoritter",
        back: "Tilbake",
        waitingPartner: "Venter på at Marie stemmer…",
        h2hStart: "Start duell 🏆",
        h2hContinue: "Fortsett duell 🏆",
        h2hTitle: "Duell",
        h2hRound: "Runde",
        h2hMatch: "Kamp",
        rankingTitle: "Min rangering",
        rankingEmpty: "Spill kamper for å se din rangering",
        rankingContinue: "Fortsett",
        roundComplete: "Runde ferdig!",
        yourNumber1: "Din #1:",
        topNamesSection: "🏆 Toppnavn",
        h2hNotEnough: "Du trenger minst 4 favoritter for duell.",
        matchesRanked: "❄️ Felles navn (rangert)",
        dbSleeping: "Databasen sover… prøv igjen snart"
    },
    marie: {
        welcomeSub: "Finn det perfekte navnet sammen",
        loading: "Laster namn…",
        progressOf: "av",
        doneTitle: "Ferdig!",
        doneSub: "Du likte {n} av {total} namn.",
        doneBtn: "Sjå resultater",
        resultsTitle: "Resultater",
        matchesSection: "❄️ Namn de begge likar",
        myFavs: "Mine favorittar",
        partnerFavs: "Åge sine favoritter",
        progressSection: "Framgang",
        noMatches: "Ingen felles namn enno. Hald fram med å stemme!",
        noFavs: "Ingen favorittar enno",
        voted: "stemt",
        likes: "favorittar",
        back: "Tilbake",
        waitingPartner: "Ventar på at Åge stemmer…",
        h2hStart: "Start duell 🏆",
        h2hContinue: "Hald fram med duell 🏆",
        h2hTitle: "Duell",
        h2hRound: "Runde",
        h2hMatch: "Kamp",
        rankingTitle: "Mi rangering",
        rankingEmpty: "Spel kampar for å sjå rangeringa di",
        rankingContinue: "Hald fram",
        roundComplete: "Runde ferdig!",
        yourNumber1: "Din #1:",
        topNamesSection: "🏆 Toppnamn",
        h2hNotEnough: "Du treng minst 4 favorittar for duell.",
        matchesRanked: "❄️ Felles namn (rangert)",
        dbSleeping: "Databasen søv… prøv igjen snart"
    }
};

// ── State ──
let currentUser = null;
let votes = {};
let nameQueue = [];
let currentName = null;
let lastVote = null;
let matchCount = 0;
let previousView = 'welcome';

// H2H state
let h2hNames = [];
let h2hElo = {};
let h2hPairs = [];
let h2hPairIndex = 0;
let h2hRound = 0;
let h2hTotalMatchups = 0;
let h2hHistory = [];
let h2hBusy = false;

// Sync state
let syncQueue = [];
let isSyncing = false;

// ── Helpers ──
function t(key) { return currentUser ? T[currentUser][key] : T.age[key]; }

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function showView(id) {
    const prev = document.querySelector('.view.active');
    if (prev) {
        previousView = prev.id.replace('view-', '');
        prev.classList.remove('active');
    }
    document.getElementById('view-' + id).classList.add('active');
}

function goBack() { showView('welcome'); currentUser = null; }

function goBackFromResults() {
    if (currentUser && nameQueue.length > 0) showView('swipe');
    else if (currentUser) showView('done');
    else showView('welcome');
}

function debounce(fn, ms) {
    let timer;
    return function() { clearTimeout(timer); timer = setTimeout(fn, ms); };
}

function spawnHearts(count) {
    const container = document.getElementById('hearts-container');
    const flakes = ['❄️','❄','✨','⛄','🌟'];
    for (let i = 0; i < (count||6); i++) {
        const el = document.createElement('span');
        el.className = 'floating-heart';
        el.textContent = flakes[Math.floor(Math.random() * flakes.length)];
        el.style.left = (30 + Math.random() * 40) + '%';
        el.style.bottom = '30%';
        el.style.animationDelay = (Math.random() * 0.3) + 's';
        container.appendChild(el);
        setTimeout(() => el.remove(), 2000);
    }
}

function showToast(msg, duration) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('visible'));
    setTimeout(() => {
        el.classList.remove('visible');
        setTimeout(() => el.remove(), 300);
    }, duration || 2500);
}

// ── localStorage ──
function saveVotesLocal() {
    localStorage.setItem('babynavn_am_r2_votes_' + currentUser, JSON.stringify(votes));
}
function loadVotesLocal() {
    try { const d = localStorage.getItem('babynavn_am_r2_votes_' + currentUser); return d ? JSON.parse(d) : null; }
    catch { return null; }
}
function saveH2HLocal() {
    localStorage.setItem('babynavn_am_r2_h2h_' + currentUser, JSON.stringify({
        names: h2hNames, elo: h2hElo, round: h2hRound,
        total: h2hTotalMatchups, history: h2hHistory
    }));
}
function loadH2HLocal() {
    try {
        const d = localStorage.getItem('babynavn_am_r2_h2h_' + currentUser);
        if (!d) return false;
        const s = JSON.parse(d);
        h2hNames = s.names || []; h2hElo = s.elo || {};
        h2hRound = s.round || 0; h2hTotalMatchups = s.total || 0;
        h2hHistory = s.history || [];
        return h2hNames.length >= 4;
    } catch { return false; }
}

// ── API (background sync) ──
async function apiGet(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API ' + res.status);
    return res.json();
}
async function apiPost(url, body) {
    const res = await fetch(url, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('API ' + res.status);
    return res.json();
}

function queueVoteSync(name, vote) {
    syncQueue.push({ name, vote });
    localStorage.setItem('babynavn_am_r2_pending_' + currentUser, JSON.stringify(syncQueue));
    debouncedFlush();
}
const debouncedFlush = debounce(flushSyncQueue, 3000);

async function flushSyncQueue() {
    if (isSyncing || syncQueue.length === 0 || !currentUser) return;
    isSyncing = true;
    const batch = [...syncQueue];
    const failed = [];
    for (const item of batch) {
        try { await apiPost('/api/babynavn-vote', { user: currentUser, name: item.name, vote: item.vote }); }
        catch { failed.push(item); }
    }
    syncQueue = failed;
    localStorage.setItem('babynavn_am_r2_pending_' + currentUser, JSON.stringify(syncQueue));
    isSyncing = false;
}

async function syncFromServer() {
    try {
        const nameSet = new Set(BABY_NAMES);
        const data = await apiGet('/api/babynavn-vote?user=' + currentUser);
        const pendingNames = new Set(syncQueue.map(s => s.name));
        let updated = false;
        for (const v of data.votes) {
            if (nameSet.has(v.name) && !pendingNames.has(v.name) && !(v.name in votes)) {
                votes[v.name] = v.vote; updated = true;
            }
        }
        if (updated) {
            saveVotesLocal();
            nameQueue = shuffle(BABY_NAMES.filter(n => !(n in votes)));
            if (document.querySelector('#view-swipe.active')) updateProgress();
        }
        flushSyncQueue();
    } catch {}
}

async function syncRankingToServer() {
    if (!currentUser || h2hNames.length === 0) return;
    const rankings = h2hNames.map(name => ({
        name, score: h2hElo[name] || 1000,
        wins: h2hHistory.filter(m => m.winner === name).length,
        losses: h2hHistory.filter(m => m.loser === name).length
    }));
    try { await apiPost('/api/babynavn-ranking', { user: currentUser, rankings }); } catch {}
}

async function fetchResults() {
    try { return await apiGet('/api/babynavn-results?couple=am'); }
    catch { return { matches: [], age: {voted:0,likes:0,favorites:[]}, marie: {voted:0,likes:0,favorites:[]} }; }
}

// ── User Selection (localStorage-first = instant) ──
async function selectUser(user) {
    currentUser = user;
    try {
        const p = localStorage.getItem('babynavn_am_r2_pending_' + currentUser);
        if (p) syncQueue = JSON.parse(p);
    } catch { syncQueue = []; }

    const localVotes = loadVotesLocal();
    if (localVotes && Object.keys(localVotes).length > 0) {
        votes = localVotes;
        nameQueue = shuffle(BABY_NAMES.filter(n => !(n in votes)));
        nameQueue.length === 0 ? showDone() : showSwipe();
        syncFromServer(); // non-blocking background sync
    } else {
        document.getElementById('loading-text').textContent = t('loading');
        showView('loading');
        try {
            const data = await apiGet('/api/babynavn-vote?user=' + currentUser);
            votes = {};
            data.votes.forEach(v => { votes[v.name] = v.vote; });
            saveVotesLocal();
        } catch { votes = {}; }
        nameQueue = shuffle(BABY_NAMES.filter(n => !(n in votes)));
        nameQueue.length === 0 ? showDone() : showSwipe();
    }
}

// ── Swipe View ──
function showSwipe() { updateProgress(); showNextName(); showView('swipe'); }

function showNextName() {
    const card = document.getElementById('name-card');
    if (nameQueue.length === 0) { showDone(); return; }
    currentName = nameQueue[0];
    document.getElementById('card-name').textContent = currentName;
    card.className = 'name-card entering';
    card.style.transform = ''; card.style.opacity = '';
    card.querySelector('.like-indicator').style.opacity = '0';
    card.querySelector('.nope-indicator').style.opacity = '0';
    document.getElementById('undo-btn').style.display = lastVote ? 'flex' : 'none';
}

function updateProgress() {
    const voted = BABY_NAMES.filter(n => n in votes).length, total = BABY_NAMES.length;
    document.getElementById('progress-text').textContent = voted + ' ' + t('progressOf') + ' ' + total;
    document.getElementById('progress-fill').style.width = ((voted / total) * 100) + '%';
}

async function updateMatchBadge() {
    try {
        const data = await fetchResults();
        matchCount = data.matches.length;
        const badge = document.getElementById('match-badge');
        badge.textContent = matchCount;
        badge.style.display = matchCount > 0 ? 'flex' : 'none';
    } catch {}
}

// ── Voting (localStorage-first = instant) ──
function castVote(liked) {
    if (!currentName) return;
    const card = document.getElementById('name-card');
    card.classList.remove('entering','dragging');
    card.classList.add(liked ? 'exit-right' : 'exit-left');
    if (liked) spawnHearts(4);
    votes[currentName] = liked;
    lastVote = { name: currentName, vote: liked };
    nameQueue.shift();
    saveVotesLocal();
    queueVoteSync(currentName, liked);
    updateProgress();
    const vc = Object.keys(votes).length;
    if (vc % 15 === 0 || vc === BABY_NAMES.length) updateMatchBadge();
    setTimeout(() => { nameQueue.length === 0 ? showDone() : showNextName(); }, 350);
}

function undoVote() {
    if (!lastVote) return;
    delete votes[lastVote.name];
    nameQueue.unshift(lastVote.name);
    saveVotesLocal();
    lastVote = null;
    updateProgress(); showNextName();
}

// ── Done View ──
function showDone() {
    const likedCount = BABY_NAMES.filter(n => votes[n] === true).length;
    const total = BABY_NAMES.length;
    document.getElementById('done-title').textContent = t('doneTitle');
    document.getElementById('done-subtitle').textContent = t('doneSub').replace('{n}', likedCount).replace('{total}', total);
    document.getElementById('done-results-btn').textContent = t('doneBtn');
    const h2hBtn = document.getElementById('done-h2h-btn');
    if (likedCount >= 4) {
        const hasH2H = loadH2HLocal();
        h2hBtn.textContent = hasH2H ? t('h2hContinue') : t('h2hStart');
        h2hBtn.style.display = 'block';
    } else { h2hBtn.style.display = 'none'; }
    showView('done');
    updateMatchBadge();
}

// ── Head-to-Head (Elo tournament) ──
function computeElo(winnerScore, loserScore) {
    const K = 32;
    const e = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
    const delta = Math.max(1, Math.round(K * (1 - e)));
    return { winner: winnerScore + delta, loser: loserScore - delta };
}

function generateH2HPairs() {
    const sorted = [...h2hNames].sort((a, b) => (h2hElo[b]||1000) - (h2hElo[a]||1000));
    const pairs = [];
    for (let i = 0; i < sorted.length - 1; i += 2) {
        pairs.push(Math.random() > 0.5 ? [sorted[i], sorted[i+1]] : [sorted[i+1], sorted[i]]);
    }
    return shuffle(pairs);
}

function startH2H() {
    const likedNames = BABY_NAMES.filter(n => votes[n] === true);
    if (likedNames.length < 4) { showToast(t('h2hNotEnough')); return; }
    const hasExisting = loadH2HLocal();
    if (!hasExisting) {
        h2hNames = likedNames;
        h2hElo = {}; likedNames.forEach(n => { h2hElo[n] = 1000; });
        h2hRound = 0; h2hTotalMatchups = 0; h2hHistory = [];
    }
    h2hPairs = generateH2HPairs();
    h2hPairIndex = 0;
    showView('h2h');
    showH2HPair();
}

function showH2HPair() {
    if (h2hPairIndex >= h2hPairs.length) {
        h2hRound++;
        const top = getTopRanked(1);
        showToast(t('roundComplete') + ' ' + t('yourNumber1') + ' ' + (top[0] ? top[0].name : '?'));
        if (h2hRound % 2 === 0) syncRankingToServer();
        saveH2HLocal();
        h2hPairs = generateH2HPairs();
        h2hPairIndex = 0;
    }
    const pair = h2hPairs[h2hPairIndex];
    document.getElementById('h2h-left-name').textContent = pair[0];
    document.getElementById('h2h-right-name').textContent = pair[1];
    document.getElementById('h2h-left').className = 'h2h-card h2h-entering';
    document.getElementById('h2h-right').className = 'h2h-card h2h-entering';
    document.getElementById('h2h-info').textContent =
        t('h2hRound') + ' ' + (h2hRound+1) + ' · ' + t('h2hMatch') + ' ' + (h2hPairIndex+1) + '/' + h2hPairs.length;
    document.getElementById('h2h-total').textContent = h2hTotalMatchups + ' total';
}

function h2hPick(side) {
    if (h2hBusy || h2hPairIndex >= h2hPairs.length) return;
    h2hBusy = true;
    const pair = h2hPairs[h2hPairIndex];
    const winner = side === 'left' ? pair[0] : pair[1];
    const loser  = side === 'left' ? pair[1] : pair[0];
    const result = computeElo(h2hElo[winner]||1000, h2hElo[loser]||1000);
    h2hElo[winner] = result.winner;
    h2hElo[loser]  = result.loser;
    h2hHistory.push({ winner, loser });
    h2hTotalMatchups++;
    const winCard  = document.getElementById(side === 'left' ? 'h2h-left' : 'h2h-right');
    const loseCard = document.getElementById(side === 'left' ? 'h2h-right' : 'h2h-left');
    winCard.classList.add('h2h-winner');
    loseCard.classList.add('h2h-loser');
    saveH2HLocal();
    setTimeout(() => { h2hPairIndex++; showH2HPair(); h2hBusy = false; }, 500);
}

function getTopRanked(n) {
    return h2hNames.map(name => ({ name, score: h2hElo[name]||1000 }))
        .sort((a,b) => b.score - a.score).slice(0, n||10);
}

function exitH2H() { saveH2HLocal(); syncRankingToServer(); showDone(); }

// ── Ranking View ──
function showRanking() {
    document.getElementById('ranking-title').textContent = t('rankingTitle');
    showView('ranking');
    const body = document.getElementById('ranking-body');
    const ranked = getTopRanked(h2hNames.length);
    if (ranked.length === 0) {
        body.innerHTML = '<div class="empty-message"><span class="empty-icon">🏆</span>' + t('rankingEmpty') + '</div>';
        return;
    }
    let html = '<div class="results-card">';
    ranked.forEach((item, i) => {
        const medal = i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : '#'+(i+1);
        const wins = h2hHistory.filter(m => m.winner === item.name).length;
        const losses = h2hHistory.filter(m => m.loser === item.name).length;
        html += '<div class="rank-item"><span class="rank-pos">' + medal + '</span>' +
            '<span class="rank-name">' + item.name + '</span>' +
            '<span class="rank-stats">' + wins + 'W ' + losses + 'L</span>' +
            '<span class="rank-score">' + item.score + '</span></div>';
    });
    html += '</div>';
    body.innerHTML = html;
}

function backFromRanking() { showView('h2h'); }

// ── Results View (local-first, server for partner) ──
async function showResults() {
    document.getElementById('results-title').textContent = t('resultsTitle');
    showView('results');
    await refreshResults();
}

async function refreshResults() {
    const body = document.getElementById('results-body');
    const total = BABY_NAMES.length;
    const myFlag = currentUser === 'age' ? '🏔️' : '🌊';
    const partnerFlag = currentUser === 'age' ? '🌊' : '🏔️';
    const myName = currentUser === 'age' ? 'Åge' : 'Marie';
    const partnerName = currentUser === 'age' ? 'Marie' : 'Åge';
    const partnerUser = currentUser === 'age' ? 'marie' : 'age';
    const myLikes = BABY_NAMES.filter(n => votes[n] === true);
    const myVoted = Object.keys(votes).length;
    const hasH2H = loadH2HLocal();

    let html = '';

    // Matches placeholder (needs server)
    html += '<div class="results-section" id="results-matches-section">' +
        '<div class="results-section-title">' + t('matchesSection') + '</div>' +
        '<div class="results-card"><div class="empty-message"><div class="loading-spinner" style="margin:0 auto 0.5rem"></div>' +
        t('loading') + '</div></div></div>';

    // My H2H ranking
    if (hasH2H && h2hTotalMatchups > 0) {
        const topNames = getTopRanked(10);
        html += '<div class="results-section"><div class="results-section-title">' + t('topNamesSection') + '</div><div class="results-card">';
        topNames.forEach((item, i) => {
            const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+(i+1);
            html += '<div class="match-item"><span class="match-heart">' + medal + '</span>' +
                '<span class="match-name">' + item.name + '</span>' +
                '<span class="match-rank">' + item.score + ' pts</span></div>';
        });
        html += '</div></div>';
    }

    // Progress
    html += '<div class="results-section"><div class="results-section-title">' + t('progressSection') + '</div>' +
        '<div class="progress-stats">' +
        '<div class="stat-card"><div class="stat-flag">' + myFlag + '</div><div class="stat-name">' + myName + '</div>' +
        '<div class="stat-number">' + myVoted + '</div><div class="stat-label">' + t('voted') + '</div>' +
        '<div class="stat-bar-track"><div class="stat-bar-fill" style="width:' + ((myVoted/total)*100) + '%"></div></div></div>' +
        '<div class="stat-card" id="partner-stat"><div class="stat-flag">' + partnerFlag + '</div><div class="stat-name">' + partnerName + '</div>' +
        '<div class="stat-number">…</div><div class="stat-label">' + t('voted') + '</div>' +
        '<div class="stat-bar-track"><div class="stat-bar-fill" style="width:0%"></div></div></div></div></div>';

    // My favorites
    html += '<div class="results-section"><div class="results-section-title">' + t('myFavs') + '</div>';
    if (myLikes.length > 0) {
        const sortedLikes = hasH2H ? [...myLikes].sort((a,b) => (h2hElo[b]||1000) - (h2hElo[a]||1000)) : myLikes.sort();
        html += '<div class="results-card">';
        sortedLikes.forEach(name => {
            html += '<div class="fav-item"><span class="fav-icon">♥</span><span class="fav-name">' + name + '</span></div>';
        });
        html += '</div>';
    } else {
        html += '<div class="results-card"><div class="empty-message">' + t('noFavs') + '</div></div>';
    }
    html += '</div>';

    // Partner placeholder
    html += '<div class="results-section" id="results-partner-section">' +
        '<div class="results-section-title">' + t('partnerFavs') + '</div>' +
        '<div class="results-card"><div class="empty-message"><div class="loading-spinner" style="margin:0 auto 0.5rem"></div></div></div></div>';

    body.innerHTML = html;

    // Fetch partner data from server (background)
    try {
        const data = await fetchResults();
        const partner = data[partnerUser];
        matchCount = data.matches.length;

        // Update matches
        const matchSection = document.getElementById('results-matches-section');
        if (matchSection) {
            let mhtml = '<div class="results-section-title">' + t('matchesSection') + '</div>';
            if (data.matches.length > 0) {
                let matchList = data.matches;
                if (hasH2H && h2hTotalMatchups > 0) {
                    matchList = [...matchList].sort((a,b) => (h2hElo[b]||1000) - (h2hElo[a]||1000));
                }
                mhtml += '<div class="results-card">';
                matchList.forEach((name, i) => {
                    mhtml += '<div class="match-item"><span class="match-heart">💕</span>' +
                        '<span class="match-name">' + name + '</span>' +
                        '<span class="match-rank">#' + (i+1) + '</span></div>';
                });
                mhtml += '</div>';
                spawnHearts(8);
            } else {
                mhtml += '<div class="results-card"><div class="empty-message"><span class="empty-icon">🤞</span>' + t('noMatches') + '</div></div>';
            }
            matchSection.innerHTML = mhtml;
        }

        // Update partner stat
        const partnerStat = document.getElementById('partner-stat');
        if (partnerStat) {
            partnerStat.innerHTML = '<div class="stat-flag">' + partnerFlag + '</div><div class="stat-name">' + partnerName + '</div>' +
                '<div class="stat-number">' + partner.voted + '</div><div class="stat-label">' + t('voted') + '</div>' +
                '<div class="stat-bar-track"><div class="stat-bar-fill" style="width:' + ((partner.voted/total)*100) + '%"></div></div>';
        }

        // Update partner favorites
        const partnerSection = document.getElementById('results-partner-section');
        if (partnerSection) {
            let phtml = '<div class="results-section-title">' + t('partnerFavs') + '</div>';
            if (partner.favorites.length > 0) {
                phtml += '<div class="results-card">';
                partner.favorites.forEach(name => {
                    phtml += '<div class="fav-item"><span class="fav-icon">♥</span><span class="fav-name">' + name + '</span></div>';
                });
                phtml += '</div>';
            } else {
                phtml += '<div class="results-card"><div class="empty-message"><span class="empty-icon">⏳</span>' + t('waitingPartner') + '</div></div>';
            }
            partnerSection.innerHTML = phtml;
        }
    } catch {
        const matchSection = document.getElementById('results-matches-section');
        if (matchSection) {
            matchSection.innerHTML = '<div class="results-section-title">' + t('matchesSection') + '</div>' +
                '<div class="results-card"><div class="empty-message">😴 ' + t('dbSleeping') + '</div></div>';
        }
    }
}

// ── Event listeners ──
document.querySelector('.results-peek')?.addEventListener('click', e => { e.preventDefault(); showResults(); });
document.querySelectorAll('[onclick="showView(\'results\')"]').forEach(el => {
    el.removeAttribute('onclick');
    el.addEventListener('click', () => showResults());
});

// ── Touch Swipe ──
(function initSwipe() {
    const card = document.getElementById('name-card');
    let startX = 0, dx = 0, isDragging = false;
    const TH = 80;

    card.addEventListener('touchstart', e => {
        if (e.touches.length > 1) return;
        startX = e.touches[0].clientX; isDragging = true;
        card.classList.add('dragging'); card.classList.remove('entering');
    }, { passive: true });

    card.addEventListener('touchmove', e => {
        if (!isDragging) return;
        dx = e.touches[0].clientX - startX;
        card.style.transform = `translateX(${dx}px) rotate(${dx*0.08}deg)`;
        const li = card.querySelector('.like-indicator'), ni = card.querySelector('.nope-indicator');
        if (dx > 30) { li.style.opacity = Math.min(1,(dx-30)/60); ni.style.opacity='0'; }
        else if (dx < -30) { ni.style.opacity = Math.min(1,(-dx-30)/60); li.style.opacity='0'; }
        else { li.style.opacity='0'; ni.style.opacity='0'; }
    }, { passive: true });

    card.addEventListener('touchend', () => {
        if (!isDragging) return; isDragging = false; card.classList.remove('dragging');
        if (dx > TH) castVote(true);
        else if (dx < -TH) castVote(false);
        else { card.style.transform=''; card.style.opacity=''; card.querySelector('.like-indicator').style.opacity='0'; card.querySelector('.nope-indicator').style.opacity='0'; }
        dx = 0;
    });

    card.addEventListener('mousedown', e => {
        startX = e.clientX; isDragging = true;
        card.classList.add('dragging'); card.classList.remove('entering'); e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return; dx = e.clientX - startX;
        card.style.transform = `translateX(${dx}px) rotate(${dx*0.08}deg)`;
        const li = card.querySelector('.like-indicator'), ni = card.querySelector('.nope-indicator');
        if (dx > 30) { li.style.opacity = Math.min(1,(dx-30)/60); ni.style.opacity='0'; }
        else if (dx < -30) { ni.style.opacity = Math.min(1,(-dx-30)/60); li.style.opacity='0'; }
        else { li.style.opacity='0'; ni.style.opacity='0'; }
    });
    document.addEventListener('mouseup', () => {
        if (!isDragging) return; isDragging = false; card.classList.remove('dragging');
        if (dx > TH) castVote(true);
        else if (dx < -TH) castVote(false);
        else { card.style.transform=''; card.querySelector('.like-indicator').style.opacity='0'; card.querySelector('.nope-indicator').style.opacity='0'; }
        dx = 0;
    });
})();

// ── Keyboard ──
document.addEventListener('keydown', e => {
    const active = document.querySelector('.view.active');
    if (!active) return;
    if (active.id === 'view-swipe') {
        if (e.key==='ArrowRight'||e.key==='l') castVote(true);
        else if (e.key==='ArrowLeft'||e.key==='h') castVote(false);
        else if (e.key==='z'&&(e.ctrlKey||e.metaKey)) undoVote();
    } else if (active.id === 'view-h2h') {
        if (e.key==='ArrowLeft'||e.key==='1') h2hPick('left');
        else if (e.key==='ArrowRight'||e.key==='2') h2hPick('right');
    }
});

// Flush pending on page unload
window.addEventListener('beforeunload', () => {
    if (syncQueue.length > 0 && currentUser) {
        const blob = new Blob([JSON.stringify({user:currentUser, name:syncQueue[0].name, vote:syncQueue[0].vote})], {type:'application/json'});
        navigator.sendBeacon('/api/babynavn-vote', blob);
    }
});
