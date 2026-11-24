import { escape as e, safeUrl } from "../../scripts/lib/content.mjs";
import { diagonal } from "./icons.mjs";

export function external(url, label, cls = "text-link", context = "") {
  const href = safeUrl(url);
  if (!href) return "";
  return `<a class="${cls}" href="${e(href)}" target="_blank" rel="noopener noreferrer"${context ? ` aria-label="${e(`${label}: ${context}`)}"` : ""}>${e(label)}${diagonal}</a>`;
}

export function pageIntro(kicker, title, description) {
  return `<header class="page-intro"><p class="eyebrow">${e(kicker)}</p><h1>${title}</h1>${description ? `<p class="intro-description">${e(description)}</p>` : ""}</header>`;
}

export function sectionIntro(label, title, description, id) {
  return `<div class="editorial-heading"><p class="eyebrow">${e(label)}</p><h2${id ? ` id="${id}"` : ""}>${e(title)}</h2>${description ? `<p class="editorial-heading-copy">${e(description)}</p>` : ""}</div>`;
}

export function breadcrumb(parent, href, current) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="${href}">${e(parent)}</a></li><li aria-current="page">${e(current)}</li></ol></nav>`;
}
