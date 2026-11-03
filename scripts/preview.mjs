import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("dist");
const arg = process.argv.indexOf("--port");
const port = Number(
  process.env.PORT || (arg >= 0 ? process.argv[arg + 1] : 4173),
);
const redirects = (await readFile(resolve(root, "_redirects"), "utf8"))
  .trim()
  .split("\n")
  .map((line) => line.split(/\s+/));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json",
};
// Apply the checked-in Netlify header definitions to local artifact QA.
const rules = [];
let rule;
for (const line of (await readFile("netlify.toml", "utf8")).split("\n")) {
  if (line.trim() === "[[headers]]") {
    rule = {};
    rules.push(rule);
  }
  if (!rule) continue;
  const field = line.match(/^\s*([\w-]+)\s*=\s*"(.*)"\s*$/);
  if (field) rule[field[1]] = field[2];
}
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    for (const rule of rules) {
      const pattern = rule.for;
      if (!pattern) continue;
      if (
        pattern.endsWith("*")
          ? pathname.startsWith(pattern.slice(0, -1))
          : pathname === pattern
      )
        for (const [key, value] of Object.entries(rule))
          if (key !== "for") res.setHeader(key, value);
    }
    const redirect = redirects.find(([from]) => from === pathname);
    if (redirect) {
      res.writeHead(301, { Location: redirect[1] });
      res.end();
      return;
    }
    let file = resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
      await stat(file);
    } catch {
      file = resolve(root, "404.html");
      res.statusCode = 404;
    }
    const body = await readFile(file);
    res.setHeader(
      "Content-Type",
      mime[extname(file)] || "application/octet-stream",
    );
    res.setHeader("Content-Length", body.length);
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(400);
    res.end("Bad request");
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Abhishek Verma production preview: http://127.0.0.1:${port}`),
);
