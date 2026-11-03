import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
const routes = JSON.parse(await readFile(".generated/routes.json", "utf8"));
const redirects = JSON.parse(
  await readFile(".generated/redirects.json", "utf8"),
);
const routePaths = new Set(routes.map((r) => r.path));
const errors = [];
for (const route of routes) {
  const path =
    route.path === "/" ? "dist/index.html" : `dist${route.path}/index.html`;
  const html = await readFile(path, "utf8");
  if ((html.match(/<h1\b/g) || []).length !== 1)
    errors.push(`${path}: expected one h1`);
  if (!html.includes('<meta name="description"'))
    errors.push(`${path}: missing description`);
  if (html.includes("axvrma.netlify.app"))
    errors.push(`${path}: outdated origin`);
  if (/<!-- (META|BODY|HEADER|FOOTER) -->/.test(html))
    errors.push(`${path}: unfilled template`);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const url = match[1];
    if (!url.startsWith("/")) continue;
    const pathname = url.split("?")[0];
    if (routePaths.has(pathname)) continue;
    try {
      await access(resolve("dist", "." + pathname));
    } catch {
      errors.push(`${path}: missing local target ${pathname}`);
    }
  }
}
// Resolve fragment targets too, so section links cannot silently outlive their headings.
const htmlByRoute = new Map(await Promise.all(routes.map(async ({path}) => [path, await readFile(path === "/" ? "dist/index.html" : `dist${path}/index.html`, "utf8")])));
for (const [path, html] of htmlByRoute) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (ids.length !== new Set(ids).size) errors.push(`${path}: duplicate element IDs`);
  for (const [, href] of html.matchAll(/href="([^"]*#[^"]+)"/g)) {
    const url = new URL(href, `https://local.example${path}`);
    if (url.origin !== "https://local.example" || !htmlByRoute.has(url.pathname)) continue;
    const id = decodeURIComponent(url.hash.slice(1));
    if (id && !htmlByRoute.get(url.pathname).includes(`id="${id}"`)) errors.push(`${path}: missing anchor ${href}`);
  }
}
for (const [from, to] of redirects)
  if (!routePaths.has(to))
    errors.push(`Redirect ${from} has no canonical target: ${to}`);
if (errors.length) throw Error(errors.join("\n"));
console.log(
  `Output check: ${routes.length} routes, ${redirects.length} redirects, local links and asset references passed.`,
);
