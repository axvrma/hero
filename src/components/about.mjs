import { career, growth, influences, workshop } from "../../content/editorial.mjs";
import { escape as e } from "../../scripts/lib/content.mjs";
import { demo } from "./demos.mjs";
import { assembly, diagram, retroArt } from "./illustrations.mjs";
import { companyLogo, photography } from "./photography.mjs";
import { external, pageIntro } from "./ui.mjs";

const story = new Map(career.map((chapter) => [chapter.id, chapter]));
const storyCopy = (id) => `<p>${e(story.get(id).summary)}</p>`;
const photo = (content, id, sizes = "(max-width: 760px) 90vw, 500px") => photography(content.assets, id, { expandable: true, sizes });
const qualification = ({ degree, institution, partner, specialisations, duration, completion }) =>
  `<p><strong>${e(degree)}</strong><br>${e(institution)}.</p>${partner ? `<p>Conducted jointly with ${e(partner)}. Specialisations in ${specialisations.map(e).join(" and ")}.</p><p>${e(duration)} · Completed ${e(completion)}</p>` : ""}`;

function chapter(index, id, title, body, art = "") {
  return `<section class="about-chapter${art ? " with-art" : ""}" id="${id}"><div class="about-copy" data-reveal>
    <span class="index">${index}</span><h2>${e(title)}</h2>${body}</div>${art ? `<div class="about-art">${art}</div>` : ""}</section>`;
}

function employment(content) {
  return `<div class="role-list" id="experience">${[...content.experience].reverse().map((job) => `<details class="disclosure role" id="role-${e(job.id)}">
    <summary>${companyLogo(content.assets, job.id)}<strong>${e(job.company)}</strong><span>${e(job.duration)}</span></summary>
    <div class="role-detail"><p>${e(job.progression?.at(-1).role || job.role)}</p>
    ${job.progression ? `<ol>${job.progression.map(({ date, role }) => `<li>${e(date)} · ${e(role)}</li>`).join("")}</ol>` : ""}
    <ul>${job.details.map((detail) => `<li>${e(detail)}</li>`).join("")}</ul></div>
  </details>`).join("")}</div>`;
}

function resume(content) {
  const { profile, currentJob } = content;
  return `<section class="resume-block" id="resume"><div class="resume-screen">
    <h2>Résumé</h2><p>A print-ready record of my roles, technical skills and qualifications.</p>
    <div class="actions"><button class="button button-primary print-resume" type="button" hidden>Print or save PDF</button>
      ${external(profile.resume, "Open original résumé", "text-link")}</div>
  </div><div class="resume-print">
    <h2>${e(profile.name)}</h2><p>${e(profile.role)} at ${e(currentJob.company)} · ${e(profile.location)}</p>
    <p>${e(profile.email)} · axvrma.com</p>
    <h3>Experience</h3><div class="resume-jobs">${content.experience.map((job) => `<article><h4>${e(job.company)} · ${e(job.progression?.at(-1).role || job.role)}</h4>
    <p>${e(job.duration)}${job.progression ? ` · ${job.progression.map(({ date, role }) => e(`${date} ${role}`)).join(" · ")}` : ""}</p><ul>${job.details.map((item) => `<li>${e(item)}</li>`).join("")}</ul></article>`).join("")}</div>
    <h3>Skills</h3>${content.skills.map(({ category, tags }) => `<p><strong>${e(category)}</strong> · ${tags.map(e).join(", ")}</p>`).join("")}
    <h3>Education and credentials</h3>${content.education.map(qualification).join("")}
    <h3>Recognition</h3><p>${content.achievements.map(({ title }, index) => e(index === 1 ? `${title} (owner-reported)` : title)).join(" · ")}</p>
  </div></section>`;
}

const influenceShapes = [
  '<path d="M16 48h65V17H16zm8-8 49-16m-49 0 49 16M48 48v12m-19 0h38"/>',
  '<path d="M16 49h63M21 47V34h13v13m10 0V26h13v21m10 0V15h13v32M16 56h63"/>',
  '<path d="m48 13 27 16v27L48 71 21 56V29zM48 13v27m27-11L48 44 21 29m27 15v27"/><circle cx="48" cy="44" r="6"/>',
];

export function about(content) {
  const [certificate, undergraduate, ...credentials] = content.education;
  return `<div class="page-top about-top" id="story"><div class="shell about-intro">
    ${pageIntro("About", "It all started<br>with a question.", "From our first home computer to the systems I build today.")}
    ${photography(content.assets, "casual-portrait", { expandable: true, priority: true, sizes: "(max-width: 760px) 65vw, 430px" })}
  </div></div>
  <div class="shell about-body">
    ${chapter("01", "story-first-computer", story.get("first-computer").headline, storyCopy("first-computer") + demo("desktop"), retroArt)}
    ${chapter("02", "story-first-program", "Software stopped being magic.", storyCopy("first-program") + demo("calculator"), diagram("calculator"))}
    ${chapter("03", "story-design", story.get("design").headline,
      `<p>I earned my B.Tech in Information Technology at ${e(undergraduate.institution)} between ${e(story.get("design").period)}. Between Dribbble and Behance I learned how tiny design decisions change what people feel.</p>${storyCopy("urstylecoach")}`)}
    ${chapter("04", "story-urstylecoach", story.get("nurtr").headline, storyCopy("nurtr") + demo("life") + '<p><a class="text-link" href="/work#life-calculator">Life Calculator case study</a></p>', diagram("globe"))}
    ${chapter("05", "story-iris", "Engineering at scale.", storyCopy("dp-world") +
      '<p>Working across teams taught me to bring people in earlier, share context and give others room to own decisions.</p>' +
      `<details class="disclosure"><summary>What I learned about leadership</summary>${growth.map((line) => `<p>${e(line)}</p>`).join("")}</details>` + employment(content),
      photo(content, "dp-world-kudos-2023") || photo(content, "san-francisco-portrait"))}
    ${chapter("06", "story-iit", story.get("iit").headline, qualification(certificate) +
      `<details class="disclosure" id="education"><summary>Other credentials</summary>${credentials.map(qualification).join("")}</details>`,
      photo(content, "iit-guwahati-certificate"))}
    ${chapter("07", "influences", "The minds that shaped mine.", `<ul class="influences">${influences.map(({ name, aspect, body }, index) => `<li>
      <svg viewBox="0 0 96 80" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${influenceShapes[index]}</svg>
      <h3>${e(name)}</h3><p class="eyebrow">${e(aspect)}</p><p>${e(body)}</p></li>`).join("")}</ul>`)}
    ${chapter("08", "workshop", "The workshop.", '<span id="story-beyond"></span><p>I like understanding what my tools depend on and deciding what I can run myself.</p>' +
      `<dl class="workshop-topics">${workshop.map(({ id, title, body }) => `<div id="${id}"><dt>${e(title)}</dt><dd>${e(body)}</dd></div>`).join("")}</dl>`,
      photo(content, "workshop-hardware") + diagram("workshop"))}
    ${chapter("09", "moonshot", "A suit and an assistant.", "<p>One day I’d like to build an Iron Man-inspired suit and a JARVIS-like assistant. I want to see how far I can take hardware and software when I design them together.</p>",
      `<div class="moonshot-art" data-motion>${assembly("moonshot-optic", 3)}</div>`)}
    <aside class="about-recognition" id="story-recognition"><a class="text-link" href="/#recognition">Recognition and awards</a></aside>
    <section class="about-ambition"><h2>Build useful things.<br><em>Help others do the same.</em></h2>
      <p>I want to become a leader people can look up to, and build tools that make a meaningful difference.</p>
      <a class="text-link" href="/#contact">Get in touch</a>
    </section>
    ${resume(content)}
  </div>`;
}
