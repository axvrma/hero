import { escape as e } from "../../scripts/lib/content.mjs";

function imageSources(asset) {
  return asset.variants?.length
    ? [...asset.variants, asset].map(({ path, width }) => `${e(path)} ${width}w`).join(", ")
    : "";
}

export function photoImage(asset, { priority = false, expandable = false, sizes = "90vw", decorative = false } = {}) {
  const sources = imageSources(asset);
  const responsive = sources ? ` srcset="${sources}" sizes="${e(sizes)}"` : "";
  const image = `<img class="asset-focus-${e(asset.focalPoint)}" src="${e(asset.path)}"${responsive} alt="${decorative ? "" : e(asset.alt)}" width="${asset.width}" height="${asset.height}"${priority ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
  return expandable ? `<a data-photo href="${e(asset.path)}" aria-label="${asset.provenance === "certificate-derivative" ? "Expand certificate" : `Expand photo: ${e(asset.alt)}`}">${image}<span class="photo-expand" aria-hidden="true">↗</span></a>` : image;
}

export function companyLogo(assets, id) {
  const asset = assets.get(`logo-${id}`);
  return asset ? `<span class="company-logo">${photoImage(asset, { decorative: true })}</span>` : "";
}

export function photography(assets, id, options) {
  const asset = assets.get(id);
  if (!asset) return "";
  const credit = [asset.caption, asset.attribution].filter(Boolean).map(e).join(" · ");
  return `<figure class="editorial-photo${asset.provenance === "certificate-derivative" ? " certificate-photo" : ""}">${photoImage(asset, options)}${credit ? `<figcaption>${credit}</figcaption>` : ""}</figure>`;
}

