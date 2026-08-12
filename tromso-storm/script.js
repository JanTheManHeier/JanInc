const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const themeButton = document.querySelector(".theme-toggle");

function closeMenu() {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
});

navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        closeMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
        closeMenu();
    }
});

themeButton.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = current === "dark" ? "light" : "dark";
});

document.getElementById("year").textContent = new Date().getFullYear();
