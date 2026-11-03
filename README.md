# Abhishek Verma

An engineering portfolio and entry point to Atlas, Vibes, Envision, Servio, and Prism. Built with Vite 8, vanilla JavaScript, complete static HTML pages, and repository-managed content.

**No API keys, CMS account, database, backend, or authentication setup is required.**

## Develop

Use Node **24**:

```sh
nvm use
npm ci
npm run dev
```

Open the URL Vite prints, normally `http://127.0.0.1:5173`. Generation runs automatically before development and production builds. After editing content or templates, run `npm run generate` to refresh the pages; CSS and browser scripts use Vite HMR.

## Edit content

- [`content/portfolio.json`](content/portfolio.json): name, profile copy, contact links, experience, skills, education, recognition, and optional project editorial overrides.
- [`content/products.mjs`](content/products.mjs): typed flagship registry, case studies, fixed URLs, ordering, and legacy identity mappings.
- [`content/legacy-projects.json`](content/legacy-projects.json): the twelve secondary projects and preserved original case-study bodies.
- [`content/archive-overrides.json`](content/archive-overrides.json): suppression of a verified retired demo URL.

Edit the files, review the changes, and rebuild. The local content is the source of truth. See [content editing](docs/CONTENT.md) and [architecture](docs/ARCHITECTURE.md).

## Verify and preview

```sh
npm run verify          # Typed registry, content/security tests, build, route/link checks
npx playwright install chromium
npm run test:e2e        # Production-artifact browser and accessibility checks
npm run preview        # Static artifact, Netlify headers and legacy redirects; port 4173
# While preview runs, in another terminal:
AUDIT_URL=http://127.0.0.1:4173/ npm run lighthouse
```

The build produces `dist/` with **24 public pages**, seventeen case studies (five flagships and twelve additional projects), a 404 page, assets, **36 exact legacy redirects**, robots and sitemap. It does not generate administrative pages or API functions. All sixteen original case studies are preserved; four map to current flagships and Atlas is the additional flagship.

Shared rendering lives in [`src/components`](src/components). [`index.html`](index.html) is the shared source document; [`scripts/generate.mjs`](scripts/generate.mjs) writes disposable inputs under `.generated/`, and Vite bundles them into `dist/`. The public browser code handles theme preferences, mobile navigation, archive search and résumé printing.

## Netlify deployment

1. Connect the repository to the intended Netlify site.
2. Use **Node 24**, build command **`npm run build`**, and publish directory **`dist`**, as configured in `netlify.toml`.
3. Optionally set **`SITE_URL` to the verified portfolio origin** for canonical URLs and sitemap entries. Netlify supplies its production `URL` automatically; previews use `DEPLOY_PRIME_URL` with `noindex`. Local development needs no environment file. See [.env.example](.env.example).
4. Review the preview’s homepage, case studies, legacy redirects and missing-path 404 before publishing through the normal authorized workflow.

Updates publish through a normal Git-triggered Netlify build or Netlify’s dashboard. There is no in-site rebuild action. The unused CMS integration, rebuild endpoints, disconnected Firestore editor and their credentials/configuration have been removed locally. No remote service or stored record was changed, and no deployment has been performed.

[Route mappings](docs/ROUTES.md) · [Security](docs/SECURITY.md) · [Verification](docs/VERIFICATION.md)

The supplied Servio URL remains unchanged; its certificate had a hostname mismatch during the original audit. The old Web XR demo returned 404, so its launch action is suppressed while its case study and repository remain available.
