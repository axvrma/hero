import { test } from "node:test";
import assert from "node:assert/strict";
import {
  escape,
  safeUrl,
  slug,
  cleanLegacy,
  normalize,
  fetchDatabase,
  resolveOrigin,
  databases,
} from "../scripts/lib/content.mjs";
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
  assert.equal(slug("../../Test <thing>"), "test-thing");
});
test("Notion transforms handle missing fields and archived data", () => {
  assert.deepEqual(normalize("projects", [{ properties: {} }]), []);
  assert.deepEqual(
    normalize("experience", [{ archived: true, properties: {} }]),
    [],
  );
  assert.deepEqual(
    normalize("skills", [
      { properties: { Category: { title: [{ plain_text: "Languages" }] } } },
    ]),
    [{ category: "Languages", tags: [] }],
  );
});
test("Notion pagination preserves every record and applies the mapped database", async () => {
  const calls = [];
  const result = await fetchDatabase(
    databases.projects,
    "test",
    async (url, options) => {
      calls.push(JSON.parse(options.body));
      return Response.json(
        calls.length === 1
          ? { results: [{ id: "a" }], has_more: true, next_cursor: "next" }
          : { results: [{ id: "b" }], has_more: false },
      );
    },
  );
  assert.equal(result.length, 2);
  assert.equal(calls[1].start_cursor, "next");
});
test("Notion retries a missing Order field and reports inaccessible databases", async () => {
  let count = 0;
  await fetchDatabase("id", "test", async (_url, options) => {
    count++;
    if (count === 1) return Response.json({}, { status: 400 });
    assert.equal(JSON.parse(options.body).sorts, undefined);
    return Response.json({ results: [], has_more: false });
  });
  assert.equal(count, 2);
  await assert.rejects(
    () =>
      fetchDatabase(
        "id",
        "test",
        async () => new Response("", { status: 403 }),
      ),
    /HTTP 403/,
  );
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
test("original career recognition and contact channels remain in the fallback", async () => {
  const snapshot = JSON.parse(await readFile("content/fallback.json", "utf8"));
  assert.equal(snapshot.achievements.length, 4);
  assert.ok(snapshot.profile.instagram);
  assert.ok(snapshot.profile.phone);
});
