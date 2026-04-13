// ── Translations ──
const T = {
    margaux: {
        welcomeSub: "Trouvez le prénom parfait ensemble",
        loading: "Chargement des prénoms…",
        progressOf: "sur",
        doneTitle: "C'est fini !",
        doneSub: "Vous avez voté pour les 100 prénoms.",
        doneBtn: "Voir les résultats",
        resultsTitle: "Résultats",
        matchesSection: "💕 Prénoms en commun",
        myFavs: "Mes coups de cœur",
        partnerFavs: "Les coups de cœur de Peder",
        progressSection: "Progression",
        noMatches: "Pas encore de prénoms en commun. Continuez à voter !",
        noFavs: "Aucun coup de cœur pour le moment",
        voted: "votés",
        likes: "coups de cœur",
        back: "Retour",
        waitingPartner: "En attente que Peder vote…"
    },
    peder: {
        welcomeSub: "Finn det perfekte navnet sammen",
        loading: "Laster navn…",
        progressOf: "av",
        doneTitle: "Ferdig!",
        doneSub: "Du har stemt på alle 100 navnene.",
        doneBtn: "Se resultater",
        resultsTitle: "Resultater",
        matchesSection: "💕 Navn dere begge liker",
        myFavs: "Mine favoritter",
        partnerFavs: "Margaux sine favoritter",
        progressSection: "Fremgang",
        noMatches: "Ingen felles navn ennå. Fortsett å stemme!",
        noFavs: "Ingen favoritter ennå",
        voted: "stemt",
        likes: "favoritter",
        back: "Tilbake",
        waitingPartner: "Venter på at Margaux stemmer…"
    }
};

// ── State ──
let currentUser = null; // 'margaux' | 'peder'
let votes = {};         // { "Alice": true, "Emma": false, ... }
let nameQueue = [];     // names not yet voted on
let currentName = null;
let lastVote = null;    // for undo
let matchCount = 0;
let previousView = 'welcome';

// ── Helpers ──
function t(key) { return currentUser ? T[currentUser][key] : T.peder[key]; }

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

function goBack() {
    showView('welcome');
    currentUser = null;
}

function goBackFromResults() {
    // Go back to swipe if we have names left, otherwise welcome
    if (currentUser && nameQueue.length > 0) {
        showView('swipe');
    } else if (currentUser) {
        showView('done');
    } else {
        showView('welcome');
    }
}

// ── Floating hearts ──
function spawnHearts(count = 6) {
    const container = document.getElementById('hearts-container');
    const hearts = ['💕', '💖', '💗', '💝', '♥'];
    for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'floating-heart';
        el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        el.style.left = (30 + Math.random() * 40) + '%';
        el.style.bottom = '30%';
        el.style.animationDelay = (Math.random() * 0.3) + 's';
        container.appendChild(el);
        setTimeout(() => el.remove(), 2000);
    }
}

// ── API ──
async function apiGet(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
}

async function apiPost(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
}

async function loadVotes() {
    try {
        const data = await apiGet(`/api/babynavn-vote?user=${currentUser}`);
        votes = {};
        data.votes.forEach(v => { votes[v.name] = v.vote; });
    } catch (err) {
        console.warn('Could not load votes, starting fresh:', err);
        votes = {};
    }
}

async function sendVote(name, vote) {
    try {
        await apiPost('/api/babynavn-vote', { user: currentUser, name, vote });
    } catch (err) {
        console.error('Vote send failed:', err);
        // Queue for retry — store locally as fallback
        const key = `babynavn_pending_${currentUser}`;
        const pending = JSON.parse(localStorage.getItem(key) || '[]');
        pending.push({ name, vote, ts: Date.now() });
        localStorage.setItem(key, JSON.stringify(pending));
    }
}

async function flushPendingVotes() {
    const key = `babynavn_pending_${currentUser}`;
    const pending = JSON.parse(localStorage.getItem(key) || '[]');
    if (pending.length === 0) return;

    const remaining = [];
    for (const v of pending) {
        try {
            await apiPost('/api/babynavn-vote', { user: currentUser, name: v.name, vote: v.vote });
        } catch {
            remaining.push(v);
        }
    }
    localStorage.setItem(key, JSON.stringify(remaining));
}

async function fetchResults() {
    try {
        return await apiGet('/api/babynavn-results');
    } catch {
        return { matches: [], margaux: { voted: 0, likes: 0, favorites: [] }, peder: { voted: 0, likes: 0, favorites: [] } };
    }
}

// ── User Selection ──
async function selectUser(user) {
    currentUser = user;
    const loadingText = document.getElementById('loading-text');
    loadingText.textContent = t('loading');
    showView('loading');

    await loadVotes();
    await flushPendingVotes();

    // Build queue of unvoted names (shuffled)
    nameQueue = shuffle(BABY_NAMES.filter(n => !(n in votes)));

    if (nameQueue.length === 0) {
        showDone();
    } else {
        showSwipe();
    }
}

// ── Swipe View ──
function showSwipe() {
    updateProgress();
    showNextName();
    showView('swipe');
}

function showNextName() {
    const card = document.getElementById('name-card');
    const nameEl = document.getElementById('card-name');

    if (nameQueue.length === 0) {
        showDone();
        return;
    }

    currentName = nameQueue[0];
    nameEl.textContent = currentName;

    // Reset card state
    card.className = 'name-card entering';
    card.style.transform = '';
    card.style.opacity = '';
    card.querySelector('.like-indicator').style.opacity = '0';
    card.querySelector('.nope-indicator').style.opacity = '0';

    // Show undo button if there's a last vote
    document.getElementById('undo-btn').style.display = lastVote ? 'flex' : 'none';
}

function updateProgress() {
    const voted = Object.keys(votes).length;
    const total = BABY_NAMES.length;
    const pct = (voted / total) * 100;

    document.getElementById('progress-text').textContent = `${voted} ${t('progressOf')} ${total}`;
    document.getElementById('progress-fill').style.width = pct + '%';
}

async function updateMatchBadge() {
    try {
        const data = await fetchResults();
        matchCount = data.matches.length;
        const badge = document.getElementById('match-badge');
        if (matchCount > 0) {
            badge.textContent = matchCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    } catch { /* ignore */ }
}

// ── Voting ──
async function castVote(liked) {
    if (!currentName) return;

    const card = document.getElementById('name-card');
    card.classList.remove('entering', 'dragging');
    card.classList.add(liked ? 'exit-right' : 'exit-left');

    if (liked) spawnHearts(4);

    // Save vote
    votes[currentName] = liked;
    lastVote = { name: currentName, vote: liked };
    nameQueue.shift();

    sendVote(currentName, liked);
    updateProgress();

    // Check matches periodically
    const votedCount = Object.keys(votes).length;
    if (votedCount % 10 === 0 || votedCount === BABY_NAMES.length) {
        updateMatchBadge();
    }

    // Show next card after animation
    setTimeout(() => {
        if (nameQueue.length === 0) {
            showDone();
        } else {
            showNextName();
        }
    }, 350);
}

async function undoVote() {
    if (!lastVote) return;

    // Remove last vote
    delete votes[lastVote.name];
    nameQueue.unshift(lastVote.name);

    // Send a "delete" by re-voting — actually, let's just re-show the name
    // The undo is local; if they vote again it'll overwrite in the DB
    lastVote = null;
    updateProgress();
    showNextName();
}

// ── Done View ──
function showDone() {
    document.getElementById('done-title').textContent = t('doneTitle');
    document.getElementById('done-subtitle').textContent = t('doneSub');
    document.getElementById('done-results-btn').textContent = t('doneBtn');
    showView('done');
    updateMatchBadge();
}

// ── Results View ──
async function showResults() {
    document.getElementById('results-title').textContent = t('resultsTitle');
    showView('results');
    await refreshResults();
}

async function refreshResults() {
    const body = document.getElementById('results-body');
    body.innerHTML = '<div class="loading-content" style="padding:2rem;text-align:center"><div class="loading-spinner"></div></div>';

    const data = await fetchResults();
    const me = data[currentUser];
    const partner = currentUser === 'margaux' ? data.peder : data.margaux;
    const partnerName = currentUser === 'margaux' ? 'Peder' : 'Margaux';
    const partnerFlag = currentUser === 'margaux' ? '🇳🇴' : '🇫🇷';
    const myFlag = currentUser === 'margaux' ? '🇫🇷' : '🇳🇴';
    const myName = currentUser === 'margaux' ? 'Margaux' : 'Peder';
    const total = BABY_NAMES.length;

    matchCount = data.matches.length;

    let html = '';

    // Matches section
    html += `<div class="results-section">
        <div class="results-section-title">${t('matchesSection')}</div>`;
    if (data.matches.length > 0) {
        html += '<div class="results-card">';
        data.matches.forEach((name, i) => {
            html += `<div class="match-item">
                <span class="match-heart">💕</span>
                <span class="match-name">${name}</span>
                <span class="match-rank">#${i + 1}</span>
            </div>`;
        });
        html += '</div>';
    } else {
        html += `<div class="results-card"><div class="empty-message">
            <span class="empty-icon">🤞</span>${t('noMatches')}
        </div></div>`;
    }
    html += '</div>';

    // Progress section
    html += `<div class="results-section">
        <div class="results-section-title">${t('progressSection')}</div>
        <div class="progress-stats">
            <div class="stat-card">
                <div class="stat-flag">${myFlag}</div>
                <div class="stat-name">${myName}</div>
                <div class="stat-number">${me.voted}</div>
                <div class="stat-label">${t('voted')}</div>
                <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${(me.voted/total)*100}%"></div></div>
            </div>
            <div class="stat-card">
                <div class="stat-flag">${partnerFlag}</div>
                <div class="stat-name">${partnerName}</div>
                <div class="stat-number">${partner.voted}</div>
                <div class="stat-label">${t('voted')}</div>
                <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${(partner.voted/total)*100}%"></div></div>
            </div>
        </div>
    </div>`;

    // My favorites
    html += `<div class="results-section">
        <div class="results-section-title">${t('myFavs')}</div>`;
    if (me.favorites.length > 0) {
        html += '<div class="results-card">';
        me.favorites.forEach(name => {
            html += `<div class="fav-item"><span class="fav-icon">♥</span><span class="fav-name">${name}</span></div>`;
        });
        html += '</div>';
    } else {
        html += `<div class="results-card"><div class="empty-message">${t('noFavs')}</div></div>`;
    }
    html += '</div>';

    // Partner favorites
    html += `<div class="results-section">
        <div class="results-section-title">${t('partnerFavs')}</div>`;
    if (partner.favorites.length > 0) {
        html += '<div class="results-card">';
        partner.favorites.forEach(name => {
            html += `<div class="fav-item"><span class="fav-icon">♥</span><span class="fav-name">${name}</span></div>`;
        });
        html += '</div>';
    } else {
        html += `<div class="results-card"><div class="empty-message">
            <span class="empty-icon">⏳</span>${t('waitingPartner')}
        </div></div>`;
    }
    html += '</div>';

    body.innerHTML = html;

    // Animate match hearts if matches exist
    if (data.matches.length > 0) spawnHearts(8);
}

// Clicking results header goes to refreshResults
document.querySelector('.results-peek')?.addEventListener('click', (e) => {
    e.preventDefault();
    showResults();
});

// Override the onclick for results button in header
document.querySelectorAll('[onclick="showView(\'results\')"]').forEach(el => {
    el.removeAttribute('onclick');
    el.addEventListener('click', () => showResults());
});

// ── Touch Swipe ──
(function initSwipe() {
    const card = document.getElementById('name-card');
    let startX = 0, startY = 0, dx = 0, isDragging = false;
    const THRESHOLD = 80;

    card.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        card.classList.add('dragging');
        card.classList.remove('entering');
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;

        // Only horizontal
        if (Math.abs(dx) < Math.abs(dy) && Math.abs(dx) < 10) return;

        const rotate = dx * 0.08;
        const opacity = Math.max(0, 1 - Math.abs(dx) / 300);
        card.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;

        // Show indicators
        const likeInd = card.querySelector('.like-indicator');
        const nopeInd = card.querySelector('.nope-indicator');
        if (dx > 30) {
            likeInd.style.opacity = Math.min(1, (dx - 30) / 60);
            nopeInd.style.opacity = '0';
        } else if (dx < -30) {
            nopeInd.style.opacity = Math.min(1, (-dx - 30) / 60);
            likeInd.style.opacity = '0';
        } else {
            likeInd.style.opacity = '0';
            nopeInd.style.opacity = '0';
        }
    }, { passive: true });

    card.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');

        if (dx > THRESHOLD) {
            castVote(true);
        } else if (dx < -THRESHOLD) {
            castVote(false);
        } else {
            // Snap back
            card.style.transform = '';
            card.style.opacity = '';
            card.querySelector('.like-indicator').style.opacity = '0';
            card.querySelector('.nope-indicator').style.opacity = '0';
        }
        dx = 0;
    });

    // Mouse drag for desktop
    card.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        card.classList.add('dragging');
        card.classList.remove('entering');
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dx = e.clientX - startX;
        const rotate = dx * 0.08;
        card.style.transform = `translateX(${dx}px) rotate(${rotate}deg)`;

        const likeInd = card.querySelector('.like-indicator');
        const nopeInd = card.querySelector('.nope-indicator');
        if (dx > 30) {
            likeInd.style.opacity = Math.min(1, (dx - 30) / 60);
            nopeInd.style.opacity = '0';
        } else if (dx < -30) {
            nopeInd.style.opacity = Math.min(1, (-dx - 30) / 60);
            likeInd.style.opacity = '0';
        } else {
            likeInd.style.opacity = '0';
            nopeInd.style.opacity = '0';
        }
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');

        if (dx > THRESHOLD) {
            castVote(true);
        } else if (dx < -THRESHOLD) {
            castVote(false);
        } else {
            card.style.transform = '';
            card.querySelector('.like-indicator').style.opacity = '0';
            card.querySelector('.nope-indicator').style.opacity = '0';
        }
        dx = 0;
    });
})();

// ── Keyboard ──
document.addEventListener('keydown', (e) => {
    const active = document.querySelector('.view.active');
    if (!active || active.id !== 'view-swipe') return;

    if (e.key === 'ArrowRight' || e.key === 'l') castVote(true);
    else if (e.key === 'ArrowLeft' || e.key === 'h') castVote(false);
    else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) undoVote();
});
