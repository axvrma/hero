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
  {
    id: "professional-portrait", path: "/images/portraits/hero-portrait.webp", width: 1080, height: 1440,
    variants: variants("portraits/hero-portrait", [480, 640, 768]),
    alt: "Abhishek Verma in glasses and a dark sweater", caption: "AI-assisted portrait",
    focalPoint: "top", attribution: null, provenance: "ai-assisted-portrait", publication: "approved", rights: "cleared",
  },
  {
    id: "casual-portrait", path: "/images/portraits/portrait-casual.webp", width: 768, height: 1024,
    variants: variants("portraits/portrait-casual", [480]),
    alt: "Abhishek outdoors in glasses and a brown and cream pullover", caption: "An afternoon away from the keyboard",
    focalPoint: "center", attribution: null, provenance: "owner-supplied-photo", publication: "approved", rights: "cleared",
  },
  {
    id: "san-francisco-portrait", path: "/images/portraits/portrait-san-francisco.webp", width: 420, height: 420,
    alt: "Abhishek in a red hoodie in front of the Golden Gate Bridge", caption: "Golden Gate Bridge, San Francisco",
    focalPoint: "center", attribution: null, provenance: "owner-supplied-photo", publication: "approved", rights: "cleared",
  },
  {
    id: "google-assistant-2018", path: "/images/recognition/google-assistant-2018.webp", width: 1320, height: 1181,
    variants: variants("recognition/google-assistant-2018", [480, 768]),
    alt: "Abhishek holding his Google Assistant developer recognition letter", caption: "Google Assistant developer recognition · 2018",
    focalPoint: "center", attribution: null, provenance: "owner-supplied-photo", publication: "approved", rights: "cleared",
  },
  {
    id: "dp-world-kudos-2023", path: "/images/recognition/dp-world-kudos-2023.webp", width: 1320, height: 875,
    variants: variants("recognition/dp-world-kudos-2023", [640, 960]),
    alt: "Abhishek accepting a certificate at the DP World awards ceremony", caption: "Kudos Award · 2023",
    focalPoint: "center", attribution: null, provenance: "owner-supplied-photo", publication: "pending", rights: "pending",
  },
  {
    id: "iit-guwahati-certificate", path: "/images/recognition/iit-guwahati-ai-ml-2026-redacted.webp", width: 1684, height: 1191,
    variants: variants("recognition/iit-guwahati-ai-ml-2026-redacted", [480, 800]),
    alt: "Redacted certificate of completion from Electronics & ICT Academy, IIT Guwahati, and Emeritus",
    caption: "Postgraduate certification in AI & ML · 2026", focalPoint: "center", attribution: null,
    provenance: "certificate-derivative", redaction: "visually-verified", publication: "pending", rights: "pending",
  },
  {
    id: "workshop-hardware", path: "/images/workshop/homelab.webp", width: 1080, height: 1440,
    variants: variants("workshop/homelab", [480, 768]),
    alt: "Abhishek’s sticker-covered laptop on a round table", caption: "The laptop behind many of my experiments",
    focalPoint: "center", attribution: null, provenance: "owner-supplied-photo", publication: "approved", rights: "cleared",
  },
  {
    id: "dp-world-office", path: "/images/journey/dp-world-office.webp", width: 1600, height: 1000,
    alt: null, caption: null, focalPoint: "center", attribution: null,
    provenance: "owner-supplied-photo", publication: "pending", rights: "pending",
  },
  {
    id: "paytm-hackathon-photo", path: "/images/recognition/paytm-hackathon.webp", width: 1440, height: 1080,
    alt: null, caption: null, focalPoint: "center", attribution: null,
    provenance: "owner-supplied-photo", publication: "pending", rights: "pending",
  },
];

/** @param {string} stem @param {number[]} widths */
function variants(stem, widths) {
  return widths.map((width) => ({ path: `/images/${stem}-${width}.webp`, width }));
}
