import { career, motivations, narrative, principles } from "../../content/editorial.mjs";
import { enterpriseCases } from "../../content/enterprise.mjs";
import { escape as e } from "../../scripts/lib/content.mjs";
import { ambientBackground, assembly, diagram, opticalField } from "./illustrations.mjs";
import { invoiceComparison, metricList } from "./impact.mjs";
import { companyLogo, heroPortraitSizes, photography } from "./photography.mjs";
import { backgroundMotionControl, external, sceneTitle } from "./ui.mjs";
import { productVisual } from "./visuals.mjs";

export const resumeHref = "/about#resume";

function hero(content) {
  const { profile, currentJob, assets } = content;
  return `<section class="hero" aria-labelledby="hero-title" data-motion>
    <div class="hero-stage shell" data-pointer>
      <div class="hero-field">${opticalField()}</div>
      <div class="hero-copy">
        <p class="hero-name">${e(profile.name)}</p>
        <h1 id="hero-title">Complexity in.<br>Simplicity out.</h1>
        <p class="hero-description">${e(profile.role)} at ${e(currentJob.company)}.</p>
        <div class="actions"><a class="text-link" href="/work">Explore my work</a><a class="text-link" href="${resumeHref}">View résumé</a></div>
      </div>
      <div class="hero-visual">
        ${photography(assets, "professional-portrait", { priority: true, sizes: heroPortraitSizes })}
        <div class="hero-optic">${assembly("hero-optic", 3)}</div>
      </div>
      ${backgroundMotionControl}
    </div>
  </section>`;
}

export function brandMarquee({ assets, experience }) {
  const ids = ["dp-world", "airtel", "iris", "nurtr"];
  const employer = (id) => {
    const name = experience.find((job) => job.id === id).company;
    const logo = companyLogo(assets, id);
    return `<li>${logo}<strong${logo ? ' class="sr-only"' : ""}>${e(name)}</strong></li>`;
  };
  return `<section class="brands" aria-label="Employers" data-marquee data-motion>
    <div class="brands-inner shell">
      <p class="eyebrow">Employers</p>
      <div class="brands-window"><div class="brands-track">
        <ul>${ids.map((id) => employer(id)).join("")}</ul>
        <ul class="brands-copy" aria-hidden="true" inert>${ids.map(employer).join("")}</ul>
      </div></div>
      <button class="marquee-toggle" type="button" aria-pressed="false" aria-label="Pause employer marquee" data-marquee-toggle hidden><span aria-hidden="true">Ⅱ</span></button>
    </div>
  </section>`;
}

export const featuredCases = [
  { id: "intelligent-invoice-processing", art: "invoice", title: "From invoice to usable data.", copy: "Our team automated extraction and posting, cutting manual processing." },
  { id: "dynamic-shipment-workflows", art: "shipment", title: "The right task for the right role.", copy: "Shipment configuration guided who did what and when." },
  { id: "bridging-design-and-engineering", art: "globe", title: "Building for a global audience.", copy: "I helped Nurtr’s team evolve its product as it reached users worldwide." },
];

export function caseMetrics(metrics, id) {
  const matching = metrics.filter(({ project }) => project === id);
  const comparison = invoiceComparison(matching);
  return metricList(comparison ? matching.filter(({ id }) => id !== "invoice-processing-time") : matching) + comparison;
}

export function impact(content) {
  return `<section class="scene impact-scene ambient-section" id="impact">
    ${ambientBackground("enterprise")}<div class="shell">
    ${sceneTitle("01", "Enterprise work", "Good engineering changes outcomes.")}
    <div class="impact-run">${featuredCases.map(({ id, art, title, copy }) => {
      const item = enterpriseCases.find((entry) => entry.id === id);
      return `<article class="impact-story">
        <div class="impact-copy" data-reveal><p class="eyebrow">${e(item.organization)}</p><h3><a href="/work#${id}">${e(title)}</a></h3><p>${e(copy)}</p>
          ${caseMetrics(content.metrics, id)}
        </div>${diagram(art)}
      </article>`;
    }).join("")}</div>
    </div>
  </section>`;
}

const stages = [
  ["Design", ["urstylecoach"]],
  ["Products", ["nurtr", "iris"]],
  ["Enterprise systems", ["airtel", "dp-world"]],
  ["Continuing study", ["iit"]],
];

function journey({ experience, assets }) {
  return `<section class="scene journey-scene shell" id="journey">
    ${sceneTitle("03", "About", "Different chapters. The same curiosity.")}
    <div class="journey-body">
      <div><p>${e(narrative.headline)}</p><a class="text-link" href="/about#story">Read my story</a></div>
      <ol class="journey-stages">${stages.map(([title, ids]) => `<li>
        <h3>${title}</h3><dl>${ids.map((id) => {
          const chapter = career.find((item) => item.id === id);
          const job = experience.find((item) => item.id === chapter.job);
          return `<div>${job ? companyLogo(assets, id) : ""}<dt>${e(job?.company || chapter.place)}</dt><dd>${e(job?.duration || chapter.period)}</dd></div>`;
        }).join("")}</dl>
      </li>`).join("")}</ol>
    </div>
  </section>`;
}

function selectedWork(products) {
  const [atlas, ...more] = ["atlas", "prism", "envision", "vibes"].map((id) => products.find((item) => item.id === id));
  return `<section class="scene selected-scene ambient-section" id="work">
    ${ambientBackground("products")}<div class="shell">
    ${sceneTitle("02", "Independent projects", "Questions worth building.")}
    <span id="products"></span>
    <article class="selected-feature">
      ${productVisual(atlas)}
      <div><p class="eyebrow">${e(atlas.category)}</p>
        <h3><a href="/work#atlas" aria-label="Explore Atlas">Atlas</a></h3>
        <p>${e(motivations.atlas.headline)}</p>
      </div>
    </article>
    <ul class="selected-list">${more.map(({ id, name, category }) => `<li><a href="/work#${id}">
      <strong>${e(name)}</strong><span>${e(category)}</span><span aria-hidden="true">↗</span></a></li>`).join("")}</ul>
    <div class="actions" id="hackathons"><a class="text-link" href="/work#products">All products</a><a class="text-link" href="/work#hackathons">Hackathons</a></div>
    </div>
  </section>`;
}

function principlesScene() {
  return `<section class="principles-scene shell" id="principles">
    <span id="engineering"></span>
    <details class="disclosure principles-disclosure"><summary><h2>How I work</h2></summary><ol>${principles.map(({ id, title, quote, caseId }, i) => `<li class="principle">
      <div class="principle-copy" data-reveal><span class="index">${String(i + 1).padStart(2, "0")}</span>
        <h3>${e(title)}</h3><p>${e(quote)}</p><a class="text-link" href="/work#${e(caseId)}">See it in practice</a>
      </div>
      ${id === "execution" ? `<figure class="assembly-figure" data-motion data-assembly>${assembly("execution-optic")}
        <button class="button button-outline assembly-toggle" type="button" aria-pressed="false" hidden>Assemble the layers</button>
        <figcaption class="sr-only">Five aligned optical plates separate for inspection and reassemble on a common axis.</figcaption>
      </figure>` : diagram(id)}
    </li>`).join("")}</ol></details>
  </section>`;
}

function recognition(content) {
  const photos = [
    ["google-assistant-2018", "Google Assistant developer recognition", "2018"],
    ["dp-world-kudos-2023", "DP World Kudos Award", "2023"],
    ["iit-guwahati-certificate", "IIT Guwahati AI & ML certification", "2026"],
  ];
  return `<section class="recognition-scene shell" id="recognition">
    <span id="achievements"></span>
    <details class="disclosure recognition-disclosure"><summary><h2>Recognition</h2></summary>
    <div class="recognition-spread">${photos.map(([id, label, year]) => `<article>
      ${photography(content.assets, id, { expandable: true, sizes: "(max-width: 760px) 90vw, 430px" }) ||
        `<div class="award-type"><span class="eyebrow">${id === "dp-world-kudos-2023" ? "DP World" : "Recognition"}</span><strong>${year}</strong><span>${id === "dp-world-kudos-2023" ? "Kudos Award" : e(label)}</span></div>`}
      <h3 class="sr-only">${e(label)}, ${year}</h3>
    </article>`).join("")}</div>
    <details class="disclosure recognition-more"><summary>More recognition</summary>
      <ul><li>Airtel Star Performer, 2021</li><li><a href="/work#excuse-generator-3000">Microsoft GitTogether, first place</a></li>
      <li><a href="/work#paytm-hackathon">Paytm Hackathon finalist, top eight of about 450 projects</a></li>
      <li>Major League Hacking, first place, 2020</li><li>DP World Kudos Award, 2026 (owner-reported)</li></ul>
    </details></details>
  </section>`;
}

function personal() {
  return '<div class="personal-scene shell" id="beyond"><a class="text-link" href="/about#workshop">Visit the workshop</a></div>';
}

function closing({ profile }) {
  return `<section class="closing" id="contact" data-motion>
    <div class="shell closing-inner">
      <div class="closing-art">${assembly("closing-optic")}</div>
      <div class="closing-content" data-reveal><p class="eyebrow">Contact</p>
        <h2>Build things that matter.</h2>
        <div class="actions"><a class="button button-primary" href="mailto:${e(profile.email)}">Email me</a>${external(profile.linkedin, "LinkedIn")}${external(profile.github, "GitHub")}<a class="text-link" href="${resumeHref}">Résumé</a></div>
      </div>
    </div>
  </section>`;
}

export function home(content, products) {
  return [hero(content), brandMarquee(content), impact(content), selectedWork(products), journey(content), principlesScene(), recognition(content), personal(), closing(content)].join("");
}
