import { career, growth, influences, workshop } from "../../content/editorial.mjs";
import { introduction } from "../../content/personal-folio.mjs";
import { escape as e } from "../../scripts/lib/content.mjs";
import { demo } from "./demos.mjs";
import { photography } from "./photography.mjs";
import { checkList, external, heading, pageIntro } from "./ui.mjs";

function experienceItem({ company, duration, role, progression, details }) {
  return `<li><h4>${e(company)}</h4><p>${e(duration)}${role ? ` · ${e(role)}` : ""}</p>
    ${progression ? `<ul>${progression.map(({ date, role }) => `<li>${e(role)} · ${e(date)}</li>`).join("")}</ul>` : ""}
    ${checkList(details)}
  </li>`;
}

export function about(content) {
  const { profile, assets, education, experience } = content;
  const qualifications = education.map(({ institution, degree, duration, completion, specialisations }) => `<li><h4>${e(institution)}</h4><p>${e(degree)}</p><p>${e(duration)}${completion ? ` · Completed ${e(completion)}` : ""}</p>${specialisations?.length ? `<p>${specialisations.map(e).join(" · ")}</p>` : ""}</li>`).join("");
  return `<div class="secondary-page">
    ${pageIntro("About", "Abhishek Verma", "Senior Software Engineer, Product Builder and AI/ML Practitioner")}
    <section class="about-lead">
      <div>${introduction.about.map((p) => `<p>${e(p)}</p>`).join("")}<p>${e(profile.location)}</p>
      <div class="actions"><a class="button button-primary" href="#resume">Résumé</a>${external(`mailto:${profile.email}`, "Let’s talk", "button button-outline")}</div></div>
      ${photography(assets, "san-francisco-portrait", { expandable: true, sizes: "420px" })}
    </section>
    <section id="story" class="secondary-section" aria-labelledby="story-title">
      ${heading("Personal story", "A Longstanding Curiosity", "", "story-title")}
      ${career.map(({ id, job, period, place, headline, summary }) => {
        const employer = experience.find((entry) => entry.id === job);
        return `<article class="secondary-card" id="story-${e(id)}" tabindex="-1"><p class="case-label">${e(employer?.company || place || period)}</p>
        <h3>${e(headline)}</h3><p>${e(summary)}</p>${id === "first-program" ? demo("calculator") : ""}</article>`;
      }).join("")}
      <article class="secondary-card"><h3>Learning to lead</h3>${growth.map((p) => `<p>${e(p)}</p>`).join("")}</article>
      <article class="secondary-card"><h3>Influences</h3>${influences.map(({ name, body }) => `<h4>${e(name)}</h4><p>${e(body)}</p>`).join("")}</article>
    </section>
    <section id="workshop" class="secondary-section">
      ${heading("Outside work", "The Workshop")}
      <div class="secondary-card">
        ${photography(assets, "workshop-hardware", { expandable: true, sizes: "400px" })}
        ${workshop.map(({ title, body }) => `<h3>${e(title)}</h3><p>${e(body)}</p>`).join("")}
      </div>
    </section>
    <section id="resume" class="secondary-section resume" tabindex="-1">
      ${heading("Career and education", "Résumé")}
      <div class="actions">${external(profile.resume, "Open résumé PDF", "button button-primary")}<button class="button button-outline" type="button" data-print>Print or save PDF</button></div>
      <article class="secondary-card">
        <h3>Experience</h3><ol class="resume-list">${experience.map(experienceItem).join("")}</ol>
        <h3>Education</h3><ul class="resume-list">${qualifications}</ul>
        ${photography(assets, "iit-guwahati-certificate", { expandable: true, sizes: "500px" })}
        <h3>Recognition</h3><ul class="resume-list">${content.recognition.filter(({ sample }) => !sample).map(({ title, issuer, body }) => `<li><h4>${e(title)} · ${e(issuer)}</h4><p>${e(body)}</p></li>`).join("")}</ul>
        ${["dp-world-kudos-2023", "google-assistant-2018"].map((id) => photography(assets, id, { expandable: true, sizes: "380px" })).join("")}
      </article>
    </section>
  </div>`;
}
