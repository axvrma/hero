import { escape as e } from "../../scripts/lib/content.mjs";
import { career, growth, influences, labExperiments, narrative, principles, storyChapters, workshop } from "../../content/editorial.mjs";
import { enterpriseCases } from "../../content/enterprise.mjs";
import { breadcrumb, external, pageIntro, sectionIntro } from "./ui.mjs";
import { careerArt, heroArt, homelabArt, moonshotArt, principleArt } from "./editorial-art.mjs";
import { demo } from "./demos.mjs";

export const enterprisePath = (id) => `/experience/${id}`;
const caseById = new Map(enterpriseCases.map((item) => [item.id, item]));
const chapterById = new Map(career.map((item) => [item.id, item]));
const heroSizes = "(max-width: 560px) 88vw, (max-width: 760px) 460px, (max-width: 1280px) 36vw, 485px";

function imageSources(asset) {
  return asset.variants?.length
    ? [...asset.variants, asset].map(({ path, width }) => `${e(path)} ${width}w`).join(", ")
    : "";
}

export function heroPreload(assets) {
  const asset = assets.get("professional-portrait");
  if (!asset) return "";
  const sources = imageSources(asset);
  return sources
    ? `<link rel="preload" as="image" imagesrcset="${sources}" imagesizes="${heroSizes}" fetchpriority="high">`
    : `<link rel="preload" as="image" href="${e(asset.path)}" fetchpriority="high">`;
}

export function photoImage(asset, { priority = false, expandable = false, sizes = "90vw" } = {}) {
  const sources = imageSources(asset);
  const responsive = sources ? ` srcset="${sources}" sizes="${e(sizes)}"` : "";
  const image = `<img class="asset-focus-${e(asset.focalPoint)}" src="${e(asset.path)}"${responsive} alt="${e(asset.alt)}" width="${asset.width}" height="${asset.height}"${priority ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
  return expandable ? `<a data-photo href="${e(asset.path)}" aria-label="${asset.provenance === "certificate-derivative" ? "Expand certificate" : `Expand photo: ${e(asset.alt)}`}">${image}<span class="photo-expand" aria-hidden="true">↗</span></a>` : image;
}

export function photography(assets, id, options) {
  const asset = assets.get(id);
  if (!asset) return "";
  const credit = [asset.caption, asset.attribution].filter(Boolean).map(e).join(" · ");
  return `<figure class="editorial-photo">${photoImage(asset, options)}${credit ? `<figcaption>${credit}</figcaption>` : ""}</figure>`;
}

export function hero(content) {
  const { profile, currentJob, assets } = content;
  const [opening, closing] = narrative.headline.split(". ");
  return `<section class="editorial-hero" aria-labelledby="hero-title">
    <div class="editorial-hero-copy">
      <div class="hero-identity"><p class="hero-name">${e(profile.name)}</p><p>${e(profile.role)} at <strong>${e(currentJob.company)}</strong></p><p class="hero-tenure">${e(profile.experienceLabel)}</p></div>
      <h1 id="hero-title"><span class="hero-opening">${e(opening)}.</span> <span class="hero-closing">${e(closing)}</span></h1>
      <p class="editorial-hero-description">${narrative.identity.map((phrase) => `<span>${e(phrase)}</span>`).join(" ")}</p>
      <div class="hero-actions"><a class="button button-primary" href="#work">Explore my work</a><a class="button button-outline" href="/resume">View résumé</a></div>
      <div class="hero-contacts">${external(profile.linkedin, "LinkedIn")}<a class="text-link" href="/contact">Contact</a></div>
    </div>
    <div class="editorial-hero-visual">${photography(assets, "professional-portrait", { priority: true, sizes: heroSizes }) || heroArt()}</div>
  </section>`;
}

function metricList(metrics) {
  if (!metrics.length) return "";
  return `<dl class="impact-metrics">${metrics.map((metric) => `<div>
    <dt>${e(metric.label)}</dt>
    <dd><strong>${e(metric.value)} ${e(metric.unit)}</strong><p>${e(metric.scope)} · ${e(metric.baseline)} → ${e(metric.outcome)}</p><p>${e(metric.attribution)}</p></dd>
  </div>`).join("")}</dl>`;
}

export function impact(content) {
  const outcomes = [
    ["intelligent-invoice-processing", "Less manual invoice processing", "Our team automated extraction and downstream posting so invoice data could move into processing as it was read."],
    ["dynamic-shipment-workflows", "A guided shipment filing process", "The workflow assigns tasks from shipment context and roles, giving operators a clear sequence to follow."],
    ["configuration-driven-ui", "One form system across regions", "Regional support teams could configure the fields they needed through JSON within a shared application."],
  ];
  return `<section class="editorial-section impact-section" id="impact">
    ${sectionIntro("Professional impact", "Engineering that moves the needle.", "I believe the value of engineering is measured not only by what gets built, but by what becomes possible because of it.")}
    ${metricList(content.metrics)}
    <div class="impact-grid">${outcomes.map(([id, title, copy]) => `<article><p class="eyebrow">${e(caseById.get(id).organization)}</p><h3><a href="${enterprisePath(id)}">${e(title)}</a></h3><p>${e(copy)}</p></article>`).join("")}</div>
  </section>`;
}

export function selectedImpact(content) {
  const initiatives = [
    ["intelligent-invoice-processing", "Invoices needed manual entry.", "Automated extraction and posting reduced manual processing."],
    ["dynamic-shipment-workflows", "Fixed checklists missed shipment-specific tasks.", "Role-based tasks gave operators a guided filing process."],
    ["micro-frontend-communication", "Separate modules shared a single workflow.", "Explicit handoffs kept behavior coordinated across modules."],
  ];
  return `<section class="editorial-section selected-impact" id="impact">
    <div id="work">${sectionIntro("Selected enterprise work", "Engineering that moves the needle.", "Conceptual diagrams show how invoice data, shipment tasks and frontend modules move through each workflow.")}</div>
    ${metricList(content.metrics)}
    <div class="initiative-grid">${initiatives.map(([id, problem, outcome]) => {
      const item = caseById.get(id);
      return `<article class="initiative">
        ${flowDiagram(item, true)}
        <h3>${e(item.title)}</h3>
        <p>${e(problem)} ${e(outcome)}</p>
        <a class="text-link" href="${enterprisePath(id)}" aria-label="Read case study: ${e(item.title)}">Read case study <span aria-hidden="true">↗</span></a>
      </article>`;
    }).join("")}</div>
    <a class="text-link editorial-more" href="/experience#work">All six enterprise case studies</a>
  </section>`;
}

function flowDiagram({ illustration }, compact = false) {
  if (!illustration) return "";
  return `<figure class="flow-figure${compact ? " initiative-flow" : ""}"><ol>${illustration.steps.map((step) => `<li>${e(step)}</li>`).join("")}</ol><figcaption${compact ? ' class="sr-only"' : ""}>${e(illustration.caption)}</figcaption></figure>`;
}

function progression(job) {
  if (!job?.progression?.length) return "";
  return `<ol class="role-progression">${job.progression.map(({ date, role }) => `<li><span>${e(date)}</span><strong>${e(role)}</strong></li>`).join("")}</ol>`;
}

export function careerJourney(content) {
  return `<section class="editorial-section journey-section" id="journey">
    ${sectionIntro("Career journey", "Different chapters. The same curiosity.", "From the first computer to enterprise systems, each chapter changed what I paid attention to.")}
    <div class="journey-list">${career.map((chapter) => {
      const job = content.experience.find(({ id }) => id === chapter.job);
      const date = job?.duration || chapter.period;
      const place = job?.company || chapter.place || chapter.theme;
      return `<details id="chapter-${chapter.id}"><summary><span class="journey-period">${e(date)}</span><span class="journey-title"><small>${e(place)}</small><strong>${e(chapter.headline)}</strong></span></summary><div class="journey-detail"><p>${e(chapter.summary)}</p>${progression(job)}${chapter.id === "dp-world" ? photography(content.assets, "dp-world-office", { expandable: true }) : ""}</div></details>`;
    }).join("")}</div>
    <a class="text-link editorial-more" href="/story">Read the story behind the chapters</a>
  </section>`;
}

export function employment(content) {
  return `<section class="editorial-section employment-section" id="experience">
    ${sectionIntro("Employment", "Roles and contributions.")}
    ${content.experience.map((job) => `<article class="employment-entry"><div><p class="eyebrow">${e(job.duration)}</p><h3>${e(job.company)}</h3><p>${e(job.progression?.at(-1).role || job.role)}</p></div><div>${progression(job)}<ul>${job.details.map((detail) => `<li>${e(detail)}</li>`).join("")}</ul></div></article>`).join("")}
  </section>`;
}

export function enterpriseList() {
  return `<section class="editorial-section enterprise-section" id="work" aria-labelledby="enterprise-title">
    ${sectionIntro("Selected enterprise work", "From complex systems to practical tools.", "Case studies on workflow automation, modular interfaces, and the decisions that helped teams ship them.", "enterprise-title")}
    <div class="enterprise-list">${enterpriseCases.map((item) => `<article class="enterprise-entry"><p class="eyebrow">${e(item.organization)}</p><h3><a href="${enterprisePath(item.id)}">${e(item.title)}</a></h3><p>${e(item.summary)}</p></article>`).join("")}</div>
  </section>`;
}

export function engineeringPrinciples() {
  return `<section class="editorial-section signature-section" id="engineering">
    ${sectionIntro("Engineering principles", "Three principles. Everything I build.")}
    <div class="signature-grid">${principles.map(({ id, title, quote, caseId }) => `<article>
      ${principleArt(id)}
      <h3>${e(title)}</h3>
      <p>${e(quote)}</p>
      <a class="text-link" href="${enterprisePath(caseId)}">${e(caseById.get(caseId).title)}</a>
    </article>`).join("")}</div>
  </section>`;
}

export function closing(profile, standalone = false, compact = false) {
  const heading = standalone ? "h1" : "h2";
  return `<section class="editorial-closing" id="contact"><div class="shell">
    <p class="eyebrow">The next chapter</p>
    <${heading}>${e(narrative.nextTitle)}</${heading}>
    <p class="closing-copy">${e(compact ? "Have a problem worth solving? Let’s talk." : narrative.nextBody)}</p>
    <div class="closing-links"><a class="button button-primary" href="mailto:${e(profile.email)}">Email me</a>${external(profile.linkedin, "LinkedIn")}${external(profile.github, "GitHub")}<a class="text-link" href="/resume">Résumé</a></div>
    ${standalone ? `<p class="closing-email"><a href="mailto:${e(profile.email)}">${e(profile.email)}</a></p>` : ""}
  </div></section>`;
}

export function educationDetails({ degree, duration, partner, specialisations, completion }) {
  return `<p class="qualification-name">${e(degree)}</p>${partner ? `<p>Conducted jointly with ${e(partner)}.</p>
    <p>${specialisations.map(e).join(" · ")}</p>
    <p>${e(duration)} · Completed ${e(completion)}</p>` : duration ? `<p>${e(duration)}</p>` : ""}`;
}

function chapterCopy(id, careerIds, content) {
  const copy = (key) => `<p>${e(chapterById.get(key).summary)}</p>`;
  if (id === "recognition") {
    return '<p>In 2018 I received recognition as an early developer for Google Assistant apps.</p><a class="text-link" href="/experience#achievements">See recognition and awards</a>';
  }
  if (id === "beyond") return '<p>Outside work I like to travel, take things apart and see what I can run myself.</p><a class="text-link" href="/lab">Explore the Workshop</a>';
  if (id === "iit") return `${copy(id)}<div class="story-qualification"><h3>${e(content.education[0].institution)}</h3>${educationDetails(content.education[0])}</div>`;
  const [first, ...remaining] = careerIds;
  const more = remaining.length ? `<details class="story-more"${first === "design" ? ' id="story-design"' : ""}><summary>${first === "design" ? "From UrStyleCoach to Nurtr" : "Earlier roles at IRIS and Airtel"}</summary>${remaining.map(copy).join("")}</details>` : "";
  return `${copy(first)}${more}${id === "urstylecoach" ? '<a class="text-link" href="/experience/life-calculator">How the app got me into engineering</a>' : ""}${id === "iris" ? '<a class="text-link" href="/experience#achievements">DP World Kudos Award · 2023</a>' : ""}`;
}

export function storyPage(content) {
  return `<div class="shell story-edition">${pageIntro("Story", "It all started with a question.", "A first computer, a homemade calculator, and the questions that led me from design to engineering.")}
    <div class="story-layout">
      <nav class="story-contents" aria-label="Story chapters"><ol>${storyChapters.map(({ id, title }) => `<li><a href="#story-${id}">${e(title)}</a></li>`).join("")}</ol></nav>
      <div>${storyChapters.map(({ id, title, careerIds, demo: demoId, asset }) => {
        const photo = asset ? photography(content.assets, asset, { expandable: true, sizes: "(max-width: 740px) 90vw, (max-width: 1090px) 38vw, 480px" }) : "";
        const art = photo || (demoId ? careerArt(demoId) : "");
        return `<section class="story-chapter" id="story-${id}">
        <div class="chapter-layout${art ? " has-chapter-art" : ""}"><div class="chapter-copy">
          <h2>${e(title)}</h2>${chapterCopy(id, careerIds, content)}
        </div>${art}</div>
        ${demoId ? demo(demoId) : ""}
        ${id === "beyond" ? `<div class="story-portraits">
          ${photography(content.assets, "casual-portrait", { sizes: "(max-width: 740px) 46vw, 360px" })}
          ${photography(content.assets, "san-francisco-portrait")}
        </div>` : ""}
      </section>`;
      }).join("")}</div>
    </div>
    <section class="editorial-section">
      ${sectionIntro("Personal influences", "The minds that shaped mine.")}
      <div class="impact-grid">${influences.map(({ name, aspect, body }) => `<article><p class="eyebrow">${e(aspect)}</p><h3>${e(name)}</h3><p>${e(body)}</p></article>`).join("")}</div>
    </section>
    <section class="editorial-section story-growth">${sectionIntro("Personal growth", "Learning to lead through the work.")}
      <div>${growth.map((paragraph) => `<p>${e(paragraph)}</p>`).join("")}</div>
    </section>
  </div>${closing(content.profile)}`;
}

export function labPage(content, hackathons) {
  return `<div class="shell workshop-edition">${pageIntro("The Workshop", "Engineering doesn’t stop at my desk.", "My curiosity rarely ends with software.")}
    <div class="workshop-lead">
      ${photography(content.assets, "workshop-hardware", { expandable: true, sizes: "(max-width: 680px) 90vw, (max-width: 1440px) 45vw, 640px" })}
      ${homelabArt()}
    </div>
    <section class="editorial-section" aria-labelledby="workbench-title">${sectionIntro("Off the clock", "On the workbench.", "", "workbench-title")}
      <div class="workbench-grid">${workshop.map(({ id, title, body }) => `<article id="${id}"><h3>${e(title)}</h3><p>${e(body)}</p></article>`).join("")}</div>
    </section>
    <section class="editorial-section">${sectionIntro("Simulations", "A problem worth playing with.")}
      ${labExperiments.map(({ id, title, headline, body }) => `<article class="lab-experiment" id="${id}"><div><p class="eyebrow">${e(title)} · Independent simulation</p><h3>${e(headline)}</h3></div><p>${e(body)}</p></article>`).join("")}
    </section>
    ${hackathons}
    <section class="editorial-section moonshot">
      <div>${sectionIntro("The moonshot", "A suit and an assistant.", "If money and employment were out of the equation, I’d build an Iron Man suit and a JARVIS-like intelligent assistant. I like what that fictional combination asks of an engineer: make hardware and software feel like they belong together.")}</div>
      ${moonshotArt}
    </section>
  </div>${closing(content.profile)}`;
}

export function enterprisePage(item, content) {
  const headings = [
    ["context", "Context"], ["problem", "Problem"], ["role", "My role"],
    ["team", "Team context"], ["constraints", "Constraints"], ["approach", "Engineering approach"],
    ["decisions", "Decisions"], ["tradeoffs", "Trade-offs"], ["outcome", "Outcome"], ["lesson", "What I took away"],
  ];
  const metrics = content.metrics.filter(({ project }) => project === item.id);
  return `<div class="shell">
    ${breadcrumb("Experience", "/experience", item.title)}
    ${pageIntro(item.organization, e(item.title), item.summary)}
    ${flowDiagram(item)}
    <div class="case-body editorial-case">
      <nav class="case-toc" aria-label="Case study sections">${headings.map(([key, heading]) => `<a href="#${key}">${heading}</a>`).join("")}</nav>
      <div class="case-prose">${headings.map(([key, heading]) => `<section id="${key}"><h2>${heading}</h2><p>${e(item[key])}</p>${key === "approach" && item.example ? demo(item.example) : ""}${key === "outcome" ? metricList(metrics) : ""}</section>`).join("")}
        <section><h2>Principles in practice</h2><ul>${item.principles.map((id) => `<li><a class="text-link" href="/engineering#engineering">${e(principles.find((principle) => principle.id === id).title)}</a></li>`).join("")}</ul></section>
      </div>
    </div>
    <a class="text-link editorial-more case-return" href="/experience#work">Browse all enterprise case studies</a>
  </div>`;
}
