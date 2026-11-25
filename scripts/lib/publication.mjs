import { lstat, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const editorialDirectories = ["portraits", "journey", "recognition", "workshop", "brands"];
const imagePath = /^\/images\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(?:webp|avif|jpg|png)$/;

async function optionalFile(path) {
  try {
    return await lstat(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

export function publishedMetrics(metrics) {
  const approved = metrics.filter(({ publication }) => publication === "approved");
  const byId = new Map(approved.map((metric) => [metric.id, metric]));

  return approved.map((metric) => {
    const required = [metric.unit, metric.label, metric.scope, metric.baseline, metric.outcome,
      metric.organization, metric.attribution, metric.evidence, metric.clearance];
    if (!required.every((value) => typeof value === "string" && value.trim())) {
      throw Error(`Incomplete public metric: ${metric.id}`);
    }
    if (metric.verification === "derived") {
      const source = byId.get(metric.derivedFrom);
      if (!source?.comparison || source.project !== metric.project || source.employer !== metric.employer ||
          source.verification === "derived" || metric.unit !== "%") {
        throw Error(`Derived metric requires approved source inputs: ${metric.id}`);
      }
      const { before, after } = source.comparison;
      return { ...metric, value: Math.round((1 - after / before) * 1000) / 10, sourceVerification: source.verification };
    }
    if (!["verified", "owner-reported", "independently-audited"].includes(metric.verification) || !Number.isFinite(metric.value) || metric.value < 0) {
      throw Error(`Incomplete public metric: ${metric.id}`);
    }
    if (metric.comparison) {
      const { before, after } = metric.comparison;
      if (!Number.isFinite(before) || before <= 0 || !Number.isFinite(after) ||
          after < 0 || after > before || metric.value !== after || metric.unit !== "minutes") {
        throw Error(`Invalid approved time comparison: ${metric.id}`);
      }
    }
    return metric;
  });
}

export async function availableAssets(assets, root = "public") {
  const files = new Map();
  const registered = new Set();
  const ids = new Set();
  for (const asset of assets) {
    if (ids.has(asset.id)) throw Error(`Duplicate editorial asset: ${asset.id}`);
    ids.add(asset.id);
    const candidates = [asset, ...(asset.variants ?? [])];
    const widths = new Set();
    for (const { path, width } of candidates) {
      if (!imagePath.test(path) || registered.has(path)) throw Error(`Invalid editorial path: ${asset.id}`);
      if (!Number.isInteger(width) || width < 1 || width > asset.width || widths.has(width)) {
        throw Error(`Invalid editorial image width: ${asset.id}`);
      }
      widths.add(width);
      registered.add(path);
    }
    const present = await Promise.all(candidates.map(({ path }) => optionalFile(resolve(root, `.${path}`))));
    if (!present.some(Boolean)) continue;
    if (asset.publication !== "approved" || asset.rights !== "cleared") throw Error(`Unapproved editorial asset in public assets: ${asset.id}`);
    if (asset.provenance === "certificate-derivative" &&
        (asset.redaction !== "visually-verified" || candidates.some(({ path }) => !/-redacted(?:-\d+)?\./.test(path)))) {
      throw Error(`Certificate requires verified redaction: ${asset.id}`);
    }
    if (!present[0] || present.some((file) => file && !file.isFile()) ||
        !asset.alt?.trim() || !Number.isInteger(asset.height) || asset.height < 1) {
      throw Error(`Invalid editorial asset: ${asset.id}`);
    }
    files.set(asset.id, { ...asset, variants: candidates.slice(1).filter((_, index) => present[index + 1]) });
  }
  for (const directory of editorialDirectories) {
    const relative = `/images/${directory}`;
    const path = join(root, relative);
    const folder = await optionalFile(path);
    if (!folder) continue;
    if (!folder.isDirectory()) throw Error(`Invalid editorial directory: ${relative}`);
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (!entry.isFile() || !registered.has(`${relative}/${entry.name}`)) {
        throw Error(`Unregistered editorial file: ${relative}/${entry.name}`);
      }
    }
  }
  return files;
}

export function validateEditorial(content, career, cases, principles, metrics) {
  const validId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  for (const items of [content.experience, career, cases, principles, metrics]) {
    const ids = new Set();
    for (const { id } of items) {
      if (!validId.test(id) || ids.has(id)) throw Error(`Invalid or duplicate editorial identifier: ${id}`);
      ids.add(id);
    }
  }
  const jobs = new Set(content.experience.map(({ id }) => id));
  const chapters = career.filter(({ job }) => job).map(({ job }) => job);
  if (chapters.length !== jobs.size || new Set(chapters).size !== jobs.size ||
      chapters.some((job) => !jobs.has(job))) throw Error("Career and employment sources disagree");
  for (const principle of principles) {
    if (!cases.some(({ id }) => id === principle.caseId)) throw Error(`Unknown case: ${principle.caseId}`);
  }
  for (const item of cases) {
    if (!item.principles.every((key) => principles.some(({ id }) => id === key))) throw Error(`Unknown principle in ${item.id}`);
  }
  for (const metric of metrics) {
    if (!cases.some(({ id }) => id === metric.project)) throw Error(`Unknown metric project: ${metric.id}`);
    const employer = content.experience.find(({ id }) => id === metric.employer);
    if (employer?.company !== metric.organization) throw Error(`Metric employer does not match career: ${metric.id}`);
    if (metric.publication !== "approved" &&
        [metric.value, metric.comparison, metric.scope, metric.baseline, metric.outcome,
          metric.attribution, metric.evidence, metric.clearance].some((value) => value != null)) {
      throw Error(`Pending metric details belong outside public content: ${metric.id}`);
    }
  }
  const current = content.experience.filter(({ duration }) => duration.endsWith("Present"));
  if (current.length !== 1 || !current[0].progression?.length ||
      current[0].progression.some(({ date, role }, index, progression) =>
        !role || !Number.isFinite(Date.parse(date)) ||
        (index > 0 && Date.parse(date) <= Date.parse(progression[index - 1].date)))) {
    throw Error("Expected one current job with ordered designation progression");
  }
  return current[0];
}
