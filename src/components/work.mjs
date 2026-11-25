import { motivations, labExperiments } from "../../content/editorial.mjs";
import { enterpriseCases } from "../../content/enterprise.mjs";
import { hackathonProjects } from "../../content/hackathons.mjs";
import { cleanLegacy, escape as e } from "../../scripts/lib/content.mjs";
import { demo } from "./demos.mjs";
import { caseMetrics, featuredCases } from "./homepage.mjs";
import { ambientBackground, diagram } from "./illustrations.mjs";
import { photography } from "./photography.mjs";
import { backgroundMotionControl, external, pageIntro, sceneTitle } from "./ui.mjs";
import { productVisual } from "./visuals.mjs";

const enterpriseArt = {
  ...Object.fromEntries(featuredCases.map(({ id, art }) => [id, art])),
  "micro-frontend-communication": "modules",
  "configuration-driven-ui": "config",
  "life-calculator": "calculator",
};

const technicalFields = [
  ["context", "Context"], ["team", "Team"], ["constraints", "Constraints"],
  ["approach", "Approach"], ["decisions", "Decisions"], ["tradeoffs", "Trade-offs"], ["lesson", "What I learned"],
];

function enterpriseEntry(item, content) {
  const { id, organization, title, problem, role, outcome, example } = item;
  return `<article class="work-entry enterprise-entry" id="${id}" tabindex="-1">
    <div class="work-entry-lead"><div><p class="eyebrow">${e(organization)}</p><h3>${e(title)}</h3></div>
      <dl class="case-outline"><div><dt>Problem</dt><dd>${e(problem)}</dd></div><div><dt>My contribution</dt><dd>${e(role)}</dd></div><div><dt>Outcome</dt><dd>${e(outcome)}</dd></div></dl>
    </div>${caseMetrics(content.metrics, id)}
    <details class="disclosure" id="details-${id}"><summary>Engineering details</summary>
      ${diagram(enterpriseArt[id])}
      <dl class="case-outline detail-outline">${technicalFields.map(([key, label]) => `<div><dt>${label}</dt><dd>${e(item[key])}</dd></div>`).join("")}</dl>
      <a class="text-link" href="/#principles">Engineering principles</a>
    </details>
    ${example ? demo(example) : ""}
  </article>`;
}

function productEntry(product) {
  const { id, name, category, description, live, liveLabel, source, sections, features, architecture, stack, limitations, evidence, legacy } = product;
  const motivation = motivations[id];
  const aliases = legacy.filter((alias) => alias !== id).map((alias) => `<span id="${e(alias)}"></span>`).join("");
  return `<article class="work-entry product-entry" id="${id}" tabindex="-1">
    ${aliases}
    <div class="work-entry-lead"><div class="product-copy" data-reveal><p class="eyebrow">${e(category)}</p>
      <h3>${e(name)}</h3><p>${e(description)}</p>
      <div class="actions">${external(live, liveLabel || "Live demo", "text-link", name)}${external(source, "Source code", "text-link", name)}</div>
    </div></div>
    <details class="disclosure" id="details-${id}"><summary>Case study and technical details</summary>
      <div class="technical-copy">${productVisual(product)}<p>${e(motivation.story)}</p><p>${e(motivation.signal)}</p>
        ${motivation.comparison ? `<dl class="case-outline"><div><dt>Before</dt><dd>${e(motivation.comparison.before)}</dd></div><div><dt>With ${e(name)}</dt><dd>${e(motivation.comparison.after)}</dd></div></dl>` : ""}
        ${sections.map(({ title, body }) => `<section><h4>${e(title)}</h4><p>${e(body)}</p></section>`).join("")}
        <section><h4>Architecture</h4><ol class="architecture-flow">${architecture.map((step) => `<li>${e(step)}</li>`).join("")}</ol><p>${stack.map(e).join(" · ")}</p></section>
        <section><h4>Capabilities</h4><ul>${features.map((feature) => `<li>${e(feature)}</li>`).join("")}</ul></section>
        <section><h4>Scope and evidence</h4><p>${e(limitations)}</p><div class="actions">${evidence.map((url, index) => external(url, evidence.length > 1 ? `Repository evidence ${index + 1}` : "Repository evidence")).join("")}</div></section>
      </div>
    </details>
  </article>`;
}

function hackathonEntry(project, archived) {
  const { id, name, description, result, event, buildTime, story, live, source, preview } = project;
  return `<article class="work-entry hackathon-entry" id="${id}" tabindex="-1"><div class="work-entry-lead">
    <div><p class="eyebrow">${e(event || "Hackathon project")}</p><p class="result">${e(result)}</p><h4>${e(name)}</h4>
      ${buildTime ? `<p class="eyebrow">${e(buildTime)}</p>` : ""}<p>${e(description)}</p><p>${e(story)}</p>
      <div class="actions">${external(live, "Live demo", "button button-primary", name)}${external(source, "Source code", "text-link", name)}${archived ? `<a class="text-link" href="#archive-${id}">Original project notes</a>` : ""}</div>
    </div>
    <figure class="product-visual" data-reveal><img src="${e(preview.src)}" alt="${e(preview.alt)}" width="${preview.width}" height="${preview.height}" loading="lazy" decoding="async"><figcaption>${e(preview.caption)}</figcaption></figure>
  </div></article>`;
}

function archiveEntry(project, hackathonIds) {
  const { id, name, description, source, live, body } = project;
  return `<article class="archive-entry" id="${hackathonIds.has(id) ? `archive-${id}` : id}" tabindex="-1">
    <details class="disclosure"><summary><strong>${e(name)}</strong><span>${e(description)}</span></summary>
      <div class="archive-prose">${cleanLegacy(body || "<p>Explore the project source for implementation details.</p>", { nested: true })}</div>
      <div class="actions">${external(source, "Source code", "text-link", name)}${external(live, "Live demo", "text-link", name)}</div>
    </details>
  </article>`;
}

export function work(content, products, secondary) {
  const priority = featuredCases.map(({ id }) => enterpriseCases.find((item) => item.id === id));
  const ordered = [...priority, ...enterpriseCases.filter((item) => !priority.includes(item))];
  const productOrder = ["atlas", "prism", "envision", "vibes", "servio", "luminescent", "auditbench"];
  const hackathonIds = new Set(hackathonProjects.map(({ id }) => id));
  return `<div class="page-top work-top"><div class="shell">
      ${pageIntro("Work", "A collection of problems worth solving.", "")}
      <nav class="section-nav" aria-label="Work sections"><a href="#enterprise">Enterprise</a><a href="#products">Independent products</a><a href="#experiments">Experiments and hackathons</a></nav>
      ${backgroundMotionControl}
    </div></div>
    <div class="work-body">
      <section class="scene ambient-section" id="enterprise">${ambientBackground("enterprise")}<div class="shell">
        ${sceneTitle("01", "", "Enterprise systems")}
        ${ordered.map((item) => enterpriseEntry(item, content)).join("")}
      </div></section>
      <section class="scene ambient-section" id="products">${ambientBackground("products")}<div class="shell">
        ${sceneTitle("02", "", "Independent products")}
        ${productOrder.map((id) => productEntry(products.find((product) => product.id === id))).join("")}
      </div></section>
      <section class="scene shell" id="experiments">${sceneTitle("03", "", "Experiments and hackathons")}
        ${labExperiments.map(({ id, title, headline, body }) => `<article class="experiment" id="${id}" tabindex="-1"><p class="eyebrow">Independent simulation</p><h3>${e(title)}</h3><p><strong>${e(headline)}</strong></p><p>${e(body)}</p></article>`).join("")}
        <section class="work-subsection" id="hackathons"><h3>Hackathons</h3>${hackathonProjects.map((project) => hackathonEntry(project, secondary.some(({ id }) => id === project.id))).join("")}
          <p class="hackathon-note">First place at Major League Hacking, 2020.</p>
          ${photography(content.assets, "paytm-hackathon-photo", { expandable: true })}
        </section>
        <section class="work-subsection" id="archive"><h3>Project archive</h3>
          ${secondary.map((project) => archiveEntry(project, hackathonIds)).join("")}
        </section>
      </section>
    </div>`;
}
