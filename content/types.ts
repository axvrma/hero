export type CaseSection = { title: string; body: string };
export type HackathonProject = {
  id: string;
  name: string;
  description: string;
  story: string;
  result: string;
  event?: string;
  buildTime?: string;
  supporting?: boolean;
  live?: string;
  source: string;
  preview: {
    src: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
  };
};
export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  tagline: string;
  live: string;
  liveLabel?: string;
  source: string;
  stack: string[];
  features: string[];
  architecture: string[];
  sections: CaseSection[];
  limitations: string;
  evidence: string[];
  legacy: string[];
};

export type CareerChapter = {
  id: string;
  period?: string;
  job?: string;
  place?: string;
  headline: string;
  theme: string;
  summary: string;
};
export type EnterpriseCase = {
  id: string;
  title: string;
  organization: string;
  summary: string;
  context: string;
  problem: string;
  role: string;
  team: string;
  constraints: string;
  approach: string;
  decisions: string;
  tradeoffs: string;
  outcome: string;
  lesson: string;
  principles: string[];
  illustration?: { steps: string[]; caption: string };
  example?: "shipment" | "regions" | "life";
};
export type ImpactMetric = {
  id: string;
  value: number | null;
  unit: string | null;
  label: string | null;
  project: string;
  scope: string | null;
  baseline: string | null;
  outcome: string | null;
  attribution: string | null;
  verification: "pending" | "verified";
  publication: "pending" | "approved";
  evidence: string | null;
};
export type EditorialAsset = {
  id: string;
  path: string;
  alt: string | null;
  caption: string | null;
  width: number;
  height: number;
  focalPoint: "center" | "top" | "left" | "right";
  attribution: string | null;
  publication: "pending" | "approved";
  rights: "pending" | "cleared";
};
export type ProductMotivation = {
  headline: string;
  story: string;
  signal: string;
  comparison?: { before: string; after: string };
};
