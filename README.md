# Abhishek Verma

Abhishek Verma’s engineering portfolio and entry point to Atlas, Vibes, Envision, Servio, and Prism. Built as complete static HTML pages with Vite 8, vanilla JavaScript, self-hosted fonts, and a build-time Notion CMS. No frontend framework or public application server is needed.

## Develop

Use Node **24** (the host’s Node 18 default is unsupported).

```sh
nvm use
npm ci
npm run dev
```

Open the URL Vite prints, normally `http://127.0.0.1:5173`. All content is generated before development starts. After content/template changes run `npm run generate` again; CSS and browser scripts use Vite HMR. No credentials are needed for local development: a committed snapshot preserves the existing Notion experience, skills, and education.

```sh
npm run verify          # Typed product registry, unit/security tests, production build + link/route checks
npx playwright install chromium
npm run test:e2e        # Production artifact: navigation, accessibility, themes, viewports, redirects
npm run preview        # Exact static artifact + Netlify headers/legacy redirects, port 4173
# In another terminal, while preview runs:
AUDIT_URL=http://127.0.0.1:4173/ npm run lighthouse
```

`npm run build` produces `dist/`: 24 public pages (including 17 case studies), a real 404, the legacy admin/rebuild pages, assets, 36 exact legacy redirects, robots and sitemap. The public browser module is under 2 KB minified before gzip; Firebase is isolated to the legacy admin bundle. The archive retains twelve additional projects, including the separate Web XR and Reels work.

## Content and architecture

- [`content/products.mjs`](content/products.mjs): typed flagship registry, fixed URLs/order, evidence, case studies and legacy identity mappings.
- [`content/fallback.json`](content/fallback.json): last existing Notion-generated experience/skills/education plus the requested new profile copy.
- [`content/legacy-projects.json`](content/legacy-projects.json): preserved case-study bodies; sanitized at build time.
- [`scripts/build-notion.mjs`](scripts/build-notion.mjs): paginated, read-only Notion acquisition into `.generated/content.json`.
- [`scripts/generate.mjs`](scripts/generate.mjs): one renderer for all pages, metadata and migration rules.
- [`src/components`](src/components): shared page layouts, sections, product visuals, ecosystem and icons.
- [`src/style.css`](src/style.css): semantic dark/light tokens, responsive layouts, reduced-motion and print styles.
- [`index.html`](index.html): shared source document, never overwritten by a build.
- `.generated/`: disposable build inputs, intentionally ignored.

Original root HTML/templates have been moved into `content/legacy/` for preservation. They are not served or used as another generator. The competing GitHub SSG and obsolete toggle-migration script have been removed.

See [architecture](docs/ARCHITECTURE.md), [Notion schemas and editorial workflow](docs/CONTENT.md), [security and admin responsibilities](docs/SECURITY.md), [migration map](docs/ROUTES.md), and [verification](docs/VERIFICATION.md).

## Netlify deployment

No deployment has been performed.

1. Connect this repository to the intended Netlify site. Use Node 24, build command `npm run build`, publish directory `dist`, and the checked-in `netlify.toml`.
2. Set **`SITE_URL` to the verified portfolio origin**. `axvrma.com` returned HTTP 403 during this audit; it is not assumed. Netlify’s production `URL` is the fallback. Deploy previews use `DEPLOY_PRIME_URL` and carry `noindex`.
3. To fetch current CMS content, set server/build-only `NOTION_API_KEY` and share all five mapped databases with that integration. Without the key, the build uses the committed snapshot. A configured integration failure stops the build unless `NOTION_ALLOW_FALLBACK=true` is explicitly set.
4. Optional administrative endpoints require a random `API_SECRET` of at least 32 characters, exact `ADMIN_ORIGIN`, and a server-only `NETLIFY_BUILD_HOOK`. See [.env.example](.env.example). Do not prefix secrets with `VITE_`.
5. Review a deploy preview: verify `/work/atlas`, `/about`, a secondary case study, `/project-vox-ar.html` → `/work/envision`, `/project-azure-devops-pr-helper.html` → `/work/prism`, and a missing path’s 404. Publish through the normal authorized Netlify workflow.
6. Before using the retained Firestore editor, apply [`firestore.rules`](firestore.rules) to the existing Firebase project and grant the intended account a `portfolio_admin: true` custom claim using a trusted Admin SDK environment. This is a separate, explicit infrastructure action; checked-in rules do not change deployed Firebase rules.

The supplied Servio URL is retained exactly; its TLS certificate had a hostname mismatch when checked. Other four product URLs returned HTTP 200. Fix Servio’s DNS/certificate in its own hosting configuration. External application availability is independent of this portfolio.
