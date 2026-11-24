import { escape as e } from "../../scripts/lib/content.mjs";
import { career, growth, influences, labExperiments, narrative, principles, storyChapters, workshop } from "../../content/editorial.mjs";
import { enterpriseCases } from "../../content/enterprise.mjs";
import { breadcrumb, external, pageIntro, sectionIntro } from "./ui.mjs";
import { heroArt, moonshotArt, principleArt } from "./editorial-art.mjs";
import { demo } from "./demos.mjs";

export const enterprisePath = (id) => `/experience/${id}`;
const caseById = new Map(enterpriseCases.map((item) => [item.id, item]));
const chapterById = new Map(career.map((item) => [item.id, item]));

export function photography(assets, id, { priority = false, expandable = false } = {}) {
  const asset = assets.get(id);
  if (!asset) return "";
  const image = `<img class="asset-focus-${e(asset.focalPoint)}" src="${e(asset.path)}" alt="${e(asset.alt)}" width="${asset.width}" height="${asset.height}"${priority ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;
  return `<figure class="editorial-photo">${expandable ? `<a data-photo href="${e(asset.path)}" aria-label="Open image: ${e(asset.alt)}">${image}</a>` : image}${asset.caption || asset.attribution ? `<figcaption>${[asset.caption, asset.attribution].filter(Boolean).map(e).join(" · ")}</figcaption>` : ""}</figure>`;
}

export function hero(content) {
  const { profile, currentJob, assets } = content;
  const [opening, closing] = narrative.headline.split(". ");
  return `<section class="editorial-hero" aria-labelledby="hero-title">
    <div class="editorial-hero-copy">
      <div class="hero-identity"><p class="hero-name">${e(profile.name)}</p><p>${e(profile.role)} at ${e(currentJob.company)}</p></div>
      <h1 id="hero-title">${e(opening).replace(" has", "<br>has")}.<br><span>${e(closing)}</span></h1>
      <p class="editorial-hero-description">${e(narrative.intro)}</p>
      <div class="hero-credentials"><span>${e(profile.experienceLabel)}</span><span>${e(narrative.educationLabel)}</span></div>
      <div class="hero-actions"><a class="button button-primary" href="#work">Explore my work</a><a class="button button-outline" href="/resume">View résumé</a></div>
    </div>
    <div class="editorial-hero-visual">${photography(assets, "professional-portrait", { priority: true }) || heroArt()}</div>
    <div class="hero-signature"><p>${e(narrative.identity)}</p><div><a class="text-link" href="/contact">Contact</a>${external(profile.linkedin, "LinkedIn")}</div></div>
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

function progression(job) {
  if (!job?.progression?.length) return "";
  return `<ol class="role-progression">${job.progression.map(({ date, role }) => `<li><span>${e(date)}</span><strong>${e(role)}</strong></li>`).join("")}</ol>`;
}

export function careerJourney(content, compact = false) {
  const selected = compact ? career.filter(({ id }) => ["design", "nurtr", "airtel", "dp-world"].includes(id)) : career;
  return `<section class="editorial-section journey-section" id="journey">
    ${sectionIntro("Career journey", "Different chapters. The same curiosity.", compact ? "Design taught me to notice how things feel. Engineering gave me a way to change how they work." : "From the first computer to enterprise systems, each chapter changed what I paid attention to.")}
    <div class="journey-list">${selected.map((chapter) => {
      const job = content.experience.find(({ id }) => id === chapter.job);
      const date = job?.duration || chapter.period;
      const place = job?.company || chapter.place || chapter.theme;
      return `<details${compact && chapter.id === "dp-world" ? " open" : ""} id="chapter-${chapter.id}"><summary><span class="journey-period">${e(date)}</span><span class="journey-title"><small>${e(place)}</small><strong>${e(chapter.headline)}</strong></span></summary><div class="journey-detail"><p>${e(chapter.summary)}</p>${progression(job)}${!compact && chapter.id === "dp-world" ? photography(content.assets, "dp-world-office", { expandable: true }) : ""}</div></details>`;
    }).join("")}</div>
    ${compact ? '<a class="text-link editorial-more" href="/experience">Explore the full career journey</a>' : '<a class="text-link editorial-more" href="/story">Read the story behind the chapters</a>'}
  </section>`;
}

export function employment(content) {
  return `<section class="editorial-section employment-section" id="experience">
    ${sectionIntro("Employment", "Roles and contributions.")}
    ${content.experience.map((job) => `<article class="employment-entry"><div><p class="eyebrow">${e(job.duration)}</p><h3>${e(job.company)}</h3><p>${e(job.progression?.at(-1).role || job.role)}</p></div><div>${progression(job)}<ul>${job.details.map((detail) => `<li>${e(detail)}</li>`).join("")}</ul></div></article>`).join("")}
  </section>`;
}

export function enterpriseList(compact = false) {
  return `<section class="editorial-section enterprise-section" id="work" aria-labelledby="enterprise-title">
    ${sectionIntro("Selected enterprise work", "From complex systems to practical tools.", "Case studies on workflow automation, modular interfaces, and the decisions that helped teams ship them.", "enterprise-title")}
    <div class="enterprise-list">${enterpriseCases.slice(0, compact ? 4 : undefined).map((item) => `<article class="enterprise-entry"><p class="eyebrow">${e(item.organization)}</p><h3><a href="${enterprisePath(item.id)}">${e(item.title)}</a></h3><p>${e(item.summary)}</p></article>`).join("")}</div>
    ${compact ? '<a class="text-link editorial-more" href="/experience#work">See all enterprise case studies</a>' : ""}
  </section>`;
}

export function engineeringPrinciples() {
  return `<section class="editorial-section signature-section" id="engineering">
    ${sectionIntro("Engineering principles", "Three principles. Everything I build.")}
    <div class="signature-grid">${principles.map(({ id, title, quote, caseId }, index) => `<article>
      <span class="mono signature-index">${String(index + 1).padStart(2, "0")}</span>
      ${principleArt(id)}
      <h3>${e(title)}</h3>
      <p>${e(quote)}</p>
      <a class="text-link" href="${enterprisePath(caseId)}">${e(caseById.get(caseId).title)}</a>
    </article>`).join("")}</div>
  </section>`;
}

export function closing(profile, standalone = false) {
  const heading = standalone ? "h1" : "h2";
  return `<section class="editorial-closing" id="contact"><div class="shell">
    <p class="eyebrow">The next chapter</p>
    <${heading}>${e(narrative.nextTitle)}</${heading}>
    <p class="closing-copy">${e(narrative.nextBody)}</p>
    <div class="closing-links"><a class="button button-primary" href="mailto:${e(profile.email)}">Email me</a>${external(profile.linkedin, "LinkedIn")}${external(profile.github, "GitHub")}<a class="text-link" href="/resume">Résumé</a></div>
    ${standalone ? `<p class="closing-email"><a href="mailto:${e(profile.email)}">${e(profile.email)}</a></p>` : ""}
  </div></section>`;
}

export function storyPage(content) {
  const intro = "At around ten, I was exploring everything I could find on our first computer. I wanted to know what every button did. At fifteen, I started understanding the logic behind the applications I used. In college, I discovered how design communicates emotion. Eventually, those interests came together through engineering.";
  return `<div class="shell">${pageIntro("Story", "It all started with a question.", intro)}
    <div class="story-layout">
      <nav class="story-contents" aria-label="Story chapters"><ol>${storyChapters.map(({ title, careerIds }) => `<li><a href="#story-${careerIds[0]}">${e(title)}</a></li>`).join("")}</ol></nav>
      <div>${storyChapters.map(({ title, careerIds, demo: demoId }, index) => `<section class="story-chapter" id="story-${careerIds[0]}">
        <p class="eyebrow">Chapter ${index + 1}</p><h2>${e(title)}</h2>
        ${careerIds.map((id) => `<p>${e(chapterById.get(id).summary)}</p>`).join("")}
        ${demoId ? demo(demoId) : ""}
        ${index === 3 ? '<a class="text-link" href="/experience/life-calculator">How the app got me into engineering</a>' : ""}
      </section>`).join("")}</div>
    </div>
    <section class="editorial-section">
      ${sectionIntro("Personal influences", "The minds that shaped mine.")}
      <div class="impact-grid">${influences.map(({ name, aspect, body }) => `<article><p class="eyebrow">${e(aspect)}</p><h3>${e(name)}</h3><p>${e(body)}</p></article>`).join("")}</div>
    </section>
    <section class="editorial-section story-growth">${sectionIntro("Personal growth", "Learning to lead through the work.")}
      <div>${growth.map((paragraph) => `<p>${e(paragraph)}</p>`).join("")}${photography(content.assets, "casual-portrait", { expandable: true })}</div>
    </section>
  </div>${closing(content.profile)}`;
}

export function labPage(content, hackathons) {
  return `<div class="shell">${pageIntro("The Workshop", "Engineering doesn’t stop at my desk.", "Hardware, self-hosting and prototypes built to see what’s possible.")}
    <section class="editorial-section" aria-labelledby="workbench-title">${sectionIntro("Off the clock", "On the workbench.", "", "workbench-title")}
      <div class="workbench-grid">${workshop.map(({ id, title, body }) => `<article id="${id}"><h3>${e(title)}</h3><p>${e(body)}</p>${id === "homelab" ? '<ul class="homelab-list"><li>Personal cloud</li><li>Media</li><li>Local AI</li><li>Networking</li><li>Monitoring</li><li>Automation</li></ul>' : ""}</article>`).join("")}</div>
      ${photography(content.assets, "workshop-hardware", { expandable: true })}
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
    ${item.illustration ? `<figure class="flow-figure"><ol>${item.illustration.steps.map((step) => `<li>${e(step)}</li>`).join("")}</ol><figcaption>${e(item.illustration.caption)}</figcaption></figure>` : ""}
    <div class="case-body editorial-case">
      <nav class="case-toc" aria-label="Case study sections">${headings.map(([key, heading]) => `<a href="#${key}">${heading}</a>`).join("")}</nav>
      <div class="case-prose">${headings.map(([key, heading]) => `<section id="${key}"><h2>${heading}</h2><p>${e(item[key])}</p>${key === "approach" && item.example ? demo(item.example) : ""}${key === "outcome" ? metricList(metrics) : ""}</section>`).join("")}
        <section><h2>Principles in practice</h2><ul>${item.principles.map((id) => `<li><a class="text-link" href="/engineering#engineering">${e(principles.find((principle) => principle.id === id).title)}</a></li>`).join("")}</ul></section>
      </div>
    </div>
    <a class="text-link editorial-more case-return" href="/experience#work">Browse all enterprise case studies</a>
  </div>`;
}
