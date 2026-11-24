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
