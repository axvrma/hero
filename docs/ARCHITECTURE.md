# Portfolio architecture

The build combines the profile, career, projects, publication manifest and [homepage editorial content](../content/personal-folio.mjs) into static HTML. [The generator](../scripts/generate.mjs) supplies shared metadata, the sitemap and legacy redirects. Vite bundles CSS and browser enhancements. The result runs on Netlify with no backend.

- `/` contains the homepage and its four navigation destinations.
- `/work` uses a reusable enterprise case template, followed by independent products, experiments and archived projects.
- `/about` contains the personal story, career details, education, certificate and printable résumé.
- `src/main.js` adds progress reveals, mobile navigation, dialogs, the carousel, demo mounting and the motion control. Core links, summaries and disclosures are in the generated HTML.
- Reviewed local and Netlify deploy-preview builds can include labeled article drafts and fictional sample testimonials. Production builds filter both at generation. Existing factual and asset publication checks run before rendering.
