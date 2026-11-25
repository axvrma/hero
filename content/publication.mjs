/**
 * Restricted values and evidence belong outside this public repository until approved.
 * @type {import('./types.js').ImpactMetric[]}
 */
export const impactMetrics = [
  ["invoice-processing-time", "Time per invoice", "minutes", "dp-world", "intelligent-invoice-processing"],
  ["invoice-processing-reduction", "Reduction in invoice processing time", "%", "dp-world", "intelligent-invoice-processing"],
  ["invoice-client-staffing", "Reduction in staffing requirements", "%", "dp-world", "intelligent-invoice-processing"],
  ["invoice-annual-business-benefit", "Annual cost savings", "USD", "dp-world", "intelligent-invoice-processing"],
  ["shipment-operational-effort", "Reduction in operational effort", "%", "dp-world", "dynamic-shipment-workflows"],
  ["nurtr-global-reach", "Global product reach", "countries", "nurtr", "bridging-design-and-engineering"],
  ["nurtr-sales", "Startup sales milestone", "USD", "nurtr", "bridging-design-and-engineering"],
].map(([id, label, unit, employer, project]) => ({
  id, label, unit, employer, project, organization: employer === "nurtr" ? "Nurtr" : "DP World",
  value: null, scope: null, baseline: null, outcome: null, attribution: null, evidence: null, clearance: null,
  verification: id === "invoice-processing-reduction" ? "derived" : "owner-reported",
  publication: "pending",
  ...(id === "invoice-processing-reduction" ? { derivedFrom: "invoice-processing-time" } : {}),
  ...(id === "invoice-annual-business-benefit" || id === "invoice-client-staffing" ? { approximate: true } : {}),
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
    alt: "Abhishek accepting a certificate at the DP World awards ceremony", caption: "DP World · Kudos Award · 2023",
    focalPoint: "center", attribution: null, provenance: "owner-supplied-photo", ownerApproval: "granted", publication: "pending", rights: "pending",
  },
  {
    id: "iit-guwahati-certificate", path: "/images/recognition/iit-guwahati-ai-ml-2026-redacted.webp", width: 1684, height: 1191,
    variants: variants("recognition/iit-guwahati-ai-ml-2026-redacted", [480, 800]),
    alt: "Redacted certificate of completion from Electronics & ICT Academy, IIT Guwahati, and Emeritus",
    caption: "PG Certification in Artificial Intelligence and Machine Learning · 2026", focalPoint: "center", attribution: null,
    provenance: "certificate-derivative", redaction: "visually-verified", ownerApproval: "granted", publication: "approved", rights: "cleared",
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
  employerLogo("dp-world", "DP World", 187, 116),
  employerLogo("airtel", "Airtel Africa", 115, 116, "airtel-africa"),
  employerLogo("iris", "IRIS Worldwide", 91, 84),
  employerLogo("nurtr", "Nurtr", 240, 42),
];

/** @returns {import('./types.js').EditorialAsset} @param {string} id @param {string} name @param {number} width @param {number} height @param {string} [filename] */
function employerLogo(id, name, width, height, filename = id) {
  return {
    id: `logo-${id}`, path: `/images/brands/${filename}.webp`, width, height, alt: name, caption: null,
    focalPoint: "center", attribution: null, provenance: "owner-supplied-logo", ownerApproval: "granted",
    publication: "pending", rights: "pending",
  };
}

/** @param {string} stem @param {number[]} widths */
function variants(stem, widths) {
  return widths.map((width) => ({ path: `/images/${stem}-${width}.webp`, width }));
}
