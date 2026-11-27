import { escape as e } from "../../scripts/lib/content.mjs";

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
