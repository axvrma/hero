import { escape as e } from "../../scripts/lib/content.mjs";
import { skills } from "../../content/personal-folio.mjs";
import { projectImage } from "./ui.mjs";

const screenshot = {
  src: "/images/atlas-workspace-720.webp", width: 720, height: 396,
  alt: "Atlas visual workflow editor with its node graph and run inspector",
};

function example(label, title, rows) {
  return `<div class="example-window" aria-hidden="true"><div class="example-chrome"><i></i><i></i><i></i><span>${e(label)}</span></div>
  <div class="example-body"><strong>${e(title)}</strong>${rows.map(([name, detail]) => `<div><span>${e(name)}</span><span>${e(detail)}</span></div>`).join("")}</div></div>`;
}

export function caseArt(kind, content) {
  switch (kind) {
    case "invoice": return example("Workflow illustration", "Invoice processing", [["01 · Invoice received", "Complete"], ["02 · Data extraction", "Complete"], ["03 · Review", "In progress"], ["04 · Downstream posting", "Queued"]]);
    case "nurtr": return example("Product illustration", "Progressive web app", [["Course discovery", "Frontend"], ["Learning experience", "PWA"], ["Customer operations", "CRM"]]);
    case "boxbay": return `<div class="container-demo" aria-hidden="true"><span>BoxBay AI · Prototype</span><div class="container-rows">${"<i></i>".repeat(28)}</div><span>Simulated yard · Placement and retrieval</span></div>`;
    case "hackathons": return projectImage(content.hackathons.find(({ id }) => id === "paytm-hackathon").preview);
  }
  return "";
}

const skillGlyphs = ["◫", "⚛", "✦", "⬡", "↳", "✧", "▦", "◈", "◇", "⌁", "⊞", "⌘"];
const skillCard = (skill, index) => `<li><span>${skillGlyphs[index]}</span>${e(skill)}</li>`;

export function serviceArt(id) {
  if (id === "product") return `<div class="service-visual product-art">${projectImage({ src: "/images/servio-720.webp", width: 720, height: 405, alt: "Servio dashboard showing a local development workspace" })}</div>`;
  if (id === "frontend") return `<div class="service-visual frontend-art">${projectImage(screenshot)}</div>`;
  if (id === "ai") return '<div class="service-visual model-art" aria-hidden="true"><div class="model-line"><i></i><i></i><i></i></div><span>✧</span></div>';
  return `<div class="service-visual architecture-art" aria-hidden="true">${[0, 1].map((column) => {
    const cards = skills.map((skill, index) => index % 2 === column ? skillCard(skill, index) : "").join("");
    return `<div class="skill-column"><ul>${cards}</ul><ul>${cards}</ul></div>`;
  }).join("")}</div>`;
}
