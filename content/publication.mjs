/**
 * Restricted values and evidence belong outside this public repository until approved.
 * @type {import('./types.js').ImpactMetric[]}
 */
export const impactMetrics = [
  ["invoice-processing-time", "intelligent-invoice-processing"],
  ["invoice-processing-reduction", "intelligent-invoice-processing"],
  ["invoice-client-staffing", "intelligent-invoice-processing"],
  ["invoice-annual-business-benefit", "intelligent-invoice-processing"],
  ["shipment-operational-effort", "dynamic-shipment-workflows"],
  ["nurtr-global-reach", "bridging-design-and-engineering"],
  ["nurtr-sales", "bridging-design-and-engineering"],
].map(([id, project]) => ({
  id, project, value: null, unit: null, label: null, scope: null, baseline: null,
  outcome: null, attribution: null, verification: "pending", publication: "pending", evidence: null,
}));

/** @type {import('./types.js').EditorialAsset[]} */
export const editorialAssets = [
  ["professional-portrait", "/images/portraits/abhishek-professional.webp", 1200, 1500],
  ["casual-portrait", "/images/portraits/abhishek-casual.webp", 1440, 1080],
  ["dp-world-office", "/images/journey/dp-world-office.webp", 1600, 1000],
  ["paytm-hackathon-photo", "/images/recognition/paytm-hackathon.webp", 1440, 1080],
  ["recognition-certificate", "/images/recognition/award-certificate.webp", 1440, 1080],
  ["workshop-hardware", "/images/workshop/workbench.webp", 1440, 1080],
].map(([id, path, width, height]) => ({
  id: String(id), path: String(path), width: Number(width), height: Number(height),
  alt: null, caption: null, focalPoint: "center", attribution: null, publication: "pending", rights: "pending",
}));
