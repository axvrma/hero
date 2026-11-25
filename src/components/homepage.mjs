import { escape as e } from "../../scripts/lib/content.mjs";
import { hackathonProjects } from "../../content/hackathons.mjs";
import { diagonal, mark } from "./icons.mjs";
import { companyLogo, photoImage } from "./editorial.mjs";
import { external, sectionIntro } from "./ui.mjs";

const employerIds = ["dp-world", "airtel", "iris", "nurtr", "urstylecoach"];

export function brandMarquee(content) {
  const employers = employerIds.map((id) => content.experience.find((job) => job.id === id));
  const items = (tag) => employers.map(({ id, company }) => {
    const logo = companyLogo(content.assets, id);
    const relationship = id === content.currentJob.id ? "Current employer" : id === "urstylecoach" ? "Design internship" : "Former employer";
    return `<${tag} class="brand-item">${logo}<strong${logo ? ' class="sr-only"' : ""}>${e(company)}</strong><span class="brand-relation">${relationship}</span></${tag}>`;
  }).join("");
  return `<section class="brand-section" aria-labelledby="brand-title" data-marquee>
    <div class="brand-heading"><h2 id="brand-title"><a href="/experience#journey">My professional journey.</a></h2>
      <button class="brand-toggle" type="button" aria-controls="brand-window" hidden>Pause marquee</button>
    </div>
    <div class="brand-window" id="brand-window" role="region" aria-label="Employment history" tabindex="0">
      <div class="brand-track">
        <ul class="brand-list" role="list">${items("li")}</ul>
        <div class="brand-list brand-copy" aria-hidden="true" inert>${items("div")}</div>
      </div>
    </div>
  </section>`;
}

const milestones = [
  { id: "dp-world-kudos-2023", layout: "award", title: "Recognition for engineering excellence.", caption: "DP World · Kudos Award · 2023", href: "/experience#achievements", sizes: "(max-width: 720px) 90vw, (max-width: 1440px) 50vw, 725px" },
  { id: "google-assistant-2018", layout: "google", title: "An early milestone.", caption: "Google Assistant developer recognition · 2018", href: "/story#story-recognition", sizes: "(max-width: 480px) 90vw, (max-width: 720px) 46vw, (max-width: 1440px) 37vw, 530px" },
  { id: "iit-guwahati-certificate", layout: "credential", title: "Back to being a student.", href: "/experience#education", sizes: "(max-width: 480px) 82vw, (max-width: 720px) 42vw, (max-width: 1440px) 31vw, 450px" },
  { id: "san-francisco-portrait", layout: "personal", title: "Beyond the code.", caption: "Engineer. Builder. Explorer.", href: "/story#story-beyond" },
  { id: "workshop-hardware", layout: "workshop", title: "The Workshop.", caption: "My playground for experimentation.", href: "/lab", sizes: "(max-width: 480px) 46vw, (max-width: 720px) 44vw, (max-width: 1440px) 29vw, 420px" },
];

function proofArtwork(layout, qualification) {
  if (layout === "award") return `<div class="proof-award-art" aria-hidden="true">
    <svg viewBox="0 0 600 330" preserveAspectRatio="xMidYMid slice" fill="none"><g stroke="currentColor">
      <circle cx="470" cy="184" r="138"/><circle cx="470" cy="184" r="103"/><circle cx="470" cy="184" r="69"/>
      <path d="M313 184h314M470 25v318M348 284 577 60"/><circle cx="470" cy="184" r="8" fill="currentColor"/>
    </g></svg><span>DP World</span><strong>2023</strong>
  </div>`;
  if (layout === "credential") return `<div class="proof-credential-art">
    <p class="mono">${e(qualification.shortInstitution)}</p>
    <strong>${e(qualification.shortDegree)}</strong>
    <p>Explainable AI · Cybersecurity</p>
  </div>`;
  return "";
}

export function visualProof(content) {
  const qualification = content.education[0];
  return `<section class="editorial-section visual-proof" id="journey" aria-labelledby="proof-title">
    ${sectionIntro("Milestones", "A journey worth building.", "", "proof-title")}
    <div class="proof-grid" id="achievements">${milestones.map(({ id, layout, title, caption, href, sizes }) => {
      const credential = layout === "credential";
      const asset = content.assets.get(id);
      const photo = asset && photoImage(asset, { expandable: credential, sizes });
      const artwork = photo || proofArtwork(layout, qualification);
      return `<figure class="proof-tile proof-${layout}${photo ? " has-proof-photo" : ""}">
        ${artwork ? `<div class="proof-media">${artwork}</div>` : ""}
        <figcaption class="proof-caption">
          <h3><a href="${href}">${e(title)} ${diagonal}</a></h3>
          ${credential ? (photo ? `<p>${e(asset.caption)}</p><p>${e(qualification.shortInstitution)} · Explainable AI · Cybersecurity</p>` : "") : `<p>${e(caption)}</p>`}
        </figcaption>
      </figure>`;
    }).join("")}</div>
    <div class="recognition-associations">
      <h3>Recognition and learning</h3>
      <ul role="list">
        <li><a href="/experience#achievements">Airtel Star Performer · 2021</a></li>
        <li><a href="/experience#achievements">Major League Hacking winner · 2020</a></li>
        <li><a href="/lab#hackathons">Microsoft GitTogether · Winner</a></li>
        <li><a href="/lab#hackathons">Paytm Hackathon · Finalist</a></li>
        <li><a href="/experience#education">Emeritus · Programme partner</a></li>
      </ul>
    </div>
  </section>`;
}

export function productArchive(products, motivations) {
  return `<ul class="home-product-archive" aria-label="More flagship products" role="list">${products.map((p) => `
    <li><a class="${e(p.id)}" href="/work/${e(p.id)}">${mark(p.id, 21)}<span><strong>${e(p.name)}</strong><span>${e(motivations[p.id].headline)}</span></span>${diagonal}</a></li>`).join("")}</ul>`;
}

export function personalTeaser() {
  const [winner, finalist] = hackathonProjects;
  return `<section class="editorial-section beyond-section">
    <div class="beyond-story">
      ${sectionIntro("Personal story", "It all started with a question.", "From the first family computer to engineering for a living. I still tinker with self-hosting, Raspberry Pi, Android ROMs and local AI in the Workshop.")}
      <div class="beyond-links"><a class="button button-primary" href="/story">Read my story</a><a class="button button-outline" href="/lab">Visit the Workshop</a></div>
    </div>
    <section class="beyond-hackathons" id="hackathons" aria-labelledby="home-hackathons-title" tabindex="-1">
      <p class="eyebrow">Hackathons</p>
      <h2 id="home-hackathons-title">Built under pressure.</h2>
      <p>${e(winner.result)} at Microsoft GitTogether · ${e(finalist.result)} at Paytm</p>
      <div class="beyond-links">${external(winner.live, "Live Demo", "text-link", winner.name)}<a class="text-link" href="/lab#hackathons">All hackathon builds ${diagonal}</a></div>
    </section>
  </section>`;
}
