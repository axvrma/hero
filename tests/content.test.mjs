import { test } from "node:test";
import assert from "node:assert/strict";
import { escape, safeUrl, cleanLegacy, resolveOrigin } from "../scripts/lib/content.mjs";
import { products } from "../content/products.mjs";
import { readFile } from "node:fs/promises";
test("flagships retain editorial order, required live URLs and original repository identities", () => {
  assert.deepEqual(
    products.map((p) => p.id),
    ["atlas", "vibes", "envision", "servio", "prism"],
  );
  for (const p of products) {
    assert.equal(p.live, `https://${p.id}.axvrma.com`);
    assert.ok(p.sections.length >= 5);
    assert.ok(p.architecture.length);
    assert.ok(p.evidence.length);
  }
  assert.equal(products[2].source, "https://github.com/axvrma/vox-ar");
  assert.equal(
    products[4].source,
    "https://github.com/axvrma/azure-devops-pr-helper",
  );
});
test("text, external URLs and archived HTML resist content injection", () => {
  assert.equal(
    escape('<img a="x">&\''),
    "&lt;img a=&quot;x&quot;&gt;&amp;&#39;",
  );
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "https://user:password@example.com",
    "//example.com",
  ])
    assert.equal(safeUrl(url), "");
  const html = cleanLegacy(
    '<h1>Title</h1><script>alert(1)</script><img src=x onerror="alert(1)"><a href="javascript:alert(1)">bad</a><p onclick="alert(1)">safe</p>',
  );
  assert.equal(html, "<h2>Title</h2><a>bad</a><p>safe</p>");
});
test("canonicals use explicit production origin and preview identity", () => {
  assert.equal(resolveOrigin({}), "");
  assert.equal(
    resolveOrigin({ SITE_URL: "https://portfolio.example" }),
    "https://portfolio.example",
  );
  assert.equal(
    resolveOrigin({
      CONTEXT: "deploy-preview",
      SITE_URL: "https://production.example",
      DEPLOY_PRIME_URL: "https://preview.example",
    }),
    "https://preview.example",
  );
  assert.throws(() => resolveOrigin({ SITE_URL: "javascript:alert(1)" }));
  assert.throws(() => resolveOrigin({ SITE_URL: "https://example.com/path" }));
});
test("all sixteen legacy case studies are preserved with exact identity", async () => {
  const legacy = JSON.parse(
    await readFile("content/legacy-projects.json", "utf8"),
  );
  assert.equal(legacy.length, 16);
  assert.equal(new Set(legacy.map((p) => p.id)).size, 16);
  for (const p of legacy) assert.ok(p.body && p.source);
});
test("original career recognition and contact channels remain in local portfolio content", async () => {
  const snapshot = JSON.parse(await readFile("content/portfolio.json", "utf8"));
  assert.equal(snapshot.achievements.length, 4);
  assert.ok(snapshot.profile.instagram);
  assert.ok(snapshot.profile.phone);
});
