import { escape as e } from "../../scripts/lib/content.mjs";
import { sectionIntro } from "./ui.mjs";

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1,
});

export function metricValue(metric) {
  const { unit, value, approximate, comparison } = metric;
  let display = `${value} ${unit}`;
  if (unit === "USD") display = dollars.format(value);
  if (unit === "%") display = `${value}%`;
  if (unit === "minutes") display = comparison ? `${comparison.before} → ${comparison.after} min` : `${value} min`;
  return approximate ? `≈${display}` : display;
}

function metricSource({ verification, sourceVerification }) {
  if (verification === "derived") {
    if (sourceVerification === "owner-reported") return "Calculated from owner-reported times";
    return sourceVerification === "independently-audited" ? "Calculated from independently audited times" : "Calculated from verified times";
  }
  if (verification === "independently-audited") return "Independently audited";
  return verification === "owner-reported" ? "Owner-reported" : "Evidence verified";
}

function attribution(metric) {
  return `<p class="metric-credit">${e(metric.attribution)} · ${e(metricSource(metric))}</p>`;
}

export function metricList(metrics) {
  if (!metrics.length) return "";
  return `<dl class="impact-metrics">${metrics.map((metric) => `<div>
    <dt>${e(metric.label)}</dt>
    <dd><strong>${e(metricValue(metric))}</strong><p>${e(metric.scope)}</p>${attribution(metric)}</dd>
  </div>`).join("")}</dl>`;
}

const features = [
  ["invoice-annual-business-benefit", "DP World", "Automated invoice processing", "Led delivery of OCR extraction and real-time posting.", "/experience/intelligent-invoice-processing", "Invoice processing case study"],
  ["nurtr-sales", "Nurtr", "Scaling a startup product", "Built and scaled the product alongside designers and engineers.", "/experience#chapter-nurtr", "Nurtr career chapter"],
];
const supporting = [
  ["invoice-processing-reduction", "DP World", "Less time per invoice"],
  ["shipment-operational-effort", "DP World", "Less coordination in shipment filing"],
  ["nurtr-global-reach", "Nurtr", "A global product audience"],
];

const invoiceArt = `<svg class="impact-art" aria-hidden="true" viewBox="0 0 340 140" fill="none">
  <g stroke="currentColor" stroke-width="1.4">
    <path d="M12 70h316M62 12v116m109-116v116m109-116v116" opacity=".35" stroke-dasharray="2 6"/>
    <path d="M40 29h33l16 16v65H40zM73 29v17h16M50 60h29m-29 11h29m-29 11h21"/>
    <rect x="144" y="40" width="55" height="61" rx="3"/><path d="M145 55h53m-53 15h53m-53 15h53m-35-30v45"/>
    <path d="M258 46h48v48h-48zM268 60h28m-28 10h28m-28 10h20"/>
    <path class="impact-art-accent" d="M100 70h32m-7-6 7 6-7 6m83-6h37m-7-6 7 6-7 6" stroke-width="2"/>
  </g>
</svg>`;

export function businessImpact(metrics) {
  const byId = new Map(metrics.map((metric) => [metric.id, metric]));
  const resource = byId.get("invoice-client-staffing");
  const hasFigures = resource || [...features, ...supporting].some(([id]) => byId.has(id));
  return `<section class="editorial-section business-impact" aria-labelledby="business-impact-title">
    ${sectionIntro(hasFigures ? "Engineering in numbers" : "Business outcomes", "Impact beyond the code.", "", "business-impact-title")}
    <div class="impact-features">${features.map(([id, organization, fallback, copy, href, link], index) => {
      const metric = byId.get(id);
      return `<article class="impact-feature">
        ${index === 0 ? invoiceArt : ""}
        <p class="eyebrow">${e(organization)}</p>
        ${metric ? `<h3 class="impact-display">${e(metricValue(metric))}</h3><p class="impact-label">${e(metric.label)}</p>` : `<h3>${e(fallback)}</h3>`}
        <p>${e(copy)}</p>${metric ? attribution(metric) : ""}
        <a class="text-link" href="${href}">${e(link)} <span aria-hidden="true">↗</span></a>
      </article>`;
    }).join("")}</div>
    <div class="impact-support">${supporting.map(([id, organization, fallback]) => {
      const metric = byId.get(id);
      return `<article><p class="eyebrow">${e(organization)}</p>
        ${metric ? `<h3 class="impact-display">${e(metricValue(metric))}</h3><p class="impact-label">${e(metric.label)}</p>${attribution(metric)}` : `<h3>${e(fallback)}</h3>`}
      </article>`;
    }).join("")}${resource ? `<article><p class="eyebrow">${e(resource.organization)}</p><h3 class="impact-display">${e(metricValue(resource))}</h3><p class="impact-label">${e(resource.label)}</p>${attribution(resource)}</article>` : ""}</div>
  </section>`;
}

export function invoiceComparison(metrics) {
  const time = metrics.find(({ id }) => id === "invoice-processing-time");
  if (!time?.comparison) return "";
  const { before, after } = time.comparison;
  return `<figure class="invoice-comparison">
    <figcaption>Time per invoice · Before and after</figcaption>
    <svg viewBox="0 0 200 38" preserveAspectRatio="none" aria-hidden="true">
      <rect width="200" height="14" rx="2" class="invoice-before"/>
      <rect y="24" width="${200 * after / before}" height="14" rx="2" class="invoice-after"/>
    </svg>
    <p>Before <strong>${e(before)} min</strong> · After <strong>${e(after)} min</strong></p>
    ${attribution(time)}
  </figure>`;
}

export function employmentImpact(metrics) {
  return metrics.map((metric) => `<li>${e(metric.label)} · <strong>${e(metricValue(metric))}</strong> · ${e(metric.attribution)} · ${e(metricSource(metric))}</li>`).join("");
}
