const monthNames = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
const dayNames = ["SØN", "MAN", "TIR", "ONS", "TOR", "FRE", "LØR"];
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const scheduleList = document.getElementById("schedule-list");
const scheduleToggle = document.getElementById("schedule-toggle");
let games = [];
let filter = "all";
let expanded = false;

function gameDate(game) {
    return new Date(`${game.date}T${game.time}:00`);
}

function isHome(game) {
    return game.home === "Tromsø Storm";
}

function closeMenu() {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
});
navigation.addEventListener("click", closeMenu);

function updateNextGame(game) {
    const date = gameDate(game);
    document.getElementById("next-day").textContent = dayNames[date.getDay()];
    document.getElementById("next-date").textContent = `${date.getDate()}. ${monthNames[date.getMonth()].toUpperCase()}`;
    document.getElementById("next-time").textContent = game.time;
    document.getElementById("next-time").dateTime = `${game.date}T${game.time}`;
    document.getElementById("next-home").textContent = game.home;
    document.getElementById("next-away").textContent = game.away;
    document.getElementById("opponent-letter").textContent = (isHome(game) ? game.away : game.home).charAt(0);
    document.getElementById("next-venue").textContent = game.venue;
    const days = Math.max(0, Math.ceil((date - new Date()) / 86400000));
    document.getElementById("countdown").textContent = days === 0 ? "Kampdag" : `${days} dager igjen`;
}

function renderSchedule() {
    const matching = games.filter((game) => filter === "all" || (filter === "home" ? isHome(game) : !isHome(game)));
    const visible = expanded ? matching : matching.slice(0, 6);
    scheduleList.innerHTML = visible.map((game) => {
        const date = gameDate(game);
        const home = isHome(game);
        const team = (name) => name === "Tromsø Storm" ? `<strong>${name}</strong>` : name;
        return `
            <article class="game-row ${home ? "home" : "away"}">
                <time datetime="${game.date}T${game.time}">${dayNames[date.getDay()]} ${date.getDate()}. ${monthNames[date.getMonth()]} · ${game.time}<small>${home ? "Hjemmekamp" : "Bortekamp"}</small></time>
                <a class="teams" href="https://tromsostorm.no/kampoversikt/">${team(game.home)} — ${team(game.away)}</a>
                <span class="venue">${game.venue}</span>
            </article>`;
    }).join("");
    scheduleToggle.hidden = matching.length <= 6;
    scheduleToggle.textContent = expanded ? "Vis de seks neste ↑" : `Vis alle ${matching.length} kamper →`;
    scheduleToggle.setAttribute("aria-expanded", String(expanded));
}

document.querySelector(".filters").addEventListener("click", (event) => {
    const button = event.target.closest(".filter");
    if (!button) return;
    document.querySelectorAll(".filter").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
    });
    filter = button.dataset.filter;
    expanded = false;
    renderSchedule();
});

scheduleToggle.addEventListener("click", () => {
    expanded = !expanded;
    renderSchedule();
});

fetch("data/kamper.json")
    .then((response) => {
        if (!response.ok) throw new Error("Terminlisten kunne ikke lastes");
        return response.json();
    })
    .then((data) => {
        games = data;
        const now = new Date();
        updateNextGame(games.find((game) => gameDate(game) >= now) || games[games.length - 1]);
        renderSchedule();
    })
    .catch((error) => {
        scheduleList.innerHTML = `<p>${error.message}. Se kampoversikten på tromsostorm.no.</p>`;
        scheduleToggle.hidden = true;
    });
