import { readFile, mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import { career, principles } from "../content/editorial.mjs";
import { enterpriseCases } from "../content/enterprise.mjs";
import { editorialAssets, impactMetrics } from "../content/publication.mjs";
import { availableAssets, publishedMetrics, validateEditorial } from "../scripts/lib/publication.mjs";
import { impact, photography, selectedImpact } from "../src/components/editorial.mjs";
import { calculateExpression, elapsedTime } from "../src/calculations.mjs";

test("career chapters reference employment once with a single ordered DP World progression", async () => {
  const content = JSON.parse(await readFile("content/portfolio.json", "utf8"));
  const current = validateEditorial(content, career, enterpriseCases, principles, impactMetrics);
  assert.equal(current.id, "dp-world");
  assert.deepEqual(current.progression.map(({ role }) => role), ["SDE II", "Group SDE II", "Senior Software Engineer"]);
  assert.match(content.experience.find(({ id }) => id === "nurtr").duration, /^January 2018/);
  assert.match(content.experience.find(({ id }) => id === "iris").duration, /^March 2020/);
  assert.throws(() => validateEditorial(content, career.slice(0, 4), enterpriseCases, principles, impactMetrics), /disagree/);
});

test("only verified and approved complete metrics reach the renderer", () => {
  assert.deepEqual(publishedMetrics(impactMetrics), []);
  assert.ok(impactMetrics.every(({ value }) => value === null));
  const fixture = {
    ...impactMetrics[0], value: 1234, unit: "test units", label: "Test metric",
    scope: "Fictional inputs", baseline: "Fixture baseline", outcome: "Fixture outcome",
    attribution: "Fixture team", evidence: "Fixture public evidence",
  };
  const output = impact({ metrics: publishedMetrics([fixture]) });
  assert.doesNotMatch(output, /1234|Test metric|Fixture/);
  assert.doesNotMatch(selectedImpact({ metrics: publishedMetrics([fixture]) }), /1234|Test metric|Fixture/);
  assert.match(output, /Less manual invoice processing/);
  assert.throws(() => publishedMetrics([{ ...fixture, publication: "approved" }]), /Incomplete public metric/);
  const approved = publishedMetrics([{ ...fixture, publication: "approved", verification: "verified" }]);
  assert.match(impact({ metrics: approved }), /1234 test units/);
  assert.match(selectedImpact({ metrics: approved }), /1234 test units/);
});

test("missing approved photos are omitted and present approved photos escape user-facing fields", async () => {
  const root = await mkdtemp(join(tmpdir(), "axvrma-assets-"));
  try {
    const asset = { ...editorialAssets[0], alt: 'Portrait "sample"', rights: "cleared", publication: "approved" };
    const missing = await availableAssets([asset], root);
    assert.equal(photography(missing, asset.id), "");
    await mkdir(join(root, "images/portraits"), { recursive: true });
    await writeFile(join(root, "." + asset.path), "test fixture");
    const available = await availableAssets([asset], root);
    assert.match(photography(available, asset.id), /Portrait &quot;sample&quot;/);
    assert.doesNotMatch(photography(available, asset.id), /srcset=/);
    await assert.rejects(availableAssets([{ ...asset, publication: "pending" }], root), /Unapproved photo/);
    await writeFile(join(root, "." + asset.variants[0].path), "test fixture variant");
    const responsive = await availableAssets([asset], root);
    const image = photography(responsive, asset.id, { priority: true, sizes: "90vw" });
    assert.match(image, /hero-portrait-480\.webp 480w, \/images\/portraits\/hero-portrait\.webp 1080w/);
    assert.doesNotMatch(image, /hero-portrait-768\.webp/);
    assert.match(image, /sizes="90vw".*width="1080" height="1440" loading="eager" fetchpriority="high"/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("the editorial manifest publishes supplied cleared derivatives and keeps pending assets out", async () => {
  const available = await availableAssets(editorialAssets);
  assert.deepEqual([...available.keys()], ["professional-portrait", "casual-portrait", "san-francisco-portrait", "google-assistant-2018", "workshop-hardware"]);
  assert.equal(available.get("professional-portrait").provenance, "ai-assisted-portrait");
  assert.match(photography(available, "professional-portrait"), /<figcaption>AI-assisted portrait<\/figcaption>/);
  assert.equal(available.get("san-francisco-portrait").width, 420);
  assert.equal(available.get("san-francisco-portrait").variants.length, 0);
});

test("certificate derivatives require both approval and reviewed redaction, including orphan variants", async () => {
  const root = await mkdtemp(join(tmpdir(), "axvrma-certificates-"));
  const asset = editorialAssets.find(({ id }) => id === "iit-guwahati-certificate");
  const folder = join(root, "images/recognition");
  const fixture = (file) => writeFile(join(root, "." + file), "fixture");
  try {
    await mkdir(folder, { recursive: true });
    assert.equal(asset.redaction, "visually-verified");
    assert.equal(photography(await availableAssets([asset], root), asset.id), "");
    await fixture(asset.variants[0].path);
    await assert.rejects(availableAssets([asset], root), /Unapproved photo/);
    const approved = { ...asset, publication: "approved", rights: "cleared" };
    await assert.rejects(availableAssets([approved], root), /Invalid editorial asset/);
    await fixture(asset.path);
    await assert.rejects(availableAssets([{ ...approved, redaction: undefined }], root), /verified redaction/);
    assert.match(photography(await availableAssets([approved], root), asset.id, { expandable: true }), /aria-label="Expand certificate"/);
    await writeFile(join(folder, "original-certificate.pdf"), "fixture");
    await assert.rejects(availableAssets([approved], root), /Unregistered editorial file/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("expression parser handles precedence, grouping, unary operations and rejects syntax safely", () => {
  for (const [input, expected] of [
    ["2 + 3 × 4", 14], ["(2 + 3) * 4", 20], ["24÷3÷2", 4],
    ["2+-3*4", -10], ["(12 + 3) × 4", 60], [".25 + 1.5", 1.75],
  ]) assert.equal(calculateExpression(input), expected);
  for (const input of ["", "3 +", "1 2", "(1+2", "2(3)", "1.2.3", "alert(1)", "1".repeat(161)]) {
    assert.throws(() => calculateExpression(input), /complete expression/);
  }
  assert.throws(() => calculateExpression("3/(2-2)"), /Division by zero/);
});

test("elapsed time validates calendar dates, future dates and elapsed units", () => {
  const now = new Date(2024, 1, 29, 13, 2, 5);
  assert.deepEqual(elapsedTime("2024-02-29", now), { days: 0, hours: 13, minutes: 782, seconds: 46925 });
  for (const value of ["", "2023-02-29", "2024-02-30", "0000-01-01", "2024-2-9"]) {
    assert.throws(() => elapsedTime(value, now), /valid starting date/);
  }
  assert.throws(() => elapsedTime("2024-03-01", now), /past or today/);
});
