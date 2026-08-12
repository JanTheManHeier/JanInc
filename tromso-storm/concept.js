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
    const opponent = isHome(game) ? game.away : game.home;
    return `
        <article class="game-row" data-location="${location.toLowerCase()}">
            <time datetime="${game.date}T${game.time}">
                ${dayNames[date.getDay()]} ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")} ${game.time}
                <small>${game.tag || game.trip || location}</small>
            </time>
            <div class="teams"><strong>Tromsø Storm</strong> – ${opponent}</div>
            <div class="game-place">${game.venue}<span class="game-type">${location}</span></div>
            <button class="calendar-button" type="button" data-date="${game.date}">+ Kalender</button>
        </article>`;
}

function renderSchedule(games, filter = "all") {
    const filtered = games.filter((game) => filter === "all" || (filter === "home" ? isHome(game) : !isHome(game)));
    const groups = new Map();
    filtered.forEach((game) => {
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
}

function updateNextGame(game) {
    const date = localDate(game);
    document.getElementById("next-weekday").textContent = dayNames[date.getDay()];
    document.getElementById("next-date").textContent = `${date.getDate()}. ${monthNames[date.getMonth()].toUpperCase()}`;
    document.getElementById("next-time").textContent = game.time;
    document.getElementById("next-time").dateTime = `${game.date}T${game.time}`;
    document.getElementById("next-home").textContent = game.home;
    document.getElementById("next-away").textContent = game.away;
    document.getElementById("next-venue").textContent = game.venue;
    const days = Math.max(0, Math.ceil((date - new Date()) / 86400000));
    document.getElementById("countdown").textContent = days === 0 ? "Kampdag" : `${days} dager igjen`;
    document.getElementById("next-calendar").onclick = () => downloadCalendar(game);
}

fetch("data/kamper.json")
    .then((response) => {
        if (!response.ok) throw new Error("Terminlisten kunne ikke lastes");
        return response.json();
    })
    .then((games) => {
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
            renderSchedule(games, button.dataset.filter);
        });

        document.getElementById("schedule-list").addEventListener("click", (event) => {
            const button = event.target.closest(".calendar-button");
            if (!button) return;
            const game = games.find((item) => item.date === button.dataset.date);
            if (game) downloadCalendar(game);
        });
    })
    .catch((error) => {
        document.getElementById("schedule-list").innerHTML = `<p>${error.message}. Se eksisterende kampoversikt på tromsostorm.no.</p>`;
    });
