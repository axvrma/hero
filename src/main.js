import "./style.css";
const root = document.documentElement;
const themeButtons = document.querySelectorAll(".theme-toggle");
function updateThemeButtons() {
  for (const button of themeButtons)
    button.setAttribute(
      "aria-label",
      `Switch to ${root.dataset.theme === "light" ? "dark" : "light"} theme`,
    );
}
updateThemeButtons();
for (const button of themeButtons)
  button.addEventListener("click", () => {
    const theme = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* Theme still works when browser storage is unavailable. */
    }
    updateThemeButtons();
  });
matchMedia("(prefers-color-scheme: light)").addEventListener(
  "change",
  (event) => {
    let saved;
    try {
      saved = localStorage.getItem("theme");
    } catch {}
    if (saved !== "light" && saved !== "dark") {
      root.dataset.theme = event.matches ? "light" : "dark";
      updateThemeButtons();
    }
  },
);
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#mobile-menu");
function closeMenu(returnFocus = false) {
  if (!menu || !menuButton) return;
  menu.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  if (returnFocus) menuButton.focus();
}
menuButton?.addEventListener("click", () => {
  const opening = menu.hidden;
  menu.hidden = !opening;
  menuButton.setAttribute("aria-expanded", String(opening));
  menuButton.setAttribute(
    "aria-label",
    opening ? "Close navigation" : "Open navigation",
  );
  if (opening) menu.querySelector("a")?.focus();
});
menu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu && !menu.hidden) closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (menu && !menu.hidden && !event.target.closest(".site-header"))
    closeMenu();
});
matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
const search = document.querySelector("#project-search");
search?.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();
  const rows = document.querySelectorAll(".archive-list .archive-row");
  let count = 0;
  for (const row of rows) {
    row.hidden = !row.textContent.toLowerCase().includes(query);
    if (!row.hidden) count++;
  }
  document.querySelector("#search-count").textContent =
    `${count} project${count === 1 ? "" : "s"}`;
  document.querySelector(".search-empty").hidden = count !== 0;
});
document
  .querySelector(".print-resume")
  ?.addEventListener("click", () => window.print());
