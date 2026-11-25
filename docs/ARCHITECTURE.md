# Architecture

Repository content flows through `scripts/generate.mjs` and shared renderers into complete HTML under `.generated/site`. Vite 8 bundles CSS and browser modules, copies public assets, and writes deployable files to `dist`. All public navigation uses normal links and directory indexes. The generator also writes the route manifest, exact redirects, robots metadata and sitemap. Both output directories are disposable.

## Content and rendering

- `content/portfolio.json` owns public profile information, employment, progression, education, recognition, and optional legacy editorial overrides. The education record supplies the homepage, education sections, printable résumé and profile structured data. The generator derives the current title from the last entry in the current job’s progression.
- `content/editorial.mjs` defines career chapters linked to employment IDs, story chapters, influences, principles, motivations and Lab experiments. `content/enterprise.mjs` owns six detailed professional cases.
- `content/publication.mjs` contains the metric approval register and editorial photography manifest. Build-time helpers validate keys and references, filter metrics and admit approved photo originals and responsive variants. Reserved editorial directories reject unregistered files, and a certificate entry requires verified redaction.
- `content/products.mjs`, `content/legacy-projects.json`, `content/archive-overrides.json` and `content/hackathons.mjs` preserve product identities, destinations, evidence, and original archive bodies.
- `src/components/site.mjs` composes primary pages and product detail templates. `homepage.mjs` renders the organisation marquee, milestones and compact product archive. `editorial.mjs` renders career, story, enterprise cases, impact, principles and the shared responsive photography markup. `ui.mjs` provides introductions, breadcrumbs and safe external links. `visuals.mjs` and `editorial-art.mjs` provide static art.

## Browser behavior

The common module enhances theme switching, the mobile navigation disclosure, archive search, printing and marquee pause or resume. CSS owns the marquee animation. Its static list and photo destinations live in the generated HTML. Story and enterprise demos import their shared browser module when the corresponding disclosure opens. The photograph dialog imports only on pages containing approved expandable images. It loads the full-size derivative when opened. Text summaries, native details and links work without that code. The source includes no client framework, CMS integration, API handler, analytics integration, or runtime content request.

Theme preference is stored locally. Calculators and demo fields use in-memory browser state. The Netlify artifact preview applies repository headers and serves the generated redirects and real 404 to support browser tests.

## Deployment configuration

Node.js 24 and Vite 8 are pinned by the repository setup and lockfile. Build tooling uses `sanitize-html` for legacy bodies and `dotenv` for optional local origin configuration. Production’s canonical origin comes from its `SITE_URL` setting. A preview build uses Netlify’s preview URL and emits noindex and robots restrictions. Equivalent input content, assets and environment produce reproducible build output.
