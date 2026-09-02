const params = new URLSearchParams(window.location.search);
const allowedStyles = ["arena", "pulse", "heritage"];
const style = allowedStyles.includes(params.get("style")) ? params.get("style") : "arena";
const names = { arena: "Arena", pulse: "Pulse", heritage: "Arven" };
const monthNames = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
const dayNames = ["SØN", "MAN", "TIR", "ONS", "TOR", "FRE", "LØR"];

document.body.dataset.concept = style;
document.getElementById("concept-name").textContent = names[style];
document.title = `${names[style]} | Tromsø Storm`;

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");

function closeMenu() {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    navigation.setAttribute("aria-hidden", window.innerWidth <= 980 ? "true" : "false");
}

menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.setAttribute("aria-hidden", String(!open));
    if (open) navigation.querySelector("a").focus();
});

navigation.addEventListener("click", closeMenu);
window.addEventListener("resize", closeMenu);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
    }
});
closeMenu();

function localDate(game) {
    return new Date(`${game.date}T${game.time}:00`);
}

function isHome(game) {
    return game.home === "Tromsø Storm";
}

function escapeHtml(value) {
    const element = document.createElement("span");
    element.textContent = value;
    return element.innerHTML;
}

function mapUrl(venue) {
    const query = venue === "Rødtindhallen"
        ? "Rødtindhallen, Øvre Storvollen 77, 9104 Kvaløya"
        : venue;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function externalLink(url, label) {
    return url
        ? `<a href="${url}" rel="noopener noreferrer" target="_blank">${escapeHtml(label)}</a>`
        : escapeHtml(label);
}

function escapeIcs(value) {
    return value.replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
}

function downloadCalendar(game) {
    const start = localDate(game);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const format = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const title = `${game.home} – ${game.away}`;
    const content = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Tromsø Storm//Terminliste//NO",
        "BEGIN:VEVENT",
        `UID:${game.date}-${game.time.replace(":", "")}@tromsostorm.no`,
        `DTSTAMP:${format(new Date())}`,
        `DTSTART:${format(start)}`,
        `DTEND:${format(end)}`,
        `SUMMARY:${escapeIcs(title)}`,
        `LOCATION:${escapeIcs(game.venue)}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    link.download = `tromso-storm-${game.date}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
}

function gameRow(game) {
    const date = localDate(game);
    const location = isHome(game) ? "Hjemme" : "Borte";
    const teamName = (name) => {
        const escapedName = escapeHtml(name);
        return name === "Tromsø Storm" ? `<strong>${escapedName}</strong>` : escapedName;
    };
    const note = game.tag || game.trip;
    return `
        <article class="game-row" data-location="${location.toLowerCase()}">
            <time datetime="${game.date}T${game.time}">
                ${dayNames[date.getDay()]} ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")} ${game.time}
                ${note ? `<small>${note}</small>` : ""}
            </time>
            <a class="teams" href="${game.url || "https://tromsostorm.no/kampoversikt/"}">${teamName(game.home)} – ${teamName(game.away)}</a>
            <a class="game-place" href="${mapUrl(game.venue)}" rel="noopener noreferrer" target="_blank">${escapeHtml(game.venue)}<span class="game-type">${location}</span></a>
            <button class="calendar-button" type="button" data-date="${game.date}">+ Kalender</button>
        </article>`;
}

let currentFilter = "all";
let scheduleExpanded = false;

function renderSchedule(games) {
    const filter = currentFilter;
    const filtered = games.filter((game) => filter === "all" || (filter === "home" ? isHome(game) : !isHome(game)));
    const visible = scheduleExpanded ? filtered : filtered.slice(0, 5);
    const groups = new Map();
    visible.forEach((game) => {
        const date = localDate(game);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!groups.has(key)) groups.set(key, { title: `${monthNames[date.getMonth()]} ${date.getFullYear()}`, games: [] });
        groups.get(key).games.push(game);
    });
    const html = [];
    groups.forEach((group, key) => {
        html.push(`<section class="month-group"><h3>${group.title}</h3>${group.games.map(gameRow).join("")}</section>`);
        if (key === "2026-11" && filter === "all") {
            html.push('<div class="season-break">Sesongpause · 20. desember–8. januar</div>');
        }
    });
    document.getElementById("schedule-list").innerHTML = html.join("");
    const toggle = document.getElementById("schedule-toggle");
    toggle.hidden = filtered.length <= 5;
    toggle.textContent = scheduleExpanded ? "Vis bare de fem neste ↑" : `Vis alle ${filtered.length} kamper →`;
    toggle.setAttribute("aria-expanded", String(scheduleExpanded));
}

function updateNextGame(game) {
    const date = localDate(game);
    document.getElementById("next-weekday").textContent = dayNames[date.getDay()];
    document.getElementById("next-date").textContent = `${date.getDate()}. ${monthNames[date.getMonth()].toUpperCase()}`;
    document.getElementById("next-time").textContent = game.time;
    document.getElementById("next-time").dateTime = `${game.date}T${game.time}`;
    document.getElementById("next-home").textContent = game.home;
    document.getElementById("next-away").textContent = game.away;
    const venueLink = document.getElementById("next-venue");
    venueLink.textContent = game.venue;
    venueLink.href = mapUrl(game.venue);
    const days = Math.max(0, Math.ceil((date - new Date()) / 86400000));
    document.getElementById("countdown").textContent = days === 0 ? "Kampdag" : `${days} dager igjen`;
    document.getElementById("next-calendar").onclick = () => downloadCalendar(game);
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
    .then((games) => {
        if (!games.length) {
            document.getElementById("next-game").hidden = true;
            document.getElementById("schedule-list").innerHTML = "<p>Ny terminliste er ikke publisert ennå.</p>";
            document.getElementById("schedule-toggle").hidden = true;
            return;
        }
        const now = new Date();
        const next = games.find((game) => localDate(game) >= now) || games[games.length - 1];
        updateNextGame(next);
        renderSchedule(games);

        document.querySelector(".filters").addEventListener("click", (event) => {
            const button = event.target.closest(".filter");
            if (!button) return;
            document.querySelectorAll(".filter").forEach((item) => {
                const active = item === button;
                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", String(active));
            });

fetch("/api/storm-standings")
            .then((response) => {
                if (!response.ok) throw new Error("Tabellen kunne ikke lastes");
                return response.json();
            })
            .then((standings) => {
                document.getElementById("standings-body").innerHTML = standings.map((row) => `
                    <tr class="${row.team === "Tromsø Storm" ? "highlight" : ""}">
                        <th scope="row">${row.team === "Tromsø Storm" ? escapeHtml(row.team) : externalLink(row.url, row.team)}</th>
                        <td>${row.played}</td>
                        <td>${row.wins}</td>
                        <td>${row.losses}</td>
                        <td>${row.points}</td>
                    </tr>
                `).join("");
            })
            .catch((error) => {
                document.getElementById("standings-body").innerHTML = `<tr><td colspan="5">${escapeHtml(error.message)}. <a href="https://kamper.basket.no/standings?seasonId=201069&tournamentId=449378">Se BasketLive</a>.</td></tr>`;
            });
            currentFilter = button.dataset.filter;
            scheduleExpanded = false;
            renderSchedule(games);
        });

        document.getElementById("schedule-list").addEventListener("click", (event) => {
            const button = event.target.closest(".calendar-button");
            if (!button) return;
            const game = games.find((item) => item.date === button.dataset.date);
            if (game) downloadCalendar(game);
        });

        document.getElementById("schedule-toggle").addEventListener("click", () => {
            scheduleExpanded = !scheduleExpanded;
            renderSchedule(games);
        });

        document.querySelector(".schedule-arrow.previous").addEventListener("click", () => {
            document.getElementById("schedule-list").scrollBy({ left: -350, behavior: "smooth" });
        });
        document.querySelector(".schedule-arrow.next").addEventListener("click", () => {
            document.getElementById("schedule-list").scrollBy({ left: 350, behavior: "smooth" });
        });
    })
    .catch((error) => {
        document.getElementById("schedule-list").innerHTML = `<p>${error.message}. Se eksisterende kampoversikt på tromsostorm.no.</p>`;
    });

document.getElementById("archive-search").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = document.getElementById("archive-query").value.trim();
    if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(`site:tromsostorm.no ${query}`)}`, "_blank", "noopener");
    }
});
