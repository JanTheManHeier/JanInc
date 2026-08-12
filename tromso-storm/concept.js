const params = new URLSearchParams(window.location.search);
const allowedStyles = ["arena", "pulse", "heritage"];
const style = allowedStyles.includes(params.get("style")) ? params.get("style") : "arena";
const names = { arena: "Arena", pulse: "Pulse", heritage: "Arven" };

document.body.dataset.concept = style;
document.getElementById("concept-name").textContent = names[style];
document.title = `${names[style]} | Tromsø Storm`;

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");

menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
});

navigation.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
});
