import { escape as e } from "../../scripts/lib/content.mjs";
import { articles, capabilities, faq, featured, introduction, skills } from "../../content/personal-folio.mjs";
import { caseArt, serviceArt } from "./art.mjs";
import { metricList } from "./impact.mjs";
import { photography, photoImage, companyLogo } from "./photography.mjs";
import { checkList, external, heading } from "./ui.mjs";

export function brandMarquee(content) {
  const items = content.experience.map(({ id, company }) => {
    const logo = companyLogo(content.assets, id);
    return `<li>${logo ? `${logo}<span class="sr-only">${e(company)}</span>` : `<strong>${e(company)}</strong>`}</li>`;
  }).join("");
  return `<div class="employer-ticker" aria-label="Employers"><div class="employer-track">
    <ul>${items}</ul><ul aria-hidden="true">${items}</ul><ul aria-hidden="true">${items}</ul>
  </div></div>`;
}

export function caseMetrics(metrics, ...ids) {
  return metricList(metrics.filter(({ project }) => ids.includes(project)));
}

function hero(content) {
  const portrait = content.assets.get("casual-portrait") ?? content.assets.get("san-francisco-portrait");
  return `<section class="hero" id="home" data-compare="hero">
    <div class="hero-decoration" aria-hidden="true">
      <div class="rings"><i></i><i></i><i></i><i></i></div>
      <div class="hero-stars">${"<i></i>".repeat(9)}</div>
    </div>
    <div class="hero-inner">
      <div class="hero-top">${portrait ? photoImage(portrait, { priority: true, sizes: "58px" }) : ""}
        <p class="availability"><span aria-hidden="true"></span>${e(introduction.availability)}</p>
      </div>
      <div class="hero-copy">
        <h1>${introduction.headline.map((line) => `<span>${e(line)}</span>`).join(" ")}</h1>
        <p>${e(introduction.summary)}</p>
      </div>
      <div class="hero-actions">
        ${external(`mailto:${content.profile.email}`, "👋🏻 Let’s talk", "button button-primary")}
        ${external(content.profile.resume, "View résumé ↗", "button button-outline")}
      </div>
    </div>
    ${brandMarquee(content)}
  </section>`;
}

function featuredWork(content) {
  return `<section class="featured section" id="work" aria-labelledby="featured-title" data-compare="work">
    ${heading("Curated work", "Featured Case Studies", "Selected work across logistics, product engineering and AI.", "featured-title")}
    <div class="case-list" id="impact">${featured.map((item) => `<article class="case-card case-${item.art}" data-reveal data-compare="case">
      <div class="case-copy"${item.id === "hackathons" ? ' id="hackathons"' : ""}>
        <p class="case-label">${e(item.organization)} <span>•</span> ${e(item.category)}</p>
        <h3>${e(item.title)}</h3>
        ${item.points ? checkList(item.points) : `<p>${e(item.summary)}</p>`}
        ${caseMetrics(content.metrics, item.id, ...(item.related ?? []))}
        <a class="button button-primary case-link" href="/work#${item.id}" aria-label="View case study: ${e(item.organization)}">View Case Study <span aria-hidden="true">↗</span></a>
      </div>
      <div class="case-art" data-content-image>${caseArt(item.art, content)}</div>
    </article>`).join("")}</div>
    <a class="work-index-link" id="products" href="/work#products">Explore independent projects <span aria-hidden="true">↗</span></a>
  </section>`;
}

function ribbon() {
  const words = ["Accessible", "Built for people", "Web performance"];
  const loop = Array.from({ length: 3 }, () => words).flat().map((word) => `<span>${e(word)}</span><i>✦</i>`).join("");
  return `<div class="ribbon" aria-hidden="true"><div class="ribbon-track"><div>${loop}</div><div>${loop}</div></div></div>`;
}

function writing(preview) {
  return `<section class="writing section" aria-labelledby="writing-title" data-compare="writing">
    ${heading("Thoughts and blogs", "Read My Narrative", "Notes on building products, designing systems and working with AI.", "writing-title")}
    <div class="article-grid">${articles.map(({ id, title, summary, paragraphs, status }) => {
      const body = preview || status === "approved" ? paragraphs.map((p) => `<p>${e(p)}</p>`).join("") : `<p>${e(summary)}</p>`;
      return `<article class="article-card" data-reveal data-compare="article">
        <h3><a href="#${id}" data-article="${id}" aria-haspopup="dialog">${e(title)}<span aria-hidden="true">→</span></a></h3>
        <details class="article-text" id="${id}"><summary>Read ${e(title)}</summary><div>${preview && status === "draft" ? '<p class="preview-label">Draft · Owner review</p>' : ""}${body}</div></details>
      </article>`;
    }).join("")}</div>
    <dialog class="reading-dialog" aria-labelledby="reading-title">
      <form method="dialog"><button class="button button-outline" value="close">Close</button></form>
      <h2 id="reading-title"></h2><div class="reading-body"></div>
    </dialog>
  </section>`;
}

function services() {
  return `<section class="services section" id="principles" aria-labelledby="services-title" data-compare="services">
    <span class="anchor-target" id="engineering"></span>
    ${heading("Engineering", "How I Can Help", "Building useful software for complex problems.", "services-title")}
    <div class="service-grid">${capabilities.map(({ id, title, description }) => `<article class="service-card service-${id}" data-reveal data-compare="service">
      <div class="service-copy"><h3><span aria-hidden="true">✦</span>${e(title)}</h3><p>${e(description)}</p></div>
      ${serviceArt(id)}
    </article>`).join("")}</div>
    <p class="sr-only">Tools and practices include ${skills.join(", ")}.</p>
  </section>`;
}

function recognition(content) {
  return `<section class="recognition section" id="achievements" aria-labelledby="recognition-title" data-compare="recognition">
    ${heading("Recognition", "Word on the Street", "Awards, milestones and a few things I’m proud of.", "recognition-title")}
    <div class="recognition-viewport" data-carousel role="region" aria-label="Professional recognition cards" tabindex="0">
      ${content.recognition.map(({ title, issuer, body, image, sample }) => `<article class="recognition-card" data-compare="recognition-card">
        <div class="recognition-meta">
          <span class="recognition-avatar">${image && content.assets.has(image) ? photoImage(content.assets.get(image), { decorative: true }) : '<span aria-hidden="true">✦</span>'}</span>
          <div><h3>${e(title)}</h3><p>${e(issuer)}</p></div>
        </div>
        <p>${e(body)}</p>
        ${sample ? '<span class="preview-label">Placeholder</span>' : ""}
      </article>`).join("")}
    </div>
    <div class="carousel-controls" aria-label="Recognition carousel controls">
      <button type="button" data-carousel-step="-1" aria-label="Previous recognition">←</button>
      <button type="button" data-carousel-step="1" aria-label="Next recognition">→</button>
    </div>
  </section>`;
}

function personal(content) {
  return `<section class="personal section" id="about" aria-labelledby="about-title" data-compare="about">
    ${heading("About me", "Know Who I Am", "My journey in a few words.", "about-title")}
    <div class="personal-copy" data-reveal>
      ${introduction.about.map((p) => `<p>${e(p)}</p>`).join("")}
      <a class="button button-outline" href="/about">Know more <span aria-hidden="true">→</span></a>
    </div>
    <div class="polaroid" id="journey" data-reveal>
      ${photography(content.assets, "casual-portrait", { sizes: "300px" })}
      <span>${e(content.profile.name)}</span>
    </div>
  </section>`;
}

function questions(content) {
  const contactPhoto = content.assets.get("san-francisco-portrait");
  return `<section class="faq section" id="faq" aria-labelledby="faq-title" data-compare="faq">
    ${heading("Some doubts", "Frequently Asked Questions", "Your answers await right here.", "faq-title")}
    <button class="button button-outline mobile-faq-toggle" type="button" aria-expanded="false" aria-controls="faq-questions">Frequently Asked Questions</button>
    <div class="faq-layout">
      <div class="contact-card" id="contact" data-reveal data-compare="contact">
        <h3>Have any more questions or want to start collaborating?</h3>
        <div class="contact-picture">
          ${contactPhoto ? photoImage(contactPhoto, { sizes: "(max-width: 809px) 280px, 420px" }) : ""}
          <div class="contact-actions">${external(`mailto:${content.profile.email}`, "👋🏻 Let’s talk", "button button-primary")}</div>
        </div>
      </div>
      <div class="accordion" id="faq-questions" data-reveal>${faq.map(({ question, answer }, index) => `<details name="portfolio-faq" data-compare="question"${index === 0 ? " open" : ""}>
        <summary>${e(question)}<span aria-hidden="true"></span></summary>
        <div class="answer"><p>${e(answer)}</p></div>
      </details>`).join("")}</div>
    </div>
  </section>`;
}

export function home(content) {
  return `${hero(content)}${featuredWork(content)}${ribbon()}${writing(content.preview)}${services()}${recognition(content)}${personal(content)}${questions(content)}`;
}
