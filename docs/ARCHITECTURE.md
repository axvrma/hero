# Architecture

## Rendering

One pipeline: local content files → shared HTML renderer → Vite production assets → `dist/` → Netlify static hosting. Every route contains its complete content in the HTML response. Navigation uses ordinary links, without hydration, a client router, or an SPA catch-all.

`content/portfolio.json` is the editable source for profile, experience, skills, education, recognition and project overrides. `content/products.mjs` is the typed flagship registry. `content/legacy-projects.json` preserves the existing project documentation. No remote content fetch or generated-content snapshot is needed.

The source `index.html` is a document template. `scripts/generate.mjs` reads those local files and writes only `.generated/site` plus route/redirect manifests. Vite uses that generated directory as its root and resolves `/src` to browser source. The build plugin copies redirects, robots and sitemap into `dist/`. Source templates and content are never overwritten by a build. Identical inputs produce deterministic output.

## Components and interactions

`src/components/site.mjs` composes pages and shared sections. `visuals.mjs` contains the ecosystem and distinct product showcases. `src/main.js` handles theme preferences, mobile navigation, archive search and résumé printing. Native links and complete static content remain useful without JavaScript.

The mobile navigation is a nonmodal disclosure with announced expanded state, keyboard activation, first-link focus, Escape focus restoration, outside-click closing and desktop-breakpoint cleanup. Existing `theme` preferences survive navigation; blocked local storage still allows switching. Responsive styles include reduced-motion and print behavior.

## Data ownership

The flagship registry owns canonical identities, fixed live/source URLs, intended ordering and technical case-study evidence. Optional local project descriptions/tags can override those editorial fields by slug without changing flagship identity or order. New local project entries join the archive. Existing project documentation remains available for backlinks. See `docs/CONTENT.md` for editing details.

## Deployment and dependencies

The entire website is static. There are no CMS adapters, serverless API endpoints, administrative pages, Firebase imports, authentication flows, analytics or remote fonts. The former editor did not drive public portfolio content, so its local source/configuration and SDK were removed alongside the unused CMS and rebuild integration. No external service was modified.

`dotenv` loads the optional SITE_URL setting for local builds. `sanitize-html` sanitizes preserved case-study HTML at build time. Both are development/build dependencies. Browser code has no external runtime dependency. Remaining transitive overrides patch glob/minimatch in the Lighthouse development toolchain.

The production-artifact preview server serves directory indexes, exact legacy redirects, Netlify security headers and the real 404. It does not provide APIs. Netlify handles builds and publication through its standard Git/dashboard workflow.

## Assets

Geist and Geist Mono are self-hosted WOFF2 with their OFL notices. Atlas, Servio and Envision visuals are WebP versions of real product screenshots at 720/1440 widths. Vibes uses original CC0 demo artwork in a labeled illustrative player. Prism uses a labeled SVG branch-plan illustration. Images reserve layout space and load lazily below the fold. The social preview has an editable SVG source.
