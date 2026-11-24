import { stat } from "node:fs/promises";
import { resolve } from "node:path";

export function publishedMetrics(metrics) {
  return metrics.filter((metric) => {
    if (metric.publication !== "approved") return false;
    const required = [metric.unit, metric.label, metric.scope, metric.baseline,
      metric.outcome, metric.attribution, metric.evidence];
    if (metric.verification !== "verified" || !Number.isFinite(metric.value) ||
        !required.every((value) => typeof value === "string" && value.trim())) {
      throw Error(`Incomplete public metric: ${metric.id}`);
    }
    return true;
  });
}

export async function availableAssets(assets, root = "public") {
  const files = new Map();
  for (const asset of assets) {
    if (!/^\/images\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(?:webp|avif|jpg|png)$/.test(asset.path)) {
      throw Error(`Invalid editorial path: ${asset.id}`);
    }
    let file;
    try {
      file = await stat(resolve(root, `.${asset.path}`));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      continue;
    }
    if (asset.publication !== "approved" || asset.rights !== "cleared") {
      throw Error(`Unapproved photo in public assets: ${asset.id}`);
    }
    if (!file.isFile() || !asset.alt?.trim() || !Number.isInteger(asset.width) || asset.width < 1 ||
        !Number.isInteger(asset.height) || asset.height < 1) {
      throw Error(`Invalid editorial asset: ${asset.id}`);
    }
    files.set(asset.id, asset);
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
