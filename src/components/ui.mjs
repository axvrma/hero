import { escape as e, safeUrl } from "../../scripts/lib/content.mjs";

export function external(url, label, cls = "text-link", context = "") {
  const href = safeUrl(url);
  return href ? `<a class="${cls}" href="${e(href)}" target="_blank" rel="noopener noreferrer"${context ? ` aria-label="${e(label)}: ${e(context)}"` : ""}>${e(label)}</a>` : "";
}

export function sceneTitle(index, label, html) {
  return `<div class="scene-heading" data-reveal><p class="eyebrow"><span class="index" aria-hidden="true">${index}</span>${label ? ` ${e(label)}` : ""}</p><h2>${html}</h2></div>`;
}

export function pageIntro(label, html, description) {
  return `<div class="page-heading"><p class="eyebrow">${e(label)}</p><h1>${html}</h1>${description ? `<p>${e(description)}</p>` : ""}</div>`;
}

export const backgroundMotionControl = `<button class="background-motion-toggle" type="button" data-background-motion-toggle aria-pressed="false" title="Pause background motion" hidden>
  <svg viewBox="0 0 18 18" width="15" height="15" aria-hidden="true"><path class="pause-icon" d="M6 4v10m6-10v10" fill="none" stroke="currentColor" stroke-width="1.5"/><path class="play-icon" d="m6 4 7 5-7 5z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
  <span class="background-motion-label">Pause background motion</span>
</button>`;
