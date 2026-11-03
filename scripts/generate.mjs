import "dotenv/config";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { products as registry } from "../content/products.mjs";
import { escape as e, resolveOrigin, safeUrl } from "./lib/content.mjs";
import * as site from "../src/components/site.mjs";
const content = JSON.parse(await readFile(".generated/content.json", "utf8"));
const legacy = JSON.parse(
  await readFile("content/legacy-projects.json", "utf8"),
);
const shell = await readFile("index.html", "utf8");
const origin = resolveOrigin();
const aliases = new Map(
  registry.flatMap((p) => p.legacy.map((id) => [id, p.id])),
);
const products = registry.map((product) => {
  const cms = content.projects.find(
    (item) => item.id === product.id || product.legacy.includes(item.id),
  );
  return {
    ...product,
    ...(cms?.description ? { description: cms.description } : {}),
    ...(cms?.stack?.length ? { stack: cms.stack } : {}),
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
const routes = [
  [
    "/",
    "Software Engineer & Product Builder",
    content.profile.subtitle,
    site.home(content, products, secondary),
  ],
  [
    "/work",
    "Selected Work & Project Archive",
    "Explore Abhishek Verma’s product ecosystem: Atlas, Vibes, Envision, Servio, Prism, and twelve more engineering projects.",
    site.work(products, secondary),
  ],
  [
    "/about",
    "About Abhishek Verma",
    "About Abhishek Verma. Frontend systems, product engineering, and independent tools built with care.",
    site.about(content),
  ],
  [
    "/experience",
    "Professional Experience",
    "Professional experience in enterprise UI, micro-frontends, design systems, and workflow engineering.",
    site.experiencePage(content),
  ],
  [
    "/engineering",
    "Engineering Philosophy",
    "An approach to architecture, performance, reliability, developer experience, and accountable AI-assisted engineering.",
    site.engineeringPage(content),
  ],
  [
    "/contact",
    "Contact Abhishek Verma",
    "Have something worth building? Connect with Abhishek Verma by email, GitHub or LinkedIn.",
    site.contact(content.profile, true),
  ],
  [
    "/resume",
    "Résumé — Abhishek Verma",
    "A print-ready résumé with experience, capabilities, education and certifications.",
    site.resume(content),
  ],
  ...products.map((p) => [
    `/work/${p.id}`,
    `${p.name} — ${p.category}`,
    p.description,
    site.caseStudy(p, products),
    projectSchema(p),
  ]),
  ...secondary.map((p) => [
    `/work/${p.id}`,
    `${p.name} — Project Archive`,
    p.description,
    site.secondaryCase(p),
    projectSchema(p),
  ]),
];
await rm(".generated/site", { recursive: true, force: true });
await mkdir(".generated/site", { recursive: true });
for (const [path, title, description, body, schema] of [
  ...routes,
  [
    "/404",
    "Page not found",
    "The page you’re looking for isn’t here.",
    `<div class="shell not-found">${site.pageIntro("404 / A SMALL DETOUR", 'Nothing here.<br><span class="muted">Plenty to explore.</span>', "The page may have moved. The complete project archive is a good place to start.")}<a class="button button-primary" href="/work">Explore the work →</a></div>`,
  ],
]) {
  const canonical = origin ? origin + (path === "/" ? "/" : path) : "";
  const noindex =
    path === "/404" ||
    (process.env.CONTEXT && process.env.CONTEXT !== "production");
  const pageTitle = title.includes(content.profile.name) ? title : `${title} | ${content.profile.name}`;
  const meta = `<title>${e(pageTitle)}</title>
<meta name="description" content="${e(description)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : ""}
${canonical && path !== "/404" ? `<link rel="canonical" href="${e(canonical)}">` : ""}
<meta property="og:site_name" content="${e(content.profile.name)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${e(pageTitle)}">
<meta property="og:description" content="${e(description)}">
${canonical ? `<meta property="og:url" content="${e(canonical)}">` : ""}
<meta property="og:image" content="${origin}/social.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
${schema ? `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>` : path === "/" ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: content.profile.name, jobTitle: content.profile.role, ...(origin ? { url: origin } : {}), sameAs: [content.profile.github, content.profile.linkedin].filter((v) => safeUrl(v)) }).replace(/</g, "\\u003c")}</script>` : ""}`;
  let html = shell
    .replace("<!-- META -->", meta)
    .replace("<!-- HEADER -->", site.header(path, content.profile))
    .replace("<!-- BODY -->", body)
    .replace("<!-- FOOTER -->", site.footer(content.profile));
  const file =
    path === "/404"
      ? ".generated/site/404.html"
      : path === "/"
        ? ".generated/site/index.html"
        : `.generated/site${path}/index.html`;
  await mkdir(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  await writeFile(file, html);
}
const redirects = [
  ["/projects.html", "/work"],
  ["/projects", "/work"],
  ["/resume.html", "/resume"],
  ["/index.html", "/"],
  ...legacy.flatMap((p) => [
    [`/project-${p.id}.html`, `/work/${aliases.get(p.id) || p.id}`],
    [`/project-${p.id}`, `/work/${aliases.get(p.id) || p.id}`],
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
  `User-agent: *\n${process.env.CONTEXT && process.env.CONTEXT !== "production" ? "Disallow: /" : "Allow: /\nDisallow: /admin.html\nDisallow: /sync.html"}\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ""}`,
);
await writeFile(
  ".generated/site/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${origin ? routes.map(([path]) => `<url><loc>${e(origin + (path === "/" ? "/" : path))}</loc></url>`).join("") : ""}</urlset>\n`,
);
// Standalone historical Firestore editor and authenticated rebuild UI remain available.
for (const file of ["admin.html", "sync.html"])
  await writeFile(`.generated/site/${file}`, await readFile(file, "utf8"));
console.log(
  `Generated ${routes.length} complete static pages, a 404, and ${redirects.length} exact legacy redirects.${origin ? ` Origin: ${origin}` : " SITE_URL unset: absolute canonicals omitted."}`,
);
