export type CaseSection = { title: string; body: string };
export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  tagline: string;
  live: string;
  source: string;
  stack: string[];
  features: string[];
  architecture: string[];
  sections: CaseSection[];
  limitations: string;
  evidence: string[];
  legacy: string[];
};
