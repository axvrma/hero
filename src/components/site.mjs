import { escape as e } from "../../scripts/lib/content.mjs";
import { external } from "./ui.mjs";

export { home } from "./homepage.mjs";
export { work } from "./work.mjs";
export { about } from "./about.mjs";
export { pageIntro } from "./ui.mjs";

const navigation = [["Home", "/#home"], ["Work", "/#work"], ["About", "/#about"], ["FAQ", "/#faq"]];
const mark = '<span class="nav-mark" aria-hidden="true">✦</span>';

function links(path) {
  return navigation.map(([label, href]) => `<a href="${href}"${path === "/" && label === "Home" ? ' aria-current="location"' : ""}>${label}</a>`).join("");
}

export function header(path, profile) {
  return `<a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <nav class="desktop-nav" aria-label="Main navigation" data-compare="nav">${links(path)}</nav>
      <div class="mobile-nav" data-compare="nav">
        <a class="nav-home" href="/#home" aria-label="${e(profile.name)} home">${mark}</a>
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
        <nav id="mobile-menu" aria-label="Main navigation" hidden>${links(path)}</nav>
      </div>
    </header>`;
}

export function footer(profile) {
  return `<footer class="site-footer" data-compare="footer">
    <div class="footer-stickers" aria-hidden="true">
      <span>⌘</span><span>🧩</span><span>&lt;/&gt;</span><span>💡</span><span>BUILD</span><span>🛰️</span><span>✦</span><span>💻</span>
    </div>
    <div class="footer-line">
      <p>Created by ${e(profile.name)} <span>·</span> <a href="https://personalfolio.framer.website">Personal Folio design credit</a></p>
      <div class="footer-links">
        ${external(profile.linkedin, "LinkedIn")}${external(profile.github, "GitHub")}${external(`mailto:${profile.email}`, "Email")}${external(profile.resume, "Résumé")}
        <button type="button" data-motion-toggle aria-pressed="false">Pause motion</button>
      </div>
    </div>
  </footer>`;
}
