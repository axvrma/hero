# Architecture

Node.js generates static HTML from structured repository content. Vite compiles three flat page files and the separate 404. Flat files let Netlify serve the Work and About canonical URLs without a directory redirect. Netlify serves the production artifact in `dist` with the headers and static redirects configured in the repository.

- `content/portfolio.json` owns the profile, jobs, credential details and recognition. The current role derives from the last entry of the current job's ordered progression.
- `content/enterprise.mjs`, `products.mjs` and `hackathons.mjs` own professional cases, flagship technical evidence and hackathon records. `content/editorial.mjs` carries career chapters, principles, motivations, influences and workshop copy.
- `content/publication.mjs` records approved image derivatives and public metric statuses. Build validators check rights, reviewed redaction, career references and evidence requirements. Preserved archive HTML passes through an allowlist sanitizer.
- `src/components/` renders the page shells, disclosures, responsive photography and SVG artwork at build time. Titles, descriptions, canonicals, Open Graph and structured data live in the HTML response.
- `src/style.css` owns the layout and motion. The browser module observes scene visibility, manages marquee and assembly controls, opens directly linked details, and attaches the print action. Four enhanced demos and the image dialog load their modules on demand. The retro desktop uses native disclosures.
- `scripts/check-output.mjs` checks the exact HTML output, canonical metadata, links, image references, unique identifiers and redirect destinations. `scripts/preview.mjs` serves the production files locally with the repository's Netlify security headers.

Content, diagrams, contact links and disclosures remain available without JavaScript. The three pages share CSS and a small browser entry module. Vite fingerprints the bundled resources. The figures use inline SVG with CSS and require no graphics runtime.
