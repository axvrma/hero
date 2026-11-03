import {
  escape as e,
  safeUrl,
  cleanLegacy,
} from "../../scripts/lib/content.mjs";
import { arrow, diagonal, mark } from "./icons.mjs";
import { ecosystem, visual } from "./visuals.mjs";
const external = (url, label, cls = "text-link") =>
  `<a class="${cls}" href="${e(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${label}${diagonal}</a>`;
export function header(path, profile) {
  const nav = [
    ["Work", "/work"],
    ["About", "/about"],
    ["Experience", "/experience"],
    ["Engineering", "/engineering"],
    ["Contact", "/contact"],
  ];
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="shell header-inner"><a class="wordmark" href="/" aria-label="${e(profile.name)} home">${e(profile.name)}</a><nav class="desktop-nav" aria-label="Main navigation">${nav.map(([label, url]) => `<a href="${url}" ${path === url || (url === "/work" && path.startsWith("/work/")) ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav><div class="header-actions">${external(profile.resume, "Résumé", "resume-link")}<button class="theme-toggle" type="button" aria-label="Switch color theme" title="Switch color theme"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg></button><button class="menu-toggle" type="button" aria-controls="mobile-menu" aria-expanded="false" aria-label="Open navigation"><span></span><span></span></button></div></div><nav id="mobile-menu" class="mobile-menu shell" aria-label="Mobile navigation" hidden>${nav.map(([label, url], i) => `<a href="${url}"><span class="mono">0${i + 1}</span>${label}${arrow}</a>`).join("")}${external(profile.resume, "View résumé")}</nav></header>`;
}
export function footer(profile) {
  return `<footer class="site-footer shell"><div><a class="wordmark" href="/">${e(profile.name)}</a><span class="footer-note">Independent thinking. Thoughtful software.</span></div><div class="footer-right"><span>© 2026 ${e(profile.name)}</span><a href="#top">Back to top ↑</a></div></footer>`;
}
export function contact(profile, standalone = false) {
  return `<section class="contact-section ${standalone ? "contact-standalone" : ""}" id="contact"><div class="shell"><div class="eyebrow"><span class="status-dot"></span> THE NEXT GOOD THING STARTS WITH A CONVERSATION</div><div class="contact-heading"><h${standalone ? "1" : "2"}>${e(profile.contactHeading).replace("building?", "<em>building?</em>")}</h${standalone ? "1" : "2"}><a class="contact-orb" href="mailto:${e(profile.email)}" aria-label="Email ${e(profile.name)}">${diagonal}</a></div><div class="contact-bottom"><a class="email-link" href="mailto:${e(profile.email)}">${e(profile.email)}${diagonal}</a><div class="contact-social">${external(profile.github, "GitHub")}${external(profile.linkedin, "LinkedIn")}${external(profile.resume, "Résumé")}</div></div>${standalone ? `<div class="contact-additional"><span class="mono">ELSEWHERE</span>${profile.instagram ? external(profile.instagram, "Instagram") : ""}${profile.x ? external(profile.x, "X") : ""}${profile.phone ? `<a class="text-link" href="tel:${e(profile.phone)}">${e(profile.phone)}</a>` : ""}</div>` : ""}</div></section>`;
}
export function feature(p, index) {
  return `<article class="project-feature ${p.id} ${index === 0 ? "flagship" : ""}" data-category="${e(p.category)}"><a class="visual-link" href="/work/${p.id}" aria-label="Explore the ${e(p.name)} case study">${visual(p)}</a><div class="feature-meta"><div class="feature-title"><span class="project-symbol ${p.id}">${mark(p.id, 22)}</span><h3><a href="/work/${p.id}">${p.name}</a></h3><span class="category mono">${p.category}</span><span class="project-number mono">0${index + 1}</span></div><p>${e(p.description)}</p><div class="feature-bottom"><div class="tags">${p.stack.map((t) => `<span>${e(t)}</span>`).join("")}</div><a class="case-link" href="/work/${p.id}">View case study ${arrow}</a></div><div class="product-links">${external(p.live, "Launch application")}${external(p.source, "GitHub source")}</div></div></article>`;
}
export const principles = [
  [
    "Architecture with intent.",
    "Boundaries that earn their place. Components that compose. State that lives where it belongs.",
  ],
  [
    "Fast is a feature.",
    "Measure the actual bottleneck, ship less JavaScript, and keep the critical path short.",
  ],
  [
    "Built for the next engineer.",
    "Clear contracts, useful documentation, and a local setup that gets out of the way.",
  ],
  [
    "Reliable by design.",
    "Make failures visible. Validate at the boundary. Give people a clear way to recover.",
  ],
  [
    "Product before abstraction.",
    "Understand the workflow first. Make the useful thing feel obvious. Let real needs shape the system.",
  ],
  [
    "AI with accountability.",
    "Use AI to explore, draft, and accelerate. Verify behavior, protect context, and own every decision.",
  ],
];
export function engineering(full = false) {
  return `<section class="section engineering-section" id="engineering"><div class="section-label"><span class="mono">02 / THE APPROACH</span><span class="mono">THOUGHTFUL BY DEFAULT</span></div><div class="section-heading philosophy-heading"><h2>Good engineering<br>is invisible.<br><span class="muted">Until it matters.</span></h2><p>I care about what happens after the first impression. How a system grows. How a team works in it. How it behaves when things go wrong.</p></div><div class="principles">${principles
    .slice(0, full ? 6 : 3)
    .map(
      ([title, body], i) =>
        `<article><span class="principle-index mono">0${i + 1} /</span><h3>${title}</h3><p>${body}</p></article>`,
    )
    .join(
      "",
    )}</div>${full ? "" : `<a class="text-link section-more" href="/engineering">Inside my engineering approach ${arrow}</a>`}</section>`;
}
export function experience(content, full = false) {
  return `<section class="section experience-section" id="experience"><div class="section-label"><span class="mono">03 / EXPERIENCE</span><a class="small-link" href="/experience">The full story ${diagonal}</a></div><div class="section-heading"><h2>Built in the real world.</h2><p>Enterprise complexity. Small product details.<br>The same care, at every scale.</p></div><div class="timeline">${content.experience
    .slice(0, full ? undefined : 2)
    .map(
      (job, i) =>
        `<article class="experience-row"><div class="experience-company"><span class="mono experience-count">0${i + 1}</span><h3>${e(job.company)}</h3></div><div class="experience-detail"><h4>${e(job.role)}</h4><ul>${job.details
          .slice(0, full ? undefined : 2)
          .map((detail) => `<li>${e(detail)}</li>`)
          .join(
            "",
          )}</ul></div><span class="mono experience-date">${e(job.duration)}</span></article>`,
    )
    .join("")}</div></section>`;
}
export function capabilities(content) {
  return `<section class="section" id="capabilities"><div class="section-label"><span class="mono">04 / CAPABILITIES</span><span class="mono">DEPTH OVER DECORATION</span></div><div class="section-heading"><h2>The tools change.<br><span class="muted">The thinking stays.</span></h2><p>A foundation in frontend systems, extended through hands-on product building.</p></div><div class="capability-matrix" id="skills">${content.skills.map((s, i) => `<div class="capability-row"><span class="mono">0${i + 1}</span><h3>${e(s.category)}</h3><p>${s.tags.map((t) => e(t)).join(' <span class="separator">/</span> ')}</p></div>`).join("")}<div class="capability-row"><span class="mono">04</span><h3>Backend & infrastructure</h3><p>Node.js <span class="separator">/</span> SQLite <span class="separator">/</span> Electron <span class="separator">/</span> Docker<br><small>Applied across the product ecosystem</small></p></div><div class="capability-row"><span class="mono">05</span><h3>AI & engineering practice</h3><p>AI-assisted tooling <span class="separator">/</span> Boundary validation <span class="separator">/</span> Accessible interfaces<br><small>Product evidence in Atlas, Prism and Envision</small></p></div></div></section>`;
}
export function archiveRows(projects, limit) {
  return `<div class="archive-list">${projects
    .slice(0, limit)
    .map(
      (p, i) =>
        `<a class="archive-row" href="/work/${e(p.id)}"><span class="mono archive-index">${String(i + 1).padStart(2, "0")}</span><div><h3>${e(p.name)}</h3><p>${e(p.description)}</p></div><span class="mono archive-type">${e(p.category || "EXPERIMENT / OPEN SOURCE")}</span>${diagonal}</a>`,
    )
    .join("")}</div>`;
}
export function home(content, products, secondary) {
  return `<div class="shell"><section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="status-dot"></span> INDEPENDENT ENGINEER. PRODUCT THINKER.</div><h1>${e(content.profile.heading).replace("complexity", '<span class="muted">complexity</span>').replace("feel simple.", 'feel <span class="simple-word">simple<span class="simple-period">.</span></span>')}</h1><p class="hero-description">${e(content.profile.subtitle)}</p><div class="hero-actions"><a class="button button-primary" href="#work">Explore work ${arrow}</a><a class="button button-quiet" href="/about">About me ${diagonal}</a></div></div><div class="hero-map">${ecosystem(products, content.profile.name)}</div></section><div class="hero-foot mono"><span>${e(content.profile.location)} <span class="hero-foot-divider">/</span> BUILDING FOR THE WEB & BEYOND</span><a href="#work">SCROLL TO EXPLORE <span>↓</span></a></div><section class="section work-section" id="work"><div class="section-label"><span class="mono">01 / SELECTED WORK</span><span class="mono">IDEAS, MADE REAL</span></div><div class="section-heading"><h2>Selected work<span class="accent">.</span></h2><p>Five products. Different problems.<br>One belief: software should feel considered.</p></div><div class="project-gallery" id="projects">${products.map(feature).join("")}</div><a class="archive-action" href="/work"><span>There’s more where that came from.</span><span>Explore the complete archive ${arrow}</span></a></section>${engineering()}${experience(content)}${capabilities(content)}<section class="section secondary-section"><div class="section-label"><span class="mono">05 / THE EXPLORATIONS</span><span class="mono">ALWAYS MAKING SOMETHING</span></div><div class="section-heading"><h2>Beyond the flagship.</h2><a class="text-link" href="/work#archive">All ${secondary.length} explorations ${arrow}</a></div>${archiveRows(secondary, 4)}</section></div>${contact(content.profile)}`;
}
export function pageIntro(kicker, title, description) {
  return `<div class="page-intro"><div class="eyebrow">${e(kicker)}</div><h1>${title}</h1>${description ? `<p>${e(description)}</p>` : ""}</div>`;
}
export function work(products, secondary) {
  return `<div class="shell">${pageIntro("THE PORTFOLIO / AN INDEPENDENT PRACTICE", 'Ideas deserve<br><span class="muted">to be built.</span>', "A collection of products, developer tools, and experiments. Explore the decisions behind the interfaces.")}<section class="section archive-featured" aria-labelledby="featured-title"><div class="section-label"><h2 id="featured-title" class="mono">THE FLAGSHIP FIVE</h2><span class="mono">ENGINEERED WITH INTENT</span></div><div class="project-gallery" id="projects">${products.map(feature).join("")}</div></section><section id="archive" class="section"><div class="section-heading"><h2>The explorations<span class="accent">.</span></h2><span class="mono">${secondary.length} MORE THINGS MADE</span></div><div class="archive-tools"><label for="project-search" class="mono">FIND A PROJECT</label><input id="project-search" type="search" placeholder="Search by name or description…" autocomplete="off"><span id="search-count" class="mono" role="status" aria-live="polite">${secondary.length} projects</span></div>${archiveRows(secondary)}<p class="search-empty" hidden>No projects match that search. Try another word.</p></section></div>`;
}
export function about(content) {
  return `<div class="shell">${pageIntro("ABOUT / THE PERSON BEHIND THE PRODUCTS", 'An engineer’s mind.<br><span class="muted">A builder’s curiosity.</span>', content.profile.about || "I’m Abhishek Verma. I build interfaces, systems, and the small tools that make working with them better.")}<section class="about-layout section"><div class="about-monogram" aria-hidden="true"><span>av<span class="accent">.</span></span><div class="mono">ABHISHEK VERMA<br>SOFTWARE ENGINEER & PRODUCT BUILDER</div></div><div class="prose"><h2>From the interface<br>to the infrastructure.</h2><p>My work spans enterprise frontend systems, reusable design systems, workflow management, and independent products. I’m interested in the point where a complex system starts to feel simple to the person using it.</p><p>At DP World, that has meant working on workflow interfaces, micro-frontends, and a unified design system. In my independent practice, it means building products like Atlas, Vibes, Envision, Servio, and Prism.</p><p>Different surfaces. The same questions: is the model clear, does the interaction make sense, and can the next engineer keep building on it?</p><a href="/experience" class="text-link">Explore my professional experience ${arrow}</a></div></section><section class="section"><div class="section-label"><span class="mono">EDUCATION & CONTINUED LEARNING</span></div><div class="education-grid">${content.education.map((ed) => `<article><h2>${e(ed.institution)}</h2><p>${e(ed.degree)} ${e(ed.duration)}</p></article>`).join("")}</div></section><section class="section"><div class="section-heading"><h2>A few places<br><span class="muted">to find my thinking.</span></h2><div class="contact-social">${external(content.profile.github, "Code on GitHub")}${external(content.profile.linkedin, "Connect on LinkedIn")}</div></div></section></div>${contact(content.profile)}`;
}
export function achievements(content) {
  return content.achievements?.length
    ? `<section class="section" id="achievements"><div class="section-label"><span class="mono">RECOGNITION / ALONG THE WAY</span></div><div class="education-grid">${content.achievements.map((item) => `<article><h2>${e(item.title)}</h2><p>${e(item.description)}</p></article>`).join("")}</div></section>`
    : "";
}
export function experiencePage(content) {
  return `<div class="shell">${pageIntro("EXPERIENCE / THE WORK BEHIND THE WORK", 'Care, at every scale<span class="accent">.</span>', "A career in frontend engineering, enterprise workflows, and reusable systems.")}${experience(content, true)}${achievements(content)}<section class="section" id="education"><div class="section-label"><span class="mono">EDUCATION & CERTIFICATIONS</span></div><div class="education-grid">${content.education.map((ed) => `<article><h2>${e(ed.institution)}</h2><p>${e(ed.degree)} ${e(ed.duration)}</p></article>`).join("")}</div></section><div class="resume-actions">${external(content.profile.resume, "Open original résumé", "button button-primary")}<a class="button button-outline" href="/resume">Printable résumé ${arrow}</a></div></div>${contact(content.profile)}`;
}
export function engineeringPage(content) {
  return `<div class="shell">${pageIntro("ENGINEERING / HOW I THINK", 'Make the complexity<br><span class="muted">earn its place.</span>', "Systems should be understandable, failures should be recoverable, and tools should help people do their best work.")}${engineering(true)}${capabilities(content)}<section class="section"><div class="section-heading"><h2>Decisions in practice.</h2></div><div class="practice-links"><a href="/work/atlas"><span class="mono">ATLAS</span><h3>A React-free execution engine.</h3><p>Separating the graph model from the interface.</p>${arrow}</a><a href="/work/prism"><span class="mono">PRISM</span><h3>Evidence before confidence.</h3><p>Keeping intended branch plans distinct from verified Git state.</p>${arrow}</a><a href="/work/envision"><span class="mono">ENVISION</span><h3>Progressive by design.</h3><p>A browser studio before camera permissions and AR.</p>${arrow}</a></div></section></div>`;
}
export function caseStudy(p, all) {
  const next =
    all[(all.findIndex((item) => item.id === p.id) + 1) % all.length];
  return `<div class="shell"><div class="case-intro"><a class="text-link back-link" href="/work">← All work</a><div class="eyebrow">${e(p.category)} / PRODUCT CASE STUDY</div><h1><span class="case-logo ${p.id}">${mark(p.id, 46)}</span>${p.name}<span class="accent">.</span></h1><p class="case-tagline">${e(p.tagline)}</p><p class="case-description">${e(p.description)}</p><div class="case-actions">${external(p.live, "Launch application", "button button-primary")}${external(p.source, "View source", "button button-outline")}</div></div>${visual(p)}<div class="case-facts"><div><span class="mono">PRODUCT</span><strong>${p.name}</strong></div><div><span class="mono">DISCIPLINE</span><strong>${e(p.category)}</strong></div><div><span class="mono">BUILT WITH</span><strong>${p.stack.map(e).join(" · ")}</strong></div></div><div class="case-body"><nav class="case-toc" aria-label="Case study sections"><span class="mono">IN THIS CASE STUDY</span><a href="#overview">Overview</a>${p.sections.map((s, i) => `<a href="#section-${i}">${e(s.title)}</a>`).join("")}<a href="#architecture">Architecture</a><a href="#scope">Scope & evidence</a></nav><div class="case-prose"><section id="overview"><span class="mono">01 / OVERVIEW</span><h2>What it does.</h2><ul class="feature-list">${p.features.map((f) => `<li>${e(f)}</li>`).join("")}</ul></section>${p.sections.map((s, i) => `<section id="section-${i}"><span class="mono">${String(i + 2).padStart(2, "0")} / ${e(s.title).toUpperCase()}</span><h2>${e(s.title)}.</h2><p>${e(s.body)}</p></section>`).join("")}<section id="architecture"><span class="mono">THE SYSTEM</span><h2>Clear boundaries.<br>Connected parts.</h2><ol class="architecture-flow">${p.architecture.map((v, i) => `<li><span class="mono">0${i + 1}</span>${e(v)}${i < p.architecture.length - 1 ? '<span aria-hidden="true">↓</span>' : ""}</li>`).join("")}</ol><div class="tags">${p.stack.map((t) => `<span>${e(t)}</span>`).join("")}</div></section><section id="scope"><span class="mono">SCOPE & EVIDENCE</span><h2>The honest edges.</h2><p>${e(p.limitations)}</p><p>Capabilities are grounded in repository documentation and implementation. No adoption figures or performance improvements are inferred.</p><div class="evidence-links">${p.evidence.map((url) => external(url, "Repository documentation")).join("")}</div></section></div></div><a class="next-project" href="/work/${next.id}"><div><span class="mono">NEXT IN THE ECOSYSTEM</span><h2>${next.name}<span class="accent">.</span></h2></div>${arrow}</a></div>`;
}
export function secondaryCase(p) {
  return `<div class="shell"><div class="case-intro"><a class="text-link back-link" href="/work#archive">← Project archive</a><div class="eyebrow">EXPLORATION / OPEN SOURCE</div><h1 class="secondary-title">${e(p.name)}</h1><p class="case-description">${e(p.description)}</p><div class="case-actions">${p.source ? external(p.source, "View source", "button button-primary") : ""}${p.live ? external(p.live, "Launch application", "button button-outline") : ""}</div></div><div class="legacy-prose prose"><div class="legacy-note mono">PRESERVED PROJECT DOCUMENTATION</div>${cleanLegacy(p.body || "<p>Explore the project source for implementation details.</p>")}</div><a class="archive-action" href="/work#archive"><span>Keep exploring.</span><span>Return to the archive ${arrow}</span></a></div>`;
}
export function resume(content) {
  return `<div class="shell resume-page"><div class="page-intro"><div class="eyebrow">RÉSUMÉ / PRINT-READY</div><h1>${e(content.profile.name)}</h1><p>${e(content.profile.role)} · ${e(content.profile.location)}</p><a class="text-link" href="mailto:${e(content.profile.email)}">${e(content.profile.email)}</a><div class="case-actions"><button class="button button-primary print-resume" type="button">Print / Save PDF</button>${external(content.profile.resume, "Original résumé")}</div></div>${experience(content, true)}${capabilities(content)}${achievements(content)}<section class="section" id="education"><h2>Education & certifications</h2><div class="education-grid">${content.education.map((ed) => `<article><h3>${e(ed.institution)}</h3><p>${e(ed.degree)} ${e(ed.duration)}</p></article>`).join("")}</div></section></div>`;
}
