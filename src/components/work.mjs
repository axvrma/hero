import { motivations } from "../../content/editorial.mjs";
import { featured } from "../../content/personal-folio.mjs";
import { cleanLegacy, escape as e } from "../../scripts/lib/content.mjs";
import { caseArt } from "./art.mjs";
import { demo } from "./demos.mjs";
import { caseMetrics } from "./homepage.mjs";
import { photography } from "./photography.mjs";
import { checkList, external, heading, pageIntro, projectImage } from "./ui.mjs";

const extras = [["context", "Context"], ["team", "Team"], ["constraints", "Constraints"], ["approach", "Approach"], ["decisions", "Decisions"], ["tradeoffs", "Trade-offs"], ["lesson", "What I learned"]];
const featuredById = new Map(featured.map((item) => [item.id, item]));
const outline = (fields) => `<dl class="case-outline">${fields.map(([label, body]) => `<div><dt>${e(label)}</dt><dd>${e(body)}</dd></div>`).join("")}</dl>`;

export function enterpriseEntry(item, content) {
  const lead = featuredById.get(item.id);
  const related = lead?.related ?? [];
  return `<article class="secondary-card enterprise-entry" id="${e(item.id)}" tabindex="-1">
    <p class="case-label">${e(item.organization)}</p><h3>${e(item.title)}</h3>
    ${lead ? `<p class="case-deck">${e(lead.title)}</p>` : ""}
    ${outline([["Problem", item.problem], ["My contribution", item.role], ["Team outcome", item.outcome]])}
    ${caseMetrics(content.metrics, item.id, ...related)}
    <details class="disclosure" id="details-${e(item.id)}"><summary>Engineering details</summary>
      ${outline(extras.map(([key, label]) => [label, item[key]]))}
      ${related.length ? `<div class="actions">${related.map((id) => `<a href="#${id}">${e(content.enterprise.find((entry) => entry.id === id).title)}</a>`).join("")}</div>` : ""}
    </details>
    ${item.example ? demo(item.example) : ""}
  </article>`;
}

const previews = {
  atlas: { src: "/images/atlas-workspace-720.webp", width: 720, height: 396, alt: "Atlas visual workflow editor" },
  vibes: { src: "/images/vibes-ocean.webp", width: 560, height: 1000, alt: "Ocean scene in the Vibes media player" },
  envision: { src: "/images/envision-720.webp", width: 720, height: 405, alt: "Envision spatial computing studio" },
  servio: { src: "/images/servio-720.webp", width: 720, height: 405, alt: "Servio’s local development workspace" },
  auditbench: { src: "/images/auditbench-workspace.webp", width: 1440, height: 810, alt: "Auditbench Lighthouse performance reports" },
};

function productEntry(item) {
  const { id, name, category, description, live, liveLabel, source, sections, architecture, features, stack, limitations, evidence } = item;
  const aliases = item.legacy.filter((alias) => alias !== id).map((alias) => `<span id="${e(alias)}"></span>`).join("");
  return `<article class="secondary-card product-entry" id="${e(id)}" tabindex="-1">${aliases}
    <p class="case-label">${e(category)}</p><h3>${e(name)}</h3><p>${e(description)}</p>
    <div class="actions">${external(live, liveLabel || "Live demo", "button button-outline", name)}${external(source, "Source code", "text-link", name)}</div>
    <details class="disclosure" id="details-${e(id)}"><summary>Case study and technical details</summary>
      ${previews[id] ? `<div class="secondary-media">${projectImage(previews[id])}</div>` : ""}
      <p>${e(motivations[id].story)}</p>
      ${sections.map(({ title, body }) => `<h4>${e(title)}</h4><p>${e(body)}</p>`).join("")}
      <h4>Architecture</h4><p>${architecture.map(e).join(" · ")}</p><p>${stack.map(e).join(" · ")}</p>
      <h4>Capabilities</h4>${checkList(features)}
      <h4>Scope and evidence</h4><p>${e(limitations)}</p>
      <div class="actions">${evidence.map((url, i) => external(url, "Repository evidence", "text-link", `${name} ${i + 1}`)).join("")}</div>
    </details>
  </article>`;
}

function hackathonEntry(project, archived) {
  const { id, name, description, result, event, story, live, source, preview } = project;
  return `<article class="secondary-card hackathon-entry" id="${e(id)}" tabindex="-1">
    <p class="case-label">${e(event || "Hackathon prototype")} · ${e(result)}</p><h4>${e(name)}</h4>
    <p>${e(description)}</p><p>${e(story)}</p>
    <div class="actions">${external(live, "Live demo", "button button-outline", name)}${external(source, "Source code", "text-link", name)}${archived ? `<a href="#archive-${e(id)}">Original project notes</a>` : ""}</div>
    <figure class="secondary-media">${projectImage(preview)}<figcaption>${e(preview.caption)}</figcaption></figure>
  </article>`;
}

function archiveEntry({ id, name, description, source, live, body }, hackathonIds) {
  const anchor = hackathonIds.has(id) ? `archive-${id}` : id;
  return `<article class="archive-entry" id="${e(anchor)}" tabindex="-1">
    <details class="disclosure"><summary>${e(name)}</summary>
      <p>${e(description)}</p>
      <div class="archive-prose">${cleanLegacy(body || "", { nested: true })}</div>
      <div class="actions">${external(source, "Source code", "text-link", name)}${external(live, "Live demo", "text-link", name)}</div>
    </details>
  </article>`;
}

export function work(content, products, secondary) {
  const prototype = featuredById.get("boxbay-ai");
  const hackathonIds = new Set(content.hackathons.map(({ id }) => id));
  return `<div class="secondary-page">
    ${pageIntro("Work", "Case Studies and Projects", "Enterprise systems, independent products and hackathon experiments.")}
    <nav class="secondary-nav" aria-label="Work sections">
      <a href="#enterprise">Enterprise</a><a href="#products">Independent products</a><a href="#experiments">Experiments</a>
    </nav>
    <section id="enterprise" class="secondary-section" aria-labelledby="enterprise-title">
      ${heading("Selected work", "Enterprise Systems", "", "enterprise-title")}
      ${content.enterprise.map((item) => enterpriseEntry(item, content)).join("")}
    </section>
    <section id="products" class="secondary-section" aria-labelledby="products-title">
      ${heading("Independent", "Products I’ve Built", "", "products-title")}
      ${products.map(productEntry).join("")}
    </section>
    <section id="experiments" class="secondary-section" aria-labelledby="experiments-title">
      ${heading("Experiments", "Prototypes and Hackathons", "", "experiments-title")}
      <article class="secondary-card" id="${prototype.id}" tabindex="-1">
        <p class="case-label">${e(prototype.category)}</p><h3>${e(prototype.organization)}</h3>
        <p class="case-deck">${e(prototype.title)}</p><p>${e(prototype.summary)}</p>
        ${outline([["My contribution", prototype.contribution], ["What the simulation measures", prototype.outcome]])}
        <div class="secondary-media">${caseArt(prototype.art, content)}</div>
      </article>
      <section id="hackathons" class="secondary-subsection" tabindex="-1"><h3>Hackathons</h3>
        <p>First place at Major League Hacking in 2020 for a real-time certificate generator.</p>
        ${content.hackathons.map((item) => hackathonEntry(item, secondary.some(({ id }) => id === item.id))).join("")}
        ${photography(content.assets, "paytm-hackathon-photo", { expandable: true })}
      </section>
      <section id="archive" class="secondary-subsection"><h3>Project archive</h3>${secondary.map((item) => archiveEntry(item, hackathonIds)).join("")}</section>
    </section>
  </div>`;
}
