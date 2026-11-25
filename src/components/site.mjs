import {
  escape as e,
  safeUrl,
  cleanLegacy,
} from "../../scripts/lib/content.mjs";
import { arrow, diagonal, mark } from "./icons.mjs";
import { ecosystem, visual } from "./visuals.mjs";
import { hackathonProjects } from "../../content/hackathons.mjs";
import { motivations } from "../../content/editorial.mjs";
import { breadcrumb, external, pageIntro, sectionIntro } from "./ui.mjs";
import {
  careerJourney, closing, employment, engineeringPrinciples,
  educationDetails, enterpriseList, hero, impact, photography, selectedImpact,
} from "./editorial.mjs";
import { brandMarquee, personalTeaser, productArchive, visualProof } from "./homepage.mjs";
import { businessImpact } from "./impact.mjs";
export { pageIntro } from "./ui.mjs";
export function header(path, profile) {
  const nav = [
    ["Home", "/"], ["Work", "/work"], ["Experience", "/experience"],
    ["Story", "/story"], ["Lab", "/lab"], ["Résumé", "/resume"], ["Contact", "/contact"],
  ];
  const links = nav.map(([label, url]) => {
    const active = path === url ? ' aria-current="page"' : path.startsWith(url + "/") ? ' aria-current="location"' : "";
    return `<a href="${url}"${active}>${label}</a>`;
  }).join("");
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="shell header-inner">
    <a class="wordmark" href="/" aria-label="${e(profile.name)} home"><span class="brand-mark" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="11" stroke="currentColor"/><path d="m4 27 24-22M4 16h24M16 4v24" stroke="currentColor"/><circle cx="16" cy="16" r="2.75" fill="currentColor"/></svg></span><span>${e(profile.name)}</span></a>
    <nav class="desktop-nav" aria-label="Main navigation">${links}</nav>
    <div class="header-actions"><button class="theme-toggle" type="button" aria-label="Switch color theme" title="Switch color theme"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18v18Z" fill="currentColor"/><circle cx="12" cy="12" r="9"/></svg></button><button class="menu-toggle" type="button" aria-controls="mobile-menu" aria-expanded="false" aria-label="Open navigation"><span></span><span></span></button></div>
  </div><nav id="mobile-menu" class="mobile-menu shell" aria-label="Mobile navigation">${links}</nav></header>`;
}
export function footer(profile) {
  return `<footer class="site-footer shell"><div><a class="wordmark" href="/">${e(profile.name)}</a><span class="footer-note">© 2026</span></div><div class="footer-right"><a href="/about">About</a><a href="/engineering">Engineering</a><a href="/#hackathons">Hackathons</a><a href="#top">Back to top</a></div></footer>`;
}
export const contact = closing;

export function feature(p, compact = false) {
  const motivation = motivations[p.id];
  return `<article class="project-feature ${e(p.id)}">
    <a class="visual-link" href="/work/${e(p.id)}">${visual(p, compact ? "(max-width: 760px) 90vw, (max-width: 1440px) 54vw, 780px" : undefined)}</a>
    <div class="feature-meta"><p class="eyebrow">${e(p.name)} · ${e(p.category)}</p><h3>${compact ? e(motivation.headline) : `<a href="/work/${e(p.id)}">${e(motivation.headline)}</a>`}</h3><p>${e(p.description)}</p>
    ${compact ? "" : `<p class="feature-signal">${e(motivation.signal)}</p>`}
    <div class="product-links"><a href="/work/${e(p.id)}" class="text-link" aria-label="Case study: ${e(p.name)}">Case study</a>${external(p.live, p.liveLabel || "Live demo")}${compact ? "" : external(p.source, "Source code")}</div></div>
  </article>`;
}
function hackathonCard(project) {
  const { id, name, description, result, event, buildTime, supporting, story, live, source, preview } = project;
  return `<article class="hackathon-card${supporting ? " hackathon-supporting" : ""}" aria-labelledby="hackathon-${e(id)}-title">
    <div class="hackathon-summary">
      <div class="hackathon-proof">
        <p class="hackathon-result${supporting ? " mono" : ""}">${e(result)}</p>
        ${buildTime ? `<span class="hackathon-build-time mono">${e(buildTime)}</span>` : ""}
      </div>
      ${event ? `<p class="hackathon-event mono">${e(event)}</p>` : ""}
      <h3 id="hackathon-${e(id)}-title">${e(name)}</h3>
      <p>${e(description)}</p>
    </div>
    <figure class="hackathon-preview">
      <img src="${e(preview.src)}" alt="${e(preview.alt)}" width="${preview.width}" height="${preview.height}" loading="lazy" decoding="async">
      <figcaption class="mono">${e(preview.caption)}</figcaption>
    </figure>
    <div class="hackathon-details">
      <p>${e(story)}</p>
      <div class="hackathon-actions">
        ${safeUrl(live) ? external(live, "Live Demo", "button button-primary", name) : ""}
        ${external(source, "Source Code", "button button-outline", name)}
      </div>
    </div>
  </article>`;
}
export function hackathons(content) {
  const results = hackathonProjects.filter((project) => !project.supporting);
  const prototypes = hackathonProjects.filter((project) => project.supporting);
  return `<section class="section hackathons-section" id="hackathons" aria-labelledby="hackathons-title" tabindex="-1">
    <p class="eyebrow">Hackathons</p>
    <div class="section-heading">
      <h2 id="hackathons-title">Built under pressure<span class="accent">.</span></h2>
      <p>Three hackathon builds, with demos you can try and code you can explore.</p>
    </div>
    <div class="hackathon-results">${results.map(hackathonCard).join("")}</div>
    ${prototypes.map(hackathonCard).join("")}
    ${photography(content.assets, "paytm-hackathon-photo", { expandable: true })}
  </section>`;
}
export function capabilities(content) {
  return `<section class="section" id="capabilities"><div class="section-label"><span class="mono">05 / CAPABILITIES</span><span class="mono">DEPTH OVER DECORATION</span></div><div class="section-heading"><h2>The tools change.<br><span class="muted">The thinking stays.</span></h2><p>A foundation in frontend systems, extended through hands-on product building.</p></div><div class="capability-matrix" id="skills">${content.skills.map((s, i) => `<div class="capability-row"><span class="mono">0${i + 1}</span><h3>${e(s.category)}</h3><p>${s.tags.map((t) => e(t)).join(' <span class="separator">/</span> ')}</p></div>`).join("")}<div class="capability-row"><span class="mono">04</span><h3>Backend & infrastructure</h3><p>Node.js <span class="separator">/</span> SQLite <span class="separator">/</span> Electron <span class="separator">/</span> Docker<br><small>Applied across the product ecosystem</small></p></div><div class="capability-row"><span class="mono">05</span><h3>AI & engineering practice</h3><p>AI-assisted tooling <span class="separator">/</span> Boundary validation <span class="separator">/</span> Accessible interfaces<br><small>Product evidence in Atlas, Prism and Envision</small></p></div></div></section>`;
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
export function home(content, products) {
  const featured = ["atlas", "envision"].map((id) => products.find((product) => product.id === id));
  return `<div class="shell home-edition">
    ${hero(content)}
    ${brandMarquee(content)}
    ${businessImpact(content.metrics)}
    ${visualProof(content)}
    ${selectedImpact()}
    <section class="editorial-section product-section" id="products">
      ${sectionIntro("Independent products", "Built from curiosity.")}
      <div class="editorial-product-gallery home-product-gallery">${featured.map((product) => feature(product, true)).join("")}</div>
      ${productArchive(products.filter((product) => !featured.includes(product)), motivations)}
      <a class="text-link editorial-more" href="/work">All products and projects</a>
    </section>
    ${engineeringPrinciples()}
    ${personalTeaser()}
  </div>${closing(content.profile, false, true)}`;
}
export function work(products, secondary, name) {
  return `<div class="shell">${pageIntro("Independent products", "Curiosity, turned into products.", "Most of my independent projects started with a question, a frustration, or a limitation I wasn’t ready to accept.")}
  <p class="work-professional"><a class="text-link" href="/experience#work">Explore my enterprise case studies</a></p>
  <section class="editorial-section work-products" aria-labelledby="featured-title">
    ${sectionIntro("Flagship products", "Why I build.", "", "featured-title")}
    <div class="editorial-product-gallery" id="projects">${products.map((product) => feature(product)).join("")}</div>
    <details class="product-map"><summary>Explore the product map</summary>${ecosystem(products, name)}</details>
  </section>
  <section id="archive" class="editorial-section">
    ${sectionIntro("Project archive", "The explorations.", `${secondary.length} more experiments and open-source projects.`)}
    <div class="archive-tools" hidden><label for="project-search" class="mono">Find a project</label><input id="project-search" type="search" placeholder="Search by name or description…" autocomplete="off"><span id="search-count" class="mono" role="status" aria-live="polite">${secondary.length} projects</span></div>
    ${archiveRows(secondary)}<p class="search-empty" hidden>No projects match that search. Try another word.</p>
  </section></div>`;
}
export function about(content) {
  return `<div class="shell">${pageIntro("ABOUT / THE PERSON BEHIND THE PRODUCTS", 'An engineer’s mind.<br><span class="muted">A builder’s curiosity.</span>', content.profile.about || "I’m Abhishek Verma. I build interfaces, systems, and the small tools that make working with them better.")}<section class="about-layout section"><div class="about-monogram" aria-hidden="true"><span>av<span class="accent">.</span></span><div class="mono">ABHISHEK VERMA<br>SOFTWARE ENGINEER & PRODUCT BUILDER</div></div><div class="prose"><h2>From the interface<br>to the infrastructure.</h2><p>My work spans enterprise frontend systems, reusable design systems, workflow management, and independent products. I’m interested in the point where a complex system starts to feel simple to the person using it.</p><p>At DP World, that has meant working on workflow interfaces, micro-frontends, and a unified design system. In my independent practice, it means building products like Atlas, Vibes, Envision, Servio, Prism, Luminescent, and Auditbench.</p><p>Different surfaces. The same questions: is the model clear, does the interaction make sense, and can the next engineer keep building on it?</p><a href="/experience" class="text-link">Explore my professional experience ${arrow}</a> <a href="/story" class="text-link">Read my personal story</a></div></section><section class="section"><div class="section-label"><span class="mono">EDUCATION & CONTINUED LEARNING</span></div><div class="education-grid">${content.education.map((ed) => `<article><h2>${e(ed.institution)}</h2>${educationDetails(ed)}</article>`).join("")}</div></section><section class="section"><div class="section-heading"><h2>A few places<br><span class="muted">to find my thinking.</span></h2><div class="contact-social">${external(content.profile.github, "Code on GitHub")}${external(content.profile.linkedin, "Connect on LinkedIn")}</div></div></section></div>${contact(content.profile)}`;
}
export function recognition(content, includePhotos = true) {
  return `<section class="editorial-section recognition-section" id="achievements">
    ${sectionIntro("Recognition", "Moments that matter.")}
    <div class="recognition-list">${content.achievements.map(({ title, description }) => `<article><h3>${e(title)}</h3><p>${e(description)}</p></article>`).join("")}</div>
    <a class="text-link editorial-more" href="/lab#hackathons">Explore hackathon results</a>
    ${includePhotos ? `<div class="recognition-photos">
      ${photography(content.assets, "dp-world-kudos-2023", { expandable: true, sizes: "(max-width: 680px) 90vw, 45vw" })}
      ${photography(content.assets, "google-assistant-2018", { expandable: true, sizes: "(max-width: 680px) 90vw, 45vw" })}
    </div>` : ""}
  </section>`;
}

function education(content, includePhoto = true) {
  return `<section class="editorial-section" id="education">
    ${sectionIntro("Continued learning", "Education & certifications.")}
    <div class="education-grid">${content.education.map((ed) => `<article><h3>${e(ed.institution)}</h3>${educationDetails(ed)}</article>`).join("")}</div>
    ${includePhoto ? photography(content.assets, "iit-guwahati-certificate", { expandable: true, sizes: "(max-width: 680px) 85vw, 460px" }) : ""}
  </section>`;
}

export function experiencePage(content) {
  return `<div class="shell">${pageIntro("Experience", "Different chapters. The same curiosity.", "Enterprise workflows, configurable systems and building alongside people with different perspectives.")}
    <div class="page-actions"><a class="button button-primary" href="#work">Read enterprise case studies</a><a class="button button-outline" href="/resume">View résumé</a></div>
    ${impact(content)}${enterpriseList()}${careerJourney(content)}${employment(content)}${recognition(content)}${education(content)}
  </div>${closing(content.profile)}`;
}
export function engineeringPage(content) {
  return `<div class="shell">${pageIntro("ENGINEERING / HOW I THINK", 'Make the complexity<br><span class="muted">earn its place.</span>', "Systems should be understandable, failures should be recoverable, and tools should help people do their best work.")}${engineeringPrinciples()}${capabilities(content)}<section class="section"><div class="section-heading"><h2>Decisions in practice.</h2></div><div class="practice-links"><a href="/work/atlas"><span class="mono">ATLAS</span><h3>A React-free execution engine.</h3><p>Separating the graph model from the interface.</p>${arrow}</a><a href="/work/prism"><span class="mono">PRISM</span><h3>Evidence before confidence.</h3><p>Keeping intended branch plans distinct from verified Git state.</p>${arrow}</a><a href="/work/envision"><span class="mono">ENVISION</span><h3>Progressive by design.</h3><p>A browser studio before camera permissions and AR.</p>${arrow}</a></div></section></div>`;
}
export function caseStudy(p, all) {
  const motivation = motivations[p.id];
  const next =
    all[(all.findIndex((item) => item.id === p.id) + 1) % all.length];
  return `<div class="shell">${breadcrumb("Work", "/work", p.name)}<div class="case-intro"><div class="eyebrow">${e(p.category)} / PRODUCT CASE STUDY</div><h1><span class="case-logo ${p.id}">${mark(p.id, 46)}</span>${p.name}<span class="accent">.</span></h1><p class="case-tagline">${e(motivation.headline)}</p><p class="case-description">${e(p.description)}</p><div class="case-actions">${external(p.live, p.liveLabel || "Launch application", "button button-primary")}${external(p.source, "View source", "button button-outline")}</div></div>${visual(p)}<div class="case-facts"><div><span class="mono">PRODUCT</span><strong>${p.name}</strong></div><div><span class="mono">DISCIPLINE</span><strong>${e(p.category)}</strong></div><div><span class="mono">BUILT WITH</span><strong>${p.stack.map(e).join(" · ")}</strong></div></div><div class="case-body"><nav class="case-toc" aria-label="Case study sections"><span class="mono">IN THIS CASE STUDY</span><a href="#motivation">Why I built it</a><a href="#overview">Overview</a>${p.sections.map((s, i) => `<a href="#section-${i}">${e(s.title)}</a>`).join("")}<a href="#architecture">Architecture</a><a href="#scope">Scope & evidence</a></nav><div class="case-prose"><section id="motivation"><h2>${p.id === "luminescent" ? "Design and architecture." : "Why I built it."}</h2><p>${e(motivation.story)}</p>${motivation.comparison ? `<dl class="product-comparison"><div><dt>Before Prism</dt><dd>${e(motivation.comparison.before)}</dd></div><div><dt>With Prism</dt><dd>${e(motivation.comparison.after)}</dd></div></dl>` : ""}</section><section id="overview"><span class="mono">01 / OVERVIEW</span><h2>What it does.</h2><ul class="feature-list">${p.features.map((f) => `<li>${e(f)}</li>`).join("")}</ul></section>${p.sections.map((s, i) => `<section id="section-${i}"><span class="mono">${String(i + 2).padStart(2, "0")} / ${e(s.title).toUpperCase()}</span><h2>${e(s.title)}.</h2><p>${e(s.body)}</p></section>`).join("")}<section id="architecture"><span class="mono">THE SYSTEM</span><h2>Clear boundaries.<br>Connected parts.</h2><ol class="architecture-flow">${p.architecture.map((v, i) => `<li><span class="mono">0${i + 1}</span>${e(v)}${i < p.architecture.length - 1 ? '<span aria-hidden="true">↓</span>' : ""}</li>`).join("")}</ol><div class="tags">${p.stack.map((t) => `<span>${e(t)}</span>`).join("")}</div></section><section id="scope"><span class="mono">SCOPE & EVIDENCE</span><h2>The honest edges.</h2><p>${e(p.limitations)}</p><p>Capabilities are grounded in repository documentation and implementation. No adoption figures or performance improvements are inferred.</p><div class="evidence-links">${p.evidence.map((url) => external(url, "Repository documentation")).join("")}</div></section></div></div><a class="next-project" href="/work/${next.id}"><div><span class="mono">NEXT IN THE ECOSYSTEM</span><h2>${next.name}<span class="accent">.</span></h2></div>${arrow}</a></div>`;
}
export function secondaryCase(p) {
  return `<div class="shell">${breadcrumb("Project archive", "/work#archive", p.name)}<div class="case-intro"><div class="eyebrow">EXPLORATION / OPEN SOURCE</div><h1 class="secondary-title">${e(p.name)}</h1><p class="case-description">${e(p.description)}</p><div class="case-actions">${p.source ? external(p.source, "View source", "button button-primary") : ""}${p.live ? external(p.live, "Launch application", "button button-outline") : ""}</div></div><div class="legacy-prose prose"><div class="legacy-note mono">PRESERVED PROJECT DOCUMENTATION</div>${cleanLegacy(p.body || "<p>Explore the project source for implementation details.</p>")}</div><a class="archive-action" href="/work#archive"><span>Keep exploring.</span><span>Return to the archive ${arrow}</span></a></div>`;
}
export function resume(content) {
  const { profile, currentJob } = content;
  return `<div class="shell resume-page">
    ${pageIntro("Résumé", e(profile.name), `${profile.role} at ${currentJob.company} · ${profile.location}`)}
    <a class="text-link" href="mailto:${e(profile.email)}">${e(profile.email)}</a>
    <div class="page-actions"><button class="button button-primary print-resume" type="button" hidden>Print / Save PDF</button>${external(profile.resume, "Open original résumé", "button button-outline")}<a class="text-link" href="/experience#work">Enterprise case studies</a></div>
    ${employment(content)}${education(content, false)}${capabilities(content)}${recognition(content, false)}
  </div>`;
}
