import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const checker = fileURLToPath(new URL("../scripts/check-output.mjs", import.meta.url));
async function check({ origin, socialOrigin = origin, env = {}, dotenv = "" }) {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-output-"));
  try {
    await mkdir(join(directory, ".generated"));
    await mkdir(join(directory, "dist"));
    await writeFile(join(directory, ".generated/routes.json"), JSON.stringify([{ path: "/" }]));
    await writeFile(join(directory, ".generated/redirects.json"), "[]");
    if (dotenv) await writeFile(join(directory, ".env"), dotenv);
    await writeFile(join(directory, "dist/index.html"), `<!doctype html><html><head>
      <meta name="description" content="Portfolio">
      ${origin ? `<link rel="canonical" href="${origin}/">` : ""}
      ${socialOrigin ? `<meta property="og:url" content="${socialOrigin}/">` : ""}
      </head><body><h1>Abhishek Verma</h1></body></html>`);
    return spawnSync(process.execPath, [checker], {
      cwd: directory,
      env: { ...process.env, SITE_URL: "", URL: "", CONTEXT: "", DEPLOY_PRIME_URL: "", ...env },
      encoding: "utf8",
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("output check accepts Netlify's production URL without a custom domain", async () => {
  const result = await check({ origin: "https://axvrma.netlify.app", env: { CONTEXT: "production", URL: "https://axvrma.netlify.app" } });
  assert.equal(result.status, 0, result.stderr);
});

test("output check follows SITE_URL instead of Netlify's default URL", async () => {
  const result = await check({ origin: "https://portfolio.example", env: { CONTEXT: "production", URL: "https://axvrma.netlify.app", SITE_URL: "https://portfolio.example" } });
  assert.equal(result.status, 0, result.stderr);
});

test("output check rejects a stale canonical when a custom origin is configured", async () => {
  const result = await check({ origin: "https://axvrma.netlify.app", env: { CONTEXT: "production", URL: "https://axvrma.netlify.app", SITE_URL: "https://portfolio.example" } });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /canonical URL does not match/);
});

test("output check uses the preview URL even with a production SITE_URL", async () => {
  const result = await check({ origin: "https://deploy-preview-1--axvrma.netlify.app", env: { CONTEXT: "deploy-preview", SITE_URL: "https://portfolio.example", DEPLOY_PRIME_URL: "https://deploy-preview-1--axvrma.netlify.app" } });
  assert.equal(result.status, 0, result.stderr);
});

test("output check loads local SITE_URL from dotenv consistently with generation", async () => {
  const result = await check({ origin: "https://portfolio.example", env: { SITE_URL: undefined }, dotenv: "SITE_URL=https://portfolio.example\n" });
  assert.equal(result.status, 0, result.stderr);
});

test("output check accepts local pages without absolute metadata", async () => {
  const result = await check({});
  assert.equal(result.status, 0, result.stderr);
});

test("output check catches stale Open Graph URLs independently of canonical", async () => {
  const result = await check({ origin: "https://portfolio.example", socialOrigin: "https://axvrma.netlify.app", env: { SITE_URL: "https://portfolio.example" } });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Open Graph URL does not match/);
  assert.doesNotMatch(result.stderr, /canonical URL does not match/);
});
