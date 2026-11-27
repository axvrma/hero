import "dotenv/config";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { products as registry } from "../content/products.mjs";
import { hackathonProjects } from "../content/hackathons.mjs";
import { escape as e, resolveOrigin, safeUrl } from "./lib/content.mjs";
import * as site from "../src/components/site.mjs";
import { recognition, testimonials } from "../content/personal-folio.mjs";
import { career, motivations, principles } from "../content/editorial.mjs";
import { enterpriseCases } from "../content/enterprise.mjs";
import { editorialAssets, impactMetrics } from "../content/publication.mjs";
import { availableAssets, publishedMetrics, validateEditorial } from "./lib/publication.mjs";
const content = JSON.parse(await readFile("content/portfolio.json", "utf8"));
content.currentJob = validateEditorial(content, career, enterpriseCases, principles, impactMetrics);
content.profile.role = content.currentJob.progression.at(-1).role;
content.metrics = publishedMetrics(impactMetrics);
content.assets = await availableAssets(editorialAssets);
content.enterprise = enterpriseCases;
content.hackathons = hackathonProjects;
content.preview = process.env.CONTEXT === "deploy-preview" ||
  (process.env.CONTEXT !== "production" && process.env.PORTFOLIO_PREVIEW === "1");
content.recognition = recognition.map(({ achievement, hackathon, ...item }) => ({
  ...item,
  body: item.body ?? content.achievements[achievement]?.description ??
    hackathonProjects.find(({ id }) => id === hackathon)?.story,
}));
if (content.preview) content.recognition.push(...testimonials.map((item) => ({ ...item, sample: true })));
const licensedFont = process.env.POCKOTA_WEBFONT_PATH
  ? await readFile(process.env.POCKOTA_WEBFONT_PATH) : null;
if (licensedFont && licensedFont.subarray(0, 4).toString("ascii") !== "wOF2")
  throw Error("POCKOTA_WEBFONT_PATH must point to the licensed WOFF2 file.");
for (const { id } of registry) {
  if (!motivations[id]) throw Error(`Missing product motivation: ${id}`);
}
const legacy = JSON.parse(
  await readFile("content/legacy-projects.json", "utf8"),
);
const shell = await readFile("index.html", "utf8");
const origin = resolveOrigin();
const aliases = new Map(
  registry.flatMap((p) => p.legacy.map((id) => [id, p.id])),
);
const products = registry.map((product) => {
  const local = content.projects.find(
    (item) => item.id === product.id || product.legacy.includes(item.id),
  );
  return {
    ...product,
    ...(local?.description ? { description: local.description } : {}),
    ...(local?.stack?.length ? { stack: local.stack } : {}),
  };
});
const secondary = legacy.filter((p) => !aliases.has(p.id));
for (const p of content.projects) {
  if (aliases.has(p.id)) continue; // Brand identity, fixed URLs, technical case-study evidence and ranking remain curated.
  const previous = secondary.find((item) => item.id === p.id);
  if (previous)
    Object.assign(previous, {
      ...p,
      body: previous.body,
      source: p.source || previous.source,
      live: p.live || previous.live,
    });
  else secondary.push(p);
}
for (const { id, name, description, source, live } of hackathonProjects) {
  const archived = secondary.find((project) => project.id === id);
  if (archived) Object.assign(archived, { name, description, source, live });
}
const archiveOverrides = JSON.parse(await readFile("content/archive-overrides.json", "utf8"));
for (const project of secondary) {
  if (archiveOverrides[project.id]?.retiredLiveUrl === project.live) project.live = "";
}
const ids = new Set();
for (const p of [...products, ...secondary]) {
  if (ids.has(p.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id))
    throw Error(`Invalid or duplicate project slug: ${p.id}`);
  ids.add(p.id);
}
const projectSchema = (p) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: p.name,
  description: p.description,
  codeRepository: p.source,
  ...(p.live ? { url: p.live } : {}),
  author: { "@type": "Person", name: content.profile.name },
});
const qualification = content.education[0];
const person = {
  "@type": "Person",
  name: content.profile.name,
  jobTitle: content.profile.role,
  worksFor: { "@type": "Organization", name: content.currentJob.company },
  alumniOf: content.education.slice(0, 2).map(({ institution }) => ({
    "@type": "EducationalOrganization", name: institution,
  })),
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: qualification.degree,
    credentialCategory: "Postgraduate certification",
    recognizedBy: { "@type": "EducationalOrganization", name: qualification.institution },
    description: `Conducted jointly with ${qualification.partner}. Specialisations in ${qualification.specialisations.join(" and ")}. Programme dates ${qualification.duration}. Completed ${qualification.completion}.`,
  },
  ...(origin ? { url: `${origin}/` } : {}),
  sameAs: [content.profile.github, content.profile.linkedin].filter((url) => safeUrl(url)),
};
const profileSchema = { "@context": "https://schema.org", "@type": "ProfilePage", mainEntity: person };
const routes = [
  ["/", "Senior Software Engineer and Product Builder", `${content.profile.name} is a ${content.profile.role} at ${content.currentJob.company}, building enterprise systems and independent products.`, site.home(content, products), profileSchema],
  ["/work", "Enterprise work and independent products", "Engineering case studies, seven independent products, and experiments by Abhishek Verma.", site.work(content, products, secondary),
    { "@context": "https://schema.org", "@type": "ItemList", itemListElement: products.map((p, index) => ({
      "@type": "ListItem", position: index + 1, item: { ...projectSchema(p), ...(origin ? { "@id": `${origin}/work#${p.id}` } : {}) },
    })) }],
  ["/about", "About Abhishek Verma", "From a first home computer to enterprise engineering, AI and a personal workshop. The story and résumé of Abhishek Verma.", site.about(content), profileSchema],
];
await rm(".generated/site", { recursive: true, force: true });
await mkdir(".generated/site", { recursive: true });
if (licensedFont) {
  await mkdir(".generated/site/licensed-font", { recursive: true });
  await writeFile(".generated/site/licensed-font/pockota-medium.woff2", licensedFont);
  await writeFile(".generated/site/licensed-font/pockota.css",
    '@font-face { font-family: "Pockota Medium"; src: url("./pockota-medium.woff2") format("woff2"); font-weight: 400; font-style: normal; font-display: swap; } :root { --licensed-heading-font: "Pockota Medium", Fraunces, Georgia, serif; --licensed-heading-weight: 400; }');
}
for (const [path, title, description, body, schema] of [
  ...routes,
  [
    "/404",
    "Page not found",
    "The page you’re looking for isn’t here.",
    `<section class="page-top not-found"><div class="shell">${site.pageIntro("404", "Page not found", "Explore the work or return home.")}<div class="actions"><a class="button button-primary" href="/work">Explore the work</a><a class="button button-outline" href="/">Back home</a></div></div></section>`,
  ],
]) {
  const canonical = origin ? origin + (path === "/" ? "/" : path) : "";
  const noindex =
    path === "/404" || content.preview ||
    !origin || (process.env.CONTEXT && process.env.CONTEXT !== "production");
  const pageTitle = title.includes(content.profile.name) ? title : `${title} | ${content.profile.name}`;
  const meta = `${licensedFont ? '<link rel="stylesheet" href="/licensed-font/pockota.css">' : ""}
<title>${e(pageTitle)}</title>
<meta name="description" content="${e(description)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : ""}
${canonical && path !== "/404" ? `<link rel="canonical" href="${e(canonical)}">` : ""}
<meta property="og:site_name" content="${e(content.profile.name)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${e(pageTitle)}">
<meta property="og:description" content="${e(description)}">
${canonical ? `<meta property="og:url" content="${e(canonical)}">` : ""}
<meta property="og:image" content="${e(origin)}/social.png">
<meta property="og:image:alt" content="${e(`${content.profile.name}, ${content.profile.role} at ${content.currentJob.company}`)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
${schema ? `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>` : ""}`;
  const html = shell
    .replace("<!-- META -->", () => meta)
    .replace("<!-- HEADER -->", () => site.header(path, content.profile))
    .replace("<!-- BODY -->", () => body)
    .replace("<!-- FOOTER -->", () => site.footer(content.profile));
  const file = path === "/" ? "index.html" : `${path.slice(1)}.html`;
  await writeFile(`.generated/site/${file}`, html);
}
const redirects = [
  ["/projects.html", "/work"],
  ["/projects", "/work"],
  ["/index.html", "/"],
  ["/work/index.html", "/work"],
  ["/about/index.html", "/about"],
  ["/work.html", "/work"],
  ["/about.html", "/about"],
  ["/experience", "/#journey"],
  ["/engineering", "/#principles"],
  ["/contact", "/#contact"],
  ["/resume", "/about#resume"],
  ["/resume.html", "/about#resume"],
  ["/story", "/about#story"],
  ["/lab", "/about#workshop"],
  ...enterpriseCases.map(({ id }) => [`/experience/${id}`, `/work#${id}`]),
  ...products.map(({ id }) => [`/work/${id}`, `/work#${id}`]),
  ...secondary.map(({ id }) => [`/work/${id}`, `/work#${id}`]),
  ...registry.flatMap((p) => p.legacy.filter((id) => id !== p.id).map((id) => [`/work/${id}`, `/work#${p.id}`])),
  ...legacy.flatMap(({ id }) => [
    [`/project-${id}.html`, `/work#${aliases.get(id) || id}`],
    [`/project-${id}`, `/work#${aliases.get(id) || id}`],
  ]),
];
await writeFile(
  ".generated/routes.json",
  JSON.stringify(
    routes.map(([path, title]) => ({ path, title })),
    null,
    2,
  ) + "\n",
);
await writeFile(
  ".generated/redirects.json",
  JSON.stringify(redirects, null, 2) + "\n",
);
await writeFile(
  ".generated/site/_redirects",
  redirects.map(([from, to]) => `${from} ${to} 301!`).join("\n") + "\n",
);
await writeFile(
  ".generated/site/robots.txt",
  `User-agent: *\n${!origin || content.preview || (process.env.CONTEXT && process.env.CONTEXT !== "production") ? "Disallow: /" : "Allow: /"}\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ""}`,
);
await writeFile(
  ".generated/site/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${origin ? routes.map(([path]) => `<url><loc>${e(origin + (path === "/" ? "/" : path))}</loc></url>`).join("") : ""}</urlset>\n`,
);
console.log(
  `Generated ${routes.length} complete static pages, a 404, and ${redirects.length} exact legacy redirects.${origin ? ` Origin: ${origin}` : " SITE_URL unset: absolute canonicals omitted."}`,
);
