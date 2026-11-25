import "dotenv/config";
import { readFile, access, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { escape, resolveOrigin } from "./lib/content.mjs";
const origin = resolveOrigin();
const routes = JSON.parse(await readFile(".generated/routes.json", "utf8"));
const redirects = JSON.parse(
  await readFile(".generated/redirects.json", "utf8"),
);
const routePaths = new Set(routes.map((r) => r.path));
const errors = [];
if (routePaths.size !== 3 || !["/", "/work", "/about"].every((path) => routePaths.has(path))) {
  errors.push("Expected exactly three canonical pages");
}
const emitted = (await readdir("dist", { recursive: true })).filter((file) => file.endsWith(".html")).sort();
if (emitted.join() !== ["404.html", "about.html", "index.html", "work.html"].join()) {
  errors.push(`Unexpected HTML output: ${emitted.join(", ")}`);
}
const htmlByRoute = new Map();
for (const route of routes) {
  const path = route.path === "/" ? "dist/index.html" : `dist${route.path}.html`;
  const html = await readFile(path, "utf8");
  htmlByRoute.set(route.path, html);
  if ((html.match(/<h1\b/g) || []).length !== 1)
    errors.push(`${path}: expected one h1`);
  if (!html.includes('<meta name="description"'))
    errors.push(`${path}: missing description`);
  const expectedUrl = origin
    ? escape(origin + (route.path === "/" ? "/" : route.path))
    : undefined;
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  const socialUrl = html.match(/<meta\b[^>]*property="og:url"[^>]*content="([^"]+)"/)?.[1];
  if (canonical !== expectedUrl)
    errors.push(`${path}: canonical URL does not match the configured deployment URL`);
  if (socialUrl !== expectedUrl)
    errors.push(`${path}: Open Graph URL does not match the configured deployment URL`);
  if (/<!-- (META|BODY|HEADER|FOOTER) -->/.test(html))
    errors.push(`${path}: unfilled template`);
  const links = [...html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)].map(([, url]) => url);
  const candidates = [...html.matchAll(/srcset="([^"]+)"/g)].flatMap(([, srcset]) =>
    srcset.split(",").map((entry) => entry.trim().split(/\s+/)[0]));
  for (const url of [...links, ...candidates]) {
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
const redirectSources = new Set();
for (const [from, to] of redirects) {
  const [path, id] = to.split("#");
  if (!routePaths.has(path)) errors.push(`Redirect ${from} has no canonical target: ${to}`);
  else if (id && !htmlByRoute.get(path).includes(`id="${id}"`)) errors.push(`Redirect ${from} has no fragment target: ${to}`);
  if (routePaths.has(from) || redirectSources.has(from)) errors.push(`Conflicting redirect source: ${from}`);
  redirectSources.add(from);
}
if (errors.length) throw Error(errors.join("\n"));
console.log(
  `Output check: ${routes.length} routes, ${redirects.length} redirects, local links and asset references passed.`,
);
