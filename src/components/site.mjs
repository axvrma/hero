import { escape as e } from "../../scripts/lib/content.mjs";
import { brandMark } from "./illustrations.mjs";
import { resumeHref } from "./homepage.mjs";

export { home } from "./homepage.mjs";
export { work } from "./work.mjs";
export { about } from "./about.mjs";
export { pageIntro } from "./ui.mjs";

export function header(path, profile) {
  const name = e(profile.name);
  const nav = [["Work", "/work"], ["About", "/about"], ["Résumé", resumeHref]];
  return `<a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header"><div class="shell header-inner">
      <a class="wordmark" href="/" aria-label="${name} home"${path === "/" ? ' aria-current="page"' : ""}>${brandMark()}<span>${name}</span></a>
      <nav aria-label="Main navigation">${nav.map(([label, href]) => `<a href="${href}"${path === href ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    </div></header>`;
}

export function footer(profile) {
  return `<footer class="site-footer"><div class="shell"><span>${brandMark(22)} © 2026 ${e(profile.name)}</span><a href="#top">Back to top</a></div></footer>`;
}
