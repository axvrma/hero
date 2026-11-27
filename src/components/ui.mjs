import { escape as e, safeUrl } from "../../scripts/lib/content.mjs";

export function external(value, label, className = "text-link", context = "") {
  const href = safeUrl(value, ["https:", "mailto:"]);
  if (!href) return "";
  const accessible = context ? ` aria-label="${e(label)}: ${e(context)}"` : "";
  return `<a class="${className}" href="${e(href)}"${accessible}>${e(label)}</a>`;
}

export function heading(label, title, description = "", id = "") {
  return `<header class="section-heading" data-reveal>
    <p class="eyebrow">${e(label)}</p><h2${id ? ` id="${id}"` : ""}>${e(title)}</h2>
    ${description ? `<p class="section-note">${e(description)}</p>` : ""}
  </header>`;
}

export function pageIntro(label, title, description) {
  return `<header class="page-intro">
    <p class="eyebrow">${e(label)}</p><h1>${e(title)}</h1>
    ${description ? `<p>${e(description)}</p>` : ""}
  </header>`;
}

export function checkList(items) {
  return `<ul class="check-list">${items.map((item) => `<li>${e(item)}</li>`).join("")}</ul>`;
}

export function projectImage({ src, alt, width, height }) {
  return `<img src="${e(src)}" alt="${e(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">`;
}
