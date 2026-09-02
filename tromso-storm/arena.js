const monthNames = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
const dayNames = ["SØN", "MAN", "TIR", "ONS", "TOR", "FRE", "LØR"];
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const scheduleList = document.getElementById("schedule-list");
const scheduleToggle = document.getElementById("schedule-toggle");
const rosterGrid = document.getElementById("roster-grid");
const coachingStaff = document.getElementById("coaching-staff");
const standingsBody = document.getElementById("standings-body");
let games = [];
let filter = "all";
let expanded = false;
const teamLogos = {
    "Tromsø Storm": "assets/storm-logo.png",
    "Ammerud": "assets/opponents/ammerud.jpg",
    "Bærum Basket": "assets/opponents/baerum.png",
    "Centrum Tigers": "assets/opponents/centrum.gif",
    "Frøya": "assets/opponents/froya.png",
    "Fyllingen Lions": "assets/opponents/fyllingen.webp",
    "Gimle": "assets/opponents/gimle.png",
    "Kongsberg Miners": "assets/opponents/kongsberg.png",
    "Nidaros Jets": "assets/opponents/nidaros.png",
    "TNT Towers": "assets/opponents/tnt.png"
};

function gameDate(game) {
    return new Date(`${game.date}T${game.time}:00`);
}

function isHome(game) {
    return game.home === "Tromsø Storm";
}

function teamLogo(name) {
    return teamLogos[name] || "";
}

function teamMarkup(name) {
    const logo = teamLogo(name);
    const image = logo ? `<img class="team-inline-logo" src="${logo}" alt="">` : "";
    const label = name === "Tromsø Storm" ? `<strong>${escapeHtml(name)}</strong>` : escapeHtml(name);
    return `<span class="team-inline">${image}${label}</span>`;
}

function escapeHtml(value) {
    const element = document.createElement("span");
    element.textContent = value;
    return element.innerHTML;
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
    document.getElementById("next-home-logo").src = teamLogo(game.home);
    document.getElementById("next-home-logo").alt = `${game.home} logo`;
    document.getElementById("next-away-logo").src = teamLogo(game.away);
    document.getElementById("next-away-logo").alt = `${game.away} logo`;
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
        return `
            <article class="game-row ${home ? "home" : "away"}">
                <time datetime="${game.date}T${game.time}">${dayNames[date.getDay()]} ${date.getDate()}. ${monthNames[date.getMonth()]} · ${game.time}<small>${home ? "Hjemmekamp" : "Bortekamp"}</small></time>
                <a class="teams" href="${game.url || "https://tromsostorm.no/kampoversikt/"}">${teamMarkup(game.home)}<span aria-hidden="true">—</span>${teamMarkup(game.away)}</a>
                <span class="venue">${escapeHtml(game.venue)}</span>
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

function createPlayerCard(player) {
    const card = document.createElement("article");
    card.className = "player-card";

    const photo = document.createElement("div");
    photo.className = "player-photo";
    const image = document.createElement("img");
    image.src = player.Bilde;
    image.alt = player.Navn;
    image.loading = "lazy";
    image.width = 600;
    image.height = 730;
    const number = document.createElement("span");
    number.className = "jersey-number";
    number.textContent = player.Drakt_nummer;
    photo.append(image, number);

    const info = document.createElement("div");
    info.className = "player-info";
    const meta = document.createElement("span");
    meta.className = "player-meta";
    meta.textContent = `${player.Posisjon} · ${player.Hoyde} cm · født ${player.Fodt}`;
    const name = document.createElement("h3");
    name.textContent = player.Navn;
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = "Om spilleren";
    const biography = document.createElement("p");
    biography.textContent = player.Diverse;
    details.append(summary, biography);
    info.append(meta, name, details);
    card.append(photo, info);
    return card;
}

function renderRoster(data) {
    rosterGrid.replaceChildren(...data.players.map(createPlayerCard));
    coachingStaff.replaceChildren();

    if (!data.coaches.length) return;
    const heading = document.createElement("h3");
    heading.textContent = "Støtteapparat";
    coachingStaff.append(heading);
    data.coaches.forEach((coach) => {
        const card = document.createElement("article");
        card.className = "coach-card";
        const image = document.createElement("img");
        image.src = coach.Bilde;
        image.alt = coach.Navn;
        image.loading = "lazy";
        const copy = document.createElement("div");
        const role = document.createElement("span");
        role.textContent = coach.Oppgave;
        const name = document.createElement("strong");
        name.textContent = coach.Navn;
        copy.append(role, name);
        card.append(image, copy);
        coachingStaff.append(card);
    });
}

async function loadGames() {
    try {
        const response = await fetch("/api/storm-matches");
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) return data;
        }
    } catch (error) {
        console.warn("Kunne ikke hente terminliste fra NIF", error);
    }

    const fallback = await fetch("data/kamper.json");
    if (!fallback.ok) throw new Error("Terminlisten kunne ikke lastes");
    return fallback.json();
}

loadGames()
    .then((data) => {
        games = data;
        if (!games.length) {
            document.getElementById("neste-kamp").hidden = true;
            scheduleList.innerHTML = "<p>Ny terminliste er ikke publisert ennå.</p>";
            scheduleToggle.hidden = true;
            return;
        }
        const now = new Date();
        updateNextGame(games.find((game) => gameDate(game) >= now) || games[games.length - 1]);
        renderSchedule();
    })
    .catch((error) => {
        scheduleList.innerHTML = `<p>${error.message}. Se kampoversikten på tromsostorm.no.</p>`;
        scheduleToggle.hidden = true;
    });

fetch("/api/storm-standings")
    .then((response) => {
        if (!response.ok) throw new Error("Tabellen kunne ikke lastes");
        return response.json();
    })
    .then((standings) => {
        standingsBody.innerHTML = standings.map((row) => `
            <tr class="${row.team === "Tromsø Storm" ? "highlight" : ""}">
                <td>${row.position}</td>
                <th scope="row">${escapeHtml(row.team)}</th>
                <td>${row.played}</td>
                <td>${row.wins}</td>
                <td>${row.losses}</td>
                <td>${row.difference}</td>
                <td><strong>${row.points}</strong></td>
            </tr>
        `).join("");
    })
    .catch((error) => {
        standingsBody.innerHTML = `<tr><td colspan="7">${escapeHtml(error.message)}. <a href="https://kamper.basket.no/standings?seasonId=201069&tournamentId=449378">Se BasketLive</a>.</td></tr>`;
    });

fetch("data/players.json")
    .then((response) => {
        if (!response.ok) throw new Error("Spillerstallen kunne ikke lastes");
        return response.json();
    })
    .then(renderRoster)
    .catch((error) => {
        rosterGrid.innerHTML = `<p>${error.message}. Se den oppdaterte spillerstallen på <a class="text-link" href="https://tromsostorm.no/spillere-trenere/">tromsostorm.no</a>.</p>`;
    });
